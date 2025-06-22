
import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { WishlistNavigationMap } from '../components/wishlist/WishlistNavigationMap';
import { WishlistAnalytics } from '../components/wishlist/WishlistAnalytics';
import { WishlistHeader } from '../components/wishlist/WishlistHeader';
import { WishlistContent } from '../components/wishlist/WishlistContent';

const Wishlist: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <WishlistNavigationMap />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <WishlistHeader
          itemCount={wishlistItems.length}
          showAnalytics={showAnalytics}
          onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        />

        {/* Analytics Section */}
        {showAnalytics && <WishlistAnalytics />}

        <WishlistContent wishlistItems={wishlistItems} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
