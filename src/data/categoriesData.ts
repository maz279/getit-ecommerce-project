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
      'traditional-ethnic': {
        name: "Traditional & Ethnic Wear",
        subcategories: [
          { name: 'Cotton Saree', count: 12456 },
          { name: 'Silk Saree', count: 8923 },
          { name: 'Muslin Saree', count: 5674 },
          { name: 'Jamdani Saree', count: 4521 },
          { name: 'Tant Saree', count: 6789 },
          { name: 'Tangail Saree', count: 3456 },
          { name: 'Banarasi Saree', count: 2890 },
          { name: 'Designer Saree', count: 7654 },
          { name: 'Bridal Saree', count: 2345 },
          { name: 'Casual Saree', count: 9876 },
          { name: 'Party Saree', count: 4567 },
          { name: 'Cotton Salwar Kameez', count: 15678 },
          { name: 'Silk Salwar Kameez', count: 7890 },
          { name: 'Georgette Salwar Kameez', count: 6543 },
          { name: 'Anarkali Suits', count: 8765 },
          { name: 'Straight Cut Suits', count: 5432 },
          { name: 'Palazzo Suits', count: 4321 },
          { name: 'Party Wear Salwar Kameez', count: 6789 },
          { name: 'Casual Salwar Kameez', count: 12345 },
          { name: 'Designer Suits', count: 3456 },
          { name: 'Bridal Lehenga', count: 2345 },
          { name: 'Party Lehenga', count: 4567 },
          { name: 'Cotton Lehenga', count: 3210 },
          { name: 'Designer Lehenga', count: 1890 },
          { name: 'Sharara Set', count: 2156 },
          { name: 'Gharara Set', count: 1567 },
          { name: 'Cotton Kurtis', count: 18976 },
          { name: 'Silk Kurtis', count: 8765 },
          { name: 'Designer Kurtis', count: 6543 },
          { name: 'Casual Kurtis', count: 15432 },
          { name: 'Party Kurtis', count: 5678 },
          { name: 'Printed Kurtis', count: 12890 },
          { name: 'Cotton Panjabi', count: 12345 },
          { name: 'Silk Panjabi', count: 6789 },
          { name: 'Linen Panjabi', count: 4567 },
          { name: 'Eid Special Panjabi', count: 8901 },
          { name: 'Wedding Panjabi', count: 3456 },
          { name: 'Casual Panjabi', count: 15678 },
          { name: 'Formal Panjabi', count: 7890 },
          { name: 'Embroidered Panjabi', count: 5432 },
          { name: 'Regular Kurta', count: 9876 },
          { name: 'Designer Kurta', count: 5678 },
          { name: 'Silk Kurta', count: 4321 },
          { name: 'Cotton Kurta', count: 12345 },
          { name: 'Pajama Set', count: 7890 },
          { name: 'Dhoti Set', count: 2345 },
          { name: 'Kurta Pajama Sets', count: 6789 },
          { name: 'Cotton Fatua', count: 8765 },
          { name: 'Traditional Fatua', count: 4567 },
          { name: 'Handloom Lungi', count: 3456 },
          { name: 'Printed Lungi', count: 5432 },
          { name: 'Check Lungi', count: 2890 },
          { name: 'Wedding Sherwani', count: 1234 },
          { name: 'Party Sherwani', count: 2345 },
          { name: 'Designer Sherwani', count: 1567 }
        ]
      },
      'western-modern': {
        name: "Western & Modern Clothing",
        subcategories: [
          { name: 'Cocktail Dresses', count: 5678 },
          { name: 'Evening Gowns', count: 3456 },
          { name: 'Maxi Dresses', count: 8901 },
          { name: 'Midi Dresses', count: 6789 },
          { name: 'Mini Dresses', count: 4567 },
          { name: 'Sundresses', count: 7890 },
          { name: 'Wrap Dresses', count: 3210 },
          { name: 'Shirt Dresses', count: 5432 },
          { name: 'Casual Dresses', count: 12345 },
          { name: 'Party Dresses', count: 8765 },
          { name: 'Office Dresses', count: 6543 },
          { name: 'Casual Tops', count: 15678 },
          { name: 'Crop Tops', count: 9876 },
          { name: 'Tunics', count: 7654 },
          { name: 'Button-Down Blouses', count: 5432 },
          { name: 'Peplum Tops', count: 3210 },
          { name: 'Off-Shoulder Tops', count: 4567 },
          { name: 'Camisoles', count: 2890 },
          { name: 'Sleeveless Tops', count: 6789 },
          { name: 'Tank Tops', count: 8901 },
          { name: 'Formal Shirts', count: 7654 },
          { name: 'Graphic Tees', count: 12345 },
          { name: 'Plain Tees', count: 18976 },
          { name: 'V-Neck Tees', count: 8765 },
          { name: 'Long Sleeve Tees', count: 6543 },
          { name: 'Henley Tees', count: 4321 },
          { name: 'Polo Shirts', count: 9876 },
          { name: 'Skinny Jeans', count: 15678 },
          { name: 'Straight-Leg Jeans', count: 12345 },
          { name: 'Bootcut Jeans', count: 7890 },
          { name: 'Wide-Leg Jeans', count: 5432 },
          { name: 'Dress Trousers', count: 8765 },
          { name: 'Wide-Leg Trousers', count: 6543 },
          { name: 'Cropped Trousers', count: 4321 },
          { name: 'Palazzo Trousers', count: 5678 },
          { name: 'Workout Leggings', count: 9876 },
          { name: 'Fashion Leggings', count: 7654 },
          { name: 'Jeggings', count: 6789 },
          { name: 'High-Waisted Leggings', count: 8901 },
          { name: 'Denim Shorts', count: 7890 },
          { name: 'Bermuda Shorts', count: 5432 },
          { name: 'High-Waisted Shorts', count: 6543 },
          { name: 'Athletic Shorts', count: 4321 },
          { name: 'A-Line Skirts', count: 8765 },
          { name: 'Pencil Skirts', count: 6789 },
          { name: 'Maxi Skirts', count: 5678 },
          { name: 'Mini Skirts', count: 4567 },
          { name: 'Midi Skirts', count: 7890 },
          { name: 'Pleated Skirts', count: 3456 },
          { name: 'Wrap Skirts', count: 2890 },
          { name: 'Pantsuits', count: 3210 },
          { name: 'Skirt Suits', count: 2345 },
          { name: 'Blazers', count: 6789 },
          { name: 'Tailored Blazers', count: 4567 },
          { name: 'Double-Breasted Blazers', count: 2890 },
          { name: 'Casual Blazers', count: 5432 }
        ]
      },
      'childrens-clothing': {
        name: "Children's Clothing",
        subcategories: [
          { name: 'Bodysuits', count: 5678 },
          { name: 'Rompers', count: 6789 },
          { name: 'Onesies', count: 8901 },
          { name: 'Baby Dresses', count: 4567 },
          { name: 'Baby Sweaters', count: 3456 },
          { name: 'Baby Jackets', count: 2890 },
          { name: 'Baby Pajamas', count: 7890 },
          { name: 'Baby Hats and Caps', count: 5432 },
          { name: 'Booties and Socks', count: 9876 },
          { name: 'Boys T-Shirts', count: 12345 },
          { name: 'Boys Dress Shirts', count: 6789 },
          { name: 'Boys Casual Shirts', count: 8765 },
          { name: 'Boys Polo Shirts', count: 5432 },
          { name: 'Boys Hoodies', count: 7890 },
          { name: 'Boys Sweatshirts', count: 6543 },
          { name: 'Boys Jeans', count: 9876 },
          { name: 'Boys Trousers', count: 7654 },
          { name: 'Boys Chinos', count: 4321 },
          { name: 'Boys Shorts', count: 8901 },
          { name: 'Boys Joggers', count: 5678 },
          { name: 'Boys Sweaters', count: 3456 },
          { name: 'Boys Cardigans', count: 2890 },
          { name: 'Boys Suits', count: 1567 },
          { name: 'Boys Blazers', count: 2345 },
          { name: 'Boys Jackets', count: 4567 },
          { name: 'Boys Coats', count: 3210 },
          { name: 'Girls Casual Dresses', count: 12345 },
          { name: 'Girls Party Dresses', count: 8765 },
          { name: 'Girls School Dresses', count: 6789 },
          { name: 'Girls Skirts', count: 5432 },
          { name: 'Girls T-Shirts', count: 15678 },
          { name: 'Girls Tops', count: 9876 },
          { name: 'Girls Blouses', count: 6543 },
          { name: 'Girls Tank Tops', count: 7890 },
          { name: 'Girls Jeans', count: 11234 },
          { name: 'Girls Leggings', count: 13456 },
          { name: 'Girls Trousers', count: 7654 },
          { name: 'Girls Shorts', count: 8901 },
          { name: 'Girls Sweaters', count: 5678 },
          { name: 'Girls Cardigans', count: 4321 },
          { name: 'Girls Hoodies', count: 7890 },
          { name: 'Girls Sweatshirts', count: 6543 },
          { name: 'Girls Jackets', count: 5432 },
          { name: 'Girls Coats', count: 3456 },
          { name: 'Teen Girls T-Shirts', count: 9876 },
          { name: 'Teen Girls Tops', count: 8765 },
          { name: 'Teen Girls Dresses', count: 7654 },
          { name: 'Teen Girls Jeans', count: 12345 },
          { name: 'Teen Girls Pants', count: 6789 },
          { name: 'Teen Girls Hoodies', count: 8901 },
          { name: 'Teen Girls Sweatshirts', count: 5678 },
          { name: 'Teen Girls Activewear', count: 6543 },
          { name: 'Teen Boys T-Shirts', count: 11234 },
          { name: 'Teen Boys Polos', count: 7890 },
          { name: 'Teen Boys Jeans', count: 13456 },
          { name: 'Teen Boys Pants', count: 8765 },
          { name: 'Teen Boys Hoodies', count: 9876 },
          { name: 'Teen Boys Sweatshirts', count: 6789 },
          { name: 'Teen Boys Activewear', count: 7654 },
          { name: 'Teen Boys Casual Shirts', count: 5432 }
        ]
      },
      'activewear-sportswear': {
        name: "Activewear & Sportswear",
        subcategories: [
          { name: 'Gym Shirts', count: 8765 },
          { name: 'Tank Tops', count: 7654 },
          { name: 'Training Shorts', count: 9876 },
          { name: 'Compression Wear', count: 5432 },
          { name: 'Track Pants', count: 6789 },
          { name: 'Training Hoodies', count: 4321 },
          { name: 'Sweatshirts', count: 8901 },
          { name: 'Running Shorts', count: 7890 },
          { name: 'Athletic Shirts', count: 6543 },
          { name: 'Compression Tights', count: 5678 },
          { name: 'Track Jackets', count: 4567 },
          { name: 'Performance Tees', count: 7890 },
          { name: 'Sports Bras', count: 12345 },
          { name: 'Workout Tops', count: 9876 },
          { name: 'Athletic Tanks', count: 8765 },
          { name: 'Yoga Pants', count: 15678 },
          { name: 'Running Tights', count: 11234 },
          { name: 'Athletic Shorts', count: 7654 },
          { name: 'Track Jackets', count: 5432 },
          { name: 'Yoga Sets', count: 6789 },
          { name: 'Leggings', count: 18976 },
          { name: 'Sports Tops', count: 8901 },
          { name: 'Fitness Wear', count: 7890 },
          { name: 'Kids Athletic Shirts', count: 4567 },
          { name: 'Kids Sports Shorts', count: 3456 },
          { name: 'Kids Track Suits', count: 5678 },
          { name: 'Kids Team Jerseys', count: 2890 }
        ]
      },
      'sleepwear-loungewear': {
        name: "Sleepwear & Loungewear",
        subcategories: [
          { name: 'Men\'s Pajama Sets', count: 8765 },
          { name: 'Men\'s Nightshirts', count: 4321 },
          { name: 'Men\'s Lounge Pants', count: 6789 },
          { name: 'Men\'s Sleep Shorts', count: 5432 },
          { name: 'Men\'s Robes', count: 3456 },
          { name: 'Men\'s Cotton Pajamas', count: 7890 },
          { name: 'Men\'s Silk Pajamas', count: 2345 },
          { name: 'Women\'s Pajama Sets', count: 12345 },
          { name: 'Women\'s Nightgowns', count: 8901 },
          { name: 'Women\'s Sleep Shirts', count: 6543 },
          { name: 'Women\'s Robes', count: 7654 },
          { name: 'Women\'s Lounge Pants', count: 9876 },
          { name: 'Women\'s Sleep Shorts', count: 5678 },
          { name: 'Women\'s Loungewear Sets', count: 8765 },
          { name: 'Kids Pajama Sets', count: 7890 },
          { name: 'Kids Nightgowns', count: 4567 },
          { name: 'Kids Sleep Shirts', count: 3456 },
          { name: 'Character Pajamas', count: 9876 },
          { name: 'Footed Sleepers', count: 5432 },
          { name: 'Kids Rompers', count: 6789 }
        ]
      },
      'swimwear': {
        name: "Swimwear",
        subcategories: [
          { name: 'Men\'s Board Shorts', count: 4567 },
          { name: 'Men\'s Swim Briefs', count: 2890 },
          { name: 'Men\'s Swim Trunks', count: 6789 },
          { name: 'Men\'s Rash Guards', count: 3456 },
          { name: 'Women\'s Bikinis', count: 8765 },
          { name: 'Women\'s One-Piece Swimsuits', count: 6543 },
          { name: 'Women\'s Tankinis', count: 4321 },
          { name: 'Women\'s Swim Dresses', count: 2345 },
          { name: 'Women\'s Cover-Ups', count: 5678 },
          { name: 'Women\'s Rash Guards', count: 3210 },
          { name: 'Boys\' Swim Trunks', count: 4567 },
          { name: 'Girls\' Swimsuits', count: 5432 },
          { name: 'Kids\' Rash Guards', count: 2890 },
          { name: 'Kids\' Swim Shorts', count: 3456 }
        ]
      },
      'intimates-undergarments': {
        name: "Intimates & Undergarments",
        subcategories: [
          { name: 'Everyday Bras', count: 12345 },
          { name: 'T-Shirt Bras', count: 9876 },
          { name: 'Sports Bras', count: 8765 },
          { name: 'Push-Up Bras', count: 6789 },
          { name: 'Strapless Bras', count: 4567 },
          { name: 'Minimizer Bras', count: 3456 },
          { name: 'Nursing Bras', count: 2890 },
          { name: 'Bralettes', count: 7890 },
          { name: 'Briefs', count: 15678 },
          { name: 'Thongs', count: 7654 },
          { name: 'Boyshorts', count: 6543 },
          { name: 'Bikini Panties', count: 8901 },
          { name: 'Hipster Panties', count: 5432 },
          { name: 'High-Cut Panties', count: 4321 },
          { name: 'Shapewear Bodysuits', count: 3210 },
          { name: 'Waist Cinchers', count: 2345 },
          { name: 'Control Briefs', count: 4567 },
          { name: 'Shaping Slips', count: 2890 },
          { name: 'Thigh Shapers', count: 1567 },
          { name: 'Men\'s Boxers', count: 9876 },
          { name: 'Men\'s Boxer Briefs', count: 12345 },
          { name: 'Men\'s Briefs', count: 8765 },
          { name: 'Men\'s Trunks', count: 6789 },
          { name: 'Men\'s Undershirts', count: 7890 },
          { name: 'Men\'s Thermal Sets', count: 3456 },
          { name: 'Women\'s Thermal Sets', count: 4567 },
          { name: 'Kids\' Thermal Sets', count: 2890 },
          { name: 'Thermal Tops', count: 5432 },
          { name: 'Thermal Bottoms', count: 4321 }
        ]
      },
      'seasonal-weather': {
        name: "Seasonal & Weather Specific",
        subcategories: [
          { name: 'Light Cotton Shirts', count: 12345 },
          { name: 'Sleeveless Tops', count: 9876 },
          { name: 'Light Trousers', count: 7890 },
          { name: 'Summer Dresses', count: 8765 },
          { name: 'Summer Kurta Pajamas', count: 6789 },
          { name: 'Tank Tops', count: 11234 },
          { name: 'Linen Shirts', count: 5432 },
          { name: 'Waterproof Jackets', count: 4567 },
          { name: 'Quick-Dry Pants', count: 3456 },
          { name: 'Rain Jackets', count: 5678 },
          { name: 'Raincoats', count: 6543 },
          { name: 'Windbreakers', count: 4321 },
          { name: 'Water-Resistant Clothing', count: 3210 },
          { name: 'Light Sweaters', count: 8901 },
          { name: 'Winter Jackets', count: 7654 },
          { name: 'Shawls and Wraps', count: 5432 },
          { name: 'Gloves', count: 3456 },
          { name: 'Hats and Caps', count: 6789 },
          { name: 'Beanies', count: 4567 },
          { name: 'Scarves', count: 8765 },
          { name: 'Fleece Jackets', count: 5678 }
        ]
      },
      'festival-special': {
        name: "Festival & Special Occasion",
        subcategories: [
          { name: 'Eid Panjabi', count: 8765 },
          { name: 'Eid Saree', count: 6789 },
          { name: 'Eid Salwar Kameez', count: 9876 },
          { name: 'Eid Kurtas', count: 7654 },
          { name: 'Eid Lehenga', count: 4567 },
          { name: 'Children\'s Eid Wear', count: 5432 },
          { name: 'Traditional White Saree with Red Border', count: 3456 },
          { name: 'White Panjabi with Red Embroidery', count: 4321 },
          { name: 'Pohela Boishakh Kurtas', count: 2890 },
          { name: 'Traditional Bangladeshi Outfits', count: 3210 },
          { name: 'Wedding Sarees', count: 5678 },
          { name: 'Bridal Lehengas', count: 3456 },
          { name: 'Wedding Sherwanis', count: 2345 },
          { name: 'Party Dresses', count: 8901 },
          { name: 'Cocktail Outfits', count: 4567 },
          { name: 'Reception Wear', count: 3210 },
          { name: 'Prayer Caps', count: 2890 },
          { name: 'Religious Robes', count: 1567 },
          { name: 'Modest Wear', count: 4321 },
          { name: 'Traditional Religious Clothing', count: 2345 }
        ]
      },
      'accessories-addons': {
        name: "Accessories & Add-ons",
        subcategories: [
          { name: 'Scarves & Hijabs', count: 8765 },
          { name: 'Belts', count: 12345 },
          { name: 'Hair Accessories', count: 6789 },
          { name: 'Fashion Jewelry', count: 9876 },
          { name: 'Handbags & Purses', count: 15678 },
          { name: 'Dupattas', count: 7890 },
          { name: 'Traditional Jewelry', count: 5432 },
          { name: 'Bangles', count: 6543 },
          { name: 'Ethnic Bags', count: 4321 },
          { name: 'Traditional Footwear', count: 8901 }
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
