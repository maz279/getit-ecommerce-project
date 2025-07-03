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

    // Health check
    if (endpoint === 'health') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'user-management-api' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route user management operations
    switch (endpoint) {
      case 'users':
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .limit(data?.limit || 10);
        
        return new Response(JSON.stringify({ data: users, error: usersError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'user/profile':
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.userId)
          .single();
        
        return new Response(JSON.stringify({ data: profile, error: profileError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'user/update':
        const { data: updated, error: updateError } = await supabase
          .from('profiles')
          .update(data.updates)
          .eq('id', data.userId)
          .select()
          .single();
        
        return new Response(JSON.stringify({ data: updated, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('User management error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});