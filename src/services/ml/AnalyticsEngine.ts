
import { mlService } from './MLService';

export interface MLInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'customer' | 'product' | 'sales' | 'marketing' | 'operations';
  recommendations: string[];
  data: any;
}

export interface CustomerInsight {
  userId: string;
  segment: string;
  segmentId: string;
  segmentName: string;
  size: number;
  clv: number;
  predictedLifetimeValue: number;
  churnRisk: number;
  preferences: string[];
  nextBestAction: string;
}

export interface CustomerSegment {
  segmentId: string;
  segmentName: string;
  size: number;
  predictedLifetimeValue: number;
  churnRisk: number;
  preferences: string[];
}

export class AnalyticsEngine {
  private insights: MLInsight[] = [];
  private customerProfiles: Map<string, CustomerInsight> = new Map();
  private realTimeEvents: Array<{
    type: string;
    userId?: string;
    timestamp: number;
    data: any;
  }> = [];

  async processRealTimeEvent(event: {
    type: string;
    userId?: string;
    timestamp: number;
    data: any;
  }): Promise<MLInsight[]> {
    console.log('ML Analytics: Processing real-time event:', event.type);
    
    this.realTimeEvents.push(event);
    
    // Generate insights based on event type
    const insights: MLInsight[] = [];
    
    switch (event.type) {
      case 'purchase':
        insights.push(...await this.analyzePurchaseBehavior(event));
        break;
      case 'product_view':
        insights.push(...await this.analyzeViewingBehavior(event));
        break;
      case 'search':
        insights.push(...await this.analyzeSearchBehavior(event));
        break;
      case 'cart_abandonment':
        insights.push(...await this.analyzeAbandonmentBehavior(event));
        break;
      case 'ml_background_analysis':
        insights.push(...await this.performBackgroundAnalysis());
        break;
    }
    
    // Store insights
    this.insights.push(...insights);
    
    // Update customer profiles if user event
    if (event.userId) {
      await this.updateCustomerProfile(event.userId, event);
    }
    
    return insights;
  }

  async generateBusinessInsights(): Promise<MLInsight[]> {
    console.log('ML Analytics: Generating business insights');
    
    const insights: MLInsight[] = [];
    
    // Revenue insights
    insights.push({
      id: 'revenue-trend-001',
      type: 'trend',
      title: 'Revenue Growth Detected',
      description: 'Monthly revenue increased by 18% compared to last month',
      confidence: 0.92,
      actionable: true,
      priority: 'high',
      category: 'sales',
      recommendations: ['Scale marketing efforts', 'Increase inventory for top products'],
      data: { growth: 0.18, period: 'monthly' }
    });

    // Customer behavior insights
    insights.push({
      id: 'customer-behavior-001',
      type: 'opportunity',
      title: 'High Cart Abandonment in Electronics',
      description: 'Electronics category shows 65% cart abandonment rate',
      confidence: 0.89,
      actionable: true,
      priority: 'medium',
      category: 'customer',
      recommendations: ['Implement exit-intent popups', 'Offer limited-time discounts'],
      data: { abandonmentRate: 0.65, category: 'Electronics' }
    });

    return insights;
  }

  async analyzeCustomerSegments(): Promise<CustomerSegment[]> {
    console.log('ML Analytics: Analyzing customer segments');
    
    return [
      {
        segmentId: 'premium-001',
        segmentName: 'Premium Customers',
        size: 1250,
        predictedLifetimeValue: 45000,
        churnRisk: 0.15,
        preferences: ['Electronics', 'Premium Brands', 'Fast Delivery']
      },
      {
        segmentId: 'regular-002',
        segmentName: 'Regular Shoppers',
        size: 8500,
        predictedLifetimeValue: 15000,
        churnRisk: 0.35,
        preferences: ['Fashion', 'Deals', 'Free Shipping']
      },
      {
        segmentId: 'occasional-003',
        segmentName: 'Occasional Buyers',
        size: 12000,
        predictedLifetimeValue: 5000,
        churnRisk: 0.65,
        preferences: ['Sale Items', 'Basic Products', 'Price Comparison']
      }
    ];
  }

