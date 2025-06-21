
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const TrackOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your shipment</p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number *
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your order number (e.g., GT123456789)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your registered phone number"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Sample Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Order #GT123456789</span>
              <span className="text-sm text-green-600 font-medium">Out for Delivery</span>
            </div>
            <div className="text-sm text-gray-500">Expected delivery: Today by 8:00 PM</div>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              {/* Order Confirmed */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">Order Confirmed</span>
                <span className="text-xs text-gray-500">Dec 20, 10:30 AM</span>
              </div>

              {/* Processing */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">Processing</span>
                <span className="text-xs text-gray-500">Dec 20, 2:15 PM</span>
              </div>

              {/* Shipped */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">Shipped</span>
                <span className="text-xs text-gray-500">Dec 21, 9:00 AM</span>
              </div>

              {/* Out for Delivery */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">Out for Delivery</span>
                <span className="text-xs text-gray-500">Dec 21, 4:30 PM</span>
              </div>

              {/* Delivered */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Delivered</span>
                <span className="text-xs text-gray-400">Pending</span>
              </div>
            </div>

            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
              <div className="h-full bg-green-500 w-3/4"></div>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img 
                  src="/placeholder.svg" 
                  alt="Product" 
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Samsung Galaxy A54 5G</h4>
                  <p className="text-sm text-gray-600">Color: Black, Storage: 128GB</p>
                  <p className="text-sm font-medium text-gray-800">৳35,999 × 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
