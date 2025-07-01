import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserProfile {
  id?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  role?: 'admin' | 'vendor' | 'customer' | 'moderator' | 'super_admin'
  department?: string
  is_verified?: boolean
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const userId = pathSegments[pathSegments.length - 1]
    const isUserRoute = pathSegments.includes('user') && userId !== 'user-management-api'

    // Check user role for admin operations
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    switch (req.method) {
      case 'GET':
        if (isUserRoute) {
          // Get single user profile
          const { data: userProfile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          if (profileError) {
            console.error('User profile fetch error:', profileError)
            return new Response(
              JSON.stringify({ error: 'User not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Check permissions - users can only see their own profile, admins can see all
          if (!isAdmin && userId !== user.id) {
            return new Response(
              JSON.stringify({ error: 'Access denied' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ data: userProfile }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // List users (admin only)
          if (!isAdmin) {
            return new Response(
              JSON.stringify({ error: 'Admin access required' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const searchParams = url.searchParams
          const page = parseInt(searchParams.get('page') || '1')
          const limit = parseInt(searchParams.get('limit') || '20')
          const offset = (page - 1) * limit
          const role = searchParams.get('role')
          const search = searchParams.get('search')
          const verified = searchParams.get('verified')

          let query = supabaseClient
            .from('profiles')
            .select('*', { count: 'exact' })

          // Apply filters
          if (role) query = query.eq('role', role)
          if (verified) query = query.eq('is_verified', verified === 'true')
          if (search) {
            query = query.or(`full_name.ilike.%${search}%, phone.ilike.%${search}%`)
          }

          // Pagination
          query = query.range(offset, offset + limit - 1)

          const { data: users, error, count } = await query.order('created_at', { ascending: false })

          if (error) {
            console.error('Users fetch error:', error)
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({
              data: users,
              pagination: {
                page,
                limit,
                total: count || 0,
                hasMore: count ? offset + limit < count : false
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      case 'PUT':
        if (!isUserRoute) {
          return new Response(
            JSON.stringify({ error: 'User ID required for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData: Partial<UserProfile> = await req.json()

        // Check permissions - users can only update their own profile, admins can update any
        if (!isAdmin && userId !== user.id) {
          return new Response(
            JSON.stringify({ error: 'Access denied' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Only admins can change roles
        if (!isAdmin && updateData.role) {
          delete updateData.role
        }

        const { data: updatedProfile, error: updateError } = await supabaseClient
          .from('profiles')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single()

        if (updateError) {
          console.error('Profile update error:', updateError)
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ data: updatedProfile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'DELETE':
        if (!isUserRoute) {
          return new Response(
            JSON.stringify({ error: 'User ID required for deletion' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Only admins can delete users, and they can't delete themselves
        if (!isAdmin || userId === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete this user' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Delete from auth.users (this will cascade to profiles due to foreign key)
        const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

        if (deleteError) {
          console.error('User deletion error:', deleteError)
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ message: 'User deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('User Management API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})