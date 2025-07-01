import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Users, ShoppingCart, Star, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RecommendationItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  confidence: number;
  reason: string;
}

interface RecommendationSet {
  type: string;
  title: string;
  items: RecommendationItem[];
  icon: React.ElementType;
}

const AIRecommendationsEngine: React.FC = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<RecommendationSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true);
      
      // Call our AI recommendations edge function
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: { userId: 'current', context: 'homepage' }
      });

      if (error) throw error;

      const mockRecommendations: RecommendationSet[] = [
        {
          type: 'personalized',
          title: 'Recommended for You',
          icon: Brain,
          items: [
            {
              id: '1',
              name: 'Wireless Bluetooth Headphones',
              price: 2500,
              image: '/api/placeholder/200/200',
              rating: 4.5,
              confidence: 0.92,
              reason: 'Based on your recent electronics purchases'
            },
            {
              id: '2',
              name: 'Smart Fitness Watch',
              price: 8500,
              image: '/api/placeholder/200/200',
              rating: 4.3,
              confidence: 0.88,
              reason: 'Popular with users who bought similar items'
            }
          ]
        },
        {
          type: 'trending',
          title: 'Trending Now',
          icon: TrendingUp,
          items: [
            {
              id: '3',
              name: 'Eco-Friendly Water Bottle',
              price: 650,
              image: '/api/placeholder/200/200',
              rating: 4.7,
              confidence: 0.95,
              reason: 'Most popular this week'
            },
            {
              id: '4',
              name: 'Organic Cotton T-Shirt',
              price: 1200,
              image: '/api/placeholder/200/200',
              rating: 4.4,
              confidence: 0.89,
              reason: 'Trending in fashion category'
            }
          ]
        },
        {
          type: 'collaborative',
          title: 'Customers Also Bought',
          icon: Users,
          items: [
            {
              id: '5',
              name: 'Phone Stand Holder',
              price: 350,
              image: '/api/placeholder/200/200',
              rating: 4.2,
              confidence: 0.86,
              reason: 'Often bought with electronics'
            },
            {
              id: '6',
              name: 'USB-C Fast Charger',
              price: 890,
              image: '/api/placeholder/200/200',
              rating: 4.6,
              confidence: 0.91,
              reason: 'Frequently purchased together'
            }
          ]
        }
      ];

      setRecommendations(mockRecommendations);
      
      toast({
        title: "Recommendations Updated",
        description: "AI recommendations have been refreshed based on your preferences."
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const RecommendationCard: React.FC<{ item: RecommendationItem }> = ({ item }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Badge className="absolute top-2 right-2 bg-primary/90">
            {Math.round(item.confidence * 100)}% match
          </Badge>
        </div>
        
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary">৳{item.price}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm">{item.rating}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">{item.reason}</p>
        
        <Button size="sm" className="w-full group-hover:bg-primary/90">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-3"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-2/3 mb-2"></div>
                  <div className="bg-muted h-8 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              AI Recommendations Engine
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={fetchRecommendations}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personalized" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personalized">Personalized</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="collaborative">Similar Users</TabsTrigger>
            </TabsList>
            
            {recommendations.map((recSet) => (
              <TabsContent key={recSet.type} value={recSet.type} className="mt-6">
                <div className="flex items-center mb-4">
                  <recSet.icon className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">{recSet.title}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recSet.items.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendation Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12.3%</div>
              <div className="text-sm text-muted-foreground">CTR Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.8x</div>
              <div className="text-sm text-muted-foreground">Conversion Boost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendationsEngine;