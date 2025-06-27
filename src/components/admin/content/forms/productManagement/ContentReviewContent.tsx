
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, AlertTriangle, CheckCircle, XCircle, Eye, Flag, 
  Search, Filter, Download, RefreshCw, MessageSquare, Edit,
  Star, ThumbsUp, ThumbsDown, Shield, Zap, Target, Clock
} from 'lucide-react';

interface ContentReviewItem {
  id: string;
  productName: string;
  vendor: string;
  contentType: 'description' | 'images' | 'specifications' | 'reviews';
  reviewType: 'manual' | 'ai-flagged' | 'user-reported';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  flaggedReason: string;
  submittedDate: string;
  reviewedBy?: string;
  content: string;
  aiConfidence?: number;
}

export const ContentReviewContent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for content review items
  const reviewItems: ContentReviewItem[] = [
    {
      id: '1',
      productName: 'Gaming Laptop Pro',
      vendor: 'TechZone BD',
      contentType: 'description',
      reviewType: 'ai-flagged',
      priority: 'high',
      status: 'pending',
      flaggedReason: 'Potentially misleading performance claims',
      submittedDate: '2024-01-15',
      content: 'Ultra-fast gaming laptop with UNLIMITED power and UNBEATABLE performance...',
      aiConfidence: 95
    },
    {
      id: '2',
      productName: 'Wireless Headphones',
      vendor: 'Audio World',
      contentType: 'images',
      reviewType: 'user-reported',
      priority: 'medium',
      status: 'reviewing',
      flaggedReason: 'Copyright infringement concern',
      submittedDate: '2024-01-14',
      reviewedBy: 'Sarah Content Reviewer',
      content: 'Product images may contain copyrighted brand logos',
      aiConfidence: 78
    },
    {
      id: '3',
      productName: 'Smart Watch Series X',
      vendor: 'Gadget Hub',
      contentType: 'specifications',
      reviewType: 'manual',
      priority: 'low',
      status: 'approved',
      flaggedReason: 'Routine specification review',
      submittedDate: '2024-01-13',
      reviewedBy: 'Mike Tech Reviewer',
      content: 'Technical specifications verified and approved'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'description': return <FileText className="h-4 w-4" />;
      case 'images': return <Eye className="h-4 w-4" />;
      case 'specifications': return <Target className="h-4 w-4" />;
      case 'reviews': return <Star className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 h-8 w-8 text-blue-600" />
              Content Review Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Product Moderation → Content Review
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              AI-powered content moderation and manual review system
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              AI Flagged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">42</div>
            <div className="text-sm text-gray-600">Avg confidence: 87%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flag className="h-4 w-4 mr-2" />
              User Reported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">18</div>
            <div className="text-sm text-gray-600">+2 from yesterday</div>
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
            <div className="text-2xl font-bold text-blue-600">15</div>
            <div className="text-sm text-gray-600">Manual review</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-600">92% approval rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">13</div>
            <div className="text-sm text-gray-600">Policy violations</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="review-queue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="review-queue">🔍 Review Queue</TabsTrigger>
          <TabsTrigger value="ai-moderation">🤖 AI Moderation</TabsTrigger>
          <TabsTrigger value="policy-violations">⚠️ Violations</TabsTrigger>
          <TabsTrigger value="content-guidelines">📋 Guidelines</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="review-queue">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Review Queue</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="description">Description</SelectItem>
                      <SelectItem value="images">Images</SelectItem>
                      <SelectItem value="specifications">Specifications</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{item.productName}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority} priority
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getContentTypeIcon(item.contentType)}
                            <span className="text-sm text-gray-600">{item.contentType}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Vendor</p>
                            <p className="font-medium">{item.vendor}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Review Type</p>
                            <p className="font-medium">{item.reviewType.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Submitted</p>
                            <p className="font-medium">{item.submittedDate}</p>
                          </div>
                          {item.aiConfidence && (
                            <div>
                              <p className="text-gray-600">AI Confidence</p>
                              <p className="font-medium text-purple-600">{item.aiConfidence}%</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-3">
                          <p className="text-sm text-yellow-700">
                            <strong>Flagged Reason:</strong> {item.flaggedReason}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                          <p className="text-sm text-gray-700">
                            <strong>Content Preview:</strong> {item.content}
                          </p>
                        </div>
                        
                        {item.reviewedBy && (
                          <p className="text-sm text-gray-600 mt-2">
                            Reviewed by: <span className="font-medium">{item.reviewedBy}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          Full View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-moderation">
          <Card>
            <CardHeader>
              <CardTitle>AI Moderation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Content Detection Rules</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Misleading Claims</span>
                        <Badge className="bg-red-100 text-red-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Copyright Infringement</span>
                        <Badge className="bg-red-100 text-red-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Inappropriate Language</span>
                        <Badge className="bg-red-100 text-red-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Spam Detection</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">AI Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Overall Accuracy</span>
                        <span className="font-medium text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>False Positive Rate</span>
                        <span className="font-medium text-orange-600">3.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Speed</span>
                        <span className="font-medium">1.2s avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Content Processed Today</span>
                        <span className="font-medium">2,847 items</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Configure AI Sensitivity</h3>
                  <p className="text-sm text-gray-600 mb-4">Adjust how strict the AI moderation should be.</p>
                  <div className="flex space-x-2">
                    <Button variant="outline">Conservative (High Precision)</Button>
                    <Button>Balanced (Recommended)</Button>
                    <Button variant="outline">Aggressive (High Recall)</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy-violations">
          <Card>
            <CardHeader>
              <CardTitle>Policy Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-red-50">
                    <h3 className="font-medium text-red-800 mb-2">Severe Violations</h3>
                    <p className="text-2xl font-bold text-red-600">5</p>
                    <p className="text-sm text-red-600">Require immediate action</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <h3 className="font-medium text-orange-800 mb-2">Moderate Violations</h3>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                    <p className="text-sm text-orange-600">Need review within 24h</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-medium text-yellow-800 mb-2">Minor Violations</h3>
                    <p className="text-2xl font-bold text-yellow-600">67</p>
                    <p className="text-sm text-yellow-600">Standard review queue</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Common Violation Types</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 border rounded">
                      <span>Misleading product information</span>
                      <Badge className="bg-red-100 text-red-800">34 cases</Badge>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Copyright/trademark issues</span>
                      <Badge className="bg-red-100 text-red-800">18 cases</Badge>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Inappropriate content</span>
                      <Badge className="bg-orange-100 text-orange-800">12 cases</Badge>
                    </div>
                    <div className="flex justify-between p-3 border rounded">
                      <span>Spam or duplicate content</span>
                      <Badge className="bg-yellow-100 text-yellow-800">31 cases</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content-guidelines">
          <Card>
            <CardHeader>
              <CardTitle>Content Guidelines & Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📝 Product Description Guidelines</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Must be accurate and factual</li>
                    <li>• No misleading claims or exaggerations</li>
                    <li>• Include key features and specifications</li>
                    <li>• Use clear, professional language</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🖼️ Image Content Guidelines</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• High-quality, clear product images</li>
                    <li>• No watermarks or copyright violations</li>
                    <li>• Multiple angles and close-up details</li>
                    <li>• Consistent lighting and background</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">⚠️ Prohibited Content</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Counterfeit or replica products</li>
                    <li>• Inappropriate or offensive content</li>
                    <li>• Misleading health claims</li>
                    <li>• Spam or duplicate listings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Content Review Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Review Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Reviews Today</span>
                      <span className="font-medium">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Review Time</span>
                      <span className="font-medium">4.2 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Rate</span>
                      <span className="font-medium text-green-600">91.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Accuracy</span>
                      <span className="font-medium text-purple-600">94.2%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Content Types Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Product Descriptions</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product Images</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Specifications</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Reviews</span>
                      <span className="font-medium">8%</span>
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
