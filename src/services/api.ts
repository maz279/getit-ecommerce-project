import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/hooks/useAuth'

const supabaseUrl = 'https://bbgppsjmspmymrfowytf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Products API
export const productsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const response = await supabase.functions.invoke('products-api', {
      method: 'GET',
      body: null
    })
    return response
  },

  getById: async (id: string) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'GET',
      body: null
    })
    return response
  },

  create: async (product: any) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'POST',
      body: JSON.stringify(product)
    })
    return response
  },

  update: async (id: string, updates: any) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
    return response
  },

  delete: async (id: string) => {
    const response = await supabase.functions.invoke('products-api', {
      method: 'DELETE',
      body: null
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