  private async analyzePurchaseBehavior(event: any): Promise<MLInsight[]> {
    const insights: MLInsight[] = [];
    
    // Analyze purchase patterns
    const userPurchases = this.realTimeEvents
      .filter(e => e.type === 'purchase' && e.userId === event.userId)
      .slice(-10);
    
    if (userPurchases.length >= 3) {
      const avgOrderValue = userPurchases
        .reduce((sum, e) => sum + (e.data?.amount || 0), 0) / userPurchases.length;
      
      insights.push({
        id: `behavior-${Date.now()}`,
        type: 'customer_behavior',
        title: 'Repeat Customer Identified',
        description: `Customer showing consistent purchase behavior with avg order value: ৳${avgOrderValue.toFixed(0)}`,
        confidence: 0.9,
        actionable: true,
        priority: 'medium',
        category: 'customer',
        recommendations: ['Offer loyalty program', 'Send personalized offers'],
        data: { avgOrderValue, purchaseCount: userPurchases.length }
      });
    }
    
    // Check for high-value purchase
    if (event.data?.amount > 50000) {
      insights.push({
        id: `high-value-${Date.now()}`,
        type: 'high_value_transaction',
        title: 'High-Value Purchase Detected',
        description: 'Customer made a significant purchase, consider VIP treatment',
        confidence: 1.0,
        actionable: true,
        priority: 'high',
        category: 'customer',
        recommendations: ['Upgrade to VIP status', 'Offer premium support'],
        data: { amount: event.data.amount }
      });
    }
    
    return insights;
  }

