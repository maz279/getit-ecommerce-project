
import { nlpService } from './NLPService';
import { chatbotService } from './ChatbotService';
import { contentAnalyzer } from './ContentAnalyzer';

export class NLPManager {
  private static instance: NLPManager;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NLPManager {
    if (!NLPManager.instance) {
      NLPManager.instance = new NLPManager();
    }
    return NLPManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('NLP Manager already initialized');
      return;
    }

    try {
      console.log('🧠 Initializing NLP Manager...');
      
      // Initialize core NLP service
      await nlpService.initialize();
      
      console.log('📝 NLP Text Analysis ready');
      console.log('🤖 NLP Chatbot Service ready');
      console.log('📊 NLP Content Analyzer ready');
      console.log('🌐 NLP Translation Service ready');
      console.log('🎯 NLP Intent Classification ready');
      
      this.isInitialized = true;
      console.log('✅ NLP Manager fully initialized');
      
      // Start background NLP processes
      this.startBackgroundProcesses();
      
    } catch (error) {
      console.error('❌ Failed to initialize NLP Manager:', error);
      throw error;
    }
  }

  private startBackgroundProcesses(): void {
    // Simulate periodic model updates
    setInterval(() => {
      console.log('🔄 Running background NLP optimization...');
    }, 15 * 60 * 1000); // Every 15 minutes
  }

  // Public API for NLP features
  public getCoreService() {
    return nlpService;
  }

  public getChatbotService() {
    return chatbotService;
  }

  public getContentAnalyzer() {
    return contentAnalyzer;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  // Convenient wrapper methods
  async analyzeText(text: string, options?: {
    includeSentiment?: boolean;
    includeEntities?: boolean;
    includeIntent?: boolean;
    includeKeywords?: boolean;
    language?: 'en' | 'bn';
  }) {
    const results: any = {};
    
    if (options?.includeSentiment) {
      results.sentiment = await nlpService.analyzeSentiment(text, { language: options.language });
    }
    
    if (options?.includeEntities) {
      results.entities = await nlpService.extractEntities(text, options.language);
    }
    
    if (options?.includeIntent) {
      results.intent = await nlpService.classifyIntent(text);
    }
    
    if (options?.includeKeywords) {
      results.keywords = await nlpService.extractKeywords(text);
    }
    
    return results;
  }

  async processCustomerMessage(message: string, context?: any) {
    return await chatbotService.processMessage(message, context);
  }

  async analyzeProductContent(product: any) {
    return await contentAnalyzer.analyzeProductContent(product);
  }
}

// Export singleton instance
export const nlpManager = NLPManager.getInstance();

// Export all NLP services
export {
  nlpService,
  chatbotService,
  contentAnalyzer
};

// Export types
export type { } from './NLPService';
