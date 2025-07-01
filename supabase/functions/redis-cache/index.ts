import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Cache configuration
const CACHE_CONFIGS = {
  products: { ttl: 3600, prefix: 'prod:' }, // 1 hour
  categories: { ttl: 7200, prefix: 'cat:' }, // 2 hours
  search: { ttl: 1800, prefix: 'search:' }, // 30 minutes
  user_sessions: { ttl: 86400, prefix: 'session:' }, // 24 hours
  analytics: { ttl: 300, prefix: 'analytics:' }, // 5 minutes
  recommendations: { ttl: 1800, prefix: 'rec:' }, // 30 minutes
  vendor_data: { ttl: 3600, prefix: 'vendor:' }, // 1 hour
  inventory: { ttl: 600, prefix: 'inv:' }, // 10 minutes
  commission: { ttl: 7200, prefix: 'comm:' }, // 2 hours
  shipping_rates: { ttl: 3600, prefix: 'ship:' } // 1 hour
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'get':
        return await getCache(req, supabaseClient)
      case 'set':
        return await setCache(req, supabaseClient)
      case 'delete':
        return await deleteCache(req, supabaseClient)
      case 'clear':
        return await clearCache(req, supabaseClient)
      case 'stats':
        return await getCacheStats(req, supabaseClient)
      case 'warm':
        return await warmCache(req, supabaseClient)
      case 'invalidate':
        return await invalidatePattern(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Redis cache error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function getCache(req: Request, supabaseClient: any) {
  const { key, type = 'products' } = await req.json()
  
  const config = CACHE_CONFIGS[type as keyof typeof CACHE_CONFIGS] || CACHE_CONFIGS.products
  const fullKey = config.prefix + key

  try {
    // Check in Supabase cache table (acting as Redis alternative)
    const { data: cacheEntry } = await supabaseClient
      .from('cache_entries')
      .select('value, expires_at')
      .eq('key', fullKey)
      .single()

    if (!cacheEntry) {
      return new Response(JSON.stringify({ 
        success: false, 
        data: null, 
        cached: false 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if expired
    if (cacheEntry.expires_at && new Date(cacheEntry.expires_at) < new Date()) {
      // Clean up expired entry
      await supabaseClient
        .from('cache_entries')
        .delete()
        .eq('key', fullKey)

      return new Response(JSON.stringify({ 
        success: false, 
        data: null, 
        cached: false,
        expired: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update access statistics
    await updateCacheStats(supabaseClient, type, 'hit')

    return new Response(JSON.stringify({
      success: true,
      data: cacheEntry.value,
      cached: true,
      type: type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    await updateCacheStats(supabaseClient, type, 'miss')
    return new Response(JSON.stringify({ 
      success: false, 
      data: null, 
      cached: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function setCache(req: Request, supabaseClient: any) {
  const { key, value, type = 'products', ttl } = await req.json()
  
  const config = CACHE_CONFIGS[type as keyof typeof CACHE_CONFIGS] || CACHE_CONFIGS.products
  const fullKey = config.prefix + key
  const expiresAt = new Date(Date.now() + (ttl || config.ttl) * 1000)

  try {
    await supabaseClient
      .from('cache_entries')
      .upsert({
        key: fullKey,
        value: value,
        type: type,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      })

    await updateCacheStats(supabaseClient, type, 'set')

    return new Response(JSON.stringify({
      success: true,
      key: fullKey,
      expires_at: expiresAt.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function deleteCache(req: Request, supabaseClient: any) {
  const { key, type = 'products' } = await req.json()
  
  const config = CACHE_CONFIGS[type as keyof typeof CACHE_CONFIGS] || CACHE_CONFIGS.products
  const fullKey = config.prefix + key

  try {
    const { data, error } = await supabaseClient
      .from('cache_entries')
      .delete()
      .eq('key', fullKey)

    await updateCacheStats(supabaseClient, type, 'delete')

    return new Response(JSON.stringify({
      success: !error,
      deleted: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function clearCache(req: Request, supabaseClient: any) {
  const { type } = await req.json()

  try {
    if (type) {
      // Clear specific cache type
      const config = CACHE_CONFIGS[type as keyof typeof CACHE_CONFIGS]
      if (config) {
        await supabaseClient
          .from('cache_entries')
          .delete()
          .like('key', `${config.prefix}%`)
      }
    } else {
      // Clear all cache
      await supabaseClient
        .from('cache_entries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    }

    return new Response(JSON.stringify({
      success: true,
      cleared: type || 'all'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getCacheStats(req: Request, supabaseClient: any) {
  try {
    // Get overall cache statistics
    const { data: totalEntries } = await supabaseClient
      .from('cache_entries')
      .select('count', { count: 'exact' })

    const { data: expiredEntries } = await supabaseClient
      .from('cache_entries')
      .select('count', { count: 'exact' })
      .lt('expires_at', new Date().toISOString())

    // Get cache statistics by type
    const { data: statsByType } = await supabaseClient
      .from('cache_statistics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    // Calculate hit rates
    const hitRates = {}
    for (const stat of statsByType || []) {
      if (!hitRates[stat.cache_type]) {
        hitRates[stat.cache_type] = { hits: 0, misses: 0, sets: 0, deletes: 0 }
      }
      hitRates[stat.cache_type][stat.operation] += stat.count
    }

    // Calculate hit rate percentages
    Object.keys(hitRates).forEach(type => {
      const total = hitRates[type].hits + hitRates[type].misses
      hitRates[type].hit_rate = total > 0 ? (hitRates[type].hits / total * 100).toFixed(2) : 0
    })

    return new Response(JSON.stringify({
      success: true,
      stats: {
        total_entries: totalEntries?.[0]?.count || 0,
        expired_entries: expiredEntries?.[0]?.count || 0,
        hit_rates: hitRates,
        cache_configs: CACHE_CONFIGS
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function warmCache(req: Request, supabaseClient: any) {
  const { types = ['products', 'categories'] } = await req.json()

  try {
    const warmedCaches = []

    for (const type of types) {
      switch (type) {
        case 'products':
          // Warm popular products
          const { data: popularProducts } = await supabaseClient
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('view_count', { ascending: false })
            .limit(100)

          if (popularProducts) {
            for (const product of popularProducts) {
              await setCache(
                new Request('', { 
                  method: 'POST', 
                  body: JSON.stringify({
                    key: product.id,
                    value: product,
                    type: 'products'
                  })
                }),
                supabaseClient
              )
            }
            warmedCaches.push(`products (${popularProducts.length} items)`)
          }
          break

        case 'categories':
          // Warm all categories
          const { data: categories } = await supabaseClient
            .from('categories')
            .select('*')
            .eq('is_active', true)

          if (categories) {
            await setCache(
              new Request('', { 
                method: 'POST', 
                body: JSON.stringify({
                  key: 'all',
                  value: categories,
                  type: 'categories'
                })
              }),
              supabaseClient
            )
            warmedCaches.push(`categories (${categories.length} items)`)
          }
          break
      }
    }

    return new Response(JSON.stringify({
      success: true,
      warmed_caches: warmedCaches
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function invalidatePattern(req: Request, supabaseClient: any) {
  const { pattern, type } = await req.json()

  try {
    const config = CACHE_CONFIGS[type as keyof typeof CACHE_CONFIGS]
    if (!config) {
      throw new Error('Invalid cache type')
    }

    const searchPattern = config.prefix + pattern
    
    await supabaseClient
      .from('cache_entries')
      .delete()
      .like('key', searchPattern)

    return new Response(JSON.stringify({
      success: true,
      invalidated_pattern: searchPattern
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function updateCacheStats(supabaseClient: any, cacheType: string, operation: string) {
  try {
    await supabaseClient
      .from('cache_statistics')
      .upsert({
        cache_type: cacheType,
        operation: operation,
        count: 1,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to update cache stats:', error)
  }
}