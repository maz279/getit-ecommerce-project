
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
    count: 5847,
    featured: true,
    subcategories: {
      'womens-fashion': {
        name: "Women's Fashion",
        subcategories: [
          {
            name: 'Traditional Wear',
            count: 1245,
            items: [
              'Cotton Saree', 'Silk Saree (Dhakai, Rajshahi, Tangail)', 'Tant Saree', 
              'Handloom Saree', 'Designer Saree', 'Printed Saree', 'Embroidered Saree',
              'Party Wear Saree', 'Casual Saree', 'Bridal Saree'
            ]
          },
          {
            name: 'Salwar Kameez',
            count: 892,
            items: [
              'Three Piece Set', 'Two Piece Set', 'Straight Cut', 'A-Line Cut',
              'Palazzo Set', 'Churidar Set', 'Anarkali Set', 'Pakistani Style',
              'Dhaka Style', 'Party Wear Salwar'
            ]
          },
          {
            name: 'Kurti & Tops',
            count: 674,
            items: [
              'Cotton Kurti', 'Silk Kurti', 'Embroidered Kurti', 'Printed Kurti',
              'Long Kurti', 'Short Kurti', 'Party Wear Kurti', 'Casual Kurti',
              'Ethnic Tops', 'Indo-Western Tops'
            ]
          },
          {
            name: 'Western Wear',
            count: 523,
            items: [
              'Casual Tops', 'Formal Blouses', 'Tank Tops', 'Crop Tops', 'Tunics',
              'Jeans', 'Trousers', 'Leggings', 'Palazzo Pants', 'Shorts', 'Skirts',
              'Casual Dresses', 'Party Dresses', 'Maxi Dresses', 'Mini Dresses'
            ]
          },
          {
            name: 'Islamic Wear',
            count: 387,
            items: [
              'Cotton Hijab', 'Chiffon Hijab', 'Silk Hijab', 'Printed Hijab',
              'Traditional Burkha', 'Modern Abaya', 'Front Open Abaya',
              'Butterfly Abaya', 'Party Wear Abaya', 'Casual Burkha'
            ]
          },
          {
            name: 'Innerwear & Sleepwear',
            count: 234,
            items: [
              'Bras', 'Panties', 'Shapewear', 'Camisoles', 'Slips',
              'Nighties', 'Pajama Sets', 'Nightgowns', 'Robes'
            ]
          },
          {
            name: 'Maternity Wear',
            count: 156,
            items: [
              'Maternity Tops', 'Maternity Bottoms', 'Maternity Dresses',
              'Nursing Wear', 'Maternity Innerwear'
            ]
          }
        ]
      },
      'mens-fashion': {
        name: "Men's Fashion",
        subcategories: [
          {
            name: 'Traditional Wear',
            count: 834,
            items: [
              'Cotton Panjabi', 'Silk Panjabi', 'Linen Panjabi', 'Embroidered Panjabi',
              'Printed Panjabi', 'Plain Panjabi', 'Full Sleeve Panjabi', 'Half Sleeve Panjabi',
              'Cotton Lungi', 'Check Lungi', 'Printed Lungi', 'Silk Dhoti', 'Cotton Dhoti'
            ]
          },
          {
            name: 'Western Wear',
            count: 612,
            items: [
              'Formal Shirts', 'Casual Shirts', 'Polo Shirts', 'T-Shirts', 'Tank Tops',
              'Formal Pants', 'Chinos', 'Jeans', 'Cargo Pants', 'Shorts',
              'Business Suits', 'Casual Blazers', 'Tuxedos', 'Waistcoats'
            ]
          },
          {
            name: 'Ethnic & Fusion',
            count: 298,
            items: [
              'Cotton Kurta', 'Silk Kurta', 'Linen Kurta', 'Designer Kurta', 'Nehru Jackets'
            ]
          },
          {
            name: 'Innerwear & Sleepwear',
            count: 187,
            items: [
              'Vests', 'Briefs', 'Boxers', 'Trunk', 'Thermals',
              'Pajama Sets', 'Night Suits', 'Robes'
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
    count: 2847,
    featured: true,
    subcategories: {
      'mobile-tablets': {
        name: 'Mobile & Tablets',
        subcategories: [
          {
            name: 'Smartphones',
            count: 456,
            items: ['Android Phones', 'iPhones', 'Feature Phones', 'Gaming Phones']
          },
          {
            name: 'Tablets',
            count: 123,
            items: ['iPad', 'Android Tablets', 'Windows Tablets', 'E-readers']
          }
        ]
      },
      'computers': {
        name: 'Computers',
        subcategories: [
          {
            name: 'Laptops',
            count: 234,
            items: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'Chromebooks']
          },
          {
            name: 'Desktops',
            count: 145,
            items: ['Gaming PCs', 'All-in-One PCs', 'Workstations', 'Mini PCs']
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
    count: 1456,
    featured: true,
    subcategories: {
      'furniture': {
        name: 'Furniture',
        subcategories: [
          {
            name: 'Living Room',
            count: 234,
            items: ['Sofas', 'Coffee Tables', 'TV Units', 'Recliners']
          },
          {
            name: 'Bedroom',
            count: 189,
            items: ['Beds', 'Mattresses', 'Wardrobes', 'Dressing Tables']
          }
        ]
      }
    }
  }
];
