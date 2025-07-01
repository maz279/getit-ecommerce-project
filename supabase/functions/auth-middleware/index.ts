import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export interface AuthUser {
  id: string
  email?: string
  role: string
  is_verified: boolean
  profile: any
}

export class AuthService {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
  }

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token)
      
      if (error || !user) {
        console.error('Token verification failed:', error)
        return null
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return null
      }

      return {
        id: user.id,
        email: user.email,
        role: profile?.role || 'customer',
        is_verified: profile?.is_verified || false,
        profile: profile
      }
    } catch (error) {
      console.error('Auth service error:', error)
      return null
    }
  }

  hasRole(user: AuthUser, roles: string | string[]): boolean {
    if (typeof roles === 'string') {
      return user.role === roles
    }
    return roles.includes(user.role)
  }

  isAdmin(user: AuthUser): boolean {
    return this.hasRole(user, ['admin', 'super_admin'])
  }

  isVendor(user: AuthUser): boolean {
    return this.hasRole(user, 'vendor')
  }

  async authenticate(authHeader: string | null): Promise<{
    user: AuthUser | null
    error: string | null
  }> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Authorization header required' }
    }

    const token = authHeader.replace('Bearer ', '')
    const user = await this.verifyToken(token)

    if (!user) {
      return { user: null, error: 'Invalid or expired token' }
    }

    return { user, error: null }
  }

  requireRole(user: AuthUser | null, roles: string | string[]): {
    authorized: boolean
    error: string | null
  } {
    if (!user) {
      return { authorized: false, error: 'Authentication required' }
    }

    if (!this.hasRole(user, roles)) {
      return { authorized: false, error: 'Insufficient permissions' }
    }

    return { authorized: true, error: null }
  }

  requireAdmin(user: AuthUser | null): {
    authorized: boolean
    error: string | null
  } {
    return this.requireRole(user, ['admin', 'super_admin'])
  }

  requireVendorAccess(user: AuthUser | null): {
    authorized: boolean
    error: string | null
  } {
    return this.requireRole(user, ['vendor', 'admin', 'super_admin'])
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authService = new AuthService()
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'verify':
        const authHeader = req.headers.get('Authorization')
        const { user, error } = await authService.authenticate(authHeader)
        
        if (error) {
          return new Response(
            JSON.stringify({ error }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ user }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'check-role':
        const roleAuthHeader = req.headers.get('Authorization')
        const requiredRoles = url.searchParams.get('roles')?.split(',') || []
        
        const { user: roleUser, error: roleError } = await authService.authenticate(roleAuthHeader)
        
        if (roleError) {
          return new Response(
            JSON.stringify({ authorized: false, error: roleError }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { authorized, error: permissionError } = authService.requireRole(roleUser, requiredRoles)
        
        return new Response(
          JSON.stringify({ 
            authorized, 
            error: permissionError,
            user: authorized ? roleUser : null 
          }),
          { 
            status: authorized ? 200 : 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      case 'profile':
        const profileAuthHeader = req.headers.get('Authorization')
        const { user: profileUser, error: profileError } = await authService.authenticate(profileAuthHeader)
        
        if (profileError) {
          return new Response(
            JSON.stringify({ error: profileError }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ user: profileUser }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})