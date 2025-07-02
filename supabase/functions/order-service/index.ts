import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_id: string;
  variant_sku?: string;
  quantity: number;
  unit_price: number;
}

interface CreateOrderRequest {
  vendor_id: string;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  customer_notes?: string;
  order_type?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean).slice(-1)[0];
    const method = req.method;

    // Health Check
    if (path === "health") {
      return new Response(
        JSON.stringify({ 
          status: "healthy", 
          service: "order-service", 
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const correlationId = crypto.randomUUID();
    console.log(`Order Service Request: ${method} ${path} - Correlation: ${correlationId}`);

    if (path === "orders") {
      if (method === "GET") {
        const searchParams = url.searchParams;
        const status = searchParams.get("status");
        const vendor_id = searchParams.get("vendor_id");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const offset = (page - 1) * limit;

        let query = supabase
          .from("order_service_orders")
          .select(`
            *,
            order_service_items (*)
          `, { count: "exact" });

        // Filter by customer or vendor
        const isVendor = vendor_id === user.id;
        if (isVendor) {
          query = query.eq("vendor_id", user.id);
        } else {
          query = query.eq("customer_id", user.id);
        }

        if (status) {
          query = query.eq("status", status);
        }

        const { data: orders, error, count } = await query
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: orders,
            pagination: {
              page,
              limit,
              total: count || 0,
              total_pages: Math.ceil((count || 0) / limit)
            },
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (method === "POST") {
        const orderData: CreateOrderRequest = await req.json();
        
        // Validate required fields
        if (!orderData.vendor_id || !orderData.items || orderData.items.length === 0) {
          throw new Error("Missing required fields: vendor_id, items");
        }

        if (!orderData.shipping_address || !orderData.billing_address) {
          throw new Error("Missing required fields: shipping_address, billing_address");
        }

        // Calculate totals
        let subtotal = 0;
        const validatedItems = [];

        for (const item of orderData.items) {
          // Verify product exists and get current price
          const { data: product, error: productError } = await supabase
            .from("product_service_catalog")
            .select(`
              id, name, vendor_id,
              product_service_inventory (selling_price, available_quantity)
            `)
            .eq("id", item.product_id)
            .eq("vendor_id", orderData.vendor_id)
            .eq("status", "active")
            .single();

          if (productError || !product) {
            throw new Error(`Product ${item.product_id} not found or not available`);
          }

          const inventory = product.product_service_inventory[0];
          if (!inventory || inventory.available_quantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}`);
          }

          const itemTotal = inventory.selling_price * item.quantity;
          subtotal += itemTotal;

          validatedItems.push({
            product_id: item.product_id,
            variant_sku: item.variant_sku,
            product_name: product.name,
            quantity: item.quantity,
            unit_price: inventory.selling_price,
            total_price: itemTotal,
            vendor_id: orderData.vendor_id
          });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const { data: order, error: orderError } = await supabase
          .from("order_service_orders")
          .insert({
            order_number: orderNumber,
            customer_id: user.id,
            vendor_id: orderData.vendor_id,
            order_type: orderData.order_type || "regular",
            subtotal,
            tax_amount: 0, // TODO: Calculate tax
            shipping_amount: 0, // TODO: Calculate shipping
            discount_amount: 0,
            total_amount: subtotal,
            shipping_address: orderData.shipping_address,
            billing_address: orderData.billing_address,
            customer_notes: orderData.customer_notes
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = validatedItems.map(item => ({
          ...item,
          order_id: order.id
        }));

        const { error: itemsError } = await supabase
          .from("order_service_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Reserve inventory
        for (const item of orderData.items) {
          await supabase
            .from("product_service_inventory")
            .update({ 
              reserved_quantity: supabase.sql`reserved_quantity + ${item.quantity}` 
            })
            .eq("product_id", item.product_id);
        }

        // Get complete order with items
        const { data: completeOrder, error: fetchError } = await supabase
          .from("order_service_orders")
          .select(`
            *,
            order_service_items (*)
          `)
          .eq("id", order.id)
          .single();

        if (fetchError) throw fetchError;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: completeOrder,
            correlation_id: correlationId 
          }),
          { 
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    if (path === "update-status") {
      if (method === "PUT") {
        const { order_id, status, vendor_notes } = await req.json();
        
        if (!order_id || !status) {
          throw new Error("Missing required fields: order_id, status");
        }

        // Verify order ownership (vendor can update their orders)
        const { data: order, error: orderError } = await supabase
          .from("order_service_orders")
          .select("vendor_id, customer_id, status")
          .eq("id", order_id)
          .single();

        if (orderError || (!order.vendor_id === user.id && !order.customer_id === user.id)) {
          throw new Error("Order not found or access denied");
        }

        // Validate status transition
        const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
        if (!validStatuses.includes(status)) {
          throw new Error("Invalid status");
        }

        const updateData: any = { status };
        if (vendor_notes) updateData.vendor_notes = vendor_notes;

        const { data: updatedOrder, error } = await supabase
          .from("order_service_orders")
          .update(updateData)
          .eq("id", order_id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: updatedOrder,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "analytics") {
      if (method === "GET") {
        // Order analytics for vendors
        const { data: analytics, error } = await supabase
          .from("order_service_orders")
          .select("status, total_amount, created_at")
          .eq("vendor_id", user.id);

        if (error) throw error;

        const stats = {
          total_orders: analytics.length,
          total_revenue: analytics.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
          status_breakdown: analytics.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          monthly_revenue: analytics
            .filter(order => new Date(order.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
        };

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: stats,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Order Service Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        service: "order-service" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});