
import { PurchaseHistoryData, PurchaseAnalytics, PurchaseRecommendation } from './types';

export const mockPurchaseHistoryData: PurchaseHistoryData[] = [
  {
    customerId: 'cust-001',
    customerName: 'Rahul Ahmed',
    customerEmail: 'rahul.ahmed@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    totalOrders: 24,
    totalSpent: 125000,
    averageOrderValue: 5208,
    firstPurchaseDate: '2023-01-15',
    lastPurchaseDate: '2024-12-20',
    customerLifetimeValue: 180000,
    favoriteCategories: ['Electronics', 'Fashion', 'Home & Garden'],
    paymentMethods: ['Credit Card', 'Mobile Banking', 'Cash on Delivery'],
    deliveryPreference: 'Express Delivery',
    returnRate: 0.08,
    loyaltyPoints: 12500,
    membershipTier: 'Gold',
    orders: [
      {
        id: 'ord-001',
        orderNumber: 'GT-2024-001234',
        date: '2024-12-20',
        status: 'delivered',
        items: [
          {
            id: 'item-001',
            productId: 'prod-001',
            productName: 'Samsung Galaxy S24 Ultra',
            productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
            sku: 'SAM-S24U-256',
            category: 'Electronics',
            brand: 'Samsung',
            variant: '256GB Space Black',
            quantity: 1,
            unitPrice: 89999,
            totalPrice: 89999,
            vendorName: 'TechZone BD',
            isReviewable: true,
            warrantyPeriod: 365
          },
          {
            id: 'item-002',
            productId: 'prod-002',
            productName: 'Samsung 45W Fast Charger',
            productImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
            sku: 'SAM-45W-CHG',
            category: 'Electronics',
            brand: 'Samsung',
            quantity: 1,
            unitPrice: 3500,
            totalPrice: 3500,
            vendorName: 'TechZone BD',
            isReviewable: true,
            warrantyPeriod: 180
          }
        ],
        subtotal: 93499,
        shipping: 0,
        tax: 9350,
        discount: 5000,
        total: 97849,
        paymentMethod: 'Credit Card',
        shippingAddress: {
          name: 'Rahul Ahmed',
          street: 'House 45, Road 12, Block C',
          city: 'Dhaka',
          state: 'Dhaka Division',
          zipCode: '1205',
          country: 'Bangladesh',
          phone: '+880171234567'
        },
        trackingNumber: 'GT-TRK-789456123',
        deliveryDate: '2024-12-22',
        returnWindow: 7,
        canReturn: true,
        canReorder: true
      }
    ]
  },
  {
    customerId: 'cust-002',
    customerName: 'Fatima Khan',
    customerEmail: 'fatima.khan@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c42c?w=32&h=32&fit=crop&crop=face',
    totalOrders: 18,
    totalSpent: 95000,
    averageOrderValue: 5278,
    firstPurchaseDate: '2023-03-20',
    lastPurchaseDate: '2024-12-18',
    customerLifetimeValue: 140000,
    favoriteCategories: ['Fashion', 'Beauty', 'Books'],
    paymentMethods: ['Mobile Banking', 'Credit Card'],
    deliveryPreference: 'Standard Delivery',
    returnRate: 0.11,
    loyaltyPoints: 9500,
    membershipTier: 'Silver',
    orders: []
  },
  {
    customerId: 'cust-003',
    customerName: 'Mohammad Hassan',
    customerEmail: 'mohammad.hassan@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    totalOrders: 32,
    totalSpent: 210000,
    averageOrderValue: 6563,
    firstPurchaseDate: '2022-11-10',
    lastPurchaseDate: '2024-12-15',
    customerLifetimeValue: 280000,
    favoriteCategories: ['Electronics', 'Sports', 'Automobiles'],
    paymentMethods: ['Credit Card', 'Bank Transfer'],
    deliveryPreference: 'Express Delivery',
    returnRate: 0.06,
    loyaltyPoints: 21000,
    membershipTier: 'Platinum',
    orders: []
  }
];

export const mockPurchaseAnalytics: PurchaseAnalytics = {
  totalCustomers: 25000,
  totalOrders: 125000,
  totalRevenue: 75000000,
  averageOrderValue: 6000,
  repeatCustomerRate: 0.68,
  averageOrdersPerCustomer: 5.2,
  topSellingProducts: [
    {
      productId: 'prod-001',
      productName: 'Samsung Galaxy S24 Ultra',
      category: 'Electronics',
      totalQuantity: 1250,
      totalRevenue: 11250000
    },
    {
      productId: 'prod-002',
      productName: 'iPhone 15 Pro Max',
      category: 'Electronics',
      totalQuantity: 980,
      totalRevenue: 12740000
    },
    {
      productId: 'prod-003',
      productName: 'Nike Air Max 270',
      category: 'Fashion',
      totalQuantity: 2100,
      totalRevenue: 3150000
    }
  ],
  salesTrends: [
    { period: '2024-01', orders: 8500, revenue: 5100000, customers: 2800 },
    { period: '2024-02', orders: 9200, revenue: 5520000, customers: 3100 },
    { period: '2024-03', orders: 10100, revenue: 6060000, customers: 3400 },
    { period: '2024-04', orders: 9800, revenue: 5880000, customers: 3200 },
    { period: '2024-05', orders: 11500, revenue: 6900000, customers: 3800 },
    { period: '2024-06', orders: 12800, revenue: 7680000, customers: 4100 }
  ],
  categoryPerformance: [
    { category: 'Electronics', orders: 45000, revenue: 27000000, averageOrderValue: 6000 },
    { category: 'Fashion', orders: 38000, revenue: 19000000, averageOrderValue: 5000 },
    { category: 'Home & Garden', orders: 25000, revenue: 15000000, averageOrderValue: 6000 },
    { category: 'Sports', orders: 17000, revenue: 10200000, averageOrderValue: 6000 }
  ]
};

export const mockPurchaseRecommendations: PurchaseRecommendation[] = [
  {
    customerId: 'cust-001',
    type: 'reorder',
    products: [
      {
        productId: 'prod-004',
        productName: 'Samsung Galaxy Buds Pro',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop',
        reason: 'Frequently purchased with Samsung phones',
        confidence: 0.89
      }
    ],
    estimatedRevenue: 8500,
    validUntil: '2025-01-20'
  },
  {
    customerId: 'cust-002',
    type: 'cross_sell',
    products: [
      {
        productId: 'prod-005',
        productName: 'Luxury Handbag Collection',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
        reason: 'Matches your fashion preferences',
        confidence: 0.75
      }
    ],
    estimatedRevenue: 12000,
    validUntil: '2025-01-15'
  }
];
