import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BackupRequest {
  policy_id: string;
  backup_type: 'full' | 'incremental' | 'differential' | 'log';
  backup_name?: string;
}

interface FailoverRequest {
  service_name: string;
  target_region: string;
  initiated_by: 'system' | 'user' | 'alert';
  initiated_by_user?: string;
  trigger_reason: string;
}

interface IncidentRequest {
  title: string;
  description: string;
  severity: 'sev1' | 'sev2' | 'sev3' | 'sev4';
  category: string;
  affected_services?: string[];
  customer_impact?: string;
  incident_commander?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.replace('/functions/v1/disaster-recovery', '');

    switch (path) {
      case '/backup/execute':
        return await executeBackup(req, supabase);
      case '/backup/restore':
        return await restoreBackup(req, supabase);
      case '/backup/status':
        return await getBackupStatus(req, supabase);
      case '/failover/initiate':
        return await initiateFailover(req, supabase);
      case '/failover/status':
        return await getFailoverStatus(req, supabase);
      case '/incident/create':
        return await createIncident(req, supabase);
      case '/incident/update':
        return await updateIncident(req, supabase);
      case '/health/replicas':
        return await checkReplicaHealth(req, supabase);
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Disaster recovery error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function executeBackup(req: Request, supabase: any) {
  const payload: BackupRequest = await req.json();
  
  // Get backup policy
  const { data: policy, error: policyError } = await supabase
    .from('backup_policies')
    .select('*')
    .eq('id', payload.policy_id)
    .eq('is_active', true)
    .single();

  if (policyError || !policy) {
    return new Response(JSON.stringify({ error: 'Backup policy not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const backup_name = payload.backup_name || 
    `${policy.policy_name}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;

  // Create backup execution record
  const { data: execution, error: executionError } = await supabase
    .from('backup_executions')
    .insert({
      policy_id: payload.policy_id,
      backup_name,
      backup_type: payload.backup_type,
      status: 'running',
      start_time: new Date().toISOString(),
      recovery_point_objective: new Date().toISOString(),
      next_scheduled_backup: new Date(Date.now() + 
        parseInterval(policy.frequency)).toISOString()
    })
    .select()
    .single();

  if (executionError) {
    console.error('Failed to create backup execution:', executionError);
    return new Response(JSON.stringify({ error: executionError.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Simulate backup process (in production, this would integrate with actual backup systems)
  EdgeRuntime.waitUntil(performActualBackup(supabase, execution.id, policy));

  return new Response(JSON.stringify({
    success: true,
    backup_id: execution.id,
    backup_name,
    status: 'running',
    estimated_completion: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function performActualBackup(supabase: any, executionId: string, policy: any) {
  try {
    // Simulate backup processing time
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const backup_size_bytes = Math.floor(Math.random() * 1000000000) + 500000000; // 500MB - 1.5GB
    const compressed_size_bytes = Math.floor(backup_size_bytes * 0.7); // 30% compression
    const storage_path = `${policy.storage_location}${new Date().toISOString().slice(0, 10)}/${executionId}`;

    await supabase
      .from('backup_executions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        backup_size_bytes,
        compressed_size_bytes,
        storage_path,
        verification_status: 'passed'
      })
      .eq('id', executionId);

    console.log(`Backup ${executionId} completed successfully`);
  } catch (error) {
    console.error(`Backup ${executionId} failed:`, error);
    await supabase
      .from('backup_executions')
      .update({
        status: 'failed',
        end_time: new Date().toISOString(),
        error_message: error.message
      })
      .eq('id', executionId);
  }
}

async function restoreBackup(req: Request, supabase: any) {
  const { backup_id, target_environment } = await req.json();
  
  const { data: backup, error: backupError } = await supabase
    .from('backup_executions')
    .select('*')
    .eq('id', backup_id)
    .eq('status', 'completed')
    .single();

  if (backupError || !backup) {
    return new Response(JSON.stringify({ error: 'Backup not found or not completed' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // In production, this would trigger actual restore process
  console.log(`Initiating restore of backup ${backup_id} to ${target_environment}`);

  return new Response(JSON.stringify({
    success: true,
    message: 'Restore initiated',
    backup_id,
    target_environment,
    estimated_completion: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getBackupStatus(req: Request, supabase: any) {
  const url = new URL(req.url);
  const policy_id = url.searchParams.get('policy_id');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  let query = supabase
    .from('backup_executions')
    .select(`
      *,
      backup_policies(policy_name, backup_type, storage_location)
    `)
    .order('start_time', { ascending: false })
    .limit(limit);

  if (policy_id) {
    query = query.eq('policy_id', policy_id);
  }

  const { data: backups, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    backups,
    total_count: backups?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function initiateFailover(req: Request, supabase: any) {
  const payload: FailoverRequest = await req.json();
  
  // Get failover configuration
  const { data: config, error: configError } = await supabase
    .from('failover_configurations')
    .select('*')
    .eq('service_name', payload.service_name)
    .eq('is_active', true)
    .single();

  if (configError || !config) {
    return new Response(JSON.stringify({ error: 'Failover configuration not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Create failover event
  const { data: event, error: eventError } = await supabase
    .from('failover_events')
    .insert({
      config_id: config.id,
      event_type: 'failover_initiated',
      trigger_reason: payload.trigger_reason,
      source_region: config.primary_region,
      target_region: payload.target_region,
      initiated_by: payload.initiated_by,
      initiated_by_user: payload.initiated_by_user,
      status: 'in_progress',
      start_time: new Date().toISOString(),
      affected_services: [payload.service_name],
      impact_assessment: {
        estimated_downtime_seconds: config.recovery_time_objective,
        estimated_data_loss_seconds: config.recovery_point_objective
      }
    })
    .select()
    .single();

  if (eventError) {
    console.error('Failed to create failover event:', eventError);
    return new Response(JSON.stringify({ error: eventError.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Simulate failover process
  EdgeRuntime.waitUntil(performFailover(supabase, event.id, config, payload.target_region));

  return new Response(JSON.stringify({
    success: true,
    failover_id: event.id,
    service_name: payload.service_name,
    source_region: config.primary_region,
    target_region: payload.target_region,
    estimated_completion: new Date(Date.now() + config.recovery_time_objective * 1000).toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function performFailover(supabase: any, eventId: string, config: any, targetRegion: string) {
  try {
    // Simulate failover steps
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const downtime_seconds = Math.floor(Math.random() * config.recovery_time_objective) + 30;

    await supabase
      .from('failover_events')
      .update({
        event_type: 'failover_completed',
        status: 'completed',
        end_time: new Date().toISOString(),
        downtime_seconds
      })
      .eq('id', eventId);

    console.log(`Failover ${eventId} completed successfully`);
  } catch (error) {
    console.error(`Failover ${eventId} failed:`, error);
    await supabase
      .from('failover_events')
      .update({
        status: 'failed',
        end_time: new Date().toISOString()
      })
      .eq('id', eventId);
  }
}

async function getFailoverStatus(req: Request, supabase: any) {
  const url = new URL(req.url);
  const service_name = url.searchParams.get('service_name');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  let query = supabase
    .from('failover_events')
    .select(`
      *,
      failover_configurations(service_name, primary_region, secondary_regions)
    `)
    .order('start_time', { ascending: false })
    .limit(limit);

  if (service_name) {
    query = query.eq('failover_configurations.service_name', service_name);
  }

  const { data: events, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    failover_events: events,
    total_count: events?.length || 0
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function createIncident(req: Request, supabase: any) {
  const payload: IncidentRequest = await req.json();
  
  const incident_id = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const { data: incident, error } = await supabase
    .from('incident_records')
    .insert({
      incident_id,
      title: payload.title,
      description: payload.description,
      severity: payload.severity,
      category: payload.category,
      affected_services: payload.affected_services || [],
      customer_impact: payload.customer_impact,
      incident_commander: payload.incident_commander,
      assigned_team: [],
      timeline: [{
        timestamp: new Date().toISOString(),
        event: 'Incident created',
        description: payload.description
      }],
      communication_log: [],
      metrics: {
        detection_time: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create incident:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    incident_id,
    incident: incident
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function updateIncident(req: Request, supabase: any) {
  const { incident_id, status, resolution_summary, lessons_learned } = await req.json();
  
  const updates: any = { updated_at: new Date().toISOString() };
  
  if (status) updates.status = status;
  if (resolution_summary) updates.resolution_summary = resolution_summary;
  if (lessons_learned) updates.lessons_learned = lessons_learned;
  
  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
  }
  
  if (status === 'closed') {
    updates.closed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('incident_records')
    .update(updates)
    .eq('incident_id', incident_id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update incident:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    incident: data
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function checkReplicaHealth(req: Request, supabase: any) {
  const { data: replicas, error } = await supabase
    .from('database_replicas')
    .select('*')
    .order('region');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Simulate health check for each replica
  const healthChecks = await Promise.all(
    replicas.map(async (replica: any) => {
      const health_status = Math.random() > 0.1 ? 'healthy' : 'degraded';
      const replication_lag_ms = Math.floor(Math.random() * 1000);
      
      return {
        ...replica,
        health_status,
        replication_lag_ms,
        last_check: new Date().toISOString()
      };
    })
  );

  return new Response(JSON.stringify({
    replicas: healthChecks,
    overall_health: healthChecks.every(r => r.health_status === 'healthy') ? 'healthy' : 'degraded'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function parseInterval(interval: string): number {
  const matches = interval.match(/(\d+)\s*(day|hour|minute)s?/);
  if (!matches) return 24 * 60 * 60 * 1000; // default to 24 hours
  
  const value = parseInt(matches[1]);
  const unit = matches[2];
  
  switch (unit) {
    case 'day': return value * 24 * 60 * 60 * 1000;
    case 'hour': return value * 60 * 60 * 1000;
    case 'minute': return value * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}