
import { SearchResult } from '../types';

export class CategoryDataBuilder {
  buildCategoryData(): SearchResult[] {
    return [
      {
        id: 'electronics',
        title: 'Electronics | ইলেক্ট্রনিক্স',
        description: 'Smartphones, laptops, cameras, and electronic devices',
        type: 'category',
        url: '/categories/electronics',
        category: 'Electronics',
        tags: ['electronics', 'smartphone', 'laptop', 'camera', 'ইলেক্ট্রনিক্স'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'fashion',
        title: 'Fashion | ফ্যাশন',
        description: 'Clothing, shoes, and fashion accessories',
        type: 'category',
        url: '/categories/fashion',
        category: 'Fashion',
        tags: ['fashion', 'clothing', 'shoes', 'accessories', 'ফ্যাশন', 'পোশাক'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'home-garden',
        title: 'Home & Garden | বাড়ি ও বাগান',
        description: 'Home decor, furniture, kitchen, and garden items',
        type: 'category',
        url: '/categories/home-garden',
        category: 'Home & Garden',
        tags: ['home', 'garden', 'furniture', 'kitchen', 'decor', 'বাড়ি', 'বাগান'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }
}
