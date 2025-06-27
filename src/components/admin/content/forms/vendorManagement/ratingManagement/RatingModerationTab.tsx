
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, CheckCircle, XCircle, Flag, Search, Filter, Plus } from 'lucide-react';
import { RatingService, AIDetectionSetting } from '@/services/database/RatingService';
import { AddReviewModerationForm } from './forms/AddReviewModerationForm';
import { toast } from 'sonner';

export const RatingModerationTab: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [aiSettings, setAiSettings] = useState<AIDetectionSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsData, settingsData] = await Promise.all([
        RatingService.getReviewsForModeration(),
        RatingService.getAIDetectionSettings()
      ]);
      setReviews(reviewsData || []);
      setAiSettings(settingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (reviewId: string, action: string) => {
    try {
      await RatingService.updateModerationStatus(reviewId, action, `${action} by admin`);
      toast.success(`Review ${action} successfully`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating moderation status:', error);
      toast.error('Failed to update review status');
    }
  };

  const handleAISettingToggle = async (settingName: string, enabled: boolean) => {
    try {
      await RatingService.updateAIDetectionSetting(settingName, enabled);
      toast.success('AI setting updated successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating AI setting:', error);
      toast.error('Failed to update AI setting');
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

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || review.moderation_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Moderation Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-500" />
              Review Moderation Queue
            </CardTitle>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add Review for Moderation</DialogTitle>
                </DialogHeader>
                <AddReviewModerationForm
                  onSuccess={() => {
                    setShowAddForm(false);
                    fetchData();
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reviews found. {reviews.length === 0 && "Click 'Add Review' to create your first moderation entry."}
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{review.customer_name}</span>
                          <Badge className={getPriorityColor(review.priority_level)}>
                            {review.priority_level} priority
                          </Badge>
                          <Badge className={getStatusColor(review.moderation_status)}>
                            {review.moderation_status}
                          </Badge>
                          <span className={`text-sm font-medium ${getRiskColor(review.risk_score)}`}>
                            Risk Score: {review.risk_score}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Product: {review.product_name} • {new Date(review.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-500 mr-2">Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-gray-700">{review.review_text}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {review.flags && review.flags.map((flag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            {flag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Investigate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => handleModerationAction(review.id, 'approved')}
                          disabled={review.moderation_status === 'approved'}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleModerationAction(review.id, 'rejected')}
                          disabled={review.moderation_status === 'rejected'}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Detection Rules */}
      <Card>
        <CardHeader>
          <CardTitle>AI Detection Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Detection Rules</h4>
              <div className="space-y-3">
                {aiSettings
                  .filter(setting => setting.setting_type === 'detection_rule')
                  .map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-3 border rounded">
                      <span className="capitalize">{setting.setting_name.replace(/_/g, ' ')}</span>
                      <Switch
                        checked={setting.is_enabled}
                        onCheckedChange={(checked) => handleAISettingToggle(setting.setting_name, checked)}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Auto-moderation Settings</h4>
              <div className="space-y-3">
                {aiSettings
                  .filter(setting => setting.setting_type === 'auto_moderation')
                  .map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-3 border rounded">
                      <span className="capitalize">{setting.setting_name.replace(/_/g, ' ')}</span>
                      <Switch
                        checked={setting.is_enabled}
                        onCheckedChange={(checked) => handleAISettingToggle(setting.setting_name, checked)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
