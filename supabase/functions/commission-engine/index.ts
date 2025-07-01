import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'calculate-commission':
        return await calculateCommission(req, supabaseClient)
      case 'process-payout':
        return await processPayout(req, supabaseClient)
      case 'generate-payout-batch':
        return await generatePayoutBatch(req, supabaseClient)
      case 'vendor-earnings':
        return await getVendorEarnings(req, supabaseClient)
      case 'commission-analytics':
        return await getCommissionAnalytics(req, supabaseClient)
      case 'payout-schedule':
        return await getPayoutSchedule(req, supabaseClient)
      case 'commission-disputes':
        return await handleCommissionDisputes(req, supabaseClient)
      case 'automated-payouts':
        return await runAutomatedPayouts(req, supabaseClient)
      case 'commission-reconciliation':
        return await performCommissionReconciliation(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Commission engine error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function calculateCommission(req: Request, supabaseClient: any) {
  const { order_id, vendor_id, order_amount, product_category, commission_overrides } = await req.json()
  
  console.log('Calculating commission:', { order_id, vendor_id, order_amount, product_category })
  
  // Get vendor commission rate
  const { data: commissionRate } = await supabaseClient
    .from('vendor_commission_rates')
    .select('*')
    .eq('vendor_id', vendor_id)
    .eq('is_active', true)
    .or(`product_type.eq.${product_category},product_type.is.null`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Use default rate if no specific rate found
  const defaultRate = {
    base_rate: 10.0, // 10%
    rate_type: 'percentage',
    platform_fee_rate: 2.5, // 2.5% platform fee
    minimum_amount: 10,
    maximum_amount: 10000
  }

  const rate = commissionRate || defaultRate
  
  // Apply commission overrides if provided
  const effectiveRate = { ...rate, ...commission_overrides }
  
  // Calculate base commission
  let commissionAmount = 0
  if (effectiveRate.rate_type === 'percentage') {
    commissionAmount = (order_amount * effectiveRate.base_rate) / 100
  } else {
    commissionAmount = effectiveRate.base_rate
  }
  
  // Apply min/max limits
  if (effectiveRate.minimum_amount && commissionAmount < effectiveRate.minimum_amount) {
    commissionAmount = effectiveRate.minimum_amount
  }
  if (effectiveRate.maximum_amount && commissionAmount > effectiveRate.maximum_amount) {
    commissionAmount = effectiveRate.maximum_amount
  }
  
  // Calculate platform fee
  const platformFee = (commissionAmount * (effectiveRate.platform_fee_rate || 0)) / 100
  const netCommission = commissionAmount - platformFee
  
  // Calculate taxes (VAT in Bangladesh)
  const vatRate = 15 // 15% VAT
  const vatAmount = (netCommission * vatRate) / 100
  const finalCommission = netCommission - vatAmount
  
  const commissionBreakdown = {
    order_id,
    vendor_id,
    gross_amount: order_amount,
    commission_rate: effectiveRate.base_rate,
    commission_amount: commissionAmount,
    platform_fee: platformFee,
    platform_fee_rate: effectiveRate.platform_fee_rate || 0,
    vat_amount: vatAmount,
    vat_rate: vatRate,
    net_commission: finalCommission,
    rate_type: effectiveRate.rate_type,
    product_category,
    calculation_timestamp: new Date().toISOString()
  }
  
  // Store commission record
  const { data: commissionRecord, error } = await supabaseClient
    .from('vendor_commissions')
    .insert({
      vendor_id,
      order_id,
      gross_amount: order_amount,
      commission_amount: commissionAmount,
      platform_fee: platformFee,
      net_commission: finalCommission,
      commission_rate: effectiveRate.base_rate,
      rate_type: effectiveRate.rate_type,
      product_category,
      transaction_date: new Date().toISOString().split('T')[0],
      status: 'calculated'
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to store commission: ${error.message}`)
  }

  return new Response(JSON.stringify({
    success: true,
    commission: commissionBreakdown,
    commission_id: commissionRecord.id
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function processPayout(req: Request, supabaseClient: any) {
  const { vendor_id, payout_amount, payout_method, payout_details } = await req.json()
  
  console.log('Processing payout:', { vendor_id, payout_amount, payout_method })
  
  // Validate vendor and payout amount
  const { data: vendor } = await supabaseClient
    .from('vendors')
    .select('*')
    .eq('id', vendor_id)
    .single()

  if (!vendor) {
    throw new Error('Vendor not found')
  }

  // Calculate available commission for payout
  const { data: pendingCommissions } = await supabaseClient
    .from('vendor_commissions')
    .select('SUM(net_commission)')
    .eq('vendor_id', vendor_id)
    .eq('status', 'calculated')
    .single()

  const availableAmount = pendingCommissions?.sum || 0
  
  if (payout_amount > availableAmount) {
    throw new Error(`Insufficient commission balance. Available: ${availableAmount}`)
  }

  // Create payout record
  const { data: payout, error: payoutError } = await supabaseClient
    .from('commission_payouts')
    .insert({
      vendor_id,
      payout_amount,
      payment_method: payout_method,
      payment_details: payout_details,
      status: 'pending',
      scheduled_date: new Date().toISOString().split('T')[0],
      payout_batch_id: `BATCH_${Date.now()}`
    })
    .select()
    .single()

  if (payoutError) {
    throw new Error(`Failed to create payout: ${payoutError.message}`)
  }

  // Mark commissions as pending payout
  const commissionsToUpdate = await getCommissionsForPayout(supabaseClient, vendor_id, payout_amount)
  
  for (const commission of commissionsToUpdate) {
    await supabaseClient
      .from('vendor_commissions')
      .update({ 
        status: 'pending_payout',
        payout_id: payout.id 
      })
      .eq('id', commission.id)
  }

  // Process payment based on method
  let paymentResult
  try {
    paymentResult = await processPayment(payout_method, payout_details, payout_amount)
  } catch (paymentError) {
    // Rollback on payment failure
    await supabaseClient
      .from('commission_payouts')
      .update({ status: 'failed', failure_reason: paymentError.message })
      .eq('id', payout.id)
    
    throw new Error(`Payment failed: ${paymentError.message}`)
  }

  // Update payout status on success
  await supabaseClient
    .from('commission_payouts')
    .update({ 
      status: 'completed',
      processed_date: new Date().toISOString(),
      payment_reference: paymentResult.reference,
      payment_details: paymentResult
    })
    .eq('id', payout.id)

  // Mark commissions as paid
  for (const commission of commissionsToUpdate) {
    await supabaseClient
      .from('vendor_commissions')
      .update({ status: 'paid' })
      .eq('id', commission.id)
  }

  return new Response(JSON.stringify({
    success: true,
    payout_id: payout.id,
    payment_reference: paymentResult.reference,
    amount_paid: payout_amount,
    commissions_paid: commissionsToUpdate.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function generatePayoutBatch(req: Request, supabaseClient: any) {
  const { vendor_ids, minimum_payout_amount = 500, payout_frequency = 'weekly' } = await req.json()
  
  console.log('Generating payout batch:', { vendor_ids, minimum_payout_amount, payout_frequency })
  
  const batchId = `BATCH_${Date.now()}`
  const payouts = []
  
  // Get vendors with pending commissions
  let vendorQuery = supabaseClient
    .from('vendor_commissions')
    .select(`
      vendor_id,
      SUM(net_commission) as total_commission,
      COUNT(*) as commission_count,
      vendor:vendors(business_name, payout_method, bank_details, status)
    `)
    .eq('status', 'calculated')
    .gte('net_commission', 0)
    
  if (vendor_ids && vendor_ids.length > 0) {
    vendorQuery = vendorQuery.in('vendor_id', vendor_ids)
  }
  
  const { data: vendorCommissions } = await vendorQuery

  const eligibleVendors = (vendorCommissions || [])
    .filter(vc => 
      vc.total_commission >= minimum_payout_amount && 
      vc.vendor?.status === 'active'
    )

  for (const vendorCommission of eligibleVendors) {
    const { data: payout, error } = await supabaseClient
      .from('commission_payouts')
      .insert({
        vendor_id: vendorCommission.vendor_id,
        payout_amount: vendorCommission.total_commission,
        payment_method: vendorCommission.vendor.payout_method || 'bank_transfer',
        payment_details: vendorCommission.vendor.bank_details || {},
        status: 'pending',
        scheduled_date: new Date().toISOString().split('T')[0],
        payout_batch_id: batchId,
        commission_count: vendorCommission.commission_count
      })
      .select()
      .single()

    if (!error) {
      payouts.push(payout)
    }
  }

  // Create batch processing record
  const { data: batch } = await supabaseClient
    .from('payout_batch_processing')
    .insert({
      batch_id: batchId,
      total_payouts: payouts.length,
      total_amount: payouts.reduce((sum, p) => sum + p.payout_amount, 0),
      status: 'created',
      frequency: payout_frequency,
      minimum_amount: minimum_payout_amount
    })
    .select()
    .single()

  return new Response(JSON.stringify({
    success: true,
    batch_id: batchId,
    payouts_created: payouts.length,
    total_amount: payouts.reduce((sum, p) => sum + p.payout_amount, 0),
    eligible_vendors: eligibleVendors.length,
    batch_details: batch
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getVendorEarnings(req: Request, supabaseClient: any) {
  const { vendor_id, period = 'current_month', include_projections = true } = await req.json()
  
  const { startDate, endDate } = getPeriodDates(period)
  
  // Get commission data
  const { data: commissions } = await supabaseClient
    .from('vendor_commissions')
    .select('*')
    .eq('vendor_id', vendor_id)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)

  // Get payout data
  const { data: payouts } = await supabaseClient
    .from('commission_payouts')
    .select('*')
    .eq('vendor_id', vendor_id)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)

  const earnings = {
    vendor_id,
    period,
    total_gross_sales: commissions?.reduce((sum, c) => sum + (c.gross_amount || 0), 0) || 0,
    total_commission_earned: commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0,
    total_platform_fees: commissions?.reduce((sum, c) => sum + (c.platform_fee || 0), 0) || 0,
    total_net_commission: commissions?.reduce((sum, c) => sum + (c.net_commission || 0), 0) || 0,
    pending_commission: commissions?.filter(c => c.status === 'calculated').reduce((sum, c) => sum + (c.net_commission || 0), 0) || 0,
    paid_commission: commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.net_commission || 0), 0) || 0,
    total_orders: commissions?.length || 0,
    successful_payouts: payouts?.filter(p => p.status === 'completed').length || 0,
    pending_payouts: payouts?.filter(p => p.status === 'pending').length || 0,
    failed_payouts: payouts?.filter(p => p.status === 'failed').length || 0,
    average_commission_per_order: commissions?.length > 0 
      ? (commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0) / commissions.length)
      : 0,
    commission_rate_average: commissions?.length > 0
      ? (commissions.reduce((sum, c) => sum + (c.commission_rate || 0), 0) / commissions.length)
      : 0
  }

  // Add projections if requested
  if (include_projections) {
    earnings.projections = await calculateEarningsProjections(supabaseClient, vendor_id, commissions || [])
  }

  return new Response(JSON.stringify({
    success: true,
    earnings,
    summary: {
      available_for_payout: earnings.pending_commission,
      next_payout_estimate: calculateNextPayoutDate(),
      performance_vs_last_period: await calculatePerformanceComparison(supabaseClient, vendor_id, period)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getCommissionAnalytics(req: Request, supabaseClient: any) {
  const { period = 'current_month', vendor_ids, analytics_type = 'summary' } = await req.json()
  
  const { startDate, endDate } = getPeriodDates(period)
  
  let query = supabaseClient
    .from('commission_analytics')
    .select('*')
    .gte('analytics_date', startDate)
    .lte('analytics_date', endDate)

  if (vendor_ids && vendor_ids.length > 0) {
    query = query.in('vendor_id', vendor_ids)
  }

  const { data: analytics } = await query

  const processedAnalytics = {
    period,
    total_vendors: new Set(analytics?.map(a => a.vendor_id)).size || 0,
    total_commission_paid: analytics?.reduce((sum, a) => sum + (a.total_commission_earned || 0), 0) || 0,
    total_platform_fees: analytics?.reduce((sum, a) => sum + (a.total_platform_fees || 0), 0) || 0,
    total_orders_processed: analytics?.reduce((sum, a) => sum + (a.total_orders || 0), 0) || 0,
    average_commission_rate: analytics?.length > 0
      ? analytics.reduce((sum, a) => sum + (a.commission_rate_percentage || 0), 0) / analytics.length
      : 0,
    top_performing_vendors: getTopVendors(analytics || [], 'total_commission_earned', 10),
    commission_trends: generateCommissionTrends(analytics || []),
    category_breakdown: generateCategoryBreakdown(analytics || [])
  }

  return new Response(JSON.stringify({
    success: true,
    analytics: processedAnalytics,
    raw_data: analytics_type === 'detailed' ? analytics : undefined
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPayoutSchedule(req: Request, supabaseClient: any) {
  const { vendor_id, schedule_type = 'upcoming', days_ahead = 30 } = await req.json()
  
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days_ahead)
  
  let query = supabaseClient
    .from('commission_payouts')
    .select(`
      *,
      vendor:vendors(business_name, payout_method)
    `)
    .gte('scheduled_date', new Date().toISOString().split('T')[0])
    .lte('scheduled_date', endDate.toISOString().split('T')[0])
    .order('scheduled_date', { ascending: true })

  if (vendor_id) {
    query = query.eq('vendor_id', vendor_id)
  }

  const { data: payouts } = await query

  const schedule = {
    upcoming_payouts: payouts || [],
    total_amount_scheduled: payouts?.reduce((sum, p) => sum + (p.payout_amount || 0), 0) || 0,
    vendors_count: new Set(payouts?.map(p => p.vendor_id)).size || 0,
    schedule_summary: generatePayoutScheduleSummary(payouts || [])
  }

  return new Response(JSON.stringify({
    success: true,
    payout_schedule: schedule,
    generated_at: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleCommissionDisputes(req: Request, supabaseClient: any) {
  const { action, dispute_data } = await req.json()
  
  switch (action) {
    case 'create':
      return await createCommissionDispute(req, supabaseClient, dispute_data)
    case 'resolve':
      return await resolveCommissionDispute(req, supabaseClient, dispute_data)
    case 'list':
      return await listCommissionDisputes(req, supabaseClient, dispute_data)
    default:
      throw new Error('Invalid dispute action')
  }
}

async function runAutomatedPayouts(req: Request, supabaseClient: any) {
  const { dry_run = false, minimum_amount = 500, payout_frequency = 'weekly' } = await req.json()
  
  console.log('Running automated payouts:', { dry_run, minimum_amount, payout_frequency })
  
  // Get eligible vendors
  const { data: eligibleCommissions } = await supabaseClient
    .from('vendor_commissions')
    .select(`
      vendor_id,
      SUM(net_commission) as total_commission,
      COUNT(*) as commission_count,
      vendor:vendors(business_name, payout_method, bank_details, status, payout_frequency)
    `)
    .eq('status', 'calculated')
    .gte('net_commission', 0)

  const eligibleVendors = (eligibleCommissions || [])
    .filter(vc => 
      vc.total_commission >= minimum_amount && 
      vc.vendor?.status === 'active' &&
      shouldProcessPayout(vc.vendor, payout_frequency)
    )

  if (dry_run) {
    return new Response(JSON.stringify({
      success: true,
      dry_run: true,
      eligible_vendors: eligibleVendors.length,
      total_payout_amount: eligibleVendors.reduce((sum, v) => sum + v.total_commission, 0),
      vendors: eligibleVendors.map(v => ({
        vendor_id: v.vendor_id,
        vendor_name: v.vendor.business_name,
        payout_amount: v.total_commission,
        commission_count: v.commission_count
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Process actual payouts
  const processedPayouts = []
  const failedPayouts = []

  for (const vendor of eligibleVendors) {
    try {
      const payoutResult = await processPayout(
        new Request('', {
          method: 'POST',
          body: JSON.stringify({
            vendor_id: vendor.vendor_id,
            payout_amount: vendor.total_commission,
            payout_method: vendor.vendor.payout_method || 'bank_transfer',
            payout_details: vendor.vendor.bank_details || {}
          })
        }),
        supabaseClient
      )
      
      const result = await payoutResult.json()
      if (result.success) {
        processedPayouts.push(result)
      } else {
        failedPayouts.push({ vendor_id: vendor.vendor_id, error: result.error })
      }
    } catch (error) {
      failedPayouts.push({ vendor_id: vendor.vendor_id, error: error.message })
    }
  }

  return new Response(JSON.stringify({
    success: true,
    automated_run: true,
    processed_payouts: processedPayouts.length,
    failed_payouts: failedPayouts.length,
    total_amount_processed: processedPayouts.reduce((sum, p) => sum + (p.amount_paid || 0), 0),
    failures: failedPayouts
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function performCommissionReconciliation(req: Request, supabaseClient: any) {
  const { period, vendor_ids, reconciliation_type = 'standard' } = await req.json()
  
  const { startDate, endDate } = getPeriodDates(period)
  
  console.log('Performing commission reconciliation:', { period, vendor_ids, reconciliation_type })
  
  // Get commission data for reconciliation
  let commissionQuery = supabaseClient
    .from('vendor_commissions')
    .select('*')
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)

  if (vendor_ids && vendor_ids.length > 0) {
    commissionQuery = commissionQuery.in('vendor_id', vendor_ids)
  }

  const { data: commissions } = await commissionQuery
  
  const reconciliationResults = []
  
  // Group by vendor for reconciliation
  const vendorGroups = groupCommissionsByVendor(commissions || [])
  
  for (const [vendorId, vendorCommissions] of Object.entries(vendorGroups)) {
    const calculated = vendorCommissions.reduce((sum: number, c: any) => sum + (c.net_commission || 0), 0)
    const paid = vendorCommissions.filter((c: any) => c.status === 'paid').reduce((sum: number, c: any) => sum + (c.net_commission || 0), 0)
    const pending = vendorCommissions.filter((c: any) => c.status === 'calculated').reduce((sum: number, c: any) => sum + (c.net_commission || 0), 0)
    
    const reconciliation = {
      vendor_id: vendorId,
      period: `${startDate} to ${endDate}`,
      calculated_commission: calculated,
      paid_commission: paid,
      pending_commission: pending,
      variance: calculated - paid - pending,
      commission_count: vendorCommissions.length,
      reconciliation_status: Math.abs(calculated - paid - pending) < 0.01 ? 'balanced' : 'discrepancy',
      reconciled_at: new Date().toISOString()
    }
    
    // Store reconciliation record
    await supabaseClient
      .from('commission_reconciliation')
      .insert(reconciliation)
    
    reconciliationResults.push(reconciliation)
  }

  const summary = {
    total_vendors_reconciled: reconciliationResults.length,
    total_calculated: reconciliationResults.reduce((sum, r) => sum + r.calculated_commission, 0),
    total_paid: reconciliationResults.reduce((sum, r) => sum + r.paid_commission, 0),
    total_pending: reconciliationResults.reduce((sum, r) => sum + r.pending_commission, 0),
    vendors_with_discrepancies: reconciliationResults.filter(r => r.reconciliation_status === 'discrepancy').length,
    total_variance: reconciliationResults.reduce((sum, r) => sum + Math.abs(r.variance), 0)
  }

  return new Response(JSON.stringify({
    success: true,
    reconciliation_summary: summary,
    vendor_reconciliations: reconciliationResults,
    period: `${startDate} to ${endDate}`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Helper functions
async function getCommissionsForPayout(supabaseClient: any, vendorId: string, payoutAmount: number) {
  const { data: commissions } = await supabaseClient
    .from('vendor_commissions')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('status', 'calculated')
    .order('transaction_date', { ascending: true })

  const selectedCommissions = []
  let totalSelected = 0

  for (const commission of commissions || []) {
    if (totalSelected + commission.net_commission <= payoutAmount) {
      selectedCommissions.push(commission)
      totalSelected += commission.net_commission
    } else {
      break
    }
  }

  return selectedCommissions
}

async function processPayment(method: string, details: any, amount: number) {
  // Mock payment processing - integrate with actual payment gateways
  console.log('Processing payment:', { method, amount })
  
  switch (method) {
    case 'bank_transfer':
      return {
        success: true,
        reference: `BANK_${Date.now()}`,
        method: 'bank_transfer',
        amount,
        processed_at: new Date().toISOString()
      }
    case 'bkash':
      return {
        success: true,
        reference: `BKASH_${Date.now()}`,
        method: 'bkash',
        amount,
        processed_at: new Date().toISOString()
      }
    case 'nagad':
      return {
        success: true,
        reference: `NAGAD_${Date.now()}`,
        method: 'nagad',
        amount,
        processed_at: new Date().toISOString()
      }
    default:
      throw new Error(`Unsupported payment method: ${method}`)
  }
}

function getPeriodDates(period: string) {
  const now = new Date()
  let startDate: string
  let endDate: string

  switch (period) {
    case 'today':
      startDate = now.toISOString().split('T')[0]
      endDate = startDate
      break
    case 'current_week':
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      startDate = weekStart.toISOString().split('T')[0]
      endDate = new Date().toISOString().split('T')[0]
      break
    case 'current_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      endDate = new Date().toISOString().split('T')[0]
      break
    case 'last_30_days':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      endDate = new Date().toISOString().split('T')[0]
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      endDate = new Date().toISOString().split('T')[0]
  }

  return { startDate, endDate }
}

async function calculateEarningsProjections(supabaseClient: any, vendorId: string, commissions: any[]) {
  // Simple projection based on historical data
  const monthlyAverage = commissions.length > 0 
    ? commissions.reduce((sum, c) => sum + (c.net_commission || 0), 0) / Math.max(1, commissions.length)
    : 0

  return {
    next_month_estimate: monthlyAverage * 30, // Rough estimate
    quarterly_estimate: monthlyAverage * 90,
    annual_estimate: monthlyAverage * 365,
    confidence_level: commissions.length >= 30 ? 'high' : commissions.length >= 10 ? 'medium' : 'low'
  }
}

function calculateNextPayoutDate() {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  return nextWeek.toISOString().split('T')[0]
}

async function calculatePerformanceComparison(supabaseClient: any, vendorId: string, period: string) {
  // Mock performance comparison - would need historical data
  return {
    commission_growth: '+15.3%',
    order_growth: '+8.7%',
    average_order_value_change: '+2.1%'
  }
}

function getTopVendors(analytics: any[], metric: string, limit: number) {
  return analytics
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, limit)
    .map(a => ({
      vendor_id: a.vendor_id,
      value: a[metric] || 0
    }))
}

function generateCommissionTrends(analytics: any[]) {
  // Group by date and calculate trends
  const dateGroups: any = {}
  
  analytics.forEach(a => {
    const date = a.analytics_date
    if (!dateGroups[date]) {
      dateGroups[date] = {
        date,
        total_commission: 0,
        total_orders: 0,
        vendor_count: 0
      }
    }
    dateGroups[date].total_commission += a.total_commission_earned || 0
    dateGroups[date].total_orders += a.total_orders || 0
    dateGroups[date].vendor_count++
  })

  return Object.values(dateGroups).sort((a: any, b: any) => a.date.localeCompare(b.date))
}

function generateCategoryBreakdown(analytics: any[]) {
  // Mock category breakdown - would need category data
  return [
    { category: 'Electronics', commission: 125000, percentage: 35 },
    { category: 'Fashion', commission: 89000, percentage: 25 },
    { category: 'Books', commission: 67000, percentage: 19 },
    { category: 'Home & Garden', commission: 45000, percentage: 13 },
    { category: 'Others', commission: 28000, percentage: 8 }
  ]
}

function generatePayoutScheduleSummary(payouts: any[]) {
  const summary: any = {}
  
  payouts.forEach(payout => {
    const date = payout.scheduled_date
    if (!summary[date]) {
      summary[date] = {
        date,
        payout_count: 0,
        total_amount: 0,
        vendors: []
      }
    }
    summary[date].payout_count++
    summary[date].total_amount += payout.payout_amount || 0
    summary[date].vendors.push(payout.vendor_id)
  })

  return Object.values(summary)
}

async function createCommissionDispute(req: Request, supabaseClient: any, disputeData: any) {
  const { data: dispute, error } = await supabaseClient
    .from('commission_disputes')
    .insert({
      vendor_id: disputeData.vendor_id,
      commission_id: disputeData.commission_id,
      dispute_reason: disputeData.reason,
      disputed_amount: disputeData.amount,
      dispute_description: disputeData.description,
      status: 'open',
      priority_level: disputeData.priority || 'medium'
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create dispute: ${error.message}`)
  }

  return new Response(JSON.stringify({
    success: true,
    dispute_id: dispute.id,
    status: 'created'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function resolveCommissionDispute(req: Request, supabaseClient: any, disputeData: any) {
  const { dispute_id, resolution, adjustment_amount } = disputeData

  const { data: dispute, error } = await supabaseClient
    .from('commission_disputes')
    .update({
      status: 'resolved',
      resolution_notes: resolution,
      adjustment_amount: adjustment_amount || 0,
      resolved_at: new Date().toISOString()
    })
    .eq('id', dispute_id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to resolve dispute: ${error.message}`)
  }

  return new Response(JSON.stringify({
    success: true,
    dispute_id,
    resolution_status: 'resolved'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function listCommissionDisputes(req: Request, supabaseClient: any, filters: any) {
  let query = supabaseClient
    .from('commission_disputes')
    .select(`
      *,
      vendor:vendors(business_name),
      commission:vendor_commissions(gross_amount, commission_amount)
    `)
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.vendor_id) {
    query = query.eq('vendor_id', filters.vendor_id)
  }

  const { data: disputes, error } = await query

  if (error) {
    throw new Error(`Failed to get disputes: ${error.message}`)
  }

  return new Response(JSON.stringify({
    success: true,
    disputes: disputes || [],
    total_count: disputes?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function shouldProcessPayout(vendor: any, frequency: string): boolean {
  // Mock logic - would check last payout date and frequency
  return true
}

function groupCommissionsByVendor(commissions: any[]) {
  const groups: any = {}
  
  commissions.forEach(commission => {
    const vendorId = commission.vendor_id
    if (!groups[vendorId]) {
      groups[vendorId] = []
    }
    groups[vendorId].push(commission)
  })

  return groups
}