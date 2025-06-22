
import { PAGE_NAVIGATION_MAP } from './constants';

// Get page suggestions based on query
export const getPageSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const matchingPages = Object.keys(PAGE_NAVIGATION_MAP).filter(page => 
    page.includes(lowerQuery) || lowerQuery.includes(page)
  );
  
  return matchingPages.slice(0, 5);
};

// Check if query matches a page name
export const getDirectPageMatch = (query: string): string | null => {
  const lowerQuery = query.toLowerCase().trim();
  return PAGE_NAVIGATION_MAP[lowerQuery as keyof typeof PAGE_NAVIGATION_MAP] || null;
};

// Check if query is conversational
export const isConversationalQuery = (query: string): boolean => {
  return /^(show me|find|search for|i want|i need|get me|what are|where can|how to)/i.test(query);
};
