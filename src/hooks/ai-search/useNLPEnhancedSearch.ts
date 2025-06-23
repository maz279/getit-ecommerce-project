
import { useState, useCallback } from 'react';
import { enhancedAISearchService } from '@/services/ai-search/enhancedAISearchService';
import { nlpManager } from '@/services/nlp';
import { useAISearch } from './useAISearch';

interface NLPSearchState {
  nlpAnalysis: any;
  conversationMode: boolean;
  conversationHistory: Array<{ query: string; response: string }>;
  semanticSuggestions: any[];
  contentEnhancedResults: any[];
  isNLPProcessing: boolean;
  nlpError: string | null;
}

export const useNLPEnhancedSearch = () => {
  const baseAISearch = useAISearch();
  
  const [nlpState, setNLPState] = useState<NLPSearchState>({
    nlpAnalysis: null,
    conversationMode: false,
    conversationHistory: [],
    semanticSuggestions: [],
    contentEnhancedResults: [],
    isNLPProcessing: false,
    nlpError: null
  });

  // Initialize NLP services
  const initializeNLP = useCallback(async () => {
    try {
      await nlpManager.initialize();
      await enhancedAISearchService.initialize();
      console.log('NLP Enhanced Search initialized');
    } catch (error) {
      console.error('Failed to initialize NLP Enhanced Search:', error);
      setNLPState(prev => ({ ...prev, nlpError: 'Failed to initialize NLP services' }));
    }
  }, []);

  // Advanced query analysis with NLP
  const analyzeQueryWithNLP = useCallback(async (
    query: string, 
    options?: {
      language?: 'en' | 'bn';
      includeTranslation?: boolean;
      includeKeywords?: boolean;
    }
  ) => {
    setNLPState(prev => ({ ...prev, isNLPProcessing: true, nlpError: null }));
    
    try {
      const analysis = await enhancedAISearchService.analyzeQueryAdvanced(query, options);
      setNLPState(prev => ({ ...prev, nlpAnalysis: analysis }));
      return analysis;
    } catch (error) {
      console.error('NLP Query Analysis error:', error);
      setNLPState(prev => ({ ...prev, nlpError: 'Query analysis failed' }));
      return null;
    } finally {
      setNLPState(prev => ({ ...prev, isNLPProcessing: false }));
    }
  }, []);

  // Conversational search
  const searchConversationally = useCallback(async (
    query: string,
    options?: {
      language?: 'en' | 'bn';
      userId?: string;
    }
  ) => {
    setNLPState(prev => ({ 
      ...prev, 
      isNLPProcessing: true, 
      conversationMode: true,
      nlpError: null 
    }));
    
    try {
      const result = await enhancedAISearchService.processConversationalSearch(
        query, 
        nlpState.conversationHistory,
        options
      );
      
      // Update conversation history
      const newHistoryEntry = { query, response: result.response };
      setNLPState(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, newHistoryEntry]
      }));
      
      // Perform the actual search with the extracted query
      if (result.searchQuery) {
        await baseAISearch.searchWithAI(result.searchQuery);
      }
      
      return result;
    } catch (error) {
      console.error('Conversational search error:', error);
      setNLPState(prev => ({ ...prev, nlpError: 'Conversational search failed' }));
      return null;
    } finally {
      setNLPState(prev => ({ ...prev, isNLPProcessing: false }));
    }
  }, [baseAISearch, nlpState.conversationHistory]);

  // Semantic query expansion
  const expandQuerySemantically = useCallback(async (
    query: string,
    options?: {
      language?: 'en' | 'bn';
      maxExpansions?: number;
      includeTranslation?: boolean;
    }
  ) => {
    try {
      setNLPState(prev => ({ ...prev, isNLPProcessing: true }));
      
      const expansion = await enhancedAISearchService.expandQuerySemantically(query, options);
      return expansion;
    } catch (error) {
      console.error('Semantic expansion error:', error);
      return null;
    } finally {
      setNLPState(prev => ({ ...prev, isNLPProcessing: false }));
    }
  }, []);

  // Intelligent suggestions with NLP
  const getIntelligentSuggestions = useCallback(async (
    partialQuery: string,
    context?: {
      userHistory?: string[];
      currentPage?: string;
      language?: 'en' | 'bn';
    }
  ) => {
    try {
      const suggestions = await enhancedAISearchService.generateIntelligentSuggestions(
        partialQuery, 
        context
      );
      
      setNLPState(prev => ({ 
        ...prev, 
        semanticSuggestions: suggestions.contextualSuggestions 
      }));
      
      return suggestions;
    } catch (error) {
      console.error('Intelligent suggestions error:', error);
      return null;
    }
  }, []);

  // Content-enhanced search results
  const enhanceResultsWithContent = useCallback(async (
    query: string,
    results: any[]
  ) => {
    try {
      setNLPState(prev => ({ ...prev, isNLPProcessing: true }));
      
      const enhanced = await enhancedAISearchService.enhanceSearchWithContent(query, results);
      
      setNLPState(prev => ({ 
        ...prev, 
        contentEnhancedResults: enhanced.enhancedResults 
      }));
      
      return enhanced;
    } catch (error) {
      console.error('Content enhancement error:', error);
      return null;
    } finally {
      setNLPState(prev => ({ ...prev, isNLPProcessing: false }));
    }
  }, []);

  // Toggle conversation mode
  const toggleConversationMode = useCallback(() => {
    setNLPState(prev => ({ 
      ...prev, 
      conversationMode: !prev.conversationMode,
      conversationHistory: !prev.conversationMode ? [] : prev.conversationHistory
    }));
  }, []);

  // Clear conversation history
  const clearConversationHistory = useCallback(() => {
    setNLPState(prev => ({ 
      ...prev, 
      conversationHistory: [],
      conversationMode: false
    }));
  }, []);

  // Analyze content with NLP
  const analyzeContent = useCallback(async (content: {
    title?: string;
    description?: string;
    reviews?: string[];
    category?: string;
  }) => {
    try {
      return await nlpManager.analyzeProductContent(content);
    } catch (error) {
      console.error('Content analysis error:', error);
      return null;
    }
  }, []);

  // Process customer message
  const processCustomerMessage = useCallback(async (
    message: string,
    context?: any
  ) => {
    try {
      return await nlpManager.processCustomerMessage(message, context);
    } catch (error) {
      console.error('Customer message processing error:', error);
      return null;
    }
  }, []);

  return {
    // Base AI search functionality
    ...baseAISearch,
    
    // NLP state
    ...nlpState,
    
    // NLP operations
    initializeNLP,
    analyzeQueryWithNLP,
    searchConversationally,
    expandQuerySemantically,
    getIntelligentSuggestions,
    enhanceResultsWithContent,
    toggleConversationMode,
    clearConversationHistory,
    analyzeContent,
    processCustomerMessage,
    
    // Combined loading state
    isLoading: baseAISearch.isLoading || nlpState.isNLPProcessing,
    
    // Combined error state
    error: baseAISearch.error || nlpState.nlpError
  };
};
