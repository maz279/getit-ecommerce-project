import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, BarChart, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExportJob {
  id: string;
  report_id: string;
  export_format: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string;
  file_path: string;
  file_size_bytes: number;
  row_count: number;
  error_message: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
}

const ReportExporter: React.FC = () => {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeHeaders: true,
    compressData: false,
    emailNotification: false
  });

  useEffect(() => {
    fetchReports();
    fetchExportJobs();
  }, []);

  const fetchReports = async () => {
    try {
      // Mock data until database tables are created
      const mockReports: ReportTemplate[] = [
        {
          id: '1',
          name: 'Sales Report',
          type: 'table',
          description: 'Comprehensive sales analysis'
        },
        {
          id: '2',
          name: 'Customer Analytics',
          type: 'dashboard',
          description: 'Customer behavior insights'
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchExportJobs = async () => {
    try {
      // Mock data until database tables are created
      const mockJobs: ExportJob[] = [
        {
          id: '1',
          report_id: '1',
          export_format: 'pdf',
          status: 'completed',
          started_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          file_path: '/exports/sales-report.pdf',
          file_size_bytes: 1024000,
          row_count: 1250,
          error_message: ''
        }
      ];
      
      setExportJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching export jobs:', error);
    }
  };

  const startExport = async () => {
    if (!selectedReport) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-report', {
        body: {
          report_id: selectedReport,
          format: exportFormat,
          options: exportOptions
        }
      });

      if (error) throw error;
      
      // Refresh export jobs list
      await fetchExportJobs();
      
      console.log('Export started:', data);
    } catch (error) {
      console.error('Error starting export:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (jobId: string, filePath: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('download-export', {
        body: { job_id: jobId, file_path: filePath }
      });

      if (error) throw error;
      
      // Create download link
      const blob = new Blob([data.file_content], { type: data.content_type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'export';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (startTime: string, endTime: string) => {
    if (!endTime) return 'Running...';
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Report Exporter</h2>
          <p className="text-muted-foreground">Export reports in various formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>Configure your export settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="report">Select Report</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a report to export" />
                </SelectTrigger>
                <SelectContent>
                  {reports.map(report => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      Excel (XLSX)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="png">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      PNG Image
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Export Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={exportOptions.includeCharts}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                    }
                  />
                  <Label htmlFor="includeCharts">Include charts and visualizations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeHeaders"
                    checked={exportOptions.includeHeaders}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeHeaders: !!checked }))
                    }
                  />
                  <Label htmlFor="includeHeaders">Include column headers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compressData"
                    checked={exportOptions.compressData}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, compressData: !!checked }))
                    }
                  />
                  <Label htmlFor="compressData">Compress output file</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotification"
                    checked={exportOptions.emailNotification}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, emailNotification: !!checked }))
                    }
                  />
                  <Label htmlFor="emailNotification">Send email notification when complete</Label>
                </div>
              </div>
            </div>

            <Button 
              onClick={startExport} 
              disabled={!selectedReport || loading}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Starting Export...' : 'Start Export'}
            </Button>
          </CardContent>
        </Card>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>Recent export jobs and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportJobs.map(job => (
                <div key={job.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="font-medium text-sm">
                        {job.export_format.toUpperCase()} Export
                      </span>
                    </div>
                    <Badge variant={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Started:</span>
                      <span>{new Date(job.started_at).toLocaleString()}</span>
                    </div>
                    {job.completed_at && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{formatDuration(job.started_at, job.completed_at)}</span>
                      </div>
                    )}
                    {job.row_count && (
                      <div className="flex justify-between">
                        <span>Rows:</span>
                        <span>{job.row_count.toLocaleString()}</span>
                      </div>
                    )}
                    {job.file_size_bytes && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{formatFileSize(job.file_size_bytes)}</span>
                      </div>
                    )}
                  </div>
                  
                  {job.status === 'completed' && job.file_path && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => downloadFile(job.id, job.file_path)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  
                  {job.status === 'failed' && job.error_message && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                      {job.error_message}
                    </div>
                  )}
                </div>
              ))}
              
              {exportJobs.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No export jobs yet.</p>
                  <p className="text-sm mt-2">Start your first export to see it here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportExporter;