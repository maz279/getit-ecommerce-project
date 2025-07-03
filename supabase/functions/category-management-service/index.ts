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
    console.log(`Category Management Service - Endpoint: ${endpoint}`);

    switch (endpoint) {
      case 'health':
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          service: 'category-management-service',
          features: ['hierarchy', 'bangladesh-categories', 'multilingual', 'seo-optimized']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/tree':
        // Build complete category tree with unlimited depth
        const { data: allCategories, error: treeError } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .eq('is_active', true)
          .order('level, sort_order');

        if (treeError) throw treeError;

        // Build tree structure
        const categoryMap = new Map();
        const rootCategories: any[] = [];

        // First pass: create map of all categories
        allCategories.forEach((cat: any) => {
          categoryMap.set(cat.id, { ...cat, children: [] });
        });

        // Second pass: build tree structure
        allCategories.forEach((cat: any) => {
          if (cat.parent_id) {
            const parent = categoryMap.get(cat.parent_id);
            if (parent) {
              parent.children.push(categoryMap.get(cat.id));
            }
          } else {
            rootCategories.push(categoryMap.get(cat.id));
          }
        });

        return new Response(JSON.stringify({ data: rootCategories }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/bangladesh':
        const { data: bdCategories, error: bdError } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .eq('bangladesh_specific', true)
          .eq('is_active', true)
          .order('traditional_category DESC, sort_order');

        // Group by type
        const groupedCategories = {
          traditional: bdCategories?.filter(cat => cat.traditional_category) || [],
          seasonal: bdCategories?.filter(cat => cat.seasonal_category) || [],
          festival: bdCategories?.filter(cat => cat.festival_category) || [],
          regional: bdCategories?.filter(cat => !cat.traditional_category && !cat.seasonal_category && !cat.festival_category) || []
        };

        return new Response(JSON.stringify({ 
          data: bdCategories, 
          grouped: groupedCategories,
          error: bdError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/festival':
        const { festival_type } = data;
        const { data: festivalCategories, error: festivalError } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .eq('festival_category', festival_type)
          .eq('is_active', true)
          .order('sort_order');

        return new Response(JSON.stringify({ data: festivalCategories, error: festivalError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/create':
        const { category, parent_id } = data;
        
        // Calculate level and path
        let level = 0;
        let categoryPath = category.name;
        
        if (parent_id) {
          const { data: parent } = await supabase
            .from('product_categories_enhanced')
            .select('level, category_path')
            .eq('id', parent_id)
            .single();
          
          if (parent) {
            level = parent.level + 1;
            categoryPath = `${parent.category_path}/${category.name}`;
          }
        }

        const categoryData = {
          ...category,
          parent_id,
          level,
          category_path: categoryPath,
          slug: category.name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        };

        const { data: newCategory, error: createError } = await supabase
          .from('product_categories_enhanced')
          .insert(categoryData)
          .select()
          .single();

        return new Response(JSON.stringify({ data: newCategory, error: createError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/update':
        const { category_id, updates } = data;
        
        const { data: updatedCategory, error: updateError } = await supabase
          .from('product_categories_enhanced')
          .update(updates)
          .eq('id', category_id)
          .select()
          .single();

        return new Response(JSON.stringify({ data: updatedCategory, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/move':
        const { category_id: moveId, new_parent_id } = data;
        
        // Get current category
        const { data: currentCategory } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .eq('id', moveId)
          .single();

        if (!currentCategory) {
          throw new Error('Category not found');
        }

        // Calculate new level and path
        let newLevel = 0;
        let newPath = currentCategory.name;
        
        if (new_parent_id) {
          const { data: newParent } = await supabase
            .from('product_categories_enhanced')
            .select('level, category_path')
            .eq('id', new_parent_id)
            .single();
          
          if (newParent) {
            newLevel = newParent.level + 1;
            newPath = `${newParent.category_path}/${currentCategory.name}`;
          }
        }

        // Update category
        const { data: movedCategory, error: moveError } = await supabase
          .from('product_categories_enhanced')
          .update({
            parent_id: new_parent_id,
            level: newLevel,
            category_path: newPath
          })
          .eq('id', moveId)
          .select()
          .single();

        // Update all descendant categories
        const { data: descendants } = await supabase
          .from('product_categories_enhanced')
          .select('*')
          .like('category_path', `${currentCategory.category_path}/%`);

        if (descendants && descendants.length > 0) {
          for (const desc of descendants) {
            const updatedDescPath = desc.category_path.replace(
              currentCategory.category_path,
              newPath
            );
            const pathParts = updatedDescPath.split('/');
            
            await supabase
              .from('product_categories_enhanced')
              .update({
                level: pathParts.length - 1,
                category_path: updatedDescPath
              })
              .eq('id', desc.id);
          }
        }

        return new Response(JSON.stringify({ data: movedCategory, error: moveError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/delete':
        const { category_id: deleteId, force = false } = data;
        
        // Check for children
        const { data: children } = await supabase
          .from('product_categories_enhanced')
          .select('id')
          .eq('parent_id', deleteId);

        if (children && children.length > 0 && !force) {
          return new Response(JSON.stringify({ 
            error: 'Category has children. Use force=true to delete all descendants.' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Delete category (and children if force=true)
        if (force && children && children.length > 0) {
          // Get all descendants
          const { data: categoryToDelete } = await supabase
            .from('product_categories_enhanced')
            .select('category_path')
            .eq('id', deleteId)
            .single();

          if (categoryToDelete) {
            await supabase
              .from('product_categories_enhanced')
              .delete()
              .or(`id.eq.${deleteId},category_path.like.${categoryToDelete.category_path}/%`);
          }
        } else {
          await supabase
            .from('product_categories_enhanced')
            .delete()
            .eq('id', deleteId);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/reorder':
        const { category_ids, new_orders } = data;
        
        // Update sort orders
        for (let i = 0; i < category_ids.length; i++) {
          await supabase
            .from('product_categories_enhanced')
            .update({ sort_order: new_orders[i] })
            .eq('id', category_ids[i]);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/search':
        const { query, language = 'en' } = data;
        
        let searchQuery = supabase
          .from('product_categories_enhanced')
          .select('*')
          .eq('is_active', true);

        if (language === 'bn') {
          searchQuery = searchQuery.or(`name_bn.ilike.%${query}%,description_bn.ilike.%${query}%`);
        } else {
          searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,category_path.ilike.%${query}%`);
        }

        const { data: searchResults, error: searchError } = await searchQuery
          .order('level')
          .limit(20);

        return new Response(JSON.stringify({ data: searchResults, error: searchError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'categories/stats':
        const { data: stats } = await supabase.rpc('get_category_stats');
        
        // Fallback if RPC doesn't exist
        const { count: totalCategories } = await supabase
          .from('product_categories_enhanced')
          .select('*', { count: 'exact', head: true });

        const { count: bangladeshCategories } = await supabase
          .from('product_categories_enhanced')
          .select('*', { count: 'exact', head: true })
          .eq('bangladesh_specific', true);

        const fallbackStats = {
          total_categories: totalCategories || 0,
          bangladesh_categories: bangladeshCategories || 0,
          traditional_categories: 0,
          festival_categories: 0,
          multilingual_categories: 0
        };

        return new Response(JSON.stringify({ data: stats || fallbackStats }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Category Management Service error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      service: 'category-management-service'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});