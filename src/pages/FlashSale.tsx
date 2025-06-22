
import React, { useState, useEffect } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { 
  Zap, 
  Clock, 
  Flame, 
  ShoppingCart, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  Heart,
  Eye,
  Share2,
  ChevronDown,
  TrendingUp,
  Award,
  Truck,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FlashSale: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 34,
    seconds: 56
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', count: 156 },
    { id: 'electronics', name: 'Electronics', count: 45 },
    { id: 'fashion', name: 'Fashion', count: 38 },
    { id: 'home', name: 'Home & Living', count: 29 },
    { id: 'beauty', name: 'Beauty & Health', count: 24 },
    { id: 'sports', name: 'Sports & Outdoor', count: 20 }
  ];

  const flashProducts = Array.from({ length: 24 }).map((_, index) => ({
    id: index + 1,
    image: `https://images.unsplash.com/photo-${1500000000000 + index * 100000}?w=300&h=300&fit=crop`,
    title: `Flash Sale Product ${index + 1} - Premium Quality Item`,
    originalPrice: (999 + index * 100),
    salePrice: (299 + index * 50),
    discount: Math.floor(Math.random() * 60 + 20),
    rating: 4.2 + Math.random() * 0.8,
    reviews: Math.floor(Math.random() * 500 + 100),
    sold: Math.floor(Math.random() * 1000 + 50),
    stockLeft: Math.floor(Math.random() * 20 + 5),
    freeShipping: Math.random() > 0.5,
    badge: Math.random() > 0.7 ? 'Best Seller' : Math.random() > 0.5 ? 'Limited Time' : null,
    location: 'Dhaka'
  }));

  const filteredProducts = flashProducts.filter(product => {
    if (selectedCategory !== 'all') return Math.random() > 0.3; // Mock filtering
    return product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
  });

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-100"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Flame className="w-8 h-8 animate-bounce text-yellow-300" />
                <Zap className="w-10 h-10 text-yellow-300" />
                <Flame className="w-8 h-8 animate-bounce text-yellow-300" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
                Flash Sale
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-yellow-100">
                Up to 80% OFF + Free Shipping on Selected Items
              </p>
              
              {/* Enhanced Countdown */}
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 inline-block mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg font-semibold">Sale Ends In:</span>
                </div>
                <div className="flex gap-3">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="bg-white text-red-600 rounded-xl p-4 min-w-[80px] text-center shadow-lg">
                      <div className="text-2xl md:text-3xl font-bold">{value.toString().padStart(2, '0')}</div>
                      <div className="text-sm uppercase font-medium">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-yellow-200">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12K+</div>
                  <div className="text-sm text-yellow-200">Sold Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-sm text-yellow-200">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Controls Section */}
        <section className="bg-white shadow-sm sticky top-0 z-40 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Top Rated</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (৳)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option>All Ratings</option>
                      <option>4★ & above</option>
                      <option>3★ & above</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option>All</option>
                      <option>Free Shipping</option>
                      <option>Same Day Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option>All Bangladesh</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden border ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  {/* Product Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48' : ''}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        viewMode === 'list' ? 'h-full' : 'h-48'
                      }`}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                      </div>
                      {product.badge && (
                        <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.badge}
                        </div>
                      )}
                      {product.freeShipping && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Free
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50">
                        <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-green-50">
                        <Share2 className="w-4 h-4 text-gray-600 hover:text-green-500" />
                      </button>
                    </div>

                    {/* Stock Warning */}
                    {product.stockLeft <= 10 && (
                      <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Only {product.stockLeft} left!
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                    <div>
                      <h3 className={`font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors ${
                        viewMode === 'list' ? 'text-lg' : 'text-sm'
                      }`}>
                        {product.title}
                      </h3>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviews})
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-bold text-red-600 ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
                          ৳{product.salePrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Sales Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{product.sold} sold</span>
                        <span>{product.location}</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Load More Products
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-white py-8 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-semibold text-gray-800">Buyer Protection</h3>
                <p className="text-sm text-gray-600">100% Secure Shopping</p>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Same Day Delivery Available</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-8 h-8 text-yellow-500 mb-2" />
                <h3 className="font-semibold text-gray-800">Quality Assured</h3>
                <p className="text-sm text-gray-600">Authentic Products Only</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
                <h3 className="font-semibold text-gray-800">Best Prices</h3>
                <p className="text-sm text-gray-600">Lowest Price Guarantee</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlashSale;
