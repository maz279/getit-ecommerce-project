
import React from 'react';

interface WishlistHeaderProps {
  itemCount: number;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

export const WishlistHeader: React.FC<WishlistHeaderProps> = ({
  itemCount,
  showAnalytics,
  onToggleAnalytics
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{itemCount} items</span>
        <button
          onClick={onToggleAnalytics}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
        </button>
      </div>
    </div>
  );
};
