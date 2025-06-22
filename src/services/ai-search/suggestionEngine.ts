
import { AISearchSuggestion } from './types';

export class SuggestionEngine {
  // AI-Powered Smart Suggestions
  async generateSmartSuggestions(partialQuery: string): Promise<AISearchSuggestion[]> {
    console.log('AI: Generating smart suggestions for:', partialQuery);
    
    if (!partialQuery.trim()) return [];
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const suggestions: AISearchSuggestion[] = [];
    const lowerQuery = partialQuery.toLowerCase();
    
    // Auto-completion suggestions
    const completions = this.getAutoCompletions(lowerQuery);
    suggestions.push(...completions);
    
    // Spell correction suggestions
    const corrections = this.getSpellCorrections(lowerQuery);
    suggestions.push(...corrections);
    
    // Related search suggestions
    const related = this.getRelatedSearches(lowerQuery);
    suggestions.push(...related);
    
    // Trending suggestions
    const trending = this.getTrendingSuggestions(lowerQuery);
    suggestions.push(...trending);
    
    // Sort by confidence and limit results
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);
  }

  private getAutoCompletions(query: string): AISearchSuggestion[] {
    const completions = [
      'samsung galaxy s24 ultra',
      'nike air max 270',
      'dell inspiron 15',
      'apple iphone 15',
      'adidas ultraboost 22'
    ];
    
    return completions
      .filter(comp => comp.includes(query))
      .map(text => ({
        text,
        type: 'completion' as const,
        confidence: 0.9,
        category: 'product'
      }));
  }

  private getSpellCorrections(query: string): AISearchSuggestion[] {
    const corrections: { [key: string]: string } = {
      'samsng': 'samsung',
      'iphon': 'iphone',
      'laptp': 'laptop',
      'shoez': 'shoes'
    };
    
    const correction = corrections[query];
    if (correction) {
      return [{
        text: correction,
        type: 'correction',
        confidence: 0.85
      }];
    }
    
    return [];
  }

  private getRelatedSearches(query: string): AISearchSuggestion[] {
    const related = [
      'samsung galaxy accessories',
      'phone cases and covers',
      'wireless chargers',
      'bluetooth headphones'
    ];
    
    return related.map(text => ({
      text,
      type: 'related',
      confidence: 0.7
    }));
  }

  private getTrendingSuggestions(query: string): AISearchSuggestion[] {
    const trending = [
      'festival offers 2024',
      'new year deals',
      'winter collection',
      'gaming laptops'
    ];
    
    return trending.map(text => ({
      text,
      type: 'trending',
      confidence: 0.6
    }));
  }
}
