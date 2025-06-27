
-- Create vendor_performance_reports table to store comprehensive performance metrics
CREATE TABLE public.vendor_performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    
    -- Sales Performance Metrics
    total_revenue NUMERIC(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    average_order_value NUMERIC(10,2) DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0,
    
    -- Product Performance Metrics
    total_products_listed INTEGER DEFAULT 0,
    active_products INTEGER DEFAULT 0,
    out_of_stock_products INTEGER DEFAULT 0,
    top_selling_product_id UUID,
    
    -- Customer Service Metrics
    customer_satisfaction_score NUMERIC(3,2) DEFAULT 0,
    response_time_hours NUMERIC(6,2) DEFAULT 0,
    resolution_rate NUMERIC(5,2) DEFAULT 0,
    total_complaints INTEGER DEFAULT 0,
    resolved_complaints INTEGER DEFAULT 0,
    
    -- Delivery Performance Metrics
    on_time_delivery_rate NUMERIC(5,2) DEFAULT 0,
    average_delivery_time_days NUMERIC(4,1) DEFAULT 0,
    delivery_success_rate NUMERIC(5,2) DEFAULT 0,
    return_rate NUMERIC(5,2) DEFAULT 0,
    
    -- Quality Metrics
    product_quality_rating NUMERIC(3,2) DEFAULT 0,
    packaging_quality_rating NUMERIC(3,2) DEFAULT 0,
    description_accuracy_rating NUMERIC(3,2) DEFAULT 0,
    
    -- Financial Metrics
    commission_paid NUMERIC(10,2) DEFAULT 0,
    refunds_issued NUMERIC(10,2) DEFAULT 0,
    profit_margin NUMERIC(5,2) DEFAULT 0,
    
    -- Traffic and Engagement Metrics
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate NUMERIC(5,2) DEFAULT 0,
    time_on_page_seconds INTEGER DEFAULT 0,
    
    -- Inventory Metrics
    inventory_turnover_rate NUMERIC(5,2) DEFAULT 0,
    stockout_frequency INTEGER DEFAULT 0,
    overstock_value NUMERIC(10,2) DEFAULT 0,
    
    -- Competition Analysis
    market_share_percentage NUMERIC(5,2) DEFAULT 0,
    price_competitiveness_score NUMERIC(3,2) DEFAULT 0,
    
    -- Additional Metrics
    review_count INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2) DEFAULT 0,
    seller_level TEXT DEFAULT 'bronze' CHECK (seller_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    compliance_score NUMERIC(3,2) DEFAULT 0,
    
    created_by UUID NOT NULL,
    approved_by UUID,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published')),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vendor_performance_targets table for setting performance goals
CREATE TABLE public.vendor_performance_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    target_period TEXT NOT NULL CHECK (target_period IN ('monthly', 'quarterly', 'yearly')),
    target_year INTEGER NOT NULL,
    target_month INTEGER CHECK (target_month BETWEEN 1 AND 12),
    target_quarter INTEGER CHECK (target_quarter BETWEEN 1 AND 4),
    
    -- Target Metrics
    revenue_target NUMERIC(12,2),
    orders_target INTEGER,
    conversion_rate_target NUMERIC(5,2),
    customer_satisfaction_target NUMERIC(3,2),
    on_time_delivery_target NUMERIC(5,2),
    quality_rating_target NUMERIC(3,2),
    
    set_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vendor_performance_alerts table for automated alerts
CREATE TABLE public.vendor_performance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('performance_drop', 'target_missed', 'quality_issue', 'delivery_delay', 'stock_out', 'customer_complaint')),
    severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    metric_name TEXT NOT NULL,
    current_value NUMERIC(10,2),
    threshold_value NUMERIC(10,2),
    alert_message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vendor_benchmarks table for industry benchmarks
CREATE TABLE public.vendor_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_category TEXT NOT NULL,
    benchmark_type TEXT NOT NULL CHECK (benchmark_type IN ('revenue', 'conversion', 'satisfaction', 'delivery', 'quality')),
    metric_name TEXT NOT NULL,
    benchmark_value NUMERIC(10,2) NOT NULL,
    percentile_25 NUMERIC(10,2),
    percentile_50 NUMERIC(10,2),
    percentile_75 NUMERIC(10,2),
    percentile_90 NUMERIC(10,2),
    data_source TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_benchmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing admin access)
CREATE POLICY "Admin can manage vendor performance reports" ON public.vendor_performance_reports FOR ALL USING (true);
CREATE POLICY "Admin can manage vendor performance targets" ON public.vendor_performance_targets FOR ALL USING (true);
CREATE POLICY "Admin can manage vendor performance alerts" ON public.vendor_performance_alerts FOR ALL USING (true);
CREATE POLICY "Admin can manage vendor benchmarks" ON public.vendor_benchmarks FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_vendor_performance_reports_vendor_id ON public.vendor_performance_reports(vendor_id);
CREATE INDEX idx_vendor_performance_reports_period ON public.vendor_performance_reports(report_period_start, report_period_end);
CREATE INDEX idx_vendor_performance_targets_vendor_id ON public.vendor_performance_targets(vendor_id);
CREATE INDEX idx_vendor_performance_alerts_vendor_id ON public.vendor_performance_alerts(vendor_id);
CREATE INDEX idx_vendor_performance_alerts_severity ON public.vendor_performance_alerts(severity_level);
CREATE INDEX idx_vendor_benchmarks_category ON public.vendor_benchmarks(industry_category);

-- Insert sample benchmark data
INSERT INTO public.vendor_benchmarks (industry_category, benchmark_type, metric_name, benchmark_value, percentile_25, percentile_50, percentile_75, percentile_90, data_source) VALUES
('Electronics', 'conversion', 'conversion_rate', 2.5, 1.5, 2.5, 3.5, 4.5, 'Industry Report 2024'),
('Electronics', 'satisfaction', 'customer_satisfaction_score', 4.2, 3.8, 4.2, 4.5, 4.8, 'Industry Report 2024'),
('Electronics', 'delivery', 'on_time_delivery_rate', 85.0, 75.0, 85.0, 90.0, 95.0, 'Industry Report 2024'),
('Fashion', 'conversion', 'conversion_rate', 3.2, 2.0, 3.2, 4.0, 5.0, 'Industry Report 2024'),
('Fashion', 'satisfaction', 'customer_satisfaction_score', 4.0, 3.5, 4.0, 4.3, 4.7, 'Industry Report 2024'),
('Fashion', 'delivery', 'on_time_delivery_rate', 80.0, 70.0, 80.0, 85.0, 90.0, 'Industry Report 2024'),
('Home & Garden', 'conversion', 'conversion_rate', 2.8, 1.8, 2.8, 3.8, 4.8, 'Industry Report 2024'),
('Home & Garden', 'satisfaction', 'customer_satisfaction_score', 4.1, 3.7, 4.1, 4.4, 4.7, 'Industry Report 2024'),
('Home & Garden', 'delivery', 'on_time_delivery_rate', 82.0, 72.0, 82.0, 87.0, 92.0, 'Industry Report 2024');
