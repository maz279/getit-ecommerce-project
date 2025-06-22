
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, MessageCircle, Camera } from 'lucide-react';

export const GiftCardReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Fatima Rahman',
      location: 'Dhaka',
      rating: 5,
      date: '2 days ago',
      review: 'Amazing experience! Bought gift cards for Eid and everyone loved them. The variety of vendors is incredible.',
      helpful: 24,
      verified: true,
      hasPhoto: true,
      giftCard: 'Multi-vendor ৳2,000'
    },
    {
      name: 'Ahmed Hassan',
      location: 'Chittagong',
      rating: 5,
      date: '1 week ago',
      review: 'Perfect for corporate gifting. Bought 50 cards for our employees. Great bulk discount and excellent service.',
      helpful: 18,
      verified: true,
      hasPhoto: false,
      giftCard: 'Corporate Bundle'
    },
    {
      name: 'Rashida Begum',
      location: 'Sylhet',
      rating: 4,
      date: '2 weeks ago',
      review: 'Love the instant delivery feature. Sent a gift card to my daughter studying in Dhaka within minutes.',
      helpful: 15,
      verified: true,
      hasPhoto: true,
      giftCard: 'Digital ৳1,500'
    },
    {
      name: 'Mohammad Ali',
      location: 'Rajshahi',
      rating: 5,
      date: '3 weeks ago',
      review: 'Used for wedding gifts - much better than cash! Recipients could choose exactly what they wanted.',
      helpful: 31,
      verified: true,
      hasPhoto: false,
      giftCard: 'Wedding Special ৳5,000'
    }
  ];

  const reviewStats = {
    average: 4.8,
    total: 2847,
    distribution: [
      { stars: 5, count: 2156, percentage: 76 },
      { stars: 4, count: 569, percentage: 20 },
      { stars: 3, count: 85, percentage: 3 },
      { stars: 2, count: 23, percentage: 1 },
      { stars: 1, count: 14, percentage: 0 }
    ]
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">⭐ Customer Reviews & Experiences</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers say about their gift card experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <Card className="lg:col-span-1">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">{reviewStats.average}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{reviewStats.total.toLocaleString()} reviews</p>
              
              <div className="space-y-2">
                {reviewStats.distribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{item.stars}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-gray-600">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3 space-y-6">
            {reviews.map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-purple-600">{review.name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{review.location} • {review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-3">{review.review}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{review.giftCard}</Badge>
                      {review.hasPhoto && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Camera className="w-4 h-4" />
                          <span>Has photos</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="outline" className="px-8 py-3">
            View All {reviewStats.total.toLocaleString()} Reviews
          </Button>
        </div>
      </div>
    </section>
  );
};
