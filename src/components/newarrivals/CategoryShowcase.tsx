
import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const categories = [
    {
      name: "📱 Electronics",
      newCount: 156,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "👕 Fashion",
      newCount: 234,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      name: "🏠 Home & Living",
      newCount: 89,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      gradient: "from-green-500 to-teal-500"
    },
    {
      name: "💄 Beauty",
      newCount: 167,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "🎮 Gaming",
      newCount: 78,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      name: "🏃 Sports",
      newCount: 123,
      image: "https://images.unsplash.com/photo-1571019613540-996a8c044e55?w=400&h=300&fit=crop",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🛍️ Shop New Arrivals by Category</h2>
          <p className="text-gray-600 text-lg">Discover the latest products in every category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} bg-opacity-80 group-hover:bg-opacity-70 transition-all`}></div>
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{category.newCount} New</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Explore Collection</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
