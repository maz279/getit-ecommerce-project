
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, Star, Target, 
  Search, Filter, Download, RefreshCw, Eye, Settings, BarChart3,
  Award, Zap, TrendingUp, Clock, Users, Package, ThumbsUp
} from 'lucide-react';

interface QualityControlItem {
  id: string;
  productName: string;
  vendor: string;
  category: string;
  qualityScore: number;
  status: 'pending' | 'in-progress' | 'passed' | 'failed' | 'needs-improvement';
  checkpoints: {
    imageQuality: number;
    descriptionAccuracy: number;
    specificationCompleteness: number;
    pricingConsistency: number;
    categoryPlacement: number;
  };
  issues: string[];
  submittedDate: string;
  reviewedBy?: string;
  priority: 'high' | 'medium' | 'low';
}

export const QualityControlContent: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for quality control items
  const qualityItems: QualityControlItem[] = [
    {
      id: '1',
      productName: 'Professional DSLR Camera',
      vendor: 'Camera World BD',
      category: 'Electronics > Cameras',
      qualityScore: 92,
      status: 'passed',
      checkpoints: {
        imageQuality: 95,
        descriptionAccuracy: 90,
        specificationCompleteness: 88,
        pricingConsistency: 94,
        categoryPlacement: 93
      },
      issues: [],
      submittedDate: '2024-01-15',
      reviewedBy: 'Alex Quality Inspector',
      priority: 'high'
    },
    {
      id: '2',
      productName: 'Bluetooth Speaker Set',
      vendor: 'Audio Excellence',
      category: 'Electronics > Audio',
      qualityScore: 67,
      status: 'needs-improvement',
      checkpoints: {
        imageQuality: 75,
        descriptionAccuracy: 60,
        specificationCompleteness: 55,
        pricingConsistency: 80,
        categoryPlacement: 65
      },
      issues: [
        'Product images are blurry',
        'Missing technical specifications',
        'Description contains typos'
      ],
      submittedDate: '2024-01-14',
      priority: 'medium'
    },
    {
      id: '3',
      productName: 'Gaming Keyboard RGB',
      vendor: 'Gaming Gear Pro',
      category: 'Electronics > Gaming',
      qualityScore: 43,
      status: 'failed',
      checkpoints: {
        imageQuality: 40,
        descriptionAccuracy: 35,
        specificationCompleteness: 50,
        pricingConsistency: 45,
        categoryPlacement: 45
      },
      issues: [
        'Poor quality product images',
        'Misleading product description',
        'Incomplete technical specifications',
        'Price inconsistency with market standards'
      ],
      submittedDate: '2024-01-13',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'needs-improvement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQualityGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="mr-3 h-8 w-8 text-green-600" />
              Quality Control Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Product Moderation → Quality Control
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Automated quality assessment and manual verification system
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Quality Standards
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-gray-600">Quality checked</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Passed QC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2,456</div>
            <div className="text-sm text-gray-600">86.3% pass rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">287</div>
            <div className="text-sm text-gray-600">Minor issues found</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Failed QC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">104</div>
            <div className="text-sm text-gray-600">Major issues found</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Avg Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">84.2</div>
            <div className="text-sm text-gray-600">Grade: A</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="quality-overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quality-overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="inspection-queue">🔍 Inspection Queue</TabsTrigger>
          <TabsTrigger value="quality-standards">📋 Standards</TabsTrigger>
          <TabsTrigger value="performance-metrics">📈 Metrics</TabsTrigger>
          <TabsTrigger value="automation-rules">⚙️ Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="quality-overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Grade A+ (90-100)</span>
                      <span className="font-medium text-green-600">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Grade A (80-89)</span>
                      <span className="font-medium text-green-600">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Grade B (60-79)</span>
                      <span className="font-medium text-orange-600">18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Grade C-F (0-59)</span>
                      <span className="font-medium text-red-600">6%</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Quality Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Common Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">Poor image quality</span>
                    <Badge className="bg-red-100 text-red-800">287 cases</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">Incomplete descriptions</span>
                    <Badge className="bg-orange-100 text-orange-800">156 cases</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">Missing specifications</span>
                    <Badge className="bg-orange-100 text-orange-800">134 cases</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">Pricing inconsistencies</span>
                    <Badge className="bg-yellow-100 text-yellow-800">89 cases</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">Wrong categorization</span>
                    <Badge className="bg-yellow-100 text-yellow-800">67 cases</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspection-queue">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quality Inspection Queue</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{item.productName}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('-', ' ')}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span className={`font-bold ${getQualityScoreColor(item.qualityScore)}`}>
                              {item.qualityScore} ({getQualityGrade(item.qualityScore)})
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Vendor</p>
                            <p className="font-medium">{item.vendor}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Category</p>
                            <p className="font-medium">{item.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Priority</p>
                            <p className="font-medium">{item.priority}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Submitted</p>
                            <p className="font-medium">{item.submittedDate}</p>
                          </div>
                        </div>
                        
                        {/* Quality Checkpoints */}
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <h4 className="font-medium text-sm mb-2">Quality Checkpoints:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                            <div className="text-center">
                              <p className="text-gray-600">Images</p>
                              <p className={`font-bold ${getQualityScoreColor(item.checkpoints.imageQuality)}`}>
                                {item.checkpoints.imageQuality}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Description</p>
                              <p className={`font-bold ${getQualityScoreColor(item.checkpoints.descriptionAccuracy)}`}>
                                {item.checkpoints.descriptionAccuracy}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Specs</p>
                              <p className={`font-bold ${getQualityScoreColor(item.checkpoints.specificationCompleteness)}`}>
                                {item.checkpoints.specificationCompleteness}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Pricing</p>
                              <p className={`font-bold ${getQualityScoreColor(item.checkpoints.pricingConsistency)}`}>
                                {item.checkpoints.pricingConsistency}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Category</p>
                              <p className={`font-bold ${getQualityScoreColor(item.checkpoints.categoryPlacement)}`}>
                                {item.checkpoints.categoryPlacement}%
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Issues */}
                        {item.issues.length > 0 && (
                          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
                            <h4 className="font-medium text-red-800 text-sm mb-2">Issues Found:</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              {item.issues.map((issue, index) => (
                                <li key={index}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {item.reviewedBy && (
                          <p className="text-sm text-gray-600">
                            Reviewed by: <span className="font-medium">{item.reviewedBy}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pass
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Fail
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Flag Issues
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          Inspect
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality-standards">
          <Card>
            <CardHeader>
              <CardTitle>Quality Standards Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Image Quality Standards</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Minimum Resolution</span>
                        <span className="font-medium">800x600 px</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Image Clarity Score</span>
                        <span className="font-medium">≥ 7.5/10</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Background Quality</span>
                        <span className="font-medium">Professional</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Multiple Angles</span>
                        <span className="font-medium">≥ 3 images</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Content Quality Standards</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Description Length</span>
                        <span className="font-medium">≥ 100 words</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Specification Completeness</span>
                        <span className="font-medium">≥ 80%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Grammar Score</span>
                        <span className="font-medium">≥ 8.0/10</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Factual Accuracy</span>
                        <span className="font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Quality Scoring Algorithm</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure how different quality factors are weighted in the overall score.</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">Images</p>
                      <p className="text-lg font-bold text-blue-600">30%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-lg font-bold text-blue-600">25%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Specifications</p>
                      <p className="text-lg font-bold text-blue-600">20%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Pricing</p>
                      <p className="text-lg font-bold text-blue-600">15%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Categorization</p>
                      <p className="text-lg font-bold text-blue-600">10%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance-metrics">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Daily Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Products Inspected</span>
                      <span className="font-medium">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Inspection Time</span>
                      <span className="font-medium">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass Rate</span>
                      <span className="font-medium text-green-600">86.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Quality Score</span>
                      <span className="font-medium text-blue-600">84.2</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Quality Trends</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Weekly Improvement</span>
                      <span className="font-medium text-green-600">+3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Improvement</span>
                      <span className="font-medium text-green-600">+8.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Category</span>
                      <span className="font-medium">Electronics (89.2)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Needs Attention</span>
                      <span className="font-medium text-orange-600">Fashion (73.4)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation-rules">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Auto-Pass Rules</h3>
                  <p className="text-sm text-gray-600 mb-4">Products meeting these criteria will automatically pass QC.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Quality Score ≥ 90 + Trusted Vendor</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">All checkpoints ≥ 85%</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Auto-Flag Rules</h3>
                  <p className="text-sm text-gray-600 mb-4">Products meeting these criteria will be automatically flagged for manual review.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Quality Score < 60</span>
                      <Badge className="bg-red-100 text-red-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Any checkpoint < 50%</span>
                      <Badge className="bg-red-100 text-red-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm">New vendor (< 10 products)</span>
                      <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Notification Rules</h3>
                  <p className="text-sm text-gray-600 mb-4">Automated notifications for quality events.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Notify vendor on QC failure</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Weekly quality report to vendors</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
