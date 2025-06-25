
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Calculator, Download, RefreshCw, Plus, AlertCircle, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

// Sample data for ROI tracking
const roiTrendData = [
  { month: 'Jan', totalInvestment: 850000, totalRevenue: 1250000, roi: 47.1, campaignROI: 55, productROI: 38, marketingROI: 62 },
  { month: 'Feb', totalInvestment: 920000, totalRevenue: 1480000, roi: 60.9, campaignROI: 68, productROI: 45, marketingROI: 73 },
  { month: 'Mar', totalInvestment: 1100000, totalRevenue: 1750000, roi: 59.1, campaignROI: 72, productROI: 48, marketingROI: 67 },
  { month: 'Apr', totalInvestment: 1250000, totalRevenue: 2100000, roi: 68.0, campaignROI: 85, productROI: 52, marketingROI: 78 },
  { month: 'May', totalInvestment: 1180000, totalRevenue: 2350000, roi: 99.2, campaignROI: 95, productROI: 88, marketingROI: 115 },
  { month: 'Jun', totalInvestment: 1350000, totalRevenue: 2650000, roi: 96.3, campaignROI: 105, productROI: 82, marketingROI: 102 }
];

const campaignROIData = [
  { campaign: 'Summer Sale 2024', investment: 285000, revenue: 625000, roi: 119.3, status: 'active', duration: '45 days' },
  { campaign: 'Flash Sale Weekend', investment: 125000, revenue: 380000, roi: 204.0, status: 'completed', duration: '3 days' },
  { campaign: 'New Product Launch', investment: 450000, revenue: 820000, roi: 82.2, status: 'active', duration: '60 days' },
  { campaign: 'Festival Special', investment: 320000, revenue: 750000, roi: 134.4, status: 'completed', duration: '30 days' },
  { campaign: 'Brand Partnership', investment: 185000, revenue: 420000, roi: 127.0, status: 'active', duration: '90 days' }
];

const productROIData = [
  { category: 'Electronics', investment: 450000, revenue: 890000, roi: 97.8, units: 2850, margin: 42 },
  { category: 'Fashion', investment: 320000, revenue: 680000, roi: 112.5, units: 4200, margin: 38 },
  { category: 'Home & Garden', investment: 285000, revenue: 520000, roi: 82.5, units: 1850, margin: 35 },
  { category: 'Sports', investment: 195000, revenue: 425000, roi: 117.9, units: 1650, margin: 45 },
  { category: 'Beauty', investment: 150000, revenue: 385000, roi: 156.7, units: 2100, margin: 52 }
];

const roiTargetData = [
  { metric: 'Overall ROI', current: 96.3, target: 85.0, performance: 113.3 },
  { metric: 'Campaign ROI', current: 105, target: 90.0, performance: 116.7 },
  { metric: 'Product ROI', current: 82, target: 75.0, performance: 109.3 },
  { metric: 'Marketing ROI', current: 102, target: 80.0, performance: 127.5 }
];

