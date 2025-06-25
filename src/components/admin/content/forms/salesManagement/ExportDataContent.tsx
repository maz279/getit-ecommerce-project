
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Database, Calendar, Filter, Settings, RefreshCw, Eye, Clock, CheckCircle, AlertCircle, FileSpreadsheet, FileImage, FilePdf } from 'lucide-react';

// Sample data for exports
const recentExports = [
  { id: 1, name: 'Sales Report Q4 2024', type: 'Excel', size: '2.1 MB', date: '2024-12-20', status: 'completed', records: 15420 },
  { id: 2, name: 'Customer Analytics November', type: 'CSV', size: '850 KB', date: '2024-12-19', status: 'completed', records: 8750 },
  { id: 3, name: 'Product Performance Report', type: 'PDF', size: '4.3 MB', date: '2024-12-18', status: 'processing', records: 25600 },
  { id: 4, name: 'Revenue Breakdown Monthly', type: 'Excel', size: '1.7 MB', date: '2024-12-17', status: 'completed', records: 12340 },
  { id: 5, name: 'Vendor Commission Report', type: 'CSV', size: '620 KB', date: '2024-12-16', status: 'failed', records: 5890 }
];

const exportTemplates = [
  { id: 1, name: 'Sales Summary', description: 'Basic sales data with totals and trends', fields: 15, popular: true },
  { id: 2, name: 'Detailed Transactions', description: 'Complete transaction history with customer details', fields: 28, popular: true },
  { id: 3, name: 'Product Performance', description: 'Product-wise sales analytics and inventory data', fields: 22, popular: false },
  { id: 4, name: 'Customer Analytics', description: 'Customer behavior and demographic analysis', fields: 19, popular: true },
  { id: 5, name: 'Vendor Commissions', description: 'Vendor performance and commission calculations', fields: 16, popular: false },
  { id: 6, name: 'Financial Dashboard', description: 'Revenue, profit margins, and financial KPIs', fields: 24, popular: true }
];

const availableFields = [
  { category: 'Sales Data', fields: ['Order ID', 'Transaction Date', 'Product Name', 'Quantity', 'Unit Price', 'Total Amount', 'Discount Applied', 'Tax Amount'] },
  { category: 'Customer Information', fields: ['Customer ID', 'Customer Name', 'Email', 'Phone', 'Address', 'City', 'Registration Date', 'Customer Segment'] },
  { category: 'Product Details', fields: ['Product ID', 'SKU', 'Category', 'Brand', 'Stock Level', 'Cost Price', 'Profit Margin', 'Supplier'] },
  { category: 'Order Management', fields: ['Order Status', 'Payment Method', 'Shipping Address', 'Delivery Date', 'Tracking Number', 'Return Status'] },
  { category: 'Analytics', fields: ['Conversion Rate', 'Customer LTV', 'Repeat Purchase Rate', 'Average Order Value', 'Cart Abandonment Rate'] }
];

export const ExportDataContent: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [exportFormat, setExportFormat] = useState('excel');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customFilters, setCustomFilters] = useState({
    minAmount: '',
    maxAmount: '',
    category: '',
    status: '',
    customerSegment: ''
  });
  const [exportName, setExportName] = useState('');
  const [scheduleExport, setScheduleExport] = useState(false);
  const [frequency, setFrequency] = useState('');
  const [emailNotification, setEmailNotification] = useState(false);

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = () => {
    console.log('Exporting data with configuration:', {
      template: selectedTemplate,
      format: exportFormat,
      dateRange,
      selectedFields,
      customFilters,
      exportName,
      scheduleExport,
      frequency,
      emailNotification
    });
    // Here you would typically call an API to start the export process
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
      case 'csv': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'pdf': return <FilePdf className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Download className="w-8 h-8 text-blue-600" />
            Export Data Center
          </h1>
          <p className="text-gray-600 mt-1">Export sales data, analytics, and reports in various formats</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="new-export" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="new-export">New Export</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Exports</TabsTrigger>
        </TabsList>

        {/* New Export Tab */}
        <TabsContent value="new-export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exportName">Export Name</Label>
                      <Input
                        id="exportName"
                        value={exportName}
                        onChange={(e) => setExportName(e.target.value)}
                        placeholder="Enter export name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template">Use Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Template</SelectItem>
                          {exportTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Export Format</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                          <SelectItem value="csv">CSV (.csv)</SelectItem>
                          <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                          <SelectItem value="json">JSON (.json)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="yesterday">Yesterday</SelectItem>
                          <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                          <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                          <SelectItem value="this-month">This Month</SelectItem>
                          <SelectItem value="last-month">Last Month</SelectItem>
                          <SelectItem value="this-quarter">This Quarter</SelectItem>
                          <SelectItem value="this-year">This Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Field Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Fields Selection</CardTitle>
                  <p className="text-sm text-gray-600">Select the fields you want to include in your export</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableFields.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-gray-900">{category.category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {category.fields.map((field) => (
                            <div key={field} className="flex items-center space-x-2">
                              <Checkbox
                                id={field}
                                checked={selectedFields.includes(field)}
                                onCheckedChange={() => handleFieldToggle(field)}
                              />
                              <Label htmlFor={field} className="text-sm">{field}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">Minimum Amount (৳)</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={customFilters.minAmount}
                        onChange={(e) => setCustomFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAmount">Maximum Amount (৳)</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={customFilters.maxAmount}
                        onChange={(e) => setCustomFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                        placeholder="No limit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Product Category</Label>
                      <Select value={customFilters.category} onValueChange={(value) => setCustomFilters(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="home-garden">Home & Garden</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="beauty">Beauty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Order Status</Label>
                      <Select value={customFilters.status} onValueChange={(value) => setCustomFilters(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview & Actions Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm space-y-1">
                        <div><strong>Format:</strong> {exportFormat.toUpperCase()}</div>
                        <div><strong>Date Range:</strong> {dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div><strong>Fields:</strong> {selectedFields.length} selected</div>
                        <div><strong>Est. Records:</strong> ~15,420</div>
                        <div><strong>Est. Size:</strong> ~2.1 MB</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="schedule"
                          checked={scheduleExport}
                          onCheckedChange={setScheduleExport}
                        />
                        <Label htmlFor="schedule" className="text-sm">Schedule this export</Label>
                      </div>
                      
                      {scheduleExport && (
                        <div className="space-y-2 ml-6">
                          <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email"
                          checked={emailNotification}
                          onCheckedChange={setEmailNotification}
                        />
                        <Label htmlFor="email" className="text-sm">Email when ready</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleExport} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Export Now
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Orders</span>
                      <span className="font-medium">15,420</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="font-medium">৳2.4M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customers</span>
                      <span className="font-medium">8,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Products</span>
                      <span className="font-medium">1,240</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    {template.popular && <Badge>Popular</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{template.fields} fields</span>
                    <Button size="sm" onClick={() => setSelectedTemplate(template.id.toString())}>
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Export History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExports.map((exportItem) => (
                  <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(exportItem.type)}
                      <div>
                        <h4 className="font-medium">{exportItem.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{exportItem.records.toLocaleString()} records</span>
                          <span>{exportItem.size}</span>
                          <span>{exportItem.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(exportItem.status)}
                        <span className="text-sm capitalize">{exportItem.status}</span>
                      </div>
                      {exportItem.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Exports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Exports</h3>
                <p className="text-gray-600 mb-4">Set up automated exports to run on a schedule</p>
                <Button>Create Scheduled Export</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
