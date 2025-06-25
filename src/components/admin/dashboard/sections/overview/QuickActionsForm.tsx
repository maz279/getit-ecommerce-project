
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Download,
  Settings,
  Users,
  Package,
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const QuickActionsForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const quickActions = [
    { icon: Plus, label: 'Add Product', color: 'bg-green-500' },
    { icon: Users, label: 'Add User', color: 'bg-blue-500' },
    { icon: ShoppingCart, label: 'View Orders', color: 'bg-purple-500' },
    { icon: Package, label: 'Inventory', color: 'bg-orange-500' },
    { icon: Upload, label: 'Import Data', color: 'bg-indigo-500' },
    { icon: Download, label: 'Export Reports', color: 'bg-pink-500' },
    { icon: Settings, label: 'Settings', color: 'bg-gray-500' },
    { icon: Search, label: 'Advanced Search', color: 'bg-teal-500' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Admin Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="announce">Announce</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div>
                <Label htmlFor="global-search">Global Search</Label>
                <div className="flex space-x-2">
                  <Input
                    id="global-search"
                    placeholder="Search users, products, orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="search-type">Search In</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="vendors">Vendors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="announce" className="space-y-4">
              <div>
                <Label htmlFor="announcement">Platform Announcement</Label>
                <Textarea
                  id="announcement"
                  placeholder="Enter announcement for all users..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="announce-type">Announcement Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Send Announcement</Button>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="registration">New Registrations</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Update Settings</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
