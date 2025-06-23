
import React, { useState, useRef, useEffect } from 'react';
import { Search, Brain, Sparkles, Filter, Mic, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAISearch } from '@/hooks/useAISearch';
import { useNLPEnhancedSearch } from '@/hooks/ai-search/useNLPEnhancedSearch';
import { enhancedSearchService } from '@/services/search/EnhancedSearchService';

export const EnhancedAdminSearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'basic' | 'ai' | 'nlp'>('ai');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // AI Search hooks
  const aiSearch = useAISearch();
  const nlpSearch = useNLPEnhancedSearch();
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiInsights, setAIInsights] = useState<any>(null);

  // Initialize AI services
  useEffect(() => {
    const initializeAI = async () => {
      try {
        await nlpSearch.initializeNLP();
        console.log('Admin AI Search: Services initialized');
      } catch (error) {
        console.error('Admin AI Search: Initialization failed:', error);
      }
    };
    
    initializeAI();
  }, []);

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 2) {
      generateSuggestions(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Generate AI-powered suggestions
  const generateSuggestions = async (query: string) => {
    try {
      if (searchMode === 'nlp') {
        const suggestions = await nlpSearch.getIntelligentSuggestions(query, {
          language: 'en',
          currentPage: 'admin_dashboard'
        });
        
        if (suggestions) {
          setSuggestions([
            ...suggestions.suggestions.map((s: any) => s.text),
            ...suggestions.contextualSuggestions.map((s: any) => s.text)
          ]);
        }
      } else if (searchMode === 'ai') {
        const aiSuggestions = await aiSearch.getAISuggestions(query);
        setSuggestions(aiSuggestions.map((s: any) => s.text));
      } else {
        // Basic search suggestions
        const basicSuggestions = enhancedSearchService.getSuggestions(query, 5);
        setSuggestions(basicSuggestions);
      }
    } catch (error) {
      console.error('Admin Search: Suggestion generation failed:', error);
    }
  };

  // Handle search execution
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const query = searchQuery.trim();
    if (!query) return;

    try {
      console.log(`Admin Search: Executing ${searchMode} search for:`, query);
      
      let results: any[] = [];
      let insights: any = null;

      if (searchMode === 'nlp') {
        // NLP-enhanced search
        const analysis = await nlpSearch.analyzeQueryWithNLP(query, {
          language: 'en',
          includeTranslation: true,
          includeKeywords: true
        });
        
        if (analysis) {
          setAIInsights(analysis);
          const searchResults = await enhancedSearchService.searchWithML(
            analysis.enhancedQuery || query,
            'admin',
            20
          );
          results = searchResults.results;
        }
      } else if (searchMode === 'ai') {
        // AI-enhanced search
        await aiSearch.searchWithAI(query);
        results = aiSearch.searchResults;
        insights = aiSearch.queryAnalysis;
      } else {
        // Basic search
        const searchResults = enhancedSearchService.searchWithNavigation(query, 20);
        results = searchResults.results;
      }

      setSearchResults(results);
      setShowResults(true);
      setShowSuggestions(false);
      
      console.log(`Admin Search: Found ${results.length} results`);
      
    } catch (error) {
      console.error('Admin Search: Search execution failed:', error);
    }
  };

  // Handle voice search
  const handleVoiceSearch = async () => {
    setIsVoiceActive(true);
    
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          
          if (searchMode === 'ai' || searchMode === 'nlp') {
            await aiSearch.processVoiceInput(audioBlob, 'en');
          }
          
          setIsVoiceActive(false);
        };

        mediaRecorder.start();
        
        // Stop recording after 5 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }, 5000);
      }
    } catch (error) {
      console.error('Admin Voice Search: Failed:', error);
      setIsVoiceActive(false);
    }
  };

  // Handle image search
  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (searchMode === 'ai' || searchMode === 'nlp')) {
      aiSearch.processImageSearch(file);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    setShowResults(false);
    setAIInsights(null);
    aiSearch.clearResults();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLoading = aiSearch.isLoading || nlpSearch.nlpState?.isNLPProcessing;

  return (
    <div className="flex flex-1 max-w-3xl mx-6" ref={searchRef}>
      <div className="relative w-full">
        {/* Search Mode Selector */}
        <div className="flex mb-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSearchMode('basic')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              searchMode === 'basic' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setSearchMode('ai')}
            className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center space-x-1 ${
              searchMode === 'ai' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Brain size={12} />
            <span>AI</span>
          </button>
          <button
            onClick={() => setSearchMode('nlp')}
            className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center space-x-1 ${
              searchMode === 'nlp' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Sparkles size={12} />
            <span>NLP</span>
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search admin panel with ${searchMode.toUpperCase()}... (orders, products, vendors, customers, analytics)`}
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-4 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            
            {/* Clear button */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {/* Search Controls */}
          <div className="flex items-center space-x-2 ml-2">
            {/* Voice Search */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleVoiceSearch}
              disabled={searchMode === 'basic'}
              className={`px-2 ${isVoiceActive ? 'bg-red-100 border-red-300' : ''}`}
            >
              <Mic size={14} className={isVoiceActive ? 'text-red-500' : ''} />
            </Button>

            {/* Image Search */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSearch}
                className="hidden"
                disabled={searchMode === 'basic'}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="px-2"
                disabled={searchMode === 'basic'}
              >
                <Image size={14} />
              </Button>
            </label>

            {/* Search Button */}
            <Button
              type="submit"
              size="sm"
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              <Search size={12} />
            </Button>
          </div>
        </form>
        
        {/* AI Insights */}
        {aiInsights && searchMode === 'nlp' && (
          <div className="absolute top-full left-0 right-0 bg-blue-50 border border-blue-200 rounded-b-lg p-3 mt-1 z-50">
            <div className="text-xs text-blue-700">
              <strong>AI Analysis:</strong> Intent: {aiInsights.nlpAnalysis?.intent?.intent || 'search'} | 
              Sentiment: {aiInsights.nlpAnalysis?.sentiment?.sentiment || 'neutral'} | 
              Entities: {aiInsights.nlpAnalysis?.entities?.brands?.join(', ') || 'none'}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                    handleSearch();
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded text-sm flex items-center space-x-2"
                >
                  <Search size={12} className="text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Search Results ({searchResults.length})
                </h3>
                <div className="text-xs text-gray-500">
                  Powered by {searchMode.toUpperCase()}
                </div>
              </div>
              
              {searchResults.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No results found. Try a different search term.
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.slice(0, 8).map((result, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-50 rounded border border-gray-100 cursor-pointer"
                      onClick={() => {
                        console.log('Navigate to:', result);
                        setShowResults(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {result.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.type} • {result.category || 'General'}
                          </div>
                        </div>
                        {result.mlScore && (
                          <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {Math.round(result.mlScore * 100)}% match
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
