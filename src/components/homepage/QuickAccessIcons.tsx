
import React from 'react';
import { 
  Flame, Gift, Coins, CreditCard, Calendar, Zap, 
  ShoppingBag, Truck, Star, Sparkles, Crown, Heart 
} from 'lucide-react';

interface QuickAccessItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color: string;
}

const quickAccessItems: QuickAccessItem[] = [
  { icon: <Flame className="w-6 h-6" />, title: "Flash Sale", subtitle: "70% Off", color: "from-red-500 to-orange-500" },
  { icon: <Gift className="w-6 h-6" />, title: "Daily Deals", subtitle: "New Daily", color: "from-green-500 to-teal-500" },
  { icon: <Coins className="w-6 h-6" />, title: "Reward Points", subtitle: "Earn More", color: "from-yellow-500 to-orange-500" },
  { icon: <CreditCard className="w-6 h-6" />, title: "Payment", subtitle: "Offers", color: "from-blue-500 to-purple-500" },
  { icon: <Calendar className="w-6 h-6" />, title: "Today's", subtitle: "Special", color: "from-purple-500 to-pink-500" },
  { icon: <Zap className="w-6 h-6" />, title: "Lightning", subtitle: "Deals", color: "from-indigo-500 to-blue-500" },
  { icon: <ShoppingBag className="w-6 h-6" />, title: "Bundle", subtitle: "Offers", color: "from-teal-500 to-green-500" },
  { icon: <Truck className="w-6 h-6" />, title: "Free", subtitle: "Delivery", color: "from-orange-500 to-red-500" },
  { icon: <Star className="w-6 h-6" />, title: "Top Rated", subtitle: "Products", color: "from-pink-500 to-purple-500" },
  { icon: <Sparkles className="w-6 h-6" />, title: "AI Picks", subtitle: "For You", color: "from-cyan-500 to-blue-500" },
  { icon: <Crown className="w-6 h-6" />, title: "Premium", subtitle: "Collection", color: "from-yellow-600 to-orange-600" },
  { icon: <Heart className="w-6 h-6" />, title: "Wishlist", subtitle: "Favorites", color: "from-red-500 to-pink-500" },
];

export const QuickAccessIcons: React.FC = () => {
  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4">
          {quickAccessItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group"
            >
              <div className={`bg-gradient-to-r ${item.color} p-4 rounded-full text-white mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm text-gray-800">{item.title}</div>
                {item.subtitle && (
                  <div className="text-xs text-gray-500 mt-1">{item.subtitle}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
