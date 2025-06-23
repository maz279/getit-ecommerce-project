
import { nlpManager } from '../../nlp';
import { enhancedAISearchService } from '../../ai-search/enhancedAISearchService';

export class ConversationService {
  async processConversation(message: string, context: {
    userId?: string;
    language?: 'en' | 'bn';
    conversationHistory?: any[];
    intent?: string;
  }): Promise<{
    response: string;
    nlpAnalysis: any;
    actionableInsights: any[];
    followUpSuggestions: string[];
    businessIntelligence: any;
  }> {
    console.log('Conversation Service: Processing advanced conversation');

    try {
      const nlpAnalysis = await nlpManager.analyzeText(message, {
        includeSentiment: true,
        includeEntities: true,
        includeIntent: true,
        includeKeywords: true,
        language: context.language
      });

      const conversationalResult = await enhancedAISearchService.processConversationalSearch(
        message,
        context.conversationHistory || [],
        { language: context.language, userId: context.userId }
      );

      const actionableInsights = await this.generateActionableInsights(nlpAnalysis, conversationalResult);
      const businessIntelligence = await this.extractBusinessIntelligence(message, nlpAnalysis);

      return {
        response: conversationalResult.response,
        nlpAnalysis,
        actionableInsights,
        followUpSuggestions: conversationalResult.followUpQuestions,
        businessIntelligence
      };
    } catch (error) {
      console.error('Conversation processing failed:', error);
      throw error;
    }
  }

  private async generateActionableInsights(nlpAnalysis: any, conversationalResult: any): Promise<any[]> {
    const insights = [];
    
    if (nlpAnalysis.sentiment?.sentiment === 'negative') {
      insights.push({
        type: 'customer_satisfaction',
        priority: 'high',
        action: 'Follow up with customer support',
        data: nlpAnalysis.sentiment
      });
    }
    
    if (nlpAnalysis.intent?.intent === 'complaint') {
      insights.push({
        type: 'issue_resolution',
        priority: 'urgent',
        action: 'Escalate to human agent',
        data: nlpAnalysis.intent
      });
    }
    
    return insights;
  }

  private async extractBusinessIntelligence(message: string, nlpAnalysis: any): Promise<any> {
    return {
      customerNeeds: nlpAnalysis.entities?.products || [],
      marketTrends: nlpAnalysis.keywords?.keywords?.slice(0, 3) || [],
      competitiveMentions: nlpAnalysis.entities?.brands || [],
      sentimentTrends: {
        current: nlpAnalysis.sentiment?.sentiment,
        confidence: nlpAnalysis.sentiment?.confidence
      }
    };
  }
}

export const conversationService = new ConversationService();
