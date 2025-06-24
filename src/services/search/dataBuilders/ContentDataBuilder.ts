
import { SearchResult } from '../types';

export class ContentDataBuilder {
  buildContentData(): SearchResult[] {
    return [
      {
        id: 'shipping-info',
        title: 'Shipping Information | শিপিং তথ্য',
        description: 'Information about shipping policies and delivery',
        type: 'content',
        url: '/shipping-info',
        category: 'Information',
        tags: ['shipping', 'delivery', 'policy', 'শিপিং', 'ডেলিভারি'],
        dateAdded: new Date(),
        isActive: true
      },
      {
        id: 'return-policy',
        title: 'Return Policy | রিটার্ন নীতি',
        description: 'Product return and refund policy',
        type: 'content',
        url: '/return-policy',
        category: 'Information',
        tags: ['return', 'refund', 'policy', 'রিটার্ন', 'ফেরত'],
        dateAdded: new Date(),
        isActive: true
      }
    ];
  }
}
