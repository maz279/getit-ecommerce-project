
import React from 'react';

interface ConversationalSearchHelperProps {
  showSuggestions: boolean;
  searchQuery: string;
  conversationalSearchText: string;
}

export const ConversationalSearchHelper: React.FC<ConversationalSearchHelperProps> = ({
  showSuggestions,
  searchQuery,
  conversationalSearchText
}) => {
  if (!showSuggestions || searchQuery) return null;

  return (
    <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 max-w-md text-center">
      💡 {conversationalSearchText}
    </div>
  );
};