  private async analyzeViewingBehavior(event: any): Promise<MLInsight[]> {
    const insights: MLInsight[] = [];
    
    const recentViews = this.realTimeEvents
      .filter(e => e.type === 'product_view' && e.userId === event.userId)
      .slice(-20);
    
    // Detect category preferences
    const categoryCount = recentViews.reduce((acc, e) => {
      const category = e.data?.category || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory && topCategory[1] >= 3) {
      insights.push({
        id: `category-affinity-${Date.now()}`,
        type: 'category_affinity',
        title: 'Category Preference Detected',
        description: `Strong interest in ${topCategory[0]} category`,
        confidence: 0.85,
        actionable: true,
        priority: 'medium',
        category: 'customer',
        recommendations: [`Show more ${topCategory[0]} products`, 'Send category-specific offers'],
        data: { category: topCategory[0], views: topCategory[1] }
      });
    }
    
    return insights;
  }

  private async analyzeSearchBehavior(event: any): Promise<MLInsight[]> {
    const insights: MLInsight[] = [];
    
    const recentSearches = this.realTimeEvents
      .filter(e => e.type === 'search' && e.userId === event.userId)
      .slice(-10);
    
    if (recentSearches.length >= 5) {
      insights.push({
        id: `search-pattern-${Date.now()}`,
        type: 'search_pattern',
        title: 'Active Search Behavior',
        description: 'User showing high search activity, may need assistance',
        confidence: 0.8,
        actionable: true,
        priority: 'medium',
        category: 'customer',
        recommendations: ['Offer chat support', 'Show guided shopping assistant'],
        data: { searchCount: recentSearches.length }
      });
    }
    
    return insights;
  }

  private async analyzeAbandonmentBehavior(event: any): Promise<MLInsight[]> {
    const insights: MLInsight[] = [];
    
    insights.push({
      id: `cart-abandonment-${Date.now()}`,
      type: 'cart_abandonment',
      title: 'Cart Abandonment Alert',
      description: 'Customer abandoned cart, immediate follow-up recommended',
      confidence: 1.0,
      actionable: true,
      priority: 'high',
      category: 'sales',
      recommendations: ['Send recovery email', 'Offer discount incentive'],
      data: { cartValue: event.data?.cartValue || 0 }
    });
    
    return insights;
  }

  private async performBackgroundAnalysis(): Promise<MLInsight[]> {
    const insights: MLInsight[] = [];
    
    // Analyze overall trends
    const recent24h = this.realTimeEvents
      .filter(e => e.timestamp > Date.now() - 24 * 60 * 60 * 1000);
    
    const eventsByType = recent24h.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Check for unusual patterns
    if (eventsByType.cart_abandonment > 10) {
      insights.push({
        id: `trend-analysis-${Date.now()}`,
        type: 'trend_analysis',
        title: 'High Cart Abandonment Rate',
        description: 'Unusually high cart abandonment in last 24h',
        confidence: 0.9,
        actionable: true,
        priority: 'high',
        category: 'sales',
        recommendations: ['Review checkout process', 'Check for technical issues'],
        data: { abandonmentCount: eventsByType.cart_abandonment }
      });
    }
    
    return insights;
  }

  public async analyzeCustomerBehavior(userId: string, data: any): Promise<CustomerInsight> {
    console.log('ML Analytics: Analyzing customer behavior for:', userId);
    
    const userEvents = this.realTimeEvents.filter(e => e.userId === userId);
    const purchases = userEvents.filter(e => e.type === 'purchase');
    const views = userEvents.filter(e => e.type === 'product_view');
    
    // Calculate CLV (simplified)
    const totalSpent = purchases.reduce((sum, e) => sum + (e.data?.amount || 0), 0);
    const clv = totalSpent * 1.5; // Simple multiplier
    
    // Calculate churn risk
    const daysSinceLastActivity = userEvents.length > 0 ? 
      Math.floor((Date.now() - Math.max(...userEvents.map(e => e.timestamp))) / (24 * 60 * 60 * 1000)) : 30;
    const churnRisk = Math.min(daysSinceLastActivity / 30, 1);
    
    // Determine segment
    let segment = 'new';
    let segmentName = 'New Customer';
    if (purchases.length >= 5) {
      segment = 'loyal';
      segmentName = 'Loyal Customer';
    } else if (totalSpent > 50000) {
      segment = 'high_value';
      segmentName = 'High Value Customer';
    } else if (purchases.length >= 2) {
      segment = 'regular';
      segmentName = 'Regular Customer';
    }
    
    // Extract preferences
    const categoryViews = views.reduce((acc, e) => {
      const category = e.data?.category || 'unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const preferences = Object.entries(categoryViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    // Determine next best action
    let nextBestAction = 'send_welcome_offer';
    if (churnRisk > 0.7) nextBestAction = 'retention_campaign';
    else if (segment === 'high_value') nextBestAction = 'vip_treatment';
    else if (views.length > purchases.length * 5) nextBestAction = 'purchase_incentive';
    
    const insight: CustomerInsight = {
      userId,
      segment,
      segmentId: `seg-${segment}`,
      segmentName,
      size: 1,
      clv,
      predictedLifetimeValue: clv,
      churnRisk,
      preferences,
      nextBestAction
    };
    
    this.customerProfiles.set(userId, insight);
    return insight;
  }

  private async updateCustomerProfile(userId: string, event: any): Promise<void> {
    await this.analyzeCustomerBehavior(userId, event.data);
  }

  public getInsights(filters?: {
    category?: string;
    priority?: string;
    limit?: number;
  }): MLInsight[] {
    let filtered = this.insights;
    
    if (filters?.category) {
      filtered = filtered.filter(i => i.category === filters.category);
    }
    
    if (filters?.priority) {
      filtered = filtered.filter(i => i.priority === filters.priority);
    }
    
    filtered = filtered.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    
    return filtered;
  }

  public getCustomerProfile(userId: string): CustomerInsight | undefined {
    return this.customerProfiles.get(userId);
  }

  public getPerformanceMetrics(): any {
    return {
      totalInsights: this.insights.length,
      customerProfiles: this.customerProfiles.size,
      realtimeEvents: this.realTimeEvents.length,
      insightsByCategory: this.insights.reduce((acc, insight) => {
        acc[insight.category] = (acc[insight.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const analyticsEngine = new AnalyticsEngine();
