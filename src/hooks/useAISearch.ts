
import { useState, useCallback } from 'react';
import { useSearch } from './useSearch';
import { aiSearchService, AISearchQuery, AISearchSuggestion, PersonalizedRecommendation } from '@/services/aiSearchService';

interface UseAISearchReturn {
  // Enhanced search methods
  searchWithAI: (query: string) => Promise<void>;
  processVoiceInput: (audioBlob: Blob, language: 'bn' | 'en') => Promise<void>;
  processImageSearch: (imageFile: File) => Promise<void>;
  processConversationalQuery: (query: string) => Promise<void>;
  
  // AI-powered suggestions and recommendations
  getAISuggestions: (partialQuery: string) => Promise<AISearchSuggestion[]>;
  getPersonalizedRecommendations: () => Promise<PersonalizedRecommendation[]>;
  
  // Query analysis and expansion
  analyzeQuery: (query: string) => Promise<AISearchQuery>;
  expandQuery: (query: string) => Promise<string[]>;
  
  // State
  aiSuggestions: AISearchSuggestion[];
  personalizedRecommendations: PersonalizedRecommendation[];
  queryAnalysis: AISearchQuery | null;
  isProcessingAI: boolean;
  aiError: string | null;
  
  // Base search functionality
  searchResults: any[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  clearResults: () => void;
}

export const useAISearch = (): UseAISearchReturn => {
  const baseSearch = useSearch();
  
  const [aiSuggestions, setAISuggestions] = useState<AISearchSuggestion[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [queryAnalysis, setQueryAnalysis] = useState<AISearchQuery | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  // Enhanced search with AI analysis
  const searchWithAI = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Search: Starting enhanced search for:', query);
      
      // Step 1: Analyze query with AI
      const analysis = await aiSearchService.analyzeQuery(query);
      setQueryAnalysis(analysis);
      console.log('AI Search: Query analysis:', analysis);

      // Step 2: Expand query with synonyms and related terms
      const expandedQueries = await aiSearchService.expandQuery(query);
      console.log('AI Search: Expanded queries:', expandedQueries);

      // Step 3: Process based on intent
      let finalQuery = query;
      
      if (analysis.intent === 'navigation') {
        console.log('AI Search: Navigation intent detected');
        // Handle navigation intent
      } else if (analysis.intent === 'comparison') {
        console.log('AI Search: Comparison intent detected');
        finalQuery = await aiSearchService.processConversationalQuery(query, []);
      } else if (analysis.intent === 'recommendation') {
        console.log('AI Search: Recommendation intent detected');
        // Get personalized recommendations
        const recommendations = await aiSearchService.getPersonalizedRecommendations();
        setPersonalizedRecommendations(recommendations);
      }

      // Step 4: Apply filters based on extracted entities
      const filters: any = {};
      if (analysis.price_range) {
        filters.priceMin = analysis.price_range.min;
        filters.priceMax = analysis.price_range.max;
      }
      if (analysis.category) filters.category = analysis.category;
      if (analysis.brand) filters.brand = analysis.brand;

      // Step 5: Execute search with AI enhancements
      await baseSearch.searchText(finalQuery, filters);
      
      console.log('AI Search: Enhanced search completed');
    } catch (error) {
      console.error('AI Search error:', error);
      setAIError('AI search failed. Falling back to basic search.');
      // Fallback to basic search
      await baseSearch.searchText(query);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch]);

  // Enhanced voice search with AI processing
  const processVoiceInput = useCallback(async (audioBlob: Blob, language: 'bn' | 'en') => {
    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Voice: Processing voice input with AI');
      
      // Step 1: Convert speech to text with context awareness
      const recognizedText = await aiSearchService.processVoiceInput(audioBlob, language);
      console.log('AI Voice: Recognized text:', recognizedText);

      // Step 2: Apply conversational processing
      const processedQuery = await aiSearchService.processConversationalQuery(recognizedText, []);
      
      // Step 3: Execute AI-enhanced search
      await searchWithAI(processedQuery);
      
    } catch (error) {
      console.error('AI Voice error:', error);
      setAIError('AI voice processing failed.');
      // Fallback to basic voice search
      await baseSearch.searchVoice(audioBlob, language);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch, searchWithAI]);

