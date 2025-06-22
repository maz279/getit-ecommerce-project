
import React from 'react';
import { 
  Shirt, Smartphone, Home, Heart, Baby, Book, Car, Gamepad2, 
  Dumbbell, Coffee, Scissors, Stethoscope, Music, PawPrint, TreePine, 
  Shield, Package, Gift, Palette, ShoppingBag, Wrench, Plane, Archive,
  Zap, Camera, Watch, Headphones, Monitor, Laptop, Tablet, HardDrive,
  Speaker, Tv, Mouse, Keyboard, Printer, Router, Lightbulb, Sofa,
  Bed, UtensilsCrossed, Bath, Flower, Hammer, FolderOpen, Crown,
  Diamond, Paintbrush, Globe, Briefcase, GraduationCap, Building,
  Factory, Truck, Users, Target, Calendar, Coins, TrendingUp
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
  }
];
