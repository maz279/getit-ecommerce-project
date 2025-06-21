
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Truck, Star, Globe, DollarSign } from 'lucide-react';

const stats = [
  { label: "Active Customers", value: "2M+", icon: Users },
  { label: "Vendors", value: "5K+", icon: Award },
  { label: "Daily Orders", value: "50K+", icon: Truck },
  { label: "Rating", value: "4.8/5", icon: Star },
  { label: "Districts", value: "64", icon: Globe },
  { label: "Sales", value: "৳500Cr+", icon: DollarSign }
];

export const VendorHeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Scroll to the vendor onboarding section
    const vendorSection = document.getElementById('vendor-onboarding');
    if (vendorSection) {
      vendorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          🚀 Become a GetIt Partner
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Join Bangladesh's fastest growing marketplace
        </p>
        <p className="text-gray-500 mb-6">
          🇧🇩 Already 5,000+ successful vendors serving millions across Bangladesh
        </p>
        
        <Button 
          size="lg" 
          className="mb-6 text-lg py-3 px-8"
          onClick={handleStartJourney}
        >
          🏪 Start Your Business Journey
        </Button>
        
        <div className="bg-blue-50 p-3 rounded-lg inline-block mb-6">
          <p className="text-blue-800 font-medium">⭐ "GetIt changed my business completely" - Rashida Khan</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-3">
              <CardContent className="pt-3">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
