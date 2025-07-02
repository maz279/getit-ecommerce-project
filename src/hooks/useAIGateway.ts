import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIRoutingRequest {
  route_path: string;
  services: string[];
  user_context?: Record<string, any>;
}

interface AnomalyDetectionRequest {
  request_data: {
    requests_per_minute?: number;
    user_agent?: string;
    payload_size?: number;
    query_params?: Record<string, any>;
    payload?: string;
  };
  user_context?: {
    country?: string;
    ip?: string;
    user_id?: string;
  };
  endpoint_info?: {
    service_name?: string;
    endpoint_path?: string;
  };
}

interface PredictiveScalingRequest {
  service_name: string;
  current_metrics?: {
    current_instances?: number;
    cpu_utilization?: number;
    memory_utilization?: number;
    response_time?: number;
  };
  historical_data?: Record<string, any>;
}

export const useAIGateway = () => {
  const [loading, setLoading] = useState(false);

  const invokeIntelligentRouter = useCallback(async (request: AIRoutingRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-intelligent-router', {
        body: request
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI Intelligent Router error:', error);
      toast.error('Failed to get AI routing decision');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const invokePredictiveScaler = useCallback(async (request: PredictiveScalingRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-predictive-scaler', {
        body: request
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI Predictive Scaler error:', error);
      toast.error('Failed to get scaling recommendations');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const invokeAnomalyDetector = useCallback(async (request: AnomalyDetectionRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-anomaly-detector', {
        body: request
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI Anomaly Detector error:', error);
      toast.error('Failed to analyze for anomalies');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getServiceHealthMetrics = useCallback(async (serviceName?: string) => {
    try {
      let query = supabase
        .from('service_health_metrics')
        .select('*')
        .order('last_health_check', { ascending: false });

      if (serviceName) {
        query = query.eq('service_name', serviceName);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching service health metrics:', error);
      toast.error('Failed to fetch service health metrics');
      throw error;
    }
  }, []);

  const getTrafficPatterns = useCallback(async (timeWindow?: string) => {
    try {
      let query = supabase
        .from('traffic_patterns')
        .select('*')
        .order('time_window', { ascending: false });

      if (timeWindow) {
        query = query.gte('time_window', timeWindow);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching traffic patterns:', error);
      toast.error('Failed to fetch traffic patterns');
      throw error;
    }
  }, []);

  const getAnomalyEvents = useCallback(async (severityLevel?: string) => {
    try {
      let query = supabase
        .from('anomaly_detection_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (severityLevel) {
        query = query.eq('severity_level', severityLevel);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching anomaly events:', error);
      toast.error('Failed to fetch anomaly events');
      throw error;
    }
  }, []);

  const getRoutingAnalytics = useCallback(async (routePath?: string) => {
    try {
      let query = supabase
        .from('ai_routing_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (routePath) {
        query = query.eq('route_path', routePath);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching routing analytics:', error);
      toast.error('Failed to fetch routing analytics');
      throw error;
    }
  }, []);

  const getPredictiveScalingMetrics = useCallback(async (serviceName?: string) => {
    try {
      let query = supabase
        .from('predictive_scaling_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (serviceName) {
        query = query.eq('service_name', serviceName);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching predictive scaling metrics:', error);
      toast.error('Failed to fetch scaling metrics');
      throw error;
    }
  }, []);

  const updateServiceHealth = useCallback(async (
    serviceName: string,
    responseTime: number,
    errorRate: number,
    cpuUtilization: number,
    memoryUtilization: number
  ) => {
    try {
      const { data, error } = await supabase.rpc('update_service_health_score', {
        p_service_name: serviceName,
        p_response_time: responseTime,
        p_error_rate: errorRate,
        p_cpu_utilization: cpuUtilization,
        p_memory_utilization: memoryUtilization
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating service health:', error);
      toast.error('Failed to update service health');
      throw error;
    }
  }, []);

  return {
    loading,
    invokeIntelligentRouter,
    invokePredictiveScaler,
    invokeAnomalyDetector,
    getServiceHealthMetrics,
    getTrafficPatterns,
    getAnomalyEvents,
    getRoutingAnalytics,
    getPredictiveScalingMetrics,
    updateServiceHealth
  };
};