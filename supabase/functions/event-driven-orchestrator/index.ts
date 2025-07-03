import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface EventDefinition {
  name: string;
  version: string;
  schema: {
    type: string;
    properties: { [key: string]: any };
    required: string[];
  };
  routing: {
    exchange: string;
    routingKey: string;
    consumers: string[];
  };
  retention: {
    ttl: number; // Time to live in seconds
    maxEvents: number;
  };
  deadLetter: {
    enabled: boolean;
    maxRetries: number;
    retryDelay: number;
  };
}

interface EventMessage {
  id: string;
  eventType: string;
  version: string;
  timestamp: string;
  source: string;
  correlationId?: string;
  causationId?: string;
  data: any;
  metadata: {
    userId?: string;
    sessionId?: string;
    traceId: string;
    spanId: string;
  };
}

interface EventSubscription {
  id: string;
  subscriberService: string;
  eventTypes: string[];
  endpoint: string;
  filterExpression?: string;
  batchSize: number;
  timeoutMs: number;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffMs: number;
  };
  deadLetterQueue: string;
  isActive: boolean;
}

interface SagaDefinition {
  name: string;
  version: string;
  steps: Array<{
    stepId: string;
    service: string;
    action: string;
    compensationAction?: string;
    timeout: number;
    retries: number;
  }>;
  compensationOrder: string[];
}

// Event definitions for the platform
const eventDefinitions: { [eventType: string]: EventDefinition } = {
  'order.created': {
    name: 'Order Created',
    version: '1.0.0',
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
        customerId: { type: 'string' },
        vendorId: { type: 'string' },
        items: { type: 'array' },
        totalAmount: { type: 'number' },
        currency: { type: 'string' }
      },
      required: ['orderId', 'customerId', 'vendorId', 'items', 'totalAmount']
    },
    routing: {
      exchange: 'orders',
      routingKey: 'order.created',
      consumers: ['payment-service', 'inventory-service', 'notification-service']
    },
    retention: { ttl: 86400 * 30, maxEvents: 1000000 }, // 30 days
    deadLetter: { enabled: true, maxRetries: 3, retryDelay: 5000 }
  },
  'payment.processed': {
    name: 'Payment Processed',
    version: '1.0.0',
    schema: {
      type: 'object',
      properties: {
        paymentId: { type: 'string' },
        orderId: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        gateway: { type: 'string' }
      },
      required: ['paymentId', 'orderId', 'amount', 'status']
    },
    routing: {
      exchange: 'payments',
      routingKey: 'payment.processed',
      consumers: ['order-service', 'analytics-service', 'vendor-service']
    },
    retention: { ttl: 86400 * 90, maxEvents: 2000000 }, // 90 days
    deadLetter: { enabled: true, maxRetries: 5, retryDelay: 3000 }
  },
  'inventory.updated': {
    name: 'Inventory Updated',
    version: '1.0.0',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        vendorId: { type: 'string' },
        previousStock: { type: 'number' },
        currentStock: { type: 'number' },
        reason: { type: 'string' }
      },
      required: ['productId', 'vendorId', 'currentStock']
    },
    routing: {
      exchange: 'inventory',
      routingKey: 'inventory.updated',
      consumers: ['product-service', 'analytics-service', 'recommendation-service']
    },
    retention: { ttl: 86400 * 7, maxEvents: 5000000 }, // 7 days
    deadLetter: { enabled: true, maxRetries: 2, retryDelay: 2000 }
  },
  'user.registered': {
    name: 'User Registered',
    version: '1.0.0',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        email: { type: 'string' },
        userType: { type: 'string' },
        registrationSource: { type: 'string' }
      },
      required: ['userId', 'email', 'userType']
    },
    routing: {
      exchange: 'users',
      routingKey: 'user.registered',
      consumers: ['email-service', 'analytics-service', 'recommendation-service']
    },
    retention: { ttl: 86400 * 365, maxEvents: 1000000 }, // 1 year
    deadLetter: { enabled: true, maxRetries: 3, retryDelay: 10000 }
  }
};

// Event subscriptions
const eventSubscriptions: EventSubscription[] = [
  {
    id: 'payment-order-processor',
    subscriberService: 'payment-processing',
    eventTypes: ['order.created'],
    endpoint: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/payment-processing',
    batchSize: 1,
    timeoutMs: 30000,
    retryPolicy: { maxRetries: 3, backoffMultiplier: 2, maxBackoffMs: 60000 },
    deadLetterQueue: 'payment-dlq',
    isActive: true
  },
  {
    id: 'inventory-order-processor',
    subscriberService: 'inventory-management',
    eventTypes: ['order.created', 'payment.processed'],
    endpoint: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/inventory-management',
    batchSize: 10,
    timeoutMs: 15000,
    retryPolicy: { maxRetries: 2, backoffMultiplier: 1.5, maxBackoffMs: 30000 },
    deadLetterQueue: 'inventory-dlq',
    isActive: true
  },
  {
    id: 'analytics-event-processor',
    subscriberService: 'analytics-engine',
    eventTypes: ['order.created', 'payment.processed', 'inventory.updated', 'user.registered'],
    endpoint: 'https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/analytics-engine',
    batchSize: 50,
    timeoutMs: 60000,
    retryPolicy: { maxRetries: 1, backoffMultiplier: 1, maxBackoffMs: 10000 },
    deadLetterQueue: 'analytics-dlq',
    isActive: true
  }
];

