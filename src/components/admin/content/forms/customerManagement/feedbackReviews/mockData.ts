
import { Review, Feedback, ReviewMetrics, ReviewAnalytics, ModerationSettings } from './types';

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    customerId: 'cust-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a34b2e?w=40&h=40&fit=crop&crop=face',
    productId: 'prod-001',
    productName: 'Premium Cotton T-Shirt',
    productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop',
    vendorId: 'vendor-001',
    vendorName: 'Fashion Hub',
    orderId: 'order-001',
    rating: 5,
    title: 'Excellent quality and fit!',
    comment: 'This t-shirt exceeded my expectations. The fabric is soft, the fit is perfect, and the color is exactly as shown. Highly recommend!',
    status: 'approved',
    moderationStatus: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    helpful: 23,
    notHelpful: 2,
    verified: true,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
    tags: ['quality', 'fit', 'comfortable'],
    sentiment: 'positive',
    category: 'Fashion',
    subCategory: 'Clothing',
    language: 'en',
    reportCount: 0,
    responseFromVendor: {
      message: 'Thank you for your wonderful review! We\'re thrilled you love the t-shirt.',
      timestamp: '2024-01-15T12:00:00Z',
      respondedBy: 'Fashion Hub Team'
    }
  },
  {
    id: 'rev-002',
    customerId: 'cust-002',
    customerName: 'Ahmed Rahman',
    customerEmail: 'ahmed.rahman@email.com',
    productId: 'prod-002',
    productName: 'Wireless Bluetooth Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop',
    vendorId: 'vendor-002',
    vendorName: 'Tech Store BD',
    orderId: 'order-002',
    rating: 2,
    title: 'Poor sound quality',
    comment: 'The headphones look good but the sound quality is disappointing. Bass is weak and there\'s a lot of static at higher volumes.',
    status: 'approved',
    moderationStatus: 'approved',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    helpful: 15,
    notHelpful: 3,
    verified: true,
    tags: ['sound quality', 'bass', 'disappointing'],
    sentiment: 'negative',
    category: 'Electronics',
    subCategory: 'Audio',
    language: 'en',
    reportCount: 0
  },
  {
    id: 'rev-003',
    customerId: 'cust-003',
    customerName: 'Fatima Khatun',
    customerEmail: 'fatima.khatun@email.com',
    productId: 'prod-003',
    productName: 'Traditional Saree',
    productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60&h=60&fit=crop',
    vendorId: 'vendor-003',
    vendorName: 'Bengal Textiles',
    orderId: 'order-003',
    rating: 4,
    title: 'Beautiful design but delivery was late',
    comment: 'The saree is gorgeous and the fabric quality is good. However, it arrived 3 days later than promised which was inconvenient.',
    status: 'pending',
    moderationStatus: 'unmoderated',
    createdAt: '2024-01-16T09:20:00Z',
    updatedAt: '2024-01-16T09:20:00Z',
    helpful: 8,
    notHelpful: 1,
    verified: true,
    tags: ['beautiful', 'late delivery', 'quality'],
    sentiment: 'neutral',
    category: 'Fashion',
    subCategory: 'Traditional Wear',
    language: 'en',
    reportCount: 0
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: 'feedback-001',
    customerId: 'cust-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    type: 'website',
    category: 'User Experience',
    subcategory: 'Navigation',
    title: 'Website is hard to navigate',
    description: 'The search function is not working properly and it\'s difficult to find specific products. The category filters need improvement.',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'UX Team',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    rating: 3,
    sentiment: 'negative',
    tags: ['navigation', 'search', 'UX'],
    followUpRequired: true,
    source: 'web'
  },
  {
    id: 'feedback-002',
    customerId: 'cust-004',
    customerName: 'Mohammad Ali',
    customerEmail: 'mohammad.ali@email.com',
    type: 'delivery',
    category: 'Logistics',
    subcategory: 'Delivery Time',
    title: 'Fast delivery service',
    description: 'I was pleasantly surprised by how quickly my order arrived. The packaging was also excellent and everything was in perfect condition.',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-01-14T11:15:00Z',
    updatedAt: '2024-01-14T11:15:00Z',
    resolvedAt: '2024-01-14T11:20:00Z',
    rating: 5,
    sentiment: 'positive',
    tags: ['fast delivery', 'packaging', 'satisfaction'],
    followUpRequired: false,
    customerSatisfactionScore: 9,
    relatedOrderId: 'order-004',
    source: 'mobile'
  }
];

