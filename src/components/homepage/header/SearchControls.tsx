
import React from 'react';
import { Search, Filter, Globe } from 'lucide-react';
import { VoiceSearch } from './VoiceSearch';
import { ImageSearch } from './ImageSearch';

interface SearchControlsProps {
  voiceLanguage: 'bn' | 'en';
  onLanguageToggle: () => void;
  onVoiceSearch: (audioBlob: Blob) => void;
  onImageSearch: (file: File) => void;
  onQRSearch: (file: File) => void;
  onFiltersToggle: () => void;
  isLoading: boolean;
  isMobile?: boolean;
  language: string;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  voiceLanguage,
  onLanguageToggle,
  onVoiceSearch,
  onImageSearch,
  onQRSearch,
  onFiltersToggle,
  isLoading,
  isMobile = false,
  language
}) => {
  const content = {
    EN: {
      searchIn: "Search in:",
      bengali: "বাংলা",
      english: "English",
      filters: "Filters"
    },
    BD: {
      searchIn: "যেখানে খুঁজবেন:",
      bengali: "বাংলা",
      english: "English",
      filters: "ফিল্টার"
    }
  };

  const currentContent = content[language as keyof typeof content];
  const buttonSize = isMobile ? "w-3 h-3" : "w-4 h-4";
  const iconSize = isMobile ? "w-3 h-3" : "w-3 h-3";

  return (
    <div className={`flex items-center gap-1 ${isMobile ? 'px-2' : 'px-3 border-l border-gray-200'}`}>
      <button
        type="button"
        onClick={onLanguageToggle}
        className={`${isMobile ? 'p-1' : 'p-1.5'} hover:bg-gray-100 rounded-full text-gray-600 text-xs`}
        title={`${currentContent.searchIn} ${voiceLanguage === 'bn' ? currentContent.bengali : currentContent.english}`}
      >
        <Globe className={iconSize} />
      </button>

      <VoiceSearch 
        onVoiceSearch={onVoiceSearch}
        isLoading={isLoading}
        language={voiceLanguage}
      />
      
      <ImageSearch
        onImageSearch={onImageSearch}
        onQRSearch={onQRSearch}
        isLoading={isLoading}
        type="image"
      />
      
      <ImageSearch
        onImageSearch={onImageSearch}
        onQRSearch={onQRSearch}
        isLoading={isLoading}
        type="qr"
      />
      
      <button
        type="button"
        onClick={onFiltersToggle}
        className={`${isMobile ? 'p-1' : 'p-1.5'} hover:bg-gray-100 rounded-full text-gray-600`}
        title={currentContent.filters}
      >
        <Filter className={buttonSize} />
      </button>
      
      <button 
        type="submit"
        className={`bg-gradient-to-r from-orange-400 to-yellow-400 ${isMobile ? 'p-2' : 'p-2'} rounded-r-lg hover:from-orange-500 hover:to-yellow-500 transition-all`}
        aria-label="Search"
      >
        <Search className={`${buttonSize} text-white`} />
      </button>
    </div>
  );
};
