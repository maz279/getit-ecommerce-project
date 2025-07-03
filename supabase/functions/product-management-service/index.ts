import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductData {
  name: string
  description: string
  category_id: string
  price: number
  compare_price?: number
  cost_price?: number
  weight?: number
  dimensions?: object
  tags?: string[]
  variants?: Array<{
    sku: string
    variant_name: string
    attributes: object
    price: number
    stock_quantity: number
  }>
  media?: Array<{
    media_type: string
    media_url: string
    alt_text?: string
    sort_order?: number
  }>
}

serve(async (req) => {
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

    // Create Product
    if (path === '/product-management-service/products' && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Verify vendor
      const { data: vendor } = await supabaseClient
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendor) throw new Error('Vendor not found')

      const productData: ProductData = await req.json()

      // Create product
      const { data: product, error: productError } = await supabaseClient
        .from('products')
        .insert({
          vendor_id: vendor.id,
          name: productData.name,
          description: productData.description,
          category_id: productData.category_id,
          price: productData.price,
          compare_price: productData.compare_price,
          cost_price: productData.cost_price,
          weight: productData.weight,
          dimensions: productData.dimensions,
          tags: productData.tags,
          status: 'draft',
          is_active: false
        })
        .select()
        .single()

      if (productError) throw productError

      // Create variants if provided
      if (productData.variants && productData.variants.length > 0) {
        const variants = productData.variants.map(variant => ({
          product_id: product.id,
          sku: variant.sku,
          variant_name: variant.variant_name,
          attributes: variant.attributes,
          price: variant.price
        }))

        const { data: createdVariants, error: variantError } = await supabaseClient
          .from('product_variants')
          .insert(variants)
          .select()

        if (variantError) throw variantError

        // Create inventory for variants
        const inventoryRecords = createdVariants.map(variant => ({
          product_id: product.id,
          variant_id: variant.id,
          current_stock: productData.variants?.find(v => v.sku === variant.sku)?.stock_quantity || 0,
          minimum_stock_level: 5
        }))

        await supabaseClient.from('product_inventory').insert(inventoryRecords)
      } else {
        // Create inventory for main product
        await supabaseClient.from('product_inventory').insert({
          product_id: product.id,
          current_stock: 0,
          minimum_stock_level: 5
        })
      }

      // Create media if provided
      if (productData.media && productData.media.length > 0) {
        const mediaRecords = productData.media.map((media, index) => ({
          product_id: product.id,
          media_type: media.media_type,
          media_url: media.media_url,
          alt_text: media.alt_text,
          sort_order: media.sort_order || index,
          is_primary: index === 0
        }))

        await supabaseClient.from('product_media').insert(mediaRecords)
      }

      return new Response(
        JSON.stringify({ success: true, product_id: product.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Products
    if (path === '/product-management-service/products' && method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const category = url.searchParams.get('category')
      const search = url.searchParams.get('search')
      const vendor_id = url.searchParams.get('vendor_id')
      const status = url.searchParams.get('status') || 'active'

      let query = supabaseClient
        .from('products')
        .select(`
          *,
          product_variants(*),
          product_media(*),
          product_inventory(*),
          vendors(business_name),
          product_categories(name)
        `, { count: 'exact' })

      if (status === 'active') {
        query = query.eq('is_active', true)
      }

      if (category) {
        query = query.eq('category_id', category)
      }

      if (vendor_id) {
        query = query.eq('vendor_id', vendor_id)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data: products, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({
          products,
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

    // Get Single Product
    if (path.startsWith('/product-management-service/products/') && method === 'GET') {
      const productId = path.split('/').pop()

      const { data: product, error } = await supabaseClient
        .from('products')
        .select(`
          *,
          product_variants(*),
          product_media(*),
          product_inventory(*),
          vendors(business_name, contact_email),
          product_categories(name, slug),
          product_reviews(*)
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(product),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update Product
    if (path.startsWith('/product-management-service/products/') && method === 'PUT') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const productId = path.split('/').pop()
      const updates = await req.json()

      // Verify ownership
      const { data: product } = await supabaseClient
        .from('products')
        .select('vendor_id, vendors!inner(user_id)')
        .eq('id', productId)
        .single()

      if (!product || product.vendors.user_id !== user.id) {
        throw new Error('Unauthorized to update this product')
      }

      const { data, error } = await supabaseClient
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Bulk Import Products
    if (path === '/product-management-service/bulk-import' && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { data: vendor } = await supabaseClient
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendor) throw new Error('Vendor not found')

      const { products } = await req.json()
      const results = []

      for (const productData of products) {
        try {
          const { data: product, error } = await supabaseClient
            .from('products')
            .insert({
              vendor_id: vendor.id,
              ...productData,
              status: 'draft'
            })
            .select()
            .single()

          if (error) throw error

          results.push({ success: true, product_id: product.id, sku: productData.sku })
        } catch (error) {
          results.push({ success: false, error: error.message, sku: productData.sku })
        }
      }

      return new Response(
        JSON.stringify({ results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Product Search with Filters
    if (path === '/product-management-service/search' && method === 'GET') {
      const query = url.searchParams.get('q') || ''
      const category = url.searchParams.get('category')
      const minPrice = url.searchParams.get('min_price')
      const maxPrice = url.searchParams.get('max_price')
      const inStock = url.searchParams.get('in_stock') === 'true'
      const sortBy = url.searchParams.get('sort_by') || 'created_at'
      const sortOrder = url.searchParams.get('sort_order') || 'desc'
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')

      let searchQuery = supabaseClient
        .from('products')
        .select(`
          *,
          product_variants(*),
          product_media(*),
          product_inventory(*),
          vendors(business_name),
          product_categories(name)
        `, { count: 'exact' })
        .eq('is_active', true)

      if (query) {
        searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      }

      if (category) {
        searchQuery = searchQuery.eq('category_id', category)
      }

      if (minPrice) {
        searchQuery = searchQuery.gte('price', parseFloat(minPrice))
      }

      if (maxPrice) {
        searchQuery = searchQuery.lte('price', parseFloat(maxPrice))
      }

      const { data: products, error, count } = await searchQuery
        .range((page - 1) * limit, page * limit - 1)
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (error) throw error

      // Filter by stock if requested
      let filteredProducts = products
      if (inStock) {
        filteredProducts = products?.filter(product => 
          product.product_inventory?.some(inv => inv.current_stock > 0)
        ) || []
      }

      return new Response(
        JSON.stringify({
          products: filteredProducts,
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
    console.error('Product Management Service Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})