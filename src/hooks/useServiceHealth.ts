/**
 * Service Health Monitoring Hook
 * Provides real-time health monitoring for all microservices
 */

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceHealthMetric {
  service_name: string;
  health_score: number;
  response_time_avg: number;
  error_rate: number;
  cpu_utilization: number;
  memory_utilization: number;
  uptime_percentage: number;
  last_health_check: string;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  incidents: number;
  dependencies_status: Record<string, string>;
}

export interface SystemHealth {
  overall_score: number;
  services_count: number;
  healthy_services: number;
  degraded_services: number;
  down_services: number;
  total_requests_per_minute: number;
  average_response_time: number;
  error_rate_percentage: number;
  availability_sla: number;
}

export const useServiceHealth = (refreshInterval: number = 30000) => {
  const [servicesHealth, setServicesHealth] = useState<ServiceHealthMetric[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Fetch health metrics
  const fetchHealthMetrics = async () => {
    try {
      setError(null);
      
      // Fetch service health metrics
      const { data: healthData, error: healthError } = await supabase
        .from('service_health_metrics')
        .select('*')
        .order('last_health_check', { ascending: false });

      if (healthError) throw healthError;

      // Transform and enrich data
      const enrichedHealthData: ServiceHealthMetric[] = (healthData || []).map(service => ({
        service_name: service.service_name,
        health_score: service.health_score || 0,
        response_time_avg: service.response_time_avg || 0,
        error_rate: service.error_rate || 0,
        cpu_utilization: service.cpu_utilization || 0,
        memory_utilization: service.memory_utilization || 0,
        uptime_percentage: calculateUptime(service.service_name),
        last_health_check: service.last_health_check,
        status: determineServiceStatus(service.health_score || 0),
        incidents: 0,
        dependencies_status: {}
      }));

      setServicesHealth(enrichedHealthData);

      // Calculate system health
      const systemHealthMetrics = calculateSystemHealth(enrichedHealthData);
      setSystemHealth(systemHealthMetrics);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health metrics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate uptime percentage
  const calculateUptime = (serviceName: string): number => {
    // This would typically query availability_tracking table
    // For now, return a calculated value based on health score
    const service = servicesHealth.find(s => s.service_name === serviceName);
    if (!service) return 99.9;
    
    const healthScore = service.health_score || 0;
    return Math.max(95, healthScore * 0.99);
  };

  // Determine service status based on health score
  const determineServiceStatus = (healthScore: number): ServiceHealthMetric['status'] => {
    if (healthScore >= 90) return 'healthy';
    if (healthScore >= 70) return 'degraded';
    if (healthScore >= 50) return 'maintenance';
    return 'down';
  };

  // Calculate overall system health
  const calculateSystemHealth = (services: ServiceHealthMetric[]): SystemHealth => {
    if (services.length === 0) {
      return {
        overall_score: 0,
        services_count: 0,
        healthy_services: 0,
        degraded_services: 0,
        down_services: 0,
        total_requests_per_minute: 0,
        average_response_time: 0,
        error_rate_percentage: 0,
        availability_sla: 0
      };
    }

    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    const downServices = services.filter(s => s.status === 'down').length;

    const overallScore = services.reduce((sum, s) => sum + s.health_score, 0) / services.length;
    const avgResponseTime = services.reduce((sum, s) => sum + s.response_time_avg, 0) / services.length;
    const avgErrorRate = services.reduce((sum, s) => sum + s.error_rate, 0) / services.length;
    const avgAvailability = services.reduce((sum, s) => sum + s.uptime_percentage, 0) / services.length;

    return {
      overall_score: Math.round(overallScore),
      services_count: services.length,
      healthy_services: healthyServices,
      degraded_services: degradedServices,
      down_services: downServices,
      total_requests_per_minute: calculateTotalRPM(services),
      average_response_time: Math.round(avgResponseTime),
      error_rate_percentage: Number(avgErrorRate.toFixed(2)),
      availability_sla: Number(avgAvailability.toFixed(2))
    };
  };

  // Calculate total requests per minute
  const calculateTotalRPM = (services: ServiceHealthMetric[]): number => {
    // This would integrate with actual metrics
    return services.length * 1000; // Mock calculation
  };

  // Get services by status
  const getServicesByStatus = (status: ServiceHealthMetric['status']) => {
    return servicesHealth.filter(service => service.status === status);
  };

  // Get critical services (core business functions)
  const getCriticalServices = () => {
    const criticalServiceNames = [
      'user-service',
      'product-service', 
      'order-service',
      'payment-service',
      'search-service'
    ];
    
    return servicesHealth.filter(service => 
      criticalServiceNames.includes(service.service_name)
    );
  };

  // Get service dependencies health
  const getServiceDependencies = (serviceName: string) => {
    const service = servicesHealth.find(s => s.service_name === serviceName);
    return service?.dependencies_status || {};
  };

  // Check if any critical service is down
  const hasCriticalIssues = () => {
    const criticalServices = getCriticalServices();
    return criticalServices.some(service => service.status === 'down');
  };

  // Get SLA compliance status
  const getSLACompliance = () => {
    const targetSLA = 99.9;
    const currentSLA = systemHealth?.availability_sla || 0;
    
    return {
      target: targetSLA,
      current: currentSLA,
      isCompliant: currentSLA >= targetSLA,
      gap: targetSLA - currentSLA
    };
  };

  // Real-time updates
  useEffect(() => {
    fetchHealthMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('service-health-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_health_metrics'
        },
        () => {
          fetchHealthMetrics();
        }
      )
      .subscribe();

    // Set up periodic refresh
    intervalRef.current = setInterval(fetchHealthMetrics, refreshInterval);

    return () => {
      supabase.removeChannel(channel);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return {
    servicesHealth,
    systemHealth,
    loading,
    error,
    refreshHealthMetrics: fetchHealthMetrics,
    getServicesByStatus,
    getCriticalServices,
    getServiceDependencies,
    hasCriticalIssues,
    getSLACompliance
  };
};