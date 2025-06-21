
import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Store, User, Mail, Phone, MapPin, FileText, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vendor registration:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Store className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Become a GetIt Vendor</h1>
            <p className="text-xl mb-8">Join Bangladesh's largest marketplace and grow your business</p>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10M+</div>
                  <p className="text-sm">Active Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50K+</div>
                  <p className="text-sm">Successful Vendors</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">৳500Cr+</div>
                  <p className="text-sm">Monthly Sales Volume</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Sell on GetIt?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-3">Reach Millions</h3>
                <p className="text-gray-600">Access to 10+ million active customers across Bangladesh</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-3">Easy Setup</h3>
                <p className="text-gray-600">Start selling in minutes with our simple onboarding process</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-3">Marketing Support</h3>
                <p className="text-gray-600">Get featured in campaigns and promotional activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Start Your Vendor Journey</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Store className="w-4 h-4 inline mr-2" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Business Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Business Type</option>
                    <option value="retailer">Retailer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Business Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about your business..."
                  />
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold px-8 py-4 rounded-full text-lg hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Submit Application
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  Already have an account? <Link to="/auth/login" className="text-green-600 hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VendorRegister;
