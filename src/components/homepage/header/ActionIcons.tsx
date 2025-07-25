
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { LanguageSelector } from './LanguageSelector';
import NotificationCenter from '@/components/realtime/NotificationCenter';

interface ActionIconsProps {
  language: string;
}

export const ActionIcons: React.FC<ActionIconsProps> = ({ language }) => {
  const { state } = useCart();
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = React.useState(language);

  const content = {
    EN: {
      search: "Search",
      wishlist: "Wishlist", 
      cart: "Cart"
    },
    BD: {
      search: "খুঁজুন",
      wishlist: "পছন্দের তালিকা",
      cart: "কার্ট"
    }
  };

  const currentContent = content[currentLanguage as keyof typeof content];

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Mobile Search Icon */}
      <button
        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label={currentContent.search}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Live Chat */}
      <Link to="/live-chat">
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </Link>

      {/* Notifications */}
      <NotificationCenter />

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

      {/* User Profile Dropdown (only show if user is logged in) */}
      {user && (
        <UserProfileDropdown language={currentLanguage} />
      )}
    </div>
  );
};
