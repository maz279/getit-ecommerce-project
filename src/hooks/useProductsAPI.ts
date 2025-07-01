import { useState, useEffect } from 'react';
import { productsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  vendor_id?: string;
  stock_quantity?: number;
  rating?: number;
  reviews_count?: number;
}

interface UseProductsAPIOptions {
  autoLoad?: boolean;
  filters?: Record<string, any>;
}

export const useProductsAPI = (options: UseProductsAPIOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const { autoLoad = true, filters = {} } = options;

  const loadProducts = async (searchFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const { data, error: apiError } = await productsApi.getAll(searchFilters);
      
      if (apiError) {
        setError(apiError.message || 'Failed to load products');
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } else if (data) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Products API error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading products.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    setLoading(true);
    setError('');

    try {
      const { data, error: apiError } = await productsApi.create(productData);
      
      if (apiError) {
        setError(apiError.message || 'Failed to create product');
        toast({
          title: "Error",
          description: "Failed to create product.",
          variant: "destructive"
        });
        return null;
      } else if (data) {
        toast({
          title: "Success",
          description: "Product created successfully!",
        });
        return data;
      }
    } catch (err) {
      console.error('Create product error:', err);
      setError('Failed to create product');
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setLoading(true);
    setError('');

    try {
      const { data, error: apiError } = await productsApi.update(id, updates);
      
      if (apiError) {
        setError(apiError.message || 'Failed to update product');
        toast({
          title: "Error",
          description: "Failed to update product.",
          variant: "destructive"
        });
        return null;
      } else if (data) {
        // Update local state
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
        return data;
      }
    } catch (err) {
      console.error('Update product error:', err);
      setError('Failed to update product');
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const { error: apiError } = await productsApi.delete(id);
      
      if (apiError) {
        setError(apiError.message || 'Failed to delete product');
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive"
        });
        return false;
      } else {
        // Remove from local state
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        return true;
      }
    } catch (err) {
      console.error('Delete product error:', err);
      setError('Failed to delete product');
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadProducts();
    }
  }, [autoLoad]);

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: () => loadProducts(filters)
  };
};