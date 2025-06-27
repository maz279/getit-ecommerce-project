
import { TradeLicense, TradeLicenseStats } from './types';

export const mockTradeLicenseStats: TradeLicenseStats = {
  totalLicenses: 1423,
  pendingReview: 89,
  verified: 1247,
  expired: 34,
  rejected: 53,
  expiringIn30Days: 56,
  expiringIn7Days: 12,
  complianceRate: 96.8,
  averageProcessingTime: 3.2,
  todaysSubmissions: 15
};

export const mockTradeLicenses: TradeLicense[] = [
  {
    id: 'tl-001',
    vendorId: 'vendor-001',
    vendorName: 'TechCorp Solutions',
    businessName: 'TechCorp Solutions Ltd.',
    licenseNumber: 'TRAD/DHK/2024/001234',
    licenseType: 'trade',
    issuingAuthority: 'Dhaka City Corporation',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-14',
    status: 'verified',
    documents: [
      {
        id: 'doc-001',
        type: 'license_certificate',
        fileName: 'trade_license_certificate.pdf',
        fileUrl: '/documents/trade_license_001.pdf',
        uploadedAt: '2024-01-15T10:00:00Z',
        status: 'verified'
      }
    ],
    businessCategory: 'Technology Services',
    registrationAddress: {
      street: '123 Gulshan Avenue',
      city: 'Dhaka',
      district: 'Dhaka',
      division: 'Dhaka',
      postalCode: '1212',
      country: 'Bangladesh'
    },
    contactDetails: {
      primaryPhone: '+8801712345678',
      email: 'contact@techcorp.bd',
      website: 'www.techcorp.bd',
      contactPerson: 'Mr. Rahman',
      designation: 'General Manager'
    },
    verificationDetails: {
      verifiedAt: '2024-01-20T14:30:00Z',
      verifiedBy: 'John Reviewer',
      verificationMethod: 'manual',
      verificationNotes: 'All documents verified successfully',
      crossChecks: [
        {
          source: 'City Corporation Database',
          status: 'verified',
          checkedAt: '2024-01-20T14:00:00Z',
          details: 'License number confirmed'
        }
      ]
    },
    complianceScore: 95,
    riskLevel: 'low',
    renewalHistory: [],
    flags: [],
    lastVerified: '2024-01-20T14:30:00Z',
    verifiedBy: 'John Reviewer'
  },
  {
    id: 'tl-002',
    vendorId: 'vendor-002',
    vendorName: 'Fashion Hub BD',
    businessName: 'Fashion Hub Bangladesh',
    licenseNumber: 'TRAD/CHT/2024/005678',
    licenseType: 'retail',
    issuingAuthority: 'Chittagong City Corporation',
    issueDate: '2024-02-01',
    expiryDate: '2024-12-31',
    status: 'pending',
    documents: [
      {
        id: 'doc-002',
        type: 'license_certificate',
        fileName: 'trade_license_fashion.pdf',
        fileUrl: '/documents/trade_license_002.pdf',
        uploadedAt: '2024-02-01T09:00:00Z',
        status: 'pending'
      }
    ],
    businessCategory: 'Fashion & Apparel',
    registrationAddress: {
      street: '456 Agrabad Commercial Area',
      city: 'Chittagong',
      district: 'Chittagong',
      division: 'Chittagong',
      postalCode: '4100',
      country: 'Bangladesh'
    },
    contactDetails: {
      primaryPhone: '+8801798765432',
      email: 'info@fashionhub.bd',
      contactPerson: 'Ms. Sultana',
      designation: 'Owner'
    },
    complianceScore: 78,
    riskLevel: 'medium',
    renewalHistory: [],
    flags: [
      {
        id: 'flag-001',
        type: 'warning',
        severity: 'medium',
        description: 'Expiring within 30 days',
        createdAt: '2024-12-01T10:00:00Z',
        actionRequired: 'Initiate renewal process'
      }
    ]
  },
  {
    id: 'tl-003',
    vendorId: 'vendor-003',
    vendorName: 'Electronics World',
    businessName: 'Electronics World Ltd.',
    licenseNumber: 'TRAD/SYL/2023/009876',
    licenseType: 'import_export',
    issuingAuthority: 'Sylhet City Corporation',
    issueDate: '2023-06-15',
    expiryDate: '2024-06-14',
    status: 'expired',
    documents: [
      {
        id: 'doc-003',
        type: 'license_certificate',
        fileName: 'import_export_license.pdf',
        fileUrl: '/documents/trade_license_003.pdf',
        uploadedAt: '2023-06-15T11:00:00Z',
        status: 'verified'
      }
    ],
    businessCategory: 'Electronics & Appliances',
    registrationAddress: {
      street: '789 Zindabazar',
      city: 'Sylhet',
      district: 'Sylhet',
      division: 'Sylhet',
      postalCode: '3100',
      country: 'Bangladesh'
    },
    contactDetails: {
      primaryPhone: '+8801612345789',
      email: 'admin@electronicsworld.bd',
      contactPerson: 'Mr. Ahmed',
      designation: 'Managing Director'
    },
    complianceScore: 65,
    riskLevel: 'high',
    renewalHistory: [
      {
        id: 'renewal-001',
        renewedAt: '2023-06-15T10:00:00Z',
        expiryDate: '2024-06-14',
        status: 'expired',
        renewalFee: 5000,
        documents: ['doc-003']
      }
    ],
    flags: [
      {
        id: 'flag-002',
        type: 'violation',
        severity: 'high',
        description: 'License expired',
        createdAt: '2024-06-15T00:00:00Z',
        actionRequired: 'Immediate renewal required'
      }
    ]
  }
];
