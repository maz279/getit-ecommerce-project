/**
 * API Gateway Service
 * Centralized routing, authentication, rate limiting, and request transformation
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
}

interface RouteConfig {
  path: string;
  target: string;
  methods: string[];
  auth: boolean;
  rateLimit?: RateLimitConfig;
  transform?: {
    request?: (req: Request) => Request;
    response?: (res: Response) => Response;
  };
}

class APIGateway {
  private routes: Map<string, RouteConfig> = new Map();
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    // User service routes
    this.addRoute({
      path: '/api/v1/users',
      target: '/user-management-api',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      auth: true,
      rateLimit: { maxRequests: 100, windowMs: 60000 }
    });

    // Product service routes
    this.addRoute({
      path: '/api/v1/products',
      target: '/products-api',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      auth: false,
      rateLimit: { maxRequests: 200, windowMs: 60000 }
    });

    // Order service routes
    this.addRoute({
      path: '/api/v1/orders',
      target: '/orders-api',
      methods: ['GET', 'POST', 'PUT'],
      auth: true,
      rateLimit: { maxRequests: 50, windowMs: 60000 }
    });

    // Payment service routes
    this.addRoute({
      path: '/api/v1/payments',
      target: '/payment-processing',
      methods: ['POST', 'GET'],
      auth: true,
      rateLimit: { maxRequests: 20, windowMs: 60000 }
    });

    // Analytics service routes
    this.addRoute({
      path: '/api/v1/analytics',
      target: '/business-analytics',
      methods: ['GET', 'POST'],
      auth: true,
      rateLimit: { maxRequests: 30, windowMs: 60000 }
    });

    // Search service routes
    this.addRoute({
      path: '/api/v1/search',
      target: '/advanced-search-engine',
      methods: ['GET', 'POST'],
      auth: false,
      rateLimit: { maxRequests: 500, windowMs: 60000 }
    });
  }

  private addRoute(config: RouteConfig) {
    this.routes.set(config.path, config);
  }

  private async authenticate(req: Request): Promise<boolean> {
    try {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return false;
      }

      const token = authHeader.substring(7);
      // Validate JWT token here
      // This would integrate with Supabase auth
      return token.length > 0; // Simplified validation
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  private async checkRateLimit(
    req: Request, 
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = config.keyGenerator ? 
      config.keyGenerator(req) : 
      req.headers.get('x-forwarded-for') || 'anonymous';

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean old entries
    this.rateLimitStore.forEach((value, storeKey) => {
      if (value.resetTime < windowStart) {
        this.rateLimitStore.delete(storeKey);
      }
    });

    const current = this.rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs };
    
    if (current.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      };
    }

    current.count++;
    this.rateLimitStore.set(key, current);

    return {
      allowed: true,
      remaining: config.maxRequests - current.count,
      resetTime: current.resetTime
    };
  }

  private findRoute(pathname: string): RouteConfig | null {
    // Exact match first
    if (this.routes.has(pathname)) {
      return this.routes.get(pathname)!;
    }

    // Pattern matching for dynamic routes
    for (const [path, config] of this.routes) {
      if (pathname.startsWith(path)) {
        return config;
      }
    }

    return null;
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const route = this.findRoute(url.pathname);

    if (!route) {
      return new Response(JSON.stringify({ 
        error: 'Route not found',
        path: url.pathname 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Method validation
    if (!route.methods.includes(req.method)) {
      return new Response(JSON.stringify({ 
        error: 'Method not allowed',
        allowed: route.methods 
      }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Authentication check
    if (route.auth) {
      const isAuthenticated = await this.authenticate(req);
      if (!isAuthenticated) {
        return new Response(JSON.stringify({ 
          error: 'Authentication required' 
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Rate limiting
    if (route.rateLimit) {
      const rateCheck = await this.checkRateLimit(req, route.rateLimit);
      if (!rateCheck.allowed) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded',
          resetTime: rateCheck.resetTime 
        }), { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateCheck.resetTime.toString()
          }
        });
      }
    }

    try {
      // Transform request if needed
      let transformedReq = req;
      if (route.transform?.request) {
        transformedReq = route.transform.request(req);
      }

      // Route to target service
      const targetUrl = new URL(route.target, req.url);
      const targetReq = new Request(targetUrl.toString(), {
        method: transformedReq.method,
        headers: transformedReq.headers,
        body: transformedReq.body
      });

      // Forward to target service (this would be actual service calls)
      const response = new Response(JSON.stringify({ 
        message: `Routed to ${route.target}`,
        path: url.pathname,
        method: req.method,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      // Transform response if needed
      if (route.transform?.response) {
        return route.transform.response(response);
      }

      return response;

    } catch (error) {
      console.error('Gateway routing error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal gateway error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Initialize gateway
const gateway = new APIGateway();

Deno.serve(async (req) => {
  try {
    return await gateway.handle(req);
  } catch (error) {
    console.error('Gateway error:', error);
    return new Response(JSON.stringify({ 
      error: 'Gateway unavailable' 
    }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});