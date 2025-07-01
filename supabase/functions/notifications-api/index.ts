import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);

    // GET /notifications - Get user notifications
    if (req.method === "GET" && path.length === 0) {
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const unreadOnly = url.searchParams.get('unread') === 'true';

      let query = supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data: notifications, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch notifications' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: notifications }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /notifications - Create notification (admin only)
    if (req.method === "POST") {
      const { title, message, type, target_user_id, metadata } = await req.json();

      // Check if user is admin
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized - Admin access required' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: notification, error } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: target_user_id,
          title,
          message,
          type: type || 'info',
          metadata: metadata || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to create notification' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: notification }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PUT /notifications/:id/read - Mark notification as read
    if (req.method === "PUT" && path.length === 2 && path[1] === 'read') {
      const notificationId = path[0];

      const { error } = await supabaseClient
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to mark notification as read' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Notification marked as read' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PUT /notifications/read-all - Mark all notifications as read
    if (req.method === "PUT" && path.length === 1 && path[0] === 'read-all') {
      const { error } = await supabaseClient
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to mark all notifications as read' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'All notifications marked as read' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE /notifications/:id - Delete notification
    if (req.method === "DELETE" && path.length === 1) {
      const notificationId = path[0];

      const { error } = await supabaseClient
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete notification' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Notification deleted' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Notifications API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});