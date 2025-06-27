
import { TinVerificationRecord, TinVerificationStats, TaxAuthority, ComplianceAlert } from './types';

export const mockTinVerificationStats: TinVerificationStats = {
  totalSubmissions: 1370,
  pendingReview: 89,
  verified: 1247,
  expired: 34,
  rejected: 0,
  complianceRate: 96.8,
  averageProcessingTime: 1.8,
  urgentReviews: 12
};

export const mockTinRecords: TinVerificationRecord[] = [
  {
    id: '1',
    vendorId: 'vendor_001',
    vendorName: 'Ahmed Electronics Ltd',
    businessName: 'Ahmed Electronics & Technology',
    tinNumber: 'TIN-BD-2024-001234',
    businessType: 'corporation',
    registrationDate: '2024-01-15',
    expiryDate: '2025-01-15',
    issuingAuthority: 'National Board of Revenue (NBR), Bangladesh',
    status: 'pending',
    documents: [
      {
        id: 'doc_001',
        type: 'tin_certificate',
        fileName: 'tin_certificate_ahmed_electronics.pdf',
        fileUrl: '/documents/tin_cert_001.pdf',
        uploadDate: '2024-01-20',
        verified: false
      }
    ],
    taxFilingStatus: 'current',
    lastFilingDate: '2024-03-15',
    complianceScore: 85,
    riskLevel: 'low',
    notes: 'New vendor application - priority review requested',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    vendorId: 'vendor_002',
    vendorName: 'Fashion House Dhaka',
    businessName: 'Fashion House Dhaka Limited',
    tinNumber: 'TIN-BD-2023-005678',
    businessType: 'corporation',
    registrationDate: '2023-06-10',
    expiryDate: '2024-06-10',
    issuingAuthority: 'National Board of Revenue (NBR), Bangladesh',
    status: 'verified',
    verificationDate: '2024-01-10',
    verifiedBy: 'admin_user_1',
    documents: [
      {
        id: 'doc_002',
        type: 'tin_certificate',
        fileName: 'tin_certificate_fashion_house.pdf',
        fileUrl: '/documents/tin_cert_002.pdf',
        uploadDate: '2023-06-15',
        verified: true,
        verificationDate: '2024-01-10',
        verifiedBy: 'admin_user_1'
      }
    ],
    taxFilingStatus: 'current',
    lastFilingDate: '2024-02-28',
    complianceScore: 95,
    riskLevel: 'low',
    createdAt: '2023-06-15T14:20:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  },
  {
    id: '3',
    vendorId: 'vendor_003',
    vendorName: 'Tech Solutions BD',
    businessName: 'Tech Solutions Bangladesh',
    tinNumber: 'TIN-BD-2022-009876',
    businessType: 'partnership',
    registrationDate: '2022-12-01',
    expiryDate: '2023-12-01',
    issuingAuthority: 'National Board of Revenue (NBR), Bangladesh',
    status: 'expired',
    documents: [
      {
        id: 'doc_003',
        type: 'tin_certificate',
        fileName: 'tin_certificate_tech_solutions.pdf',
        fileUrl: '/documents/tin_cert_003.pdf',
        uploadDate: '2022-12-05',
        verified: true,
        verificationDate: '2022-12-10',
        verifiedBy: 'admin_user_2'
      }
    ],
    taxFilingStatus: 'delinquent',
    lastFilingDate: '2023-01-15',
    complianceScore: 45,
    riskLevel: 'high',
    notes: 'TIN expired - renewal required. Tax filing overdue.',
    createdAt: '2022-12-05T11:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockTaxAuthorities: TaxAuthority[] = [
  {
    id: 'auth_001',
    name: 'National Board of Revenue (NBR)',
    country: 'Bangladesh',
    region: 'Dhaka',
    contactInfo: {
      phone: '+880-2-9566091',
      email: 'info@nbr.gov.bd',
      website: 'https://nbr.gov.bd',
      address: 'Segunbagicha, Dhaka-1000, Bangladesh'
    },
    verificationAPI: {
      endpoint: 'https://api.nbr.gov.bd/verify-tin',
      requiresAuth: true,
      supportedFormats: ['JSON', 'XML']
    }
  },
  {
    id: 'auth_002',
    name: 'Internal Revenue Service (IRS)',
    country: 'United States',
    contactInfo: {
      phone: '+1-800-829-1040',
      email: 'business@irs.gov',
      website: 'https://www.irs.gov',
      address: '1111 Constitution Ave, NW, Washington, DC 20224'
    },
    verificationAPI: {
      endpoint: 'https://api.irs.gov/verify-ein',
      requiresAuth: true,
      supportedFormats: ['JSON']
    }
  }
];

export const mockComplianceAlerts: ComplianceAlert[] = [
  {
    id: 'alert_001',
    vendorId: 'vendor_003',
    alertType: 'expiry_warning',
    severity: 'critical',
    message: 'TIN has expired and requires immediate renewal',
    dueDate: '2023-12-01',
    actionRequired: true,
    createdAt: '2023-12-02T00:00:00Z'
  },
  {
    id: 'alert_002',
    vendorId: 'vendor_002',
    alertType: 'expiry_warning',
    severity: 'medium',
    message: 'TIN will expire in 30 days - renewal recommended',
    dueDate: '2024-06-10',
    actionRequired: true,
    createdAt: '2024-05-10T08:00:00Z'
  }
];
