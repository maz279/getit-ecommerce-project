import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Mic, 
  Camera, 
  Filter, 
  Star, 
  MapPin, 
  Truck, 
  Calendar,
  MicIcon,
  StopCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchFilters {
  query: string;
  priceRange: [number, number];
  category: string;
  rating: number;
  location: string;
  shipping: string[];
  availability: string;
  dateRange: string;
  brands: string[];
  features: string[];
}

const AdvancedSearchFilters: React.FC = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    priceRange: [0, 50000],
    category: '',
    rating: 0,
    location: '',
    shipping: [],
    availability: 'all',
    dateRange: 'all',
    brands: [],
    features: []
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books',
    'Health & Beauty', 'Toys', 'Automotive', 'Food & Grocery'
  ];

  const brands = [
    'Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Philips', 'Dell'
  ];

  const features = [
    'Free Shipping', 'Same Day Delivery', 'COD Available', 'Warranty Included',
    'Return Policy', 'Eco Friendly', 'Handmade', 'Organic'
  ];

  const handleVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser doesn't support voice search.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRecording(true);
      
      // Simulate voice recognition
      setTimeout(() => {
        const mockQueries = [
          "bluetooth headphones under 3000 taka",
          "red cotton t-shirt medium size",
          "smartphone with good camera",
          "kitchen appliances on sale"
        ];
        
        const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
        setFilters(prev => ({ ...prev, query: randomQuery }));
        setIsRecording(false);
        
        toast({
          title: "Voice Search Complete",
          description: `Searched for: "${randomQuery}"`
        });
      }, 2000);
      
    } catch (error) {
      setIsRecording(false);
      toast({
        title: "Voice Search Error",
        description: "Failed to process voice input. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result;
      
      // Simulate image recognition
      setTimeout(() => {
        const mockResults = [
          "blue denim jacket",
          "red running shoes",
          "wooden coffee table",
          "black leather wallet"
        ];
        
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        setFilters(prev => ({ ...prev, query: randomResult }));
        setShowImageSearch(false);
        
        toast({
          title: "Image Search Complete",
          description: `Found: "${randomResult}"`
        });
      }, 1500);
    };
    
    reader.readAsDataURL(file);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'shipping' | 'brands' | 'features', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      priceRange: [0, 50000],
      category: '',
      rating: 0,
      location: '',
      shipping: [],
      availability: 'all',
      dateRange: 'all',
      brands: [],
      features: []
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.rating > 0) count++;
    if (filters.location) count++;
    if (filters.shipping.length > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.brands.length > 0) count++;
    if (filters.features.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, brands, categories..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10 pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceSearch}
                  disabled={isRecording}
                  className="p-1"
                >
                  {isRecording ? (
                    <StopCircle className="h-4 w-4 text-red-500 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSearch}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </CardTitle>
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: ৳{filters.priceRange[0]} - ৳{filters.priceRange[1]}
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              max={50000}
              step={100}
              className="w-full"
            />
          </div>

          {/* Category & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Minimum Rating: {filters.rating > 0 ? `${filters.rating} stars` : 'Any'}
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    variant={filters.rating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('rating', rating === filters.rating ? 0 : rating)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in_stock">In Stock Only</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shipping Options */}
          <div>
            <label className="text-sm font-medium mb-3 block flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Shipping Options
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Free Shipping', 'Same Day', 'Next Day', 'Express'].map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={filters.shipping.includes(option)}
                    onCheckedChange={() => toggleArrayFilter('shipping', option)}
                  />
                  <label htmlFor={option} className="text-sm">{option}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="text-sm font-medium mb-3 block">Brands</label>
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => (
                <Badge
                  key={brand}
                  variant={filters.brands.includes(brand) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayFilter('brands', brand)}
                >
                  {brand}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-medium mb-3 block">Features</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => toggleArrayFilter('features', feature)}
                  />
                  <label htmlFor={feature} className="text-sm">{feature}</label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Summary */}
      {getActiveFiltersCount() > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <Badge variant="secondary">Query: "{filters.query}"</Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary">Category: {filters.category}</Badge>
                )}
                {filters.rating > 0 && (
                  <Badge variant="secondary">{filters.rating}+ stars</Badge>
                )}
                {filters.brands.length > 0 && (
                  <Badge variant="secondary">{filters.brands.length} brands</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">1,234 results found</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearchFilters;