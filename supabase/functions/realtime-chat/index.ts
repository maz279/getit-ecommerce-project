import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log('WebSocket connection established for real-time chat');

  let openAISocket: WebSocket | null = null;
  let conversationContext: any[] = [];
  let currentUserId: string | null = null;

  socket.onopen = () => {
    console.log('Client WebSocket opened');
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data.type);

      switch (data.type) {
        case 'start_conversation':
          await startConversation(data);
          break;
        case 'send_message':
          await handleUserMessage(data);
          break;
        case 'input_audio_buffer.append':
          if (openAISocket?.readyState === WebSocket.OPEN) {
            openAISocket.send(JSON.stringify(data));
          }
          break;
        case 'end_conversation':
          await endConversation();
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  };

  socket.onclose = () => {
    console.log('Client WebSocket closed');
    if (openAISocket) {
      openAISocket.close();
    }
  };

  async function startConversation(data: any) {
    currentUserId = data.userId;
    conversationContext = [];

    if (!openAIApiKey) {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'OpenAI API key not configured'
      }));
      return;
    }

    // Connect to OpenAI Realtime API
    openAISocket = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [],
      {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      }
    );

    openAISocket.onopen = () => {
      console.log('Connected to OpenAI Realtime API');
      
      // Send session configuration
      openAISocket.send(JSON.stringify({
        type: 'session.update',
        session: {
          modalities: ['text', 'audio'],
          instructions: 'You are a helpful e-commerce assistant for GetIt Bangladesh. Help customers find products, answer questions about orders, and provide shopping assistance. Be friendly and knowledgeable about Bangladeshi culture and shopping preferences.',
          voice: 'alloy',
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          input_audio_transcription: {
            model: 'whisper-1'
          },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          tools: [
            {
              type: 'function',
              name: 'search_products',
              description: 'Search for products in the GetIt marketplace',
              parameters: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  category: { type: 'string' },
                  price_range: { type: 'string' }
                },
                required: ['query']
              }
            },
            {
              type: 'function',
              name: 'get_order_status',
              description: 'Get the status of a customer order',
              parameters: {
                type: 'object',
                properties: {
                  order_id: { type: 'string' }
                },
                required: ['order_id']
              }
            },
            {
              type: 'function',
              name: 'get_recommendations',
              description: 'Get personalized product recommendations',
              parameters: {
                type: 'object',
                properties: {
                  user_id: { type: 'string' },
                  category: { type: 'string' }
                }
              }
            }
          ],
          tool_choice: 'auto',
          temperature: 0.8,
          max_response_output_tokens: 'inf'
        }
      }));

      socket.send(JSON.stringify({
        type: 'conversation_started',
        message: 'AI assistant connected and ready to help!'
      }));
    };

    openAISocket.onmessage = async (event) => {
      const aiData = JSON.parse(event.data);
      console.log('OpenAI message type:', aiData.type);

      switch (aiData.type) {
        case 'session.created':
          console.log('OpenAI session created');
          break;

        case 'response.audio.delta':
          // Forward audio to client
          socket.send(JSON.stringify({
            type: 'response.audio.delta',
            delta: aiData.delta
          }));
          break;

        case 'response.audio_transcript.delta':
          // Forward transcript to client
          socket.send(JSON.stringify({
            type: 'response.audio_transcript.delta',
            delta: aiData.delta
          }));
          break;

        case 'response.function_call_arguments.done':
          await handleFunctionCall(aiData);
          break;

        case 'response.done':
          // Save conversation to database
          await saveConversationTurn(aiData);
          break;

        case 'error':
          console.error('OpenAI error:', aiData);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'AI service error: ' + aiData.error?.message
          }));
          break;
      }
    };

    openAISocket.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Connection to AI service failed'
      }));
    };

    openAISocket.onclose = () => {
      console.log('OpenAI WebSocket closed');
    };
  }

  async function handleUserMessage(data: any) {
    if (!openAISocket || openAISocket.readyState !== WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'AI service not connected'
      }));
      return;
    }

    // Add to conversation context
    conversationContext.push({
      role: 'user',
      content: data.message,
      timestamp: new Date().toISOString()
    });

    // Send to OpenAI
    openAISocket.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: data.message
          }
        ]
      }
    }));

    openAISocket.send(JSON.stringify({
      type: 'response.create'
    }));
  }

  async function handleFunctionCall(aiData: any) {
    const { call_id, arguments: args } = aiData;
    const functionArgs = JSON.parse(args);
    
    console.log('Function call:', aiData.name, functionArgs);

    let result = {};

    try {
      switch (aiData.name) {
        case 'search_products':
          result = await searchProducts(functionArgs);
          break;
        case 'get_order_status':
          result = await getOrderStatus(functionArgs);
          break;
        case 'get_recommendations':
          result = await getRecommendations(functionArgs);
          break;
        default:
          result = { error: 'Unknown function' };
      }

      // Send function result back to OpenAI
      openAISocket.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: call_id,
          output: JSON.stringify(result)
        }
      }));

      openAISocket.send(JSON.stringify({
        type: 'response.create'
      }));

    } catch (error) {
      console.error('Function call error:', error);
      openAISocket.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: call_id,
          output: JSON.stringify({ error: error.message })
        }
      }));
    }
  }

  async function searchProducts(args: any) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, description, image_url, rating')
      .eq('is_active', true)
      .ilike('name', `%${args.query}%`)
      .limit(5);

    return {
      products: products || [],
      total: products?.length || 0
    };
  }

  async function getOrderStatus(args: any) {
    const { data: order } = await supabase
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('id', args.order_id)
      .single();

    return order || { error: 'Order not found' };
  }

  async function getRecommendations(args: any) {
    const { data: recommendations } = await supabase
      .from('ml_recommendations')
      .select('recommendations')
      .eq('user_id', args.user_id || currentUserId)
      .eq('recommendation_type', 'product')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return {
      recommendations: recommendations?.recommendations || [],
      personalized: !!args.user_id
    };
  }

  async function saveConversationTurn(aiData: any) {
    if (!currentUserId) return;

    await supabase
      .from('ai_chatbot_conversations')
      .insert({
        user_id: currentUserId,
        session_id: `session_${Date.now()}`,
        conversation_data: conversationContext,
        context_data: {
          ai_response: aiData,
          timestamp: new Date().toISOString()
        },
        status: 'active'
      });
  }

  async function endConversation() {
    if (openAISocket) {
      openAISocket.close();
      openAISocket = null;
    }
    
    conversationContext = [];
    currentUserId = null;
    
    socket.send(JSON.stringify({
      type: 'conversation_ended',
      message: 'Conversation ended successfully'
    }));
  }

  return response;
});