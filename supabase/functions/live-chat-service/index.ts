import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'start-session':
        return await startChatSession(supabase, req);
      case 'send-message':
        return await sendMessage(supabase, req);
      case 'agent-takeover':
        return await agentTakeover(supabase, req);
      case 'end-session':
        return await endChatSession(supabase, req);
      case 'get-messages':
        return await getMessages(supabase, req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Live chat service error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function startChatSession(supabase: any, req: Request) {
  const { customer_name, customer_email, initial_message, language = 'english' } = await req.json();

  // Create conversation
  const { data: conversation, error } = await supabase
    .from('multi_channel_conversations')
    .insert({
      channel_type: 'live_chat',
      customer_name,
      customer_email,
      status: 'active',
      metadata: { language, initial_message }
    })
    .select()
    .single();

  if (error) throw error;

  // Send initial message
  if (initial_message) {
    await supabase
      .from('enhanced_chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'customer',
        message_content: initial_message,
        message_type: 'text',
        channel: 'live_chat'
      });
  }

  // Send welcome message
  const welcomeMessage = language === 'bangla' 
    ? 'স্বাগতম! আমি আপনার সহায়তার জন্য এখানে আছি। কীভাবে সাহায্য করতে পারি?'
    : 'Welcome! I\'m here to help you. How can I assist you today?';

  await supabase
    .from('enhanced_chat_messages')
    .insert({
      conversation_id: conversation.id,
      sender_type: 'ai_bot',
      message_content: welcomeMessage,
      message_type: 'text',
      channel: 'live_chat'
    });

  // Check if AI can handle the query
  if (initial_message) {
    const aiResponse = await generateAIResponse(initial_message, language);
    if (aiResponse) {
      await supabase
        .from('enhanced_chat_messages')
        .insert({
          conversation_id: conversation.id,
          sender_type: 'ai_bot',
          message_content: aiResponse,
          message_type: 'text',
          channel: 'live_chat'
        });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    conversation_id: conversation.id,
    session_id: conversation.external_id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function sendMessage(supabase: any, req: Request) {
  const { conversation_id, message, sender_type = 'customer', message_type = 'text' } = await req.json();

  // Store message
  const { data: newMessage, error } = await supabase
    .from('enhanced_chat_messages')
    .insert({
      conversation_id,
      sender_type,
      message_content: message,
      message_type,
      channel: 'live_chat'
    })
    .select()
    .single();

  if (error) throw error;

  // If customer message, try AI response
  if (sender_type === 'customer') {
    // Get conversation metadata for language
    const { data: conversation } = await supabase
      .from('multi_channel_conversations')
      .select('metadata, assigned_agent_id')
      .eq('id', conversation_id)
      .single();

    const language = conversation?.metadata?.language || 'english';
    
    // Only AI respond if no agent assigned
    if (!conversation?.assigned_agent_id) {
      const aiResponse = await generateAIResponse(message, language);
      if (aiResponse) {
        await supabase
          .from('enhanced_chat_messages')
          .insert({
            conversation_id,
            sender_type: 'ai_bot',
            message_content: aiResponse,
            message_type: 'text',
            channel: 'live_chat'
          });
      }

      // Analyze if human agent needed
      const needsHuman = await analyzeForHumanEscalation(message);
      if (needsHuman.should_escalate) {
        await requestHumanAgent(supabase, conversation_id, needsHuman.reason);
      }
    }

    // Perform sentiment analysis
    await supabase.functions.invoke('ai-support-orchestrator', {
      body: {
        action: 'sentiment_analysis',
        data: {
          messageId: newMessage.id,
          content: message,
          conversationId: conversation_id
        }
      }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    message_id: newMessage.id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function agentTakeover(supabase: any, req: Request) {
  const { conversation_id, agent_id } = await req.json();

  // Assign agent
  await supabase
    .from('multi_channel_conversations')
    .update({
      assigned_agent_id: agent_id,
      agent_joined_at: new Date().toISOString()
    })
    .eq('id', conversation_id);

  // Send notification message
  await supabase
    .from('enhanced_chat_messages')
    .insert({
      conversation_id,
      sender_type: 'system',
      message_content: 'A human agent has joined the conversation.',
      message_type: 'notification',
      channel: 'live_chat'
    });

  return new Response(JSON.stringify({
    success: true,
    agent_assigned: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function endChatSession(supabase: any, req: Request) {
  const { conversation_id } = await req.json();

  // Close conversation
  await supabase
    .from('multi_channel_conversations')
    .update({
      status: 'closed',
      ended_at: new Date().toISOString()
    })
    .eq('id', conversation_id);

  // Send farewell message
  await supabase
    .from('enhanced_chat_messages')
    .insert({
      conversation_id,
      sender_type: 'system',
      message_content: 'Chat session has ended. Thank you for contacting us!',
      message_type: 'notification',
      channel: 'live_chat'
    });

  return new Response(JSON.stringify({
    success: true,
    session_ended: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getMessages(supabase: any, req: Request) {
  const url = new URL(req.url);
  const conversation_id = url.searchParams.get('conversation_id');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  const { data: messages, error } = await supabase
    .from('enhanced_chat_messages')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;

  return new Response(JSON.stringify({
    success: true,
    messages
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function generateAIResponse(message: string, language: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer support AI for GetIt e-commerce platform in Bangladesh. 
            Respond in ${language === 'bangla' ? 'Bengali/Bangla' : 'English'}. 
            Be helpful, culturally appropriate, and provide accurate information about:
            - Order tracking and status
            - Return and refund policies
            - Product information
            - Shipping details
            - Account issues
            If you cannot help, politely say you'll connect them with a human agent.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('AI response generation failed:', error);
    return null;
  }
}

async function analyzeForHumanEscalation(message: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Analyze if this message needs human agent escalation. Return JSON with:
            - should_escalate: boolean
            - reason: string explaining why
            - urgency: low, medium, high
            Consider escalating for: complex technical issues, billing disputes, complaints, refund requests`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.2
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Escalation analysis failed:', error);
    return { should_escalate: false, reason: 'analysis_failed', urgency: 'low' };
  }
}

async function requestHumanAgent(supabase: any, conversationId: string, reason: string) {
  // Find available agent
  const { data: agent } = await supabase
    .from('support_agents')
    .select('*')
    .eq('status', 'available')
    .order('current_load', { ascending: true })
    .limit(1)
    .single();

  if (agent) {
    // Assign agent
    await supabase
      .from('multi_channel_conversations')
      .update({
        assigned_agent_id: agent.id,
        escalation_reason: reason
      })
      .eq('id', conversationId);

    // Notify customer
    await supabase
      .from('enhanced_chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'system',
        message_content: 'I\'m connecting you with a human agent who can better assist you.',
        message_type: 'notification',
        channel: 'live_chat'
      });
  }
}