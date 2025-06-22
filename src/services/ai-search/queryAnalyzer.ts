
import { AISearchQuery } from './types';

export class QueryAnalyzer {
  // Smart Query Understanding with NLP
  async analyzeQuery(query: string): Promise<AISearchQuery> {
    console.log('AI: Analyzing query intent and entities:', query);
    
    // Simulate advanced NLP processing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    
    // Intent detection
    let intent: AISearchQuery['intent'] = 'product';
    if (this.isNavigationQuery(lowerQuery)) intent = 'navigation';
    else if (this.isComparisonQuery(lowerQuery)) intent = 'comparison';
    else if (this.isRecommendationQuery(lowerQuery)) intent = 'recommendation';
    else if (this.isHelpQuery(lowerQuery)) intent = 'help';

    // Entity extraction
    const entities = this.extractEntities(lowerQuery);
    
    // Sentiment analysis
    const sentiment = this.analyzeSentiment(lowerQuery);
    
    // Price range extraction
    const price_range = this.extractPriceRange(lowerQuery);
    
    // Category detection
    const category = this.detectCategory(lowerQuery);
    
    // Brand detection
    const brand = this.detectBrand(lowerQuery);
    
    // Feature extraction
    const features = this.extractFeatures(lowerQuery);

    return {
      query,
      intent,
      entities,
      sentiment,
      price_range,
      category,
      brand,
      features
    };
  }

  // Smart Query Expansion
  async expandQuery(query: string): Promise<string[]> {
    console.log('AI: Expanding query with synonyms and related terms');
    
    const synonyms: { [key: string]: string[] } = {
      'phone': ['mobile', 'smartphone', 'device', 'handset'],
      'laptop': ['notebook', 'computer', 'pc'],
      'shoes': ['footwear', 'sneakers', 'sandals'],
      'cheap': ['budget', 'affordable', 'low price', 'inexpensive'],
      'best': ['top', 'premium', 'excellent', 'high quality'],
      'fast': ['quick', 'speedy', 'rapid', 'express']
    };
    
    const words = query.toLowerCase().split(' ');
    const expansions = [query];
    
    words.forEach(word => {
      if (synonyms[word]) {
        synonyms[word].forEach(synonym => {
          expansions.push(query.replace(word, synonym));
        });
      }
    });
    
    return expansions;
  }

  private isNavigationQuery(query: string): boolean {
    const navKeywords = ['go to', 'navigate', 'open', 'visit', 'show page'];
    return navKeywords.some(keyword => query.includes(keyword));
  }

  private isComparisonQuery(query: string): boolean {
    const compKeywords = ['compare', 'vs', 'versus', 'difference', 'better'];
    return compKeywords.some(keyword => query.includes(keyword));
  }

  private isRecommendationQuery(query: string): boolean {
    const recKeywords = ['recommend', 'suggest', 'advice', 'best for me'];
    return recKeywords.some(keyword => query.includes(keyword));
  }

  private isHelpQuery(query: string): boolean {
    const helpKeywords = ['help', 'how to', 'what is', 'explain'];
    return helpKeywords.some(keyword => query.includes(keyword));
  }

  private extractEntities(query: string): string[] {
    const entities = [];
    const brands = ['samsung', 'apple', 'nike', 'adidas', 'dell', 'hp'];
    const categories = ['phone', 'laptop', 'shoes', 'clothing', 'electronics'];
    
    brands.forEach(brand => {
      if (query.includes(brand)) entities.push(brand);
    });
    
    categories.forEach(category => {
      if (query.includes(category)) entities.push(category);
    });
    
    return entities;
  }

  private analyzeSentiment(query: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'best', 'excellent', 'amazing', 'love'];
    const negativeWords = ['bad', 'worst', 'terrible', 'hate', 'awful'];
    
    const hasPositive = positiveWords.some(word => query.includes(word));
    const hasNegative = negativeWords.some(word => query.includes(word));
    
    if (hasPositive) return 'positive';
    if (hasNegative) return 'negative';
    return 'neutral';
  }

  private extractPriceRange(query: string): { min?: number; max?: number } | undefined {
    const priceMatch = query.match(/under (\d+)|below (\d+)|less than (\d+)/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
      return { max: price };
    }
    
    const rangeMatch = query.match(/(\d+) to (\d+)|(\d+)-(\d+)/);
    if (rangeMatch) {
      return {
        min: parseInt(rangeMatch[1] || rangeMatch[3]),
        max: parseInt(rangeMatch[2] || rangeMatch[4])
      };
    }
    
    return undefined;
  }

  private detectCategory(query: string): string | undefined {
    const categories = ['electronics', 'fashion', 'books', 'sports', 'home'];
    return categories.find(cat => query.includes(cat));
  }

  private detectBrand(query: string): string | undefined {
    const brands = ['samsung', 'apple', 'nike', 'adidas', 'dell', 'hp'];
    return brands.find(brand => query.includes(brand));
  }

  private extractFeatures(query: string): string[] {
    const features = [];
    const featureKeywords = ['5g', 'waterproof', 'wireless', 'bluetooth', 'fast charging'];
    
    featureKeywords.forEach(feature => {
      if (query.includes(feature)) features.push(feature);
    });
    
    return features;
  }
}
