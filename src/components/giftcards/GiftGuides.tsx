
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Briefcase, GraduationCap } from 'lucide-react';

export const GiftGuides: React.FC = () => {
  const giftGuides = [
    {
      title: 'For Her',
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      description: 'Beautiful gifts that will make her smile',
      items: ['Fashion & Beauty', 'Jewelry & Accessories', 'Home Décor', 'Wellness Products'],
      color: 'bg-pink-50 border-pink-200',
      buttonColor: 'bg-pink-600 hover:bg-pink-700',
      popular: true
    },
    {
      title: 'For Him',
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      description: 'Practical and stylish gifts for the modern man',
      items: ['Electronics & Gadgets', 'Fashion & Grooming', 'Sports Equipment', 'Professional Tools'],
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: false
    },
    {
      title: 'For Students',
      icon: <GraduationCap className="w-8 h-8 text-green-600" />,
      description: 'Educational and practical gifts for learners',
      items: ['Books & Stationery', 'Tech Accessories', 'Study Equipment', 'Educational Tools'],
      color: 'bg-green-50 border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      popular: true
    },
    {
      title: 'For Family',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      description: 'Perfect gifts to bring families together',
      items: ['Home Appliances', 'Family Games', 'Kitchen Essentials', 'Shared Experiences'],
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  const seasonalGuides = [
    { season: 'Eid Special', emoji: '🌙', color: 'bg-emerald-100 text-emerald-800' },
    { season: 'Wedding Season', emoji: '💒', color: 'bg-rose-100 text-rose-800' },
    { season: 'Winter Collection', emoji: '❄️', color: 'bg-sky-100 text-sky-800' },
    { season: 'Back to School', emoji: '🎒', color: 'bg-amber-100 text-amber-800' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎯 Gift Guides & Inspiration</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect gift for every person and occasion with our curated guides
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {giftGuides.map((guide, index) => (
            <Card key={index} className={`${guide.color} hover:shadow-lg transition-all duration-300 relative`}>
              {guide.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                  Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  {guide.icon}
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
                <p className="text-sm text-gray-600">{guide.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-6">
                  {guide.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button className={`w-full ${guide.buttonColor}`}>
                  Explore Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-6">🎪 Seasonal Gift Collections</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {seasonalGuides.map((season, index) => (
                <Card key={index} className="bg-white text-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{season.emoji}</div>
                    <Badge className={season.color}>{season.season}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                View All Seasonal Collections
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
