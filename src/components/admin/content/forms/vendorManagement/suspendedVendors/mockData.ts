
import { SuspendedVendor, SuspendedVendorStats, ReinstatementRequest } from './types';

export const mockSuspendedVendors: SuspendedVendor[] = [
  {
    id: 'susp_001',
    vendorId: 'vendor_245',
    businessName: 'TechGadgets Pro',
    contactPerson: 'Rahman Ahmed',
    email: 'rahman@techgadgets.com',
    phone: '+880-1712-345678',
    category: 'Electronics',
    registrationDate: '2023-08-15',
    suspensionDate: '2024-06-20',
    suspensionReason: 'Multiple customer complaints about defective products',
    suspensionType: 'temporary',
    originalIssue: 'Quality control issues with smartphone accessories',
    violationType: 'quality_issues',
    severityLevel: 'high',
    suspendedBy: 'Quality Control Team',
    reviewStatus: 'under_review',
    lastReviewDate: '2024-06-25',
    reinstateEligibleDate: '2024-07-20',
    totalOrdersBeforeSuspension: 1250,
    totalRevenueBeforeSuspension: 285000,
    customerComplaintsCount: 45,
    averageRating: 2.8,
    complianceScore: 65,
    paymentIssuesCount: 2,
    qualityIssuesCount: 23,
    appealStatus: 'submitted',
    appealDate: '2024-06-22',
    appealReason: 'Implemented new quality control measures',
    correctionPlan: 'Enhanced quality testing, supplier audit, customer service training',
    documentsRequired: ['Quality Control Plan', 'Supplier Audit', 'Training Records'],
    documentsSubmitted: ['Quality Control Plan', 'Training Records'],
    reinstatementConditions: ['Complete supplier audit', 'Maintain 90% quality score', '3-month monitoring'],
    monitoringPeriod: 90,
    notes: 'Vendor has shown commitment to improvement',
    actionHistory: [
      {
        id: 'action_001',
        actionType: 'warning_issued',
        actionDate: '2024-06-10',
        actionBy: 'Quality Manager',
        reason: 'Increasing customer complaints',
        details: 'First warning issued for quality issues'
      },
      {
        id: 'action_002',
        actionType: 'suspended',
        actionDate: '2024-06-20',
        actionBy: 'Quality Control Team',
        reason: 'Quality issues persisted',
        details: 'Temporary suspension due to unresolved quality problems'
      }
    ]
  },
  {
    id: 'susp_002',
    vendorId: 'vendor_189',
    businessName: 'Fashion Forward BD',
    contactPerson: 'Fatima Khatun',
    email: 'fatima@fashionforward.com',
    phone: '+880-1823-456789',
    category: 'Fashion',
    registrationDate: '2023-05-10',
    suspensionDate: '2024-06-18',
    suspensionReason: 'Policy violation - selling counterfeit branded items',
    suspensionType: 'permanent',
    originalIssue: 'Counterfeit luxury brand products detected',
    violationType: 'policy_violation',
    severityLevel: 'critical',
    suspendedBy: 'Legal Compliance Team',
    reviewStatus: 'permanently_suspended',
    lastReviewDate: '2024-06-25',
    totalOrdersBeforeSuspension: 890,
    totalRevenueBeforeSuspension: 156000,
    customerComplaintsCount: 12,
    averageRating: 3.2,
    complianceScore: 25,
    paymentIssuesCount: 0,
    qualityIssuesCount: 8,
    appealStatus: 'rejected',
    appealDate: '2024-06-19',
    appealReason: 'Claimed products were authentic',
    documentsRequired: ['Legal Authorization', 'Brand Certificates', 'Supplier Verification'],
    documentsSubmitted: [],
    reinstatementConditions: ['Not eligible for reinstatement'],
    notes: 'Permanent suspension due to intellectual property violation',
    actionHistory: [
      {
        id: 'action_003',
        actionType: 'suspended',
        actionDate: '2024-06-18',
        actionBy: 'Legal Compliance Team',
        reason: 'Counterfeit products detected',
        details: 'Immediate suspension for policy violation'
      },
      {
        id: 'action_004',
        actionType: 'permanently_banned',
        actionDate: '2024-06-25',
        actionBy: 'Legal Review Board',
        reason: 'Confirmed policy violation',
        details: 'Permanent ban after legal review'
      }
    ]
  },
  {
    id: 'susp_003',
    vendorId: 'vendor_334',
    businessName: 'Home Essentials Ltd',
    contactPerson: 'Karim Hassan',
    email: 'karim@homeessentials.com',
    phone: '+880-1934-567890',
    category: 'Home & Living',
    registrationDate: '2023-11-20',
    suspensionDate: '2024-06-22',
    suspensionReason: 'Payment processing issues and delayed refunds',
    suspensionType: 'temporary',
    originalIssue: 'Multiple payment disputes and refund delays',
    violationType: 'payment_issues',
    severityLevel: 'medium',
    suspendedBy: 'Payment Operations Team',
    reviewStatus: 'approved_for_reinstatement',
    lastReviewDate: '2024-06-26',
    reinstateEligibleDate: '2024-06-28',
    totalOrdersBeforeSuspension: 650,
    totalRevenueBeforeSuspension: 98000,
    customerComplaintsCount: 18,
    averageRating: 3.8,
    complianceScore: 78,
    paymentIssuesCount: 15,
    qualityIssuesCount: 3,
    appealStatus: 'approved',
    appealDate: '2024-06-23',
    appealReason: 'Resolved payment processing issues',
    correctionPlan: 'Updated payment gateway, improved refund process',
    documentsRequired: ['Payment System Update', 'Refund Policy', 'Financial Records'],
    documentsSubmitted: ['Payment System Update', 'Refund Policy', 'Financial Records'],
    reinstatementConditions: ['Maintain 95% payment success rate', '24-hour refund processing', '2-month monitoring'],
    monitoringPeriod: 60,
    notes: 'Payment issues resolved, ready for reinstatement',
    actionHistory: [
      {
        id: 'action_005',
        actionType: 'warning_issued',
        actionDate: '2024-06-15',
        actionBy: 'Payment Operations',
        reason: 'Payment processing delays',
        details: 'Warning for increasing payment issues'
      },
      {
        id: 'action_006',
        actionType: 'suspended',
        actionDate: '2024-06-22',
        actionBy: 'Payment Operations Team',
        reason: 'Unresolved payment issues',
        details: 'Temporary suspension pending resolution'
      }
    ]
  }
];

