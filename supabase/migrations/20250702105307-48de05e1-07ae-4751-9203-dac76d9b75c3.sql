-- Phase 3: Advanced Security & Compliance Tables

-- Zero-Trust Identity Verification
CREATE TABLE public.zero_trust_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  trust_score NUMERIC NOT NULL DEFAULT 0,
  verification_level TEXT NOT NULL DEFAULT 'basic',
  device_fingerprint TEXT NOT NULL,
  ip_address INET NOT NULL,
  location_data JSONB NOT NULL DEFAULT '{}',
  context_analysis JSONB NOT NULL DEFAULT '{}',
  continuous_checks JSONB NOT NULL DEFAULT '[]',
  risk_factors JSONB NOT NULL DEFAULT '[]',
  verification_methods JSONB NOT NULL DEFAULT '[]',
  last_verification TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trust Policies Configuration
CREATE TABLE public.zero_trust_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_name TEXT NOT NULL UNIQUE,
  policy_type TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  trust_requirements JSONB NOT NULL DEFAULT '{}',
  verification_requirements JSONB NOT NULL DEFAULT '[]',
  risk_thresholds JSONB NOT NULL DEFAULT '{}',
  enforcement_actions JSONB NOT NULL DEFAULT '[]',
  priority INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  applies_to_roles JSONB NOT NULL DEFAULT '["all"]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fraud Detection Models
CREATE TABLE public.fraud_detection_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL,
  algorithm_config JSONB NOT NULL DEFAULT '{}',
  feature_weights JSONB NOT NULL DEFAULT '{}',
  training_data_stats JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB NOT NULL DEFAULT '{}',
  fraud_patterns JSONB NOT NULL DEFAULT '[]',
  bangladesh_specific_rules JSONB NOT NULL DEFAULT '{}',
  threshold_config JSONB NOT NULL DEFAULT '{}',
  last_trained TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  model_version TEXT NOT NULL DEFAULT '1.0',
  accuracy_score NUMERIC NOT NULL DEFAULT 0,
  false_positive_rate NUMERIC NOT NULL DEFAULT 0,
  false_negative_rate NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Behavioral Profiles
CREATE TABLE public.user_behavioral_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  behavior_patterns JSONB NOT NULL DEFAULT '{}',
  transaction_patterns JSONB NOT NULL DEFAULT '{}',
  device_patterns JSONB NOT NULL DEFAULT '{}',
  location_patterns JSONB NOT NULL DEFAULT '{}',
  time_patterns JSONB NOT NULL DEFAULT '{}',
  risk_indicators JSONB NOT NULL DEFAULT '[]',
  anomaly_scores JSONB NOT NULL DEFAULT '{}',
  profile_confidence NUMERIC NOT NULL DEFAULT 0,
  last_pattern_update TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  baseline_established_at TIMESTAMP WITH TIME ZONE,
  profile_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fraud Detection Events
CREATE TABLE public.fraud_detection_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  event_type TEXT NOT NULL,
  fraud_score NUMERIC NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'low',
  detection_model TEXT NOT NULL,
  triggered_rules JSONB NOT NULL DEFAULT '[]',
  event_data JSONB NOT NULL DEFAULT '{}',
  behavioral_anomalies JSONB NOT NULL DEFAULT '[]',
  bangladesh_specific_flags JSONB NOT NULL DEFAULT '[]',
  investigation_status TEXT NOT NULL DEFAULT 'pending',
  false_positive BOOLEAN,
  investigated_by UUID,
  investigated_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  mitigation_actions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance Framework
CREATE TABLE public.compliance_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  framework_name TEXT NOT NULL UNIQUE,
  framework_type TEXT NOT NULL,
  regulatory_body TEXT NOT NULL,
  jurisdiction TEXT NOT NULL DEFAULT 'Bangladesh',
  compliance_rules JSONB NOT NULL DEFAULT '[]',
  audit_requirements JSONB NOT NULL DEFAULT '{}',
  data_sovereignty_rules JSONB NOT NULL DEFAULT '{}',
  reporting_requirements JSONB NOT NULL DEFAULT '{}',
  violation_penalties JSONB NOT NULL DEFAULT '{}',
  implementation_guidelines JSONB NOT NULL DEFAULT '{}',
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  effective_from DATE NOT NULL,
  effective_to DATE,
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance Monitoring
CREATE TABLE public.compliance_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  framework_id UUID NOT NULL,
  compliance_check_type TEXT NOT NULL,
  check_frequency TEXT NOT NULL,
  last_check_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_check_at TIMESTAMP WITH TIME ZONE NOT NULL,
  compliance_status TEXT NOT NULL DEFAULT 'compliant',
  violations_detected JSONB NOT NULL DEFAULT '[]',
  audit_trail JSONB NOT NULL DEFAULT '[]',
  remediation_actions JSONB NOT NULL DEFAULT '[]',
  automated_fixes_applied JSONB NOT NULL DEFAULT '[]',
  manual_review_required BOOLEAN NOT NULL DEFAULT false,
  data_sovereignty_compliance JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced Audit Trails
