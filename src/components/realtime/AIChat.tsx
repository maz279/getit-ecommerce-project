import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  senderType: 'customer' | 'agent' | 'vendor' | 'admin' | 'ai';
  timestamp: string;
  isRead: boolean;
}

interface AIChatProps {
  conversationType?: 'customer_service' | 'vendor_admin' | 'buyer_seller';
  className?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  conversationType = 'customer_service',
  className = '',
  minimized = false,
  onToggleMinimize
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [conversationType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      subscribeToMessages();
    }
  }, [conversationId]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For non-authenticated users, create a temporary conversation
        await createGuestConversation();
        return;
      }

      // Check for existing conversation
      const { data: existingConversation } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('conversation_type', conversationType)
        .contains('participants', [user.id])
        .eq('status', 'active')
        .maybeSingle();

      if (existingConversation) {
        setConversationId(existingConversation.id);
        await loadMessages(existingConversation.id);
      } else {
        await createConversation();
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to initialize chat');
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await supabase.functions.invoke('ai-chat-service', {
        body: {
          action: 'create_conversation',
          conversationType,
          participants: [user.id]
        }
      });

      if (response.error) throw response.error;

      setConversationId(response.data.conversation.id);
      await loadMessages(response.data.conversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  const createGuestConversation = async () => {
    // For demo purposes, create a local conversation for guests
    const guestConversationId = `guest-${Date.now()}`;
    setConversationId(guestConversationId);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: `msg-${Date.now()}`,
      content: "Hello! I'm your AI assistant. I can help you with product information, orders, and general support. How can I assist you today?",
      senderType: 'ai',
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setMessages([welcomeMessage]);
    setIsConnected(true);
  };

  const loadMessages = async (convId: string) => {
    try {
      const response = await supabase.functions.invoke('ai-chat-service', {
        body: {
          action: 'get_conversation',
          conversationId: convId
        }
      });

      if (response.error) throw response.error;

      const formattedMessages: Message[] = response.data.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.message_content,
        senderType: msg.sender_type,
        timestamp: msg.created_at,
        isRead: msg.is_read
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_conversation_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMsg: Message = {
            id: payload.new.id,
            content: payload.new.message_content,
            senderType: payload.new.sender_type,
            timestamp: payload.new.created_at,
            isRead: payload.new.is_read
          };
          
          setMessages(prev => [...prev, newMsg]);
          setIsTyping(false);
        }
      )
      .subscribe();

    return () => channel.unsubscribe();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const message = newMessage.trim();
    setNewMessage('');

    // Add user message immediately for better UX
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: message,
      senderType: 'customer',
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      if (conversationId.startsWith('guest-')) {
        // Handle guest messages locally
        await handleGuestMessage(message);
      } else {
        const response = await supabase.functions.invoke('ai-chat-service', {
          body: {
            action: 'send_message',
            conversationId,
            message
          }
        });

        if (response.error) throw response.error;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setIsTyping(false);
    }
  };

  const handleGuestMessage = async (message: string) => {
    // Simulate AI response for guest users
    setTimeout(() => {
      const aiResponses = [
        "I understand you're looking for help. While I can provide basic assistance, for the best experience, please consider creating an account.",
        "That's a great question! For detailed product information and personalized recommendations, I'd be happy to help you further.",
        "I can help you with general information. For account-specific queries or order management, you'll need to sign in or create an account.",
        "Thanks for reaching out! I'm here to assist with product browsing, general policies, and basic support questions."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: randomResponse,
        senderType: 'ai',
        timestamp: new Date().toISOString(),
        isRead: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (minimized) {
    return (
      <Card className={`w-64 ${className}`}>
        <div className="p-3 flex items-center justify-between bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Chat Support</span>
            {isConnected && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="p-3 border-b bg-primary text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">AI Support Chat</span>
          {isConnected && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {conversationType.replace('_', ' ')}
          </Badge>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.senderType === 'customer' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.senderType !== 'customer' && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {message.senderType === 'ai' ? <Bot className="w-3 h-3" /> : 'A'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.senderType === 'customer'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderType === 'customer' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {message.senderType === 'customer' && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex gap-2 justify-start">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  <Bot className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading || !isConnected}
            className="flex-1 text-sm"
          />
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading || !isConnected}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};