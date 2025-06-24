
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { LanguageSelector } from './LanguageSelector';
import { HeaderTrustIndicators } from './HeaderTrustIndicators';
import { AuthButtons } from './AuthButtons';

interface ActionIconsProps {
  language: string;
}

export const ActionIcons: React.FC<ActionIconsProps> = ({ language }) => {
  const { state } = useCart();
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = React.useState(language);

  const content = {
    EN: {
      becomeVendor: "Become a Vendor",
      search: "Search",
      wishlist: "Wishlist", 
      cart: "Cart"
    },
    BD: {
      becomeVendor: "বিক্রেতা হন",
      search: "খুঁজুন",
      wishlist: "পছন্দের তালিকা",
      cart: "কার্ট"
    }
  };

  const currentContent = content[currentLanguage as keyof typeof content];

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    // You can add additional language change logic here if needed
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Trust Indicators */}
      <HeaderTrustIndicators language={currentLanguage} />
      
      {/* Become a Vendor */}
      <Link
        to="/vendor/register"
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all text-sm font-medium"
      >
        <Store className="w-4 h-4" />
        {currentContent.becomeVendor}
      </Link>

      {/* Mobile Search Icon */}
      <button
        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label={currentContent.search}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Wishlist */}
      <Link
        to="/wishlist"
        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label={currentContent.wishlist}
      >
        <Heart className="w-5 h-5" />
      </Link>

      {/* Shopping Cart */}
      <Link
        to="/cart"
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label={currentContent.cart}
      >
        <ShoppingCart className="w-5 h-5" />
        {state.items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {state.items.length}
          </span>
        )}
      </Link>

      {/* Language Selector */}
      <LanguageSelector 
        language={currentLanguage} 
        onLanguageChange={handleLanguageChange} 
      />

      {/* User Authentication */}
      {user ? (
        <UserProfileDropdown language={currentLanguage} />
      ) : (
        <AuthButtons language={currentLanguage} />
      )}
    </div>
  );
};
