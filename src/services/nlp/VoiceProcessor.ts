
export interface VoiceSearchResult {
  transcript: string;
  confidence: number;
  language: 'en' | 'bn';
  intent: {
    type: 'search' | 'navigation' | 'command' | 'question';
    action: string;
    entities: any[];
  };
  searchQuery?: string;
  navigationTarget?: string;
  commandAction?: string;
}

export interface VoiceCommerceAction {
  action: 'add_to_cart' | 'purchase' | 'search_product' | 'check_status' | 'navigate';
  confidence: number;
  parameters: {
    productName?: string;
    quantity?: number;
    category?: string;
    orderId?: string;
    destination?: string;
  };
  confirmationRequired: boolean;
  response: string;
}

export class VoiceProcessor {
  private static instance: VoiceProcessor;
  private isInitialized = false;
  private supportedLanguages = ['en-US', 'bn-BD'];

  public static getInstance(): VoiceProcessor {
    if (!VoiceProcessor.instance) {
      VoiceProcessor.instance = new VoiceProcessor();
    }
    return VoiceProcessor.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('🎤 Initializing Voice Processor...');
    
    // Check browser support for speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
    }
    
    this.isInitialized = true;
    console.log('✅ Voice Processor initialized');
  }

  // Process voice search input
  async processVoiceSearch(audioBlob: Blob, language: 'en' | 'bn' = 'en'): Promise<VoiceSearchResult> {
    console.log('Voice: Processing voice search input');
    
    // Simulate speech-to-text conversion
    const transcript = await this.convertSpeechToText(audioBlob, language);
    
    // Analyze the transcript for intent
    const intent = await this.analyzeVoiceIntent(transcript, language);
    
    const result: VoiceSearchResult = {
      transcript,
      confidence: 0.85,
      language,
      intent
    };

    // Add specific fields based on intent type
    switch (intent.type) {
      case 'search':
        result.searchQuery = this.extractSearchQuery(transcript, intent.entities);
        break;
      case 'navigation':
        result.navigationTarget = this.extractNavigationTarget(transcript, intent.entities);
        break;
      case 'command':
        result.commandAction = intent.action;
        break;
    }

    return result;
  }

  // Process voice commerce commands
  async processVoiceCommerce(transcript: string, userId?: string): Promise<VoiceCommerceAction> {
    console.log('Voice Commerce: Processing command:', transcript);
    
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Analyze commerce intent
    const commerceAction = this.analyzeCommerceIntent(normalizedTranscript);
    const parameters = this.extractCommerceParameters(normalizedTranscript);
    const confirmationRequired = this.requiresConfirmation(commerceAction, parameters);
    const response = this.generateVoiceResponse(commerceAction, parameters);

    return {
      action: commerceAction,
      confidence: 0.8,
      parameters,
      confirmationRequired,
      response
    };
  }

  // Start continuous voice listening
  startVoiceListening(
    onResult: (result: VoiceSearchResult) => void,
    onError: (error: string) => void,
    language: 'en' | 'bn' = 'en'
  ): () => void {
    console.log('Voice: Starting continuous listening');

    // Mock implementation - in real app would use Web Speech API
    let isListening = true;
    
    const simulateListening = () => {
      if (!isListening) return;
      
      // Simulate voice detection every 3-5 seconds
      setTimeout(() => {
        if (isListening && Math.random() > 0.7) {
          // Simulate voice input
          const mockTranscript = this.generateMockVoiceInput(language);
          this.processVoiceSearch(new Blob(), language)
            .then(result => {
              result.transcript = mockTranscript;
              onResult(result);
            })
            .catch(error => onError(error.message));
        }
        simulateListening();
      }, Math.random() * 2000 + 3000);
    };
    
    simulateListening();
    
    return () => {
      console.log('Voice: Stopping listening');
      isListening = false;
    };
  }

  // Voice-activated shopping assistant
  async createVoiceShoppingSession(userId: string): Promise<{
    sessionId: string;
    welcomeMessage: string;
    availableCommands: string[];
  }> {
    const sessionId = `voice_session_${Date.now()}_${userId}`;
    
    return {
      sessionId,
      welcomeMessage: "Hello! I'm your voice shopping assistant. You can ask me to search for products, add items to your cart, or check your orders.",
      availableCommands: [
        "Search for [product name]",
        "Add [product] to my cart",
        "What's in my cart?",
        "Check my order status",
        "Find deals on [category]",
        "Show me trending products"
      ]
    };
  }

  // Smart voice search with context
  async contextualVoiceSearch(
    transcript: string,
    context: {
      currentPage?: string;
      browsedProducts?: string[];
      searchHistory?: string[];
      userPreferences?: any;
    }
  ): Promise<VoiceSearchResult & {
    contextualSuggestions: string[];
    refinedQuery: string;
  }> {
    const baseResult = await this.processVoiceSearch(new Blob(), 'en');
    baseResult.transcript = transcript;

    // Enhance search with context
    const contextualSuggestions = this.generateContextualSuggestions(transcript, context);
    const refinedQuery = this.refineQueryWithContext(transcript, context);

    return {
      ...baseResult,
      contextualSuggestions,
      refinedQuery
    };
  }

  // Private helper methods
  private async convertSpeechToText(audioBlob: Blob, language: 'en' | 'bn'): Promise<string> {
    // Mock speech-to-text conversion
    const mockTranscripts = {
      en: [
        "search for wireless headphones",
        "show me red dresses for wedding",
        "add iPhone to cart",
        "what are the best laptops under 50000 taka",
        "find electronics on sale"
      ],
      bn: [
        "ওয়্যারলেস হেডফোন খুঁজুন",
        "বিয়ের জন্য লাল শাড়ি দেখান",
        "আইফোন কার্টে যোগ করুন",
        "৫০০০০ টাকার মধ্যে সেরা ল্যাপটপ কি",
        "ইলেকট্রনিক্স অফার দেখান"
      ]
    };

    return mockTranscripts[language][Math.floor(Math.random() * mockTranscripts[language].length)];
  }

  private async analyzeVoiceIntent(transcript: string, language: 'en' | 'bn'): Promise<any> {
    const lowerTranscript = transcript.toLowerCase();
    
    // Search intent patterns
    const searchPatterns = {
      en: ['search for', 'find', 'show me', 'looking for', 'i want', 'need'],
      bn: ['খুঁজুন', 'দেখান', 'চাই', 'প্রয়োজন', 'খোঁজা']
    };

    // Navigation intent patterns
    const navPatterns = {
      en: ['go to', 'open', 'navigate to', 'take me to'],
      bn: ['যান', 'খুলুন', 'নিয়ে যান']
    };

    // Command intent patterns
    const commandPatterns = {
      en: ['add to cart', 'purchase', 'buy', 'order', 'checkout'],
      bn: ['কার্টে যোগ', 'কিনুন', 'অর্ডার', 'কেনাকাটা']
    };

    const patterns = { search: searchPatterns[language], nav: navPatterns[language], command: commandPatterns[language] };

    if (patterns.search.some(pattern => lowerTranscript.includes(pattern))) {
      return {
        type: 'search',
        action: 'product_search',
        entities: this.extractEntities(transcript)
      };
    }

    if (patterns.nav.some(pattern => lowerTranscript.includes(pattern))) {
      return {
        type: 'navigation',
        action: 'navigate',
        entities: this.extractEntities(transcript)
      };
    }

    if (patterns.command.some(pattern => lowerTranscript.includes(pattern))) {
      return {
        type: 'command',
        action: 'commerce_action',
        entities: this.extractEntities(transcript)
      };
    }

    return {
      type: 'question',
      action: 'general_inquiry',
      entities: []
    };
  }

  private extractEntities(transcript: string): any[] {
    const entities = [];
    
    // Extract product names, brands, categories
    const productKeywords = ['phone', 'laptop', 'dress', 'shoes', 'headphones', 'watch'];
    const brands = ['samsung', 'apple', 'nike', 'adidas', 'sony'];
    const categories = ['electronics', 'fashion', 'home', 'sports'];

    productKeywords.forEach(keyword => {
      if (transcript.toLowerCase().includes(keyword)) {
        entities.push({ type: 'product', value: keyword });
      }
    });

    brands.forEach(brand => {
      if (transcript.toLowerCase().includes(brand)) {
        entities.push({ type: 'brand', value: brand });
      }
    });

    categories.forEach(category => {
      if (transcript.toLowerCase().includes(category)) {
        entities.push({ type: 'category', value: category });
      }
    });

    return entities;
  }

  private extractSearchQuery(transcript: string, entities: any[]): string {
    // Remove common search prefixes and extract the actual query
    const searchPrefixes = ['search for', 'find', 'show me', 'looking for', 'i want', 'need'];
    let query = transcript.toLowerCase();
    
    searchPrefixes.forEach(prefix => {
      query = query.replace(prefix, '').trim();
    });

    return query || transcript;
  }

  private extractNavigationTarget(transcript: string, entities: any[]): string {
    const navPrefixes = ['go to', 'open', 'navigate to', 'take me to'];
    let target = transcript.toLowerCase();
    
    navPrefixes.forEach(prefix => {
      target = target.replace(prefix, '').trim();
    });

    return target || 'home';
  }

  private analyzeCommerceIntent(transcript: string): VoiceCommerceAction['action'] {
    if (transcript.includes('add to cart') || transcript.includes('cart')) return 'add_to_cart';
    if (transcript.includes('buy') || transcript.includes('purchase')) return 'purchase';
    if (transcript.includes('search') || transcript.includes('find')) return 'search_product';
    if (transcript.includes('order status') || transcript.includes('track')) return 'check_status';
    return 'navigate';
  }

  private extractCommerceParameters(transcript: string): any {
    const parameters: any = {};
    
    // Extract product name
    const productMatch = transcript.match(/(?:add|buy|search for)\s+(.+?)(?:\s+to|$)/i);
    if (productMatch) {
      parameters.productName = productMatch[1].trim();
    }

    // Extract quantity
    const quantityMatch = transcript.match(/(\d+)\s+(?:pieces?|items?|units?)/i);
    if (quantityMatch) {
      parameters.quantity = parseInt(quantityMatch[1]);
    }

    return parameters;
  }

  private requiresConfirmation(action: string, parameters: any): boolean {
    return ['purchase', 'add_to_cart'].includes(action) && parameters.productName;
  }

  private generateVoiceResponse(action: string, parameters: any): string {
    switch (action) {
      case 'add_to_cart':
        return parameters.productName 
          ? `Adding ${parameters.productName} to your cart. Is this correct?`
          : 'What would you like to add to your cart?';
      
      case 'purchase':
        return parameters.productName
          ? `Ready to purchase ${parameters.productName}. Should I proceed with checkout?`
          : 'What would you like to purchase?';
      
      case 'search_product':
        return parameters.productName
          ? `Searching for ${parameters.productName}. Here are the results.`
          : 'What product are you looking for?';
      
      default:
        return 'How can I help you with your shopping today?';
    }
  }

  private generateMockVoiceInput(language: 'en' | 'bn'): string {
    const mockInputs = {
      en: ['search for headphones', 'show me new arrivals', 'add to cart'],
      bn: ['হেডফোন খুঁজুন', 'নতুন পণ্য দেখান', 'কার্টে যোগ করুন']
    };
    
    const inputs = mockInputs[language];
    return inputs[Math.floor(Math.random() * inputs.length)];
  }

  private generateContextualSuggestions(transcript: string, context: any): string[] {
    const suggestions = [];
    
    if (context.browsedProducts?.length > 0) {
      suggestions.push(`Similar to ${context.browsedProducts[0]}`);
    }
    
    if (context.searchHistory?.length > 0) {
      suggestions.push(`Related to your recent search: ${context.searchHistory[0]}`);
    }
    
    if (context.currentPage === 'electronics') {
      suggestions.push('Best electronics deals');
      suggestions.push('Tech accessories');
    }
    
    return suggestions;
  }

  private refineQueryWithContext(transcript: string, context: any): string {
    let refinedQuery = transcript;
    
    // Add category context if on specific page
    if (context.currentPage && !transcript.includes(context.currentPage)) {
      refinedQuery += ` in ${context.currentPage}`;
    }
    
    // Add preference context
    if (context.userPreferences?.brands?.length > 0) {
      const preferredBrand = context.userPreferences.brands[0];
      if (!transcript.toLowerCase().includes(preferredBrand.toLowerCase())) {
        refinedQuery += ` ${preferredBrand} preferred`;
      }
    }
    
    return refinedQuery;
  }
}

export const voiceProcessor = VoiceProcessor.getInstance();
