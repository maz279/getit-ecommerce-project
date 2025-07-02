import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');
export let responseTime = new Trend('response_time');
export let requests = new Counter('requests');

// Load test configuration
export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '10m', target: 100 }, // Stay at 100 users
    { duration: '5m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://api.getit.com.bd';

export default function() {
  let response = http.get(`${BASE_URL}/v1/products?page=1&limit=20`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'bn,en',
    },
  });

  check(response, {
    'products loaded': (r) => r.status === 200,
  });

  requests.add(1);
  responseTime.add(response.timings.duration);
  errorRate.add(response.status !== 200);
  
  sleep(1);
}