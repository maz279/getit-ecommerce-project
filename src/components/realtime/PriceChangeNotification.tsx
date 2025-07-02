import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PriceChangeNotificationProps {
  productId: string;
  currentPrice: number;
  className?: string;
}

interface PriceAlert {
  id: string;
  targetPrice: number;
  alertType: 'below' | 'above' | 'exact';
  isActive: boolean;
}

interface PriceChange {
  oldPrice: number;
  newPrice: number;
  changePercentage: number;
  timestamp: string;
}

export const PriceChangeNotification: React.FC<PriceChangeNotificationProps> = ({
  productId,
  currentPrice,
  className = ''
}) => {
  const [priceAlert, setPriceAlert] = useState<PriceAlert | null>(null);
  const [recentPriceChange, setRecentPriceChange] = useState<PriceChange | null>(null);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [alertType, setAlertType] = useState<'below' | 'above' | 'exact'>('below');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  useEffect(() => {
    loadExistingAlert();
    loadRecentPriceChange();
    
    // Subscribe to price changes
    const priceChannel = supabase
      .channel(`price-changes-${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'price_change_history',
          filter: `product_id=eq.${productId}`
        },
        (payload) => {
          const change = payload.new;
          setRecentPriceChange({
            oldPrice: change.old_price,
            newPrice: change.new_price,
            changePercentage: change.change_percentage,
            timestamp: change.created_at
          });
          
          // Show notification for price changes
          const isIncrease = change.new_price > change.old_price;
          toast(
            `Price ${isIncrease ? 'increased' : 'decreased'}!`,
            {
              description: `From ৳${change.old_price} to ৳${change.new_price} (${change.change_percentage > 0 ? '+' : ''}${change.change_percentage.toFixed(1)}%)`,
              icon: isIncrease ? '📈' : '📉'
            }
          );
        }
      )
      .subscribe();

    return () => {
      priceChannel.unsubscribe();
    };
  }, [productId]);

  const loadExistingAlert = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPriceAlert({
          id: data.id,
          targetPrice: data.target_price,
          alertType: data.alert_type as 'below' | 'above' | 'exact',
          isActive: data.is_active
        });
      }
    } catch (error) {
      console.error('Error loading price alert:', error);
    }
  };

  const loadRecentPriceChange = async () => {
    try {
      const { data, error } = await supabase
        .from('price_change_history')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setRecentPriceChange({
          oldPrice: data.old_price,
          newPrice: data.new_price,
          changePercentage: data.change_percentage,
          timestamp: data.created_at
        });
      }
    } catch (error) {
      console.error('Error loading recent price change:', error);
    }
  };

  const createPriceAlert = async () => {
    try {
      setIsCreatingAlert(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create price alerts');
        return;
      }

      const response = await supabase.functions.invoke('price-monitor', {
        body: {
          action: 'create_alert',
          productId,
          targetPrice: parseFloat(targetPrice),
          alertType
        }
      });

      if (response.error) throw response.error;

      setPriceAlert({
        id: response.data.alert.id,
        targetPrice: parseFloat(targetPrice),
        alertType,
        isActive: true
      });

      setTargetPrice('');
      toast.success('Price alert created successfully!');
    } catch (error) {
      console.error('Error creating price alert:', error);
      toast.error('Failed to create price alert');
    } finally {
      setIsCreatingAlert(false);
    }
  };

  const removePriceAlert = async () => {
    try {
      if (!priceAlert) return;

      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: false })
        .eq('id', priceAlert.id);

      if (error) throw error;

      setPriceAlert(null);
      toast.success('Price alert removed');
    } catch (error) {
      console.error('Error removing price alert:', error);
      toast.error('Failed to remove price alert');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getPriceChangeIcon = (changePercentage: number) => {
    if (changePercentage > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (changePercentage < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getPriceChangeColor = (changePercentage: number) => {
    if (changePercentage > 0) return 'text-green-600';
    if (changePercentage < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Recent Price Change */}
      {recentPriceChange && (
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPriceChangeIcon(recentPriceChange.changePercentage)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Price Update</span>
                  <Badge variant="outline" className="text-xs">
                    {formatTime(recentPriceChange.timestamp)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  ৳{recentPriceChange.oldPrice} → ৳{recentPriceChange.newPrice}
                </div>
              </div>
            </div>
            <div className={`text-sm font-medium ${getPriceChangeColor(recentPriceChange.changePercentage)}`}>
              {recentPriceChange.changePercentage > 0 ? '+' : ''}
              {recentPriceChange.changePercentage.toFixed(1)}%
            </div>
          </div>
        </Card>
      )}

      {/* Price Alert Status */}
      {priceAlert ? (
        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Price Alert Active</div>
                <div className="text-xs text-muted-foreground">
                  Notify when price is {priceAlert.alertType} ৳{priceAlert.targetPrice}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removePriceAlert}
              className="text-muted-foreground hover:text-foreground"
            >
              <BellOff className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BellOff className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Set Price Alert</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as any)}
                  className="text-xs px-2 py-1 rounded border bg-background"
                >
                  <option value="below">Below</option>
                  <option value="above">Above</option>
                  <option value="exact">Exactly</option>
                </select>
                <input
                  type="number"
                  placeholder="Target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 rounded border bg-background"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <Button
                size="sm"
                onClick={createPriceAlert}
                disabled={!targetPrice || isCreatingAlert}
                className="w-full text-xs"
              >
                {isCreatingAlert ? 'Creating...' : 'Create Alert'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Current Price */}
      <Card className="p-3">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Current Price</div>
          <div className="text-lg font-bold text-primary">৳{currentPrice}</div>
        </div>
      </Card>
    </div>
  );
};