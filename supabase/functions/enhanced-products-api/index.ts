import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DatabaseConfig {
  url: string;
  key: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`Enhanced Products API: ${method} ${path}`);

    // Product Search with AI Enhancement
    if (path === '/enhanced-products-api/search' && method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const category = url.searchParams.get('category');
      const minPrice = url.searchParams.get('min_price');
      const maxPrice = url.searchParams.get('max_price');
      const sortBy = url.searchParams.get('sort_by') || 'relevance';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      let searchQuery = supabase
        .from('products')
        .select(`
          *,
          brands(name, logo_url),
          product_reviews(rating, count)
        `)
        .eq('status', 'active');

      // Apply filters
      if (query) {
        searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
      }
      
      if (category) {
        searchQuery = searchQuery.eq('category_id', category);
      }
      
      if (minPrice) {
        searchQuery = searchQuery.gte('price', parseFloat(minPrice));
      }
      
      if (maxPrice) {
        searchQuery = searchQuery.lte('price', parseFloat(maxPrice));
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          searchQuery = searchQuery.order('price', { ascending: true });
          break;
        case 'price_high':
          searchQuery = searchQuery.order('price', { ascending: false });
          break;
        case 'rating':
          searchQuery = searchQuery.order('rating_average', { ascending: false });
          break;
        case 'newest':
          searchQuery = searchQuery.order('created_at', { ascending: false });
          break;
        case 'popularity':
          searchQuery = searchQuery.order('sales_count', { ascending: false });
          break;
        default: // relevance
          searchQuery = searchQuery.order('view_count', { ascending: false });
      }

      const { data: products, error, count } = await searchQuery
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Product search error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Log search query for analytics
      if (query) {
        await supabase.from('search_queries').insert({
          query,
          results_count: count || 0,
          filters: {
            category,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: sortBy
          },
          ip_address: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent')
        });
      }

      return new Response(JSON.stringify({
        products,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil((count || 0) / limit)
        },
        filters_applied: { query, category, minPrice, maxPrice, sortBy }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Product Details with Recommendations
    if (path.startsWith('/enhanced-products-api/products/') && method === 'GET') {
      const productId = path.split('/')[3];
      const userId = url.searchParams.get('user_id');

      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          brands(name, logo_url, description),
          product_reviews(id, rating, title, content, user_id, verified_purchase, created_at)
        `)
        .eq('id', productId)
        .single();

      if (productError) {
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get related products (same category, different product)
      const { data: relatedProducts } = await supabase
        .from('products')
        .select('id, name, price, images, rating_average, sales_count')
        .eq('category_id', product.category_id)
        .neq('id', productId)
        .eq('status', 'active')
        .order('sales_count', { ascending: false })
        .limit(8);

      // Get frequently bought together (simplified)
      const { data: frequentlyBought } = await supabase
        .from('order_items')
        .select(`
          product_id,
          products(id, name, price, images, rating_average)
        `)
        .neq('product_id', productId)
        .limit(6);

      // Update view count
      await supabase
        .from('products')
        .update({ view_count: (product.view_count || 0) + 1 })
        .eq('id', productId);

      // Log user interaction
      if (userId) {
        await supabase.from('user_product_interactions').insert({
          user_id: userId,
          product_id: productId,
          interaction_type: 'view',
          interaction_metadata: {
            timestamp: new Date().toISOString(),
            source: 'product_detail_page'
          }
        });
      }

      return new Response(JSON.stringify({
        product,
        related_products: relatedProducts || [],
        frequently_bought_together: frequentlyBought?.map(item => item.products) || [],
        recommendations: {
          similar_products: relatedProducts?.slice(0, 4) || [],
          trending_in_category: relatedProducts?.slice(4, 8) || []
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add Product Review
    if (path === '/enhanced-products-api/reviews' && method === 'POST') {
      const { product_id, user_id, order_id, rating, title, content, images } = await req.json();

      // Verify user can review this product (has purchased it)
      const { data: orderItem } = await supabase
        .from('order_items')
        .select('id')
        .eq('order_id', order_id)
        .eq('product_id', product_id)
        .single();

      const { data: review, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id,
          user_id,
          order_id,
          rating,
          title,
          content,
          images: images || [],
          verified_purchase: !!orderItem,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update product rating average
      const { data: reviews } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', product_id)
        .eq('status', 'approved');

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await supabase
          .from('products')
          .update({
            rating_average: Math.round(avgRating * 100) / 100,
            rating_count: reviews.length
          })
          .eq('id', product_id);
      }

      return new Response(JSON.stringify({ review }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Product Analytics (for vendors)
    if (path.startsWith('/enhanced-products-api/analytics/') && method === 'GET') {
      const productId = path.split('/')[3];
      const days = parseInt(url.searchParams.get('days') || '30');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get view analytics
      const { data: viewStats } = await supabase
        .from('user_product_interactions')
        .select('created_at')
        .eq('product_id', productId)
        .eq('interaction_type', 'view')
        .gte('created_at', startDate.toISOString());

      // Get cart additions
      const { data: cartStats } = await supabase
        .from('user_product_interactions')
        .select('created_at')
        .eq('product_id', productId)
        .eq('interaction_type', 'cart_add')
        .gte('created_at', startDate.toISOString());

      // Get purchases
      const { data: purchaseStats } = await supabase
        .from('order_items')
        .select('created_at, quantity, total_price')
        .eq('product_id', productId)
        .gte('created_at', startDate.toISOString());

      // Get search queries that led to this product
      const { data: searchStats } = await supabase
        .from('search_queries')
        .select('query, created_at')
        .eq('clicked_product_id', productId)
        .gte('created_at', startDate.toISOString());

      return new Response(JSON.stringify({
        analytics: {
          views: viewStats?.length || 0,
          cart_additions: cartStats?.length || 0,
          purchases: purchaseStats?.reduce((sum, p) => sum + p.quantity, 0) || 0,
          revenue: purchaseStats?.reduce((sum, p) => sum + parseFloat(p.total_price), 0) || 0,
          conversion_rate: viewStats?.length ? ((purchaseStats?.length || 0) / viewStats.length * 100) : 0,
          search_terms: searchStats?.map(s => s.query) || []
        },
        daily_stats: generateDailyStats(viewStats, cartStats, purchaseStats, days)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced Products API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateDailyStats(views: any[], carts: any[], purchases: any[], days: number) {
  const dailyStats = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayViews = views?.filter(v => v.created_at.startsWith(dateStr)).length || 0;
    const dayCarts = carts?.filter(c => c.created_at.startsWith(dateStr)).length || 0;
    const dayPurchases = purchases?.filter(p => p.created_at.startsWith(dateStr)).length || 0;
    
    dailyStats.push({
      date: dateStr,
      views: dayViews,
      cart_additions: dayCarts,
      purchases: dayPurchases
    });
  }
  
  return dailyStats;
}