
import { VendorSearchResult, VendorSearchStats } from './types';

export const mockVendorSearchStats: VendorSearchStats = {
  totalVendors: 12847,
  activeVendors: 9823,
  verifiedVendors: 8234,
  pendingApplications: 234,
  suspendedVendors: 156,
  newThisMonth: 312,
  averageRating: 4.2,
  totalSalesVolume: 45600000,
  searchesThisMonth: 2834,
  topCategories: [
    { category: 'Electronics', count: 3245, percentage: 25.3 },
    { category: 'Fashion', count: 2876, percentage: 22.4 },
    { category: 'Home & Garden', count: 2134, percentage: 16.6 },
    { category: 'Sports & Outdoors', count: 1567, percentage: 12.2 },
    { category: 'Books & Media', count: 1234, percentage: 9.6 }
  ]
};

export const mockVendorSearchResults: VendorSearchResult[] = [
  {
    id: 'vendor-001',
    businessName: 'TechNova Electronics',
    contactPerson: 'Ahmed Rahman',
    email: 'ahmed@technova.com',
    phone: '+880 1712-345678',
    category: 'Electronics',
    location: {
      city: 'Dhaka',
      state: 'Dhaka Division',
      country: 'Bangladesh'
    },
    status: 'active',
    verificationStatus: 'verified',
    performanceLevel: 'excellent',
    rating: 4.8,
    totalSales: 2450000,
    totalOrders: 1234,
    joinDate: '2023-01-15',
    lastActivity: '2024-01-25',
    profileCompleteness: 95,
    documents: {
      tradeLicense: true,
      taxCertificate: true,
      bankStatement: true,
      identityProof: true
    },
    products: {
      total: 156,
      active: 134,
      featured: 23
    },
    compliance: {
      score: 92,
      issues: 1,
      lastAudit: '2023-12-15'
    },
    tags: ['Premium Seller', 'Fast Shipping', 'Top Rated'],
    notes: 'Excellent performance with consistent quality products'
  },
  {
    id: 'vendor-002',
    businessName: 'Fashion Forward BD',
    contactPerson: 'Fatima Khatun',
    email: 'fatima@fashionforward.bd',
    phone: '+880 1798-765432',
    category: 'Fashion',
    location: {
      city: 'Chittagong',
      state: 'Chittagong Division',
      country: 'Bangladesh'
    },
    status: 'active',
    verificationStatus: 'verified',
    performanceLevel: 'good',
    rating: 4.5,
    totalSales: 1750000,
    totalOrders: 876,
    joinDate: '2023-03-20',
    lastActivity: '2024-01-24',
    profileCompleteness: 88,
    documents: {
      tradeLicense: true,
      taxCertificate: true,
      bankStatement: true,
      identityProof: true
    },
    products: {
      total: 89,
      active: 78,
      featured: 12
    },
    compliance: {
      score: 87,
      issues: 2,
      lastAudit: '2023-11-30'
    },
    tags: ['Fashion Expert', 'Quality Products'],
    notes: 'Specializes in traditional and modern fashion'
  },
  {
    id: 'vendor-003',
    businessName: 'Home Comfort Store',
    contactPerson: 'Karim Uddin',
    email: 'karim@homecomfort.com',
    phone: '+880 1634-567890',
    category: 'Home & Garden',
    location: {
      city: 'Sylhet',
      state: 'Sylhet Division',
      country: 'Bangladesh'
    },
    status: 'active',
    verificationStatus: 'verified',
    performanceLevel: 'good',
    rating: 4.3,
    totalSales: 980000,
    totalOrders: 543,
    joinDate: '2023-05-10',
    lastActivity: '2024-01-23',
    profileCompleteness: 82,
    documents: {
      tradeLicense: true,
      taxCertificate: true,
      bankStatement: false,
      identityProof: true
    },
    products: {
      total: 67,
      active: 59,
      featured: 8
    },
    compliance: {
      score: 85,
      issues: 1,
      lastAudit: '2023-10-15'
    },
    tags: ['Home Decor', 'Quality Furniture'],
    notes: 'Reliable vendor with good customer service'
  },
  {
    id: 'vendor-004',
    businessName: 'Sports Galaxy',
    contactPerson: 'Rashid Hasan',
    email: 'rashid@sportsgalaxy.bd',
    phone: '+880 1756-123456',
    category: 'Sports & Outdoors',
    location: {
      city: 'Rajshahi',
      state: 'Rajshahi Division',
      country: 'Bangladesh'
    },
    status: 'pending',
    verificationStatus: 'pending',
    performanceLevel: 'average',
    rating: 4.1,
    totalSales: 650000,
    totalOrders: 298,
    joinDate: '2023-08-15',
    lastActivity: '2024-01-22',
    profileCompleteness: 65,
    documents: {
      tradeLicense: true,
      taxCertificate: false,
      bankStatement: false,
      identityProof: true
    },
    products: {
      total: 45,
      active: 42,
      featured: 3
    },
    compliance: {
      score: 78,
      issues: 3,
      lastAudit: '2023-12-01'
    },
    tags: ['Sports Equipment', 'Outdoor Gear'],
    notes: 'Pending document verification'
  },
  {
    id: 'vendor-005',
    businessName: 'Book Haven BD',
    contactPerson: 'Nasir Ahmed',
    email: 'nasir@bookhaven.bd',
    phone: '+880 1678-987654',
    category: 'Books & Media',
    location: {
      city: 'Khulna',
      state: 'Khulna Division',
      country: 'Bangladesh'
    },
    status: 'active',
    verificationStatus: 'verified',
    performanceLevel: 'excellent',
    rating: 4.7,
    totalSales: 1200000,
    totalOrders: 789,
    joinDate: '2023-02-28',
    lastActivity: '2024-01-25',
    profileCompleteness: 92,
    documents: {
      tradeLicense: true,
      taxCertificate: true,
      bankStatement: true,
      identityProof: true
    },
    products: {
      total: 234,
      active: 219,
      featured: 18
    },
    compliance: {
      score: 94,
      issues: 0,
      lastAudit: '2023-12-20'
    },
    tags: ['Educational Books', 'Literature', 'Academic'],
    notes: 'Excellent academic and literature collection'
  },
  {
    id: 'vendor-006',
    businessName: 'Auto Parts Pro',
    contactPerson: 'Mizanur Rahman',
    email: 'mizan@autopartspro.com',
    phone: '+880 1523-456789',
    category: 'Automotive',
    location: {
      city: 'Barisal',
      state: 'Barisal Division',
      country: 'Bangladesh'
    },
    status: 'suspended',
    verificationStatus: 'rejected',
    performanceLevel: 'poor',
    rating: 3.2,
    totalSales: 340000,
    totalOrders: 156,
    joinDate: '2023-06-12',
    lastActivity: '2024-01-10',
    profileCompleteness: 45,
    documents: {
      tradeLicense: false,
      taxCertificate: false,
      bankStatement: false,
      identityProof: true
    },
    products: {
      total: 28,
      active: 15,
      featured: 0
    },
    compliance: {
      score: 45,
      issues: 8,
      lastAudit: '2023-11-15'
    },
    tags: ['Quality Issues', 'Document Pending'],
    notes: 'Suspended due to quality and compliance issues'
  }
];
