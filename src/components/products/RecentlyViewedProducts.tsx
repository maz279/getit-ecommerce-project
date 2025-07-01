import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface RecentlyViewedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  avgRating: number;
  reviewCount: number;
  inStock: boolean;
}

interface RecentlyViewedProductsProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export const RecentlyViewedProducts: React.FC<RecentlyViewedProductsProps> = ({
  limit = 10,
  showHeader = true,
  className = ''
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecentlyViewed();
    } else {
      setLoading(false);
    }
  }, [user, limit]);

  const loadRecentlyViewed = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/enhanced-products-api?action=recently-viewed',
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products.slice(0, limit));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackProductView = async (productId: string, viewDuration = 0) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/enhanced-products-api?action=track-view',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_id: productId,
            view_duration_seconds: viewDuration
          })
        }
      );
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Login Required",
          description: "Please log in to add items to wishlist",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/wishlist-api',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product_id: productId })
        }
      );

      if (response.ok) {
        toast({
          title: "Added to Wishlist",
          description: "Product added to your wishlist"
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to wishlist",
        variant: "destructive"
      });
    }
  };

  const handleProductClick = (productId: string) => {
    trackProductView(productId, 5); // Track as 5 second view
    window.location.href = `/product/${productId}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Recently Viewed</h2>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Recently Viewed</h2>
          </div>
          {products.length > 4 && (
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/recently-viewed'}>
              View All
            </Button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative">
              <img
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                  <span className="text-white text-sm font-medium">Out of Stock</span>
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(product.id);
                  }}
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(Math.round(product.avgRating))}
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">৳{product.price}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!product.inStock}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic here
                  }}
                  className="h-8 px-2"
                >
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Hook for tracking product views
export const useProductView = () => {
  const trackView = async (productId: string, viewDuration = 0) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/enhanced-products-api?action=track-view',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_id: productId,
            view_duration_seconds: viewDuration
          })
        }
      );
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  return { trackView };
};