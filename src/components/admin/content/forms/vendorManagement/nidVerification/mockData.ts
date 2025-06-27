
import { NidRecord, NidStats, BiometricMatch, IdentityCompliance, FraudDetection, NidAnalytics } from './types';

export const mockNidStats: NidStats = {
  totalNids: 8547,
  pendingVerification: 234,
  verifiedNids: 7891,
  rejectedNids: 289,
  expiredNids: 133,
  flaggedNids: 45,
  biometricVerified: 6234,
  apiVerified: 5678,
  manualVerified: 1234,
  averageProcessingTime: '2.3 hours',
  complianceRate: 94.2,
  fraudDetectionRate: 3.4,
  successRate: 92.3,
  todayProcessed: 67,
  weeklyTrend: -12,
  monthlyTrend: 8
};

export const mockNidRecords: NidRecord[] = [
  {
    id: 'nid-001',
    vendorId: 'vendor-001',
    vendorName: 'Rahul Ahmed',
    businessName: 'Ahmed Electronics',
    nidNumber: '1234567890123',
    nidType: 'smart_card',
    holderName: 'Md. Rahul Ahmed',
    fatherName: 'Md. Karim Ahmed',
    motherName: 'Rashida Begum',
    dateOfBirth: '1985-03-15',
    address: '123 Dhanmondi Road, Dhaka-1205',
    phoneNumber: '+8801712345678',
    email: 'rahul.ahmed@email.com',
    bloodGroup: 'B+',
    nidImages: {
      front: '/images/nid/nid-001-front.jpg',
      back: '/images/nid/nid-001-back.jpg'
    },
    selfiImage: '/images/nid/nid-001-selfie.jpg',
    biometricData: {
      fingerprint: 'encrypted-fingerprint-data',
      faceData: 'encrypted-face-data'
    },
    status: 'pending',
    verificationMethod: 'biometric',
    issuedDate: '2020-01-15',
    expiryDate: '2030-01-15',
    complianceScore: 87,
    riskLevel: 'low',
    fraudFlags: [],
    verificationNotes: 'All documents provided, biometric verification pending',
    lastUpdated: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-10T09:15:00Z',
    tags: ['high-priority', 'electronics-vendor'],
    priority: 'high',
    division: 'Dhaka',
    district: 'Dhaka',
    upazilla: 'Dhanmondi',
    union: 'Ward-19',
    ward: '19',
    voterSerial: 'DHA-19-001234',
    blacklistStatus: 'clean',
    faceMatchScore: 94.5,
    duplicateCheck: {
      hasDuplicate: false,
      duplicateCount: 0,
      duplicateIds: []
    }
  },
  {
    id: 'nid-002',
    vendorId: 'vendor-002',
    vendorName: 'Fatima Khatun',
    businessName: 'Khatun Fashion House',
    nidNumber: '9876543210987',
    nidType: 'smart_card',
    holderName: 'Fatima Khatun',
    fatherName: 'Abdul Rahman',
    motherName: 'Kulsum Begum',
    dateOfBirth: '1990-07-22',
    address: '456 Uttara Sector 7, Dhaka-1230',
    phoneNumber: '+8801987654321',
    email: 'fatima.khatun@email.com',
    bloodGroup: 'A+',
    nidImages: {
      front: '/images/nid/nid-002-front.jpg',
      back: '/images/nid/nid-002-back.jpg'
    },
    selfiImage: '/images/nid/nid-002-selfie.jpg',
    status: 'verified',
    verificationMethod: 'api',
    issuedDate: '2021-05-10',
    expiryDate: '2031-05-10',
    verifiedAt: '2024-01-12T14:20:00Z',
    verifiedBy: 'admin-001',
    complianceScore: 96,
    riskLevel: 'low',
    fraudFlags: [],
    verificationNotes: 'Successfully verified through API integration',
    lastUpdated: '2024-01-12T14:20:00Z',
    createdAt: '2024-01-08T11:45:00Z',
    tags: ['fashion', 'verified'],
    priority: 'medium',
    division: 'Dhaka',
    district: 'Dhaka',
    upazilla: 'Uttara',
    union: 'Sector-7',
    ward: '7',
    voterSerial: 'DHA-UT-007456',
    blacklistStatus: 'clean',
    faceMatchScore: 97.2,
    duplicateCheck: {
      hasDuplicate: false,
      duplicateCount: 0,
      duplicateIds: []
    }
  },
  {
    id: 'nid-003',
    vendorId: 'vendor-003',
    vendorName: 'Mohammad Hasan',
    businessName: 'Hasan Trading Co.',
    nidNumber: '5555666677778',
    nidType: 'manual_card',
    holderName: 'Mohammad Hasan',
    fatherName: 'Abdul Hasan',
    motherName: 'Rokeya Begum',
    dateOfBirth: '1975-12-08',
    address: '789 Chittagong Road, Chittagong-4000',
    phoneNumber: '+8801555666777',
    email: 'hasan.trading@email.com',
    bloodGroup: 'O+',
    nidImages: {
      front: '/images/nid/nid-003-front.jpg',
      back: '/images/nid/nid-003-back.jpg'
    },
    status: 'flagged',
    verificationMethod: 'manual',
    issuedDate: '2015-08-20',
    complianceScore: 45,
    riskLevel: 'high',
    fraudFlags: ['image_quality_low', 'manual_review_required'],
    verificationNotes: 'Manual NID card requires additional verification',
    lastUpdated: '2024-01-14T16:10:00Z',
    createdAt: '2024-01-12T13:30:00Z',
    tags: ['manual-review', 'trading'],
    priority: 'urgent',
    division: 'Chittagong',
    district: 'Chittagong',
    upazilla: 'Kotwali',
    blacklistStatus: 'flagged',
    duplicateCheck: {
      hasDuplicate: true,
      duplicateCount: 1,
      duplicateIds: ['nid-045']
    }
  }
];

