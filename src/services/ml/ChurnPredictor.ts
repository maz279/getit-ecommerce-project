
export interface ChurnPrediction {
  userId: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timeToChurn: number; // days
  churnFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  retentionStrategies: Array<{
    strategy: string;
    priority: number;
    expectedImpact: number;
    description: string;
  }>;
  confidence: number;
}

export interface EngagementPrediction {
  userId: string;
  featureEngagement: {
    wishlist: number;
    reviews: number;
    socialSharing: number;
    referrals: number;
    premiumFeatures: number;
  };
  overallEngagement: number;
  recommendedFeatures: string[];
  engagementTrends: {
    increasing: string[];
    decreasing: string[];
    stable: string[];
  };
}

export class ChurnPredictor {
  private static instance: ChurnPredictor;
  private userBehaviorData: Map<string, any> = new Map();
  private churnModel: any = null;
  private engagementModel: any = null;

  public static getInstance(): ChurnPredictor {
    if (!ChurnPredictor.instance) {
      ChurnPredictor.instance = new ChurnPredictor();
    }
    return ChurnPredictor.instance;
  }

  // Predict individual user churn
  async predictUserChurn(userId: string): Promise<ChurnPrediction> {
    console.log('Churn ML: Predicting churn for user:', userId);

    const userBehavior = this.getUserBehaviorData(userId);
    const churnFactors = this.analyzeChurnFactors(userBehavior);
    const churnProbability = this.calculateChurnProbability(churnFactors);
    const riskLevel = this.determineRiskLevel(churnProbability);
    const timeToChurn = this.estimateTimeToChurn(churnProbability, churnFactors);
    const retentionStrategies = this.generateRetentionStrategies(churnFactors, riskLevel);
    const confidence = this.calculatePredictionConfidence(userBehavior);

    return {
      userId,
      churnProbability,
      riskLevel,
      timeToChurn,
      churnFactors,
      retentionStrategies,
      confidence
    };
  }

  // Batch churn prediction for multiple users
  async batchPredictChurn(userIds: string[]): Promise<ChurnPrediction[]> {
    console.log('Churn ML: Batch predicting churn for', userIds.length, 'users');

    const predictions = await Promise.all(
      userIds.map(userId => this.predictUserChurn(userId))
    );

    return predictions.sort((a, b) => b.churnProbability - a.churnProbability);
  }

  // Predict feature engagement
  async predictEngagement(userId: string): Promise<EngagementPrediction> {
    console.log('Engagement ML: Predicting feature engagement for user:', userId);

    const userBehavior = this.getUserBehaviorData(userId);
    const featureEngagement = this.calculateFeatureEngagement(userBehavior);
    const overallEngagement = this.calculateOverallEngagement(featureEngagement);
    const recommendedFeatures = this.recommendFeatures(userBehavior, featureEngagement);
    const engagementTrends = this.analyzeEngagementTrends(userBehavior);

    return {
      userId,
      featureEngagement,
      overallEngagement,
      recommendedFeatures,
      engagementTrends
    };
  }

  // Get high-risk users for proactive retention
  async getHighRiskUsers(limit: number = 100): Promise<ChurnPrediction[]> {
    console.log('Churn ML: Identifying high-risk users');

    // In a real implementation, this would query all active users
    const mockUserIds = Array.from({ length: 500 }, (_, i) => `user_${i + 1}`);
    
    const predictions = await this.batchPredictChurn(mockUserIds.slice(0, limit));
    
    return predictions.filter(pred => pred.riskLevel === 'high' || pred.riskLevel === 'critical');
  }

