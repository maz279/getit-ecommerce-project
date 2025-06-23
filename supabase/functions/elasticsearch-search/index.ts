
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { query, filters, limit = 10, offset = 0 } = await req.json()

    // If Elasticsearch URL is configured, use it; otherwise fall back to PostgreSQL full-text search
    const elasticsearchUrl = Deno.env.get('ELASTICSEARCH_URL')
    
    if (elasticsearchUrl) {
      // Use Elasticsearch for advanced search
      const searchBody = {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: query,
                  fields: ["title^2", "description", "searchable_content"],
                  type: "best_fields"
                }
              }
            ],
            filter: filters ? Object.entries(filters).map(([key, value]) => ({
              term: { [`metadata.${key}`]: value }
            })) : []
          }
        },
        from: offset,
        size: limit,
        highlight: {
          fields: {
            title: {},
            description: {}
          }
        }
      }

      const elasticResponse = await fetch(`${elasticsearchUrl}/search_index/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${Deno.env.get('ELASTICSEARCH_USERNAME')}:${Deno.env.get('ELASTICSEARCH_PASSWORD')}`)}`,
        },
        body: JSON.stringify(searchBody)
      })

      const elasticData = await elasticResponse.json()
      
      return new Response(
        JSON.stringify({
          results: elasticData.hits.hits.map((hit: any) => ({
            ...hit._source,
            score: hit._score,
            highlight: hit.highlight
          })),
          total: elasticData.hits.total.value,
          took: elasticData.took
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Fall back to PostgreSQL full-text search
      let searchQuery = supabaseClient
        .from('search_index')
        .select('*')

      if (query) {
        searchQuery = searchQuery.textSearch('searchable_content', query)
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          searchQuery = searchQuery.eq(`metadata->${key}`, value)
        })
      }

      const { data, error, count } = await searchQuery
        .range(offset, offset + limit - 1)

      if (error) throw error

      return new Response(
        JSON.stringify({
          results: data,
          total: count,
          source: 'postgresql'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
