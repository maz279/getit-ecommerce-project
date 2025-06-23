
import { PAGE_NAVIGATION_MAP } from './constants';

export const getDirectPageMatch = (query: string): string | null => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for direct page matches
  const pageMatch = PAGE_NAVIGATION_MAP[normalizedQuery as keyof typeof PAGE_NAVIGATION_MAP];
  if (pageMatch) {
    return pageMatch;
  }
  
  // Check for partial matches with admin-related terms
  if (normalizedQuery.includes('admin') || normalizedQuery.includes('অ্যাডমিন')) {
    if (normalizedQuery.includes('vendor') || normalizedQuery.includes('বিক্রেতা')) {
      return '/admin/dashboard?tab=vendors';
    }
    if (normalizedQuery.includes('product') || normalizedQuery.includes('পণ্য')) {
      return '/admin/dashboard?tab=products';
    }
    if (normalizedQuery.includes('order') || normalizedQuery.includes('অর্ডার')) {
      return '/admin/dashboard?tab=orders';
    }
    if (normalizedQuery.includes('user') || normalizedQuery.includes('ব্যবহারকারী')) {
      return '/admin/dashboard?tab=users';
    }
    if (normalizedQuery.includes('financial') || normalizedQuery.includes('আর্থিক') || normalizedQuery.includes('revenue')) {
      return '/admin/dashboard?tab=financials';
    }
    if (normalizedQuery.includes('report') || normalizedQuery.includes('প্রতিবেদন') || normalizedQuery.includes('analytics')) {
      return '/admin/dashboard?tab=reports';
    }
    if (normalizedQuery.includes('setting') || normalizedQuery.includes('সেটিং')) {
      return '/admin/dashboard?tab=settings';
    }
    if (normalizedQuery.includes('notification') || normalizedQuery.includes('বিজ্ঞপ্তি')) {
      return '/admin/dashboard?tab=notifications';
    }
    // Default to main admin dashboard
    return '/admin/dashboard';
  }
  
  // Check for management-related terms
  if (normalizedQuery.includes('management') || normalizedQuery.includes('ব্যবস্থাপনা')) {
    if (normalizedQuery.includes('vendor') || normalizedQuery.includes('বিক্রেতা')) {
      return '/admin/dashboard?tab=vendors';
    }
    if (normalizedQuery.includes('product') || normalizedQuery.includes('পণ্য')) {
      return '/admin/dashboard?tab=products';
    }
    if (normalizedQuery.includes('order') || normalizedQuery.includes('অর্ডার')) {
      return '/admin/dashboard?tab=orders';
    }
    if (normalizedQuery.includes('user') || normalizedQuery.includes('ব্যবহারকারী')) {
      return '/admin/dashboard?tab=users';
    }
  }
  
  return null;
};

export const getPageSuggestions = (query: string): string[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return [];
  }
  
  const suggestions: string[] = [];
  
  // Check all page navigation mappings for partial matches
  Object.keys(PAGE_NAVIGATION_MAP).forEach(key => {
    if (key.toLowerCase().includes(normalizedQuery) || normalizedQuery.includes(key.toLowerCase())) {
      suggestions.push(key);
    }
  });
  
  // Remove duplicates and limit to 5 suggestions
  return [...new Set(suggestions)].slice(0, 5);
};

export const isConversationalQuery = (query: string): boolean => {
  const conversationalPatterns = [
    'show me', 'take me to', 'go to', 'open', 'navigate to',
    'আমাকে দেখান', 'নিয়ে যান', 'খুলুন', 'যান'
  ];
  
  const normalizedQuery = query.toLowerCase();
  return conversationalPatterns.some(pattern => normalizedQuery.includes(pattern));
};

export const extractNavigationIntent = (query: string): string | null => {
  const normalizedQuery = query.toLowerCase();
  
  // Remove conversational words
  const cleanQuery = normalizedQuery
    .replace(/show me|take me to|go to|open|navigate to/g, '')
    .replace(/আমাকে দেখান|নিয়ে যান|খুলুন|যান/g, '')
    .trim();
  
  return getDirectPageMatch(cleanQuery);
};
