
export const SEARCH_CONTENT = {
  EN: {
    placeholder: "Search products, brands, vendors... or navigate to any page (Type in English or বাংলা)",
    voiceSearch: "Voice Search",
    imageSearch: "Image Search",
    filters: "Filters",
    noResults: "No results found",
    loading: "Searching...",
    trendingSearches: [
      "Samsung Galaxy S24",
      "Nike shoes",
      "Laptop deals",
      "Fashion trends",
      "Home decor",
      "Books",
      "Health products",
      "Electronics"
    ] as string[],
    conversationalSearch: "Try asking 'Show me new phones' or 'Find cheap laptops' for better results!"
  },
  BD: {
    placeholder: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন... বা যেকোনো পেজে যান (ইংরেজি বা বাংলায় লিখুন)",
    voiceSearch: "ভয়েস সার্চ",
    imageSearch: "ছবি সার্চ",
    filters: "ফিল্টার",
    noResults: "কোনো ফলাফল পাওয়া যায়নি",
    loading: "খুঁজছি...",
    trendingSearches: [
      "স্যামসাং গ্যালাক্সি",
      "নাইকি জুতা",
      "ল্যাপটপ অফার",
      "ফ্যাশন ট্রেন্ড",
      "ঘর সাজানো",
      "বই",
      "স্বাস্থ্য পণ্য",
      "ইলেকট্রনিক্স"
    ] as string[],
    conversationalSearch: "ভালো ফলাফলের জন্য 'নতুন ফোন দেখান' বা 'সস্তা ল্যাপটপ খুঁজুন' লিখে দেখুন!"
  }
} as const;

export const PAGE_NAVIGATION_MAP = {
  'home': '/',
  'homepage': '/',
  'গৃহপাতা': '/',
  'new arrivals': '/new-arrivals',
  'নতুন পণ্য': '/new-arrivals',
  'categories': '/categories',
  'বিভাগসমূহ': '/categories',
  'about': '/about',
  'about us': '/about',
  'আমাদের সম্পর্কে': '/about',
  'help': '/help',
  'help center': '/help',
  'সহায়তা': '/help',
  'login': '/login',
  'লগইন': '/login',
  'register': '/register',
  'sign up': '/register',
  'নিবন্ধন': '/register',
  'wishlist': '/wishlist',
  'পছন্দের তালিকা': '/wishlist',
  'profile': '/profile',
  'my account': '/profile',
  'আমার অ্যাকাউন্ট': '/profile',
  'privacy': '/privacy',
  'privacy policy': '/privacy',
  'গোপনীয়তা নীতি': '/privacy',
  'terms': '/terms',
  'terms of service': '/terms',
  'সেবার শর্তাবলী': '/terms',
  'cart': '/cart',
  'checkout': '/checkout',
  'orders': '/orders',
  'vendors': '/vendors',
  'contact': '/contact',
  'dashboard': '/dashboard'
} as const;

export const SEARCH_CATEGORIES = [
  'all',
  'electronics',
  'fashion',
  'home-garden',
  'health-beauty',
  'food-groceries',
  'books-education',
  'sports-outdoor',
  'automobiles',
  'baby-kids'
] as const;

export const SEARCH_FILTERS = {
  priceRanges: [
    { label: 'Under ৳500', min: 0, max: 500 },
    { label: '৳500 - ৳2,000', min: 500, max: 2000 },
    { label: '৳2,000 - ৳10,000', min: 2000, max: 10000 },
    { label: '৳10,000 - ৳50,000', min: 10000, max: 50000 },
    { label: 'Above ৳50,000', min: 50000, max: null }
  ],
  ratings: [4.5, 4.0, 3.5, 3.0],
  deliveryOptions: ['fast-delivery', 'free-shipping', 'cash-on-delivery'],
  locations: ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal']
} as const;
