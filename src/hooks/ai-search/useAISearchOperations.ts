
import { useCallback } from 'react';
import { aiSearchService, AISearchQuery, AISearchSuggestion, PersonalizedRecommendation } from '@/services/aiSearchService';
import { useSearch } from '../useSearch';
import { AISearchOperations } from './types';

interface UseAISearchOperationsProps {
  setAISuggestions: (suggestions: AISearchSuggestion[]) => void;
  setPersonalizedRecommendations: (recommendations: PersonalizedRecommendation[]) => void;
  setQueryAnalysis: (analysis: AISearchQuery | null) => void;
  setIsProcessingAI: (processing: boolean) => void;
  setAIError: (error: string | null) => void;
}

export const useAISearchOperations = ({
  setAISuggestions,
  setPersonalizedRecommendations,
  setQueryAnalysis,
  setIsProcessingAI,
  setAIError
}: UseAISearchOperationsProps): AISearchOperations => {
  const baseSearch = useSearch();

  const searchWithAI = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Search: Starting enhanced search for:', query);
      
      const analysis = await aiSearchService.analyzeQuery(query);
      setQueryAnalysis(analysis);
      console.log('AI Search: Query analysis:', analysis);

      const expandedQueries = await aiSearchService.expandQuery(query);
      console.log('AI Search: Expanded queries:', expandedQueries);

      let finalQuery = query;
      
      if (analysis.intent === 'navigation') {
        console.log('AI Search: Navigation intent detected');
      } else if (analysis.intent === 'comparison') {
        console.log('AI Search: Comparison intent detected');
        finalQuery = await aiSearchService.processConversationalQuery(query, []);
      } else if (analysis.intent === 'recommendation') {
        console.log('AI Search: Recommendation intent detected');
        const recommendations = await aiSearchService.getPersonalizedRecommendations();
        setPersonalizedRecommendations(recommendations);
      }

      const filters: any = {};
      if (analysis.price_range) {
        filters.priceMin = analysis.price_range.min;
        filters.priceMax = analysis.price_range.max;
      }
      if (analysis.category) filters.category = analysis.category;
      if (analysis.brand) filters.brand = analysis.brand;

      await baseSearch.searchText(finalQuery, filters);
      
      console.log('AI Search: Enhanced search completed');
    } catch (error) {
      console.error('AI Search error:', error);
      setAIError('AI search failed. Falling back to basic search.');
      await baseSearch.searchText(query);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch, setAISuggestions, setPersonalizedRecommendations, setQueryAnalysis, setIsProcessingAI, setAIError]);

  const processVoiceInput = useCallback(async (audioBlob: Blob, language: 'bn' | 'en') => {
    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Voice: Processing voice input with AI');
      
      const recognizedText = await aiSearchService.processVoiceInput(audioBlob, language);
      console.log('AI Voice: Recognized text:', recognizedText);

      const processedQuery = await aiSearchService.processConversationalQuery(recognizedText, []);
      await searchWithAI(processedQuery);
      
    } catch (error) {
      console.error('AI Voice error:', error);
      setAIError('AI voice processing failed.');
      await baseSearch.searchVoice(audioBlob, language);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch, searchWithAI, setIsProcessingAI, setAIError]);

  const processImageSearch = useCallback(async (imageFile: File) => {
    setIsProcessingAI(true);
    setAIError(null);

    try {
      console.log('AI Image: Processing image with visual AI');
      
      const recognizedQuery = await aiSearchService.processImageSearch(imageFile);
      console.log('AI Image: Recognized query:', recognizedQuery);

      await searchWithAI(recognizedQuery);
      
    } catch (error) {
      console.error('AI Image error:', error);
      setAIError('AI image processing failed.');
      await baseSearch.searchImage(imageFile);
    } finally {
      setIsProcessingAI(false);
    }
  }, [baseSearch, searchWithAI, setIsProcessingAI, setAIError]);

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
  }, [baseSearch, searchWithAI, setIsProcessingAI, setAIError]);

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
  }, [setAISuggestions]);

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
  }, [setPersonalizedRecommendations]);

  const analyzeQuery = useCallback(async (query: string): Promise<AISearchQuery> => {
    try {
      const analysis = await aiSearchService.analyzeQuery(query);
      setQueryAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error('AI Analysis error:', error);
      throw error;
    }
  }, [setQueryAnalysis]);

  const expandQuery = useCallback(async (query: string): Promise<string[]> => {
    try {
      return await aiSearchService.expandQuery(query);
    } catch (error) {
      console.error('AI Expansion error:', error);
      return [query];
    }
  }, []);

  const applyFilters = useCallback((filters: any) => {
    console.log('Applying filters:', filters);
    if (baseSearch.applyFilters) {
      baseSearch.applyFilters(filters);
    }
  }, [baseSearch]);

  return {
    searchWithAI,
    processVoiceInput,
    processImageSearch,
    processConversationalQuery,
    getAISuggestions,
    getPersonalizedRecommendations,
    analyzeQuery,
    expandQuery,
    applyFilters
  };
};
