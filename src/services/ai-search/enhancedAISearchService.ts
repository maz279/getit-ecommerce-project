
import { nlpService } from '../nlp/NLPService';
import { chatbotService } from '../nlp/ChatbotService';
import { contentAnalyzer } from '../nlp/ContentAnalyzer';
import { aiSearchService } from './aiSearchService';
import { AISearchQuery, AISearchSuggestion } from './types';

export class EnhancedAISearchService {
  private static instance: EnhancedAISearchService;

  private constructor() {}

  public static getInstance(): EnhancedAISearchService {
    if (!EnhancedAISearchService.instance) {
      EnhancedAISearchService.instance = new EnhancedAISearchService();
    }
    return EnhancedAISearchService.instance;
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Enhanced AI Search with NLP...');
    await nlpService.initialize();
    console.log('✅ Enhanced AI Search Service ready');
  }

  // Enhanced Query Analysis with Advanced NLP
  async analyzeQueryAdvanced(query: string, options?: {
    language?: 'en' | 'bn';
    includeTranslation?: boolean;
    includeKeywords?: boolean;
  }): Promise<{
    basicAnalysis: AISearchQuery;
    nlpAnalysis: {
      sentiment: any;
      entities: any;
      intent: any;
      keywords?: any;
      translation?: any;
    };
    enhancedQuery: string;
    searchStrategies: string[];
  }> {
    console.log('AI Search: Performing advanced NLP analysis');

    // Get basic analysis from existing service
    const basicAnalysis = await aiSearchService.analyzeQuery(query);

    // Perform advanced NLP analysis
    const [sentiment, entities, intent] = await Promise.all([
      nlpService.analyzeSentiment(query, { 
        language: options?.language,
        detailed: true 
      }),
      nlpService.extractEntities(query, options?.language),
      nlpService.classifyIntent(query)
    ]);

    let keywords, translation;
    
    if (options?.includeKeywords) {
      keywords = await nlpService.extractKeywords(query, { maxKeywords: 5 });
    }

    if (options?.includeTranslation && options?.language) {
      translation = await nlpService.translateText(query, {
        from: 'auto',
        to: options.language === 'en' ? 'bn' : 'en'
      });
    }

    // Generate enhanced search query
    const enhancedQuery = await this.generateEnhancedQuery(query, {
      entities,
      intent,
      keywords
    });

    // Determine search strategies
    const searchStrategies = this.determineSearchStrategies(intent, sentiment, entities);

    return {
      basicAnalysis,
      nlpAnalysis: {
        sentiment,
        entities,
        intent,
        keywords,
        translation
      },
      enhancedQuery,
      searchStrategies
    };
  }

  // Conversational Search with Context Understanding
  async processConversationalSearch(
    query: string, 
    conversationHistory: Array<{ query: string; response: string }> = [],
    options?: {
      language?: 'en' | 'bn';
      userId?: string;
    }
  ): Promise<{
    response: string;
    searchQuery: string;
    intent: string;
    confidence: number;
    suggestions: string[];
    followUpQuestions: string[];
  }> {
    console.log('AI Search: Processing conversational search');

    // Use chatbot service for conversation processing
    const chatResponse = await chatbotService.processMessage(query, {
      language: options?.language,
      userId: options?.userId
    });

    // Extract search intent from conversation
    const searchQuery = await this.extractSearchQuery(query, chatResponse.intent);
    
    // Generate contextual follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(chatResponse.intent, options?.language);

    return {
      response: chatResponse.response,
      searchQuery,
      intent: chatResponse.intent,
      confidence: chatResponse.confidence,
      suggestions: chatResponse.suggestions,
      followUpQuestions
    };
  }

