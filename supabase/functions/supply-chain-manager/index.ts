import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Supplier {
  supplier_name: string;
  supplier_code: string;
  contact_info: any;
  address: any;
  business_details?: any;
  payment_terms?: any;
  certifications?: any[];
}

interface PurchaseOrder {
  po_number: string;
  supplier_id: string;
  vendor_id: string;
  warehouse_id: string;
  order_items: any[];
  subtotal: number;
  tax_amount?: number;
  shipping_cost?: number;
  total_amount: number;
  expected_delivery?: string;
  terms_conditions?: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      supabaseClient.auth.setSession({
        access_token: authHeader.replace('Bearer ', ''),
        refresh_token: '',
      });
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Supplier Management
    if (path === '/supply-chain-manager/suppliers' && method === 'GET') {
      const status = url.searchParams.get('status') || 'active';
      const search = url.searchParams.get('search');
      
      let query = supabaseClient
        .from('suppliers')
        .select('*')
        .eq('status', status);

      if (search) {
        query = query.or(`supplier_name.ilike.%${search}%,supplier_code.ilike.%${search}%`);
      }

      const { data: suppliers, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ suppliers }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/supply-chain-manager/suppliers' && method === 'POST') {
      const supplierData: Supplier = await req.json();
      
      const { data: supplier, error } = await supabaseClient
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        supplier,
        message: 'Supplier created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supplier Performance Analytics
    if (path.includes('/suppliers/') && path.includes('/performance') && method === 'GET') {
      const supplierId = path.split('/')[3];
      
      // Get purchase orders for this supplier
      const { data: purchaseOrders, error: poError } = await supabaseClient
        .from('purchase_orders')
        .select('*')
        .eq('supplier_id', supplierId)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      if (poError) throw poError;

      // Calculate performance metrics
      const totalOrders = purchaseOrders.length;
      const completedOrders = purchaseOrders.filter(po => po.status === 'received').length;
      const onTimeDeliveries = purchaseOrders.filter(po => 
        po.status === 'received' && 
        po.expected_delivery && 
        new Date(po.updated_at) <= new Date(po.expected_delivery)
      ).length;

      const totalValue = purchaseOrders.reduce((sum, po) => sum + po.total_amount, 0);
      const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

      const performance = {
        total_orders: totalOrders,
        completion_rate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
        on_time_delivery_rate: completedOrders > 0 ? (onTimeDeliveries / completedOrders) * 100 : 0,
        total_order_value: totalValue,
        average_order_value: averageOrderValue,
        performance_score: calculateSupplierScore(purchaseOrders),
        last_90_days: {
          orders: totalOrders,
          value: totalValue
        }
      };

      return new Response(JSON.stringify({ performance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Purchase Order Management
    if (path === '/supply-chain-manager/purchase-orders' && method === 'GET') {
      const status = url.searchParams.get('status');
      const vendorId = url.searchParams.get('vendor_id');
      const supplierId = url.searchParams.get('supplier_id');
      
      let query = supabaseClient
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(supplier_name, contact_info),
          warehouse:warehouse_locations(warehouse_name, address)
        `);

      if (status) query = query.eq('status', status);
      if (vendorId) query = query.eq('vendor_id', vendorId);
      if (supplierId) query = query.eq('supplier_id', supplierId);

      const { data: purchaseOrders, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ purchase_orders: purchaseOrders }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/supply-chain-manager/purchase-orders' && method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const poData: PurchaseOrder = await req.json();
      
      // Generate PO number if not provided
      if (!poData.po_number) {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 15);
        poData.po_number = `PO-${timestamp}`;
      }

      const { data: purchaseOrder, error } = await supabaseClient
        .from('purchase_orders')
        .insert([{
          ...poData,
          created_by: user.id
        }])
        .select(`
          *,
          supplier:suppliers(supplier_name, contact_info),
          warehouse:warehouse_locations(warehouse_name, address)
        `)
        .single();

      if (error) throw error;

      // Send notification to supplier
      await sendPurchaseOrderNotification(purchaseOrder, supabaseClient);

      return new Response(JSON.stringify({ 
        purchase_order: purchaseOrder,
        message: 'Purchase order created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update PO Status
    if (path.includes('/purchase-orders/') && path.includes('/status') && method === 'PUT') {
      const poId = path.split('/')[3];
      const { status, notes } = await req.json();
      
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const updateData: any = { status };
      if (notes) updateData.notes = notes;

      if (status === 'received') {
        // Create inventory movements for received items
        const { data: po } = await supabaseClient
          .from('purchase_orders')
          .select('*')
          .eq('id', poId)
          .single();

        if (po && po.order_items) {
          for (const item of po.order_items) {
            await supabaseClient
              .from('inventory_movements')
              .insert([{
                product_id: item.product_id,
                warehouse_id: po.warehouse_id,
                movement_type: 'inbound',
                quantity: item.quantity,
                unit_cost: item.unit_price,
                reference_id: poId,
                reference_type: 'purchase_order',
                reason: 'Purchase order received',
                created_by: user.id
              }]);
          }
        }
      }

      const { data: purchaseOrder, error } = await supabaseClient
        .from('purchase_orders')
        .update(updateData)
        .eq('id', poId)
        .select(`
          *,
          supplier:suppliers(supplier_name, contact_info),
          warehouse:warehouse_locations(warehouse_name, address)
        `)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        purchase_order: purchaseOrder,
        message: `Purchase order ${status} successfully`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Inventory Optimization Suggestions
    if (path === '/supply-chain-manager/inventory-optimization' && method === 'POST') {
      const { vendor_id, analysis_period = '30d' } = await req.json();
      
      // Get low stock products
      const { data: lowStockProducts, error: stockError } = await supabaseClient
        .from('product_inventory')
        .select(`
          *,
          product:products(name, vendor_id, category)
        `)
        .lte('current_stock', 20)
        .eq('products.vendor_id', vendor_id);

      if (stockError) throw stockError;

      // Get recent sales data
      const { data: salesData, error: salesError } = await supabaseClient
        .from('order_items')
        .select('product_id, quantity, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (salesError) throw salesError;

      // Calculate reorder suggestions
      const suggestions = await generateReorderSuggestions(lowStockProducts, salesData);

      return new Response(JSON.stringify({ 
        optimization_suggestions: suggestions,
        analysis_date: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supplier Discovery and Recommendations
    if (path === '/supply-chain-manager/supplier-recommendations' && method === 'POST') {
      const { product_category, location_preference, budget_range } = await req.json();
      
      // Get suppliers based on criteria
      let query = supabaseClient
        .from('suppliers')
        .select('*')
        .eq('status', 'active');

      if (location_preference) {
        query = query.contains('address', { country: location_preference });
      }

      const { data: suppliers, error } = await query;
      if (error) throw error;

      // Score and rank suppliers
      const rankedSuppliers = suppliers.map(supplier => ({
        ...supplier,
        score: calculateSupplierCompatibilityScore(supplier, { product_category, location_preference, budget_range }),
        reasons: generateRecommendationReasons(supplier, { product_category, location_preference, budget_range })
      })).sort((a, b) => b.score - a.score);

      return new Response(JSON.stringify({ 
        recommended_suppliers: rankedSuppliers.slice(0, 10),
        search_criteria: { product_category, location_preference, budget_range }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supply Chain Analytics Dashboard
    if (path === '/supply-chain-manager/dashboard' && method === 'GET') {
      const vendorId = url.searchParams.get('vendor_id');
      
      // Get key metrics
      const [
        { data: activeSuppliers },
        { data: pendingOrders },
        { data: recentDeliveries },
        { data: lowStockItems }
      ] = await Promise.all([
        supabaseClient.from('suppliers').select('id').eq('status', 'active'),
        supabaseClient.from('purchase_orders').select('id, total_amount').in('status', ['sent', 'acknowledged', 'shipped']),
        supabaseClient.from('purchase_orders').select('id, status, expected_delivery').eq('status', 'received').gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabaseClient.from('product_inventory').select('id, current_stock, minimum_stock_level').lte('current_stock', 20)
      ]);

      const dashboard = {
        key_metrics: {
          active_suppliers: activeSuppliers?.length || 0,
          pending_orders: pendingOrders?.length || 0,
          pending_order_value: pendingOrders?.reduce((sum, po) => sum + po.total_amount, 0) || 0,
          recent_deliveries: recentDeliveries?.length || 0,
          low_stock_alerts: lowStockItems?.length || 0
        },
        alerts: [
          ...(lowStockItems?.slice(0, 5).map(item => ({
            type: 'low_stock',
            message: `Product inventory below minimum level`,
            severity: 'high',
            product_id: item.id
          })) || [])
        ],
        recent_activity: recentDeliveries?.slice(0, 10) || []
      };

      return new Response(JSON.stringify({ dashboard }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Supply Chain Manager Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateSupplierScore(purchaseOrders: any[]) {
  if (purchaseOrders.length === 0) return 0;

  const completedOrders = purchaseOrders.filter(po => po.status === 'received').length;
  const completionRate = completedOrders / purchaseOrders.length;

  const onTimeDeliveries = purchaseOrders.filter(po => 
    po.status === 'received' && 
    po.expected_delivery && 
    new Date(po.updated_at) <= new Date(po.expected_delivery)
  ).length;
  const onTimeRate = completedOrders > 0 ? onTimeDeliveries / completedOrders : 0;

  // Quality score (mock - would integrate with quality control data)
  const qualityScore = 0.95;

  // Weighted score
  return Math.round((completionRate * 0.4 + onTimeRate * 0.4 + qualityScore * 0.2) * 100);
}

async function sendPurchaseOrderNotification(purchaseOrder: any, supabaseClient: any) {
  // Mock notification - would integrate with email/SMS service
  console.log(`Sending PO notification for ${purchaseOrder.po_number} to supplier ${purchaseOrder.supplier.supplier_name}`);
}

async function generateReorderSuggestions(lowStockProducts: any[], salesData: any[]) {
  return lowStockProducts.map(product => {
    const productSales = salesData.filter(sale => sale.product_id === product.product_id);
    const totalSold = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageDailySales = totalSold / 30;
    
    const suggestedReorderQuantity = Math.max(
      product.minimum_stock_level * 2, // Safety stock
      averageDailySales * 14 // 2 weeks supply
    );

    return {
      product_id: product.product_id,
      product_name: product.product?.name,
      current_stock: product.current_stock,
      minimum_stock_level: product.minimum_stock_level,
      suggested_reorder_quantity: Math.ceil(suggestedReorderQuantity),
      urgency: product.current_stock <= 5 ? 'critical' : product.current_stock <= 15 ? 'high' : 'medium',
      estimated_days_remaining: averageDailySales > 0 ? Math.floor(product.current_stock / averageDailySales) : null
    };
  });
}

function calculateSupplierCompatibilityScore(supplier: any, criteria: any) {
  let score = 50; // Base score

  // Location compatibility
  if (criteria.location_preference && supplier.address?.country === criteria.location_preference) {
    score += 20;
  }

  // Quality ratings
  if (supplier.quality_rating) {
    score += supplier.quality_rating * 5; // Max 25 points
  }

  // Delivery rating
  if (supplier.delivery_rating) {
    score += supplier.delivery_rating * 3; // Max 15 points
  }

  // Certifications
  if (supplier.certifications && supplier.certifications.length > 0) {
    score += Math.min(supplier.certifications.length * 2, 10); // Max 10 points
  }

  return Math.min(score, 100);
}

function generateRecommendationReasons(supplier: any, criteria: any) {
  const reasons = [];

  if (supplier.quality_rating >= 4) {
    reasons.push('High quality rating');
  }

  if (supplier.delivery_rating >= 4) {
    reasons.push('Excellent delivery performance');
  }

  if (criteria.location_preference && supplier.address?.country === criteria.location_preference) {
    reasons.push('Local supplier - reduced shipping costs');
  }

  if (supplier.certifications && supplier.certifications.length > 0) {
    reasons.push(`${supplier.certifications.length} quality certifications`);
  }

  return reasons;
}