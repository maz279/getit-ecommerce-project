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
    console.log(`Inventory Management Enhanced - Endpoint: ${endpoint}`);

    switch (endpoint) {
      case 'health':
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          service: 'inventory-management-enhanced',
          features: ['automation', 'forecasting', 'multi-warehouse', 'low-stock-alerts', 'reorder-optimization']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Inventory Overview
      case 'inventory/overview':
        const { vendor_id } = data;
        
        const { data: inventoryData, error: invError } = await supabase
          .from('product_inventory')
          .select(`
            *,
            products!inner(name, sku, vendor_id),
            inventory_automation_rules(*)
          `)
          .eq('products.vendor_id', vendor_id);

        if (invError) throw invError;

        // Calculate inventory metrics
        const metrics = inventoryData?.reduce((acc: any, item: any) => {
          acc.total_products += 1;
          acc.total_stock_value += (item.current_stock || 0) * (item.cost_price || 0);
          acc.low_stock_items += (item.current_stock || 0) <= (item.low_stock_threshold || 5) ? 1 : 0;
          acc.out_of_stock_items += (item.current_stock || 0) === 0 ? 1 : 0;
          acc.total_units += item.current_stock || 0;
          return acc;
        }, {
          total_products: 0,
          total_stock_value: 0,
          low_stock_items: 0,
          out_of_stock_items: 0,
          total_units: 0
        });

        return new Response(JSON.stringify({ 
          data: inventoryData, 
          metrics,
          error: invError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Low Stock Alerts
      case 'inventory/low-stock':
        const { vendor_id: vendorId, threshold_multiplier = 1 } = data;
        
        const { data: lowStockItems, error: lowStockError } = await supabase
          .from('product_inventory')
          .select(`
            *,
            products!inner(name, sku, vendor_id, price),
            inventory_automation_rules(reorder_point, reorder_quantity)
          `)
          .eq('products.vendor_id', vendorId)
          .filter('current_stock', 'lte', `low_stock_threshold * ${threshold_multiplier}`);

        return new Response(JSON.stringify({ data: lowStockItems, error: lowStockError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Automated Reorder Suggestions
      case 'inventory/reorder-suggestions':
        const { vendor_id: reorderVendorId } = data;
        
        const { data: reorderSuggestions, error: reorderError } = await supabase
          .from('inventory_automation_rules')
          .select(`
            *,
            products!inner(name, sku, vendor_id, price),
            product_inventory!inner(current_stock, low_stock_threshold)
          `)
          .eq('products.vendor_id', reorderVendorId)
          .eq('auto_reorder_enabled', true)
          .filter('product_inventory.current_stock', 'lte', 'reorder_point');

        // Enhance with forecasting data
        const enhancedSuggestions = reorderSuggestions?.map((item: any) => {
          const dailyDemand = item.demand_forecast?.daily_avg || 1;
          const leadTime = item.lead_time_days || 7;
          const safetyStock = item.safety_stock || 0;
          
          const suggestedOrderQty = Math.max(
            item.reorder_quantity,
            (dailyDemand * leadTime) + safetyStock - item.product_inventory.current_stock
          );

          return {
            ...item,
            suggested_order_quantity: Math.ceil(suggestedOrderQty),
            estimated_cost: suggestedOrderQty * (item.supplier_info?.unit_cost || item.products.price * 0.7),
            urgency_score: item.product_inventory.current_stock <= 0 ? 10 : 
                          item.product_inventory.current_stock <= item.safety_stock ? 8 :
                          item.product_inventory.current_stock <= item.reorder_point * 0.5 ? 6 : 4
          };
        });

        return new Response(JSON.stringify({ 
          data: enhancedSuggestions, 
          error: reorderError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Create/Update Automation Rules
      case 'inventory/automation/create-rule':
        const ruleData = {
          ...data.rule,
          next_predicted_reorder: calculateNextReorderDate(data.rule)
        };

        const { data: newRule, error: ruleError } = await supabase
          .from('inventory_automation_rules')
          .insert(ruleData)
          .select()
          .single();

        return new Response(JSON.stringify({ data: newRule, error: ruleError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'inventory/automation/update-rule':
        const { rule_id, updates } = data;
        
        const updatedRule = {
          ...updates,
          next_predicted_reorder: calculateNextReorderDate(updates),
          updated_at: new Date().toISOString()
        };

        const { data: updated, error: updateError } = await supabase
          .from('inventory_automation_rules')
          .update(updatedRule)
          .eq('id', rule_id)
          .select()
          .single();

        return new Response(JSON.stringify({ data: updated, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Demand Forecasting
      case 'inventory/forecast-demand':
        const { product_id, days_ahead = 30 } = data;
        
        // Simple demand forecasting based on historical sales
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90); // Use 90 days of history

        const { data: salesHistory, error: salesError } = await supabase
          .from('order_items')
          .select('quantity, created_at')
          .eq('product_id', product_id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (salesError) throw salesError;

        // Calculate basic forecast metrics
        const totalQuantity = salesHistory?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        const daysCovered = 90;
        const dailyAverage = totalQuantity / daysCovered;
        
        // Simple seasonal adjustment (would use ML in production)
        const currentMonth = new Date().getMonth();
        const seasonalMultiplier = getSeasonalMultiplier(currentMonth);
        
        const forecastData = {
          historical_daily_average: dailyAverage,
          seasonal_adjusted_daily: dailyAverage * seasonalMultiplier,
          forecast_period_days: days_ahead,
          predicted_demand: Math.ceil(dailyAverage * seasonalMultiplier * days_ahead),
          confidence_level: salesHistory?.length > 10 ? 0.8 : 0.5,
          recommendations: {
            reorder_point: Math.ceil(dailyAverage * 14), // 2 weeks worth
            safety_stock: Math.ceil(dailyAverage * 7), // 1 week worth
            max_stock: Math.ceil(dailyAverage * 60) // 2 months worth
          }
        };

        return new Response(JSON.stringify({ data: forecastData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Stock Movements
      case 'inventory/movements':
        const { product_id: movementProductId, days = 30 } = data;
        
        const movementStartDate = new Date();
        movementStartDate.setDate(movementStartDate.getDate() - days);

        // Get inventory movements (would typically be in a separate movements table)
        const { data: movements, error: movementError } = await supabase
          .from('audit_logs')
          .select('*')
          .eq('resource_type', 'product_inventory')
          .like('metadata->>product_id', product_id || '%')
          .gte('created_at', movementStartDate.toISOString())
          .order('created_at', { ascending: false });

        return new Response(JSON.stringify({ data: movements, error: movementError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Bulk Stock Update
      case 'inventory/bulk-update':
        const { updates: stockUpdates } = data;
        
        const results = [];
        for (const update of stockUpdates) {
          const { data: updated, error } = await supabase
            .from('product_inventory')
            .update({
              current_stock: update.new_stock,
              last_updated: new Date().toISOString()
            })
            .eq('product_id', update.product_id)
            .select()
            .single();

          results.push({ product_id: update.product_id, success: !error, error, data: updated });
        }

        return new Response(JSON.stringify({ results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Warehouse Management
      case 'inventory/warehouses':
        // Simple warehouse simulation (would be separate table in production)
        const warehouses = [
          {
            id: 'dhaka-001',
            name: 'Dhaka Main Warehouse',
            location: 'Tejgaon, Dhaka',
            capacity: 10000,
            current_utilization: 7500
          },
          {
            id: 'chittagong-001', 
            name: 'Chittagong Port Warehouse',
            location: 'Port Area, Chittagong',
            capacity: 5000,
            current_utilization: 3200
          },
          {
            id: 'sylhet-001',
            name: 'Sylhet Regional Hub',
            location: 'Zindabazar, Sylhet',
            capacity: 2000,
            current_utilization: 1100
          }
        ];

        return new Response(JSON.stringify({ data: warehouses }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      // Analytics & Reports
      case 'inventory/analytics':
        const { vendor_id: analyticsVendorId, period = 'monthly' } = data;
        
        const { data: inventoryAnalytics, error: analyticsError } = await supabase
          .from('product_analytics_enhanced')
          .select('*')
          .eq('vendor_id', analyticsVendorId)
          .eq('analytics_period', period)
          .order('analytics_date', { ascending: false })
          .limit(12);

        // Calculate inventory turnover and other KPIs
        const analytics = inventoryAnalytics?.map((item: any) => ({
          ...item,
          inventory_turnover: item.revenue_generated / Math.max(item.views_count * 10, 1), // Simplified calculation
          stock_efficiency: (item.purchase_count / Math.max(item.views_count, 1)) * 100
        }));

        return new Response(JSON.stringify({ data: analytics, error: analyticsError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Inventory Management Enhanced error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      service: 'inventory-management-enhanced'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper Functions
function calculateNextReorderDate(rule: any): string {
  const today = new Date();
  const dailyDemand = rule.demand_forecast?.daily_avg || 1;
  const currentStock = rule.current_stock || 0;
  const reorderPoint = rule.reorder_point || 10;
  
  const daysUntilReorder = Math.max(0, Math.floor((currentStock - reorderPoint) / dailyDemand));
  
  const reorderDate = new Date();
  reorderDate.setDate(today.getDate() + daysUntilReorder);
  
  return reorderDate.toISOString().split('T')[0];
}

function getSeasonalMultiplier(month: number): number {
  // Bangladesh seasonal patterns
  const seasonalFactors = {
    0: 1.1,  // January - Winter sales
    1: 1.0,  // February
    2: 1.2,  // March - Spring
    3: 1.3,  // April - Pohela Boishakh
    4: 1.1,  // May
    5: 0.9,  // June - Monsoon
    6: 0.8,  // July - Heavy monsoon
    7: 0.9,  // August
    8: 1.1,  // September - Post monsoon
    9: 1.4,  // October - Durga Puja
    10: 1.2, // November - Wedding season
    11: 1.1  // December - Winter
  };
  
  return seasonalFactors[month as keyof typeof seasonalFactors] || 1.0;
}