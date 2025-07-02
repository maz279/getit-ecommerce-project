import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Test utilities and helpers
export class TestHelpers {
  static createQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
  }

  static createWrapper(queryClient?: QueryClient) {
    const client = queryClient || this.createQueryClient();
    
    return function Wrapper({ children }: { children: any }) {
      return React.createElement(QueryClientProvider, { client },
        React.createElement(BrowserRouter, null, children)
      );
    };
  }

  static async waitForLoadingToFinish() {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  }

  static mockSupabaseAuth(user = null) {
    const mockAuth = {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: user ? { user } : null }, error: null }),
      signIn: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    };

    return mockAuth;
  }

  static mockSupabaseClient() {
    return {
      auth: this.mockSupabaseAuth(),
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
      },
    };
  }

  static createMockProduct(overrides = {}) {
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Product',
      description: 'Test product description',
      price: 299.99,
      category_id: 'cat-123',
      vendor_id: 'vendor-123',
      images: ['https://example.com/image1.jpg'],
      tags: ['electronics', 'smartphone'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      ...overrides,
    };
  }

  static createMockVendor(overrides = {}) {
    return {
      id: 'vendor-123',
      name: 'Test Vendor',
      email: 'vendor@test.com',
      phone: '+880123456789',
      status: 'approved',
      business_type: 'retail',
      address: {
        street: '123 Test Street',
        city: 'Dhaka',
        country: 'Bangladesh',
      },
      created_at: '2024-01-01T00:00:00Z',
      ...overrides,
    };
  }

  static createMockOrder(overrides = {}) {
    return {
      id: 'order-123',
      user_id: 'user-123',
      order_number: 'ORD-20240101-000001',
      total_amount: 599.98,
      status: 'confirmed',
      items: [
        {
          id: 'item-1',
          product_id: 'product-123',
          quantity: 2,
          unit_price: 299.99,
          total_price: 599.98,
        },
      ],
      shipping_address: {
        name: 'John Doe',
        phone: '+880123456789',
        address: '123 Test Address, Dhaka',
      },
      payment_method: 'bkash',
      created_at: '2024-01-01T00:00:00Z',
      ...overrides,
    };
  }

  static createMockUser(overrides = {}) {
    return {
      id: 'user-123',
      email: 'user@test.com',
      user_metadata: {
        full_name: 'Test User',
        phone: '+880123456789',
      },
      app_metadata: {
        role: 'customer',
      },
      created_at: '2024-01-01T00:00:00Z',
      ...overrides,
    };
  }

  static async typeIntoInput(inputElement: HTMLElement, text: string) {
    const user = userEvent.setup();
    await user.clear(inputElement);
    await user.type(inputElement, text);
  }

  static async clickButton(buttonText: string) {
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
    await user.click(button);
  }

  static expectToBeInDocument(text: string) {
    expect(screen.getByText(text)).toBeInTheDocument();
  }

  static expectNotToBeInDocument(text: string) {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  }

  static mockIntersectionObserver() {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  }

  static mockResizeObserver() {
    const mockResizeObserver = vi.fn();
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.ResizeObserver = mockResizeObserver;
  }

  static mockMatchMedia() {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  static setupGlobalMocks() {
    this.mockIntersectionObserver();
    this.mockResizeObserver();
    this.mockMatchMedia();
  }

  static generateTestData(count: number, factory: () => any) {
    return Array.from({ length: count }, factory);
  }

  static async waitForError() {
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  }

  static createMockApiResponse(data: any, error = null) {
    return {
      data,
      error,
      status: error ? 400 : 200,
      statusText: error ? 'Bad Request' : 'OK',
    };
  }

  static mockEdgeFunctionResponse(functionName: string, response: any) {
    return vi.fn().mockImplementation((name) => {
      if (name === functionName) {
        return Promise.resolve({ data: response, error: null });
      }
      return Promise.resolve({ data: null, error: 'Function not found' });
    });
  }

  static createFormData(fields: Record<string, string>) {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  }

  static mockLocalStorage() {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    return localStorageMock;
  }

  static mockSessionStorage() {
    const sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
    });

    return sessionStorageMock;
  }

  static async fillForm(formFields: Record<string, string>) {
    const user = userEvent.setup();
    
    for (const [fieldName, value] of Object.entries(formFields)) {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
      await user.clear(field);
      await user.type(field, value);
    }
  }

  static expectFormToHaveValues(expectedValues: Record<string, string>) {
    Object.entries(expectedValues).forEach(([fieldName, expectedValue]) => {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i')) as HTMLInputElement;
      expect(field.value).toBe(expectedValue);
    });
  }

  static createMockFile(name = 'test.jpg', size = 1024, type = 'image/jpeg') {
    return new File(['test'], name, { type, lastModified: Date.now() });
  }

  static async uploadFile(inputElement: HTMLElement, file: File) {
    const user = userEvent.setup();
    await user.upload(inputElement, file);
  }

  static mockScrollIntoView() {
    Element.prototype.scrollIntoView = vi.fn();
  }

  static mockClipboard() {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
        readText: vi.fn().mockImplementation(() => Promise.resolve('')),
      },
    });
  }

  static expectElementToHaveClass(element: HTMLElement, className: string) {
    expect(element).toHaveClass(className);
  }

  static expectElementToHaveAttribute(element: HTMLElement, attribute: string, value?: string) {
    if (value !== undefined) {
      expect(element).toHaveAttribute(attribute, value);
    } else {
      expect(element).toHaveAttribute(attribute);
    }
  }

  static async waitForElementToBeRemoved(text: string) {
    await waitFor(() => {
      expect(screen.queryByText(new RegExp(text, 'i'))).not.toBeInTheDocument();
    });
  }

  static createMockAnalyticsData(overrides = {}) {
    return {
      totalRevenue: 150000,
      totalOrders: 1250,
      averageOrderValue: 120,
      conversionRate: 3.5,
      topProducts: [],
      salesByCategory: {},
      period: 'last_30_days',
      ...overrides,
    };
  }

  static createMockCommissionData(overrides = {}) {
    return {
      vendorId: 'vendor-123',
      totalCommission: 5000,
      commissionsThisMonth: 1200,
      commissionsLastMonth: 800,
      averageCommissionRate: 8.5,
      totalTransactions: 145,
      ...overrides,
    };
  }
}

// Common test patterns
export const commonTestPatterns = {
  async testComponentRenders(Component: React.ComponentType<any>, props: any = {}) {
    const Wrapper = TestHelpers.createWrapper();
    render(React.createElement(Component, props), { wrapper: Wrapper });
    
    expect(screen.getByTestId || screen.getByRole || screen.getByText).toBeDefined();
  },

  async testLoadingState(Component: React.ComponentType<any>, props: any = {}) {
    const Wrapper = TestHelpers.createWrapper();
    render(React.createElement(Component, props), { wrapper: Wrapper });
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  },

  async testErrorState(Component: React.ComponentType<any>, props: any = {}) {
    const Wrapper = TestHelpers.createWrapper();
    render(React.createElement(Component, props), { wrapper: Wrapper });
    
    await TestHelpers.waitForError();
  },

  async testFormSubmission(Component: React.ComponentType<any>, formData: Record<string, string>) {
    const Wrapper = TestHelpers.createWrapper();
    const mockSubmit = vi.fn();
    
    render(React.createElement(Component, { onSubmit: mockSubmit }), { wrapper: Wrapper });
    
    await TestHelpers.fillForm(formData);
    await TestHelpers.clickButton('submit');
    
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining(formData));
  },
};

// Export commonly used testing utilities
export {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
};