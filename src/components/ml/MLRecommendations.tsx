
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, Sparkles, ShoppingCart, Heart } from 'lucide-react';
import { recommendationEngine, MLRecommendation } from '@/services/ml/RecommendationEngine';

interface MLRecommendationsProps {
  userId?: string;
  context?: any;
  maxItems?: number;
}

export const MLRecommendations: React.FC<MLRecommendationsProps> = ({
  userId = 'anonymous',
  context = {},
  maxItems = 8
}) => {
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [userId, context]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading ML recommendations for user:', userId);
      const recs = await recommendationEngine.generateRecommendations(userId, context);
      setRecommendations(recs.slice(0, maxItems));
      
    } catch (err) {
      console.error('Error loading ML recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = async (recommendation: MLRecommendation, action: string) => {
    console.log('ML Recommendation interaction:', { recommendation: recommendation.id, action });
    
    // Track user interaction for ML learning
    await recommendationEngine.updateRecommendations(userId, action, {
      productId: recommendation.id,
      type: recommendation.type,
      confidence: recommendation.confidence
    });
    
    if (action === 'view') {
      // Navigate to product page
      console.log('Navigating to product:', recommendation.id);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.75) return 'bg-blue-100 text-blue-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          <h2 className="text-xl font-bold">AI Recommendations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <Brain className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
          <Button onClick={loadRecommendations} className="mt-2">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
            <p className="text-gray-600 text-sm">Personalized just for you using machine learning</p>
          </div>
        </div>
        
        <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
          <Sparkles className="w-4 h-4 mr-1" />
          ML Enhanced
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleInteraction(recommendation, 'view')}
          >
            {recommendation.image && (
              <div className="relative">
                <img
                  src={recommendation.image}
                  alt={recommendation.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getConfidenceColor(recommendation.confidence)}>
                    {Math.round(recommendation.confidence * 100)}%
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-purple-500 text-white">
                    <Target className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="p-3">
              <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                {recommendation.title}
              </h3>
              
              <p className="text-xs text-blue-600 mb-2 line-clamp-2">
                {recommendation.reason}
              </p>
              
              {recommendation.price && (
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-green-600">
                    ৳{recommendation.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-500">
                      ML Score: {recommendation.mlScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInteraction(recommendation, 'add_to_cart');
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInteraction(recommendation, 'wishlist');
                  }}
                >
                  <Heart className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="outline" onClick={loadRecommendations}>
          <Brain className="w-4 h-4 mr-2" />
          Refresh AI Recommendations
        </Button>
      </div>
    </Card>
  );
};