  // Analyze churn trends across customer segments
  async analyzeChurnTrends(): Promise<{
    overallChurnRate: number;
    segmentAnalysis: Array<{
      segment: string;
      churnRate: number;
      primaryFactors: string[];
      retentionOpportunity: number;
    }>;
    monthlyTrends: Array<{
      month: string;
      churnRate: number;
      retainedUsers: number;
    }>;
    recommendations: string[];
  }> {
    console.log('Churn ML: Analyzing churn trends');

    return {
      overallChurnRate: 0.12, // 12% monthly churn rate
      segmentAnalysis: [
        {
          segment: 'New Users (0-30 days)',
          churnRate: 0.35,
          primaryFactors: ['Poor onboarding', 'Product-market fit issues'],
          retentionOpportunity: 0.6
        },
        {
          segment: 'Regular Users (31-180 days)',
          churnRate: 0.08,
          primaryFactors: ['Price sensitivity', 'Feature limitations'],
          retentionOpportunity: 0.4
        },
        {
          segment: 'Long-term Users (180+ days)',
          churnRate: 0.03,
          primaryFactors: ['Competition', 'Changing needs'],
          retentionOpportunity: 0.8
        }
      ],
      monthlyTrends: this.generateMockTrends(),
      recommendations: [
        'Improve onboarding experience for new users',
        'Implement personalized pricing strategies',
        'Enhance feature discovery and adoption',
        'Create loyalty programs for long-term users'
      ]
    };
  }

  // Track retention campaign effectiveness
  async trackRetentionCampaignEffectiveness(campaignId: string): Promise<{
    campaignId: string;
    targetedUsers: number;
    retainedUsers: number;
    retentionRate: number;
    costPerRetention: number;
    roi: number;
    topPerformingStrategies: string[];
  }> {
    // Mock campaign effectiveness tracking
    return {
      campaignId,
      targetedUsers: 1000,
      retainedUsers: 650,
      retentionRate: 0.65,
      costPerRetention: 45,
      roi: 3.2,
      topPerformingStrategies: [
        'Personalized discount offers',
        'Feature tutorial campaigns',
        'Customer success outreach'
      ]
    };
  }

  // Private helper methods
  private getUserBehaviorData(userId: string): any {
    if (!this.userBehaviorData.has(userId)) {
      // Generate mock user behavior data
      this.userBehaviorData.set(userId, this.generateMockBehaviorData(userId));
    }
    return this.userBehaviorData.get(userId);
  }

  private generateMockBehaviorData(userId: string): any {
    const daysSinceRegistration = Math.floor(Math.random() * 365) + 1;
    const daysSinceLastLogin = Math.floor(Math.random() * 30);
    
    return {
      daysSinceRegistration,
      daysSinceLastLogin,
      totalSessions: Math.floor(Math.random() * 50) + 1,
      averageSessionDuration: Math.floor(Math.random() * 30) + 5, // minutes
      totalPurchases: Math.floor(Math.random() * 10),
      totalSpent: Math.floor(Math.random() * 50000),
      supportTickets: Math.floor(Math.random() * 5),
      featureUsage: {
        search: Math.random(),
        wishlist: Math.random(),
        reviews: Math.random(),
        social: Math.random(),
        chat: Math.random()
      },
      deviceTypes: ['mobile', 'desktop'][Math.floor(Math.random() * 2)],
      communicationPreferences: {
        email: Math.random() > 0.3,
        sms: Math.random() > 0.7,
        push: Math.random() > 0.5
      }
    };
  }

  private analyzeChurnFactors(userBehavior: any): Array<{
    factor: string;
    impact: number;
    description: string;
  }> {
    const factors = [];

    // Analyze recency
    if (userBehavior.daysSinceLastLogin > 14) {
      factors.push({
        factor: 'login_recency',
        impact: Math.min(userBehavior.daysSinceLastLogin / 30, 1),
        description: `Last login ${userBehavior.daysSinceLastLogin} days ago`
      });
    }

    // Analyze engagement
    if (userBehavior.averageSessionDuration < 10) {
      factors.push({
        factor: 'low_engagement',
        impact: 0.6,
        description: 'Below average session duration'
      });
    }

    // Analyze purchase behavior
    if (userBehavior.totalPurchases === 0 && userBehavior.daysSinceRegistration > 30) {
      factors.push({
        factor: 'no_purchases',
        impact: 0.7,
        description: 'No purchases after 30+ days'
      });
    }

    // Analyze support interactions
    if (userBehavior.supportTickets > 2) {
      factors.push({
        factor: 'support_issues',
        impact: 0.4,
        description: 'Multiple support tickets indicate friction'
      });
    }

    // Analyze feature adoption
    const featureUsageScore = Object.values(userBehavior.featureUsage).reduce((sum: number, usage: any) => sum + usage, 0) / Object.keys(userBehavior.featureUsage).length;
    if (featureUsageScore < 0.3) {
      factors.push({
        factor: 'low_feature_adoption',
        impact: 0.5,
        description: 'Low adoption of key features'
      });
    }

    return factors;
  }

