
export interface AISearchQuery {
  query: string;
  intent: 'product' | 'navigation' | 'comparison' | 'recommendation' | 'help';
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  price_range?: { min?: number; max?: number };
  category?: string;
  brand?: string;
  features?: string[];
}

export interface AISearchSuggestion {
  text: string;
  type: 'completion' | 'correction' | 'related' | 'trending';
  confidence: number;
  category?: string;
}

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  reason: string;
  confidence: number;
  price?: number;
  image?: string;
}
