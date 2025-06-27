
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix: string;
}

export interface CachedCommissionData {
  data: any;
  cached_at: string;
  expires_at: string;
  cache_key: string;
}

export class CommissionCacheService {
  private static readonly API_BASE = '/functions/v1/redis-commission-cache';
  private static readonly DEFAULT_TTL = 3600; // 1 hour
  private static readonly CACHE_PREFIX = 'commission:';

  // Commission-specific cache keys
  private static readonly CACHE_KEYS = {
    COMMISSION_LIST: 'commissions:list',
    COMMISSION_DETAIL: 'commission:detail',
    COMMISSION_ANALYTICS: 'analytics',
    COMMISSION_RATES: 'rates',
    VENDOR_COMMISSIONS: 'vendor:commissions',
    PAYOUT_SUMMARY: 'payout:summary',
    DISPUTE_LIST: 'disputes:list',
    DASHBOARD_STATS: 'dashboard:stats'
  };

  // Generic cache operations
  static async set(key: string, data: any, ttl: number = this.DEFAULT_TTL): Promise<boolean> {
    try {
      const cacheKey = this.buildCacheKey(key);
      const response = await fetch(`${this.API_BASE}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: cacheKey,
          data,
          ttl
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  static async get<T = any>(key: string): Promise<T | null> {
    try {
      const cacheKey = this.buildCacheKey(key);
      const response = await fetch(`${this.API_BASE}/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cacheKey })
      });

      if (!response.ok) return null;

      const result = await response.json();
      return result?.data || null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async delete(key: string): Promise<boolean> {
    try {
      const cacheKey = this.buildCacheKey(key);
      const response = await fetch(`${this.API_BASE}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cacheKey })
      });

      return response.ok;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  static async flush(pattern?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/flush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pattern: pattern ? this.buildCacheKey(pattern) : `${this.CACHE_PREFIX}*`
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  // Commission-specific cache methods
  static async cacheCommissionList(
    filters: any,
    commissions: any[],
    ttl: number = 1800 // 30 minutes
  ): Promise<boolean> {
    const key = `${this.CACHE_KEYS.COMMISSION_LIST}:${this.hashFilters(filters)}`;
    return this.set(key, {
      commissions,
      filters,
      count: commissions.length,
      cached_at: new Date().toISOString()
    }, ttl);
  }

  static async getCachedCommissionList(filters: any): Promise<any[] | null> {
    const key = `${this.CACHE_KEYS.COMMISSION_LIST}:${this.hashFilters(filters)}`;
    const cached = await this.get(key);
    return cached?.commissions || null;
  }

  static async cacheCommissionDetail(
    commissionId: string,
    commission: any,
    ttl: number = 3600 // 1 hour
  ): Promise<boolean> {
    const key = `${this.CACHE_KEYS.COMMISSION_DETAIL}:${commissionId}`;
    return this.set(key, commission, ttl);
  }

  static async getCachedCommissionDetail(commissionId: string): Promise<any | null> {
    const key = `${this.CACHE_KEYS.COMMISSION_DETAIL}:${commissionId}`;
    return this.get(key);
  }

  static async cacheVendorCommissions(
    vendorId: string,
    commissions: any[],
    ttl: number = 1800 // 30 minutes
  ): Promise<boolean> {
    const key = `${this.CACHE_KEYS.VENDOR_COMMISSIONS}:${vendorId}`;
    return this.set(key, {
      vendor_id: vendorId,
      commissions,
      total_amount: commissions.reduce((sum, c) => sum + c.commission_amount, 0),
      cached_at: new Date().toISOString()
    }, ttl);
  }

  static async getCachedVendorCommissions(vendorId: string): Promise<any | null> {
    const key = `${this.CACHE_KEYS.VENDOR_COMMISSIONS}:${vendorId}`;
    return this.get(key);
  }

  static async cacheAnalytics(
    analyticsType: string,
    params: any,
    data: any,
    ttl: number = 3600 // 1 hour
  ): Promise<boolean> {
    const key = `${this.CACHE_KEYS.COMMISSION_ANALYTICS}:${analyticsType}:${this.hashFilters(params)}`;
    return this.set(key, {
      analytics_type: analyticsType,
      params,
      data,
      generated_at: new Date().toISOString()
    }, ttl);
  }

  static async getCachedAnalytics(analyticsType: string, params: any): Promise<any | null> {
    const key = `${this.CACHE_KEYS.COMMISSION_ANALYTICS}:${analyticsType}:${this.hashFilters(params)}`;
    const cached = await this.get(key);
    return cached?.data || null;
  }

  static async cacheDashboardStats(
    stats: any,
    ttl: number = 900 // 15 minutes
  ): Promise<boolean> {
    const key = this.CACHE_KEYS.DASHBOARD_STATS;
    return this.set(key, {
      stats,
      last_updated: new Date().toISOString()
    }, ttl);
  }

  static async getCachedDashboardStats(): Promise<any | null> {
    const key = this.CACHE_KEYS.DASHBOARD_STATS;
    const cached = await this.get(key);
    return cached?.stats || null;
  }

  // Bulk cache operations
  static async setBulk(items: { key: string; data: any; ttl?: number }[]): Promise<{
    success: number;
    failed: number;
  }> {
    try {
      const operations = items.map(item => ({
        key: this.buildCacheKey(item.key),
        data: item.data,
        ttl: item.ttl || this.DEFAULT_TTL
      }));

      const response = await fetch(`${this.API_BASE}/setBulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations })
      });

      if (!response.ok) {
        throw new Error(`Bulk cache operation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bulk cache set error:', error);
      return { success: 0, failed: items.length };
    }
  }

  static async getBulk(keys: string[]): Promise<{ [key: string]: any }> {
    try {
      const cacheKeys = keys.map(key => this.buildCacheKey(key));
      const response = await fetch(`${this.API_BASE}/getBulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: cacheKeys })
      });

      if (!response.ok) return {};

      const result = await response.json();
      return result?.data || {};
    } catch (error) {
      console.error('Bulk cache get error:', error);
      return {};
    }
  }

  // Cache invalidation strategies
  static async invalidateCommissionCache(commissionId: string): Promise<void> {
    const keysToInvalidate = [
      `${this.CACHE_KEYS.COMMISSION_DETAIL}:${commissionId}`,
      `${this.CACHE_KEYS.COMMISSION_LIST}*`,
      this.CACHE_KEYS.DASHBOARD_STATS
    ];

    await Promise.all(keysToInvalidate.map(key => this.delete(key)));
  }

  static async invalidateVendorCache(vendorId: string): Promise<void> {
    const keysToInvalidate = [
      `${this.CACHE_KEYS.VENDOR_COMMISSIONS}:${vendorId}`,
      `${this.CACHE_KEYS.COMMISSION_LIST}*`,
      `${this.CACHE_KEYS.COMMISSION_ANALYTICS}*`,
      this.CACHE_KEYS.DASHBOARD_STATS
    ];

    await Promise.all(keysToInvalidate.map(key => this.delete(key)));
  }

  static async invalidateAnalyticsCache(): Promise<void> {
    await this.flush(`${this.CACHE_KEYS.COMMISSION_ANALYTICS}*`);
    await this.delete(this.CACHE_KEYS.DASHBOARD_STATS);
  }

  // Utility methods
  private static buildCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${key}`;
  }

  private static hashFilters(filters: any): string {
    // Simple hash function for filters - in production, use a proper hash library
    const filterString = JSON.stringify(filters, Object.keys(filters).sort());
    let hash = 0;
    for (let i = 0; i < filterString.length; i++) {
      const char = filterString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  // Cache health monitoring
  static async getCacheStats(): Promise<{
    hit_rate: number;
    total_keys: number;
    memory_usage: number;
    uptime: number;
  } | null> {
    try {
      const response = await fetch(`${this.API_BASE}/stats`, {
        method: 'GET'
      });

      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }
}
