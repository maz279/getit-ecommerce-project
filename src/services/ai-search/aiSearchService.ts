
import { QueryAnalyzer } from './queryAnalyzer';
import { SuggestionEngine } from './suggestionEngine';
import { MediaProcessor } from './mediaProcessor';
import { RecommendationEngine } from './recommendationEngine';
import { ConversationalProcessor } from './conversationalProcessor';
import { AISearchQuery, AISearchSuggestion, PersonalizedRecommendation } from './types';

class AISearchService {
  private queryAnalyzer: QueryAnalyzer;
  private suggestionEngine: SuggestionEngine;
  private mediaProcessor: MediaProcessor;
  private recommendationEngine: RecommendationEngine;
  private conversationalProcessor: ConversationalProcessor;

  constructor() {
    this.queryAnalyzer = new QueryAnalyzer();
    this.suggestionEngine = new SuggestionEngine();
    this.mediaProcessor = new MediaProcessor();
    this.recommendationEngine = new RecommendationEngine();
    this.conversationalProcessor = new ConversationalProcessor();
  }

  // Query Analysis
  async analyzeQuery(query: string): Promise<AISearchQuery> {
    return this.queryAnalyzer.analyzeQuery(query);
  }

  async expandQuery(query: string): Promise<string[]> {
    return this.queryAnalyzer.expandQuery(query);
  }

  // Smart Suggestions
  async generateSmartSuggestions(partialQuery: string): Promise<AISearchSuggestion[]> {
    return this.suggestionEngine.generateSmartSuggestions(partialQuery);
  }

  // Media Processing
  async processVoiceInput(audioBlob: Blob, language: 'bn' | 'en'): Promise<string> {
    return this.mediaProcessor.processVoiceInput(audioBlob, language);
  }

  async processImageSearch(imageFile: File): Promise<string> {
    return this.mediaProcessor.processImageSearch(imageFile);
  }

  // Recommendations
  async getPersonalizedRecommendations(userId?: string): Promise<PersonalizedRecommendation[]> {
    return this.recommendationEngine.getPersonalizedRecommendations(userId);
  }

  // Conversational Processing
  async processConversationalQuery(query: string, context: any[]): Promise<string> {
    return this.conversationalProcessor.processConversationalQuery(query, context);
  }
}

export const aiSearchService = new AISearchService();
