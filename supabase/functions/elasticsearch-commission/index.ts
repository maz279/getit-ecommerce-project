
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ElasticsearchConfig {
  url: string;
  username: string;
  password: string;
}

const getElasticsearchConfig = (): ElasticsearchConfig => {
  return {
    url: Deno.env.get('ELASTICSEARCH_URL') || 'http://localhost:9200',
    username: Deno.env.get('ELASTICSEARCH_USERNAME') || 'elastic',
    password: Deno.env.get('ELASTICSEARCH_PASSWORD') || 'changeme'
  };
};

const makeElasticsearchRequest = async (
  method: string,
  path: string,
  body?: any
): Promise<Response> => {
  const config = getElasticsearchConfig();
  const auth = btoa(`${config.username}:${config.password}`);
  
  return await fetch(`${config.url}${path}`, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined
  });
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { pathname } = new URL(req.url);
    const action = pathname.split('/').pop();

    switch (action) {
      case 'index': {
        const { index, id, document } = await req.json();
        
        const response = await makeElasticsearchRequest(
          'PUT',
          `/${index}/_doc/${id}`,
          document
        );

        const result = await response.json();
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.ok ? 200 : 500
        });
      }

      case 'search': {
        const { index, query, size, from, sort, aggs } = await req.json();
        
        const searchBody: any = {
          query,
          size: size || 20,
          from: from || 0
        };

        if (sort) searchBody.sort = sort;
        if (aggs) searchBody.aggs = aggs;

        const response = await makeElasticsearchRequest(
          'POST',
          `/${index}/_search`,
          searchBody
        );

        const result = await response.json();
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.ok ? 200 : 500
        });
      }

      case 'update': {
        const { index, id, document } = await req.json();
        
        const response = await makeElasticsearchRequest(
          'POST',
          `/${index}/_update/${id}`,
          { doc: document }
        );

        const result = await response.json();
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.ok ? 200 : 500
        });
      }

      case 'delete': {
        const { index, id } = await req.json();
        
        const response = await makeElasticsearchRequest(
          'DELETE',
          `/${index}/_doc/${id}`
        );

        const result = await response.json();
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.ok ? 200 : 500
        });
      }

      case 'bulk': {
        const { operations } = await req.json();
        
        const bulkBody = operations.map((op: any) => JSON.stringify(op)).join('\n') + '\n';
        
        const response = await makeElasticsearchRequest(
          'POST',
          '/_bulk',
          bulkBody
        );

        const result = await response.json();
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.ok ? 200 : 500
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
    }
  } catch (error) {
    console.error('Elasticsearch function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
