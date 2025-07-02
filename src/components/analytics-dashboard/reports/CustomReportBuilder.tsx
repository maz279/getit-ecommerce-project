import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, FileText, Download, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ReportField {
  name: string;
  label: string;
  type: string;
  table: string;
}

interface CustomReport {
  id?: string;
  report_name: string;
  report_description: string;
  report_type: string;
  data_sources: string[];
  columns: ReportField[];
  filters: Record<string, any>;
  chart_config: Record<string, any>;
}

const CustomReportBuilder: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<CustomReport>({
    report_name: '',
    report_description: '',
    report_type: 'table',
    data_sources: [],
    columns: [],
    filters: {},
    chart_config: {}
  });
  const [availableFields, setAvailableFields] = useState<ReportField[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    loadAvailableFields();
  }, []);

  const loadAvailableFields = () => {
    const fields: ReportField[] = [
      { name: 'order_total', label: 'Order Total', type: 'number', table: 'orders' },
      { name: 'created_at', label: 'Order Date', type: 'date', table: 'orders' },
      { name: 'status', label: 'Order Status', type: 'string', table: 'orders' },
      { name: 'product_name', label: 'Product Name', type: 'string', table: 'products' },
      { name: 'vendor_id', label: 'Vendor', type: 'string', table: 'vendors' },
      { name: 'category_name', label: 'Category', type: 'string', table: 'categories' },
      { name: 'commission_amount', label: 'Commission', type: 'number', table: 'vendor_commissions' },
      { name: 'user_email', label: 'Customer Email', type: 'string', table: 'profiles' }
    ];
    setAvailableFields(fields);
  };

  const addColumn = (field: ReportField) => {
    if (!report.columns.find(col => col.name === field.name)) {
      setReport(prev => ({
        ...prev,
        columns: [...prev.columns, field],
        data_sources: [...new Set([...prev.data_sources, field.table])]
      }));
    }
  };

  const removeColumn = (fieldName: string) => {
    setReport(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.name !== fieldName)
    }));
  };

  const addFilter = () => {
    const filterKey = `filter_${Object.keys(report.filters).length + 1}`;
    setReport(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: { field: '', operator: 'equals', value: '' }
      }
    }));
  };

  const updateFilter = (key: string, field: string, value: any) => {
    setReport(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: { ...prev.filters[key], [field]: value }
      }
    }));
  };

  const removeFilter = (key: string) => {
    setReport(prev => {
      const newFilters = { ...prev.filters };
      delete newFilters[key];
      return { ...prev, filters: newFilters };
    });
  };

  const saveReport = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const reportData = {
        ...report,
        created_by: user.id,
        report_config: {
          data_sources: report.data_sources,
          columns: report.columns,
          filters: report.filters,
          chart_config: report.chart_config
        }
      };

      // Mock save until database tables are created
      const data = { id: 'mock-id', ...reportData };
      
      console.log('Report saved successfully:', data);
      // Reset form or redirect
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-custom-report', {
        body: { report_config: report }
      });

      if (error) throw error;
      setPreviewData(data.results || []);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-custom-report', {
        body: { report_config: report, format }
      });

      if (error) throw error;
      
      // Handle file download
      const blob = new Blob([data.file_content], { type: data.content_type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.report_name || 'report'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Report Builder</h2>
          <p className="text-muted-foreground">Create custom reports with your data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} disabled={loading || report.columns.length === 0}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Preview
          </Button>
          <Button onClick={saveReport} disabled={loading || !report.report_name}>
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>Basic information about your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="report_name">Report Name</Label>
                <Input
                  id="report_name"
                  value={report.report_name}
                  onChange={(e) => setReport(prev => ({ ...prev, report_name: e.target.value }))}
                  placeholder="Enter report name"
                />
              </div>
              <div>
                <Label htmlFor="report_description">Description</Label>
                <Textarea
                  id="report_description"
                  value={report.report_description}
                  onChange={(e) => setReport(prev => ({ ...prev, report_description: e.target.value }))}
                  placeholder="Describe what this report shows"
                />
              </div>
              <div>
                <Label htmlFor="report_type">Report Type</Label>
                <Select 
                  value={report.report_type} 
                  onValueChange={(value) => setReport(prev => ({ ...prev, report_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="chart">Chart</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Select fields to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {availableFields.map((field) => (
                    <div
                      key={field.name}
                      className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-accent"
                      onClick={() => addColumn(field)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">{field.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Add filters to your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(report.filters).map(([key, filter]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Select 
                      value={filter.field} 
                      onValueChange={(value) => updateFilter(key, 'field', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {report.columns.map(col => (
                          <SelectItem key={col.name} value={col.name}>
                            {col.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={filter.operator} 
                      onValueChange={(value) => updateFilter(key, 'operator', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(key, 'value', e.target.value)}
                      placeholder="Value"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeFilter(key)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addFilter}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Columns & Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Columns</CardTitle>
              <CardDescription>Columns that will appear in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.columns.map((column) => (
                  <div key={column.name} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{column.label}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeColumn(column.name)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {report.columns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No columns selected. Add columns from the data sources.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Sample data from your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {report.columns.map(col => (
                          <th key={col.name} className="text-left p-2">{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b">
                          {report.columns.map(col => (
                            <td key={col.name} className="p-2">{row[col.name]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => exportReport('csv')}
                    disabled={loading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportReport('xlsx')}
                    disabled={loading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportReport('pdf')}
                    disabled={loading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomReportBuilder;