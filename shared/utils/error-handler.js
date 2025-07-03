/**
 * Global Error Handler with Bangladesh Localization
 * GetIt Multi-Vendor Ecommerce Platform
 * 
 * Features:
 * - Multi-language error messages (English/Bengali)
 * - Error classification and severity levels
 * - Bangladesh-specific error handling
 * - Microservice error aggregation
 * - Error reporting and alerting
 */

import logger from './logger.js';

// Error types specific to Bangladesh ecommerce
export const ERROR_TYPES = {
  // Payment related errors
  PAYMENT_BKASH_FAILED: 'PAYMENT_BKASH_FAILED',
  PAYMENT_NAGAD_FAILED: 'PAYMENT_NAGAD_FAILED',
  PAYMENT_ROCKET_FAILED: 'PAYMENT_ROCKET_FAILED',
  PAYMENT_INSUFFICIENT_BALANCE: 'PAYMENT_INSUFFICIENT_BALANCE',
  PAYMENT_GATEWAY_TIMEOUT: 'PAYMENT_GATEWAY_TIMEOUT',
  
  // KYC and verification errors
  KYC_NID_INVALID: 'KYC_NID_INVALID',
  KYC_TRADE_LICENSE_EXPIRED: 'KYC_TRADE_LICENSE_EXPIRED',
  KYC_BANK_ACCOUNT_INVALID: 'KYC_BANK_ACCOUNT_INVALID',
  KYC_VERIFICATION_FAILED: 'KYC_VERIFICATION_FAILED',
  
  // Shipping and logistics errors
  SHIPPING_PATHAO_UNAVAILABLE: 'SHIPPING_PATHAO_UNAVAILABLE',
  SHIPPING_PAPERFLY_FAILED: 'SHIPPING_PAPERFLY_FAILED',
  SHIPPING_ADDRESS_INVALID: 'SHIPPING_ADDRESS_INVALID',
  SHIPPING_COD_NOT_AVAILABLE: 'SHIPPING_COD_NOT_AVAILABLE',
  
  // Business logic errors
  VENDOR_NOT_VERIFIED: 'VENDOR_NOT_VERIFIED',
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
  ORDER_CANCELLATION_FAILED: 'ORDER_CANCELLATION_FAILED',
  COMMISSION_CALCULATION_ERROR: 'COMMISSION_CALCULATION_ERROR',
  
  // System errors
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  REDIS_CONNECTION_FAILED: 'REDIS_CONNECTION_FAILED',
  MICROSERVICE_UNAVAILABLE: 'MICROSERVICE_UNAVAILABLE',
  API_RATE_LIMIT_EXCEEDED: 'API_RATE_LIMIT_EXCEEDED',
  
  // Authentication and authorization
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  AUTH_ACCOUNT_SUSPENDED: 'AUTH_ACCOUNT_SUSPENDED',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_PHONE_NUMBER_INVALID: 'VALIDATION_PHONE_NUMBER_INVALID',
  VALIDATION_EMAIL_INVALID: 'VALIDATION_EMAIL_INVALID'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error messages in English and Bengali
const ERROR_MESSAGES = {
  [ERROR_TYPES.PAYMENT_BKASH_FAILED]: {
    en: 'bKash payment failed. Please try again.',
    bn: 'বিকাশ পেমেন্ট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
  },
  [ERROR_TYPES.PAYMENT_NAGAD_FAILED]: {
    en: 'Nagad payment failed. Please try again.',
    bn: 'নগদ পেমেন্ট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
  },
  [ERROR_TYPES.PAYMENT_ROCKET_FAILED]: {
    en: 'Rocket payment failed. Please try again.',
    bn: 'রকেট পেমেন্ট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
  },
  [ERROR_TYPES.KYC_NID_INVALID]: {
    en: 'Invalid National ID number. Please check and try again.',
    bn: 'অবৈধ জাতীয় পরিচয়পত্র নম্বর। অনুগ্রহ করে পরীক্ষা করে আবার চেষ্টা করুন।'
  },
  [ERROR_TYPES.VENDOR_NOT_VERIFIED]: {
    en: 'Vendor verification is required to continue.',
    bn: 'এগিয়ে যেতে বিক্রেতা যাচাইকরণ প্রয়োজন।'
  },
  [ERROR_TYPES.PRODUCT_OUT_OF_STOCK]: {
    en: 'This product is currently out of stock.',
    bn: 'এই পণ্যটি বর্তমানে স্টকে নেই।'
  },
  [ERROR_TYPES.SHIPPING_ADDRESS_INVALID]: {
    en: 'Invalid shipping address. Please provide a valid Bangladesh address.',
    bn: 'অবৈধ শিপিং ঠিকানা। অনুগ্রহ করে একটি বৈধ বাংলাদেশি ঠিকানা প্রদান করুন।'
  },
  [ERROR_TYPES.AUTH_TOKEN_EXPIRED]: {
    en: 'Your session has expired. Please login again.',
    bn: 'আপনার সেশনের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।'
  },
  [ERROR_TYPES.VALIDATION_PHONE_NUMBER_INVALID]: {
    en: 'Invalid phone number. Please enter a valid Bangladesh mobile number.',
    bn: 'অবৈধ ফোন নম্বর। অনুগ্রহ করে একটি বৈধ বাংলাদেশি মোবাইল নম্বর দিন।'
  }
};

// Error severity mapping
const ERROR_SEVERITY_MAP = {
  [ERROR_TYPES.DATABASE_CONNECTION_FAILED]: ERROR_SEVERITY.CRITICAL,
  [ERROR_TYPES.MICROSERVICE_UNAVAILABLE]: ERROR_SEVERITY.HIGH,
  [ERROR_TYPES.PAYMENT_BKASH_FAILED]: ERROR_SEVERITY.HIGH,
  [ERROR_TYPES.PAYMENT_NAGAD_FAILED]: ERROR_SEVERITY.HIGH,
  [ERROR_TYPES.KYC_VERIFICATION_FAILED]: ERROR_SEVERITY.HIGH,
  [ERROR_TYPES.VENDOR_NOT_VERIFIED]: ERROR_SEVERITY.MEDIUM,
  [ERROR_TYPES.PRODUCT_OUT_OF_STOCK]: ERROR_SEVERITY.MEDIUM,
  [ERROR_TYPES.VALIDATION_REQUIRED_FIELD]: ERROR_SEVERITY.LOW,
  [ERROR_TYPES.AUTH_TOKEN_EXPIRED]: ERROR_SEVERITY.LOW
};

class GetItError extends Error {
  constructor(type, details = {}, cause = null) {
    const message = ERROR_MESSAGES[type]?.en || 'An unexpected error occurred';
    super(message);
    
    this.name = 'GetItError';
    this.type = type;
    this.severity = ERROR_SEVERITY_MAP[type] || ERROR_SEVERITY.MEDIUM;
    this.details = details;
    this.cause = cause;
    this.timestamp = new Date().toISOString();
    this.correlationId = details.correlationId || null;
    
    // Capture stack trace
    Error.captureStackTrace(this, GetItError);
  }

  // Get localized message
  getLocalizedMessage(language = 'en') {
    return ERROR_MESSAGES[this.type]?.[language] || this.message;
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      error: {
        type: this.type,
        message: this.message,
        severity: this.severity,
        timestamp: this.timestamp,
        correlationId: this.correlationId,
        details: this.details
      }
    };
  }

  // Convert to localized JSON
  toLocalizedJSON(language = 'en') {
    return {
      error: {
        type: this.type,
        message: this.getLocalizedMessage(language),
        severity: this.severity,
        timestamp: this.timestamp,
        correlationId: this.correlationId,
        details: this.details
      }
    };
  }
}

