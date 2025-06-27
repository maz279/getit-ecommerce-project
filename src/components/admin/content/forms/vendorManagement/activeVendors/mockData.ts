
import { ActiveVendor, VendorMetrics, VendorAnalytics, VendorOnboarding } from './types';

export const mockActiveVendors: ActiveVendor[] = [
  {
    id: 'V001',
    businessName: 'TechZone Electronics BD',
    contactPerson: 'Ahmed Rahman',
    email: 'ahmed@techzone.bd',
    phone: '+880 1712345678',
    address: 'House 45, Road 12, Dhanmondi, Dhaka-1205',
    category: 'Electronics',
    subCategory: 'Mobile & Accessories',
    status: 'active',
    verificationStatus: 'verified',
    joinDate: '2024-01-15',
    lastActive: '2024-06-27T10:30:00Z',
    totalProducts: 156,
    activeProducts: 142,
    totalSales: 2450000,
    monthlyRevenue: 245000,
    commissionRate: 8.5,
    rating: 4.8,
    reviewCount: 1247,
    responseRate: 95,
    onTimeDelivery: 92,
    returnRate: 3.2,
    qualityScore: 4.7,
    businessLicense: 'BL-2024-001234',
    taxId: 'TIN-123456789',
    bankAccount: {
      accountNumber: '1234567890123',
      bankName: 'Dutch Bangla Bank',
      accountHolder: 'TechZone Electronics BD'
    },
    documents: [
      {
        type: 'Business License',
        url: '/documents/techzone-license.pdf',
        verified: true,
        uploadDate: '2024-01-15'
      },
      {
        type: 'Tax Certificate',
        url: '/documents/techzone-tax.pdf',
        verified: true,
        uploadDate: '2024-01-15'
      }
    ],
    kycStatus: 'complete',
    contractStatus: 'signed',
    performanceMetrics: {
      orderFulfillmentRate: 96,
      customerSatisfaction: 4.8,
      disputeRate: 1.2,
      refundRate: 2.8
    },
    paymentInfo: {
      totalEarnings: 208250,
      pendingPayments: 18500,
      lastPaymentDate: '2024-06-20',
      paymentMethod: 'Bank Transfer'
    },
    location: {
      city: 'Dhaka',
      state: 'Dhaka Division',
      country: 'Bangladesh',
      coordinates: { lat: 23.7809, lng: 90.2792 }
    }
  },
  {
    id: 'V002',
    businessName: 'Fashion Hub Bangladesh',
    contactPerson: 'Fatima Begum',
    email: 'fatima@fashionhub.bd',
    phone: '+880 1987654321',
    address: 'Shop 78, New Market, Dhaka-1205',
    category: 'Fashion',
    subCategory: 'Women\'s Clothing',
    status: 'active',
    verificationStatus: 'verified',
    joinDate: '2024-02-20',
    lastActive: '2024-06-27T09:15:00Z',
    totalProducts: 89,
    activeProducts: 85,
    totalSales: 1200000,
    monthlyRevenue: 120000,
    commissionRate: 10.0,
    rating: 4.6,
    reviewCount: 892,
    responseRate: 88,
    onTimeDelivery: 90,
    returnRate: 4.1,
    qualityScore: 4.5,
    businessLicense: 'BL-2024-002345',
    taxId: 'TIN-987654321',
    bankAccount: {
      accountNumber: '9876543210987',
      bankName: 'Islami Bank Bangladesh',
      accountHolder: 'Fashion Hub Bangladesh'
    },
    documents: [
      {
        type: 'Business License',
        url: '/documents/fashion-license.pdf',
        verified: true,
        uploadDate: '2024-02-20'
      }
    ],
    kycStatus: 'complete',
    contractStatus: 'signed',
    performanceMetrics: {
      orderFulfillmentRate: 94,
      customerSatisfaction: 4.6,
      disputeRate: 2.1,
      refundRate: 3.8
    },
    paymentInfo: {
      totalEarnings: 120000,
      pendingPayments: 12000,
      lastPaymentDate: '2024-06-20',
      paymentMethod: 'Bank Transfer'
    },
    location: {
      city: 'Dhaka',
      state: 'Dhaka Division',
      country: 'Bangladesh'
    }
  },
  {
    id: 'V003',
    businessName: 'Home Essentials Store',
    contactPerson: 'Karim Ahmed',
    email: 'karim@homeessentials.bd',
    phone: '+880 1555666777',
    address: 'Plot 23, Gulshan Avenue, Dhaka-1212',
    category: 'Home & Living',
    subCategory: 'Kitchen & Dining',
    status: 'suspended',
    verificationStatus: 'under_review',
    joinDate: '2023-11-10',
    lastActive: '2024-06-25T14:20:00Z',
    totalProducts: 45,
    activeProducts: 0,
    totalSales: 890000,
    monthlyRevenue: 89000,
    commissionRate: 9.0,
    rating: 4.2,
    reviewCount: 456,
    responseRate: 75,
    onTimeDelivery: 85,
    returnRate: 6.5,
    qualityScore: 4.0,
    businessLicense: 'BL-2023-003456',
    taxId: 'TIN-456789123',
    bankAccount: {
      accountNumber: '4567891234567',
      bankName: 'BRAC Bank',
      accountHolder: 'Home Essentials Store'
    },
    documents: [
      {
        type: 'Business License',
        url: '/documents/home-license.pdf',
        verified: false,
        uploadDate: '2023-11-10'
      }
    ],
    kycStatus: 'incomplete',
    contractStatus: 'pending',
    performanceMetrics: {
      orderFulfillmentRate: 88,
      customerSatisfaction: 4.2,
      disputeRate: 4.2,
      refundRate: 5.8
    },
    paymentInfo: {
      totalEarnings: 80100,
      pendingPayments: 0,
      lastPaymentDate: '2024-05-15',
      paymentMethod: 'Bank Transfer'
    },
    location: {
      city: 'Dhaka',
      state: 'Dhaka Division',
      country: 'Bangladesh'
    }
  }
];

