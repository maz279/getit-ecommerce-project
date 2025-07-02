import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AIRecommendationsProps {
  userId?: string;
  recommendationType?: 'product' | 'vendor' | 'cross_sell';
  limit?: number;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  userId,
  recommendationType = 'product',
  limit = 6
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, recommendationType]);

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendation-engine', {
        body: {
          userId,
          recommendationType,
          limit
        }
      });

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-32 rounded-lg mb-2"></div>
                <div className="bg-muted h-4 rounded mb-1"></div>
                <div className="bg-muted h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {recommendationType === 'product' && 'Recommended for You'}
          {recommendationType === 'vendor' && 'Top Vendors'}
          {recommendationType === 'cross_sell' && 'You might also like'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted rounded-lg mb-3 relative overflow-hidden">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <Badge className="absolute top-2 right-2 bg-primary text-white">
                  {Math.round((item.confidence_score || 0.5) * 100)}% match
                </Badge>
              </div>
              
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
              
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {item.rating || 4.5} ({item.review_count || 12})
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-primary">
                  ৳{item.price?.toLocaleString() || '999'}
                </span>
                {item.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ৳{item.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {item.reason || 'Recommended based on your preferences'}
              </p>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations available yet</p>
            <p className="text-sm">Browse some products to get personalized suggestions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};