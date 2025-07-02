import React, { useState, useEffect, useRef } from 'react';
import { Play, Users, Heart, MessageCircle, Share2, ShoppingCart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LiveShoppingProps {
  sessionId?: string;
  isHost?: boolean;
}

interface LiveSession {
  id: string;
  title: string;
  description: string;
  host_id: string;
  stream_url: string;
  viewer_count: number;
  status: string;
  interaction_metrics: {
    likes: number;
    comments: number;
    shares: number;
    purchases: number;
  };
  monetization_data: {
    featured_products: Array<{
      product_id: string;
      featured_at: string;
      special_price: number;
    }>;
  };
}

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  timestamp: string;
  user_name: string;
}

export const LiveShopping: React.FC<LiveShoppingProps> = ({ sessionId, isHost = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
      setupRealtimeSubscription();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('live-shopping-service', {
        body: { 
          action: 'get_sessions',
          userId: user?.id 
        }
      });

      if (error) throw error;
      
      const sessionData = data.data.find((s: LiveSession) => s.id === sessionId);
      if (sessionData) {
        setSession(sessionData);
        setFeaturedProducts(sessionData.monetization_data.featured_products || []);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      toast({
        title: "Error",
        description: "Failed to load live session",
        variant: "destructive"
      });
    }
  };

  const setupRealtimeSubscription = () => {
    if (!sessionId || !user) return;

    channelRef.current = supabase
      .channel(`live_session_${sessionId}`)
      .on('broadcast', { event: 'user_joined' }, (payload) => {
        setSession(prev => prev ? { ...prev, viewer_count: payload.payload.viewer_count } : null);
      })
      .on('broadcast', { event: 'interaction' }, (payload) => {
        const { interaction_type, metrics } = payload.payload;
        setSession(prev => prev ? { ...prev, interaction_metrics: metrics } : null);
      })
      .on('broadcast', { event: 'product_featured' }, (payload) => {
        setFeaturedProducts(prev => [...prev, payload.payload.product]);
      })
      .on('broadcast', { event: 'chat_message' }, (payload) => {
        setChatMessages(prev => [...prev, payload.payload]);
      })
      .subscribe();

    // Join session
    if (!isHost) {
      joinSession();
    }
  };

  const joinSession = async () => {
    try {
      await supabase.functions.invoke('live-shopping-service', {
        body: {
          action: 'join_session',
          sessionId,
          userId: user?.id
        }
      });
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;

    try {
      await supabase.functions.invoke('live-shopping-service', {
        body: {
          action: 'interact',
          sessionId,
          userId: user?.id,
          interactionType: 'likes',
          interactionData: { timestamp: new Date().toISOString() }
        }
      });

      setHasLiked(true);
      toast({
        title: "Liked!",
        description: "Thanks for your reaction"
      });
    } catch (error) {
      console.error('Error liking session:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        id: crypto.randomUUID(),
        user_id: user?.id,
        message: newMessage,
        timestamp: new Date().toISOString(),
        user_name: user?.email?.split('@')[0] || 'Anonymous'
      };

      // Broadcast message via realtime
      await supabase
        .channel(`live_session_${sessionId}`)
        .send({
          type: 'broadcast',
          event: 'chat_message',
          payload: messageData
        });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: session?.title,
          text: `Join this live shopping session: ${session?.title}`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Share link copied to clipboard"
        });
      }

      // Track share interaction
      await supabase.functions.invoke('live-shopping-service', {
        body: {
          action: 'interact',
          sessionId,
          userId: user?.id,
          interactionType: 'shares',
          interactionData: { timestamp: new Date().toISOString() }
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const startLiveStream = async () => {
    if (!isHost) return;

    try {
      // In production, integrate with streaming service (Agora, Twilio, etc.)
      setIsLive(true);
      
      await supabase
        .from('live_shopping_sessions')
        .update({ status: 'live' })
        .eq('id', sessionId);

      toast({
        title: "Live Stream Started",
        description: "You are now live!"
      });
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls={!isHost}
                    autoPlay={isLive}
                    muted={isHost}
                  >
                    <source src={session.stream_url} type="video/mp4" />
                  </video>
                  
                  {/* Live Badge */}
                  {isLive && (
                    <Badge className="absolute top-4 left-4 bg-red-500 animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      LIVE
                    </Badge>
                  )}

                  {/* Viewer Count */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {session.viewer_count}
                  </div>

                  {/* Host Controls */}
                  {isHost && !isLive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button onClick={startLiveStream} size="lg" className="gap-2">
                        <Play className="w-5 h-5" />
                        Start Live Stream
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{session.title}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={hasLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      disabled={hasLiked}
                      className="gap-2"
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                      {session.interaction_metrics.likes}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{session.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {session.interaction_metrics.comments} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    {session.interaction_metrics.shares} shares
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    {session.interaction_metrics.purchases} purchases
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Featured Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {featuredProducts.map((product, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <img
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-primary font-bold">৳{product.special_price}</p>
                        <Button size="sm" className="w-full">
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="space-y-4">
            <Card className="h-[500px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {message.user_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{message.user_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm break-words">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    />
                    <Button onClick={sendChatMessage} size="sm">
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};