export const PAGE_NAVIGATION_MAP = {
  'admin': '/admin/dashboard',
  'admin dashboard': '/admin/dashboard',
  'dashboard': '/admin/dashboard',
  'control panel': '/admin/dashboard',
  'অ্যাডমিন': '/admin/dashboard',
  'ড্যাশবোর্ড': '/admin/dashboard',
  'নিয়ন্ত্রণ': '/admin/dashboard',
  
  'vendor management': '/admin/dashboard?tab=vendors',
  'vendors': '/admin/dashboard?tab=vendors',
  'বিক্রেতা': '/admin/dashboard?tab=vendors',
  'ব্যবস্থাপনা': '/admin/dashboard?tab=vendors',
  
  'product management': '/admin/dashboard?tab=products',
  'products': '/admin/dashboard?tab=products',
  'inventory': '/admin/dashboard?tab=products',
  'পণ্য': '/admin/dashboard?tab=products',
  
  'order management': '/admin/dashboard?tab=orders',
  'orders': '/admin/dashboard?tab=orders',
  'অর্ডার': '/admin/dashboard?tab=orders',
  
  'user management': '/admin/dashboard?tab=users',
  'users': '/admin/dashboard?tab=users',
  'customers': '/admin/dashboard?tab=users',
  'ব্যবহারকারী': '/admin/dashboard?tab=users',
  'গ্রাহক': '/admin/dashboard?tab=users',
  
  'financial reports': '/admin/dashboard?tab=financials',
  'financials': '/admin/dashboard?tab=financials',
  'revenue': '/admin/dashboard?tab=financials',
  'আর্থিক': '/admin/dashboard?tab=financials',
  'রাজস্ব': '/admin/dashboard?tab=financials',
  
  'analytics': '/admin/dashboard?tab=reports',
  'reports': '/admin/dashboard?tab=reports',
  'insights': '/admin/dashboard?tab=reports',
  'বিশ্লেষণ': '/admin/dashboard?tab=reports',
  'প্রতিবেদন': '/admin/dashboard?tab=reports',
  
  'settings': '/admin/dashboard?tab=settings',
  'system settings': '/admin/dashboard?tab=settings',
  'configuration': '/admin/dashboard?tab=settings',
  'সেটিংস': '/admin/dashboard?tab=settings',
  'কনফিগারেশন': '/admin/dashboard?tab=settings',
  
  'notifications': '/admin/dashboard?tab=notifications',
  'alerts': '/admin/dashboard?tab=notifications',
  'announcements': '/admin/dashboard?tab=notifications',
  'বিজ্ঞপ্তি': '/admin/dashboard?tab=notifications',
  'ঘোষণা': '/admin/dashboard?tab=notifications',
  
  // Other existing pages
  'home': '/',
  'homepage': '/',
  'হোম': '/',
  'categories': '/categories',
  'ক্যাটেগরি': '/categories',
  'login': '/login',
  'লগইন': '/login',
  'register': '/register',
  'নিবন্ধন': '/register',
  'about': '/about',
  'আমাদের সম্পর্কে': '/about',
  'help': '/help',
  'সহায়তা': '/help',
  'flash sale': '/flash-sale',
  'ফ্ল্যাশ সেল': '/flash-sale',
  'new arrivals': '/new-arrivals',
  'নতুন পণ্য': '/new-arrivals'
} as const;

export const SEARCH_CONTENT = {
  EN: {
    placeholder: "Search products, brands, vendors... or navigate to any page (Type in English or বাংলা)",
    voiceSearch: "Voice Search",
    imageSearch: "Image Search",
    conversationalSearch: "Try asking: 'Show me admin dashboard' or 'Take me to vendor management'",
    trendingSearches: [
      "Admin Dashboard",
      "Vendor Management", 
      "iPhone 15 Pro Max",
      "Samsung Galaxy S24",
      "Flash Sale",
      "New Arrivals",
      "Order Management",
      "Financial Reports"
    ]
  },
  BD: {
    placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন... বা যেকোনো পেজে যান (ইংরেজি বা বাংলায় লিখুন)",
    voiceSearch: "ভয়েস সার্চ",
    imageSearch: "ছবি সার্চ",
    conversationalSearch: "চেষ্টা করুন: 'অ্যাডমিন ড্যাশবোর্ড দেখান' বা 'বিক্রেতা ব্যবস্থাপনায় নিয়ে যান'",
    trendingSearches: [
      "অ্যাডমিন ড্যাশবোর্ড",
      "বিক্রেতা ব্যবস্থাপনা",
      "আইফোন ১৫ প্রো ম্যাক্স",
      "স্যামসাং গ্যালাক্সি এস২৪",
      "ফ্ল্যাশ সেল",
      "নতুন পণ্য",
      "অর্ডার ব্যবস্থাপনা",
      "আর্থিক প্রতিবেদন"
    ]
  }
};
