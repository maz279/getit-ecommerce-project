
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
          name: 'Boys Clothing (0-16 years)',
          count: 845,
          items: [
            // Traditional Wear
            'Boys Panjabi', 'Boys Pajama', 'Boys Dhoti', 'Boys Kurta', 'Festival Wear',
            // Western Wear
            'Boys Shirts', 'Boys T-Shirts', 'Boys Jeans', 'Boys Shorts', 
            'Boys Polo', 'Boys Tracksuit'
          ]
        },
        {
          name: 'Girls Clothing (0-16 years)',
          count: 934,
          items: [
            // Traditional Wear
            'Girls Salwar Kameez', 'Girls Kurti', 'Girls Lehenga', 
            'Girls Saree (Teen)', 'Festival Dresses',
            // Western Wear
            'Girls Dresses', 'Girls Tops', 'Girls Jeans', 'Girls Skirts',
            'Girls Leggings', 'Girls Jumpsuit'
          ]
        },
        {
          name: 'Baby Clothing (0-2 years)',
          count: 567,
          items: [
            // Essentials
            'Baby Onesies', 'Baby Rompers', 'Baby Sets', 'Baby Sleepwear',
            'Baby Innerwear', 'Baby Accessories'
          ]
        },
        {
          name: 'Kids Footwear',
          count: 345,
          items: [
            'Boys Shoes', 'Girls Shoes', 'Baby Shoes', 'School Shoes',
            'Sports Shoes', 'Sandals & Slippers'
          ]
        }
      ]
    },
    'footwear': {
      name: "Shoes & Footwear",
      subcategories: [
        {
          name: 'Mens Footwear',
          count: 789,
          items: [
            // Formal Shoes
            'Oxford Shoes', 'Derby Shoes', 'Loafers', 'Monk Straps', 'Brogues',
            // Casual Shoes
            'Sneakers', 'Canvas Shoes', 'Boat Shoes', 'Espadrilles', 'Slip-ons',
            // Traditional Footwear
            'Kolhapuri Chappals', 'Nagra', 'Mojari', 'Khussa',
            // Sports & Athletic
            'Running Shoes', 'Walking Shoes', 'Basketball Shoes', 'Football Boots', 'Cricket Shoes',
            // Sandals & Slippers
            'Flip Flops', 'Slides', 'Sport Sandals', 'Home Slippers'
          ]
        },
        {
          name: 'Womens Footwear',
          count: 892,
          items: [
            // Formal Shoes
            'High Heels', 'Pumps', 'Stilettos', 'Block Heels', 'Wedges',
            // Casual Shoes
            'Flats', 'Ballerinas', 'Loafers', 'Sneakers', 'Canvas Shoes',
            // Traditional Footwear
            'Juttis', 'Kolhapuri Chappals', 'Mojaris', 'Traditional Sandals',
            // Sandals & Slippers
            'Flat Sandals', 'Heeled Sandals', 'Flip Flops', 'Home Slippers'
          ]
        },
        {
          name: 'Kids Footwear',
          count: 345,
          items: [
            'Boys Shoes', 'Girls Shoes', 'Baby Shoes', 'School Shoes',
            'Sports Shoes', 'Sandals & Slippers'
          ]
        }
      ]
    },
    'bags-luggage': {
      name: "Bags & Accessories",
      subcategories: [
        {
          name: 'Bags',
          count: 678,
          items: [
            // Women's Bags
            'Handbags', 'Shoulder Bags', 'Tote Bags', 'Clutches', 'Backpacks',
            'Sling Bags', 'Wallets & Purses',
            // Men's Bags
            'Messenger Bags', 'Laptop Bags', 'Briefcases', 'Duffle Bags',
            'Money Clips',
            // Travel Bags
            'Suitcases', 'Travel Backpacks', 'Travel Organizers', 'Cabin Bags'
          ]
        },
        {
          name: 'Fashion Accessories',
          count: 892,
          items: [
            // Jewelry
            'Gold Jewelry', 'Silver Jewelry', 'Fashion Jewelry', 'Artificial Jewelry',
            'Bangles & Bracelets', 'Earrings', 'Necklaces', 'Rings', 'Anklets', 'Nose Pins',
            // Watches
            'Men\'s Watches', 'Women\'s Watches', 'Digital Watches', 'Analog Watches',
            'Smart Watches', 'Kids Watches',
            // Eyewear
            'Sunglasses', 'Prescription Glasses', 'Reading Glasses', 'Contact Lenses',
            'Computer Glasses',
            // Hair Accessories
            'Hair Bands', 'Hair Clips', 'Hair Ties', 'Headbands', 'Hair Extensions'
          ]
        }
      ]
    }
  }
};
