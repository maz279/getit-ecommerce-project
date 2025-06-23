
import React, { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { Logo } from './header/Logo';
import { SearchBar } from './header/SearchBar';
import { ActionIcons } from './header/ActionIcons';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'BD' : 'EN');
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 w-full py-4 px-2 sm:px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Menu and Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <MobileMenu />
            <Logo language={language} />
          </div>

          {/* Search Bar */}
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showMobileSearch={showMobileSearch}
            setShowMobileSearch={setShowMobileSearch}
            language={language}
          />

          {/* Action Icons */}
          <ActionIcons language={language} />
        </div>
      </header>
    </>
  );
};
