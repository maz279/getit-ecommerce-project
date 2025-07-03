/**
 * GetIt E-commerce Platform - Rate Limiting Middleware
 * Advanced rate limiting with Redis backend and multiple strategies
 * 
 * @module RateLimitMiddleware
 */

const redis = require('redis');
const logger = require('../utils/logger');
const errorHandler = require('../utils/error-handler');

class RateLimitMiddleware {
  constructor(config) {
    this.redisClient = redis.createClient(config.redis || {});
    this.defaultLimits = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
      message: 'Too many requests, please try again later'
    };
    
    // Different rate limits for different user types
    this.userTypeLimits = {
      'guest': { windowMs: 15 * 60 * 1000, max: 50 },
      'customer': { windowMs: 15 * 60 * 1000, max: 200 },
      'vendor': { windowMs: 15 * 60 * 1000, max: 500 },
      'admin': { windowMs: 15 * 60 * 1000, max: 1000 },
      'super_admin': { windowMs: 15 * 60 * 1000, max: 2000 }
    };

    // API endpoint specific limits
    this.endpointLimits = {
      '/api/auth/login': { windowMs: 15 * 60 * 1000, max: 5 },
      '/api/auth/register': { windowMs: 60 * 60 * 1000, max: 3 },
      '/api/password/reset': { windowMs: 60 * 60 * 1000, max: 3 },
      '/api/products/search': { windowMs: 60 * 1000, max: 60 },
      '/api/orders/create': { windowMs: 60 * 1000, max: 10 },
      '/api/payments/process': { windowMs: 60 * 1000, max: 5 }
    };