class ErrorHandler {
  constructor() {
    this.errorMetrics = new Map();
    this.alertThresholds = {
      [ERROR_SEVERITY.CRITICAL]: 1, // Alert immediately
      [ERROR_SEVERITY.HIGH]: 5,     // Alert after 5 occurrences
      [ERROR_SEVERITY.MEDIUM]: 20,  // Alert after 20 occurrences
      [ERROR_SEVERITY.LOW]: 100     // Alert after 100 occurrences
    };
  }

  // Handle application errors
  handleError(error, req = null, res = null) {
    const correlationId = req?.correlationId || null;
    const userId = req?.user?.id || null;
    const language = req?.headers?.['accept-language']?.includes('bn') ? 'bn' : 'en';

    // Convert to GetItError if needed
    let getItError;
    if (error instanceof GetItError) {
      getItError = error;
    } else {
      getItError = this.classifyError(error, correlationId);
    }

    // Log the error
    logger.logError(getItError, {
      url: req?.url,
      method: req?.method,
      userAgent: req?.headers?.['user-agent'],
      ip: req?.ip
    }, correlationId, userId);

    // Update error metrics
    this.updateErrorMetrics(getItError);

    // Check if alert is needed
    this.checkAlertThreshold(getItError);

    // Send response if res object is provided
    if (res && !res.headersSent) {
      this.sendErrorResponse(res, getItError, language);
    }

    return getItError;
  }

  // Classify unknown errors
  classifyError(error, correlationId = null) {
    let errorType = ERROR_TYPES.SYSTEM_ERROR;
    let details = { originalError: error.message };

    // Database errors
    if (error.code === 'ECONNREFUSED' || error.message.includes('database')) {
      errorType = ERROR_TYPES.DATABASE_CONNECTION_FAILED;
    }
    // Redis errors
    else if (error.message.includes('redis') || error.message.includes('Redis')) {
      errorType = ERROR_TYPES.REDIS_CONNECTION_FAILED;
    }
    // Validation errors
    else if (error.name === 'ValidationError') {
      errorType = ERROR_TYPES.VALIDATION_REQUIRED_FIELD;
      details.validationErrors = error.details;
    }
    // JWT errors
    else if (error.name === 'TokenExpiredError') {
      errorType = ERROR_TYPES.AUTH_TOKEN_EXPIRED;
    }
    // Rate limiting errors
    else if (error.status === 429) {
      errorType = ERROR_TYPES.API_RATE_LIMIT_EXCEEDED;
    }

    return new GetItError(errorType, { ...details, correlationId });
  }

