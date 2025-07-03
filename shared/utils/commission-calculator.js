/**
 * Vendor Commission Calculator
 * GetIt Multi-Vendor Ecommerce Platform
 * 
 * Features:
 * - Dynamic commission rates based on vendor performance
 * - Category-specific commission structures
 * - Volume-based incentives
 * - Bangladesh tax considerations
 * - Performance bonuses and penalties
 * - Multi-tier commission structures
 */

import logger from './logger.js';
import { ERROR_TYPES, GetItError } from './error-handler.js';

// Commission structure constants
const COMMISSION_STRUCTURES = {
  // Default commission rates by category
  CATEGORY_RATES: {
    'electronics': { base: 12, premium: 8, bulk: 6 },
    'fashion': { base: 15, premium: 12, bulk: 10 },
    'home-garden': { base: 10, premium: 8, bulk: 6 },
    'health-beauty': { base: 18, premium: 15, bulk: 12 },
    'sports-outdoor': { base: 12, premium: 10, bulk: 8 },
    'books-education': { base: 20, premium: 15, bulk: 12 },
    'automobiles': { base: 8, premium: 6, bulk: 4 },
    'jewelry': { base: 25, premium: 20, bulk: 15 },
    'food-groceries': { base: 8, premium: 6, bulk: 4 },
    'baby-kids': { base: 15, premium: 12, bulk: 10 },
    'default': { base: 15, premium: 12, bulk: 10 }
  },

  // Vendor tier thresholds (monthly sales in BDT)
  VENDOR_TIERS: {
    'bronze': { min: 0, max: 50000, commission_multiplier: 1.0 },
    'silver': { min: 50001, max: 200000, commission_multiplier: 0.9 },
    'gold': { min: 200001, max: 500000, commission_multiplier: 0.8 },
    'platinum': { min: 500001, max: 1000000, commission_multiplier: 0.7 },
    'diamond': { min: 1000001, max: Infinity, commission_multiplier: 0.6 }
  },

  // Performance-based modifiers
  PERFORMANCE_MODIFIERS: {
    'rating': {
      '4.5-5.0': -0.5,   // 0.5% reduction for excellent rating
      '4.0-4.4': 0,      // No change for good rating
      '3.5-3.9': +0.5,   // 0.5% increase for average rating
      '3.0-3.4': +1.0,   // 1% increase for below average
      '0-2.9': +2.0      // 2% increase for poor rating
    },
    'return_rate': {
      '0-2': -0.3,       // Low return rate bonus
      '2-5': 0,          // Normal return rate
      '5-10': +0.5,      // High return rate penalty
      '10+': +1.0        // Very high return rate penalty
    },
    'delivery_time': {
      'same_day': -0.2,  // Same day delivery bonus
      '1_day': -0.1,     // Next day delivery bonus
      '2-3_days': 0,     // Standard delivery
      '4-7_days': +0.3,  // Slow delivery penalty
      '7+_days': +0.5    // Very slow delivery penalty
    }
  },

  // Volume-based discounts
  VOLUME_DISCOUNTS: {
    'monthly_sales': [
      { min: 0, max: 100000, discount: 0 },
      { min: 100001, max: 500000, discount: 0.5 },
      { min: 500001, max: 1000000, discount: 1.0 },
      { min: 1000001, max: 2000000, discount: 1.5 },
      { min: 2000001, max: Infinity, discount: 2.0 }
    ],
    'order_count': [
      { min: 0, max: 50, discount: 0 },
      { min: 51, max: 200, discount: 0.2 },
      { min: 201, max: 500, discount: 0.5 },
      { min: 501, max: Infinity, discount: 1.0 }
    ]
  }
};

// Bangladesh-specific tax and fee structure
const BANGLADESH_FEES = {
  // VAT on commission (15% as per Bangladesh VAT Act)
  VAT_RATE: 0.15,
  
  // Platform fees
  PLATFORM_FEES: {
    'payment_processing': 0.02,    // 2% payment processing fee
    'customer_support': 0.005,    // 0.5% customer support fee
    'marketing': 0.01,            // 1% marketing fee
    'logistics_support': 0.015    // 1.5% logistics support fee
  },
  
  // Regulatory fees
  REGULATORY_FEES: {
    'bangladesh_bank_fee': 0.001, // 0.1% Bangladesh Bank fee for digital payments
    'bida_fee': 0.0005,          // 0.05% BIDA fee for digital commerce
    'ict_division_fee': 0.0002   // 0.02% ICT Division fee
  },
  
  // Penalty rates
  PENALTY_RATES: {
    'late_delivery': 0.5,        // 0.5% penalty for late delivery
    'quality_issues': 1.0,       // 1% penalty for quality issues
    'customer_complaints': 0.3,   // 0.3% penalty per complaint
    'policy_violations': 2.0     // 2% penalty for policy violations
  }
};

