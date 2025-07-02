
import React from 'react';
import { Link } from 'react-router-dom';

export const FooterCategories: React.FC = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-green-300 mb-4">Shop by Category</h4>
      <div className="space-y-2">
        <Link to="/categories/electronics" className="text-sm text-gray-300 hover:text-white transition-colors block">Electronics & Gadgets</Link>
        <Link to="/categories/fashion" className="text-sm text-gray-300 hover:text-white transition-colors block">Fashion & Beauty</Link>
        <Link to="/categories/home-garden" className="text-sm text-gray-300 hover:text-white transition-colors block">Home & Garden</Link>
        <Link to="/categories/sports" className="text-sm text-gray-300 hover:text-white transition-colors block">Sports & Outdoor</Link>
        <Link to="/categories/books" className="text-sm text-gray-300 hover:text-white transition-colors block">Books & Media</Link>
        <Link to="/categories/automotive" className="text-sm text-gray-300 hover:text-white transition-colors block">Automotive</Link>
        <Link to="/categories/health" className="text-sm text-gray-300 hover:text-white transition-colors block">Health & Wellness</Link>
        <Link to="/categories/baby-kids" className="text-sm text-gray-300 hover:text-white transition-colors block">Baby & Kids</Link>
      </div>
    </div>
  );
};
