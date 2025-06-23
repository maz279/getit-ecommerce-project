import { SearchResult, SearchServiceConfig } from './types';
import { SearchIndex } from './SearchIndex';
import { ContentIndexer } from './ContentIndexer';
import { adminContentIndexer } from '../admin/AdminContentIndexer';
import { mlSearchEnhancer } from '../ml/MLSearchEnhancer';

export class EnhancedSearchService {
  private searchIndex: SearchIndex;
  private contentIndexer: ContentIndexer;
  private config: SearchServiceConfig;

  constructor(config: SearchServiceConfig = {}) {
    this.config = {
      autoIndexInterval: 5 * 60 * 1000, // 5 minutes
      maxResults: 20,
      ...config
    };
    
    this.searchIndex = new SearchIndex();
    this.contentIndexer = new ContentIndexer();
    this.buildComprehensiveIndex();
    
    console.log('Enhanced search service initialized with ML capabilities');
  }

  // Build comprehensive search index including admin content
  private buildComprehensiveIndex() {
    const allContent = this.contentIndexer.indexAllContent();
    const adminContent = adminContentIndexer.indexAllAdminContent();
    
    const combinedContent = [...allContent, ...adminContent];
    combinedContent.forEach(item => this.searchIndex.addToIndex(item));
    
    console.log(`Comprehensive search index built with ${combinedContent.length} items (${adminContent.length} admin items)`);
  }

  // ML-Enhanced search with navigation mapping
  public async searchWithML(query: string, userId?: string, limit: number = this.config.maxResults || 20): Promise<{
    results: SearchResult[];
    navigationSuggestions: Array<{
      title: string;
      url: string;
      type: string;
      description: string;
    }>;
    mlEnhanced: boolean;
  }> {
    console.log('ML Enhanced Search: Processing query with AI:', query);
    
    // Get base search results
    const baseResults = this.searchIndex.search(query, limit * 2);
    
    // Enhance with ML
    const enhancedResults = await mlSearchEnhancer.enhanceSearchResults(query, baseResults, userId);
    
    // Generate navigation suggestions based on ML-enhanced results
    const navigationSuggestions = enhancedResults
      .filter(result => result.type === 'category' || result.type === 'page')
      .slice(0, 5)
      .map(result => ({
        title: result.title,
        url: result.url || '#',
        type: result.type,
        description: result.description
      }));

    return { 
      results: enhancedResults.slice(0, limit), 
      navigationSuggestions,
      mlEnhanced: true
    };
  }

  // Enhanced search with navigation mapping (backwards compatibility)
  public searchWithNavigation(query: string, limit: number = this.config.maxResults || 20): {
    results: SearchResult[];
    navigationSuggestions: Array<{
      title: string;
      url: string;
      type: string;
      description: string;
    }>;
  } {
    const results = this.searchIndex.search(query, limit);
    
    // Generate navigation suggestions based on search results
    const navigationSuggestions = results
      .filter(result => result.type === 'category' || result.type === 'page')
      .slice(0, 5)
      .map(result => ({
        title: result.title,
        url: result.url || '#',
        type: result.type,
        description: result.description
      }));

    return { results, navigationSuggestions };
  }

  // Get ML-enhanced contextual suggestions
  public async getMLContextualSuggestions(query: string): Promise<{
    searchSuggestions: string[];
    navigationSuggestions: Array<{
      title: string;
      url: string;
      type: string;
    }>;
    mlGenerated: boolean;
  }> {
    console.log('ML Search: Getting enhanced contextual suggestions');
    
    // Get ML-powered suggestions
    const mlSuggestions = await mlSearchEnhancer.generateSearchSuggestions(query);
    
    // Get traditional suggestions as fallback
    const traditionalSuggestions = this.searchIndex.getSuggestions(query, 4);
    
    // Combine and deduplicate
    const allSuggestions = [...new Set([...mlSuggestions, ...traditionalSuggestions])];
    
    const pageResults = this.searchIndex.search(query, 5).filter(r => r.type === 'page' || r.type === 'category');
    
    const navigationSuggestions = pageResults.map(result => ({
      title: result.title,
      url: result.url || '#',
      type: result.type
    }));

    return { 
      searchSuggestions: allSuggestions.slice(0, 8), 
      navigationSuggestions,
      mlGenerated: true
    };
  }

