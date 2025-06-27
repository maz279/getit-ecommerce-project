
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Star, TrendingUp, Search, Award, DollarSign, Calendar } from 'lucide-react';
import { VendorSearchStats } from './types';

interface VendorSearchStatsCardsProps {
  stats: VendorSearchStats;
}

export const VendorSearchStatsCards: React.FC<VendorSearchStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            Total Vendors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalVendors.toLocaleString()}</div>
          <p className="text-xs text-gray-500">
            {stats.activeVendors.toLocaleString()} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Shield className="h-4 w-4 mr-2 text-green-600" />
            Verified Vendors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.verifiedVendors.toLocaleString()}</div>
          <p className="text-xs text-gray-500">
            {Math.round((stats.verifiedVendors / stats.totalVendors) * 100)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-600" />
            Average Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-gray-500">
            Platform average
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
            New This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</div>
          <p className="text-xs text-gray-500">
            +{Math.round((stats.newThisMonth / stats.totalVendors) * 100)}% growth
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Search className="h-4 w-4 mr-2 text-indigo-600" />
            Searches This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">{stats.searchesThisMonth.toLocaleString()}</div>
          <p className="text-xs text-gray-500">
            Platform searches
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Award className="h-4 w-4 mr-2 text-orange-600" />
            Pending Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</div>
          <p className="text-xs text-gray-500">
            Awaiting review
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-green-600" />
            Total Sales Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ৳{(stats.totalSalesVolume / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-gray-500">
            Platform total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-red-600" />
            Suspended
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.suspendedVendors}</div>
          <p className="text-xs text-gray-500">
            Require attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
