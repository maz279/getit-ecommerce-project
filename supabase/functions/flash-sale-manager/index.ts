import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlashSaleRequest {
  action: 'create_sale' | 'get_active_sales' | 'update_sale_status' | 'get_sale_countdown';
  saleData?: any;
  saleId?: string;
  status?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { action, saleData, saleId, status }: FlashSaleRequest = await req.json();

    switch (action) {
      case 'create_sale':
        return await createFlashSale(supabaseClient, saleData);
      
      case 'get_active_sales':
        return await getActiveSales(supabaseClient);
      
      case 'update_sale_status':
        return await updateSaleStatus(supabaseClient, saleId!, status!);
      
      case 'get_sale_countdown':
        return await getSaleCountdown(supabaseClient, saleId!);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Flash Sale Manager Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createFlashSale(supabaseClient: any, saleData: any) {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  // Create flash sale
  const { data: flashSale, error: saleError } = await supabaseClient
    .from('flash_sales')
    .insert({
      ...saleData,
      created_by: user.id,
      status: 'scheduled'
    })
    .select()
    .single();

  if (saleError) throw saleError;

  // Add products to flash sale
  if (saleData.products && saleData.products.length > 0) {
    const flashSaleProducts = saleData.products.map((product: any) => ({
      flash_sale_id: flashSale.id,
      product_id: product.product_id,
      original_price: product.original_price,
      sale_price: product.sale_price,
      quantity_limit: product.quantity_limit
    }));

    const { error: productsError } = await supabaseClient
      .from('flash_sale_products')
      .insert(flashSaleProducts);

    if (productsError) throw productsError;
  }

  // Schedule activation if start time is in the future
  await scheduleFlashSaleActivation(supabaseClient, flashSale);

  return new Response(
    JSON.stringify({ success: true, flashSale }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getActiveSales(supabaseClient: any) {
  const now = new Date().toISOString();
  
  const { data: activeSales, error } = await supabaseClient
    .from('flash_sales')
    .select(`
      *,
      flash_sale_products (
        *,
        products (
          id,
          name,
          image_url,
          description
        )
      )
    `)
    .eq('status', 'active')
    .lte('start_time', now)
    .gte('end_time', now);

  if (error) throw error;

  // Calculate time remaining for each sale
  const salesWithCountdown = activeSales.map(sale => ({
    ...sale,
    timeRemaining: calculateTimeRemaining(sale.end_time),
    isExpiringSoon: isExpiringSoon(sale.end_time)
  }));

  return new Response(
    JSON.stringify({ success: true, activeSales: salesWithCountdown }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function updateSaleStatus(supabaseClient: any, saleId: string, status: string) {
  const { data: updatedSale, error } = await supabaseClient
    .from('flash_sales')
    .update({ status })
    .eq('id', saleId)
    .select()
    .single();

  if (error) throw error;

  // If activating sale, send notifications
  if (status === 'active') {
    await sendFlashSaleNotifications(supabaseClient, updatedSale);
  }

  return new Response(
    JSON.stringify({ success: true, sale: updatedSale }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getSaleCountdown(supabaseClient: any, saleId: string) {
  const { data: sale, error } = await supabaseClient
    .from('flash_sales')
    .select('*')
    .eq('id', saleId)
    .single();

  if (error) throw error;

  const timeRemaining = calculateTimeRemaining(sale.end_time);
  const progress = calculateProgress(sale.start_time, sale.end_time);

  return new Response(
    JSON.stringify({ 
      success: true, 
      timeRemaining,
      progress,
      isActive: sale.status === 'active',
      hasStarted: new Date(sale.start_time) <= new Date(),
      hasEnded: new Date(sale.end_time) <= new Date()
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function scheduleFlashSaleActivation(supabaseClient: any, flashSale: any) {
  const startTime = new Date(flashSale.start_time);
  const now = new Date();
  
  if (startTime > now) {
    // In a production environment, you would use a job queue or cron job
    // For this demo, we'll just log the scheduling
    console.log(`Flash sale ${flashSale.id} scheduled to start at ${startTime}`);
  } else {
    // Start immediately if the time has passed
    await updateSaleStatus(supabaseClient, flashSale.id, 'active');
  }
}

async function sendFlashSaleNotifications(supabaseClient: any, flashSale: any) {
  // Get users who have opted in for flash sale notifications
  const { data: subscribers, error } = await supabaseClient
    .from('notification_preferences')
    .select('user_id')
    .eq('flash_sales', true)
    .eq('push_enabled', true);

  if (error) {
    console.error('Error fetching subscribers:', error);
    return;
  }

  // Create push notifications for all subscribers
  const notifications = subscribers.map((subscriber: any) => ({
    user_id: subscriber.user_id,
    title: `🔥 Flash Sale: ${flashSale.title}`,
    body: `Don't miss out! Limited time offer ending soon.`,
    type: 'flash_sale',
    data: {
      flash_sale_id: flashSale.id,
      action: 'view_sale'
    }
  }));

  if (notifications.length > 0) {
    const { error: notifyError } = await supabaseClient
      .from('push_notifications')
      .insert(notifications);

    if (notifyError) {
      console.error('Error creating notifications:', notifyError);
    }
  }
}

function calculateTimeRemaining(endTime: string) {
  const end = new Date(endTime);
  const now = new Date();
  const remaining = end.getTime() - now.getTime();

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

function calculateProgress(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  return Math.max(0, Math.min(100, (elapsed / total) * 100));
}

function isExpiringSoon(endTime: string) {
  const end = new Date(endTime);
  const now = new Date();
  const remaining = end.getTime() - now.getTime();
  
  // Consider expiring soon if less than 1 hour remaining
  return remaining > 0 && remaining < (60 * 60 * 1000);
}