const investmentBreakdownData = [
  { category: 'Marketing & Advertising', amount: 485000, percentage: 35.9, roi: 102, color: '#3b82f6' },
  { category: 'Product Development', amount: 365000, percentage: 27.0, roi: 82, color: '#10b981' },
  { category: 'Technology & Infrastructure', amount: 285000, percentage: 21.1, roi: 78, color: '#f59e0b' },
  { category: 'Operations & Logistics', amount: 215000, percentage: 15.9, roi: 65, color: '#ef4444' }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ROITrackingContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedInvestmentType, setSelectedInvestmentType] = useState('all');
  const [newROIData, setNewROIData] = useState({
    investmentType: '',
    campaignName: '',
    investmentAmount: '',
    expectedRevenue: '',
    actualRevenue: '',
    timeframe: '',
    notes: ''
  });

  const calculateROI = (investment: number, revenue: number) => {
    return ((revenue - investment) / investment * 100).toFixed(1);
  };

  const handleROICalculation = () => {
    const investment = parseFloat(newROIData.investmentAmount);
    const revenue = parseFloat(newROIData.actualRevenue || newROIData.expectedRevenue);
    if (investment && revenue) {
      const roi = calculateROI(investment, revenue);
      console.log(`ROI Calculated: ${roi}%`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            ROI Tracking Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Advanced return on investment analytics and performance monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Investment Type</Label>
              <Select value={selectedInvestmentType} onValueChange={setSelectedInvestmentType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Key ROI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.3%</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +13.2% vs target
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1.35M</div>
            <div className="flex items-center text-xs opacity-80">
              <Activity className="w-3 h-3 mr-1" />
              Current period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳2.65M</div>
            <div className="flex items-center text-xs opacity-80">
              <DollarSign className="w-3 h-3 mr-1" />
              +96.3% return
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Campaign ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">204%</div>
            <div className="flex items-center text-xs opacity-80">
              <Target className="w-3 h-3 mr-1" />
              Flash Sale Weekend
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="entry">Data Entry</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    roi: { label: "Overall ROI", color: "#3b82f6" },
                    campaignROI: { label: "Campaign ROI", color: "#10b981" },
                    productROI: { label: "Product ROI", color: "#f59e0b" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roiTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="roi" stroke="#3b82f6" strokeWidth={3} />
                      <Line type="monotone" dataKey="campaignROI" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="productROI" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Investment", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {investmentBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment vs Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  investment: { label: "Investment", color: "#ef4444" },
                  revenue: { label: "Revenue", color: "#10b981" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="totalInvestment" fill="#ef4444" name="Investment" />
                    <Bar dataKey="totalRevenue" fill="#10b981" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign ROI Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignROIData.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{campaign.campaign}</h4>
                      <p className="text-sm text-gray-600">Duration: {campaign.duration} • Investment: ৳{(campaign.investment / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Revenue</div>
                        <div className="font-bold">৳{(campaign.revenue / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">ROI</div>
                        <div className={`font-bold text-lg ${campaign.roi > 100 ? 'text-green-600' : 'text-orange-600'}`}>
                          {campaign.roi}%
                        </div>
                      </div>
                      <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Category ROI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productROIData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.category}</h4>
                      <p className="text-sm text-gray-600">Units Sold: {product.units} • Margin: {product.margin}%</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Investment</div>
                        <div className="font-bold">৳{(product.investment / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Revenue</div>
                        <div className="font-bold">৳{(product.revenue / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">ROI</div>
                        <div className={`font-bold text-lg ${product.roi > 100 ? 'text-green-600' : 'text-orange-600'}`}>
                          {product.roi}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ROI Targets vs Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roiTargetData.map((target, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{target.metric}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">Current: {target.current}%</span>
                        <span className="text-sm">Target: {target.target}%</span>
                        <Badge className={target.performance >= 100 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                          {target.performance.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={target.performance > 150 ? 100 : (target.performance / 1.5) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Entry Tab */}
        <TabsContent value="entry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Investment & ROI Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentType">Investment Type</Label>
                    <Select value={newROIData.investmentType} onValueChange={(value) => setNewROIData(prev => ({ ...prev, investmentType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing Campaign</SelectItem>
                        <SelectItem value="product">Product Development</SelectItem>
                        <SelectItem value="technology">Technology Infrastructure</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Campaign/Project Name</Label>
                    <Input
                      id="campaignName"
                      value={newROIData.campaignName}
                      onChange={(e) => setNewROIData(prev => ({ ...prev, campaignName: e.target.value }))}
                      placeholder="Enter campaign or project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentAmount">Investment Amount (৳)</Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      value={newROIData.investmentAmount}
                      onChange={(e) => setNewROIData(prev => ({ ...prev, investmentAmount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedRevenue">Expected Revenue (৳)</Label>
                    <Input
                      id="expectedRevenue"
                      type="number"
                      value={newROIData.expectedRevenue}
                      onChange={(e) => setNewROIData(prev => ({ ...prev, expectedRevenue: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="actualRevenue">Actual Revenue (৳)</Label>
                    <Input
                      id="actualRevenue"
                      type="number"
                      value={newROIData.actualRevenue}
                      onChange={(e) => setNewROIData(prev => ({ ...prev, actualRevenue: e.target.value }))}
                      placeholder="0.00 (if completed)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select value={newROIData.timeframe} onValueChange={(value) => setNewROIData(prev => ({ ...prev, timeframe: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1week">1 Week</SelectItem>
                        <SelectItem value="2weeks">2 Weeks</SelectItem>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newROIData.notes}
                      onChange={(e) => setNewROIData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes or comments"
                    />
                  </div>
                  <Button onClick={handleROICalculation} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate & Save ROI
                  </Button>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">ROI Calculation Tips:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• ROI = (Revenue - Investment) / Investment × 100</li>
                      <li>• Track both expected and actual returns</li>
                      <li>• Include all associated costs in investment</li>
                      <li>• Monitor ROI trends over time for insights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Performance Scatter Plot</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    roi: { label: "ROI", color: "#3b82f6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={campaignROIData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="investment" name="Investment" />
                      <YAxis dataKey="roi" name="ROI" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ strokeDasharray: '3 3' }}
                      />
                      <Scatter name="Campaigns" dataKey="roi" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Efficiency by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    roi: { label: "ROI", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={investmentBreakdownData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="roi" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
