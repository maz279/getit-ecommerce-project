import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

interface ChatRequest {
  action: 'send_message' | 'get_conversation' | 'create_conversation';
  conversationId?: string;
  message?: string;
  conversationType?: 'customer_service' | 'vendor_admin' | 'buyer_seller';
  participants?: string[];
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, conversationId, message, conversationType, participants }: ChatRequest = await req.json();

    switch (action) {
      case 'create_conversation':
        return await createConversation(supabaseClient, user.id, conversationType!, participants!);
      
      case 'send_message':
        return await sendMessage(supabaseClient, user.id, conversationId!, message!);
      
      case 'get_conversation':
        return await getConversation(supabaseClient, conversationId!);
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('AI Chat Service Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createConversation(supabaseClient: any, userId: string, conversationType: string, participants: string[]) {
  const { data: conversation, error } = await supabaseClient
    .from('chat_conversations')
    .insert({
      conversation_type: conversationType,
      participants: participants,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // Send welcome message from AI
  const welcomeMessage = getWelcomeMessage(conversationType);
  await supabaseClient
    .from('chat_conversation_messages')
    .insert({
      conversation_id: conversation.id,
      sender_id: null,
      sender_type: 'ai',
      message_content: welcomeMessage
    });

  return new Response(
    JSON.stringify({ success: true, conversation }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function sendMessage(supabaseClient: any, userId: string, conversationId: string, message: string) {
  // Insert user message
  const { data: userMessage, error: messageError } = await supabaseClient
    .from('chat_conversation_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      sender_type: 'customer',
      message_content: message
    })
    .select()
    .single();

  if (messageError) throw messageError;

  // Get conversation context
  const { data: conversation, error: convError } = await supabaseClient
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError) throw convError;

  // Generate AI response if it's customer service
  if (conversation.conversation_type === 'customer_service' && OPENAI_API_KEY) {
    const aiResponse = await generateAIResponse(message, conversation.conversation_type);
    
    // Insert AI response
    await supabaseClient
      .from('chat_conversation_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: null,
        sender_type: 'ai',
        message_content: aiResponse
      });
  }

  return new Response(
    JSON.stringify({ success: true, message: userMessage }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getConversation(supabaseClient: any, conversationId: string) {
  const { data: messages, error } = await supabaseClient
    .from('chat_conversation_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, messages }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function generateAIResponse(userMessage: string, conversationType: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    return "I'm here to help! Please wait while I connect you with a human agent.";
  }

  try {
    const systemPrompt = getSystemPrompt(conversationType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I apologize, but I'm experiencing technical difficulties. Let me connect you with a human agent who can assist you better.";
  }
}

function getSystemPrompt(conversationType: string): string {
  switch (conversationType) {
    case 'customer_service':
      return `You are a helpful customer service AI assistant for BD Commerce, a leading e-commerce platform in Bangladesh. 
      You help customers with:
      - Order inquiries and tracking
      - Product information and recommendations
      - Account and payment issues
      - Return and refund policies
      - General shopping assistance
      
      Always be polite, helpful, and professional. If you cannot solve an issue, offer to connect them with a human agent.
      Keep responses concise and actionable.`;
    
    case 'vendor_admin':
      return `You are an AI assistant helping vendors communicate with BD Commerce administrators.
      You can help with:
      - Account and verification issues
      - Product listing guidelines
      - Commission and payment questions
      - Platform policies and procedures
      
      Be professional and informative, and escalate complex issues to human administrators.`;
    
    default:
      return 'You are a helpful AI assistant for BD Commerce. Provide helpful and accurate information.';
  }
}

function getWelcomeMessage(conversationType: string): string {
  switch (conversationType) {
    case 'customer_service':
      return "Hello! Welcome to BD Commerce customer support. I'm here to help you with any questions about your orders, products, or account. How can I assist you today?";
    
    case 'vendor_admin':
      return "Welcome to BD Commerce vendor support. I can help you with account issues, product listings, and platform policies. What can I help you with?";
    
    case 'buyer_seller':
      return "Welcome to BD Commerce messaging. You can communicate directly with the seller about this product.";
    
    default:
      return "Welcome! How can I help you today?";
  }
}