import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, User, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender_type: 'customer' | 'agent' | 'ai_bot' | 'system';
  message_content: string;
  message_type: string;
  created_at: string;
}

export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    initialMessage: ''
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChatSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('live-chat-service/start-session', {
        body: {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          initial_message: customerInfo.initialMessage,
          language: 'english'
        }
      });

      if (error) throw error;

      setConversationId(data.conversation_id);
      setIsConnected(true);
      setIsInitialized(true);
      
      // Start listening for new messages
      setupRealtimeSubscription(data.conversation_id);
      
      // Load initial messages
      loadMessages(data.conversation_id);
    } catch (error) {
      console.error('Failed to start chat session:', error);
    }
  };

  const setupRealtimeSubscription = (convId: string) => {
    const channel = supabase
      .channel(`chat_${convId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'enhanced_chat_messages',
          filter: `conversation_id=eq.${convId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('live-chat-service/get-messages', {
        body: { conversation_id: convId }
      });

      if (error) throw error;
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      await supabase.functions.invoke('live-chat-service/send-message', {
        body: {
          conversation_id: conversationId,
          message: newMessage,
          sender_type: 'customer'
        }
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const endSession = async () => {
    if (!conversationId) return;

    try {
      await supabase.functions.invoke('live-chat-service/end-session', {
        body: { conversation_id: conversationId }
      });

      setIsConnected(false);
      setConversationId(null);
      setMessages([]);
      setIsInitialized(false);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'customer':
        return <User className="w-4 h-4" />;
      case 'ai_bot':
        return <Bot className="w-4 h-4" />;
      case 'agent':
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSenderName = (senderType: string) => {
    switch (senderType) {
      case 'customer':
        return 'You';
      case 'ai_bot':
        return 'GetIt Assistant';
      case 'agent':
        return 'Support Agent';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96">
      <Card className="h-full border-primary/20 shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground p-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Live Chat Support</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full p-0">
          {!isConnected ? (
            <div className="p-4 space-y-3">
              <h3 className="font-medium">Start a conversation</h3>
              <Input
                placeholder="Your name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Your email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                placeholder="How can we help you?"
                value={customerInfo.initialMessage}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, initialMessage: e.target.value }))}
              />
              <Button 
                onClick={startChatSession}
                className="w-full"
                disabled={!customerInfo.name || !customerInfo.email}
              >
                Start Chat
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.sender_type === 'customer' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender_type !== 'customer' && (
                        <div className="mt-1">
                          {getSenderIcon(message.sender_type)}
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-2 text-sm ${
                          message.sender_type === 'customer'
                            ? 'bg-primary text-primary-foreground'
                            : message.sender_type === 'system'
                            ? 'bg-muted text-muted-foreground text-center italic'
                            : 'bg-muted'
                        }`}
                      >
                        {message.sender_type !== 'customer' && message.sender_type !== 'system' && (
                          <div className="font-medium text-xs mb-1">
                            {getSenderName(message.sender_type)}
                          </div>
                        )}
                        <div>{message.message_content}</div>
                      </div>
                      
                      {message.sender_type === 'customer' && (
                        <div className="mt-1">
                          {getSenderIcon(message.sender_type)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={endSession}
                    className="text-xs"
                  >
                    End Chat
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};