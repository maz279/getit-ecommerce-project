
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { WishlistNavigationMap } from '../components/wishlist/WishlistNavigationMap';

const Wishlist: React.FC = () => {
  const wishlistItems = [
    {
      id: 1,
      name: 'Samsung Galaxy A54 5G',
      price: 35999,
      originalPrice: 39999,
      image: '/placeholder.svg',
      vendor: 'TechHub BD',
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      price: 8999,
      originalPrice: 12999,
      image: '/placeholder.svg',
      vendor: 'Sports World',
      rating: 4.7,
      inStock: true
    },
    {
      id: 3,
      name: 'Wireless Bluetooth Headphones',
      price: 2499,
      originalPrice: 3999,
      image: '/placeholder.svg',
      vendor: 'Audio Zone',
      rating: 4.3,
      inStock: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <WishlistNavigationMap />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <span className="text-gray-600">{wishlistItems.length} items</span>
        </div>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">by {item.vendor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-800">৳{item.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">৳{item.originalPrice.toLocaleString()}</span>
                    <span className="text-sm text-green-600 font-medium">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      disabled={!item.inStock}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                        item.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-medium">Add to Cart</span>
                    </button>
                    
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
