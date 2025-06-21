
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { socialImpact } from '@/data/productsData';

export const SocialImpactSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🤲 EID Giving Program 🤲
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            View All Programs
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {socialImpact.map((program, index) => (
            <Card key={index} className="border-2 border-green-200 hover:border-green-400 transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">🍽️ {program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{program.impact}</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: `${program.progress}%`}}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{program.currentCount}</span>
                    <span className="text-green-600 font-semibold">{program.progress}%</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    🎯 {program.goal}
                  </div>
                  <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold">
                    💰 Donate Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-yellow-100 to-green-100 border-2 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">✨ GetIt Matching Program ✨</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-bold text-2xl text-green-600">$245,678</h4>
                <p className="text-sm text-gray-600">Total Raised This EID</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-blue-600">15,678</h4>
                <p className="text-sm text-gray-600">Caring Hearts (Donors)</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-purple-600">47,892</h4>
                <p className="text-sm text-gray-600">Lives Touched</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="mb-4">🎁 GetIt matches 50% of all donations! Your $100 becomes $150 impact</p>
              <div className="flex gap-2 justify-center">
                <Button className="bg-green-500 hover:bg-green-600">💝 Start Giving</Button>
                <Button variant="outline">📊 Impact Dashboard</Button>
                <Button variant="outline">🤝 Join Community</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