  // Smart Query Expansion with Semantic Understanding
  async expandQuerySemantically(query: string, options?: {
    language?: 'en' | 'bn';
    maxExpansions?: number;
    includeTranslation?: boolean;
  }): Promise<{
    originalQuery: string;
    expandedQueries: Array<{
      query: string;
      type: 'synonym' | 'semantic' | 'translation' | 'related';
      confidence: number;
    }>;
    semanticKeywords: string[];
    relatedConcepts: string[];
  }> {
    console.log('AI Search: Performing semantic query expansion');

    const maxExpansions = options?.maxExpansions || 8;
    
    // Extract keywords and entities for semantic expansion
    const [keywords, entities] = await Promise.all([
      nlpService.extractKeywords(query, { maxKeywords: 5 }),
      nlpService.extractEntities(query, options?.language)
    ]);

    // Generate semantic expansions
    const expandedQueries = [];
    
    // Synonym-based expansions
    for (const keyword of keywords.keywords.slice(0, 3)) {
      expandedQueries.push({
        query: query.replace(keyword.word, this.getSynonym(keyword.word)),
        type: 'synonym' as const,
        confidence: 0.8
      });
    }

    // Entity-based expansions
    for (const brand of entities.brands) {
      expandedQueries.push({
        query: `${query} ${brand} products`,
        type: 'related' as const,
        confidence: 0.9
      });
    }

    // Translation-based expansion
    if (options?.includeTranslation) {
      const translation = await nlpService.translateText(query, {
        from: 'auto',
        to: options?.language === 'en' ? 'bn' : 'en'
      });
      
      expandedQueries.push({
        query: translation.translatedText,
        type: 'translation' as const,
        confidence: translation.confidence
      });
    }

    // Semantic concept expansions
    const relatedConcepts = this.generateRelatedConcepts(keywords.keywords, entities);
    for (const concept of relatedConcepts.slice(0, 2)) {
      expandedQueries.push({
        query: `${query} ${concept}`,
        type: 'semantic' as const,
        confidence: 0.7
      });
    }

    return {
      originalQuery: query,
      expandedQueries: expandedQueries
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, maxExpansions),
      semanticKeywords: keywords.keywords.map(k => k.word),
      relatedConcepts
    };
  }

  // Intelligent Auto-Suggestions with Context
  async generateIntelligentSuggestions(
    partialQuery: string,
    context?: {
      userHistory?: string[];
      currentPage?: string;
      language?: 'en' | 'bn';
    }
  ): Promise<{
    suggestions: AISearchSuggestion[];
    contextualSuggestions: Array<{
      text: string;
      reason: string;
      confidence: number;
    }>;
    translationSuggestions?: string[];
  }> {
    console.log('AI Search: Generating intelligent suggestions');

    // Get basic AI suggestions
    const basicSuggestions = await aiSearchService.generateSmartSuggestions(partialQuery);

    // Analyze partial query for context
    const [intent, entities] = await Promise.all([
      nlpService.classifyIntent(partialQuery),
      nlpService.extractEntities(partialQuery, context?.language)
    ]);

    // Generate contextual suggestions based on intent
    const contextualSuggestions = this.generateContextualSuggestions(
      partialQuery, 
      intent, 
      entities, 
      context
    );

    // Generate translation suggestions if different language detected
    let translationSuggestions;
    if (context?.language) {
      const translation = await nlpService.translateText(partialQuery, {
        from: 'auto',
        to: context.language === 'en' ? 'bn' : 'en'
      });
      
      if (translation.detectedLanguage !== context.language) {
        translationSuggestions = [translation.translatedText];
      }
    }

    return {
      suggestions: basicSuggestions,
      contextualSuggestions,
      translationSuggestions
    };
  }

  // Content-Based Search Enhancement
  async enhanceSearchWithContent(
    query: string,
    searchResults: any[]
  ): Promise<{
    enhancedResults: Array<any & {
      nlpScore: number;
      contentAnalysis: any;
      relevanceReason: string;
    }>;
    queryInsights: {
      matchedConcepts: string[];
      semanticRelevance: number;
      contentQuality: string;
    };
  }> {
    console.log('AI Search: Enhancing search results with content analysis');

    const enhancedResults = [];
    
    for (const result of searchResults) {
      // Analyze result content
      const contentAnalysis = await contentAnalyzer.analyzeProductContent({
        title: result.title,
        description: result.description || '',
        category: result.category
      });

      // Calculate NLP-based relevance score
      const nlpScore = await this.calculateNLPRelevanceScore(query, result, contentAnalysis);
      
      // Generate relevance reason
      const relevanceReason = this.generateRelevanceReason(query, result, contentAnalysis);

      enhancedResults.push({
        ...result,
        nlpScore,
        contentAnalysis,
        relevanceReason
      });
    }

    // Sort by NLP score
    enhancedResults.sort((a, b) => b.nlpScore - a.nlpScore);

    // Generate query insights
    const [queryKeywords, queryEntities] = await Promise.all([
      nlpService.extractKeywords(query),
      nlpService.extractEntities(query)
    ]);

    const matchedConcepts = this.findMatchedConcepts(queryKeywords, enhancedResults);
    const semanticRelevance = this.calculateSemanticRelevance(query, enhancedResults);

    return {
      enhancedResults,
      queryInsights: {
        matchedConcepts,
        semanticRelevance,
        contentQuality: 'high' // Simplified
      }
    };
  }

  // Helper methods
  private async generateEnhancedQuery(
    originalQuery: string, 
    analysis: { entities: any; intent: any; keywords?: any }
  ): Promise<string> {
    let enhancedQuery = originalQuery;

    // Add relevant entities
    if (analysis.entities.brands.length > 0) {
      enhancedQuery += ` ${analysis.entities.brands.join(' ')}`;
    }

    // Add intent-specific terms
    if (analysis.intent.intent === 'comparison') {
      enhancedQuery += ' compare features specs';
    } else if (analysis.intent.intent === 'recommendation') {
      enhancedQuery += ' best recommended top rated';
    }

    return enhancedQuery.trim();
  }

  private determineSearchStrategies(intent: any, sentiment: any, entities: any): string[] {
    const strategies = ['keyword_match'];

    if (entities.brands.length > 0) strategies.push('brand_filter');
    if (entities.prices.length > 0) strategies.push('price_filter');
    if (intent.intent === 'comparison') strategies.push('comparison_mode');
    if (sentiment.sentiment === 'positive') strategies.push('quality_boost');

    return strategies;
  }

  private async extractSearchQuery(conversationalQuery: string, intent: string): Promise<string> {
    // Convert conversational query to search query
    const cleanQuery = conversationalQuery
      .replace(/please|can you|help me|find me|show me/gi, '')
      .replace(/\?/g, '')
      .trim();

    return cleanQuery || conversationalQuery;
  }

  private generateFollowUpQuestions(intent: string, language: 'en' | 'bn' = 'en'): string[] {
    const questions = {
      en: {
        search_product: ['What price range are you looking for?', 'Any specific brand preference?'],
        price_inquiry: ['Would you like to see similar products?', 'Are you interested in deals and offers?'],
        comparison: ['Which specific features matter most?', 'What\'s your budget for this purchase?']
      },
      bn: {
        search_product: ['আপনার দামের সীমা কত?', 'কোন নির্দিষ্ট ব্র্যান্ডের পছন্দ আছে?'],
        price_inquiry: ['অনুরূপ পণ্য দেখতে চান?', 'অফার এবং ডিলে আগ্রহী?'],
        comparison: ['কোন বৈশিষ্ট্যগুলো সবচেয়ে গুরুত্বপূর্ণ?', 'এই কেনাকাটার জন্য আপনার বাজেট কত?']
      }
    };

    return questions[language][intent as keyof typeof questions[typeof language]] || 
           questions[language].search_product;
  }

  private getSynonym(word: string): string {
    const synonyms: { [key: string]: string } = {
      'phone': 'mobile',
      'laptop': 'notebook',
      'cheap': 'affordable',
      'good': 'excellent',
      'fast': 'quick'
    };
    
    return synonyms[word.toLowerCase()] || word;
  }

  private generateRelatedConcepts(keywords: any[], entities: any): string[] {
    const concepts = [];
    
    // Add category-related concepts
    for (const keyword of keywords) {
      if (keyword.word === 'phone') concepts.push('accessories', 'cases', 'chargers');
      if (keyword.word === 'laptop') concepts.push('software', 'accessories', 'bags');
    }
    
    return concepts.slice(0, 5);
  }

  private generateContextualSuggestions(
    query: string, 
    intent: any, 
    entities: any, 
    context?: any
  ): Array<{ text: string; reason: string; confidence: number }> {
    const suggestions = [];

    if (intent.intent === 'search_product' && entities.brands.length > 0) {
      suggestions.push({
        text: `${query} latest model`,
        reason: 'Based on brand mention',
        confidence: 0.8
      });
    }

    if (context?.userHistory?.length > 0) {
      suggestions.push({
        text: `${query} similar to previous purchases`,
        reason: 'Based on purchase history',
        confidence: 0.7
      });
    }

    return suggestions;
  }

  private async calculateNLPRelevanceScore(query: string, result: any, contentAnalysis: any): Promise<number> {
    let score = 0.5; // Base score

    // Boost for high content quality
    if (contentAnalysis.contentQuality === 'high') score += 0.2;
    
    // Boost for positive sentiment in content
    if (contentAnalysis.sentiment.sentiment === 'positive') score += 0.15;
    
    // Boost for keyword matches
    const queryKeywords = await nlpService.extractKeywords(query);
    const contentKeywords = contentAnalysis.keywords.keywords.map((k: any) => k.word);
    const matches = queryKeywords.keywords.filter((qk: any) => 
      contentKeywords.some(ck => ck.includes(qk.word))
    ).length;
    
    score += Math.min(matches * 0.1, 0.3);

    return Math.min(score, 1.0);
  }

  private generateRelevanceReason(query: string, result: any, contentAnalysis: any): string {
    if (contentAnalysis.contentQuality === 'high') {
      return 'High-quality content matching your search';
    }
    if (contentAnalysis.sentiment.sentiment === 'positive') {
      return 'Highly rated product with positive reviews';
    }
    return 'Relevant to your search query';
  }

  private findMatchedConcepts(keywords: any, results: any[]): string[] {
    const concepts = new Set<string>();
    
    keywords.keywords.forEach((keyword: any) => {
      results.forEach(result => {
        if (result.title.toLowerCase().includes(keyword.word)) {
          concepts.add(keyword.word);
        }
      });
    });

    return Array.from(concepts);
  }

  private calculateSemanticRelevance(query: string, results: any[]): number {
    // Simplified semantic relevance calculation
    const queryWords = query.toLowerCase().split(' ');
    let totalRelevance = 0;

    results.forEach(result => {
      const titleWords = result.title.toLowerCase().split(' ');
      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw))).length;
      totalRelevance += matches / queryWords.length;
    });

    return results.length > 0 ? totalRelevance / results.length : 0;
  }
}

export const enhancedAISearchService = EnhancedAISearchService.getInstance();
