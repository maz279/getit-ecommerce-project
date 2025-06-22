
import { SearchService } from './search/SearchService';

// Export types for backward compatibility
export type { SearchResult, SearchServiceConfig } from './search/types';

// Create and export the main search service instance
export const searchService = new SearchService();

// Export helper functions for backward compatibility
export const indexNewContent = (item: any) => {
  searchService.addToIndex(item);
};

export const removeFromSearchIndex = (itemId: string) => {
  searchService.removeFromIndex(itemId);
};

// Auto-index new content every 5 minutes
setInterval(() => {
  searchService.autoIndexNewContent();
}, 5 * 60 * 1000);
