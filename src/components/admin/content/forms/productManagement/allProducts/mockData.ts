
import { AllProductsData } from './types';

export const mockAllProductsData: AllProductsData = {
  overallStats: {
    totalProducts: 12467,
    activeProducts: 11890,
    inactiveProducts: 577,
    outOfStock: 234,
    lowStock: 89,
    totalRevenue: 8950000,
    totalProfit: 1790000,
    averageRating: 4.3,
    totalReviews: 45670
  },
  performanceMetrics: {
    conversionRate: 3.2,
    averageOrderValue: 285.50,
    returnRate: 2.8,
    customerSatisfaction: 4.4,
    inventoryTurnover: 8.5,
    profitMargin: 20.0,
    salesGrowth: 15.7,
    marketShare: 12.3
  },
  products: [
    {
      id: 'prod-001',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SAM-S24U-256-BLK',
      category: 'Electronics > Smartphones',
      vendor: 'Samsung Bangladesh',
      price: 134999,
      cost: 108000,
      stock: 45,
      sold: 234,
      revenue: 31589766,
      profit: 6309766,
      rating: 4.7,
      reviews: 189,
      images: ['/api/placeholder/300/300'],
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-20',
      tags: ['premium', 'flagship', 'ai-camera'],
      variants: [
        { id: 'v1', name: '256GB Black', sku: 'SAM-S24U-256-BLK', price: 134999, stock: 45, attributes: { color: 'Black', storage: '256GB' } },
        { id: 'v2', name: '512GB Titanium', sku: 'SAM-S24U-512-TIT', price: 149999, stock: 23, attributes: { color: 'Titanium', storage: '512GB' } }
      ]
    },
    {
      id: 'prod-002',
      name: 'iPhone 15 Pro Max',
      sku: 'APL-IP15PM-256-NBL',
      category: 'Electronics > Smartphones',
      vendor: 'Apple Authorized',
      price: 169999,
      cost: 136000,
      stock: 28,
      sold: 167,
      revenue: 28389833,
      profit: 5668833,
      rating: 4.8,
      reviews: 145,
      images: ['/api/placeholder/300/300'],
      status: 'active',
      createdAt: '2024-02-10',
      updatedAt: '2024-06-18',
      tags: ['premium', 'pro-camera', 'titanium'],
      variants: [
        { id: 'v3', name: '256GB Natural Blue', sku: 'APL-IP15PM-256-NBL', price: 169999, stock: 28, attributes: { color: 'Natural Blue', storage: '256GB' } }
      ]
    },
    {
      id: 'prod-003',
      name: 'MacBook Air M3 13"',
      sku: 'APL-MBA-M3-13-SLV',
      category: 'Electronics > Laptops',
      vendor: 'Apple Authorized',
      price: 149999,
      cost: 120000,
      stock: 15,
      sold: 89,
      revenue: 13349911,
      profit: 2669911,
      rating: 4.6,
      reviews: 78,
      images: ['/api/placeholder/300/300'],
      status: 'active',
      createdAt: '2024-03-05',
      updatedAt: '2024-06-15',
      tags: ['laptop', 'm3-chip', 'ultralight'],
      variants: [
        { id: 'v4', name: '8GB/256GB Silver', sku: 'APL-MBA-M3-13-SLV', price: 149999, stock: 15, attributes: { color: 'Silver', memory: '8GB', storage: '256GB' } }
      ]
    }
  ],
  inventoryData: {
    warehouseDistribution: [
      { warehouse: 'Main Warehouse Dhaka', location: 'Savar, Dhaka', totalItems: 8945, value: 12500000, utilization: 78.5 },
      { warehouse: 'Chittagong Hub', location: 'Chittagong', totalItems: 2890, value: 4200000, utilization: 65.2 },
      { warehouse: 'Sylhet Center', location: 'Sylhet', totalItems: 632, value: 890000, utilization: 45.8 }
    ],
    stockMovement: [
      { date: '2024-06-01', inbound: 450, outbound: 389, adjustments: -5, net: 56 },
      { date: '2024-06-02', inbound: 520, outbound: 445, adjustments: 2, net: 77 },
      { date: '2024-06-03', inbound: 380, outbound: 510, adjustments: -8, net: -138 }
    ],
    reorderAlerts: [
      { productId: 'prod-045', productName: 'Wireless Headphones Pro', currentStock: 8, reorderPoint: 25, suggestedOrder: 100, supplier: 'TechSound Ltd', urgency: 'high' },
      { productId: 'prod-067', productName: 'Gaming Mouse RGB', currentStock: 3, reorderPoint: 15, suggestedOrder: 75, supplier: 'GameTech Co', urgency: 'critical' }
    ],
    deadStock: [
      { productId: 'prod-123', productName: 'Vintage Phone Case', stock: 45, value: 22500, lastSold: '2024-02-15', daysInStock: 125, recommendation: 'Discount 40% or return to supplier' }
    ]
  },
  analytics: {
    salesTrends: [
      { date: '2024-06-01', sales: 145000, orders: 89, units: 234, revenue: 145000 },
      { date: '2024-06-02', sales: 167000, orders: 94, units: 267, revenue: 167000 },
      { date: '2024-06-03', sales: 134000, orders: 78, units: 198, revenue: 134000 }
    ],
    categoryPerformance: [
      { category: 'Electronics', products: 3456, revenue: 4500000, orders: 12890, avgRating: 4.3, growth: 18.5 },
      { category: 'Fashion', products: 5690, revenue: 2890000, orders: 18945, avgRating: 4.1, growth: 12.8 },
      { category: 'Home & Garden', products: 2890, revenue: 1560000, orders: 8945, avgRating: 4.2, growth: 8.9 }
    ],
    vendorPerformance: [
      { vendorId: 'v001', vendorName: 'TechWorld BD', products: 234, revenue: 890000, orders: 2890, rating: 4.5, performance: 92.3 },
      { vendorId: 'v002', vendorName: 'Fashion House', products: 567, revenue: 1200000, orders: 4567, rating: 4.2, performance: 87.8 }
    ],
    customerSegments: [
      { segment: 'Premium', customers: 1250, revenue: 2890000, avgOrderValue: 2312, frequency: 3.2 },
      { segment: 'Regular', customers: 8950, revenue: 4560000, avgOrderValue: 509, frequency: 2.1 }
    ],
    seasonalPatterns: [
      { period: 'Summer 2024', demand: 85, revenue: 2340000, topProducts: ['Air Conditioner', 'Summer Dress', 'Sunglasses'] }
    ]
  },
  lowStockAlerts: [
    { productId: 'prod-089', productName: 'Premium Bluetooth Speaker', sku: 'BT-SPK-001', currentStock: 5, minStock: 20, suggestedReorder: 50, vendor: 'AudioTech', priority: 'high', estimatedStockoutDate: '2024-06-30' },
    { productId: 'prod-134', productName: 'Smart Watch Series 5', sku: 'SW-S5-BLK', currentStock: 2, minStock: 15, suggestedReorder: 40, vendor: 'WearTech', priority: 'critical', estimatedStockoutDate: '2024-06-28' }
  ],
  topPerformers: [
    { productId: 'prod-001', productName: 'Samsung Galaxy S24 Ultra', category: 'Smartphones', revenue: 31589766, units: 234, growth: 25.8, rating: 4.7 },
    { productId: 'prod-002', productName: 'iPhone 15 Pro Max', category: 'Smartphones', revenue: 28389833, units: 167, growth: 18.9, rating: 4.8 }
  ],
  trends: [
    { date: '2024-01', totalProducts: 11890, activeProducts: 11234, newProducts: 456, discontinuedProducts: 23, revenue: 6780000, orders: 12890 },
    { date: '2024-02', totalProducts: 12123, activeProducts: 11456, newProducts: 567, discontinuedProducts: 34, revenue: 7120000, orders: 13456 },
    { date: '2024-03', totalProducts: 12289, activeProducts: 11678, newProducts: 489, discontinuedProducts: 28, revenue: 7450000, orders: 14123 },
    { date: '2024-04', totalProducts: 12356, activeProducts: 11789, newProducts: 423, discontinuedProducts: 31, revenue: 7890000, orders: 14678 },
    { date: '2024-05', totalProducts: 12423, activeProducts: 11834, newProducts: 398, discontinuedProducts: 25, revenue: 8230000, orders: 15234 },
    { date: '2024-06', totalProducts: 12467, activeProducts: 11890, newProducts: 445, discontinuedProducts: 22, revenue: 8950000, orders: 15890 }
  ],
  bulkActions: [
    { id: 'ba1', name: 'Update Prices', description: 'Bulk price updates with percentage or fixed amount', type: 'price_update', icon: '💰' },
    { id: 'ba2', name: 'Inventory Sync', description: 'Synchronize inventory across warehouses', type: 'inventory_update', icon: '📦' },
    { id: 'ba3', name: 'Status Change', description: 'Activate, deactivate, or discontinue products', type: 'status_change', icon: '🔄' },
    { id: 'ba4', name: 'Category Move', description: 'Move products to different categories', type: 'category_change', icon: '🏷️' }
  ],
  salesData: [
    { date: '2024-06-01', sales: 145000, orders: 89, units: 234, revenue: 145000 },
    { date: '2024-06-02', sales: 167000, orders: 94, units: 267, revenue: 167000 },
    { date: '2024-06-03', sales: 134000, orders: 78, units: 198, revenue: 134000 },
    { date: '2024-06-04', sales: 189000, orders: 102, units: 298, revenue: 189000 },
    { date: '2024-06-05', sales: 156000, orders: 87, units: 223, revenue: 156000 }
  ]
};
