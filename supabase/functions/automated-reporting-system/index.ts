import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      case 'create_report_template':
        return await createReportTemplate(supabase, data);
      case 'schedule_report':
        return await scheduleReport(supabase, data);
      case 'generate_report':
        return await generateReport(supabase, data);
      case 'export_report':
        return await exportReport(supabase, data);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createReportTemplate(supabase: any, data: any) {
  const { template_name, report_type, created_by, vendor_id, configuration } = data;
  
  const template = {
    template_name,
    template_description: `Automated ${report_type} report template`,
    report_type,
    report_configuration: configuration || {
      columns: ['date', 'revenue', 'orders', 'customers'],
      filters: { date_range: '30_days' },
      charts: ['line_chart', 'bar_chart'],
      grouping: 'daily'
    },
    visualization_config: {
      chart_types: ['line', 'bar', 'pie'],
      color_scheme: 'professional',
      layout: 'standard'
    },
    data_sources: ['orders', 'products', 'customers', 'analytics'],
    created_by,
    vendor_id,
    is_public: false
  };
  
  await supabase.from('custom_report_templates').insert(template);
  
  return new Response(JSON.stringify({ template }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function scheduleReport(supabase: any, data: any) {
  const { report_name, template_id, schedule_config, recipients, report_format, created_by, vendor_id } = data;
  
  const nextGeneration = new Date();
  nextGeneration.setDate(nextGeneration.getDate() + 1); // Tomorrow
  
  const scheduledReport = {
    report_name,
    template_id,
    schedule_config: schedule_config || {
      frequency: 'weekly',
      day_of_week: 1, // Monday
      time: '09:00',
      timezone: 'UTC'
    },
    recipients: recipients || ['admin@company.com'],
    report_format: report_format || 'pdf',
    next_generation: nextGeneration.toISOString(),
    created_by,
    vendor_id
  };
  
  await supabase.from('scheduled_reports').insert(scheduledReport);
  
  return new Response(JSON.stringify({ scheduled_report: scheduledReport }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateReport(supabase: any, data: any) {
  const { template_id, scheduled_report_id } = data;
  
  // Simulate report generation
  const reportData = {
    summary: {
      total_revenue: 125000 + Math.random() * 50000,
      total_orders: 850 + Math.random() * 200,
      total_customers: 320 + Math.random() * 100,
      conversion_rate: 2.5 + Math.random() * 1.5
    },
    charts: [
      {
        type: 'line',
        title: 'Revenue Trend',
        data: Array.from({length: 30}, (_, i) => ({
          date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 3000 + Math.random() * 2000
        }))
      }
    ],
    tables: [
      {
        title: 'Top Products',
        headers: ['Product', 'Sales', 'Revenue'],
        rows: [
          ['Product A', '150', '$15,000'],
          ['Product B', '120', '$12,000'],
          ['Product C', '90', '$9,000']
        ]
      }
    ]
  };
  
  const execution = {
    scheduled_report_id,
    template_id,
    execution_status: 'completed',
    execution_end: new Date().toISOString(),
    report_data: reportData,
    file_path: `/reports/report_${Date.now()}.pdf`,
    file_size: 1024 + Math.random() * 2048, // KB
    generation_time_ms: 2000 + Math.random() * 3000,
    recipients_sent: ['admin@company.com'],
    delivery_status: { email: 'sent', dashboard: 'published' }
  };
  
  await supabase.from('report_executions').insert(execution);
  
  return new Response(JSON.stringify({ execution }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function exportReport(supabase: any, data: any) {
  const { execution_id, format = 'pdf' } = data;
  
  // Simulate export process
  const exportResult = {
    execution_id,
    format,
    download_url: `https://reports.example.com/download/${execution_id}.${format}`,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    file_size: format === 'pdf' ? '2.3 MB' : format === 'excel' ? '1.8 MB' : '0.5 MB'
  };
  
  return new Response(JSON.stringify({ export_result: exportResult }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}