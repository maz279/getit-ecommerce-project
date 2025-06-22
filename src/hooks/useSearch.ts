
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
    businessHours?: string;
    paymentMethods?: string[];
    shippingAreas?: string[];
    returnPolicy?: string;
    customerServiceRating?: number;
    tradeLicense?: string;
  };
  brand?: string;
  sku?: string;
  barcode?: string;
  modelNumber?: string;
  category?: string;
  subcategory?: string;
  specifications?: string;
  deliveryTime?: string;
  freeShipping?: boolean;
  codAvailable?: boolean;
  discountPercentage?: number;
  isFestivalOffer?: boolean;
  isTrending?: boolean;
  division?: string;
  district?: string;
  upazila?: string;
  postalCode?: string;
  deliveryZone?: string;
}

interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  location?: string;
  division?: string;
  district?: string;
  upazila?: string;
  availability?: string[];
  rating?: number;
  freeShipping?: boolean;
  codAvailable?: boolean;
  category?: string;
  subcategory?: string;
  brand?: string;
  vendorType?: string;
  vendorRating?: number;
  paymentMethods?: string[];
  deliveryTime?: string;
  festivalOffers?: boolean;
  trending?: boolean;
  tradeLicenseVerified?: boolean;
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
  searchBySKU: (sku: string) => Promise<void>;
  searchByBarcode: (barcode: string) => Promise<void>;
  voiceCommand: (command: string) => Promise<void>;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});

  // Enhanced mock data with comprehensive vendor and product information
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
        location: 'Dhaka, Bangladesh',
        businessHours: '9 AM - 9 PM',
        paymentMethods: ['bKash', 'Nagad', 'Rocket', 'Card', 'Bank Transfer'],
        shippingAreas: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'],
        returnPolicy: '7 days return policy',
        customerServiceRating: 4.8,
        tradeLicense: 'TRAD-2024-DHK-001'
      },
      brand: 'Samsung',
      sku: 'SAM-S24U-256',
      barcode: '8801234567890',
      modelNumber: 'SM-S928B/DS',
      category: 'Electronics',
      subcategory: 'Smartphones',
      specifications: '12GB RAM, 256GB Storage, 200MP Camera',
      deliveryTime: '1-2 days',
      freeShipping: true,
      codAvailable: true,
      discountPercentage: 6,
      isFestivalOffer: true,
      isTrending: true,
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      postalCode: '1205',
      deliveryZone: 'Dhaka Metro'
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
        location: 'Chittagong, Bangladesh',
        businessHours: '10 AM - 8 PM',
        paymentMethods: ['bKash', 'Card', 'Cash on Delivery'],
        shippingAreas: ['Chittagong', 'Dhaka', 'Sylhet'],
        returnPolicy: '15 days return policy',
        customerServiceRating: 4.6,
        tradeLicense: 'TRAD-2024-CTG-002'
      },
      brand: 'Nike',
      sku: 'NIKE-AM270-BLK',
      barcode: '8801234567891',
      modelNumber: 'AH8050-002',
      category: 'Fashion',
      subcategory: 'Footwear',
      specifications: 'Size 8-12, Air Max cushioning, Mesh upper',
      deliveryTime: '2-3 days',
      freeShipping: false,
      codAvailable: true,
      discountPercentage: 31,
      isFestivalOffer: false,
      isTrending: true,
      division: 'Chittagong',
      district: 'Chittagong',
      upazila: 'Kotwali',
      postalCode: '4000',
      deliveryZone: 'Chittagong Metro'
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
        location: 'Dhaka, Bangladesh',
        businessHours: '9 AM - 10 PM',
        paymentMethods: ['bKash', 'Nagad', 'Rocket', 'Card', 'Bank Transfer', 'Cash'],
        shippingAreas: ['All Bangladesh'],
        returnPolicy: '30 days return policy',
        customerServiceRating: 4.9,
        tradeLicense: 'TRAD-2024-DHK-003'
      },
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      postalCode: '1205'
    }
  ];

  // Enhanced Bangla phonetic and transliteration support
  const phoneticMap: { [key: string]: string[] } = {
    // Common Bangla phonetic mappings
    'mobile': ['মোবাইল', 'মবাইল'],
    'phone': ['ফোন', 'পোন'],
    'samsung': ['স্যামসাং', 'সামসাং'],
    'laptop': ['ল্যাপটপ', 'ল্যাপটপ'],
    'computer': ['কম্পিউটার', 'কমপিউটার'],
    'shoes': ['জুতা', 'শু'],
    'bag': ['ব্যাগ', 'বাগ'],
    'watch': ['ঘড়ি', 'ওয়াচ'],
    'electronics': ['ইলেকট্রনিক্স', 'ইলেক্ট্রনিক্স'],
    'fashion': ['ফ্যাশন', 'ফাসন'],
    'beauty': ['বিউটি', 'সৌন্দর্য'],
    'food': ['খাবার', 'ফুড'],
    'grocery': ['মুদি', 'গ্রসারি']
  };

  // Enhanced suggestions with phonetic support
  const mockSuggestions = {
    'en': [
      'samsung galaxy', 'iphone 15', 'laptop dell', 'nike shoes', 'adidas sneakers',
      'wireless headphones', 'gaming keyboard', 'smart watch', 'tablet android',
      'camera canon', 'laptop bag', 'power bank', 'bluetooth speaker', 'gaming mouse',
      'monitor 4k', 'external hard drive', 'wireless charger', 'earbuds', 'smartphone case'
    ],
    'bn': [
      'স্যামসাং গ্যালাক্সি', 'আইফোন ১৫', 'ল্যাপটপ ডেল', 'নাইকি জুতা', 'অ্যাডিডাস স্নিকার',
      'ওয়্যারলেস হেডফোন', 'গেমিং কিবোর্ড', 'স্মার্ট ওয়াচ', 'ট্যাবলেট অ্যান্ড্রয়েড',
      'ক্যামেরা ক্যানন', 'ল্যাপটপ ব্যাগ', 'পাওয়ার ব্যাংক', 'ব্লুটুথ স্পিকার', 'গেমিং মাউস',
      'মনিটর ৪কে', 'এক্সটার্নাল হার্ড ড্রাইভ', 'ওয়্যারলেস চার্জার', 'ইয়ারবাড', 'স্মার্টফোন কেস'
    ]
  };

  // Comprehensive language detection with phonetic support
  const detectLanguage = (text: string): 'bn' | 'en' | 'mixed' => {
    const bengaliRegex = /[\u0980-\u09FF]/;
    const englishRegex = /[A-Za-z]/;
    
    const hasBengali = bengaliRegex.test(text);
    const hasEnglish = englishRegex.test(text);
    
    if (hasBengali && hasEnglish) return 'mixed';
    if (hasBengali) return 'bn';
    return 'en';
  };

  // Fuzzy matching implementation
  const fuzzyMatch = (query: string, target: string, threshold: number = 0.6): boolean => {
    const queryLower = query.toLowerCase();
    const targetLower = target.toLowerCase();
    
    // Exact match
    if (targetLower.includes(queryLower)) return true;
    
    // Levenshtein distance calculation
    const distance = levenshteinDistance(queryLower, targetLower);
    const similarity = 1 - distance / Math.max(queryLower.length, targetLower.length);
    
    return similarity >= threshold;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // Phonetic transliteration
  const getPhoneticVariations = (query: string): string[] => {
    const variations: string[] = [query];
    const words = query.toLowerCase().split(' ');
    
    words.forEach(word => {
      if (phoneticMap[word]) {
        phoneticMap[word].forEach(variant => {
          variations.push(variant);
          variations.push(query.replace(word, variant));
        });
      }
    });
    
    return variations;
  };

  // Search intent recognition
  const recognizeSearchIntent = (query: string): string => {
    const productKeywords = ['price', 'buy', 'purchase', 'specifications', 'review', 'compare'];
    const vendorKeywords = ['store', 'shop', 'seller', 'vendor', 'merchant'];
    const categoryKeywords = ['category', 'type', 'kind', 'collection'];
    
    const queryLower = query.toLowerCase();
    
    if (productKeywords.some(keyword => queryLower.includes(keyword))) return 'product';
    if (vendorKeywords.some(keyword => queryLower.includes(keyword))) return 'vendor';
    if (categoryKeywords.some(keyword => queryLower.includes(keyword))) return 'category';
    
    return 'general';
  };

  // Enhanced text search with all features
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
      console.log('Search intent:', recognizeSearchIntent(query));
      console.log('Applied filters:', filters);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const searchVariations = getPhoneticVariations(query);
      const searchTerms = query.toLowerCase().split(' ');
      
      let filtered = mockResults.filter(item => {
        // Enhanced text matching with phonetic support
        const titleMatch = searchVariations.some(variant => 
          item.title.toLowerCase().includes(variant.toLowerCase()) ||
          (item.titleBn && item.titleBn.includes(variant))
        ) || fuzzyMatch(query, item.title);
        
        const descriptionMatch = item.description?.toLowerCase().includes(query.toLowerCase()) ||
                               (item.descriptionBn && item.descriptionBn.includes(query)) ||
                               (item.description && fuzzyMatch(query, item.description));
        
        // SKU and barcode search
        const skuMatch = item.sku?.toLowerCase().includes(query.toLowerCase());
        const barcodeMatch = item.barcode?.toLowerCase().includes(query.toLowerCase());
        const modelMatch = item.modelNumber?.toLowerCase().includes(query.toLowerCase());
        const specMatch = item.specifications?.toLowerCase().includes(query.toLowerCase());
        
        // Vendor matching
        const vendorMatch = item.vendor?.name.toLowerCase().includes(query.toLowerCase()) ||
                           item.vendor?.tradeLicense?.toLowerCase().includes(query.toLowerCase());
        
        // Location matching
        const locationMatch = item.location?.toLowerCase().includes(query.toLowerCase()) ||
                             item.division?.toLowerCase().includes(query.toLowerCase()) ||
                             item.district?.toLowerCase().includes(query.toLowerCase()) ||
                             item.upazila?.toLowerCase().includes(query.toLowerCase()) ||
                             item.postalCode?.includes(query);
        
        const typeMatch = item.type.toLowerCase().includes(query.toLowerCase());
        const brandMatch = item.brand?.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = item.category?.toLowerCase().includes(query.toLowerCase());
        
        return titleMatch || descriptionMatch || typeMatch || brandMatch || categoryMatch || 
               vendorMatch || locationMatch || skuMatch || barcodeMatch || modelMatch || specMatch;
      });

      // Apply comprehensive filters
      if (filters.priceMin !== undefined) {
        filtered = filtered.filter(item => !item.price || item.price >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        filtered = filtered.filter(item => !item.price || item.price <= filters.priceMax!);
      }
      if (filters.division) {
        filtered = filtered.filter(item => item.division?.toLowerCase() === filters.division!.toLowerCase());
      }
      if (filters.district) {
        filtered = filtered.filter(item => item.district?.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.upazila) {
        filtered = filtered.filter(item => item.upazila?.toLowerCase() === filters.upazila!.toLowerCase());
      }
      if (filters.availability && filters.availability.length > 0) {
        filtered = filtered.filter(item => 
          !item.availability || filters.availability!.includes(item.availability)
        );
      }
      if (filters.rating) {
        filtered = filtered.filter(item => !item.rating || item.rating >= filters.rating!);
      }
      if (filters.vendorRating) {
        filtered = filtered.filter(item => !item.vendor?.rating || item.vendor.rating >= filters.vendorRating!);
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
      if (filters.subcategory) {
        filtered = filtered.filter(item => 
          item.subcategory?.toLowerCase() === filters.subcategory!.toLowerCase()
        );
      }
      if (filters.brand) {
        filtered = filtered.filter(item => 
          item.brand?.toLowerCase() === filters.brand!.toLowerCase()
        );
      }
      if (filters.paymentMethods && filters.paymentMethods.length > 0) {
        filtered = filtered.filter(item => 
          item.vendor?.paymentMethods?.some(method => 
            filters.paymentMethods!.includes(method)
          )
        );
      }
      if (filters.festivalOffers) {
        filtered = filtered.filter(item => item.isFestivalOffer === true);
      }
      if (filters.trending) {
        filtered = filtered.filter(item => item.isTrending === true);
      }
      if (filters.tradeLicenseVerified) {
        filtered = filtered.filter(item => item.vendor?.tradeLicense !== undefined);
      }

      // Enhanced sorting with festival and seasonal boosting
      filtered.sort((a, b) => {
        // Festival offers get highest priority
        if (a.isFestivalOffer && !b.isFestivalOffer) return -1;
        if (!a.isFestivalOffer && b.isFestivalOffer) return 1;
        
        // Trending products
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        
        // Verified vendors
        if (a.vendor?.verified && !b.vendor?.verified) return -1;
        if (!a.vendor?.verified && b.vendor?.verified) return 1;
        
        // Rating-based sorting
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

  // Enhanced SKU search
  const searchBySKU = useCallback(async (sku: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching by SKU:', sku);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = mockResults.filter(item => 
        item.sku?.toLowerCase() === sku.toLowerCase()
      );
      
      setSearchResults(result);
    } catch (err) {
      setError('SKU search failed. Please try again.');
      console.error('SKU search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced barcode search
  const searchByBarcode = useCallback(async (barcode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching by barcode:', barcode);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = mockResults.filter(item => 
        item.barcode === barcode
      );
      
      setSearchResults(result);
    } catch (err) {
      setError('Barcode search failed. Please try again.');
      console.error('Barcode search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced voice search with accent recognition
  const searchVoice = useCallback(async (audioBlob: Blob, language: 'bn' | 'en' = 'bn') => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing voice search in language:', language);
      console.log('Audio blob size:', audioBlob.size);
      
      // Simulate advanced voice processing with accent recognition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const voiceQueries = {
        'bn': [
          'স্যামসাং মোবাইল ফোন', 'নাইকি জুতা কিনতে চাই', 'ল্যাপটপ দেখাও',
          'এলিকট্রনিক্স দোকান খুঁজি', 'বিউটি পণ্য দরকার'
        ],
        'en': [
          'samsung mobile phone', 'want to buy nike shoes', 'show me laptops',
          'find electronics store', 'need beauty products'
        ]
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

  // Enhanced voice command processing
  const voiceCommand = useCallback(async (command: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing voice command:', command);
      
      const commandLower = command.toLowerCase();
      
      // Navigation commands
      if (commandLower.includes('go to') || commandLower.includes('navigate')) {
        console.log('Navigation command detected');
        // Implement navigation logic
      }
      
      // Add to cart commands
      if (commandLower.includes('add to cart') || commandLower.includes('buy')) {
        console.log('Add to cart command detected');
        // Implement add to cart logic
      }
      
      // Price comparison commands
      if (commandLower.includes('compare price') || commandLower.includes('price comparison')) {
        console.log('Price comparison command detected');
        // Implement price comparison logic
      }
      
      // Order status commands
      if (commandLower.includes('order status') || commandLower.includes('track order')) {
        console.log('Order tracking command detected');
        // Implement order tracking logic
      }
      
      // Shopping list commands
      if (commandLower.includes('shopping list') || commandLower.includes('add to list')) {
        console.log('Shopping list command detected');
        // Implement shopping list logic
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError('Voice command failed. Please try again.');
      console.error('Voice command error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced image search with visual recognition
  const searchImage = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing image search...');
      console.log('Image file:', imageFile.name, imageFile.size);
      
      // Simulate advanced image processing with OCR and visual recognition
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock advanced image recognition results
      const imageQueries = [
        'smartphone samsung galaxy', 'nike running shoes', 'laptop dell inspiron',
        'wireless headphones', 'smart watch apple', 'gaming keyboard mechanical',
        'ফোন স্যামসাং', 'জুতা নাইকি', 'ল্যাপটপ ডেল'
      ];
      
      const imageQuery = imageQueries[Math.floor(Math.random() * imageQueries.length)];
      console.log('Image identified as:', imageQuery);
      
      // Simulate OCR text extraction
      console.log('OCR text extraction completed');
      
      // Simulate background removal and enhancement
      console.log('Image enhancement completed');
      
      await searchText(imageQuery);
    } catch (err) {
      setError('Image search failed. Please try again.');
      console.error('Image search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  // Enhanced QR code search with Bangladesh-specific codes
  const searchQR = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing QR code...');
      
      // Simulate QR code processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock QR search results with Bangladesh-specific codes
      const qrTypes = [
        'product', 'vendor', 'payment', 'promotional', 'store_access'
      ];
      
      const qrType = qrTypes[Math.floor(Math.random() * qrTypes.length)];
      
      if (qrType === 'payment') {
        console.log('Bangladesh payment QR detected (bKash/Nagad/Rocket)');
        // Handle payment QR codes
      } else if (qrType === 'promotional') {
        console.log('Promotional QR code detected with discount');
        // Handle promotional codes
      } else if (qrType === 'vendor') {
        console.log('Vendor QR code detected');
        // Handle vendor profile access
      } else {
        const qrQueries = [
          'electronics store dhaka', 'fashion outlet chittagong', 'grocery shop sylhet',
          'ইলেকট্রনিক্স দোকান ঢাকা', 'ফ্যাশন আউটলেট চট্টগ্রাম'
        ];
        const qrQuery = qrQueries[Math.floor(Math.random() * qrQueries.length)];
        console.log('QR code decoded:', qrQuery);
        
        await searchText(qrQuery);
      }
    } catch (err) {
      setError('QR code search failed. Please try again.');
      console.error('QR search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  // Enhanced suggestions with spell correction
  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const language = detectLanguage(query);
      const relevantSuggestions = language === 'bn' ? mockSuggestions.bn : mockSuggestions.en;
      
      // Add phonetic variations to suggestions
      const phoneticVariations = getPhoneticVariations(query);
      
      const filtered = relevantSuggestions.filter(suggestion => {
        return phoneticVariations.some(variant => 
          suggestion.toLowerCase().includes(variant.toLowerCase())
        ) || fuzzyMatch(query, suggestion);
      });
      
      // Add spell correction suggestions
      const spellCorrected = relevantSuggestions.filter(suggestion => 
        fuzzyMatch(query, suggestion, 0.5)
      );
      
      const combined = [...new Set([...filtered, ...spellCorrected])];
      
      setSuggestions(combined.slice(0, 8));
      return combined.slice(0, 8);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }, []);

  // Apply filters with enhanced filtering options
  const applyFilters = useCallback((filters: SearchFilters) => {
    setCurrentFilters(prev => ({ ...prev, ...filters }));
    console.log('Applying comprehensive filters:', filters);
  }, []);

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
    applyFilters,
    searchBySKU,
    searchByBarcode,
    voiceCommand
  };
};
