import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  Heart,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavigationProps {
  cartItemsCount?: number;
  notificationCount?: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  cartItemsCount = 0, 
  notificationCount = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/', color: 'text-blue-600' },
    { icon: Search, label: 'Search', path: '/search', color: 'text-green-600' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', color: 'text-orange-600', badge: cartItemsCount },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: 'text-red-600' },
    { icon: User, label: 'Profile', path: '/account', color: 'text-purple-600' }
  ];

  const secondaryItems = [
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: notificationCount },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Logout', path: '/logout', action: true }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative transition-colors ${
                  isActive ? item.color : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs min-w-4"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Header with Menu */}
      <div className="sticky top-0 bg-background border-b border-border z-40 md:hidden">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-6 w-6" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">G</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">GetIt Bangladesh</h3>
                    <p className="text-sm text-muted-foreground">Your marketplace</p>
                  </div>
                </div>

                <nav className="flex-1 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(item.path);
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}

                  <Separator className="my-4" />

                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t pt-4 mt-4">
                  <div className="text-xs text-muted-foreground text-center">
                    Version 1.0.0 • GetIt Bangladesh
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-lg">GetIt</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom spacing for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
};