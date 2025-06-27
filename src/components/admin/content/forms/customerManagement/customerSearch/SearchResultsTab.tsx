
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Star, TrendingUp, Eye, Edit } from 'lucide-react';
import { CustomerSearchData, SearchFilter } from './types';

interface SearchResultsTabProps {
  customers: CustomerSearchData[];
  selectedCustomers: string[];
  onCustomerSelect: (customerId: string, selected: boolean) => void;
  searchQuery: string;
  appliedFilters: SearchFilter[];
}

export const SearchResultsTab: React.FC<SearchResultsTabProps> = ({
  customers,
  selectedCustomers,
  onCustomerSelect,
  searchQuery,
  appliedFilters
}) => {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'vip': case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold">{customers.length}</span> customers
                {searchQuery && <span> matching "{searchQuery}"</span>}
              </p>
              {appliedFilters.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">Filters:</span>
                  {appliedFilters.map((filter, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {selectedCustomers.length} selected
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Results */}
      <div className="grid gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) => onCustomerSelect(customer.id, checked as boolean)}
                />
                
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTierColor(customer.tier)}>
                        {customer.tier}
                      </Badge>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{customer.location.city}, {customer.location.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">${customer.lifetimeValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{customer.satisfactionRating}/5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {customer.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{customer.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{customer.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600">
              Try adjusting your search query or filters to find more customers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
