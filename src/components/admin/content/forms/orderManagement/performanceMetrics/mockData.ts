
import { PerformanceMetricsData } from './types';

export const mockPerformanceMetricsData: PerformanceMetricsData = {
  processingMetrics: {
    avgProcessingTime: 4.2,
    pickingAccuracy: 98.5,
    packingEfficiency: 94.2,
    shippingSpeed: 12.5,
    orderFulfillmentRate: 96.8,
    onTimeDeliveryRate: 89.3,
    customerSatisfactionScore: 4.6,
    returnRate: 3.2
  },
  operationalKPIs: {
    orderVelocity: 850,
    warehouseUtilization: 78.5,
    staffProductivity: 92.3,
    costPerOrder: 45.80,
    revenuePerOrder: 285.50,
    profitMargin: 18.7,
    inventoryTurnover: 8.2,
    stockoutRate: 2.1
  },
  qualityMetrics: {
    orderAccuracy: 97.8,
    damagedItemsRate: 0.8,
    customerComplaintRate: 1.2,
    qualityScore: 4.7,
    defectRate: 0.5,
    reworkRate: 2.3,
    firstCallResolution: 85.6,
    issueResolutionTime: 24.5
  },
  complianceMetrics: {
    regulatoryCompliance: 98.9,
    safetyIncidents: 0,
    auditScore: 94.5,
    documentationAccuracy: 96.7,
    policyAdherence: 97.2,
    trainingCompletion: 89.4,
    certificationStatus: 100,
    riskScore: 15.2
  },
  trends: [
    { date: '2024-01', processing: 92, fulfillment: 94, delivery: 88, satisfaction: 4.4, quality: 96, compliance: 97 },
    { date: '2024-02', processing: 93, fulfillment: 95, delivery: 89, satisfaction: 4.5, quality: 97, compliance: 98 },
    { date: '2024-03', processing: 94, fulfillment: 96, delivery: 90, satisfaction: 4.5, quality: 97, compliance: 98 },
    { date: '2024-04', processing: 95, fulfillment: 97, delivery: 89, satisfaction: 4.6, quality: 98, compliance: 99 },
    { date: '2024-05', processing: 96, fulfillment: 97, delivery: 89, satisfaction: 4.6, quality: 98, compliance: 99 },
    { date: '2024-06', processing: 97, fulfillment: 97, delivery: 89, satisfaction: 4.6, quality: 98, compliance: 99 }
  ],
  benchmarks: [
    { metric: 'Order Fulfillment Rate', ourValue: 96.8, industryAverage: 93.5, topPerformer: 98.2, target: 97.5, gap: 0.7 },
    { metric: 'On-Time Delivery', ourValue: 89.3, industryAverage: 87.2, topPerformer: 94.5, target: 92.0, gap: 2.7 },
    { metric: 'Customer Satisfaction', ourValue: 4.6, industryAverage: 4.3, topPerformer: 4.8, target: 4.7, gap: 0.1 },
    { metric: 'Order Accuracy', ourValue: 97.8, industryAverage: 95.2, topPerformer: 99.1, target: 98.5, gap: 0.7 },
    { metric: 'Processing Time (hrs)', ourValue: 4.2, industryAverage: 6.8, topPerformer: 3.1, target: 3.5, gap: -0.7 },
    { metric: 'Cost Per Order', ourValue: 45.80, industryAverage: 52.30, topPerformer: 38.90, target: 42.00, gap: -3.80 }
  ],
  teamPerformance: [
    {
      teamId: 'T001',
      teamName: 'Order Processing Alpha',
      manager: 'Sarah Ahmed',
      memberCount: 12,
      avgProductivity: 94.5,
      qualityScore: 4.7,
      customerRating: 4.6,
      ordersProcessed: 2850,
      errorRate: 1.2,
      efficiency: 96.3
    },
    {
      teamId: 'T002',
      teamName: 'Fulfillment Beta',
      manager: 'Md. Rafiq Hassan',
      memberCount: 15,
      avgProductivity: 91.8,
      qualityScore: 4.5,
      customerRating: 4.4,
      ordersProcessed: 3200,
      errorRate: 2.1,
      efficiency: 93.7
    },
    {
      teamId: 'T003',
      teamName: 'Quality Control Gamma',
      manager: 'Fatima Khatun',
      memberCount: 8,
      avgProductivity: 97.2,
      qualityScore: 4.8,
      customerRating: 4.7,
      ordersProcessed: 1950,
      errorRate: 0.8,
      efficiency: 98.1
    },
    {
      teamId: 'T004',
      teamName: 'Customer Service Delta',
      manager: 'Aminul Islam',
      memberCount: 10,
      avgProductivity: 89.3,
      qualityScore: 4.4,
      customerRating: 4.5,
      ordersProcessed: 1680,
      errorRate: 2.8,
      efficiency: 91.2
    }
  ],
  alerts: [
    {
      id: 'A001',
      type: 'critical',
      metric: 'On-Time Delivery Rate',
      message: 'Delivery performance below target for 3 consecutive days',
      threshold: 90,
      currentValue: 87.5,
      timestamp: '2024-06-26T10:30:00Z',
      status: 'active'
    },
    {
      id: 'A002',
      type: 'warning',
      metric: 'Warehouse Utilization',
      message: 'Warehouse capacity approaching limit',
      threshold: 85,
      currentValue: 83.2,
      timestamp: '2024-06-26T09:15:00Z',
      status: 'acknowledged'
    },
    {
      id: 'A003',
      type: 'info',
      metric: 'Staff Productivity',
      message: 'Team Alpha exceeded productivity target',
      threshold: 95,
      currentValue: 97.3,
      timestamp: '2024-06-26T08:45:00Z',
      status: 'resolved'
    }
  ]
};
