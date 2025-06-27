
import React from 'react';
import { Package, Plus, Upload, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AllProductsContent } from './forms/productManagement/AllProductsContent';
import { ProductSearchContent } from './forms/productManagement/ProductSearchContent';
import { FeaturedProductsContent } from './forms/productManagement/FeaturedProductsContent';
import { ProductImportExportContent } from './forms/productManagement/ProductImportExportContent';
import { CategoryStructureContent } from './forms/productManagement/CategoryStructureContent';
import { CategoryPerformanceContent } from './forms/productManagement/CategoryPerformanceContent';
import { SeasonalCategoriesContent } from './forms/productManagement/SeasonalCategoriesContent';

interface ProductManagementContentProps {
  selectedSubmenu: string;
}

export const ProductManagementContent: React.FC<ProductManagementContentProps> = ({ selectedSubmenu }) => {
  const renderProductCatalog = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog Management</h1>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12,456</div>
            <p className="text-xs text-gray-500">+234 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">11,890</div>
            <p className="text-xs text-gray-500">95.4% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">89</div>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-gray-500">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'iPhone 15 Pro Max', sales: '1,234', revenue: '৳2.1M', trend: '+15%' },
                { name: 'Samsung Galaxy S24', sales: '987', revenue: '৳1.8M', trend: '+12%' },
                { name: 'MacBook Air M3', sales: '567', revenue: '৳1.2M', trend: '+8%' }
              ].map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{product.revenue}</p>
                    <Badge className="bg-green-100 text-green-800">{product.trend}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { product: 'Wireless Headphones', stock: 5, reorder: 50, status: 'critical' },
                { product: 'Gaming Mouse', stock: 12, reorder: 25, status: 'low' },
                { product: 'USB-C Cable', stock: 8, reorder: 100, status: 'critical' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-gray-600">Stock: {item.stock} units</p>
                  </div>
                  <Badge className={item.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInventoryManagement = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>High Stock</span>
                  <span className="text-green-600">8,234 items</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Medium Stock</span>
                  <span className="text-yellow-600">2,156 items</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Low Stock</span>
                  <span className="text-red-600">89 items</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Main Warehouse</span>
                <Badge>65%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Secondary Warehouse</span>
                <Badge variant="secondary">25%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Vendor Storage</span>
                <Badge variant="outline">10%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reorder Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">23</div>
              <p className="text-sm text-gray-600">Products need reordering</p>
              <Button size="sm" className="mt-3">View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getContent = () => {
    console.log('🔍 ProductManagementContent getContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'product-catalog':
      case 'products':
        return renderProductCatalog();
      case 'all-products':
        return <AllProductsContent />;
      case 'product-search':
        return <ProductSearchContent />;
      case 'featured-products':
        return <FeaturedProductsContent />;
      case 'import-export':
      case 'product-import':
      case 'product-export':
      case 'bulk-operations':
        return <ProductImportExportContent />;
      case 'category-structure':
      case 'category-management':
      case 'category-hierarchy':
      case 'category-attributes':
      case 'category-rules':
      case 'category-analytics':
      case 'category-seo':
        return <CategoryStructureContent selectedSubmenu={selectedSubmenu} />;
      case 'category-performance':
        return <CategoryPerformanceContent />;
      case 'seasonal-categories':
      case 'seasonal-category-management':
      case 'seasonal-campaigns':
      case 'seasonal-analytics':
        return <SeasonalCategoriesContent />;
      case 'inventory-management':
      case 'stock-levels':
        return renderInventoryManagement();
      case 'add-product':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            <p className="text-gray-600">Product creation form would be here...</p>
          </div>
        );
      case 'product-analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Product Analytics</h1>
            <p className="text-gray-600">Detailed product performance analytics...</p>
          </div>
        );
      default:
        return renderProductCatalog();
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
