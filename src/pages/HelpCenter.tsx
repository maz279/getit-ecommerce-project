
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageSquare, Phone, Mail, HelpCircle, ShoppingCart, Truck, CreditCard, Users } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: ShoppingCart,
      title: 'Orders & Shopping',
      topics: ['How to place an order', 'Modify or cancel order', 'Order status', 'Payment methods']
    },
    {
      icon: Truck,
      title: 'Delivery & Shipping',
      topics: ['Delivery options', 'Shipping charges', 'Track your order', 'Delivery areas']
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      topics: ['Payment methods', 'Refund process', 'Payment security', 'EMI options']
    },
    {
      icon: Users,
      title: 'Account & Profile',
      topics: ['Create account', 'Profile settings', 'Password reset', 'Account security']
    }
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by entering your order number and phone number on our Track Order page.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, mobile banking (bKash, Nagad, Rocket), and cash on delivery.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 1-3 business days in Dhaka and 3-7 business days outside Dhaka.'
    },
    {
      question: 'Can I return a product?',
      answer: 'Yes, you can return most products within 7 days of delivery. Please check our return policy for details.'
    }
  ];

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to your questions or get in touch with our support team</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help topics..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">24/7 Customer Support</p>
            <a href="tel:16263" className="text-blue-600 font-medium text-xl">16263</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-3">Get instant help</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Start Chat
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">We'll respond within 24 hours</p>
            <a href="mailto:support@getit.com.bd" className="text-purple-600 font-medium">
              support@getit.com.bd
            </a>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <category.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.topics.map((topic, topicIndex) => (
                    <li key={topicIndex}>
                      <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left">
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
