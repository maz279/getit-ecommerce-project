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
        if (action === 'payouts') {
          const { data: payouts, error } = await supabase
            .from('commission_payouts')
            .select('*')
            .eq('vendor_id', user.user.id)
            .order('created_at', { ascending: false })
            .limit(50)

          if (error) throw error

          return new Response(JSON.stringify({ payouts }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'invoices') {
          const { data: invoices, error } = await supabase
            .from('vendor_invoices')
            .select('*')
            .eq('vendor_id', user.user.id)
            .order('created_at', { ascending: false })
            .limit(50)

          if (error) throw error

          return new Response(JSON.stringify({ invoices }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'financial-summary') {
          const startDate = url.searchParams.get('startDate')
          const endDate = url.searchParams.get('endDate')

          // Get commission data
          let commissionQuery = supabase
            .from('vendor_commissions')
            .select('*')
            .eq('vendor_id', user.user.id)

          if (startDate && endDate) {
            commissionQuery = commissionQuery
              .gte('transaction_date', startDate)
              .lte('transaction_date', endDate)
          }

          const { data: commissions, error: commissionError } = await commissionQuery
          if (commissionError) throw commissionError

          // Get payout data
          let payoutQuery = supabase
            .from('commission_payouts')
            .select('*')
            .eq('vendor_id', user.user.id)

          if (startDate && endDate) {
            payoutQuery = payoutQuery
              .gte('created_at', startDate)
              .lte('created_at', endDate)
          }

          const { data: payouts, error: payoutError } = await payoutQuery
          if (payoutError) throw payoutError

          // Calculate summary
          const totalCommissions = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0)
          const totalPayouts = payouts.reduce((sum, p) => sum + (p.net_payout_amount || 0), 0)
          const pendingCommissions = commissions
            .filter(c => !payouts.some(p => p.commission_ids.includes(c.id)))
            .reduce((sum, c) => sum + (c.commission_amount || 0), 0)

          const monthlyBreakdown = {}
          commissions.forEach(commission => {
            const month = commission.transaction_date.substring(0, 7)
            if (!monthlyBreakdown[month]) {
              monthlyBreakdown[month] = { commissions: 0, payouts: 0 }
            }
            monthlyBreakdown[month].commissions += commission.commission_amount || 0
          })

          payouts.forEach(payout => {
            const month = payout.created_at.substring(0, 7)
            if (monthlyBreakdown[month]) {
              monthlyBreakdown[month].payouts += payout.net_payout_amount || 0
            }
          })

          return new Response(JSON.stringify({
            summary: {
              totalCommissions,
              totalPayouts,
              pendingCommissions,
              balance: totalCommissions - totalPayouts,
            },
            monthlyBreakdown,
            recentTransactions: commissions.slice(0, 10),
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'generate-report') {
          const reportType = url.searchParams.get('reportType')
          const startDate = url.searchParams.get('startDate')
          const endDate = url.searchParams.get('endDate')

          let reportData = {}

          switch (reportType) {
            case 'revenue':
              const { data: revenueData, error: revenueError } = await supabase
                .from('sales_analytics')
                .select('*')
                .eq('vendor_id', user.user.id)
                .gte('analytics_date', startDate)
                .lte('analytics_date', endDate)
                .order('analytics_date', { ascending: true })

              if (revenueError) throw revenueError

              reportData = {
                type: 'revenue',
                period: `${startDate} to ${endDate}`,
                data: revenueData,
                summary: {
                  totalRevenue: revenueData.reduce((sum, d) => sum + (d.total_revenue || 0), 0),
                  totalOrders: revenueData.reduce((sum, d) => sum + (d.total_orders || 0), 0),
                  avgOrderValue: revenueData.reduce((sum, d) => sum + (d.average_order_value || 0), 0) / revenueData.length,
                }
              }
              break

            case 'commission':
              const { data: commissionData, error: commissionError } = await supabase
                .from('vendor_commissions')
                .select('*')
                .eq('vendor_id', user.user.id)
                .gte('transaction_date', startDate)
                .lte('transaction_date', endDate)
                .order('transaction_date', { ascending: true })

              if (commissionError) throw commissionError

              reportData = {
                type: 'commission',
                period: `${startDate} to ${endDate}`,
                data: commissionData,
                summary: {
                  totalCommissions: commissionData.reduce((sum, c) => sum + (c.commission_amount || 0), 0),
                  totalTransactions: commissionData.length,
                  avgCommissionRate: commissionData.reduce((sum, c) => sum + (c.commission_rate || 0), 0) / commissionData.length,
                }
              }
              break

            default:
              throw new Error('Invalid report type')
          }

          return new Response(JSON.stringify({ report: reportData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      case 'POST':
        const body = await req.json()

        if (action === 'create-invoice') {
          const { invoiceType, lineItems, billingAddress, dueDate, notes } = body

          // Generate invoice number
          const invoiceNumber = `INV-${Date.now()}-${user.user.id.substring(0, 8)}`

          // Calculate totals
          const subtotal = lineItems.reduce((sum: number, item: any) => 
            sum + (item.quantity * item.rate), 0)
          const taxAmount = subtotal * 0.15 // 15% tax
          const totalAmount = subtotal + taxAmount

          const { data: newInvoice, error } = await supabase
            .from('vendor_invoices')
            .insert({
              vendor_id: user.user.id,
              invoice_number: invoiceNumber,
              invoice_type: invoiceType,
              total_amount: totalAmount,
              tax_amount: taxAmount,
              net_amount: subtotal,
              due_date: dueDate,
              billing_address: billingAddress,
              line_items: lineItems,
              notes,
            })
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ invoice: newInvoice }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'request-payout') {
          const { amount, paymentMethod, bankAccountInfo, notes } = body

          // Check available commission balance
          const { data: commissions, error: commissionError } = await supabase
            .from('vendor_commissions')
            .select('commission_amount')
            .eq('vendor_id', user.user.id)
            .eq('payout_status', 'pending')

          if (commissionError) throw commissionError

          const availableBalance = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0)

          if (amount > availableBalance) {
            return new Response(JSON.stringify({ 
              error: 'Insufficient commission balance' 
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          // Create payout request
          const { data: payoutRequest, error: payoutError } = await supabase
            .from('commission_payouts')
            .insert({
              vendor_id: user.user.id,
              total_commission: amount,
              net_payout_amount: amount * 0.97, // 3% processing fee
              payment_method: paymentMethod,
              bank_account_info: bankAccountInfo,
              notes,
              payout_batch_id: `BATCH-${Date.now()}`,
            })
            .select()
            .single()

          if (payoutError) throw payoutError

          return new Response(JSON.stringify({ payoutRequest }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      case 'PUT':
        const updateBody = await req.json()

        if (action === 'update-invoice') {
          const { invoiceId, updates } = updateBody

          const { data: updatedInvoice, error } = await supabase
            .from('vendor_invoices')
            .update(updates)
            .eq('id', invoiceId)
            .eq('vendor_id', user.user.id)
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ invoice: updatedInvoice }), {
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
    console.error('Financial Management Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})