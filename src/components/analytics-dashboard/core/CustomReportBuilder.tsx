import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { 
  FileText, 
  Plus, 
  Trash2, 
  Settings, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Table,
  Download,
  Save,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReportField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  source: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area';
  xAxis: string;
  yAxis: string;
  title: string;
}

interface ReportTemplate {
  id?: string;
  template_name: string;
  template_description: string;
  report_type: string;
  report_configuration: {
    fields: ReportField[];
    filters: ReportFilter[];
    charts: ChartConfig[];
    sorting: {
      field: string;
      direction: 'asc' | 'desc';
    };
    grouping?: string[];
  };
  visualization_config: {
    layout: 'grid' | 'list' | 'dashboard';
    theme: 'light' | 'dark' | 'auto';
    export_formats: string[];
  };
  data_sources: string[];
}

const AVAILABLE_FIELDS: ReportField[] = [
  { id: 'order_date', name: 'Order Date', type: 'date', source: 'orders' },
  { id: 'order_total', name: 'Order Total', type: 'number', source: 'orders' },
  { id: 'customer_name', name: 'Customer Name', type: 'string', source: 'customers' },
  { id: 'product_name', name: 'Product Name', type: 'string', source: 'products' },
  { id: 'product_price', name: 'Product Price', type: 'number', source: 'products' },
  { id: 'vendor_name', name: 'Vendor Name', type: 'string', source: 'vendors' },
  { id: 'category_name', name: 'Category', type: 'string', source: 'categories' },
  { id: 'quantity', name: 'Quantity', type: 'number', source: 'order_items' },
  { id: 'revenue', name: 'Revenue', type: 'number', source: 'analytics' },
  { id: 'profit_margin', name: 'Profit Margin', type: 'number', source: 'analytics' },
];

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'line', label: 'Line Chart', icon: LineChart },
  { value: 'pie', label: 'Pie Chart', icon: PieChart },
  { value: 'area', label: 'Area Chart', icon: BarChart3 },
];

