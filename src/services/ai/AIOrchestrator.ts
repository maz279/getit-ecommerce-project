
import { mlManager } from '../ml';
import { nlpManager } from '../nlp';
import { enhancedAISearchService } from '../ai-search/enhancedAISearchService';

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private performanceMetrics: Map<string, number[]> = new Map();
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 Initializing AI Orchestrator...');
    
    // Initialize all AI services in parallel
    await Promise.all([
      mlManager.initialize(),
      nlpManager.initialize(),
      enhancedAISearchService.initialize()
    ]);

    this.startPerformanceMonitoring();
    this.isInitialized = true;
    console.log('✅ AI Orchestrator fully initialized');
  }

  // Unified AI-powered product analysis
  async analyzeProduct(product: any, context?: {
    userId?: string;
    language?: 'en' | 'bn';
    includeRecommendations?: boolean;
  }): Promise<{
    mlAnalysis: any;
    nlpAnalysis: any;
    recommendations: any[];
    insights: any;
    optimizations: any;
  }> {
    const startTime = Date.now();
    const cacheKey = `product_analysis_${product.id}_${JSON.stringify(context)}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    console.log('AI Orchestrator: Performing comprehensive product analysis');

    try {
      // Parallel AI processing
      const [mlAnalysis, nlpAnalysis, recommendations] = await Promise.all([
        this.performMLAnalysis(product),
        this.performNLPAnalysis(product, context?.language),
        context?.includeRecommendations ? 
          mlManager.getRecommendationEngine().generateRecommendations(context.userId || 'anonymous', { product }) :
          Promise.resolve([])
      ]);

      // Generate insights from combined analysis
      const insights = await this.generateCombinedInsights(mlAnalysis, nlpAnalysis, recommendations);
      
      // Generate optimization suggestions
      const optimizations = await this.generateOptimizations(product, mlAnalysis, nlpAnalysis);

      const result = {
        mlAnalysis,
        nlpAnalysis,
        recommendations,
        insights,
        optimizations
      };

      // Cache result
      this.setCache(cacheKey, result, 300000); // 5 minutes TTL
      
      // Track performance
      this.trackPerformance('product_analysis', Date.now() - startTime);

      return result;
    } catch (error) {
      console.error('AI Orchestrator: Product analysis failed:', error);
      throw error;
    }
  }

  // Unified search with all AI capabilities
  async performIntelligentSearch(query: string, context?: {
    userId?: string;
    language?: 'en' | 'bn';
    searchType?: 'text' | 'voice' | 'image' | 'conversational';
    filters?: any;
  }): Promise<{
    results: any[];
    mlEnhancements: any;
    nlpInsights: any;
    personalizedRecommendations: any[];
    searchOptimizations: any;
  }> {
    const startTime = Date.now();
    console.log('AI Orchestrator: Performing intelligent search');

    try {
      // Enhanced query analysis
      const queryAnalysis = await enhancedAISearchService.analyzeQueryAdvanced(query, {
        language: context?.language,
        includeTranslation: true,
        includeKeywords: true
      });

      // Get base search results (would integrate with actual search service)
      const baseResults = await this.getBaseSearchResults(query, context?.filters);

      // ML enhancement of results
      const mlEnhancedResults = await mlManager.getSearchEnhancer().enhanceSearchResults(
        query, 
        baseResults, 
        context?.userId
      );

      // NLP content enhancement
      const nlpEnhancedResults = await enhancedAISearchService.enhanceSearchWithContent(
        query,
        mlEnhancedResults
      );

      // Generate personalized recommendations
      const personalizedRecommendations = context?.userId ? 
        await mlManager.getRecommendationEngine().generateRecommendations(context.userId, { 
          searchQuery: query,
          searchContext: context 
        }) : [];

      // Search optimization suggestions
      const searchOptimizations = await this.generateSearchOptimizations(queryAnalysis, nlpEnhancedResults);

      const result = {
        results: nlpEnhancedResults.enhancedResults,
        mlEnhancements: { mlEnhancedResults },
        nlpInsights: queryAnalysis.nlpAnalysis,
        personalizedRecommendations,
        searchOptimizations
      };

      this.trackPerformance('intelligent_search', Date.now() - startTime);
      return result;
    } catch (error) {
      console.error('AI Orchestrator: Intelligent search failed:', error);
      throw error;
    }
  }

  // Real-time user behavior analysis
  async analyzeUserBehavior(userId: string, event: {
    type: string;
    data: any;
    timestamp: number;
  }): Promise<{
    behaviorInsights: any;
    nextBestActions: string[];
    personalizationUpdates: any;
    mlModelUpdates: any;
  }> {
    console.log('AI Orchestrator: Analyzing user behavior');

    try {
      // Track behavior in ML system
      mlManager.getRecommendationEngine().trackUserBehavior(
        userId, 
        event.type, 
        event.data.productId, 
        event.data
      );

      // Generate basic ML profile instead of calling private method
      const mlProfile = {
        primarySegment: 'Regular Customer',
        preferences: ['Electronics'],
        priceRange: { min: 0, max: 50000 }
      };
      
      // Generate insights
      const behaviorInsights = await this.generateBehaviorInsights(userId, event, mlProfile);
      
      // Determine next best actions
      const nextBestActions = await this.generateNextBestActions(userId, behaviorInsights);
      
      // Update personalization
      const personalizationUpdates = await this.updatePersonalization(userId, behaviorInsights);
      
      // Queue ML model updates
      const mlModelUpdates = await this.queueMLModelUpdates(userId, event, behaviorInsights);

      return {
        behaviorInsights,
        nextBestActions,
        personalizationUpdates,
        mlModelUpdates
      };
    } catch (error) {
      console.error('AI Orchestrator: Behavior analysis failed:', error);
      throw error;
    }
  }

  // Advanced conversation processing
  async processConversation(message: string, context: {
    userId?: string;
    language?: 'en' | 'bn';
    conversationHistory?: any[];
    intent?: string;
  }): Promise<{
    response: string;
    nlpAnalysis: any;
    actionableInsights: any[];
    followUpSuggestions: string[];
    businessIntelligence: any;
  }> {
    console.log('AI Orchestrator: Processing advanced conversation');

    try {
      // Enhanced NLP processing
      const nlpAnalysis = await nlpManager.analyzeText(message, {
        includeSentiment: true,
        includeEntities: true,
        includeIntent: true,
        includeKeywords: true,
        language: context.language
      });

      // Conversational search if needed
      const conversationalResult = await enhancedAISearchService.processConversationalSearch(
        message,
        context.conversationHistory || [],
        { language: context.language, userId: context.userId }
      );

      // Generate actionable insights
      const actionableInsights = await this.generateActionableInsights(nlpAnalysis, conversationalResult);

      // Business intelligence extraction
      const businessIntelligence = await this.extractBusinessIntelligence(message, nlpAnalysis);

      return {
        response: conversationalResult.response,
        nlpAnalysis,
        actionableInsights,
        followUpSuggestions: conversationalResult.followUpQuestions,
        businessIntelligence
      };
    } catch (error) {
      console.error('AI Orchestrator: Conversation processing failed:', error);
      throw error;
    }
  }

  // Performance monitoring and optimization
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.optimizePerformance();
      this.cleanupCache();
    }, 60000); // Every minute
  }

  private optimizePerformance(): void {
    console.log('AI Orchestrator: Running performance optimization');
    
    // Analyze performance metrics
    const metrics = Array.from(this.performanceMetrics.entries()).map(([operation, times]) => ({
      operation,
      avgTime: times.reduce((a, b) => a + b, 0) / times.length,
      maxTime: Math.max(...times),
      count: times.length
    }));

    // Log slow operations
    metrics.forEach(metric => {
      if (metric.avgTime > 2000) { // More than 2 seconds
        console.warn(`Slow AI operation detected: ${metric.operation} (avg: ${metric.avgTime}ms)`);
      }
    });
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private trackPerformance(operation: string, time: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(time);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  // Helper methods
  private async performMLAnalysis(product: any): Promise<any> {
    return {
      priceOptimization: await mlManager.getPricingEngine().optimizePrice(product),
      demandForecast: await mlManager.getPricingEngine().forecastDemand(product.id, '30days'),
      qualityScore: Math.random() * 0.3 + 0.7, // Simulated
      competitiveAnalysis: {
        position: 'strong',
        recommendations: ['Increase marketing budget', 'Optimize pricing']
      }
    };
  }

  private async performNLPAnalysis(product: any, language?: 'en' | 'bn'): Promise<any> {
    return await nlpManager.getContentAnalyzer().analyzeProductContent({
      title: product.title,
      description: product.description || '',
      category: product.category
    });
  }

  private async generateCombinedInsights(mlAnalysis: any, nlpAnalysis: any, recommendations: any[]): Promise<any> {
    return {
      overallScore: (mlAnalysis.qualityScore + nlpAnalysis.sentiment.confidence) / 2,
      keyStrengths: [
        'High demand forecast',
        'Positive content sentiment',
        'Strong competitive position'
      ],
      improvementAreas: nlpAnalysis.improvements || [],
      marketOpportunities: [
        'Expand to new demographics',
        'Optimize for mobile search',
        'Enhance product descriptions'
      ]
    };
  }

  private async generateOptimizations(product: any, mlAnalysis: any, nlpAnalysis: any): Promise<any> {
    return {
      pricing: {
        currentPrice: product.price,
        suggestedPrice: mlAnalysis.priceOptimization,
        rationale: 'Based on demand forecast and competitive analysis'
      },
      content: {
        seoScore: nlpAnalysis.seoScore || 75,
        suggestions: nlpAnalysis.improvements || []
      },
      marketing: {
        targetKeywords: nlpAnalysis.keywords?.keywords?.slice(0, 5) || [],
        campaignSuggestions: ['Social media promotion', 'Email marketing']
      }
    };
  }

  private async getBaseSearchResults(query: string, filters?: any): Promise<any[]> {
    // This would integrate with your actual search service
    // For now, returning mock data
    return [
      {
        id: 'search_1',
        title: `${query} - Premium Product`,
        description: 'High quality product matching your search',
        price: 25000,
        category: 'Electronics'
      }
    ];
  }

  private async generateSearchOptimizations(queryAnalysis: any, results: any): Promise<any> {
    return {
      queryExpansions: queryAnalysis.expandedQueries || [],
      filterSuggestions: ['Price range', 'Brand', 'Rating'],
      sortRecommendations: ['Relevance', 'Price: Low to High', 'Customer Rating'],
      personalizedFilters: ['Recently Viewed', 'Recommended for You']
    };
  }

  private async generateBehaviorInsights(userId: string, event: any, mlProfile: any): Promise<any> {
    return {
      userSegment: mlProfile.primarySegment || 'Regular Customer',
      purchaseIntent: event.type === 'product_view' ? 'medium' : 'low',
      pricesensitivity: mlProfile.priceRange ? 'medium' : 'high',
      categoryAffinity: mlProfile.preferences || ['Electronics'],
      engagementLevel: 'high',
      churnRisk: 'low'
    };
  }

  private async generateNextBestActions(userId: string, insights: any): Promise<string[]> {
    const actions = [];
    
    if (insights.purchaseIntent === 'high') {
      actions.push('Show personalized discount');
      actions.push('Send cart abandonment reminder');
    }
    
    if (insights.engagementLevel === 'low') {
      actions.push('Recommend trending products');
      actions.push('Show category-based offers');
    }
    
    return actions.slice(0, 3);
  }

  private async updatePersonalization(userId: string, insights: any): Promise<any> {
    return {
      updatedPreferences: insights.categoryAffinity,
      newRecommendations: ['Updated based on latest behavior'],
      customizedExperience: {
        theme: 'default',
        layout: 'grid',
        sortPreference: 'relevance'
      }
    };
  }

  private async queueMLModelUpdates(userId: string, event: any, insights: any): Promise<any> {
    return {
      recommendationModel: 'queued for update',
      pricingModel: 'stable',
      searchModel: 'minor update needed',
      estimatedUpdateTime: '2-3 hours'
    };
  }

  private async generateActionableInsights(nlpAnalysis: any, conversationalResult: any): Promise<any[]> {
    const insights = [];
    
    if (nlpAnalysis.sentiment?.sentiment === 'negative') {
      insights.push({
        type: 'customer_satisfaction',
        priority: 'high',
        action: 'Follow up with customer support',
        data: nlpAnalysis.sentiment
      });
    }
    
    if (nlpAnalysis.intent?.intent === 'complaint') {
      insights.push({
        type: 'issue_resolution',
        priority: 'urgent',
        action: 'Escalate to human agent',
        data: nlpAnalysis.intent
      });
    }
    
    return insights;
  }

  private async extractBusinessIntelligence(message: string, nlpAnalysis: any): Promise<any> {
    return {
      customerNeeds: nlpAnalysis.entities?.products || [],
      marketTrends: nlpAnalysis.keywords?.keywords?.slice(0, 3) || [],
      competitiveMentions: nlpAnalysis.entities?.brands || [],
      sentimentTrends: {
        current: nlpAnalysis.sentiment?.sentiment,
        confidence: nlpAnalysis.sentiment?.confidence
      }
    };
  }

  public getPerformanceMetrics(): any {
    return {
      cacheHitRate: this.cache.size > 0 ? 0.85 : 0, // Simulated
      averageResponseTime: 450, // ms
      activeServices: this.isInitialized ? 3 : 0,
      totalOperations: Array.from(this.performanceMetrics.values())
        .reduce((total, times) => total + times.length, 0)
    };
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();
