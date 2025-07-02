import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/homepage/Footer';
import { Star, ThumbsUp, Filter, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Reviews: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
  const reviews = [
    {
      id: 1,
      userName: 'Rashida Ahmed',
      rating: 5,
      title: 'Excellent service and fast delivery!',
      content: 'I ordered a smartphone and it was delivered within 24 hours. The product quality is exactly as described. Very satisfied with GetIt service.',
      date: '2024-01-15',
      productName: 'Samsung Galaxy A54',
      verified: true,
      helpful: 23
    },
    {
      id: 2,
      userName: 'Mohammad Karim',
      rating: 4,
      title: 'Good shopping experience',
      content: 'Great variety of products and competitive prices. The website is easy to navigate. Only suggestion is to improve the search function.',
      date: '2024-01-14',
      productName: 'Cotton Panjabi',
      verified: true,
      helpful: 15
    },
    {
      id: 3,
      userName: 'Fatima Khan',
      rating: 5,
      title: 'Perfect for online shopping',
      content: 'GetIt has become my go-to platform for online shopping. Reliable delivery, good customer service, and authentic products. Highly recommended!',
      date: '2024-01-13',
      productName: 'Kitchen Appliances Set',
      verified: true,
      helpful: 31
    },
    {
      id: 4,
      userName: 'Abdul Rahman',
      rating: 4,
      title: 'Quality products, reasonable prices',
      content: 'I have been shopping here for months. Product quality is good and prices are competitive. Sometimes delivery takes a bit longer than expected.',
      date: '2024-01-12',
      productName: 'Office Chair',
      verified: false,
      helpful: 8
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 1245, percentage: 65 },
    { stars: 4, count: 432, percentage: 23 },
    { stars: 3, count: 156, percentage: 8 },
    { stars: 2, count: 45, percentage: 2 },
    { stars: 1, count: 32, percentage: 2 }
  ];

  const averageRating = 4.6;
  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Customer Reviews</h1>
          <p className="text-muted-foreground text-center">
            See what our customers are saying about their shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Rating Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.floor(averageRating))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {totalReviews.toLocaleString()} reviews
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRating(selectedRating === item.stars ? null : item.stars)}
                      className={`flex items-center gap-1 text-sm hover:text-primary transition-colors ${
                        selectedRating === item.stars ? 'text-primary font-medium' : ''
                      }`}
                    >
                      <span>{item.stars}</span>
                      <Star className="w-3 h-3" />
                    </button>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedRating(null)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Main Content - Reviews */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search reviews..." 
                    className="w-full"
                  />
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {review.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{review.userName}</h3>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-lg mb-2">{review.title}</h4>
                  <p className="text-muted-foreground mb-3">{review.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Product: <span className="font-medium">{review.productName}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline">
                Load More Reviews
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reviews;