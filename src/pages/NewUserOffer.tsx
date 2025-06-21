
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Gift, CheckCircle, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewUserOffer: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="mb-8">
              <Gift className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to GetIt!</h1>
              <p className="text-xl mb-8">Get ৳200 off on your first purchase</p>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">New User Special Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>৳200 instant discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Free delivery on first order</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Priority customer support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Access to member-only sales</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link 
                to="/auth/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-4 rounded-full text-lg hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg inline-block"
              >
                Sign Up & Claim Offer
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How to Claim Your Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="font-bold text-lg mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your GetIt account with email or phone number</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="font-bold text-lg mb-2">Shop</h3>
                <p className="text-gray-600">Add items worth ৳500 or more to your cart</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="font-bold text-lg mb-2">Save</h3>
                <p className="text-gray-600">Automatic ৳200 discount applied at checkout</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
                <p className="text-gray-600">Happy New Users</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">৳2Cr+</div>
                <p className="text-gray-600">Savings Generated</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">4.8★</div>
                <p className="text-gray-600">User Rating</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewUserOffer;
