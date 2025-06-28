
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardService } from '@/services/database/DashboardService';
import type { 
  DashboardKPIMetric, 
  SystemHealthLog, 
  SecurityEvent, 
  ExecutiveReport, 
  QuickAction 
} from '@/types/dashboard';
import { RedisService } from '@/services/cache/RedisService';
import { ElasticsearchService } from '@/services/search/ElasticsearchService';

export const useDashboardKPIMetrics = (filters?: any) => {
  return useQuery({
    queryKey: ['dashboard-kpi-metrics', filters],
    queryFn: async () => {
      const cacheKey = `kpi-metrics-${JSON.stringify(filters)}`;
      
      // Try to get from cache first
      const cached = await RedisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from database
      const data = await DashboardService.getKPIMetrics(filters);
      
      // Cache the result
      await RedisService.set(cacheKey, data, 300); // 5 minutes
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateKPIMetric = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (metric: Omit<DashboardKPIMetric, 'id' | 'created_at' | 'updated_at'>) => 
      DashboardService.createKPIMetric(metric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi-metrics'] });
      RedisService.flushPattern('kpi-metrics');
    },
  });
};

export const useUpdateKPIMetric = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DashboardKPIMetric> }) => 
      DashboardService.updateKPIMetric(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi-metrics'] });
      RedisService.flushPattern('kpi-metrics');
    },
  });
};

export const useDeleteKPIMetric = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DashboardService.deleteKPIMetric(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi-metrics'] });
      RedisService.flushPattern('kpi-metrics');
    },
  });
};

export const useSystemHealthLogs = (limit?: number) => {
  return useQuery({
    queryKey: ['system-health-logs', limit],
    queryFn: async () => {
      const cacheKey = `health-logs-${limit}`;
      
      const cached = await RedisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await DashboardService.getSystemHealthLogs(limit);
      await RedisService.set(cacheKey, data, 60); // 1 minute cache
      
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const useCreateSystemHealthLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (log: Omit<SystemHealthLog, 'id' | 'created_at'>) => 
      DashboardService.createSystemHealthLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-health-logs'] });
      RedisService.flushPattern('health-logs');
    },
  });
};

export const useSecurityEvents = (filters?: any) => {
  return useQuery({
    queryKey: ['security-events', filters],
    queryFn: async () => {
      const cacheKey = `security-events-${JSON.stringify(filters)}`;
      
      const cached = await RedisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await DashboardService.getSecurityEvents(filters);
      await RedisService.set(cacheKey, data, 120); // 2 minutes cache
      
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateSecurityEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: Omit<SecurityEvent, 'id' | 'created_at'>) => 
      DashboardService.createSecurityEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-events'] });
      RedisService.flushPattern('security-events');
    },
  });
};

export const useExecutiveReports = (filters?: any) => {
  return useQuery({
    queryKey: ['executive-reports', filters],
    queryFn: async () => {
      const cacheKey = `executive-reports-${JSON.stringify(filters)}`;
      
      const cached = await RedisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await DashboardService.getExecutiveReports(filters);
      await RedisService.set(cacheKey, data, 600); // 10 minutes cache
      
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateExecutiveReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (report: Omit<ExecutiveReport, 'id' | 'created_at' | 'updated_at'>) => 
      DashboardService.createExecutiveReport(report),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executive-reports'] });
      RedisService.flushPattern('executive-reports');
    },
  });
};

export const useQuickActions = (limit?: number) => {
  return useQuery({
    queryKey: ['quick-actions', limit],
    queryFn: async () => {
      const cacheKey = `quick-actions-${limit}`;
      
      const cached = await RedisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const data = await DashboardService.getQuickActions(limit);
      await RedisService.set(cacheKey, data, 180); // 3 minutes cache
      
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 3 * 60 * 1000, // 3 minutes
  });
};

export const useCreateQuickAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (action: Omit<QuickAction, 'id' | 'created_at' | 'updated_at'>) => 
      DashboardService.createQuickAction(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-actions'] });
      RedisService.flushPattern('quick-actions');
    },
  });
};

export const useUpdateQuickAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<QuickAction> }) => 
      DashboardService.updateQuickAction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-actions'] });
      RedisService.flushPattern('quick-actions');
    },
  });
};

export const useRealTimeAnalytics = (filters?: any) => {
  return useQuery({
    queryKey: ['realtime-analytics', filters],
    queryFn: () => DashboardService.getRealTimeAnalytics(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
};

export const usePerformanceMetrics = (filters?: any) => {
  return useQuery({
    queryKey: ['performance-metrics', filters],
    queryFn: () => DashboardService.getPerformanceMetrics(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardSearch = (query: string, filters?: any) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await ElasticsearchService.search('dashboard_data', {
          query,
          filters,
          size: 20
        });
        setSearchResults(results.hits);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters]);

  return { searchResults, isSearching };
};
