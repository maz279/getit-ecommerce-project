import { supabase } from '@/integrations/supabase/client';

export class EnterpriseIntegrationsService {
  // Bangladesh Payment Gateway Integration
  static async processPayment(paymentData: any) {
    const { data, error } = await supabase.functions.invoke('bd-payment-gateway', {
      body: paymentData
    });
    
    if (error) throw error;
    return data;
  }

  // Courier Integration
  static async createShipment(shipmentData: any) {
    const { data, error } = await supabase.functions.invoke('bd-courier-integration/create-shipment', {
      body: shipmentData
    });
    
    if (error) throw error;
    return data;
  }

  static async trackShipment(trackingId: string) {
    const { data, error } = await supabase.functions.invoke('bd-courier-integration/track-shipment', {
      body: { tracking_id: trackingId }
    });
    
    if (error) throw error;
    return data;
  }

  // KYC Verification
  static async verifyDocument(verificationData: any) {
    const { data, error } = await supabase.functions.invoke('bd-kyc-verification/verify', {
      body: verificationData
    });
    
    if (error) throw error;
    return data;
  }

  // AI Recommendations
  static async generateRecommendations(requestData: any) {
    const { data, error } = await supabase.functions.invoke('ai-recommendation-engine/generate', {
      body: requestData
    });
    
    if (error) throw error;
    return data;
  }

  // Order Orchestration
  static async processOrder(orderData: any) {
    const { data, error } = await supabase.functions.invoke('order-orchestration/process-order', {
      body: orderData
    });
    
    if (error) throw error;
    return data;
  }

  // Smart Inventory Management
  static async getInventoryForecast(productId: string) {
    const { data, error } = await supabase
      .from('inventory_forecasts')
      .select('*')
      .eq('product_id', productId)
      .order('forecast_date', { ascending: false })
      .limit(30);
    
    if (error) throw error;
    return data;
  }

  static async getReorderSuggestions(vendorId: string) {
    const { data, error } = await supabase
      .from('smart_reorder_suggestions')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('status', 'pending')
      .order('priority_score', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}