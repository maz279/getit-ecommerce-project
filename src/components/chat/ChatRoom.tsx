import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Circle } from 'lucide-react';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ChatRoomProps {
  roomId?: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const { user } = useAuth();
  const {
    rooms,
    messages,
    onlineUsers,
    currentRoom,
    loading,
    sendMessage,
    joinRoom,
  } = useRealtimeChat(roomId);

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-join first room if no room specified
  useEffect(() => {
    if (!currentRoom && rooms.length > 0 && !roomId) {
      joinRoom(rooms[0]);
    } else if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        joinRoom(room);
      }
    }
  }, [rooms, currentRoom, roomId, joinRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      await sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!user) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Please log in to access chat</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading chat...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-full max-h-[600px] gap-4">
      {/* Room List */}
      <Card className="w-1/4 min-w-[200px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat Rooms</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-2">
              {rooms.map((room) => (
                <Button
                  key={room.id}
                  variant={currentRoom?.id === room.id ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => joinRoom(room)}
                >
                  <div className="flex flex-col items-start w-full">
                    <span className="font-medium">{room.name}</span>
                    {room.description && (
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {room.description}
                      </span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {currentRoom?.name || 'Select a room'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Badge variant="secondary">{onlineUsers.length} online</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {/* Messages */}
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4 p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.user_id === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.user_id === user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.user_id !== user.id && (
                      <div className="text-xs font-medium mb-1">
                        {message.user?.full_name || message.user?.email || 'Unknown User'}
                      </div>
                    )}
                    <div className="text-sm">{message.message_text}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!currentRoom}
            />
            <Button type="submit" disabled={!currentRoom || !messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Online Users */}
      <Card className="w-1/4 min-w-[200px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Online Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-2">
              {onlineUsers.map((presence) => (
                <div key={presence.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                  <Circle
                    className={`h-3 w-3 fill-current ${getStatusColor(presence.status)}`}
                  />
                  <span className="text-sm">
                    {presence.user?.full_name || presence.user?.email || 'Unknown User'}
                  </span>
                </div>
              ))}
              {onlineUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users online
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};