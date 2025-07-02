import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  id?: string;
  session_id: string;
  sender_type: 'customer' | 'agent';
  sender_id: string;
  message: string;
  message_type?: 'text' | 'image' | 'file';
  metadata?: any;
}

interface ChatSession {
  id?: string;
  customer_id: string;
  agent_id?: string;
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  department?: string;
  initial_message?: string;
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

    const { action, ...payload } = await req.json();

    switch (action) {
      case 'start_session':
        return await startChatSession(supabase, payload);
      case 'send_message':
        return await sendMessage(supabase, payload);
      case 'get_messages':
        return await getMessages(supabase, payload);
      case 'assign_agent':
        return await assignAgent(supabase, payload);
      case 'end_session':
        return await endSession(supabase, payload);
      case 'get_active_sessions':
        return await getActiveSessions(supabase, payload);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Live chat service error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function startChatSession(supabase: any, payload: ChatSession) {
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert({
      customer_id: payload.customer_id,
      status: 'waiting',
      priority: payload.priority || 'medium',
      department: payload.department,
      initial_message: payload.initial_message
    })
    .select()
    .single();

  if (error) throw error;

  // Auto-assign available agent
  const { data: availableAgent } = await supabase
    .from('chat_agents')
    .select('id')
    .eq('status', 'available')
    .eq('is_online', true)
    .limit(1)
    .single();

  if (availableAgent) {
    await supabase
      .from('chat_sessions')
      .update({ 
        agent_id: availableAgent.id, 
        status: 'active',
        started_at: new Date().toISOString()
      })
      .eq('id', session.id);

    session.agent_id = availableAgent.id;
    session.status = 'active';
  }

  return new Response(
    JSON.stringify({ session }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function sendMessage(supabase: any, payload: ChatMessage) {
  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: payload.session_id,
      sender_type: payload.sender_type,
      sender_id: payload.sender_id,
      message: payload.message,
      message_type: payload.message_type || 'text',
      metadata: payload.metadata || {}
    })
    .select()
    .single();

  if (error) throw error;

  // Update session last activity
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', payload.session_id);

  return new Response(
    JSON.stringify({ message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getMessages(supabase: any, { session_id, limit = 50 }: { session_id: string; limit?: number }) {
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', session_id)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;

  return new Response(
    JSON.stringify({ messages }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function assignAgent(supabase: any, { session_id, agent_id }: { session_id: string; agent_id: string }) {
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .update({ 
      agent_id,
      status: 'active',
      started_at: new Date().toISOString()
    })
    .eq('id', session_id)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ session }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function endSession(supabase: any, { session_id, reason }: { session_id: string; reason?: string }) {
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .update({ 
      status: 'closed',
      ended_at: new Date().toISOString(),
      resolution_notes: reason
    })
    .eq('id', session_id)
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ session }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getActiveSessions(supabase: any, { agent_id }: { agent_id?: string }) {
  let query = supabase
    .from('chat_sessions')
    .select(`
      *,
      chat_messages(count)
    `)
    .in('status', ['waiting', 'active']);

  if (agent_id) {
    query = query.eq('agent_id', agent_id);
  }

  const { data: sessions, error } = await query;

  if (error) throw error;

  return new Response(
    JSON.stringify({ sessions }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}