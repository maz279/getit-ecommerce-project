import React, { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, CheckCheck, MessageCircle, Users, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  message: string;
  created_at: string;
  type: 'text' | 'system';
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'support' | 'vendor' | 'general';
  participants_count: number;
  last_message?: ChatMessage;
  unread_count: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  read_at: string | null;
  metadata: any;
  created_at: string;
}

export const RealTimeCommunicationHub: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'notifications' | 'chat' | 'users'>('notifications');
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadInitialData();
    setupRealTimeSubscriptions();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load notifications
      const { data: notifData } = await notificationsApi.getNotifications({ limit: 20 });
      if (notifData?.data) {
        setNotifications(notifData.data);
      }

      // Initialize chat rooms (demo data - replace with actual API)
      setChatRooms([
        {
          id: '1',
          name: 'Customer Support',
          type: 'support',
          participants_count: 1,
          unread_count: 2,
          last_message: {
            id: '1',
            sender_id: 'support',
            sender_name: 'Support Team',
            message: 'How can we help you today?',
            created_at: new Date().toISOString(),
            type: 'text'
          }
        },
        {
          id: '2',
          name: 'General Discussion',
          type: 'general',
          participants_count: 45,
          unread_count: 0,
          last_message: {
            id: '2',
            sender_id: 'user123',
            sender_name: 'John Doe',
            message: 'Great products available!',
            created_at: new Date(Date.now() - 300000).toISOString(),
            type: 'text'
          }
        }
      ]);

    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load communication data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    if (!user) return;

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    // Subscribe to user presence for active users tracking
    const presenceChannel = supabase
      .channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat();
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        toast({
          title: "User Online",
          description: `${newPresences[0]?.name || 'Someone'} joined the platform`,
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            name: user.email?.split('@')[0] || 'Anonymous',
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(presenceChannel);
    };
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender_id: user.id,
      sender_name: user.email?.split('@')[0] || 'You',
      message: newMessage,
      created_at: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update room with latest message
    setChatRooms(prev => 
      prev.map(room => 
        room.id === selectedRoom 
          ? { ...room, last_message: message }
          : room
      )
    );

    // Here you would send the message to your real-time backend
    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    });
  }, [newMessage, selectedRoom, user]);

  const selectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    // Mark room as read
    setChatRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, unread_count: 0 }
          : room
      )
    );
    
    // Load messages for room (demo data)
    setMessages([
      {
        id: '1',
        sender_id: 'support',
        sender_name: 'Support Team',
        message: 'Hello! How can we help you today?',
        created_at: new Date(Date.now() - 600000).toISOString(),
        type: 'text'
      },
      {
        id: '2',
        sender_id: user?.id || '',
        sender_name: 'You',
        message: 'I need help with my order',
        created_at: new Date(Date.now() - 300000).toISOString(),
        type: 'text'
      }
    ]);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) return <LoadingState message="Loading communication hub..." />;
  if (error) return <ErrorState message={error} onRetry={loadInitialData} />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Real-Time Communication Hub
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('chat')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
              {chatRooms.reduce((sum, room) => sum + room.unread_count, 0) > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {chatRooms.reduce((sum, room) => sum + room.unread_count, 0)}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Online Users ({activeUsers.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-colors ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Chat Rooms List */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Chat Rooms</h3>
                {chatRooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`cursor-pointer transition-colors ${
                      selectedRoom === room.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => selectRoom(room.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{room.name}</h4>
                          {room.last_message && (
                            <p className="text-sm text-muted-foreground truncate">
                              {room.last_message.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {room.unread_count > 0 && (
                            <Badge variant="destructive">
                              {room.unread_count}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {room.participants_count} users
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-2 flex flex-col">
                {selectedRoom ? (
                  <>
                    <div className="flex-1 border rounded-lg p-4 bg-muted/20">
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender_id === user?.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background border'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <span className="text-xs opacity-70">
                                  {formatTime(message.created_at)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        Send
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a chat room to start messaging
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Online Users ({activeUsers.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeUsers.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No users currently online</p>
                  </div>
                ) : (
                  activeUsers.map((user, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{user.name || 'Anonymous'}</h4>
                            <p className="text-xs text-muted-foreground">
                              Online since {formatTime(user.online_at)}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeCommunicationHub;