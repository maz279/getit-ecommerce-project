import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ExperimentParticipant {
  experiment_id: string;
  user_id?: string;
  session_id?: string;
  variant_id: string;
}

interface ConversionEvent {
  experiment_id: string;
  participant_id: string;
  event_type: string;
  event_value?: number;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...data } = await req.json();

    switch (action) {
      case 'assign_variant':
        return await assignVariant(data);
      
      case 'track_conversion':
        return await trackConversion(data);
      
      case 'get_experiment_results':
        return await getExperimentResults(data);
      
      case 'create_experiment':
        return await createExperiment(data);
      
      case 'stop_experiment':
        return await stopExperiment(data);
      
      case 'analyze_experiment':
        return await analyzeExperiment(data);
      
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('A/B Testing Service Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function assignVariant(data: any) {
  const { experiment_id, user_id, session_id } = data;
  
  // Check if user is already assigned to this experiment
  let participant;
  
  if (user_id) {
    const { data: existing, error } = await supabase
      .from('ab_experiment_participants')
      .select('*')
      .eq('experiment_id', experiment_id)
      .eq('user_id', user_id)
      .single();
    
    if (!error && existing) {
      participant = existing;
    }
  }
  
  if (!participant && session_id) {
    const { data: existing, error } = await supabase
      .from('ab_experiment_participants')
      .select('*')
      .eq('experiment_id', experiment_id)
      .eq('session_id', session_id)
      .single();
    
    if (!error && existing) {
      participant = existing;
    }
  }
  
  // If not assigned, create new assignment
  if (!participant) {
    // Get experiment details
    const { data: experiment, error: expError } = await supabase
      .from('ab_experiments')
      .select('*')
      .eq('id', experiment_id)
      .eq('status', 'running')
      .single();
    
    if (expError || !experiment) {
      throw new Error('Experiment not found or not running');
    }
    
    // Assign variant based on traffic split
    const variant = assignVariantByTrafficSplit(experiment.traffic_split, experiment.variants);
    
    // Create participant record
    const { data: newParticipant, error: participantError } = await supabase
      .from('ab_experiment_participants')
      .insert({
        experiment_id,
        user_id,
        session_id,
        variant_id: variant,
        assigned_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (participantError) throw participantError;
    participant = newParticipant;
    
    // Check if experiment should auto-stop
    await checkExperimentAutoStop(experiment_id);
  }
  
  return new Response(JSON.stringify({
    success: true,
    variant_id: participant.variant_id,
    experiment_id: participant.experiment_id,
    participant_id: participant.id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function trackConversion(data: ConversionEvent) {
  const { experiment_id, participant_id, event_type, event_value = 1, metadata = {} } = data;
  
  // Get participant details
  const { data: participant, error: participantError } = await supabase
    .from('ab_experiment_participants')
    .select('*')
    .eq('id', participant_id)
    .single();
  
  if (participantError || !participant) {
    throw new Error('Participant not found');
  }
  
  // Update participant's conversion events
  const currentEvents = participant.conversion_events || [];
  const newEvent = {
    event_type,
    event_value,
    timestamp: new Date().toISOString(),
    metadata
  };
  
  const { error: updateError } = await supabase
    .from('ab_experiment_participants')
    .update({
      conversion_events: [...currentEvents, newEvent]
    })
    .eq('id', participant_id);
  
  if (updateError) throw updateError;
  
  // Update experiment results
  await updateExperimentResults(experiment_id, participant.variant_id, event_type, event_value);
  
  // Run statistical analysis if enough data
  await runStatisticalAnalysis(experiment_id);
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Conversion tracked successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getExperimentResults(data: any) {
  const { experiment_id } = data;
  
  // Get experiment details
  const { data: experiment, error: expError } = await supabase
    .from('ab_experiments')
    .select('*')
    .eq('id', experiment_id)
    .single();
  
  if (expError || !experiment) {
    throw new Error('Experiment not found');
  }
  
  // Get participants by variant
  const { data: participants, error: participantsError } = await supabase
    .from('ab_experiment_participants')
    .select('variant_id, conversion_events')
    .eq('experiment_id', experiment_id);
  
  if (participantsError) throw participantsError;
  
  // Get latest results
  const { data: results, error: resultsError } = await supabase
    .from('ab_test_results')
    .select('*')
    .eq('experiment_id', experiment_id)
    .order('analysis_date', { ascending: false });
  
  if (resultsError) throw resultsError;
  
  // Calculate summary statistics
  const summary = calculateExperimentSummary(participants || [], experiment);
  
  return new Response(JSON.stringify({
    success: true,
    experiment,
    results: results || [],
    summary,
    participants_count: participants?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createExperiment(data: any) {
  const {
    experiment_name,
    description,
    experiment_type,
    variants,
    traffic_split,
    conversion_goals,
    minimum_sample_size = 1000,
    confidence_level = 95.0,
    auto_winner_selection = false,
    target_audience = {}
  } = data;
  
  // Validate traffic split
  const totalTraffic = Object.values(traffic_split).reduce((sum: number, value: any) => sum + value, 0);
  if (Math.abs(totalTraffic - 100) > 0.1) {
    throw new Error('Traffic split must sum to 100%');
  }
  
  // Create experiment
  const { data: experiment, error } = await supabase
    .from('ab_experiments')
    .insert({
      experiment_name,
      description,
      experiment_type,
      variants,
      traffic_split,
      conversion_goals,
      minimum_sample_size,
      confidence_level,
      auto_winner_selection,
      target_audience,
      status: 'draft',
      start_date: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return new Response(JSON.stringify({
    success: true,
    experiment_id: experiment.id,
    message: 'Experiment created successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function stopExperiment(data: any) {
  const { experiment_id, reason = 'manual_stop' } = data;
  
  // Update experiment status
  const { data: experiment, error } = await supabase
    .from('ab_experiments')
    .update({
      status: 'completed',
      end_date: new Date().toISOString()
    })
    .eq('id', experiment_id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Run final analysis
  const finalAnalysis = await runFinalAnalysis(experiment_id);
  
  return new Response(JSON.stringify({
    success: true,
    experiment,
    final_analysis: finalAnalysis,
    message: 'Experiment stopped successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeExperiment(data: any) {
  const { experiment_id } = data;
  
  // Get experiment and participants data
  const [experimentResult, participantsResult] = await Promise.all([
    supabase
      .from('ab_experiments')
      .select('*')
      .eq('id', experiment_id)
      .single(),
    supabase
      .from('ab_experiment_participants')
      .select('*')
      .eq('experiment_id', experiment_id)
  ]);
  
  if (experimentResult.error || !experimentResult.data) {
    throw new Error('Experiment not found');
  }
  
  const experiment = experimentResult.data;
  const participants = participantsResult.data || [];
  
  // Perform comprehensive statistical analysis
  const analysis = await performStatisticalAnalysis(experiment, participants);
  
  // Store analysis results
  for (const [variantId, variantAnalysis] of Object.entries(analysis.variant_results)) {
    await supabase.from('ab_test_results').upsert({
      experiment_id,
      variant_id: variantId,
      metric_name: 'conversion_rate',
      metric_value: (variantAnalysis as any).conversion_rate,
      conversion_rate: (variantAnalysis as any).conversion_rate,
      statistical_significance: (variantAnalysis as any).statistical_significance,
      p_value: (variantAnalysis as any).p_value,
      confidence_interval: (variantAnalysis as any).confidence_interval,
      sample_size: (variantAnalysis as any).sample_size,
      analysis_date: new Date().toISOString().split('T')[0],
      is_winner: (variantAnalysis as any).is_winner
    });
  }
  
  return new Response(JSON.stringify({
    success: true,
    analysis
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions
function assignVariantByTrafficSplit(trafficSplit: Record<string, number>, variants: any[]): string {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [variantId, percentage] of Object.entries(trafficSplit)) {
    cumulative += percentage;
    if (random <= cumulative) {
      return variantId;
    }
  }
  
  // Fallback to first variant
  return variants[0]?.id || 'control';
}

async function updateExperimentResults(experimentId: string, variantId: string, eventType: string, eventValue: number) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get or create result record for today
  const { data: existing, error: fetchError } = await supabase
    .from('ab_test_results')
    .select('*')
    .eq('experiment_id', experimentId)
    .eq('variant_id', variantId)
    .eq('metric_name', eventType)
    .eq('analysis_date', today)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }
  
  if (existing) {
    // Update existing record
    await supabase
      .from('ab_test_results')
      .update({
        metric_value: existing.metric_value + eventValue,
        sample_size: existing.sample_size + 1
      })
      .eq('id', existing.id);
  } else {
    // Create new record
    await supabase
      .from('ab_test_results')
      .insert({
        experiment_id: experimentId,
        variant_id: variantId,
        metric_name: eventType,
        metric_value: eventValue,
        sample_size: 1,
        analysis_date: today
      });
  }
}

async function runStatisticalAnalysis(experimentId: string) {
  // Get all participants for this experiment
  const { data: participants, error } = await supabase
    .from('ab_experiment_participants')
    .select('*')
    .eq('experiment_id', experimentId);
  
  if (error || !participants) return;
  
  // Group by variant
  const variantGroups = groupParticipantsByVariant(participants);
  
  // Calculate statistical significance between variants
  const results = calculateStatisticalSignificance(variantGroups);
  
  // Update experiment with latest statistical significance
  await supabase
    .from('ab_experiments')
    .update({
      statistical_significance: results.overall_significance
    })
    .eq('id', experimentId);
}

async function checkExperimentAutoStop(experimentId: string) {
  const { data: experiment, error } = await supabase
    .from('ab_experiments')
    .select('*')
    .eq('id', experimentId)
    .single();
  
  if (error || !experiment || !experiment.auto_winner_selection) return;
  
  // Check if minimum sample size is reached
  const { data: participants } = await supabase
    .from('ab_experiment_participants')
    .select('id')
    .eq('experiment_id', experimentId);
  
  if ((participants?.length || 0) < experiment.minimum_sample_size) return;
  
  // Check if statistical significance is achieved
  if (experiment.statistical_significance >= experiment.confidence_level) {
    await stopExperiment({ experiment_id: experimentId, reason: 'auto_winner_detected' });
  }
}

function calculateExperimentSummary(participants: any[], experiment: any) {
  const variantGroups = groupParticipantsByVariant(participants);
  
  const summary: Record<string, any> = {};
  
  for (const [variantId, group] of Object.entries(variantGroups)) {
    const groupArray = group as any[];
    const conversions = groupArray.filter(p => 
      p.conversion_events && p.conversion_events.length > 0
    );
    
    summary[variantId] = {
      participants: groupArray.length,
      conversions: conversions.length,
      conversion_rate: groupArray.length > 0 ? (conversions.length / groupArray.length) * 100 : 0,
      total_events: groupArray.reduce((sum, p) => 
        sum + (p.conversion_events?.length || 0), 0
      )
    };
  }
  
  return summary;
}

function groupParticipantsByVariant(participants: any[]) {
  return participants.reduce((groups, participant) => {
    const variant = participant.variant_id;
    if (!groups[variant]) groups[variant] = [];
    groups[variant].push(participant);
    return groups;
  }, {} as Record<string, any[]>);
}

function calculateStatisticalSignificance(variantGroups: Record<string, any[]>) {
  // Simplified statistical analysis - in production, use proper statistical libraries
  const variants = Object.keys(variantGroups);
  
  if (variants.length < 2) {
    return { overall_significance: 0 };
  }
  
  // Calculate conversion rates
  const conversionRates = variants.map(variant => {
    const group = variantGroups[variant];
    const conversions = group.filter(p => p.conversion_events?.length > 0).length;
    return {
      variant,
      conversions,
      participants: group.length,
      rate: group.length > 0 ? conversions / group.length : 0
    };
  });
  
  // Simple significance test (would use proper statistical tests in production)
  const [control, ...treatments] = conversionRates;
  let maxSignificance = 0;
  
  for (const treatment of treatments) {
    const significance = calculateZTest(control, treatment);
    maxSignificance = Math.max(maxSignificance, significance);
  }
  
  return { overall_significance: maxSignificance };
}

function calculateZTest(control: any, treatment: any): number {
  // Simplified Z-test calculation
  if (control.participants === 0 || treatment.participants === 0) return 0;
  
  const p1 = control.rate;
  const p2 = treatment.rate;
  const n1 = control.participants;
  const n2 = treatment.participants;
  
  const pooledP = (control.conversions + treatment.conversions) / (n1 + n2);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
  
  if (se === 0) return 0;
  
  const z = Math.abs(p1 - p2) / se;
  
  // Convert Z-score to confidence level (approximation)
  return Math.min(95, z * 20);
}

async function performStatisticalAnalysis(experiment: any, participants: any[]) {
  const variantGroups = groupParticipantsByVariant(participants);
  const variantResults: Record<string, any> = {};
  
  for (const [variantId, group] of Object.entries(variantGroups)) {
    const groupArray = group as any[];
    const conversions = groupArray.filter(p => p.conversion_events?.length > 0);
    
    variantResults[variantId] = {
      sample_size: groupArray.length,
      conversions: conversions.length,
      conversion_rate: groupArray.length > 0 ? conversions.length / groupArray.length : 0,
      statistical_significance: 0,
      p_value: 1.0,
      confidence_interval: { lower: 0, upper: 0 },
      is_winner: false
    };
  }
  
  // Determine winner (simplified)
  const sortedVariants = Object.entries(variantResults)
    .sort(([,a], [,b]) => (b as any).conversion_rate - (a as any).conversion_rate);
  
  if (sortedVariants.length > 0) {
    variantResults[sortedVariants[0][0]].is_winner = true;
  }
  
  return {
    experiment_id: experiment.id,
    analysis_date: new Date().toISOString(),
    variant_results: variantResults,
    overall_statistical_significance: Math.max(
      ...Object.values(variantResults).map((v: any) => v.statistical_significance)
    ),
    recommendations: generateRecommendations(variantResults)
  };
}

function generateRecommendations(variantResults: Record<string, any>): string[] {
  const recommendations = [];
  
  const winner = Object.entries(variantResults).find(([,result]) => (result as any).is_winner);
  if (winner) {
    recommendations.push(`Variant "${winner[0]}" shows the highest conversion rate`);
  }
  
  const totalSamples = Object.values(variantResults).reduce((sum, result) => sum + (result as any).sample_size, 0);
  if (totalSamples < 1000) {
    recommendations.push('Consider running the experiment longer to gather more data');
  }
  
  return recommendations;
}

async function runFinalAnalysis(experimentId: string) {
  // Perform comprehensive final analysis
  return await analyzeExperiment({ experiment_id: experimentId });
}