    this.initializeRedis();
  }

  async initializeRedis() {
    try {
      await this.redisClient.connect();
      logger.info('Redis connected for rate limiting');
    } catch (error) {
      logger.error('Redis connection failed for rate limiting', { error: error.message });
    }
  }

  /**
   * Generate rate limit key based on IP and user
   */
  generateKey(req, identifier) {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?.id || 'anonymous';
    const endpoint = req.route?.path || req.path;
    
    return `rate_limit:${identifier}:${ip}:${userId}:${endpoint}`;
  }

  /**
   * Get rate limit configuration for request
   */
  getRateLimitConfig(req) {
    const endpoint = req.route?.path || req.path;
    const userRole = req.user?.role || 'guest';

    // Check for endpoint-specific limits first
    if (this.endpointLimits[endpoint]) {
      return this.endpointLimits[endpoint];
    }

    // Use user type limits
    if (this.userTypeLimits[userRole]) {
      return this.userTypeLimits[userRole];
    }

    // Default limits
    return this.defaultLimits;
  }

  /**
   * Check and update rate limit using sliding window
   */
  async checkRateLimit(key, config) {
    try {
      const now = Date.now();
      const window = config.windowMs;
      const limit = config.max;
      
      // Use Redis sorted sets for sliding window
      const pipeline = this.redisClient.multi();
      
      // Remove expired entries
      pipeline.zRemRangeByScore(key, 0, now - window);
      
      // Count current requests in window
      pipeline.zCard(key);
      
      // Add current request
      pipeline.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
      
      // Set expiration
      pipeline.expire(key, Math.ceil(window / 1000));
      
      const results = await pipeline.exec();
      const currentCount = results[1][1];

      return {
        allowed: currentCount < limit,
        count: currentCount + 1,
        remaining: Math.max(0, limit - currentCount - 1),
        resetTime: now + window,
        limit: limit
      };
    } catch (error) {
      logger.error('Rate limit check failed', { key, error: error.message });
      // Allow request if Redis fails
      return { allowed: true, count: 0, remaining: 100, resetTime: Date.now() + 900000, limit: 100 };
    }
  }

  /**
   * Express middleware for rate limiting
   */
  limit(customConfig = {}) {
    return async (req, res, next) => {
      try {
        const config = { ...this.getRateLimitConfig(req), ...customConfig };
        const key = this.generateKey(req, 'global');
        
        const result = await this.checkRateLimit(key, config);

        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': result.limit,
          'X-RateLimit-Remaining': result.remaining,
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
        });

        if (!result.allowed) {
          logger.warn('Rate limit exceeded', {
            ip: req.ip,
            userId: req.user?.id,
            endpoint: req.path,
            count: result.count,
            limit: result.limit
          });

          return res.status(429).json(
            errorHandler.formatError('RATE_LIMIT_EXCEEDED', config.message || this.defaultLimits.message, {
              retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
            })
          );
        }

        logger.debug('Rate limit check passed', {
          ip: req.ip,
          userId: req.user?.id,
          endpoint: req.path,
          count: result.count,
          remaining: result.remaining
        });

        next();
      } catch (error) {
        logger.error('Rate limiting middleware error', {
          error: error.message,
          endpoint: req.path,
          ip: req.ip
        });

        // Allow request if rate limiting fails
        next();
      }
    };
  }

  /**
   * Special rate limiting for authentication endpoints
   */
  authLimit() {
    return this.limit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per 15 minutes
      message: 'Too many authentication attempts, please try again later'
    });
  }

  /**
   * Rate limiting for API endpoints based on user role
   */
  apiLimit() {
    return async (req, res, next) => {
      const userRole = req.user?.role || 'guest';
      const config = this.userTypeLimits[userRole] || this.defaultLimits;
      
      return this.limit(config)(req, res, next);
    };
  }

  /**
   * Rate limiting for payment processing
   */
  paymentLimit() {
    return this.limit({
      windowMs: 60 * 1000, // 1 minute
      max: 3, // 3 payment attempts per minute
      message: 'Too many payment attempts, please try again later'
    });
  }

  /**
   * Rate limiting for order creation
   */
  orderLimit() {
    return this.limit({
      windowMs: 60 * 1000, // 1 minute
      max: 5, // 5 orders per minute
      message: 'Too many order creation attempts, please slow down'
    });
  }

  /**
   * Rate limiting for search requests
   */
  searchLimit() {
    return this.limit({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 searches per minute
      message: 'Too many search requests, please try again later'
    });
  }

  /**
   * Dynamic rate limiting based on server load
   */
  adaptiveLimit() {
    return async (req, res, next) => {
      try {
        // Get current server metrics (CPU, memory, etc.)
        const serverLoad = await this.getServerLoad();
        
        let multiplier = 1;
        if (serverLoad > 80) {
          multiplier = 0.5; // Reduce limits by 50% under high load
        } else if (serverLoad > 60) {
          multiplier = 0.75; // Reduce limits by 25% under moderate load
        }

        const config = this.getRateLimitConfig(req);
        config.max = Math.floor(config.max * multiplier);

        return this.limit(config)(req, res, next);
      } catch (error) {
        logger.error('Adaptive rate limiting error', { error: error.message });
        return this.limit()(req, res, next);
      }
    };
  }

  /**
   * Get current server load (simplified)
   */
  async getServerLoad() {
    try {
      const os = require('os');
      const cpus = os.cpus();
      const loadAverage = os.loadavg()[0];
      const totalCores = cpus.length;
      
      return Math.min(100, (loadAverage / totalCores) * 100);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Whitelist IP addresses or users
   */
  whitelist(ips = [], userIds = []) {
    return (req, res, next) => {
      const clientIp = req.ip || req.connection.remoteAddress;
      const userId = req.user?.id;

      if (ips.includes(clientIp) || userIds.includes(userId)) {
        logger.info('Request whitelisted', { ip: clientIp, userId });
        return next();
      }

      return this.limit()(req, res, next);
    };
  }

  /**
   * Get rate limit status for a user/IP
   */
  async getStatus(req) {
    try {
      const config = this.getRateLimitConfig(req);
      const key = this.generateKey(req, 'global');
      
      const count = await this.redisClient.zCard(key);
      const remaining = Math.max(0, config.max - count);
      
      return {
        limit: config.max,
        remaining,
        resetTime: Date.now() + config.windowMs,
        windowMs: config.windowMs
      };
    } catch (error) {
      logger.error('Failed to get rate limit status', { error: error.message });
      return null;
    }
  }

  /**
   * Reset rate limit for a user/IP (admin function)
   */
  async resetLimit(req) {
    try {
      const key = this.generateKey(req, 'global');
      await this.redisClient.del(key);
      
      logger.info('Rate limit reset', {
        ip: req.ip,
        userId: req.user?.id,
        key
      });

      return true;
    } catch (error) {
      logger.error('Failed to reset rate limit', { error: error.message });
      return false;
    }
  }
}

module.exports = RateLimitMiddleware;