export const mockReviewMetrics: ReviewMetrics = {
  totalReviews: 1247,
  pendingReviews: 23,
  approvedReviews: 1156,
  rejectedReviews: 45,
  flaggedReviews: 23,
  averageRating: 4.2,
  totalFeedback: 567,
  resolvedFeedback: 489,
  customerSatisfactionScore: 8.3,
  responseRate: 85
};

export const mockReviewAnalytics: ReviewAnalytics = {
  ratingDistribution: [
    { rating: 5, count: 523, percentage: 42 },
    { rating: 4, count: 374, percentage: 30 },
    { rating: 3, count: 187, percentage: 15 },
    { rating: 2, count: 100, percentage: 8 },
    { rating: 1, count: 63, percentage: 5 }
  ],
  sentimentAnalysis: [
    { sentiment: 'positive', count: 897, percentage: 72 },
    { sentiment: 'neutral', count: 187, percentage: 15 },
    { sentiment: 'negative', count: 163, percentage: 13 }
  ],
  categoryBreakdown: [
    { category: 'Fashion', count: 456, averageRating: 4.3, sentiment: 'positive' },
    { category: 'Electronics', count: 342, averageRating: 4.1, sentiment: 'positive' },
    { category: 'Home & Garden', count: 234, averageRating: 4.0, sentiment: 'neutral' },
    { category: 'Beauty', count: 123, averageRating: 4.4, sentiment: 'positive' },
    { category: 'Sports', count: 92, averageRating: 3.9, sentiment: 'neutral' }
  ],
  timeSeriesData: [
    { date: '2024-01-01', reviews: 45, averageRating: 4.2, feedback: 12 },
    { date: '2024-01-02', reviews: 52, averageRating: 4.1, feedback: 15 },
    { date: '2024-01-03', reviews: 38, averageRating: 4.3, feedback: 8 },
    { date: '2024-01-04', reviews: 61, averageRating: 4.0, feedback: 18 },
    { date: '2024-01-05', reviews: 44, averageRating: 4.4, feedback: 11 }
  ],
  topKeywords: [
    { keyword: 'quality', count: 342, sentiment: 'positive' },
    { keyword: 'fast delivery', count: 289, sentiment: 'positive' },
    { keyword: 'price', count: 234, sentiment: 'neutral' },
    { keyword: 'customer service', count: 198, sentiment: 'positive' },
    { keyword: 'packaging', count: 156, sentiment: 'positive' }
  ],
  vendorPerformance: [
    { vendorId: 'vendor-001', vendorName: 'Fashion Hub', averageRating: 4.5, totalReviews: 234, responseRate: 92 },
    { vendorId: 'vendor-002', vendorName: 'Tech Store BD', averageRating: 4.1, totalReviews: 189, responseRate: 78 },
    { vendorId: 'vendor-003', vendorName: 'Bengal Textiles', averageRating: 4.3, totalReviews: 156, responseRate: 85 }
  ]
};

export const mockModerationSettings: ModerationSettings = {
  autoApprove: false,
  requireModeration: true,
  profanityFilter: true,
  spamDetection: true,
  minimumRating: 1,
  minimumCharacters: 10,
  requirePurchaseVerification: true,
  allowAnonymousReviews: false,
  emailNotifications: true,
  webhookUrl: 'https://api.example.com/webhook/reviews'
};
