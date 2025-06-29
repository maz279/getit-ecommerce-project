
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { DollarSign, TrendingUp, Users, Calendar, Target, AlertCircle } from 'lucide-react';

const clvTrendData = [
  { month: 'Jan', avgCLV: 245, predictedCLV: 280, newCustomers: 1200 },
  { month: 'Feb', avgCLV: 268, predictedCLV: 295, newCustomers: 1450 },
  { month: 'Mar', avgCLV: 290, predictedCLV: 315, newCustomers: 1680 },
  { month: 'Apr', avgCLV: 315, predictedCLV: 340, newCustomers: 1820 },
  { month: 'May', avgCLV: 342, predictedCLV: 365, newCustomers: 1950 },
  { month: 'Jun', avgCLV: 368, predictedCLV: 390, newCustomers: 2100 },
];

const segmentCLV = [
  { segment: 'VIP Customers', clv: 1250, count: 2150, revenue: 2687500, growth: 15.2 },
  { segment: 'Regular Shoppers', clv: 485, count: 18500, revenue: 8972500, growth: 8.7 },
  { segment: 'Occasional Buyers', clv: 156, count: 45200, revenue: 7051200, growth: -2.3 },
  { segment: 'New Customers', clv: 89, count: 12800, revenue: 1139200, growth: 45.6 },
];

const clvPredictionData = [
  { months: 3, predicted: 125, actual: 118 },
  { months: 6, predicted: 245, actual: 238 },
  { months: 12, predicted: 485, actual: 462 },
  { months: 24, predicted: 750, actual: 720 },
  { months: 36, predicted: 980, actual: null },
];

export const LifetimeValueAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [selectedSegment, setSelectedSegment] = useState('all');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Lifetime Value</h1>
          <p className="text-gray-600 mt-1">Comprehensive CLV analysis and predictions</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="24m">24 Months</SelectItem>
              <SelectItem value="36m">36 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export CLV Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CLV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$368</div>
            <p className="text-xs text-muted-foreground">+12.5% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted CLV</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420</div>
            <p className="text-xs text-muted-foreground">12-month projection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Value Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,950</div>
            <p className="text-xs text-muted-foreground">CLV > $500</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLV Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.8%</div>
            <p className="text-xs text-muted-foreground">Year over year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">CLV Overview</TabsTrigger>
          <TabsTrigger value="segments">Segment Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLV Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clvTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgCLV" stroke="#3B82F6" strokeWidth={2} name="Average CLV" />
                  <Line type="monotone" dataKey="predictedCLV" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Predicted CLV" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CLV Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">$1000+ (VIP)</span>
                    <div className="text-right">
                      <div className="font-semibold">2,150 customers</div>
                      <div className="text-sm text-gray-600">2.4%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">$500-$999</span>
                    <div className="text-right">
                      <div className="font-semibold">6,800 customers</div>
                      <div className="text-sm text-gray-600">7.7%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">$200-$499</span>
                    <div className="text-right">
                      <div className="font-semibold">25,400 customers</div>
                      <div className="text-sm text-gray-600">28.9%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">$50-$199</span>
                    <div className="text-right">
                      <div className="font-semibold">35,200 customers</div>
                      <div className="text-sm text-gray-600">40.0%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">< $50</span>
                    <div className="text-right">
                      <div className="font-semibold">18,000 customers</div>
                      <div className="text-sm text-gray-600">20.5%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CLV Factors Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Purchase Frequency</span>
                    <div className="text-right">
                      <div className="text-sm">Impact: High</div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Order Value</span>
                    <div className="text-right">
                      <div className="text-sm">Impact: High</div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-18 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Lifespan</span>
                    <div className="text-right">
                      <div className="text-sm">Impact: Medium</div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Referral Activity</span>
                    <div className="text-right">
                      <div className="text-sm">Impact: Medium</div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-14 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Support Interactions</span>
                    <div className="text-right">
                      <div className="text-sm">Impact: Low</div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-8 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLV by Customer Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Segment</th>
                      <th className="text-left p-3">Avg CLV</th>
                      <th className="text-left p-3">Customers</th>
                      <th className="text-left p-3">Total Revenue</th>
                      <th className="text-left p-3">Growth</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentCLV.map((segment, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{segment.segment}</td>
                        <td className="p-3">${segment.clv}</td>
                        <td className="p-3">{segment.count.toLocaleString()}</td>
                        <td className="p-3">${(segment.revenue / 1000000).toFixed(1)}M</td>
                        <td className="p-3">
                          <Badge variant={segment.growth > 0 ? "default" : "destructive"}>
                            {segment.growth > 0 ? '+' : ''}{segment.growth}%
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">Analyze</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLV Prediction Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clvPredictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="months" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} name="Predicted CLV" />
                  <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual CLV" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Model Accuracy</span>
                    <span className="text-2xl font-bold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Mean Absolute Error</span>
                    <span className="text-lg font-semibold">$23.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">R² Score</span>
                    <span className="text-lg font-semibold">0.89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Last Updated</span>
                    <span className="text-sm text-gray-600">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">High-value customer at risk</div>
                      <div className="text-xs text-gray-600">850 customers showing decline</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <div className="font-medium text-sm">CLV prediction variance</div>
                      <div className="text-xs text-gray-600">Model accuracy below threshold</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLV Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Increase Purchase Frequency</h3>
                  <p className="text-sm text-gray-600 mb-3">Target customers with 2-3 purchases per year to increase frequency to 4-5 purchases.</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Potential CLV Increase: +$125</Badge>
                    <Badge variant="outline">Affected Customers: 15,200</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Upsell High-Value Products</h3>
                  <p className="text-sm text-gray-600 mb-3">Recommend premium products to customers with high purchase frequency.</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Potential CLV Increase: +$89</Badge>
                    <Badge variant="outline">Affected Customers: 8,500</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Retention Campaign</h3>
                  <p className="text-sm text-gray-600 mb-3">Re-engage customers who haven't purchased in 6+ months.</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Potential CLV Increase: +$67</Badge>
                    <Badge variant="outline">Affected Customers: 22,100</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
