
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Settings,
  FileText,
  AlertCircle,
  ArrowRight,
  Zap,
  Users,
  Building,
  Globe,
  Mail,
  Phone,
  History,
  XCircle,
  ShoppingCart,
  Package,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export const RefundProcessingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReason, setSelectedReason] = useState('all');

  // Mock refund data
  const refundStats = {
    totalRefundsToday: 89,
    totalRefundsThisWeek: 567,
    totalRefundsThisMonth: 2340,
    refundRate: 2.3,
    totalAmountRefunded: 145750,
    averageRefundAmount: 245.8,
    pendingRefunds: 127,
    processingTime: 1.2,
    customerSatisfaction: 4.6
  };

  const refundReasons = [
    { reason: 'Product Not as Described', count: 456, percentage: 42.3, color: 'red' },
    { reason: 'Damaged/Defective Product', count: 298, percentage: 27.6, color: 'orange' },
    { reason: 'Changed Mind', count: 187, percentage: 17.3, color: 'yellow' },
    { reason: 'Late Delivery', count: 89, percentage: 8.2, color: 'blue' },
    { reason: 'Wrong Item Received', count: 48, percentage: 4.6, color: 'purple' }
  ];

  const recentRefunds = [
    {
      id: 'REF-2024-001234',
      orderId: 'ORD-2024-5678',
      customer: 'Ahmed Rahman',
      email: 'ahmed.rahman@email.com',
      phone: '+8801712345678',
      amount: 2340,
      currency: 'BDT',
      reason: 'Product Not as Described',
      status: 'Processing',
      requestDate: '2024-06-26 10:30:25',
      processedDate: null,
      method: 'Credit Card',
      gateway: 'Stripe',
      product: 'Samsung Galaxy S24',
      customerNote: 'Screen has dead pixels, not working properly',
      images: ['defect1.jpg', 'defect2.jpg'],
      priority: 'High',
      assignedTo: 'Sarah Khan',
      estimatedCompletion: '2024-06-28 15:00:00'
    },
    {
      id: 'REF-2024-001235',
      orderId: 'ORD-2024-5679',
      customer: 'Fatima Ali',
      email: 'fatima.ali@email.com',
      phone: '+8801798765432',
      amount: 1890,
      currency: 'BDT',
      reason: 'Damaged/Defective Product',
      status: 'Approved',
      requestDate: '2024-06-25 14:28:15',
      processedDate: '2024-06-26 09:15:00',
      method: 'bKash',
      gateway: 'bKash',
      product: 'iPhone 15 Pro',
      customerNote: 'Package arrived damaged, phone screen cracked',
      images: ['damage1.jpg'],
      priority: 'Medium',
      assignedTo: 'Mohammad Hassan',
      estimatedCompletion: '2024-06-27 12:00:00'
    },
    {
      id: 'REF-2024-001236',
      orderId: 'ORD-2024-5680',
      customer: 'Rashid Khan',
      email: 'rashid.khan@email.com',
      phone: '+8801856789012',
      amount: 3450,
      currency: 'BDT',
      reason: 'Changed Mind',
      status: 'Completed',
      requestDate: '2024-06-24 16:25:40',
      processedDate: '2024-06-25 11:30:00',
      method: 'Bank Transfer',
      gateway: 'Dutch Bangla Bank',
      product: 'MacBook Pro 14"',
      customerNote: 'Found better deal elsewhere',
      images: [],
      priority: 'Low',
      assignedTo: 'Ayesha Begum',
      estimatedCompletion: '2024-06-26 10:00:00'
    }
  ];

  const refundWorkflow = [
    {
      step: 'Request Received',
      description: 'Customer submits refund request',
      automation: 'Auto-acknowledgment email',
      sla: '< 1 hour'
    },
    {
      step: 'Initial Review',
      description: 'Verify order details and eligibility',
      automation: 'Auto-validation checks',
      sla: '< 4 hours'
    },
    {
      step: 'Documentation Review',
      description: 'Check provided evidence and images',
      automation: 'AI image analysis',
      sla: '< 8 hours'
    },
    {
      step: 'Decision Making',
      description: 'Approve, reject, or request more info',
      automation: 'Smart recommendation engine',
      sla: '< 24 hours'
    },
    {
      step: 'Processing',
      description: 'Initiate refund to original payment method',
      automation: 'Auto-processing for approved refunds',
      sla: '< 48 hours'
    },
    {
      step: 'Completion',
      description: 'Confirm refund completion and notify customer',
      automation: 'Auto-completion notifications',
      sla: '< 72 hours'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Refund Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Today's Refunds</p>
                <p className="text-3xl font-bold text-blue-800">{refundStats.totalRefundsToday}</p>
                <p className="text-xs text-blue-600 font-medium flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  {refundStats.refundRate}% refund rate
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-green-800">{refundStats.totalRefundsThisMonth}</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <Calendar size={12} className="mr-1" />
                  Last 30 days
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Amount Refunded</p>
                <p className="text-3xl font-bold text-purple-800">৳ {refundStats.totalAmountRefunded.toLocaleString()}</p>
                <p className="text-xs text-purple-600 font-medium flex items-center mt-1">
                  <DollarSign size={12} className="mr-1" />
                  Avg: ৳ {refundStats.averageRefundAmount}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Avg Process Time</p>
                <p className="text-3xl font-bold text-orange-800">{refundStats.processingTime} days</p>
                <p className="text-xs text-orange-600 font-medium flex items-center mt-1">
                  <Clock size={12} className="mr-1" />
                  {refundStats.pendingRefunds} pending
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund Reasons and Workflow */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-3 h-5 w-5 text-blue-600" />
              Top Refund Reasons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {refundReasons.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500" style={{ 
                      backgroundColor: `hsl(${index * 40 + 10}, 60%, 50%)` 
                    }}></div>
                    <div>
                      <p className="font-medium text-gray-800">{item.reason}</p>
                      <p className="text-sm text-gray-500">{item.count} requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-3 h-5 w-5 text-green-600" />
              Refund Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {refundWorkflow.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{step.step}</h4>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{step.automation}</span>
                      <span className="text-xs text-gray-500">SLA: {step.sla}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRefundsTab = () => (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by refund ID, order ID, or customer..."
                  className="pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
                <option value="completed">🎯 Completed</option>
              </select>
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                <option value="all">All Reasons</option>
                <option value="not-described">📦 Not as Described</option>
                <option value="damaged">💔 Damaged/Defective</option>
                <option value="changed-mind">🤔 Changed Mind</option>
                <option value="late-delivery">⏰ Late Delivery</option>
                <option value="wrong-item">🔄 Wrong Item</option>
              </select>
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-3 h-5 w-5 text-blue-600" />
              Refund Requests
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              {recentRefunds.length} refund requests
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Refund Details</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Product & Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Reason & Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Timeline</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRefunds.map((refund, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-blue-600">{refund.id}</div>
                        <div className="text-sm text-gray-500">{refund.orderId}</div>
                        <div className="text-xs text-gray-400">{refund.requestDate}</div>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge className={`${getPriorityColor(refund.priority)} text-xs`}>
                            {refund.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">by {refund.assignedTo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{refund.customer}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {refund.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {refund.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-800">{refund.product}</div>
                        <div className="font-semibold text-blue-600 text-lg">
                          {refund.currency} {refund.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{refund.method} via {refund.gateway}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <Badge className={`${getStatusColor(refund.status)}`}>
                          {refund.status}
                        </Badge>
                        <div className="text-sm font-medium text-gray-700">{refund.reason}</div>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          {refund.customerNote}
                        </div>
                        {refund.images.length > 0 && (
                          <div className="text-xs text-blue-600 flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {refund.images.length} attachment(s)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-500">Requested:</span>
                          <div className="text-xs text-gray-400">{refund.requestDate}</div>
                        </div>
                        {refund.processedDate && (
                          <div className="text-sm">
                            <span className="text-gray-500">Processed:</span>
                            <div className="text-xs text-gray-400">{refund.processedDate}</div>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-gray-500">Est. Complete:</span>
                          <div className="text-xs text-gray-400">{refund.estimatedCompletion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">Showing 1-10 of 2,340 refund requests</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">← Previous</Button>
              <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">234</Button>
              <Button variant="outline" size="sm">Next →</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
              Refund Trends (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Refund Trends Chart</p>
                <p className="text-sm text-gray-500">Refund patterns over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-3 h-5 w-5 text-green-600" />
              Refund by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-green-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Category Analysis</p>
                <p className="text-sm text-gray-500">Refunds by product categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{refundStats.processingTime} days</div>
              <div className="text-sm text-gray-600 mt-1">Average Processing Time</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{refundStats.customerSatisfaction}/5</div>
              <div className="text-sm text-gray-600 mt-1">Customer Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-gray-600 mt-1">Auto-Approval Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">12%</div>
              <div className="text-sm text-gray-600 mt-1">Dispute Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <RefreshCw className="mr-3 h-8 w-8 text-blue-600" />
              Refund Processing Management
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              📍 Order Management → Payment Management → Refund Processing
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Refund Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="overview" className="py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="refunds" className="py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              Refund Requests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <PieChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="refunds" className="mt-6">
          {renderRefundsTab()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalyticsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
