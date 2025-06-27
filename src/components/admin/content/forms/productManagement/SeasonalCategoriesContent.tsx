
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Snowflake, Sun, Flower, Leaf, Gift, Heart, 
  TrendingUp, TrendingDown, ShoppingCart, Eye, DollarSign, 
  Users, Target, Filter, Download, RefreshCw, Plus, Edit,
  BarChart3, PieChart, Clock, Star, AlertTriangle
} from 'lucide-react';

interface SeasonData {
  name: string;
  icon: React.ReactNode;
  color: string;
  period: string;
  revenue: number;
  orders: number;
  growth: number;
  status: 'active' | 'upcoming' | 'ended';
  categories: string[];
}

export const SeasonalCategoriesContent: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Mock seasonal data
  const seasonalData: SeasonData[] = [
    {
      name: 'Winter Collection',
      icon: <Snowflake className="h-5 w-5" />,
      color: 'bg-blue-500',
      period: 'Dec - Feb',
      revenue: 2450000,
      orders: 12567,
      growth: 18.5,
      status: 'active',
      categories: ['Winter Clothing', 'Heaters', 'Hot Beverages', 'Blankets']
    },
    {
      name: 'Valentine Special',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-red-500',
      period: 'Feb 1-14',
      revenue: 890000,
      orders: 5432,
      growth: 45.2,
      status: 'upcoming',
      categories: ['Gifts', 'Flowers', 'Jewelry', 'Chocolates']
    },
    {
      name: 'Spring Festival',
      icon: <Flower className="h-5 w-5" />,
      color: 'bg-green-500',
      period: 'Mar - May',
      revenue: 1680000,
      orders: 8904,
      growth: 12.3,
      status: 'upcoming',
      categories: ['Gardening', 'Spring Fashion', 'Outdoor Gear']
    },
    {
      name: 'Summer Sale',
      icon: <Sun className="h-5 w-5" />,
      color: 'bg-yellow-500',
      period: 'Jun - Aug',
      revenue: 3200000,
      orders: 18967,
      growth: 22.1,
      status: 'ended',
      categories: ['Summer Clothing', 'Swimwear', 'AC Units', 'Beach Gear']
    }
  ];

  const festivalCategories = [
    { name: 'Eid Collection', products: 2341, revenue: 1200000, growth: 25.4, trending: true },
    { name: 'Durga Puja', products: 1876, revenue: 890000, growth: 18.7, trending: true },
    { name: 'Christmas Decor', products: 3245, revenue: 1560000, growth: -5.2, trending: false },
    { name: 'New Year Items', products: 1654, revenue: 567000, growth: 35.8, trending: true },
    { name: 'Pohela Boishakh', products: 987, revenue: 345000, growth: 42.1, trending: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-purple-600" />
              Seasonal Categories Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Category Management → Seasonal Categories
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Comprehensive seasonal merchandising and festival category optimization
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Season
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Seasonal Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳8.22M</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+24.5% vs last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Seasonal Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,870</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+19.3% vs last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Active Seasons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600">2 upcoming campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Avg. Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.8%</div>
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">+1.2% vs regular</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="seasons">🗓️ Seasons</TabsTrigger>
          <TabsTrigger value="festivals">🎉 Festivals</TabsTrigger>
          <TabsTrigger value="campaigns">📢 Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
          <TabsTrigger value="planning">📋 Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Seasonal Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Active Seasonal Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seasonalData.filter(season => season.status === 'active').map((season, index) => (
                    <div key={season.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 ${season.color} rounded-full text-white`}>
                          {season.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{season.name}</h4>
                          <p className="text-sm text-gray-600">{season.period}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">৳{season.revenue.toLocaleString()}</p>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">+{season.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Festival Categories Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Festival Categories Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {festivalCategories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{category.name}</span>
                          {category.trending && <Badge className="bg-orange-100 text-orange-800">Trending</Badge>}
                        </div>
                        <div className="flex items-center space-x-1">
                          {category.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.growth > 0 ? '+' : ''}{category.growth}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Products</p>
                          <p className="font-semibold">{category.products.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-semibold">৳{(category.revenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Growth</p>
                          <Progress value={Math.abs(category.growth)} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seasons">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Collections Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {seasonalData.map((season) => (
                  <div key={season.name} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-12 h-12 ${season.color} rounded-full text-white`}>
                          {season.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{season.name}</h3>
                          <p className="text-sm text-gray-600">{season.period}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(season.status)}>
                          {season.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold">৳{season.revenue.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="text-xl font-bold">{season.orders.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Growth</p>
                        <p className="text-xl font-bold text-green-600">+{season.growth}%</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Categories</p>
                        <p className="text-xl font-bold">{season.categories.length}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {season.categories.map((category) => (
                          <Badge key={category} variant="outline">{category}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="festivals">
          <Card>
            <CardHeader>
              <CardTitle>Festival Categories Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Upcoming Festivals</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Festival Category
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {festivalCategories.map((festival) => (
                    <Card key={festival.name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          {festival.name}
                          {festival.trending && <Star className="h-4 w-4 text-yellow-500" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Products:</span>
                            <span className="font-medium">{festival.products.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Revenue:</span>
                            <span className="font-medium">৳{(festival.revenue / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Growth:</span>
                            <div className="flex items-center space-x-1">
                              {festival.growth > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className={`text-sm font-medium ${festival.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {festival.growth > 0 ? '+' : ''}{festival.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Campaign Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Campaign management tools and seasonal promotion planning will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed seasonal performance analytics and trend insights will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Planning & Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Seasonal inventory planning and demand forecasting tools will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
