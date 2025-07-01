import React from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  rating: number;
  inStock: boolean;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const categories = [
  { id: 'electronics', name: 'Electronics', count: 1234 },
  { id: 'fashion', name: 'Fashion & Beauty', count: 856 },
  { id: 'home', name: 'Home & Garden', count: 634 },
  { id: 'sports', name: 'Sports & Outdoors', count: 423 },
  { id: 'books', name: 'Books & Education', count: 287 },
  { id: 'toys', name: 'Toys & Games', count: 156 },
];

const brands = [
  { id: 'samsung', name: 'Samsung', count: 234 },
  { id: 'apple', name: 'Apple', count: 189 },
  { id: 'nike', name: 'Nike', count: 167 },
  { id: 'adidas', name: 'Adidas', count: 145 },
  { id: 'sony', name: 'Sony', count: 123 },
  { id: 'lg', name: 'LG', count: 98 },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilters({ categories: newCategories });
  };

  const toggleBrand = (brandId: string) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(id => id !== brandId)
      : [...filters.brands, brandId];
    updateFilters({ brands: newBrands });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 100000] as [number, number],
      categories: [],
      brands: [],
      rating: 0,
      inStock: false,
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100000;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {filters.categories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {category?.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleCategory(categoryId)}
                  />
                </Badge>
              );
            })}
            {filters.brands.map(brandId => {
              const brand = brands.find(b => b.id === brandId);
              return (
                <Badge key={brandId} variant="secondary" className="text-xs">
                  {brand?.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleBrand(brandId)}
                  />
                </Badge>
              );
            })}
            {filters.rating > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.rating}+ Stars
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilters({ rating: 0 })}
                />
              </Badge>
            )}
          </div>
          <Separator />
        </div>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={100000}
            step={500}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>৳{filters.priceRange[0].toLocaleString()}</span>
            <span>৳{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={category.id} className="flex-1 text-sm cursor-pointer">
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({category.count})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map(brand => (
            <div key={brand.id} className="flex items-center space-x-3">
              <Checkbox
                id={brand.id}
                checked={filters.brands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
              />
              <Label htmlFor={brand.id} className="flex-1 text-sm cursor-pointer">
                {brand.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({brand.count})
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => updateFilters({ rating: filters.rating === rating ? 0 : rating })}
              className={`flex items-center w-full text-left p-2 rounded transition-colors ${
                filters.rating === rating ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">& Up</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
            />
            <Label htmlFor="inStock" className="text-sm cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};