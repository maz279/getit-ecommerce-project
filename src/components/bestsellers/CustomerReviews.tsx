
import React from 'react';
import { Star, ThumbsUp, Verified } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Raihan Ahmed',
      rating: 5,
      comment: 'Amazing quality! Got my iPhone within 2 days. Highly recommended!',
      product: 'iPhone 15 Pro',
      verified: true,
      helpful: 24,
      avatar: '/placeholder.svg'
    },
    {
      name: 'Fatima Khan',
      rating: 5,
      comment: 'Best prices in Bangladesh. Authentic products and fast delivery.',
      product: 'Samsung Galaxy S24',
      verified: true,
      helpful: 18,
      avatar: '/placeholder.svg'
    },
    {
      name: 'Mohammad Hasan',
      rating: 4,
      comment: 'Great shopping experience. Customer service is excellent!',
      product: 'MacBook Air M2',
      verified: true,
      helpful: 31,
      avatar: '/placeholder.svg'
    }
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">⭐ What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg font-bold">4.8/5</span>
          </div>
          <p className="text-gray-600 text-sm">Based on 25,000+ verified reviews</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{review.name}</h4>
                    {review.verified && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        <Verified className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-2 text-sm">"{review.comment}"</p>
              
              <div className="text-xs text-gray-500 mb-2">
                Product: <span className="font-medium">{review.product}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({review.helpful})
                </button>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
