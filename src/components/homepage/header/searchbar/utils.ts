
import { searchService } from '@/services/searchService';

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

export const getPageSuggestions = (query: string): string[] => {
  return searchService.getPageSuggestions(query);
};

export const getDirectPageMatch = (query: string): string | null => {
  const lowerQuery = query.toLowerCase().trim();
  return PAGE_NAVIGATION_MAP[lowerQuery as keyof typeof PAGE_NAVIGATION_MAP] || null;
};

export const isConversationalQuery = (query: string): boolean => {
  const conversationalKeywords = [
    'show me', 'find me', 'i want', 'i need', 'looking for',
    'search for', 'help me find', 'can you', 'where is',
    'how to', 'what is', 'tell me about', 'recommend',
    'suggest', 'best', 'popular', 'trending', 'new',
    'দেখান', 'খুঁজুন', 'চাই', 'দরকার', 'খুঁজছি'
  ];
  
  const lowerQuery = query.toLowerCase();
  return conversationalKeywords.some(keyword => lowerQuery.includes(keyword));
};

export const extractSearchIntent = (query: string): {
  intent: 'product' | 'category' | 'page' | 'vendor' | 'help';
  entities: string[];
} => {
  const lowerQuery = query.toLowerCase();
  
  // Page navigation intent
  if (Object.keys(PAGE_NAVIGATION_MAP).some(key => lowerQuery.includes(key))) {
    return { intent: 'page', entities: [] };
  }
  
  // Product search intent
  const productKeywords = ['buy', 'price', 'shop', 'purchase', 'order'];
  if (productKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return { intent: 'product', entities: [] };
  }
  
  // Category intent
  const categoryKeywords = ['category', 'section', 'department', 'বিভাগ'];
  if (categoryKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return { intent: 'category', entities: [] };
  }
  
  // Help intent
  const helpKeywords = ['help', 'support', 'how', 'what', 'সহায়তা'];
  if (helpKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return { intent: 'help', entities: [] };
  }
  
  return { intent: 'product', entities: [] };
};
