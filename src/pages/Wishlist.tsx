import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { WishlistNavigationMap } from '../components/wishlist/WishlistNavigationMap';
import { WishlistDashboard } from '../components/wishlist/WishlistDashboard';
import { WishlistCategories } from '../components/wishlist/WishlistCategories';
import { EnhancedProductCard } from '../components/wishlist/EnhancedProductCard';
import { RecentlyViewed } from '../components/wishlist/RecentlyViewed';
import { PriceAlerts } from '../components/wishlist/PriceAlerts';
import { WishlistSharing } from '../components/wishlist/WishlistSharing';
import { WishlistRecommendations } from '../components/wishlist/WishlistRecommendations';
import { BulkActions } from '../components/wishlist/BulkActions';
import { SmartNotifications } from '../components/wishlist/SmartNotifications';
import { PrivacyControls } from '../components/wishlist/PrivacyControls';
import { WishlistAnalytics } from '../components/wishlist/WishlistAnalytics';

const Wishlist: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [filters, setFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const wishlistItems = [
    {
      id: 1,
      name: 'Samsung Galaxy A54 5G',
      nameBn: 'স্যামসাং গ্যালাক্সি এ৫৪ ৫জি',
      price: 35999,
      originalPrice: 39999,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      vendor: {
        name: 'TechHub BD',
        rating: 4.5,
        location: 'Dhaka',
        verified: true
      },
      stock: {
        status: 'in_stock' as const,
        quantity: 25
      },
      delivery: {
        estimatedDays: 2,
        cod: true,
        freeShipping: true,
        express: true
      },
      features: {
        emi: true,
        priceHistory: true,
        trending: true,
        festival: false
      }
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      nameBn: 'নাইকি এয়ার ম্যাক্স ২৭০',
      price: 8999,
      originalPrice: 12999,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      vendor: {
        name: 'Sports World',
        rating: 4.7,
        location: 'Chittagong',
        verified: true
      },
      stock: {
        status: 'limited' as const,
        quantity: 3
      },
      delivery: {
        estimatedDays: 3,
        cod: true,
        freeShipping: false,
        express: false
      },
      features: {
        emi: false,
        priceHistory: true,
        trending: false,
        festival: true
      }
    },
    {
      id: 3,
      name: 'Wireless Bluetooth Headphones',
      nameBn: 'ওয়্যারলেস ব্লুটুথ হেডফোন',
      price: 2499,
      originalPrice: 3999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      vendor: {
        name: 'Audio Zone',
        rating: 4.3,
        location: 'Dhaka',
        verified: false
      },
      stock: {
        status: 'out_of_stock' as const
      },
      delivery: {
        estimatedDays: 5,
        cod: false,
        freeShipping: true,
        express: false
      },
      features: {
        emi: false,
        priceHistory: false,
        trending: false,
        festival: false
      }
    }
  ];

  const handleRemoveFromWishlist = (id: number) => {
    console.log('Remove from wishlist:', id);
  };

  const handleAddToCart = (id: number) => {
    console.log('Add to cart:', id);
  };

  const handleShare = (id: number) => {
    console.log('Share product:', id);
  };

  const handleQuickView = (id: number) => {
    console.log('Quick view:', id);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    console.log('Sort changed to:', sort);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const handleSelectAll = () => {
    setSelectedItems(wishlistItems.map(item => item.id));
  };

  const handleSelectNone = () => {
    setSelectedItems([]);
  };

  const handleBulkRemove = (ids: number[]) => {
    console.log('Bulk remove:', ids);
    setSelectedItems([]);
  };

  const handleBulkAddToCart = (ids: number[]) => {
    console.log('Bulk add to cart:', ids);
    setSelectedItems([]);
  };

  const handleBulkShare = (ids: number[]) => {
    console.log('Bulk share:', ids);
  };

  const handleCompare = (id: number) => {
    console.log('Compare product:', id);
  };

  // Dashboard stats
  const totalItems = wishlistItems.length;
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const availableItems = wishlistItems.filter(item => item.stock.status === 'in_stock' || item.stock.status === 'limited').length;
  const priceDrops = wishlistItems.filter(item => item.originalPrice && item.originalPrice > item.price).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <WishlistNavigationMap />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{wishlistItems.length} items</span>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && <WishlistAnalytics />}

        {/* Dashboard Overview */}
        <WishlistDashboard
          totalItems={totalItems}
          totalValue={totalValue}
          availableItems={availableItems}
          priceDrops={priceDrops}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />

        {/* Categories Section */}
        <WishlistCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Smart Notifications */}
        <SmartNotifications />

        {/* Privacy Controls */}
        <PrivacyControls />

        {/* Price Alerts Section */}
        <PriceAlerts />

        {/* Wishlist Sharing Section */}
        <WishlistSharing />

        {/* Bulk Actions */}
        <BulkActions
          selectedItems={selectedItems}
          totalItems={wishlistItems.length}
          onSelectAll={handleSelectAll}
          onSelectNone={handleSelectNone}
          onBulkRemove={handleBulkRemove}
          onBulkAddToCart={handleBulkAddToCart}
          onBulkShare={handleBulkShare}
        />

        {/* Main Wishlist Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Saved Items</h2>
          
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8">Start adding products you love to keep track of them</p>
              <Link
                to="/products"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'list' 
                ? 'space-y-4' 
                : viewMode === 'compact'
                ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            `}>
              {wishlistItems.map((item) => (
                <EnhancedProductCard
                  key={item.id}
                  {...item}
                  viewMode={viewMode}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={(id, selected) => {
                    if (selected) {
                      setSelectedItems(prev => [...prev, id]);
                    } else {
                      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
                    }
                  }}
                  onRemove={handleRemoveFromWishlist}
                  onAddToCart={handleAddToCart}
                  onShare={handleShare}
                  onQuickView={handleQuickView}
                  onCompare={handleCompare}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Section */}
        <RecentlyViewed />

        {/* Recommendations Section */}
        <WishlistRecommendations />
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
