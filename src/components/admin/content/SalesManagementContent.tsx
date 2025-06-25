import React from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DailySalesForm } from './forms/DailySalesForm';
import { MonthlySalesForm } from './forms/MonthlySalesForm';
import { YearlySalesForm } from './forms/YearlySalesForm';

interface SalesManagementContentProps {
  selectedSubmenu: string;
}

export const SalesManagementContent: React.FC<SalesManagementContentProps> = ({ selectedSubmenu }) => {
  const renderSalesOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sales Overview</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳456,789</div>
            <p className="text-xs opacity-80">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳12.4M</div>
            <p className="text-xs opacity-80">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs opacity-80">+15.3% increase</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳370</div>
            <p className="text-xs opacity-80">-2.1% from average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Interactive Sales Chart</p>
                <p className="text-sm text-gray-400">Chart component would render here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Electronics', sales: '৳2.1M', percentage: 85, color: 'bg-blue-500' },
                { category: 'Fashion', sales: '৳1.8M', percentage: 72, color: 'bg-green-500' },
                { category: 'Home & Garden', sales: '৳1.2M', percentage: 58, color: 'bg-purple-500' },
                { category: 'Sports', sales: '৳890K', percentage: 45, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-gray-600">{item.sales}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRevenueAnalytics = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Revenue Distribution Chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: 'Current Month', amount: '৳12.4M', change: '+8.2%', positive: true },
                { month: 'Last Month', amount: '৳11.5M', change: '+5.1%', positive: true },
                { month: 'Same Month Last Year', amount: '৳10.2M', change: '+21.6%', positive: true }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.month}</p>
                    <p className="text-lg font-bold">{item.amount}</p>
                  </div>
                  <Badge className={item.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {item.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getContent = () => {
    console.log('🔍 SalesManagementContent - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'sales-overview':
      case 'sales':
      case 'overview': // Add fallback for when coming from sales menu
        return renderSalesOverview();
      case 'daily-sales':
        console.log('✅ Rendering DailySalesForm');
        return <DailySalesForm />;
      case 'monthly-trends':
        console.log('✅ Rendering MonthlySalesForm');
        return <MonthlySalesForm />;
      case 'yearly-reports':
        console.log('✅ Rendering YearlySalesForm');
        return <YearlySalesForm />;
      case 'revenue-analytics':
      case 'revenue-dashboard':
        return renderRevenueAnalytics();
      default:
        console.log('⚠️ SalesManagementContent - defaulting to sales overview for:', selectedSubmenu);
        return renderSalesOverview();
    }
  };

  return (
    <div className="p-6">
      {getContent()}
    </div>
  );
};
