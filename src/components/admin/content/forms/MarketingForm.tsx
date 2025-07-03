import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MarketingForm = () => {
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: 'email',
    target_audience: '',
    budget: '',
    start_date: '',
    end_date: '',
    content: '',
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
          event_name: 'marketing_campaign_created',
          event_category: 'marketing',
          event_action: 'campaign_setup',
          custom_properties: {
            campaign_name: formData.campaign_name,
            campaign_type: formData.campaign_type,
            target_audience: formData.target_audience,
            budget: parseFloat(formData.budget) || 0,
            start_date: formData.start_date,
            end_date: formData.end_date,
            content: formData.content,
            is_active: formData.is_active
          }
        }]);

      if (error) throw error;

      toast({
        title: "Marketing Campaign Created",
        description: "Campaign has been set up successfully.",
      });

      setFormData({
        campaign_name: '',
        campaign_type: 'email',
        target_audience: '',
        budget: '',
        start_date: '',
        end_date: '',
        content: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error creating marketing campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create marketing campaign.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Marketing Campaign Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaign_name">Campaign Name</Label>
              <Input
                id="campaign_name"
                value={formData.campaign_name}
                onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                placeholder="e.g., Summer Sale 2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="campaign_type">Campaign Type</Label>
              <Select 
                value={formData.campaign_type} 
                onValueChange={(value) => setFormData({...formData, campaign_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="display_ads">Display Ads</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
              placeholder="e.g., 18-35 urban customers"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget (BDT)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="50000"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Campaign</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Campaign Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Campaign message, creative brief, or content description..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Marketing Campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};