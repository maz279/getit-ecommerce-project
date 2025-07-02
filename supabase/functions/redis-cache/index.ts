/**
 * Redis Cache Service
 * Multi-layer caching for session management, API responses, and database queries
 */

interface CacheEntry {
  value: any;
  expiry: number;
  type: 'session' | 'api' | 'query' | 'static';
  metadata?: Record<string, any>;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
}

class RedisCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0
  };

  constructor() {
    // Clean expired entries every minute
    setInterval(() => this.cleanExpired(), 60000);
  }

  private cleanExpired() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache) {
      if (entry.expiry <= now) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} expired cache entries`);
    }
  }

  private updateStats() {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  async get(key: string): Promise<any> {
    const entry = this.cache.get(key);
    
    if (!entry || entry.expiry <= Date.now()) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }
    
    this.stats.hits++;
    this.updateStats();
    return entry.value;
  }

  async set(
    key: string, 
    value: any, 
    ttlSeconds: number = 3600,
    type: CacheEntry['type'] = 'api',
    metadata?: Record<string, any>
  ): Promise<boolean> {
    try {
      const expiry = Date.now() + (ttlSeconds * 1000);
      this.cache.set(key, {
        value,
        expiry,
        type,
        metadata
      });
      
      this.stats.sets++;
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    return entry !== undefined && entry.expiry > Date.now();
  }

  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }

  async getByPattern(pattern: string): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    for (const [key, entry] of this.cache) {
      if (regex.test(key) && entry.expiry > Date.now()) {
        result[key] = entry.value;
      }
    }
    
    return result;
  }

  async deleteByPattern(pattern: string): Promise<number> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    let deleted = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    this.stats.deletes += deleted;
    return deleted;
  }

  // Session management
  async setSession(sessionId: string, data: any, ttlSeconds: number = 3600): Promise<boolean> {
    return this.set(`session:${sessionId}`, data, ttlSeconds, 'session');
  }

  async getSession(sessionId: string): Promise<any> {
    return this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.delete(`session:${sessionId}`);
  }

  // API response caching
  async cacheAPIResponse(
    endpoint: string, 
    params: string, 
    response: any, 
    ttlSeconds: number = 300
  ): Promise<boolean> {
    const key = `api:${endpoint}:${params}`;
    return this.set(key, response, ttlSeconds, 'api');
  }

  async getCachedAPIResponse(endpoint: string, params: string): Promise<any> {
    const key = `api:${endpoint}:${params}`;
    return this.get(key);
  }

  // Database query caching
  async cacheQuery(
    query: string, 
    params: any[], 
    result: any, 
    ttlSeconds: number = 600
  ): Promise<boolean> {
    const key = `query:${Buffer.from(query + JSON.stringify(params)).toString('base64')}`;
    return this.set(key, result, ttlSeconds, 'query');
  }

  async getCachedQuery(query: string, params: any[]): Promise<any> {
    const key = `query:${Buffer.from(query + JSON.stringify(params)).toString('base64')}`;
    return this.get(key);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; stats: CacheStats; memoryUsage: any }> {
    const memoryUsage = {
      entries: this.cache.size,
      estimatedSize: JSON.stringify([...this.cache.entries()]).length
    };

    return {
      status: 'healthy',
      stats: await this.getStats(),
      memoryUsage
    };
  }
}

// Initialize cache service
const cacheService = new RedisCacheService();

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    switch (path) {
      case '/health':
        return new Response(JSON.stringify(await cacheService.healthCheck()), {
          headers: { 'Content-Type': 'application/json' }
        });

      case '/stats':
        return new Response(JSON.stringify(await cacheService.getStats()), {
          headers: { 'Content-Type': 'application/json' }
        });

      case '/get':
        const getKey = url.searchParams.get('key');
        if (!getKey) {
          return new Response('Key parameter required', { status: 400 });
        }
        const value = await cacheService.get(getKey);
        return new Response(JSON.stringify({ key: getKey, value }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case '/set':
        if (req.method !== 'POST') {
          return new Response('POST method required', { status: 405 });
        }
        const setData = await req.json();
        const { key, value: setValue, ttl = 3600, type = 'api' } = setData;
        const success = await cacheService.set(key, setValue, ttl, type);
        return new Response(JSON.stringify({ success }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case '/delete':
        const deleteKey = url.searchParams.get('key');
        if (!deleteKey) {
          return new Response('Key parameter required', { status: 400 });
        }
        const deleted = await cacheService.delete(deleteKey);
        return new Response(JSON.stringify({ deleted }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case '/session/set':
        if (req.method !== 'POST') {
          return new Response('POST method required', { status: 405 });
        }
        const sessionData = await req.json();
        const sessionSet = await cacheService.setSession(
          sessionData.sessionId, 
          sessionData.data, 
          sessionData.ttl
        );
        return new Response(JSON.stringify({ success: sessionSet }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case '/session/get':
        const sessionId = url.searchParams.get('sessionId');
        if (!sessionId) {
          return new Response('sessionId parameter required', { status: 400 });
        }
        const sessionValue = await cacheService.getSession(sessionId);
        return new Response(JSON.stringify({ sessionId, data: sessionValue }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (error) {
    console.error('Cache service error:', error);
    return new Response(JSON.stringify({ error: 'Cache service error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});