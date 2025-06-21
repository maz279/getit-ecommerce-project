
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { CreditCard, Shield, Zap, Gift } from 'lucide-react';

const MobileBanking: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Mobile Banking Bonus</h1>
            <p className="text-xl mb-8">Get 5% cashback with bKash, Nagad & Rocket payments</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                <div className="w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">bK</span>
                </div>
                <h3 className="font-bold text-lg mb-2">bKash</h3>
                <p className="text-sm opacity-90">5% cashback on all payments</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Nagad</h3>
                <p className="text-sm opacity-90">5% cashback on all payments</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Rocket</h3>
                <p className="text-sm opacity-90">5% cashback on all payments</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Mobile Banking?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Zap className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Instant Payment</h3>
                <p className="text-gray-600">Process payments in seconds</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">100% Secure</h3>
                <p className="text-gray-600">Bank-level security for all transactions</p>
              </div>
              <div className="text-center">
                <Gift className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Cashback Rewards</h3>
                <p className="text-gray-600">Earn money back on every purchase</p>
              </div>
              <div className="text-center">
                <CreditCard className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">No Hidden Fees</h3>
                <p className="text-gray-600">Transparent pricing, no surprises</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Pay */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How to Pay with Mobile Banking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="font-bold text-lg mb-2">Select Items</h3>
                <p className="text-gray-600">Add your favorite products to cart</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="font-bold text-lg mb-2">Choose Payment</h3>
                <p className="text-gray-600">Select bKash, Nagad, or Rocket at checkout</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="font-bold text-lg mb-2">Get Cashback</h3>
                <p className="text-gray-600">Receive 5% cashback instantly</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileBanking;