  // Update error metrics for monitoring
  updateErrorMetrics(error) {
    const key = `${error.type}_${error.severity}`;
    const current = this.errorMetrics.get(key) || { count: 0, lastOccurrence: null };
    
    this.errorMetrics.set(key, {
      count: current.count + 1,
      lastOccurrence: new Date(),
      type: error.type,
      severity: error.severity
    });
  }

  // Check if alert threshold is reached
  checkAlertThreshold(error) {
    const key = `${error.type}_${error.severity}`;
    const metrics = this.errorMetrics.get(key);
    const threshold = this.alertThresholds[error.severity];

    if (metrics && metrics.count >= threshold) {
      this.sendAlert(error, metrics);
      // Reset counter after alert
      this.errorMetrics.set(key, { ...metrics, count: 0 });
    }
  }

  // Send alert to monitoring systems
  sendAlert(error, metrics) {
    logger.logSecurityEvent('ERROR_THRESHOLD_EXCEEDED', error.severity, {
      errorType: error.type,
      occurrenceCount: metrics.count,
      timeWindow: '1h',
      alertTriggered: true,
      requiresImmedateAttention: error.severity === ERROR_SEVERITY.CRITICAL
    });

    // Here you would integrate with alerting systems like:
    // - Slack notifications
    // - Email alerts
    // - SMS alerts for critical errors
    // - WhatsApp Business API for Bangladesh team
  }

  // Send error response to client
  sendErrorResponse(res, error, language = 'en') {
    const statusCode = this.getHttpStatusCode(error.type);
    
    res.status(statusCode).json(error.toLocalizedJSON(language));
  }

  // Map error types to HTTP status codes
  getHttpStatusCode(errorType) {
    const statusMap = {
      [ERROR_TYPES.AUTH_TOKEN_EXPIRED]: 401,
      [ERROR_TYPES.AUTH_INSUFFICIENT_PERMISSIONS]: 403,
      [ERROR_TYPES.VENDOR_NOT_VERIFIED]: 403,
      [ERROR_TYPES.PRODUCT_OUT_OF_STOCK]: 409,
      [ERROR_TYPES.VALIDATION_REQUIRED_FIELD]: 400,
      [ERROR_TYPES.VALIDATION_INVALID_FORMAT]: 400,
      [ERROR_TYPES.PAYMENT_BKASH_FAILED]: 402,
      [ERROR_TYPES.PAYMENT_NAGAD_FAILED]: 402,
      [ERROR_TYPES.API_RATE_LIMIT_EXCEEDED]: 429,
      [ERROR_TYPES.DATABASE_CONNECTION_FAILED]: 503,
      [ERROR_TYPES.MICROSERVICE_UNAVAILABLE]: 503
    };

    return statusMap[errorType] || 500;
  }

  // Get error metrics for monitoring dashboard
  getErrorMetrics() {
    const metrics = {
      totalErrors: 0,
      errorsByType: {},
      errorsBySeverity: {
        [ERROR_SEVERITY.CRITICAL]: 0,
        [ERROR_SEVERITY.HIGH]: 0,
        [ERROR_SEVERITY.MEDIUM]: 0,
        [ERROR_SEVERITY.LOW]: 0
      },
      recentErrors: []
    };

    for (const [key, data] of this.errorMetrics.entries()) {
      metrics.totalErrors += data.count;
      metrics.errorsByType[data.type] = (metrics.errorsByType[data.type] || 0) + data.count;
      metrics.errorsBySeverity[data.severity] += data.count;
      
      if (data.lastOccurrence && Date.now() - data.lastOccurrence.getTime() < 300000) { // Last 5 minutes
        metrics.recentErrors.push({
          type: data.type,
          severity: data.severity,
          count: data.count,
          lastOccurrence: data.lastOccurrence
        });
      }
    }

    return metrics;
  }

  // Express middleware for error handling
  expressErrorHandler() {
    return (error, req, res, next) => {
      this.handleError(error, req, res);
    };
  }

  // Unhandled error handlers
  setupGlobalErrorHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      this.handleError(error);
      
      // Graceful shutdown for critical errors
      if (this.isCriticalError(error)) {
        setTimeout(() => process.exit(1), 1000);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection', { reason, promise });
      this.handleError(new Error(reason));
    });
  }

  // Check if error is critical enough to shutdown service
  isCriticalError(error) {
    const criticalPatterns = [
      'EADDRINUSE',
      'ENOTFOUND',
      'database connection failed',
      'out of memory'
    ];

    return criticalPatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Setup global error handlers
errorHandler.setupGlobalErrorHandlers();

export default errorHandler;
export { GetItError, ERROR_TYPES, ERROR_SEVERITY };