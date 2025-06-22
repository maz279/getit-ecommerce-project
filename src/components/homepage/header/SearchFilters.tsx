
import React, { useState } from 'react';
import { X, MapPin, Star, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFiltersProps {
  onApply: (filters: any) => void;
  onClose: () => void;
  language: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onApply,
  onClose,
  language
}) => {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    location: '',
    availability: [] as string[],
    rating: '',
    freeShipping: false,
    codAvailable: false,
    category: '',
    brand: '',
    vendorType: ''
  });

  const content = {
    EN: {
      title: "Search Filters",
      priceRange: "Price Range (৳)",
      from: "From",
      to: "To",
      location: "Location",
      locationPlaceholder: "Enter city, district, or division",
      availability: "Availability",
      rating: "Minimum Rating",
      shipping: "Shipping Options",
      freeShipping: "Free Shipping",
      codAvailable: "Cash on Delivery",
      category: "Category",
      categoryPlaceholder: "Select category",
      brand: "Brand",
      brandPlaceholder: "Enter brand name",
      vendorType: "Vendor Type",
      vendorTypePlaceholder: "Select vendor type",
      availabilityOptions: {
        in_stock: "In Stock",
        out_of_stock: "Out of Stock",
        pre_order: "Pre-order",
        limited: "Limited Stock"
      },
      categories: ["Electronics", "Fashion", "Home & Garden", "Health & Beauty", "Sports", "Books"],
      vendorTypes: ["Verified Seller", "Premium Vendor", "Local Store", "Authorized Dealer"],
      applyFilters: "Apply Filters",
      clearAll: "Clear All",
      close: "Close"
    },
    BD: {
      title: "সার্চ ফিল্টার",
      priceRange: "দামের পরিসর (৳)",
      from: "থেকে",
      to: "পর্যন্ত",
      location: "অবস্থান",
      locationPlaceholder: "শহর, জেলা বা বিভাগ লিখুন",
      availability: "স্টক অবস্থা",
      rating: "সর্বনিম্ন রেটিং",
      shipping: "ডেলিভারি অপশন",
      freeShipping: "ফ্রি ডেলিভারি",
      codAvailable: "ক্যাশ অন ডেলিভারি",
      category: "ক্যাটেগরি",
      categoryPlaceholder: "ক্যাটেগরি নির্বাচন করুন",
      brand: "ব্র্যান্ড",
      brandPlaceholder: "ব্র্যান্ডের নাম লিখুন",
      vendorType: "বিক্রেতার ধরন",
      vendorTypePlaceholder: "বিক্রেতার ধরন নির্বাচন করুন",
      availabilityOptions: {
        in_stock: "স্টকে আছে",
        out_of_stock: "স্টকে নেই",
        pre_order: "প্রি-অর্ডার",
        limited: "সীমিত স্টক"
      },
      categories: ["ইলেকট্রনিক্স", "ফ্যাশন", "ঘর ও বাগান", "স্বাস্থ্য ও সৌন্দর্য", "খেলাধুলা", "বই"],
      vendorTypes: ["যাচাইকৃত বিক্রেতা", "প্রিমিয়াম বিক্রেতা", "স্থানীয় দোকান", "অনুমোদিত ডিলার"],
      applyFilters: "ফিল্টার প্রয়োগ করুন",
      clearAll: "সব মুছুন",
      close: "বন্ধ করুন"
    }
  };

  const currentContent = content[language as keyof typeof content];

  const handleAvailabilityChange = (option: string) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...prev.availability, option]
    }));
  };

  const handleApply = () => {
    const formattedFilters = {
      ...filters,
      priceMin: filters.priceMin ? parseInt(filters.priceMin) : undefined,
      priceMax: filters.priceMax ? parseInt(filters.priceMax) : undefined,
      rating: filters.rating ? parseFloat(filters.rating) : undefined
    };
    onApply(formattedFilters);
  };

  const handleClearAll = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      location: '',
      availability: [],
      rating: '',
      freeShipping: false,
      codAvailable: false,
      category: '',
      brand: '',
      vendorType: ''
    });
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{currentContent.title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.priceRange}
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={currentContent.from}
              value={filters.priceMin}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder={currentContent.to}
              value={filters.priceMax}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              className="flex-1"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            {currentContent.location}
          </label>
          <Input
            type="text"
            placeholder={currentContent.locationPlaceholder}
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.availability}
          </label>
          <div className="space-y-2">
            {Object.entries(currentContent.availabilityOptions).map(([key, label]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(key)}
                  onChange={() => handleAvailabilityChange(key)}
                  className="mr-2"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-1" />
            {currentContent.rating}
          </label>
          <select
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        {/* Shipping Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Truck className="w-4 h-4 inline mr-1" />
            {currentContent.shipping}
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.freeShipping}
                onChange={(e) => setFilters(prev => ({ ...prev, freeShipping: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">{currentContent.freeShipping}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.codAvailable}
                onChange={(e) => setFilters(prev => ({ ...prev, codAvailable: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm">
                <CreditCard className="w-3 h-3 inline mr-1" />
                {currentContent.codAvailable}
              </span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.category}
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">{currentContent.categoryPlaceholder}</option>
            {currentContent.categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.brand}
          </label>
          <Input
            type="text"
            placeholder={currentContent.brandPlaceholder}
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
          />
        </div>

        {/* Vendor Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.vendorType}
          </label>
          <select
            value={filters.vendorType}
            onChange={(e) => setFilters(prev => ({ ...prev, vendorType: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">{currentContent.vendorTypePlaceholder}</option>
            {currentContent.vendorTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <Button
          onClick={handleApply}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {currentContent.applyFilters}
        </Button>
        <Button
          onClick={handleClearAll}
          variant="outline"
          className="flex-1"
        >
          {currentContent.clearAll}
        </Button>
      </div>
    </div>
  );
};
