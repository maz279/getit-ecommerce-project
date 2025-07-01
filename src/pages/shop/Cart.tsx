import React, { useState, useEffect } from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { useSEO } from '@/hooks/useSEO';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ordersApi } from '@/services/api';

const Cart: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useSEO({
    title: 'Shopping Cart - GetIt Bangladesh | Your Cart',
    description: 'Review items in your shopping cart and proceed to checkout on GetIt Bangladesh.',
    keywords: 'shopping cart, checkout, bangladesh cart'
  });

  const applyPromoCode = () => {
    setLoading(true);
    setError('');

    // Mock promo code validation
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'SAVE10') {
        setDiscount(state.total * 0.1);
        toast({
          title: "Promo Code Applied",
          description: "You saved 10% on your order!",
        });
      } else if (promoCode.toUpperCase() === 'WELCOME20') {
        setDiscount(state.total * 0.2);
        toast({
          title: "Promo Code Applied",
          description: "You saved 20% on your order!",
        });
      } else if (promoCode) {
        setError('Invalid promo code');
      }
      setLoading(false);
    }, 1000);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth/login', { state: { from: '/cart' } });
      return;
    }

    if (state.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    setError('');

    try {
      // Create order via API
      const orderData = {
        customer_id: user.id,
        items: state.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        })),
        total_amount: state.total - discount,
        discount_amount: discount,
        promo_code: promoCode || null,
        shipping_address: {
          // TODO: Get from user profile or address form
          name: userProfile?.full_name || user?.email || '',
          phone: user.phone,
          address: 'Default Address',
          city: 'Dhaka',
          postal_code: '1000'
        }
      };

      const { data, error: orderError } = await ordersApi.create(orderData);

      if (orderError) {
        setError(orderError.message || 'Failed to create order');
      } else if (data) {
        // Clear cart and navigate to payment
        clearCart();
        toast({
          title: "Order Created",
          description: "Redirecting to payment...",
        });
        navigate(`/checkout/${data.id}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to process checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-white flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start shopping to add items to your cart
                </p>
                <Button asChild>
                  <Link to="/categories">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary">{state.itemCount} items</Badge>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          by {item.vendor.business_name || item.vendor.user_id}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ৳{item.product.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="font-bold">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({state.itemCount} items)</span>
                      <span>৳{state.total.toLocaleString()}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-৳{discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>৳{(state.total - discount).toLocaleString()}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/categories">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;