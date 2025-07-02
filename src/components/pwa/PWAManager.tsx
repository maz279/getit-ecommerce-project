import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface OfflineAction {
  id: string;
  action_type: string;
  resource_type: string;
  sync_status: string;
  created_at: string;
  error_message?: string;
}

export const PWAManager: React.FC = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      if (user) {
        syncOfflineActions();
      }
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Load offline actions if user is logged in
    if (user) {
      loadOfflineActions();
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [user]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const installPWA = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    console.log('PWA installation result:', result);

    if (result.outcome === 'accepted') {
      setIsInstallable(false);
      setInstallPrompt(null);

      // Track installation
      if (user) {
        await supabase.from('pwa_installations').insert({
          user_id: user.id,
          device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          platform: navigator.platform,
          browser: navigator.userAgent.split(' ').pop() || 'unknown',
          installation_source: 'banner'
        });
      }
    }
  };

  const loadOfflineActions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('offline_sync_queue')
        .select('*')
        .eq('user_id', user.id)
        .neq('sync_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOfflineActions(data || []);
    } catch (error) {
      console.error('Failed to load offline actions:', error);
    }
  };

  const syncOfflineActions = async () => {
    if (!user || !isOnline) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      const { data, error } = await supabase.functions.invoke('pwa-sync-manager', {
        body: {
          action: 'process',
          user_id: user.id
        }
      });

      if (error) throw error;

      const results = data.results || [];
      const successCount = results.filter((r: any) => r.success).length;
      setSyncProgress((successCount / results.length) * 100);

      // Reload offline actions to reflect changes
      await loadOfflineActions();

    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const queueOfflineAction = async (action: {
    action_type: 'create' | 'update' | 'delete';
    resource_type: 'cart' | 'wishlist' | 'order';
    resource_id?: string;
    data: any;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('pwa-sync-manager', {
        body: {
          action: 'queue',
          user_id: user.id,
          actions: [action]
        }
      });

      if (error) throw error;
      await loadOfflineActions();
      
      return data;
    } catch (error) {
      console.error('Failed to queue action:', error);
      throw error;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* PWA Installation Banner */}
      {isInstallable && (
        <Card className="border-primary">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Install App</h3>
                <p className="text-sm text-muted-foreground">
                  Install our app for a better experience and offline access
                </p>
              </div>
            </div>
            <Button onClick={installPWA}>Install</Button>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <span>Connection Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'All features available' : 'Limited functionality - changes will sync when online'}
              </p>
            </div>
            
            {!isOnline && offlineActions.length > 0 && (
              <Badge variant="secondary">
                {offlineActions.length} pending sync{offlineActions.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {isOnline && offlineActions.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sync Progress</span>
                <Button 
                  size="sm" 
                  onClick={syncOfflineActions}
                  disabled={isSyncing}
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
              {isSyncing && <Progress value={syncProgress} className="w-full" />}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Actions Queue */}
      {offlineActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offlineActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(action.sync_status)}
                    <div>
                      <p className="font-medium capitalize">
                        {action.action_type} {action.resource_type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(action.created_at).toLocaleDateString()}
                      </p>
                      {action.error_message && (
                        <p className="text-sm text-red-600">{action.error_message}</p>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(action.sync_status)}>
                    {action.sync_status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Hook for using PWA Manager in other components
export const usePWAManager = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueOfflineAction = async (action: {
    action_type: 'create' | 'update' | 'delete';
    resource_type: 'cart' | 'wishlist' | 'order';
    resource_id?: string;
    data: any;
  }) => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { data, error } = await supabase.functions.invoke('pwa-sync-manager', {
        body: {
          action: 'queue',
          user_id: user.id,
          actions: [action]
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to queue offline action:', error);
      throw error;
    }
  };

  return {
    isOnline,
    queueOfflineAction
  };
};