
import React from 'react';
import { Shirt } from 'lucide-react';
import { MainCategory } from '../categoriesData';

export const fashionData: MainCategory = {
  id: 'fashion',
  name: 'Fashion & Apparel',
  icon: React.createElement(Shirt, { className: "w-8 h-8" }),
  color: 'text-red-500',
  count: 15847,
  featured: true,
  subcategories: {
    'womens-fashion': {
      name: "Women's Fashion",
      subcategories: [
        {
          name: 'Traditional Wear',
          count: 2845,
          items: [
            // Saree
            'Cotton Saree', 'Silk Saree (Dhakai, Rajshahi, Tangail)', 'Tant Saree', 
            'Handloom Saree', 'Designer Saree', 'Printed Saree', 'Embroidered Saree',
            'Party Wear Saree', 'Casual Saree', 'Bridal Saree',
            // Salwar Kameez
            'Three Piece Set', 'Two Piece Set', 'Straight Cut', 'A-Line Cut',
            'Palazzo Set', 'Churidar Set', 'Anarkali Set', 'Pakistani Style',
            'Dhaka Style', 'Party Wear Salwar',
            // Kurti & Tops
            'Cotton Kurti', 'Silk Kurti', 'Embroidered Kurti', 'Printed Kurti',
            'Long Kurti', 'Short Kurti', 'Party Wear Kurti', 'Casual Kurti',
            'Ethnic Tops', 'Indo-Western Tops'
          ]
        },
        {
          name: 'Western Wear',
          count: 1823,
          items: [
            // Tops & Blouses
            'Casual Tops', 'Formal Blouses', 'Tank Tops', 'Crop Tops', 'Tunics',
            'Shirts', 'T-Shirts', 'Polo Shirts',
            // Bottoms
            'Jeans', 'Trousers', 'Leggings', 'Palazzo Pants', 'Shorts', 'Skirts', 'Capris',
            // Dresses
            'Casual Dresses', 'Party Dresses', 'Maxi Dresses', 'Mini Dresses',
            'A-Line Dresses', 'Bodycon Dresses'
          ]
        },
        {
          name: 'Islamic Wear',
          count: 987,
          items: [
            // Hijab & Scarves
            'Cotton Hijab', 'Chiffon Hijab', 'Silk Hijab', 'Printed Hijab',
            'Plain Hijab', 'Instant Hijab', 'Underscarves', 'Hijab Pins & Accessories',
            // Burkha & Abaya
            'Traditional Burkha', 'Modern Abaya', 'Front Open Abaya',
            'Butterfly Abaya', 'Party Wear Abaya', 'Casual Burkha'
          ]
        },
        {
          name: 'Innerwear & Sleepwear',
          count: 634,
          items: [
            // Lingerie
            'Bras', 'Panties', 'Shapewear', 'Camisoles', 'Slips',
            // Sleepwear
            'Nighties', 'Pajama Sets', 'Nightgowns', 'Robes'
          ]
        },
        {
          name: 'Maternity Wear',
          count: 356,
          items: [
            'Maternity Tops', 'Maternity Bottoms', 'Maternity Dresses',
            'Nursing Wear', 'Maternity Innerwear'
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
          count: 1834,
          items: [
            // Panjabi
            'Cotton Panjabi', 'Silk Panjabi', 'Linen Panjabi', 'Embroidered Panjabi',
            'Printed Panjabi', 'Plain Panjabi', 'Full Sleeve Panjabi', 'Half Sleeve Panjabi',
            'Collar Panjabi', 'Round Neck Panjabi',
            // Lungi & Dhoti
            'Cotton Lungi', 'Check Lungi', 'Printed Lungi', 'Silk Dhoti', 
            'Cotton Dhoti', 'Traditional Dhoti',
            // Pajama & Salwar
            'Pajama', 'Churidar', 'Straight Cut Pajama', 'Cotton Pajama', 'Silk Pajama'
          ]
        },
        {
          name: 'Western Wear',
          count: 1412,
          items: [
            // Shirts & T-Shirts
            'Formal Shirts', 'Casual Shirts', 'Polo Shirts', 'T-Shirts', 
            'Tank Tops', 'Henley Shirts',
            // Pants & Jeans
            'Formal Pants', 'Chinos', 'Jeans', 'Cargo Pants', 'Shorts', 'Track Pants',
            // Suits & Blazers
            'Business Suits', 'Casual Blazers', 'Tuxedos', 'Waistcoats'
          ]
        },
        {
          name: 'Ethnic & Fusion',
          count: 698,
          items: [
            // Kurta & Tops
            'Cotton Kurta', 'Silk Kurta', 'Linen Kurta', 'Designer Kurta', 'Nehru Jackets'
          ]
        },
        {
          name: 'Innerwear & Sleepwear',
          count: 487,
          items: [
            // Innerwear
            'Vests', 'Briefs', 'Boxers', 'Trunk', 'Thermals',
            // Sleepwear
            'Pajama Sets', 'Night Suits', 'Robes'
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
};
