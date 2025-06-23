
import { mlManager } from '../../ml';
import { enhancedAISearchService } from '../../ai-search/enhancedAISearchService';

export class SearchService {
  async performIntelligentSearch(query: string, context?: {
    userId?: string;
    language?: 'en' | 'bn';
    searchType?: 'text' | 'voice' | 'image' | 'conversational';
    filters?: any;
  }): Promise<{
    results: any[];
    mlEnhancements: any;
    nlpInsights: any;
    personalizedRecommendations: any[];
    searchOptimizations: any;
  }> {
    console.log('Search Service: Performing intelligent search');

    try {
      const queryAnalysis = await enhancedAISearchService.analyzeQueryAdvanced(query, {
        language: context?.language,
        includeTranslation: true,
        includeKeywords: true
      });

      const baseResults = await this.getBaseSearchResults(query, context?.filters);

      const mlEnhancedResults = await mlManager.getSearchEnhancer().enhanceSearchResults(
        query, 
        baseResults, 
        context?.userId
      );

      const nlpEnhancedResults = await enhancedAISearchService.enhanceSearchWithContent(
        query,
        mlEnhancedResults
      );

      const personalizedRecommendations = context?.userId ? 
        await mlManager.getRecommendationEngine().generateRecommendations(context.userId, { 
          searchQuery: query,
          searchContext: context 
        }) : [];

      const searchOptimizations = await this.generateSearchOptimizations(queryAnalysis, nlpEnhancedResults);

      return {
        results: nlpEnhancedResults.enhancedResults,
        mlEnhancements: { mlEnhancedResults },
        nlpInsights: queryAnalysis.nlpAnalysis,
        personalizedRecommendations,
        searchOptimizations
      };
    } catch (error) {
      console.error('Intelligent search failed:', error);
      throw error;
    }
  }

  private async getBaseSearchResults(query: string, filters?: any): Promise<any[]> {
    return [
      {
        id: 'search_1',
        title: `${query} - Premium Product`,
        description: 'High quality product matching your search',
        price: 25000,
        category: 'Electronics'
      }
    ];
  }

  private async generateSearchOptimizations(queryAnalysis: any, results: any): Promise<any> {
    return {
      queryExpansions: queryAnalysis.expandedQueries || [],
      filterSuggestions: ['Price range', 'Brand', 'Rating'],
      sortRecommendations: ['Relevance', 'Price: Low to High', 'Customer Rating'],
      personalizedFilters: ['Recently Viewed', 'Recommended for You']
    };
  }
}

export const searchService = new SearchService();
