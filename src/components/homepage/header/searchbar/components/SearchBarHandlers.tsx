
import { useCallback } from 'react';
import { UseAISearchReturn } from '@/hooks/useAISearch';

interface SearchBarHandlersProps {
  aiSearch: UseAISearchReturn;
  isAIMode: boolean;
  voiceLanguage: 'bn' | 'en';
  setShowResults: (show: boolean) => void;
  setShowSuggestions: (show: boolean) => void;
}

export const useSearchBarHandlers = ({
  aiSearch,
  isAIMode,
  voiceLanguage,
  setShowResults,
  setShowSuggestions
}: SearchBarHandlersProps) => {
  
  // Enhanced voice search handler
  const handleVoiceSearch = useCallback(async (audioBlob: Blob) => {
    try {
      if (isAIMode) {
        console.log('Processing voice search with AI');
        await aiSearch.processVoiceInput(audioBlob, voiceLanguage);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Voice search failed:', error);
    }
  }, [aiSearch, isAIMode, voiceLanguage, setShowResults, setShowSuggestions]);

  // Enhanced image search handler
  const handleImageSearch = useCallback(async (file: File) => {
    try {
      if (isAIMode) {
        console.log('Processing image search with AI');
        await aiSearch.processImageSearch(file);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Image search failed:', error);
    }
  }, [aiSearch, isAIMode, setShowResults, setShowSuggestions]);

  // Enhanced QR search handler
  const handleQRSearch = useCallback(async (file: File) => {
    try {
      if (isAIMode) {
        console.log('Processing QR search with AI');
        await aiSearch.processImageSearch(file);
      }
      setShowResults(true);
      setShowSuggestions(false);
    } catch (error) {
      console.error('QR search failed:', error);
    }
  }, [aiSearch, isAIMode, setShowResults, setShowSuggestions]);

  return {
    handleVoiceSearch,
    handleImageSearch,
    handleQRSearch
  };
};