// Saga definitions for distributed transactions
const sagaDefinitions: { [sagaName: string]: SagaDefinition } = {
  'order-fulfillment': {
    name: 'Order Fulfillment Saga',
    version: '1.0.0',
    steps: [
      {
        stepId: 'validate-order',
        service: 'order-service',
        action: 'validateOrder',
        compensationAction: 'cancelOrder',
        timeout: 10000,
        retries: 2
      },
      {
        stepId: 'reserve-inventory',
        service: 'inventory-service',
        action: 'reserveItems',
        compensationAction: 'releaseReservation',
        timeout: 15000,
        retries: 3
      },
      {
        stepId: 'process-payment',
        service: 'payment-service',
        action: 'processPayment',
        compensationAction: 'refundPayment',
        timeout: 30000,
        retries: 2
      },
      {
        stepId: 'confirm-order',
        service: 'order-service',
        action: 'confirmOrder',
        timeout: 5000,
        retries: 1
      }
    ],
    compensationOrder: ['confirm-order', 'process-payment', 'reserve-inventory', 'validate-order']
  }
};

// In-memory event store (replace with persistent storage in production)
const eventStore = new Map<string, EventMessage[]>();
const sagaInstances = new Map<string, any>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case '/events/publish':
        return await publishEvent(req);
      
      case '/events/subscribe':
        return await createSubscription(req);
      
      case '/events/query':
        return await queryEvents(req);
      
      case '/sagas/start':
        return await startSaga(req);
      
      case '/sagas/status':
        return await getSagaStatus(req);
      
      case '/events/replay':
        return await replayEvents(req);
      
      case '/events/subscriptions':
        return await getSubscriptions();
      
      case '/events/definitions':
        return await getEventDefinitions();
      
      case '/events/health':
        return await getEventSystemHealth();
      
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Event Driven Orchestrator Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function publishEvent(req: Request): Promise<Response> {
  const body = await req.json();
  const { eventType, data, metadata = {} } = body;

  // Validate event type
  const eventDef = eventDefinitions[eventType];
  if (!eventDef) {
    return new Response(JSON.stringify({ error: 'Unknown event type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Create event message
  const event: EventMessage = {
    id: crypto.randomUUID(),
    eventType,
    version: eventDef.version,
    timestamp: new Date().toISOString(),
    source: metadata.source || 'unknown',
    correlationId: metadata.correlationId || crypto.randomUUID(),
    causationId: metadata.causationId,
    data,
    metadata: {
      ...metadata,
      traceId: metadata.traceId || crypto.randomUUID(),
      spanId: crypto.randomUUID()
    }
  };

  // Validate event data against schema
  const validationResult = validateEventData(event.data, eventDef.schema);
  if (!validationResult.valid) {
    return new Response(JSON.stringify({ 
      error: 'Event validation failed', 
      details: validationResult.errors 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Store event
  await storeEvent(event);

  // Route event to subscribers
  await routeEventToSubscribers(event);

  // Persist to database for durability
  try {
    await supabase.from('event_store').insert({
      event_id: event.id,
      event_type: event.eventType,
      event_version: event.version,
      event_data: event.data,
      event_metadata: event.metadata,
      correlation_id: event.correlationId,
      causation_id: event.causationId,
      source_service: event.source,
      created_at: event.timestamp
    });
  } catch (error) {
    console.error('Failed to persist event to database:', error);
  }

  return new Response(JSON.stringify({
    success: true,
    eventId: event.id,
    correlationId: event.correlationId,
    timestamp: event.timestamp
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function validateEventData(data: any, schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation - in production, use a proper JSON schema validator
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Required field '${field}' is missing`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

async function storeEvent(event: EventMessage): Promise<void> {
  const eventTypeStore = eventStore.get(event.eventType) || [];
  eventTypeStore.push(event);
  
  // Apply retention policy
  const eventDef = eventDefinitions[event.eventType];
  if (eventTypeStore.length > eventDef.retention.maxEvents) {
    eventTypeStore.splice(0, eventTypeStore.length - eventDef.retention.maxEvents);
  }
  
  eventStore.set(event.eventType, eventTypeStore);
}

async function routeEventToSubscribers(event: EventMessage): Promise<void> {
  const relevantSubscriptions = eventSubscriptions.filter(
    sub => sub.isActive && sub.eventTypes.includes(event.eventType)
  );

  for (const subscription of relevantSubscriptions) {
    try {
      await deliverEventToSubscriber(event, subscription);
    } catch (error) {
      console.error(`Failed to deliver event ${event.id} to ${subscription.subscriberService}:`, error);
      
      // Handle dead letter queue
      if (subscription.deadLetterQueue) {
        await sendToDeadLetterQueue(event, subscription, error);
      }
    }
  }
}

async function deliverEventToSubscriber(event: EventMessage, subscription: EventSubscription): Promise<void> {
  const payload = {
    events: [event],
    subscription: {
      id: subscription.id,
      service: subscription.subscriberService
    }
  };

  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Event-Delivery': 'true',
      'X-Subscription-Id': subscription.id,
      'X-Event-Type': event.eventType,
      'X-Correlation-Id': event.correlationId || '',
      'X-Trace-Id': event.metadata.traceId
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(subscription.timeoutMs)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}

async function sendToDeadLetterQueue(event: EventMessage, subscription: EventSubscription, error: any): Promise<void> {
  console.log(`Sending event ${event.id} to dead letter queue: ${subscription.deadLetterQueue}`);
  
  // In production, this would send to an actual message queue
  try {
    await supabase.from('event_dead_letters').insert({
      event_id: event.id,
      subscription_id: subscription.id,
      error_message: error.message,
      retry_count: 0,
      created_at: new Date().toISOString()
    });
  } catch (dbError) {
    console.error('Failed to store dead letter event:', dbError);
  }
}

async function createSubscription(req: Request): Promise<Response> {
  const subscription: Partial<EventSubscription> = await req.json();
  
  const newSubscription: EventSubscription = {
    id: crypto.randomUUID(),
    subscriberService: subscription.subscriberService!,
    eventTypes: subscription.eventTypes!,
    endpoint: subscription.endpoint!,
    filterExpression: subscription.filterExpression,
    batchSize: subscription.batchSize || 1,
    timeoutMs: subscription.timeoutMs || 30000,
    retryPolicy: subscription.retryPolicy || {
      maxRetries: 3,
      backoffMultiplier: 2,
      maxBackoffMs: 60000
    },
    deadLetterQueue: subscription.deadLetterQueue || `${subscription.subscriberService}-dlq`,
    isActive: true
  };

  eventSubscriptions.push(newSubscription);

  return new Response(JSON.stringify({
    success: true,
    subscriptionId: newSubscription.id,
    subscription: newSubscription
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function queryEvents(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const eventType = url.searchParams.get('eventType');
  const correlationId = url.searchParams.get('correlationId');
  const limit = parseInt(url.searchParams.get('limit') || '100');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let events: EventMessage[] = [];

  if (eventType) {
    events = eventStore.get(eventType) || [];
  } else {
    // Get all events
    for (const eventList of eventStore.values()) {
      events.push(...eventList);
    }
  }

  // Filter by correlation ID if provided
  if (correlationId) {
    events = events.filter(event => event.correlationId === correlationId);
  }

  // Sort by timestamp (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply pagination
  const paginatedEvents = events.slice(offset, offset + limit);

  return new Response(JSON.stringify({
    events: paginatedEvents,
    total: events.length,
    limit,
    offset
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function startSaga(req: Request): Promise<Response> {
  const body = await req.json();
  const { sagaName, input, correlationId } = body;

  const sagaDef = sagaDefinitions[sagaName];
  if (!sagaDef) {
    return new Response(JSON.stringify({ error: 'Unknown saga type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const sagaInstanceId = crypto.randomUUID();
  const sagaInstance = {
    id: sagaInstanceId,
    name: sagaName,
    version: sagaDef.version,
    status: 'running',
    currentStep: 0,
    input,
    correlationId: correlationId || crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    steps: sagaDef.steps.map(step => ({
      ...step,
      status: 'pending',
      startedAt: null,
      completedAt: null,
      error: null
    }))
  };

  sagaInstances.set(sagaInstanceId, sagaInstance);

  // Start saga execution
  EdgeRuntime.waitUntil(executeSaga(sagaInstance));

  return new Response(JSON.stringify({
    success: true,
    sagaInstanceId,
    correlationId: sagaInstance.correlationId,
    status: 'started'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function executeSaga(sagaInstance: any): Promise<void> {
  try {
    for (let i = 0; i < sagaInstance.steps.length; i++) {
      const step = sagaInstance.steps[i];
      
      step.status = 'running';
      step.startedAt = new Date().toISOString();
      sagaInstance.currentStep = i;

      try {
        await executeStep(step, sagaInstance);
        step.status = 'completed';
        step.completedAt = new Date().toISOString();
      } catch (error) {
        step.status = 'failed';
        step.error = error.message;
        
        // Compensate completed steps
        await compensateSaga(sagaInstance, i - 1);
        sagaInstance.status = 'compensated';
        return;
      }
    }
    
    sagaInstance.status = 'completed';
    sagaInstance.completedAt = new Date().toISOString();
    
  } catch (error) {
    sagaInstance.status = 'failed';
    sagaInstance.error = error.message;
  }
}

async function executeStep(step: any, sagaInstance: any): Promise<void> {
  const serviceEndpoint = `https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/${step.service}`;
  
  const payload = {
    action: step.action,
    sagaInstanceId: sagaInstance.id,
    correlationId: sagaInstance.correlationId,
    input: sagaInstance.input,
    stepData: step
  };

  let retries = 0;
  while (retries <= step.retries) {
    try {
      const response = await fetch(serviceEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Saga-Instance': sagaInstance.id,
          'X-Saga-Step': step.stepId,
          'X-Correlation-Id': sagaInstance.correlationId
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(step.timeout)
      });

      if (response.ok) {
        return; // Step completed successfully
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      retries++;
      if (retries > step.retries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
}

async function compensateSaga(sagaInstance: any, lastCompletedStep: number): Promise<void> {
  // Execute compensation actions in reverse order
  for (let i = lastCompletedStep; i >= 0; i--) {
    const step = sagaInstance.steps[i];
    
    if (step.status === 'completed' && step.compensationAction) {
      try {
        await executeCompensation(step, sagaInstance);
      } catch (error) {
        console.error(`Compensation failed for step ${step.stepId}:`, error);
        // Continue with other compensations
      }
    }
  }
}

async function executeCompensation(step: any, sagaInstance: any): Promise<void> {
  const serviceEndpoint = `https://bbgppsjmspmymrfowytf.supabase.co/functions/v1/${step.service}`;
  
  const payload = {
    action: step.compensationAction,
    sagaInstanceId: sagaInstance.id,
    correlationId: sagaInstance.correlationId,
    input: sagaInstance.input,
    stepData: step
  };

  await fetch(serviceEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Saga-Compensation': 'true',
      'X-Saga-Instance': sagaInstance.id,
      'X-Saga-Step': step.stepId,
      'X-Correlation-Id': sagaInstance.correlationId
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(step.timeout)
  });
}

async function getSagaStatus(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const sagaInstanceId = url.searchParams.get('sagaInstanceId');

  if (!sagaInstanceId) {
    return new Response(JSON.stringify({ error: 'Saga instance ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const sagaInstance = sagaInstances.get(sagaInstanceId);
  if (!sagaInstance) {
    return new Response(JSON.stringify({ error: 'Saga instance not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(sagaInstance), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function replayEvents(req: Request): Promise<Response> {
  const body = await req.json();
  const { eventType, fromTimestamp, toTimestamp, targetSubscription } = body;

  const events = eventStore.get(eventType) || [];
  const filteredEvents = events.filter(event => {
    const eventTime = new Date(event.timestamp);
    const fromTime = fromTimestamp ? new Date(fromTimestamp) : new Date(0);
    const toTime = toTimestamp ? new Date(toTimestamp) : new Date();
    
    return eventTime >= fromTime && eventTime <= toTime;
  });

  let replayed = 0;
  if (targetSubscription) {
    const subscription = eventSubscriptions.find(sub => sub.id === targetSubscription);
    if (subscription) {
      for (const event of filteredEvents) {
        try {
          await deliverEventToSubscriber(event, subscription);
          replayed++;
        } catch (error) {
          console.error(`Failed to replay event ${event.id}:`, error);
        }
      }
    }
  }

  return new Response(JSON.stringify({
    success: true,
    totalEvents: filteredEvents.length,
    replayedEvents: replayed,
    targetSubscription
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getSubscriptions(): Promise<Response> {
  return new Response(JSON.stringify(eventSubscriptions), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getEventDefinitions(): Promise<Response> {
  return new Response(JSON.stringify(eventDefinitions), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getEventSystemHealth(): Promise<Response> {
  const totalEvents = Array.from(eventStore.values()).reduce((sum, events) => sum + events.length, 0);
  const activeSagas = Array.from(sagaInstances.values()).filter(saga => saga.status === 'running').length;
  const totalSagas = sagaInstances.size;

  const health = {
    status: 'healthy',
    totalEvents,
    totalEventTypes: Object.keys(eventDefinitions).length,
    activeSubscriptions: eventSubscriptions.filter(sub => sub.isActive).length,
    totalSubscriptions: eventSubscriptions.length,
    activeSagas,
    totalSagas,
    sagaDefinitions: Object.keys(sagaDefinitions).length,
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(health), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}