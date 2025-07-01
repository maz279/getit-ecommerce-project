import { Database } from '@/integrations/supabase/types';

// Type aliases for easier usage with proper typing
export type Product = Database['public']['Tables']['products']['Row'] & {
  images: string[]; // Override Json type to be more specific
  vendor?: Vendor;
}

export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Vendor = Database['public']['Tables']['vendors']['Row'] & {
  logo?: string; // Add optional logo field for UI
}
export type VendorInsert = Database['public']['Tables']['vendors']['Insert']
export type VendorUpdate = Database['public']['Tables']['vendors']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type Order = Database['public']['Tables']['orders']['Row']