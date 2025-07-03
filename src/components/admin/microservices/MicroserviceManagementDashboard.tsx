/**
 * Microservice Management Dashboard
 * Central hub for managing all microservices
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceHealthDashboard } from './ServiceHealthDashboard';
import { ApiGatewayManagement } from './ApiGatewayManagement';
import { FraudDetectionDashboard } from './FraudDetectionDashboard';
import { 
  Activity, 
  Shield, 
  BarChart3, 
  Network, 
  Container, 
  Router,
  Zap
} from 'lucide-react';

export const MicroserviceManagementDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Microservice Management</h1>
          <p className="text-gray-600 mt-1">
            Complete control center for all microservices and infrastructure
          </p>
        </div>
      </div>

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="gateway" className="flex items-center gap-2">
            <Router className="h-4 w-4" />
            Gateway
          </TabsTrigger>
          <TabsTrigger value="fraud" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Fraud Detection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          <ServiceHealthDashboard />
        </TabsContent>

        <TabsContent value="gateway" className="space-y-6">
          <ApiGatewayManagement />
        </TabsContent>

        <TabsContent value="fraud" className="space-y-6">
          <FraudDetectionDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};