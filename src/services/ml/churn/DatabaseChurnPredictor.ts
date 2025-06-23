
import { DatabaseService } from '@/services/database/DatabaseService';
import { supabase } from '@/integrations/supabase/client';

export class DatabaseChurnPredictor {
  static async saveChurnPrediction(
    userId: string,
    churnProbability: number,
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    factors: any,
    retentionStrategies: any[]
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('churn_predictions')
        .upsert({
          user_id: userId,
          churn_probability,
          risk_level: riskLevel,
          factors,
          retention_strategies: retentionStrategies,
          prediction_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'user_id,prediction_date'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving churn prediction:', error);
      throw error;
    }
  }

  static async getChurnPredictions(riskLevels?: string[]): Promise<any[]> {
    try {
      let query = supabase
        .from('churn_predictions')
        .select('*')
        .order('churn_probability', { ascending: false });

      if (riskLevels && riskLevels.length > 0) {
        query = query.in('risk_level', riskLevels);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching churn predictions:', error);
      throw error;
    }
  }

  static async getUserBehaviorData(userId: string, days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_behaviors')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user behavior data:', error);
      throw error;
    }
  }
}
