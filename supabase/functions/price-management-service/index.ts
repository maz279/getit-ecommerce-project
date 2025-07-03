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
    console.log(`Price Management Service - Endpoint: ${endpoint}`);

    switch (endpoint) {
      case 'health':
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          service: 'price-management-service',
          capabilities: ['dynamic-pricing', 'promotional-pricing', 'competitive-pricing', 'seasonal-pricing']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'create-pricing-rule':
        const { product_id, vendor_id, rule_type, rule_config } = data;
        
        const { data: rule, error: ruleError } = await supabase
          .from('price_management_rules')
          .insert({
            product_id,
            vendor_id,
            rule_type,
            rule_config,
            pricing_algorithm: rule_config.algorithm || 'fixed',
            minimum_price: rule_config.min_price,
            maximum_price: rule_config.max_price,
            current_price: rule_config.base_price,
            effective_dates: rule_config.effective_dates
          })
          .select()
          .single();

        if (ruleError) throw ruleError;

        // Apply pricing rule immediately
        const newPrice = await calculatePrice(rule, rule_config);
        
        // Update product price
        await supabase
          .from('products')
          .update({ price: newPrice })
          .eq('id', product_id);

        return new Response(JSON.stringify({ 
          rule,
          calculated_price: newPrice,
          status: 'applied'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'dynamic-pricing':
        const { product_id: dynProductId, factors } = data;
        
        // Get current pricing rule
        const { data: existingRule } = await supabase
          .from('price_management_rules')
          .select('*')
          .eq('product_id', dynProductId)
          .eq('rule_type', 'dynamic')
          .eq('is_active', true)
          .single();

        if (!existingRule) {
          throw new Error('No dynamic pricing rule found for this product');
        }

        // Calculate new price based on factors
        const dynamicPrice = await calculateDynamicPrice(existingRule, factors);
        
        // Update current price
        await supabase
          .from('price_management_rules')
          .update({ current_price: dynamicPrice })
          .eq('id', existingRule.id);

        await supabase
          .from('products')
          .update({ price: dynamicPrice })
          .eq('id', dynProductId);

        return new Response(JSON.stringify({ 
          product_id: dynProductId,
          new_price: dynamicPrice,
          factors_applied: factors,
          rule_id: existingRule.id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'promotional-pricing':
        const { products, promotion_config } = data;
        
        const promotionalRules = [];
        for (const product_id of products) {
          const rule = await supabase
            .from('price_management_rules')
            .insert({
              product_id,
              vendor_id: promotion_config.vendor_id,
              rule_type: 'promotional',
              rule_config: promotion_config,
              pricing_algorithm: 'percentage_discount',
              effective_dates: {
                start: promotion_config.start_date,
                end: promotion_config.end_date
              }
            })
            .select()
            .single();

          if (!rule.error) {
            promotionalRules.push(rule.data);
            
            // Apply promotional pricing
            const { data: product } = await supabase
              .from('products')
              .select('price')
              .eq('id', product_id)
              .single();

            if (product) {
              const discountedPrice = product.price * (1 - promotion_config.discount_percentage / 100);
              await supabase
                .from('products')
                .update({ 
                  price: discountedPrice,
                  compare_price: product.price
                })
                .eq('id', product_id);
            }
          }
        }

        return new Response(JSON.stringify({ 
          promotional_rules: promotionalRules,
          status: 'applied'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'competitive-pricing':
        const { vendor_id: compVendorId, competitor_data } = data;
        
        // Get vendor's products
        const { data: vendorProducts } = await supabase
          .from('products')
          .select('id, name, price, sku')
          .eq('vendor_id', compVendorId);

        const competitivePrices = [];
        for (const product of vendorProducts || []) {
          // Find competitor price for similar product
          const competitorPrice = findCompetitorPrice(product, competitor_data);
          
          if (competitorPrice) {
            const adjustedPrice = competitorPrice * 0.95; // 5% below competitor
            
            await supabase
              .from('products')
              .update({ price: adjustedPrice })
              .eq('id', product.id);

            competitivePrices.push({
              product_id: product.id,
              original_price: product.price,
              competitor_price: competitorPrice,
              adjusted_price: adjustedPrice
            });
          }
        }

        return new Response(JSON.stringify({ 
          competitive_adjustments: competitivePrices,
          strategy: 'undercut_by_5_percent'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'seasonal-pricing':
        const { season_config, category_adjustments } = data;
        
        // Apply seasonal pricing by category
        const seasonalUpdates = [];
        for (const adjustment of category_adjustments) {
          const { data: products } = await supabase
            .from('products')
            .select('id, price, category_id')
            .eq('category_id', adjustment.category_id);

          for (const product of products || []) {
            const seasonalPrice = product.price * (1 + adjustment.percentage_change / 100);
            
            await supabase
              .from('products')
              .update({ price: seasonalPrice })
              .eq('id', product.id);

            // Create seasonal pricing rule
            await supabase
              .from('price_management_rules')
              .insert({
                product_id: product.id,
                vendor_id: adjustment.vendor_id,
                rule_type: 'seasonal',
                rule_config: season_config,
                current_price: seasonalPrice,
                effective_dates: season_config.dates
              });

            seasonalUpdates.push({
              product_id: product.id,
              original_price: product.price,
              seasonal_price: seasonalPrice,
              adjustment: adjustment.percentage_change
            });
          }
        }

        return new Response(JSON.stringify({ 
          seasonal_updates: seasonalUpdates,
          season: season_config.season
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'bulk-pricing':
        const { vendor_id: bulkVendorId, pricing_strategy } = data;
        
        // Apply bulk pricing strategy to all vendor products
        const { data: allProducts } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', bulkVendorId);

        const bulkUpdates = [];
        for (const product of allProducts || []) {
          let newPrice = product.price;
          
          switch (pricing_strategy.type) {
            case 'margin_based':
              newPrice = product.cost_price * (1 + pricing_strategy.margin_percentage / 100);
              break;
            case 'category_markup':
              const categoryMarkup = pricing_strategy.category_markups[product.category_id] || 20;
              newPrice = product.cost_price * (1 + categoryMarkup / 100);
              break;
            case 'flat_increase':
              newPrice = product.price * (1 + pricing_strategy.percentage / 100);
              break;
          }

          await supabase
            .from('products')
            .update({ price: newPrice })
            .eq('id', product.id);

          bulkUpdates.push({
            product_id: product.id,
            old_price: product.price,
            new_price: newPrice,
            change_percentage: ((newPrice - product.price) / product.price * 100).toFixed(2)
          });
        }

        return new Response(JSON.stringify({ 
          bulk_updates: bulkUpdates,
          strategy: pricing_strategy.type
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'price-analytics':
        const { vendor_id: analyticsVendorId, date_range = 30 } = data;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - date_range);

        const { data: priceRules } = await supabase
          .from('price_management_rules')
          .select(`
            *,
            products(name, price, category_id)
          `)
          .eq('vendor_id', analyticsVendorId)
          .gte('created_at', startDate.toISOString());

        const analytics = {
          total_rules: priceRules?.length || 0,
          active_rules: priceRules?.filter(r => r.is_active).length || 0,
          rule_types: {},
          avg_price_change: 0,
          revenue_impact: 0
        };

        // Calculate rule type distribution
        priceRules?.forEach(rule => {
          analytics.rule_types[rule.rule_type] = (analytics.rule_types[rule.rule_type] || 0) + 1;
        });

        return new Response(JSON.stringify({ data: analytics }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Price Management Service error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      service: 'price-management-service'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions
async function calculatePrice(rule: any, config: any): Promise<number> {
  const basePrice = config.base_price || rule.current_price || 0;
  
  switch (rule.pricing_algorithm) {
    case 'dynamic':
      return basePrice * (1 + (config.demand_factor || 0) * 0.1);
    case 'percentage_discount':
      return basePrice * (1 - (config.discount_percentage || 0) / 100);
    case 'competitive':
      return config.competitor_price * (config.undercut_factor || 0.95);
    default:
      return basePrice;
  }
}

async function calculateDynamicPrice(rule: any, factors: any): Promise<number> {
  const basePrice = rule.current_price;
  let adjustment = 1;
  
  // Demand factor
  if (factors.demand_level) {
    switch (factors.demand_level) {
      case 'high':
        adjustment *= 1.1;
        break;
      case 'low':
        adjustment *= 0.9;
        break;
    }
  }
  
  // Inventory factor
  if (factors.stock_level) {
    if (factors.stock_level < 10) {
      adjustment *= 1.05; // Increase price for low stock
    }
  }
  
  // Time factor
  if (factors.time_of_day) {
    if (factors.time_of_day === 'peak') {
      adjustment *= 1.02;
    }
  }
  
  const newPrice = basePrice * adjustment;
  
  // Ensure price stays within bounds
  return Math.max(
    rule.minimum_price || 0,
    Math.min(rule.maximum_price || newPrice, newPrice)
  );
}

function findCompetitorPrice(product: any, competitorData: any[]): number | null {
  // Simple matching by product name similarity
  for (const competitor of competitorData) {
    if (competitor.name.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])) {
      return competitor.price;
    }
  }
  return null;
}