import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/hooks/useAuth'

const supabaseUrl = 'https://bbgppsjmspmymrfowytf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Enhanced Products API
export const productsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const response = await supabase.functions.invoke('products-api', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    return response
  },

  getById: async (id: string) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }
    })
    return response
  },

  create: async (product: any) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
    return response
  },

  update: async (id: string, updates: any) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    return response
  },

  delete: async (id: string) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }
    })
    return response
  }
}

// Vendor Management API
export const vendorApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const response = await supabase.functions.invoke('vendor-management-api', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }
    })
    return response
  },

  getById: async (id: string) => {
    const response = await supabase.functions.invoke('vendor-management-api', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      }
    })
    return response
  },

  create: async (vendor: any) => {
    const response = await supabase.functions.invoke('vendor-management-api', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vendor)
    })
    return response
  },

  update: async (id: string, updates: any) => {
    const response = await supabase.functions.invoke('vendor-management-api', {
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

// Orders API
export const ordersApi = {
  getAll: async (filters = {}) => {
    const response = await supabase.functions.invoke('orders-api', {
      method: 'GET',
      body: null
    })
    return response
  },

  getById: async (id: string) => {
    const response = await supabase.functions.invoke('orders-api', {
      method: 'GET',
      body: null
    })
    return response
  },

  create: async (orderData: any) => {
    const response = await supabase.functions.invoke('orders-api', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
    return response
  },

  updateStatus: async (id: string, status: any) => {
    const response = await supabase.functions.invoke('orders-api', {
      method: 'PUT',
      body: JSON.stringify(status)
    })
    return response
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