  // Enhanced image search with AI visual recognition
  const processImageSearch = useCallback(async (imageFile: File) => {
    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Image: Processing image with visual AI');
      
      // Step 1: Apply advanced image recognition
      const recognizedQuery = await aiSearchService.processImageSearch(imageFile);
      console.log('AI Image: Recognized query:', recognizedQuery);

      // Step 2: Execute AI-enhanced search
      await searchWithAI(recognizedQuery);
      
    } catch (error) {
      console.error('AI Image error:', error);
      setAIError('AI image processing failed.');
      // Fallback to basic image search
      await baseSearch.searchImage(imageFile);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch, searchWithAI]);

  // Process conversational queries
  const processConversationalQuery = useCallback(async (query: string) => {
    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Conversation: Processing conversational query');
      
      const processedQuery = await aiSearchService.processConversationalQuery(query, []);
      await searchWithAI(processedQuery);
      
    } catch (error) {
      console.error('AI Conversation error:', error);
      setAIError('Conversational processing failed.');
      await baseSearch.searchText(query);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch, searchWithAI]);

  // Get AI-powered smart suggestions
  const getAISuggestions = useCallback(async (partialQuery: string): Promise<AISearchSuggestion[]> => {
    if (!partialQuery.trim()) {
      setAISuggestions([]);
      return [];
    }

    try {
      console.log('AI Suggestions: Generating smart suggestions');
      
      const suggestions = await aiSearchService.generateSmartSuggestions(partialQuery);
      setAISuggestions(suggestions);
      
      return suggestions;
    } catch (error) {
      console.error('AI Suggestions error:', error);
      return [];
    }
  }, []);

  // Get personalized recommendations
  const getPersonalizedRecommendations = useCallback(async (): Promise<PersonalizedRecommendation[]> => {
    try {
      console.log('AI Recommendations: Getting personalized recommendations');
      
      const recommendations = await aiSearchService.getPersonalizedRecommendations();
      setPersonalizedRecommendations(recommendations);
      
      return recommendations;
    } catch (error) {
      console.error('AI Recommendations error:', error);
      return [];
    }
  }, []);

  // Analyze query with AI
  const analyzeQuery = useCallback(async (query: string): Promise<AISearchQuery> => {
    try {
      const analysis = await aiSearchService.analyzeQuery(query);
      setQueryAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error('AI Analysis error:', error);
      throw error;
    }
  }, []);

  // Expand query with AI
  const expandQuery = useCallback(async (query: string): Promise<string[]> => {
    try {
      return await aiSearchService.expandQuery(query);
    } catch (error) {
      console.error('AI Expansion error:', error);
      return [query];
    }
  }, []);

  // Enhanced clear results
  const clearResults = useCallback(() => {
    baseSearch.clearResults();
    setAISuggestions([]);
    setPersonalizedRecommendations([]);
    setQueryAnalysis(null);
    setAIError(null);
  }, [baseSearch]);

  return {
    // Enhanced AI methods
    searchWithAI,
    processVoiceInput,
    processImageSearch,
    processConversationalQuery,
    getAISuggestions,
    getPersonalizedRecommendations,
    analyzeQuery,
    expandQuery,

    // AI state
    aiSuggestions,
    personalizedRecommendations,
    queryAnalysis,
    isProcessingAI,
    aiError,

    // Base search functionality
    searchResults: baseSearch.searchResults,
    suggestions: baseSearch.suggestions,
    isLoading: baseSearch.isLoading || isProcessingAI,
    error: baseSearch.error || aiError,
    clearResults
  };
};
