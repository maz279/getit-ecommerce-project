
import { SearchResult } from './types';
import { categoriesData } from '@/data/categoriesData';
import { womensFashionHierarchical } from '@/data/categories/fashion/womensFashionHierarchical';

export class ContentIndexer {
  // Index all hierarchical fashion data
  public indexHierarchicalFashionData(): SearchResult[] {
    const results: SearchResult[] = [];
    
    // Index women's fashion hierarchical data
    Object.entries(womensFashionHierarchical.subcategories).forEach(([mainKey, mainCategory]) => {
      // Add main category
      results.push({
        id: `fashion-womens-${mainKey}`,
        title: mainCategory.name,
        description: `Browse ${mainCategory.name} in women's fashion`,
        type: 'category',
        url: `/categories/fashion/womens-fashion?category=${mainKey}`,
        category: 'Fashion',
        tags: [mainCategory.name.toLowerCase(), 'fashion', 'womens', 'women'],
        dateAdded: new Date(),
        isActive: true
      });

      // Index subcategories
      Object.entries(mainCategory.subcategories).forEach(([subKey, subCategory]) => {
        results.push({
          id: `fashion-womens-${mainKey}-${subKey}`,
          title: subCategory.name,
          description: `Explore ${subCategory.name} in ${mainCategory.name}`,
          type: 'category',
          url: `/categories/fashion/womens-fashion?category=${mainKey}&subcategory=${subKey}`,
          category: 'Fashion',
          tags: [subCategory.name.toLowerCase(), mainCategory.name.toLowerCase(), 'fashion'],
          dateAdded: new Date(),
          isActive: true
        });

        // Index sub-subcategories and items
        Object.entries(subCategory.subcategories).forEach(([subSubKey, subSubCategory]) => {
          results.push({
            id: `fashion-womens-${mainKey}-${subKey}-${subSubKey}`,
            title: subSubCategory.name,
            description: `Shop ${subSubCategory.name} - ${subSubCategory.items.length} items available`,
            type: 'category',
            url: `/categories/fashion/womens-fashion?category=${mainKey}&subcategory=${subKey}&subsubcategory=${subSubKey}`,
            category: 'Fashion',
            tags: [subSubCategory.name.toLowerCase(), subCategory.name.toLowerCase(), 'products'],
            dateAdded: new Date(),
            isActive: true
          });

          // Index individual items
          subSubCategory.items.forEach(item => {
            results.push({
              id: `fashion-item-${mainKey}-${subKey}-${subSubKey}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
              title: item.name,
              description: `${item.name} - ${item.count} products available in ${subSubCategory.name}`,
              type: 'product',
              url: `/categories/fashion/womens-fashion?subsubcategory=${item.name}`,
              category: 'Fashion',
              tags: [
                item.name.toLowerCase(),
                subSubCategory.name.toLowerCase(),
                subCategory.name.toLowerCase(),
                mainCategory.name.toLowerCase(),
                'fashion',
                'womens',
                'product'
              ],
              dateAdded: new Date(),
              isActive: true
            });
          });
        });
      });
    });

    return results;
  }

  // Index all category data comprehensively
  public indexAllCategoryData(): SearchResult[] {
    const results: SearchResult[] = [];

    categoriesData.forEach(mainCategory => {
      // Main category with enhanced tags
      results.push({
        id: mainCategory.id,
        title: mainCategory.name,
        description: `Browse all ${mainCategory.name} products from verified vendors`,
        type: 'category',
        url: `/categories/${mainCategory.id}`,
        category: mainCategory.name,
        tags: [
          mainCategory.name.toLowerCase(),
          'category',
          'products',
          'shopping',
          'browse'
        ],
        dateAdded: new Date(),
        isActive: true
      });

      // Index subcategories with full paths
      Object.entries(mainCategory.subcategories).forEach(([key, subcategory]) => {
        results.push({
          id: `${mainCategory.id}-${key}`,
          title: subcategory.name,
          description: `${subcategory.name} products in ${mainCategory.name} category`,
          type: 'category',
          url: `/categories/${mainCategory.id}/${key}`,
          category: mainCategory.name,
          tags: [
            subcategory.name.toLowerCase(),
            mainCategory.name.toLowerCase(),
            'subcategory',
            'products'
          ],
          dateAdded: new Date(),
          isActive: true
        });

        // Index sub-subcategories
        subcategory.subcategories?.forEach(subcat => {
          const subcatId = subcat.name.toLowerCase().replace(/\s+/g, '-');
          results.push({
            id: `${mainCategory.id}-${key}-${subcatId}`,
            title: subcat.name,
            description: `${subcat.name} - ${subcat.count} products available`,
            type: 'product',
            url: `/categories/${mainCategory.id}/${key}?subsubcategory=${encodeURIComponent(subcat.name)}`,
            category: mainCategory.name,
            tags: [
              subcat.name.toLowerCase(),
              subcategory.name.toLowerCase(),
              mainCategory.name.toLowerCase(),
              'products',
              'items'
            ],
            dateAdded: new Date(),
            isActive: true
          });
        });
      });
    });

    return results;
  }

  // Index page content with enhanced searchability
  public indexPageContent(): SearchResult[] {
    return [
      {
        id: 'home-page',
        title: 'Home | GetIt Bangladesh',
        description: 'Bangladesh\'s leading multi-vendor ecommerce platform for online shopping',
        type: 'page',
        url: '/',
        tags: ['home', 'homepage', 'main', 'গৃহপাতা', 'ecommerce', 'shopping', 'bangladesh'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'new-arrivals-page',
        title: 'New Arrivals | নতুন পণ্য',
        description: 'Discover the latest products from verified vendors across Bangladesh',
        type: 'page',
        url: '/new-arrivals',
        tags: ['new', 'arrivals', 'latest', 'নতুন', 'পণ্য', 'fresh', 'trending', 'recent'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'categories-page',
        title: 'Categories | বিভাগসমূহ',
        description: 'Browse all product categories and subcategories',
        type: 'page',
        url: '/categories',
        tags: ['categories', 'browse', 'বিভাগ', 'section', 'all', 'products'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'wishlist-page',
        title: 'Wishlist | পছন্দের তালিকা',
        description: 'Your saved favorite products and wishlist management',
        type: 'page',
        url: '/wishlist',
        tags: ['wishlist', 'favorites', 'saved', 'পছন্দ', 'heart', 'love'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'search-results-page',
        title: 'Search Results',
        description: 'Search results page with filters and sorting options',
        type: 'page',
        url: '/search',
        tags: ['search', 'results', 'find', 'discover', 'খুঁজুন'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Index navigation and UI elements
  public indexNavigationElements(): SearchResult[] {
    return [
      {
        id: 'nav-electronics',
        title: 'Electronics Navigation',
        description: 'Navigate to electronics section',
        type: 'page',
        url: '/categories/electronics',
        tags: ['electronics', 'navigation', 'menu', 'tech', 'gadgets'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'nav-fashion',
        title: 'Fashion Navigation',
        description: 'Navigate to fashion section',
        type: 'page',
        url: '/categories/fashion',
        tags: ['fashion', 'navigation', 'menu', 'clothing', 'apparel'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'nav-home-garden',
        title: 'Home & Garden Navigation',
        description: 'Navigate to home and garden section',
        type: 'page',
        url: '/categories/home-garden',
        tags: ['home', 'garden', 'navigation', 'menu', 'furniture', 'decor'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }

  // Comprehensive indexing method
  public indexAllContent(): SearchResult[] {
    return [
      ...this.indexPageContent(),
      ...this.indexAllCategoryData(),
      ...this.indexHierarchicalFashionData(),
      ...this.indexNavigationElements()
    ];
  }
}
