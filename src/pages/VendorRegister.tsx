
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Store, Users, TrendingUp, Shield } from 'lucide-react';

const VendorRegister: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Become a GETIT Vendor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join Bangladesh's fastest-growing marketplace and grow your business
          </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Store className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Setup</h3>
              <p className="text-gray-600">Get your store online in minutes with our simple onboarding process</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Millions of Customers</h3>
              <p className="text-gray-600">Reach millions of active buyers across Bangladesh</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Grow Your Sales</h3>
              <p className="text-gray-600">Increase your revenue with our marketing tools and analytics</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Start Your Journey</h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact person name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Category *
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select business category</option>
                <option value="electronics">Electronics & Gadgets</option>
                <option value="fashion">Fashion & Clothing</option>
                <option value="home">Home & Living</option>
                <option value="beauty">Health & Beauty</option>
                <option value="groceries">Food & Groceries</option>
                <option value="books">Books & Stationery</option>
                <option value="sports">Sports & Outdoor</option>
                <option value="handicrafts">Handicrafts & Traditional</option>
                <option value="automotive">Automotive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade License Number (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter trade license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter complete business address"
              ></textarea>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
