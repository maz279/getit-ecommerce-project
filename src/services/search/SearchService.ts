
import { SearchResult, SearchServiceConfig } from './types';
import { SearchIndex } from './SearchIndex';
import { SearchDataBuilder } from './dataBuilders';

export class SearchService {
  private searchIndex: SearchIndex;
  private dataBuilder: SearchDataBuilder;
  private config: SearchServiceConfig;

  constructor(config: SearchServiceConfig = {}) {
    this.config = {
      autoIndexInterval: 5 * 60 * 1000, // 5 minutes
      maxResults: 10,
      ...config
    };
    
    this.searchIndex = new SearchIndex();
    this.dataBuilder = new SearchDataBuilder();
    this.buildSearchIndex();
    
    console.log('Search service initialized with automatic indexing');
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
    console.log('Search index refreshed');
  }

  // Get all indexed items
  public getIndexedItems(): SearchResult[] {
    return this.searchIndex.getAllItems();
  }

  // Auto-index new content from various sources
  public autoIndexNewContent() {
    try {
      this.autoIndexPages();
      this.autoIndexCategories();
      this.autoIndexProducts();
      
      console.log('Auto-indexing completed');
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
    // Add all data types to index
    this.dataBuilder.buildPageData().forEach(page => this.addToIndex(page));
    this.dataBuilder.buildCategoryData().forEach(category => this.addToIndex(category));
    this.dataBuilder.buildProductData().forEach(product => this.addToIndex(product));
    this.dataBuilder.buildVendorData().forEach(vendor => this.addToIndex(vendor));
    this.dataBuilder.buildContentData().forEach(content => this.addToIndex(content));

    console.log(`Search index built with ${this.getIndexedItems().length} items`);
  }

  private autoIndexPages() {
    const currentPages = this.getIndexedItems().filter(item => item.type === 'page');
    const knownPageIds = new Set(currentPages.map(page => page.id));
    
    const newPages = [
      {
        id: 'flash-sale',
        title: 'Flash Sale | ফ্ল্যাশ সেল',
        description: 'Limited time offers and lightning deals',
        type: 'page' as const,
        url: '/flash-sale',
        tags: ['sale', 'deals', 'offers', 'ফ্ল্যাশ', 'সেল']
      },
      {
        id: 'best-sellers',
        title: 'Best Sellers | বেস্ট সেলার',
        description: 'Most popular products across all categories',
        type: 'page' as const,
        url: '/best-sellers',
        tags: ['popular', 'trending', 'best', 'সেলার']
      }
    ].filter(page => !knownPageIds.has(page.id));

    newPages.forEach(page => this.addToIndex(page));
  }

  private autoIndexCategories() {
    const existingCategories = this.getIndexedItems().filter(item => item.type === 'category');
    const categoryTimestamp = localStorage.getItem('categoryIndexTimestamp');
    const lastCategoryUpdate = categoryTimestamp ? new Date(categoryTimestamp) : new Date(0);
    
    const shouldReindex = existingCategories.length === 0 || 
                          Date.now() - lastCategoryUpdate.getTime() > 24 * 60 * 60 * 1000;

    if (shouldReindex) {
      existingCategories.forEach(cat => this.removeFromIndex(cat.id));
      this.dataBuilder.buildCategoryData().forEach(category => this.addToIndex(category));
      localStorage.setItem('categoryIndexTimestamp', new Date().toISOString());
    }
  }

  private autoIndexProducts() {
    const lastProductCheck = localStorage.getItem('lastProductIndexCheck');
    const lastCheck = lastProductCheck ? new Date(lastProductCheck) : new Date(0);
    
    if (Date.now() - lastCheck.getTime() > 60 * 60 * 1000) {
      this.addMockNewProducts();
      localStorage.setItem('lastProductIndexCheck', new Date().toISOString());
    }
  }

  private addMockNewProducts() {
    const newProducts = [
      {
        id: `product-${Date.now()}-1`,
        title: 'iPhone 15 Pro Max',
        description: 'Latest Apple smartphone with titanium design',
        type: 'product' as const,
        url: '/product/iphone-15-pro-max',
        category: 'Electronics',
        brand: 'Apple',
        price: 149999,
        rating: 4.8,
        tags: ['smartphone', 'apple', 'iphone', 'mobile', 'new'],
        dateAdded: new Date(),
        isActive: true
      }
    ];

    newProducts.forEach(product => {
      const exists = this.getIndexedItems().some(item => item.title === product.title);
      if (!exists) {
        this.addToIndex(product);
      }
    });
  }
}
