
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, Package, Star, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for seasonal categories
const seasonalData = [
  {
    id: 1,
    season: 'Winter',
    category: 'Warm Clothing',
    revenue: '৳2,500,000',
    revenueValue: 2500000,
    growth: '+15%',
    growthValue: 15,
    products: 450,
    avgRating: 4.5,
    status: 'active'
  },
  {
    id: 2,
    season: 'Summer',
    category: 'Light Fabrics',
    revenue: '৳1,800,000',
    revenueValue: 1800000,
    growth: '+8%',
    growthValue: 8,
    products: 320,
    avgRating: 4.2,
    status: 'active'
  },
  {
    id: 3,
    season: 'Monsoon',
    category: 'Rain Gear',
    revenue: '৳950,000',
    revenueValue: 950000,
    growth: '+25%',
    growthValue: 25,
    products: 180,
    avgRating: 4.0,
    status: 'active'
  },
  {
    id: 4,
    season: 'Eid',
    category: 'Festival Wear',
    revenue: '৳3,200,000',
    revenueValue: 3200000,
    growth: '+30%',
    growthValue: 30,
    products: 600,
    avgRating: 4.7,
    status: 'active'
  },
  {
    id: 5,
    season: 'Durga Puja',
    category: 'Traditional Wear',
    revenue: '৳1,400,000',
    revenueValue: 1400000,
    growth: '+20%',
    growthValue: 20,
    products: 280,
    avgRating: 4.4,
    status: 'active'
  }
];

export const SeasonalCategoriesContent: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    season: '',
    category: '',
    startDate: '',
    endDate: '',
    targetRevenue: '',
    description: ''
  });

  const filteredData = selectedSeason === 'all' 
    ? seasonalData 
    : seasonalData.filter(item => item.season.toLowerCase() === selectedSeason.toLowerCase());

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenueValue, 0);
  const totalProducts = filteredData.reduce((sum, item) => sum + item.products, 0);
  const avgGrowth = filteredData.reduce((sum, item) => sum + item.growthValue, 0) / filteredData.length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowAddForm(false);
    setFormData({
      season: '',
      category: '',
      startDate: '',
      endDate: '',
      targetRevenue: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seasonal Categories</h1>
          <p className="text-gray-600">Manage seasonal product categories and performance</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Seasonal Category
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Across all seasons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-muted-foreground">Seasonal categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Products listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{avgGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average growth rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Categories Overview</CardTitle>
              <div className="flex items-center gap-4">
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Seasons</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="monsoon">Monsoon</SelectItem>
                    <SelectItem value="eid">Eid</SelectItem>
                    <SelectItem value="durga puja">Durga Puja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.season}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.avgRating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{item.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="font-semibold">{item.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Growth</span>
                        <span className="font-semibold text-green-600">{item.growth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Products</span>
                        <span className="font-semibold">{item.products}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Top Performing Seasons</h3>
                    {seasonalData
                      .sort((a, b) => b.revenueValue - a.revenueValue)
                      .slice(0, 3)
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{item.season}</div>
                              <div className="text-sm text-gray-600">{item.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{item.revenue}</div>
                            <div className="text-sm text-green-600">{item.growth}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Growth Trends</h3>
                    {seasonalData
                      .sort((a, b) => b.growthValue - a.growthValue)
                      .slice(0, 3)
                      .map((item) => (
                        <div key={item.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">{item.season} - {item.category}</span>
                            <span className="text-sm font-semibold">{item.growth}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(item.growthValue * 2, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Trends & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Upcoming Seasons</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Winter Collection</h4>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Prepare for winter clothing demand increase</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">November - February</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Market Insights</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Festival Season Peak</div>
                      <div className="text-sm text-blue-600">Eid collections show 30% higher conversion rates</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Monsoon Opportunity</div>
                      <div className="text-sm text-green-600">Rain gear category has untapped potential</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Seasonal Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Select value={formData.season} onValueChange={(value) => handleInputChange('season', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="monsoon">Monsoon</SelectItem>
                          <SelectItem value="eid">Eid</SelectItem>
                          <SelectItem value="durga-puja">Durga Puja</SelectItem>
                          <SelectItem value="pahela-baishakh">Pahela Baishakh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category Name</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetRevenue">Target Revenue (৳)</Label>
                      <Input
                        id="targetRevenue"
                        type="number"
                        value={formData.targetRevenue}
                        onChange={(e) => handleInputChange('targetRevenue', e.target.value)}
                        placeholder="Enter target revenue"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter category description"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Add Category</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seasonalData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.season}</Badge>
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="text-sm text-gray-600">{item.revenue} • {item.products} products</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
