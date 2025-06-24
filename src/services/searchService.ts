
import { EnhancedSearchService } from './search/EnhancedSearchService';

// Create and export the enhanced search service instance with comprehensive page indexing
export const searchService = new EnhancedSearchService({
  maxResults: 20,
  autoIndexInterval: 5 * 60 * 1000
});

// Initialize the search index with all pages
searchService.refreshComprehensiveIndex();

console.log('Search service initialized with all pages indexed for navigation');

// Export types for backwards compatibility
export type { SearchResult } from './search/types';
