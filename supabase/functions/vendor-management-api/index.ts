import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Vendor {
  id?: string
  user_id: string
  business_name: string
  business_email?: string
  business_phone?: string
  business_address?: any
  trade_license?: string
  nid_number?: string
  bank_details?: any
  status?: 'pending' | 'approved' | 'suspended' | 'rejected'
  commission_rate?: number
  rating?: number
  total_sales?: number
}

interface VendorFilters {
  status?: string
  search?: string
  limit?: number
  offset?: number
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

    // Get user from Authorization header
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
    const vendorId = pathSegments[pathSegments.length - 1]
    const isVendorRoute = pathSegments.includes('vendor') && vendorId !== 'vendor-management-api'

    // Check user role for admin operations
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

    switch (req.method) {
      case 'GET':
        if (isVendorRoute) {
          // Get single vendor
          const { data: vendor, error: vendorError } = await supabaseClient
            .from('vendors')
            .select(`
              *,
              profiles!inner(id, full_name, phone, avatar_url),
              vendor_ratings(overall_rating, total_reviews),
              products(count)
            `)
            .eq('id', vendorId)
            .single()

          if (vendorError) {
            console.error('Vendor fetch error:', vendorError)
            return new Response(
              JSON.stringify({ error: 'Vendor not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Check permissions
          if (!isAdmin && vendor.user_id !== user.id) {
            return new Response(
              JSON.stringify({ error: 'Access denied' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ data: vendor }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // List vendors
          const searchParams = url.searchParams
          const filters: VendorFilters = {
            status: searchParams.get('status') || undefined,
            search: searchParams.get('search') || undefined,
            limit: parseInt(searchParams.get('limit') || '20'),
            offset: parseInt(searchParams.get('offset') || '0'),
          }

          let query = supabaseClient
            .from('vendors')
            .select(`
              *,
              profiles!inner(id, full_name, phone, avatar_url),
              vendor_ratings(overall_rating, total_reviews)
            `, { count: 'exact' })

          // Apply filters
          if (filters.status) {
            query = query.eq('status', filters.status)
          }

          if (filters.search) {
            query = query.or(`business_name.ilike.%${filters.search}%, business_email.ilike.%${filters.search}%`)
          }

          // Non-admin users can only see their own vendor profile
          if (!isAdmin) {
            query = query.eq('user_id', user.id)
          }

          // Pagination
          if (filters.offset && filters.limit) {
            query = query.range(filters.offset, filters.offset + filters.limit - 1)
          }

          const { data: vendors, error, count } = await query.order('created_at', { ascending: false })

          if (error) {
            console.error('Vendors fetch error:', error)
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({
              data: vendors,
              pagination: {
                offset: filters.offset,
                limit: filters.limit,
                total: count || 0,
                hasMore: count ? filters.offset! + filters.limit! < count : false
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      case 'POST':
        const vendorData: Vendor = await req.json()
        
        // Validate required fields
        if (!vendorData.business_name) {
          return new Response(
            JSON.stringify({ error: 'Business name is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if user already has a vendor profile
        const { data: existingVendor } = await supabaseClient
          .from('vendors')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (existingVendor) {
          return new Response(
            JSON.stringify({ error: 'User already has a vendor profile' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: newVendor, error: createError } = await supabaseClient
          .from('vendors')
          .insert({
            ...vendorData,
            user_id: user.id,
            status: 'pending'
          })
          .select()
          .single()

        if (createError) {
          console.error('Vendor creation error:', createError)
          return new Response(
            JSON.stringify({ error: createError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ data: newVendor }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'PUT':
        if (!isVendorRoute) {
          return new Response(
            JSON.stringify({ error: 'Vendor ID required for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData: Partial<Vendor> = await req.json()

        // Check permissions
        const { data: targetVendor } = await supabaseClient
          .from('vendors')
          .select('user_id')
          .eq('id', vendorId)
          .single()

        if (!isAdmin && targetVendor?.user_id !== user.id) {
          return new Response(
            JSON.stringify({ error: 'Access denied' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Only admins can change status
        if (!isAdmin && updateData.status) {
          delete updateData.status
        }

        const { data: updatedVendor, error: updateError } = await supabaseClient
          .from('vendors')
          .update(updateData)
          .eq('id', vendorId)
          .select()
          .single()

        if (updateError) {
          console.error('Vendor update error:', updateError)
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ data: updatedVendor }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'DELETE':
        if (!isVendorRoute) {
          return new Response(
            JSON.stringify({ error: 'Vendor ID required for deletion' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Only admins can delete vendors
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: deleteError } = await supabaseClient
          .from('vendors')
          .delete()
          .eq('id', vendorId)

        if (deleteError) {
          console.error('Vendor deletion error:', deleteError)
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ message: 'Vendor deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Vendor Management API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})