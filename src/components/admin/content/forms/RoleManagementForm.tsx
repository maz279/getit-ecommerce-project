
import React from 'react';
import { Shield, Plus, BarChart3, CheckCircle, UserCheck, Key, Lock, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleDirectory } from './roleManagement/RoleDirectory';
import { PermissionsMatrix } from './roleManagement/PermissionsMatrix';
import { RoleAnalytics } from './roleManagement/RoleAnalytics';
import { RoleSecurityCenter } from './roleManagement/RoleSecurityCenter';

export const RoleManagementForm: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive role and permission management system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  5 Active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Users</p>
                <p className="text-3xl font-bold text-gray-900">83</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <UserCheck className="w-4 h-4 mr-1" />
                  11 Admins
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  12 High Risk
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-3xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Zap className="w-4 h-4 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="roles">Role Directory</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="analytics">Role Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Center</TabsTrigger>
          <TabsTrigger value="settings">Role Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <RoleDirectory />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <PermissionsMatrix />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <RoleAnalytics />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <RoleSecurityCenter />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <RoleSecurityCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};
