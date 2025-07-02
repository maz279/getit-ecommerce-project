import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TestHelpers } from './test-utils';

// Global test setup
beforeAll(() => {
  TestHelpers.setupGlobalMocks();
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: () => {}, // Disable console.log in tests
  debug: () => {}, // Disable console.debug in tests
  warn: console.warn, // Keep warnings
  error: console.error, // Keep errors
};