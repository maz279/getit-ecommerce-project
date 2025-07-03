import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Search, Filter, BarChart3, Boxes, Globe2, Upload } from 'lucide-react';

interface ProductManagementDashboardProps {
  activeView?: string;
}

export const ProductManagementDashboard: React.FC<ProductManagementDashboardProps> = ({ 
  activeView = 'overview' 
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stats, setStats] = useState({
    total_products: 0,
    active_products: 0,
    pending_approval: 0,
    low_stock_items: 0,
    bangladesh_products: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load enhanced products with Bangladesh attributes
      const { data: enhancedProducts } = await supabase.functions.invoke('product-management-enhanced', {
        body: {
          endpoint: 'products/enhanced',
          data: { limit: 50 }
        }
      });

      if (enhancedProducts?.data) {
        setProducts(enhancedProducts.data);
        calculateStats(enhancedProducts.data);
      }

      // Load category hierarchy
      const { data: categoryData } = await supabase.functions.invoke('category-management-service', {
        body: {
          endpoint: 'categories/tree'
        }
      });

      if (categoryData?.data) {
        setCategories(categoryData.data);
      }

    } catch (error) {
      console.error('Error loading product data:', error);
    }
    setLoading(false);
  };

  const calculateStats = (productData: any[]) => {
    const stats = productData.reduce((acc, product) => {
      acc.total_products++;
      if (product.is_active) acc.active_products++;
      if (product.status === 'pending') acc.pending_approval++;
      if ((product.stock_quantity || 0) <= (product.low_stock_threshold || 5)) acc.low_stock_items++;
      if (product.product_attributes_bd && product.product_attributes_bd.length > 0) acc.bangladesh_products++;
      return acc;
    }, {
      total_products: 0,
      active_products: 0,
      pending_approval: 0,
      low_stock_items: 0,
      bangladesh_products: 0
    });

    setStats(stats);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_products}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          <BarChart3 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.active_products}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          <Filter className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending_approval}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <Boxes className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.low_stock_items}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bangladesh Products</CardTitle>
          <Globe2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.bangladesh_products}</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductTable = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage your product catalog with enhanced Bangladesh features</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="">All Categories</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name} {category.name_bn && `(${category.name_bn})`}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Product</th>
                <th className="text-left py-3 px-4 font-medium">SKU</th>
                <th className="text-left py-3 px-4 font-medium">Price</th>
                <th className="text-left py-3 px-4 font-medium">Stock</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Bangladesh Features</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.name_bn && (
                            <div className="text-sm text-muted-foreground">{product.name_bn}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="bg-muted px-2 py-1 rounded text-sm">{product.sku}</code>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">৳{product.price}</div>
                      {product.compare_price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ৳{product.compare_price}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={product.stock_quantity > product.low_stock_threshold ? "default" : "destructive"}
                      >
                        {product.stock_quantity || 0} units
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                          product.status === 'active' ? 'default' :
                          product.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {product.product_attributes_bd && product.product_attributes_bd[0] && (
                        <div className="flex flex-wrap gap-1">
                          {product.product_attributes_bd[0].material_type && (
                            <Badge variant="outline" className="text-xs">
                              {product.product_attributes_bd[0].material_type}
                            </Badge>
                          )}
                          {product.product_attributes_bd[0].traditional_size && (
                            <Badge variant="outline" className="text-xs">
                              {product.product_attributes_bd[0].traditional_size}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {product.product_attributes_bd[0].origin_tag || 'Made in Bangladesh'}
                          </Badge>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>Manage product categories with Bangladesh-specific features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category: any) => (
            <div key={category.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{category.name}</div>
                {category.name_bn && (
                  <div className="text-sm text-muted-foreground">{category.name_bn}</div>
                )}
                <div className="flex gap-2 mt-1">
                  {category.bangladesh_specific && (
                    <Badge variant="outline" className="text-xs">Bangladesh Specific</Badge>
                  )}
                  {category.traditional_category && (
                    <Badge variant="outline" className="text-xs">Traditional</Badge>
                  )}
                  {category.festival_category && (
                    <Badge variant="outline" className="text-xs">{category.festival_category}</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Subcategories ({category.children?.length || 0})</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderStatsCards()}
      
      <Tabs value={activeView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Product Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {renderProductTable()}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          {renderCategoryManagement()}
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Monitor stock levels and automation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Inventory management features will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>Product performance insights and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics dashboard will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};