
export const ROUTES = {
  // Main routes
  HOME: '/',
  
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  
  // Shop
  SHOP: {
    CATEGORIES: '/categories',
    WOMENS_FASHION: '/categories/fashion/womens-fashion',
    BEST_SELLERS: '/best-sellers',
    NEW_ARRIVALS: '/new-arrivals',
    WISHLIST: '/wishlist',
    BULK_ORDERS: '/bulk-orders',
    CART: '/cart',
    GIFT_CARDS: '/gift-cards',
    GROUP_BUY: '/group-buy',
    PREMIUM: '/premium',
  },
  
  // Promotions
  PROMOTIONS: {
    FLASH_SALE: '/flash-sale',
    DAILY_DEALS: '/daily-deals',
    MEGA_SALE: '/mega-sale',
  },
  
  // Account
  ACCOUNT: {
    PROFILE: '/account',
    ORDERS: '/orders',
    SETTINGS: '/settings',
    PAYMENT_METHODS: '/payment-methods',
  },
  
  // Orders
  ORDERS: {
    TRACKING: '/order-tracking',
    TRACK: '/track-order',
  },
  
  // Support
  SUPPORT: {
    HELP_CENTER: '/help',
  },
  
  // Vendor
  VENDOR: {
    CENTER: '/seller-center',
    REGISTER: '/vendor/register',
    DASHBOARD: '/vendor/dashboard',
  },
  
  // Company
  COMPANY: {
    ABOUT: '/about',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
} as const;
