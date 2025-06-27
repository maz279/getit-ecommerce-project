
import { BankAccount, BankVerificationStats, BankingAuthority } from './types';

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'ba-001',
    vendorId: 'vendor-001',
    vendorName: 'TechCorp Solutions Ltd',
    accountHolderName: 'TechCorp Solutions Limited',
    accountNumber: '1234567890',
    bankName: 'Standard Chartered Bank',
    bankCode: 'SCBL',
    branchName: 'Gulshan Branch',
    branchCode: 'SCBL0001',
    routingNumber: '015261729',
    swiftCode: 'SCBLBDDX',
    accountType: 'business',
    currency: 'BDT',
    country: 'Bangladesh',
    status: 'pending',
    verificationMethod: 'document_verification',
    documents: [
      {
        id: 'doc-001',
        type: 'bank_statement',
        fileName: 'bank_statement_dec_2024.pdf',
        fileUrl: '/documents/bank_statement_dec_2024.pdf',
        fileSize: 2048576,
        uploadedAt: '2024-12-20T10:30:00Z',
        verificationStatus: 'pending'
      }
    ],
    verificationAttempts: 1,
    complianceFlags: [
      {
        id: 'cf-001',
        type: 'aml_check',
        status: 'clear',
        details: 'AML screening completed successfully',
        severity: 'low',
        createdAt: '2024-12-20T11:00:00Z'
      }
    ],
    riskScore: 25,
    fraudAlerts: [],
    transactionHistory: [],
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2024-12-20T11:30:00Z'
  },
  {
    id: 'ba-002',
    vendorId: 'vendor-002',
    vendorName: 'Fashion Hub BD',
    accountHolderName: 'Fashion Hub Bangladesh',
    accountNumber: '9876543210',
    bankName: 'Dutch-Bangla Bank',
    bankCode: 'DBBL',
    branchName: 'Dhanmondi Branch',
    branchCode: 'DBBL0002',
    routingNumber: '090261234',
    accountType: 'current',
    currency: 'BDT',
    country: 'Bangladesh',
    status: 'verified',
    verificationMethod: 'micro_deposit',
    documents: [
      {
        id: 'doc-002',
        type: 'void_check',
        fileName: 'void_check.pdf',
        fileUrl: '/documents/void_check.pdf',
        fileSize: 1024000,
        uploadedAt: '2024-12-15T14:20:00Z',
        verificationStatus: 'verified',
        verifiedBy: 'admin-user-001'
      }
    ],
    verificationAttempts: 1,
    lastVerificationDate: '2024-12-16T10:00:00Z',
    verifiedBy: 'admin-user-001',
    complianceFlags: [
      {
        id: 'cf-002',
        type: 'sanctions_check',
        status: 'clear',
        details: 'No sanctions matches found',
        severity: 'low',
        createdAt: '2024-12-15T15:00:00Z'
      }
    ],
    riskScore: 15,
    fraudAlerts: [],
    transactionHistory: [
      {
        id: 'tx-001',
        type: 'micro_deposit',
        amount: 1.23,
        currency: 'BDT',
        status: 'completed',
        transactionId: 'MD-123456',
        processedAt: '2024-12-16T09:30:00Z'
      }
    ],
    createdAt: '2024-12-15T13:00:00Z',
    updatedAt: '2024-12-16T10:00:00Z'
  },
  {
    id: 'ba-003',
    vendorId: 'vendor-003',
    vendorName: 'Electronics World',
    accountHolderName: 'Electronics World Limited',
    accountNumber: '5555666677',
    bankName: 'BRAC Bank',
    bankCode: 'BRAC',
    branchName: 'Uttara Branch',
    branchCode: 'BRAC0003',
    routingNumber: '060271234',
    accountType: 'business',
    currency: 'BDT',
    country: 'Bangladesh',
    status: 'rejected',
    verificationMethod: 'document_verification',
    documents: [
      {
        id: 'doc-003',
        type: 'bank_statement',
        fileName: 'incomplete_statement.pdf',
        fileUrl: '/documents/incomplete_statement.pdf',
        fileSize: 512000,
        uploadedAt: '2024-12-18T16:45:00Z',
        verificationStatus: 'rejected',
        verifiedBy: 'admin-user-002',
        verificationNotes: 'Document is incomplete and missing required information'
      }
    ],
    verificationAttempts: 2,
    rejectionReason: 'Incomplete documentation provided',
    complianceFlags: [],
    riskScore: 85,
    fraudAlerts: [
      {
        id: 'fa-001',
        type: 'suspicious_activity',
        description: 'Multiple failed verification attempts',
        severity: 'medium',
        status: 'investigating',
        triggeredAt: '2024-12-19T08:00:00Z',
        investigatedBy: 'fraud-team-001'
      }
    ],
    transactionHistory: [],
    createdAt: '2024-12-18T15:00:00Z',
    updatedAt: '2024-12-19T08:30:00Z'
  }
];

export const mockBankVerificationStats: BankVerificationStats = {
  totalAccounts: 2847,
  pendingVerification: 186,
  verifiedAccounts: 2456,
  rejectedAccounts: 142,
  expiredAccounts: 38,
  suspendedAccounts: 25,
  averageVerificationTime: 2.3,
  verificationSuccessRate: 86.2,
  fraudAlertsCount: 12,
  complianceIssues: 8,
  monthlyTrend: [
    { month: 'Jul 2024', verified: 198, rejected: 12, pending: 45 },
    { month: 'Aug 2024', verified: 234, rejected: 18, pending: 52 },
    { month: 'Sep 2024', verified: 267, rejected: 15, pending: 38 },
    { month: 'Oct 2024', verified: 289, rejected: 22, pending: 41 },
    { month: 'Nov 2024', verified: 312, rejected: 19, pending: 47 },
    { month: 'Dec 2024', verified: 278, rejected: 16, pending: 38 }
  ]
};

export const mockBankingAuthorities: BankingAuthority[] = [
  {
    id: 'auth-001',
    name: 'Bangladesh Bank',
    country: 'Bangladesh',
    regulationType: 'central_bank',
    apiEndpoint: 'https://api.bb.org.bd/verify',
    verificationMethods: ['rtgs_verification', 'swift_validation', 'account_existence'],
    supportedBanks: ['All Licensed Banks in Bangladesh'],
    complianceRequirements: ['AML', 'KYC', 'CFT'],
    isActive: true
  },
  {
    id: 'auth-002',
    name: 'Financial Intelligence Unit Bangladesh',
    country: 'Bangladesh',
    regulationType: 'financial_regulator',
    verificationMethods: ['aml_screening', 'sanctions_check', 'pep_screening'],
    supportedBanks: ['All Financial Institutions'],
    complianceRequirements: ['AML', 'CFT', 'Sanctions Compliance'],
    isActive: true
  }
];
