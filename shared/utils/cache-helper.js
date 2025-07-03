/**
 * GetIt E-commerce Platform - Cache Helper
 * Redis-based caching with advanced features
 * 
 * @module CacheHelper
 */

const redis = require('redis');
const logger = require('./logger');
const errorHandler = require('./error-handler');

class CacheHelper {
  constructor(config = {}) {
    this.redisClient = redis.createClient(config.redis || {});
    this.defaultTTL = config.defaultTTL || 3600; // 1 hour
    this.keyPrefix = config.keyPrefix || 'getit:cache:';
    this.compressionThreshold = config.compressionThreshold || 1024; // 1KB
    this.serializationMethod = config.serializationMethod || 'json';
    
    this.initializeRedis();
  }

  async initializeRedis() {
    try {
      await this.redisClient.connect();
      logger.info('Redis connected for caching');
    } catch (error) {
      logger.error('Redis connection failed for caching', { error: error.message });
    }
  }

  /**
   * Generate cache key with namespace
   */
  generateKey(key, namespace = 'default') {
    return `${this.keyPrefix}${namespace}:${key}`;
  }

  /**
   * Serialize data for storage
   */
  serialize(data) {
    try {
      if (this.serializationMethod === 'json') {
        return JSON.stringify(data);
      } else if (this.serializationMethod === 'msgpack') {
        // For high-performance scenarios, you can use msgpack
        const msgpack = require('msgpack');
        return msgpack.encode(data);
      }
      return String(data);
    } catch (error) {
      logger.error('Cache serialization failed', { error: error.message });
      throw errorHandler.createError('CACHE_SERIALIZATION_ERROR', 'Failed to serialize cache data');
    }
  }

  /**
   * Deserialize data from storage
   */
  deserialize(data) {
    try {
      if (!data) return null;
      
      if (this.serializationMethod === 'json') {
        return JSON.parse(data);
      } else if (this.serializationMethod === 'msgpack') {
        const msgpack = require('msgpack');
        return msgpack.decode(data);
      }
      return data;
    } catch (error) {
      logger.error('Cache deserialization failed', { error: error.message });
      return null;
    }
  }

