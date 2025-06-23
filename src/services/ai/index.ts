
import { AIOrchestrator, aiOrchestrator } from './AIOrchestrator';
import { PersonalizationEngine, personalizationEngine } from './PersonalizationEngine';
import { RealTimeInsights, realTimeInsights } from './RealTimeInsights';
import { reportGenerator } from './unified/ReportGenerator';
import { healthMonitor } from './unified/HealthMonitor';
import { mlManager } from '../ml';
import { nlpManager } from '../nlp';
import { enhancedAISearchService } from '../ai-search/enhancedAISearchService';

export class UnifiedAIService {
  private static instance: UnifiedAIService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): UnifiedAIService {
    if (!UnifiedAIService.instance) {
      UnifiedAIService.instance = new UnifiedAIService();
    }
    return UnifiedAIService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Unified AI Service already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Unified AI Service...');
      
      await Promise.all([
        aiOrchestrator.initialize(),
        mlManager.initialize(),
        nlpManager.initialize(),
        enhancedAISearchService.initialize()
      ]);

      this.isInitialized = true;
      console.log('✅ Unified AI Service fully initialized');
      
      this.startAIOptimization();
      
    } catch (error) {
      console.error('❌ Failed to initialize Unified AI Service:', error);
      throw error;
    }
  }

  async processUserAction(action: {
    type: 'search' | 'view' | 'purchase' | 'chat' | 'personalize';
    userId?: string;
    data: any;
    context?: any;
  }): Promise<{
    result: any;
    recommendations: any[];
    insights: any;
    personalization: any;
  }> {
    console.log('Unified AI: Processing user action:', action.type);

    try {
      const results = await Promise.all([
        this.processMainAction(action),
        this.generateRecommendations(action),
        this.extractInsights(action),
        this.personalizeResponse(action)
      ]);

      return {
        result: results[0],
        recommendations: results[1],
        insights: results[2],
        personalization: results[3]
      };
    } catch (error) {
      console.error('Unified AI: Action processing failed:', error);
      throw error;
    }
  }

  async generateComprehensiveReport(type: 'business' | 'customer' | 'product' | 'performance'): Promise<any> {
    console.log('Unified AI: Generating comprehensive report:', type);

    const [businessInsights, performanceMetrics] = await Promise.all([
      realTimeInsights.generateBusinessInsights(),
      aiOrchestrator.getPerformanceMetrics()
    ]);

    return reportGenerator.generateComprehensiveReport(type, businessInsights, performanceMetrics);
  }

  async getAIHealthStatus(): Promise<{
    overall: 'excellent' | 'good' | 'warning' | 'critical';
    services: any;
    performance: any;
    recommendations: string[];
  }> {
    const performanceMetrics = aiOrchestrator.getPerformanceMetrics();
    const activeAlerts = realTimeInsights.getActiveAlerts();

    const serviceStatus = {
      ml: mlManager.isReady() ? 'healthy' : 'down',
      nlp: nlpManager.isReady() ? 'healthy' : 'down',
      search: 'healthy',
      personalization: 'healthy'
    };

    const overall = healthMonitor.calculateOverallHealth(performanceMetrics, activeAlerts, serviceStatus);
    const recommendations = healthMonitor.generateHealthRecommendations(performanceMetrics, activeAlerts);

    return {
      overall,
      services: serviceStatus,
      performance: performanceMetrics,
      recommendations
    };
  }

  private async processMainAction(action: any): Promise<any> {
    switch (action.type) {
      case 'search':
        return await aiOrchestrator.performIntelligentSearch(action.data.query, action.context);
      case 'view':
        return await aiOrchestrator.analyzeProduct(action.data.product, action.context);
      case 'chat':
        return await aiOrchestrator.processConversation(action.data.message, action.context);
      case 'personalize':
        return await personalizationEngine.personalizeExperience(action.userId!, action.context);
      default:
        return { status: 'processed' };
    }
  }

  private async generateRecommendations(action: any): Promise<any[]> {
    if (action.userId && action.type !== 'chat') {
      return await mlManager.getRecommendationEngine().generateRecommendations(action.userId, {
        action: action.type,
        data: action.data,
        context: action.context
      });
    }
    return [];
  }

  private async extractInsights(action: any): Promise<any> {
    return await realTimeInsights.processRealTimeEvent({
      type: action.type,
      userId: action.userId,
      data: action.data,
      timestamp: Date.now()
    });
  }

  private async personalizeResponse(action: any): Promise<any> {
    if (action.userId) {
      return await personalizationEngine.personalizeExperience(action.userId, {
        page: action.context?.page || 'unknown',
        language: action.context?.language || 'en'
      });
    }
    return null;
  }

  private startAIOptimization(): void {
    setInterval(() => {
      this.optimizeAIPerformance();
    }, 5 * 60 * 1000);
  }

  private async optimizeAIPerformance(): Promise<void> {
    console.log('Unified AI: Running performance optimization');
    
    try {
      const health = await this.getAIHealthStatus();
      
      if (health.overall === 'warning' || health.overall === 'critical') {
        console.warn('AI System health issue detected:', health.overall);
      }

      console.log('AI System Status:', {
        health: health.overall,
        services: health.services,
        performance: health.performance
      });
    } catch (error) {
      console.error('AI optimization failed:', error);
    }
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}

export const unifiedAIService = UnifiedAIService.getInstance();

export {
  aiOrchestrator,
  personalizationEngine,
  realTimeInsights,
  mlManager,
  nlpManager,
  enhancedAISearchService
};

export type { } from './AIOrchestrator';
export type { } from './PersonalizationEngine';
export type { } from './RealTimeInsights';
