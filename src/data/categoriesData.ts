
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
