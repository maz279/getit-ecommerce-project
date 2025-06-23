
import { SearchResult, SearchServiceConfig } from './types';
import { SearchIndex } from './SearchIndex';
import { ContentIndexer } from './ContentIndexer';

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
    
    console.log('Enhanced search service initialized with comprehensive indexing');
  }

  // Build comprehensive search index
  private buildComprehensiveIndex() {
    const allContent = this.contentIndexer.indexAllContent();
    allContent.forEach(item => this.searchIndex.addToIndex(item));
    
    console.log(`Comprehensive search index built with ${allContent.length} items`);
  }

  // Enhanced search with navigation mapping
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

  // Get contextual suggestions with navigation
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

  // Search specific content types
  public searchByType(query: string, type: 'product' | 'category' | 'page' | 'vendor', limit: number = 10): SearchResult[] {
    const allResults = this.searchIndex.search(query, 50);
    return allResults.filter(result => result.type === type).slice(0, limit);
  }

  // Refresh index with latest content
  public refreshComprehensiveIndex() {
    this.searchIndex.clearIndex();
    this.buildComprehensiveIndex();
    console.log('Comprehensive search index refreshed');
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
    console.log('Auto-indexing new content');
    // Check for new content and add to index
    const newContent = this.contentIndexer.indexAllContent();
    const existingItems = this.searchIndex.getAllItems();
    
    // Find new items that aren't already indexed
    const newItems = newContent.filter(newItem => 
      !existingItems.some(existingItem => existingItem.id === newItem.id)
    );
    
    // Add new items to index
    newItems.forEach(item => this.searchIndex.addToIndex(item));
    
    if (newItems.length > 0) {
      console.log(`Auto-indexed ${newItems.length} new items`);
    }
  }
}
