
import { SearchResult } from '../types';

export class VendorDataBuilder {
  buildVendorData(): SearchResult[] {
    return [
      {
        id: 'tech-store-bd',
        title: 'Tech Store BD | টেক স্টোর বিডি',
        description: 'Leading electronics vendor in Bangladesh',
        type: 'vendor',
        url: '/vendor/tech-store-bd',
        category: 'Electronics',
        tags: ['vendor', 'electronics', 'tech store', 'টেক স্টোর'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'fashion-hub-bd',
        title: 'Fashion Hub BD | ফ্যাশন হাব বিডি',
        description: 'Premium fashion and clothing vendor',
        type: 'vendor',
        url: '/vendor/fashion-hub-bd',
        category: 'Fashion',
        tags: ['vendor', 'fashion', 'clothing', 'ফ্যাশন হাব'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }
}
