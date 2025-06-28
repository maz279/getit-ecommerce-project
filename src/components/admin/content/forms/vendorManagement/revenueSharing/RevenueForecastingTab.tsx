
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react';

export const RevenueForecastingTab: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState('quarterly');

  const forecasts = [
    {
      period: 'Q1 2024',
      predicted: '৳3.2M',
      confidence: 92,
      growth: '+28%',
      status: 'high'
    },
    {
      period: 'Q2 2024',
      predicted: '৳3.8M',
      confidence: 87,
      growth: '+35%',
      status: 'high'
    },
    {
      period: 'Q3 2024',
      predicted: '৳4.1M',
      confidence: 78,
      growth: '+42%',
      status: 'medium'
    },
    {
      period: 'Q4 2024',
      predicted: '৳4.5M',
      confidence: 65,
      growth: '+48%',
      status: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue Forecasting</h3>
          <p className="text-gray-600">AI-powered revenue predictions and growth analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Forecast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {forecasts.map((forecast, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{forecast.period}</CardTitle>
                <Badge variant={forecast.status === 'high' ? 'default' : 'secondary'}>
                  {forecast.confidence}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{forecast.predicted}</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">{forecast.growth}</span>
                </div>
                <div className="text-xs text-gray-500">vs previous period</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Revenue Targets vs Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Q1 2024 Target</p>
                  <p className="text-lg font-bold text-blue-600">৳3.0M</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Forecast: ৳3.2M</p>
                  <Badge className="bg-green-100 text-green-800">+6.7%</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Q2 2024 Target</p>
                  <p className="text-lg font-bold text-green-600">৳3.5M</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Forecast: ৳3.8M</p>
                  <Badge className="bg-green-100 text-green-800">+8.6%</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Q3 2024 Target</p>
                  <p className="text-lg font-bold text-purple-600">৳3.8M</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Forecast: ৳4.1M</p>
                  <Badge className="bg-green-100 text-green-800">+7.9%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Seasonal Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eid Festival Season</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm text-red-600">+85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Winter Shopping</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm text-blue-600">+45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Back to School</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm text-green-600">+65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Year Sales</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm text-purple-600">+75%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Peak revenue expected during Eid season</li>
                <li>• Electronics see 40% boost in winter</li>
                <li>• Fashion items peak before festivals</li>
                <li>• Home items surge during monsoon</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Factors Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-600 mb-2">Positive Drivers</h4>
              <ul className="text-sm space-y-1">
                <li>• New vendor onboarding (+15%)</li>
                <li>• Mobile app adoption (+25%)</li>
                <li>• Premium services growth (+30%)</li>
                <li>• Rural market expansion (+20%)</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-red-600 mb-2">Risk Factors</h4>
              <ul className="text-sm space-y-1">
                <li>• Economic uncertainty (-5%)</li>
                <li>• Competition increase (-8%)</li>
                <li>• Supply chain issues (-3%)</li>
                <li>• Regulatory changes (-2%)</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-blue-600 mb-2">Opportunities</h4>
              <ul className="text-sm space-y-1">
                <li>• B2B marketplace launch (+40%)</li>
                <li>• International expansion (+35%)</li>
                <li>• AI recommendations (+12%)</li>
                <li>• Subscription services (+18%)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
