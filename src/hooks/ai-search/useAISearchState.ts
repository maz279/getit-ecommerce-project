
import { useState } from 'react';
import { AISearchQuery, AISearchSuggestion, PersonalizedRecommendation } from '@/services/aiSearchService';
import { AISearchState } from './types';

export const useAISearchState = (): AISearchState & {
  setAISuggestions: (suggestions: AISearchSuggestion[]) => void;
  setPersonalizedRecommendations: (recommendations: PersonalizedRecommendation[]) => void;
  setQueryAnalysis: (analysis: AISearchQuery | null) => void;
  setIsProcessingAI: (processing: boolean) => void;
  setAIError: (error: string | null) => void;
  clearAIState: () => void;
} => {
  const [aiSuggestions, setAISuggestions] = useState<AISearchSuggestion[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [queryAnalysis, setQueryAnalysis] = useState<AISearchQuery | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  const clearAIState = () => {
    setAISuggestions([]);
    setPersonalizedRecommendations([]);
    setQueryAnalysis(null);
    setAIError(null);
  };

  return {
    aiSuggestions,
    personalizedRecommendations,
    queryAnalysis,
    isProcessingAI,
    aiError,
    setAISuggestions,
    setPersonalizedRecommendations,
    setQueryAnalysis,
    setIsProcessingAI,
    setAIError,
    clearAIState
  };
};
