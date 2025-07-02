# Testing Guide for BDCommerce Platform

## Overview

This guide covers the comprehensive testing strategy for the BDCommerce platform, including unit tests, integration tests, end-to-end tests, and performance testing.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Structure](#test-structure)
3. [Test Types](#test-types)
4. [Testing Tools](#testing-tools)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [Test Coverage](#test-coverage)
8. [Best Practices](#best-practices)
9. [CI/CD Integration](#cicd-integration)

## Testing Philosophy

Our testing approach follows the testing pyramid:

```
    /\
   /E2E\     <- Few, high-value end-to-end tests
  /______\
 /Integration\ <- More integration tests
/______________\
|  Unit Tests  | <- Many fast, focused unit tests
```

### Principles

1. **Fast Feedback**: Tests should run quickly and provide immediate feedback
2. **Reliable**: Tests should be deterministic and not flaky
3. **Maintainable**: Tests should be easy to understand and modify
4. **Realistic**: Tests should simulate real user scenarios
5. **Comprehensive**: Tests should cover critical business logic

## Test Structure

### Directory Organization

```
src/tests/
├── components/          # Component unit tests
├── hooks/              # Custom hooks tests
├── integration/        # Integration tests
├── e2e/               # End-to-end tests
├── performance/       # Performance tests
├── fixtures/          # Test data and mocks
├── utils/             # Test utilities
├── setup.ts           # Global test setup
└── test-utils.ts      # Shared test helpers
```

### Naming Conventions

- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Test suites: Descriptive names matching the component/function
- Test cases: Use "should" statements: `should render correctly`

## Test Types

### 1. Unit Tests

Test individual components, functions, and hooks in isolation.

```typescript
describe('ProductCard', () => {
  it('should render product information correctly', () => {
    const product = TestHelpers.createMockProduct();
    render(<ProductCard product={product} />);
    
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`৳${product.price}`)).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

Test interactions between components and external services.

```typescript
describe('Payment Integration', () => {
  it('should process payment and update order status', async () => {
    const mockPayment = TestHelpers.createMockPayment();
    
    const result = await processPayment(mockPayment);
    
    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();
  });
});
```

### 3. End-to-End Tests

Test complete user workflows from start to finish.

```typescript
describe('User Purchase Flow', () => {
  it('should allow user to complete a purchase', async () => {
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/cart');
    await page.click('[data-testid="checkout-button"]');
    // ... continue workflow
  });
});
```

### 4. Performance Tests

Test application performance under load.

```typescript
describe('Performance Tests', () => {
  it('should load product list within 2 seconds', async () => {
    const startTime = Date.now();
    
    render(<ProductList />);
    await TestHelpers.waitForLoadingToFinish();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });
});
```

## Testing Tools

### Primary Tools

- **Vitest**: Fast unit test runner with TypeScript support
- **React Testing Library**: Testing utilities for React components
- **Playwright**: End-to-end testing framework
- **MSW**: Mock Service Worker for API mocking

### Additional Tools

- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation
- **@vitest/coverage**: Code coverage reporting

### Configuration

#### Vitest Config (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

## Writing Tests

### Test Helpers

Use the `TestHelpers` class for common testing operations:

```typescript
import { TestHelpers } from '../test-utils';

describe('ProductForm', () => {
  it('should submit form with valid data', async () => {
    const Wrapper = TestHelpers.createWrapper();
    const mockSubmit = vi.fn();
    
    render(<ProductForm onSubmit={mockSubmit} />, { wrapper: Wrapper });
    
    await TestHelpers.fillForm({
      'Product Name': 'Test Product',
      'Price': '299.99',
      'Description': 'Test description',
    });
    
    await TestHelpers.clickButton('Submit');
    
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Product',
        price: 299.99,
        description: 'Test description',
      })
    );
  });
});
```

### Mocking Supabase

```typescript
const mockSupabase = TestHelpers.mockSupabaseClient();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('Data Operations', () => {
  it('should fetch products successfully', async () => {
    const mockProducts = TestHelpers.generateTestData(5, () => 
      TestHelpers.createMockProduct()
    );
    
    mockSupabase.select.mockResolvedValue({
      data: mockProducts,
      error: null,
    });
    
    // Test your component that uses Supabase
  });
});
```

### Testing Edge Functions

```typescript
describe('Payment Processing Function', () => {
  it('should process payment successfully', async () => {
    const paymentData = {
      amount: 1000,
      vendor_id: 'vendor-123',
      payment_method: 'bkash',
    };
    
    mockSupabase.functions.invoke.mockResolvedValue({
      data: { success: true, payment_id: 'pay_123' },
      error: null,
    });
    
    const result = await mockSupabase.functions.invoke(
      'enhanced-payment-processing',
      { body: paymentData }
    );
    
    expect(result.data.success).toBe(true);
  });
});
```

### Testing Async Operations

```typescript
describe('Async Data Loading', () => {
  it('should show loading state then data', async () => {
    render(<ProductList />);
    
    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data to load
    await TestHelpers.waitForLoadingToFinish();
    
    // Check data is displayed
    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
describe('User Interactions', () => {
  it('should update cart when add to cart is clicked', async () => {
    const user = userEvent.setup();
    const mockAddToCart = vi.fn();
    
    render(<ProductCard onAddToCart={mockAddToCart} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
});
```

## Running Tests

### Command Line

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test ProductCard.test.tsx

# Run tests matching pattern
npm run test --grep "payment"

# Run integration tests only
npm run test src/tests/integration/

# Run e2e tests
npm run test:e2e
```

### Test Scripts in package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:smoke": "npm run test -- --run src/tests/smoke/",
    "test:integration": "npm run test -- src/tests/integration/",
    "test:watch": "vitest --watch"
  }
}
```

## Test Coverage

### Coverage Goals

- **Overall Coverage**: 85%+
- **Critical Components**: 95%+
- **Business Logic**: 90%+
- **Edge Functions**: 90%+

### Coverage Reports

Generate and view coverage reports:

```bash
npm run test:coverage
open coverage/index.html
```

### Coverage Configuration

```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: [
    'node_modules/',
    'src/tests/',
    '**/*.d.ts',
    'dist/',
    'supabase/',
  ],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

## Best Practices

### 1. Test Naming

```typescript
// ✅ Good: Descriptive test names
describe('ProductCard component', () => {
  it('should display product name and price when provided', () => {
    // test implementation
  });
  
  it('should show loading state when product data is not available', () => {
    // test implementation
  });
});

// ❌ Bad: Vague test names
describe('ProductCard', () => {
  it('works', () => {
    // test implementation
  });
});
```

### 2. Test Organization

```typescript
describe('UserDashboard', () => {
  beforeEach(() => {
    // Common setup
  });
  
  describe('when user is authenticated', () => {
    beforeEach(() => {
      // Auth setup
    });
    
    it('should display user information', () => {
      // test implementation
    });
  });
  
  describe('when user is not authenticated', () => {
    it('should redirect to login', () => {
      // test implementation
    });
  });
});
```

### 3. Mocking Strategy

```typescript
// ✅ Good: Mock at the module level
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: TestHelpers.createMockUser(),
    isAuthenticated: true,
  }),
}));

// ❌ Bad: Mock implementation details
vi.mock('@/components/complex-component', () => ({
  ComplexComponent: () => <div>Mocked Complex Component</div>,
}));
```

### 4. Assertions

```typescript
// ✅ Good: Specific assertions
expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
expect(mockFunction).toHaveBeenCalledWith(expectedArgument);

// ❌ Bad: Vague assertions
expect(screen.getByTestId('button')).toBeTruthy();
expect(mockFunction).toHaveBeenCalled();
```

### 5. Test Data

```typescript
// ✅ Good: Use test helpers for consistent data
const product = TestHelpers.createMockProduct({
  name: 'Specific Test Product',
  price: 299.99,
});

// ❌ Bad: Inline test data
const product = {
  id: '123',
  name: 'Test',
  price: 100,
  // ... many properties
};
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run e2e tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

### Test Environment Setup

```bash
# Set up test database
npm run db:test:setup

# Run migrations
npm run db:test:migrate

# Seed test data
npm run db:test:seed
```

## Debugging Tests

### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Common Issues

1. **Tests timing out**: Increase timeout or optimize async operations
2. **Flaky tests**: Use proper waiting strategies and cleanup
3. **Mock not working**: Check mock placement and implementation
4. **State pollution**: Ensure proper cleanup between tests

## Performance Testing

### Load Testing with k6

```javascript
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function() {
  let response = http.get('https://bdcommerce.com/api/products');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### Memory Leak Testing

```typescript
describe('Memory Leak Tests', () => {
  it('should not leak memory on component mount/unmount', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<ProductList />);
      unmount();
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Allow for some memory variance
    expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
  });
});
```

## Conclusion

A comprehensive testing strategy ensures the reliability, performance, and maintainability of the BDCommerce platform. By following these guidelines and best practices, we can build confidence in our codebase and deliver a high-quality user experience.

Remember to:
- Write tests as you develop features
- Maintain high test coverage
- Keep tests fast and reliable
- Use appropriate testing tools for each scenario
- Continuously improve testing practices