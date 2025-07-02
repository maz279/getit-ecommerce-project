import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')!
    supabase.auth.setSession(authHeader)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (req.method) {
      case 'GET':
        if (action === 'orders') {
          const status = url.searchParams.get('status')
          const limit = parseInt(url.searchParams.get('limit') || '50')
          
          let query = supabase
            .from('orders')
            .select(`
              *,
              order_items(*),
              order_fulfillment_workflow(*),
              customer:profiles!orders_customer_id_fkey(full_name, email)
            `)
            .eq('vendor_id', user.user.id)
            .order('created_at', { ascending: false })
            .limit(limit)

          if (status) {
            query = query.eq('status', status)
          }

          const { data: orders, error } = await query
          if (error) throw error

          return new Response(JSON.stringify({ orders }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'fulfillment') {
          const { data: fulfillmentTasks, error } = await supabase
            .from('order_fulfillment_workflow')
            .select(`
              *,
              orders(order_number, total_amount, customer_id),
              assigned_user:profiles!order_fulfillment_workflow_assigned_to_fkey(full_name)
            `)
            .eq('vendor_id', user.user.id)
            .neq('workflow_stage', 'delivered')
            .order('created_at', { ascending: true })

          if (error) throw error

          return new Response(JSON.stringify({ fulfillmentTasks }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'returns') {
          const { data: returns, error } = await supabase
            .from('returns')
            .select(`
              *,
              orders(order_number, total_amount),
              order_items(product_id, quantity, price)
            `)
            .eq('vendor_id', user.user.id)
            .order('created_at', { ascending: false })

          if (error) throw error

          return new Response(JSON.stringify({ returns }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'analytics') {
          // Order analytics
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const [ordersResult, fulfillmentResult, returnsResult] = await Promise.all([
            supabase
              .from('orders')
              .select('status, total_amount, created_at')
              .eq('vendor_id', user.user.id)
              .gte('created_at', thirtyDaysAgo.toISOString()),
            
            supabase
              .from('order_fulfillment_workflow')
              .select('workflow_stage, created_at, actual_completion, estimated_completion')
              .eq('vendor_id', user.user.id)
              .gte('created_at', thirtyDaysAgo.toISOString()),
            
            supabase
              .from('returns')
              .select('status, return_amount, created_at')
              .eq('vendor_id', user.user.id)
              .gte('created_at', thirtyDaysAgo.toISOString())
          ])

          if (ordersResult.error) throw ordersResult.error
          if (fulfillmentResult.error) throw fulfillmentResult.error
          if (returnsResult.error) throw returnsResult.error

          // Calculate metrics
          const ordersByStatus = {}
          const dailyOrderVolume = {}
          let totalRevenue = 0

          ordersResult.data.forEach(order => {
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
            
            const day = order.created_at.split('T')[0]
            dailyOrderVolume[day] = (dailyOrderVolume[day] || 0) + 1
            
            totalRevenue += order.total_amount || 0
          })

          const fulfillmentMetrics = {
            onTime: 0,
            delayed: 0,
            avgFulfillmentTime: 0
          }

          fulfillmentResult.data.forEach(task => {
            if (task.actual_completion && task.estimated_completion) {
              const actual = new Date(task.actual_completion)
              const estimated = new Date(task.estimated_completion)
              
              if (actual <= estimated) {
                fulfillmentMetrics.onTime++
              } else {
                fulfillmentMetrics.delayed++
              }
            }
          })

          return new Response(JSON.stringify({
            ordersByStatus,
            dailyOrderVolume,
            totalRevenue,
            fulfillmentMetrics,
            returnRate: (returnsResult.data.length / ordersResult.data.length) * 100,
            totalOrders: ordersResult.data.length,
            totalReturns: returnsResult.data.length
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      case 'POST':
        const body = await req.json()

        if (action === 'update-fulfillment') {
          const { fulfillmentId, stage, notes, estimatedCompletion } = body

          const updateData: any = {
            workflow_stage: stage,
            updated_at: new Date().toISOString()
          }

          if (notes) updateData.notes = notes
          if (estimatedCompletion) updateData.estimated_completion = estimatedCompletion
          
          if (stage === 'delivered' || stage === 'shipped') {
            updateData.actual_completion = new Date().toISOString()
          }

          const { data: updatedFulfillment, error } = await supabase
            .from('order_fulfillment_workflow')
            .update(updateData)
            .eq('id', fulfillmentId)
            .eq('vendor_id', user.user.id)
            .select()
            .single()

          if (error) throw error

          // Update order status if delivered
          if (stage === 'delivered') {
            await supabase
              .from('orders')
              .update({ status: 'delivered' })
              .eq('id', updatedFulfillment.order_id)
          }

          return new Response(JSON.stringify({ fulfillment: updatedFulfillment }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'process-return') {
          const { returnId, action: returnAction, refundAmount, notes } = body

          const updateData: any = {
            status: returnAction === 'approve' ? 'approved' : 'rejected',
            processed_at: new Date().toISOString(),
            processed_by: user.user.id,
            admin_notes: notes
          }

          if (returnAction === 'approve' && refundAmount) {
            updateData.refund_amount = refundAmount
          }

          const { data: updatedReturn, error } = await supabase
            .from('returns')
            .update(updateData)
            .eq('id', returnId)
            .eq('vendor_id', user.user.id)
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ return: updatedReturn }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'create-fulfillment') {
          const { orderId, assignedTo, estimatedCompletion, notes } = body

          const { data: newFulfillment, error } = await supabase
            .from('order_fulfillment_workflow')
            .insert({
              order_id: orderId,
              vendor_id: user.user.id,
              workflow_stage: 'processing',
              assigned_to: assignedTo,
              estimated_completion: estimatedCompletion,
              notes,
            })
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ fulfillment: newFulfillment }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      case 'PUT':
        const updateBody = await req.json()
        
        if (action === 'update-order-status') {
          const { orderId, status, notes } = updateBody

          const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update({ 
              status,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .eq('vendor_id', user.user.id)
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ order: updatedOrder }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Order Management Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})