class CommissionCalculator {
  constructor() {
    this.cache = new Map();
    this.performanceCache = new Map();
  }

  // Main commission calculation method
  async calculateCommission(orderData, vendorData, categoryData = null) {
    try {
      // Validate input data
      this.validateInputData(orderData, vendorData);

      // Get base commission rate
      const baseRate = this.getBaseCommissionRate(orderData.category, vendorData.vendor_type);

      // Apply vendor tier modifier
      const tierModifier = this.getVendorTierModifier(vendorData.monthly_sales, vendorData.tier);

      // Apply performance modifiers
      const performanceModifier = await this.getPerformanceModifiers(vendorData);

      // Apply volume discounts
      const volumeDiscount = this.getVolumeDiscount(vendorData.monthly_sales, vendorData.monthly_orders);

      // Calculate gross commission
      const grossCommission = this.calculateGrossCommission(
        orderData.subtotal,
        baseRate,
        tierModifier,
        performanceModifier,
        volumeDiscount
      );

      // Calculate platform fees
      const platformFees = this.calculatePlatformFees(orderData.subtotal);

      // Calculate regulatory fees
      const regulatoryFees = this.calculateRegulatoryFees(orderData.subtotal);

      // Calculate VAT
      const vatAmount = this.calculateVAT(grossCommission);

      // Apply penalties if any
      const penalties = this.calculatePenalties(vendorData, orderData);

      // Calculate net commission
      const netCommission = grossCommission - platformFees - regulatoryFees - vatAmount - penalties;

      // Prepare detailed breakdown
      const commissionBreakdown = {
        order_id: orderData.order_id,
        vendor_id: vendorData.vendor_id,
        calculation_date: new Date().toISOString(),
        
        // Input values
        subtotal: orderData.subtotal,
        category: orderData.category,
        vendor_tier: vendorData.tier,
        
        // Commission calculation
        base_rate: baseRate,
        tier_modifier: tierModifier,
        performance_modifier: performanceModifier,
        volume_discount: volumeDiscount,
        
        // Commission amounts
        gross_commission: grossCommission,
        platform_fees: platformFees,
        regulatory_fees: regulatoryFees,
        vat_amount: vatAmount,
        penalties: penalties,
        net_commission: netCommission,
        
        // Additional details
        commission_percentage: (netCommission / orderData.subtotal) * 100,
        fees_breakdown: this.getFeesBreakdown(orderData.subtotal),
        performance_breakdown: performanceModifier,
        
        // Bangladesh-specific information
        bangladesh_compliance: {
          vat_rate: BANGLADESH_FEES.VAT_RATE,
          regulatory_compliant: true,
          currency: 'BDT',
          tax_year: new Date().getFullYear()
        }
      };

      // Log commission calculation
      logger.logBusinessEvent('COMMISSION_CALCULATED', commissionBreakdown, null, vendorData.vendor_id);

      return commissionBreakdown;

    } catch (error) {
      logger.logError(error, { orderData, vendorData });
      throw new GetItError(ERROR_TYPES.COMMISSION_CALCULATION_ERROR, { originalError: error.message });
    }
  }

  // Validate input data
  validateInputData(orderData, vendorData) {
    const requiredOrderFields = ['order_id', 'subtotal', 'category'];
    const requiredVendorFields = ['vendor_id', 'tier', 'monthly_sales'];

    for (const field of requiredOrderFields) {
      if (!orderData[field] && orderData[field] !== 0) {
        throw new GetItError(ERROR_TYPES.VALIDATION_REQUIRED_FIELD, { field, type: 'order' });
      }
    }

    for (const field of requiredVendorFields) {
      if (!vendorData[field] && vendorData[field] !== 0) {
        throw new GetItError(ERROR_TYPES.VALIDATION_REQUIRED_FIELD, { field, type: 'vendor' });
      }
    }

    if (orderData.subtotal <= 0) {
      throw new GetItError(ERROR_TYPES.VALIDATION_INVALID_FORMAT, { field: 'subtotal', value: orderData.subtotal });
    }
  }

  // Get base commission rate based on category
  getBaseCommissionRate(category, vendorType = 'base') {
    const categoryRates = COMMISSION_STRUCTURES.CATEGORY_RATES[category] || 
                         COMMISSION_STRUCTURES.CATEGORY_RATES.default;
    
    return categoryRates[vendorType] || categoryRates.base;
  }

