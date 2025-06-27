
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, CheckCircle, XCircle, Flag, Search, Filter } from 'lucide-react';

export const RatingModerationTab: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingReviews = [
    {
      id: '1',
      customerName: 'Anonymous User',
      vendorName: 'Electronics Pro',
      productName: 'Gaming Laptop',
      rating: 1,
      reviewText: 'Terrible product, completely fake specifications. Waste of money.',
      date: '2024-01-15',
      riskScore: 85,
      flags: ['Suspicious Language', 'Unverified Purchase'],
      priority: 'high'
    },
    {
      id: '2',
      customerName: 'Sarah Ahmed',
      vendorName: 'Fashion Hub',
      productName: 'Designer Handbag',
      rating: 5,
      reviewText: 'Love this bag! Amazing quality and fast shipping.',
      date: '2024-01-14',
      riskScore: 25,
      flags: ['Repeated Phrases'],
      priority: 'low'
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Moderation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-500" />
            Review Moderation Queue
          </CardTitle>
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
                <SelectItem value="high-risk">High Risk</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{review.customerName}</span>
                      <Badge className={getPriorityColor(review.priority)}>
                        {review.priority} priority
                      </Badge>
                      <span className={`text-sm font-medium ${getRiskColor(review.riskScore)}`}>
                        Risk Score: {review.riskScore}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {review.vendorName} • {review.productName} • {review.date}
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
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {review.flags.map((flag, index) => (
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
                    <Button variant="outline" size="sm" className="text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Fake Review Detection</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Duplicate Content Check</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Sentiment Analysis</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Language Pattern Detection</span>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Auto-moderation Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Auto-approve verified purchases (Risk &lt; 30%)</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Auto-flag high risk reviews (Risk &gt; 70%)</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Require manual review for disputes</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
