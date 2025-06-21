
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Gift, Star, Truck, Shield } from 'lucide-react';

const EidSale: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Eid Mubarak Sale</h1>
            <p className="text-xl mb-8">Up to 70% off on Eid Collection</p>
            <div className="flex justify-center gap-4">
              <Gift className="w-8 h-8" />
              <Star className="w-8 h-8" />
              <Gift className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Gift className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Traditional Items</h3>
                <p className="text-gray-600">Authentic Eid clothing and accessories</p>
              </div>
              <div className="text-center">
                <Star className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-gray-600">Hand-picked items from trusted vendors</p>
              </div>
              <div className="text-center">
                <Truck className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Express Delivery</h3>
                <p className="text-gray-600">Fast delivery across Bangladesh</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Quality Guarantee</h3>
                <p className="text-gray-600">100% authentic products</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Eid Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Eid Special Item {index + 1}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-500">৳{(999 + index * 100).toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">৳{(1999 + index * 200).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EidSale;
