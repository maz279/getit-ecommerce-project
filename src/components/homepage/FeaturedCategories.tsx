
import React from 'react';
import { 
  Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2, 
  Shirt, ShoppingBag, Home, Car, Baby, Heart,
  Coffee, Book, Dumbbell, Paintbrush, Music, Gift
} from 'lucide-react';

interface CategoryItem {
  icon: React.ReactNode;
  name: string;
  count: number;
  color: string;
}

const categories: CategoryItem[] = [
  { icon: <Smartphone className="w-8 h-8" />, name: "Electronics", count: 2847, color: "text-blue-500" },
  { icon: <Shirt className="w-8 h-8" />, name: "Fashion", count: 1923, color: "text-pink-500" },
  { icon: <Home className="w-8 h-8" />, name: "Home & Garden", count: 1456, color: "text-green-500" },
  { icon: <Coffee className="w-8 h-8" />, name: "Food & Drink", count: 987, color: "text-orange-500" },
  { icon: <Laptop className="w-8 h-8" />, name: "Computers", count: 754, color: "text-purple-500" },
  { icon: <Car className="w-8 h-8" />, name: "Automotive", count: 623, color: "text-red-500" },
  { icon: <Baby className="w-8 h-8" />, name: "Baby & Kids", count: 445, color: "text-yellow-500" },
  { icon: <Dumbbell className="w-8 h-8" />, name: "Sports", count: 389, color: "text-indigo-500" },
  { icon: <Heart className="w-8 h-8" />, name: "Health", count: 267, color: "text-rose-500" },
  { icon: <Book className="w-8 h-8" />, name: "Books", count: 234, color: "text-teal-500" },
  { icon: <Music className="w-8 h-8" />, name: "Music", count: 198, color: "text-cyan-500" },
  { icon: <Gift className="w-8 h-8" />, name: "Gifts", count: 156, color: "text-emerald-500" },
  { icon: <Camera className="w-8 h-8" />, name: "Photography", count: 143, color: "text-violet-500" },
  { icon: <Watch className="w-8 h-8" />, name: "Watches", count: 128, color: "text-amber-500" },
  { icon: <Gamepad2 className="w-8 h-8" />, name: "Gaming", count: 112, color: "text-lime-500" },
  { icon: <Paintbrush className="w-8 h-8" />, name: "Art & Craft", count: 98, color: "text-fuchsia-500" }
];

export const FeaturedCategories: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center mt-4 pl-[26px] pr-[9px] max-md:max-w-full max-md:pl-5">
      <div className="flex w-full max-w-[1383px] items-center gap-px flex-wrap max-md:max-w-full">
        <button className="bg-[rgba(32,32,107,1)] self-stretch text-sm text-white font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
          &lt;
        </button>
        
        <div className="bg-[rgba(242,242,242,1)] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border self-stretch pt-px pb-[17px] rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full">
          <div className="bg-[rgba(32,32,107,1)] flex w-full items-stretch gap-5 flex-wrap justify-between px-[15px] py-[9px] rounded-[3px] max-md:max-w-full">
            <div className="text-white text-base font-bold">
              Featured Categories
            </div>
            <div className="flex items-stretch gap-[5px] text-xs font-semibold">
              <div className="text-white grow">SEE ALL</div>
              <button className="bg-white text-[rgba(32,32,107,1)] whitespace-nowrap px-[5px] py-px rounded-[5px] hover:bg-gray-100 transition-colors">
                &gt;
              </button>
            </div>
          </div>
          
          <div className="bg-[rgba(217,217,217,1)] flex shrink-0 h-0.5 max-md:max-w-full" />
          
          <div className="ml-3.5 mr-5 mt-[7px] max-md:max-w-full max-md:mr-2.5">
            <div className="grid grid-cols-8 gap-4 max-md:grid-cols-4">
              {categories.slice(0, 8).map((category, index) => (
                <div key={index} className="bg-white flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className={`${category.color} mb-2 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div className="text-sm font-medium text-center text-gray-800">{category.name}</div>
                  <div className="text-xs text-gray-500 mt-1">({category.count})</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="ml-3.5 mr-5 mt-[7px] max-md:max-w-full max-md:mr-2.5">
            <div className="grid grid-cols-8 gap-4 max-md:grid-cols-4">
              {categories.slice(8, 16).map((category, index) => (
                <div key={index + 8} className="bg-white flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className={`${category.color} mb-2 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div className="text-sm font-medium text-center text-gray-800">{category.name}</div>
                  <div className="text-xs text-gray-500 mt-1">({category.count})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button className="bg-[rgba(32,32,107,1)] self-stretch text-sm text-white font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
          &gt;
        </button>
      </div>
    </section>
  );
};
