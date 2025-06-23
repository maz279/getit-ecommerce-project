
import { DatabaseService } from '@/services/database/DatabaseService';
import { ElasticsearchService } from '@/services/external/ElasticsearchService';
import { RedisService } from '@/services/external/RedisService';

export class DatabaseSearchService {
  static async performSearch(
    query: string,
    filters?: Record<string, any>,
    userId?: string
  ): Promise<{
    results: any[];
    total: number;
    cached: boolean;
    source: string;
  }> {
    // Check cache first
    const cacheKey = `search:${query}:${JSON.stringify(filters || {})}`;
    const cachedResults = await RedisService.get(cacheKey);
    
    if (cachedResults) {
      return { ...cachedResults, cached: true };
    }

    try {
      // Try Elasticsearch first, fall back to PostgreSQL
      const searchResults = await ElasticsearchService.search(query, filters);
      
      // Log search query for analytics
      if (userId) {
        await DatabaseService.logSearchQuery(userId, query, searchResults.total);
      }

      // Cache results for 10 minutes
      await RedisService.set(cacheKey, {
        results: searchResults.results,
        total: searchResults.total,
        source: searchResults.source || 'elasticsearch'
      }, 600);

      return { ...searchResults, cached: false };
    } catch (error) {
      console.error('Search service error:', error);
      throw error;
    }
  }

  static async updateSearchIndex(
    itemId: string,
    itemType: string,
    title: string,
    description?: string,
    metadata?: any
  ): Promise<void> {
    try {
      // Update PostgreSQL search index
      await DatabaseService.updateSearchIndex(itemId, itemType, title, description, metadata);
      
      // Update Elasticsearch index if available
      await ElasticsearchService.indexDocument('search_index', `${itemType}_${itemId}`, {
        item_id: itemId,
        item_type: itemType,
        title,
        description,
        searchable_content: `${title} ${description || ''}`,
        metadata: metadata || {}
      });

      // Invalidate relevant cache
      const cachePattern = `search:*`;
      // Note: This would need a more sophisticated cache invalidation strategy
      console.log('Cache invalidation needed for pattern:', cachePattern);
    } catch (error) {
      console.error('Search index update error:', error);
      throw error;
    }
  }
}
