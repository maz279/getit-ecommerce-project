import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Service registry for dynamic routing
const SERVICE_REGISTRY = {
  '/api/v1/users': 'user-management-api',
  '/api/v1/products': 'enhanced-products-api',
  '/api/v1/orders': 'orders-api',
  '/api/v1/payments': 'payment-processing',
  '/api/v1/vendors': 'vendor-management-api',
  '/api/v1/notifications': 'notification-system',
  '/api/v1/shipping': 'shipping-integration',
  '/api/v1/analytics': 'analytics-engine',
  '/api/v1/search': 'advanced-search-engine',
  '/api/v1/ml': 'ml-recommendations',
  '/api/v1/commission': 'commission-engine',
  '/api/v1/fraud': 'fraud-detection',
  '/api/v1/cache': 'redis-cache',
  '/api/v1/files': 'file-upload',
  '/api/v1/monitoring': 'monitoring-system'
}

// Rate limiting configuration
const RATE_LIMITS = {
  default: { requests: 100, window: 60000 }, // 100 requests per minute
  premium: { requests: 1000, window: 60000 }, // 1000 requests per minute
  admin: { requests: 5000, window: 60000 } // 5000 requests per minute
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
    const path = url.pathname
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Log request
    await logRequest(supabaseClient, {
      method: req.method,
      path: path,
      userAgent: req.headers.get('user-agent'),
      clientIp: clientIp,
      timestamp: new Date().toISOString()
    })

    // Authentication check
    const authResult = await authenticateRequest(req, supabaseClient)
    if (!authResult.success && !isPublicEndpoint(path)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(clientIp, authResult.user?.role || 'default', supabaseClient)
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.retryAfter 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter.toString()
        }
      })
    }

    // Route to appropriate service
    const targetService = findTargetService(path)
    if (!targetService) {
      return new Response(JSON.stringify({ error: 'Service not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Forward request to target service
    const response = await forwardRequest(req, targetService, authResult.user)
    
    // Log response
    await logResponse(supabaseClient, {
      path: path,
      status: response.status,
      service: targetService,
      responseTime: Date.now() - new Date(req.headers.get('x-start-time') || Date.now()).getTime()
    })

    return response

  } catch (error) {
    console.error('API Gateway error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function authenticateRequest(req: Request, supabaseClient: any) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return { success: false, user: null }
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)
    
    if (error || !user) {
      return { success: false, user: null }
    }

    // Get user profile for role information
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, id')
      .eq('id', user.id)
      .single()

    return { 
      success: true, 
      user: { 
        ...user, 
        role: profile?.role || 'customer' 
      } 
    }
  } catch (error) {
    return { success: false, user: null }
  }
}

function isPublicEndpoint(path: string): boolean {
  const publicPaths = [
    '/api/v1/products/search',
    '/api/v1/products/categories',
    '/api/v1/search/public',
    '/api/v1/users/register',
    '/api/v1/users/login',
    '/api/v1/payments/webhook'
  ]
  
  return publicPaths.some(publicPath => path.startsWith(publicPath))
}

async function checkRateLimit(clientIp: string, userRole: string, supabaseClient: any) {
  const limit = RATE_LIMITS[userRole as keyof typeof RATE_LIMITS] || RATE_LIMITS.default
  const key = `rate_limit:${clientIp}:${userRole}`
  const now = Date.now()
  const windowStart = now - limit.window

  try {
    // Check current count in time window
    const { data: requests } = await supabaseClient
      .from('api_rate_limits')
      .select('count')
      .eq('key', key)
      .gte('created_at', new Date(windowStart).toISOString())
      .single()

    const currentCount = requests?.count || 0

    if (currentCount >= limit.requests) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil(limit.window / 1000) 
      }
    }

    // Update or insert rate limit record
    await supabaseClient
      .from('api_rate_limits')
      .upsert({
        key: key,
        count: currentCount + 1,
        created_at: new Date().toISOString(),
        expires_at: new Date(now + limit.window).toISOString()
      })

    return { allowed: true, retryAfter: 0 }
  } catch (error) {
    // On error, allow request but log the issue
    console.error('Rate limit check failed:', error)
    return { allowed: true, retryAfter: 0 }
  }
}

function findTargetService(path: string): string | null {
  for (const [routePrefix, serviceName] of Object.entries(SERVICE_REGISTRY)) {
    if (path.startsWith(routePrefix)) {
      return serviceName
    }
  }
  return null
}

async function forwardRequest(req: Request, targetService: string, user: any) {
  try {
    const url = new URL(req.url)
    const functionUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/${targetService}`
    
    // Clone request body if exists
    let body = null
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.json().catch(() => null)
    }

    // Forward request with additional context
    const forwardedRequest = {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      body: body ? JSON.stringify({
        ...body,
        _gateway: {
          user: user,
          originalPath: url.pathname,
          timestamp: new Date().toISOString()
        }
      }) : null
    }

    const response = await fetch(functionUrl + url.search, {
      method: forwardedRequest.method,
      headers: {
        ...forwardedRequest.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: forwardedRequest.body
    })

    const responseData = await response.text()
    
    return new Response(responseData, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'X-Gateway-Service': targetService,
        'X-Gateway-Version': '1.0.0'
      }
    })
  } catch (error) {
    console.error(`Error forwarding to ${targetService}:`, error)
    return new Response(JSON.stringify({ 
      error: 'Service unavailable',
      service: targetService 
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function logRequest(supabaseClient: any, logData: any) {
  try {
    await supabaseClient
      .from('api_gateway_logs')
      .insert({
        type: 'request',
        data: logData,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log request:', error)
  }
}

async function logResponse(supabaseClient: any, logData: any) {
  try {
    await supabaseClient
      .from('api_gateway_logs')
      .insert({
        type: 'response',
        data: logData,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log response:', error)
  }
}