import { categoriesData } from '@/data/categoriesData';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'category' | 'page' | 'vendor' | 'brand' | 'article';
  url: string;
  image?: string;
  category?: string;
  brand?: string;
  price?: number;
  rating?: number;
  tags?: string[];
  dateAdded?: Date;
  isActive?: boolean;
}

interface SearchIndexEntry extends SearchResult {
  searchableText: string;
  lastUpdated: Date;
}

class SearchService {
  private searchIndex: SearchIndexEntry[] = [];
  private indexListeners: Set<() => void> = new Set();

  constructor() {
    this.buildSearchIndex();
    console.log('Search service initialized with automatic indexing');
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

  // Refresh the entire index
  public refreshIndex() {
    this.searchIndex = [];
    this.buildSearchIndex();
    console.log('Search index refreshed');
    this.notifyIndexUpdate();
  }

  // Get all indexed items
  public getIndexedItems(): SearchResult[] {
    return this.searchIndex.map(({ searchableText, lastUpdated, ...item }) => item);
  }

  // Auto-index new content from various sources
  public autoIndexNewContent() {
    // This would be called periodically or triggered by content changes
    try {
      // Index new pages (if any new routes are added)
      this.autoIndexPages();
      
      // Index new categories (if category data changes)
      this.autoIndexCategories();
      
      // Index new products (would integrate with product management system)
      this.autoIndexProducts();
      
      console.log('Auto-indexing completed');
      this.notifyIndexUpdate();
    } catch (error) {
      console.error('Auto-indexing failed:', error);
    }
  }

  private createSearchableText(item: SearchResult): string {
    return `${item.title} ${item.description} ${item.category || ''} ${item.brand || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
  }

  private autoIndexPages() {
    // Automatically detect and index new pages
    const currentPages = this.searchIndex.filter(item => item.type === 'page');
    const knownPageIds = new Set(currentPages.map(page => page.id));
    
    // Add any new pages that aren't already indexed
    const newPages = [
      // This could be dynamically generated from routing information
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

    newPages.forEach(page => {
      this.addToIndex(page);
    });
  }

  private autoIndexCategories() {
    // Re-index categories if category data has changed
    const existingCategories = this.searchIndex.filter(item => item.type === 'category');
    const categoryTimestamp = localStorage.getItem('categoryIndexTimestamp');
    const lastCategoryUpdate = categoryTimestamp ? new Date(categoryTimestamp) : new Date(0);
    
    // Check if we need to re-index categories
    const shouldReindex = existingCategories.length === 0 || 
                          Date.now() - lastCategoryUpdate.getTime() > 24 * 60 * 60 * 1000; // 24 hours

    if (shouldReindex) {
      // Remove old category entries
      this.searchIndex = this.searchIndex.filter(item => item.type !== 'category');
      
      // Re-add all categories
      this.addCategoryData();
      
      localStorage.setItem('categoryIndexTimestamp', new Date().toISOString());
    }
  }

  private autoIndexProducts() {
    // This would integrate with a product management system
    // For now, we'll simulate checking for new products
    const lastProductCheck = localStorage.getItem('lastProductIndexCheck');
    const lastCheck = lastProductCheck ? new Date(lastProductCheck) : new Date(0);
    
    // Check if it's been more than 1 hour since last check
    if (Date.now() - lastCheck.getTime() > 60 * 60 * 1000) {
      // Simulate finding new products
      this.addMockNewProducts();
      localStorage.setItem('lastProductIndexCheck', new Date().toISOString());
    }
  }

  private addMockNewProducts() {
    // Simulate new products being added
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

    // Only add if not already exists
    newProducts.forEach(product => {
      const exists = this.searchIndex.some(item => item.title === product.title);
      if (!exists) {
        this.addToIndex(product);
      }
    });
  }

  private buildSearchIndex() {
    // Add pages
    this.addPageData();
    
    // Add categories
    this.addCategoryData();
    
    // Add sample products
    this.addProductData();
    
    // Add vendor/brand data
    this.addVendorData();
    
    // Add article/content data
    this.addContentData();

    console.log(`Search index built with ${this.searchIndex.length} items`);
  }

  private addPageData() {
    const pages = [
      {
        id: 'home',
        title: 'Home | GetIt',
        description: 'Bangladesh\'s leading multi-vendor ecommerce platform',
        type: 'page' as const,
        url: '/',
        tags: ['home', 'homepage', 'main', 'গৃহপাতা']
      },
      {
        id: 'new-arrivals',
        title: 'New Arrivals | নতুন পণ্য',
        description: 'Discover the latest products from verified vendors',
        type: 'page' as const,
        url: '/new-arrivals',
        tags: ['new', 'arrivals', 'latest', 'নতুন', 'পণ্য', 'fresh', 'trending']
      },
      {
        id: 'categories',
        title: 'Categories | বিভাগসমূহ',
        description: 'Browse all product categories',
        type: 'page' as const,
        url: '/categories',
        tags: ['categories', 'browse', 'বিভাগ', 'section']
      },
      {
        id: 'about',
        title: 'About Us | আমাদের সম্পর্কে',
        description: 'Learn about GetIt\'s mission and values',
        type: 'page' as const,
        url: '/about',
        tags: ['about', 'company', 'mission', 'সম্পর্কে']
      },
      {
        id: 'help',
        title: 'Help Center | সহায়তা',
        description: 'Get help and support for your shopping needs',
        type: 'page' as const,
        url: '/help',
        tags: ['help', 'support', 'faq', 'সহায়তা']
      },
      {
        id: 'login',
        title: 'Login | লগইন',
        description: 'Sign in to your GetIt account',
        type: 'page' as const,
        url: '/login',
        tags: ['login', 'signin', 'account', 'লগইন']
      },
      {
        id: 'register',
        title: 'Register | নিবন্ধন',
        description: 'Create a new GetIt account',
        type: 'page' as const,
        url: '/register',
        tags: ['register', 'signup', 'নিবন্ধন', 'account']
      },
      {
        id: 'wishlist',
        title: 'Wishlist | পছন্দের তালিকা',
        description: 'Your saved favorite products',
        type: 'page' as const,
        url: '/wishlist',
        tags: ['wishlist', 'favorites', 'saved', 'পছন্দ']
      },
      {
        id: 'profile',
        title: 'My Account | আমার অ্যাকাউন্ট',
        description: 'Manage your profile and settings',
        type: 'page' as const,
        url: '/profile',
        tags: ['profile', 'account', 'settings', 'অ্যাকাউন্ট']
      },
      {
        id: 'privacy',
        title: 'Privacy Policy | গোপনীয়তা নীতি',
        description: 'Our privacy policy and data protection',
        type: 'page' as const,
        url: '/privacy',
        tags: ['privacy', 'policy', 'গোপনীয়তা']
      },
      {
        id: 'terms',
        title: 'Terms of Service | সেবার শর্তাবলী',
        description: 'Terms and conditions for using GetIt',
        type: 'page' as const,
        url: '/terms',
        tags: ['terms', 'conditions', 'শর্তাবলী']
      }
    ];

    pages.forEach(page => this.addToIndex(page));
  }

  private addCategoryData() {
    categoriesData.forEach(mainCategory => {
      // Add main category
      this.addToIndex({
        id: mainCategory.id,
        title: mainCategory.name,
        description: `Browse ${mainCategory.name} products from verified vendors`,
        type: 'category',
        url: `/categories/${mainCategory.id}`,
        category: mainCategory.name,
        tags: [mainCategory.name.toLowerCase(), 'category', 'products']
      });

      // Add subcategories
      Object.entries(mainCategory.subcategories).forEach(([key, subcategory]) => {
        this.addToIndex({
          id: `${mainCategory.id}-${key}`,
          title: subcategory.name,
          description: `${subcategory.name} products in ${mainCategory.name}`,
          type: 'category',
          url: `/categories/${mainCategory.id}/${key}`,
          category: mainCategory.name,
          tags: [subcategory.name.toLowerCase(), mainCategory.name.toLowerCase(), 'subcategory']
        });

        // Add sub-subcategories
        subcategory.subcategories?.forEach(subcat => {
          this.addToIndex({
            id: `${mainCategory.id}-${key}-${subcat.name.toLowerCase().replace(/\s+/g, '-')}`,
            title: subcat.name,
            description: `${subcat.name} - ${subcat.count} products available`,
            type: 'category',
            url: `/categories/${mainCategory.id}/${key}?sub=${subcat.name}`,
            category: mainCategory.name,
            tags: [subcat.name.toLowerCase(), subcategory.name.toLowerCase(), 'products']
          });
        });
      });
    });
  }

  private addProductData() {
    // Sample products for search
    const sampleProducts = [
      {
        id: 'samsung-galaxy-s24',
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Latest flagship smartphone with AI features',
        type: 'product' as const,
        url: '/product/samsung-galaxy-s24',
        category: 'Electronics',
        brand: 'Samsung',
        price: 89999,
        rating: 4.5,
        tags: ['smartphone', 'android', 'samsung', 'mobile', 'phone']
      },
      {
        id: 'nike-air-max',
        title: 'Nike Air Max 270',
        description: 'Comfortable running shoes for daily wear',
        type: 'product' as const,
        url: '/product/nike-air-max',
        category: 'Fashion',
        brand: 'Nike',
        price: 12999,
        rating: 4.3,
        tags: ['shoes', 'nike', 'running', 'footwear', 'sports']
      },
      {
        id: 'dell-inspiron-15',
        title: 'Dell Inspiron 15 3000',
        description: 'Budget-friendly laptop for students and professionals',
        type: 'product' as const,
        url: '/product/dell-inspiron-15',
        category: 'Electronics',
        brand: 'Dell',
        price: 45999,
        rating: 4.1,
        tags: ['laptop', 'dell', 'computer', 'student', 'work']
      }
    ];

    sampleProducts.forEach(product => this.addToIndex(product));
  }

  private addVendorData() {
    const vendors = [
      {
        id: 'tech-world-bd',
        title: 'Tech World BD',
        description: 'Leading electronics vendor in Bangladesh',
        type: 'vendor' as const,
        url: '/vendor/tech-world-bd',
        category: 'Electronics',
        rating: 4.7,
        tags: ['vendor', 'electronics', 'technology', 'computer', 'mobile']
      },
      {
        id: 'fashion-hub',
        title: 'Fashion Hub',
        description: 'Trendy fashion and lifestyle products',
        type: 'vendor' as const,
        url: '/vendor/fashion-hub',
        category: 'Fashion',
        rating: 4.4,
        tags: ['vendor', 'fashion', 'clothing', 'lifestyle', 'apparel']
      }
    ];

    vendors.forEach(vendor => this.addToIndex(vendor));
  }

  private addContentData() {
    const articles = [
      {
        id: 'shopping-guide',
        title: 'Complete Shopping Guide for Bangladesh',
        description: 'Learn how to shop safely and effectively online',
        type: 'article' as const,
        url: '/help/shopping-guide',
        tags: ['guide', 'shopping', 'help', 'tips', 'বাংলাদেশ']
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods | পেমেন্ট পদ্ধতি',
        description: 'All available payment options including bKash, Nagad, Rocket',
        type: 'article' as const,
        url: '/help/payment-methods',
        tags: ['payment', 'bkash', 'nagad', 'rocket', 'পেমেন্ট']
      }
    ];

    articles.forEach(article => this.addToIndex(article));
  }

  search(query: string, limit: number = 10): SearchResult[] {
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
        if (daysSinceAdded < 7) score += 2; // Boost new items
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

  getSuggestions(query: string, limit: number = 5): string[] {
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

  getPageSuggestions(query: string): string[] {
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
}

export const searchService = new SearchService();

// Auto-index new content every 5 minutes
setInterval(() => {
  searchService.autoIndexNewContent();
}, 5 * 60 * 1000);

// Export a function to manually trigger indexing for new content
export const indexNewContent = (item: SearchResult) => {
  searchService.addToIndex(item);
};

export const removeFromSearchIndex = (itemId: string) => {
  searchService.removeFromIndex(itemId);
};
