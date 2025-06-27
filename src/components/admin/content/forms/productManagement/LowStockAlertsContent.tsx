
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, Bell, Search, Filter, Download, Eye, ShoppingCart, RefreshCw, Settings, Mail, MessageSquare, Calendar, BarChart3, Zap, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { inventoryManager } from '@/services/ml/InventoryManager';

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  reorderPoint: number;
  unitCost: number;
  avgSalesPerDay: number;
  daysUntilStockout: number;
  supplier: string;
  lastReordered: string;
  status: 'critical' | 'low' | 'warning';
  image: string;
  trend: number;
  leadTime: number;
  priority: 'high' | 'medium' | 'low';
}

interface StockAlert {
  id: string;
  type: 'critical' | 'low' | 'reorder' | 'overstock';
  productId: string;
  productName: string;
  message: string;
  severity: 'urgent' | 'high' | 'medium' | 'low';
  createdAt: string;
  acknowledged: boolean;
  assignedTo?: string;
}

export const LowStockAlertsContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [mlRecommendations, setMlRecommendations] = useState<any[]>([]);

  // Mock data - in real app this would come from API
  const lowStockProducts: LowStockProduct[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      sku: 'APL-IP15PM-256',
      category: 'Electronics',
      currentStock: 3,
      minStock: 50,
      reorderPoint: 25,
      unitCost: 85000,
      avgSalesPerDay: 8.5,
      daysUntilStockout: 0.35,
      supplier: 'Apple Inc.',
      lastReordered: '2024-01-15',
      status: 'critical',
      image: '/api/placeholder/60/60',
      trend: -15,
      leadTime: 7,
      priority: 'high'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SAM-GS24U-512',
      category: 'Electronics',
      currentStock: 8,
      minStock: 30,
      reorderPoint: 15,
      unitCost: 75000,
      avgSalesPerDay: 6.2,
      daysUntilStockout: 1.3,
      supplier: 'Samsung Electronics',
      lastReordered: '2024-01-20',
      status: 'critical',
      image: '/api/placeholder/60/60',
      trend: -8,
      leadTime: 5,
      priority: 'high'
    },
    {
      id: '3',
      name: 'MacBook Air M3 13"',
      sku: 'APL-MBA-M3-13',
      category: 'Electronics',
      currentStock: 12,
      minStock: 25,
      reorderPoint: 20,
      unitCost: 95000,
      avgSalesPerDay: 3.8,
      daysUntilStockout: 3.2,
      supplier: 'Apple Inc.',
      lastReordered: '2024-01-18',
      status: 'low',
      image: '/api/placeholder/60/60',
      trend: -5,
      leadTime: 7,
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Nike Air Jordan 1 Size 42',
      sku: 'NIK-AJ1-42',
      category: 'Fashion',
      currentStock: 18,
      minStock: 35,
      reorderPoint: 25,
      unitCost: 12000,
      avgSalesPerDay: 4.2,
      daysUntilStockout: 4.3,
      supplier: 'Nike Corp.',
      lastReordered: '2024-01-22',
      status: 'low',
      image: '/api/placeholder/60/60',
      trend: -3,
      leadTime: 14,
      priority: 'medium'
    },
    {
      id: '5',
      name: 'Sony WH-1000XM5 Headphones',
      sku: 'SNY-WH1000XM5',
      category: 'Electronics',
      currentStock: 22,
      minStock: 40,
      reorderPoint: 30,
      unitCost: 25000,
      avgSalesPerDay: 5.5,
      daysUntilStockout: 4.0,
      supplier: 'Sony Corporation',
      lastReordered: '2024-01-25',
      status: 'warning',
      image: '/api/placeholder/60/60',
      trend: 2,
      leadTime: 10,
      priority: 'low'
    }
  ];

  const stockTrendData = [
    { date: '2024-01-01', critical: 5, low: 12, warning: 8 },
    { date: '2024-01-07', critical: 8, low: 15, warning: 10 },
    { date: '2024-01-14', critical: 12, low: 18, warning: 12 },
    { date: '2024-01-21', critical: 15, low: 22, warning: 15 },
    { date: '2024-01-28', critical: 18, low: 25, warning: 18 }
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 35, color: '#FF6B6B' },
    { name: 'Fashion', value: 20, color: '#4ECDC4' },
    { name: 'Home & Garden', value: 15, color: '#45B7D1' },
    { name: 'Sports', value: 12, color: '#96CEB4' },
    { name: 'Books', value: 8, color: '#FFEAA7' },
    { name: 'Others', value: 10, color: '#DDA0DD' }
  ];

  // Load ML recommendations
  useEffect(() => {
    const loadMlRecommendations = async () => {
      try {
        const recommendations = await inventoryManager.bulkForecastDemand(['1', '2', '3', '4', '5']);
        setMlRecommendations(recommendations);
        
        const inventoryAlerts = await inventoryManager.getInventoryAlerts();
        setAlerts(inventoryAlerts.map((alert, index) => ({
          id: `alert-${index}`,
          type: alert.type as 'critical' | 'low' | 'reorder' | 'overstock',
          productId: alert.productId || `prod-${index}`,
          productName: `Product ${index + 1}`,
          message: alert.message,
          severity: alert.severity as 'urgent' | 'high' | 'medium' | 'low',
          createdAt: new Date().toISOString(),
          acknowledged: false
        })));
      } catch (error) {
        console.error('Failed to load ML recommendations:', error);
      }
    };

    loadMlRecommendations();
  }, []);

  const filteredProducts = lowStockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesSupplier = filterSupplier === 'all' || product.supplier === filterSupplier;

    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  const criticalCount = lowStockProducts.filter(p => p.status === 'critical').length;
  const lowCount = lowStockProducts.filter(p => p.status === 'low').length;
  const warningCount = lowStockProducts.filter(p => p.status === 'warning').length;
  const totalValue = lowStockProducts.reduce((sum, p) => sum + (p.currentStock * p.unitCost), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
          <p className="text-xs text-gray-500">Immediate action required</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-orange-600">
            <TrendingDown className="h-4 w-4 mr-2" />
            Low Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{lowCount}</div>
          <p className="text-xs text-gray-500">Needs reordering soon</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center text-yellow-600">
            <Package className="h-4 w-4 mr-2" />
            Warning Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
          <p className="text-xs text-gray-500">Monitor closely</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-600">At-Risk Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">৳{(totalValue / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-gray-500">Inventory at risk</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductsTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Low Stock Products
          </span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Current Stock</th>
                <th className="text-left p-3">Reorder Point</th>
                <th className="text-left p-3">Days Until Stockout</th>
                <th className="text-left p-3">Supplier</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${product.status === 'critical' ? 'text-red-600' : product.status === 'low' ? 'text-orange-600' : 'text-yellow-600'}`}>
                        {product.currentStock}
                      </span>
                      <div className="text-xs text-gray-500">
                        /{product.minStock} min
                      </div>
                    </div>
                    <Progress 
                      value={(product.currentStock / product.minStock) * 100} 
                      className="mt-1 h-1"
                    />
                  </td>
                  <td className="p-3 font-medium">{product.reorderPoint}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className={`font-medium ${product.daysUntilStockout <= 1 ? 'text-red-600' : product.daysUntilStockout <= 3 ? 'text-orange-600' : 'text-yellow-600'}`}>
                        {product.daysUntilStockout.toFixed(1)}d
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{product.supplier}</td>
                  <td className="p-3">
                    <div className={`flex items-center ${getPriorityColor(product.priority)}`}>
                      <Target className="h-3 w-3 mr-1" />
                      <span className="capitalize text-xs font-medium">{product.priority}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={`${getStatusColor(product.status)} text-xs`}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="text-xs">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Reorder
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Stock Alert Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" />
              <Area type="monotone" dataKey="low" stackId="1" stroke="#f97316" fill="#f97316" />
              <Area type="monotone" dataKey="warning" stackId="1" stroke="#eab308" fill="#eab308" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderAlertSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Alert Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Notification Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Email Notifications</label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">SMS Alerts</label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Desktop Notifications</label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Auto Refresh</label>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Threshold Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Critical Level (%)</label>
                <Input type="number" defaultValue="10" className="w-20" />
              </div>
              <div>
                <label className="text-sm block mb-1">Low Level (%)</label>
                <Input type="number" defaultValue="25" className="w-20" />
              </div>
              <div>
                <label className="text-sm block mb-1">Warning Level (%)</label>
                <Input type="number" defaultValue="40" className="w-20" />
              </div>
              <div>
                <label className="text-sm block mb-1">Refresh Interval (min)</label>
                <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(Number(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Automated Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Reorder</p>
                <p className="text-xs text-gray-500">Automatically create purchase orders</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Supplier Notification</p>
                <p className="text-xs text-gray-500">Alert suppliers about low stock</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMLInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mlRecommendations.slice(0, 3).map((rec, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Product ID: {rec.productId}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Predicted demand: {rec.predictedDemand} units over {rec.timeHorizon}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Confidence: {(rec.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Seasonal Factor: {rec.seasonalFactor.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Low Stock Alerts</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverviewCards()}
          {renderProductsTable()}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {renderOverviewCards()}
          {renderProductsTable()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {renderOverviewCards()}
          {renderAnalytics()}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {renderMLInsights()}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {renderAlertSettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
