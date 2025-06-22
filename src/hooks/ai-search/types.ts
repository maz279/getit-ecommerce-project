
import { AISearchQuery, AISearchSuggestion, PersonalizedRecommendation } from '@/services/aiSearchService';

export interface AISearchState {
  aiSuggestions: AISearchSuggestion[];
  personalizedRecommendations: PersonalizedRecommendation[];
  queryAnalysis: AISearchQuery | null;
  isProcessingAI: boolean;
  aiError: string | null;
}

export interface AISearchOperations {
  searchWithAI: (query: string) => Promise<void>;
  processVoiceInput: (audioBlob: Blob, language: 'bn' | 'en') => Promise<void>;
  processImageSearch: (imageFile: File) => Promise<void>;
  processConversationalQuery: (query: string) => Promise<void>;
  getAISuggestions: (partialQuery: string) => Promise<AISearchSuggestion[]>;
  getPersonalizedRecommendations: () => Promise<PersonalizedRecommendation[]>;
  analyzeQuery: (query: string) => Promise<AISearchQuery>;
  expandQuery: (query: string) => Promise<string[]>;
  applyFilters: (filters: any) => void;
}

export interface UseAISearchReturn extends AISearchState, AISearchOperations {
  // Base search functionality
  searchResults: any[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  clearResults: () => void;
}