export const mockSuspendedVendorStats: SuspendedVendorStats = {
  totalSuspended: 45,
  temporarySuspensions: 32,
  permanentSuspensions: 13,
  underReview: 18,
  appealsPending: 12,
  eligibleForReinstatement: 8,
  recentSuspensions: 7,
  averageSuspensionDuration: 15,
  reinstatementRate: 68,
  recurringViolations: 5
};

export const mockReinstatementRequests: ReinstatementRequest[] = [
  {
    id: 'reinstate_001',
    vendorId: 'vendor_245',
    businessName: 'TechGadgets Pro',
    requestDate: '2024-06-22',
    reason: 'Quality control measures implemented',
    correctionPlan: 'New supplier verification process, enhanced testing protocols, customer service training completed',
    evidenceSubmitted: ['Quality Control Documentation', 'Supplier Audit Results', 'Training Certificates'],
    status: 'under_review',
    conditions: ['Maintain 90% quality rating', 'Monthly quality reports', '3-month monitoring period'],
    monitoringPeriod: 90
  },
  {
    id: 'reinstate_002',
    vendorId: 'vendor_334',
    businessName: 'Home Essentials Ltd',
    requestDate: '2024-06-23',
    reason: 'Payment processing issues resolved',
    correctionPlan: 'Upgraded payment gateway, implemented automatic refund system, improved financial monitoring',
    evidenceSubmitted: ['Payment System Upgrade Certificate', 'Refund Policy Document', 'Financial Audit Report'],
    status: 'approved',
    reviewedBy: 'Payment Operations Manager',
    reviewDate: '2024-06-26',
    reviewNotes: 'All requirements met, ready for reinstatement',
    conditions: ['95% payment success rate', '24-hour refund processing', 'Monthly payment reports'],
    monitoringPeriod: 60
  }
];
