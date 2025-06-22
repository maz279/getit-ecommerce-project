
import { useState, useCallback } from 'react';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'vendor' | 'brand';
  image?: string;
  price?: number;
  rating?: number;
  description?: string;
}

interface UseSearchReturn {
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  searchText: (query: string) => Promise<void>;
  searchVoice: (audioBlob: Blob) => Promise<void>;
  searchImage: (imageFile: File) => Promise<void>;
  searchQR: (imageFile: File) => Promise<void>;
  clearResults: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Samsung Galaxy S24',
      type: 'product',
      image: '/placeholder.svg',
      price: 89999,
      rating: 4.5,
      description: 'Latest Samsung flagship smartphone'
    },
    {
      id: '2',
      title: 'Nike Air Max',
      type: 'product',
      image: '/placeholder.svg',
      price: 12999,
      rating: 4.3,
      description: 'Premium running shoes'
    },
    {
      id: '3',
      title: 'TechHub Electronics',
      type: 'vendor',
      rating: 4.8,
      description: 'Verified electronics vendor'
    },
    {
      id: '4',
      title: 'Apple',
      type: 'brand',
      description: 'Premium technology brand'
    }
  ];

  const searchText = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filtered);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchVoice = useCallback(async (audioBlob: Blob) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        // Simulate voice-to-text conversion
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock voice search result
        const voiceQuery = 'mobile phone';
        await searchText(voiceQuery);
      };
    } catch (err) {
      setError('Voice search failed. Please try again.');
      console.error('Voice search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchText]);

  const searchImage = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate image processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock image search result
      const imageQuery = 'smartphone';
      await searchText(imageQuery);
    } catch (err) {
      setError('Image search failed. Please try again.');
      console.error('Image search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchText]);

  const searchQR = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate QR code processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock QR search result
      const qrQuery = 'electronics';
      await searchText(qrQuery);
    } catch (err) {
      setError('QR code search failed. Please try again.');
      console.error('QR search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchText]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchText,
    searchVoice,
    searchImage,
    searchQR,
    clearResults
  };
};
