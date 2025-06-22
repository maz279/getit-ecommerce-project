
import React from 'react';
import { SearchBarContainer } from './searchbar/SearchBarContainer';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  language: string;
}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return <SearchBarContainer {...props} />;
};
