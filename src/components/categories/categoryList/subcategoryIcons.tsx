
import React from 'react';
import { 
  Crown, Shirt, Baby, Heart, Sparkles, Users, Zap, Star, ShoppingBag, 
  Footprints, Package, Dumbbell, Watch, Monitor, Camera, Headphones, 
  Gamepad2, Smartphone, Sofa, Lamp, UtensilsCrossed, Bath, Flower, 
  Archive, Book, Car, Stethoscope, Scissors, Coffee, TreePine, 
  Wrench, Diamond, Printer
} from 'lucide-react';

// Icon mappings for subcategories
export const subcategoryIcons: { [key: string]: React.ReactNode } = {
  // Fashion & Apparel
  'womens-fashion': <Crown className="w-4 h-4 text-pink-500" />,
  'mens-fashion': <Shirt className="w-4 h-4 text-blue-500" />,
  'kids-fashion': <Baby className="w-4 h-4 text-purple-500" />,
  'footwear': <Footprints className="w-4 h-4 text-brown-500" />,
  'bags-luggage': <ShoppingBag className="w-4 h-4 text-indigo-500" />,
  
  // Electronics
  'mobile-tablets': <Smartphone className="w-4 h-4 text-blue-500" />,
  'computers': <Monitor className="w-4 h-4 text-gray-600" />,
  'audio-video': <Headphones className="w-4 h-4 text-purple-500" />,
  'gaming': <Gamepad2 className="w-4 h-4 text-red-500" />,
  'appliances': <Zap className="w-4 h-4 text-yellow-500" />,
  
  // Home & Garden
  'furniture': <Sofa className="w-4 h-4 text-brown-500" />,
  'home-decor': <Lamp className="w-4 h-4 text-orange-500" />,
  'kitchen-dining': <UtensilsCrossed className="w-4 h-4 text-red-500" />,
  'bedding-bath': <Bath className="w-4 h-4 text-blue-500" />,
  'garden-outdoor': <Flower className="w-4 h-4 text-green-500" />,
  'storage-organization': <Archive className="w-4 h-4 text-gray-500" />,

  // Health & Beauty
  'skincare': <Heart className="w-4 h-4 text-pink-500" />,
  'makeup': <Sparkles className="w-4 h-4 text-purple-500" />,
  'hair-care': <Scissors className="w-4 h-4 text-blue-500" />,
  'personal-care': <Users className="w-4 h-4 text-green-500" />,
  'health-wellness': <Stethoscope className="w-4 h-4 text-red-500" />,

  // Baby & Kids
  'baby-essentials': <Baby className="w-4 h-4 text-yellow-500" />,
  'toys-games': <Package className="w-4 h-4 text-purple-500" />,
  'kids-furniture': <Sofa className="w-4 h-4 text-blue-500" />,

  // Books & Education
  'academic-books': <Book className="w-4 h-4 text-blue-500" />,
  'general-books': <Book className="w-4 h-4 text-green-500" />,
  'stationery': <Printer className="w-4 h-4 text-gray-500" />,

  // Automobiles
  'cars-motorcycles': <Car className="w-4 h-4 text-red-500" />,
  'auto-parts': <Wrench className="w-4 h-4 text-gray-600" />,

  // Sports & Outdoor
  'sports-equipment': <Dumbbell className="w-4 h-4 text-blue-500" />,
  'fitness-gym': <Dumbbell className="w-4 h-4 text-green-500" />,
  'outdoor-activities': <TreePine className="w-4 h-4 text-green-600" />,

  // Food & Groceries
  'fresh-food': <Coffee className="w-4 h-4 text-green-500" />,
  'packaged-foods': <Package className="w-4 h-4 text-brown-500" />,

  // Jewelry
  'traditional-jewelry': <Diamond className="w-4 h-4 text-yellow-500" />,
  'fashion-jewelry': <Watch className="w-4 h-4 text-purple-500" />
};
