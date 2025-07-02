import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 100 },   // Warm up
    { duration: '5m', target: 100 },   // Stay at normal load
    { duration: '2m', target: 500 },   // Stress ramp up
    { duration: '5m', target: 500 },   // Stay at stress load
    { duration: '2m', target: 1000 },  // Spike to maximum
    { duration: '3m', target: 1000 },  // Stay at maximum
    { duration: '2m', target: 0 },     // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Allow higher response times under stress
    errors: ['rate<0.05'],             // Allow higher error rate under stress
  },
};

const BASE_URL = 'https://bbgppsjmspimrfowytf.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To';

const headers = {
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

export default function() {
  // Heavy product search with filters
  let response = http.get(`${BASE_URL}/rest/v1/products?select=*&category=eq.electronics&price=gte.1000&order=created_at.desc&limit=50`, { headers });
  
  let success = check(response, {
    'search status is 200': (r) => r.status === 200,
    'search completed': (r) => r.timings.duration < 5000,
  });
  
  errorRate.add(!success);

  sleep(0.5);

  // Concurrent analytics request
  response = http.post(`${BASE_URL}/functions/v1/business-analytics`, 
    JSON.stringify({
      type: 'vendor_performance',
      period: 'last_30_days',
      includeCharts: true
    }), 
    { headers }
  );
  
  success = check(response, {
    'analytics status ok': (r) => r.status < 500,
  });
  
  errorRate.add(!success);

  sleep(0.3);

  // Payment processing simulation
  response = http.post(`${BASE_URL}/functions/v1/enhanced-payment-processing`, 
    JSON.stringify({
      amount: Math.floor(Math.random() * 10000) + 100,
      vendor_id: 'test-vendor',
      payment_method: 'bkash'
    }), 
    { headers }
  );
  
  success = check(response, {
    'payment processing ok': (r) => r.status < 500,
  });
  
  errorRate.add(!success);

  sleep(0.2);
}