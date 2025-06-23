
import { mlService } from './MLService';
import { recommendationEngine } from './RecommendationEngine';

export interface UserProfile {
  userId: string;
  demographics: {
    age?: number;
    location?: string;
    gender?: string;
  };
  behaviorSegment: 'frequent_buyer' | 'first_time_visitor' | 'cart_abandoner' | 'bargain_hunter' | 'premium_customer';
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    preferredLanguage: 'en' | 'bn';
  };
  engagement: {
    sessionDuration: number;
    pageViews: number;
    interactionScore: number;
    lastActivity: number;
  };
  purchaseHistory: {
    totalSpent: number;
    orderCount: number;
    averageOrderValue: number;
    favoriteCategories: string[];
  };
  riskScores: {
    churnRisk: number;
    fraudRisk: number;
    engagementRisk: number;
  };
}

export interface PersonalizationRecommendation {
  type: 'collaborative' | 'content_based' | 'hybrid' | 'real_time';
  products: Array<{
    id: string;
    title: string;
    price: number;
    confidence: number;
    reason: string;
    image?: string;
  }>;
  discounts?: Array<{
    productId: string;
    originalPrice: number;
    discountedPrice: number;
    discountReason: string;
  }>;
}

export class PersonalizationEngine {
  private static instance: PersonalizationEngine;
  private userProfiles: Map<string, UserProfile> = new Map();
  private sessionData: Map<string, any> = new Map();

  public static getInstance(): PersonalizationEngine {
    if (!PersonalizationEngine.instance) {
      PersonalizationEngine.instance = new PersonalizationEngine();
    }
    return PersonalizationEngine.instance;
  }

  // Advanced User Profiling
  async createOrUpdateProfile(userId: string, data: {
    action: string;
    productId?: string;
    category?: string;
    metadata?: any;
  }): Promise<UserProfile> {
    console.log('Personalization: Creating/updating user profile for:', userId);

    let profile = this.userProfiles.get(userId) || this.createDefaultProfile(userId);
    
    // Update based on user action
    profile = await this.updateProfileFromAction(profile, data);
    
    // Calculate behavioral segment
    profile.behaviorSegment = this.calculateBehaviorSegment(profile);
    
    // Update risk scores
    profile.riskScores = await this.calculateRiskScores(profile);
    
    this.userProfiles.set(userId, profile);
    return profile;
  }

  // Hybrid Recommendation System
  async getPersonalizedRecommendations(userId: string): Promise<PersonalizationRecommendation> {
    console.log('Personalization: Generating hybrid recommendations for:', userId);
    
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return this.getDefaultRecommendations();
    }

    const [collaborative, contentBased, realTime] = await Promise.all([
      this.getCollaborativeRecommendations(profile),
      this.getContentBasedRecommendations(profile),
      this.getRealTimeRecommendations(userId, profile)
    ]);

    // Combine recommendations using hybrid approach
    const hybridProducts = this.combineRecommendations([collaborative, contentBased, realTime]);
    
    // Generate personalized discounts
    const discounts = await this.generatePersonalizedDiscounts(profile, hybridProducts);

