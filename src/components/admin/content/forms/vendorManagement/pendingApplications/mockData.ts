
import { PendingVendorApplication, ApplicationStats } from './types';

export const mockApplicationStats: ApplicationStats = {
  totalApplications: 156,
  pendingReview: 42,
  underReview: 28,
  approved: 73,
  rejected: 13,
  avgProcessingTime: 5.2,
  documentsToVerify: 34,
  urgentApplications: 8
};

export const mockPendingApplications: PendingVendorApplication[] = [
  {
    id: 'app-001',
    applicationNumber: 'VA-2024-001',
    businessName: 'TechnoMart Electronics',
    contactPerson: 'Ahmed Rahman',
    email: 'ahmed@technomart.com',
    phone: '+880-1711-123456',
    businessType: 'Retailer',
    category: 'Electronics',
    subCategory: 'Mobile Phones & Accessories',
    registrationDate: '2024-01-15',
    documentsSubmitted: [
      {
        id: 'doc-001',
        name: 'Trade License.pdf',
        type: 'PDF',
        size: 2.5,
        uploadDate: '2024-01-15',
        status: 'verified'
      },
      {
        id: 'doc-002',
        name: 'Tax Certificate.pdf',
        type: 'PDF', 
        size: 1.8,
        uploadDate: '2024-01-15',
        status: 'pending'
      }
    ],
    applicationStatus: 'under_review',
    reviewStatus: 'in_progress',
    assignedReviewer: 'Sarah Ahmed',
    businessAddress: {
      street: '123 Electronics Street',
      city: 'Dhaka',
      state: 'Dhaka Division',
      zipCode: '1000',
      country: 'Bangladesh'
    },
    businessDetails: {
      tradeLicense: 'TL-DHK-2023-001',
      taxId: 'TAX-001-2023',
      yearEstablished: 2020,
      numberOfEmployees: 25,
      annualRevenue: 5000000,
      bankAccount: 'ACC-123456789'
    },
    verificationDocuments: {
      tradeLicense: true,
      taxCertificate: false,
      bankStatement: true,
      identityProof: true,
      addressProof: false
    },
    priority: 'high',
    lastUpdated: '2024-01-20',
    notes: 'High volume electronics vendor with good reputation',
    reviewComments: [
      {
        id: 'comment-001',
        reviewer: 'Sarah Ahmed',
        comment: 'Trade license verified successfully',
        timestamp: '2024-01-18 10:30',
        type: 'approval'
      }
    ]
  },
  {
    id: 'app-002',
    applicationNumber: 'VA-2024-002',
    businessName: 'Fashion Hub BD',
    contactPerson: 'Fatima Khan',
    email: 'fatima@fashionhub.com',
    phone: '+880-1711-234567',
    businessType: 'Manufacturer',
    category: 'Fashion & Clothing',
    subCategory: 'Women\'s Clothing',
    registrationDate: '2024-01-18',
    documentsSubmitted: [
      {
        id: 'doc-003',
        name: 'Business Registration.pdf',
        type: 'PDF',
        size: 3.2,
        uploadDate: '2024-01-18',
        status: 'verified'
      }
    ],
    applicationStatus: 'pending_documents',
    reviewStatus: 'not_started',
    businessAddress: {
      street: '456 Fashion Avenue',
      city: 'Chittagong',
      state: 'Chittagong Division',
      zipCode: '4000',
      country: 'Bangladesh'
    },
    businessDetails: {
      tradeLicense: 'TL-CTG-2023-002',
      taxId: 'TAX-002-2023',
      yearEstablished: 2018,
      numberOfEmployees: 50,
      annualRevenue: 8000000,
      bankAccount: 'ACC-987654321'
    },
    verificationDocuments: {
      tradeLicense: true,
      taxCertificate: false,
      bankStatement: false,
      identityProof: true,
      addressProof: false
    },
    priority: 'medium',
    lastUpdated: '2024-01-19',
    notes: 'Missing tax certificate and bank statement',
    reviewComments: []
  },
  {
    id: 'app-003',
    applicationNumber: 'VA-2024-003',
    businessName: 'Organic Foods Ltd',
    contactPerson: 'Mohammad Ali',
    email: 'ali@organicfoods.com',
    phone: '+880-1711-345678',
    businessType: 'Distributor',
    category: 'Food & Groceries',
    subCategory: 'Organic Products',
    registrationDate: '2024-01-20',
    documentsSubmitted: [
      {
        id: 'doc-004',
        name: 'Food Safety Certificate.pdf',
        type: 'PDF',
        size: 2.1,
        uploadDate: '2024-01-20',
        status: 'pending'
      }
    ],
    applicationStatus: 'submitted',
    reviewStatus: 'not_started',
    businessAddress: {
      street: '789 Organic Lane',
      city: 'Sylhet',
      state: 'Sylhet Division',
      zipCode: '3100',
      country: 'Bangladesh'
    },
    businessDetails: {
      tradeLicense: 'TL-SYL-2023-003',
      taxId: 'TAX-003-2023',
      yearEstablished: 2021,
      numberOfEmployees: 15,
      annualRevenue: 3000000,
      bankAccount: 'ACC-456789123'
    },
    verificationDocuments: {
      tradeLicense: true,
      taxCertificate: true,
      bankStatement: true,
      identityProof: true,
      addressProof: true
    },
    priority: 'urgent',
    lastUpdated: '2024-01-20',
    notes: 'All documents submitted, ready for review',
    reviewComments: []
  }
];
