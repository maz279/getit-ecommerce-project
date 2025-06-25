
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Settings } from 'lucide-react';
import { ExportConfiguration } from './exportData/ExportConfiguration';
import { FieldSelection } from './exportData/FieldSelection';
import { CustomFilters } from './exportData/CustomFilters';
import { ExportPreview } from './exportData/ExportPreview';
import { QuickStats } from './exportData/QuickStats';
import { ExportHistory } from './exportData/ExportHistory';
import { ExportTemplates } from './exportData/ExportTemplates';
import { ScheduledExports } from './exportData/ScheduledExports';

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
              <ExportConfiguration
                exportName={exportName}
                setExportName={setExportName}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                exportFormat={exportFormat}
                setExportFormat={setExportFormat}
                dateRange={dateRange}
                setDateRange={setDateRange}
                exportTemplates={exportTemplates}
              />

              <FieldSelection
                selectedFields={selectedFields}
                handleFieldToggle={handleFieldToggle}
                availableFields={availableFields}
              />

              <CustomFilters
                customFilters={customFilters}
                setCustomFilters={setCustomFilters}
              />
            </div>

            {/* Preview & Actions Panel */}
            <div className="space-y-6">
              <ExportPreview
                exportFormat={exportFormat}
                dateRange={dateRange}
                selectedFields={selectedFields}
                scheduleExport={scheduleExport}
                setScheduleExport={setScheduleExport}
                frequency={frequency}
                setFrequency={setFrequency}
                emailNotification={emailNotification}
                setEmailNotification={setEmailNotification}
                handleExport={handleExport}
              />

              <QuickStats />
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <ExportTemplates
            exportTemplates={exportTemplates}
            setSelectedTemplate={setSelectedTemplate}
          />
        </TabsContent>

        {/* Export History Tab */}
        <TabsContent value="history" className="space-y-6">
          <ExportHistory recentExports={recentExports} />
        </TabsContent>

        {/* Scheduled Exports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <ScheduledExports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
