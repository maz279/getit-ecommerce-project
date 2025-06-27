
import { DocumentSubmission, DocumentReviewStats, ComplianceRule, ReviewerPerformance } from './types';

export const mockDocumentSubmissions: DocumentSubmission[] = [
  {
    id: '1',
    vendorId: 'vendor-001',
    vendorName: 'TechCorp Solutions',
    documentType: 'business_license',
    fileName: 'business_license_techcorp.pdf',
    fileUrl: '/documents/business_license_techcorp.pdf',
    fileSize: 2048576,
    mimeType: 'application/pdf',
    status: 'pending',
    submittedAt: '2024-01-20T10:30:00Z',
    priority: 'high',
    category: 'business',
    metadata: {
      extractedText: 'Business License Certificate...',
      ocrConfidence: 0.95,
      digitalSignature: true,
      fileHash: 'abc123def456'
    },
    comments: [],
    auditTrail: [
      {
        id: '1',
        action: 'submitted',
        performedBy: 'vendor-001',
        timestamp: '2024-01-20T10:30:00Z',
        details: 'Document submitted for review'
      }
    ]
  },
  {
    id: '2',
    vendorId: 'vendor-002',
    vendorName: 'Fashion Hub BD',
    documentType: 'tax_certificate',
    fileName: 'tax_certificate_fashion.pdf',
    fileUrl: '/documents/tax_certificate_fashion.pdf',
    fileSize: 1536000,
    mimeType: 'application/pdf',
    status: 'under_review',
    submittedAt: '2024-01-19T14:20:00Z',
    reviewedAt: '2024-01-20T09:15:00Z',
    reviewedBy: 'reviewer-001',
    priority: 'medium',
    category: 'financial',
    metadata: {
      extractedText: 'Tax Registration Certificate...',
      ocrConfidence: 0.88,
      digitalSignature: false,
      fileHash: 'def789ghi012'
    },
    comments: [
      {
        id: '1',
        authorId: 'reviewer-001',
        authorName: 'John Reviewer',
        comment: 'Document appears to be authentic, verifying details with tax authority.',
        timestamp: '2024-01-20T09:15:00Z',
        isInternal: true
      }
    ],
    auditTrail: [
      {
        id: '1',
        action: 'submitted',
        performedBy: 'vendor-002',
        timestamp: '2024-01-19T14:20:00Z',
        details: 'Document submitted for review'
      },
      {
        id: '2',
        action: 'reviewed',
        performedBy: 'reviewer-001',
        timestamp: '2024-01-20T09:15:00Z',
        details: 'Document assigned for review'
      }
    ]
  },
  {
    id: '3',
    vendorId: 'vendor-003',
    vendorName: 'Green Foods Ltd',
    documentType: 'identity_proof',
    fileName: 'director_id_proof.jpg',
    fileUrl: '/documents/director_id_proof.jpg',
    fileSize: 512000,
    mimeType: 'image/jpeg',
    status: 'approved',
    submittedAt: '2024-01-18T16:45:00Z',
    reviewedAt: '2024-01-19T11:30:00Z',
    reviewedBy: 'reviewer-002',
    priority: 'low',
    category: 'kyc',
    metadata: {
      extractedText: 'National ID Card...',
      ocrConfidence: 0.92,
      digitalSignature: false,
      fileHash: 'ghi345jkl678'
    },
    comments: [
      {
        id: '1',
        authorId: 'reviewer-002',
        authorName: 'Sarah Reviewer',
        comment: 'ID verified successfully. All details match.',
        timestamp: '2024-01-19T11:30:00Z',
        isInternal: true
      }
    ],
    auditTrail: [
      {
        id: '1',
        action: 'submitted',
        performedBy: 'vendor-003',
        timestamp: '2024-01-18T16:45:00Z',
        details: 'Document submitted for review'
      },
      {
        id: '2',
        action: 'approved',
        performedBy: 'reviewer-002',
        timestamp: '2024-01-19T11:30:00Z',
        details: 'Document approved after verification'
      }
    ]
  },
  {
    id: '4',
    vendorId: 'vendor-004',
    vendorName: 'Electronics World',
    documentType: 'bank_statement',
    fileName: 'bank_statement_dec2023.pdf',
    fileUrl: '/documents/bank_statement_dec2023.pdf',
    fileSize: 3072000,
    mimeType: 'application/pdf',
    status: 'rejected',
    submittedAt: '2024-01-17T09:20:00Z',
    reviewedAt: '2024-01-18T15:45:00Z',
    reviewedBy: 'reviewer-001',
    rejectionReason: 'Bank statement is older than 3 months. Please submit a recent statement.',
    priority: 'urgent',
    category: 'financial',
    metadata: {
      extractedText: 'Bank Statement December 2023...',
      ocrConfidence: 0.85,
      digitalSignature: true,
      fileHash: 'jkl901mno234'
    },
    comments: [
      {
        id: '1',
        authorId: 'reviewer-001',
        authorName: 'John Reviewer',
        comment: 'Statement is from December 2023, which exceeds our 3-month requirement.',
        timestamp: '2024-01-18T15:45:00Z',
        isInternal: true
      }
    ],
    auditTrail: [
      {
        id: '1',
        action: 'submitted',
        performedBy: 'vendor-004',
        timestamp: '2024-01-17T09:20:00Z',
        details: 'Document submitted for review'
      },
      {
        id: '2',
        action: 'rejected',
        performedBy: 'reviewer-001',
        timestamp: '2024-01-18T15:45:00Z',
        details: 'Document rejected - outdated bank statement'
      }
    ]
  }
];

export const mockDocumentStats: DocumentReviewStats = {
  totalDocuments: 2847,
  pendingReview: 127,
  underReview: 45,
  approved: 2234,
  rejected: 234,
  expired: 67,
  averageReviewTime: 2.4,
  complianceRate: 94.2,
  todaysSubmissions: 89,
  urgentReviews: 15
};

export const mockComplianceRules: ComplianceRule[] = [
  {
    id: '1',
    documentType: 'bank_statement',
    ruleName: 'Statement Age Validation',
    description: 'Bank statements must not be older than 3 months',
    isActive: true,
    severity: 'error',
    autoReject: true,
    validationLogic: 'statement_date > (current_date - 90 days)'
  },
  {
    id: '2',
    documentType: 'business_license',
    ruleName: 'License Expiry Check',
    description: 'Business license must be valid and not expired',
    isActive: true,
    severity: 'critical',
    autoReject: true,
    validationLogic: 'expiry_date > current_date'
  }
];

export const mockReviewerPerformance: ReviewerPerformance[] = [
  {
    reviewerId: 'reviewer-001',
    reviewerName: 'John Reviewer',
    documentsReviewed: 156,
    averageReviewTime: 2.1,
    accuracyRate: 96.8,
    workload: 8,
    availability: 'available'
  },
  {
    reviewerId: 'reviewer-002',
    reviewerName: 'Sarah Reviewer',
    documentsReviewed: 203,
    averageReviewTime: 1.8,
    accuracyRate: 98.2,
    workload: 12,
    availability: 'busy'
  }
];
