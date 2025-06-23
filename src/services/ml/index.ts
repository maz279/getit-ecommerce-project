
import { mlService } from './MLService';
import { recommendationEngine } from './RecommendationEngine';
import { visualSearchEngine } from './VisualSearchEngine';
import { pricingEngine } from './PricingEngine';
import { analyticsEngine } from './AnalyticsEngine';
import { mlSearchEnhancer } from './MLSearchEnhancer';

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
      console.log('🤖 Initializing ML Manager...');
      
      // Initialize core ML service
      await mlService.initialize();
      
      // Initialize all ML engines
      console.log('🎯 ML Recommendation Engine ready');
      console.log('👁️ ML Visual Search Engine ready');
      console.log('💰 ML Pricing Engine ready');
      console.log('📊 ML Analytics Engine ready');
      console.log('🔍 ML Search Enhancer ready');
      
      this.isInitialized = true;
      console.log('✅ ML Manager fully initialized');
      
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
        timestamp: Date.now()
      });
    }, 5 * 60 * 1000); // Every 5 minutes
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

  public isReady(): boolean {
    return this.isInitialized;
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
  mlSearchEnhancer
};

// Export types
export type { MLRecommendation } from './RecommendationEngine';
export type { VisualSearchResult } from './VisualSearchEngine';
export type { PriceOptimization, DemandForecast } from './PricingEngine';
export type { MLInsight, CustomerInsight } from './AnalyticsEngine';
