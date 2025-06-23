
import { SearchResult } from './types';

export class ContentIndexer {
  
  // Index all content types
  public indexAllContent(): SearchResult[] {
    return [
      ...this.indexPageContent(),
      ...this.indexCategoryContent(),
      ...this.indexAdminContent(),
      ...this.indexProductContent(),
      ...this.indexVendorContent(),
      ...this.indexFeatureContent()
    ];
  }

  // Index main pages
  private indexPageContent(): SearchResult[] {
    return [
      {
        id: 'homepage',
        title: 'Home | হোম',
        description: 'GETIT Bangladesh - Multi-vendor ecommerce platform',
        type: 'page',
        url: '/',
        category: 'Navigation',
        tags: ['home', 'homepage', 'main', 'index', 'হোম', 'মূল'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'categories',
        title: 'Categories | ক্যাটেগরি',
        description: 'Browse all product categories',
        type: 'page',
        url: '/categories',
        category: 'Navigation',
        tags: ['categories', 'browse', 'ক্যাটেগরি', 'বিভাগ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'login',
        title: 'Login | লগইন',
        description: 'Sign in to your account',
        type: 'page',
        url: '/login',
        category: 'Authentication',
        tags: ['login', 'signin', 'লগইন', 'প্রবেশ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'register',
        title: 'Register | নিবন্ধন',
        description: 'Create a new account',
        type: 'page',
        url: '/register',
        category: 'Authentication',
        tags: ['register', 'signup', 'নিবন্ধন', 'রেজিস্টার'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'about',
        title: 'About Us | আমাদের সম্পর্কে',
        description: 'Learn about GETIT Bangladesh',
        type: 'page',
        url: '/about',
        category: 'Information',
        tags: ['about', 'company', 'আমাদের', 'সম্পর্কে'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'help',
        title: 'Help Center | সহায়তা কেন্দ্র',
        description: 'Get help and support',
        type: 'page',
        url: '/help',
        category: 'Support',
        tags: ['help', 'support', 'সহায়তা', 'সাহায্য'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Index admin dashboard and sections
  private indexAdminContent(): SearchResult[] {
    return [
      {
        id: 'admin-dashboard',
        title: 'Admin Dashboard | অ্যাডমিন ড্যাশবোর্ড',
        description: 'Administrative control panel for GETIT platform management',
        type: 'page',
        url: '/admin/dashboard',
        category: 'Admin',
        tags: ['admin', 'dashboard', 'control panel', 'management', 'অ্যাডমিন', 'ড্যাশবোর্ড', 'নিয়ন্ত্রণ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-overview',
        title: 'Admin Overview | অ্যাডমিন ওভারভিউ',
        description: 'Dashboard overview with key metrics and statistics',
        type: 'page',
        url: '/admin/dashboard?tab=overview',
        category: 'Admin',
        tags: ['overview', 'metrics', 'statistics', 'analytics', 'ওভারভিউ', 'পরিসংখ্যান'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-vendors',
        title: 'Vendor Management | বিক্রেতা ব্যবস্থাপনা',
        description: 'Manage vendors, approvals, and vendor performance',
        type: 'page',
        url: '/admin/dashboard?tab=vendors',
        category: 'Admin',
        tags: ['vendors', 'sellers', 'management', 'approval', 'বিক্রেতা', 'ব্যবস্থাপনা'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-products',
        title: 'Product Management | পণ্য ব্যবস্থাপনা',
        description: 'Oversee product listings, approvals, and inventory',
        type: 'page',
        url: '/admin/dashboard?tab=products',
        category: 'Admin',
        tags: ['products', 'inventory', 'listings', 'approval', 'পণ্য', 'তালিকা'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-orders',
        title: 'Order Management | অর্ডার ব্যবস্থাপনা',
        description: 'Track and manage customer orders and fulfillment',
        type: 'page',
        url: '/admin/dashboard?tab=orders',
        category: 'Admin',
        tags: ['orders', 'fulfillment', 'tracking', 'customers', 'অর্ডার', 'ব্যবস্থাপনা'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-users',
        title: 'User Management | ব্যবহারকারী ব্যবস্থাপনা',
        description: 'Manage customer accounts and user permissions',
        type: 'page',
        url: '/admin/dashboard?tab=users',
        category: 'Admin',
        tags: ['users', 'customers', 'accounts', 'permissions', 'ব্যবহারকারী', 'গ্রাহক'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-financials',
        title: 'Financial Reports | আর্থিক প্রতিবেদন',
        description: 'Revenue analytics, payments, and financial insights',
        type: 'page',
        url: '/admin/dashboard?tab=financials',
        category: 'Admin',
        tags: ['revenue', 'payments', 'financial', 'analytics', 'আর্থিক', 'রাজস্ব'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-reports',
        title: 'Analytics & Reports | বিশ্লেষণ ও প্রতিবেদন',
        description: 'Platform analytics, performance reports, and insights',
        type: 'page',
        url: '/admin/dashboard?tab=reports',
        category: 'Admin',
        tags: ['analytics', 'reports', 'insights', 'performance', 'বিশ্লেষণ', 'প্রতিবেদন'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-settings',
        title: 'System Settings | সিস্টেম সেটিংস',
        description: 'Configure platform settings and system preferences',
        type: 'page',
        url: '/admin/dashboard?tab=settings',
        category: 'Admin',
        tags: ['settings', 'configuration', 'system', 'preferences', 'সেটিংস', 'কনফিগারেশন'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'admin-notifications',
        title: 'Notifications | বিজ্ঞপ্তি',
        description: 'Manage system notifications and announcements',
        type: 'page',
        url: '/admin/dashboard?tab=notifications',
        category: 'Admin',
        tags: ['notifications', 'announcements', 'alerts', 'বিজ্ঞপ্তি', 'ঘোষণা'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Index categories
  private indexCategoryContent(): SearchResult[] {
    return [
      {
        id: 'category-electronics',
        title: 'Electronics | ইলেকট্রনিক্স',
        description: 'Mobile phones, laptops, gadgets and electronic devices',
        type: 'category',
        url: '/categories/electronics',
        category: 'Electronics',
        tags: ['electronics', 'mobile', 'laptop', 'gadgets', 'ইলেকট্রনিক্স', 'মোবাইল'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'category-fashion',
        title: 'Fashion | ফ্যাশন',
        description: 'Clothing, shoes, accessories for men, women and kids',
        type: 'category',
        url: '/categories/fashion',
        category: 'Fashion',
        tags: ['fashion', 'clothing', 'shoes', 'accessories', 'ফ্যাশন', 'পোশাক'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'category-home-garden',
        title: 'Home & Garden | ঘর ও বাগান',
        description: 'Home appliances, furniture, garden tools and decor',
        type: 'category',
        url: '/categories/home-garden',
        category: 'Home & Garden',
        tags: ['home', 'garden', 'furniture', 'appliances', 'ঘর', 'বাগান'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'category-books',
        title: 'Books | বই',
        description: 'Educational books, novels, comics and digital content',
        type: 'category',
        url: '/categories/books',
        category: 'Books',
        tags: ['books', 'education', 'novels', 'comics', 'বই', 'শিক্ষা'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Index sample products
  private indexProductContent(): SearchResult[] {
    return [
      {
        id: 'product-iphone15',
        title: 'iPhone 15 Pro Max',
        description: 'Latest Apple smartphone with advanced features',
        type: 'product',
        url: '/product/iphone-15-pro-max',
        category: 'Electronics',
        brand: 'Apple',
        price: 149999,
        tags: ['iphone', 'apple', 'smartphone', 'mobile'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'product-samsung-s24',
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen',
        type: 'product',
        url: '/product/samsung-galaxy-s24-ultra',
        category: 'Electronics',
        brand: 'Samsung',
        price: 134999,
        tags: ['samsung', 'galaxy', 'android', 'smartphone'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Index vendors
  private indexVendorContent(): SearchResult[] {
    return [
      {
        id: 'vendor-techzone',
        title: 'TechZone Bangladesh',
        description: 'Leading electronics vendor with premium gadgets',
        type: 'vendor',
        url: '/vendor/techzone-bangladesh',
        category: 'Electronics',
        tags: ['electronics', 'vendor', 'techzone', 'gadgets'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'vendor-fashionhub',
        title: 'Fashion Hub BD',
        description: 'Trendy fashion and clothing for all ages',
        type: 'vendor',
        url: '/vendor/fashion-hub-bd',
        category: 'Fashion',
        tags: ['fashion', 'clothing', 'vendor', 'trendy'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Index features
  private indexFeatureContent(): SearchResult[] {
    return [
      {
        id: 'feature-flash-sale',
        title: 'Flash Sale | ফ্ল্যাশ সেল',
        description: 'Limited time offers with huge discounts',
        type: 'page',
        url: '/flash-sale',
        category: 'Features',
        tags: ['flash sale', 'deals', 'offers', 'discount', 'ফ্ল্যাশ', 'অফার'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'feature-new-arrivals',
        title: 'New Arrivals | নতুন পণ্য',
        description: 'Latest products from our vendors',
        type: 'page',
        url: '/new-arrivals',
        category: 'Features',
        tags: ['new arrivals', 'latest', 'products', 'নতুন', 'পণ্য'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }
}
