/**
 * Microservice Registry - Central service discovery and management
 * Connects to Supabase microservices_registry table
 */

import { supabase } from "@/integrations/supabase/client";

export interface ServiceInstance {
  id: string;
  service_name: string;
  service_type: string;
  version: string;
  endpoint_url: string;
  health_check_url: string;
  status: string;
  configuration: any;
  dependencies: any;
  resource_limits: any;
  last_health_check: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceHealth {
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time_ms: number;
  error_rate: number;
  cpu_usage: number;
  memory_usage: number;
  last_check: string;
}

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, ServiceInstance> = new Map();
  private healthCache: Map<string, ServiceHealth> = new Map();

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  async registerService(service: Omit<ServiceInstance, 'id' | 'created_at' | 'updated_at' | 'last_health_check'>): Promise<ServiceInstance> {
    const { data, error } = await supabase
      .from('microservices_registry')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    
    this.services.set(service.service_name, data);
    return data;
  }

  async getService(serviceName: string): Promise<ServiceInstance | null> {
    // Check cache first
    if (this.services.has(serviceName)) {
      return this.services.get(serviceName)!;
    }

    const { data, error } = await supabase
      .from('microservices_registry')
      .select()
      .eq('service_name', serviceName)
      .eq('status', 'healthy')
      .single();

    if (error) return null;
    
    this.services.set(serviceName, data);
    return data;
  }

  async getAllServices(): Promise<ServiceInstance[]> {
    const { data, error } = await supabase
      .from('microservices_registry')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Update cache
    data.forEach(service => {
      this.services.set(service.service_name, service);
    });
    
    return data;
  }

  async updateServiceHealth(serviceName: string, health: Partial<ServiceHealth>): Promise<void> {
    const { error } = await supabase
      .from('service_health_metrics')
      .upsert({
        service_name: serviceName,
        health_score: this.calculateHealthScore(health),
        response_time_avg: health.response_time_ms || 0,
        error_rate: health.error_rate || 0,
        cpu_utilization: health.cpu_usage || 0,
        memory_utilization: health.memory_usage || 0,
        last_health_check: new Date().toISOString()
      });

    if (error) throw error;
    
    this.healthCache.set(serviceName, health as ServiceHealth);
  }

  async getServiceHealth(serviceName: string): Promise<ServiceHealth | null> {
    const { data, error } = await supabase
      .from('service_health_metrics')
      .select()
      .eq('service_name', serviceName)
      .single();

    if (error) return null;
    
    const health: ServiceHealth = {
      service_name: serviceName,
      status: data.health_score > 80 ? 'healthy' : data.health_score > 50 ? 'degraded' : 'down',
      response_time_ms: data.response_time_avg,
      error_rate: data.error_rate,
      cpu_usage: data.cpu_utilization,
      memory_usage: data.memory_utilization,
      last_check: data.last_health_check
    };

    this.healthCache.set(serviceName, health);
    return health;
  }

  private calculateHealthScore(health: Partial<ServiceHealth>): number {
    let score = 100;
    
    if (health.response_time_ms && health.response_time_ms > 1000) score -= 20;
    if (health.error_rate && health.error_rate > 0.05) score -= 30;
    if (health.cpu_usage && health.cpu_usage > 0.8) score -= 25;
    if (health.memory_usage && health.memory_usage > 0.8) score -= 25;
    
    return Math.max(0, score);
  }

  async deregisterService(serviceName: string): Promise<void> {
    const { error } = await supabase
      .from('microservices_registry')
      .update({ status: 'stopping' })
      .eq('service_name', serviceName);

    if (error) throw error;
    
    this.services.delete(serviceName);
    this.healthCache.delete(serviceName);
  }

  // Real-time service discovery
  async startServiceDiscovery(): Promise<void> {
    const channel = supabase
      .channel('service-registry')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'microservices_registry'
      }, (payload) => {
        console.log('Service registry change:', payload);
        // Update local cache
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          this.services.set(payload.new.service_name, payload.new as ServiceInstance);
        } else if (payload.eventType === 'DELETE') {
          this.services.delete(payload.old.service_name);
        }
      })
      .subscribe();
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();