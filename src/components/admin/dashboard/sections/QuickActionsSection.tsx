import React from 'react';
import { 
  Zap, Plus, Users, Package, ShoppingCart, DollarSign, 
  Bell, Settings, FileText, Upload, Download, Mail 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const QuickActionsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold flex items-center">
        <Zap className="h-6 w-6 mr-2 text-yellow-600" />
        Quick Actions Center
      </h2>
      <Button variant="outline" size="sm">
        Customize Actions
      </Button>
    </div>

    {/* Primary Actions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Primary Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-6 h-auto hover:bg-blue-50 hover:border-blue-300"
          >
            <Package className="h-8 w-8 mb-2 text-blue-600" />
            <span className="text-sm font-medium">Add Product</span>
            <span className="text-xs text-gray-500 mt-1">New listing</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center p-6 h-auto hover:bg-green-50 hover:border-green-300"
          >
            <Users className="h-8 w-8 mb-2 text-green-600" />
            <span className="text-sm font-medium">Add User</span>
            <span className="text-xs text-gray-500 mt-1">New account</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center p-6 h-auto hover:bg-purple-50 hover:border-purple-300"
          >
            <ShoppingCart className="h-8 w-8 mb-2 text-purple-600" />
            <span className="text-sm font-medium">Process Order</span>
            <span className="text-xs text-gray-500 mt-1">Manual entry</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center p-6 h-auto hover:bg-orange-50 hover:border-orange-300"
          >
            <Bell className="h-8 w-8 mb-2 text-orange-600" />
            <span className="text-sm font-medium">Send Alert</span>
            <span className="text-xs text-gray-500 mt-1">Broadcast</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Management Actions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Management Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">User Management</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Vendors
                <Badge variant="secondary" className="ml-auto">23</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Review KYC Documents
                <Badge variant="destructive" className="ml-auto">8</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Customer Support Queue
                <Badge variant="secondary" className="ml-auto">15</Badge>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Order Management</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Pending Orders
                <Badge variant="secondary" className="ml-auto">67</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Refund Requests
                <Badge variant="destructive" className="ml-auto">12</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Delivery Issues
                <Badge variant="secondary" className="ml-auto">5</Badge>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Data Operations */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Data Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
          >
            <Upload className="h-6 w-6 mb-2 text-blue-600" />
            <span className="text-sm">Import Products</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
          >
            <Download className="h-6 w-6 mb-2 text-green-600" />
            <span className="text-sm">Export Data</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
          >
            <FileText className="h-6 w-6 mb-2 text-purple-600" />
            <span className="text-sm">Generate Report</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
          >
            <DollarSign className="h-6 w-6 mb-2 text-yellow-600" />
            <span className="text-sm">Process Payouts</span>
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Communication Actions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Communication Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Email Campaigns</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Newsletter Blast
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Vendor Updates
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Customer Announcements
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">SMS Notifications</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Order Updates
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Payment Reminders
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Promotional Offers
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Push Notifications</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                App Notifications
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Web Push
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Emergency Alerts
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Recent Actions */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { action: 'Added new product category', user: 'Admin User', time: '2 minutes ago', type: 'product' },
            { action: 'Processed vendor payout', user: 'Finance Team', time: '15 minutes ago', type: 'finance' },
            { action: 'Sent newsletter to customers', user: 'Marketing Team', time: '1 hour ago', type: 'communication' },
            { action: 'Updated shipping rates', user: 'Operations Team', time: '2 hours ago', type: 'settings' },
            { action: 'Resolved customer complaint', user: 'Support Team', time: '3 hours ago', type: 'support' }
          ].map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  action.type === 'product' ? 'bg-blue-500' :
                  action.type === 'finance' ? 'bg-green-500' :
                  action.type === 'communication' ? 'bg-purple-500' :
                  action.type === 'settings' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>
                <div>
                  <span className="text-sm font-medium">{action.action}</span>
                  <div className="text-xs text-gray-500">by {action.user}</div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{action.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export { QuickActionsSection } from './enhanced/QuickActionsSection';
