
// Comprehensive page mapping for navigation
export const PAGE_NAVIGATION_MAP = {
  // Main pages
  'home': '/',
  'homepage': '/',
  'index': '/',
  'dashboard': '/dashboard',
  'admin': '/dashboard',
  'profile': '/profile',
  'account': '/profile',
  'my account': '/profile',
  
  // Auth pages
  'login': '/login',
  'register': '/register',
  'signup': '/register',
  'sign up': '/register',
  'sign in': '/login',
  
  // Shopping pages
  'cart': '/cart',
  'checkout': '/checkout',
  'orders': '/orders',
  'order': '/orders',
  'wishlist': '/wishlist',
  'wish list': '/wishlist',
  'categories': '/categories',
  'category': '/categories',
  
  // Business pages
  'vendors': '/vendors',
  'vendor': '/vendors',
  'seller': '/vendors',
  'sellers': '/vendors',
  'vendor register': '/vendor-register',
  'seller center': '/seller-center',
  
  // Shopping features
  'flash sale': '/flash-sale',
  'daily deals': '/daily-deals',
  'mega sale': '/mega-sale',
  'new arrivals': '/new-arrivals',
  'best sellers': '/bestsellers',
  'premium': '/premium',
  'offers': '/offers',
  'gift cards': '/gift-cards',
  'group buy': '/group-buy',
  'bulk orders': '/bulk-orders',
  
  // Information pages
  'about': '/about',
  'about us': '/about',
  'contact': '/contact',
  'help': '/help',
  'help center': '/help',
  'support': '/help',
  'privacy': '/privacy',
  'privacy policy': '/privacy',
  'terms': '/terms',
  'terms of service': '/terms',
  
  // Utility pages
  'track order': '/track-order',
  'order tracking': '/order-tracking',
  'delivery info': '/delivery-info',
  'payment methods': '/payment-methods',
  'mobile banking': '/mobile-banking',
  'returns': '/returns-refunds',
  'refunds': '/returns-refunds',
  'recommendations': '/recommendations',
  'products': '/products',
  
  // Festival/Special pages
  'eid sale': '/eid-sale',
  'new user offer': '/new-user-offer',
  
  // Search specific
  'search': '/search',
  'product': '/search?type=product',
  'brand': '/search?type=brand'
} as const;

export const SEARCH_CONTENT = {
  EN: {
    voiceSearch: "AI Voice Search",
    trendingSearches: ['AI Search', 'Smart Recommendations', 'Voice Commands', 'Visual Search', 'Personalized Results'],
    navigateToPage: "Navigate to page:",
    pages: "Pages",
    aiMode: "AI Mode",
    conversationalSearch: "Try: 'Show me phones under 30000' or 'Find best laptops for gaming'"
  },
  BD: {
    voiceSearch: "এআই ভয়েস সার্চ",
    trendingSearches: ['এআই সার্চ', 'স্মার্ট সাজেশন', 'ভয়েস কমান্ড', 'ভিজুয়াল সার্চ', 'ব্যক্তিগত ফলাফল'],
    navigateToPage: "পেজে যান:",
    pages: "পেজসমূহ",
    aiMode: "এআই মোড",
    conversationalSearch: "চেষ্টা করুন: '৩০০০০ টাকার নিচে ফোন দেখাও' বা 'গেমিংয়ের জন্য সেরা ল্যাপটপ খুঁজে দাও'"
  }
};