  // Get vendor tier modifier
  getVendorTierModifier(monthlySales, currentTier) {
    // Auto-calculate tier based on sales if not provided or incorrect
    const calculatedTier = this.calculateVendorTier(monthlySales);
    const tierToUse = currentTier || calculatedTier;
    
    const tierData = COMMISSION_STRUCTURES.VENDOR_TIERS[tierToUse];
    return tierData ? tierData.commission_multiplier : 1.0;
  }

  // Calculate vendor tier based on monthly sales
  calculateVendorTier(monthlySales) {
    for (const [tier, data] of Object.entries(COMMISSION_STRUCTURES.VENDOR_TIERS)) {
      if (monthlySales >= data.min && monthlySales <= data.max) {
        return tier;
      }
    }
    return 'bronze'; // Default tier
  }

  // Get performance modifiers
  async getPerformanceModifiers(vendorData) {
    const cacheKey = `perf_${vendorData.vendor_id}_${Date.now()}`;
    
    if (this.performanceCache.has(cacheKey)) {
      return this.performanceCache.get(cacheKey);
    }

    let totalModifier = 0;
    const breakdown = {};

    // Rating modifier
    const ratingModifier = this.getRatingModifier(vendorData.rating || 4.0);
    totalModifier += ratingModifier;
    breakdown.rating = { value: vendorData.rating, modifier: ratingModifier };

    // Return rate modifier
    const returnModifier = this.getReturnRateModifier(vendorData.return_rate || 2);
    totalModifier += returnModifier;
    breakdown.return_rate = { value: vendorData.return_rate, modifier: returnModifier };

    // Delivery time modifier
    const deliveryModifier = this.getDeliveryTimeModifier(vendorData.avg_delivery_time || '2-3_days');
    totalModifier += deliveryModifier;
    breakdown.delivery_time = { value: vendorData.avg_delivery_time, modifier: deliveryModifier };

    const result = { total: totalModifier, breakdown };
    
    // Cache for 1 hour
    this.performanceCache.set(cacheKey, result);
    setTimeout(() => this.performanceCache.delete(cacheKey), 3600000);

    return result;
  }

  // Get rating-based modifier
  getRatingModifier(rating) {
    const ratingRanges = COMMISSION_STRUCTURES.PERFORMANCE_MODIFIERS.rating;
    
    if (rating >= 4.5) return ratingRanges['4.5-5.0'];
    if (rating >= 4.0) return ratingRanges['4.0-4.4'];
    if (rating >= 3.5) return ratingRanges['3.5-3.9'];
    if (rating >= 3.0) return ratingRanges['3.0-3.4'];
    return ratingRanges['0-2.9'];
  }

  // Get return rate modifier
  getReturnRateModifier(returnRate) {
    const returnRanges = COMMISSION_STRUCTURES.PERFORMANCE_MODIFIERS.return_rate;
    
    if (returnRate <= 2) return returnRanges['0-2'];
    if (returnRate <= 5) return returnRanges['2-5'];
    if (returnRate <= 10) return returnRanges['5-10'];
    return returnRanges['10+'];
  }

  // Get delivery time modifier
  getDeliveryTimeModifier(deliveryTime) {
    const deliveryModifiers = COMMISSION_STRUCTURES.PERFORMANCE_MODIFIERS.delivery_time;
    return deliveryModifiers[deliveryTime] || 0;
  }

  // Get volume discount
  getVolumeDiscount(monthlySales, monthlyOrders) {
    let salesDiscount = 0;
    let ordersDiscount = 0;

    // Sales volume discount
    for (const range of COMMISSION_STRUCTURES.VOLUME_DISCOUNTS.monthly_sales) {
      if (monthlySales >= range.min && monthlySales <= range.max) {
        salesDiscount = range.discount;
        break;
      }
    }

    // Order count discount
    for (const range of COMMISSION_STRUCTURES.VOLUME_DISCOUNTS.order_count) {
      if (monthlyOrders >= range.min && monthlyOrders <= range.max) {
        ordersDiscount = range.discount;
        break;
      }
    }

    return Math.max(salesDiscount, ordersDiscount); // Take the better discount
  }

  // Calculate gross commission
  calculateGrossCommission(subtotal, baseRate, tierModifier, performanceModifier, volumeDiscount) {
    // Apply tier modifier to base rate
    const adjustedRate = baseRate * tierModifier;
    
    // Apply performance modifier
    const performanceAdjustedRate = adjustedRate + (performanceModifier.total || 0);
    
    // Apply volume discount
    const finalRate = Math.max(0, performanceAdjustedRate - volumeDiscount);
    
    return (subtotal * finalRate) / 100;
  }

  // Calculate platform fees
  calculatePlatformFees(subtotal) {
    let totalFees = 0;
    
    for (const [feeType, rate] of Object.entries(BANGLADESH_FEES.PLATFORM_FEES)) {
      totalFees += subtotal * rate;
    }
    
    return totalFees;
  }