export const mockVendorMetrics: VendorMetrics = {
  totalActiveVendors: 1567,
  newVendorsThisMonth: 23,
  pendingVerifications: 45,
  suspendedVendors: 12,
  averageRating: 4.6,
  totalRevenue: 12450000,
  averageCommissionRate: 8.8,
  topPerformingVendors: 234,
  vendorRetentionRate: 92.5,
  averageOnboardingTime: 7.2
};

export const mockVendorAnalytics: VendorAnalytics = {
  performanceDistribution: [
    { category: 'Excellent', count: 450, percentage: 28.7 },
    { category: 'Good', count: 680, percentage: 43.4 },
    { category: 'Average', count: 320, percentage: 20.4 },
    { category: 'Poor', count: 117, percentage: 7.5 }
  ],
  categoryBreakdown: [
    { category: 'Electronics', vendorCount: 420, revenue: 4200000, averageRating: 4.7 },
    { category: 'Fashion', vendorCount: 380, revenue: 3100000, averageRating: 4.5 },
    { category: 'Home & Living', vendorCount: 290, revenue: 2300000, averageRating: 4.4 },
    { category: 'Books', vendorCount: 230, revenue: 1200000, averageRating: 4.6 },
    { category: 'Sports', vendorCount: 180, revenue: 980000, averageRating: 4.3 },
    { category: 'Beauty', vendorCount: 67, revenue: 670000, averageRating: 4.8 }
  ],
  geographicDistribution: [
    { region: 'Dhaka', vendorCount: 756, revenue: 7800000, marketShare: 48.2 },
    { region: 'Chittagong', vendorCount: 298, revenue: 2100000, marketShare: 19.0 },
    { region: 'Sylhet', vendorCount: 187, revenue: 1200000, marketShare: 11.9 },
    { region: 'Rajshahi', vendorCount: 145, revenue: 800000, marketShare: 9.3 },
    { region: 'Others', vendorCount: 181, revenue: 550000, marketShare: 11.6 }
  ],
  timeSeriesData: [
    { date: '2024-01', newVendors: 45, totalRevenue: 980000, averageRating: 4.5, activeVendors: 1344 },
    { date: '2024-02', newVendors: 52, totalRevenue: 1120000, averageRating: 4.6, activeVendors: 1396 },
    { date: '2024-03', newVendors: 38, totalRevenue: 1250000, averageRating: 4.6, activeVendors: 1434 },
    { date: '2024-04', newVendors: 41, totalRevenue: 1180000, averageRating: 4.7, activeVendors: 1475 },
    { date: '2024-05', newVendors: 29, totalRevenue: 1340000, averageRating: 4.6, activeVendors: 1504 },
    { date: '2024-06', newVendors: 23, totalRevenue: 1450000, averageRating: 4.6, activeVendors: 1567 }
  ],
  topVendors: [
    { id: 'V001', name: 'TechZone Electronics BD', revenue: 245000, rating: 4.8, category: 'Electronics' },
    { id: 'V045', name: 'Premium Fashion House', revenue: 198000, rating: 4.9, category: 'Fashion' },
    { id: 'V078', name: 'Smart Home Solutions', revenue: 165000, rating: 4.7, category: 'Home & Living' },
    { id: 'V123', name: 'Book Paradise BD', revenue: 142000, rating: 4.8, category: 'Books' },
    { id: 'V156', name: 'Sports Pro Bangladesh', revenue: 138000, rating: 4.6, category: 'Sports' }
  ],
  complianceMetrics: {
    kycCompleted: 89.2,
    documentsVerified: 92.5,
    contractsSigned: 96.8,
    taxComplianceRate: 94.1
  }
};

export const mockVendorOnboarding: VendorOnboarding[] = [
  {
    id: 'VO001',
    businessName: 'Digital Mart BD',
    contactPerson: 'Rashid Hassan',
    email: 'rashid@digitalmart.bd',
    phone: '+880 1800123456',
    category: 'Electronics',
    applicationDate: '2024-06-20',
    status: 'under_review',
    currentStep: 3,
    totalSteps: 5,
    documentsUploaded: 2,
    requiredDocuments: 4,
    estimatedCompletionDate: '2024-07-05',
    assignedReviewer: 'Sarah Ahmed',
    notes: 'Business license verification pending'
  },
  {
    id: 'VO002',
    businessName: 'Organic Foods Limited',
    contactPerson: 'Nazrul Islam',
    email: 'nazrul@organicfoods.bd',
    phone: '+880 1700987654',
    category: 'Food & Beverages',
    applicationDate: '2024-06-18',
    status: 'additional_info_required',
    currentStep: 2,
    totalSteps: 5,
    documentsUploaded: 1,
    requiredDocuments: 4,
    estimatedCompletionDate: '2024-07-10',
    assignedReviewer: 'Michael Khan',
    notes: 'Additional food safety certificates required'
  }
];
