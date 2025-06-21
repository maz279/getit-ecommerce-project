
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Users } from 'lucide-react';

export const CustomerSupportSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🤝 EID Customer Support
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Support
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-teal-500 text-white border-none shadow-xl">
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">📞 24/7 EID Helpline</h3>
              <div className="text-2xl font-bold mb-2">1-800-GETIT</div>
              <p className="text-sm mb-4">Call FREE from any phone</p>
              <div className="text-xs space-y-1">
                <div>🕐 24/7 support until EID</div>
                <div>🗣️ Multilingual support</div>
                <div>🚚 Emergency delivery support</div>
                <div>🎁 Gift wrapping assistance</div>
              </div>
              <Button variant="secondary" className="w-full mt-4 text-green-600 font-bold">
                📞 Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none shadow-xl">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">💬 Live Chat & Messaging</h3>
              <div className="text-xs space-y-2 mb-4">
                <div>💬 Instant response (under 30 seconds)</div>
                <div>📱 WhatsApp: +1-800-GetIt</div>
                <div>📧 eid-support@getit.com</div>
                <div>🔄 2-hour response guarantee</div>
              </div>
              <Button variant="secondary" className="w-full text-blue-600 font-bold">
                💬 Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none shadow-xl">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">🎯 Specialized EID Services</h3>
              <div className="text-xs space-y-2 mb-4">
                <div>👗 Personal Shopping Assistant</div>
                <div>🎁 Gift Concierge Service</div>
                <div>🏠 Home Makeover Consultation</div>
                <div>🍽️ EID Menu Planning</div>
              </div>
              <Button variant="secondary" className="w-full text-purple-600 font-bold">
                🎯 Get Expert Help
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📱 Social Media & Community Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">📱 Follow Us</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>📘 Facebook: GetIt (500K+ members)</li>
                  <li>📷 Instagram: @GetIt</li>
                  <li>📹 YouTube: GetIt Official</li>
                  <li>💬 WhatsApp Groups: Instant deal notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">🎯 Referral Rewards</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>👥 Refer 1 friend: $20 for both</li>
                  <li>🎁 Refer 5 friends: $150 + bonus $50</li>
                  <li>💎 Refer 10 friends: $350 + VIP membership</li>
                  <li>💰 Family referrals: Extra $100</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="flex gap-2 justify-center">
                <Button className="bg-orange-500 hover:bg-orange-600">📤 Share Now</Button>
                <Button variant="outline">👥 Refer Friends</Button>
                <Button variant="outline">🏆 Leaderboard</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