  // Calculate regulatory fees
  calculateRegulatoryFees(subtotal) {
    let totalFees = 0;
    
    for (const [feeType, rate] of Object.entries(BANGLADESH_FEES.REGULATORY_FEES)) {
      totalFees += subtotal * rate;
    }
    
    return totalFees;
  }

  // Calculate VAT on commission
  calculateVAT(grossCommission) {
    return grossCommission * BANGLADESH_FEES.VAT_RATE;
  }

  // Calculate penalties
  calculatePenalties(vendorData, orderData) {
    let totalPenalties = 0;
    
    // Late delivery penalty
    if (vendorData.late_deliveries_count > 0) {
      totalPenalties += orderData.subtotal * BANGLADESH_FEES.PENALTY_RATES.late_delivery * vendorData.late_deliveries_count;
    }
    
    // Quality issues penalty
    if (vendorData.quality_complaints_count > 0) {
      totalPenalties += orderData.subtotal * BANGLADESH_FEES.PENALTY_RATES.quality_issues * vendorData.quality_complaints_count;
    }
    
    // Customer complaints penalty
    if (vendorData.customer_complaints_count > 0) {
      totalPenalties += orderData.subtotal * BANGLADESH_FEES.PENALTY_RATES.customer_complaints * vendorData.customer_complaints_count;
    }
    
    // Policy violations penalty
    if (vendorData.policy_violations_count > 0) {
      totalPenalties += orderData.subtotal * BANGLADESH_FEES.PENALTY_RATES.policy_violations * vendorData.policy_violations_count;
    }
    
    return totalPenalties;
  }

  // Get detailed fees breakdown
  getFeesBreakdown(subtotal) {
    const breakdown = {
      platform_fees: {},
      regulatory_fees: {},
      total_platform_fees: 0,
      total_regulatory_fees: 0
    };

    // Platform fees breakdown
    for (const [feeType, rate] of Object.entries(BANGLADESH_FEES.PLATFORM_FEES)) {
      const amount = subtotal * rate;
      breakdown.platform_fees[feeType] = { rate, amount };
      breakdown.total_platform_fees += amount;
    }

    // Regulatory fees breakdown
    for (const [feeType, rate] of Object.entries(BANGLADESH_FEES.REGULATORY_FEES)) {
      const amount = subtotal * rate;
      breakdown.regulatory_fees[feeType] = { rate, amount };
      breakdown.total_regulatory_fees += amount;
    }

    return breakdown;
  }

  // Calculate commission for bulk orders
  async calculateBulkCommission(orders, vendorData) {
    const results = {
      total_orders: orders.length,
      total_commission: 0,
      total_fees: 0,
      total_vat: 0,
      orders: []
    };

    for (const order of orders) {
      const commission = await this.calculateCommission(order, vendorData);
      results.orders.push(commission);
      results.total_commission += commission.net_commission;
      results.total_fees += commission.platform_fees + commission.regulatory_fees;
      results.total_vat += commission.vat_amount;
    }

    // Apply bulk discount if applicable
    if (orders.length >= 10) {
      const bulkDiscount = Math.min(orders.length * 0.1, 5); // Max 5% bulk discount
      const discountAmount = results.total_commission * (bulkDiscount / 100);
      results.bulk_discount_percentage = bulkDiscount;
      results.bulk_discount_amount = discountAmount;
      results.total_commission -= discountAmount;
    }

    return results;
  }

  // Get commission analytics for vendor
  getVendorCommissionAnalytics(vendorId, timeRange = '30d') {
    // This would typically query the database for historical commission data
    // For now, returning a template structure
    return {
      vendor_id: vendorId,
      time_range: timeRange,
      total_commission: 0,
      average_commission_rate: 0,
      total_orders: 0,
      commission_trend: [],
      top_categories: [],
      performance_metrics: {
        rating: 0,
        return_rate: 0,
        delivery_performance: 0
      },
      recommendations: []
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.performanceCache.clear();
  }
}

// Create singleton instance
const commissionCalculator = new CommissionCalculator();

// Export utility functions for direct use
export const calculateOrderCommission = (orderData, vendorData) => {
  return commissionCalculator.calculateCommission(orderData, vendorData);
};

export const getCommissionRate = (category, vendorType = 'base') => {
  return commissionCalculator.getBaseCommissionRate(category, vendorType);
};

export const calculateVendorTier = (monthlySales) => {
  return commissionCalculator.calculateVendorTier(monthlySales);
};

export default commissionCalculator;
export { CommissionCalculator, COMMISSION_STRUCTURES, BANGLADESH_FEES };