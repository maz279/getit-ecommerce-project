import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Package, BarChart3 } from 'lucide-react';

export const AdvancedInventoryManager = () => {
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 12450,
    lowStockItems: 89,
    outOfStockItems: 23,
    forecastAccuracy: 94.2
  });

  const [forecastData, setForecastData] = useState([
    { product: 'iPhone 15 Pro', currentStock: 45, predicted7Days: 15, predicted30Days: 8, confidence: 89 },
    { product: 'Samsung Galaxy S24', currentStock: 23, predicted7Days: 35, predicted30Days: 12, confidence: 92 },
    { product: 'MacBook Air M3', currentStock: 12, predicted7Days: 8, predicted30Days: 3, confidence: 87 }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'iPhone 15 Pro stock will run out in 3 days', product: 'iPhone 15 Pro' },
    { id: 2, type: 'warning', message: 'Samsung Galaxy S24 below reorder point', product: 'Samsung Galaxy S24' },
    { id: 3, type: 'info', message: 'MacBook Air M3 demand spike detected', product: 'MacBook Air M3' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Advanced Inventory Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Forecast
          </Button>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Bulk Reorder
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryData.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryData.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Critical shortage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inventoryData.forecastAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Critical Alerts</h3>
        {alerts.map((alert) => (
          <Alert key={alert.id} className={`${
            alert.type === 'critical' ? 'border-red-200 bg-red-50' :
            alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{alert.product}:</strong> {alert.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <Tabs defaultValue="forecasting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecasting">AI Forecasting</TabsTrigger>
          <TabsTrigger value="replenishment">Auto Replenishment</TabsTrigger>
          <TabsTrigger value="optimization">Stock Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Demand Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{item.product}</h4>
                        <p className="text-sm text-muted-foreground">Current Stock: {item.currentStock} units</p>
                      </div>
                      <Badge variant={item.confidence > 90 ? "default" : "secondary"}>
                        {item.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm font-medium">7-Day Forecast</p>
                        <p className="text-lg font-bold text-orange-600">{item.predicted7Days} units remaining</p>
                        <Progress value={(item.predicted7Days / item.currentStock) * 100} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">30-Day Forecast</p>
                        <p className="text-lg font-bold text-red-600">{item.predicted30Days} units remaining</p>
                        <Progress value={(item.predicted30Days / item.currentStock) * 100} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replenishment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Replenishment Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Smart Reorder Points</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI-calculated reorder points based on demand patterns and lead times
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Configure Rules</Button>
                    <Button size="sm" variant="outline">View History</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Supplier Integration</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatic purchase orders sent to suppliers when stock hits reorder point
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Manage Suppliers</Button>
                    <Button size="sm" variant="outline">Order Templates</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Optimization Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Overstock Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    45 products identified with excess inventory worth ৳2.3M
                  </p>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Seasonal Patterns</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Eid collection demand spike predicted in 2 weeks
                  </p>
                  <Button size="sm" variant="outline">Prepare Inventory</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Inventory Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Turnover Rate</h4>
                  <div className="text-2xl font-bold text-green-600">8.4x</div>
                  <p className="text-sm text-muted-foreground">Annual turnover</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Carrying Cost</h4>
                  <div className="text-2xl font-bold text-orange-600">12.3%</div>
                  <p className="text-sm text-muted-foreground">Of inventory value</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Stockout Cost</h4>
                  <div className="text-2xl font-bold text-red-600">৳45.2K</div>
                  <p className="text-sm text-muted-foreground">Lost sales this month</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Fill Rate</h4>
                  <div className="text-2xl font-bold text-green-600">96.8%</div>
                  <p className="text-sm text-muted-foreground">Order fulfillment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};