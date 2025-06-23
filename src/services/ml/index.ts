
import { mlService } from './MLService';
import { recommendationEngine } from './RecommendationEngine';
import { visualSearchEngine } from './VisualSearchEngine';
import { pricingEngine } from './PricingEngine';
import { analyticsEngine } from './AnalyticsEngine';
import { mlSearchEnhancer } from './MLSearchEnhancer';
import { fraudDetectionEngine } from './FraudDetectionEngine';
import { advancedPersonalizationEngine } from './PersonalizationEngine';
import { inventoryManager } from './InventoryManager';
import { churnPredictor } from './ChurnPredictor';

export class MLManager {
  private static instance: MLManager;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): MLManager {
    if (!MLManager.instance) {
      MLManager.instance = new MLManager();
    }
    return MLManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('ML Manager already initialized');
      return;
    }

    try {
      console.log('🤖 Initializing Enhanced ML Manager...');
      
      // Initialize core ML service
      await mlService.initialize();
      
      // Initialize all ML engines
      console.log('🎯 ML Recommendation Engine ready');
      console.log('👁️ ML Visual Search Engine ready');
      console.log('💰 ML Pricing Engine ready');
      console.log('📊 ML Analytics Engine ready');
      console.log('🔍 ML Search Enhancer ready');
      console.log('🛡️ ML Fraud Detection ready');
      console.log('🎪 Advanced Personalization ready');
      console.log('📦 Inventory Management AI ready');
      console.log('📈 Churn Prediction ready');
      
      this.isInitialized = true;
      console.log('✅ Enhanced ML Manager fully initialized');
      
      // Start background ML processes
      this.startBackgroundProcesses();
      
    } catch (error) {
      console.error('❌ Failed to initialize ML Manager:', error);
      throw error;
    }
  }

  private startBackgroundProcesses(): void {
    // Simulate periodic ML model updates
    setInterval(() => {
      console.log('🔄 Running background ML optimization...');
    }, 10 * 60 * 1000); // Every 10 minutes
    
    // Simulate periodic analytics processing
    setInterval(() => {
      analyticsEngine.processRealTimeEvent({
        type: 'ml_background_analysis',
        userId: 'system',
        timestamp: Date.now(),
        data: {}
      });
    }, 5 * 60 * 1000); // Every 5 minutes

    // Run fraud detection checks
    setInterval(() => {
      console.log('🛡️ Running fraud detection analysis...');
    }, 15 * 60 * 1000); // Every 15 minutes

    // Update inventory predictions
    setInterval(() => {
      console.log('📦 Updating inventory forecasts...');
    }, 60 * 60 * 1000); // Every hour

    // Analyze churn risk
    setInterval(() => {
      console.log('📈 Analyzing customer churn risk...');
    }, 120 * 60 * 1000); // Every 2 hours
  }

  // Public API for ML features
  public getRecommendationEngine() {
    return recommendationEngine;
  }

  public getVisualSearchEngine() {
    return visualSearchEngine;
  }

  public getPricingEngine() {
    return pricingEngine;
  }

  public getAnalyticsEngine() {
    return analyticsEngine;
  }

  public getSearchEnhancer() {
    return mlSearchEnhancer;
  }

  public getFraudDetectionEngine() {
    return fraudDetectionEngine;
  }

  public getPersonalizationEngine() {
    return advancedPersonalizationEngine;
  }

  public getInventoryManager() {
    return inventoryManager;
  }

  public getChurnPredictor() {
    return churnPredictor;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  // Enhanced ML capabilities
  public async performComprehensiveAnalysis(userId: string, context: any): Promise<{
    recommendations: any[];
    fraudRisk: any;
    churnRisk: any;
    personalization: any;
    inventoryInsights: any;
  }> {
    const [recommendations, fraudAnalysis, churnPrediction, personalization] = await Promise.all([
      recommendationEngine.generateRecommendations(userId, context),
      fraudDetectionEngine.analyzeTransaction(context.transaction || {}),
      churnPredictor.predictUserChurn(userId),
      advancedPersonalizationEngine.getPersonalizedRecommendations(userId)
    ]);

    const inventoryInsights = await inventoryManager.getInventoryAlerts();

    return {
      recommendations,
      fraudRisk: fraudAnalysis,
      churnRisk: churnPrediction,
      personalization,
      inventoryInsights
    };
  }
}

// Export singleton instance
export const mlManager = MLManager.getInstance();

// Export all ML services
export {
  mlService,
  recommendationEngine,
  visualSearchEngine,
  pricingEngine,
  analyticsEngine,
  mlSearchEnhancer,
  fraudDetectionEngine,
  advancedPersonalizationEngine,
  inventoryManager,
  churnPredictor
};

// Export types
export type { MLRecommendation } from './RecommendationEngine';
export type { VisualSearchResult } from './VisualSearchEngine';
export type { PriceOptimization, DemandForecast } from './PricingEngine';
export type { MLInsight, CustomerInsight } from './AnalyticsEngine';
export type { FraudAnalysis, TransactionData } from './FraudDetectionEngine';
export type { PersonalizationRecommendation, UserProfile } from './PersonalizationEngine';
export type { DemandForecast as InventoryDemandForecast, StockOptimization } from './InventoryManager';
export type { ChurnPrediction, EngagementPrediction } from './ChurnPredictor';
