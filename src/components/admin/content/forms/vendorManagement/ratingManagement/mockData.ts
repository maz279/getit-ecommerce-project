
export const mockRatingStats = {
  totalReviews: 45678,
  averageRating: 4.3,
  pendingModeration: 234,
  flaggedReviews: 12,
  verifiedReviews: 38942,
  fakeReviewsDetected: 156,
  disputesResolved: 89,
  activeDisputes: 23,
  ratingDistribution: {
    5: 18234,
    4: 12456,
    3: 8967,
    2: 3456,
    1: 2565
  },
  monthlyTrends: [
    { month: 'Jan', reviews: 3456, rating: 4.2 },
    { month: 'Feb', reviews: 3789, rating: 4.1 },
    { month: 'Mar', reviews: 4123, rating: 4.3 },
    { month: 'Apr', reviews: 3967, rating: 4.4 },
    { month: 'May', reviews: 4234, rating: 4.3 },
    { month: 'Jun', reviews: 4567, rating: 4.5 }
  ]
};

export const mockVendorRatings = [
  {
    id: '1',
    vendorName: 'TechGear Solutions',
    overallRating: 4.8,
    totalReviews: 1234,
    productQuality: 4.9,
    deliverySpeed: 4.7,
    customerService: 4.8,
    communication: 4.6,
    status: 'Excellent',
    trend: 'up'
  },
  {
    id: '2',
    vendorName: 'Fashion Forward BD',
    overallRating: 4.2,
    totalReviews: 856,
    productQuality: 4.3,
    deliverySpeed: 4.1,
    customerService: 4.2,
    communication: 4.0,
    status: 'Good',
    trend: 'stable'
  },
  {
    id: '3',
    vendorName: 'Home Essentials',
    overallRating: 3.8,
    totalReviews: 567,
    productQuality: 3.9,
    deliverySpeed: 3.7,
    customerService: 3.8,
    communication: 3.6,
    status: 'Average',
    trend: 'down'
  }
];

export const mockRecentReviews = [
  {
    id: '1',
    customerName: 'Rashid Ahmed',
    vendorName: 'TechGear Solutions',
    productName: 'Wireless Bluetooth Headphones',
    rating: 5,
    reviewText: 'Excellent product quality and fast delivery. Highly recommended!',
    date: '2024-01-15',
    status: 'approved',
    isVerified: true,
    helpful: 23,
    reported: 0
  },
  {
    id: '2',
    customerName: 'Fatima Khan',
    vendorName: 'Fashion Forward BD',
    productName: 'Cotton Summer Dress',
    rating: 4,
    reviewText: 'Good quality fabric but delivery was slightly delayed.',
    date: '2024-01-14',
    status: 'pending',
    isVerified: true,
    helpful: 12,
    reported: 1
  },
  {
    id: '3',
    customerName: 'Mohammad Rahman',
    vendorName: 'Home Essentials',
    productName: 'Kitchen Utensil Set',
    rating: 2,
    reviewText: 'Product quality is below expectations. Several items were damaged.',
    date: '2024-01-13',
    status: 'flagged',
    isVerified: false,
    helpful: 8,
    reported: 3
  }
];

export const mockDisputes = [
  {
    id: '1',
    reviewId: 'REV-001',
    vendorName: 'Fashion Forward BD',
    customerName: 'Rashid Ahmed',
    disputeReason: 'Fake Review Claim',
    status: 'under-review',
    submittedDate: '2024-01-12',
    priority: 'high'
  },
  {
    id: '2',
    reviewId: 'REV-002',
    vendorName: 'Home Essentials',
    customerName: 'Fatima Khan',
    disputeReason: 'Inappropriate Content',
    status: 'resolved',
    submittedDate: '2024-01-10',
    priority: 'medium'
  }
];
