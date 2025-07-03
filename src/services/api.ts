// Use the centralized microservice client instead of direct calls
import { microserviceClient } from './microserviceClient';
import { supabase } from '@/integrations/supabase/client';

// Export supabase for backward compatibility
export { supabase };

// Enhanced Products API using microservice client
export const productsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await microserviceClient.productService(`catalog?${params}`);
  },

  getById: async (id: string) => {
    return await microserviceClient.productService(`catalog/${id}`);
  },

  create: async (product: any) => {
    return await microserviceClient.productService('products', {
      method: 'POST',
      body: product
    });
  },

  update: async (id: string, updates: any) => {
    return await microserviceClient.productService(`products/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  updateInventory: async (productId: string, inventory: any) => {
    return await microserviceClient.productService('inventory', {
      method: 'PUT',
      body: { product_id: productId, ...inventory }
    });
  },

  delete: async (id: string) => {
    return await microserviceClient.productService(`products/${id}`, {
      method: 'DELETE'
    });
  }
}

// Vendor Management API using microservice client
export const vendorApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await microserviceClient.vendorService(`vendors?${params}`);
  },

  getById: async (id: string) => {
    return await microserviceClient.vendorService(`vendor/${id}`);
  },

  create: async (vendor: any) => {
    return await microserviceClient.vendorService('vendors', {
      method: 'POST',
      body: vendor
    });
  },

  update: async (id: string, updates: any) => {
    return await microserviceClient.vendorService(`vendor/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  delete: async (id: string) => {
    return await microserviceClient.vendorService(`vendor/${id}`, {
      method: 'DELETE'
    });
  }
}

// User Management API
export const userApi = {
  getAll: async (filters = {}) => {
    const response = await supabase.functions.invoke('user-management-api', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }
    })
    return response
  },

  getById: async (id: string) => {
    const response = await supabase.functions.invoke('user-management-api', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }
    })
    return response
  },

  update: async (id: string, updates: any) => {
    const response = await supabase.functions.invoke('user-management-api', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    return response
  }
}

// Orders API using microservice client
export const ordersApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await microserviceClient.orderService(`orders?${params}`);
  },

  getById: async (id: string) => {
    return await microserviceClient.orderService(`orders/${id}`);
  },

  create: async (orderData: any) => {
    return await microserviceClient.orderService('orders', {
      method: 'POST',
      body: orderData
    });
  },

  updateStatus: async (id: string, status: any) => {
    return await microserviceClient.orderService(`orders/${id}`, {
      method: 'PUT',
      body: { status }
    });
  }
}

// File Upload API
export const fileUploadApi = {
  upload: async (file: File, folder = '', bucket = 'product-images') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('bucket', bucket)

    const response = await supabase.functions.invoke('file-upload', {
      method: 'POST',
      body: formData
    })
    return response
  },

  delete: async (filePath: string, bucket = 'product-images') => {
    const response = await supabase.functions.invoke('file-upload', {
      method: 'DELETE',
      body: JSON.stringify({ filePath, bucket })
    })
    return response
  }
}

// Auth API
export const authApi = {
  signUp: async (userData: any) => {
    const response = await supabase.functions.invoke('auth-api/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    return response
  },

  signIn: async (credentials: any) => {
    const response = await supabase.functions.invoke('auth-api/signin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    return response
  },

  signOut: async () => {
    const response = await supabase.functions.invoke('auth-api/signout', {
      method: 'POST'
    })
    return response
  },

  getProfile: async () => {
    const response = await supabase.functions.invoke('auth-api/profile', {
      method: 'GET'
    })
    return response
  },

  updateProfile: async (profileData: any) => {
    const response = await supabase.functions.invoke('auth-api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
    return response
  }
}

// Payment Processing API
export const paymentApi = {
  getPaymentMethods: async () => {
    const response = await supabase.functions.invoke('payment-processing/methods', {
      method: 'GET'
    })
    return response
  },

  initiatePayment: async (paymentData: any) => {
    const response = await supabase.functions.invoke('payment-processing/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })
    return response
  },

  verifyPayment: async (verificationData: any) => {
    const response = await supabase.functions.invoke('payment-processing/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData)
    })
    return response
  },

  getPaymentStatus: async (paymentId: string) => {
    const response = await supabase.functions.invoke(`payment-processing/status/${paymentId}`, {
      method: 'GET'
    })
    return response
  }
}

// Search API
export const searchApi = {
  search: async (params: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const response = await supabase.functions.invoke(`search-api?${searchParams.toString()}`, {
      method: 'GET'
    })
    return response
  },

  logSearch: async (searchData: any) => {
    const response = await supabase.functions.invoke('search-api', {
      method: 'POST',
      body: JSON.stringify(searchData)
    })
    return response
  }
}

// Notifications API
export const notificationsApi = {
  getNotifications: async (params?: { limit?: number; offset?: number; unread?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.unread) searchParams.append('unread', 'true');

    const response = await supabase.functions.invoke(`notifications-api?${searchParams.toString()}`, {
      method: 'GET'
    })
    return response
  },

  markAsRead: async (notificationId: string) => {
    const response = await supabase.functions.invoke(`notifications-api/${notificationId}/read`, {
      method: 'PUT'
    })
    return response
  },

  markAllAsRead: async () => {
    const response = await supabase.functions.invoke('notifications-api/read-all', {
      method: 'PUT'
    })
    return response
  },

  deleteNotification: async (notificationId: string) => {
    const response = await supabase.functions.invoke(`notifications-api/${notificationId}`, {
      method: 'DELETE'
    })
    return response
  },

  createNotification: async (notificationData: any) => {
    const response = await supabase.functions.invoke('notifications-api', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    })
    return response
  }
}