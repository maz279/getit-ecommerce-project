
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, Award, TrendingUp, AlertTriangle, Save, Download, 
  FileText, BarChart3, Users, Package, Clock, DollarSign,
  Shield, CheckCircle, XCircle, Eye, MessageSquare, 
  RefreshCw, Filter, Search, Calendar
} from 'lucide-react';
import { VendorScorecardData } from './types';

interface VendorScorecardTabProps {
  scorecard: VendorScorecardData;
}

export const VendorScorecardTab: React.FC<VendorScorecardTabProps> = ({ scorecard }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState('techbd');
  const [newRating, setNewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Mock comprehensive vendor data (Amazon/Shopee level)
  const vendorDetails = {
    techbd: {
      name: 'TechBD Electronics',
      businessName: 'TechBD Solutions Ltd.',
      logo: '/api/placeholder/64/64',
      category: 'Electronics & Gadgets',
      joinDate: '2021-03-15',
      location: 'Dhaka, Bangladesh',
      overallScore: 9.2,
      tier: 'Premium Partner',
      certifications: ['ISO 9001', 'CE Certified', 'RoHS Compliant'],
      performanceMetrics: {
        orderFulfillment: 96.8,
        onTimeDelivery: 94.2,
        customerSatisfaction: 4.6,
        productQuality: 9.1,
        responsiveness: 92.5,
        compliance: 98.2
      },
      monthlyStats: {
        totalOrders: 2847,
        revenue: 45600000,
        returnRate: 1.2,
        disputes: 3,
        avgResponseTime: '2.3 hours',
        customerRating: 4.6
      },
      strengths: [
        'Excellent product quality',
        'Fast shipping',
        'Responsive customer service',
        'Wide product range'
      ],
      improvements: [
        'Packaging optimization',
        'Inventory management',
        'Price competitiveness'
      ],
      recentReviews: [
        { id: 1, rating: 5, text: 'Excellent quality products and fast delivery', date: '2024-01-15', customer: 'Ahmed K.' },
        { id: 2, rating: 4, text: 'Good service but could improve packaging', date: '2024-01-12', customer: 'Fatima S.' },
        { id: 3, rating: 5, text: 'Always reliable, highly recommended', date: '2024-01-10', customer: 'Mahmud R.' }
      ]
    }
  };

  const currentVendor = vendorDetails[selectedVendor as keyof typeof vendorDetails];

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      'Premium Partner': 'bg-purple-100 text-purple-800',
      'Gold Seller': 'bg-yellow-100 text-yellow-800',
      'Silver Seller': 'bg-gray-100 text-gray-800',
      'Bronze Seller': 'bg-orange-100 text-orange-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <Award className="h-6 w-6 mr-3 text-gold-600" />
                Vendor Scorecard Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive vendor performance evaluation and rating system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techbd">TechBD Electronics</SelectItem>
                  <SelectItem value="fashionista">Fashionista</SelectItem>
                  <SelectItem value="homeneeds">HomeNeeds</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vendor Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TB</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold">{currentVendor.name}</h2>
                  <p className="text-gray-600">{currentVendor.businessName}</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(currentVendor.overallScore)}`}>
                    {currentVendor.overallScore}/10
                  </div>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <Badge className={getTierBadge(currentVendor.tier)}>
                  {currentVendor.tier}
                </Badge>
                <span className="text-sm text-gray-600">{currentVendor.category}</span>
                <span className="text-sm text-gray-600">📍 {currentVendor.location}</span>
                <span className="text-sm text-gray-600">
                  Joined {new Date(currentVendor.joinDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{currentVendor.monthlyStats.customerRating}</span>
                  <span className="text-sm text-gray-500 ml-1">rating</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{currentVendor.monthlyStats.totalOrders.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">orders this month</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">৳{(currentVendor.monthlyStats.revenue / 1000000).toFixed(1)}M</span>
                  <span className="text-gray-500 ml-1">revenue</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="quality">Quality Assessment</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="improvement">Improvement Plan</TabsTrigger>
        </TabsList>

        {/* Performance Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(currentVendor.performanceMetrics).map(([key, value]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-lg font-bold">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentVendor.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentVendor.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center">
                      <XCircle className="h-4 w-4 text-orange-600 mr-2" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Key Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{currentVendor.monthlyStats.totalOrders.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">৳{(currentVendor.monthlyStats.revenue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{currentVendor.monthlyStats.returnRate}%</div>
                <div className="text-sm text-gray-600">Return Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{currentVendor.monthlyStats.disputes}</div>
                <div className="text-sm text-gray-600">Active Disputes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{currentVendor.monthlyStats.avgResponseTime}</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{currentVendor.monthlyStats.customerRating}</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Assessment Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assessment Form</CardTitle>
              <p className="text-sm text-gray-600">Evaluate vendor performance across key quality dimensions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Quality Rating</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (9-10)</SelectItem>
                      <SelectItem value="good">Good (7-8)</SelectItem>
                      <SelectItem value="average">Average (5-6)</SelectItem>
                      <SelectItem value="poor">Poor (1-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Quality Rating</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (9-10)</SelectItem>
                      <SelectItem value="good">Good (7-8)</SelectItem>
                      <SelectItem value="average">Average (5-6)</SelectItem>
                      <SelectItem value="poor">Poor (1-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Performance</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (9-10)</SelectItem>
                      <SelectItem value="good">Good (7-8)</SelectItem>
                      <SelectItem value="average">Average (5-6)</SelectItem>
                      <SelectItem value="poor">Poor (1-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Communication Quality</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (9-10)</SelectItem>
                      <SelectItem value="good">Good (7-8)</SelectItem>
                      <SelectItem value="average">Average (5-6)</SelectItem>
                      <SelectItem value="poor">Poor (1-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assessment Comments</label>
                <Textarea 
                  placeholder="Provide detailed feedback and recommendations..."
                  className="h-24"
                />
              </div>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Assessment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews & Ratings Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          star <= newRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => setNewRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Review Text</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this vendor..."
                    className="h-24"
                  />
                </div>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Review
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentVendor.recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.customer}</span>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Status Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Compliance & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentVendor.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvement Plan Tab */}
        <TabsContent value="improvement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Improvement Action Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority Area</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quality">Product Quality</SelectItem>
                      <SelectItem value="delivery">Delivery Performance</SelectItem>
                      <SelectItem value="service">Customer Service</SelectItem>
                      <SelectItem value="pricing">Pricing Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Completion</label>
                  <Input type="date" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Action Plan Details</label>
                <Textarea 
                  placeholder="Describe specific actions, milestones, and expected outcomes..."
                  className="h-32"
                />
              </div>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Create Improvement Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
