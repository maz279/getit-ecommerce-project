import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Wifi, WifiOff, Download, CheckCircle } from 'lucide-react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdating: boolean;
  hasUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const ServiceWorkerManager: React.FC = () => {
  const [swState, setSwState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isUpdating: false,
    hasUpdate: false,
    registration: null
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setSwState(prev => ({ ...prev, isSupported: true }));
      registerServiceWorker();
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      setSwState(prev => ({
        ...prev,
        isRegistered: true,
        registration
      }));

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setSwState(prev => ({ ...prev, hasUpdate: true }));
              toast({
                title: "App Update Available",
                description: "A new version of the app is ready to install.",
                action: <Button size="sm" onClick={updateServiceWorker}>Update</Button>
              });
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type) {
          handleServiceWorkerMessage(event.data);
        }
      });

      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      toast({
        title: "Service Worker Error",
        description: "Failed to register service worker",
        variant: "destructive"
      });
    }
  };

  const handleServiceWorkerMessage = (message: any) => {
    switch (message.type) {
      case 'CACHE_UPDATED':
        toast({
          title: "Cache Updated",
          description: "App data has been cached for offline use"
        });
        break;
      case 'OFFLINE_READY':
        toast({
          title: "Offline Ready",
          description: "App is now available offline"
        });
        break;
      case 'NEW_CONTENT_AVAILABLE':
        setSwState(prev => ({ ...prev, hasUpdate: true }));
        break;
    }
  };

  const updateServiceWorker = async () => {
    if (swState.registration) {
      setSwState(prev => ({ ...prev, isUpdating: true }));
      
      try {
        // Tell the waiting service worker to skip waiting and become active
        if (swState.registration.waiting) {
          swState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Reload the page to get the new version
        window.location.reload();
      } catch (error) {
        console.error('Service Worker update failed:', error);
        setSwState(prev => ({ ...prev, isUpdating: false }));
      }
    }
  };

  const forceUpdate = async () => {
    if (swState.registration) {
      setSwState(prev => ({ ...prev, isUpdating: true }));
      
      try {
        await swState.registration.update();
        toast({
          title: "Checking for Updates",
          description: "Looking for the latest version..."
        });
      } catch (error) {
        console.error('Force update failed:', error);
        toast({
          title: "Update Check Failed",
          description: "Could not check for updates",
          variant: "destructive"
        });
      } finally {
        setSwState(prev => ({ ...prev, isUpdating: false }));
      }
    }
  };

  const clearCache = async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      
      toast({
        title: "Cache Cleared",
        description: "All cached data has been removed"
      });
      
      // Reload to fetch fresh content
      window.location.reload();
    } catch (error) {
      console.error('Cache clear failed:', error);
      toast({
        title: "Cache Clear Failed",
        description: "Could not clear cache",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">App Management</h2>
        <p className="text-muted-foreground">Manage offline functionality and app updates</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {isOnline 
                  ? "You're connected to the internet" 
                  : "You're offline. Some features may be limited."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Worker Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Service Worker Status
          </CardTitle>
          <CardDescription>
            Service workers enable offline functionality and background sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={swState.isSupported ? "default" : "destructive"}>
                  {swState.isSupported ? "Supported" : "Not Supported"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Browser Support</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={swState.isRegistered ? "default" : "secondary"}>
                  {swState.isRegistered ? "Registered" : "Not Registered"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Registration Status</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {swState.hasUpdate ? (
                  <Badge variant="destructive">Update Available</Badge>
                ) : (
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Up to Date
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Update Status</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {swState.hasUpdate && (
              <Button onClick={updateServiceWorker} disabled={swState.isUpdating}>
                {swState.isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update App'
                )}
              </Button>
            )}
            
            <Button variant="outline" onClick={forceUpdate} disabled={swState.isUpdating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check for Updates
            </Button>
            
            <Button variant="outline" onClick={clearCache}>
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PWA Features */}
      <Card>
        <CardHeader>
          <CardTitle>Progressive Web App Features</CardTitle>
          <CardDescription>
            Enhanced functionality for mobile and desktop users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Offline Support</h4>
              <p className="text-sm text-muted-foreground">
                Browse products and view cached content when offline
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Background Sync</h4>
              <p className="text-sm text-muted-foreground">
                Actions sync automatically when connection is restored
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Get notified about order updates and promotions
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">App-like Experience</h4>
              <p className="text-sm text-muted-foreground">
                Install on your device for native app feel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};