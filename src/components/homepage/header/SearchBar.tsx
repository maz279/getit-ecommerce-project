import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAISearch } from '@/hooks/useAISearch';
import { DesktopSearchBar } from './DesktopSearchBar';
import { MobileSearchBar } from './MobileSearchBar';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  language: string;
}

// Comprehensive page mapping for navigation
const PAGE_NAVIGATION_MAP = {
  // Main pages
  'home': '/',
  'homepage': '/',
  'index': '/',
  'dashboard': '/dashboard',
  'admin': '/dashboard',
  'profile': '/profile',
  'account': '/profile',
  'my account': '/profile',
  
  // Auth pages
  'login': '/login',
  'register': '/register',
  'signup': '/register',
  'sign up': '/register',
  'sign in': '/login',
  
  // Shopping pages
  'cart': '/cart',
  'checkout': '/checkout',
  'orders': '/orders',
  'order': '/orders',
  'wishlist': '/wishlist',
  'wish list': '/wishlist',
  'categories': '/categories',
  'category': '/categories',
  
  // Business pages
  'vendors': '/vendors',
  'vendor': '/vendors',
  'seller': '/vendors',
  'sellers': '/vendors',
  'vendor register': '/vendor-register',
  'seller center': '/seller-center',
  
  // Shopping features
  'flash sale': '/flash-sale',
  'daily deals': '/daily-deals',
  'mega sale': '/mega-sale',
  'new arrivals': '/new-arrivals',
  'best sellers': '/bestsellers',
  'premium': '/premium',
  'offers': '/offers',
  'gift cards': '/gift-cards',
  'group buy': '/group-buy',
  'bulk orders': '/bulk-orders',
  
  // Information pages
  'about': '/about',
  'about us': '/about',
  'contact': '/contact',
  'help': '/help',
  'help center': '/help',
  'support': '/help',
  'privacy': '/privacy',
  'privacy policy': '/privacy',
  'terms': '/terms',
  'terms of service': '/terms',
  
  // Utility pages
  'track order': '/track-order',
  'order tracking': '/order-tracking',
  'delivery info': '/delivery-info',
  'payment methods': '/payment-methods',
  'mobile banking': '/mobile-banking',
  'returns': '/returns-refunds',
  'refunds': '/returns-refunds',
  'recommendations': '/recommendations',
  'products': '/products',
  
  // Festival/Special pages
  'eid sale': '/eid-sale',
  'new user offer': '/new-user-offer',
  
  // Search specific
  'search': '/search',
  'product': '/search?type=product',
  'brand': '/search?type=brand'
};

// Get page suggestions based on query
const getPageSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const matchingPages = Object.keys(PAGE_NAVIGATION_MAP).filter(page => 
    page.includes(lowerQuery) || lowerQuery.includes(page)
  );
  
  return matchingPages.slice(0, 5);
};

