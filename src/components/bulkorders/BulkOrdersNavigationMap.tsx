
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Calculator, FileText, Truck, Phone, Award } from 'lucide-react';

export const BulkOrdersNavigationMap: React.FC = () => {
  const navigationItems = [
    {
      title: '📦 Electronics Bulk',
      description: 'Wholesale electronics',
      link: '/categories?category=electronics&bulk=true',
      icon: '📦',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '👕 Fashion Wholesale',
      description: 'Bulk fashion items',
      link: '/categories?category=fashion&bulk=true',
      icon: '👕',
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: '🏠 Office Supplies',
      description: 'Business essentials',
      link: '/categories?category=business-industrial&bulk=true',
      icon: '🏠',
      color: 'from-green-500 to-green-600'
    },
    {
      title: '🍚 Food & Groceries',
      description: 'Bulk food items',
      link: '/categories?category=food-groceries&bulk=true',
      icon: '🍚',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: '🎁 Corporate Gifts',
      description: 'Business gifting',
      link: '/categories?category=gift-items&bulk=true',
      icon: '🎁',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: '🏭 Industrial Supplies',
      description: 'Manufacturing needs',
      link: '/categories?category=business-industrial&bulk=true',
      icon: '🏭',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  const bulkServices = [
    {
      title: 'Bulk Calculator',
      icon: <Calculator className="w-5 h-5" />,
      link: '#bulk-calculator',
      description: 'Calculate bulk pricing'
    },
    {
      title: 'Custom Quote',
      icon: <FileText className="w-5 h-5" />,
      link: '#custom-quote',
      description: 'Get personalized quotes'
    },
    {
      title: 'Logistics Support',
      icon: <Truck className="w-5 h-5" />,
      link: '#logistics',
      description: 'Delivery solutions'
    },
    {
      title: 'Account Manager',
      icon: <Phone className="w-5 h-5" />,
      link: '#account-manager',
      description: 'Dedicated support'
    }
  ];

  const handleNavigation = (link: string) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Categories Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-6">📦 Bulk Order Categories 📦</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`bg-gradient-to-r ${item.color} rounded-lg p-4 text-white text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs opacity-90">{item.description}</p>
                <ArrowRight className="w-4 h-4 mx-auto mt-2" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bulk Services */}
        <div>
          <h3 className="text-lg font-bold text-center mb-4">🛠️ Bulk Order Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bulkServices.map((service, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(service.link)}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              >
                <div className="text-blue-600 mb-2 flex justify-center">{service.icon}</div>
                <h4 className="font-semibold text-sm mb-1 text-gray-800">{service.title}</h4>
                <p className="text-xs text-gray-600">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Orders Specific Navigation */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">📦 Bulk Orders Hub 📦</h3>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => handleNavigation('#bulk-calculator')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              🧮 Price Calculator
            </button>
            <button
              onClick={() => handleNavigation('#minimum-quantities')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              📊 Minimum Orders
            </button>
            <button
              onClick={() => handleNavigation('#logistics')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              🚚 Logistics
            </button>
            <button
              onClick={() => handleNavigation('#custom-quote')}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition-colors"
            >
              💼 Custom Quotes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
