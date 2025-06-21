
import React from 'react';
import { Search, Mic, Camera, QrCode } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  language: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  showMobileSearch,
  setShowMobileSearch,
  language
}) => {
  const content = {
    EN: {
      placeholder: "Search products, brands, vendors...",
      trending: "Trending:",
      allCategories: "All Categories",
      categories: {
        electronics: "Electronics",
        fashion: "Fashion",
        home: "Home",
        beauty: "Beauty",
        groceries: "Groceries"
      },
      trendingSearches: ['Mobile', 'Fashion', 'Electronics', 'Groceries']
    },
    BD: {
      placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন...",
      trending: "ট্রেন্ডিং:",
      allCategories: "সব ক্যাটেগরি",
      categories: {
        electronics: "ইলেকট্রনিক্স",
        fashion: "ফ্যাশন",
        home: "ঘর",
        beauty: "সৌন্দর্য",
        groceries: "মুদি"
      },
      trendingSearches: ['মোবাইল', 'ফ্যাশন', 'ইলেকট্রনিক্স', 'মুদি']
    }
  };

  const currentContent = content[language as keyof typeof content];

  return (
    <>
      {/* Mobile Search Button */}
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-3xl flex-col">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
          <div className="flex items-center">
            <select className="px-3 py-3 border-r border-gray-200 text-sm focus:outline-none">
              <option>{currentContent.allCategories}</option>
              <option>{currentContent.categories.electronics}</option>
              <option>{currentContent.categories.fashion}</option>
              <option>{currentContent.categories.home}</option>
              <option>{currentContent.categories.beauty}</option>
              <option>{currentContent.categories.groceries}</option>
            </select>
            <input
              type="search"
              placeholder={currentContent.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-sm focus:outline-none"
            />
            <div className="flex items-center gap-2 px-3">
              <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Voice Search">
                <Mic className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Image Search">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full" title="QR Search">
                <QrCode className="w-4 h-4 text-gray-600" />
              </button>
              <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg hover:from-orange-500 hover:to-yellow-500 transition-all">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
        {/* Trending Searches */}
        <div className="mt-2 flex items-center gap-2 text-xs text-white">
          <span>{currentContent.trending}</span>
          {currentContent.trendingSearches.map((search) => (
            <button 
              key={search}
              onClick={() => setSearchQuery(search)}
              className="bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30 transition-all"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden mt-3 px-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
            <div className="flex items-center">
              <select className="px-3 py-2 border-r border-gray-200 text-sm focus:outline-none">
                <option>{currentContent.allCategories}</option>
                <option>{currentContent.categories.electronics}</option>
                <option>{currentContent.categories.fashion}</option>
                <option>{currentContent.categories.home}</option>
              </select>
              <input
                type="search"
                placeholder={currentContent.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
              <button className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 rounded-r-lg">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
