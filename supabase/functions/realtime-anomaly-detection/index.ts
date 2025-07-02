import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'detect_anomalies':
        return await detectAnomalies(supabase, data);
      case 'analyze_patterns':
        return await analyzePatterns(supabase, data);
      case 'generate_insights':
        return await generateInsights(supabase, data);
      case 'predict_issues':
        return await predictIssues(supabase, data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function detectAnomalies(supabase: any, data: any) {
  const { metrics, timeRange } = data;
  
  // Fetch recent data for anomaly detection
  const { data: recentData, error } = await supabase
    .from('real_time_metrics')
    .select('*')
    .gte('created_at', new Date(Date.now() - timeRange * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  const anomalies = [];
  
  // Statistical anomaly detection using z-score
  for (const metric of metrics) {
    const values = recentData
      .filter(d => d.metric_type === metric.type)
      .map(d => parseFloat(d.metric_value.amount || d.metric_value));
    
    if (values.length < 10) continue;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const currentValue = values[0];
    const zScore = Math.abs((currentValue - mean) / stdDev);
    
    if (zScore > 2.5) { // Anomaly threshold
      const anomaly = {
        anomaly_type: 'statistical_outlier',
        metric_name: metric.type,
        expected_value: mean,
        actual_value: currentValue,
        deviation_percentage: ((currentValue - mean) / mean) * 100,
        severity_score: Math.min(zScore, 10),
        context_data: {
          z_score: zScore,
          std_dev: stdDev,
          sample_size: values.length,
          threshold_used: 2.5
        },
        detected_at: new Date().toISOString()
      };
      
      anomalies.push(anomaly);
      
      // Store in database
      await supabase.from('anomaly_detections').insert(anomaly);
    }
  }

  // AI-powered pattern analysis if OpenAI is available
  if (openAIApiKey && anomalies.length > 0) {
    const aiInsights = await generateAIInsights(anomalies);
    
    for (const insight of aiInsights) {
      await supabase.from('ai_insights').insert({
        insight_type: 'anomaly',
        title: insight.title,
        description: insight.description,
        insight_data: insight.data,
        confidence_score: insight.confidence,
        impact_level: insight.impact,
        generated_by: 'ai_anomaly_detector'
      });
    }
  }

  return new Response(JSON.stringify({ 
    anomalies_detected: anomalies.length,
    anomalies: anomalies.slice(0, 10), // Return top 10
    ai_insights_generated: openAIApiKey ? true : false
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzePatterns(supabase: any, data: any) {
  const { entityType, timeframe } = data;
  
  // Fetch historical data for pattern analysis
  const { data: historicalData, error } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Pattern detection algorithms
  const patterns = {
    temporal: findTemporalPatterns(historicalData),
    behavioral: findBehavioralPatterns(historicalData),
    seasonal: findSeasonalPatterns(historicalData),
    correlation: findCorrelationPatterns(historicalData)
  };

  return new Response(JSON.stringify({ 
    patterns_found: Object.keys(patterns).length,
    patterns
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateInsights(supabase: any, data: any) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key required for AI insights generation');
  }

  const { businessData, context } = data;
  
  const prompt = `As an expert business analyst, analyze the following e-commerce data and provide actionable insights:

Business Context: ${context}
Data: ${JSON.stringify(businessData)}

Please provide:
1. Key insights and patterns discovered
2. Potential risks and opportunities
3. Specific actionable recommendations
4. Expected business impact

Format as structured JSON with confidence scores.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert business intelligence analyst specializing in e-commerce analytics. Provide structured, actionable insights with confidence scores.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    }),
  });

  const aiResponse = await response.json();
  const insights = aiResponse.choices[0].message.content;

  // Parse and store insights
  try {
    const structuredInsights = JSON.parse(insights);
    
    for (const insight of structuredInsights.insights || []) {
      await supabase.from('ai_insights').insert({
        insight_type: 'recommendation',
        title: insight.title,
        description: insight.description,
        insight_data: insight,
        confidence_score: insight.confidence || 0.8,
        impact_level: insight.impact_level || 'medium',
        generated_by: 'openai_gpt4',
        actionable_recommendations: insight.recommendations || []
      });
    }
    
    return new Response(JSON.stringify({
      insights_generated: structuredInsights.insights?.length || 0,
      insights: structuredInsights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (parseError) {
    // If parsing fails, store as raw insight
    await supabase.from('ai_insights').insert({
      insight_type: 'pattern',
      title: 'AI-Generated Business Insights',
      description: insights,
      insight_data: { raw_response: insights },
      confidence_score: 0.7,
      impact_level: 'medium',
      generated_by: 'openai_gpt4'
    });
    
    return new Response(JSON.stringify({
      insights_generated: 1,
      raw_insights: insights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function predictIssues(supabase: any, data: any) {
  const { metrics, predictionHorizon } = data;
  
  // Simple trend-based prediction
  const predictions = [];
  
  for (const metric of metrics) {
    const { data: historicalData, error } = await supabase
      .from('real_time_metrics')
      .select('metric_value, created_at')
      .eq('metric_type', metric.type)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error || historicalData.length < 5) continue;

    const values = historicalData.map(d => parseFloat(d.metric_value.amount || d.metric_value));
    const trend = calculateTrend(values);
    
    const prediction = {
      metric: metric.type,
      current_value: values[values.length - 1],
      predicted_value: values[values.length - 1] + (trend * predictionHorizon),
      trend_direction: trend > 0 ? 'increasing' : 'decreasing',
      confidence: Math.max(0.3, 1 - Math.abs(trend) * 0.1),
      risk_level: assessRiskLevel(metric.type, trend, values[values.length - 1])
    };
    
    predictions.push(prediction);
  }

  return new Response(JSON.stringify({ 
    predictions_generated: predictions.length,
    predictions
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
async function generateAIInsights(anomalies: any[]) {
  if (!openAIApiKey) return [];
  
  const prompt = `Analyze these anomalies and provide insights: ${JSON.stringify(anomalies)}`;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert data analyst. Analyze anomalies and provide structured insights.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('AI insights generation failed:', error);
    return [];
  }
}

function findTemporalPatterns(data: any[]) {
  // Group by hour of day
  const hourlyData = new Array(24).fill(0);
  data.forEach(item => {
    const hour = new Date(item.created_at).getHours();
    hourlyData[hour]++;
  });
  
  const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
  return {
    peak_hour: peakHour,
    hourly_distribution: hourlyData,
    pattern_strength: Math.max(...hourlyData) / (data.length / 24)
  };
}

function findBehavioralPatterns(data: any[]) {
  const eventCounts = {};
  data.forEach(item => {
    eventCounts[item.event_name] = (eventCounts[item.event_name] || 0) + 1;
  });
  
  return {
    most_common_events: Object.entries(eventCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5),
    event_diversity: Object.keys(eventCounts).length
  };
}

function findSeasonalPatterns(data: any[]) {
  const dailyData = {};
  data.forEach(item => {
    const day = new Date(item.created_at).getDay();
    dailyData[day] = (dailyData[day] || 0) + 1;
  });
  
  return {
    daily_pattern: dailyData,
    weekend_vs_weekday: {
      weekday: (dailyData[1] || 0) + (dailyData[2] || 0) + (dailyData[3] || 0) + (dailyData[4] || 0) + (dailyData[5] || 0),
      weekend: (dailyData[0] || 0) + (dailyData[6] || 0)
    }
  };
}

function findCorrelationPatterns(data: any[]) {
  // Simple correlation analysis between event types and user properties
  const correlations = {};
  data.forEach(item => {
    const key = `${item.event_name}_${item.event_category || 'unknown'}`;
    correlations[key] = (correlations[key] || 0) + 1;
  });
  
  return {
    event_category_correlations: correlations,
    total_unique_combinations: Object.keys(correlations).length
  };
}

function calculateTrend(values: number[]) {
  if (values.length < 2) return 0;
  
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0);
  
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}

function assessRiskLevel(metricType: string, trend: number, currentValue: number) {
  const riskThresholds = {
    'error_rate': { high: 0.05, critical: 0.1 },
    'response_time': { high: 1000, critical: 2000 },
    'cpu_usage': { high: 80, critical: 95 },
    'memory_usage': { high: 85, critical: 95 }
  };
  
  const thresholds = riskThresholds[metricType as keyof typeof riskThresholds];
  if (!thresholds) return 'low';
  
  if (currentValue > thresholds.critical) return 'critical';
  if (currentValue > thresholds.high) return 'high';
  if (trend > 0 && currentValue > thresholds.high * 0.8) return 'medium';
  
  return 'low';
}