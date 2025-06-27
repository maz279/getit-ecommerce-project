
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Users, 
  Star, 
  Truck, 
  Shield,
  TrendingUp
} from 'lucide-react';
import { VendorScorecard } from './types';

interface VendorScorecardTabProps {
  scorecard: VendorScorecard;
}

export const VendorScorecardTab: React.FC<VendorScorecardTabProps> = ({ scorecard }) => {
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 8) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const categories = [
    {
      key: 'orderManagement',
      title: 'Order Management',
      icon: Package,
      description: 'Order processing, fulfillment, and accuracy metrics'
    },
    {
      key: 'customerService',
      title: 'Customer Service',
      icon: Users,
      description: 'Customer support, response time, and satisfaction'
    },
    {
      key: 'productQuality',
      title: 'Product Quality',
      icon: Star,
      description: 'Product defects, returns, and quality ratings'
    },
    {
      key: 'logistics',
      title: 'Logistics',
      icon: Truck,
      description: 'Shipping, delivery, and logistics performance'
    },
    {
      key: 'businessCompliance',
      title: 'Business Compliance',
      icon: Shield,
      description: 'Legal compliance, policies, and ethical standards'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Vendor Scorecard - {scorecard.period}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive performance evaluation for Vendor {scorecard.vendorId}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => {
          const data = scorecard.categories[category.key as keyof typeof scorecard.categories];
          const Icon = category.icon;
          
          return (
            <Card key={category.key} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <Badge className={getScoreBadge(data.score)}>
                    {data.score.toFixed(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Category Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                      {data.score.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.score * 10} className="h-3 mb-4" />

                  {/* Individual Metrics */}
                  <div className="space-y-3">
                    {Object.entries(data.metrics).map(([metricKey, value]) => {
                      const metricName = metricKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      const isPercentage = typeof value === 'number' && (
                        metricKey.includes('Rate') || 
                        metricKey.includes('Accuracy') || 
                        metricKey.includes('Compliance') ||
                        metricKey.includes('Delivery')
                      );
                      const isRating = metricKey.includes('Rating') || metricKey.includes('Score') || metricKey.includes('Quality');
                      const isTime = metricKey.includes('Time');
                      
                      let displayValue: string;
                      let progressValue: number;
                      
                      if (isPercentage) {
                        displayValue = `${value}%`;
                        progressValue = value as number;
                      } else if (isRating) {
                        displayValue = `${value}/5`;
                        progressValue = (value as number) * 20;
                      } else if (isTime) {
                        displayValue = `${value}h`;
                        progressValue = Math.max(0, 100 - (value as number) * 20);
                      } else {
                        displayValue = value.toString();
                        progressValue = Math.min((value as number) * 10, 100);
                      }

                      return (
                        <div key={metricKey} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{metricName}</span>
                            <span className="text-xs font-medium">{displayValue}</span>
                          </div>
                          <Progress value={progressValue} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scorecard.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-green-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Improvement Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scorecard.improvementPlan.map((plan, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Package className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span className="text-sm text-orange-800">{plan}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Overall Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {categories.map((category) => {
              const data = scorecard.categories[category.key as keyof typeof scorecard.categories];
              const Icon = category.icon;
              
              return (
                <div key={category.key} className="p-4 bg-gray-50 rounded-lg">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                    {data.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">{category.title}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
