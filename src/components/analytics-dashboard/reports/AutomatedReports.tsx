import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Settings, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ScheduledReport {
  id: string;
  report_name: string;
  report_description: string;
  schedule_config: {
    frequency: string;
    time: string;
    recipients: string[];
    format: string;
  };
  is_scheduled: boolean;
  last_generated: string;
  created_at: string;
}

const AutomatedReports: React.FC = () => {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduledReports();
  }, []);

  const fetchScheduledReports = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .eq('is_scheduled', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReportSchedule = async (reportId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .update({ is_scheduled: enabled })
        .eq('id', reportId);

      if (error) throw error;
      
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, is_scheduled: enabled }
          : report
      ));
    } catch (error) {
      console.error('Error updating report schedule:', error);
    }
  };

  const updateScheduleConfig = async (reportId: string, config: any) => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .update({ schedule_config: config })
        .eq('id', reportId);

      if (error) throw error;
      
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, schedule_config: config }
          : report
      ));
      
      setEditingReport(null);
    } catch (error) {
      console.error('Error updating schedule config:', error);
    }
  };

  const runReportNow = async (reportId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('run-scheduled-report', {
        body: { report_id: reportId, manual: true }
      });

      if (error) throw error;
      console.log('Report executed successfully:', data);
    } catch (error) {
      console.error('Error running report:', error);
    }
  };

  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      default: return frequency;
    }
  };

  const getNextRunTime = (schedule: any) => {
    if (!schedule.frequency || !schedule.time) return 'Not scheduled';
    
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun <= now) {
      if (schedule.frequency === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
      } else if (schedule.frequency === 'weekly') {
        nextRun.setDate(nextRun.getDate() + 7);
      } else if (schedule.frequency === 'monthly') {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
    }
    
    return nextRun.toLocaleString();
  };

  const renderReportCard = (report: ScheduledReport) => (
    <Card key={report.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{report.report_name}</CardTitle>
            <CardDescription>{report.report_description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={report.is_scheduled ? 'default' : 'secondary'}>
              {report.is_scheduled ? 'Active' : 'Inactive'}
            </Badge>
            <Switch
              checked={report.is_scheduled}
              onCheckedChange={(checked) => toggleReportSchedule(report.id, checked)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frequency</p>
              <p className="text-sm">{getFrequencyDisplay(report.schedule_config?.frequency)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-sm">{report.schedule_config?.time || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recipients</p>
              <p className="text-sm">{report.schedule_config?.recipients?.length || 0} recipient(s)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Format</p>
              <p className="text-sm">{report.schedule_config?.format || 'PDF'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Next Run</p>
            <p className="text-sm">{getNextRunTime(report.schedule_config)}</p>
          </div>
          
          {report.last_generated && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Generated</p>
              <p className="text-sm">{new Date(report.last_generated).toLocaleString()}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => runReportNow(report.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Now
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditingReport(report.id)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderScheduleEditor = (report: ScheduledReport) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Schedule Configuration</CardTitle>
        <CardDescription>Configure when and how this report should run</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={report.schedule_config?.frequency || ''} 
                onValueChange={(value) => {
                  const newConfig = { ...report.schedule_config, frequency: value };
                  updateScheduleConfig(report.id, newConfig);
                }}
              >
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
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                type="time"
                value={report.schedule_config?.time || ''}
                onChange={(e) => {
                  const newConfig = { ...report.schedule_config, time: e.target.value };
                  updateScheduleConfig(report.id, newConfig);
                }}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="format">Export Format</Label>
            <Select 
              value={report.schedule_config?.format || 'pdf'} 
              onValueChange={(value) => {
                const newConfig = { ...report.schedule_config, format: value };
                updateScheduleConfig(report.id, newConfig);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="recipients">Email Recipients (comma-separated)</Label>
            <Input
              placeholder="email1@example.com, email2@example.com"
              value={report.schedule_config?.recipients?.join(', ') || ''}
              onChange={(e) => {
                const recipients = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                const newConfig = { ...report.schedule_config, recipients };
                updateScheduleConfig(report.id, newConfig);
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setEditingReport(null)}>
              Cancel
            </Button>
            <Button onClick={() => setEditingReport(null)}>
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Reports</h2>
          <p className="text-muted-foreground">Schedule and manage automated report generation</p>
        </div>
        <Button onClick={fetchScheduledReports}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{reports.filter(r => r.is_scheduled).length}</div>
                <div className="text-sm text-muted-foreground">Active Schedules</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {reports.reduce((sum, r) => sum + (r.schedule_config?.recipients?.length || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Recipients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id}>
              {renderReportCard(report)}
              {editingReport === report.id && renderScheduleEditor(report)}
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No automated reports configured.</p>
                <p className="text-sm mt-2">Create a custom report and enable scheduling to get started.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AutomatedReports;