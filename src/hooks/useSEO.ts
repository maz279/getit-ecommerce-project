
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoService, SEOMetaData } from '@/services/seo/SEOService';

export const useSEO = (metaData: SEOMetaData) => {
  const location = useLocation();

  useEffect(() => {
    // Update canonical URL with current location if not provided
    const seoData = {
      ...metaData,
      canonical: metaData.canonical || `https://getit-bangladesh.com${location.pathname}${location.search}`
    };

    seoService.updateMetaTags(seoData);
  }, [metaData, location]);
};

// Hook for category pages
export const useCategorySEO = (categoryName: string, description?: string) => {
  const seoData = seoService.generateCategorySEO(categoryName, description);
  useSEO(seoData);
};

// Hook for product pages
export const useProductSEO = (product: {
  name: string;
  description: string;
  price: number;
  brand?: string;
  category: string;
  images?: string[];
  rating?: number;
}) => {
  const seoData = seoService.generateProductSEO(product);
  useSEO(seoData);
};

// Hook for search pages
export const useSearchSEO = (query: string, resultCount: number) => {
  const seoData = seoService.generateSearchSEO(query, resultCount);
  useSEO(seoData);
};
