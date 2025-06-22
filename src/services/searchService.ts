
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
}

class SearchService {
  private searchIndex: SearchResult[] = [];

  constructor() {
    this.buildSearchIndex();
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

    this.searchIndex.push(...pages);
  }

  private addCategoryData() {
    categoriesData.forEach(mainCategory => {
      // Add main category
      this.searchIndex.push({
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
        this.searchIndex.push({
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
          this.searchIndex.push({
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

    this.searchIndex.push(...sampleProducts);
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

    this.searchIndex.push(...vendors);
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

    this.searchIndex.push(...articles);
  }

  search(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(/\s+/);
    const results: Array<SearchResult & { score: number }> = [];

    this.searchIndex.forEach(item => {
      let score = 0;
      const searchableText = `${item.title} ${item.description} ${item.category || ''} ${item.brand || ''} ${(item.tags || []).join(' ')}`.toLowerCase();

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
        
        // General text match
        if (searchableText.includes(term)) {
          score += 1;
        }
      });

      if (score > 0) {
        results.push({ ...item, score });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...item }) => item);
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
