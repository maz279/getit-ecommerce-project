
export const realProductImages = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', // iPhone
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // Nike Shoes
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // Watch
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // Headphones
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', // Women's Fashion
  'https://images.unsplash.com/photo-1556909114-4f5c28b9c888?w=400&h=400&fit=crop', // Kitchen Appliance
  'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=400&fit=crop', // Laptop
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', // Sunglasses
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', // Cosmetics
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop', // Office Supplies
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', // Sneakers
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop', // Camera
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // Gaming Setup
  'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop', // Fashion Accessories
  'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop', // Kitchen Utensils
  'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop', // Home Decor
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // Sports Shoes
  'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=400&fit=crop', // Fresh Food
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=400&fit=crop', // Books
  'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop', // Beauty Products
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', // Fashion Items
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', // Plants
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', // Bags
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'  // Toys
];

export const productTitles = [
  'iPhone 15 Pro Max - Latest Model with Advanced Camera System',
  'Nike Air Jordan Retro - Premium Basketball Sneakers',
  'Apple Watch Series 9 - GPS + Cellular, Health Monitoring',
  'Sony WH-1000XM5 - Wireless Noise Canceling Headphones',
  'Women\'s Designer Summer Dress - Elegant & Comfortable',
  'Instant Pot Pro - 10-in-1 Pressure Cooker',
  'MacBook Pro 16" - M3 Chip, 512GB SSD',
  'Ray-Ban Aviator Classic - Premium Sunglasses',
  'Fenty Beauty Makeup Set - Complete Collection',
  'Ergonomic Office Chair - Lumbar Support',
  'Adidas Ultraboost 22 - Running Shoes',
  'Canon EOS R6 Mark II - Professional Camera',
  'Gaming PC Setup - RTX 4080, 32GB RAM',
  'Designer Handbag - Genuine Leather',
  'Professional Chef Knife Set - German Steel',
  'Scandinavian Table Lamp - Modern Design',
  'Under Armour Training Shoes - CrossFit Ready',
  'Organic Food Bundle - Fresh & Healthy',
  'Best Seller Book Collection - Top 10 Titles',
  'Premium Skincare Set - Anti-Aging Formula',
  'Vintage Leather Jacket - Handcrafted Quality',
  'Indoor Plant Collection - Air Purifying',
  'Travel Backpack - 40L Capacity, Waterproof',
  'Educational STEM Toys - Kids Learning Kit'
];

export const categories = [
  { id: 'all', name: 'All Categories', count: 156 },
  { id: 'electronics', name: 'Electronics', count: 45 },
  { id: 'fashion', name: 'Fashion', count: 38 },
  { id: 'home', name: 'Home & Living', count: 29 },
  { id: 'beauty', name: 'Beauty & Health', count: 24 },
  { id: 'sports', name: 'Sports & Outdoor', count: 20 }
];

export const generateFlashProducts = () => {
  return Array.from({ length: 24 }).map((_, index) => ({
    id: index + 1,
    image: realProductImages[index],
    title: productTitles[index],
    originalPrice: (999 + index * 100),
    salePrice: (299 + index * 50),
    discount: Math.floor(Math.random() * 60 + 20),
    rating: 4.2 + Math.random() * 0.8,
    reviews: Math.floor(Math.random() * 500 + 100),
    sold: Math.floor(Math.random() * 1000 + 50),
    stockLeft: Math.floor(Math.random() * 20 + 5),
    freeShipping: Math.random() > 0.5,
    badge: Math.random() > 0.7 ? 'Best Seller' : Math.random() > 0.5 ? 'Limited Time' : null,
    location: 'Dhaka'
  }));
};
