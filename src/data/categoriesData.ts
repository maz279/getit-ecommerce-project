import React from 'react';
import { 
  Shirt, Smartphone, Home, Heart, Baby, Book, Car, Gamepad2, 
  Dumbbell, Coffee, Scissors, Stethoscope, Music, PawPrint, TreePine, 
  Shield, Package, Gift, Palette, ShoppingBag, Wrench, Plane, Archive,
  Zap, Camera, Watch, Headphones, Monitor, Laptop, Tablet, HardDrive,
  Speaker, Tv, Mouse, Keyboard, Printer, Router, Lightbulb, Sofa,
  Bed, UtensilsCrossed, Bath, Flower, Hammer, FolderOpen, Crown,
  Diamond, Paintbrush, Globe, Briefcase, GraduationCap, Building,
  Factory, Truck, Users, Target, Calendar, Coins, TrendingUp,
  Mountain, Sparkles
} from 'lucide-react';

export interface SubCategoryItem {
  name: string;
  count: number;
}

export interface SubCategory {
  name: string;
  subcategories: SubCategoryItem[];
}

export interface MainCategory {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  count: number;
  featured?: boolean;
  subcategories: Record<string, SubCategory>;
}

export const categoriesData: MainCategory[] = [
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: React.createElement(Shirt, { className: "w-6 h-6" }),
    color: 'bg-pink-500 text-white',
    count: 245789,
    featured: true,
    subcategories: {
      'womens-fashion': {
        name: "Women's Fashion",
        subcategories: [
          { name: 'Traditional Wear', count: 45678 },
          { name: 'Salwar Kameez', count: 23456 },
          { name: 'Kurti & Tops', count: 34567 },
          { name: 'Western Wear', count: 28934 },
          { name: 'Islamic Wear', count: 12345 },
          { name: 'Innerwear & Sleepwear', count: 15678 },
          { name: 'Maternity Wear', count: 5432 },
          { name: 'Accessories', count: 18976 },
          { name: 'Plus Size', count: 8765 }
        ]
      },
      'mens-fashion': {
        name: "Men's Fashion",
        subcategories: [
          { name: 'Traditional Wear', count: 23456 },
          { name: 'Casual Wear', count: 34567 },
          { name: 'Formal Wear', count: 18976 },
          { name: 'Ethnic & Fusion', count: 12345 },
          { name: 'Innerwear & Sleepwear', count: 9876 },
          { name: 'Activewear & Sports', count: 15432 },
          { name: 'Accessories', count: 11234 }
        ]
      },
      'kids-fashion': {
        name: "Kids Fashion",
        subcategories: [
          { name: 'Boys Clothing', count: 15678 },
          { name: 'Girls Clothing', count: 18976 },
          { name: 'Baby Clothing', count: 12345 },
          { name: 'Kids Footwear', count: 8765 },
          { name: 'School Uniforms', count: 6543 }
        ]
      },
      'footwear': {
        name: "Footwear",
        subcategories: [
          { name: 'Mens Footwear', count: 28934 },
          { name: 'Womens Footwear', count: 34567 },
          { name: 'Kids Footwear', count: 12345 },
          { name: 'Sports Shoes', count: 18976 },
          { name: 'Traditional Footwear', count: 9876 }
        ]
      },
      'bags-luggage': {
        name: "Bags & Luggage",
        subcategories: [
          { name: 'Handbags', count: 23456 },
          { name: 'Backpacks', count: 18976 },
          { name: 'Travel Luggage', count: 12345 },
          { name: 'Wallets & Accessories', count: 15678 }
        ]
      }
    }
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: React.createElement(Smartphone, { className: "w-6 h-6" }),
    color: 'bg-blue-500 text-white',
    count: 189456,
    featured: true,
    subcategories: {
      'mobile-tablets': {
        name: "Mobile & Tablets",
        subcategories: [
          { name: 'Smartphones', count: 45678 },
          { name: 'Tablets', count: 12345 },
          { name: 'Mobile Accessories', count: 28934 },
          { name: 'Smartwatches & Wearables', count: 15678 },
          { name: 'Power Banks', count: 18976 }
        ]
      },
      'computers': {
        name: "Computers & Laptops",
        subcategories: [
          { name: 'Laptops', count: 23456 },
          { name: 'Desktop Computers', count: 8765 },
          { name: 'Computer Components', count: 15432 },
          { name: 'Computer Accessories', count: 19876 },
          { name: 'Printers & Scanners', count: 6543 }
        ]
      },
      'audio-video': {
        name: "Audio & Video",
        subcategories: [
          { name: 'Headphones & Earphones', count: 34567 },
          { name: 'Speakers & Sound Systems', count: 18976 },
          { name: 'Cameras & Photography', count: 12345 },
          { name: 'TVs & Displays', count: 15678 },
          { name: 'Home Theater', count: 8765 }
        ]
      },
      'gaming': {
        name: "Gaming",
        subcategories: [
          { name: 'Gaming Consoles', count: 9876 },
          { name: 'Gaming Accessories', count: 15432 },
          { name: 'PC Gaming', count: 12345 },
          { name: 'Mobile Gaming', count: 8765 }
        ]
      },
      'appliances': {
        name: "Home Appliances",
        subcategories: [
          { name: 'Kitchen Appliances', count: 23456 },
          { name: 'Cleaning Appliances', count: 12345 },
          { name: 'Personal Care Appliances', count: 15678 },
          { name: 'Air Conditioning', count: 8765 }
        ]
      }
    }
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icon: React.createElement(Home, { className: "w-6 h-6" }),
    color: 'bg-green-500 text-white',
    count: 167234,
    featured: true,
    subcategories: {
      'furniture': {
        name: "Furniture",
        subcategories: [
          { name: 'Living Room Furniture', count: 28934 },
          { name: 'Bedroom Furniture', count: 23456 },
          { name: 'Dining Room Furniture', count: 15678 },
          { name: 'Office Furniture', count: 12345 },
          { name: 'Outdoor Furniture', count: 8765 }
        ]
      },
      'home-decor': {
        name: "Home Decor",
        subcategories: [
          { name: 'Wall Decor', count: 18976 },
          { name: 'Decorative Accessories', count: 15432 },
          { name: 'Lighting', count: 12345 },
          { name: 'Window Treatments', count: 9876 },
          { name: 'Rugs & Carpets', count: 11234 }
        ]
      },
      'kitchen-dining': {
        name: "Kitchen & Dining",
        subcategories: [
          { name: 'Cookware', count: 23456 },
          { name: 'Kitchen Tools & Gadgets', count: 18976 },
          { name: 'Dinnerware', count: 15678 },
          { name: 'Food Storage', count: 12345 },
          { name: 'Small Appliances', count: 9876 }
        ]
      },
      'bedding-bath': {
        name: "Bedding & Bath",
        subcategories: [
          { name: 'Bedding', count: 19876 },
          { name: 'Bath Towels & Linens', count: 15432 },
          { name: 'Bathroom Accessories', count: 12345 },
          { name: 'Pillows & Cushions', count: 8765 }
        ]
      },
      'garden-outdoor': {
        name: "Garden & Outdoor",
        subcategories: [
          { name: 'Gardening Tools', count: 15678 },
          { name: 'Plants & Seeds', count: 12345 },
          { name: 'Planters & Pots', count: 9876 },
          { name: 'Outdoor Decor', count: 8765 },
          { name: 'Lawn & Garden Care', count: 6543 }
        ]
      },
      'storage-organization': {
        name: "Storage & Organization",
        subcategories: [
          { name: 'Closet Organization', count: 12345 },
          { name: 'Storage Furniture', count: 9876 },
          { name: 'Garage & Utility', count: 8765 },
          { name: 'Laundry Organization', count: 6543 }
        ]
      }
    }
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    icon: React.createElement(Heart, { className: "w-6 h-6" }),
    color: 'bg-red-500 text-white',
    count: 134567,
    featured: true,
    subcategories: {
      'skincare': {
        name: "Skincare",
        subcategories: [
          { name: 'Face Care', count: 28934 },
          { name: 'Body Care', count: 23456 },
          { name: 'Anti-Aging', count: 15678 },
          { name: 'Natural & Organic', count: 12345 },
          { name: 'Men\'s Skincare', count: 8765 }
        ]
      },
      'makeup': {
        name: "Makeup & Cosmetics",
        subcategories: [
          { name: 'Face Makeup', count: 25678 },
          { name: 'Eye Makeup', count: 18976 },
          { name: 'Lip Care', count: 15432 },
          { name: 'Nail Care', count: 12345 },
          { name: 'Makeup Tools', count: 9876 }
        ]
      },
      'hair-care': {
        name: "Hair Care",
        subcategories: [
          { name: 'Shampoo & Conditioner', count: 23456 },
          { name: 'Hair Styling', count: 18976 },
          { name: 'Hair Tools', count: 15678 },
          { name: 'Hair Treatments', count: 12345 }
        ]
      },
      'personal-care': {
        name: "Personal Care",
        subcategories: [
          { name: 'Bath & Body', count: 19876 },
          { name: 'Oral Care', count: 15432 },
          { name: 'Deodorants & Perfumes', count: 12345 },
          { name: 'Shaving & Grooming', count: 9876 }
        ]
      },
      'health-wellness': {
        name: "Health & Wellness",
        subcategories: [
          { name: 'Vitamins & Supplements', count: 18976 },
          { name: 'Medical Supplies', count: 12345 },
          { name: 'Fitness Equipment', count: 9876 },
          { name: 'Health Monitors', count: 8765 }
        ]
      }
    }
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    icon: React.createElement(Baby, { className: "w-6 h-6" }),
    color: 'bg-yellow-500 text-white',
    count: 98765,
    subcategories: {
      'baby-essentials': {
        name: "Baby Essentials",
        subcategories: [
          { name: 'Feeding', count: 18976 },
          { name: 'Diapering', count: 15432 },
          { name: 'Baby Care', count: 12345 },
          { name: 'Baby Safety', count: 9876 },
          { name: 'Baby Health', count: 8765 }
        ]
      },
      'toys-games': {
        name: "Toys & Games",
        subcategories: [
          { name: 'Educational Toys', count: 23456 },
          { name: 'Action Figures', count: 18976 },
          { name: 'Dolls & Accessories', count: 15678 },
          { name: 'Board Games', count: 12345 },
          { name: 'Outdoor Toys', count: 9876 }
        ]
      },
      'kids-furniture': {
        name: "Kids Furniture",
        subcategories: [
          { name: 'Cribs & Nursery', count: 12345 },
          { name: 'Kids Beds', count: 9876 },
          { name: 'Study Tables', count: 8765 },
          { name: 'Storage Solutions', count: 6543 }
        ]
      }
    }
  },
  {
    id: 'books-education',
    name: 'Books & Education',
    icon: React.createElement(Book, { className: "w-6 h-6" }),
    color: 'bg-indigo-500 text-white',
    count: 87654,
    subcategories: {
      'academic-books': {
        name: "Academic Books",
        subcategories: [
          { name: 'School Books', count: 23456 },
          { name: 'University Books', count: 18976 },
          { name: 'Professional Books', count: 12345 },
          { name: 'Reference Books', count: 9876 }
        ]
      },
      'general-books': {
        name: "General Books",
        subcategories: [
          { name: 'Fiction', count: 15678 },
          { name: 'Non-Fiction', count: 12345 },
          { name: 'Religious Books', count: 9876 },
          { name: 'Children\'s Books', count: 8765 }
        ]
      },
      'stationery': {
        name: "Stationery & Office Supplies",
        subcategories: [
          { name: 'Writing Instruments', count: 12345 },
          { name: 'Paper Products', count: 9876 },
          { name: 'Art Supplies', count: 8765 },
          { name: 'Office Equipment', count: 6543 }
        ]
      }
    }
  },
  {
    id: 'automobiles',
    name: 'Automobiles',
    icon: React.createElement(Car, { className: "w-6 h-6" }),
    color: 'bg-gray-700 text-white',
    count: 76543,
    subcategories: {
      'cars-motorcycles': {
        name: "Cars & Motorcycles",
        subcategories: [
          { name: 'New Cars', count: 12345 },
          { name: 'Used Cars', count: 23456 },
          { name: 'Motorcycles', count: 15678 },
          { name: 'Bicycles', count: 9876 }
        ]
      },
      'auto-parts': {
        name: "Auto Parts & Accessories",
        subcategories: [
          { name: 'Car Parts', count: 18976 },
          { name: 'Motorcycle Parts', count: 12345 },
          { name: 'Car Accessories', count: 15678 },
          { name: 'Tools & Equipment', count: 9876 }
        ]
      }
    }
  },
  {
    id: 'sports-outdoor',
    name: 'Sports & Outdoor',
    icon: React.createElement(Dumbbell, { className: "w-6 h-6" }),
    color: 'bg-orange-500 text-white',
    count: 65432,
    subcategories: {
      'sports-equipment': {
        name: "Sports Equipment",
        subcategories: [
          { name: 'Cricket', count: 15678 },
          { name: 'Football', count: 12345 },
          { name: 'Badminton', count: 9876 },
          { name: 'Tennis', count: 8765 },
          { name: 'Swimming', count: 6543 }
        ]
      },
      'fitness-gym': {
        name: "Fitness & Gym",
        subcategories: [
          { name: 'Home Gym Equipment', count: 18976 },
          { name: 'Cardio Equipment', count: 12345 },
          { name: 'Strength Training', count: 9876 },
          { name: 'Yoga & Pilates', count: 8765 }
        ]
      },
      'outdoor-activities': {
        name: "Outdoor Activities",
        subcategories: [
          { name: 'Camping & Hiking', count: 12345 },
          { name: 'Fishing', count: 9876 },
          { name: 'Cycling', count: 8765 },
          { name: 'Water Sports', count: 6543 }
        ]
      }
    }
  },
  {
    id: 'food-groceries',
    name: 'Food & Groceries',
    icon: React.createElement(Coffee, { className: "w-6 h-6" }),
    color: 'bg-emerald-500 text-white',
    count: 54321,
    subcategories: {
      'fresh-food': {
        name: "Fresh Food",
        subcategories: [
          { name: 'Fruits & Vegetables', count: 12345 },
          { name: 'Meat & Poultry', count: 9876 },
          { name: 'Fish & Seafood', count: 8765 },
          { name: 'Dairy Products', count: 6543 }
        ]
      },
      'packaged-foods': {
        name: "Packaged Foods",
        subcategories: [
          { name: 'Rice & Grains', count: 15678 },
          { name: 'Snacks & Confectionery', count: 12345 },
          { name: 'Beverages', count: 9876 },
          { name: 'Cooking Ingredients', count: 8765 }
        ]
      }
    }
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    icon: React.createElement(Diamond, { className: "w-6 h-6" }),
    color: 'bg-purple-500 text-white',
    count: 43210,
    featured: true,
    subcategories: {
      'traditional-jewelry': {
        name: "Traditional Jewelry",
        subcategories: [
          { name: 'Gold Jewelry', count: 12345 },
          { name: 'Silver Jewelry', count: 9876 },
          { name: 'Bangles & Bracelets', count: 8765 },
          { name: 'Earrings', count: 6543 },
          { name: 'Necklaces', count: 5432 }
        ]
      },
      'fashion-jewelry': {
        name: "Fashion Jewelry",
        subcategories: [
          { name: 'Artificial Jewelry', count: 15678 },
          { name: 'Costume Jewelry', count: 12345 },
          { name: 'Watches', count: 9876 },
          { name: 'Sunglasses', count: 8765 }
        ]
      }
    }
  },
  {
    id: 'art-craft',
    name: 'Art & Craft',
    icon: React.createElement(Paintbrush, { className: "w-6 h-6" }),
    color: 'bg-teal-500 text-white',
    count: 32100,
    subcategories: {
      'art-supplies': {
        name: "Art Supplies",
        subcategories: [
          { name: 'Paints & Brushes', count: 8765 },
          { name: 'Drawing Materials', count: 6543 },
          { name: 'Canvas & Paper', count: 5432 },
          { name: 'Art Tools', count: 4321 }
        ]
      },
      'craft-supplies': {
        name: "Craft Supplies",
        subcategories: [
          { name: 'Sewing & Textiles', count: 7654 },
          { name: 'Pottery & Clay', count: 4321 },
          { name: 'Jewelry Making', count: 3210 },
          { name: 'Scrapbooking', count: 2109 }
        ]
      }
    }
  },
  {
    id: 'music-entertainment',
    name: 'Music & Entertainment',
    icon: React.createElement(Music, { className: "w-6 h-6" }),
    color: 'bg-purple-600 text-white',
    count: 29876,
    subcategories: {
      'musical-instruments': {
        name: "Musical Instruments",
        subcategories: [
          { name: 'Traditional Instruments', count: 8765 },
          { name: 'Modern Instruments', count: 6543 },
          { name: 'Audio Equipment', count: 5432 },
          { name: 'Accessories', count: 4321 }
        ]
      },
      'entertainment': {
        name: "Entertainment",
        subcategories: [
          { name: 'DVDs & Blu-rays', count: 3210 },
          { name: 'Streaming Devices', count: 2109 },
          { name: 'Party Supplies', count: 1987 },
          { name: 'Event Equipment', count: 1543 }
        ]
      }
    }
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    icon: React.createElement(PawPrint, { className: "w-6 h-6" }),
    color: 'bg-amber-500 text-white',
    count: 27654,
    subcategories: {
      'pet-food': {
        name: "Pet Food & Care",
        subcategories: [
          { name: 'Dog Food', count: 8765 },
          { name: 'Cat Food', count: 6543 },
          { name: 'Bird Food', count: 4321 },
          { name: 'Fish Food', count: 3210 },
          { name: 'Pet Health', count: 5432 }
        ]
      },
      'pet-accessories': {
        name: "Pet Accessories",
        subcategories: [
          { name: 'Pet Toys', count: 4321 },
          { name: 'Pet Beds', count: 3210 },
          { name: 'Collars & Leashes', count: 2987 },
          { name: 'Pet Carriers', count: 2109 }
        ]
      }
    }
  },
  {
    id: 'office-supplies',
    name: 'Office Supplies',
    icon: React.createElement(Briefcase, { className: "w-6 h-6" }),
    color: 'bg-slate-600 text-white',
    count: 25432,
    subcategories: {
      'stationery': {
        name: "Stationery",
        subcategories: [
          { name: 'Writing Instruments', count: 7654 },
          { name: 'Paper Products', count: 6543 },
          { name: 'Filing & Storage', count: 5432 },
          { name: 'Desk Accessories', count: 4321 }
        ]
      },
      'office-equipment': {
        name: "Office Equipment",
        subcategories: [
          { name: 'Printers & Scanners', count: 3210 },
          { name: 'Office Furniture', count: 2987 },
          { name: 'Communication', count: 2109 },
          { name: 'Security', count: 1876 }
        ]
      }
    }
  },
  {
    id: 'tools-hardware',
    name: 'Tools & Hardware',
    icon: React.createElement(Wrench, { className: "w-6 h-6" }),
    color: 'bg-stone-600 text-white',
    count: 23210,
    subcategories: {
      'hand-tools': {
        name: "Hand Tools",
        subcategories: [
          { name: 'Basic Tools', count: 6543 },
          { name: 'Measuring Tools', count: 4321 },
          { name: 'Cutting Tools', count: 3210 },
          { name: 'Safety Equipment', count: 2987 }
        ]
      },
      'power-tools': {
        name: "Power Tools",
        subcategories: [
          { name: 'Electric Tools', count: 4321 },
          { name: 'Cordless Tools', count: 3210 },
          { name: 'Tool Accessories', count: 2109 },
          { name: 'Workbenches', count: 1876 }
        ]
      }
    }
  },
  {
    id: 'agriculture-gardening',
    name: 'Agriculture & Gardening',
    icon: React.createElement(TreePine, { className: "w-6 h-6" }),
    color: 'bg-green-600 text-white',
    count: 21098,
    subcategories: {
      'farming-supplies': {
        name: "Farming Supplies",
        subcategories: [
          { name: 'Seeds & Plants', count: 6543 },
          { name: 'Fertilizers', count: 4321 },
          { name: 'Farming Tools', count: 3210 },
          { name: 'Irrigation', count: 2987 }
        ]
      },
      'gardening': {
        name: "Gardening",
        subcategories: [
          { name: 'Garden Tools', count: 4321 },
          { name: 'Plant Care', count: 3210 },
          { name: 'Garden Decor', count: 2109 },
          { name: 'Outdoor Furniture', count: 1876 }
        ]
      }
    }
  },
  {
    id: 'traditional-handicrafts',
    name: 'Traditional Handicrafts',
    icon: React.createElement(Sparkles, { className: "w-6 h-6" }),
    color: 'bg-rose-600 text-white',
    count: 18765,
    featured: true,
    subcategories: {
      'bengali-handicrafts': {
        name: "Bengali Handicrafts",
        subcategories: [
          { name: 'Nakshi Kantha', count: 4321 },
          { name: 'Jamdani', count: 3210 },
          { name: 'Pottery', count: 2987 },
          { name: 'Wood Crafts', count: 2109 }
        ]
      },
      'folk-art': {
        name: "Folk Art",
        subcategories: [
          { name: 'Traditional Paintings', count: 3210 },
          { name: 'Handwoven Textiles', count: 2987 },
          { name: 'Metal Crafts', count: 2109 },
          { name: 'Bamboo Crafts', count: 1876 }
        ]
      }
    }
  },
  {
    id: 'religious-items',
    name: 'Religious Items',
    icon: React.createElement(Archive, { className: "w-6 h-6" }),
    color: 'bg-emerald-600 text-white',
    count: 16543,
    subcategories: {
      'islamic-items': {
        name: "Islamic Items",
        subcategories: [
          { name: 'Prayer Items', count: 4321 },
          { name: 'Islamic Books', count: 3210 },
          { name: 'Islamic Clothing', count: 2987 },
          { name: 'Decorative Items', count: 2109 }
        ]
      },
      'general-religious': {
        name: "General Religious",
        subcategories: [
          { name: 'Prayer Beads', count: 2987 },
          { name: 'Religious Art', count: 2109 },
          { name: 'Ceremonial Items', count: 1876 },
          { name: 'Religious Jewelry', count: 1654 }
        ]
      }
    }
  },
  {
    id: 'gift-items',
    name: 'Gift Items',
    icon: React.createElement(Gift, { className: "w-6 h-6" }),
    color: 'bg-pink-600 text-white',
    count: 14321,
    subcategories: {
      'occasion-gifts': {
        name: "Occasion Gifts",
        subcategories: [
          { name: 'Birthday Gifts', count: 3210 },
          { name: 'Wedding Gifts', count: 2987 },
          { name: 'Anniversary Gifts', count: 2109 },
          { name: 'Holiday Gifts', count: 1876 }
        ]
      },
      'corporate-gifts': {
        name: "Corporate Gifts",
        subcategories: [
          { name: 'Business Gifts', count: 2109 },
          { name: 'Promotional Items', count: 1876 },
          { name: 'Awards & Trophies', count: 1654 },
          { name: 'Gift Cards', count: 1432 }
        ]
      }
    }
  },
  {
    id: 'seasonal-festival',
    name: 'Seasonal & Festival',
    icon: React.createElement(Calendar, { className: "w-6 h-6" }),
    color: 'bg-yellow-600 text-white',
    count: 12987,
    subcategories: {
      'festival-items': {
        name: "Festival Items",
        subcategories: [
          { name: 'Eid Collection', count: 3210 },
          { name: 'Puja Items', count: 2987 },
          { name: 'Christmas Decor', count: 2109 },
          { name: 'New Year Items', count: 1876 }
        ]
      },
      'seasonal-products': {
        name: "Seasonal Products",
        subcategories: [
          { name: 'Summer Essentials', count: 2109 },
          { name: 'Winter Collection', count: 1876 },
          { name: 'Monsoon Gear', count: 1654 },
          { name: 'Spring Collection', count: 1432 }
        ]
      }
    }
  },
  {
    id: 'medical-equipment',
    name: 'Medical Equipment',
    icon: React.createElement(Stethoscope, { className: "w-6 h-6" }),
    color: 'bg-red-600 text-white',
    count: 10765,
    subcategories: {
      'medical-devices': {
        name: "Medical Devices",
        subcategories: [
          { name: 'Diagnostic Equipment', count: 2987 },
          { name: 'Monitoring Devices', count: 2109 },
          { name: 'Therapeutic Equipment', count: 1876 },
          { name: 'Emergency Supplies', count: 1654 }
        ]
      },
      'healthcare-supplies': {
        name: "Healthcare Supplies",
        subcategories: [
          { name: 'Personal Protective Equipment', count: 1876 },
          { name: 'First Aid Supplies', count: 1654 },
          { name: 'Mobility Aids', count: 1432 },
          { name: 'Home Care', count: 1210 }
        ]
      }
    }
  },
  {
    id: 'industrial-supplies',
    name: 'Industrial Supplies',
    icon: React.createElement(Factory, { className: "w-6 h-6" }),
    color: 'bg-gray-600 text-white',
    count: 8543,
    subcategories: {
      'manufacturing': {
        name: "Manufacturing",
        subcategories: [
          { name: 'Industrial Tools', count: 2109 },
          { name: 'Raw Materials', count: 1876 },
          { name: 'Machinery Parts', count: 1654 },
          { name: 'Safety Equipment', count: 1432 }
        ]
      },
      'industrial-equipment': {
        name: "Industrial Equipment",
        subcategories: [
          { name: 'Heavy Machinery', count: 1432 },
          { name: 'Electrical Equipment', count: 1210 },
          { name: 'Hydraulic Systems', count: 1098 },
          { name: 'Pneumatic Tools', count: 987 }
        ]
      }
    }
  },
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism',
    icon: React.createElement(Plane, { className: "w-6 h-6" }),
    color: 'bg-sky-600 text-white',
    count: 7321,
    subcategories: {
      'travel-gear': {
        name: "Travel Gear",
        subcategories: [
          { name: 'Luggage & Bags', count: 1876 },
          { name: 'Travel Accessories', count: 1654 },
          { name: 'Outdoor Gear', count: 1432 },
          { name: 'Navigation Tools', count: 1210 }
        ]
      },
      'tourism-services': {
        name: "Tourism Services",
        subcategories: [
          { name: 'Tour Packages', count: 1210 },
          { name: 'Hotel Bookings', count: 1098 },
          { name: 'Transport Services', count: 987 },
          { name: 'Travel Insurance', count: 876 }
        ]
      }
    }
  },
  {
    id: 'photography-video',
    name: 'Photography & Video',
    icon: React.createElement(Camera, { className: "w-6 h-6" }),
    color: 'bg-indigo-600 text-white',
    count: 6109,
    subcategories: {
      'camera-equipment': {
        name: "Camera Equipment",
        subcategories: [
          { name: 'Digital Cameras', count: 1654 },
          { name: 'Lenses', count: 1432 },
          { name: 'Tripods & Stands', count: 1210 },
          { name: 'Camera Accessories', count: 1098 }
        ]
      },
      'video-equipment': {
        name: "Video Equipment",
        subcategories: [
          { name: 'Video Cameras', count: 1098 },
          { name: 'Lighting Equipment', count: 987 },
          { name: 'Audio Recording', count: 876 },
          { name: 'Video Editing', count: 765 }
        ]
      }
    }
  }
];
