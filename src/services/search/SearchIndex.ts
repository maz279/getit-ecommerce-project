
import { SearchResult, SearchIndexEntry } from './types';

export class SearchIndex {
  private searchIndex: SearchIndexEntry[] = [];
  private indexListeners: Set<() => void> = new Set();

  constructor() {
    console.log('Search index initialized');
  }

  // Subscribe to index changes
  public onIndexUpdate(callback: () => void) {
    this.indexListeners.add(callback);
    return () => this.indexListeners.delete(callback);
  }

  // Notify listeners of index changes
  private notifyIndexUpdate() {
    this.indexListeners.forEach(callback => callback());
  }

  // Add new item to search index
  public addToIndex(item: SearchResult) {
    const existingIndex = this.searchIndex.findIndex(indexItem => indexItem.id === item.id);
    const searchableText = this.createSearchableText(item);
    const indexEntry: SearchIndexEntry = {
      ...item,
      searchableText,
      lastUpdated: new Date()
    };

    if (existingIndex !== -1) {
      this.searchIndex[existingIndex] = indexEntry;
      console.log('Updated existing item in search index:', item.id);
    } else {
      this.searchIndex.push(indexEntry);
      console.log('Added new item to search index:', item.id);
    }

    this.notifyIndexUpdate();
  }

  // Remove item from search index
  public removeFromIndex(itemId: string) {
    const initialLength = this.searchIndex.length;
    this.searchIndex = this.searchIndex.filter(item => item.id !== itemId);
    
    if (this.searchIndex.length < initialLength) {
      console.log('Removed item from search index:', itemId);
      this.notifyIndexUpdate();
    }
  }

  // Clear and rebuild index
  public clearIndex() {
    this.searchIndex = [];
    this.notifyIndexUpdate();
  }

  // Get all indexed items
  public getAllItems(): SearchResult[] {
    return this.searchIndex.map(({ searchableText, lastUpdated, ...item }) => item);
  }

  // Get index entries for searching
  public getIndexEntries(): SearchIndexEntry[] {
    return [...this.searchIndex];
  }

  // Search through index
  public search(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(/\s+/);
    const results: Array<SearchIndexEntry & { score: number }> = [];

    this.searchIndex.forEach(item => {
      let score = 0;

      searchTerms.forEach(term => {
        // Exact title match (highest score)
        if (item.title.toLowerCase().includes(term)) {
          score += 10;
        }
        
        // Description match
        if (item.description.toLowerCase().includes(term)) {
          score += 5;
        }
        
        // Category/brand match
        if ((item.category || '').toLowerCase().includes(term)) {
          score += 7;
        }
        
        if ((item.brand || '').toLowerCase().includes(term)) {
          score += 7;
        }
        
        // Tags match
        if ((item.tags || []).some(tag => tag.includes(term))) {
          score += 3;
        }
        
        // Searchable text match
        if (item.searchableText.includes(term)) {
          score += 1;
        }
      });

      // Boost score for newer items
      if (item.dateAdded) {
        const daysSinceAdded = (Date.now() - item.dateAdded.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceAdded < 7) score += 2;
      }

      // Only include active items
      if (score > 0 && (item.isActive !== false)) {
        results.push({ ...item, score });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, searchableText, lastUpdated, ...item }) => item);
  }

  // Get suggestions
  public getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const searchTerm = query.toLowerCase();

    this.searchIndex.forEach(item => {
      // Title suggestions
      if (item.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(item.title);
      }
      
      // Tag suggestions
      item.tags?.forEach(tag => {
        if (tag.includes(searchTerm) && tag.length > searchTerm.length) {
          suggestions.add(tag);
        }
      });
      
      // Brand suggestions
      if (item.brand && item.brand.toLowerCase().includes(searchTerm)) {
        suggestions.add(item.brand);
      }
      
      // Category suggestions
      if (item.category && item.category.toLowerCase().includes(searchTerm)) {
        suggestions.add(item.category);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Get page suggestions
  public getPageSuggestions(query: string): string[] {
    const pages = this.searchIndex.filter(item => item.type === 'page');
    const searchTerm = query.toLowerCase();
    
    return pages
      .filter(page => 
        page.title.toLowerCase().includes(searchTerm) ||
        (page.tags || []).some(tag => tag.includes(searchTerm))
      )
      .map(page => page.title)
      .slice(0, 3);
  }

  private createSearchableText(item: SearchResult): string {
    return `${item.title} ${item.description} ${item.category || ''} ${item.brand || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
  }
}
