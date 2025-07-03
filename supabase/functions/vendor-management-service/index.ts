import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VendorData {
  business_name: string
  business_type: string
  contact_email: string
  contact_phone: string
  business_address: string
  trade_license_number?: string
  tin_number?: string
  nid_number?: string
  bank_account_number?: string
  bank_name?: string
  account_holder_name?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Vendor Registration
    if (path === '/vendor-management-service/register' && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const vendorData: VendorData = await req.json()

      // Create vendor record
      const { data: vendor, error: vendorError } = await supabaseClient
        .from('vendors')
        .insert({
          user_id: user.id,
          business_name: vendorData.business_name,
          business_type: vendorData.business_type,
          contact_email: vendorData.contact_email,
          contact_phone: vendorData.contact_phone,
          business_address: vendorData.business_address,
          verification_status: 'pending',
          status: 'pending_approval'
        })
        .select()
        .single()

      if (vendorError) throw vendorError

      // Create vendor store
      const { error: storeError } = await supabaseClient
        .from('vendor_stores')
        .insert({
          vendor_id: vendor.id,
          store_name: vendorData.business_name,
          store_slug: vendorData.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          contact_email: vendorData.contact_email,
          contact_phone: vendorData.contact_phone,
          store_address: vendorData.business_address
        })

      if (storeError) throw storeError

      // Create KYC documents if provided
      const kycDocuments = []
      if (vendorData.trade_license_number) {
        kycDocuments.push({
          vendor_id: vendor.id,
          document_type: 'trade_license',
          document_number: vendorData.trade_license_number,
          document_url: '', // To be uploaded separately
          verification_status: 'pending'
        })
      }

      if (vendorData.tin_number) {
        kycDocuments.push({
          vendor_id: vendor.id,
          document_type: 'tin',
          document_number: vendorData.tin_number,
          document_url: '',
          verification_status: 'pending'
        })
      }

      if (vendorData.nid_number) {
        kycDocuments.push({
          vendor_id: vendor.id,
          document_type: 'nid',
          document_number: vendorData.nid_number,
          document_url: '',
          verification_status: 'pending'
        })
      }

      if (kycDocuments.length > 0) {
        await supabaseClient.from('vendor_kyc_documents').insert(kycDocuments)
      }

      // Create bank details if provided
      if (vendorData.bank_account_number && vendorData.bank_name) {
        await supabaseClient.from('vendor_bank_details').insert({
          vendor_id: vendor.id,
          bank_name: vendorData.bank_name,
          account_holder_name: vendorData.account_holder_name || vendorData.business_name,
          account_number: vendorData.bank_account_number,
          account_type: 'current',
          is_verified: false,
          is_primary: true
        })
      }

      return new Response(
        JSON.stringify({ success: true, vendor_id: vendor.id, message: 'Vendor registration successful' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Vendor Profile
    if (path === '/vendor-management-service/profile' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data: vendor, error } = await supabaseClient
        .from('vendors')
        .select(`
          *,
          vendor_stores(*),
          vendor_kyc_documents(*),
          vendor_bank_details(*)
        `)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(vendor),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update Vendor Profile
    if (path === '/vendor-management-service/profile' && method === 'PUT') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const updates = await req.json()
      
      const { data, error } = await supabaseClient
        .from('vendors')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vendor Analytics
    if (path === '/vendor-management-service/analytics' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const vendorId = url.searchParams.get('vendor_id')
      if (!vendorId) throw new Error('Vendor ID required')

      // Get sales analytics
      const { data: salesData } = await supabaseClient
        .from('vendor_orders')
        .select('total_amount, commission_amount, created_at, status')
        .eq('vendor_id', vendorId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      // Get product performance
      const { data: productData } = await supabaseClient
        .from('products')
        .select('id, name, views, sales_count')
        .eq('vendor_id', vendorId)
        .order('sales_count', { ascending: false })
        .limit(10)

      const analytics = {
        sales: {
          total_revenue: salesData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
          total_commission: salesData?.reduce((sum, order) => sum + (order.commission_amount || 0), 0) || 0,
          order_count: salesData?.length || 0,
          avg_order_value: salesData?.length ? (salesData.reduce((sum, order) => sum + order.total_amount, 0) / salesData.length) : 0
        },
        products: {
          top_products: productData || [],
          total_products: productData?.length || 0
        },
        period: '30_days'
      }

      return new Response(
        JSON.stringify(analytics),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vendor List (Admin)
    if (path === '/vendor-management-service/list' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Check if user is admin
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        throw new Error('Insufficient permissions')
      }

      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const status = url.searchParams.get('status')
      const search = url.searchParams.get('search')

      let query = supabaseClient
        .from('vendors')
        .select(`
          *,
          vendor_stores!inner(store_name, is_active),
          profiles!inner(full_name, email)
        `, { count: 'exact' })

      if (status) {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`business_name.ilike.%${search}%,contact_email.ilike.%${search}%`)
      }

      const { data: vendors, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({
          vendors,
          pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil((count || 0) / limit)
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Vendor Management Service Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})