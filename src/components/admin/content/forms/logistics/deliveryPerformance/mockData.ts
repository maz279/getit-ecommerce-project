
import { DeliveryPerformanceData } from './types';

export const mockPerformanceData: DeliveryPerformanceData = {
  stats: {
    onTimeDeliveryRate: 94.2,
    averageDeliveryTime: 2.3,
    customerSatisfaction: 4.6,
    totalDeliveries: 15420,
    failedDeliveries: 89,
    returnRate: 2.1,
    costPerDelivery: 85,
    revenueImpact: 1250000
  },
  courierPerformance: [
    {
      id: 'pathao',
      name: 'Pathao Courier',
      logo: '🛵',
      onTimeRate: 96.5,
      averageTime: 1.8,
      totalDeliveries: 5420,
      customerRating: 4.7,
      costPerDelivery: 75,
      coverage: ['Dhaka', 'Chittagong', 'Sylhet'],
      strengths: ['Fast delivery in Dhaka', 'Real-time tracking', 'Good customer service'],
      weaknesses: ['Limited rural coverage', 'Higher cost'],
      status: 'active'
    },
    {
      id: 'paperfly',
      name: 'Paperfly',
      logo: '✈️',
      onTimeRate: 93.2,
      averageTime: 2.1,
      totalDeliveries: 4850,
      customerRating: 4.5,
      costPerDelivery: 70,
      coverage: ['Dhaka', 'Chittagong', 'Rajshahi'],
      strengths: ['Wide network', 'Affordable pricing', 'Good packaging'],
      weaknesses: ['Slower in peak hours', 'Limited weekend service'],
      status: 'active'
    },
    {
      id: 'sundarban',
      name: 'Sundarban Courier',
      logo: '🚛',
      onTimeRate: 91.8,
      averageTime: 2.8,
      totalDeliveries: 3420,
      customerRating: 4.3,
      costPerDelivery: 65,
      coverage: ['Dhaka', 'Khulna', 'Barisal'],
      strengths: ['Rural coverage', 'Bulk delivery', 'Cost effective'],
      weaknesses: ['Slower delivery', 'Limited tracking'],
      status: 'active'
    },
    {
      id: 'redx',
      name: 'RedX',
      logo: '🔴',
      onTimeRate: 89.5,
      averageTime: 3.2,
      totalDeliveries: 1730,
      customerRating: 4.1,
      costPerDelivery: 80,
      coverage: ['Dhaka', 'Chittagong'],
      strengths: ['Same day delivery', 'Tech-enabled', 'Young team'],
      weaknesses: ['Limited experience', 'Coverage gaps'],
      status: 'active'
    }
  ],
  regionalPerformance: [
    {
      region: 'Dhaka Division',
      district: 'Dhaka',
      onTimeRate: 96.8,
      averageTime: 1.5,
      totalDeliveries: 8420,
      challenges: ['Traffic congestion', 'Peak hour delays'],
      improvements: ['More delivery hubs', 'Route optimization'],
      trend: 'improving'
    },
    {
      region: 'Chittagong Division',
      district: 'Chittagong',
      onTimeRate: 92.3,
      averageTime: 2.8,
      totalDeliveries: 3250,
      challenges: ['Port area access', 'Weather delays'],
      improvements: ['Weather contingency', 'Port partnerships'],
      trend: 'stable'
    },
    {
      region: 'Sylhet Division',
      district: 'Sylhet',
      onTimeRate: 88.7,
      averageTime: 3.5,
      totalDeliveries: 1850,
      challenges: ['Remote locations', 'Infrastructure'],
      improvements: ['Local partnerships', 'Hub expansion'],
      trend: 'improving'
    },
    {
      region: 'Rajshahi Division',
      district: 'Rajshahi',
      onTimeRate: 90.1,
      averageTime: 3.1,
      totalDeliveries: 1900,
      challenges: ['Seasonal variations', 'Rural access'],
      improvements: ['Weather planning', 'Rural network'],
      trend: 'declining'
    }
  ],
  timeAnalysis: [
    { hour: 9, day: 'Monday', deliveries: 520, onTimeRate: 95.2, averageTime: 2.1, peak: true },
    { hour: 14, day: 'Monday', deliveries: 680, onTimeRate: 92.8, averageTime: 2.5, peak: true },
    { hour: 18, day: 'Monday', deliveries: 450, onTimeRate: 88.5, averageTime: 3.2, peak: false },
    { hour: 10, day: 'Tuesday', deliveries: 580, onTimeRate: 94.1, averageTime: 2.2, peak: true },
    { hour: 15, day: 'Wednesday', deliveries: 720, onTimeRate: 91.5, averageTime: 2.8, peak: true },
    { hour: 11, day: 'Thursday', deliveries: 650, onTimeRate: 93.7, averageTime: 2.3, peak: true },
    { hour: 16, day: 'Friday', deliveries: 580, onTimeRate: 89.2, averageTime: 3.1, peak: false },
    { hour: 12, day: 'Saturday', deliveries: 420, onTimeRate: 96.8, averageTime: 1.8, peak: false }
  ],
  customerSatisfaction: {
    rating: 4.6,
    totalReviews: 12540,
    positiveReviews: 10850,
    negativeReviews: 1690,
    commonComplaints: [
      'Late delivery during monsoon',
      'Package handling issues',
      'Limited delivery time slots',
      'Difficulty in tracking'
    ],
    improvements: [
      'Better packaging',
      'More delivery windows',
      'Enhanced tracking',
      'Weather contingency plans'
    ],
    trendData: [
      { date: '2024-01', rating: 4.2, reviews: 1200 },
      { date: '2024-02', rating: 4.3, reviews: 1350 },
      { date: '2024-03', rating: 4.4, reviews: 1420 },
      { date: '2024-04', rating: 4.5, reviews: 1580 },
      { date: '2024-05', rating: 4.6, reviews: 1680 },
      { date: '2024-06', rating: 4.6, reviews: 1750 }
    ]
  },
  benchmarking: [
    {
      metric: 'On-time Delivery Rate',
      ourPerformance: 94.2,
      industryAverage: 89.5,
      bestInClass: 97.8,
      competitorA: 91.2,
      competitorB: 88.9,
      trend: 'up',
      unit: '%'
    },
    {
      metric: 'Average Delivery Time',
      ourPerformance: 2.3,
      industryAverage: 3.1,
      bestInClass: 1.8,
      competitorA: 2.8,
      competitorB: 3.5,
      trend: 'down',
      unit: 'days'
    },
    {
      metric: 'Customer Satisfaction',
      ourPerformance: 4.6,
      industryAverage: 4.2,
      bestInClass: 4.8,
      competitorA: 4.3,
      competitorB: 4.1,
      trend: 'up',
      unit: '/5'
    },
    {
      metric: 'Cost per Delivery',
      ourPerformance: 85,
      industryAverage: 95,
      bestInClass: 70,
      competitorA: 90,
      competitorB: 105,
      trend: 'stable',
      unit: 'BDT'
    }
  ]
};
