/**
 * Enhanced Logging Service with Request Tracking
 * GetIt Multi-Vendor Ecommerce Platform
 * 
 * Features:
 * - Request tracking with correlation IDs
 * - Performance monitoring
 * - Error aggregation
 * - Bangladesh timezone support
 * - Multiple log levels and outputs
 */

import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Bangladesh timezone configuration
const BANGLADESH_TIMEZONE = 'Asia/Dhaka';

// Log levels with colors
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'grey'
};

class EnhancedLogger {
  constructor() {
    this.logger = this.createLogger();
    this.requestStore = new Map(); // Store for request correlation
  }

  createLogger() {
    // Custom format for Bangladesh market
    const bangladeshFormat = winston.format.combine(
      winston.format.timestamp({
        format: () => new Date().toLocaleString('en-US', {
          timeZone: BANGLADESH_TIMEZONE,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, correlationId, service, userId, ...meta }) => {
        const baseLog = {
          timestamp,
          level,
          message,
          correlationId,
          service,
          userId,
          timezone: BANGLADESH_TIMEZONE
        };

        // Add performance metrics if available
        if (meta.responseTime) {
          baseLog.performance = {
            responseTime: meta.responseTime,
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
          };
        }

        // Add request details if available
        if (meta.request) {
          baseLog.request = {
            method: meta.request.method,
            url: meta.request.url,
            userAgent: meta.request.headers?.['user-agent'],
            ip: meta.request.ip,
            contentLength: meta.request.headers?.['content-length']
          };
        }

        // Add Bangladesh-specific context
        if (meta.bangladeshContext) {
          baseLog.bangladeshContext = meta.bangladeshContext;
        }

        return JSON.stringify({ ...baseLog, ...meta });
      })
    );

    return winston.createLogger({
      levels: LOG_LEVELS,
      level: process.env.LOG_LEVEL || 'info',
      format: bangladeshFormat,
      defaultMeta: {
        service: process.env.SERVICE_NAME || 'getit-service',
        environment: process.env.NODE_ENV || 'development',
        version: process.env.SERVICE_VERSION || '1.0.0'
      },
      transports: [
        // Console transport with colors for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true, colors: LOG_COLORS }),
            winston.format.simple()
          )
        }),

        // File transport for errors
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),

        // File transport for all logs
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 10
        }),

        // Separate file for performance logs
        new winston.transports.File({
          filename: 'logs/performance.log',
          level: 'http',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ],

      // Handle uncaught exceptions
      exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
      ],

      // Handle unhandled promise rejections
      rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' })
      ]
    });
  }

  // Generate correlation ID for request tracking
  generateCorrelationId() {
    return uuidv4();
  }

  // Start request tracking
  startRequest(req, correlationId = null) {
    const id = correlationId || this.generateCorrelationId();
    const startTime = Date.now();
    
    this.requestStore.set(id, {
      startTime,
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers?.['user-agent']
      }
    });

    // Log request start
    this.info('Request started', {
      correlationId: id,
      request: this.requestStore.get(id).request,
      bangladeshContext: {
        localTime: new Date().toLocaleString('bn-BD', { timeZone: BANGLADESH_TIMEZONE }),
        market: 'bangladesh'
      }
    });

    return id;
  }

  // End request tracking
  endRequest(correlationId, statusCode = 200, responseSize = 0) {
    const requestData = this.requestStore.get(correlationId);
    if (!requestData) return;

    const responseTime = Date.now() - requestData.startTime;
    
    // Log request completion
    this.http('Request completed', {
      correlationId,
      responseTime,
      statusCode,
      responseSize,
      request: requestData.request,
      performance: {
        responseTime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    });

    // Clean up request store
    this.requestStore.delete(correlationId);
  }

  // Bangladesh-specific business event logging
  logBusinessEvent(eventType, details, correlationId = null, userId = null) {
    this.info(`Business Event: ${eventType}`, {
      correlationId,
      userId,
      eventType,
      details,
      bangladeshContext: {
        localTime: new Date().toLocaleString('bn-BD', { timeZone: BANGLADESH_TIMEZONE }),
        market: 'bangladesh'
      }
    });
  }

  // Payment transaction logging (Bangladesh-specific)
  logPaymentEvent(paymentMethod, amount, currency = 'BDT', status, details = {}) {
    this.info('Payment Event', {
      paymentMethod, // bkash, nagad, rocket, etc.
      amount,
      currency,
      status,
      details,
      bangladeshContext: {
        localTime: new Date().toLocaleString('bn-BD', { timeZone: BANGLADESH_TIMEZONE }),
        paymentGateway: paymentMethod,
        regulatoryCompliance: true
      }
    });
  }

  // KYC verification logging
  logKYCEvent(vendorId, verificationType, status, details = {}) {
    this.info('KYC Verification Event', {
      vendorId,
      verificationType, // nid, trade_license, bank_account, etc.
      status,
      details,
      bangladeshContext: {
        localTime: new Date().toLocaleString('bn-BD', { timeZone: BANGLADESH_TIMEZONE }),
        regulatoryCompliance: true,
        dataRetention: '7_years' // Bangladesh requirement
      }
    });
  }

  // Performance monitoring
  logPerformanceMetric(metricName, value, unit = 'ms', correlationId = null) {
    this.verbose('Performance Metric', {
      correlationId,
      metric: {
        name: metricName,
        value,
        unit,
        timestamp: Date.now()
      },
      performance: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    });
  }

  // Error tracking with stack traces
  logError(error, context = {}, correlationId = null, userId = null) {
    this.error('Application Error', {
      correlationId,
      userId,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      },
      context,
      bangladeshContext: {
        localTime: new Date().toLocaleString('bn-BD', { timeZone: BANGLADESH_TIMEZONE }),
        errorReporting: true
      }
    });
  }

  // Security event logging
  logSecurityEvent(eventType, severity, details, userId = null, ip = null) {
    this.warn('Security Event', {
      eventType,
      severity, // low, medium, high, critical
      details,
      userId,
      ip,
      bangladeshContext: {
        localTime: new Date().toLocaleString('bn-BD', { timeZone: BANGLADESH_TIMEZONE }),
        securityCompliance: true,
        alertRequired: severity === 'critical'
      }
    });
  }

  // Microservice communication logging
  logServiceCall(fromService, toService, operation, responseTime, status) {
    this.http('Service Communication', {
      microservice: {
        from: fromService,
        to: toService,
        operation,
        responseTime,
        status
      },
      performance: {
        responseTime,
        serviceHealth: status === 'success' ? 'healthy' : 'degraded'
      }
    });
  }

  // Standard log methods with enhanced context
  error(message, meta = {}) {
    this.logger.error(message, { ...meta, logLevel: 'error' });
  }

  warn(message, meta = {}) {
    this.logger.warn(message, { ...meta, logLevel: 'warn' });
  }

  info(message, meta = {}) {
    this.logger.info(message, { ...meta, logLevel: 'info' });
  }

  http(message, meta = {}) {
    this.logger.http(message, { ...meta, logLevel: 'http' });
  }

  verbose(message, meta = {}) {
    this.logger.verbose(message, { ...meta, logLevel: 'verbose' });
  }

  debug(message, meta = {}) {
    this.logger.debug(message, { ...meta, logLevel: 'debug' });
  }

  // Get request metrics
  getRequestMetrics() {
    return {
      activeRequests: this.requestStore.size,
      averageResponseTime: this.calculateAverageResponseTime(),
      requestsPerMinute: this.calculateRequestsPerMinute()
    };
  }

  calculateAverageResponseTime() {
    // Implementation for calculating average response time
    return 0; // Placeholder
  }

  calculateRequestsPerMinute() {
    // Implementation for calculating requests per minute
    return 0; // Placeholder
  }
}

// Create singleton instance
const logger = new EnhancedLogger();

// Express middleware for request logging
export const requestLoggingMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || logger.generateCorrelationId();
  req.correlationId = correlationId;
  
  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', correlationId);
  
  // Start request tracking
  logger.startRequest(req, correlationId);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    logger.endRequest(correlationId, res.statusCode, res.get('content-length') || 0);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

export default logger;
export { EnhancedLogger };