
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, Eye, Edit, MessageSquare,
  Search, Filter, Download, RefreshCw, Calendar, User, Package,
  Star, Flag, ArrowRight, MoreHorizontal, FileText, Image, Tag,
  TrendingUp, Clock, Award, Target, Settings
} from 'lucide-react';

interface QualityIssue {
  id: string;
  productName: string;
  vendor: string;
  category: string;
  issueType: 'image-quality' | 'description-accuracy' | 'specification-mismatch' | 'policy-violation';
  severity: 'high' | 'medium' | 'low';
  reportedDate: string;
  status: 'open' | 'in-review' | 'resolved' | 'escalated';
  assignedTo?: string;
  description: string;
  images: number;
  price: number;
}

export const QualityControlContent: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for quality control issues
  const qualityIssues: QualityIssue[] = [
    {
      id: '1',
      productName: 'Wireless Bluetooth Headphones',
      vendor: 'AudioTech Solutions',
      category: 'Electronics > Audio',
      issueType: 'image-quality',
      severity: 'high',
      reportedDate: '2024-01-15',
      status: 'open',
      assignedTo: 'Sarah QC',
      description: 'Product images are blurry and do not show actual product details clearly',
      images: 3,
      price: 2500
    },
    {
      id: '2',
      productName: 'Cotton Summer Dress',
      vendor: 'Fashion Forward Ltd',
      category: 'Fashion > Women\'s Clothing',
      issueType: 'description-accuracy',
      severity: 'medium',
      reportedDate: '2024-01-14',
      status: 'in-review',
      assignedTo: 'Mike QC',
      description: 'Product description mentions premium cotton but fabric composition shows blend',
      images: 6,
      price: 1200
    },
    {
      id: '3',
      productName: 'Gaming Mechanical Keyboard',
      vendor: 'GameZone Electronics',
      category: 'Electronics > Computer Accessories',
      issueType: 'specification-mismatch',
      severity: 'high',
      reportedDate: '2024-01-13',
      status: 'escalated',
      description: 'Listed as RGB backlit but customer reports no lighting functionality',
      images: 8,
      price: 4500
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueTypeLabel = (type: string) => {
    switch (type) {
      case 'image-quality': return 'Image Quality';
      case 'description-accuracy': return 'Description Accuracy';
      case 'specification-mismatch': return 'Specification Mismatch';
      case 'policy-violation': return 'Policy Violation';
      default: return type;
    }
  };

  const handleResolve = (issueId: string) => {
    console.log('Resolving issue:', issueId);
  };

  const handleEscalate = (issueId: string) => {
    console.log('Escalating issue:', issueId);
  };

  const handleAssign = (issueId: string) => {
    console.log('Assigning issue:', issueId);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="mr-3 h-8 w-8 text-blue-600" />
              Quality Control Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Product Moderation → Quality Control
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              Monitor and manage product quality standards
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Open Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">42</div>
            <div className="text-sm text-gray-600">+8 from yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">18</div>
            <div className="text-sm text-gray-600">Average: 1.5 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">24</div>
            <div className="text-sm text-gray-600">89% resolution rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92.5%</div>
            <div className="text-sm text-gray-600">+2.1% this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="issues-list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="issues-list">🔍 Issues List</TabsTrigger>
          <TabsTrigger value="quality-metrics">📊 Quality Metrics</TabsTrigger>
          <TabsTrigger value="inspector-performance">👥 Inspector Performance</TabsTrigger>
          <TabsTrigger value="quality-standards">📋 Quality Standards</TabsTrigger>
          <TabsTrigger value="reports">📈 Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="issues-list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quality Control Issues</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search issues..."
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
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{issue.productName}</h3>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity} severity
                          </Badge>
                          <Badge variant="outline">
                            {getIssueTypeLabel(issue.issueType)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Vendor</p>
                            <p className="font-medium">{issue.vendor}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Category</p>
                            <p className="font-medium">{issue.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium text-green-600">৳{issue.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Reported</p>
                            <p className="font-medium">{issue.reportedDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Image className="h-4 w-4 mr-1" />
                            {issue.images} images
                          </span>
                          {issue.assignedTo && (
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              Assigned to: {issue.assignedTo}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleResolve(issue.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleEscalate(issue.id)}>
                          <Flag className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAssign(issue.id)}>
                          <User className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality-metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Quality Score</span>
                    <span className="text-2xl font-bold text-green-600">92.5%</span>
                  </div>
                  <Progress value={92.5} className="h-3" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Image Quality</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={89} className="h-2 w-24" />
                        <span className="text-sm font-medium">89%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Description Accuracy</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={94} className="h-2 w-24" />
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Specification Match</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={91} className="h-2 w-24" />
                        <span className="text-sm font-medium">91%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Policy Compliance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={96} className="h-2 w-24" />
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Image Quality Issues</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full w-12"></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Description Issues</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-10"></div>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Spec Mismatches</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-8"></div>
                      </div>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Policy Violations</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full w-6"></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspector-performance">
          <Card>
            <CardHeader>
              <CardTitle>Quality Inspector Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah QC', resolved: 156, accuracy: 96.5, avgTime: '2.3 hours' },
                  { name: 'Mike QC', resolved: 142, accuracy: 94.2, avgTime: '2.8 hours' },
                  { name: 'Lisa QC', resolved: 138, accuracy: 97.1, avgTime: '2.1 hours' },
                  { name: 'John QC', resolved: 129, accuracy: 93.8, avgTime: '3.2 hours' }
                ].map((inspector, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{inspector.name}</p>
                        <p className="text-sm text-gray-600">{inspector.resolved} issues resolved</p>
                      </div>
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Accuracy</p>
                        <p className="font-medium text-green-600">{inspector.accuracy}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Avg Time</p>
                        <p className="font-medium">{inspector.avgTime}</p>
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
              <CardTitle>Quality Standards & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Image Quality Standards</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="font-medium text-green-800">Minimum Resolution</p>
                      <p className="text-sm text-green-700">800x800 pixels minimum, 1200x1200 recommended</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="font-medium text-blue-800">Image Clarity</p>
                      <p className="text-sm text-blue-700">Clear focus, proper lighting, no blur or distortion</p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <p className="font-medium text-purple-800">Background Standards</p>
                      <p className="text-sm text-purple-700">Clean white/neutral background preferred</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Content Requirements</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                      <p className="font-medium text-orange-800">Description Accuracy</p>
                      <p className="text-sm text-orange-700">Must match actual product specifications</p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="font-medium text-red-800">Prohibited Content</p>
                      <p className="text-sm text-red-700">No misleading claims, false information, or inappropriate content</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="font-medium text-gray-800">Compliance Requirements</p>
                      <p className="text-sm text-gray-700">Must meet platform policies and local regulations</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Daily Quality Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Issues Identified</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issues Resolved</span>
                      <span className="font-medium text-green-600">98</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolution Rate</span>
                      <span className="font-medium">77.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Resolution Time</span>
                      <span className="font-medium">2.4 hours</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Top Issue Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Image Quality</span>
                      <span className="font-medium">42 issues</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Description Mismatch</span>
                      <span className="font-medium">31 issues</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spec Inconsistency</span>
                      <span className="font-medium">28 issues</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Violations</span>
                      <span className="font-medium">26 issues</span>
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
