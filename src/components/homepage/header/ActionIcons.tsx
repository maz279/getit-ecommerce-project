
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Bell } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const ActionIcons: React.FC = () => {
  const { state: cartState } = useCart();

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      <Link to="/wishlist" className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all group">
        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Wishlist
        </span>
      </Link>
      
      <Link to="/cart" className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all group">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
        {cartState.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartState.itemCount}
          </span>
        )}
        <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ৳{cartState.total} - {cartState.itemCount} items
        </div>
      </Link>
      
      <button className="relative p-1.5 sm:p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all group">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          3
        </span>
      </button>
    </div>
  );
};
