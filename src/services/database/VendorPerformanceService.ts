
import { supabase } from '@/integrations/supabase/client';

export interface VendorPerformanceReport {
  id?: string;
  vendor_id: string;
  report_period_start: string;
  report_period_end: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  // Sales Performance Metrics
  total_revenue?: number;
  total_orders?: number;
  average_order_value?: number;
  conversion_rate?: number;
  
  // Product Performance Metrics
  total_products_listed?: number;
  active_products?: number;
  out_of_stock_products?: number;
  top_selling_product_id?: string;
  
  // Customer Service Metrics
  customer_satisfaction_score?: number;
  response_time_hours?: number;
  resolution_rate?: number;
  total_complaints?: number;
  resolved_complaints?: number;
  
  // Delivery Performance Metrics
  on_time_delivery_rate?: number;
  average_delivery_time_days?: number;
  delivery_success_rate?: number;
  return_rate?: number;
  
  // Quality Metrics
  product_quality_rating?: number;
  packaging_quality_rating?: number;
  description_accuracy_rating?: number;
  
  // Financial Metrics
  commission_paid?: number;
  refunds_issued?: number;
  profit_margin?: number;
  
  // Traffic and Engagement Metrics
  page_views?: number;
  unique_visitors?: number;
  bounce_rate?: number;
  time_on_page_seconds?: number;
  
  // Inventory Metrics
  inventory_turnover_rate?: number;
  stockout_frequency?: number;
  overstock_value?: number;
  
  // Competition Analysis
  market_share_percentage?: number;
  price_competitiveness_score?: number;
  
  // Additional Metrics
  review_count?: number;
  average_rating?: number;
  seller_level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  compliance_score?: number;
  
  created_by: string;
  approved_by?: string;
  status?: 'draft' | 'pending' | 'approved' | 'published';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorPerformanceTarget {
  id?: string;
  vendor_id: string;
  target_period: 'monthly' | 'quarterly' | 'yearly';
  target_year: number;
  target_month?: number;
  target_quarter?: number;
  revenue_target?: number;
  orders_target?: number;
  conversion_rate_target?: number;
  customer_satisfaction_target?: number;
  on_time_delivery_target?: number;
  quality_rating_target?: number;
  set_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorPerformanceAlert {
  id?: string;
  vendor_id: string;
  alert_type: 'performance_drop' | 'target_missed' | 'quality_issue' | 'delivery_delay' | 'stock_out' | 'customer_complaint';
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  metric_name: string;
  current_value?: number;
  threshold_value?: number;
  alert_message: string;
  is_resolved?: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at?: string;
}

export interface VendorBenchmark {
  id?: string;
  industry_category: string;
  benchmark_type: 'revenue' | 'conversion' | 'satisfaction' | 'delivery' | 'quality';
  metric_name: string;
  benchmark_value: number;
  percentile_25?: number;
  percentile_50?: number;
  percentile_75?: number;
  percentile_90?: number;
  data_source?: string;
  last_updated?: string;
  created_at?: string;
}

export class VendorPerformanceService {
  // Performance Reports
  static async getPerformanceReports(filters?: { vendor_id?: string; report_type?: string; status?: string }) {
    let query = supabase.from('vendor_performance_reports').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.report_type) query = query.eq('report_type', filters.report_type);
    if (filters?.status) query = query.eq('status', filters.status);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async createPerformanceReport(reportData: VendorPerformanceReport) {
    const { data, error } = await supabase
      .from('vendor_performance_reports')
      .insert(reportData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async updatePerformanceReport(id: string, reportData: Partial<VendorPerformanceReport>) {
    const { data, error } = await supabase
      .from('vendor_performance_reports')
      .update({ ...reportData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async deletePerformanceReport(id: string) {
    const { data, error } = await supabase
      .from('vendor_performance_reports')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  }

  // Performance Targets
  static async getPerformanceTargets(vendor_id?: string) {
    let query = supabase.from('vendor_performance_targets').select('*');
    if (vendor_id) query = query.eq('vendor_id', vendor_id);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async createPerformanceTarget(targetData: VendorPerformanceTarget) {
    const { data, error } = await supabase
      .from('vendor_performance_targets')
      .insert(targetData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async updatePerformanceTarget(id: string, targetData: Partial<VendorPerformanceTarget>) {
    const { data, error } = await supabase
      .from('vendor_performance_targets')
      .update({ ...targetData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Performance Alerts
  static async getPerformanceAlerts(filters?: { vendor_id?: string; severity_level?: string; is_resolved?: boolean }) {
    let query = supabase.from('vendor_performance_alerts').select('*');
    
    if (filters?.vendor_id) query = query.eq('vendor_id', filters.vendor_id);
    if (filters?.severity_level) query = query.eq('severity_level', filters.severity_level);
    if (filters?.is_resolved !== undefined) query = query.eq('is_resolved', filters.is_resolved);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async createPerformanceAlert(alertData: VendorPerformanceAlert) {
    const { data, error } = await supabase
      .from('vendor_performance_alerts')
      .insert(alertData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async resolveAlert(id: string, resolved_by: string) {
    const { data, error } = await supabase
      .from('vendor_performance_alerts')
      .update({
        is_resolved: true,
        resolved_by,
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Benchmarks
  static async getBenchmarks(industry_category?: string) {
    let query = supabase.from('vendor_benchmarks').select('*');
    if (industry_category) query = query.eq('industry_category', industry_category);
    
    const { data, error } = await query.order('metric_name');
    if (error) throw error;
    return data;
  }

  static async createBenchmark(benchmarkData: VendorBenchmark) {
    const { data, error } = await supabase
      .from('vendor_benchmarks')
      .insert(benchmarkData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Analytics Methods
  static async getVendorPerformanceSummary(vendor_id: string, period: string = 'monthly') {
    const { data, error } = await supabase
      .from('vendor_performance_reports')
      .select('*')
      .eq('vendor_id', vendor_id)
      .eq('report_type', period)
      .order('report_period_start', { ascending: false })
      .limit(12);
    
    if (error) throw error;
    return data;
  }

  static async getTopPerformingVendors(limit: number = 10) {
    const { data, error } = await supabase
      .from('vendor_performance_reports')
      .select('vendor_id, total_revenue, customer_satisfaction_score, on_time_delivery_rate')
      .eq('status', 'published')
      .order('total_revenue', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
}
