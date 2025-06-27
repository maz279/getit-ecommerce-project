
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  XCircle, AlertTriangle, RotateCcw, Eye, MessageSquare, FileText,
  Search, Filter, Download, RefreshCw, Calendar, Clock, User,
  TrendingDown, AlertOctagon, ThumbsDown, Archive, Trash2, Edit
} from 'lucide-react';

interface RejectedProduct {
  id: string;
  productName: string;
  vendor: string;
  category: string;
  rejectionReason: string;
  rejectionCategory: 'quality' | 'policy' | 'content' | 'technical' | 'legal';
  rejectedDate: string;
  rejectedBy: string;
  resubmissionCount: number;
  status: 'rejected' | 'pending-appeal' | 'appeal-approved' | 'permanently-rejected';
  originalSubmissionDate: string;
  vendorResponse?: string;
  appealDate?: string;
  reviewNotes: string;
  canResubmit: boolean;
  images: number;
  price: number;
}

export const RejectedProductsContent: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<RejectedProduct | null>(null);

  // Mock data for rejected products
  const rejectedProducts: RejectedProduct[] = [
    {
      id: '1',
      productName: 'Fake Designer Handbag',
      vendor: 'Fashion Replica Store',
      category: 'Fashion > Bags',
      rejectionReason: 'Counterfeit product - violates intellectual property rights',
      rejectionCategory: 'legal',
      rejectedDate: '2024-01-15',
      rejectedBy: 'Legal Compliance Team',
      resubmissionCount: 0,
      status: 'permanently-rejected',
      originalSubmissionDate: '2024-01-10',
      reviewNotes: 'Product is a clear replica of branded designer bag. Permanently rejected due to IP violation.',
      canResubmit: false,
      images: 5,
      price: 2500
    },
    {
      id: '2',
      productName: 'Ultra Power Energy Drink',
      vendor: 'Health Boost Co',
      category: 'Food & Beverages > Drinks',
      rejectionReason: 'Misleading health claims without proper certification',
      rejectionCategory: 'policy',
      rejectedDate: '2024-01-14',
      rejectedBy: 'Content Review Team',
      resubmissionCount: 1,
      status: 'pending-appeal',
      originalSubmissionDate: '2024-01-08',
      reviewNotes: 'Product claims to cure diseases without FDA approval. Vendor can resubmit with corrected claims.',
      canResubmit: true,
      images: 3,
      price: 450,
      vendorResponse: 'We will remove health claims and resubmit with corrected description.',
      appealDate: '2024-01-16'
    },
    {
      id: '3',
      productName: 'Gaming Headset Pro',
      vendor: 'Audio Tech BD',
      category: 'Electronics > Audio',
      rejectionReason: 'Poor product images and incomplete specifications',
      rejectionCategory: 'quality',
      rejectedDate: '2024-01-13',
      rejectedBy: 'Quality Control Team',
      resubmissionCount: 2,
      status: 'rejected',
      originalSubmissionDate: '2024-01-05',
      reviewNotes: 'Images are blurry and technical specifications are missing. This is the second rejection.',
      canResubmit: true,
      images: 2,
      price: 3200
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending-appeal': return 'bg-yellow-100 text-yellow-800';
      case 'appeal-approved': return 'bg-green-100 text-green-800';
      case 'permanently-rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRejectionCategoryColor = (category: string) => {
    switch (category) {
      case 'quality': return 'bg-orange-100 text-orange-800';
      case 'policy': return 'bg-red-100 text-red-800';
      case 'content': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'legal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAllowResubmission = (productId: string) => {
    console.log('Allowing resubmission for product:', productId);
    // Implementation for allowing resubmission
  };

  const handlePermanentReject = (productId: string) => {
    console.log('Permanently rejecting product:', productId);
    // Implementation for permanent rejection
  };

  const handleApproveAppeal = (productId: string) => {
    console.log('Approving appeal for product:', productId);
    // Implementation for approving appeal
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <XCircle className="mr-3 h-8 w-8 text-red-600" />
              Rejected Products Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Product Moderation → Rejected Products
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Manage rejected products and appeal processes
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Total Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1,247</div>
            <div className="text-sm text-gray-600">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pending Appeals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">89</div>
            <div className="text-sm text-gray-600">Awaiting review</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <RotateCcw className="h-4 w-4 mr-2" />
              Resubmissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-2" />
              Rejection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8.4%</div>
            <div className="text-sm text-gray-600">-1.2% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Archive className="h-4 w-4 mr-2" />
              Permanent Bans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">45</div>
            <div className="text-sm text-gray-600">IP violations</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rejected-list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rejected-list">📋 Rejected List</TabsTrigger>
          <TabsTrigger value="appeals">⚖️ Appeals</TabsTrigger>
          <TabsTrigger value="rejection-reasons">📊 Reasons</TabsTrigger>
          <TabsTrigger value="vendor-communication">💬 Communication</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rejected-list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rejected Products</CardTitle>
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
                  <Select value={selectedReason} onValueChange={setSelectedReason}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reasons</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="pending-appeal">Pending Appeal</SelectItem>
                      <SelectItem value="appeal-approved">Appeal Approved</SelectItem>
                      <SelectItem value="permanently-rejected">Permanently Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{product.productName}</h3>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getRejectionCategoryColor(product.rejectionCategory)}>
                            {product.rejectionCategory}
                          </Badge>
                          {product.resubmissionCount > 0 && (
                            <Badge variant="outline">
                              Resubmission #{product.resubmissionCount}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Vendor</p>
                            <p className="font-medium">{product.vendor}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Category</p>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium text-green-600">৳{product.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rejected Date</p>
                            <p className="font-medium">{product.rejectedDate}</p>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
                          <p className="text-sm text-red-700">
                            <strong>Rejection Reason:</strong> {product.rejectionReason}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300 mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Review Notes:</strong> {product.reviewNotes}
                          </p>
                        </div>
                        
                        {product.vendorResponse && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                            <p className="text-sm text-blue-700">
                              <strong>Vendor Response:</strong> {product.vendorResponse}
                            </p>
                            {product.appealDate && (
                              <p className="text-xs text-blue-600 mt-1">
                                Appeal submitted on: {product.appealDate}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Rejected by: {product.rejectedBy}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Original submission: {product.originalSubmissionDate}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {product.images} images
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {product.status === 'pending-appeal' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveAppeal(product.id)}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Approve Appeal
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handlePermanentReject(product.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny Appeal
                            </Button>
                          </>
                        )}
                        {product.canResubmit && product.status === 'rejected' && (
                          <Button size="sm" variant="outline" onClick={() => handleAllowResubmission(product.id)}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Allow Resubmit
                          </Button>
                        )}
                        {product.status !== 'permanently-rejected' && (
                          <Button size="sm" variant="destructive" onClick={() => handlePermanentReject(product.id)}>
                            <AlertOctagon className="h-4 w-4 mr-1" />
                            Permanent Ban
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Vendor
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appeals">
          <Card>
            <CardHeader>
              <CardTitle>Appeal Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-medium text-yellow-800 mb-2">Pending Appeals</h3>
                    <p className="text-2xl font-bold text-yellow-600">89</p>
                    <p className="text-sm text-yellow-600">Awaiting review</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h3 className="font-medium text-green-800 mb-2">Appeals Approved</h3>
                    <p className="text-2xl font-bold text-green-600">156</p>
                    <p className="text-sm text-green-600">This month</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50">
                    <h3 className="font-medium text-red-800 mb-2">Appeals Denied</h3>
                    <p className="text-2xl font-bold text-red-600">34</p>
                    <p className="text-sm text-red-600">This month</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Appeal Processing Guidelines</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Quality Issues</h4>
                      <p className="text-sm text-gray-600">Can be appealed with improved images/descriptions</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Policy Violations</h4>
                      <p className="text-sm text-gray-600">May be appealed with corrected content</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Legal Issues</h4>
                      <p className="text-sm text-gray-600">Usually permanent, appeals rarely approved</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Bulk Appeal Actions</h3>
                  <p className="text-sm text-gray-600 mb-4">Process multiple appeals at once.</p>
                  <div className="flex space-x-2">
                    <Button variant="outline">Select Multiple (0 selected)</Button>
                    <Button>Bulk Approve</Button>
                    <Button variant="destructive">Bulk Deny</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejection-reasons">
          <Card>
            <CardHeader>
              <CardTitle>Rejection Reasons Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Top Rejection Categories</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Quality Issues</span>
                        <Badge className="bg-orange-100 text-orange-800">45%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Policy Violations</span>
                        <Badge className="bg-red-100 text-red-800">28%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Content Issues</span>
                        <Badge className="bg-blue-100 text-blue-800">15%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Technical Problems</span>
                        <Badge className="bg-purple-100 text-purple-800">8%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Legal Issues</span>
                        <Badge className="bg-gray-100 text-gray-800">4%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Common Specific Reasons</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Poor image quality</span>
                        <span className="font-medium">234 cases</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Incomplete descriptions</span>
                        <span className="font-medium">189 cases</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Misleading information</span>
                        <span className="font-medium">156 cases</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Copyright violations</span>
                        <span className="font-medium">89 cases</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Wrong categorization</span>
                        <span className="font-medium">67 cases</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Rejection Trends</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">This Week</p>
                      <p className="text-lg font-bold text-red-600">127</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Week</p>
                      <p className="text-lg font-bold">145</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-lg font-bold text-red-600">1,247</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Month</p>
                      <p className="text-lg font-bold">1,389</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor-communication">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Automated Notifications</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure automatic notifications sent to vendors.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Rejection notification with reasons</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Improvement suggestions</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Appeal process information</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Communication Templates</h3>
                  <p className="text-sm text-gray-600 mb-4">Pre-written templates for common rejection scenarios.</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Quality Issues Template</Button>
                    <Button variant="outline" size="sm">Policy Violation Template</Button>
                    <Button variant="outline" size="sm">Improvement Guidelines Template</Button>
                    <Button variant="outline" size="sm">Appeal Instructions Template</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Vendor Education</h3>
                  <p className="text-sm text-gray-600 mb-4">Resources to help vendors avoid rejections.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Product Guidelines PDF</span>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Image Quality Standards</span>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Policy Compliance Checklist</span>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Rejection Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Performance Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Rejections (30d)</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Processing Time</span>
                      <span className="font-medium">2.4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Appeal Success Rate</span>
                      <span className="font-medium text-green-600">32.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resubmission Success Rate</span>
                      <span className="font-medium text-blue-600">67.8%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Category Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Electronics</span>
                      <span className="font-medium">34% rejection rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fashion</span>
                      <span className="font-medium">28% rejection rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Home & Garden</span>
                      <span className="font-medium">22% rejection rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health & Beauty</span>
                      <span className="font-medium">45% rejection rate</span>
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
