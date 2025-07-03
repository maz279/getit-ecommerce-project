import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsForm = () => {
  const [formData, setFormData] = useState({
    metric_name: '',
    metric_type: 'sales',
    data_source: '',
    tracking_config: '{}',
    alert_thresholds: '{}',
    is_active: true
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          event_name: formData.metric_name,
          event_category: formData.metric_type,
          event_action: 'admin_created',
          custom_properties: {
            data_source: formData.data_source,
            tracking_config: JSON.parse(formData.tracking_config),
            alert_thresholds: JSON.parse(formData.alert_thresholds),
            is_active: formData.is_active
          }
        }]);

      if (error) throw error;

      toast({
        title: "Analytics Configuration Created",
        description: "Analytics tracking has been configured successfully.",
      });

      setFormData({
        metric_name: '',
        metric_type: 'sales',
        data_source: '',
        tracking_config: '{}',
        alert_thresholds: '{}',
        is_active: true
      });
    } catch (error) {
      console.error('Error creating analytics config:', error);
      toast({
        title: "Error",
        description: "Failed to create analytics configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Analytics Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metric_name">Metric Name</Label>
              <Input
                id="metric_name"
                value={formData.metric_name}
                onChange={(e) => setFormData({...formData, metric_name: e.target.value})}
                placeholder="e.g., Daily Sales"
                required
              />
            </div>
            <div>
              <Label htmlFor="metric_type">Metric Type</Label>
              <Select 
                value={formData.metric_type} 
                onValueChange={(value) => setFormData({...formData, metric_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="data_source">Data Source</Label>
            <Input
              id="data_source"
              value={formData.data_source}
              onChange={(e) => setFormData({...formData, data_source: e.target.value})}
              placeholder="e.g., database, api, webhook"
              required
            />
          </div>

          <div>
            <Label htmlFor="tracking_config">Tracking Configuration (JSON)</Label>
            <Textarea
              id="tracking_config"
              value={formData.tracking_config}
              onChange={(e) => setFormData({...formData, tracking_config: e.target.value})}
              placeholder='{"frequency": "daily", "aggregation": "sum"}'
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="alert_thresholds">Alert Thresholds (JSON)</Label>
            <Textarea
              id="alert_thresholds"
              value={formData.alert_thresholds}
              onChange={(e) => setFormData({...formData, alert_thresholds: e.target.value})}
              placeholder='{"warning": 1000, "critical": 500}'
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Analytics Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};