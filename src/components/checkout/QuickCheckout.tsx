import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, CreditCard, MapPin, Truck, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuickCheckoutProps {
  productId: string;
  quantity?: number;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

interface CheckoutPreferences {
  default_shipping_address: any;
  default_billing_address: any;
  default_payment_method: string;
  auto_apply_coupons: boolean;
  skip_review_step: boolean;
}

export const QuickCheckout: React.FC<QuickCheckoutProps> = ({
  productId,
  quantity = 1,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<CheckoutPreferences | null>(null);
  const [showPreferencesSetup, setShowPreferencesSetup] = useState(false);
  const [usePreferences, setUsePreferences] = useState(true);
  
  // Preference form states
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [autoApplyCoupons, setAutoApplyCoupons] = useState(false);
  const [skipReviewStep, setSkipReviewStep] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/quick-checkout-api?action=preferences',
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
          setShippingAddress(data.preferences.default_shipping_address || shippingAddress);
          setPaymentMethod(data.preferences.default_payment_method || 'cod');
          setAutoApplyCoupons(data.preferences.auto_apply_coupons);
          setSkipReviewStep(data.preferences.skip_review_step);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/quick-checkout-api?action=preferences',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            default_shipping_address: shippingAddress,
            default_billing_address: shippingAddress, // Using same as shipping for simplicity
            default_payment_method: paymentMethod,
            auto_apply_coupons: autoApplyCoupons,
            skip_review_step: skipReviewStep
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
        setShowPreferencesSetup(false);
        toast({
          title: "Preferences Saved",
          description: "Your quick checkout preferences have been saved"
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    }
  };

  const handleQuickOrder = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Login Required",
          description: "Please log in to use quick checkout",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/quick-checkout-api?action=quick-order',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_id: productId,
            quantity,
            use_preferences: usePreferences && !!preferences
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Order Placed!",
          description: `Order ${data.order.order_number} created successfully`
        });
        onSuccess?.(data.order.id);
      } else {
        const errorData = await response.json();
        toast({
          title: "Order Failed",
          description: errorData.error || "Failed to place order",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error placing quick order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usePreferences"
                  checked={usePreferences}
                  onCheckedChange={(checked) => setUsePreferences(checked === true)}
                />
                <label htmlFor="usePreferences" className="text-sm font-medium">
                  Use saved preferences
                </label>
              </div>

              {usePreferences && (
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {preferences.default_shipping_address?.street}, {preferences.default_shipping_address?.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="capitalize">{preferences.default_payment_method}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span>
                      {preferences.skip_review_step ? 'Skip review' : 'Review before payment'}
                    </span>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferencesSetup(true)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Update Preferences
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Set up quick checkout preferences for faster ordering
              </p>
              <Button
                variant="outline"
                onClick={() => setShowPreferencesSetup(true)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup Quick Checkout
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleQuickOrder}
              disabled={loading || (!usePreferences && !preferences)}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              {loading ? 'Processing...' : 'Quick Order'}
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences Setup Dialog */}
      <Dialog open={showPreferencesSetup} onOpenChange={setShowPreferencesSetup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Checkout Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Input
                placeholder="Street address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                />
                <Input
                  placeholder="ZIP Code"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                  <SelectItem value="rocket">Rocket</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoApplyCoupons"
                  checked={autoApplyCoupons}
                  onCheckedChange={(checked) => setAutoApplyCoupons(checked === true)}
                />
                <Label htmlFor="autoApplyCoupons" className="text-sm">
                  Automatically apply available coupons
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipReviewStep"
                  checked={skipReviewStep}
                  onCheckedChange={(checked) => setSkipReviewStep(checked === true)}
                />
                <Label htmlFor="skipReviewStep" className="text-sm">
                  Skip order review step
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={savePreferences} className="flex-1">
                Save Preferences
              </Button>
              <Button variant="outline" onClick={() => setShowPreferencesSetup(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};