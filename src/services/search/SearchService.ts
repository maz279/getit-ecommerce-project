
import { SearchResult, SearchServiceConfig } from './types';
import { SearchIndex } from './SearchIndex';
import { ContentIndexer } from './ContentIndexer';

export class SearchService {
  private searchIndex: SearchIndex;
  private contentIndexer: ContentIndexer;
  private config: SearchServiceConfig;

  constructor(config: SearchServiceConfig = {}) {
    this.config = {
      autoIndexInterval: 5 * 60 * 1000, // 5 minutes
      maxResults: 10,
      ...config
    };
    
    this.searchIndex = new SearchIndex();
    this.contentIndexer = new ContentIndexer();
    this.buildSearchIndex();
    
    console.log('Search service initialized with comprehensive page indexing');
  }

  // Subscribe to index changes
  public onIndexUpdate(callback: () => void) {
    return this.searchIndex.onIndexUpdate(callback);
  }

  // Add new item to search index
  public addToIndex(item: SearchResult) {
    this.searchIndex.addToIndex(item);
  }

  // Remove item from search index
  public removeFromIndex(itemId: string) {
    this.searchIndex.removeFromIndex(itemId);
  }

  // Refresh the entire index
  public refreshIndex() {
    this.searchIndex.clearIndex();
    this.buildSearchIndex();
    console.log('Search index refreshed with all pages');
  }

  // Get all indexed items
  public getIndexedItems(): SearchResult[] {
    return this.searchIndex.getAllItems();
  }

  // Auto-index new content from various sources
  public autoIndexNewContent() {
    try {
      // Index all content types including all pages
      const allContent = this.contentIndexer.indexAllContent();
      const existingItems = this.getIndexedItems();
      
      const newItems = allContent.filter(newItem => 
        !existingItems.some(existingItem => existingItem.id === newItem.id)
      );
      
      newItems.forEach(item => this.addToIndex(item));
      
      if (newItems.length > 0) {
        console.log(`Auto-indexed ${newItems.length} new items including pages`);
      }
    } catch (error) {
      console.error('Auto-indexing failed:', error);
    }
  }

  // Search functionality
  public search(query: string, limit: number = this.config.maxResults || 10): SearchResult[] {
    return this.searchIndex.search(query, limit);
  }

  // Get suggestions
  public getSuggestions(query: string, limit: number = 5): string[] {
    return this.searchIndex.getSuggestions(query, limit);
  }

  // Get page suggestions
  public getPageSuggestions(query: string): string[] {
    return this.searchIndex.getPageSuggestions(query);
  }

  private buildSearchIndex() {
    // Add all content to index using ContentIndexer
    const allContent = this.contentIndexer.indexAllContent();
    allContent.forEach(item => this.addToIndex(item));

    console.log(`Search index built with ${this.getIndexedItems().length} items including all pages`);
  }
}
