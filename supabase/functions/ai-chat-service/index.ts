import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message, sessionId, userId, context } = await req.json();

    console.log('AI Chat request:', { sessionId, userId, message });

    // Get conversation history
    const { data: conversation } = await supabase
      .from('ai_chatbot_conversations')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    let conversationData = conversation?.conversation_data || [];

    // Analyze intent using simple keyword matching (can be enhanced with ML)
    const intent = await analyzeIntent(message);
    
    // Generate AI response using OpenAI
    const aiResponse = await generateAIResponse(message, conversationData, intent, context);

    // Update conversation
    conversationData.push({
      type: 'user',
      message,
      timestamp: new Date().toISOString()
    });
    
    conversationData.push({
      type: 'assistant',
      message: aiResponse.response,
      intent: intent.name,
      confidence: intent.confidence,
      timestamp: new Date().toISOString()
    });

    // Save to database
    await supabase
      .from('ai_chatbot_conversations')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        conversation_data: conversationData,
        context_data: { ...context, last_intent: intent.name },
        sentiment_score: aiResponse.sentiment,
        status: 'active'
      });

    return new Response(JSON.stringify({
      response: aiResponse.response,
      intent: intent.name,
      confidence: intent.confidence,
      sentiment: aiResponse.sentiment,
      suggestions: aiResponse.suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeIntent(message: string) {
  const intents = [
    { name: 'product_inquiry', keywords: ['product', 'item', 'buy', 'purchase', 'price', 'cost'], confidence: 0.8 },
    { name: 'order_status', keywords: ['order', 'delivery', 'shipped', 'tracking'], confidence: 0.9 },
    { name: 'support', keywords: ['help', 'problem', 'issue', 'support', 'complaint'], confidence: 0.85 },
    { name: 'return_refund', keywords: ['return', 'refund', 'exchange', 'cancel'], confidence: 0.9 },
    { name: 'account', keywords: ['account', 'login', 'password', 'profile'], confidence: 0.8 },
    { name: 'payment', keywords: ['payment', 'card', 'bkash', 'nagad', 'billing'], confidence: 0.85 }
  ];

  const messageLower = message.toLowerCase();
  let bestMatch = { name: 'general', confidence: 0.5 };

  for (const intent of intents) {
    const matches = intent.keywords.filter(keyword => messageLower.includes(keyword));
    if (matches.length > 0) {
      const confidence = (matches.length / intent.keywords.length) * intent.confidence;
      if (confidence > bestMatch.confidence) {
        bestMatch = { name: intent.name, confidence };
      }
    }
  }

  return bestMatch;
}

async function generateAIResponse(message: string, history: any[], intent: any, context: any) {
  const systemPrompt = `You are a helpful AI assistant for a Bangladesh e-commerce platform. 
  You understand both English and Bengali. Respond naturally and helpfully.
  
  Current intent: ${intent.name}
  Context: ${JSON.stringify(context)}
  
  Guidelines:
  - Be helpful and friendly
  - Provide specific product recommendations when asked
  - Help with order tracking and delivery information
  - Assist with payment and account issues
  - Use simple language that's easy to understand
  - If you don't know something, suggest contacting human support`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map((h: any) => ({
      role: h.type === 'user' ? 'user' : 'assistant',
      content: h.message
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500
    }),
  });

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  // Simple sentiment analysis
  const sentiment = analyzeSentiment(message);
  
  // Generate suggestions based on intent
  const suggestions = generateSuggestions(intent.name);

  return {
    response: aiResponse,
    sentiment,
    suggestions
  };
}

function analyzeSentiment(message: string): number {
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'satisfied', 'love', 'amazing'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed'];
  
  const messageLower = message.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(word => {
    if (messageLower.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (messageLower.includes(word)) score -= 1;
  });
  
  return Math.max(-1, Math.min(1, score * 0.3)); // Normalize to -1 to 1
}

function generateSuggestions(intentName: string): string[] {
  const suggestions = {
    product_inquiry: [
      "Would you like to see product recommendations?",
      "Can I help you compare similar products?",
      "Would you like to check current offers?"
    ],
    order_status: [
      "Would you like me to track your recent orders?",
      "Do you need delivery updates?",
      "Can I help with order modifications?"
    ],
    support: [
      "Would you like to speak with a human agent?",
      "Can I help you with our FAQ?",
      "Do you need technical assistance?"
    ],
    return_refund: [
      "Would you like to start a return process?",
      "Can I explain our refund policy?",
      "Do you need return shipping information?"
    ],
    general: [
      "How can I help you today?",
      "Would you like to browse products?",
      "Can I assist with your account?"
    ]
  };

  return suggestions[intentName as keyof typeof suggestions] || suggestions.general;
}