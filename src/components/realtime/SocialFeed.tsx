import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ShoppingCart, TrendingUp, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ProductSharing } from './ProductSharing';

interface SocialFeedItem {
  id: string;
  user_id: string;
  content_type: string;
  content_data: any;
  engagement_metrics: {
    likes: number;
    comments: number;
    shares: number;
  };
  created_at: string;
  user_profile?: {
    name: string;
    avatar_url?: string;
  };
}

interface TrendingItem {
  id: string;
  name: string;
  type: 'product' | 'vendor' | 'category';
  trend_score: number;
  engagement_count: number;
  image_url?: string;
}

export const SocialFeed: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedItems, setFeedItems] = useState<SocialFeedItem[]>([]);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    fetchSocialFeed();
    fetchTrendingItems();
    setupRealtimeSubscription();
  }, []);

  const fetchSocialFeed = async () => {
    try {
      const { data, error } = await supabase
        .from('social_feeds')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedItems = (data || []).map(item => ({
        ...item,
        engagement_metrics: (item.engagement_metrics as any) || { likes: 0, comments: 0, shares: 0 },
        content_data: item.content_data || {},
        user_profile: {
          name: 'Anonymous User',
          avatar_url: undefined
        }
      }));

      setFeedItems(formattedItems);
    } catch (error) {
      console.error('Error fetching social feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingItems = async () => {
    try {
      // Mock trending data - in production, this would come from analytics
      const mockTrending: TrendingItem[] = [
        {
          id: '1',
          name: 'Cotton Sarees',
          type: 'category',
          trend_score: 95,
          engagement_count: 1250,
          image_url: '/api/placeholder/150/150'
        },
        {
          id: '2',
          name: 'Premium Electronics Store',
          type: 'vendor',
          trend_score: 88,
          engagement_count: 980,
          image_url: '/api/placeholder/150/150'
        },
        {
          id: '3',
          name: 'Wireless Headphones',
          type: 'product',
          trend_score: 82,
          engagement_count: 750,
          image_url: '/api/placeholder/150/150'
        }
      ];

      setTrendingItems(mockTrending);
    } catch (error) {
      console.error('Error fetching trending items:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('social_feed_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'social_feeds' },
        (payload) => {
          // Add new feed item to the beginning of the list
          setFeedItems(prev => [payload.new as SocialFeedItem, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleLike = async (feedId: string) => {
    try {
      await supabase.functions.invoke('social-commerce-engine', {
        body: {
          action: 'track_social_interaction',
          userId: user?.id,
          sessionId: feedId,
          interactionType: 'like',
          content: 'feed_like'
        }
      });

      // Update local state
      setFeedItems(prev => prev.map(item => 
        item.id === feedId 
          ? { 
              ...item, 
              engagement_metrics: { 
                ...item.engagement_metrics, 
                likes: item.engagement_metrics.likes + 1 
              }
            }
          : item
      ));

      toast({
        title: "Liked!",
        description: "Thanks for your reaction"
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const renderFeedItem = (item: SocialFeedItem) => {
    const { content_type, content_data, engagement_metrics, user_profile, created_at } = item;

    let content = null;

    switch (content_type) {
      case 'product_share':
        content = (
          <div className="space-y-3">
            <p className="text-sm">{user_profile?.name} shared a product</p>
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="flex gap-3">
                <img
                  src={content_data.product?.image_url || '/placeholder-product.jpg'}
                  alt={content_data.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{content_data.product?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ৳{content_data.product?.price}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      View Product
                    </Button>
                    <ProductSharing 
                      product={content_data.product}
                      trigger={
                        <Button size="sm" variant="ghost">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'live_session':
        content = (
          <div className="space-y-3">
            <p className="text-sm">{user_profile?.name} started a live shopping session</p>
            <div className="border rounded-lg p-3 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
                <span className="text-sm font-medium">{content_data.title}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {content_data.description}
              </p>
              <Button size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Join Live Session
              </Button>
            </div>
          </div>
        );
        break;

      case 'review':
        content = (
          <div className="space-y-3">
            <p className="text-sm">{user_profile?.name} wrote a review</p>
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < content_data.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{content_data.rating}/5</span>
              </div>
              <p className="text-sm">{content_data.review_text}</p>
              {content_data.product && (
                <div className="mt-3 p-2 bg-muted rounded">
                  <span className="text-xs text-muted-foreground">
                    Product: {content_data.product.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
        break;

      default:
        content = (
          <div className="space-y-3">
            <p className="text-sm">{user_profile?.name} shared an update</p>
            <p className="text-sm text-muted-foreground">
              {content_data.message || 'No additional details'}
            </p>
          </div>
        );
    }

    return (
      <Card key={item.id} className="hover-scale">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user_profile?.avatar_url} />
              <AvatarFallback>
                {user_profile?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">
                {new Date(created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {content}
          
          {/* Engagement Actions */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(item.id)}
              className="gap-2 text-muted-foreground hover:text-red-500"
            >
              <Heart className="w-4 h-4" />
              {engagement_metrics.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4" />
              {engagement_metrics.comments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-4 h-4" />
              {engagement_metrics.shares}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTrendingItem = (item: TrendingItem) => (
    <Card key={item.id} className="hover-scale cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={item.image_url || '/placeholder-image.jpg'}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm">{item.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {item.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item.engagement_count} interactions
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              {item.trend_score}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Social Feed</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <div className="max-w-2xl mx-auto">
            {feedItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No posts yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share something with the community!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {feedItems.map(renderFeedItem)}
                </div>
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">Trending Now</h2>
            </div>
            
            <div className="space-y-3">
              {trendingItems.map(renderTrendingItem)}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};