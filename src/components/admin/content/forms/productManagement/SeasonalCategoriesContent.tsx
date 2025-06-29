
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, Snowflake, Sun, Leaf, Plus, Search, Filter, 
  TrendingUp, Users, Package, DollarSign, Eye, Edit, 
  Trash2, Star, MapPin, Clock, Target, BarChart3,
  Activity, Globe, Zap, Gift, Heart,
  ShoppingBag, Award, Flag, Sparkles, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Cell, AreaChart, Area, Pie 
} from 'recharts';

export const SeasonalCategoriesContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for Bangladesh-specific seasonal categories
  const seasonalData = [
    { month: 'Jan', winter: 45000, summer: 12000, spring: 8000, festival: 15000, revenue: 80000 },
    { month: 'Feb', winter: 52000, summer: 15000, spring: 25000, festival: 18000, revenue: 110000 },
    { month: 'Mar', winter: 35000, summer: 28000, spring: 48000, festival: 22000, revenue: 133000 },
    { month: 'Apr', winter: 18000, summer: 65000, spring: 42000, festival: 85000, revenue: 210000 },
    { month: 'May', winter: 8000, summer: 85000, spring: 35000, festival: 45000, revenue: 173000 },
    { month: 'Jun', winter: 5000, summer: 95000, spring: 15000, festival: 25000, revenue: 140000 }
  ];

  const pieData = [
    { name: 'Winter', value: 30, fill: '#3B82F6' },
    { name: 'Summer', value: 35, fill: '#10B981' },
    { name: 'Festival', value: 25, fill: '#F59E0B' },
    { name: 'Spring', value: 10, fill: '#EF4444' }
  ];

  const festivalCategories = [
    { name: 'Eid Collection', period: 'Apr-Jun', revenue: '৳45.2L', growth: '+85%', vendors: 234 },
    { name: 'Durga Puja Special', period: 'Sep-Oct', revenue: '৳32.8L', growth: '+72%', vendors: 189 },
    { name: 'Pohela Boishakh', period: 'Apr', revenue: '৳18.5L', growth: '+95%', vendors: 156 },
    { name: 'Kali Puja Collection', period: 'Oct-Nov', revenue: '৳12.3L', growth: '+68%', vendors: 98 }
  ];

  const topPerformingCategories = [
    { name: 'Fashion & Apparel', sales: 1250, revenue: '৳28.5L', margin: '32%', trend: '+15%' },
    { name: 'Electronics', sales: 890, revenue: '৳52.3L', margin: '18%', trend: '+8%' },
    { name: 'Home & Living', sales: 765, revenue: '৳19.8L', margin: '28%', trend: '+22%' },
    { name: 'Beauty & Health', sales: 654, revenue: '৳15.2L', margin: '45%', trend: '+35%' },
    { name: 'Sports & Outdoor', sales: 432, revenue: '৳12.1L', margin: '25%', trend: '+12%' }
  ];

  const categoriesData = [
    { name: 'Winter Collection', namebn: 'শীতকালীন সংগ্রহ', icon: Snowflake, color: 'text-blue-500', bgColor: 'bg-blue-50', products: 234, sales: '৳12.5L', growth: '+15%' },
    { name: 'Summer Sale', namebn: 'গ্রীষ্মকালীন বিক্রয়', icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-50', products: 156, sales: '৳8.3L', growth: '+22%' },
    { name: 'Spring Special', namebn: 'বসন্ত বিশেষ', icon: Leaf, color: 'text-green-500', bgColor: 'bg-green-50', products: 89, sales: '৳5.1L', growth: '+8%' },
    { name: 'Eid Collection', namebn: 'ঈদ সংগ্রহ', icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-50', products: 312, sales: '৳25.8L', growth: '+85%' },
    { name: 'Puja Special', namebn: 'পূজা স্পেশাল', icon: Sparkles, color: 'text-pink-500', bgColor: 'bg-pink-50', products: 198, sales: '৳15.2L', growth: '+72%' },
    { name: 'Back to School', namebn: 'স্কুলে ফেরা', icon: Package, color: 'text-indigo-500', bgColor: 'bg-indigo-50', products: 145, sales: '৳9.7L', growth: '+18%' }
  ];

  const CreateSeasonalCategory = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Seasonal Category</h2>
          <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name (English)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Summer Collection 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category Name (Bengali)</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="গ্রীষ্মকালীন সংগ্রহ ২০২৫" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Season Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Winter Collection</option>
                <option>Summer Sale</option>
                <option>Spring Special</option>
                <option>Monsoon Collection</option>
                <option>Festival Season</option>
                <option>Year-end Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Festival Association</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>None</option>
                <option>Eid ul-Fitr</option>
                <option>Eid ul-Adha</option>
                <option>Durga Puja</option>
                <option>Kali Puja</option>
                <option>Pohela Boishakh</option>
                <option>Diwali</option>
                <option>Christmas</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Revenue (BDT)</label>
              <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="500000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
              <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="12" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Geographic Focus</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Bangladesh</option>
                <option>Dhaka Division</option>
                <option>Chittagong Division</option>
                <option>Rajshahi Division</option>
                <option>Khulna Division</option>
                <option>Barisal Division</option>
                <option>Sylhet Division</option>
                <option>Rangpur Division</option>
                <option>Mymensingh Division</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description (English)</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the seasonal category..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (Bengali)</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ঋতুভিত্তিক বিভাগের বর্ণনা..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Marketing Keywords</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="summer, fashion, sale, discount, trending" />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Create Category</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seasonal Categories Management</h1>
          <p className="text-gray-600 mt-1">Manage seasonal campaigns, festival collections, and performance analytics</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">৳1.2Cr</p>
                <p className="text-xs text-green-600">+18% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">+3 this week</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participating Vendors</p>
                <p className="text-2xl font-bold">856</p>
                <p className="text-xs text-green-600">+12% growth</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Conversion</p>
                <p className="text-2xl font-bold">4.8%</p>
                <p className="text-xs text-green-600">+0.5% improvement</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.7/5</p>
                <p className="text-xs text-green-600">+0.2 rating increase</p>
              </div>
              <Star className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'festivals', label: 'Festival Seasons', icon: Gift },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'vendors', label: 'Vendor Performance', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Seasonal Revenue Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`৳${(value/1000).toFixed(1)}K`, '']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Category Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Festival Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Bangladesh Festival Categories Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {festivalCategories.map((festival, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{festival.name}</h3>
                      <Flag className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{festival.period}</p>
                    <p className="text-lg font-bold text-green-600">{festival.revenue}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-green-600">{festival.growth}</span>
                      <span className="text-gray-600">{festival.vendors} vendors</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Seasons</option>
                <option>Winter</option>
                <option>Summer</option>
                <option>Spring</option>
                <option>Festival</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">24 categories found</span>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoriesData.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.namebn}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium">{category.products}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sales:</span>
                      <span className="font-medium text-green-600">{category.sales}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-medium text-green-600">{category.growth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{category.revenue}</p>
                        <p className="text-sm text-gray-600">{category.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="winter" fill="#3B82F6" name="Winter" />
                    <Bar dataKey="summer" fill="#10B981" name="Summer" />
                    <Bar dataKey="spring" fill="#F59E0B" name="Spring" />
                    <Bar dataKey="festival" fill="#EF4444" name="Festival" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab === 'festivals' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Festival Season Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Festival-specific category management and analytics will be displayed here...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Vendor participation and performance metrics will be displayed here...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateModal && <CreateSeasonalCategory />}
    </div>
  );
};