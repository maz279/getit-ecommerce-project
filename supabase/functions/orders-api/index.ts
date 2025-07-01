import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

interface CreateOrderData {
  customer_id: string;
  items: OrderItem[];
  shipping_address: any;
  billing_address?: any;
  payment_method: 'cash_on_delivery' | 'online_payment' | 'mobile_banking';
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const method = req.method;

    console.log(`Orders API - ${method} ${path}`);

    // GET /orders-api - List orders with filters
    if (method === 'GET' && !path) {
      const customer_id = url.searchParams.get('customer_id');
      const status = url.searchParams.get('status');
      const vendor_id = url.searchParams.get('vendor_id');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items!inner(
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            products!inner(
              id,
              name,
              images,
              vendor_id,
              vendors!inner(id, business_name)
            )
          )
        `);

      if (customer_id) {
        query = query.eq('customer_id', customer_id);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (vendor_id) {
        query = query.eq('order_items.products.vendor_id', vendor_id);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching orders:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /orders-api/{id} - Get single order
    if (method === 'GET' && path) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items!inner(
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            products!inner(
              id,
              name,
              images,
              sku,
              vendor_id,
              vendors!inner(id, business_name, logo)
            )
          )
        `)
        .eq('id', path)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return new Response(JSON.stringify({ error: 'Order not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /orders-api - Create new order
    if (method === 'POST') {
      const orderData: CreateOrderData = await req.json();

      // Validate required fields
      if (!orderData.customer_id || !orderData.items || orderData.items.length === 0) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Calculate total amount
      let totalAmount = 0;
      for (const item of orderData.items) {
        totalAmount += item.unit_price * item.quantity;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_id: orderData.customer_id,
          status: 'pending',
          payment_status: 'pending',
          payment_method: orderData.payment_method,
          total_amount: totalAmount,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
          notes: orderData.notes,
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return new Response(JSON.stringify({ error: orderError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order creation
        await supabase.from('orders').delete().eq('id', order.id);
        return new Response(JSON.stringify({ error: itemsError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update product stock
      for (const item of orderData.items) {
        await supabase.rpc('update_product_stock', {
          product_id: item.product_id,
          quantity_sold: item.quantity
        });
      }

      console.log('Order created successfully:', order.id);
      return new Response(JSON.stringify({ data: order }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /orders-api/{id}/status - Update order status
    if (method === 'PUT' && path && url.pathname.includes('/status')) {
      const { status, payment_status } = await req.json();

      const updates: any = {};
      if (status) updates.status = status;
      if (payment_status) updates.payment_status = payment_status;

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', path.replace('/status', ''))
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Order status updated successfully:', path);
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Orders API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});