export const CustomReportBuilder: React.FC = () => {
  const [reportTemplate, setReportTemplate] = useState<ReportTemplate>({
    template_name: '',
    template_description: '',
    report_type: 'custom',
    report_configuration: {
      fields: [],
      filters: [],
      charts: [],
      sorting: {
        field: '',
        direction: 'asc'
      },
      grouping: []
    },
    visualization_config: {
      layout: 'grid',
      theme: 'auto',
      export_formats: ['pdf', 'excel']
    },
    data_sources: []
  });
  
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const { toast } = useToast();

  const updateTemplate = (updates: Partial<ReportTemplate>) => {
    setReportTemplate(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateConfiguration = (updates: Partial<ReportTemplate['report_configuration']>) => {
    setReportTemplate(prev => ({
      ...prev,
      report_configuration: {
        ...prev.report_configuration,
        ...updates
      }
    }));
  };

  const addField = (field: ReportField) => {
    const newField = { ...field, id: `${field.id}_${Date.now()}` };
    updateConfiguration({
      fields: [...reportTemplate.report_configuration.fields, newField]
    });
    
    // Auto-add data source if not already included
    if (!reportTemplate.data_sources.includes(field.source)) {
      updateTemplate({
        data_sources: [...reportTemplate.data_sources, field.source]
      });
    }
  };

  const removeField = (fieldId: string) => {
    updateConfiguration({
      fields: reportTemplate.report_configuration.fields.filter(f => f.id !== fieldId)
    });
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: `filter_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: ''
    };
    updateConfiguration({
      filters: [...reportTemplate.report_configuration.filters, newFilter]
    });
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    updateConfiguration({
      filters: reportTemplate.report_configuration.filters.map(f =>
        f.id === filterId ? { ...f, ...updates } : f
      )
    });
  };

  const removeFilter = (filterId: string) => {
    updateConfiguration({
      filters: reportTemplate.report_configuration.filters.filter(f => f.id !== filterId)
    });
  };

  const addChart = () => {
    const newChart: ChartConfig = {
      type: 'bar',
      xAxis: '',
      yAxis: '',
      title: 'New Chart'
    };
    updateConfiguration({
      charts: [...reportTemplate.report_configuration.charts, newChart]
    });
  };

  const updateChart = (index: number, updates: Partial<ChartConfig>) => {
    const charts = [...reportTemplate.report_configuration.charts];
    charts[index] = { ...charts[index], ...updates };
    updateConfiguration({ charts });
  };

  const removeChart = (index: number) => {
    updateConfiguration({
      charts: reportTemplate.report_configuration.charts.filter((_, i) => i !== index)
    });
  };


  const generatePreview = async () => {
    setLoading(true);
    try {
      // Simulate report data generation
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        order_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        order_total: Math.round((Math.random() * 500 + 50) * 100) / 100,
        customer_name: `Customer ${i + 1}`,
        product_name: `Product ${String.fromCharCode(65 + i)}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        revenue: Math.round((Math.random() * 1000 + 100) * 100) / 100
      }));
      
      setPreviewData(mockData);
      toast({
        title: "Preview Generated",
        description: "Report preview has been generated with sample data",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const saveTemplate = async () => {
    if (!reportTemplate.template_name) {
      toast({
        title: "Validation Error",
        description: "Please provide a template name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('automated-reporting-system', {
        body: {
          action: 'create_report_template',
          data: {
            ...reportTemplate,
            created_by: 'current-user' // Replace with actual user ID
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Template Saved",
        description: "Report template has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Custom Report Builder
          </h2>
          <p className="text-muted-foreground">Design and build custom reports with drag-and-drop interface</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePreview} disabled={loading}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button onClick={saveTemplate} disabled={loading || !reportTemplate.template_name}>
            <Save className="h-4 w-4 mr-1" />
            Save Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="fields">Fields & Data</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Report Template Information</CardTitle>
              <CardDescription>Basic details about your custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template_name">Template Name</Label>
                <Input
                  id="template_name"
                  value={reportTemplate.template_name}
                  onChange={(e) => updateTemplate({ template_name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <Label htmlFor="template_description">Description</Label>
                <Textarea
                  id="template_description"
                  value={reportTemplate.template_description}
                  onChange={(e) => updateTemplate({ template_description: e.target.value })}
                  placeholder="Describe what this report shows"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="report_type">Report Type</Label>
                  <Select 
                    value={reportTemplate.report_type} 
                    onValueChange={(value) => updateTemplate({ report_type: value })}
                  >
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="customer">Customer Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="layout">Layout</Label>
                  <Select 
                    value={reportTemplate.visualization_config.layout} 
                    onValueChange={(value: 'grid' | 'list' | 'dashboard') => 
                      updateTemplate({
                        visualization_config: {
                          ...reportTemplate.visualization_config,
                          layout: value
                        }
                      })
                    }
                  >
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="grid">Grid Layout</SelectItem>
                      <SelectItem value="list">List Layout</SelectItem>
                      <SelectItem value="dashboard">Dashboard Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fields and Data */}
        <TabsContent value="fields">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Available Fields</CardTitle>
                <CardDescription>Drag fields to include them in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {AVAILABLE_FIELDS.map((field) => (
                    <div 
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => addField(field)}
                    >
                      <div>
                        <p className="font-medium">{field.name}</p>
                        <p className="text-sm text-muted-foreground">{field.source} • {field.type}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Fields ({reportTemplate.report_configuration.fields.length})</CardTitle>
                <CardDescription>Fields included in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportTemplate.report_configuration.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div>
                        <p className="font-medium">{field.name}</p>
                        <Badge variant="outline">{field.source}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {reportTemplate.report_configuration.fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No fields selected. Add fields from the left panel.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Filters */}
        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Filters</CardTitle>
                  <CardDescription>Add filters to customize your report data</CardDescription>
                </div>
                <Button onClick={addFilter}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplate.report_configuration.filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Select 
                      value={filter.field} 
                      onValueChange={(value) => updateFilter(filter.id, { field: value })}
                    >
                      <SelectTrigger className="w-48 bg-card border-border">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {reportTemplate.report_configuration.fields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={filter.operator} 
                      onValueChange={(value: any) => updateFilter(filter.id, { operator: value })}
                    >
                      <SelectTrigger className="w-40 bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                        <SelectItem value="between">Between</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                      placeholder="Filter value"
                      className="flex-1"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {reportTemplate.report_configuration.filters.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No filters configured. Click "Add Filter" to create your first filter.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts */}
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Visualizations</CardTitle>
                  <CardDescription>Configure charts and graphs for your report</CardDescription>
                </div>
                <Button onClick={addChart}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Chart
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportTemplate.report_configuration.charts.map((chart, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        value={chart.title}
                        onChange={(e) => updateChart(index, { title: e.target.value })}
                        placeholder="Chart title"
                        className="max-w-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChart(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Chart Type</Label>
                        <Select 
                          value={chart.type} 
                          onValueChange={(value: any) => updateChart(index, { type: value })}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {CHART_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>X-Axis</Label>
                        <Select 
                          value={chart.xAxis} 
                          onValueChange={(value) => updateChart(index, { xAxis: value })}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {reportTemplate.report_configuration.fields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Y-Axis</Label>
                        <Select 
                          value={chart.yAxis} 
                          onValueChange={(value) => updateChart(index, { yAxis: value })}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {reportTemplate.report_configuration.fields
                              .filter(field => field.type === 'number')
                              .map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                  {field.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reportTemplate.report_configuration.charts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No charts configured. Click "Add Chart" to create your first visualization.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>Preview how your report will look with sample data</CardDescription>
                </div>
                <Button onClick={generatePreview} disabled={loading}>
                  {loading ? 'Generating...' : 'Refresh Preview'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="space-y-6">
                  {/* Sample table preview */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            {reportTemplate.report_configuration.fields.slice(0, 5).map((field) => (
                              <th key={field.id} className="px-4 py-2 text-left font-medium">
                                {field.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 5).map((row, index) => (
                            <tr key={index} className="border-t">
                              {reportTemplate.report_configuration.fields.slice(0, 5).map((field) => (
                                <td key={field.id} className="px-4 py-2">
                                  {row[field.id.split('_')[0]] || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    This is a preview with sample data. Actual report will use real data from your database.
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Click "Refresh Preview" to generate a preview of your report
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};