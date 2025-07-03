import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'semantic-search':
        return await semanticSearch(req, supabaseClient)
      case 'faceted-search':
        return await facetedSearch(req, supabaseClient)
      case 'autocomplete':
        return await autocompleteSearch(req, supabaseClient)
      case 'similarity-search':
        return await similaritySearch(req, supabaseClient)
      case 'index-products':
        return await indexProducts(req, supabaseClient)
      case 'trending-searches':
        return await getTrendingSearches(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Advanced search error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function semanticSearch(req: Request, supabaseClient: any) {
  const { query, filters, limit = 20, offset = 0 } = await req.json()
  
  console.log('Semantic search request:', { query, filters, limit, offset })
  
  // Build full-text search query with ranking
  let searchQuery = supabaseClient
    .from('products')
    .select(`
      *,
      categories(name, slug),
      vendor:vendors(business_name, id),
      ts_rank(searchable_content, plainto_tsquery('english', $1)) as relevance_score
    `, { count: 'exact' })
    .textSearch('searchable_content', query, {
      type: 'websearch',
      config: 'english'
    })
    .order('relevance_score', { ascending: false })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (filters) {
    if (filters.category_id) {
      searchQuery = searchQuery.eq('category_id', filters.category_id)
    }
    if (filters.vendor_id) {
      searchQuery = searchQuery.eq('vendor_id', filters.vendor_id)
    }
    if (filters.price_min) {
      searchQuery = searchQuery.gte('price', filters.price_min)
    }
    if (filters.price_max) {
      searchQuery = searchQuery.lte('price', filters.price_max)
    }
    if (filters.is_available !== undefined) {
      searchQuery = searchQuery.eq('is_available', filters.is_available)
    }
    if (filters.rating_min) {
      searchQuery = searchQuery.gte('average_rating', filters.rating_min)
    }
    if (filters.tags && filters.tags.length > 0) {
      searchQuery = searchQuery.overlaps('tags', filters.tags)
    }
  }

  const { data: products, error, count } = await searchQuery

  if (error) {
    throw new Error(`Search failed: ${error.message}`)
  }

  // Log search query for analytics
  await supabaseClient.from('search_queries').insert({
    query_text: query,
    filters: filters || {},
    results_count: count,
    user_id: null, // Can be extracted from auth if needed
    search_type: 'semantic'
  })

  // Calculate facets for filter suggestions
  const facets = await calculateFacets(supabaseClient, query, filters)

  return new Response(JSON.stringify({
    success: true,
    products,
    total_count: count,
    facets,
    search_metadata: {
      query,
      filters,
      processing_time: Date.now(),
      search_type: 'semantic'
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function facetedSearch(req: Request, supabaseClient: any) {
  const { query, selected_facets } = await req.json()
  
  // Get all available facets
  const { data: categories } = await supabaseClient
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)

  const { data: vendors } = await supabaseClient
    .from('vendors')
    .select('id, business_name')
    .eq('status', 'active')

  // Get price ranges
  const { data: priceStats } = await supabaseClient
    .rpc('get_price_statistics')

  // Get popular tags
  const { data: popularTags } = await supabaseClient
    .rpc('get_popular_tags', { limit_count: 20 })

  const facets = {
    categories: categories?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: 0 // Would need separate query to get counts
    })) || [],
    vendors: vendors?.slice(0, 10).map(vendor => ({
      id: vendor.id,
      name: vendor.business_name,
      count: 0
    })) || [],
    price_ranges: [
      { min: 0, max: 500, label: 'Under ৳500', count: 0 },
      { min: 500, max: 1000, label: '৳500 - ৳1,000', count: 0 },
      { min: 1000, max: 5000, label: '৳1,000 - ৳5,000', count: 0 },
      { min: 5000, max: 10000, label: '৳5,000 - ৳10,000', count: 0 },
      { min: 10000, max: null, label: 'Above ৳10,000', count: 0 }
    ],
    ratings: [
      { min: 4, label: '4+ Stars', count: 0 },
      { min: 3, label: '3+ Stars', count: 0 },
      { min: 2, label: '2+ Stars', count: 0 },
      { min: 1, label: '1+ Stars', count: 0 }
    ],
    tags: popularTags || [],
    availability: [
      { value: true, label: 'In Stock', count: 0 },
      { value: false, label: 'Out of Stock', count: 0 }
    ]
  }

  return new Response(JSON.stringify({
    success: true,
    facets,
    selected_facets: selected_facets || {}
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function autocompleteSearch(req: Request, supabaseClient: any) {
  const { query, limit = 10 } = await req.json()
  
  if (!query || query.length < 2) {
    return new Response(JSON.stringify({
      success: true,
      suggestions: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get product name suggestions
  const { data: productSuggestions } = await supabaseClient
    .from('products')
    .select('name, slug')
    .ilike('name', `%${query}%`)
    .eq('is_available', true)
    .limit(limit / 2)

  // Get category suggestions
  const { data: categorySuggestions } = await supabaseClient
    .from('categories')
    .select('name, slug')
    .ilike('name', `%${query}%`)
    .eq('is_active', true)
    .limit(limit / 4)

  // Get vendor suggestions
  const { data: vendorSuggestions } = await supabaseClient
    .from('vendors')
    .select('business_name, id')
    .ilike('business_name', `%${query}%`)
    .eq('status', 'active')
    .limit(limit / 4)

  const suggestions = [
    ...(productSuggestions || []).map(p => ({
      type: 'product',
      text: p.name,
      slug: p.slug,
      category: 'Products'
    })),
    ...(categorySuggestions || []).map(c => ({
      type: 'category',
      text: c.name,
      slug: c.slug,
      category: 'Categories'
    })),
    ...(vendorSuggestions || []).map(v => ({
      type: 'vendor',
      text: v.business_name,
      id: v.id,
      category: 'Vendors'
    }))
  ]

  return new Response(JSON.stringify({
    success: true,
    suggestions: suggestions.slice(0, limit)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function similaritySearch(req: Request, supabaseClient: any) {
  const { product_id, limit = 10 } = await req.json()
  
  // Get the source product
  const { data: sourceProduct } = await supabaseClient
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single()

  if (!sourceProduct) {
    throw new Error('Product not found')
  }

  // Find similar products using multiple strategies
  const { data: similarProducts } = await supabaseClient
    .from('products')
    .select(`
      *,
      categories(name, slug),
      vendor:vendors(business_name, id)
    `)
    .neq('id', product_id)
    .eq('category_id', sourceProduct.category_id)
    .gte('price', sourceProduct.price * 0.5)
    .lte('price', sourceProduct.price * 2)
    .eq('is_available', true)
    .limit(limit)

  // Calculate similarity scores
  const scoredProducts = (similarProducts || []).map(product => ({
    ...product,
    similarity_score: calculateSimilarityScore(sourceProduct, product)
  })).sort((a, b) => b.similarity_score - a.similarity_score)

  return new Response(JSON.stringify({
    success: true,
    similar_products: scoredProducts,
    source_product: sourceProduct
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function indexProducts(req: Request, supabaseClient: any) {
  const { batch_size = 100 } = await req.json()
  
  console.log('Starting product indexing...')
  
  let processed = 0
  let offset = 0
  
  while (true) {
    const { data: products, error } = await supabaseClient
      .from('products')
      .select('id, name, description, tags')
      .range(offset, offset + batch_size - 1)
    
    if (error || !products || products.length === 0) {
      break
    }
    
    // Update searchable content for each product
    for (const product of products) {
      const searchableContent = [
        product.name,
        product.description,
        ...(product.tags || [])
      ].filter(Boolean).join(' ')
      
      await supabaseClient
        .from('products')
        .update({ 
          searchable_content: searchableContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
    }
    
    processed += products.length
    offset += batch_size
    
    console.log(`Indexed ${processed} products...`)
  }
  
  return new Response(JSON.stringify({
    success: true,
    products_indexed: processed,
    message: `Successfully indexed ${processed} products`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getTrendingSearches(req: Request, supabaseClient: any) {
  const { period = '7days', limit = 10 } = await req.json()
  
  const periodDays = period === '24hours' ? 1 : period === '7days' ? 7 : 30
  
  const { data: trendingSearches } = await supabaseClient
    .from('search_queries')
    .select('query_text, count(*)')
    .gte('created_at', new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString())
    .not('query_text', 'is', null)
    .limit(limit)
    
  return new Response(JSON.stringify({
    success: true,
    trending_searches: trendingSearches || [],
    period,
    generated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Helper functions
async function calculateFacets(supabaseClient: any, query: string, filters: any) {
  // This would calculate available facets based on current search results
  // Simplified implementation
  return {
    categories: [],
    price_ranges: [],
    ratings: [],
    vendors: [],
    tags: []
  }
}

function calculateSimilarityScore(product1: any, product2: any): number {
  let score = 0
  
  // Category match
  if (product1.category_id === product2.category_id) score += 0.3
  
  // Price similarity
  const priceDiff = Math.abs(product1.price - product2.price) / Math.max(product1.price, product2.price)
  score += (1 - priceDiff) * 0.2
  
  // Rating similarity
  if (product1.average_rating && product2.average_rating) {
    const ratingDiff = Math.abs(product1.average_rating - product2.average_rating) / 5
    score += (1 - ratingDiff) * 0.2
  }
  
  // Tag overlap
  const tags1 = product1.tags || []
  const tags2 = product2.tags || []
  const commonTags = tags1.filter((tag: string) => tags2.includes(tag))
  const tagSimilarity = commonTags.length / Math.max(tags1.length, tags2.length, 1)
  score += tagSimilarity * 0.3
  
  return Math.min(score, 1)
}