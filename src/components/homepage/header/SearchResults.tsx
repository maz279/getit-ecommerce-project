
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Store, Package, MapPin, Truck, CreditCard, Clock, Zap, Gift } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  titleBn?: string;
  type: 'product' | 'vendor' | 'brand' | 'category';
  image?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  description?: string;
  descriptionBn?: string;
  location?: string;
  locationBn?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited';
  vendor?: {
    name: string;
    rating: number;
    verified: boolean;
    location: string;
  };
  brand?: string;
  sku?: string;
  category?: string;
  subcategory?: string;
  deliveryTime?: string;
  freeShipping?: boolean;
  codAvailable?: boolean;
  discountPercentage?: number;
  isFestivalOffer?: boolean;
  isTrending?: boolean;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  onResultClick: (result: SearchResult) => void;
  language: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onResultClick,
  language
}) => {
  const content = {
    EN: {
      searching: "Searching...",
      noResults: "No results found",
      tryDifferent: "Try a different search term",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      preOrder: "Pre-order",
      limited: "Limited",
      freeShipping: "Free Shipping",
      cod: "COD",
      trending: "Trending",
      festivalOffer: "Festival Offer",
      verified: "Verified",
      rating: "rating",
      off: "off"
    },
    BD: {
      searching: "খুঁজছি...",
      noResults: "কোন ফলাফল পাওয়া যায়নি",
      tryDifferent: "অন্য কিওয়ার্ড দিয়ে চেষ্টা করুন",
      inStock: "স্টকে আছে",
      outOfStock: "স্টকে নেই",
      preOrder: "প্রি-অর্ডার",
      limited: "সীমিত",
      freeShipping: "ফ্রি ডেলিভারি",
      cod: "ক্যাশ অন ডেলিভারি",
      trending: "ট্রেন্ডিং",
      festivalOffer: "উৎসবের অফার",
      verified: "যাচাইকৃত",
      rating: "রেটিং",
      off: "ছাড়"
    }
  };

  const currentContent = content[language as keyof typeof content];

  const getAvailabilityBadge = (availability?: string) => {
    switch (availability) {
      case 'in_stock':
        return <Badge variant="default" className="bg-green-100 text-green-800">{currentContent.inStock}</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">{currentContent.outOfStock}</Badge>;
      case 'pre_order':
        return <Badge variant="secondary">{currentContent.preOrder}</Badge>;
      case 'limited':
        return <Badge variant="outline" className="border-orange-300 text-orange-600">{currentContent.limited}</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-3 h-3" />;
      case 'vendor':
        return <Store className="w-3 h-3" />;
      case 'brand':
        return <Star className="w-3 h-3" />;
      case 'category':
        return <Package className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          <span className="text-sm text-gray-600">{currentContent.searching}</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="text-sm text-red-600">{error}</div>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="text-center text-gray-500">
          <div className="text-sm font-medium">{currentContent.noResults}</div>
          <div className="text-xs mt-1">{currentContent.tryDifferent}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto shadow-lg z-50">
      <div className="divide-y divide-gray-100">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onResultClick(result)}
          >
            <div className="flex items-start gap-3">
              {result.image && (
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm truncate">
                        {language === 'BD' && result.titleBn ? result.titleBn : result.title}
                      </h4>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {getTypeIcon(result.type)}
                          <span className="ml-1">{result.type}</span>
                        </Badge>
                        
                        {result.isTrending && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
                            <Zap className="w-2 h-2 mr-1" />
                            {currentContent.trending}
                          </Badge>
                        )}
                        
                        {result.isFestivalOffer && (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-600">
                            <Gift className="w-2 h-2 mr-1" />
                            {currentContent.festivalOffer}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {result.description && (
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {language === 'BD' && result.descriptionBn ? result.descriptionBn : result.description}
                      </p>
                    )}
                  </div>
                  
                  {result.price && (
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {result.originalPrice && result.originalPrice > result.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳{result.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-orange-600">
                          ৳{result.price.toLocaleString()}
                        </span>
                      </div>
                      {result.discountPercentage && (
                        <div className="text-xs text-red-600 font-medium">
                          {result.discountPercentage}% {currentContent.off}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {result.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{result.rating}</span>
                      </div>
                    )}
                    
                    {(result.location || result.vendor?.location) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {language === 'BD' && result.locationBn ? result.locationBn : (result.location || result.vendor?.location)}
                        </span>
                      </div>
                    )}
                    
                    {result.deliveryTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{result.deliveryTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {result.availability && getAvailabilityBadge(result.availability)}
                    
                    {result.vendor?.verified && (
                      <Badge variant="outline" className="text-xs border-green-300 text-green-600">
                        {currentContent.verified}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {(result.freeShipping || result.codAvailable) && (
                  <div className="flex items-center gap-2 mt-2">
                    {result.freeShipping && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Truck className="w-3 h-3" />
                        <span>{currentContent.freeShipping}</span>
                      </div>
                    )}
                    
                    {result.codAvailable && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <CreditCard className="w-3 h-3" />
                        <span>{currentContent.cod}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
