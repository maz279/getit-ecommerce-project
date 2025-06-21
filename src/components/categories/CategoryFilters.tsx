
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X, Star, Truck, Shield, Award, MapPin } from 'lucide-react';

interface FilterState {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: string[];
  rating: number;
  discount: string;
  delivery: string[];
  vendorType: string[];
  location: string;
  availability: string;
  condition: string;
  warranty: string[];
}

export const CategoryFilters: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    selectedBrands: [],
    selectedColors: [],
    selectedSizes: [],
    rating: 0,
    discount: '',
    delivery: [],
    vendorType: [],
    location: '',
    availability: '',
    condition: '',
    warranty: []
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    color: false,
    size: false,
    rating: true,
    discount: false,
    delivery: false,
    vendor: true,
    location: true,
    availability: false,
    condition: false,
    warranty: false
  });

  const brands = ['Samsung', 'Apple', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'OnePlus', 'Huawei', 'Nokia', 'Google'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gold', 'Silver', 'Pink', 'Purple', 'Gray'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

  const toggleExpanded = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFilters(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color)
        ? prev.selectedColors.filter(c => c !== color)
        : [...prev.selectedColors, color]
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      selectedBrands: [],
      selectedColors: [],
      selectedSizes: [],
      rating: 0,
      discount: '',
      delivery: [],
      vendorType: [],
      location: '',
      availability: '',
      condition: '',
      warranty: []
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++;
    if (filters.selectedBrands.length > 0) count++;
    if (filters.selectedColors.length > 0) count++;
    if (filters.selectedSizes.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.discount) count++;
    if (filters.delivery.length > 0) count++;
    if (filters.vendorType.length > 0) count++;
    if (filters.location) count++;
    if (filters.availability) count++;
    if (filters.condition) count++;
    if (filters.warranty.length > 0) count++;
    return count;
  };

  const FilterSection = ({ title, icon, isExpanded, onToggle, children }: {
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </h3>
        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <FilterSection
          title="Price Range (৳)"
          icon={<span className="text-green-600">৳</span>}
          isExpanded={expandedSections.price}
          onToggle={() => toggleExpanded('price')}
        >
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={50000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex items-center gap-2 text-sm">
              <span>৳{filters.priceRange[0].toLocaleString()}</span>
              <span>-</span>
              <span>৳{filters.priceRange[1].toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] }))}
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value) || 50000] }))}
                className="px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Brand */}
        <FilterSection
          title="Brand"
          icon={<Award className="w-4 h-4 text-blue-600" />}
          isExpanded={expandedSections.brand}
          onToggle={() => toggleExpanded('brand')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer flex-1">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Customer Rating */}
        <FilterSection
          title="Customer Rating"
          icon={<Star className="w-4 h-4 text-yellow-600" />}
          isExpanded={expandedSections.rating}
          onToggle={() => toggleExpanded('rating')}
        >
          <RadioGroup value={filters.rating.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}>
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">& Up</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterSection>

        <Separator />

        {/* Color */}
        <FilterSection
          title="Color"
          icon={<div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500" />}
          isExpanded={expandedSections.color}
          onToggle={() => toggleExpanded('color')}
        >
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.selectedColors.includes(color)}
                  onCheckedChange={() => handleColorToggle(color)}
                />
                <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border ${color === 'White' ? 'border-gray-300' : 'border-gray-200'}`} 
                       style={{ backgroundColor: color.toLowerCase() }} />
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Size */}
        <FilterSection
          title="Size"
          icon={<span className="text-purple-600 font-bold text-sm">S</span>}
          isExpanded={expandedSections.size}
          onToggle={() => toggleExpanded('size')}
        >
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={filters.selectedSizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => handleSizeToggle(size)}
                className="h-8 px-3"
              >
                {size}
              </Button>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Discount */}
        <FilterSection
          title="Discount"
          icon={<span className="text-red-600 font-bold text-sm">%</span>}
          isExpanded={expandedSections.discount}
          onToggle={() => toggleExpanded('discount')}
        >
          <RadioGroup value={filters.discount} onValueChange={(value) => setFilters(prev => ({ ...prev, discount: value }))}>
            {['10% or more', '25% or more', '35% or more', '50% or more', '70% or more'].map((discount) => (
              <div key={discount} className="flex items-center space-x-2">
                <RadioGroupItem value={discount} id={`discount-${discount}`} />
                <Label htmlFor={`discount-${discount}`} className="text-sm cursor-pointer">
                  {discount}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterSection>

        <Separator />

        {/* Delivery Options */}
        <FilterSection
          title="Delivery Options"
          icon={<Truck className="w-4 h-4 text-green-600" />}
          isExpanded={expandedSections.delivery}
          onToggle={() => toggleExpanded('delivery')}
        >
          <div className="space-y-2">
            {['Same Day Delivery', 'Next Day Delivery', 'Free Shipping', 'Cash on Delivery', 'Express Delivery'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox id={`delivery-${option}`} />
                <Label htmlFor={`delivery-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Vendor Type */}
        <FilterSection
          title="Vendor Type"
          icon={<Shield className="w-4 h-4 text-blue-600" />}
          isExpanded={expandedSections.vendor}
          onToggle={() => toggleExpanded('vendor')}
        >
          <div className="space-y-2">
            {['Verified Vendors', 'Top Rated', 'Local Vendors', 'Premium Sellers', 'Authorized Dealers', 'Brand Stores'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`vendor-${type}`} />
                <Label htmlFor={`vendor-${type}`} className="text-sm cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Location */}
        <FilterSection
          title="Location"
          icon={<MapPin className="w-4 h-4 text-red-600" />}
          isExpanded={expandedSections.location}
          onToggle={() => toggleExpanded('location')}
        >
          <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bangladesh</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <Separator />

        {/* Availability */}
        <FilterSection
          title="Availability"
          icon={<span className="w-2 h-2 bg-green-500 rounded-full" />}
          isExpanded={expandedSections.availability}
          onToggle={() => toggleExpanded('availability')}
        >
          <RadioGroup value={filters.availability} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
            {['In Stock', 'Out of Stock', 'Pre-order', 'Coming Soon'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <RadioGroupItem value={status} id={`availability-${status}`} />
                <Label htmlFor={`availability-${status}`} className="text-sm cursor-pointer">
                  {status}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterSection>

        <Separator />

        {/* Condition */}
        <FilterSection
          title="Condition"
          icon={<span className="text-orange-600 text-sm font-bold">★</span>}
          isExpanded={expandedSections.condition}
          onToggle={() => toggleExpanded('condition')}
        >
          <RadioGroup value={filters.condition} onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}>
            {['New', 'Like New', 'Good', 'Fair', 'Refurbished'].map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <RadioGroupItem value={condition} id={`condition-${condition}`} />
                <Label htmlFor={`condition-${condition}`} className="text-sm cursor-pointer">
                  {condition}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FilterSection>

        <Separator />

        {/* Warranty */}
        <FilterSection
          title="Warranty"
          icon={<Shield className="w-4 h-4 text-purple-600" />}
          isExpanded={expandedSections.warranty}
          onToggle={() => toggleExpanded('warranty')}
        >
          <div className="space-y-2">
            {['1 Year Warranty', '2 Year Warranty', 'Extended Warranty', 'International Warranty', 'No Warranty'].map((warranty) => (
              <div key={warranty} className="flex items-center space-x-2">
                <Checkbox id={`warranty-${warranty}`} />
                <Label htmlFor={`warranty-${warranty}`} className="text-sm cursor-pointer">
                  {warranty}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-6 pt-4 border-t">
        <Button className="w-full" size="lg">
          Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        </Button>
      </div>
    </div>
  );
};
