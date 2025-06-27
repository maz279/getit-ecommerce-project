
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { VendorSearchFilter } from './types';
import { Search, Save, Download } from 'lucide-react';

interface AdvancedSearchTabProps {
  filters: VendorSearchFilter;
  onFilterChange: (filters: Partial<VendorSearchFilter>) => void;
}

export const AdvancedSearchTab: React.FC<AdvancedSearchTabProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>
              
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="Search by business name..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Search by contact person..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Search by email..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Search by phone number..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Location & Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Category</h3>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Search by city..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State/Division</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhaka">Dhaka Division</SelectItem>
                    <SelectItem value="chittagong">Chittagong Division</SelectItem>
                    <SelectItem value="sylhet">Sylhet Division</SelectItem>
                    <SelectItem value="rajshahi">Rajshahi Division</SelectItem>
                    <SelectItem value="khulna">Khulna Division</SelectItem>
                    <SelectItem value="barisal">Barisal Division</SelectItem>
                    <SelectItem value="rangpur">Rangpur Division</SelectItem>
                    <SelectItem value="mymensingh">Mymensingh Division</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Primary Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home-garden">Home & Garden</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="books">Books & Media</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="health-beauty">Health & Beauty</SelectItem>
                    <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="premium, fast-shipping, top-rated..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="min-rating">Minimum Rating</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star & Above</SelectItem>
                    <SelectItem value="2">2 Stars & Above</SelectItem>
                    <SelectItem value="3">3 Stars & Above</SelectItem>
                    <SelectItem value="4">4 Stars & Above</SelectItem>
                    <SelectItem value="4.5">4.5 Stars & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="min-sales">Minimum Sales Volume</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum sales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10000">৳10K+</SelectItem>
                    <SelectItem value="50000">৳50K+</SelectItem>
                    <SelectItem value="100000">৳100K+</SelectItem>
                    <SelectItem value="500000">৳500K+</SelectItem>
                    <SelectItem value="1000000">৳1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="min-orders">Minimum Orders</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum orders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10+ Orders</SelectItem>
                    <SelectItem value="50">50+ Orders</SelectItem>
                    <SelectItem value="100">100+ Orders</SelectItem>
                    <SelectItem value="500">500+ Orders</SelectItem>
                    <SelectItem value="1000">1000+ Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Verification & Compliance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Verification & Compliance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Required Documents</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="trade-license" />
                    <Label htmlFor="trade-license">Trade License</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tax-certificate" />
                    <Label htmlFor="tax-certificate">Tax Certificate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bank-statement" />
                    <Label htmlFor="bank-statement">Bank Statement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="identity-proof" />
                    <Label htmlFor="identity-proof">Identity Proof</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="compliance-score">Minimum Compliance Score</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% & Above</SelectItem>
                    <SelectItem value="70">70% & Above</SelectItem>
                    <SelectItem value="80">80% & Above</SelectItem>
                    <SelectItem value="90">90% & Above</SelectItem>
                    <SelectItem value="95">95% & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Custom Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Search</h3>
            
            <div>
              <Label htmlFor="custom-query">Custom Query</Label>
              <Textarea
                id="custom-query"
                placeholder="Enter advanced search query using keywords, operators, and filters..."
                className="mt-1"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Example: category:electronics AND rating:>4.5 AND location:dhaka OR verified:true
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </Button>
            </div>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Query
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
