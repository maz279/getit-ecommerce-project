
import { SearchResult } from '../types';

export class PageDataBuilder {
  buildPageData(): SearchResult[] {
    return [
      // Home
      {
        id: 'home',
        title: 'Home | হোম',
        description: 'GetIt Bangladesh - Your premier multi-vendor ecommerce platform',
        type: 'page',
        url: '/',
        category: 'Navigation',
        tags: ['home', 'homepage', 'landing', 'হোম', 'প্রধান'],
        dateAdded: new Date(),
        isActive: true
      },

      // Authentication Pages
      {
        id: 'login',
        title: 'Login | লগইন',
        description: 'Sign in to your GetIt Bangladesh account',
        type: 'page',
        url: '/auth/login',
        category: 'Authentication',
        tags: ['login', 'signin', 'auth', 'লগইন', 'প্রবেশ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'register',
        title: 'Register | নিবন্ধন',
        description: 'Create a new GetIt Bangladesh account',
        type: 'page',
        url: '/auth/register',
        category: 'Authentication',
        tags: ['register', 'signup', 'create account', 'নিবন্ধন', 'অ্যাকাউন্ট তৈরি'],
        dateAdded: new Date(),
        isActive: true
      },

      // Shop Pages
      {
        id: 'categories',
        title: 'Categories | বিভাগসমূহ',
        description: 'Browse all product categories',
        type: 'page',
        url: '/categories',
        category: 'Shopping',
        tags: ['categories', 'browse', 'products', 'বিভাগ', 'পণ্য'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'cart',
        title: 'Shopping Cart | শপিং কার্ট',
        description: 'Review items in your shopping cart',
        type: 'page',
        url: '/cart',
        category: 'Shopping',
        tags: ['cart', 'shopping cart', 'checkout', 'কার্ট', 'চেকআউট'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'gift-cards',
        title: 'Gift Cards | গিফট কার্ড',
        description: 'Purchase digital gift cards',
        type: 'page',
        url: '/gift-cards',
        category: 'Shopping',
        tags: ['gift cards', 'gifts', 'digital cards', 'গিফট কার্ড', 'উপহার'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'group-buy',
        title: 'Group Buy | গ্রুপ কেনাকাটা',
        description: 'Buy together and save more',
        type: 'page',
        url: '/group-buy',
        category: 'Shopping',
        tags: ['group buy', 'bulk buying', 'team buying', 'গ্রুপ কেনাকাটা', 'একসাথে কিনুন'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'premium',
        title: 'Premium Collection | প্রিমিয়াম সংগ্রহ',
        description: 'Exclusive premium products and brands',
        type: 'page',
        url: '/premium',
        category: 'Shopping',
        tags: ['premium', 'exclusive', 'luxury', 'প্রিমিয়াম', 'বিলাসবহুল'],
        dateAdded: new Date(),
        isActive: true
      },

      // Promotions Pages
      {
        id: 'flash-sale',
        title: 'Flash Sale | ফ্ল্যাশ সেল',
        description: 'Limited time offers and lightning deals',
        type: 'page',
        url: '/flash-sale',
        category: 'Promotions',
        tags: ['flash sale', 'deals', 'offers', 'ফ্ল্যাশ সেল', 'অফার'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'daily-deals',
        title: 'Daily Deals | দৈনিক অফার',
        description: 'Fresh deals updated every day',
        type: 'page',
        url: '/daily-deals',
        category: 'Promotions',
        tags: ['daily deals', 'today deals', 'দৈনিক অফার', 'আজকের অফার'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'mega-sale',
        title: 'Mega Sale | মেগা সেল',
        description: 'Biggest sale event of the year',
        type: 'page',
        url: '/mega-sale',
        category: 'Promotions',
        tags: ['mega sale', 'biggest sale', 'annual sale', 'মেগা সেল', 'বার্ষিক সেল'],
        dateAdded: new Date(),
        isActive: true
      },

      // Account Pages
      {
        id: 'my-account',
        title: 'My Account | আমার অ্যাকাউন্ট',
        description: 'Manage your account and profile',
        type: 'page',
        url: '/account',
        category: 'Account',
        tags: ['account', 'profile', 'my account', 'অ্যাকাউন্ট', 'প্রোফাইল'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'orders',
        title: 'My Orders | আমার অর্দারসমূহ',
        description: 'View and track all your orders',
        type: 'page',
        url: '/orders',
        category: 'Account',
        tags: ['orders', 'my orders', 'order history', 'অর্দার', 'অর্দার ইতিহাস'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'settings',
        title: 'Settings | সেটিংস',
        description: 'Manage your account settings and preferences',
        type: 'page',
        url: '/settings',
        category: 'Account',
        tags: ['settings', 'preferences', 'account settings', 'সেটিংস', 'পছন্দ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods | পেমেন্ট পদ্ধতি',
        description: 'Manage your payment methods and billing',
        type: 'page',
        url: '/payment-methods',
        category: 'Account',
        tags: ['payment', 'billing', 'payment methods', 'পেমেন্ট', 'বিলিং'],
        dateAdded: new Date(),
        isActive: true
      },

      // Order Pages
      {
        id: 'order-tracking',
        title: 'Order Tracking | অর্দার ট্র্যাকিং',
        description: 'Track your order status and delivery progress',
        type: 'page',
        url: '/order-tracking',
        category: 'Orders',
        tags: ['order tracking', 'delivery tracking', 'অর্দার ট্র্যাকিং', 'ডেলিভারি ট্র্যাকিং'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'track-order',
        title: 'Track Order | অর্দার খোঁজ করুন',
        description: 'Enter order details to track delivery status',
        type: 'page',
        url: '/track-order',
        category: 'Orders',
        tags: ['track order', 'find order', 'অর্দার খোঁজ', 'অর্ডার খুঁজুন'],
        dateAdded: new Date(),
        isActive: true
      },

      // Support Pages
      {
        id: 'help-center',
        title: 'Help Center | সহায়তা কেন্দ্র',
        description: 'Get help and support for all your questions',
        type: 'page',
        url: '/help',
        category: 'Support',
        tags: ['help', 'support', 'faq', 'customer service', 'সহায়তা', 'কাস্টমার সেবা'],
        dateAdded: new Date(),
        isActive: true
      },

      // Vendor Pages
      {
        id: 'vendor-center',
        title: 'Seller Center | বিক্রেতা কেন্দ্র',
        description: 'Join as a vendor and start selling',
        type: 'page',
        url: '/seller-center',
        category: 'Vendor',
        tags: ['vendor', 'seller', 'sell products', 'বিক্রেতা', 'পণ্য বিক্রি'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'vendor-register',
        title: 'Vendor Registration | বিক্রেতা নিবন্ধন',
        description: 'Register as a new vendor',
        type: 'page',
        url: '/vendor/register',
        category: 'Vendor',
        tags: ['vendor registration', 'seller signup', 'বিক্রেতা নিবন্ধন', 'বিক্রেতা সাইনআপ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'vendor-dashboard',
        title: 'Vendor Dashboard | বিক্রেতা ড্যাশবোর্ড',
        description: 'Manage your vendor account and products',
        type: 'page',
        url: '/vendor/dashboard',
        category: 'Vendor',
        tags: ['vendor dashboard', 'seller panel', 'বিক্রেতা ড্যাশবোর্ড', 'বিক্রেতা প্যানেল'],
        dateAdded: new Date(),
        isActive: true
      },

      // Company Pages
      {
        id: 'about-us',
        title: 'About Us | আমাদের সম্পর্কে',
        description: 'Learn more about GetIt Bangladesh',
        type: 'page',
        url: '/about',
        category: 'Company',
        tags: ['about', 'company', 'about us', 'আমাদের সম্পর্কে', 'কোম্পানি'],
        dateAdded: new Date(),
        isActive: true
      },

      // Admin Pages
      {
        id: 'admin-dashboard',
        title: 'Admin Dashboard | অ্যাডমিন ড্যাশবোর্ড',
        description: 'Admin panel for system management',
        type: 'page',
        url: '/admin/dashboard',
        category: 'Admin',
        tags: ['admin', 'dashboard', 'management', 'অ্যাডমিন', 'ব্যবস্থাপনা'],
        dateAdded: new Date(),
        isActive: true
      },

      // Popular Shopping Pages
      {
        id: 'best-sellers',
        title: 'Best Sellers | বেস্ট সেলার',
        description: 'Most popular products across all categories',
        type: 'page',
        url: '/best-sellers',
        category: 'Shopping',
        tags: ['best sellers', 'popular', 'top products', 'বেস্ট সেলার', 'জনপ্রিয়'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'new-arrivals',
        title: 'New Arrivals | নতুন পণ্য',
        description: 'Latest products added to our store',
        type: 'page',
        url: '/new-arrivals',
        category: 'Shopping',
        tags: ['new arrivals', 'latest', 'new products', 'নতুন পণ্য', 'সর্বশেষ'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'wishlist',
        title: 'Wishlist | পছন্দের তালিকা',
        description: 'Your saved favorite products',
        type: 'page',
        url: '/wishlist',
        category: 'Shopping',
        tags: ['wishlist', 'favorites', 'saved items', 'পছন্দের তালিকা', 'প্রিয়'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'bulk-orders',
        title: 'Bulk Orders | বাল্ক অর্ডার',
        description: 'Place bulk orders for wholesale purchases',
        type: 'page',
        url: '/bulk-orders',
        category: 'Shopping',
        tags: ['bulk orders', 'wholesale', 'bulk buying', 'বাল্ক অর্ডার', 'পাইকারি'],
        dateAdded: new Date(),
        isActive: true
      },

      // Category Pages
      {
        id: 'womens-clothing',
        title: 'Women\'s Fashion | মহিলাদের ফ্যাশন',
        description: 'Latest women\'s clothing and fashion accessories',
        type: 'page',
        url: '/categories/fashion/womens-fashion',
        category: 'Categories',
        tags: ['womens fashion', 'clothing', 'accessories', 'মহিলাদের ফ্যাশন', 'পোশাক'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }
}