  /**
   * Set cache value with TTL
   */
  async set(key, value, ttl = null, namespace = 'default') {
    try {
      const cacheKey = this.generateKey(key, namespace);
      const serializedValue = this.serialize(value);
      const finalTTL = ttl || this.defaultTTL;

      await this.redisClient.setEx(cacheKey, finalTTL, serializedValue);

      logger.debug('Cache set successfully', {
        key: cacheKey,
        ttl: finalTTL,
        size: serializedValue.length
      });

      return true;
    } catch (error) {
      logger.error('Cache set failed', {
        key,
        namespace,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get cache value
   */
  async get(key, namespace = 'default') {
    try {
      const cacheKey = this.generateKey(key, namespace);
      const data = await this.redisClient.get(cacheKey);

      if (data) {
        logger.debug('Cache hit', { key: cacheKey });
        return this.deserialize(data);
      }

      logger.debug('Cache miss', { key: cacheKey });
      return null;
    } catch (error) {
      logger.error('Cache get failed', {
        key,
        namespace,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Delete cache value
   */
  async del(key, namespace = 'default') {
    try {
      const cacheKey = this.generateKey(key, namespace);
      const result = await this.redisClient.del(cacheKey);

      logger.debug('Cache deleted', { key: cacheKey, existed: result > 0 });
      return result > 0;
    } catch (error) {
      logger.error('Cache delete failed', {
        key,
        namespace,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Check if cache key exists
   */
  async exists(key, namespace = 'default') {
    try {
      const cacheKey = this.generateKey(key, namespace);
      const result = await this.redisClient.exists(cacheKey);
      return result > 0;
    } catch (error) {
      logger.error('Cache exists check failed', {
        key,
        namespace,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key, namespace = 'default') {
    try {
      const cacheKey = this.generateKey(key, namespace);
      return await this.redisClient.ttl(cacheKey);
    } catch (error) {
      logger.error('Cache TTL check failed', {
        key,
        namespace,
        error: error.message
      });
      return -1;
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async increment(key, amount = 1, namespace = 'default') {
    try {
      const cacheKey = this.generateKey(key, namespace);
      return await this.redisClient.incrBy(cacheKey, amount);
    } catch (error) {
      logger.error('Cache increment failed', {
        key,
        namespace,
        amount,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Set cache with get-or-set pattern
   */
  async getOrSet(key, fetchFunction, ttl = null, namespace = 'default') {
    try {
      // Try to get from cache first
      let value = await this.get(key, namespace);
      
      if (value !== null) {
        return value;
      }

      // If not in cache, fetch using the provided function
      value = await fetchFunction();
      
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttl, namespace);
      }

      return value;
    } catch (error) {
      logger.error('Cache getOrSet failed', {
        key,
        namespace,
        error: error.message
      });
      
      // If cache fails, still try to return the fetched value
      try {
        return await fetchFunction();
      } catch (fetchError) {
        logger.error('Fetch function failed in getOrSet', {
          key,
          error: fetchError.message
        });
        return null;
      }
    }
  }

  /**
   * Cache for a specific time period with automatic refresh
   */
  async cacheWithRefresh(key, fetchFunction, ttl = null, refreshThreshold = 0.1, namespace = 'default') {
    try {
      const value = await this.get(key, namespace);
      const currentTTL = await this.ttl(key, namespace);
      const targetTTL = ttl || this.defaultTTL;
      
      // If value exists and TTL is above threshold, return cached value
      if (value !== null && currentTTL > (targetTTL * refreshThreshold)) {
        return value;
      }

      // If TTL is below threshold or no value, refresh asynchronously
      if (value !== null) {
        // Return stale value immediately and refresh in background
        setImmediate(async () => {
          try {
            const newValue = await fetchFunction();
            await this.set(key, newValue, ttl, namespace);
            logger.debug('Cache refreshed in background', { key });
          } catch (error) {
            logger.error('Background cache refresh failed', { key, error: error.message });
          }
        });
        return value;
      }

      // No cached value, fetch synchronously
      const newValue = await fetchFunction();
      await this.set(key, newValue, ttl, namespace);
      return newValue;
    } catch (error) {
      logger.error('Cache with refresh failed', {
        key,
        namespace,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Multi-get operation
   */
  async mget(keys, namespace = 'default') {
    try {
      const cacheKeys = keys.map(key => this.generateKey(key, namespace));
      const values = await this.redisClient.mGet(cacheKeys);
      
      const result = {};
      keys.forEach((key, index) => {
        result[key] = this.deserialize(values[index]);
      });

      return result;
    } catch (error) {
      logger.error('Cache mget failed', {
        keys,
        namespace,
        error: error.message
      });
      return {};
    }
  }

  /**
   * Multi-set operation
   */
  async mset(keyValuePairs, ttl = null, namespace = 'default') {
    try {
      const pipeline = this.redisClient.multi();
      const finalTTL = ttl || this.defaultTTL;

      Object.entries(keyValuePairs).forEach(([key, value]) => {
        const cacheKey = this.generateKey(key, namespace);
        const serializedValue = this.serialize(value);
        pipeline.setEx(cacheKey, finalTTL, serializedValue);
      });

      await pipeline.exec();

      logger.debug('Cache mset successful', {
        count: Object.keys(keyValuePairs).length,
        namespace,
        ttl: finalTTL
      });

      return true;
    } catch (error) {
      logger.error('Cache mset failed', {
        namespace,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Clear all cache in a namespace
   */
  async clearNamespace(namespace) {
    try {
      const pattern = this.generateKey('*', namespace);
      const keys = await this.redisClient.keys(pattern);
      
      if (keys.length > 0) {
        await this.redisClient.del(keys);
        logger.info('Cache namespace cleared', { namespace, keysDeleted: keys.length });
      }

      return keys.length;
    } catch (error) {
      logger.error('Cache namespace clear failed', {
        namespace,
        error: error.message
      });
      return 0;
    }
  }

  /**
   * Cache statistics for monitoring
   */
  async getStats(namespace = null) {
    try {
      const pattern = namespace ? this.generateKey('*', namespace) : `${this.keyPrefix}*`;
      const keys = await this.redisClient.keys(pattern);
      
      let totalSize = 0;
      let totalTTL = 0;
      let keyCount = keys.length;
      
      if (keyCount > 0) {
        const pipeline = this.redisClient.multi();
        keys.forEach(key => {
          pipeline.memory('usage', key);
          pipeline.ttl(key);
        });
        
        const results = await pipeline.exec();
        
        for (let i = 0; i < results.length; i += 2) {
          totalSize += results[i][1] || 0;
          totalTTL += Math.max(0, results[i + 1][1] || 0);
        }
      }

      return {
        keyCount,
        totalSizeBytes: totalSize,
        averageTTL: keyCount > 0 ? Math.round(totalTTL / keyCount) : 0,
        namespace: namespace || 'all'
      };
    } catch (error) {
      logger.error('Cache stats retrieval failed', {
        namespace,
        error: error.message
      });
      return {
        keyCount: 0,
        totalSizeBytes: 0,
        averageTTL: 0,
        namespace: namespace || 'all'
      };
    }
  }

  /**
   * Tagged cache for group invalidation
   */
  async setWithTags(key, value, tags = [], ttl = null, namespace = 'default') {
    try {
      // Set the main cache entry
      await this.set(key, value, ttl, namespace);
      
      // Add key to each tag set
      const pipeline = this.redisClient.multi();
      const finalTTL = ttl || this.defaultTTL;
      
      tags.forEach(tag => {
        const tagKey = this.generateKey(`tag:${tag}`, namespace);
        const cacheKey = this.generateKey(key, namespace);
        pipeline.sAdd(tagKey, cacheKey);
        pipeline.expire(tagKey, finalTTL + 60); // Tag expires slightly later
      });
      
      await pipeline.exec();

      logger.debug('Cache set with tags', { key, tags, namespace });
      return true;
    } catch (error) {
      logger.error('Cache set with tags failed', {
        key,
        tags,
        namespace,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Invalidate cache by tag
   */
  async invalidateByTag(tag, namespace = 'default') {
    try {
      const tagKey = this.generateKey(`tag:${tag}`, namespace);
      const cacheKeys = await this.redisClient.sMembers(tagKey);
      
      if (cacheKeys.length > 0) {
        const pipeline = this.redisClient.multi();
        cacheKeys.forEach(cacheKey => pipeline.del(cacheKey));
        pipeline.del(tagKey); // Remove the tag set itself
        
        await pipeline.exec();
        
        logger.info('Cache invalidated by tag', {
          tag,
          namespace,
          keysInvalidated: cacheKeys.length
        });
      }

      return cacheKeys.length;
    } catch (error) {
      logger.error('Cache invalidation by tag failed', {
        tag,
        namespace,
        error: error.message
      });
      return 0;
    }
  }
}

module.exports = CacheHelper;