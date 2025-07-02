import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'customer' | 'agent';
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  metadata: any;
  created_at: string;
}

interface ChatSession {
  id: string;
  customer_id: string;
  agent_id?: string;
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  department?: string;
  started_at?: string;
  ended_at?: string;
}

export function LiveChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChatSession = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('live-chat-service', {
        body: {
          action: 'start_session',
          customer_id: user.id,
          priority: 'medium',
          department: 'general'
        }
      });

      if (data?.session) {
        setSession(data.session);
        loadMessages(data.session.id);
      }
    } catch (error) {
      console.error('Error starting chat session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data } = await supabase.functions.invoke('live-chat-service', {
        body: {
          action: 'get_messages',
          session_id: sessionId
        }
      });

      if (data?.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !user) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      await supabase.functions.invoke('live-chat-service', {
        body: {
          action: 'send_message',
          session_id: session.id,
          sender_type: 'customer',
          sender_id: user.id,
          message: messageText,
          message_type: 'text'
        }
      });

      // Optimistically add message
      const tempMessage: ChatMessage = {
        id: 'temp-' + Date.now(),
        session_id: session.id,
        sender_type: 'customer',
        sender_id: user.id,
        message: messageText,
        message_type: 'text',
        metadata: {},
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, tempMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endSession = async () => {
    if (!session) return;

    try {
      await supabase.functions.invoke('live-chat-service', {
        body: {
          action: 'end_session',
          session_id: session.id,
          reason: 'Customer ended session'
        }
      });

      setSession(null);
      setMessages([]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'resolved': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-50"
        size="sm"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 h-12 flex items-center justify-between p-3 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">Live Chat</span>
          {session && (
            <Badge className={`${getStatusColor(session.status)} text-white`}>
              {session.status}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="h-6 w-6 p-0"
          >
            <MessageCircle className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">Live Chat</span>
          {session && (
            <Badge className={`${getStatusColor(session.status)} text-white`}>
              {session.status}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-6 w-6 p-0"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col">
        {!session ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Need help? Start a chat with our support team
              </p>
              <Button onClick={startChatSession} disabled={isLoading || !user}>
                {isLoading ? 'Starting...' : 'Start Chat'}
              </Button>
              {!user && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please log in to start a chat
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_type === 'customer' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg text-sm ${
                        message.sender_type === 'customer'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {session.status === 'active' && (
                <Button
                  onClick={endSession}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  End Chat
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}