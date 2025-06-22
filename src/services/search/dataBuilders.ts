import { SearchResult } from './types';
import { categoriesData } from '@/data/categoriesData';

export class SearchDataBuilder {
  // Build page data
  public buildPageData(): SearchResult[] {
    return [
      {
        id: 'home',
        title: 'Home | GetIt',
        description: 'Bangladesh\'s leading multi-vendor ecommerce platform',
        type: 'page',
        url: '/',
        tags: ['home', 'homepage', 'main', 'গৃহপাতা']
      },
      {
        id: 'new-arrivals',
        title: 'New Arrivals | নতুন পণ্য',
        description: 'Discover the latest products from verified vendors',
        type: 'page',
        url: '/new-arrivals',
        tags: ['new', 'arrivals', 'latest', 'নতুন', 'পণ্য', 'fresh', 'trending']
      },
      {
        id: 'categories',
        title: 'Categories | বিভাগসমূহ',
        description: 'Browse all product categories',
        type: 'page',
        url: '/categories',
        tags: ['categories', 'browse', 'বিভাগ', 'section']
      },
      {
        id: 'about',
        title: 'About Us | আমাদের সম্পর্কে',
        description: 'Learn about GetIt\'s mission and values',
        type: 'page',
        url: '/about',
        tags: ['about', 'company', 'mission', 'সম্পর্কে']
      },
      {
        id: 'help',
        title: 'Help Center | সহায়তা',
        description: 'Get help and support for your shopping needs',
        type: 'page',
        url: '/help',
        tags: ['help', 'support', 'faq', 'সহায়তা']
      },
      {
        id: 'login',
        title: 'Login | লগইন',
        description: 'Sign in to your GetIt account',
        type: 'page',
        url: '/login',
        tags: ['login', 'signin', 'account', 'লগইন']
      },
      {
        id: 'register',
        title: 'Register | নিবন্ধন',
        description: 'Create a new GetIt account',
        type: 'page',
        url: '/register',
        tags: ['register', 'signup', 'নিবন্ধন', 'account']
      },
      {
        id: 'wishlist',
        title: 'Wishlist | পছন্দের তালিকা',
        description: 'Your saved favorite products',
        type: 'page',
        url: '/wishlist',
        tags: ['wishlist', 'favorites', 'saved', 'পছন্দ']
      },
      {
        id: 'profile',
        title: 'My Account | আমার অ্যাকাউন্ট',
        description: 'Manage your profile and settings',
        type: 'page',
        url: '/profile',
        tags: ['profile', 'account', 'settings', 'অ্যাকাউন্ট']
      },
      {
        id: 'privacy',
        title: 'Privacy Policy | গোপনীয়তা নীতি',
        description: 'Our privacy policy and data protection',
        type: 'page',
        url: '/privacy',
        tags: ['privacy', 'policy', 'গোপনীয়তা']
      },
      {
        id: 'terms',
        title: 'Terms of Service | সেবার শর্তাবলী',
        description: 'Terms and conditions for using GetIt',
        type: 'page',
        url: '/terms',
        tags: ['terms', 'conditions', 'শর্তাবলী']
      }
    ];
  }

  // Build category data
  public buildCategoryData(): SearchResult[] {
    const categories: SearchResult[] = [];

    categoriesData.forEach(mainCategory => {
      // Add main category
      categories.push({
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
        categories.push({
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
          categories.push({
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

    return categories;
  }

  // Build sample product data
  public buildProductData(): SearchResult[] {
    return [
      {
        id: 'samsung-galaxy-s24',
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Latest flagship smartphone with AI features',
        type: 'product',
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
        type: 'product',
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
        type: 'product',
        url: '/product/dell-inspiron-15',
        category: 'Electronics',
        brand: 'Dell',
        price: 45999,
        rating: 4.1,
        tags: ['laptop', 'dell', 'computer', 'student', 'work']
      }
    ];
  }

  // Build vendor data
  public buildVendorData(): SearchResult[] {
    return [
      {
        id: 'tech-world-bd',
        title: 'Tech World BD',
        description: 'Leading electronics vendor in Bangladesh',
        type: 'vendor',
        url: '/vendor/tech-world-bd',
        category: 'Electronics',
        rating: 4.7,
        tags: ['vendor', 'electronics', 'technology', 'computer', 'mobile']
      },
      {
        id: 'fashion-hub',
        title: 'Fashion Hub',
        description: 'Trendy fashion and lifestyle products',
        type: 'vendor',
        url: '/vendor/fashion-hub',
        category: 'Fashion',
        rating: 4.4,
        tags: ['vendor', 'fashion', 'clothing', 'lifestyle', 'apparel']
      }
    ];
  }

  // Build content/article data
  public buildContentData(): SearchResult[] {
    return [
      {
        id: 'shopping-guide',
        title: 'Complete Shopping Guide for Bangladesh',
        description: 'Learn how to shop safely and effectively online',
        type: 'article',
        url: '/help/shopping-guide',
        tags: ['guide', 'shopping', 'help', 'tips', 'বাংলাদেশ']
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods | পেমেন্ট পদ্ধতি',
        description: 'All available payment options including bKash, Nagad, Rocket',
        type: 'article',
        url: '/help/payment-methods',
        tags: ['payment', 'bkash', 'nagad', 'rocket', 'পেমেন্ট']
      }
    ];
  }
}