CREATE TABLE public.enhanced_audit_trails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  action_performed TEXT NOT NULL,
  data_before JSONB,
  data_after JSONB,
  compliance_tags JSONB NOT NULL DEFAULT '[]',
  regulatory_classification TEXT,
  data_sensitivity_level TEXT NOT NULL DEFAULT 'public',
  geographic_location TEXT,
  ip_address INET,
  user_agent TEXT,
  request_headers JSONB,
  business_context JSONB NOT NULL DEFAULT '{}',
  security_context JSONB NOT NULL DEFAULT '{}',
  retention_period INTERVAL NOT NULL DEFAULT '7 years',
  immutable_hash TEXT NOT NULL,
  blockchain_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bangladesh Specific Compliance
CREATE TABLE public.bangladesh_compliance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  compliance_type TEXT NOT NULL,
  regulatory_body TEXT NOT NULL,
  license_number TEXT,
  compliance_status TEXT NOT NULL DEFAULT 'active',
  requirements_checklist JSONB NOT NULL DEFAULT '[]',
  documentation_links JSONB NOT NULL DEFAULT '[]',
  submission_deadlines JSONB NOT NULL DEFAULT '[]',
  penalty_risks JSONB NOT NULL DEFAULT '[]',
  local_representative_info JSONB,
  data_localization_status JSONB NOT NULL DEFAULT '{}',
  financial_reporting_status JSONB NOT NULL DEFAULT '{}',
  tax_compliance_status JSONB NOT NULL DEFAULT '{}',
  last_audit_date DATE,
  next_audit_date DATE,
  compliance_officer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security Context Analysis
CREATE TABLE public.security_context_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  context_type TEXT NOT NULL,
  analysis_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_context JSONB NOT NULL DEFAULT '{}',
  network_context JSONB NOT NULL DEFAULT '{}',
  behavioral_context JSONB NOT NULL DEFAULT '{}',
  geolocation_context JSONB NOT NULL DEFAULT '{}',
  threat_indicators JSONB NOT NULL DEFAULT '[]',
  anomaly_scores JSONB NOT NULL DEFAULT '{}',
  risk_assessment JSONB NOT NULL DEFAULT '{}',
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  confidence_score NUMERIC NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_zero_trust_sessions_user_id ON public.zero_trust_sessions(user_id);
CREATE INDEX idx_zero_trust_sessions_trust_score ON public.zero_trust_sessions(trust_score);
CREATE INDEX idx_zero_trust_sessions_expires_at ON public.zero_trust_sessions(expires_at);
CREATE INDEX idx_fraud_detection_events_user_id ON public.fraud_detection_events(user_id);
CREATE INDEX idx_fraud_detection_events_fraud_score ON public.fraud_detection_events(fraud_score);
CREATE INDEX idx_fraud_detection_events_created_at ON public.fraud_detection_events(created_at);
CREATE INDEX idx_user_behavioral_profiles_user_id ON public.user_behavioral_profiles(user_id);
CREATE INDEX idx_compliance_monitoring_framework_id ON public.compliance_monitoring(framework_id);
CREATE INDEX idx_enhanced_audit_trails_user_id ON public.enhanced_audit_trails(user_id);
CREATE INDEX idx_enhanced_audit_trails_created_at ON public.enhanced_audit_trails(created_at);
CREATE INDEX idx_enhanced_audit_trails_resource_type ON public.enhanced_audit_trails(resource_type);
CREATE INDEX idx_security_context_session_id ON public.security_context_analysis(session_id);

-- Enable RLS
ALTER TABLE public.zero_trust_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zero_trust_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavioral_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_detection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_audit_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangladesh_compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_context_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Zero Trust
CREATE POLICY "Admin full access zero_trust_sessions" ON public.zero_trust_sessions FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their own zero trust sessions" ON public.zero_trust_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin full access zero_trust_policies" ON public.zero_trust_policies FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access fraud_detection_models" ON public.fraud_detection_models FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access user_behavioral_profiles" ON public.user_behavioral_profiles FOR ALL USING (is_admin_user());
CREATE POLICY "Users can view their behavioral profile" ON public.user_behavioral_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin full access fraud_detection_events" ON public.fraud_detection_events FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access compliance_frameworks" ON public.compliance_frameworks FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access compliance_monitoring" ON public.compliance_monitoring FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access enhanced_audit_trails" ON public.enhanced_audit_trails FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access bangladesh_compliance_tracking" ON public.bangladesh_compliance_tracking FOR ALL USING (is_admin_user());

CREATE POLICY "Admin full access security_context_analysis" ON public.security_context_analysis FOR ALL USING (is_admin_user());

