
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  FileText, Download, Calendar as CalendarIcon, Filter, Search, 
  Package, TrendingUp, TrendingDown, AlertTriangle, BarChart3,
  PieChart as PieChartIcon, Activity, Warehouse, Truck, Users,
  DollarSign, Clock, CheckCircle, XCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const InventoryReportsContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [filters, setFilters] = useState({
    category: 'all',
    vendor: 'all',
    warehouse: 'all',
    status: 'all'
  });

  // Mock data for different report types
  const inventoryOverview = {
    totalProducts: 45672,
    totalValue: 125400000,
    lowStockItems: 89,
    outOfStock: 23,
    categories: 156,
    vendors: 234
  };

  const stockMovementData = [
    { date: '2024-01', inbound: 12500, outbound: 8900, net: 3600 },
    { date: '2024-02', inbound: 15200, outbound: 11200, net: 4000 },
    { date: '2024-03', inbound: 18900, outbound: 14600, net: 4300 },
    { date: '2024-04', inbound: 22100, outbound: 18200, net: 3900 },
    { date: '2024-05', inbound: 19800, outbound: 16800, net: 3000 },
    { date: '2024-06', inbound: 24500, outbound: 20200, net: 4300 }
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 35, amount: 45000000, color: '#8884d8' },
    { name: 'Fashion', value: 28, amount: 32000000, color: '#82ca9d' },
    { name: 'Home & Garden', value: 15, amount: 18000000, color: '#ffc658' },
    { name: 'Books', value: 12, amount: 12000000, color: '#ff7300' },
    { name: 'Sports', value: 10, amount: 18400000, color: '#00ff88' }
  ];

  const vendorPerformanceData = [
    { vendor: 'Tech Solutions Ltd', products: 1250, value: 25000000, performance: 92, deliveryTime: 3.2, qualityScore: 4.8 },
    { vendor: 'Fashion Hub Co', products: 980, value: 18500000, performance: 88, deliveryTime: 4.1, qualityScore: 4.6 },
    { vendor: 'Home Essentials', products: 756, value: 12800000, performance: 85, deliveryTime: 3.8, qualityScore: 4.5 },
    { vendor: 'Sports Zone', products: 623, value: 15200000, performance: 90, deliveryTime: 3.5, qualityScore: 4.7 },
    { vendor: 'Book World', products: 445, value: 8900000, performance: 87, deliveryTime: 4.2, qualityScore: 4.4 }
  ];

  const warehouseData = [
    { warehouse: 'Main Warehouse - Dhaka', capacity: 100000, occupied: 85000, utilization: 85, products: 12500 },
    { warehouse: 'Secondary - Chittagong', capacity: 75000, occupied: 52500, utilization: 70, products: 8900 },
    { warehouse: 'Regional - Sylhet', capacity: 50000, occupied: 32500, utilization: 65, products: 5600 },
    { warehouse: 'Distribution - Khulna', capacity: 40000, occupied: 28000, utilization: 70, products: 4200 }
  ];

  const stockTurnoverData = [
    { product: 'iPhone 15 Pro Max', turnover: 24.5, avgDays: 15, lastRestock: '2024-06-20' },
    { product: 'Samsung Galaxy S24', turnover: 18.2, avgDays: 20, lastRestock: '2024-06-18' },
    { product: 'MacBook Air M3', turnover: 12.8, avgDays: 28, lastRestock: '2024-06-15' },
    { product: 'Dell XPS 13', turnover: 10.5, avgDays: 35, lastRestock: '2024-06-10' },
    { product: 'Sony WH-1000XM5', turnover: 22.1, avgDays: 16, lastRestock: '2024-06-22' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const ReportFilters = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Vendor</Label>
            <Select value={filters.vendor} onValueChange={(value) => setFilters({...filters, vendor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="tech-solutions">Tech Solutions Ltd</SelectItem>
                <SelectItem value="fashion-hub">Fashion Hub Co</SelectItem>
                <SelectItem value="home-essentials">Home Essentials</SelectItem>
                <SelectItem value="sports-zone">Sports Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Warehouse</Label>
            <Select value={filters.warehouse} onValueChange={(value) => setFilters({...filters, warehouse: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem value="main">Main Warehouse</SelectItem>
                <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                <SelectItem value="regional">Regional Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{inventoryOverview.totalProducts.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(inventoryOverview.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{inventoryOverview.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{inventoryOverview.outOfStock}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{inventoryOverview.categories}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold">{inventoryOverview.vendors}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockMovementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
                <Legend />
                <Line type="monotone" dataKey="inbound" stroke="#8884d8" name="Inbound" />
                <Line type="monotone" dataKey="outbound" stroke="#82ca9d" name="Outbound" />
                <Line type="monotone" dataKey="net" stroke="#ffc658" name="Net Change" />
              </LineChart>
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
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const VendorReportsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Vendor Name</th>
                  <th className="text-left p-2">Products</th>
                  <th className="text-left p-2">Total Value</th>
                  <th className="text-left p-2">Performance Score</th>
                  <th className="text-left p-2">Avg Delivery (Days)</th>
                  <th className="text-left p-2">Quality Score</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendorPerformanceData.map((vendor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{vendor.vendor}</td>
                    <td className="p-2">{vendor.products.toLocaleString()}</td>
                    <td className="p-2">{formatCurrency(vendor.value)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Progress value={vendor.performance} className="w-20 h-2" />
                        <span className="text-sm">{vendor.performance}%</span>
                      </div>
                    </td>
                    <td className="p-2">{vendor.deliveryTime} days</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <span>{vendor.qualityScore}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={vendor.performance >= 90 ? 'bg-green-100 text-green-800' : 
                                     vendor.performance >= 85 ? 'bg-yellow-100 text-yellow-800' : 
                                     'bg-red-100 text-red-800'}>
                        {vendor.performance >= 90 ? 'Excellent' : 
                         vendor.performance >= 85 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const WarehouseReportsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warehouseData.map((warehouse, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                {warehouse.warehouse}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Capacity Utilization</span>
                  <span className="font-bold">{warehouse.utilization}%</span>
                </div>
                <Progress value={warehouse.utilization} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Capacity</p>
                    <p className="font-bold">{warehouse.capacity.toLocaleString()} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Currently Occupied</p>
                    <p className="font-bold">{warehouse.occupied.toLocaleString()} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Space</p>
                    <p className="font-bold">{(warehouse.capacity - warehouse.occupied).toLocaleString()} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Product Count</p>
                    <p className="font-bold">{warehouse.products.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const StockTurnoverTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Turnover Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Annual Turnover</th>
                  <th className="text-left p-2">Avg Days in Stock</th>
                  <th className="text-left p-2">Last Restocked</th>
                  <th className="text-left p-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {stockTurnoverData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.product}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span>{item.turnover}x</span>
                        {item.turnover > 20 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : item.turnover > 15 ? (
                          <Activity className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-2">{item.avgDays} days</td>
                    <td className="p-2">{item.lastRestock}</td>
                    <td className="p-2">
                      <Badge className={item.turnover > 20 ? 'bg-green-100 text-green-800' : 
                                     item.turnover > 15 ? 'bg-yellow-100 text-yellow-800' : 
                                     'bg-red-100 text-red-800'}>
                        {item.turnover > 20 ? 'Fast Moving' : 
                         item.turnover > 15 ? 'Medium Moving' : 'Slow Moving'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>
      </div>

      <ReportFilters />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Reports</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouse Reports</TabsTrigger>
          <TabsTrigger value="turnover">Stock Turnover</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="vendors">
          <VendorReportsTab />
        </TabsContent>

        <TabsContent value="warehouses">
          <WarehouseReportsTab />
        </TabsContent>

        <TabsContent value="turnover">
          <StockTurnoverTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