    return {
      type: 'hybrid',
      products: hybridProducts,
      discounts
    };
  }

  // Customer Segmentation
  async performCustomerSegmentation(): Promise<{
    behavioralSegments: any;
    demographicSegments: any;
    predictiveSegments: any;
  }> {
    console.log('Personalization: Performing customer segmentation');

    const allProfiles = Array.from(this.userProfiles.values());
    
    return {
      behavioralSegments: this.analyzeBehavioralSegments(allProfiles),
      demographicSegments: this.analyzeDemographicSegments(allProfiles),
      predictiveSegments: await this.analyzePredictiveSegments(allProfiles)
    };
  }

  // Dynamic Pricing
  async calculateDynamicPrice(productId: string, userId?: string): Promise<{
    basePrice: number;
    dynamicPrice: number;
    factors: string[];
    discount?: number;
  }> {
    console.log('Personalization: Calculating dynamic price for product:', productId);

    const basePrice = 25000; // Mock base price
    let dynamicPrice = basePrice;
    const factors = [];

    // Market demand factor
    const demandMultiplier = await this.calculateDemandMultiplier(productId);
    dynamicPrice *= demandMultiplier;
    factors.push(`demand_${demandMultiplier > 1 ? 'high' : 'low'}`);

    // User-specific pricing
    if (userId) {
      const profile = this.userProfiles.get(userId);
      if (profile) {
        const personalizedMultiplier = this.calculatePersonalizedPricing(profile);
        dynamicPrice *= personalizedMultiplier;
        factors.push(`personalized_${personalizedMultiplier < 1 ? 'discount' : 'premium'}`);
      }
    }

    // Inventory level factor
    const inventoryMultiplier = this.calculateInventoryPricing(productId);
    dynamicPrice *= inventoryMultiplier;
    factors.push(`inventory_based`);

    const discount = basePrice > dynamicPrice ? basePrice - dynamicPrice : undefined;

    return {
      basePrice,
      dynamicPrice: Math.round(dynamicPrice),
      factors,
      discount
    };
  }

  // Churn Prediction
  async predictChurn(userId: string): Promise<{
    churnProbability: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    retentionStrategies: string[];
  }> {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { churnProbability: 0.5, riskLevel: 'medium', factors: [], retentionStrategies: [] };
    }

    const churnFactors = [];
    let churnScore = 0;

    // Analyze engagement patterns
    const daysSinceLastActivity = (Date.now() - profile.engagement.lastActivity) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity > 30) {
      churnScore += 0.3;
      churnFactors.push('long_inactivity');
    }

    // Analyze purchase behavior
    if (profile.purchaseHistory.orderCount === 0) {
      churnScore += 0.4;
      churnFactors.push('no_purchases');
    } else if (profile.purchaseHistory.orderCount < 2) {
      churnScore += 0.2;
      churnFactors.push('low_purchase_frequency');
    }

    // Analyze engagement metrics
    if (profile.engagement.interactionScore < 0.3) {
      churnScore += 0.2;
      churnFactors.push('low_engagement');
    }

    const churnProbability = Math.min(churnScore, 1);
    const riskLevel = churnProbability > 0.8 ? 'critical' : 
                     churnProbability > 0.6 ? 'high' : 
                     churnProbability > 0.4 ? 'medium' : 'low';

    const retentionStrategies = this.generateRetentionStrategies(riskLevel, churnFactors);

    return {
      churnProbability,
      riskLevel,
      factors: churnFactors,
      retentionStrategies
    };
  }

  // Private helper methods
  private createDefaultProfile(userId: string): UserProfile {
    return {
      userId,
      demographics: {},
      behaviorSegment: 'first_time_visitor',
      preferences: {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 100000 },
        preferredLanguage: 'en'
      },
      engagement: {
        sessionDuration: 0,
        pageViews: 0,
        interactionScore: 0,
        lastActivity: Date.now()
      },
      purchaseHistory: {
        totalSpent: 0,
        orderCount: 0,
        averageOrderValue: 0,
        favoriteCategories: []
      },
      riskScores: {
        churnRisk: 0.5,
        fraudRisk: 0.1,
        engagementRisk: 0.3
      }
    };
  }

  private async updateProfileFromAction(profile: UserProfile, data: any): Promise<UserProfile> {
    profile.engagement.lastActivity = Date.now();
    profile.engagement.pageViews += 1;

    switch (data.action) {
      case 'product_view':
        profile.engagement.interactionScore += 0.1;
        if (data.category && !profile.preferences.categories.includes(data.category)) {
          profile.preferences.categories.push(data.category);
        }
        break;
      case 'purchase':
        profile.purchaseHistory.orderCount += 1;
        profile.purchaseHistory.totalSpent += data.metadata?.amount || 0;
        profile.purchaseHistory.averageOrderValue = profile.purchaseHistory.totalSpent / profile.purchaseHistory.orderCount;
        profile.engagement.interactionScore += 1;
        break;
      case 'cart_addition':
        profile.engagement.interactionScore += 0.3;
        break;
    }

    return profile;
  }

  private calculateBehaviorSegment(profile: UserProfile): UserProfile['behaviorSegment'] {
    if (profile.purchaseHistory.orderCount >= 5) return 'frequent_buyer';
    if (profile.purchaseHistory.orderCount === 0 && profile.engagement.pageViews > 10) return 'cart_abandoner';
    if (profile.purchaseHistory.averageOrderValue > 50000) return 'premium_customer';
    if (profile.engagement.pageViews < 3) return 'first_time_visitor';
    return 'bargain_hunter';
  }

  private async calculateRiskScores(profile: UserProfile): Promise<UserProfile['riskScores']> {
    const daysSinceLastActivity = (Date.now() - profile.engagement.lastActivity) / (1000 * 60 * 60 * 24);
    
    return {
      churnRisk: Math.min(daysSinceLastActivity / 30, 1),
      fraudRisk: profile.purchaseHistory.orderCount === 0 ? 0.1 : 
                 profile.purchaseHistory.averageOrderValue > 100000 ? 0.3 : 0.1,
      engagementRisk: profile.engagement.interactionScore < 0.5 ? 0.7 : 0.2
    };
  }

  private async getCollaborativeRecommendations(profile: UserProfile): Promise<any[]> {
    // Find similar users based on behavior and preferences
    const similarUsers = Array.from(this.userProfiles.values())
      .filter(p => p.userId !== profile.userId)
      .filter(p => this.calculateUserSimilarity(profile, p) > 0.6)
      .slice(0, 10);

    return [
      {
        id: 'collab_1',
        title: 'iPhone 15 Pro Max',
        price: 135000,
        confidence: 0.92,
        reason: 'Users with similar preferences also bought this',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop'
      }
    ];
  }

  private async getContentBasedRecommendations(profile: UserProfile): Promise<any[]> {
    return [
      {
        id: 'content_1',
        title: 'MacBook Air M2',
        price: 125000,
        confidence: 0.88,
        reason: 'Based on your interest in premium electronics',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop'
      }
    ];
  }

  private async getRealTimeRecommendations(userId: string, profile: UserProfile): Promise<any[]> {
    const sessionData = this.sessionData.get(userId) || {};
    
    return [
      {
        id: 'realtime_1',
        title: 'Sony WH-1000XM5',
        price: 35000,
        confidence: 0.85,
        reason: 'Trending now based on your current session',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop'
      }
    ];
  }

  private combineRecommendations(recommendations: any[][]): any[] {
    const combined = recommendations.flat();
    return combined
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);
  }

  private async generatePersonalizedDiscounts(profile: UserProfile, products: any[]): Promise<any[]> {
    const discounts = [];
    
    if (profile.behaviorSegment === 'cart_abandoner') {
      discounts.push({
        productId: products[0]?.id,
        originalPrice: products[0]?.price,
        discountedPrice: products[0]?.price * 0.9,
        discountReason: 'Welcome back discount for cart abandoners'
      });
    }

    return discounts;
  }

  private getDefaultRecommendations(): PersonalizationRecommendation {
    return {
      type: 'content_based',
      products: [
        {
          id: 'default_1',
          title: 'Popular Smartphone',
          price: 25000,
          confidence: 0.7,
          reason: 'Popular among new users'
        }
      ]
    };
  }

  private analyzeBehavioralSegments(profiles: UserProfile[]): any {
    const segments = profiles.reduce((acc, profile) => {
      acc[profile.behaviorSegment] = (acc[profile.behaviorSegment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      segments,
      insights: {
        mostCommon: Object.entries(segments).sort(([,a], [,b]) => b - a)[0],
        conversionOpportunities: segments.cart_abandoner || 0
      }
    };
  }

  private analyzeDemographicSegments(profiles: UserProfile[]): any {
    return {
      ageGroups: { '18-25': 150, '26-35': 300, '36-45': 200, '46+': 100 },
      locations: { 'Dhaka': 400, 'Chittagong': 200, 'Sylhet': 150 },
      languages: { 'bn': 450, 'en': 300 }
    };
  }

  private async analyzePredictiveSegments(profiles: UserProfile[]): Promise<any> {
    const highChurnRisk = profiles.filter(p => p.riskScores.churnRisk > 0.7).length;
    const highValuePotential = profiles.filter(p => p.purchaseHistory.averageOrderValue > 30000).length;

    return {
      churnRisk: { high: highChurnRisk, medium: 120, low: 500 },
      valueSegments: { high: highValuePotential, medium: 200, low: 350 },
      conversionLikelihood: { high: 80, medium: 200, low: 300 }
    };
  }

  private async calculateDemandMultiplier(productId: string): Promise<number> {
    // Mock demand calculation based on recent views/purchases
    return Math.random() > 0.5 ? 1.1 : 0.95;
  }

  private calculatePersonalizedPricing(profile: UserProfile): number {
    if (profile.behaviorSegment === 'premium_customer') return 1.05;
    if (profile.behaviorSegment === 'cart_abandoner') return 0.9;
    if (profile.behaviorSegment === 'bargain_hunter') return 0.92;
    return 1.0;
  }

  private calculateInventoryPricing(productId: string): number {
    // Mock inventory-based pricing
    return Math.random() > 0.7 ? 0.95 : 1.0;
  }

  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    let similarity = 0;
    
    // Compare categories
    const commonCategories = user1.preferences.categories.filter(c => 
      user2.preferences.categories.includes(c)
    ).length;
    similarity += commonCategories * 0.3;
    
    // Compare behavior segment
    if (user1.behaviorSegment === user2.behaviorSegment) similarity += 0.4;
    
    // Compare price range
    const priceOverlap = Math.min(user1.preferences.priceRange.max, user2.preferences.priceRange.max) - 
                        Math.max(user1.preferences.priceRange.min, user2.preferences.priceRange.min);
    if (priceOverlap > 0) similarity += 0.3;
    
    return Math.min(similarity, 1);
  }

  private generateRetentionStrategies(riskLevel: string, factors: string[]): string[] {
    const strategies = [];
    
    if (factors.includes('long_inactivity')) {
      strategies.push('Send personalized re-engagement email');
    }
    
    if (factors.includes('no_purchases')) {
      strategies.push('Offer first-purchase discount');
    }
    
    if (riskLevel === 'critical') {
      strategies.push('Assign dedicated customer success manager');
    }
    
    return strategies;
  }

  public getProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }
}

export const advancedPersonalizationEngine = PersonalizationEngine.getInstance();
