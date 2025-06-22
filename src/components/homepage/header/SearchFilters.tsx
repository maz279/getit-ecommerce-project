
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Filter } from 'lucide-react';

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
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [minVendorRating, setMinVendorRating] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [codAvailable, setCodAvailable] = useState(false);
  const [festivalOffers, setFestivalOffers] = useState(false);
  const [trending, setTrending] = useState(false);
  const [tradeLicenseVerified, setTradeLicenseVerified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const content = {
    EN: {
      title: "Search Filters",
      priceRange: "Price Range (৳)",
      from: "From",
      to: "To",
      availability: "Availability",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      preOrder: "Pre-order",
      limited: "Limited Stock",
      location: "Location",
      division: "Division",
      district: "District",
      upazila: "Upazila",
      selectDivision: "Select Division",
      selectDistrict: "Select District",
      selectUpazila: "Select Upazila",
      rating: "Minimum Rating",
      vendorRating: "Minimum Vendor Rating",
      shipping: "Shipping Options",
      freeShipping: "Free Shipping",
      codAvailable: "Cash on Delivery",
      paymentMethods: "Payment Methods",
      category: "Category",
      subcategory: "Subcategory",
      brand: "Brand",
      selectCategory: "Select Category",
      selectSubcategory: "Select Subcategory",
      selectBrand: "Select Brand",
      specialOffers: "Special Offers",
      festivalOffers: "Festival Offers",
      trending: "Trending Products",
      vendorOptions: "Vendor Options",
      tradeLicenseVerified: "Trade License Verified",
      deliveryTime: "Delivery Time",
      selectDeliveryTime: "Select Delivery Time",
      applyFilters: "Apply Filters",
      clearAll: "Clear All"
    },
    BD: {
      title: "সার্চ ফিল্টার",
      priceRange: "দামের পরিসর (৳)",
      from: "থেকে",
      to: "পর্যন্ত",
      availability: "উপলব্ধতা",
      inStock: "স্টকে আছে",
      outOfStock: "স্টকে নেই",
      preOrder: "প্রি-অর্ডার",
      limited: "সীমিত স্টক",
      location: "অবস্থান",
      division: "বিভাগ",
      district: "জেলা",
      upazila: "উপজেলা",
      selectDivision: "বিভাগ নির্বাচন করুন",
      selectDistrict: "জেলা নির্বাচন করুন",
      selectUpazila: "উপজেলা নির্বাচন করুন",
      rating: "সর্বনিম্ন রেটিং",
      vendorRating: "সর্বনিম্ন বিক্রেতা রেটিং",
      shipping: "শিপিং অপশন",
      freeShipping: "ফ্রি শিপিং",
      codAvailable: "ক্যাশ অন ডেলিভারি",
      paymentMethods: "পেমেন্ট মেথড",
      category: "ক্যাটেগরি",
      subcategory: "সাবক্যাটেগরি",
      brand: "ব্র্যান্ড",
      selectCategory: "ক্যাটেগরি নির্বাচন করুন",
      selectSubcategory: "সাবক্যাটেগরি নির্বাচন করুন",
      selectBrand: "ব্র্যান্ড নির্বাচন করুন",
      specialOffers: "বিশেষ অফার",
      festivalOffers: "উৎসবের অফার",
      trending: "ট্রেন্ডিং পণ্য",
      vendorOptions: "বিক্রেতার অপশন",
      tradeLicenseVerified: "ট্রেড লাইসেন্স যাচাইকৃত",
      deliveryTime: "ডেলিভারির সময়",
      selectDeliveryTime: "ডেলিভারির সময় নির্বাচন করুন",
      applyFilters: "ফিল্টার প্রয়োগ করুন",
      clearAll: "সব মুছুন"
    }
  };

  const currentContent = content[language as keyof typeof content];

  // Bangladesh administrative divisions
  const divisions = [
    { value: 'dhaka', label: 'Dhaka / ঢাকা' },
    { value: 'chittagong', label: 'Chittagong / চট্টগ্রাম' },
    { value: 'sylhet', label: 'Sylhet / সিলেট' },
    { value: 'rajshahi', label: 'Rajshahi / রাজশাহী' },
    { value: 'barisal', label: 'Barisal / বরিশাল' },
    { value: 'khulna', label: 'Khulna / খুলনা' },
    { value: 'rangpur', label: 'Rangpur / রংপুর' },
    { value: 'mymensingh', label: 'Mymensingh / ময়মনসিংহ' }
  ];

  const districts = {
    dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj'],
    chittagong: ['Chittagong', 'Coxs Bazar', 'Comilla', 'Feni', 'Brahmanbaria'],
    sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    rajshahi: ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj', 'Natore'],
    barisal: ['Barisal', 'Patuakhali', 'Bhola', 'Pirojpur'],
    khulna: ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat'],
    rangpur: ['Rangpur', 'Dinajpur', 'Thakurgaon', 'Panchagarh'],
    mymensingh: ['Mymensingh', 'Jamalpur', 'Sherpur', 'Netrokona']
  };

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty',
    'Sports & Outdoor', 'Books & Education', 'Food & Groceries',
    'Automobiles', 'Baby & Kids', 'Jewelry', 'Handicrafts'
  ];

  const brands = [
    'Samsung', 'Apple', 'Nike', 'Adidas', 'Dell', 'HP', 'Lenovo',
    'Sony', 'LG', 'Xiaomi', 'Realme', 'Oppo', 'Vivo'
  ];

  const paymentMethods = [
    { id: 'bkash', label: 'bKash' },
    { id: 'nagad', label: 'Nagad' },
    { id: 'rocket', label: 'Rocket' },
    { id: 'card', label: 'Credit/Debit Card' },
    { id: 'bank', label: 'Bank Transfer' },
    { id: 'cash', label: 'Cash on Delivery' }
  ];

  const deliveryOptions = [
    { value: '1-2-days', label: '1-2 Days' },
    { value: '3-5-days', label: '3-5 Days' },
    { value: '1-week', label: '1 Week' },
    { value: '2-weeks', label: '2 Weeks' }
  ];

  const handleAvailabilityChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailability([...selectedAvailability, value]);
    } else {
      setSelectedAvailability(selectedAvailability.filter(item => item !== value));
    }
  };

  const handlePaymentMethodChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedPaymentMethods([...selectedPaymentMethods, value]);
    } else {
      setSelectedPaymentMethods(selectedPaymentMethods.filter(item => item !== value));
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      availability: selectedAvailability,
      paymentMethods: selectedPaymentMethods,
      division: selectedDivision,
      district: selectedDistrict,
      upazila: selectedUpazila,
      rating: minRating,
      vendorRating: minVendorRating,
      freeShipping,
      codAvailable,
      festivalOffers,
      trending,
      tradeLicenseVerified,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      brand: selectedBrand,
      deliveryTime
    };
    
    onApply(filters);
    onClose();
  };

  const handleClearAll = () => {
    setPriceRange([0, 200000]);
    setSelectedAvailability([]);
    setSelectedPaymentMethods([]);
    setSelectedDivision('');
    setSelectedDistrict('');
    setSelectedUpazila('');
    setMinRating(0);
    setMinVendorRating(0);
    setFreeShipping(false);
    setCodAvailable(false);
    setFestivalOffers(false);
    setTrending(false);
    setTradeLicenseVerified(false);
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedBrand('');
    setDeliveryTime('');
  };

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 p-6 shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">{currentContent.title}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.priceRange}</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>৳{priceRange[0].toLocaleString()}</span>
            <span>৳{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.availability}</Label>
          <div className="space-y-2">
            {[
              { value: 'in_stock', label: currentContent.inStock },
              { value: 'out_of_stock', label: currentContent.outOfStock },
              { value: 'pre_order', label: currentContent.preOrder },
              { value: 'limited', label: currentContent.limited }
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={item.value}
                  checked={selectedAvailability.includes(item.value)}
                  onCheckedChange={(checked) => handleAvailabilityChange(item.value, checked as boolean)}
                />
                <Label htmlFor={item.value} className="text-sm">{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.location}</Label>
          <Select value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger>
              <SelectValue placeholder={currentContent.selectDivision} />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((division) => (
                <SelectItem key={division.value} value={division.value}>
                  {division.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedDivision && (
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger>
                <SelectValue placeholder={currentContent.selectDistrict} />
              </SelectTrigger>
              <SelectContent>
                {districts[selectedDivision as keyof typeof districts]?.map((district) => (
                  <SelectItem key={district} value={district.toLowerCase()}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.rating}</Label>
          <Slider
            value={[minRating]}
            onValueChange={(value) => setMinRating(value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="text-xs text-gray-500">{minRating} stars & above</div>
        </div>

        {/* Vendor Rating */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.vendorRating}</Label>
          <Slider
            value={[minVendorRating]}
            onValueChange={(value) => setMinVendorRating(value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="text-xs text-gray-500">{minVendorRating} stars & above</div>
        </div>

        {/* Shipping Options */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.shipping}</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeShipping"
                checked={freeShipping}
                onCheckedChange={setFreeShipping}
              />
              <Label htmlFor="freeShipping" className="text-sm">{currentContent.freeShipping}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="codAvailable"
                checked={codAvailable}
                onCheckedChange={setCodAvailable}
              />
              <Label htmlFor="codAvailable" className="text-sm">{currentContent.codAvailable}</Label>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.paymentMethods}</Label>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  id={method.id}
                  checked={selectedPaymentMethods.includes(method.id)}
                  onCheckedChange={(checked) => handlePaymentMethodChange(method.id, checked as boolean)}
                />
                <Label htmlFor={method.id} className="text-sm">{method.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.category}</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder={currentContent.selectCategory} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.brand}</Label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder={currentContent.selectBrand} />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand.toLowerCase()}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Special Offers */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.specialOffers}</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="festivalOffers"
                checked={festivalOffers}
                onCheckedChange={setFestivalOffers}
              />
              <Label htmlFor="festivalOffers" className="text-sm">{currentContent.festivalOffers}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trending"
                checked={trending}
                onCheckedChange={setTrending}
              />
              <Label htmlFor="trending" className="text-sm">{currentContent.trending}</Label>
            </div>
          </div>
        </div>

        {/* Vendor Options */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.vendorOptions}</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tradeLicenseVerified"
              checked={tradeLicenseVerified}
              onCheckedChange={setTradeLicenseVerified}
            />
            <Label htmlFor="tradeLicenseVerified" className="text-sm">{currentContent.tradeLicenseVerified}</Label>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{currentContent.deliveryTime}</Label>
          <Select value={deliveryTime} onValueChange={setDeliveryTime}>
            <SelectTrigger>
              <SelectValue placeholder={currentContent.selectDeliveryTime} />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t">
        <Button variant="outline" onClick={handleClearAll}>
          {currentContent.clearAll}
        </Button>
        <Button onClick={handleApplyFilters} className="bg-orange-500 hover:bg-orange-600">
          {currentContent.applyFilters}
        </Button>
      </div>
    </Card>
  );
};