  // Get contextual suggestions with navigation (backwards compatibility)
  public getContextualSuggestions(query: string): {
    searchSuggestions: string[];
    navigationSuggestions: Array<{
      title: string;
      url: string;
      type: string;
    }>;
  } {
    const searchSuggestions = this.searchIndex.getSuggestions(query, 8);
    const pageResults = this.searchIndex.search(query, 5).filter(r => r.type === 'page' || r.type === 'category');
    
    const navigationSuggestions = pageResults.map(result => ({
      title: result.title,
      url: result.url || '#',
      type: result.type
    }));

    return { searchSuggestions, navigationSuggestions };
  }

  // Admin-specific search
  public searchAdminContent(query: string, limit: number = 10): SearchResult[] {
    const allResults = this.searchIndex.search(query, 50);
    return allResults.filter(result => 
      result.category?.includes('Management') || 
      result.category?.includes('Admin') ||
      result.category?.includes('Dashboard') ||
      result.category?.includes('System') ||
      result.tags?.some(tag => ['admin', 'dashboard', 'management', 'system'].includes(tag))
    ).slice(0, limit);
  }

  // Search specific content types
  public searchByType(query: string, type: 'product' | 'category' | 'page' | 'vendor', limit: number = 10): SearchResult[] {
    const allResults = this.searchIndex.search(query, 50);
    return allResults.filter(result => result.type === type).slice(0, limit);
  }

  // Refresh index with latest content including admin content
  public refreshComprehensiveIndex() {
    this.searchIndex.clearIndex();
    this.buildComprehensiveIndex();
    console.log('Comprehensive search index refreshed with admin content');
  }

  // Regular search service methods
  public search(query: string, limit: number = this.config.maxResults || 20): SearchResult[] {
    return this.searchIndex.search(query, limit);
  }

  public getSuggestions(query: string, limit: number = 5): string[] {
    return this.searchIndex.getSuggestions(query, limit);
  }

  public getPageSuggestions(query: string): string[] {
    return this.searchIndex.getPageSuggestions(query);
  }

  public addToIndex(item: SearchResult) {
    this.searchIndex.addToIndex(item);
  }

  public getIndexedItems(): SearchResult[] {
    return this.searchIndex.getAllItems();
  }

  // Missing methods that were causing errors
  public removeFromIndex(itemId: string) {
    console.log('Removing from search index:', itemId);
    // Implementation would depend on SearchIndex having a remove method
    // For now, we'll rebuild the index without this item
    const allItems = this.searchIndex.getAllItems().filter(item => item.id !== itemId);
    this.searchIndex.clearIndex();
    allItems.forEach(item => this.searchIndex.addToIndex(item));
  }

  public refreshIndex() {
    console.log('Refreshing search index');
    this.refreshComprehensiveIndex();
  }

  public autoIndexNewContent() {
    console.log('Auto-indexing new content including admin content');
    const newContent = this.contentIndexer.indexAllContent();
    const newAdminContent = adminContentIndexer.indexAllAdminContent();
    const allNewContent = [...newContent, ...newAdminContent];
    
    const existingItems = this.searchIndex.getAllItems();
    
    const newItems = allNewContent.filter(newItem => 
      !existingItems.some(existingItem => existingItem.id === newItem.id)
    );
    
    newItems.forEach(item => this.searchIndex.addToIndex(item));
    
    if (newItems.length > 0) {
      console.log(`Auto-indexed ${newItems.length} new items (including admin content)`);
    }
  }
}
