-- Enable RLS and add policies for search service tables

-- Enable RLS
ALTER TABLE public.search_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bangla_language_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_search_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_search_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics_aggregated ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_search_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies for search_configurations
CREATE POLICY "Admins can manage search configurations" ON public.search_configurations FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read active search configurations" ON public.search_configurations FOR SELECT USING (is_active = true);

-- RLS Policies for bangla_language_data
CREATE POLICY "Admins can manage bangla language data" ON public.bangla_language_data FOR ALL USING (is_admin_user());
CREATE POLICY "Public can read bangla language data" ON public.bangla_language_data FOR SELECT USING (true);

-- RLS Policies for visual_search_features
CREATE POLICY "System can manage visual search features" ON public.visual_search_features FOR ALL USING (true);

-- RLS Policies for user_search_profiles
CREATE POLICY "Users can view their search profiles" ON public.user_search_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their search profiles" ON public.user_search_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create search profiles" ON public.user_search_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all search profiles" ON public.user_search_profiles FOR SELECT USING (is_admin_user());

-- RLS Policies for search_suggestions
CREATE POLICY "Public can read active search suggestions" ON public.search_suggestions FOR SELECT USING (is_active = true);
CREATE POLICY "System can manage search suggestions" ON public.search_suggestions FOR ALL USING (true);

-- RLS Policies for search_analytics_aggregated
CREATE POLICY "Admins can view search analytics" ON public.search_analytics_aggregated FOR SELECT USING (is_admin_user());
CREATE POLICY "System can insert search analytics" ON public.search_analytics_aggregated FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update search analytics" ON public.search_analytics_aggregated FOR UPDATE USING (true);

-- RLS Policies for cultural_search_context
CREATE POLICY "Public can read active cultural context" ON public.cultural_search_context FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage cultural context" ON public.cultural_search_context FOR ALL USING (is_admin_user());