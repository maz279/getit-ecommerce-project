
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Globe, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingCart,
  Heart,
  Star,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react';

export const MarketTrendsContent: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock data for market trends
  const trendingCategories = [
    { name: 'Electronics', growth: 15.4, volume: 12500, trend: 'up', change: '+2.3%' },
    { name: 'Fashion', growth: 8.2, volume: 9800, trend: 'up', change: '+1.8%' },
    { name: 'Home & Garden', growth: -3.1, volume: 7200, trend: 'down', change: '-0.9%' },
    { name: 'Health & Beauty', growth: 12.7, volume: 8900, trend: 'up', change: '+3.2%' },
    { name: 'Books', growth: -1.5, volume: 3400, trend: 'down', change: '-0.4%' },
    { name: 'Sports', growth: 18.9, volume: 6700, trend: 'up', change: '+4.1%' }
  ];

  const searchTrends = [
    { keyword: 'wireless earbuds', searches: 45000, growth: 23.5, competition: 'high' },
    { keyword: 'smart watch', searches: 38000, growth: 18.2, competition: 'high' },
    { keyword: 'yoga mat', searches: 28000, growth: 15.7, competition: 'medium' },
    { keyword: 'coffee maker', searches: 22000, growth: -5.3, competition: 'medium' },
    { keyword: 'gaming chair', searches: 19000, growth: 31.2, competition: 'low' }
  ];

  const seasonalTrends = [
    { month: 'Jan', electronics: 85, fashion: 45, home: 60, beauty: 70 },
    { month: 'Feb', electronics: 78, fashion: 52, home: 55, beauty: 65 },
    { month: 'Mar', electronics: 82, fashion: 68, home: 75, beauty: 80 },
    { month: 'Apr', electronics: 88, fashion: 72, home: 85, beauty: 75 },
    { month: 'May', electronics: 92, fashion: 78, home: 90, beauty: 82 },
    { month: 'Jun', electronics: 95, fashion: 85, home: 88, beauty: 88 },
    { month: 'Jul', electronics: 89, fashion: 82, home: 85, beauty: 85 }
  ];

  const priceAnalysis = [
    { category: 'Electronics', avgPrice: 245, priceChange: 5.2, demand: 'high' },
    { category: 'Fashion', avgPrice: 78, priceChange: -2.1, demand: 'medium' },
    { category: 'Home & Garden', avgPrice: 156, priceChange: 8.7, demand: 'low' },
    { category: 'Health & Beauty', avgPrice: 34, priceChange: 3.4, demand: 'high' },
    { category: 'Sports', avgPrice: 89, priceChange: -1.8, demand: 'medium' }
  ];

  const competitorAnalysis = [
    { competitor: 'Amazon', marketShare: 35.2, growth: 12.5, strength: 'Logistics' },
    { competitor: 'Shopee', marketShare: 28.8, growth: 18.3, strength: 'Mobile App' },
    { competitor: 'Alibaba', marketShare: 15.6, growth: 8.7, strength: 'B2B Focus' },
    { competitor: 'Others', marketShare: 20.4, growth: 5.2, strength: 'Niche Markets' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Trends Analysis</h1>
          <p className="text-gray-600 mt-1">Real-time market insights and trend analysis</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Market Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-gray-500">vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.8M</div>
            <p className="text-xs text-gray-500">monthly searches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">485K</div>
            <p className="text-xs text-gray-500">unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">৳1,245</div>
            <p className="text-xs text-gray-500">+8.2% increase</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="search">Search Trends</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="predictions">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="electronics" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="fashion" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="home" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Growing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingCategories.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${category.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={category.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {category.change}
                        </Badge>
                        {category.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Analysis</CardTitle>
              <div className="flex space-x-2">
                <Input placeholder="Search categories..." className="max-w-sm" />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Growth Rate</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingCategories.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {category.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          {Math.abs(category.growth)}%
                        </div>
                      </TableCell>
                      <TableCell>{category.volume.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={category.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {category.change}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Trends Tab */}
        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Top Search Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchTrends.map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{trend.keyword}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={trend.competition === 'high' ? 'bg-red-100 text-red-800' : 
                                          trend.competition === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-green-100 text-green-800'}>
                            {trend.competition}
                          </Badge>
                          <span className="text-sm text-gray-600">{trend.searches.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={Math.abs(trend.growth) * 2} className="flex-1 h-2" />
                        <span className={`text-sm ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trend.growth > 0 ? '+' : ''}{trend.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="electronics" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="fashion" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="beauty" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Seasonal Tab */}
        <TabsContent value="seasonal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Seasonal Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="electronics" fill="#8884d8" name="Electronics" />
                  <Bar dataKey="fashion" fill="#82ca9d" name="Fashion" />
                  <Line type="monotone" dataKey="beauty" stroke="#ff7300" strokeWidth={2} name="Beauty Trend" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Analysis by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Avg Price (৳)</TableHead>
                    <TableHead>Price Change</TableHead>
                    <TableHead>Demand Level</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceAnalysis.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>৳{item.avgPrice}</TableCell>
                      <TableCell>
                        <span className={item.priceChange > 0 ? 'text-red-600' : 'text-green-600'}>
                          {item.priceChange > 0 ? '+' : ''}{item.priceChange}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={item.demand === 'high' ? 'bg-red-100 text-red-800' : 
                                        item.demand === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-green-100 text-green-800'}>
                          {item.demand}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.demand === 'high' && item.priceChange < 0 ? (
                          <Badge className="bg-green-100 text-green-800">Increase Price</Badge>
                        ) : item.demand === 'low' && item.priceChange > 0 ? (
                          <Badge className="bg-blue-100 text-blue-800">Consider Discount</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Monitor</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Share Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={competitorAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                    >
                      {competitorAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorAnalysis.map((competitor, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{competitor.competitor}</h4>
                        <Badge>{competitor.marketShare}% share</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Growth: </span>
                          <span className="font-medium text-green-600">+{competitor.growth}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Strength: </span>
                          <span className="font-medium">{competitor.strength}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI Market Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Electronics Surge Expected</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        AI predicts 25% growth in electronics demand over next 3 months due to upcoming festival season.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900">Health & Beauty Opportunity</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Recommended to increase inventory for skincare products - 40% growth potential identified.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Fashion Slowdown Alert</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Fashion category showing signs of seasonal decline. Consider promotional campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Optimize Electronics Inventory
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Launch Beauty Campaign
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Monitor Fashion Trends
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Update Pricing Strategy
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
