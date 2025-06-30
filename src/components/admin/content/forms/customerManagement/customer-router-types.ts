// types/customer-management.types.ts

/**
 * GetIt Bangladesh Multi-Vendor Ecommerce Platform
 * Customer Management Type Definitions
 */

// Global analytics interface for production monitoring
declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties: Record<string, unknown>) => void;
    };
    Sentry?: {
      captureException: (error: Error, context?: Record<string, unknown>) => void;
    };
  }
}

// Bangladesh-specific customer data types
export interface BangladeshCustomerData {
  mobile: string; // Bangladesh mobile format: +880XXXXXXXXX
  district: string; // Bangladesh district
  division: string; // Bangladesh division (Dhaka, Chittagong, etc.)
  language: 'bn' | 'en'; // Bengali or English preference
  paymentPreference: 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';
  preferredCourier: 'pathao' | 'paperfly' | 'sundarban' | 'redx' | 'ecourier';
}

// Customer segmentation types for Bangladesh market
export interface CustomerSegment {
  id: string;
  name: string;
  criteria: {
    ageRange?: [number, number];
    location?: {
      urban?: boolean;
      districts?: string[];
      divisions?: string[];
    };
    behavior?: {
      purchaseFrequency?: 'high' | 'medium' | 'low';
      averageOrderValue?: [number, number];
      paymentMethod?: BangladeshCustomerData['paymentPreference'][];
    };
    cultural?: {
      festivalShopper?: boolean; // Eid, Puja, etc.
      traditionalPreference?: boolean;
    };
  };
}

// Customer analytics data structure
export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  customerRetentionRate: number;
  averageOrderValue: number;
  lifetimeValue: number;
  geographicDistribution: {
    [district: string]: number;
  };
  paymentMethodDistribution: {
    [method in BangladeshCustomerData['paymentPreference']]: number;
  };
  languagePreference: {
    bengali: number;
    english: number;
  };
}

// Support ticket types for multi-language support
export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  language: 'bn' | 'en';
  category: 'order' | 'payment' | 'shipping' | 'product' | 'account' | 'other';
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  resolution?: string;
  satisfactionRating?: 1 | 2 | 3 | 4 | 5;
}

// Live chat types
export interface LiveChatSession {
  id: string;
  customerId: string;
  agentId?: string;
  status: 'waiting' | 'active' | 'ended';
  language: 'bn' | 'en';
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
  metadata: {
    customerLocation?: string;
    currentPage?: string;
    orderContext?: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'system';
  content: string;
  contentType: 'text' | 'image' | 'file' | 'order-link';
  timestamp: Date;
  isTranslated?: boolean;
  originalLanguage?: 'bn' | 'en';
}

// Customer feedback and reviews
export interface CustomerFeedback {
  id: string;
  customerId: string;
  orderId?: string;
  productId?: string;
  vendorId?: string;
  type: 'product-review' | 'vendor-review' | 'platform-feedback' | 'service-feedback';
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  language: 'bn' | 'en';
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: Date;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
}

// VIP customer data
export interface VIPCustomer {
  customerId: string;
  tier: 'silver' | 'gold' | 'platinum' | 'diamond';
  totalSpent: number;
  ordersCount: number;
  loyaltyPoints: number;
  perks: string[];
  assignedManager?: string;
  specialDiscounts: number; // percentage
  freeShippingEligible: boolean;
  prioritySupport: boolean;
  joinedVIPAt: Date;
  lastActivityAt: Date;
}

// Purchase history analysis
export interface PurchasePattern {
  customerId: string;
  preferredCategories: string[];
  seasonalTrends: {
    [month: string]: {
      orderCount: number;
      totalSpent: number;
    };
  };
  festivalShopping: {
    eid: { orderCount: number; totalSpent: number };
    puja: { orderCount: number; totalSpent: number };
    newYear: { orderCount: number; totalSpent: number };
  };
  averageOrderValue: number;
  purchaseFrequency: number; // orders per month
  lastPurchaseDate: Date;
  predictedNextPurchase?: Date;
}

// Customer Lifetime Value calculation
export interface CLVMetrics {
  customerId: string;
  historicalCLV: number;
  predictedCLV: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  customerLifespan: number; // in months
  profitMargin: number;
  acquisitionCost: number;
  retentionProbability: number;
  churnRisk: 'low' | 'medium' | 'high';
  valueSegment: 'low' | 'medium' | 'high' | 'premium';
}

// Customer behavior tracking
export interface CustomerBehavior {
  customerId: string;
  sessionData: {
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    browserLanguage: string;
  };
  engagementMetrics: {
    emailOpenRate: number;
    clickThroughRate: number;
    socialEngagement: number;
    reviewsWritten: number;
    referralsGenerated: number;
  };
  preferences: {
    communicationChannel: 'email' | 'sms' | 'whatsapp' | 'push';
    marketingOptIn: boolean;
    dataProcessingConsent: boolean;
  };
}

// Route analytics for monitoring
export interface RouteAnalytics {
  route: string;
  component: string;
  loadTime: number;
  errorRate: number;
  usageCount: number;
  lastAccessed: Date;
  userAgent: string;
  location: string;
}

// Error tracking interface
export interface RouterError {
  id: string;
  route: string;
  component: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  userContext: {
    userId?: string;
    sessionId: string;
    userAgent: string;
    timestamp: Date;
  };
  resolved: boolean;
  resolution?: string;
}

// Configuration interface for different environments
export interface RouterConfig {
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
  enableErrorTracking: boolean;
  debugMode: boolean;
  defaultLanguage: 'bn' | 'en';
  supportedLanguages: ('bn' | 'en')[];
  maxRetries: number;
  timeoutMs: number;
}

// API response types for customer data
export interface CustomerAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    timestamp: Date;
    version: string;
    requestId: string;
  };
}

// Export all types for use throughout the application
export type {
  BangladeshCustomerData,
  CustomerSegment,
  CustomerAnalytics,
  SupportTicket,
  LiveChatSession,
  ChatMessage,
  CustomerFeedback,
  VIPCustomer,
  PurchasePattern,
  CLVMetrics,
  CustomerBehavior,
  RouteAnalytics,
  RouterError,
  RouterConfig,
  CustomerAPIResponse
};