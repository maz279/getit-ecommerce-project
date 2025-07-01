import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  type: 'email' | 'sms' | 'push' | 'in-app'
  recipients: string[]
  subject?: string
  message: string
  template?: string
  data?: any
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  variables: string[]
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
      case 'send-notification':
        return await sendNotification(req, supabaseClient)
      case 'send-email':
        return await sendEmail(req, supabaseClient)
      case 'send-sms':
        return await sendSMS(req, supabaseClient)
      case 'send-push':
        return await sendPushNotification(req, supabaseClient)
      case 'create-template':
        return await createTemplate(req, supabaseClient)
      case 'bulk-notify':
        return await bulkNotify(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Notification system error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function sendNotification(req: Request, supabaseClient: any) {
  const notificationData: NotificationRequest = await req.json()
  
  const results = []
  
  switch (notificationData.type) {
    case 'email':
      const emailResult = await processEmailNotification(notificationData, supabaseClient)
      results.push(emailResult)
      break
    case 'sms':
      const smsResult = await processSMSNotification(notificationData, supabaseClient)
      results.push(smsResult)
      break
    case 'push':
      const pushResult = await processPushNotification(notificationData, supabaseClient)
      results.push(pushResult)
      break
    case 'in-app':
      const inAppResult = await processInAppNotification(notificationData, supabaseClient)
      results.push(inAppResult)
      break
    default:
      return new Response(JSON.stringify({ error: 'Invalid notification type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }

  // Log notification
  await supabaseClient.from('notification_logs').insert({
    type: notificationData.type,
    recipients: notificationData.recipients,
    subject: notificationData.subject,
    message: notificationData.message,
    template: notificationData.template,
    priority: notificationData.priority || 'normal',
    status: 'sent',
    sent_at: new Date().toISOString()
  })

  return new Response(JSON.stringify({
    success: true,
    results
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function processEmailNotification(notificationData: NotificationRequest, supabaseClient: any) {
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
  
  let emailContent = notificationData.message
  let emailSubject = notificationData.subject || 'Notification'

  // If template is specified, load and process it
  if (notificationData.template) {
    const { data: template } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('name', notificationData.template)
      .single()

    if (template) {
      emailContent = processTemplate(template.html_content, notificationData.data || {})
      emailSubject = processTemplate(template.subject, notificationData.data || {})
    }
  }

  const emailResults = []
  
  for (const recipient of notificationData.recipients) {
    try {
      const result = await resend.emails.send({
        from: 'GetIt Platform <notifications@resend.dev>',
        to: [recipient],
        subject: emailSubject,
        html: emailContent
      })
      
      emailResults.push({ recipient, success: true, result })
    } catch (error) {
      emailResults.push({ recipient, success: false, error: error.message })
    }
  }

  return { type: 'email', results: emailResults }
}

async function processSMSNotification(notificationData: NotificationRequest, supabaseClient: any) {
  // Mock SMS integration for Bangladesh providers
  // In production, integrate with SSL Wireless, Banglalink, Robi, etc.
  
  const smsResults = []
  
  for (const recipient of notificationData.recipients) {
    try {
      // Mock SMS sending
      const result = await sendSMSViaBangladeshProvider(recipient, notificationData.message)
      smsResults.push({ recipient, success: true, result })
    } catch (error) {
      smsResults.push({ recipient, success: false, error: error.message })
    }
  }

  return { type: 'sms', results: smsResults }
}

async function processPushNotification(notificationData: NotificationRequest, supabaseClient: any) {
  // Mock push notification using FCM
  const pushResults = []
  
  for (const recipient of notificationData.recipients) {
    try {
      // Get user's FCM token
      const { data: userDevice } = await supabaseClient
        .from('user_devices')
        .select('fcm_token')
        .eq('user_id', recipient)
        .single()

      if (userDevice?.fcm_token) {
        const result = await sendFCMNotification(userDevice.fcm_token, {
          title: notificationData.subject || 'Notification',
          body: notificationData.message,
          data: notificationData.data
        })
        pushResults.push({ recipient, success: true, result })
      } else {
        pushResults.push({ recipient, success: false, error: 'No FCM token found' })
      }
    } catch (error) {
      pushResults.push({ recipient, success: false, error: error.message })
    }
  }

  return { type: 'push', results: pushResults }
}

async function processInAppNotification(notificationData: NotificationRequest, supabaseClient: any) {
  const inAppResults = []
  
  for (const recipient of notificationData.recipients) {
    try {
      await supabaseClient.from('notifications').insert({
        user_id: recipient,
        title: notificationData.subject || 'Notification',
        message: notificationData.message,
        type: 'info',
        metadata: notificationData.data || {},
        read: false
      })
      
      inAppResults.push({ recipient, success: true })
    } catch (error) {
      inAppResults.push({ recipient, success: false, error: error.message })
    }
  }

  return { type: 'in-app', results: inAppResults }
}

function processTemplate(template: string, data: any): string {
  let processed = template
  
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    processed = processed.replace(regex, String(value))
  }
  
  return processed
}

async function sendSMSViaBangladeshProvider(phone: string, message: string) {
  // Mock implementation for Bangladesh SMS providers
  // In production, integrate with:
  // - SSL Wireless
  // - Banglalink
  // - Robi
  // - Grameenphone
  
  return {
    message_id: `sms_${Date.now()}`,
    status: 'sent',
    provider: 'ssl_wireless',
    phone,
    message
  }
}

async function sendFCMNotification(fcmToken: string, payload: any) {
  // Mock FCM implementation
  // In production, use Firebase Admin SDK
  
  return {
    message_id: `fcm_${Date.now()}`,
    status: 'sent',
    token: fcmToken,
    payload
  }
}

async function sendEmail(req: Request, supabaseClient: any) {
  const { to, subject, html, template, data } = await req.json()
  
  const notificationData: NotificationRequest = {
    type: 'email',
    recipients: Array.isArray(to) ? to : [to],
    subject,
    message: html,
    template,
    data
  }
  
  return await processEmailNotification(notificationData, supabaseClient)
}

async function sendSMS(req: Request, supabaseClient: any) {
  const { to, message } = await req.json()
  
  const notificationData: NotificationRequest = {
    type: 'sms',
    recipients: Array.isArray(to) ? to : [to],
    message
  }
  
  return await processSMSNotification(notificationData, supabaseClient)
}

async function sendPushNotification(req: Request, supabaseClient: any) {
  const { to, title, body, data } = await req.json()
  
  const notificationData: NotificationRequest = {
    type: 'push',
    recipients: Array.isArray(to) ? to : [to],
    subject: title,
    message: body,
    data
  }
  
  return await processPushNotification(notificationData, supabaseClient)
}

async function createTemplate(req: Request, supabaseClient: any) {
  const { name, subject, html_content, variables } = await req.json()
  
  const { data: template } = await supabaseClient.from('email_templates').insert({
    name,
    subject,
    html_content,
    variables: variables || [],
    created_at: new Date().toISOString()
  }).select().single()
  
  return new Response(JSON.stringify({
    success: true,
    template
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function bulkNotify(req: Request, supabaseClient: any) {
  const { notifications } = await req.json()
  
  const results = []
  
  for (const notification of notifications) {
    try {
      const result = await sendNotification(
        new Request(req.url, {
          method: 'POST',
          body: JSON.stringify(notification),
          headers: req.headers
        }),
        supabaseClient
      )
      
      results.push({ success: true, result: await result.json() })
    } catch (error) {
      results.push({ success: false, error: error.message })
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    results
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}