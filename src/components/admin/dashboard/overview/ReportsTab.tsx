
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, Package, Download, Calendar } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Sales Report
            </CardTitle>
            <CardDescription>Generate comprehensive sales analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-green-600">৳2,45,890</div>
              <p className="text-sm text-gray-600">Total sales this month</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Activity Report
            </CardTitle>
            <CardDescription>User engagement and behavior analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-blue-600">12,456</div>
              <p className="text-sm text-gray-600">Active users this month</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Inventory Report
            </CardTitle>
            <CardDescription>Stock levels and inventory analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-purple-600">1,234</div>
              <p className="text-sm text-gray-600">Total products in stock</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Create personalized reports with specific parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select defaultValue="sales">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="users">User Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-from">From Date</Label>
              <Input id="date-from" type="date" />
            </div>
            <div>
              <Label htmlFor="date-to">To Date</Label>
              <Input id="date-to" type="date" />
            </div>
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frequency">Schedule Frequency</Label>
              <Select defaultValue="once">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">One Time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email Recipients</Label>
              <Input id="email" type="email" placeholder="admin@getit.com" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
