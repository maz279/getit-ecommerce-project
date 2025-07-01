import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  specifications?: any;
  avgRating: number;
  reviewCount: number;
  inStock: boolean;
  vendor?: {
    name: string;
    rating: number;
  };
}

export const ProductComparison: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonName, setComparisonName] = useState('');

  const productIds = searchParams.get('products')?.split(',') || [];

  useEffect(() => {
    if (productIds.length > 0) {
      loadProducts();
    }
  }, [productIds]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendors!inner(name, rating),
          product_reviews(rating),
          inventory!inner(current_stock)
        `)
        .in('id', productIds);

      if (error) throw error;

      const processedProducts = data.map(product => {
        const reviews = product.product_reviews || [];
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
          : 0;

        return {
          ...product,
          vendor: product.vendors,
          avgRating: parseFloat(avgRating.toFixed(1)),
          reviewCount: reviews.length,
          inStock: product.inventory?.[0]?.current_stock > 0
        };
      });

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products for comparison",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveComparison = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Login Required",
          description: "Please log in to save comparisons",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/enhanced-products-api?action=comparison',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_ids: productIds,
            comparison_name: comparisonName || `Comparison ${new Date().toLocaleDateString()}`
          })
        }
      );

      if (response.ok) {
        toast({
          title: "Comparison Saved",
          description: "Your product comparison has been saved"
        });
      }
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast({
        title: "Error",
        description: "Failed to save comparison",
        variant: "destructive"
      });
    }
  };

  const removeProduct = (productId: string) => {
    const newProductIds = productIds.filter(id => id !== productId);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('products', newProductIds.join(','));
    window.history.replaceState({}, '', newUrl.toString());
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getComparisonRows = () => {
    if (products.length === 0) return [];

    const rows = [
      { label: 'Product Image', key: 'image' },
      { label: 'Product Name', key: 'name' },
      { label: 'Price', key: 'price' },
      { label: 'Rating', key: 'rating' },
      { label: 'Vendor', key: 'vendor' },
      { label: 'Availability', key: 'availability' },
      { label: 'Description', key: 'description' },
    ];

    // Add specification rows
    const allSpecs = new Set<string>();
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(spec => allSpecs.add(spec));
      }
    });

    allSpecs.forEach(spec => {
      rows.push({ label: spec, key: `spec_${spec}` });
    });

    return rows;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: productIds.length }).map((_, index) => (
              <Card key={index}>
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Products to Compare</h2>
        <p className="text-gray-600 mb-6">Add products to your comparison from the product search page.</p>
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Comparison</h1>
        <div className="flex gap-2">
          <Button onClick={saveComparison} variant="outline">
            Save Comparison
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 w-48">Features</th>
                    {products.map(product => (
                      <th key={product.id} className="text-center p-4 min-w-64">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{product.name}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeProduct(product.id)}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getComparisonRows().map(row => (
                    <tr key={row.key} className="border-b">
                      <td className="p-4 font-medium bg-gray-50">{row.label}</td>
                      {products.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          {row.key === 'image' && (
                            <img
                              src={product.images[0] || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded mx-auto"
                            />
                          )}
                          {row.key === 'name' && (
                            <div className="text-sm font-medium">{product.name}</div>
                          )}
                          {row.key === 'price' && (
                            <div className="text-lg font-bold text-primary">৳{product.price}</div>
                          )}
                          {row.key === 'rating' && (
                            <div className="flex items-center justify-center gap-1">
                              {renderStars(Math.round(product.avgRating))}
                              <span className="text-sm text-gray-500 ml-1">
                                ({product.reviewCount})
                              </span>
                            </div>
                          )}
                          {row.key === 'vendor' && (
                            <div>
                              <div className="text-sm font-medium">{product.vendor?.name}</div>
                              <div className="flex items-center justify-center gap-1 mt-1">
                                {renderStars(Math.round(product.vendor?.rating || 0))}
                              </div>
                            </div>
                          )}
                          {row.key === 'availability' && (
                            <Badge variant={product.inStock ? "default" : "destructive"}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          )}
                          {row.key === 'description' && (
                            <div className="text-sm text-gray-600 max-w-xs">
                              {product.description?.substring(0, 100)}...
                            </div>
                          )}
                          {row.key.startsWith('spec_') && (
                            <div className="text-sm">
                              {product.specifications?.[row.key.replace('spec_', '')] || 'N/A'}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4 font-medium bg-gray-50">Actions</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex flex-col gap-2">
                          <Button size="sm" disabled={!product.inStock}>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4 mr-1" />
                            Wishlist
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-6">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeProduct(product.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Price:</span>
                    <div className="text-lg font-bold text-primary">৳{product.price}</div>
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(Math.round(product.avgRating))}
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Vendor:</span>
                    <div>{product.vendor?.name}</div>
                  </div>
                  <div>
                    <span className="font-medium">Availability:</span>
                    <Badge variant={product.inStock ? "default" : "destructive"} className="mt-1">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={!product.inStock} className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};