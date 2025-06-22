
import { useEffect, useCallback } from 'react';
import { searchService, SearchResult } from '@/services/searchService';

interface UseSearchIndexingOptions {
  autoIndex?: boolean;
  indexInterval?: number;
}

export const useSearchIndexing = (options: UseSearchIndexingOptions = {}) => {
  const { autoIndex = true, indexInterval = 5 * 60 * 1000 } = options; // 5 minutes default

  // Function to add content to search index
  const addToSearchIndex = useCallback((item: SearchResult) => {
    console.log('Adding to search index:', item.title);
    searchService.addToIndex(item);
  }, []);

  // Function to remove content from search index
  const removeFromSearchIndex = useCallback((itemId: string) => {
    console.log('Removing from search index:', itemId);
    searchService.removeFromIndex(itemId);
  }, []);

  // Function to update existing content in search index
  const updateInSearchIndex = useCallback((item: SearchResult) => {
    console.log('Updating in search index:', item.title);
    searchService.addToIndex(item); // addToIndex handles updates too
  }, []);

  // Function to refresh the entire search index
  const refreshSearchIndex = useCallback(() => {
    console.log('Refreshing search index');
    searchService.refreshIndex();
  }, []);

  // Function to get all indexed items
  const getIndexedItems = useCallback(() => {
    return searchService.getIndexedItems();
  }, []);

  // Auto-index content at regular intervals
  useEffect(() => {
    if (!autoIndex) return;

    const interval = setInterval(() => {
      searchService.autoIndexNewContent();
    }, indexInterval);

    return () => clearInterval(interval);
  }, [autoIndex, indexInterval]);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'searchIndexUpdate') {
        console.log('Search index updated in another tab, refreshing...');
        refreshSearchIndex();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshSearchIndex]);

  return {
    addToSearchIndex,
    removeFromSearchIndex,
    updateInSearchIndex,
    refreshSearchIndex,
    getIndexedItems
  };
};

// Helper function to automatically index React components
export const withSearchIndexing = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  getSearchData: (props: P) => SearchResult | null
) => {
  return (props: P) => {
    const { addToSearchIndex } = useSearchIndexing();

    useEffect(() => {
      const searchData = getSearchData(props);
      if (searchData) {
        addToSearchIndex(searchData);
      }
    }, [props, addToSearchIndex]);

    return <Component {...props} />;
  };
};
