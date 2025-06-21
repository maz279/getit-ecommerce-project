
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { 
  Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2, 
  Shirt, ShoppingBag, Home, Car, Baby, Heart,
  Coffee, Book, Dumbbell, Paintbrush, Music, Gift,
  Filter, Grid3X3, List, ChevronDown, Star, MapPin, Truck
} from 'lucide-react';

interface CategoryItem {
  icon: React.ReactNode;
  name: string;
  nameBn: string;
  count: number;
  color: string;
  slug: string;
  featured: boolean;
}

interface VendorInfo {
  id: string;
  name: string;
  rating: number;
  location: string;
  products: number;
  verified: boolean;
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  vendor: VendorInfo;
  image: string;
  discount?: number;
  freeShipping: boolean;
}

const categories: CategoryItem[] = [
  { icon: <Smartphone className="w-8 h-8" />, name: "Electronics", nameBn: "ইলেকট্রনিক্স", count: 2847, color: "text-blue-500", slug: "electronics", featured: true },
  { icon: <Shirt className="w-8 h-8" />, name: "Fashion", nameBn: "ফ্যাশন", count: 1923, color: "text-red-500", slug: "fashion", featured: true },
  { icon: <Home className="w-8 h-8" />, name: "Home & Garden", nameBn: "বাড়ি ও বাগান", count: 1456, color: "text-green-500", slug: "home-garden", featured: true },
  { icon: <Coffee className="w-8 h-8" />, name: "Food & Drink", nameBn: "খাদ্য ও পানীয়", count: 987, color: "text-yellow-600", slug: "food-drink", featured: false },
  { icon: <Laptop className="w-8 h-8" />, name: "Computers", nameBn: "কম্পিউটার", count: 754, color: "text-blue-600", slug: "computers", featured: true },
  { icon: <Car className="w-8 h-8" />, name: "Automotive", nameBn: "অটোমোবাইল", count: 623, color: "text-red-600", slug: "automotive", featured: false },
  { icon: <Baby className="w-8 h-8" />, name: "Baby & Kids", nameBn: "শিশু ও কিশোর", count: 445, color: "text-yellow-500", slug: "baby-kids", featured: true },
  { icon: <Dumbbell className="w-8 h-8" />, name: "Sports", nameBn: "ক্রীড়া", count: 389, color: "text-blue-700", slug: "sports", featured: false },
  { icon: <Heart className="w-8 h-8" />, name: "Health", nameBn: "স্বাস্থ্য", count: 267, color: "text-red-400", slug: "health", featured: true },
  { icon: <Book className="w-8 h-8" />, name: "Books", nameBn: "বই", count: 234, color: "text-green-600", slug: "books", featured: false },
  { icon: <Music className="w-8 h-8" />, name: "Music", nameBn: "সঙ্গীত", count: 198, color: "text-blue-400", slug: "music", featured: false },
  { icon: <Gift className="w-8 h-8" />, name: "Gifts", nameBn: "উপহার", count: 156, color: "text-green-400", slug: "gifts", featured: true },
];

// Sample product data for demonstration
const sampleProducts: ProductInfo[] = [
  {
    id: '1',
    name: 'Samsung Galaxy A54 5G',
    price: 45000,
    originalPrice: 50000,
    rating: 4.5,
    reviews: 156,
    vendor: { id: '1', name: 'Tech Zone BD', rating: 4.8, location: 'Dhaka', products: 250, verified: true },
    image: '/placeholder.svg',
    discount: 10,
    freeShipping: true
  },
  {
    id: '2',
    name: 'Cotton Punjabi for Men',
    price: 1500,
    rating: 4.2,
    reviews: 89,
    vendor: { id: '2', name: 'Fashion House', rating: 4.6, location: 'Chittagong', products: 180, verified: true },
    image: '/placeholder.svg',
    freeShipping: false
  }
];

const Categories: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCategories = selectedCategory 
    ? categories.filter(cat => cat.slug === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm breadcrumbs mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Categories</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-blue-600 font-medium capitalize">{selectedCategory.replace('-', ' ')}</span>
              </>
            )}
          </div>
        </nav>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-1/4 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">All Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.slug} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={category.color}>
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.nameBn}</div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">({category.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range (৳)</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              {/* Vendor Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Vendor Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Verified Vendors</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Top Rated</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Local Vendors</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Location</h4>
                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option>All Bangladesh</option>
                  <option>Dhaka</option>
                  <option>Chittagong</option>
                  <option>Sylhet</option>
                  <option>Rajshahi</option>
                  <option>Khulna</option>
                  <option>Barisal</option>
                  <option>Rangpur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedCategory ? `${selectedCategory.replace('-', ' ')} Products` : 'All Categories'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {selectedCategory 
                      ? `Discover amazing ${selectedCategory.replace('-', ' ')} products from trusted vendors across Bangladesh`
                      : 'Explore all product categories from verified vendors across Bangladesh'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredCategories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Products Available</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Grid or Product Results */}
            {!selectedCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.slug} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`${category.color} p-3 bg-gray-50 rounded-lg`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
                        <p className="text-gray-600 text-sm">{category.nameBn}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{category.count.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Products Available</div>
                      </div>
                      {category.featured && (
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Browse Products
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Product Results */
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {sampleProducts.map((product) => (
                  <div key={product.id} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'}`}>
                    <div className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square mb-4'}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-blue-600 font-medium">{product.vendor.name}</span>
                        {product.vendor.verified && (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Verified</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-800">৳{product.price.toLocaleString()}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          {product.discount && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              {product.discount}% OFF
                            </span>
                          )}
                          {product.freeShipping && (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <Truck className="w-3 h-3" />
                              <span>Free Shipping</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