-- Functions for security operations
CREATE OR REPLACE FUNCTION public.calculate_trust_score(
  p_user_id UUID,
  p_session_id TEXT,
  p_context_data JSONB
) RETURNS NUMERIC AS $$
DECLARE
  v_base_score NUMERIC := 50;
  v_behavioral_score NUMERIC := 0;
  v_device_score NUMERIC := 0;
  v_location_score NUMERIC := 0;
  v_time_score NUMERIC := 0;
  v_final_score NUMERIC;
BEGIN
  -- Calculate behavioral score based on user patterns
  SELECT COALESCE(profile_confidence * 20, 0) INTO v_behavioral_score
  FROM public.user_behavioral_profiles 
  WHERE user_id = p_user_id;
  
  -- Device familiarity score
  v_device_score := CASE 
    WHEN p_context_data->>'device_known' = 'true' THEN 20
    ELSE -10
  END;
  
  -- Location consistency score
  v_location_score := CASE 
    WHEN p_context_data->>'location_familiar' = 'true' THEN 15
    WHEN p_context_data->>'location_country' = 'Bangladesh' THEN 5
    ELSE -5
  END;
  
  -- Time pattern score
  v_time_score := CASE 
    WHEN p_context_data->>'time_pattern_normal' = 'true' THEN 10
    ELSE -5
  END;
  
  v_final_score := v_base_score + v_behavioral_score + v_device_score + v_location_score + v_time_score;
  
  -- Ensure score is between 0 and 100
  v_final_score := GREATEST(0, LEAST(100, v_final_score));
  
  RETURN v_final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.detect_fraud_patterns(
  p_user_id UUID,
  p_transaction_data JSONB
) RETURNS JSONB AS $$
DECLARE
  v_fraud_score NUMERIC := 0;
  v_risk_factors JSONB := '[]'::jsonb;
  v_behavioral_profile RECORD;
  v_result JSONB;
BEGIN
  -- Get user behavioral profile
  SELECT * INTO v_behavioral_profile 
  FROM public.user_behavioral_profiles 
  WHERE user_id = p_user_id;
  
  -- Check transaction amount patterns
  IF (p_transaction_data->>'amount')::numeric > 
     COALESCE((v_behavioral_profile.transaction_patterns->>'avg_amount')::numeric * 5, 10000) THEN
    v_fraud_score := v_fraud_score + 30;
    v_risk_factors := v_risk_factors || '["unusual_amount"]'::jsonb;
  END IF;
  
  -- Check time patterns (Bangladesh timezone)
  IF EXTRACT(hour FROM now() AT TIME ZONE 'Asia/Dhaka') BETWEEN 2 AND 5 THEN
    v_fraud_score := v_fraud_score + 15;
    v_risk_factors := v_risk_factors || '["unusual_time"]'::jsonb;
  END IF;
  
  -- Check mobile money specific patterns
  IF p_transaction_data->>'payment_method' IN ('bkash', 'nagad', 'rocket') THEN
    IF p_transaction_data->>'beneficiary_verification' != 'verified' THEN
      v_fraud_score := v_fraud_score + 25;
      v_risk_factors := v_risk_factors || '["unverified_mobile_money"]'::jsonb;
    END IF;
  END IF;
  
  v_result := jsonb_build_object(
    'fraud_score', v_fraud_score,
    'risk_level', CASE 
      WHEN v_fraud_score >= 70 THEN 'high'
      WHEN v_fraud_score >= 40 THEN 'medium'
      ELSE 'low'
    END,
    'risk_factors', v_risk_factors,
    'requires_manual_review', v_fraud_score >= 50
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_enhanced_audit_event(
  p_event_type TEXT,
  p_user_id UUID,
  p_resource_type TEXT,
  p_action TEXT,
  p_data_before JSONB DEFAULT NULL,
  p_data_after JSONB DEFAULT NULL,
  p_context JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
  v_immutable_hash TEXT;
BEGIN
  v_audit_id := gen_random_uuid();
  
  -- Create immutable hash for audit integrity
  v_immutable_hash := encode(digest(
    v_audit_id::text || p_event_type || COALESCE(p_user_id::text, '') || 
    p_resource_type || p_action || now()::text, 'sha256'
  ), 'hex');
  
  INSERT INTO public.enhanced_audit_trails (
    audit_id, event_type, user_id, resource_type, action_performed,
    data_before, data_after, business_context, security_context,
    immutable_hash, ip_address, user_agent
  ) VALUES (
    v_audit_id::text, p_event_type, p_user_id, p_resource_type, p_action,
    p_data_before, p_data_after, p_context,
    jsonb_build_object('trust_score', 
      COALESCE((SELECT trust_score FROM zero_trust_sessions 
                WHERE user_id = p_user_id AND status = 'active' 
                ORDER BY created_at DESC LIMIT 1), 0)
    ),
    v_immutable_hash,
    COALESCE(p_context->>'ip_address', '0.0.0.0')::inet,
    p_context->>'user_agent'
  );
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;