import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChatRoom, ChatMessage, UserPresence } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeChat = (roomId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);

  // Load chat rooms
  const loadRooms = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load messages for a room
  const loadMessages = useCallback(async (targetRoomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', targetRoomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      
      // Type assertion for the messages data
      const messagesWithUser = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file',
        metadata: (typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata) || {},
        user: {
          id: msg.user_id,
          email: 'unknown@example.com',
          full_name: 'Unknown User'
        }
      })) as ChatMessage[];
      
      setMessages(messagesWithUser);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load online users for a room
  const loadOnlineUsers = useCallback(async (targetRoomId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('room_id', targetRoomId)
        .eq('status', 'online');

      if (error) throw error;
      
      // Type assertion for the presence data
      const presenceWithUser = (data || []).map(presence => ({
        ...presence,
        status: presence.status as 'online' | 'offline' | 'away',
        metadata: (typeof presence.metadata === 'string' ? JSON.parse(presence.metadata) : presence.metadata) || {},
        user: {
          id: presence.user_id,
          email: 'unknown@example.com',
          full_name: 'Unknown User'
        }
      })) as UserPresence[];
      
      setOnlineUsers(presenceWithUser);
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (messageText: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (!user || !currentRoom || !messageText.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: currentRoom.id,
          user_id: user.id,
          message_text: messageText.trim(),
          message_type: messageType,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [user, currentRoom, toast]);

  // Update user presence
  const updatePresence = useCallback(async (status: 'online' | 'offline' | 'away', targetRoomId?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          room_id: targetRoomId || currentRoom?.id,
          status,
          last_seen: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user, currentRoom]);

  // Join a room
  const joinRoom = useCallback(async (room: ChatRoom) => {
    setCurrentRoom(room);
    await loadMessages(room.id);
    await loadOnlineUsers(room.id);
    await updatePresence('online', room.id);
  }, [loadMessages, loadOnlineUsers, updatePresence]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const messagesChannel = supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: roomId ? `room_id=eq.${roomId}` : undefined,
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          const messageWithUser: ChatMessage = {
            ...newMessage,
            message_type: newMessage.message_type as 'text' | 'image' | 'file',
            metadata: (typeof newMessage.metadata === 'string' ? JSON.parse(newMessage.metadata) : newMessage.metadata) || {},
            user: {
              id: newMessage.user_id,
              email: 'unknown@example.com',
              full_name: 'Unknown User'
            }
          };

          setMessages(prev => [...prev, messageWithUser]);
        }
      )
      .subscribe();

    const presenceChannel = supabase
      .channel('user_presence_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: roomId ? `room_id=eq.${roomId}` : undefined,
        },
        () => {
          // Reload online users when presence changes
          if (currentRoom) {
            loadOnlineUsers(currentRoom.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [user, roomId, currentRoom, loadOnlineUsers]);

  // Update presence on window events
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online');
      }
    };

    const handleBeforeUnload = () => {
      updatePresence('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Set online when component mounts
    updatePresence('online');

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updatePresence('offline');
    };
  }, [user, updatePresence]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadRooms();
      setLoading(false);
    };

    if (user) {
      initialize();
    }
  }, [user, loadRooms]);

  return {
    rooms,
    messages,
    onlineUsers,
    currentRoom,
    loading,
    sendMessage,
    joinRoom,
    updatePresence,
    loadRooms,
  };
};