// Check if query matches a page name
const getDirectPageMatch = (query: string): string | null => {
  const lowerQuery = query.toLowerCase().trim();
  return PAGE_NAVIGATION_MAP[lowerQuery] || null;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  showMobileSearch,
  setShowMobileSearch,
  language
}) => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'bn' | 'en'>('bn');
  const [pageSuggestions, setPageSuggestions] = useState<string[]>([]);
  const [isAIMode, setIsAIMode] = useState(true); // AI mode enabled by default
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use AI-enhanced search hook
  const {
    searchWithAI,
    processVoiceInput,
    processImageSearch,
    processConversationalQuery,
    getAISuggestions,
    getPersonalizedRecommendations,
    analyzeQuery,
    aiSuggestions,
    personalizedRecommendations,
    queryAnalysis,
    searchResults,
    suggestions,
    isLoading,
    error,
    clearResults,
    applyFilters
  } = useAISearch();

  const content = {
    EN: {
      voiceSearch: "AI Voice Search",
      trendingSearches: ['AI Search', 'Smart Recommendations', 'Voice Commands', 'Visual Search', 'Personalized Results'],
      navigateToPage: "Navigate to page:",
      pages: "Pages",
      aiMode: "AI Mode",
      conversationalSearch: "Try: 'Show me phones under 30000' or 'Find best laptops for gaming'"
    },
    BD: {
      voiceSearch: "এআই ভয়েস সার্চ",
      trendingSearches: ['এআই সার্চ', 'স্মার্ট সাজেশন', 'ভয়েস কমান্ড', 'ভিজুয়াল সার্চ', 'ব্যক্তিগত ফলাফল'],
      navigateToPage: "পেজে যান:",
      pages: "পেজসমূহ",
      aiMode: "এআই মোড",
      conversationalSearch: "চেষ্টা করুন: '৩০০০০ টাকার নিচে ফোন দেখাও' বা 'গেমিংয়ের জন্য সেরা ল্যাপটপ খুঁজে দাও'"
    }
  };

  const currentContent = content[language as keyof typeof content];

  // Load personalized recommendations on component mount
  useEffect(() => {
    if (isAIMode) {
      getPersonalizedRecommendations().catch(console.error);
    }
  }, [isAIMode, getPersonalizedRecommendations]);

  // Enhanced input change handler with AI suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Get page suggestions (existing functionality)
      const pageMatches = getPageSuggestions(value);
      setPageSuggestions(pageMatches);
      
      if (isAIMode) {
        // Get AI-powered smart suggestions
        try {
          await getAISuggestions(value);
          console.log('AI suggestions generated for:', value);
        } catch (error) {
          console.error('AI suggestions failed:', error);
        }
        
        // Analyze query in real-time for better UX
        if (value.length > 3) {
          try {
            await analyzeQuery(value);
            console.log('Real-time query analysis completed');
          } catch (error) {
            console.error('Query analysis failed:', error);
          }
        }
      } else {
        // Fallback to basic suggestions
        // await getSuggestions(value);
      }
      
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      clearResults();
      setPageSuggestions([]);
      setShowSuggestions(false);
      setShowResults(false);
    }
  };

  // Enhanced search handler with AI processing
  const handleSearch = async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault();
    const searchQuery = query || inputRef.current?.value || '';
    
    if (searchQuery.trim()) {
      // First check if it's a direct page match
      const directPageMatch = getDirectPageMatch(searchQuery);
      if (directPageMatch) {
        navigate(directPageMatch);
        setShowSuggestions(false);
        setShowResults(false);
        return;
      }
      
      // Check if it's a conversational query
      const isConversational = /^(show me|find|search for|i want|i need|get me|what are|where can|how to)/i.test(searchQuery);
      
      if (isAIMode) {
        try {
          if (isConversational) {
            console.log('Processing conversational query with AI');
            await processConversationalQuery(searchQuery);
          } else {
            console.log('Processing search with AI');
            await searchWithAI(searchQuery);
          }
        } catch (error) {
          console.error('AI search failed, falling back to basic search');
          // Fallback handled in useAISearch hook
        }
      } else {
        // Basic search fallback
        // await searchText(searchQuery);
      }
      
      setShowResults(true);
      setShowSuggestions(false);
      setSearchQuery(searchQuery);
    }
  };

  // Enhanced voice search handler
  const handleVoiceSearch = async (audioBlob: Blob) => {
    try {
      if (isAIMode) {
        console.log('Processing voice search with AI');
        await processVoiceInput(audioBlob, voiceLanguage);
      } else {
        // Fallback to basic voice search
        // await searchVoice(audioBlob, voiceLanguage);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Voice search failed:', error);
    }
  };

  // Enhanced image search handler
  const handleImageSearch = async (file: File) => {
    try {
      if (isAIMode) {
        console.log('Processing image search with AI');
        await processImageSearch(file);
      } else {
        // Fallback to basic image search
        // await searchImage(file);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Image search failed:', error);
    }
  };

  // Enhanced QR search handler
  const handleQRSearch = async (file: File) => {
    try {
      if (isAIMode) {
        console.log('Processing QR search with AI');
        await processImageSearch(file); // AI service handles both image and QR
      } else {
        // Fallback to basic QR search
        // await searchQR(file);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('QR search failed:', error);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click (both search and page suggestions)
  const handleSuggestionClick = (suggestion: string) => {
    // Check if it's a page suggestion
    const pageMatch = PAGE_NAVIGATION_MAP[suggestion.toLowerCase()];
    if (pageMatch) {
      navigate(pageMatch);
      setShowSuggestions(false);
      setShowResults(false);
      setSearchQuery('');
      return;
    }
    
    // Regular search suggestion
    setSearchQuery(suggestion);
    handleSearch(undefined, suggestion);
    setShowSuggestions(false);
  };

  // Handle page navigation directly
  const handlePageNavigation = (pageName: string) => {
    const route = PAGE_NAVIGATION_MAP[pageName.toLowerCase()];
    if (route) {
      navigate(route);
      setShowSuggestions(false);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  // Handle trending search click
  const handleTrendingClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(undefined, search);
  };

  // Enhanced result click handler with proper navigation
  const handleResultClick = (result: any) => {
    console.log('Selected result:', result);
    setShowResults(false);
    setShowSuggestions(false);
    
    // Navigate based on result type
    switch (result.type) {
      case 'product':
        navigate(`/product/${result.id}`, { state: { product: result } });
        break;
      case 'vendor':
        navigate(`/vendor/${result.id}`, { state: { vendor: result } });
        break;
      case 'category':
        navigate(`/categories/${result.category?.toLowerCase() || result.title.toLowerCase()}`);
        break;
      case 'brand':
        navigate(`/brands/${result.brand?.toLowerCase() || result.title.toLowerCase()}`);
        break;
      default:
        // Fallback to search results page
        navigate(`/search?q=${encodeURIComponent(result.title)}&type=${result.type}`);
    }
  };

  // Enhanced suggestions that include AI suggestions
  const enhancedSuggestions = isAIMode && aiSuggestions.length > 0 
    ? aiSuggestions.map(s => s.text)
    : suggestions;

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mobile Search Button with AI indicator
  return (
    <>
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className={`md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all relative ${
          isAIMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : ''
        }`}
        aria-label={currentContent.voiceSearch}
      >
        <Search className="w-4 h-4" />
        {isAIMode && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* Desktop Search Bar with AI enhancements */}
      <DesktopSearchBar
        searchQuery={searchQuery}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          } else if (e.key === 'Escape') {
            setShowResults(false);
            setShowSuggestions(false);
          }
        }}
        onClearSearch={() => {
          setSearchQuery('');
          clearResults();
          setShowResults(false);
          setShowSuggestions(false);
          setPageSuggestions([]);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
        inputRef={inputRef}
        searchRef={searchRef}
        voiceLanguage={voiceLanguage}
        onLanguageToggle={() => setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn')}
        onVoiceSearch={handleVoiceSearch}
        onImageSearch={handleImageSearch}
        onQRSearch={handleQRSearch}
        showFilters={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        onFiltersApply={(filters) => {
          applyFilters(filters);
          setShowFilters(false);
        }}
        showSuggestions={showSuggestions}
        suggestions={enhancedSuggestions}
        onSuggestionClick={(suggestion) => {
          const pageMatch = PAGE_NAVIGATION_MAP[suggestion.toLowerCase()];
          if (pageMatch) {
            navigate(pageMatch);
            setShowSuggestions(false);
            setShowResults(false);
            setSearchQuery('');
            return;
          }
          
          setSearchQuery(suggestion);
          handleSearch(undefined, suggestion);
          setShowSuggestions(false);
        }}
        showResults={showResults}
        searchResults={searchResults}
        isLoading={isLoading}
        error={error}
        onResultClick={(result) => {
          console.log('Selected result:', result);
          setShowResults(false);
          setShowSuggestions(false);
          
          switch (result.type) {
            case 'product':
              navigate(`/product/${result.id}`, { state: { product: result } });
              break;
            case 'vendor':
              navigate(`/vendor/${result.id}`, { state: { vendor: result } });
              break;
            case 'category':
              navigate(`/categories/${result.category?.toLowerCase() || result.title.toLowerCase()}`);
              break;
            case 'brand':
              navigate(`/brands/${result.brand?.toLowerCase() || result.title.toLowerCase()}`);
              break;
            default:
              navigate(`/search?q=${encodeURIComponent(result.title)}&type=${result.type}`);
          }
        }}
        trendingSearches={currentContent.trendingSearches}
        onTrendingClick={(search) => {
          setSearchQuery(search);
          handleSearch(undefined, search);
        }}
        language={language}
        pageSuggestions={pageSuggestions}
        onPageNavigate={(pageName) => {
          const route = PAGE_NAVIGATION_MAP[pageName.toLowerCase()];
          if (route) {
            navigate(route);
            setShowSuggestions(false);
            setShowResults(false);
            setSearchQuery('');
          }
        }}
      />

      {/* Mobile Search Bar with AI enhancements */}
      <MobileSearchBar
        showMobileSearch={showMobileSearch}
        searchQuery={searchQuery}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          } else if (e.key === 'Escape') {
            setShowResults(false);
            setShowSuggestions(false);
          }
        }}
        onClearSearch={() => {
          setSearchQuery('');
          clearResults();
          setShowResults(false);
          setShowSuggestions(false);
          setPageSuggestions([]);
        }}
        searchRef={searchRef}
        voiceLanguage={voiceLanguage}
        onLanguageToggle={() => setVoiceLanguage(voiceLanguage === 'bn' ? 'en' : 'bn')}
        onVoiceSearch={handleVoiceSearch}
        onImageSearch={handleImageSearch}
        onQRSearch={handleQRSearch}
        showFilters={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        onFiltersApply={(filters) => {
          applyFilters(filters);
          setShowFilters(false);
        }}
        showSuggestions={showSuggestions}
        suggestions={enhancedSuggestions}
        onSuggestionClick={(suggestion) => {
          const pageMatch = PAGE_NAVIGATION_MAP[suggestion.toLowerCase()];
          if (pageMatch) {
            navigate(pageMatch);
            setShowSuggestions(false);
            setShowResults(false);
            setSearchQuery('');
            return;
          }
          
          setSearchQuery(suggestion);
          handleSearch(undefined, suggestion);
          setShowSuggestions(false);
        }}
        showResults={showResults}
        searchResults={searchResults}
        isLoading={isLoading}
        error={error}
        onResultClick={(result) => {
          console.log('Selected result:', result);
          setShowResults(false);
          setShowSuggestions(false);
          
          switch (result.type) {
            case 'product':
              navigate(`/product/${result.id}`, { state: { product: result } });
              break;
            case 'vendor':
              navigate(`/vendor/${result.id}`, { state: { vendor: result } });
              break;
            case 'category':
              navigate(`/categories/${result.category?.toLowerCase() || result.title.toLowerCase()}`);
              break;
            case 'brand':
              navigate(`/brands/${result.brand?.toLowerCase() || result.title.toLowerCase()}`);
              break;
            default:
              navigate(`/search?q=${encodeURIComponent(result.title)}&type=${result.type}`);
          }
        }}
        language={language}
        pageSuggestions={pageSuggestions}
        onPageNavigate={(pageName) => {
          const route = PAGE_NAVIGATION_MAP[pageName.toLowerCase()];
          if (route) {
            navigate(route);
            setShowSuggestions(false);
            setShowResults(false);
            setSearchQuery('');
          }
        }}
      />

      {/* AI Mode Indicator */}
      {isAIMode && (
        <div className="hidden md:block absolute top-full right-0 mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs">
          AI Enhanced
        </div>
      )}
      
      {/* Conversational Search Helper */}
      {showSuggestions && !searchQuery && (
        <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 max-w-md text-center">
          💡 {currentContent.conversationalSearch}
        </div>
      )}
    </>
  );
};
