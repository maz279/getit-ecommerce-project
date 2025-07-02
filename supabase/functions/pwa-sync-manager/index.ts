import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  action: 'queue' | 'process' | 'status';
  user_id?: string;
  actions?: Array<{
    action_type: 'create' | 'update' | 'delete';
    resource_type: 'cart' | 'wishlist' | 'order';
    resource_id?: string;
    data: any;
  }>;
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

    const { action, user_id, actions }: SyncRequest = await req.json();

    switch (action) {
      case 'queue': {
        if (!user_id || !actions) {
          throw new Error('user_id and actions required for queue operation');
        }

        // Add actions to sync queue
        const queueItems = actions.map(item => ({
          user_id,
          action_type: item.action_type,
          resource_type: item.resource_type,
          resource_id: item.resource_id,
          data: item.data,
          sync_status: 'pending'
        }));

        const { data: queued, error } = await supabase
          .from('offline_sync_queue')
          .insert(queueItems)
          .select();

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          queued_items: queued.length,
          items: queued
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'process': {
        if (!user_id) {
          throw new Error('user_id required for process operation');
        }

        // Get pending sync items for user
        const { data: pendingItems, error: fetchError } = await supabase
          .from('offline_sync_queue')
          .select('*')
          .eq('user_id', user_id)
          .eq('sync_status', 'pending')
          .lt('attempts', 3)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        const results = [];

        for (const item of pendingItems || []) {
          try {
            // Update status to syncing
            await supabase
              .from('offline_sync_queue')
              .update({ sync_status: 'syncing', attempts: item.attempts + 1 })
              .eq('id', item.id);

            let syncResult;

            // Process based on resource type
            switch (item.resource_type) {
              case 'cart':
                syncResult = await syncCartItem(supabase, item);
                break;
              case 'wishlist':
                syncResult = await syncWishlistItem(supabase, item);
                break;
              case 'order':
                syncResult = await syncOrderItem(supabase, item);
                break;
              default:
                throw new Error(`Unknown resource type: ${item.resource_type}`);
            }

            // Mark as completed
            await supabase
              .from('offline_sync_queue')
              .update({ 
                sync_status: 'completed', 
                synced_at: new Date().toISOString() 
              })
              .eq('id', item.id);

            results.push({
              id: item.id,
              success: true,
              result: syncResult
            });

          } catch (error) {
            console.error(`Sync failed for item ${item.id}:`, error);

            // Mark as failed if max attempts reached
            const newStatus = item.attempts >= 2 ? 'failed' : 'pending';
            await supabase
              .from('offline_sync_queue')
              .update({ 
                sync_status: newStatus,
                error_message: error.message
              })
              .eq('id', item.id);

            results.push({
              id: item.id,
              success: false,
              error: error.message
            });
          }
        }

        return new Response(JSON.stringify({
          success: true,
          processed_items: results.length,
          results
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'status': {
        if (!user_id) {
          throw new Error('user_id required for status operation');
        }

        const { data: status, error } = await supabase
          .from('offline_sync_queue')
          .select('sync_status, count(*)')
          .eq('user_id', user_id)
          .not('sync_status', 'eq', 'completed');

        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          status: status || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('PWA sync error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncCartItem(supabase: any, item: any) {
  switch (item.action_type) {
    case 'create':
      return await supabase.from('cart_items').insert(item.data).select();
    case 'update':
      return await supabase.from('cart_items').update(item.data).eq('id', item.resource_id).select();
    case 'delete':
      return await supabase.from('cart_items').delete().eq('id', item.resource_id);
    default:
      throw new Error(`Unknown cart action: ${item.action_type}`);
  }
}

async function syncWishlistItem(supabase: any, item: any) {
  switch (item.action_type) {
    case 'create':
      return await supabase.from('wishlist_items').insert(item.data).select();
    case 'update':
      return await supabase.from('wishlist_items').update(item.data).eq('id', item.resource_id).select();
    case 'delete':
      return await supabase.from('wishlist_items').delete().eq('id', item.resource_id);
    default:
      throw new Error(`Unknown wishlist action: ${item.action_type}`);
  }
}

async function syncOrderItem(supabase: any, item: any) {
  switch (item.action_type) {
    case 'create':
      return await supabase.from('orders').insert(item.data).select();
    case 'update':
      return await supabase.from('orders').update(item.data).eq('id', item.resource_id).select();
    default:
      throw new Error(`Unknown order action: ${item.action_type}`);
  }
}