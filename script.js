import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 }, 
    { duration: '20s', target: 5 }, 
    { duration: '10s', target: 0 }, 
  ],
  // THRESHOLDS: This is where we define what is "unacceptable"
  thresholds: {
    // We expect 95% of requests to finish in under 500ms
    http_req_duration: ['p(95)<500'], 
    // We expect the failure rate to be less than 5%
    http_req_failed: ['rate<0.05'],   
  },
};

export default function () {
  // Let's create an array of endpoints to simulate a very unstable API
  const endpoints = [
    'http://api:80/delay/3',   // TERRIBLE: Forces a 3-second delay
    'http://api:80/status/500',// TERRIBLE: Returns a 500 Internal Server Error
    'http://api:80/status/503',// TERRIBLE: Returns a 503 Service Unavailable
    'http://api:80/get'        // GOOD: A normal, fast response
  ];

  // Randomly pick one of the endpoints for each user request
  const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  
  const res = http.get(randomEndpoint);

  // Checks: These will log failures in the final report
  check(res, {
    'status is 200 (OK)': (r) => r.status === 200,
    'response was fast (< 500ms)': (r) => r.timings.duration < 500,
  });

  sleep(1);
}