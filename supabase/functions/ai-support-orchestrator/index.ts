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

    const { action, data } = await req.json();

    switch (action) {
      case 'intelligent_routing':
        return await handleIntelligentRouting(supabase, data);
      case 'sentiment_analysis':
        return await handleSentimentAnalysis(supabase, data);
      case 'automated_resolution':
        return await handleAutomatedResolution(supabase, data);
      case 'escalation_management':
        return await handleEscalationManagement(supabase, data);
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('AI Support Orchestrator error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleIntelligentRouting(supabase: any, data: any) {
  const { ticketId, message, urgency, category } = data;

  // Analyze message for routing
  const routingAnalysis = await analyzeForRouting(message);
  
  // Get available agents
  const { data: agents } = await supabase
    .from('support_agents')
    .select('*')
    .eq('status', 'available')
    .order('current_load', { ascending: true });

  // Find best agent match
  const bestAgent = findBestAgent(agents, routingAnalysis, category, urgency);

  if (bestAgent) {
    // Assign ticket
    await supabase
      .from('support_tickets')
      .update({
        assigned_agent_id: bestAgent.id,
        status: 'assigned',
        ai_routing_confidence: routingAnalysis.confidence
      })
      .eq('id', ticketId);

    // Update agent load
    await supabase
      .from('support_agents')
      .update({
        current_load: bestAgent.current_load + 1
      })
      .eq('id', bestAgent.id);

    return new Response(JSON.stringify({
      success: true,
      assigned_agent: bestAgent,
      routing_analysis: routingAnalysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: false,
    message: 'No available agents found'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleSentimentAnalysis(supabase: any, data: any) {
  const { messageId, content, conversationId } = data;

  const sentiment = await analyzeSentiment(content);
  
  // Store sentiment analysis
  await supabase
    .from('customer_feedback')
    .insert({
      conversation_id: conversationId,
      feedback_type: 'sentiment_analysis',
      sentiment_score: sentiment.score,
      sentiment_label: sentiment.label,
      message_id: messageId,
      ai_analysis: sentiment.analysis
    });

  // Check if escalation needed
  if (sentiment.score < -0.7) { // Very negative
    await triggerEscalation(supabase, conversationId, 'negative_sentiment');
  }

  return new Response(JSON.stringify({
    success: true,
    sentiment: sentiment
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleAutomatedResolution(supabase: any, data: any) {
  const { ticketId, query, language = 'english' } = data;

  // Search knowledge base for potential solutions
  const { data: kbArticles } = await supabase
    .from('knowledge_base_articles')
    .select('*')
    .textSearch('content', query)
    .limit(5);

  if (kbArticles && kbArticles.length > 0) {
    // Generate AI response based on knowledge base
    const aiResponse = await generateKnowledgeBasedResponse(query, kbArticles, language);
    
    if (aiResponse.confidence > 0.8) {
      // Auto-resolve ticket
      await supabase
        .from('support_tickets')
        .update({
          status: 'resolved',
          resolution_type: 'automated',
          resolution_details: aiResponse.response,
          ai_confidence: aiResponse.confidence
        })
        .eq('id', ticketId);

      return new Response(JSON.stringify({
        success: true,
        resolved: true,
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        sources: kbArticles.map(a => a.title)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    resolved: false,
    suggested_articles: kbArticles
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleEscalationManagement(supabase: any, data: any) {
  const { ticketId, reason, urgency } = data;

  // Get escalation rules
  const { data: rules } = await supabase
    .from('sla_configurations')
    .select('*')
    .eq('ticket_priority', urgency)
    .single();

  // Create escalation
  await supabase
    .from('support_tickets')
    .update({
      priority: 'high',
      escalated: true,
      escalation_reason: reason,
      escalation_time: new Date().toISOString()
    })
    .eq('id', ticketId);

  // Notify management
  await notifyEscalation(ticketId, reason, urgency);

  return new Response(JSON.stringify({
    success: true,
    escalated: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function analyzeForRouting(message: string) {
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
            content: `Analyze this customer support message and categorize it. Return JSON with:
            - category: billing, technical, product_inquiry, shipping, returns, general
            - urgency: low, medium, high, critical
            - required_skills: array of skills needed
            - confidence: 0-1 score
            - language: detected language`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.3
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Routing analysis failed:', error);
    return {
      category: 'general',
      urgency: 'medium',
      required_skills: [],
      confidence: 0.5,
      language: 'english'
    };
  }
}

function findBestAgent(agents: any[], analysis: any, category: string, urgency: string) {
  return agents.find(agent => 
    agent.specializations.includes(category) && 
    agent.max_concurrent_tickets > agent.current_load
  ) || agents[0];
}

async function analyzeSentiment(content: string) {
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
            content: `Analyze sentiment. Return JSON with:
            - score: -1 to 1 (negative to positive)
            - label: very_negative, negative, neutral, positive, very_positive
            - analysis: brief explanation`
          },
          { role: 'user', content: content }
        ],
        temperature: 0.2
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return { score: 0, label: 'neutral', analysis: 'Analysis failed' };
  }
}

async function generateKnowledgeBasedResponse(query: string, articles: any[], language: string) {
  try {
    const context = articles.map(a => `${a.title}: ${a.content}`).join('\n\n');
    
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
            content: `You are a customer support AI. Use the knowledge base context to answer the query in ${language}. 
            Return JSON with:
            - response: the answer
            - confidence: 0-1 score of how well you can answer
            - sources_used: array of article titles referenced`
          },
          { 
            role: 'user', 
            content: `Query: ${query}\n\nKnowledge Base:\n${context}` 
          }
        ],
        temperature: 0.3
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Knowledge-based response failed:', error);
    return { response: 'I need to connect you with a human agent.', confidence: 0.1 };
  }
}

async function triggerEscalation(supabase: any, conversationId: string, reason: string) {
  await supabase
    .from('multi_channel_conversations')
    .update({
      priority: 'high',
      escalated: true,
      escalation_reason: reason
    })
    .eq('id', conversationId);
}

async function notifyEscalation(ticketId: string, reason: string, urgency: string) {
  // In a real implementation, this would send notifications to managers
  console.log(`ESCALATION ALERT: Ticket ${ticketId} escalated due to ${reason} with urgency ${urgency}`);
}