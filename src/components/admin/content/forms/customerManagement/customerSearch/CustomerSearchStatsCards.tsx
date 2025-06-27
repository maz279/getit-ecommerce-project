
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Search, TrendingUp, Filter, Target, Clock } from 'lucide-react';
import { CustomerSearchData } from './types';

interface CustomerSearchStatsCardsProps {
  customers: CustomerSearchData[];
  selectedCount: number;
}

export const CustomerSearchStatsCards: React.FC<CustomerSearchStatsCardsProps> = ({
  customers,
  selectedCount
}) => {
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const vipCustomers = customers.filter(c => c.tier === 'VIP' || c.tier === 'Platinum').length;
  const avgLifetimeValue = customers.length > 0 
    ? customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length 
    : 0;
  const highValueCustomers = customers.filter(c => c.lifetimeValue > 10000).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Search className="h-6 w-6 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
          <div className="text-sm text-gray-500 text-center">Search Results</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Users className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{activeCustomers}</div>
          <div className="text-sm text-gray-500 text-center">Active Customers</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Target className="h-6 w-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{vipCustomers}</div>
          <div className="text-sm text-gray-500 text-center">VIP/Platinum</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <TrendingUp className="h-6 w-6 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{highValueCustomers}</div>
          <div className="text-sm text-gray-500 text-center">High Value ($10K+)</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Clock className="h-6 w-6 text-indigo-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">${avgLifetimeValue.toFixed(0)}</div>
          <div className="text-sm text-gray-500 text-center">Avg Lifetime Value</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Filter className="h-6 w-6 text-pink-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{selectedCount}</div>
          <div className="text-sm text-gray-500 text-center">Selected</div>
        </CardContent>
      </Card>
    </div>
  );
};
