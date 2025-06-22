
import React from 'react';

interface TrendingSearchesProps {
  searches: string[];
  onTrendingClick: (search: string) => void;
  language: string;
}

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  searches,
  onTrendingClick,
  language
}) => {
  const content = {
    EN: { trending: "Trending:" },
    BD: { trending: "ট্রেন্ডিং:" }
  };

  const currentContent = content[language as keyof typeof content];

  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-white flex-wrap">
      <span className="whitespace-nowrap">{currentContent.trending}</span>
      {searches.map((search) => (
        <button 
          key={search}
          onClick={() => onTrendingClick(search)}
          className="bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30 transition-all whitespace-nowrap"
        >
          {search}
        </button>
      ))}
    </div>
  );
};