export const mockBiometricMatches: BiometricMatch[] = [
  {
    id: 'bio-001',
    nidId: 'nid-001',
    matchType: 'face',
    matchScore: 94.5,
    confidence: 0.95,
    matchedAt: '2024-01-15T10:35:00Z',
    matchedBy: 'admin-001',
    deviceInfo: {
      deviceId: 'bio-scanner-001',
      deviceType: 'Face Recognition Camera',
      location: 'Verification Center - Dhaka'
    },
    result: 'match'
  },
  {
    id: 'bio-002',
    nidId: 'nid-002',
    matchType: 'both',
    matchScore: 97.2,
    confidence: 0.97,
    matchedAt: '2024-01-12T14:15:00Z',
    matchedBy: 'admin-002',
    deviceInfo: {
      deviceId: 'bio-scanner-002',
      deviceType: 'Multi-Modal Scanner',
      location: 'Verification Center - Uttara'
    },
    result: 'match'
  }
];

export const mockIdentityCompliance: IdentityCompliance[] = [
  {
    nidId: 'nid-001',
    complianceChecks: {
      nidFormatValid: true,
      nidLengthValid: true,
      imageQualityCheck: true,
      duplicateCheck: true,
      blacklistCheck: true,
      ageVerification: true,
      addressVerification: true,
      phoneVerification: true,
      emailVerification: false
    },
    overallScore: 87,
    riskAssessment: 'Low Risk - Minor email verification pending',
    recommendations: ['Complete email verification', 'Update contact information'],
    lastChecked: '2024-01-15T10:30:00Z'
  }
];

export const mockFraudDetection: FraudDetection[] = [
  {
    id: 'fraud-001',
    nidId: 'nid-003',
    fraudType: 'duplicate_nid',
    severity: 'high',
    confidence: 0.89,
    description: 'Potential duplicate NID number detected in system',
    detectedAt: '2024-01-14T16:00:00Z',
    detectedBy: 'system',
    status: 'investigating'
  }
];

export const mockNidAnalytics: NidAnalytics = {
  processingMetrics: {
    dailyProcessed: [45, 52, 38, 67, 43, 51, 59],
    weeklyProcessed: [289, 324, 267, 298, 312, 287, 334],
    monthlyProcessed: [1234, 1456, 1123, 1567, 1345, 1234, 1456, 1678, 1234, 1567, 1345, 1456],
    averageProcessingTime: [2.3, 2.1, 2.5, 2.2, 2.4, 2.3, 2.1],
    successRates: [92.3, 93.1, 91.8, 92.7, 93.2, 92.1, 92.8]
  },
  verificationMethods: {
    api: 5678,
    manual: 1234,
    biometric: 6234,
    hybrid: 1567
  },
  rejectionReasons: {
    'Poor Image Quality': 45,
    'Duplicate NID': 32,
    'Invalid Format': 28,
    'Blacklisted': 15,
    'Age Mismatch': 12,
    'Address Verification Failed': 18,
    'Other': 23
  },
  geographicDistribution: {
    'Dhaka': 3456,
    'Chittagong': 1234,
    'Sylhet': 987,
    'Rajshahi': 876,
    'Khulna': 765,
    'Barisal': 543,
    'Rangpur': 432,
    'Mymensingh': 321
  },
  fraudDetectionStats: {
    totalFraudCases: 45,
    fraudsByType: {
      'Duplicate NID': 15,
      'Fake Image': 12,
      'Identity Theft': 8,
      'Suspicious Pattern': 6,
      'Blacklist Match': 4
    },
    monthlyFraudTrend: [3, 5, 2, 4, 6, 3, 5, 7, 4, 3, 5, 2]
  },
  complianceMetrics: {
    averageComplianceScore: 87.5,
    complianceDistribution: [12, 23, 45, 67, 89, 134, 156, 178, 123, 98],
    topComplianceIssues: [
      'Email Verification Pending',
      'Address Verification Failed',
      'Phone Number Not Verified',
      'Image Quality Issues',
      'Missing Biometric Data'
    ]
  }
};
