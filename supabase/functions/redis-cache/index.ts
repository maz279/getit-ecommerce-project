
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, key, value, ttl = 3600 } = await req.json()
    const redisUrl = Deno.env.get('REDIS_URL')

    if (!redisUrl) {
      return new Response(
        JSON.stringify({ error: 'Redis not configured, using in-memory fallback' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Parse Redis URL
    const url = new URL(redisUrl)
    const redisHost = url.hostname
    const redisPort = parseInt(url.port) || 6379
    const redisPassword = url.password

    // Simple Redis protocol implementation
    const conn = await Deno.connect({ hostname: redisHost, port: redisPort })
    
    if (redisPassword) {
      const authCommand = `AUTH ${redisPassword}\r\n`
      await conn.write(new TextEncoder().encode(authCommand))
      const authResponse = new Uint8Array(1024)
      await conn.read(authResponse)
    }

    let command = ''
    let result = null

    switch (action) {
      case 'get':
        command = `GET ${key}\r\n`
        break
      case 'set':
        if (ttl > 0) {
          command = `SETEX ${key} ${ttl} ${JSON.stringify(value)}\r\n`
        } else {
          command = `SET ${key} ${JSON.stringify(value)}\r\n`
        }
        break
      case 'del':
        command = `DEL ${key}\r\n`
        break
      case 'exists':
        command = `EXISTS ${key}\r\n`
        break
      default:
        throw new Error('Invalid action')
    }

    await conn.write(new TextEncoder().encode(command))
    const response = new Uint8Array(1024)
    const bytesRead = await conn.read(response)
    const responseStr = new TextDecoder().decode(response.subarray(0, bytesRead))
    
    conn.close()

    // Parse Redis response
    if (action === 'get') {
      if (responseStr.startsWith('$-1')) {
        result = null
      } else {
        const lines = responseStr.split('\r\n')
        if (lines[1]) {
          try {
            result = JSON.parse(lines[1])
          } catch {
            result = lines[1]
          }
        }
      }
    } else if (action === 'exists') {
      result = responseStr.startsWith(':1')
    } else {
      result = responseStr.startsWith('+OK') || responseStr.startsWith(':1')
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
