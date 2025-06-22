
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
      title: 'Apple iPhone 15',
      type: 'product',
      image: '/placeholder.svg',
      price: 119999,
      rating: 4.7,
      description: 'Latest iPhone with advanced features'
    },
    {
      id: '4',
      title: 'TechHub Electronics',
      type: 'vendor',
      rating: 4.8,
      description: 'Verified electronics vendor'
    },
    {
      id: '5',
      title: 'Apple',
      type: 'brand',
      description: 'Premium technology brand'
    },
    {
      id: '6',
      title: 'Fashion Store BD',
      type: 'vendor',
      rating: 4.6,
      description: 'Trusted fashion retailer'
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
      console.log('Searching for:', query);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filtered = mockResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );

      console.log('Search results:', filtered);
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
      console.log('Processing voice search...');
      
      // Simulate voice-to-text conversion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock voice search result - simulate converting speech to text
      const voiceQuery = 'mobile phone';
      console.log('Voice converted to text:', voiceQuery);
      
      await searchText(voiceQuery);
    } catch (err) {
      setError('Voice search failed. Please try again.');
      console.error('Voice search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  const searchImage = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing image search...');
      
      // Simulate image processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock image search result
      const imageQuery = 'smartphone';
      console.log('Image identified as:', imageQuery);
      
      await searchText(imageQuery);
    } catch (err) {
      setError('Image search failed. Please try again.');
      console.error('Image search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  const searchQR = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Processing QR code...');
      
      // Simulate QR code processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock QR search result
      const qrQuery = 'electronics store';
      console.log('QR code decoded:', qrQuery);
      
      await searchText(qrQuery);
    } catch (err) {
      setError('QR code search failed. Please try again.');
      console.error('QR search error:', err);
      setIsLoading(false);
    }
  }, [searchText]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
    console.log('Search results cleared');
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
