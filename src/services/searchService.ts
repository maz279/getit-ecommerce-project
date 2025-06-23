
import { EnhancedSearchService } from './search/EnhancedSearchService';

// Create and export the enhanced search service instance
export const searchService = new EnhancedSearchService({
  maxResults: 20,
  autoIndexInterval: 5 * 60 * 1000
});

// Export types for backwards compatibility
export type { SearchResult } from './search/types';
