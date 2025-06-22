
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const SuccessStoriesSection: React.FC = () => {
  const stories = [
    {
      name: "Sarah Ahmed",
      location: "Dhaka",
      product: "iPhone 14 Pro",
      savings: "৳35,000",
      rating: 5,
      review: "Amazing experience! Saved so much money buying with 20 other people. The process was smooth and delivery was quick.",
      avatar: "👩‍💼"
    },
    {
      name: "Rahman Khan", 
      location: "Chittagong",
      product: "Samsung Smart TV",
      savings: "৫২২,০০০",
      rating: 5,
      review: "I was skeptical at first, but group buying really works! Got a 55-inch TV for almost half the original price.",
      avatar: "👨‍🔧"
    },
    {
      name: "Fatima Islam",
      location: "Sylhet", 
      product: "Kitchen Appliance Set",
      savings: "৳15,000",
      rating: 5,
      review: "Perfect for families! We organized a group with our neighbors and everyone saved money on kitchen essentials.",
      avatar: "👩‍🍳"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">💬 Success Stories</h2>
          <p className="text-xl text-gray-600">Hear from our satisfied group buyers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">{story.avatar}</div>
                  <div>
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-gray-600">{story.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{story.review}"</p>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product: {story.product}</span>
                    <span className="font-bold text-green-600">Saved: {story.savings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
