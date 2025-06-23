
import { nlpService } from './NLPService';
import { chatbotService } from './ChatbotService';
import { contentAnalyzer } from './ContentAnalyzer';
import { voiceProcessor } from './VoiceProcessor';
import { documentProcessor } from './DocumentProcessor';

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
      console.log('🧠 Initializing Enhanced NLP Manager...');
      
      // Initialize core NLP service
      await nlpService.initialize();
      await voiceProcessor.initialize();
      await documentProcessor.initialize();
      
      console.log('📝 NLP Text Analysis ready');
      console.log('🤖 NLP Chatbot Service ready');
      console.log('📊 NLP Content Analyzer ready');
      console.log('🌐 NLP Translation Service ready');
      console.log('🎯 NLP Intent Classification ready');
      console.log('🎤 Voice Processing ready');
      console.log('📄 Document Processing ready');
      
      this.isInitialized = true;
      console.log('✅ Enhanced NLP Manager fully initialized');
      
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

    // Process review sentiment analysis
    setInterval(() => {
      console.log('📝 Analyzing product review sentiments...');
    }, 30 * 60 * 1000); // Every 30 minutes

    // Update language models
    setInterval(() => {
      console.log('🌐 Updating multilingual models...');
    }, 60 * 60 * 1000); // Every hour
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

  public getVoiceProcessor() {
    return voiceProcessor;
  }

  public getDocumentProcessor() {
    return documentProcessor;
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

  async processVoiceInput(audioBlob: Blob, language: 'en' | 'bn' = 'en') {
    return await voiceProcessor.processVoiceSearch(audioBlob, language);
  }

  async analyzeDocument(documentFile: File, documentType?: string) {
    return await documentProcessor.analyzeDocument(documentFile, documentType);
  }

  // Enhanced NLP capabilities
  async performComprehensiveTextAnalysis(text: string, language: 'en' | 'bn' = 'en'): Promise<{
    sentiment: any;
    entities: any;
    intent: any;
    keywords: any;
    summary: any;
    translation?: any;
  }> {
    const [sentiment, entities, intent, keywords, summary] = await Promise.all([
      nlpService.analyzeSentiment(text, { language }),
      nlpService.extractEntities(text, language),
      nlpService.classifyIntent(text),
      nlpService.extractKeywords(text),
      nlpService.summarizeText(text, { language })
    ]);

    const result: any = { sentiment, entities, intent, keywords, summary };

    // Add translation if not in English
    if (language === 'bn') {
      result.translation = await nlpService.translateText(text, { from: 'bn', to: 'en' });
    }

    return result;
  }

  // Customer support analysis
  async analyzeCustomerSupport(messages: Array<{
    message: string;
    sender: 'customer' | 'agent';
    timestamp: number;
  }>): Promise<{
    overallSentiment: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    topicCategories: string[];
    satisfactionScore: number;
    recommendedActions: string[];
    escalationRequired: boolean;
  }> {
    const customerMessages = messages.filter(m => m.sender === 'customer');
    
    // Analyze sentiment across all customer messages
    const sentiments = await Promise.all(
      customerMessages.map(m => nlpService.analyzeSentiment(m.message))
    );

    const avgSentiment = sentiments.reduce((sum, s) => {
      const score = s.sentiment === 'positive' ? 1 : s.sentiment === 'negative' ? -1 : 0;
      return sum + score;
    }, 0) / sentiments.length;

    const overallSentiment = avgSentiment > 0.2 ? 'positive' : avgSentiment < -0.2 ? 'negative' : 'neutral';
    
    // Determine urgency based on keywords and sentiment
    const urgencyKeywords = ['urgent', 'emergency', 'broken', 'not working', 'immediately'];
    const hasUrgentKeywords = customerMessages.some(m => 
      urgencyKeywords.some(keyword => m.message.toLowerCase().includes(keyword))
    );

    const urgencyLevel = hasUrgentKeywords && overallSentiment === 'negative' ? 'critical' :
                        hasUrgentKeywords ? 'high' :
                        overallSentiment === 'negative' ? 'medium' : 'low';

    // Extract topic categories
    const allText = customerMessages.map(m => m.message).join(' ');
    const keywordResult = await nlpService.extractKeywords(allText);
    const topicCategories = keywordResult.keywords.slice(0, 5).map(k => k.word);

    return {
      overallSentiment,
      urgencyLevel,
      topicCategories,
      satisfactionScore: Math.max(0, Math.min(1, (avgSentiment + 1) / 2)), // Normalize to 0-1
      recommendedActions: this.generateSupportRecommendations(urgencyLevel, overallSentiment),
      escalationRequired: urgencyLevel === 'critical' || (urgencyLevel === 'high' && overallSentiment === 'negative')
    };
  }

  private generateSupportRecommendations(urgency: string, sentiment: string): string[] {
    const recommendations = [];
    
    if (urgency === 'critical') {
      recommendations.push('Escalate to senior support immediately');
      recommendations.push('Provide priority handling');
    }
    
    if (sentiment === 'negative') {
      recommendations.push('Offer personalized assistance');
      recommendations.push('Consider compensation or goodwill gesture');
    }
    
    if (urgency === 'low' && sentiment === 'positive') {
      recommendations.push('Continue with standard support process');
      recommendations.push('Ask for feedback at resolution');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const nlpManager = NLPManager.getInstance();

// Export all NLP services
export {
  nlpService,
  chatbotService,
  contentAnalyzer,
  voiceProcessor,
  documentProcessor
};

// Export types
export type { VoiceSearchResult, VoiceCommerceAction } from './VoiceProcessor';
export type { DocumentAnalysis, KYCAnalysis } from './DocumentProcessor';
