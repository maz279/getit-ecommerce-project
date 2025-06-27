
import { Category, CategoryStats, CategoryAnalytics, CategorySEOData, CategoryAttribute, CategoryRule } from './types';

export const mockCategoryData = {
  stats: {
    totalCategories: 456,
    activeCategories: 423,
    inactiveCategories: 33,
    topLevelCategories: 24,
    avgProductsPerCategory: 127,
    categoriesWithProducts: 398,
    emptyCategoriesCount: 58,
    mostPopularCategory: 'Electronics',
    leastPopularCategory: 'Vintage Items'
  } as CategoryStats,

  categories: [
    {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'All electronic items and gadgets',
      level: 0,
      isActive: true,
      productsCount: 1245,
      sortOrder: 1,
      seoTitle: 'Electronics - Best Gadgets & Devices Online',
      seoDescription: 'Shop the latest electronics, gadgets, and tech devices at competitive prices.',
      seoKeywords: ['electronics', 'gadgets', 'technology', 'devices'],
      attributes: [],
      rules: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '2',
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest smartphones and mobile devices',
      parentId: '1',
      level: 1,
      isActive: true,
      productsCount: 387,
      sortOrder: 1,
      seoTitle: 'Smartphones - Latest Mobile Phones Online',
      seoDescription: 'Discover the latest smartphones with best prices and features.',
      seoKeywords: ['smartphones', 'mobile phones', 'android', 'iphone'],
      attributes: [],
      rules: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '3',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, accessories and fashion items',
      level: 0,
      isActive: true,
      productsCount: 2156,
      sortOrder: 2,
      seoTitle: 'Fashion - Trendy Clothes & Accessories',
      seoDescription: 'Explore the latest fashion trends for men, women, and kids.',
      seoKeywords: ['fashion', 'clothing', 'accessories', 'trends'],
      attributes: [],
      rules: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-12-01'
    },
    {
      id: '4',
      name: 'Men\'s Clothing',
      slug: 'mens-clothing',
      description: 'Clothing and accessories for men',
      parentId: '3',
      level: 1,
      isActive: true,
      productsCount: 856,
      sortOrder: 1,
      seoTitle: 'Men\'s Clothing - Stylish Apparel for Men',
      seoDescription: 'Shop the latest men\'s fashion, from casual wear to formal attire.',
      seoKeywords: ['mens clothing', 'mens fashion', 'men apparel'],
      attributes: [],
      rules: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-12-01'
    }
  ] as Category[],

  attributes: [
    {
      id: 'attr1',
      name: 'Brand',
      type: 'select' as const,
      required: true,
      options: ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google']
    },
    {
      id: 'attr2',
      name: 'Color',
      type: 'multiselect' as const,
      required: false,
      options: ['Black', 'White', 'Blue', 'Red', 'Gold', 'Silver']
    },
    {
      id: 'attr3',
      name: 'Size',
      type: 'select' as const,
      required: true,
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'attr4',
      name: 'Weight',
      type: 'number' as const,
      required: false,
      validation: { min: 0, max: 1000 }
    }
  ] as CategoryAttribute[],

  rules: [
    {
      id: 'rule1',
      name: 'Auto-approve products with complete attributes',
      type: 'automation' as const,
      condition: 'ALL attributes filled',
      action: 'Auto-approve for publishing',
      isActive: true
    },
    {
      id: 'rule2',
      name: 'Price validation for electronics',
      type: 'validation' as const,
      condition: 'Category = Electronics',
      action: 'Require price > $10',
      isActive: true
    },
    {
      id: 'rule3',
      name: 'Inventory alert for fashion items',
      type: 'inventory' as const,
      condition: 'Stock < 10',
      action: 'Send low stock alert',
      isActive: true
    }
  ] as CategoryRule[],

  analytics: {
    categoryPerformance: [
      {
        categoryId: '1',
        name: 'Electronics',
        productsCount: 1245,
        viewsCount: 125000,
        conversionRate: 4.2,
        revenue: 2450000,
        growth: 15.5
      },
      {
        categoryId: '3',
        name: 'Fashion',
        productsCount: 2156,
        viewsCount: 98000,
        conversionRate: 3.8,
        revenue: 1890000,
        growth: 12.3
      },
      {
        categoryId: '2',
        name: 'Smartphones',
        productsCount: 387,
        viewsCount: 76000,
        conversionRate: 5.1,
        revenue: 1560000,
        growth: 18.7
      }
    ],
    categoryTrends: [
      {
        month: 'Jan 2024',
        categories: { 'Electronics': 1200, 'Fashion': 2000, 'Home': 800 }
      },
      {
        month: 'Feb 2024',
        categories: { 'Electronics': 1300, 'Fashion': 2100, 'Home': 850 }
      },
      {
        month: 'Mar 2024',
        categories: { 'Electronics': 1245, 'Fashion': 2156, 'Home': 920 }
      }
    ],
    topCategories: [
      { name: 'Electronics', revenue: 2450000, orders: 15600, growth: 15.5 },
      { name: 'Fashion', revenue: 1890000, orders: 12400, growth: 12.3 },
      { name: 'Home & Garden', revenue: 1200000, orders: 8900, growth: 8.7 },
      { name: 'Sports', revenue: 890000, orders: 6700, growth: 22.1 },
      { name: 'Books', revenue: 450000, orders: 3200, growth: 5.4 }
    ]
  } as CategoryAnalytics,

  seoData: [
    {
      categoryId: '1',
      title: 'Electronics - Best Gadgets & Devices Online',
      description: 'Shop the latest electronics, gadgets, and tech devices at competitive prices with fast delivery.',
      keywords: ['electronics', 'gadgets', 'technology', 'devices', 'online shopping'],
      metaTags: {
        'og:type': 'website',
        'og:site_name': 'GETIT Bangladesh'
      },
      canonicalUrl: 'https://getit.com.bd/categories/electronics',
      ogTitle: 'Electronics - Best Gadgets & Devices Online',
      ogDescription: 'Shop the latest electronics, gadgets, and tech devices at competitive prices.',
      ogImage: 'https://getit.com.bd/images/electronics-category.jpg',
      searchRanking: 2,
      clickThroughRate: 4.2,
      impressions: 125000
    },
    {
      categoryId: '3',
      title: 'Fashion - Trendy Clothes & Accessories',
      description: 'Explore the latest fashion trends for men, women, and kids with free shipping.',
      keywords: ['fashion', 'clothing', 'accessories', 'trends', 'style'],
      metaTags: {
        'og:type': 'website',
        'og:site_name': 'GETIT Bangladesh'
      },
      canonicalUrl: 'https://getit.com.bd/categories/fashion',
      ogTitle: 'Fashion - Trendy Clothes & Accessories',
      ogDescription: 'Explore the latest fashion trends for men, women, and kids.',
      ogImage: 'https://getit.com.bd/images/fashion-category.jpg',
      searchRanking: 1,
      clickThroughRate: 3.8,
      impressions: 98000
    }
  ] as CategorySEOData[]
};
