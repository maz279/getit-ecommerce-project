import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.01'],             // Error rate must be below 1%
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
  // Test product listing
  let response = http.get(`${BASE_URL}/rest/v1/products?select=*&limit=20`, { headers });
  
  let success = check(response, {
    'products fetch status is 200': (r) => r.status === 200,
    'products fetch duration < 500ms': (r) => r.timings.duration < 500,
  });
  
  errorRate.add(!success);

  sleep(1);

  // Test category listing
  response = http.get(`${BASE_URL}/rest/v1/categories?select=*`, { headers });
  
  success = check(response, {
    'categories fetch status is 200': (r) => r.status === 200,
    'categories fetch duration < 300ms': (r) => r.timings.duration < 300,
  });
  
  errorRate.add(!success);

  sleep(1);

  // Test vendor listing
  response = http.get(`${BASE_URL}/rest/v1/vendors?select=*&limit=10`, { headers });
  
  success = check(response, {
    'vendors fetch status is 200': (r) => r.status === 200,
    'vendors fetch duration < 400ms': (r) => r.timings.duration < 400,
  });
  
  errorRate.add(!success);

  sleep(1);

  // Test analytics endpoint
  response = http.post(`${BASE_URL}/functions/v1/business-analytics`, 
    JSON.stringify({
      type: 'sales_summary',
      period: 'today'
    }), 
    { headers }
  );
  
  success = check(response, {
    'analytics status is 200': (r) => r.status === 200,
    'analytics duration < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  errorRate.add(!success);

  sleep(2);
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data),
    stdout: `
    Load Test Results:
    ==================
    VUs: ${data.metrics.vus.values.value}
    Requests: ${data.metrics.http_reqs.values.count}
    Avg Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
    95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
    Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%
    `,
  };
}