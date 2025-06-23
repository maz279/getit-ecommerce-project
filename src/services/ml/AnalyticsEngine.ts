
import { mlService } from './MLService';

export interface MLInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'customer' | 'product' | 'sales' | 'marketing' | 'operations';
  data: any;
}

export interface CustomerInsight {
  userId: string;
  segment: string;
  clv: number;
  churnRisk: number;
  preferences: string[];
  nextBestAction: string;
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
    data?: any;
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
        type: 'customer_behavior',
        title: 'Repeat Customer Identified',
        description: `Customer showing consistent purchase behavior with avg order value: ৳${avgOrderValue.toFixed(0)}`,
        confidence: 0.9,
        actionable: true,
        priority: 'medium',
        category: 'customer',
        data: { avgOrderValue, purchaseCount: userPurchases.length }
      });
    }
    
    // Check for high-value purchase
    if (event.data?.amount > 50000) {
      insights.push({
        type: 'high_value_transaction',
        title: 'High-Value Purchase Detected',
        description: 'Customer made a significant purchase, consider VIP treatment',
        confidence: 1.0,
        actionable: true,
        priority: 'high',
        category: 'customer',
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
        type: 'category_affinity',
        title: 'Category Preference Detected',
        description: `Strong interest in ${topCategory[0]} category`,
        confidence: 0.85,
        actionable: true,
        priority: 'medium',
        category: 'customer',
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
        type: 'search_pattern',
        title: 'Active Search Behavior',
        description: 'User showing high search activity, may need assistance',
        confidence: 0.8,
        actionable: true,
        priority: 'medium',
        category: 'customer',
        data: { searchCount: recentSearches.length }
      });
    }
    
    return insights;
  }

  private async analyzeAbandonmentBehavior(event: any): Promise<MLInsight[]> {
    const insights: MLInsight[] = [];
    
    insights.push({
      type: 'cart_abandonment',
      title: 'Cart Abandonment Alert',
      description: 'Customer abandoned cart, immediate follow-up recommended',
      confidence: 1.0,
      actionable: true,
      priority: 'high',
      category: 'sales',
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
        type: 'trend_analysis',
        title: 'High Cart Abandonment Rate',
        description: 'Unusually high cart abandonment in last 24h',
        confidence: 0.9,
        actionable: true,
        priority: 'high',
        category: 'sales',
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
    if (purchases.length >= 5) segment = 'loyal';
    else if (totalSpent > 50000) segment = 'high_value';
    else if (purchases.length >= 2) segment = 'regular';
    
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
      clv,
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
