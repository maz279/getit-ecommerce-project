
import { useState, useCallback } from 'react';

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

interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  location?: string;
  availability?: string[];
  rating?: number;
  freeShipping?: boolean;
  codAvailable?: boolean;
  category?: string;
  brand?: string;
  vendorType?: string;
}

interface UseSearchReturn {
  searchResults: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  searchText: (query: string, filters?: SearchFilters) => Promise<void>;
  searchVoice: (audioBlob: Blob, language?: 'bn' | 'en') => Promise<void>;
  searchImage: (imageFile: File) => Promise<void>;
  searchQR: (imageFile: File) => Promise<void>;
  getSuggestions: (query: string) => Promise<string[]>;
  clearResults: () => void;
  applyFilters: (filters: SearchFilters) => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});

  // Enhanced mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Samsung Galaxy S24 Ultra',
      titleBn: 'স্যামসাং গ্যালাক্সি এস২৪ আল্ট্রা',
      type: 'product',
      image: '/placeholder.svg',
      price: 149999,
      originalPrice: 159999,
      rating: 4.8,
      description: 'Latest Samsung flagship with advanced AI features',
      descriptionBn: 'অত্যাধুনিক এআই ফিচার সহ স্যামসাং এর সর্বশেষ ফ্ল্যাগশিপ',
      availability: 'in_stock',
      vendor: {
        name: 'TechHub BD',
        rating: 4.9,
        verified: true,
        location: 'Dhaka, Bangladesh'
      },
      brand: 'Samsung',
      sku: 'SAM-S24U-256',
      category: 'Electronics',
      subcategory: 'Smartphones',
      deliveryTime: '1-2 days',
      freeShipping: true,
      codAvailable: true,
      discountPercentage: 6,
      isFestivalOffer: true,
      isTrending: true
    },
    {
      id: '2',
      title: 'Nike Air Max 270',
      titleBn: 'নাইকি এয়ার ম্যাক্স ২৭০',
      type: 'product',
      image: '/placeholder.svg',
      price: 8999,
      originalPrice: 12999,
      rating: 4.5,
      description: 'Premium running shoes with air cushioning',
      descriptionBn: 'এয়ার কুশনিং সহ প্রিমিয়াম রানিং জুতা',
      availability: 'in_stock',
      vendor: {
        name: 'Sports World BD',
        rating: 4.7,
        verified: true,
        location: 'Chittagong, Bangladesh'
      },
      brand: 'Nike',
      category: 'Fashion',
      subcategory: 'Footwear',
      deliveryTime: '2-3 days',
      freeShipping: false,
      codAvailable: true,
      discountPercentage: 31,
      isFestivalOffer: false,
      isTrending: true
    },
    {
      id: '3',
      title: 'Apex Electronics Store',
      titleBn: 'এপেক্স ইলেকট্রনিক্স স্টোর',
      type: 'vendor',
      rating: 4.9,
      description: 'Verified electronics vendor with 10+ years experience',
      descriptionBn: '১০+ বছরের অভিজ্ঞতা সহ যাচাইকৃত ইলেকট্রনিক্স বিক্রেতা',
      location: 'Dhanmondi, Dhaka',
      locationBn: 'ধানমন্ডি, ঢাকা',
      vendor: {
        name: 'Apex Electronics',
        rating: 4.9,
        verified: true,
        location: 'Dhaka, Bangladesh'
      }
    },
    {
      id: '4',
      title: 'Apple',
      titleBn: 'অ্যাপল',
      type: 'brand',
      description: 'Premium technology brand',
      descriptionBn: 'প্রিমিয়াম প্রযুক্তি ব্র্যান্ড',
      rating: 4.8
    },
    {
      id: '5',
      title: 'Fresh Vegetables',
      titleBn: 'তাজা সবজি',
      type: 'category',
      description: 'Fresh vegetables and organic produce',
      descriptionBn: 'তাজা সবজি এবং জৈব পণ্য',
      image: '/placeholder.svg'
    },
    {
      id: '6',
      title: 'Fashion Corner BD',
      titleBn: 'ফ্যাশন কর্নার বিডি',
      type: 'vendor',
      rating: 4.6,
      description: 'Trendy fashion retailer with latest collections',
      descriptionBn: 'সর্বশেষ কালেকশন সহ ট্রেন্ডি ফ্যাশন রিটেইলার',
      location: 'Sylhet, Bangladesh',
      locationBn: 'সিলেট, বাংলাদেশ',
      vendor: {
        name: 'Fashion Corner',
        rating: 4.6,
        verified: true,
        location: 'Sylhet, Bangladesh'
      }
    }
  ];

  // Enhanced suggestions for autocomplete
  const mockSuggestions = {
    'en': [
      'mobile phone', 'smartphone', 'laptop', 'headphones', 'fashion',
      'shoes', 'clothing', 'electronics', 'groceries', 'home appliances',
      'beauty products', 'books', 'sports equipment', 'toys', 'furniture'
    ],
    'bn': [
      'মোবাইল ফোন', 'স্মার্টফোন', 'ল্যাপটপ', 'হেডফোন', 'ফ্যাশন',
      'জুতা', 'পোশাক', 'ইলেকট্রনিক্স', 'মুদি', 'ঘরোয়া যন্ত্রাংশ',
      'সৌন্দর্য পণ্য', 'বই', 'খেলার সামগ্রী', 'খেলনা', 'আসবাবপত্র'
    ]
  };

  // Language detection utility
  const detectLanguage = (text: string): 'bn' | 'en' | 'mixed' => {
    const bengaliRegex = /[\u0980-\u09FF]/;
    const englishRegex = /[A-Za-z]/;
    
    const hasBengali = bengaliRegex.test(text);
    const hasEnglish = englishRegex.test(text);
    
    if (hasBengali && hasEnglish) return 'mixed';
    if (hasBengali) return 'bn';
    return 'en';
  };

  // Enhanced text search with multilingual support
  const searchText = useCallback(async (query: string, filters: SearchFilters = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching for:', query);
      console.log('Language detected:', detectLanguage(query));
      console.log('Applied filters:', filters);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Enhanced search logic with multilingual support
      const searchTerms = query.toLowerCase().split(' ');
      let filtered = mockResults.filter(item => {
        // Text matching (both English and Bangla)
        const titleMatch = item.title.toLowerCase().includes(query.toLowerCase()) ||
                          (item.titleBn && item.titleBn.includes(query));
        
        const descriptionMatch = item.description?.toLowerCase().includes(query.toLowerCase()) ||
                               (item.descriptionBn && item.descriptionBn.includes(query));
        
        const typeMatch = item.type.toLowerCase().includes(query.toLowerCase());
        const brandMatch = item.brand?.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = item.category?.toLowerCase().includes(query.toLowerCase());
        const vendorMatch = item.vendor?.name.toLowerCase().includes(query.toLowerCase());
        
        return titleMatch || descriptionMatch || typeMatch || brandMatch || categoryMatch || vendorMatch;
      });

      // Apply filters
      if (filters.priceMin !== undefined) {
        filtered = filtered.filter(item => !item.price || item.price >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        filtered = filtered.filter(item => !item.price || item.price <= filters.priceMax!);
      }
      if (filters.location) {
        filtered = filtered.filter(item => 
          item.location?.toLowerCase().includes(filters.location!.toLowerCase()) ||
          item.vendor?.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.availability && filters.availability.length > 0) {
        filtered = filtered.filter(item => 
          !item.availability || filters.availability!.includes(item.availability)
        );
      }
      if (filters.rating) {
        filtered = filtered.filter(item => !item.rating || item.rating >= filters.rating!);
      }
      if (filters.freeShipping) {
        filtered = filtered.filter(item => item.freeShipping === true);
      }
      if (filters.codAvailable) {
        filtered = filtered.filter(item => item.codAvailable === true);
      }
      if (filters.category) {
        filtered = filtered.filter(item => 
          item.category?.toLowerCase() === filters.category!.toLowerCase()
        );
      }
      if (filters.brand) {
        filtered = filtered.filter(item => 
          item.brand?.toLowerCase() === filters.brand!.toLowerCase()
        );
      }

      // Sort results by relevance (trending, discounts, ratings)
      filtered.sort((a, b) => {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        if (a.isFestivalOffer && !b.isFestivalOffer) return -1;
        if (!a.isFestivalOffer && b.isFestivalOffer) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });

      console.log('Search results:', filtered);
      setSearchResults(filtered);
      setCurrentFilters(filters);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced voice search with language support
  const searchVoice = useCallback(async (audioBlob: Blob, language: 'bn' | 'en' = 'bn') => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing voice search in language:', language);
      
      // Simulate voice-to-text conversion with language detection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock voice search results based on language
      const voiceQueries = {
        'bn': ['মোবাইল ফোন', 'স্মার্টফোন', 'ল্যাপটপ'],
        'en': ['mobile phone', 'smartphone', 'laptop']
      };
      
      const randomQuery = voiceQueries[language][Math.floor(Math.random() * voiceQueries[language].length)];
      console.log('Voice converted to text:', randomQuery);
      
      await searchText(randomQuery);
    } catch (err) {
      setError('Voice search failed. Please try again.');
      console.error('Voice search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  // Enhanced image search with AI recognition
  const searchImage = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing image search...');
      console.log('Image file:', imageFile.name, imageFile.size);
      
      // Simulate advanced image processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock image recognition results
      const imageQueries = [
        'smartphone', 'laptop', 'shoes', 'watch', 'headphones',
        'ফোন', 'জুতা', 'ঘড়ি'
      ];
      const imageQuery = imageQueries[Math.floor(Math.random() * imageQueries.length)];
      console.log('Image identified as:', imageQuery);
      
      await searchText(imageQuery);
    } catch (err) {
      setError('Image search failed. Please try again.');
      console.error('Image search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  // Enhanced QR code search
  const searchQR = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing QR code...');
      
      // Simulate QR code processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock QR search results
      const qrQueries = [
        'electronics store', 'fashion outlet', 'grocery shop',
        'ইলেকট্রনিক্স দোকান', 'ফ্যাশন আউটলেট'
      ];
      const qrQuery = qrQueries[Math.floor(Math.random() * qrQueries.length)];
      console.log('QR code decoded:', qrQuery);
      
      await searchText(qrQuery);
    } catch (err) {
      setError('QR code search failed. Please try again.');
      console.error('QR search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  // Get suggestions based on input
  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const language = detectLanguage(query);
      const relevantSuggestions = language === 'bn' ? mockSuggestions.bn : mockSuggestions.en;
      
      const filtered = relevantSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(filtered.slice(0, 5));
      return filtered.slice(0, 5);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }, []);

  // Apply filters to current search
  const applyFilters = useCallback((filters: SearchFilters) => {
    setCurrentFilters(prev => ({ ...prev, ...filters }));
    // Re-run search with new filters if there are results
    if (searchResults.length > 0) {
      // Get the last search query from results context and re-search
      console.log('Applying filters:', filters);
    }
  }, [searchResults.length]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
    setCurrentFilters({});
    console.log('Search results and filters cleared');
  }, []);

  return {
    searchResults,
    suggestions,
    isLoading,
    error,
    searchText,
    searchVoice,
    searchImage,
    searchQR,
    getSuggestions,
    clearResults,
    applyFilters
  };
};
