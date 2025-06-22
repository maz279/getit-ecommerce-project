
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ShoppingBag } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: "Sarah Ahmed",
      location: "Dhaka",
      rating: 5,
      review: "Amazing mega sale! Got my iPhone at 40% off. Delivery was super fast and packaging was perfect.",
      product: "iPhone 15 Pro",
      verified: true,
      helpful: 24
    },
    {
      name: "Rafiq Hassan",
      location: "Chittagong",
      rating: 5,
      review: "Best deals ever! Bought laptop, watch, and headphones. Saved over ৳50,000 in total!",
      product: "MacBook Air + Apple Watch",
      verified: true,
      helpful: 18
    },
    {
      name: "Fatima Khan",
      location: "Sylhet",
      rating: 4,
      review: "Great discounts on fashion items. Quality is excellent and customer service is very responsive.",
      product: "Fashion Collection",
      verified: true,
      helpful: 12
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">⭐ What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Real reviews from verified buyers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4 italic">"{review.review}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{review.product}</span>
                    {review.verified && (
                      <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful}</span>
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
