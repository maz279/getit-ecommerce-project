
import React from 'react';
import { Search } from 'lucide-react';

interface MobileSearchButtonProps {
  showMobileSearch: boolean;
  onToggle: () => void;
  isAIMode: boolean;
  voiceSearchLabel: string;
}

export const MobileSearchButton: React.FC<MobileSearchButtonProps> = ({
  showMobileSearch,
  onToggle,
  isAIMode,
  voiceSearchLabel
}) => {
  return (
    <button 
      onClick={onToggle}
      className={`md:hidden p-1.5 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all relative ${
        isAIMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : ''
      }`}
      aria-label={voiceSearchLabel}
    >
      <Search className="w-4 h-4" />
      {isAIMode && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
    </button>
  );
};
