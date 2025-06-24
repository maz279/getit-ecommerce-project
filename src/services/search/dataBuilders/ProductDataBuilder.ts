
import { SearchResult } from '../types';

export class ProductDataBuilder {
  buildProductData(): SearchResult[] {
    return [
      {
        id: 'sample-smartphone',
        title: 'Samsung Galaxy S24 | স্যামসাং গ্যালাক্সি',
        description: 'Latest Samsung smartphone with advanced features',
        type: 'product',
        url: '/product/samsung-galaxy-s24',
        category: 'Electronics',
        brand: 'Samsung',
        price: 89999,
        rating: 4.5,
        tags: ['smartphone', 'samsung', 'galaxy', 'mobile', 'স্যামসাং'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'sample-laptop',
        title: 'MacBook Air M2 | ম্যাকবুক এয়ার',
        description: 'Apple MacBook Air with M2 chip',
        type: 'product',
        url: '/product/macbook-air-m2',
        category: 'Electronics',
        brand: 'Apple',
        price: 149999,
        rating: 4.8,
        tags: ['laptop', 'macbook', 'apple', 'computer', 'ম্যাকবুক'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }
}
