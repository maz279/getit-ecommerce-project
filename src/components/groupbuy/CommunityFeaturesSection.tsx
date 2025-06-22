
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Share2, Award, Users2 } from 'lucide-react';

export const CommunityFeaturesSection: React.FC = () => {
  const communityFeatures = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Group Chat",
      description: "Communicate with group members in real-time",
      action: "Start Chatting"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Social Sharing",
      description: "Share groups via WhatsApp, Facebook, or SMS",
      action: "Share Now"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Leaderboard",
      description: "Compete with friends for most savings",
      action: "View Rankings"
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Follow Friends",
      description: "Get notified when friends join groups",
      action: "Find Friends"
    }
  ];

  const topGroupBuyers = [
    { name: "Rashid Ahmed", groups: 47, savings: "৳1,25,000", avatar: "👨‍💼", badge: "🏆" },
    { name: "Fatima Khan", groups: 38, savings: "৳98,500", avatar: "👩‍🎓", badge: "🥈" },
    { name: "Karim Hassan", groups: 32, savings: "৳87,200", avatar: "👨‍🔧", badge: "🥉" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🤝 Community Features</h2>
          <p className="text-xl text-gray-600">Connect, share, and save together with the GetIt community</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Social Shopping Tools</h3>
            <div className="space-y-4">
              {communityFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-100 p-3 rounded-lg">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                        <Button size="sm" variant="outline">
                          {feature.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">🏆 Top Group Buyers This Month</h3>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topGroupBuyers.map((buyer, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                      <div className="text-2xl">{buyer.badge}</div>
                      <div className="text-2xl">{buyer.avatar}</div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{buyer.name}</div>
                        <div className="text-sm text-gray-600">
                          {buyer.groups} groups joined • Saved {buyer.savings}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎉 Join the Community Challenge</h3>
          <p className="text-lg mb-6 opacity-90">
            Join 5 groups this month and win exclusive rewards! Current participants: 2,847
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
              Join Challenge
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
