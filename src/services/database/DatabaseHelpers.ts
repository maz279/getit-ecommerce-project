/**
 * Database Helper Service
 * Provides optimized database operations and query helpers
 */

import { supabase } from "@/integrations/supabase/client";
import { encryptionService } from "@/services/security/EncryptionService";

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  select?: string;
  cache?: boolean;
  cacheTTL?: number;
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  errors: any[];
  data?: any[];
}

export class DatabaseHelpers {
  private static instance: DatabaseHelpers;
  private queryCache = new Map<string, { data: any; expires: number }>();

  public static getInstance(): DatabaseHelpers {
    if (!DatabaseHelpers.instance) {
      DatabaseHelpers.instance = new DatabaseHelpers();
    }
    return DatabaseHelpers.instance;
  }

  /**
   * Generic paginated query with caching
   */
  async paginatedQuery<T>(
    tableName: string, 
    options: QueryOptions = {}
  ): Promise<{ data: T[]; count: number; hasMore: boolean }> {
    const {
      page = 1,
      limit = 50,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
      select = '*',
      cache = true,
      cacheTTL = 300000 // 5 minutes
    } = options;

    const cacheKey = `${tableName}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (cache && this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey)!;
      if (Date.now() < cached.expires) {
        return cached.data;
      }
      this.queryCache.delete(cacheKey);
    }

    const offset = (page - 1) * limit;
    
    let query = supabase
      .from(tableName)
      .select(select, { count: 'exact' });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'string' && value.includes('%')) {
          query = query.like(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const result = {
      data: data || [],
      count: count || 0,
      hasMore: (count || 0) > offset + limit
    };

    // Cache the result
    if (cache) {
      this.queryCache.set(cacheKey, {
        data: result,
        expires: Date.now() + cacheTTL
      });
    }

    return result;
  }

  /**
   * Bulk insert with transaction support
   */
  async bulkInsert<T>(tableName: string, records: T[]): Promise<BulkOperationResult> {
    const batchSize = 1000;
    const results: BulkOperationResult = {
      success: true,
      processed: 0,
      errors: [],
      data: []
    };

    try {
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from(tableName)
          .insert(batch)
          .select();

        if (error) {
          results.errors.push({
            batch: Math.floor(i / batchSize) + 1,
            error: error.message,
            records: batch.length
          });
          results.success = false;
        } else {
          results.processed += batch.length;
          if (data) results.data?.push(...data);
        }
      }
    } catch (error) {
      results.success = false;
      results.errors.push({
        type: 'bulk_insert_error',
        error: (error as Error).message
      });
    }

    return results;
  }

  /**
   * Bulk update with optimistic locking
   */
  async bulkUpdate<T>(
    tableName: string, 
    updates: Array<{ id: string; data: Partial<T>; version?: number }>
  ): Promise<BulkOperationResult> {
    const results: BulkOperationResult = {
      success: true,
      processed: 0,
      errors: [],
      data: []
    };

    try {
      for (const update of updates) {
        let query = supabase
          .from(tableName)
          .update(update.data)
          .eq('id', update.id);

        // Add optimistic locking if version provided
        if (update.version !== undefined) {
          query = query.eq('version', update.version);
        }

        const { data, error } = await query.select();

        if (error) {
          results.errors.push({
            id: update.id,
            error: error.message
          });
          results.success = false;
        } else if (data && data.length === 0) {
          results.errors.push({
            id: update.id,
            error: 'Record not found or version mismatch'
          });
          results.success = false;
        } else {
          results.processed++;
          if (data) results.data?.push(...data);
        }
      }
    } catch (error) {
      results.success = false;
      results.errors.push({
        type: 'bulk_update_error',
        error: (error as Error).message
      });
    }

    return results;
  }

  /**
   * Advanced search with full-text search
   */
  async fullTextSearch<T>(
    tableName: string,
    searchQuery: string,
    searchColumns: string[],
    options: QueryOptions = {}
  ): Promise<{ data: T[]; count: number }> {
    const { limit = 50, filters = {} } = options;

    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact' });

    // Apply filters first
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });

    // Apply full-text search
    if (searchQuery) {
      const searchConditions = searchColumns
        .map(col => `${col}.ilike.%${searchQuery}%`)
        .join(',');
      
      query = query.or(searchConditions);
    }

    const { data, error, count } = await query.limit(limit);

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  }

  /**
   * Execute custom SQL with parameters
   */
  async executeSQL(sql: string, params: any[] = []): Promise<any> {
    const { data, error } = await supabase.rpc('execute_sql', {
      query: sql,
      params: params
    });

    if (error) throw error;
    return data;
  }

  /**
   * Analytics query builder
   */
  async analyticsQuery(
    tableName: string,
    metrics: string[],
    dimensions: string[],
    filters: Record<string, any> = {},
    dateRange?: { start: string; end: string }
  ): Promise<any> {
    let query = supabase.from(tableName);

    // Build select clause
    const selectClause = [
      ...dimensions,
      ...metrics.map(metric => {
        if (metric.includes('count')) return `count(*)`;
        if (metric.includes('sum')) return `sum(${metric.replace('sum_', '')})`;
        if (metric.includes('avg')) return `avg(${metric.replace('avg_', '')})`;
        return metric;
      })
    ].join(', ');

    query = query.select(selectClause);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });

    // Apply date range
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  }

  /**
   * Upsert with conflict resolution
   */
  async upsert<T>(
    tableName: string,
    record: T,
    conflictColumns: string[] = ['id']
  ): Promise<T> {
    const { data, error } = await supabase
      .from(tableName)
      .upsert(record, {
        onConflict: conflictColumns.join(','),
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Soft delete implementation
   */
  async softDelete(tableName: string, id: string): Promise<boolean> {
    const { error } = await supabase
      .from(tableName)
      .update({ 
        deleted_at: new Date().toISOString(),
        is_deleted: true 
      })
      .eq('id', id);

    return !error;
  }

  /**
   * Database health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    activeConnections?: number;
  }> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'down',
          responseTime
        };
      }

      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Clear query cache
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.queryCache.keys()) {
        if (key.includes(pattern)) {
          this.queryCache.delete(key);
        }
      }
    } else {
      this.queryCache.clear();
    }
  }
}

export const databaseHelpers = DatabaseHelpers.getInstance();