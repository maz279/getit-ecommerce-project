
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff,
  Languages,
  Brain,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { chatbotService } from '@/services/nlp/ChatbotService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  intent?: string;
  confidence?: number;
}

interface NLPChatbotProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  language?: 'en' | 'bn';
  onLanguageChange?: (lang: 'en' | 'bn') => void;
}

export const NLPChatbot: React.FC<NLPChatbotProps> = ({
  isMinimized = false,
  onToggleMinimize,
  language = 'en',
  onLanguageChange
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'bn' 
        ? 'নমস্কার! আমি আপনার AI সহায়ক। আমি কীভাবে সাহায্য করতে পারি?'
        : 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputMessage.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.processMessage(messageText, {
        language,
        userId: 'user-123'
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: Date.now(),
        intent: response.intent,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, botMessage]);
      setSuggestions(response.suggestions);

      if (response.requiresHumanAgent) {
        setTimeout(() => {
          const transferMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: language === 'bn' 
              ? 'আমি একজন মানব এজেন্টের সাথে আপনাকে সংযুক্ত করছি।'
              : 'I\'m connecting you with a human agent for better assistance.',
            sender: 'bot',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, transferMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'bn'
          ? 'দুঃখিত, একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
          : 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setSuggestions([]);
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice input (would integrate with speech recognition)
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('What are your best smartphones?');
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  const content = {
    en: {
      title: 'AI Assistant',
      placeholder: 'Type your message...',
      send: 'Send',
      listening: 'Listening...',
      suggestions: 'Quick Actions:'
    },
    bn: {
      title: 'AI সহায়ক',
      placeholder: 'আপনার বার্তা লিখুন...',
      send: 'পাঠান',
      listening: 'শুনছি...',
      suggestions: 'দ্রুত কাজ:'
    }
  };

  const currentContent = content[language];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] flex flex-col">
      <Card className="flex-1 flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <CardTitle className="text-lg">{currentContent.title}</CardTitle>
              <Badge className="bg-white/20 text-white text-xs">NLP</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange?.(language === 'en' ? 'bn' : 'en')}
                className="text-white hover:bg-white/20 p-1"
              >
                <Languages className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-white/20 p-1"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      {message.intent && message.confidence && (
                        <div className="mt-1 text-xs opacity-70">
                          Intent: {message.intent} ({Math.round(message.confidence * 100)}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-xs text-gray-600 mb-2">{currentContent.suggestions}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? currentContent.listening : currentContent.placeholder}
                className="flex-1"
                disabled={isLoading || isListening}
              />
              
              <Button
                onClick={handleVoiceInput}
                variant="outline"
                size="sm"
                className={isListening ? 'bg-red-500 text-white' : ''}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
