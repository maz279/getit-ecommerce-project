import React from 'react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Zap } from 'lucide-react';

export default function LiveChat() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Live Chat</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with our community, get real-time support, and engage with vendors and customers through our live chat system.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Real-time Messaging</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Send and receive messages instantly with our WebSocket-powered chat system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Multiple Rooms</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Join different chat rooms for general discussion, product support, or vendor communication.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Zap className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>User Presence</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              See who's online and available for real-time conversations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <ChatRoom />
    </div>
  );
}