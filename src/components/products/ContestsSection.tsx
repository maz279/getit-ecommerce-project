
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { contests } from '@/data/productsData';

export const ContestsSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🏆 EID CONTESTS & GIVEAWAYS
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            View All Contests
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contests.map((contest, index) => (
            <Card key={index} className="border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">🎯 {contest.title}</h3>
                  <p className="text-gray-600 font-semibold">{contest.description}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">🏅 Prizes:</h4>
                  <div className="space-y-1">
                    {contest.prizes.map((prize, idx) => (
                      <div key={idx} className="text-sm text-gray-600">• {prize}</div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">How to Participate:</h4>
                  <p className="text-sm text-gray-600">{contest.participation}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    📅 {contest.drawDate}
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold">
                    🎫 Participate Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
