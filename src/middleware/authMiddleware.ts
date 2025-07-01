import { supabase } from '@/services/api';

export interface AuthUser {
  id: string;
  email?: string;
  role: string;
  is_verified: boolean;
}

export class AuthMiddleware {
  // Verify JWT token and get user
  static async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }

      // Get user profile with role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_verified')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        role: profile?.role || 'customer',
        is_verified: profile?.is_verified || false
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Check if user has required roles
  static hasRole(user: AuthUser, roles: string | string[]): boolean {
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    return roles.includes(user.role);
  }

  // Check if user is admin
  static isAdmin(user: AuthUser): boolean {
    return this.hasRole(user, ['admin', 'super_admin']);
  }

  // Check if user is vendor
  static isVendor(user: AuthUser): boolean {
    return this.hasRole(user, 'vendor');
  }

  // Middleware for API routes
  static async authenticate(authHeader: string | null): Promise<{
    user: AuthUser | null;
    error: string | null;
  }> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Authorization header required' };
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await this.verifyToken(token);

    if (!user) {
      return { user: null, error: 'Invalid or expired token' };
    }

    return { user, error: null };
  }

  // Role-based access control
  static requireRole(user: AuthUser | null, roles: string | string[]): {
    authorized: boolean;
    error: string | null;
  } {
    if (!user) {
      return { authorized: false, error: 'Authentication required' };
    }

    if (!this.hasRole(user, roles)) {
      return { authorized: false, error: 'Insufficient permissions' };
    }

    return { authorized: true, error: null };
  }

  // Admin only access
  static requireAdmin(user: AuthUser | null): {
    authorized: boolean;
    error: string | null;
  } {
    return this.requireRole(user, ['admin', 'super_admin']);
  }

  // Vendor access (vendor or admin)
  static requireVendorAccess(user: AuthUser | null): {
    authorized: boolean;
    error: string | null;
  } {
    return this.requireRole(user, ['vendor', 'admin', 'super_admin']);
  }
}