  private calculateChurnProbability(churnFactors: any[]): number {
    if (churnFactors.length === 0) return 0.1; // Base churn rate

    const totalImpact = churnFactors.reduce((sum, factor) => sum + factor.impact, 0);
    const weightedImpact = totalImpact / churnFactors.length;
    
    return Math.min(0.95, 0.1 + weightedImpact * 0.8);
  }

  private determineRiskLevel(probability: number): 'low' | 'medium' | 'high' | 'critical' {
    if (probability >= 0.8) return 'critical';
    if (probability >= 0.6) return 'high';
    if (probability >= 0.4) return 'medium';
    return 'low';
  }

  private estimateTimeToChurn(probability: number, factors: any[]): number {
    const baseTime = 90; // 90 days base
    const urgencyMultiplier = 1 - probability;
    
    // Factor in specific risk factors
    const hasRecentActivity = factors.some(f => f.factor === 'login_recency' && f.impact > 0.7);
    if (hasRecentActivity) return Math.floor(baseTime * 0.3);
    
    return Math.floor(baseTime * urgencyMultiplier);
  }

  private generateRetentionStrategies(factors: any[], riskLevel: string): Array<{
    strategy: string;
    priority: number;
    expectedImpact: number;
    description: string;
  }> {
    const strategies = [];

    if (factors.some(f => f.factor === 'login_recency')) {
      strategies.push({
        strategy: 'reengagement_campaign',
        priority: 1,
        expectedImpact: 0.4,
        description: 'Send personalized re-engagement emails with special offers'
      });
    }

    if (factors.some(f => f.factor === 'no_purchases')) {
      strategies.push({
        strategy: 'first_purchase_incentive',
        priority: 2,
        expectedImpact: 0.6,
        description: 'Offer first-time buyer discount and product recommendations'
      });
    }

    if (factors.some(f => f.factor === 'low_feature_adoption')) {
      strategies.push({
        strategy: 'feature_education',
        priority: 3,
        expectedImpact: 0.3,
        description: 'Guided tutorial and feature highlight campaigns'
      });
    }

    if (riskLevel === 'critical') {
      strategies.push({
        strategy: 'personal_outreach',
        priority: 1,
        expectedImpact: 0.7,
        description: 'Direct customer success team intervention'
      });
    }

    return strategies.sort((a, b) => a.priority - b.priority);
  }

  private calculatePredictionConfidence(userBehavior: any): number {
    let confidence = 0.5; // Base confidence
    
    // More data = higher confidence
    confidence += Math.min(userBehavior.totalSessions / 20, 0.3);
    confidence += Math.min(userBehavior.daysSinceRegistration / 180, 0.2);
    
    return Math.min(0.95, confidence);
  }

  private calculateFeatureEngagement(userBehavior: any): any {
    return {
      wishlist: userBehavior.featureUsage.wishlist || 0,
      reviews: userBehavior.featureUsage.reviews || 0,
      socialSharing: userBehavior.featureUsage.social || 0,
      referrals: Math.random() * 0.3, // Mock referral engagement
      premiumFeatures: Math.random() * 0.2 // Mock premium feature usage
    };
  }

  private calculateOverallEngagement(featureEngagement: any): number {
    const scores = Object.values(featureEngagement) as number[];
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private recommendFeatures(userBehavior: any, featureEngagement: any): string[] {
    const recommendations = [];
    
    if (featureEngagement.wishlist < 0.3) {
      recommendations.push('Create wishlist for future purchases');
    }
    
    if (featureEngagement.reviews < 0.2) {
      recommendations.push('Share product reviews to help others');
    }
    
    if (featureEngagement.socialSharing < 0.1) {
      recommendations.push('Share favorite products with friends');
    }
    
    return recommendations;
  }

  private analyzeEngagementTrends(userBehavior: any): any {
    return {
      increasing: ['search', 'product_views'],
      decreasing: ['session_duration'],
      stable: ['purchase_frequency', 'support_usage']
    };
  }

  private generateMockTrends(): any[] {
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      churnRate: 0.08 + Math.random() * 0.08,
      retainedUsers: Math.floor(Math.random() * 1000) + 4000
    }));
  }
}

export const churnPredictor = ChurnPredictor.getInstance();
