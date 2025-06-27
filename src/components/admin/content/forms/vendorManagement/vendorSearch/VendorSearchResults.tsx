
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { VendorSearchResult, VendorSearchFilter } from './types';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Package, 
  DollarSign,
  Shield,
  Eye,
  Edit,
  MoreHorizontal,
  Grid,
  List
} from 'lucide-react';

interface VendorSearchResultsProps {
  results: VendorSearchResult[];
  filters: VendorSearchFilter;
  onFilterChange: (filters: Partial<VendorSearchFilter>) => void;
}

export const VendorSearchResults: React.FC<VendorSearchResultsProps> = ({
  results,
  filters,
  onFilterChange
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVendors(
      selectedVendors.length === results.length 
        ? [] 
        : results.map(vendor => vendor.id)
    );
  };

  const VendorCard = ({ vendor }: { vendor: VendorSearchResult }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={selectedVendors.includes(vendor.id)}
              onCheckedChange={() => handleSelectVendor(vendor.id)}
            />
            <div className="flex-1">
              <CardTitle className="text-lg">{vendor.businessName}</CardTitle>
              <p className="text-sm text-gray-600">{vendor.contactPerson}</p>
              <div className="flex items-center mt-2 gap-2">
                <Badge className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
                <Badge className={getPerformanceColor(vendor.performanceLevel)}>
                  {vendor.performanceLevel}
                </Badge>
                {vendor.verificationStatus === 'verified' && (
                  <Shield className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            {vendor.rating.toFixed(1)} rating
          </div>
          <div className="flex items-center text-gray-600">
            <Package className="h-4 w-4 mr-1" />
            {vendor.products.active} products
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            ৳{(vendor.totalSales / 1000).toFixed(0)}K sales
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {vendor.location.city}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Joined: {new Date(vendor.joinDate).toLocaleDateString()}</span>
          <span>Profile: {vendor.profileCompleteness}%</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <Phone className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {results.length} vendors found
          </h3>
          <p className="text-sm text-gray-600">
            {selectedVendors.length} selected
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedVendors.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedVendors.length === results.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedVendors.length} vendors selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  Export Selected
                </Button>
                <Button size="sm" variant="outline">
                  Bulk Actions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      }>
        {results.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-600">
          Showing 1-{results.length} of {results.length} vendors
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
