
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RedisConfig {
  url: string;
  password?: string;
}

const getRedisConfig = (): RedisConfig => {
  return {
    url: Deno.env.get('REDIS_URL') || 'redis://localhost:6379',
    password: Deno.env.get('REDIS_PASSWORD')
  };
};

// Simple Redis client implementation for basic operations
class SimpleRedisClient {
  private config: RedisConfig;

  constructor(config: RedisConfig) {
    this.config = config;
  }

  async executeCommand(command: string[]): Promise<any> {
    // In a real implementation, you would use a proper Redis client
    // For now, we'll simulate Redis operations with a simple in-memory store
    console.log('Redis command:', command.join(' '));
    
    // Simulate Redis responses
    switch (command[0].toUpperCase()) {
      case 'SET':
        return 'OK';
      case 'GET':
        return Math.random() > 0.5 ? JSON.stringify({ cached: true, data: 'sample' }) : null;
      case 'DEL':
        return 1;
      case 'FLUSHDB':
        return 'OK';
      case 'INFO':
        return 'redis_version:6.2.6\r\nused_memory:1048576\r\nconnected_clients:1';
      default:
        return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      const command = ['SET', key, value];
      if (ttl) {
        command.push('EX', ttl.toString());
      }
      
      const result = await this.executeCommand(command);
      return result === 'OK';
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.executeCommand(['GET', key]);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.executeCommand(['DEL', key]);
    } catch (error) {
      console.error('Redis DEL error:', error);
      return 0;
    }
  }

  async flushdb(): Promise<boolean> {
    try {
      const result = await this.executeCommand(['FLUSHDB']);
      return result === 'OK';
    } catch (error) {
      console.error('Redis FLUSHDB error:', error);
      return false;
    }
  }

  async info(): Promise<string> {
    try {
      return await this.executeCommand(['INFO']);
    } catch (error) {
      console.error('Redis INFO error:', error);
      return '';
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const config = getRedisConfig();
    const redis = new SimpleRedisClient(config);
    
    const { pathname } = new URL(req.url);
    const action = pathname.split('/').pop();

    switch (action) {
      case 'set': {
        const { key, data, ttl } = await req.json();
        const value = JSON.stringify({
          data,
          cached_at: new Date().toISOString(),
          expires_at: ttl ? new Date(Date.now() + ttl * 1000).toISOString() : null
        });

        const success = await redis.set(key, value, ttl);
        
        return new Response(JSON.stringify({ success }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get': {
        const { key } = await req.json();
        const value = await redis.get(key);
        
        let data = null;
        if (value) {
          try {
            const parsed = JSON.parse(value);
            // Check if data has expired
            if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
              await redis.del(key);
            } else {
              data = parsed;
            }
          } catch (error) {
            console.error('JSON parse error:', error);
          }
        }
        
        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'delete': {
        const { key } = await req.json();
        const deletedCount = await redis.del(key);
        
        return new Response(JSON.stringify({ deleted: deletedCount }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'flush': {
        const { pattern } = await req.json();
        
        // In a real implementation, you would use SCAN to find keys matching the pattern
        // For now, we'll just flush the entire database
        const success = await redis.flushdb();
        
        return new Response(JSON.stringify({ success }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'setBulk': {
        const { operations } = await req.json();
        
        let success = 0;
        let failed = 0;
        
        for (const op of operations) {
          const value = JSON.stringify({
            data: op.data,
            cached_at: new Date().toISOString(),
            expires_at: op.ttl ? new Date(Date.now() + op.ttl * 1000).toISOString() : null
          });
          
          const result = await redis.set(op.key, value, op.ttl);
          if (result) {
            success++;
          } else {
            failed++;
          }
        }
        
        return new Response(JSON.stringify({ success, failed }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'getBulk': {
        const { keys } = await req.json();
        
        const results: { [key: string]: any } = {};
        
        for (const key of keys) {
          const value = await redis.get(key);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              if (!parsed.expires_at || new Date(parsed.expires_at) >= new Date()) {
                results[key] = parsed;
              }
            } catch (error) {
              console.error('JSON parse error for key', key, ':', error);
            }
          }
        }
        
        return new Response(JSON.stringify({ data: results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'stats': {
        const info = await redis.info();
        
        // Parse basic stats from Redis INFO command
        const stats = {
          hit_rate: 0.85, // Simulated
          total_keys: 1000, // Simulated
          memory_usage: 1048576, // Simulated
          uptime: 86400 // Simulated
        };
        
        return new Response(JSON.stringify(stats), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
    }
  } catch (error) {
    console.error('Redis function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
