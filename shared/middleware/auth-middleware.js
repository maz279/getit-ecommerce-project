/**
 * GetIt E-commerce Platform - Authentication Middleware
 * Multi-role authentication with JWT and session management
 * 
 * @module AuthMiddleware
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const errorHandler = require('../utils/error-handler');

class AuthMiddleware {
  constructor(config) {
    this.jwtSecret = config.jwtSecret || process.env.JWT_SECRET;
    this.tokenExpiry = config.tokenExpiry || '24h';
    this.refreshTokenExpiry = config.refreshTokenExpiry || '30d';
    this.roleHierarchy = {
      'super_admin': ['admin', 'moderator', 'vendor', 'customer'],
      'admin': ['moderator', 'vendor', 'customer'],
      'moderator': ['vendor', 'customer'],
      'vendor': ['customer'],
      'customer': []
    };
  }

  /**
   * Generate JWT token with user information
   */
  generateToken(user) {
    try {
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
        vendorId: user.vendorId || null,
        iat: Math.floor(Date.now() / 1000)
      };

      const token = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.tokenExpiry,
        issuer: 'getit-platform'
      });

      const refreshToken = jwt.sign(
        { id: user.id, type: 'refresh' },
        this.jwtSecret,
        { expiresIn: this.refreshTokenExpiry }
      );

      logger.info('Token generated successfully', {
        userId: user.id,
        role: user.role,
        tokenExpiry: this.tokenExpiry
      });

      return { token, refreshToken };
    } catch (error) {
      logger.error('Token generation failed', { error: error.message, userId: user.id });
      throw errorHandler.createError('TOKEN_GENERATION_FAILED', 'Failed to generate authentication token');
    }
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token) {
    try {
      if (!token) {
        throw errorHandler.createError('TOKEN_MISSING', 'Authentication token is required');
      }

      // Remove Bearer prefix if present
      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'getit-platform'
      });

      return decoded;
    } catch (error) {
      logger.warn('Token verification failed', { error: error.message });
      
      if (error.name === 'TokenExpiredError') {
        throw errorHandler.createError('TOKEN_EXPIRED', 'Authentication token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw errorHandler.createError('TOKEN_INVALID', 'Invalid authentication token');
      }
      
      throw errorHandler.createError('TOKEN_VERIFICATION_FAILED', 'Token verification failed');
    }
  }

  /**
   * Check if user has required role or permission
   */
  hasPermission(userRole, requiredRole, userPermissions = [], requiredPermission = null) {
    // Check specific permission if provided
    if (requiredPermission && userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Check role hierarchy
    if (this.roleHierarchy[userRole] && this.roleHierarchy[userRole].includes(requiredRole)) {
      return true;
    }

    // Direct role match
    return userRole === requiredRole;
  }

  /**
   * Express middleware for authentication
   */
  authenticate() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization || req.headers.Authorization;
        
        if (!token) {
          return res.status(401).json(
            errorHandler.formatError('AUTHENTICATION_REQUIRED', 'Authentication token is required')
          );
        }

        const decoded = this.verifyToken(token);
        req.user = decoded;
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.vendorId = decoded.vendorId;

        logger.info('User authenticated successfully', {
          userId: decoded.id,
          role: decoded.role,
          endpoint: req.path
        });

        next();
      } catch (error) {
        logger.warn('Authentication failed', {
          error: error.message,
          endpoint: req.path,
          ip: req.ip
        });

        return res.status(401).json(
          errorHandler.formatError(error.code || 'AUTHENTICATION_FAILED', error.message)
        );
      }
    };
  }

  /**
   * Express middleware for role-based authorization
   */
  authorize(requiredRole, requiredPermission = null) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json(
            errorHandler.formatError('AUTHENTICATION_REQUIRED', 'User must be authenticated')
          );
        }

        const hasAccess = this.hasPermission(
          req.user.role,
          requiredRole,
          req.user.permissions,
          requiredPermission
        );

        if (!hasAccess) {
          logger.warn('Authorization failed', {
            userId: req.user.id,
            userRole: req.user.role,
            requiredRole,
            requiredPermission,
            endpoint: req.path
          });

          return res.status(403).json(
            errorHandler.formatError('ACCESS_DENIED', 'Insufficient permissions to access this resource')
          );
        }

        logger.info('User authorized successfully', {
          userId: req.user.id,
          role: req.user.role,
          endpoint: req.path
        });

        next();
      } catch (error) {
        logger.error('Authorization error', {
          error: error.message,
          userId: req.user?.id,
          endpoint: req.path
        });

        return res.status(500).json(
          errorHandler.formatError('AUTHORIZATION_ERROR', 'Authorization check failed')
        );
      }
    };
  }

  /**
   * Express middleware for vendor-specific authorization
   */
  authorizeVendor() {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json(
            errorHandler.formatError('AUTHENTICATION_REQUIRED', 'User must be authenticated')
          );
        }

        // Allow admin and super_admin to access any vendor data
        if (['admin', 'super_admin'].includes(req.user.role)) {
          return next();
        }

        // For vendor role, check if they're accessing their own data
        if (req.user.role === 'vendor') {
          const requestedVendorId = req.params.vendorId || req.body.vendorId || req.query.vendorId;
          
          if (requestedVendorId && requestedVendorId !== req.user.vendorId) {
            return res.status(403).json(
              errorHandler.formatError('VENDOR_ACCESS_DENIED', 'Cannot access other vendor data')
            );
          }
        }

        next();
      } catch (error) {
        logger.error('Vendor authorization error', {
          error: error.message,
          userId: req.user?.id,
          endpoint: req.path
        });

        return res.status(500).json(
          errorHandler.formatError('AUTHORIZATION_ERROR', 'Vendor authorization check failed')
        );
      }
    };
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      
      if (decoded.type !== 'refresh') {
        throw errorHandler.createError('INVALID_REFRESH_TOKEN', 'Invalid refresh token type');
      }

      // In a real implementation, you would fetch user data from database
      // For now, we'll create a minimal token
      const newToken = jwt.sign(
        { id: decoded.id },
        this.jwtSecret,
        { expiresIn: this.tokenExpiry, issuer: 'getit-platform' }
      );

      logger.info('Access token refreshed successfully', { userId: decoded.id });

      return newToken;
    } catch (error) {
      logger.warn('Token refresh failed', { error: error.message });
      throw errorHandler.createError('TOKEN_REFRESH_FAILED', 'Failed to refresh access token');
    }
  }

  /**
   * Logout and invalidate tokens
   */
  logout(req, res) {
    try {
      // In a real implementation, you would add the token to a blacklist
      // or remove it from a token store

      logger.info('User logged out successfully', { userId: req.user?.id });

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error', { error: error.message, userId: req.user?.id });
      
      return res.status(500).json(
        errorHandler.formatError('LOGOUT_ERROR', 'Failed to logout user')
      );
    }
  }
}

module.exports = AuthMiddleware;