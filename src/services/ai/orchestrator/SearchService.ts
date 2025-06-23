
import { enhancedAISearchService } from '../../ai-search/enhancedAISearchService';
import { mlManager } from '../../ml';
import { nlpManager } from '../../nlp';

export class SearchService {
  private static instance: SearchService;

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

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
    console.log('Search Service: Performing intelligent search for:', query);

    const [searchResults, nlpInsights, mlEnhancements] = await Promise.all([
      this.performBaseSearch(query, context),
      this.analyzeSearchQuery(query, context?.language),
      this.enhanceWithML(query, context)
    ]);

    const personalizedRecommendations = context?.userId
      ? await this.getPersonalizedResults(context.userId, query, searchResults)
      : [];

    const searchOptimizations = await this.optimizeSearch(query, searchResults, context);

    return {
      results: searchResults,
      mlEnhancements,
      nlpInsights,
      personalizedRecommendations,
      searchOptimizations
    };
  }

  private async performBaseSearch(query: string, context: any): Promise<any[]> {
    const searchOptions = {
      query,
      language: context?.language || 'en',
      searchType: context?.searchType || 'text',
      filters: context?.filters || {}
    };

    return await enhancedAISearchService.search(searchOptions);
  }

  private async analyzeSearchQuery(query: string, language?: 'en' | 'bn'): Promise<any> {
    const analysis = await nlpManager.analyzeText(query, {
      includeIntent: true,
      includeKeywords: true,
      includeSentiment: true,
      language
    });

    return {
      intent: analysis.intent,
      keywords: analysis.keywords,
      sentiment: analysis.sentiment,
      searchType: this.classifySearchType(query, analysis),
      userNeed: this.identifyUserNeed(analysis),
      suggestions: this.generateSearchSuggestions(query, analysis)
    };
  }

  private async enhanceWithML(query: string, context: any): Promise<any> {
    const searchEnhancer = mlManager.getSearchEnhancer();
    
    return {
      enhancedQuery: await searchEnhancer.enhanceQuery(query),
      semanticMatches: await searchEnhancer.findSemanticMatches(query),
      categoryPredictions: await searchEnhancer.predictCategories(query),
      qualityScore: await searchEnhancer.assessSearchQuality(query),
      optimizations: await searchEnhancer.suggestOptimizations(query)
    };
  }

  private async getPersonalizedResults(userId: string, query: string, baseResults: any[]): Promise<any[]> {
    const userRecommendations = await mlManager.getRecommendationEngine()
      .generateRecommendations(userId, {
        trigger: 'search',
        searchQuery: query,
        context: 'search_results'
      });

    return userRecommendations.slice(0, 5);
  }

  private async optimizeSearch(query: string, results: any[], context: any): Promise<any> {
    return {
      resultCount: results.length,
      relevanceScore: this.calculateRelevanceScore(results),
      suggestionImprovements: this.generateImprovements(query, results),
      filterRecommendations: this.recommendFilters(results),
      searchPerformance: {
        speed: 'fast',
        accuracy: 'high',
        coverage: 'comprehensive'
      }
    };
  }

  private classifySearchType(query: string, analysis: any): string {
    if (query.includes('?')) return 'question';
    if (analysis.intent?.category === 'purchase') return 'shopping';
    if (analysis.intent?.category === 'comparison') return 'research';
    return 'general';
  }

  private identifyUserNeed(analysis: any): string {
    const intent = analysis.intent?.category;
    
    switch (intent) {
      case 'purchase': return 'buy_product';
      case 'comparison': return 'compare_options';
      case 'information': return 'learn_more';
      default: return 'explore';
    }
  }

  private generateSearchSuggestions(query: string, analysis: any): string[] {
    const suggestions = [];
    const keywords = analysis.keywords || [];
    
    keywords.slice(0, 3).forEach(keyword => {
      suggestions.push(`${keyword} reviews`);
      suggestions.push(`best ${keyword}`);
    });
    
    return suggestions.slice(0, 5);
  }

  private calculateRelevanceScore(results: any[]): number {
    if (!results.length) return 0;
    
    const scores = results.map(r => r.relevanceScore || 0.5);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  private generateImprovements(query: string, results: any[]): string[] {
    const improvements = [];
    
    if (results.length === 0) {
      improvements.push('Try broader search terms');
    } else if (results.length > 100) {
      improvements.push('Use more specific terms');
    }
    
    return improvements;
  }

  private recommendFilters(results: any[]): any[] {
    const filters = [];
    
    if (results.length > 20) {
      filters.push({ type: 'category', importance: 'high' });
      filters.push({ type: 'price_range', importance: 'medium' });
    }
    
    return filters;
  }
}

export const searchService = SearchService.getInstance();
