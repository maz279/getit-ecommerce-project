import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, data } = await req.json();
    console.log(`Product Management Enhanced - Endpoint: ${endpoint}`);

    switch (endpoint) {
      case 'health':
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          service: 'product-management-enhanced',
          capabilities: ['products', 'categories', 'inventory', 'media', 'analytics', 'bangladesh-features']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Enhanced Category Management
      case 'categories/hierarchy':
        const { data: categories, error: catError } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .is('parent_id', null)
          .eq('is_active', true)
          .order('sort_order');

        if (catError) throw catError;

        // Build hierarchy
        const hierarchy = await Promise.all(
          categories.map(async (cat: any) => {
            const { data: children } = await supabase
              .from('product_categories_enhanced')
              .select('*')
              .eq('parent_id', cat.id)
              .eq('is_active', true)
              .order('sort_order');
            
            return { ...cat, children: children || [] };
          })
        );

        return new Response(JSON.stringify({ data: hierarchy }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/bangladesh':
        const { data: bdCategories, error: bdError } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .eq('bangladesh_specific', true)
          .eq('is_active', true)
          .order('name');

        return new Response(JSON.stringify({ data: bdCategories, error: bdError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/create':
        const categoryData = {
          ...data.category,
          slug: data.category.name.toLowerCase().replace(/\s+/g, '-'),
          category_path: data.parent_id ? 
            `${data.parentPath}/${data.category.name}` : 
            data.category.name
        };

        const { data: newCategory, error: createCatError } = await supabase
          .from('product_categories_enhanced')
          .insert(categoryData)
          .select()
          .single();

        return new Response(JSON.stringify({ data: newCategory, error: createCatError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Enhanced Product Management with Bangladesh Features
      case 'products/enhanced':
        let productQuery = supabase
          .from('products')
          .select(`
            *,
            product_attributes_bd(*),
            product_media_enhanced(*),
            product_inventory(*)
          `);

        if (data?.filters) {
          if (data.filters.category_id) {
            productQuery = productQuery.eq('category_id', data.filters.category_id);
          }
          if (data.filters.vendor_id) {
            productQuery = productQuery.eq('vendor_id', data.filters.vendor_id);
          }
          if (data.filters.bangladesh_specific) {
            productQuery = productQuery.not('product_attributes_bd', 'is', null);
          }
          if (data.filters.material_type) {
            productQuery = productQuery.eq('product_attributes_bd.material_type', data.filters.material_type);
          }
          if (data.filters.festival_suitable) {
            productQuery = productQuery.contains('product_attributes_bd.festival_suitable', [data.filters.festival_suitable]);
          }
        }

        if (data?.limit) {
          productQuery = productQuery.limit(data.limit);
        }

        const { data: enhancedProducts, error: productError } = await productQuery;

        return new Response(JSON.stringify({ data: enhancedProducts, error: productError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'products/create-enhanced':
        // Create product with Bangladesh attributes
        const { data: product, error: prodError } = await supabase
          .from('products')
          .insert(data.product)
          .select()
          .single();

        if (prodError) throw prodError;

        // Add Bangladesh-specific attributes if provided
        if (data.bangladeshAttributes) {
          const { error: attrError } = await supabase
            .from('product_attributes_bd')
            .insert({
              product_id: product.id,
              ...data.bangladeshAttributes
            });

          if (attrError) console.error('Bangladesh attributes error:', attrError);
        }

        // Add media if provided
        if (data.media && data.media.length > 0) {
          const mediaData = data.media.map((media: any, index: number) => ({
            product_id: product.id,
            ...media,
            display_order: index
          }));

          const { error: mediaError } = await supabase
            .from('product_media_enhanced')
            .insert(mediaData);

          if (mediaError) console.error('Media error:', mediaError);
        }

        return new Response(JSON.stringify({ data: product }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Inventory Automation
      case 'inventory/automation/rules':
        if (data?.vendor_id) {
          const { data: rules, error: rulesError } = await supabase
            .from('inventory_automation_rules')
            .select('*')
            .eq('vendor_id', data.vendor_id);

          return new Response(JSON.stringify({ data: rules, error: rulesError }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'inventory/automation/create':
        const { data: newRule, error: ruleError } = await supabase
          .from('inventory_automation_rules')
          .insert(data.rule)
          .select()
          .single();

        return new Response(JSON.stringify({ data: newRule, error: ruleError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'inventory/check-reorders':
        // Check for products that need reordering
        const { data: reorderProducts, error: reorderError } = await supabase
          .from('inventory_automation_rules')
          .select(`
            *,
            products!inner(*),
            product_inventory!inner(*)
          `)
          .eq('auto_reorder_enabled', true)
          .filter('product_inventory.current_stock', 'lte', 'reorder_point');

        return new Response(JSON.stringify({ data: reorderProducts, error: reorderError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Bulk Upload Management
      case 'bulk/sessions':
        if (data?.vendor_id) {
          const { data: sessions, error: sessionsError } = await supabase
            .from('bulk_upload_sessions')
            .select('*')
            .eq('vendor_id', data.vendor_id)
            .order('created_at', { ascending: false });

          return new Response(JSON.stringify({ data: sessions, error: sessionsError }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'bulk/create-session':
        const { data: session, error: sessionError } = await supabase
          .from('bulk_upload_sessions')
          .insert(data.session)
          .select()
          .single();

        return new Response(JSON.stringify({ data: session, error: sessionError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'bulk/process':
        // Simulate bulk processing (in production, this would be a background job)
        const sessionId = data.session_id;
        
        await supabase
          .from('bulk_upload_sessions')
          .update({ 
            status: 'processing',
            processing_started_at: new Date().toISOString()
          })
          .eq('id', sessionId);

        // Simulate processing delay
        setTimeout(async () => {
          await supabase
            .from('bulk_upload_sessions')
            .update({ 
              status: 'completed',
              processed_records: data.total_records || 0,
              successful_records: Math.floor((data.total_records || 0) * 0.95),
              failed_records: Math.ceil((data.total_records || 0) * 0.05),
              processing_completed_at: new Date().toISOString()
            })
            .eq('id', sessionId);
        }, 5000);

        return new Response(JSON.stringify({ 
          message: 'Bulk processing started',
          session_id: sessionId 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Product Analytics
      case 'analytics/product-performance':
        const { product_id, period = 'daily', date_range = 30 } = data;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - date_range);

        const { data: analytics, error: analyticsError } = await supabase
          .from('product_analytics_enhanced')
          .select('*')
          .eq('product_id', product_id)
          .eq('analytics_period', period)
          .gte('analytics_date', startDate.toISOString().split('T')[0])
          .order('analytics_date');

        return new Response(JSON.stringify({ data: analytics, error: analyticsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'analytics/vendor-summary':
        const { vendor_id, analytics_period = 'daily' } = data;
        
        const { data: vendorAnalytics, error: vendorError } = await supabase
          .from('product_analytics_enhanced')
          .select('*')
          .eq('vendor_id', vendor_id)
          .eq('analytics_period', analytics_period)
          .order('analytics_date', { ascending: false })
          .limit(30);

        // Calculate summary metrics
        const summary = vendorAnalytics?.reduce((acc: any, curr: any) => ({
          total_views: acc.total_views + (curr.views_count || 0),
          total_revenue: acc.total_revenue + (curr.revenue_generated || 0),
          total_orders: acc.total_orders + (curr.purchase_count || 0),
          avg_conversion: acc.avg_conversion + (curr.conversion_rate || 0)
        }), { total_views: 0, total_revenue: 0, total_orders: 0, avg_conversion: 0 });

        if (summary && vendorAnalytics?.length) {
          summary.avg_conversion = summary.avg_conversion / vendorAnalytics.length;
        }

        return new Response(JSON.stringify({ 
          data: vendorAnalytics, 
          summary,
          error: vendorError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Search Configuration
      case 'search/config':
        const { data: searchConfigs, error: searchError } = await supabase
          .from('product_search_config')
          .select('*')
          .eq('is_active', true);

        return new Response(JSON.stringify({ data: searchConfigs, error: searchError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'search/bangla-phonetic':
        const { query } = data;
        
        // Simple phonetic mapping for demonstration
        const phoneticMappings: { [key: string]: string[] } = {
          'computer': ['কম্পিউটার', 'কম্পিউটার'],
          'mobile': ['মোবাইল', 'মোবাইল'],
          'saree': ['শাড়ি', 'সাড়ি'],
          'shirt': ['শার্ট', 'সার্ট']
        };

        const results = Object.entries(phoneticMappings)
          .filter(([english, bangla]) => 
            english.includes(query.toLowerCase()) || 
            bangla.some(b => b.includes(query))
          )
          .map(([english, bangla]) => ({ english, bangla }));

        return new Response(JSON.stringify({ data: results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Product Management Enhanced error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      service: 'product-management-enhanced'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});