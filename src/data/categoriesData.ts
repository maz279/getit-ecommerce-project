export interface SubCategory {
  name: string;
  items: string[];
  count: number;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  count: number;
  featured: boolean;
  subcategories: {
    [key: string]: {
      name: string;
      subcategories: SubCategory[];
    };
  };
}

import React from 'react';
import { 
  Shirt, ShoppingBag, Home, Car, Baby, Heart,
  Coffee, Book, Dumbbell, Paintbrush, Music, Gift,
  Smartphone, Laptop, Camera, Watch, Gamepad2, Headphones
} from 'lucide-react';

export const categoriesData: MainCategory[] = [
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: React.createElement(Shirt, { className: "w-8 h-8" }),
    color: 'text-red-500',
    count: 12847,
    featured: true,
    subcategories: {
      'womens-fashion': {
        name: "Women's Fashion",
        subcategories: [
          {
            name: 'Traditional Wear',
            count: 1845,
            items: [
              'Cotton Saree', 'Silk Saree (Dhakai, Rajshahi, Tangail)', 'Tant Saree', 
              'Handloom Saree', 'Designer Saree', 'Printed Saree', 'Embroidered Saree',
              'Party Wear Saree', 'Casual Saree', 'Bridal Saree', 'Georgette Saree',
              'Chiffon Saree', 'Net Saree', 'Bandhani Saree', 'Kanjivaram Saree'
            ]
          },
          {
            name: 'Salwar Kameez',
            count: 1392,
            items: [
              'Three Piece Set', 'Two Piece Set', 'Straight Cut', 'A-Line Cut',
              'Palazzo Set', 'Churidar Set', 'Anarkali Set', 'Pakistani Style',
              'Dhaka Style', 'Party Wear Salwar', 'Designer Suits', 'Cotton Suits',
              'Silk Suits', 'Georgette Suits', 'Sharara Set', 'Gharara Set'
            ]
          },
          {
            name: 'Kurti & Tops',
            count: 974,
            items: [
              'Cotton Kurti', 'Silk Kurti', 'Embroidered Kurti', 'Printed Kurti',
              'Long Kurti', 'Short Kurti', 'Party Wear Kurti', 'Casual Kurti',
              'Ethnic Tops', 'Indo-Western Tops', 'Designer Kurti', 'Angrakha Style',
              'High-Low Hem Kurti', 'Asymmetrical Kurti', 'Tunic Tops'
            ]
          },
          {
            name: 'Western Wear',
            count: 823,
            items: [
              'Casual Tops', 'Formal Blouses', 'Tank Tops', 'Crop Tops', 'Tunics',
              'Jeans', 'Trousers', 'Leggings', 'Palazzo Pants', 'Shorts', 'Skirts',
              'Casual Dresses', 'Party Dresses', 'Maxi Dresses', 'Mini Dresses',
              'Midi Dresses', 'Jumpsuit', 'Rompers', 'Blazers', 'Cardigans'
            ]
          },
          {
            name: 'Islamic Wear',
            count: 687,
            items: [
              'Cotton Hijab', 'Chiffon Hijab', 'Silk Hijab', 'Printed Hijab',
              'Traditional Burkha', 'Modern Abaya', 'Front Open Abaya',
              'Butterfly Abaya', 'Party Wear Abaya', 'Casual Burkha',
              'Niqab', 'Prayer Dress', 'Modest Wear', 'Long Cardigans'
            ]
          },
          {
            name: 'Innerwear & Sleepwear',
            count: 434,
            items: [
              'Bras', 'Panties', 'Shapewear', 'Camisoles', 'Slips',
              'Nighties', 'Pajama Sets', 'Nightgowns', 'Robes',
              'Sports Bra', 'Cotton Underwear', 'Silk Nightwear', 'Loungewear'
            ]
          },
          {
            name: 'Maternity Wear',
            count: 256,
            items: [
              'Maternity Tops', 'Maternity Bottoms', 'Maternity Dresses',
              'Nursing Wear', 'Maternity Innerwear', 'Maternity Saree',
              'Maternity Kurti', 'Nursing Bra', 'Maternity Pajamas'
            ]
          },
          {
            name: 'Accessories',
            count: 892,
            items: [
              'Handbags', 'Clutches', 'Wallets', 'Belts', 'Scarves',
              'Jewelry', 'Watches', 'Sunglasses', 'Hair Accessories',
              'Footwear', 'Sandals', 'Heels', 'Flats', 'Boots'
            ]
          },
          {
            name: 'Plus Size',
            count: 345,
            items: [
              'Plus Size Kurti', 'Plus Size Saree', 'Plus Size Western Wear',
              'Plus Size Salwar', 'Plus Size Tops', 'Plus Size Dresses',
              'Plus Size Innerwear', 'Plus Size Activewear'
            ]
          }
        ]
      },
      'mens-fashion': {
        name: "Men's Fashion",
        subcategories: [
          {
            name: 'Traditional Wear',
            count: 1234,
            items: [
              'Cotton Panjabi', 'Silk Panjabi', 'Linen Panjabi', 'Embroidered Panjabi',
              'Printed Panjabi', 'Plain Panjabi', 'Full Sleeve Panjabi', 'Half Sleeve Panjabi',
              'Cotton Lungi', 'Check Lungi', 'Printed Lungi', 'Silk Dhoti', 'Cotton Dhoti',
              'Fatua', 'Kurta Pajama Set', 'Sherwani', 'Nehru Jacket'
            ]
          },
          {
            name: 'Western Wear',
            count: 912,
            items: [
              'Formal Shirts', 'Casual Shirts', 'Polo Shirts', 'T-Shirts', 'Tank Tops',
              'Formal Pants', 'Chinos', 'Jeans', 'Cargo Pants', 'Shorts',
              'Business Suits', 'Casual Blazers', 'Tuxedos', 'Waistcoats',
              'Hoodies', 'Sweatshirts', 'Track Suits'
            ]
          },
          {
            name: 'Ethnic & Fusion',
            count: 498,
            items: [
              'Cotton Kurta', 'Silk Kurta', 'Linen Kurta', 'Designer Kurta', 'Nehru Jackets',
              'Bandhgala', 'Indo-Western Shirts', 'Dhoti Pants', 'Ethnic Jackets'
            ]
          },
          {
            name: 'Innerwear & Sleepwear',
            count: 387,
            items: [
              'Vests', 'Briefs', 'Boxers', 'Trunk', 'Thermals',
              'Pajama Sets', 'Night Suits', 'Robes', 'Loungewear',
              'Cotton Underwear', 'Sports Underwear'
            ]
          },
          {
            name: 'Activewear & Sports',
            count: 567,
            items: [
              'Gym T-Shirts', 'Sports Shorts', 'Track Pants', 'Compression Wear',
              'Running Shoes', 'Sports Bra', 'Yoga Pants', 'Swimming Wear',
              'Cycling Shorts', 'Basketball Jerseys', 'Football Jerseys'
            ]
          },
          {
            name: 'Accessories',
            count: 723,
            items: [
              'Belts', 'Wallets', 'Watches', 'Sunglasses', 'Ties',
              'Bow Ties', 'Cufflinks', 'Shoes', 'Sneakers', 'Formal Shoes',
              'Casual Shoes', 'Sandals', 'Bags', 'Backpacks'
            ]
          }
        ]
      },
      'kids-fashion': {
        name: "Kids Fashion",
        subcategories: [
          {
            name: 'Boys Clothing',
            count: 645,
            items: [
              'Boys T-Shirts', 'Boys Shirts', 'Boys Pants', 'Boys Shorts',
              'Boys Traditional Wear', 'Boys Panjabi', 'Boys Fatua',
              'Boys Pajamas', 'Boys Innerwear', 'Boys Party Wear'
            ]
          },
          {
            name: 'Girls Clothing',
            count: 734,
            items: [
              'Girls Dresses', 'Girls Tops', 'Girls Skirts', 'Girls Pants',
              'Girls Traditional Wear', 'Girls Saree', 'Girls Salwar',
              'Girls Kurti', 'Girls Party Wear', 'Girls Innerwear'
            ]
          },
          {
            name: 'Baby Clothing',
            count: 456,
            items: [
              'Baby Onesies', 'Baby Rompers', 'Baby Sleepwear', 'Baby Bibs',
              'Baby Caps', 'Baby Socks', 'Baby Mittens', 'Baby Blankets',
              'Baby Bodysuits', 'Baby Diapers'
            ]
          },
          {
            name: 'Kids Footwear',
            count: 345,
            items: [
              'Kids Sneakers', 'Kids Sandals', 'Kids Formal Shoes',
              'Kids Boots', 'Kids Slippers', 'Baby Shoes', 'School Shoes'
            ]
          }
        ]
      },
      'footwear': {
        name: "Footwear",
        subcategories: [
          {
            name: 'Mens Footwear',
            count: 567,
            items: [
              'Formal Shoes', 'Casual Shoes', 'Sneakers', 'Sandals',
              'Boots', 'Loafers', 'Sports Shoes', 'Flip Flops',
              'Traditional Footwear', 'Safety Shoes'
            ]
          },
          {
            name: 'Womens Footwear',
            count: 678,
            items: [
              'Heels', 'Flats', 'Sandals', 'Sneakers', 'Boots',
              'Wedges', 'Pumps', 'Ballet Flats', 'Ankle Boots',
              'Traditional Footwear', 'Sports Shoes'
            ]
          },
          {
            name: 'Kids Footwear',
            count: 234,
            items: [
              'Kids Sneakers', 'Kids Sandals', 'Kids Formal Shoes',
              'Kids Boots', 'School Shoes', 'Baby Shoes'
            ]
          }
        ]
      },
      'bags-luggage': {
        name: "Bags & Luggage",
        subcategories: [
          {
            name: 'Handbags',
            count: 456,
            items: [
              'Shoulder Bags', 'Tote Bags', 'Clutches', 'Crossbody Bags',
              'Evening Bags', 'Hobo Bags', 'Satchels', 'Bucket Bags'
            ]
          },
          {
            name: 'Backpacks',
            count: 345,
            items: [
              'School Backpacks', 'Laptop Backpacks', 'Travel Backpacks',
              'Hiking Backpacks', 'College Bags', 'Office Bags'
            ]
          },
          {
            name: 'Luggage',
            count: 234,
            items: [
              'Suitcases', 'Travel Bags', 'Duffel Bags', 'Carry-on Bags',
              'Hard Shell Luggage', 'Soft Shell Luggage', 'Trolley Bags'
            ]
          },
          {
            name: 'Wallets & Accessories',
            count: 123,
            items: [
              'Mens Wallets', 'Womens Wallets', 'Card Holders',
              'Money Clips', 'Passport Holders', 'Key Chains'
            ]
          }
        ]
      }
    }
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: React.createElement(Smartphone, { className: "w-8 h-8" }),
    color: 'text-blue-500',
    count: 8947,
    featured: true,
    subcategories: {
      'mobile-tablets': {
        name: 'Mobile & Tablets',
        subcategories: [
          {
            name: 'Smartphones',
            count: 1456,
            items: [
              'Android Phones', 'iPhones', 'Samsung Galaxy', 'Xiaomi Phones', 'OnePlus Phones',
              'Huawei Phones', 'Oppo Phones', 'Vivo Phones', 'Realme Phones', 'Nokia Phones',
              'Google Pixel', 'Gaming Phones', 'Rugged Phones', 'Dual SIM Phones',
              'Unlocked Phones', 'Refurbished Phones', 'Budget Smartphones', 'Flagship Phones'
            ]
          },
          {
            name: 'Tablets',
            count: 523,
            items: [
              'iPad', 'iPad Pro', 'iPad Air', 'iPad Mini', 'Android Tablets',
              'Samsung Galaxy Tab', 'Huawei Tablets', 'Lenovo Tablets', 'Microsoft Surface',
              'Windows Tablets', 'E-readers', 'Kindle', 'Drawing Tablets', 'Kids Tablets'
            ]
          },
          {
            name: 'Mobile Accessories',
            count: 834,
            items: [
              'Phone Cases', 'Screen Protectors', 'Phone Chargers', 'Power Banks',
              'Car Chargers', 'Wireless Chargers', 'Phone Holders', 'Selfie Sticks',
              'Phone Grips', 'Camera Lens Attachments', 'Phone Rings', 'Cable Organizers',
              'Bluetooth Adapters', 'Phone Stands', 'Waterproof Cases'
            ]
          },
          {
            name: 'Smartwatches & Wearables',
            count: 345,
            items: [
              'Apple Watch', 'Samsung Galaxy Watch', 'Fitbit', 'Garmin Watches',
              'Xiaomi Mi Band', 'Amazfit Watches', 'Fossil Smartwatches', 'Fitness Trackers',
              'Smart Bands', 'Kids Smartwatches', 'Hybrid Smartwatches', 'Sport Watches'
            ]
          }
        ]
      },
      'computers': {
        name: 'Computers & Laptops',
        subcategories: [
          {
            name: 'Laptops',
            count: 734,
            items: [
              'Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'MacBooks',
              'Chromebooks', 'Budget Laptops', '2-in-1 Laptops', 'Workstation Laptops',
              'Student Laptops', 'Lightweight Laptops', 'High Performance Laptops',
              'Touchscreen Laptops', 'Refurbished Laptops', 'Laptop Bags'
            ]
          },
          {
            name: 'Desktop Computers',
            count: 445,
            items: [
              'Gaming PCs', 'All-in-One PCs', 'Business Desktops', 'Workstations',
              'Mini PCs', 'Budget Desktops', 'Custom Built PCs', 'Refurbished Desktops',
              'Home Office PCs', 'Media Center PCs', 'Server Computers'
            ]
          },
          {
            name: 'Computer Components',
            count: 623,
            items: [
              'Processors (CPU)', 'Graphics Cards (GPU)', 'Motherboards', 'RAM Memory',
              'Storage (SSD/HDD)', 'Power Supplies', 'Computer Cases', 'Cooling Systems',
              'Sound Cards', 'Network Cards', 'Optical Drives', 'Computer Cables'
            ]
          },
          {
            name: 'Computer Accessories',
            count: 556,
            items: [
              'Keyboards', 'Computer Mice', 'Monitors', 'Speakers', 'Webcams',
              'Microphones', 'USB Hubs', 'External Hard Drives', 'Laptop Stands',
              'Mouse Pads', 'Monitor Arms', 'KVM Switches', 'Cable Management',
              'Laptop Cooling Pads', 'Docking Stations'
            ]
          }
        ]
      },
      'audio-video': {
        name: 'Audio & Video',
        subcategories: [
          {
            name: 'Headphones & Earphones',
            count: 678,
            items: [
              'Wireless Earbuds', 'Bluetooth Headphones', 'Gaming Headsets', 'Studio Headphones',
              'In-ear Headphones', 'Over-ear Headphones', 'Noise Cancelling Headphones',
              'Sports Earphones', 'Kids Headphones', 'Wireless Headphones', 'Wired Earphones'
            ]
          },
          {
            name: 'Speakers & Sound Systems',
            count: 445,
            items: [
              'Bluetooth Speakers', 'Smart Speakers', 'Soundbars', 'Home Theater Systems',
              'Portable Speakers', 'Computer Speakers', 'Bookshelf Speakers', 'Subwoofers',
              'Outdoor Speakers', 'Ceiling Speakers', 'Audio Receivers', 'Amplifiers'
            ]
          },
          {
            name: 'Cameras & Photography',
            count: 567,
            items: [
              'DSLR Cameras', 'Mirrorless Cameras', 'Action Cameras', 'Security Cameras',
              'Instant Cameras', 'Digital Cameras', 'Camera Lenses', 'Tripods',
              'Camera Bags', 'Memory Cards', 'Camera Batteries', 'Flash Units',
              'Camera Filters', 'Selfie Sticks', 'Camera Straps'
            ]
          },
          {
            name: 'TVs & Displays',
            count: 389,
            items: [
              'Smart TVs', 'LED TVs', 'OLED TVs', 'QLED TVs', '4K TVs', '8K TVs',
              'Gaming Monitors', 'Computer Monitors', 'Projectors', 'TV Mounts',
              'TV Stands', 'Streaming Devices', 'TV Antennas', 'HDMI Cables'
            ]
          }
        ]
      },
      'gaming': {
        name: 'Gaming',
        subcategories: [
          {
            name: 'Gaming Consoles',
            count: 234,
            items: [
              'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One',
              'Nintendo Switch', 'Nintendo Switch Lite', 'Retro Gaming Consoles',
              'Handheld Gaming Devices', 'VR Headsets', 'Gaming Accessories'
            ]
          },
          {
            name: 'Gaming Accessories',
            count: 456,
            items: [
              'Gaming Controllers', 'Gaming Keyboards', 'Gaming Mice', 'Gaming Headsets',
              'Gaming Chairs', 'Gaming Desks', 'Controller Chargers', 'Gaming Mouse Pads',
              'Game Storage', 'Gaming Cables', 'Racing Wheels', 'Flight Sticks'
            ]
          },
          {
            name: 'PC Gaming',
            count: 567,
            items: [
              'Gaming Laptops', 'Gaming Desktops', 'Graphics Cards', 'Gaming Monitors',
              'Mechanical Keyboards', 'Gaming Mice', 'Gaming Headsets', 'PC Game Controllers',
              'Gaming Speakers', 'Streaming Equipment', 'RGB Lighting', 'Gaming Software'
            ]
          }
        ]
      },
      'appliances': {
        name: 'Home Appliances',
        subcategories: [
          {
            name: 'Kitchen Appliances',
            count: 723,
            items: [
              'Refrigerators', 'Microwaves', 'Rice Cookers', 'Blenders', 'Food Processors',
              'Air Fryers', 'Electric Kettles', 'Coffee Makers', 'Toasters', 'Pressure Cookers',
              'Induction Cooktops', 'Stand Mixers', 'Juicers', 'Slow Cookers', 'Electric Grills'
            ]
          },
          {
            name: 'Cleaning Appliances',
            count: 445,
            items: [
              'Vacuum Cleaners', 'Robot Vacuums', 'Steam Mops', 'Carpet Cleaners',
              'Pressure Washers', 'Window Cleaners', 'Floor Polishers', 'Handheld Vacuums',
              'Wet & Dry Vacuums', 'Car Vacuums', 'Air Purifiers', 'Dehumidifiers'
            ]
          },
          {
            name: 'Personal Care Appliances',
            count: 334,
            items: [
              'Hair Dryers', 'Hair Straighteners', 'Hair Curlers', 'Electric Shavers',
              'Electric Toothbrushes', 'Facial Steamers', 'Massage Devices', 'Weight Scales',
              'Blood Pressure Monitors', 'Thermometers', 'Humidifiers', 'Essential Oil Diffusers'
            ]
          }
        ]
      }
    }
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icon: React.createElement(Home, { className: "w-8 h-8" }),
    color: 'text-green-500',
    count: 6456,
    featured: true,
    subcategories: {
      'furniture': {
        name: 'Furniture',
        subcategories: [
          {
            name: 'Living Room Furniture',
            count: 834,
            items: [
              'Sofas & Couches', 'Coffee Tables', 'TV Stands & Entertainment Centers', 'Recliners',
              'Sectional Sofas', 'Accent Chairs', 'Ottoman & Footstools', 'Side Tables',
              'Floor Lamps', 'Table Lamps', 'Bookshelves', 'Display Cabinets',
              'Living Room Sets', 'Bean Bags', 'Rocking Chairs', 'Media Storage'
            ]
          },
          {
            name: 'Bedroom Furniture',
            count: 689,
            items: [
              'Beds & Bed Frames', 'Mattresses', 'Wardrobes & Closets', 'Dressing Tables',
              'Nightstands', 'Chest of Drawers', 'Bedroom Sets', 'Headboards',
              'Mattress Toppers', 'Bed Linens', 'Pillows', 'Blankets & Comforters',
              'Bedroom Mirrors', 'Bedroom Lighting', 'Storage Benches', 'Armoires'
            ]
          },
          {
            name: 'Dining Room Furniture',
            count: 445,
            items: [
              'Dining Tables', 'Dining Chairs', 'Dining Sets', 'Bar Stools',
              'China Cabinets', 'Buffets & Sideboards', 'Bar Tables', 'Dining Benches',
              'Counter Height Tables', 'Outdoor Dining Sets', 'Kitchen Islands',
              'Wine Racks', 'Serving Carts', 'Dining Room Lighting'
            ]
          },
          {
            name: 'Office Furniture',
            count: 367,
            items: [
              'Office Chairs', 'Office Desks', 'Computer Desks', 'Filing Cabinets',
              'Office Storage', 'Bookshelves', 'Standing Desks', 'Executive Chairs',
              'Conference Tables', 'Reception Desks', 'Office Lighting', 'Desk Accessories',
              'Ergonomic Furniture', 'Home Office Sets', 'Office Partitions'
            ]
          },
          {
            name: 'Outdoor Furniture',
            count: 278,
            items: [
              'Patio Sets', 'Outdoor Chairs', 'Outdoor Tables', 'Garden Benches',
              'Outdoor Sofas', 'Umbrellas & Shade', 'Fire Pits', 'Outdoor Storage',
              'Hammocks', 'Swing Sets', 'Pool Furniture', 'Outdoor Cushions',
              'Gazebos & Pergolas', 'Outdoor Rugs', 'Garden Stools'
            ]
          }
        ]
      },
      'home-decor': {
        name: 'Home Decor',
        subcategories: [
          {
            name: 'Wall Decor',
            count: 567,
            items: [
              'Wall Art & Paintings', 'Photo Frames', 'Wall Mirrors', 'Wall Stickers',
              'Canvas Prints', 'Metal Wall Art', 'Wooden Wall Decor', 'Wall Shelves',
              'Clocks', 'Wall Hooks', 'Tapestries', 'Wall Decals', 'Gallery Walls',
              'Religious Wall Art', 'Nature Prints', 'Abstract Art'
            ]
          },
          {
            name: 'Decorative Accessories',
            count: 723,
            items: [
              'Vases & Planters', 'Candles & Holders', 'Decorative Bowls', 'Figurines & Sculptures',
              'Table Centerpieces', 'Artificial Flowers', 'Decorative Trays', 'Picture Frames',
              'Decorative Pillows', 'Throw Blankets', 'Bookends', 'Decorative Boxes',
              'Wind Chimes', 'Lanterns', 'Seasonal Decor', 'Holiday Decorations'
            ]
          },
          {
            name: 'Lighting',
            count: 445,
            items: [
              'Ceiling Lights', 'Table Lamps', 'Floor Lamps', 'Wall Sconces',
              'Pendant Lights', 'Chandeliers', 'LED Lights', 'String Lights',
              'Night Lights', 'Desk Lamps', 'Outdoor Lighting', 'Smart Lighting',
              'Lamp Shades', 'Track Lighting', 'Under Cabinet Lighting', 'Solar Lights'
            ]
          },
          {
            name: 'Window Treatments',
            count: 334,
            items: [
              'Curtains & Drapes', 'Blinds', 'Shades', 'Valances',
              'Curtain Rods', 'Sheer Curtains', 'Blackout Curtains', 'Window Films',
              'Roman Shades', 'Venetian Blinds', 'Vertical Blinds', 'Roller Blinds',
              'Bamboo Blinds', 'Motorized Blinds', 'Curtain Tiebacks'
            ]
          }
        ]
      },
      'kitchen-dining': {
        name: 'Kitchen & Dining',
        subcategories: [
          {
            name: 'Cookware',
            count: 678,
            items: [
              'Pots & Pans', 'Non-stick Cookware', 'Stainless Steel Cookware', 'Cast Iron Cookware',
              'Pressure Cookers', 'Woks', 'Stockpots', 'Skillets & Frying Pans',
              'Saucepans', 'Dutch Ovens', 'Roasting Pans', 'Grill Pans',
              'Steamer Pots', 'Cookware Sets', 'Specialty Cookware'
            ]
          },
          {
            name: 'Kitchen Tools & Gadgets',
            count: 567,
            items: [
              'Knives & Cutlery', 'Cutting Boards', 'Mixing Bowls', 'Measuring Tools',
              'Can Openers', 'Peelers & Graters', 'Kitchen Scales', 'Timers',
              'Tongs & Spatulas', 'Whisks', 'Ladles', 'Kitchen Shears',
              'Mandoline Slicers', 'Food Storage', 'Spice Racks', 'Kitchen Organizers'
            ]
          },
          {
            name: 'Dinnerware',
            count: 445,
            items: [
              'Dinner Plates', 'Bowls', 'Cups & Mugs', 'Glassware',
              'Dinnerware Sets', 'Serving Dishes', 'Flatware', 'Serving Utensils',
              'Wine Glasses', 'Water Bottles', 'Travel Mugs', 'Kids Dinnerware',
              'Disposable Tableware', 'Melamine Dinnerware', 'Fine China'
            ]
          },
          {
            name: 'Food Storage',
            count: 356,
            items: [
              'Food Containers', 'Glass Storage', 'Plastic Storage', 'Vacuum Bags',
              'Lunch Boxes', 'Thermos Bottles', 'Food Wraps', 'Storage Jars',
              'Refrigerator Organizers', 'Freezer Bags', 'Airtight Containers',
              'Meal Prep Containers', 'Spice Containers', 'Pantry Storage'
            ]
          }
        ]
      },
      'bedding-bath': {
        name: 'Bedding & Bath',
        subcategories: [
          {
            name: 'Bedding',
            count: 534,
            items: [
              'Bed Sheets', 'Pillowcases', 'Comforters', 'Duvet Covers',
              'Blankets', 'Pillows', 'Mattress Protectors', 'Bed Skirts',
              'Quilts', 'Throw Pillows', 'Bedding Sets', 'Kids Bedding',
              'Luxury Bedding', 'Organic Bedding', 'Seasonal Bedding'
            ]
          },
          {
            name: 'Bath Towels & Linens',
            count: 423,
            items: [
              'Bath Towels', 'Hand Towels', 'Washcloths', 'Beach Towels',
              'Towel Sets', 'Bath Mats', 'Shower Curtains', 'Bath Rugs',
              'Luxury Towels', 'Quick Dry Towels', 'Organic Towels',
              'Kids Bath Towels', 'Travel Towels', 'Hair Towels'
            ]
          },
          {
            name: 'Bathroom Accessories',
            count: 367,
            items: [
              'Soap Dispensers', 'Toothbrush Holders', 'Toilet Paper Holders', 'Towel Bars',
              'Shower Caddies', 'Bath Organizers', 'Mirrors', 'Scales',
              'Trash Cans', 'Toilet Seat Covers', 'Shower Heads', 'Faucets',
              'Bathroom Storage', 'Medicine Cabinets', 'Bathroom Lighting'
            ]
          }
        ]
      },
      'garden-outdoor': {
        name: 'Garden & Outdoor',
        subcategories: [
          {
            name: 'Gardening Tools',
            count: 445,
            items: [
              'Hand Tools', 'Shovels & Spades', 'Pruning Tools', 'Watering Equipment',
              'Garden Hoses', 'Sprinklers', 'Wheelbarrows', 'Garden Gloves',
              'Lawn Mowers', 'Hedge Trimmers', 'Leaf Blowers', 'Garden Kneelers',
              'Tool Storage', 'Weeding Tools', 'Garden Tool Sets'
            ]
          },
          {
            name: 'Plants & Seeds',
            count: 678,
            items: [
              'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Succulents',
              'Herbs', 'Vegetable Seeds', 'Flower Seeds', 'Tree Seedlings',
              'Fruit Plants', 'Medicinal Plants', 'Air Purifying Plants',
              'Low Maintenance Plants', 'Rare Plants', 'Seasonal Plants'
            ]
          },
          {
            name: 'Planters & Pots',
            count: 356,
            items: [
              'Ceramic Pots', 'Plastic Planters', 'Wooden Planters', 'Metal Planters',
              'Hanging Planters', 'Self Watering Pots', 'Large Planters', 'Small Pots',
              'Decorative Planters', 'Indoor Planters', 'Outdoor Planters',
              'Window Boxes', 'Planter Sets', 'Smart Planters'
            ]
          },
          {
            name: 'Outdoor Decor',
            count: 289,
            items: [
              'Garden Statues', 'Water Fountains', 'Garden Lights', 'Wind Chimes',
              'Garden Stones', 'Outdoor Candles', 'Bird Feeders', 'Garden Signs',
              'Stepping Stones', 'Garden Borders', 'Outdoor Art', 'Solar Decor',
              'Weather Vanes', 'Garden Mirrors', 'Outdoor Sculptures'
            ]
          }
        ]
      },
      'storage-organization': {
        name: 'Storage & Organization',
        subcategories: [
          {
            name: 'Closet Organization',
            count: 423,
            items: [
              'Hangers', 'Closet Organizers', 'Shoe Racks', 'Storage Bins',
              'Closet Rods', 'Drawer Organizers', 'Garment Bags', 'Closet Shelving',
              'Tie & Belt Racks', 'Jewelry Organizers', 'Vacuum Storage Bags',
              'Cedar Blocks', 'Mothballs', 'Closet Deodorizers'
            ]
          },
          {
            name: 'Storage Furniture',
            count: 356,
            items: [
              'Storage Ottomans', 'Storage Benches', 'Bookcases', 'Storage Cabinets',
              'Hall Trees', 'Storage Trunks', 'Under Bed Storage', 'Storage Stools',
              'Wall Mounted Storage', 'Corner Storage', 'Multi-purpose Furniture',
              'Kids Storage Furniture', 'Bathroom Storage', 'Kitchen Storage'
            ]
          },
          {
            name: 'Garage & Utility',
            count: 267,
            items: [
              'Garage Storage', 'Tool Storage', 'Sports Equipment Storage', 'Utility Shelving',
              'Storage Racks', 'Pegboards', 'Garage Organizers', 'Workbenches',
              'Tool Chests', 'Storage Lockers', 'Overhead Storage', 'Wall Storage Systems',
              'Mobile Storage', 'Heavy Duty Storage', 'Industrial Storage'
            ]
          }
        ]
      }
    }
  }
];
