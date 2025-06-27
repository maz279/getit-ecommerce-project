
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, CheckCircle, XCircle, AlertTriangle, Eye, Edit, MessageSquare,
  Search, Filter, Download, RefreshCw, Calendar, User, Package,
  Star, Flag, ArrowRight, MoreHorizontal, FileText, Image, Tag
} from 'lucide-react';

interface PendingProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  price: number;
  submittedDate: string;
  status: 'pending' | 'under-review' | 'need-clarification';
  priority: 'high' | 'medium' | 'low';
  images: number;
  description: string;
  reason?: string;
  reviewedBy?: string;
  estimatedReviewTime: string;
}

export const PendingApprovalContent: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);

  // Mock data for pending products
  const pendingProducts: PendingProduct[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      vendor: 'TechWorld Bangladesh',
      category: 'Electronics > Smartphones',
      price: 145000,
      submittedDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      images: 8,
      description: 'Latest iPhone with advanced camera system...',
      estimatedReviewTime: '2 hours'
    },
    {
      id: '2',
      name: 'Samsung Galaxy Watch 6',
      vendor: 'Smart Gadgets Ltd',
      category: 'Electronics > Wearables',
      price: 35000,
      submittedDate: '2024-01-14',
      status: 'under-review',
      priority: 'medium',
      images: 6,
      description: 'Advanced smartwatch with health monitoring...',
      reviewedBy: 'John Moderator',
      estimatedReviewTime: '1 hour'
    },
    {
      id: '3',
      name: 'Premium Leather Jacket',
      vendor: 'Fashion House BD',
      category: 'Fashion > Clothing',
      price: 8500,
      submittedDate: '2024-01-13',
      status: 'need-clarification',
      priority: 'low',
      images: 4,
      description: 'High-quality leather jacket for winter...',
      reason: 'Need additional product certificates',
      estimatedReviewTime: '4 hours'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'need-clarification': return 'bg-orange-100 text-orange-800';
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

  const handleApprove = (productId: string) => {
    console.log('Approving product:', productId);
    // Implementation for approval
  };

  const handleReject = (productId: string) => {
    console.log('Rejecting product:', productId);
    // Implementation for rejection
  };

  const handleRequestClarification = (productId: string) => {
    console.log('Requesting clarification for product:', productId);
    // Implementation for requesting clarification
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Clock className="mr-3 h-8 w-8 text-orange-600" />
              Pending Approval Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              🗂️ Product Management → Product Moderation → Pending Approval
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Package className="h-3 w-3 mr-1" />
              Review and manage products awaiting approval
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">24</div>
            <div className="text-sm text-gray-600">+3 from yesterday</div>
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
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Average: 2.5 hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Need Clarification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">8</div>
            <div className="text-sm text-gray-600">Awaiting response</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Today's Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-gray-600">94% approval rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending-list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending-list">📋 Pending List</TabsTrigger>
          <TabsTrigger value="bulk-actions">⚡ Bulk Actions</TabsTrigger>
          <TabsTrigger value="review-queue">🔄 Review Queue</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending-list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products Awaiting Approval</CardTitle>
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
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="need-clarification">Need Clarification</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
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
                {pendingProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(product.priority)}>
                            {product.priority} priority
                          </Badge>
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
                            <p className="text-gray-600">Submitted</p>
                            <p className="font-medium">{product.submittedDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Image className="h-4 w-4 mr-1" />
                            {product.images} images
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Est. review: {product.estimatedReviewTime}
                          </span>
                          {product.reviewedBy && (
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              Reviewed by: {product.reviewedBy}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{product.description}</p>
                        
                        {product.reason && (
                          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 mb-3">
                            <p className="text-sm text-orange-700">
                              <strong>Clarification needed:</strong> {product.reason}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(product.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(product.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRequestClarification(product.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Clarify
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-actions">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Select Multiple Products</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose products from the list above to perform bulk actions.</p>
                  <div className="flex space-x-2">
                    <Button>Bulk Approve (0 selected)</Button>
                    <Button variant="destructive">Bulk Reject (0 selected)</Button>
                    <Button variant="outline">Request Info (0 selected)</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Auto-Approval Rules</h3>
                  <p className="text-sm text-gray-600 mb-4">Set up automated approval criteria for trusted vendors.</p>
                  <Button variant="outline">Configure Rules</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review-queue">
          <Card>
            <CardHeader>
              <CardTitle>Review Queue Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">High Priority Queue</h3>
                    <p className="text-2xl font-bold text-red-600">8 items</p>
                    <p className="text-sm text-gray-600">Average wait: 1.2 hours</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Standard Queue</h3>
                    <p className="text-2xl font-bold text-yellow-600">16 items</p>
                    <p className="text-sm text-gray-600">Average wait: 4.5 hours</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Low Priority Queue</h3>
                    <p className="text-2xl font-bold text-green-600">12 items</p>
                    <p className="text-sm text-gray-600">Average wait: 24 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Approval Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Review Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Review Time</span>
                      <span className="font-medium">3.2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Rate</span>
                      <span className="font-medium text-green-600">89.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejection Rate</span>
                      <span className="font-medium text-red-600">7.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clarification Rate</span>
                      <span className="font-medium text-orange-600">3.3%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Top Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Electronics</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fashion</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Home & Garden</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others</span>
                      <span className="font-medium">12%</span>
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
