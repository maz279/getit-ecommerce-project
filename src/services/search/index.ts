
import { EnhancedSearchService } from './EnhancedSearchService';

// Create singleton instance
export const enhancedSearchService = new EnhancedSearchService({
  autoIndexInterval: 5 * 60 * 1000, // 5 minutes
  maxResults: 20
});

// Export the service and types
export { EnhancedSearchService };
export * from './types';

// Initialize the service
enhancedSearchService.refreshIndex();
console.log('Enhanced Search Service with AI/NLP initialized');
