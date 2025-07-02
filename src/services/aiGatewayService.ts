import { supabase } from "@/integrations/supabase/client";

export interface AIRoutingDecision {
  selected_service: string;
  confidence_score: number;
  routing_decision: {
    confidence_score: number;
    load_balancing_factor: number;
    performance_prediction: number;
  };
}

export interface AnomalyDetectionResult {
  anomaly_detected: boolean;
  anomaly_score: number;
  severity_level: string;
  threat_classification?: string;
  behavior_indicators: Record<string, any>;
  mitigation_actions: string[];
  recommended_action: 'allow' | 'monitor' | 'block';
}

export interface PredictiveScalingResult {
  service_name: string;
  current_instances: number;
  recommended_instances: number;
  predicted_demand: number;
  confidence_level: number;
  scaling_reason: string;
  cost_implications: {
    current_cost_per_hour: number;
    predicted_cost_per_hour: number;
    potential_savings: number;
  };
  resource_utilization: {
    cpu_prediction: number;
    memory_prediction: number;
    network_prediction: number;
  };
}

export class AIGatewayService {
  
  static async getIntelligentRouting(
    routePath: string,
    availableServices: string[],
    userContext?: Record<string, any>
  ): Promise<AIRoutingDecision> {
    const { data, error } = await supabase.functions.invoke('ai-intelligent-router', {
      body: {
        route_path: routePath,
        services: availableServices,
        user_context: userContext
      }
    });

    if (error) throw new Error(`AI Routing failed: ${error.message}`);
    return data;
  }

  static async detectAnomalies(
    requestData: {
      requests_per_minute?: number;
      user_agent?: string;
      payload_size?: number;
      query_params?: Record<string, any>;
      payload?: string;
    },
    userContext?: {
      country?: string;
      ip?: string;
      user_id?: string;
    },
    endpointInfo?: {
      service_name?: string;
      endpoint_path?: string;
    }
  ): Promise<AnomalyDetectionResult> {
    const { data, error } = await supabase.functions.invoke('ai-anomaly-detector', {
      body: {
        request_data: requestData,
        user_context: userContext,
        endpoint_info: endpointInfo
      }
    });

    if (error) throw new Error(`Anomaly detection failed: ${error.message}`);
    return data;
  }

  static async getPredictiveScaling(
    serviceName: string,
    currentMetrics?: {
      current_instances?: number;
      cpu_utilization?: number;
      memory_utilization?: number;
      response_time?: number;
    }
  ): Promise<PredictiveScalingResult> {
    const { data, error } = await supabase.functions.invoke('ai-predictive-scaler', {
      body: {
        service_name: serviceName,
        current_metrics: currentMetrics,
        historical_data: {}
      }
    });

    if (error) throw new Error(`Predictive scaling failed: ${error.message}`);
    return data;
  }

  static async logTrafficPattern(
    endpointPath: string,
    requestCount: number,
    avgResponseTime: number,
    errorRate: number,
    additionalMetrics?: Record<string, any>
  ) {
    const { error } = await supabase
      .from('traffic_patterns')
      .insert({
        time_window: new Date().toISOString(),
        endpoint_path: endpointPath,
        request_count: requestCount,
        avg_response_time: avgResponseTime,
        error_rate: errorRate,
        peak_load_indicator: requestCount > 1000,
        seasonal_pattern: additionalMetrics?.seasonal_pattern || {},
        geographic_distribution: additionalMetrics?.geographic_distribution || {},
        user_behavior_metrics: additionalMetrics?.user_behavior_metrics || {}
      });

    if (error) throw new Error(`Failed to log traffic pattern: ${error.message}`);
  }

  static async updateServiceHealthScore(
    serviceName: string,
    responseTime: number,
    errorRate: number,
    cpuUtilization: number,
    memoryUtilization: number
  ): Promise<number> {
    const { data, error } = await supabase.rpc('update_service_health_score', {
      p_service_name: serviceName,
      p_response_time: responseTime,
      p_error_rate: errorRate,
      p_cpu_utilization: cpuUtilization,
      p_memory_utilization: memoryUtilization
    });

    if (error) throw new Error(`Failed to update service health: ${error.message}`);
    return data;
  }

  static async getServiceHealthMetrics(serviceName?: string) {
    let query = supabase
      .from('service_health_metrics')
      .select('*')
      .order('last_health_check', { ascending: false });

    if (serviceName) {
      query = query.eq('service_name', serviceName);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch service health: ${error.message}`);
    return data;
  }

  static async getRoutingAnalytics(routePath?: string, limit = 50) {
    let query = supabase
      .from('ai_routing_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (routePath) {
      query = query.eq('route_path', routePath);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch routing analytics: ${error.message}`);
    return data;
  }

  static async getAnomalyEvents(severityLevel?: string, limit = 50) {
    let query = supabase
      .from('anomaly_detection_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (severityLevel) {
      query = query.eq('severity_level', severityLevel);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch anomaly events: ${error.message}`);
    return data;
  }

  static async getPredictiveScalingMetrics(serviceName?: string, limit = 50) {
    let query = supabase
      .from('predictive_scaling_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (serviceName) {
      query = query.eq('service_name', serviceName);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch scaling metrics: ${error.message}`);
    return data;
  }

  static async optimizeCacheStrategy(cacheKey: string, accessPattern: Record<string, any>) {
    const { data, error } = await supabase
      .from('intelligent_cache_analytics')
      .insert({
        cache_key: cacheKey,
        cache_strategy: 'ai_optimized',
        hit_rate: 0,
        access_frequency: 1,
        data_size_bytes: accessPattern.size || 0,
        ttl_seconds: accessPattern.ttl || 3600,
        geographic_affinity: accessPattern.geographic_affinity || {},
        user_segment_affinity: accessPattern.user_segment_affinity || {},
        cost_effectiveness: 0,
        ai_optimization_applied: true,
        last_accessed: new Date().toISOString()
      });

    if (error) throw new Error(`Failed to optimize cache strategy: ${error.message}`);
    return data;
  }
}