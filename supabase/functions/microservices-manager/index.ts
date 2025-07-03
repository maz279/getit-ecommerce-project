import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method, endpoint, data } = await req.json()
    
    console.log(`Microservices Manager: ${method} ${endpoint}`)

    // Service registry management
    switch (endpoint) {
      case '/services/register':
        if (method === 'POST') {
          const { data: service, error } = await supabase
            .from('microservices_registry')
            .insert({
              service_name: data.service_name,
              service_type: data.service_type || 'api',
              version: data.version || '1.0.0',
              endpoint_url: data.endpoint_url,
              health_check_url: data.health_check_url,
              status: 'healthy',
              configuration: data.configuration || {},
              dependencies: data.dependencies || {},
              resource_limits: data.resource_limits || {}
            })
            .select()
            .single()

          if (error) throw error
          
          console.log(`Registered service: ${data.service_name}`)
          return new Response(JSON.stringify(service), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case '/services/health':
        if (method === 'GET') {
          const { data: services, error } = await supabase
            .from('microservices_registry')
            .select(`
              *,
              service_health_metrics(*)
            `)
            .order('created_at', { ascending: false })

          if (error) throw error
          
          return new Response(JSON.stringify(services), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case '/services/discover':
        if (method === 'GET') {
          const { service_name } = data
          const { data: service, error } = await supabase
            .from('microservices_registry')
            .select('*')
            .eq('service_name', service_name)
            .eq('status', 'healthy')
            .single()

          if (error) throw error
          
          return new Response(JSON.stringify(service), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case '/services/config':
        if (method === 'GET') {
          const { service_name } = data
          const { data: configs, error } = await supabase
            .from('microservice_configs')
            .select('*')
            .eq('service_name', service_name)
            .eq('environment', 'production')

          return new Response(JSON.stringify(configs || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case '/services/logs':
        if (method === 'GET') {
          const { data: logs, error } = await supabase
            .from('service_communication_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

          return new Response(JSON.stringify(logs || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Microservices Manager Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})