
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Star, Brain, TrendingUp, Heart } from 'lucide-react';

const Recommendations: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">AI Recommendations</h1>
            <p className="text-xl mb-8">Personalized picks just for you</p>
          </div>
        </section>

        {/* Recommendation Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white text-center">
                <Star className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">For You</h3>
                <p className="text-sm opacity-90">Based on your browsing history</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-white text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Trending</h3>
                <p className="text-sm opacity-90">Popular items right now</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-6 text-white text-center">
                <Heart className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Wishlist Similar</h3>
                <p className="text-sm opacity-90">Items like your favorites</p>
              </div>
            </div>

            {/* Recommended Products */}
            <h2 className="text-3xl font-bold text-center mb-12">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-2 left-2">
                      <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        AI Pick
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Recommended Item {index + 1}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.{Math.floor(Math.random() * 9 + 1)} ({Math.floor(Math.random() * 500 + 100)} reviews)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-purple-500">৳{(599 + index * 100).toLocaleString()}</span>
                      <span className="text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 30 + 70)}% match
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How AI Works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Our AI Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="font-bold text-lg mb-2">Learn Your Preferences</h3>
                <p className="text-gray-600">Our AI analyzes your browsing and purchase history</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="font-bold text-lg mb-2">Find Similar Products</h3>
                <p className="text-gray-600">Match your interests with millions of products</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="font-bold text-lg mb-2">Personalized Results</h3>
                <p className="text-gray-600">Get recommendations tailored just for you</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recommendations;
