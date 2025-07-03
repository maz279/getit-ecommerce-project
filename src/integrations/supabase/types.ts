export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ab_experiment_participants: {
        Row: {
          assigned_at: string | null
          conversion_events: Json | null
          experiment_id: string | null
          id: string
          session_id: string | null
          user_id: string | null
          variant_id: string
        }
        Insert: {
          assigned_at?: string | null
          conversion_events?: Json | null
          experiment_id?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
          variant_id: string
        }
        Update: {
          assigned_at?: string | null
          conversion_events?: Json | null
          experiment_id?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_experiment_participants_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_experiments: {
        Row: {
          auto_winner_selection: boolean | null
          confidence_level: number | null
          conversion_goals: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          experiment_name: string
          experiment_type: string
          id: string
          minimum_sample_size: number | null
          start_date: string | null
          statistical_significance: number | null
          status: string | null
          success_metrics: Json | null
          target_audience: Json | null
          traffic_allocation: Json | null
          traffic_split: Json | null
          updated_at: string | null
          variants: Json
        }
        Insert: {
          auto_winner_selection?: boolean | null
          confidence_level?: number | null
          conversion_goals?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          experiment_name: string
          experiment_type: string
          id?: string
          minimum_sample_size?: number | null
          start_date?: string | null
          statistical_significance?: number | null
          status?: string | null
          success_metrics?: Json | null
          target_audience?: Json | null
          traffic_allocation?: Json | null
          traffic_split?: Json | null
          updated_at?: string | null
          variants?: Json
        }
        Update: {
          auto_winner_selection?: boolean | null
          confidence_level?: number | null
          conversion_goals?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          experiment_name?: string
          experiment_type?: string
          id?: string
          minimum_sample_size?: number | null
          start_date?: string | null
          statistical_significance?: number | null
          status?: string | null
          success_metrics?: Json | null
          target_audience?: Json | null
          traffic_allocation?: Json | null
          traffic_split?: Json | null
          updated_at?: string | null
          variants?: Json
        }
        Relationships: []
      }
      ab_test_results: {
        Row: {
          analysis_date: string | null
          confidence_interval: Json | null
          conversion_rate: number | null
          experiment_id: string | null
          id: string
          is_winner: boolean | null
          metric_name: string
          metric_value: number
          p_value: number | null
          sample_size: number
          statistical_significance: number | null
          variant_id: string
        }
        Insert: {
          analysis_date?: string | null
          confidence_interval?: Json | null
          conversion_rate?: number | null
          experiment_id?: string | null
          id?: string
          is_winner?: boolean | null
          metric_name: string
          metric_value: number
          p_value?: number | null
          sample_size: number
          statistical_significance?: number | null
          variant_id: string
        }
        Update: {
          analysis_date?: string | null
          confidence_interval?: Json | null
          conversion_rate?: number | null
          experiment_id?: string | null
          id?: string
          is_winner?: boolean | null
          metric_name?: string
          metric_value?: number
          p_value?: number | null
          sample_size?: number
          statistical_significance?: number | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_results_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "ab_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      advanced_caching_config: {
        Row: {
          cache_layer: string
          cache_strategy: string
          cdn_config: Json | null
          compression_enabled: boolean | null
          created_at: string | null
          encryption_enabled: boolean | null
          eviction_policy: string | null
          geo_distribution: Json | null
          hit_rate_threshold: number | null
          id: string
          invalidation_rules: Json | null
          is_active: boolean | null
          max_memory_mb: number | null
          monitoring_config: Json | null
          performance_metrics: Json | null
          replication_config: Json | null
          sharding_config: Json | null
          ttl_seconds: number | null
          updated_at: string | null
          warming_strategies: Json | null
        }
        Insert: {
          cache_layer: string
          cache_strategy: string
          cdn_config?: Json | null
          compression_enabled?: boolean | null
          created_at?: string | null
          encryption_enabled?: boolean | null
          eviction_policy?: string | null
          geo_distribution?: Json | null
          hit_rate_threshold?: number | null
          id?: string
          invalidation_rules?: Json | null
          is_active?: boolean | null
          max_memory_mb?: number | null
          monitoring_config?: Json | null
          performance_metrics?: Json | null
          replication_config?: Json | null
          sharding_config?: Json | null
          ttl_seconds?: number | null
          updated_at?: string | null
          warming_strategies?: Json | null
        }
        Update: {
          cache_layer?: string
          cache_strategy?: string
          cdn_config?: Json | null
          compression_enabled?: boolean | null
          created_at?: string | null
          encryption_enabled?: boolean | null
          eviction_policy?: string | null
          geo_distribution?: Json | null
          hit_rate_threshold?: number | null
          id?: string
          invalidation_rules?: Json | null
          is_active?: boolean | null
          max_memory_mb?: number | null
          monitoring_config?: Json | null
          performance_metrics?: Json | null
          replication_config?: Json | null
          sharding_config?: Json | null
          ttl_seconds?: number | null
          updated_at?: string | null
          warming_strategies?: Json | null
        }
        Relationships: []
      }
      advanced_fraud_detection: {
        Row: {
          analyst_notes: string | null
          behavioral_analysis: Json | null
          created_at: string | null
          detection_model: string
          device_fingerprint: Json | null
          false_positive: boolean | null
          fraud_indicators: Json | null
          fraud_score: number
          geolocation_data: Json | null
          id: string
          investigation_status: string | null
          mitigation_actions: Json | null
          ml_predictions: Json | null
          payment_patterns: Json | null
          resolved_at: string | null
          risk_level: string
          session_id: string | null
          transaction_id: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          analyst_notes?: string | null
          behavioral_analysis?: Json | null
          created_at?: string | null
          detection_model?: string
          device_fingerprint?: Json | null
          false_positive?: boolean | null
          fraud_indicators?: Json | null
          fraud_score?: number
          geolocation_data?: Json | null
          id?: string
          investigation_status?: string | null
          mitigation_actions?: Json | null
          ml_predictions?: Json | null
          payment_patterns?: Json | null
          resolved_at?: string | null
          risk_level?: string
          session_id?: string | null
          transaction_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          analyst_notes?: string | null
          behavioral_analysis?: Json | null
          created_at?: string | null
          detection_model?: string
          device_fingerprint?: Json | null
          false_positive?: boolean | null
          fraud_indicators?: Json | null
          fraud_score?: number
          geolocation_data?: Json | null
          id?: string
          investigation_status?: string | null
          mitigation_actions?: Json | null
          ml_predictions?: Json | null
          payment_patterns?: Json | null
          resolved_at?: string | null
          risk_level?: string
          session_id?: string | null
          transaction_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      advanced_monitoring_config: {
        Row: {
          alert_rules: Json
          anomaly_detection_rules: Json
          auto_remediation_rules: Json
          availability_targets: Json
          compliance_configs: Json
          configuration: Json
          created_at: string | null
          dashboard_configs: Json
          data_retention_days: number
          id: string
          is_active: boolean | null
          monitoring_type: string
          notification_channels: Json
          performance_baselines: Json
          scrape_intervals: string
          sla_configs: Json
          updated_at: string | null
        }
        Insert: {
          alert_rules?: Json
          anomaly_detection_rules?: Json
          auto_remediation_rules?: Json
          availability_targets?: Json
          compliance_configs?: Json
          configuration?: Json
          created_at?: string | null
          dashboard_configs?: Json
          data_retention_days?: number
          id?: string
          is_active?: boolean | null
          monitoring_type: string
          notification_channels?: Json
          performance_baselines?: Json
          scrape_intervals?: string
          sla_configs?: Json
          updated_at?: string | null
        }
        Update: {
          alert_rules?: Json
          anomaly_detection_rules?: Json
          auto_remediation_rules?: Json
          availability_targets?: Json
          compliance_configs?: Json
          configuration?: Json
          created_at?: string | null
          dashboard_configs?: Json
          data_retention_days?: number
          id?: string
          is_active?: boolean | null
          monitoring_type?: string
          notification_channels?: Json
          performance_baselines?: Json
          scrape_intervals?: string
          sla_configs?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_analytics: {
        Row: {
          analysis_type: string
          confidence_score: number
          created_at: string | null
          execution_time_ms: number
          feedback_data: Json | null
          feedback_score: number | null
          id: string
          input_data: Json
          model_name: string
          model_version: string
          prediction_result: Json
          processed_at: string | null
          session_id: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          analysis_type: string
          confidence_score?: number
          created_at?: string | null
          execution_time_ms?: number
          feedback_data?: Json | null
          feedback_score?: number | null
          id?: string
          input_data?: Json
          model_name: string
          model_version: string
          prediction_result?: Json
          processed_at?: string | null
          session_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          analysis_type?: string
          confidence_score?: number
          created_at?: string | null
          execution_time_ms?: number
          feedback_data?: Json | null
          feedback_score?: number | null
          id?: string
          input_data?: Json
          model_name?: string
          model_version?: string
          prediction_result?: Json
          processed_at?: string | null
          session_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      ai_behavior_predictions: {
        Row: {
          confidence_score: number
          created_at: string | null
          expires_at: string | null
          id: string
          model_version: string
          predicted_action: string | null
          prediction_data: Json
          prediction_type: string
          probability_score: number | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          model_version?: string
          predicted_action?: string | null
          prediction_data?: Json
          prediction_type: string
          probability_score?: number | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          model_version?: string
          predicted_action?: string | null
          prediction_data?: Json
          prediction_type?: string
          probability_score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_chatbot_conversations: {
        Row: {
          context_data: Json | null
          conversation_data: Json
          created_at: string | null
          id: string
          satisfaction_rating: number | null
          sentiment_score: number | null
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          context_data?: Json | null
          conversation_data?: Json
          created_at?: string | null
          id?: string
          satisfaction_rating?: number | null
          sentiment_score?: number | null
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          context_data?: Json | null
          conversation_data?: Json
          created_at?: string | null
          id?: string
          satisfaction_rating?: number | null
          sentiment_score?: number | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_chatbot_intents: {
        Row: {
          confidence_threshold: number | null
          created_at: string | null
          id: string
          intent_name: string
          is_active: boolean | null
          response_templates: Json
          training_data: Json
          updated_at: string | null
        }
        Insert: {
          confidence_threshold?: number | null
          created_at?: string | null
          id?: string
          intent_name: string
          is_active?: boolean | null
          response_templates?: Json
          training_data?: Json
          updated_at?: string | null
        }
        Update: {
          confidence_threshold?: number | null
          created_at?: string | null
          id?: string
          intent_name?: string
          is_active?: boolean | null
          response_templates?: Json
          training_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_detection_settings: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          setting_name: string
          setting_type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_name: string
          setting_type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_name?: string
          setting_type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      ai_fraud_rules: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          false_negative_rate: number | null
          false_positive_rate: number | null
          feature_weights: Json | null
          id: string
          is_active: boolean | null
          last_trained: string | null
          model_config: Json
          rule_name: string
          rule_type: string
          threshold_config: Json
          updated_at: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          false_negative_rate?: number | null
          false_positive_rate?: number | null
          feature_weights?: Json | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_config?: Json
          rule_name: string
          rule_type: string
          threshold_config?: Json
          updated_at?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          false_negative_rate?: number | null
          false_positive_rate?: number | null
          feature_weights?: Json | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_config?: Json
          rule_name?: string
          rule_type?: string
          threshold_config?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_gateway_models: {
        Row: {
          accuracy_score: number
          created_at: string
          deployment_status: string
          feedback_score: number | null
          id: string
          last_trained_at: string
          model_config: Json
          model_name: string
          model_type: string
          performance_metrics: Json
          training_data_size: number
          updated_at: string
          version: string
        }
        Insert: {
          accuracy_score?: number
          created_at?: string
          deployment_status?: string
          feedback_score?: number | null
          id?: string
          last_trained_at?: string
          model_config?: Json
          model_name: string
          model_type: string
          performance_metrics?: Json
          training_data_size?: number
          updated_at?: string
          version?: string
        }
        Update: {
          accuracy_score?: number
          created_at?: string
          deployment_status?: string
          feedback_score?: number | null
          id?: string
          last_trained_at?: string
          model_config?: Json
          model_name?: string
          model_type?: string
          performance_metrics?: Json
          training_data_size?: number
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          actionable_recommendations: Json | null
          business_value_estimate: number | null
          confidence_score: number
          created_at: string | null
          description: string
          expires_at: string | null
          generated_by: string
          id: string
          impact_level: string
          insight_data: Json
          insight_type: string
          related_entities: Json | null
          status: string | null
          title: string
        }
        Insert: {
          actionable_recommendations?: Json | null
          business_value_estimate?: number | null
          confidence_score: number
          created_at?: string | null
          description: string
          expires_at?: string | null
          generated_by: string
          id?: string
          impact_level: string
          insight_data?: Json
          insight_type: string
          related_entities?: Json | null
          status?: string | null
          title: string
        }
        Update: {
          actionable_recommendations?: Json | null
          business_value_estimate?: number | null
          confidence_score?: number
          created_at?: string | null
          description?: string
          expires_at?: string | null
          generated_by?: string
          id?: string
          impact_level?: string
          insight_data?: Json
          insight_type?: string
          related_entities?: Json | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      ai_model_performance: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          deployment_status: string | null
          evaluation_date: string | null
          f1_score: number | null
          id: string
          inference_time_ms: number | null
          memory_usage_mb: number | null
          model_name: string
          model_version: string
          precision_score: number | null
          recall_score: number | null
          training_data_size: number | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          deployment_status?: string | null
          evaluation_date?: string | null
          f1_score?: number | null
          id?: string
          inference_time_ms?: number | null
          memory_usage_mb?: number | null
          model_name: string
          model_version: string
          precision_score?: number | null
          recall_score?: number | null
          training_data_size?: number | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          deployment_status?: string | null
          evaluation_date?: string | null
          f1_score?: number | null
          id?: string
          inference_time_ms?: number | null
          memory_usage_mb?: number | null
          model_name?: string
          model_version?: string
          precision_score?: number | null
          recall_score?: number | null
          training_data_size?: number | null
        }
        Relationships: []
      }
      ai_product_recommendations: {
        Row: {
          clicked: boolean | null
          confidence_score: number
          conversion_tracked: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          product_id: string
          purchased: boolean | null
          recommendation_data: Json
          recommendation_type: string
          user_id: string | null
        }
        Insert: {
          clicked?: boolean | null
          confidence_score: number
          conversion_tracked?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id: string
          purchased?: boolean | null
          recommendation_data?: Json
          recommendation_type: string
          user_id?: string | null
        }
        Update: {
          clicked?: boolean | null
          confidence_score?: number
          conversion_tracked?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string
          purchased?: boolean | null
          recommendation_data?: Json
          recommendation_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_recommendation_models: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_trained: string | null
          model_config: Json
          model_name: string
          model_type: string
          performance_metrics: Json | null
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_config?: Json
          model_name: string
          model_type: string
          performance_metrics?: Json | null
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_config?: Json
          model_name?: string
          model_type?: string
          performance_metrics?: Json | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      ai_routing_analytics: {
        Row: {
          actual_performance: Json
          ai_decision_data: Json
          confidence_score: number
          created_at: string
          id: string
          load_score: number
          request_id: string
          response_time_ms: number
          route_path: string
          selected_service: string
          success_rate: number
        }
        Insert: {
          actual_performance?: Json
          ai_decision_data?: Json
          confidence_score?: number
          created_at?: string
          id?: string
          load_score?: number
          request_id: string
          response_time_ms: number
          route_path: string
          selected_service: string
          success_rate?: number
        }
        Update: {
          actual_performance?: Json
          ai_decision_data?: Json
          confidence_score?: number
          created_at?: string
          id?: string
          load_score?: number
          request_id?: string
          response_time_ms?: number
          route_path?: string
          selected_service?: string
          success_rate?: number
        }
        Relationships: []
      }
      ai_sales_forecasts: {
        Row: {
          algorithm_used: string
          confidence_interval: Json
          created_at: string | null
          forecast_date: string
          forecast_period: string
          id: string
          model_accuracy: number | null
          predicted_sales: number
          predicted_units: number
          product_id: string | null
          seasonality_factors: Json | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          algorithm_used: string
          confidence_interval?: Json
          created_at?: string | null
          forecast_date: string
          forecast_period: string
          id?: string
          model_accuracy?: number | null
          predicted_sales: number
          predicted_units: number
          product_id?: string | null
          seasonality_factors?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          algorithm_used?: string
          confidence_interval?: Json
          created_at?: string | null
          forecast_date?: string
          forecast_period?: string
          id?: string
          model_accuracy?: number | null
          predicted_sales?: number
          predicted_units?: number
          product_id?: string | null
          seasonality_factors?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_sales_forecasts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_sales_forecasts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_search_cache: {
        Row: {
          ai_suggestions: Json
          created_at: string | null
          enhanced_query: string
          expires_at: string
          id: string
          original_query: string
          query_hash: string
          semantic_tokens: Json | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          ai_suggestions?: Json
          created_at?: string | null
          enhanced_query: string
          expires_at: string
          id?: string
          original_query: string
          query_hash: string
          semantic_tokens?: Json | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          ai_suggestions?: Json
          created_at?: string | null
          enhanced_query?: string
          expires_at?: string
          id?: string
          original_query?: string
          query_hash?: string
          semantic_tokens?: Json | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      alert_instances: {
        Row: {
          alert_rule_id: string
          annotations: Json | null
          description: string | null
          escalated_at: string | null
          escalation_level: number | null
          fired_at: string
          id: string
          labels: Json | null
          notification_history: Json | null
          resolved_at: string | null
          severity: string
          status: string
          summary: string
          trigger_value: number | null
        }
        Insert: {
          alert_rule_id: string
          annotations?: Json | null
          description?: string | null
          escalated_at?: string | null
          escalation_level?: number | null
          fired_at?: string
          id?: string
          labels?: Json | null
          notification_history?: Json | null
          resolved_at?: string | null
          severity: string
          status?: string
          summary: string
          trigger_value?: number | null
        }
        Update: {
          alert_rule_id?: string
          annotations?: Json | null
          description?: string | null
          escalated_at?: string | null
          escalation_level?: number | null
          fired_at?: string
          id?: string
          labels?: Json | null
          notification_history?: Json | null
          resolved_at?: string | null
          severity?: string
          status?: string
          summary?: string
          trigger_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_instances_alert_rule_id_fkey"
            columns: ["alert_rule_id"]
            isOneToOne: false
            referencedRelation: "alert_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_rules: {
        Row: {
          conditions: Json
          created_at: string
          created_by: string | null
          escalation_rules: Json
          id: string
          is_active: boolean | null
          notification_channels: Json
          rule_name: string
          rule_type: string
          runbook_url: string | null
          severity: string
          suppression_rules: Json | null
          updated_at: string
        }
        Insert: {
          conditions: Json
          created_at?: string
          created_by?: string | null
          escalation_rules?: Json
          id?: string
          is_active?: boolean | null
          notification_channels?: Json
          rule_name: string
          rule_type: string
          runbook_url?: string | null
          severity: string
          suppression_rules?: Json | null
          updated_at?: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          created_by?: string | null
          escalation_rules?: Json
          id?: string
          is_active?: boolean | null
          notification_channels?: Json
          rule_name?: string
          rule_type?: string
          runbook_url?: string | null
          severity?: string
          suppression_rules?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_cache: {
        Row: {
          analytics_type: string
          data: Json
          date_range: Json
          generated_at: string | null
          id: string
          vendor_id: string | null
        }
        Insert: {
          analytics_type: string
          data: Json
          date_range: Json
          generated_at?: string | null
          id?: string
          vendor_id?: string | null
        }
        Update: {
          analytics_type?: string
          data?: Json
          date_range?: Json
          generated_at?: string | null
          id?: string
          vendor_id?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          custom_properties: Json | null
          event_action: string
          event_category: string
          event_label: string | null
          event_name: string
          event_value: number | null
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_properties?: Json | null
          event_action: string
          event_category: string
          event_label?: string | null
          event_name: string
          event_value?: number | null
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_properties?: Json | null
          event_action?: string
          event_category?: string
          event_label?: string | null
          event_name?: string
          event_value?: number | null
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      anomaly_detection_events: {
        Row: {
          affected_endpoint: string | null
          affected_service: string | null
          anomaly_score: number
          behavior_indicators: Json
          created_at: string
          event_type: string
          false_positive: boolean | null
          id: string
          investigated_at: string | null
          investigated_by: string | null
          mitigation_actions: Json
          request_pattern: Json
          resolution_notes: string | null
          severity_level: string
          threat_classification: string | null
        }
        Insert: {
          affected_endpoint?: string | null
          affected_service?: string | null
          anomaly_score?: number
          behavior_indicators?: Json
          created_at?: string
          event_type: string
          false_positive?: boolean | null
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          mitigation_actions?: Json
          request_pattern?: Json
          resolution_notes?: string | null
          severity_level?: string
          threat_classification?: string | null
        }
        Update: {
          affected_endpoint?: string | null
          affected_service?: string | null
          anomaly_score?: number
          behavior_indicators?: Json
          created_at?: string
          event_type?: string
          false_positive?: boolean | null
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          mitigation_actions?: Json
          request_pattern?: Json
          resolution_notes?: string | null
          severity_level?: string
          threat_classification?: string | null
        }
        Relationships: []
      }
      anomaly_detection_rules: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          metric_type: string
          rule_name: string
          rule_type: string
          severity_level: string
          threshold_config: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          metric_type: string
          rule_name: string
          rule_type: string
          severity_level: string
          threshold_config?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          metric_type?: string
          rule_name?: string
          rule_type?: string
          severity_level?: string
          threshold_config?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      anomaly_detections: {
        Row: {
          actual_value: number
          anomaly_type: string
          context_data: Json | null
          detected_at: string | null
          deviation_percentage: number | null
          expected_value: number | null
          id: string
          metric_name: string
          resolved_at: string | null
          resolved_by: string | null
          rule_id: string | null
          severity_score: number
          status: string | null
        }
        Insert: {
          actual_value: number
          anomaly_type: string
          context_data?: Json | null
          detected_at?: string | null
          deviation_percentage?: number | null
          expected_value?: number | null
          id?: string
          metric_name: string
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string | null
          severity_score: number
          status?: string | null
        }
        Update: {
          actual_value?: number
          anomaly_type?: string
          context_data?: Json | null
          detected_at?: string | null
          deviation_percentage?: number | null
          expected_value?: number | null
          id?: string
          metric_name?: string
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string | null
          severity_score?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anomaly_detections_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "anomaly_detection_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      api_gateway_logs: {
        Row: {
          created_at: string
          data: Json
          id: string
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          type?: string
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          count: number
          created_at: string
          expires_at: string
          id: string
          key: string
        }
        Insert: {
          count?: number
          created_at?: string
          expires_at: string
          id?: string
          key: string
        }
        Update: {
          count?: number
          created_at?: string
          expires_at?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      ar_vr_interactions: {
        Row: {
          ar_session_data: Json | null
          conversion_outcome: boolean | null
          created_at: string | null
          device_capabilities: Json | null
          engagement_metrics: Json | null
          id: string
          interaction_type: string
          product_id: string | null
          session_duration: number | null
          session_id: string | null
          user_id: string | null
          vr_session_data: Json | null
        }
        Insert: {
          ar_session_data?: Json | null
          conversion_outcome?: boolean | null
          created_at?: string | null
          device_capabilities?: Json | null
          engagement_metrics?: Json | null
          id?: string
          interaction_type: string
          product_id?: string | null
          session_duration?: number | null
          session_id?: string | null
          user_id?: string | null
          vr_session_data?: Json | null
        }
        Update: {
          ar_session_data?: Json | null
          conversion_outcome?: boolean | null
          created_at?: string | null
          device_capabilities?: Json | null
          engagement_metrics?: Json | null
          id?: string
          interaction_type?: string
          product_id?: string | null
          session_duration?: number | null
          session_id?: string | null
          user_id?: string | null
          vr_session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ar_vr_interactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_documents: {
        Row: {
          assessment_id: string | null
          created_at: string
          document_category: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          uploaded_by: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          document_category: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_by: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          document_category?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_documents_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "qualitative_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: string
          metadata: Json | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      automated_inventory_management: {
        Row: {
          algorithm_version: string | null
          auto_reorder_enabled: boolean | null
          created_at: string | null
          demand_forecast: Json | null
          id: string
          last_reorder_date: string | null
          lead_time_days: number | null
          next_predicted_reorder: string | null
          optimal_stock_level: number
          product_id: string | null
          reorder_point: number
          safety_stock: number | null
          seasonal_factors: Json | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          algorithm_version?: string | null
          auto_reorder_enabled?: boolean | null
          created_at?: string | null
          demand_forecast?: Json | null
          id?: string
          last_reorder_date?: string | null
          lead_time_days?: number | null
          next_predicted_reorder?: string | null
          optimal_stock_level: number
          product_id?: string | null
          reorder_point: number
          safety_stock?: number | null
          seasonal_factors?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          algorithm_version?: string | null
          auto_reorder_enabled?: boolean | null
          created_at?: string | null
          demand_forecast?: Json | null
          id?: string
          last_reorder_date?: string | null
          lead_time_days?: number | null
          next_predicted_reorder?: string | null
          optimal_stock_level?: number
          product_id?: string | null
          reorder_point?: number
          safety_stock?: number | null
          seasonal_factors?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      availability_tracking: {
        Row: {
          average_response_time_ms: number | null
          created_at: string
          error_rate_percentage: number | null
          failed_requests: number
          id: string
          measurement_period: unknown
          p95_response_time_ms: number | null
          p99_response_time_ms: number | null
          period_end: string
          period_start: string
          service_name: string
          sla_compliance: boolean | null
          successful_requests: number
          total_requests: number
          uptime_percentage: number | null
        }
        Insert: {
          average_response_time_ms?: number | null
          created_at?: string
          error_rate_percentage?: number | null
          failed_requests?: number
          id?: string
          measurement_period: unknown
          p95_response_time_ms?: number | null
          p99_response_time_ms?: number | null
          period_end: string
          period_start: string
          service_name: string
          sla_compliance?: boolean | null
          successful_requests?: number
          total_requests?: number
          uptime_percentage?: number | null
        }
        Update: {
          average_response_time_ms?: number | null
          created_at?: string
          error_rate_percentage?: number | null
          failed_requests?: number
          id?: string
          measurement_period?: unknown
          p95_response_time_ms?: number | null
          p99_response_time_ms?: number | null
          period_end?: string
          period_start?: string
          service_name?: string
          sla_compliance?: boolean | null
          successful_requests?: number
          total_requests?: number
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      backup_executions: {
        Row: {
          backup_name: string
          backup_size_bytes: number | null
          backup_type: string
          compressed_size_bytes: number | null
          end_time: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          next_scheduled_backup: string | null
          policy_id: string
          recovery_point_objective: string | null
          start_time: string
          status: string
          storage_path: string | null
          verification_status: string | null
        }
        Insert: {
          backup_name: string
          backup_size_bytes?: number | null
          backup_type: string
          compressed_size_bytes?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          next_scheduled_backup?: string | null
          policy_id: string
          recovery_point_objective?: string | null
          start_time?: string
          status?: string
          storage_path?: string | null
          verification_status?: string | null
        }
        Update: {
          backup_name?: string
          backup_size_bytes?: number | null
          backup_type?: string
          compressed_size_bytes?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          next_scheduled_backup?: string | null
          policy_id?: string
          recovery_point_objective?: string | null
          start_time?: string
          status?: string
          storage_path?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backup_executions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "backup_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_policies: {
        Row: {
          backup_type: string
          backup_window: string | null
          compression_enabled: boolean | null
          created_at: string
          cross_region_copy: boolean | null
          encryption_enabled: boolean | null
          frequency: unknown
          id: string
          is_active: boolean | null
          policy_name: string
          retention_period: unknown
          storage_location: string
          target_regions: Json | null
          updated_at: string
          verification_enabled: boolean | null
        }
        Insert: {
          backup_type: string
          backup_window?: string | null
          compression_enabled?: boolean | null
          created_at?: string
          cross_region_copy?: boolean | null
          encryption_enabled?: boolean | null
          frequency: unknown
          id?: string
          is_active?: boolean | null
          policy_name: string
          retention_period: unknown
          storage_location: string
          target_regions?: Json | null
          updated_at?: string
          verification_enabled?: boolean | null
        }
        Update: {
          backup_type?: string
          backup_window?: string | null
          compression_enabled?: boolean | null
          created_at?: string
          cross_region_copy?: boolean | null
          encryption_enabled?: boolean | null
          frequency?: unknown
          id?: string
          is_active?: boolean | null
          policy_name?: string
          retention_period?: unknown
          storage_location?: string
          target_regions?: Json | null
          updated_at?: string
          verification_enabled?: boolean | null
        }
        Relationships: []
      }
      balance_sheet_data: {
        Row: {
          borrower_id: string
          borrower_name: string
          created_at: string
          current_year_data: Json
          id: string
          updated_at: string
          year2_data: Json
          year3_data: Json
        }
        Insert: {
          borrower_id: string
          borrower_name: string
          created_at?: string
          current_year_data?: Json
          id?: string
          updated_at?: string
          year2_data?: Json
          year3_data?: Json
        }
        Update: {
          borrower_id?: string
          borrower_name?: string
          created_at?: string
          current_year_data?: Json
          id?: string
          updated_at?: string
          year2_data?: Json
          year3_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_balance_sheet_borrower"
            columns: ["borrower_id"]
            isOneToOne: true
            referencedRelation: "borrowers"
            referencedColumns: ["id"]
          },
        ]
      }
      bandwidth_adaptation_profiles: {
        Row: {
          adaptation_rules: Json
          bandwidth_estimate: number
          connection_type: string
          created_at: string | null
          id: string
          last_updated: string | null
          latency_ms: number | null
          packet_loss_rate: number | null
          quality_preferences: Json | null
          user_id: string | null
        }
        Insert: {
          adaptation_rules?: Json
          bandwidth_estimate: number
          connection_type: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          latency_ms?: number | null
          packet_loss_rate?: number | null
          quality_preferences?: Json | null
          user_id?: string | null
        }
        Update: {
          adaptation_rules?: Json
          bandwidth_estimate?: number
          connection_type?: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          latency_ms?: number | null
          packet_loss_rate?: number | null
          quality_preferences?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      bandwidth_optimization_settings: {
        Row: {
          cache_strategy: Json | null
          compression_algorithms: Json | null
          created_at: string | null
          id: string
          image_quality_reduction: number | null
          is_active: boolean | null
          lazy_loading_aggressive: boolean | null
          prefetch_disabled: boolean | null
          setting_name: string
          target_bandwidth_range: string
          video_streaming_disabled: boolean | null
        }
        Insert: {
          cache_strategy?: Json | null
          compression_algorithms?: Json | null
          created_at?: string | null
          id?: string
          image_quality_reduction?: number | null
          is_active?: boolean | null
          lazy_loading_aggressive?: boolean | null
          prefetch_disabled?: boolean | null
          setting_name: string
          target_bandwidth_range: string
          video_streaming_disabled?: boolean | null
        }
        Update: {
          cache_strategy?: Json | null
          compression_algorithms?: Json | null
          created_at?: string | null
          id?: string
          image_quality_reduction?: number | null
          is_active?: boolean | null
          lazy_loading_aggressive?: boolean | null
          prefetch_disabled?: boolean | null
          setting_name?: string
          target_bandwidth_range?: string
          video_streaming_disabled?: boolean | null
        }
        Relationships: []
      }
      bangla_nlp_processing: {
        Row: {
          categories: Json | null
          confidence_score: number | null
          created_at: string | null
          id: string
          input_text: string
          keywords: Json | null
          language_detected: string | null
          processed_text: string
          processing_type: string
          sentiment_score: number | null
        }
        Insert: {
          categories?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_text: string
          keywords?: Json | null
          language_detected?: string | null
          processed_text: string
          processing_type: string
          sentiment_score?: number | null
        }
        Update: {
          categories?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_text?: string
          keywords?: Json | null
          language_detected?: string | null
          processed_text?: string
          processing_type?: string
          sentiment_score?: number | null
        }
        Relationships: []
      }
      bangladesh_compliance: {
        Row: {
          compliance_deadline: string | null
          compliance_officer_id: string | null
          compliance_status: string | null
          compliance_type: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          last_reviewed_at: string | null
          required_documents: Json | null
          review_notes: string | null
          submitted_documents: Json | null
          updated_at: string | null
          verification_details: Json | null
        }
        Insert: {
          compliance_deadline?: string | null
          compliance_officer_id?: string | null
          compliance_status?: string | null
          compliance_type: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          last_reviewed_at?: string | null
          required_documents?: Json | null
          review_notes?: string | null
          submitted_documents?: Json | null
          updated_at?: string | null
          verification_details?: Json | null
        }
        Update: {
          compliance_deadline?: string | null
          compliance_officer_id?: string | null
          compliance_status?: string | null
          compliance_type?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          last_reviewed_at?: string | null
          required_documents?: Json | null
          review_notes?: string | null
          submitted_documents?: Json | null
          updated_at?: string | null
          verification_details?: Json | null
        }
        Relationships: []
      }
      bangladesh_compliance_tracking: {
        Row: {
          compliance_officer_id: string | null
          compliance_status: string
          compliance_type: string
          created_at: string
          data_localization_status: Json
          documentation_links: Json
          financial_reporting_status: Json
          id: string
          last_audit_date: string | null
          license_number: string | null
          local_representative_info: Json | null
          next_audit_date: string | null
          penalty_risks: Json
          regulatory_body: string
          requirements_checklist: Json
          submission_deadlines: Json
          tax_compliance_status: Json
          updated_at: string
        }
        Insert: {
          compliance_officer_id?: string | null
          compliance_status?: string
          compliance_type: string
          created_at?: string
          data_localization_status?: Json
          documentation_links?: Json
          financial_reporting_status?: Json
          id?: string
          last_audit_date?: string | null
          license_number?: string | null
          local_representative_info?: Json | null
          next_audit_date?: string | null
          penalty_risks?: Json
          regulatory_body: string
          requirements_checklist?: Json
          submission_deadlines?: Json
          tax_compliance_status?: Json
          updated_at?: string
        }
        Update: {
          compliance_officer_id?: string | null
          compliance_status?: string
          compliance_type?: string
          created_at?: string
          data_localization_status?: Json
          documentation_links?: Json
          financial_reporting_status?: Json
          id?: string
          last_audit_date?: string | null
          license_number?: string | null
          local_representative_info?: Json | null
          next_audit_date?: string | null
          penalty_risks?: Json
          regulatory_body?: string
          requirements_checklist?: Json
          submission_deadlines?: Json
          tax_compliance_status?: Json
          updated_at?: string
        }
        Relationships: []
      }
      bangladesh_tax_config: {
        Row: {
          created_at: string | null
          description: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          maximum_amount: number | null
          minimum_amount: number | null
          product_category: string | null
          tax_rate: number
          tax_type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          maximum_amount?: number | null
          minimum_amount?: number | null
          product_category?: string | null
          tax_rate: number
          tax_type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          maximum_amount?: number | null
          minimum_amount?: number | null
          product_category?: string | null
          tax_rate?: number
          tax_type?: string
        }
        Relationships: []
      }
      bd_courier_partners: {
        Row: {
          api_config: Json
          courier_name: string
          coverage_areas: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          pricing_structure: Json
          service_types: Json
          updated_at: string | null
        }
        Insert: {
          api_config?: Json
          courier_name: string
          coverage_areas?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pricing_structure?: Json
          service_types?: Json
          updated_at?: string | null
        }
        Update: {
          api_config?: Json
          courier_name?: string
          coverage_areas?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pricing_structure?: Json
          service_types?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      bd_currency_rates: {
        Row: {
          created_at: string | null
          from_currency: string
          id: string
          is_active: boolean | null
          last_updated: string | null
          rate: number
          source: string | null
          to_currency: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_currency: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          rate: number
          source?: string | null
          to_currency: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_currency?: string
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          rate?: number
          source?: string | null
          to_currency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bd_delivery_zones: {
        Row: {
          additional_charge: number | null
          courier_partners: string[] | null
          created_at: string | null
          delivery_time_hours: number | null
          districts: string[] | null
          id: string
          is_active: boolean | null
          postal_codes: string[] | null
          updated_at: string | null
          zone_name: string
          zone_name_bn: string | null
          zone_type: string
        }
        Insert: {
          additional_charge?: number | null
          courier_partners?: string[] | null
          created_at?: string | null
          delivery_time_hours?: number | null
          districts?: string[] | null
          id?: string
          is_active?: boolean | null
          postal_codes?: string[] | null
          updated_at?: string | null
          zone_name: string
          zone_name_bn?: string | null
          zone_type: string
        }
        Update: {
          additional_charge?: number | null
          courier_partners?: string[] | null
          created_at?: string | null
          delivery_time_hours?: number | null
          districts?: string[] | null
          id?: string
          is_active?: boolean | null
          postal_codes?: string[] | null
          updated_at?: string | null
          zone_name?: string
          zone_name_bn?: string | null
          zone_type?: string
        }
        Relationships: []
      }
      bd_festival_configs: {
        Row: {
          banner_config: Json | null
          created_at: string | null
          cultural_elements: Json | null
          discount_config: Json | null
          end_date: string
          festival_name: string
          festival_name_bn: string
          festival_type: string
          id: string
          is_active: boolean | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          banner_config?: Json | null
          created_at?: string | null
          cultural_elements?: Json | null
          discount_config?: Json | null
          end_date: string
          festival_name: string
          festival_name_bn: string
          festival_type: string
          id?: string
          is_active?: boolean | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          banner_config?: Json | null
          created_at?: string | null
          cultural_elements?: Json | null
          discount_config?: Json | null
          end_date?: string
          festival_name?: string
          festival_name_bn?: string
          festival_type?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bd_kyc_verifications: {
        Row: {
          api_response: Json | null
          created_at: string | null
          document_data: Json
          document_number: string
          expiry_date: string | null
          id: string
          rejection_reason: string | null
          updated_at: string | null
          vendor_id: string
          verification_status: string
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          api_response?: Json | null
          created_at?: string | null
          document_data?: Json
          document_number: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          vendor_id: string
          verification_status?: string
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          api_response?: Json | null
          created_at?: string | null
          document_data?: Json
          document_number?: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          vendor_id?: string
          verification_status?: string
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      bd_localization_content: {
        Row: {
          bengali_content: string | null
          category: string
          content_key: string
          content_type: string
          context_data: Json | null
          created_at: string | null
          english_content: string | null
          id: string
          is_verified: boolean | null
          updated_at: string | null
        }
        Insert: {
          bengali_content?: string | null
          category: string
          content_key: string
          content_type: string
          context_data?: Json | null
          created_at?: string | null
          english_content?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
        }
        Update: {
          bengali_content?: string | null
          category?: string
          content_key?: string
          content_type?: string
          context_data?: Json | null
          created_at?: string | null
          english_content?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bd_payment_gateways: {
        Row: {
          api_config: Json
          created_at: string | null
          fee_structure: Json
          gateway_name: string
          id: string
          is_active: boolean | null
          transaction_limits: Json
          updated_at: string | null
        }
        Insert: {
          api_config?: Json
          created_at?: string | null
          fee_structure?: Json
          gateway_name: string
          id?: string
          is_active?: boolean | null
          transaction_limits?: Json
          updated_at?: string | null
        }
        Update: {
          api_config?: Json
          created_at?: string | null
          fee_structure?: Json
          gateway_name?: string
          id?: string
          is_active?: boolean | null
          transaction_limits?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      bd_payment_method_configs: {
        Row: {
          created_at: string | null
          fees_structure: Json | null
          id: string
          is_active: boolean | null
          method_name: string
          method_type: string
          provider_config: Json
          supported_currencies: string[] | null
          transaction_limits: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fees_structure?: Json | null
          id?: string
          is_active?: boolean | null
          method_name: string
          method_type: string
          provider_config: Json
          supported_currencies?: string[] | null
          transaction_limits?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fees_structure?: Json | null
          id?: string
          is_active?: boolean | null
          method_name?: string
          method_type?: string
          provider_config?: Json
          supported_currencies?: string[] | null
          transaction_limits?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bd_payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          customer_phone: string | null
          gateway_name: string
          gateway_response: Json | null
          id: string
          merchant_transaction_id: string
          order_id: string | null
          processed_at: string | null
          status: string
          transaction_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          customer_phone?: string | null
          gateway_name: string
          gateway_response?: Json | null
          id?: string
          merchant_transaction_id: string
          order_id?: string | null
          processed_at?: string | null
          status: string
          transaction_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          customer_phone?: string | null
          gateway_name?: string
          gateway_response?: Json | null
          id?: string
          merchant_transaction_id?: string
          order_id?: string | null
          processed_at?: string | null
          status?: string
          transaction_id?: string
        }
        Relationships: []
      }
      bd_sms_configs: {
        Row: {
          api_config: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          message_types: Json | null
          provider_name: string
          rate_limits: Json | null
          updated_at: string | null
        }
        Insert: {
          api_config: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_types?: Json | null
          provider_name: string
          rate_limits?: Json | null
          updated_at?: string | null
        }
        Update: {
          api_config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_types?: Json | null
          provider_name?: string
          rate_limits?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bengali_translations: {
        Row: {
          bengali_text: string
          category: string
          context: string | null
          created_at: string | null
          english_text: string
          id: string
          key: string
          updated_at: string | null
        }
        Insert: {
          bengali_text: string
          category: string
          context?: string | null
          created_at?: string | null
          english_text: string
          id?: string
          key: string
          updated_at?: string | null
        }
        Update: {
          bengali_text?: string
          category?: string
          context?: string | null
          created_at?: string | null
          english_text?: string
          id?: string
          key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      biometric_auth_registrations: {
        Row: {
          authenticator_data: Json
          credential_id: string
          device_name: string | null
          device_type: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          public_key: string
          registered_at: string | null
          user_id: string
        }
        Insert: {
          authenticator_data: Json
          credential_id: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          public_key: string
          registered_at?: string | null
          user_id: string
        }
        Update: {
          authenticator_data?: Json
          credential_id?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          public_key?: string
          registered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      biometric_auth_sessions: {
        Row: {
          auth_type: string
          challenge: string
          challenge_expires_at: string
          created_at: string | null
          device_fingerprint: string | null
          id: string
          ip_address: unknown | null
          registration_id: string | null
          user_agent: string | null
          user_id: string
          verification_data: Json | null
          verified_at: string | null
        }
        Insert: {
          auth_type: string
          challenge: string
          challenge_expires_at: string
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          registration_id?: string | null
          user_agent?: string | null
          user_id: string
          verification_data?: Json | null
          verified_at?: string | null
        }
        Update: {
          auth_type?: string
          challenge?: string
          challenge_expires_at?: string
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          registration_id?: string | null
          user_agent?: string | null
          user_id?: string
          verification_data?: Json | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biometric_auth_sessions_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "biometric_auth_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      borrowers: {
        Row: {
          created_at: string
          created_by: string
          id: string
          industry: string
          loan_amount: number
          name: string
          risk_rating: string | null
          score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          industry: string
          loan_amount: number
          name: string
          risk_rating?: string | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          industry?: string
          loan_amount?: number
          name?: string
          risk_rating?: string | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      budget_plans: {
        Row: {
          account_id: string | null
          actual_amount: number | null
          approved_by: string | null
          budget_name: string
          budgeted_amount: number
          created_at: string | null
          created_by: string | null
          department: string | null
          fiscal_year: number
          id: string
          period_type: string | null
          status: string | null
          variance: number | null
          variance_percentage: number | null
        }
        Insert: {
          account_id?: string | null
          actual_amount?: number | null
          approved_by?: string | null
          budget_name: string
          budgeted_amount: number
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          fiscal_year: number
          id?: string
          period_type?: string | null
          status?: string | null
          variance?: number | null
          variance_percentage?: number | null
        }
        Update: {
          account_id?: string | null
          actual_amount?: number | null
          approved_by?: string | null
          budget_name?: string
          budgeted_amount?: number
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          fiscal_year?: number
          id?: string
          period_type?: string | null
          status?: string | null
          variance?: number | null
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_plans_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_order_categories: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          minimum_quantity: number | null
          name: string
          name_bn: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          minimum_quantity?: number | null
          name: string
          name_bn?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          minimum_quantity?: number | null
          name?: string
          name_bn?: string | null
        }
        Relationships: []
      }
      bulk_order_requests: {
        Row: {
          business_license: string | null
          category_id: string | null
          created_at: string | null
          delivery_address: Json | null
          expected_delivery_date: string | null
          id: string
          product_id: string | null
          quantity: number
          quote_valid_until: string | null
          special_requirements: string | null
          status: string | null
          tax_id: string | null
          total_price: number | null
          unit_price: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
          vendor_notes: string | null
        }
        Insert: {
          business_license?: string | null
          category_id?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          expected_delivery_date?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          quote_valid_until?: string | null
          special_requirements?: string | null
          status?: string | null
          tax_id?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
          vendor_notes?: string | null
        }
        Update: {
          business_license?: string | null
          category_id?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          expected_delivery_date?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          quote_valid_until?: string | null
          special_requirements?: string | null
          status?: string | null
          tax_id?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
          vendor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_order_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "bulk_order_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_dashboards: {
        Row: {
          access_permissions: Json
          created_at: string
          created_by: string | null
          dashboard_name: string
          dashboard_type: string
          data_sources: Json
          id: string
          is_active: boolean | null
          panels: Json
          refresh_interval: number | null
          updated_at: string
        }
        Insert: {
          access_permissions?: Json
          created_at?: string
          created_by?: string | null
          dashboard_name: string
          dashboard_type: string
          data_sources?: Json
          id?: string
          is_active?: boolean | null
          panels?: Json
          refresh_interval?: number | null
          updated_at?: string
        }
        Update: {
          access_permissions?: Json
          created_at?: string
          created_by?: string | null
          dashboard_name?: string
          dashboard_type?: string
          data_sources?: Json
          id?: string
          is_active?: boolean | null
          panels?: Json
          refresh_interval?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      business_intelligence_dashboards: {
        Row: {
          access_permissions: Json | null
          created_at: string | null
          created_by: string
          dashboard_name: string
          dashboard_type: string
          id: string
          is_real_time: boolean | null
          refresh_interval: number | null
          updated_at: string | null
          user_role: string
          widget_config: Json
        }
        Insert: {
          access_permissions?: Json | null
          created_at?: string | null
          created_by: string
          dashboard_name: string
          dashboard_type: string
          id?: string
          is_real_time?: boolean | null
          refresh_interval?: number | null
          updated_at?: string | null
          user_role: string
          widget_config?: Json
        }
        Update: {
          access_permissions?: Json | null
          created_at?: string | null
          created_by?: string
          dashboard_name?: string
          dashboard_type?: string
          id?: string
          is_real_time?: boolean | null
          refresh_interval?: number | null
          updated_at?: string | null
          user_role?: string
          widget_config?: Json
        }
        Relationships: []
      }
      business_intelligence_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          data_sources: Json
          filters: Json | null
          generated_at: string | null
          id: string
          report_category: string
          report_data: Json | null
          report_name: string
          report_type: string
          scheduled_frequency: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data_sources?: Json
          filters?: Json | null
          generated_at?: string | null
          id?: string
          report_category: string
          report_data?: Json | null
          report_name: string
          report_type: string
          scheduled_frequency?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data_sources?: Json
          filters?: Json | null
          generated_at?: string | null
          id?: string
          report_category?: string
          report_data?: Json | null
          report_name?: string
          report_type?: string
          scheduled_frequency?: string | null
          status?: string | null
        }
        Relationships: []
      }
      cache_analytics: {
        Row: {
          cache_key: string
          cache_size_bytes: number | null
          cache_type: string
          created_at: string | null
          hit_rate: number | null
          id: string
          operation: string
          response_time_ms: number | null
          session_id: string | null
          ttl_seconds: number | null
          user_id: string | null
        }
        Insert: {
          cache_key: string
          cache_size_bytes?: number | null
          cache_type: string
          created_at?: string | null
          hit_rate?: number | null
          id?: string
          operation: string
          response_time_ms?: number | null
          session_id?: string | null
          ttl_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          cache_key?: string
          cache_size_bytes?: number | null
          cache_type?: string
          created_at?: string | null
          hit_rate?: number | null
          id?: string
          operation?: string
          response_time_ms?: number | null
          session_id?: string | null
          ttl_seconds?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      cache_configurations: {
        Row: {
          cache_key: string
          cache_strategy: string
          cache_type: string
          created_at: string | null
          id: string
          invalidation_rules: Json | null
          is_active: boolean | null
          ttl_seconds: number
          updated_at: string | null
        }
        Insert: {
          cache_key: string
          cache_strategy: string
          cache_type: string
          created_at?: string | null
          id?: string
          invalidation_rules?: Json | null
          is_active?: boolean | null
          ttl_seconds: number
          updated_at?: string | null
        }
        Update: {
          cache_key?: string
          cache_strategy?: string
          cache_type?: string
          created_at?: string | null
          id?: string
          invalidation_rules?: Json | null
          is_active?: boolean | null
          ttl_seconds?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cache_entries: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          key: string
          type: string
          value: Json
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key: string
          type: string
          value: Json
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key?: string
          type?: string
          value?: Json
        }
        Relationships: []
      }
      cache_optimization_metrics: {
        Row: {
          access_pattern: Json
          analysis_date: string | null
          cache_key: string
          created_at: string | null
          hit_rate: number
          id: string
          miss_rate: number
          optimization_score: number
          recommendations: Json | null
        }
        Insert: {
          access_pattern?: Json
          analysis_date?: string | null
          cache_key: string
          created_at?: string | null
          hit_rate?: number
          id?: string
          miss_rate?: number
          optimization_score?: number
          recommendations?: Json | null
        }
        Update: {
          access_pattern?: Json
          analysis_date?: string | null
          cache_key?: string
          created_at?: string | null
          hit_rate?: number
          id?: string
          miss_rate?: number
          optimization_score?: number
          recommendations?: Json | null
        }
        Relationships: []
      }
      cache_statistics: {
        Row: {
          cache_type: string
          count: number
          created_at: string
          id: string
          operation: string
        }
        Insert: {
          cache_type: string
          count?: number
          created_at?: string
          id?: string
          operation: string
        }
        Update: {
          cache_type?: string
          count?: number
          created_at?: string
          id?: string
          operation?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          category_path: string[] | null
          commission_rate: number | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          name_bn: string | null
          parent_id: string | null
          slug: string
        }
        Insert: {
          category_path?: string[] | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          name_bn?: string | null
          parent_id?: string | null
          slug: string
        }
        Update: {
          category_path?: string[] | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          name_bn?: string | null
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_growth_insights: {
        Row: {
          analysis_date: string | null
          category_id: string
          competitive_intensity: number | null
          growth_barriers: Json | null
          growth_drivers: Json | null
          growth_period: string
          growth_rate: number
          id: string
          market_size: number | null
          opportunity_score: number | null
        }
        Insert: {
          analysis_date?: string | null
          category_id: string
          competitive_intensity?: number | null
          growth_barriers?: Json | null
          growth_drivers?: Json | null
          growth_period: string
          growth_rate: number
          id?: string
          market_size?: number | null
          opportunity_score?: number | null
        }
        Update: {
          analysis_date?: string | null
          category_id?: string
          competitive_intensity?: number | null
          growth_barriers?: Json | null
          growth_drivers?: Json | null
          growth_period?: string
          growth_rate?: number
          id?: string
          market_size?: number | null
          opportunity_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "category_growth_insights_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cdn_cache_rules: {
        Row: {
          cache_duration: number
          cache_type: string
          compression_enabled: boolean | null
          created_at: string | null
          headers: Json | null
          id: string
          is_active: boolean | null
          resource_pattern: string
          updated_at: string | null
        }
        Insert: {
          cache_duration: number
          cache_type: string
          compression_enabled?: boolean | null
          created_at?: string | null
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          resource_pattern: string
          updated_at?: string | null
        }
        Update: {
          cache_duration?: number
          cache_type?: string
          compression_enabled?: boolean | null
          created_at?: string | null
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          resource_pattern?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cdn_configurations: {
        Row: {
          caching_rules: Json | null
          cdn_provider: string
          created_at: string | null
          distribution_settings: Json
          geographic_restrictions: Json | null
          id: string
          is_active: boolean | null
          resource_type: string
          updated_at: string | null
        }
        Insert: {
          caching_rules?: Json | null
          cdn_provider: string
          created_at?: string | null
          distribution_settings?: Json
          geographic_restrictions?: Json | null
          id?: string
          is_active?: boolean | null
          resource_type: string
          updated_at?: string | null
        }
        Update: {
          caching_rules?: Json | null
          cdn_provider?: string
          created_at?: string | null
          distribution_settings?: Json
          geographic_restrictions?: Json | null
          id?: string
          is_active?: boolean | null
          resource_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      centralized_logs: {
        Row: {
          business_context: Json | null
          correlation_id: string | null
          created_at: string
          id: string
          instance_id: string | null
          ip_address: unknown | null
          log_level: string
          message: string
          request_id: string | null
          service_name: string
          stack_trace: string | null
          structured_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          business_context?: Json | null
          correlation_id?: string | null
          created_at?: string
          id?: string
          instance_id?: string | null
          ip_address?: unknown | null
          log_level: string
          message: string
          request_id?: string | null
          service_name: string
          stack_trace?: string | null
          structured_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          business_context?: Json | null
          correlation_id?: string | null
          created_at?: string
          id?: string
          instance_id?: string | null
          ip_address?: unknown | null
          log_level?: string
          message?: string
          request_id?: string | null
          service_name?: string
          stack_trace?: string | null
          structured_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chart_of_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          normal_balance: string | null
          parent_account_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          normal_balance?: string | null
          parent_account_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          normal_balance?: string | null
          parent_account_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_agents: {
        Row: {
          agent_name: string
          avatar_url: string | null
          created_at: string | null
          current_chat_count: number | null
          id: string
          is_online: boolean | null
          languages: string[] | null
          max_concurrent_chats: number | null
          rating: number | null
          specializations: string[] | null
          total_chats: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_name: string
          avatar_url?: string | null
          created_at?: string | null
          current_chat_count?: number | null
          id?: string
          is_online?: boolean | null
          languages?: string[] | null
          max_concurrent_chats?: number | null
          rating?: number | null
          specializations?: string[] | null
          total_chats?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_name?: string
          avatar_url?: string | null
          created_at?: string | null
          current_chat_count?: number | null
          id?: string
          is_online?: boolean | null
          languages?: string[] | null
          max_concurrent_chats?: number | null
          rating?: number | null
          specializations?: string[] | null
          total_chats?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_conversation_messages: {
        Row: {
          attachments: Json | null
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message_content: string
          message_type: string | null
          metadata: Json | null
          read_at: string | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          attachments?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content: string
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          attachments?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content?: string
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          agent_id: string | null
          assigned_agent: string | null
          category: string | null
          closed_at: string | null
          conversation_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          participants: Json
          priority: string | null
          resolved_at: string | null
          satisfaction_rating: number | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          assigned_agent?: string | null
          category?: string | null
          closed_at?: string | null
          conversation_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          participants?: Json
          priority?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          assigned_agent?: string | null
          category?: string | null
          closed_at?: string | null
          conversation_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          participants?: Json
          priority?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "chat_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message_text: string
          message_type: string
          metadata: Json | null
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_text: string
          message_type?: string
          metadata?: Json | null
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_text?: string
          message_type?: string
          metadata?: Json | null
          room_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_private: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      churn_predictions: {
        Row: {
          churn_probability: number
          created_at: string | null
          factors: Json | null
          id: string
          prediction_date: string | null
          retention_strategies: Json | null
          risk_level: string
          user_id: string
        }
        Insert: {
          churn_probability: number
          created_at?: string | null
          factors?: Json | null
          id?: string
          prediction_date?: string | null
          retention_strategies?: Json | null
          risk_level: string
          user_id: string
        }
        Update: {
          churn_probability?: number
          created_at?: string | null
          factors?: Json | null
          id?: string
          prediction_date?: string | null
          retention_strategies?: Json | null
          risk_level?: string
          user_id?: string
        }
        Relationships: []
      }
      churn_predictions_detailed: {
        Row: {
          churn_probability: number
          churn_risk_level: string
          created_at: string | null
          customer_id: string
          id: string
          intervention_impact: Json | null
          intervention_recommendations: Json | null
          next_predicted_purchase: string | null
          prediction_date: string | null
          retention_strategies: Json | null
          risk_factors: Json | null
          vendor_id: string | null
        }
        Insert: {
          churn_probability: number
          churn_risk_level: string
          created_at?: string | null
          customer_id: string
          id?: string
          intervention_impact?: Json | null
          intervention_recommendations?: Json | null
          next_predicted_purchase?: string | null
          prediction_date?: string | null
          retention_strategies?: Json | null
          risk_factors?: Json | null
          vendor_id?: string | null
        }
        Update: {
          churn_probability?: number
          churn_risk_level?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          intervention_impact?: Json | null
          intervention_recommendations?: Json | null
          next_predicted_purchase?: string | null
          prediction_date?: string | null
          retention_strategies?: Json | null
          risk_factors?: Json | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "churn_predictions_detailed_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      ci_cd_pipelines: {
        Row: {
          branch_name: string
          created_at: string | null
          environment_variables: Json | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          last_run_duration: number | null
          notification_settings: Json | null
          pipeline_config: Json
          pipeline_metrics: Json | null
          pipeline_name: string
          pipeline_type: string
          repository_url: string
          status: string
          success_rate: number | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          branch_name?: string
          created_at?: string | null
          environment_variables?: Json | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          last_run_duration?: number | null
          notification_settings?: Json | null
          pipeline_config?: Json
          pipeline_metrics?: Json | null
          pipeline_name: string
          pipeline_type: string
          repository_url: string
          status?: string
          success_rate?: number | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          branch_name?: string
          created_at?: string | null
          environment_variables?: Json | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          last_run_duration?: number | null
          notification_settings?: Json | null
          pipeline_config?: Json
          pipeline_metrics?: Json | null
          pipeline_name?: string
          pipeline_type?: string
          repository_url?: string
          status?: string
          success_rate?: number | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cod_transactions: {
        Row: {
          cod_amount: number
          collected_at: string | null
          collection_fee: number | null
          created_at: string | null
          customer_id: string | null
          customer_phone: string
          delivery_address: Json
          delivery_agent_id: string | null
          delivery_instructions: string | null
          deposit_reference: string | null
          deposited_at: string | null
          id: string
          notes: string | null
          order_id: string
          status: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          cod_amount: number
          collected_at?: string | null
          collection_fee?: number | null
          created_at?: string | null
          customer_id?: string | null
          customer_phone: string
          delivery_address: Json
          delivery_agent_id?: string | null
          delivery_instructions?: string | null
          deposit_reference?: string | null
          deposited_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          cod_amount?: number
          collected_at?: string | null
          collection_fee?: number | null
          created_at?: string | null
          customer_id?: string | null
          customer_phone?: string
          delivery_address?: Json
          delivery_agent_id?: string | null
          delivery_instructions?: string | null
          deposit_reference?: string | null
          deposited_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      commission_adjustments: {
        Row: {
          adjustment_amount: number
          adjustment_reason: string
          adjustment_type: string
          approved_at: string | null
          approved_by: string | null
          commission_id: string
          created_at: string | null
          created_by: string
          id: string
          reference_document: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          adjustment_amount: number
          adjustment_reason: string
          adjustment_type: string
          approved_at?: string | null
          approved_by?: string | null
          commission_id: string
          created_at?: string | null
          created_by: string
          id?: string
          reference_document?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          adjustment_amount?: number
          adjustment_reason?: string
          adjustment_type?: string
          approved_at?: string | null
          approved_by?: string | null
          commission_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          reference_document?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_adjustments_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "vendor_commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_analytics: {
        Row: {
          analytics_date: string
          analytics_period: string
          average_commission_per_order: number | null
          category_breakdown: Json | null
          commission_rate_percentage: number | null
          created_at: string | null
          growth_percentage: number | null
          id: string
          net_commission: number | null
          previous_period_commission: number | null
          total_commission_earned: number | null
          total_gross_sales: number | null
          total_orders: number | null
          total_platform_fees: number | null
          vendor_id: string | null
        }
        Insert: {
          analytics_date?: string
          analytics_period: string
          average_commission_per_order?: number | null
          category_breakdown?: Json | null
          commission_rate_percentage?: number | null
          created_at?: string | null
          growth_percentage?: number | null
          id?: string
          net_commission?: number | null
          previous_period_commission?: number | null
          total_commission_earned?: number | null
          total_gross_sales?: number | null
          total_orders?: number | null
          total_platform_fees?: number | null
          vendor_id?: string | null
        }
        Update: {
          analytics_date?: string
          analytics_period?: string
          average_commission_per_order?: number | null
          category_breakdown?: Json | null
          commission_rate_percentage?: number | null
          created_at?: string | null
          growth_percentage?: number | null
          id?: string
          net_commission?: number | null
          previous_period_commission?: number | null
          total_commission_earned?: number | null
          total_gross_sales?: number | null
          total_orders?: number | null
          total_platform_fees?: number | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      commission_disputes: {
        Row: {
          actual_resolution_date: string | null
          adjustment_amount: number | null
          claimed_amount: number | null
          commission_id: string
          created_at: string | null
          dispute_category: string | null
          dispute_description: string | null
          dispute_reason: string
          dispute_type: string
          disputed_amount: number
          evidence_files: Json | null
          expected_resolution_date: string | null
          id: string
          priority_level: string | null
          resolution_notes: string | null
          resolution_time_hours: number | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          actual_resolution_date?: string | null
          adjustment_amount?: number | null
          claimed_amount?: number | null
          commission_id: string
          created_at?: string | null
          dispute_category?: string | null
          dispute_description?: string | null
          dispute_reason: string
          dispute_type: string
          disputed_amount: number
          evidence_files?: Json | null
          expected_resolution_date?: string | null
          id?: string
          priority_level?: string | null
          resolution_notes?: string | null
          resolution_time_hours?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          actual_resolution_date?: string | null
          adjustment_amount?: number | null
          claimed_amount?: number | null
          commission_id?: string
          created_at?: string | null
          dispute_category?: string | null
          dispute_description?: string | null
          dispute_reason?: string
          dispute_type?: string
          disputed_amount?: number
          evidence_files?: Json | null
          expected_resolution_date?: string | null
          id?: string
          priority_level?: string | null
          resolution_notes?: string | null
          resolution_time_hours?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      commission_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_data: Json | null
          notification_type: string
          read_at: string | null
          recipient_id: string
          recipient_type: string
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_data?: Json | null
          notification_type: string
          read_at?: string | null
          recipient_id: string
          recipient_type: string
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_data?: Json | null
          notification_type?: string
          read_at?: string | null
          recipient_id?: string
          recipient_type?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      commission_payouts: {
        Row: {
          bank_account_info: Json | null
          commission_ids: Json
          created_at: string | null
          exchange_rate: number | null
          id: string
          minimum_payout_threshold: number | null
          net_payout_amount: number
          notes: string | null
          other_deductions: number | null
          payment_method: string
          payment_reference: string | null
          payout_batch_id: string
          payout_currency: string | null
          payout_fees: number | null
          payout_frequency: string | null
          period_end: string
          period_start: string
          platform_fees: number | null
          processed_by: string | null
          processed_date: string | null
          scheduled_date: string | null
          status: string | null
          tax_deductions: number | null
          total_commission: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          bank_account_info?: Json | null
          commission_ids?: Json
          created_at?: string | null
          exchange_rate?: number | null
          id?: string
          minimum_payout_threshold?: number | null
          net_payout_amount: number
          notes?: string | null
          other_deductions?: number | null
          payment_method: string
          payment_reference?: string | null
          payout_batch_id: string
          payout_currency?: string | null
          payout_fees?: number | null
          payout_frequency?: string | null
          period_end: string
          period_start: string
          platform_fees?: number | null
          processed_by?: string | null
          processed_date?: string | null
          scheduled_date?: string | null
          status?: string | null
          tax_deductions?: number | null
          total_commission: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          bank_account_info?: Json | null
          commission_ids?: Json
          created_at?: string | null
          exchange_rate?: number | null
          id?: string
          minimum_payout_threshold?: number | null
          net_payout_amount?: number
          notes?: string | null
          other_deductions?: number | null
          payment_method?: string
          payment_reference?: string | null
          payout_batch_id?: string
          payout_currency?: string | null
          payout_fees?: number | null
          payout_frequency?: string | null
          period_end?: string
          period_start?: string
          platform_fees?: number | null
          processed_by?: string | null
          processed_date?: string | null
          scheduled_date?: string | null
          status?: string | null
          tax_deductions?: number | null
          total_commission?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      commission_rate_history: {
        Row: {
          change_reason: string | null
          changed_by: string
          created_at: string | null
          effective_date: string
          id: string
          new_rate: number
          old_rate: number
          rate_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_by: string
          created_at?: string | null
          effective_date: string
          id?: string
          new_rate: number
          old_rate: number
          rate_id: string
        }
        Update: {
          change_reason?: string | null
          changed_by?: string
          created_at?: string | null
          effective_date?: string
          id?: string
          new_rate?: number
          old_rate?: number
          rate_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_rate_history_rate_id_fkey"
            columns: ["rate_id"]
            isOneToOne: false
            referencedRelation: "vendor_commission_rates"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_reconciliation: {
        Row: {
          actual_commission: number
          calculated_commission: number
          created_at: string | null
          id: string
          notes: string | null
          period_end: string
          period_start: string
          reconciled_at: string | null
          reconciled_by: string | null
          reconciliation_period: string
          reconciliation_status: string | null
          updated_at: string | null
          variance: number
          variance_percentage: number
          vendor_id: string
        }
        Insert: {
          actual_commission: number
          calculated_commission: number
          created_at?: string | null
          id?: string
          notes?: string | null
          period_end: string
          period_start: string
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_period: string
          reconciliation_status?: string | null
          updated_at?: string | null
          variance: number
          variance_percentage: number
          vendor_id: string
        }
        Update: {
          actual_commission?: number
          calculated_commission?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_period?: string
          reconciliation_status?: string | null
          updated_at?: string | null
          variance?: number
          variance_percentage?: number
          vendor_id?: string
        }
        Relationships: []
      }
      commission_tracking_settings: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          setting_key: string
          setting_type: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      competitive_pricing_analysis: {
        Row: {
          competitor_name: string
          competitor_price: number
          data_source: string | null
          id: string
          last_updated: string | null
          market_position: string | null
          our_price: number
          price_difference: number
          price_trend: Json | null
          product_id: string
        }
        Insert: {
          competitor_name: string
          competitor_price: number
          data_source?: string | null
          id?: string
          last_updated?: string | null
          market_position?: string | null
          our_price: number
          price_difference: number
          price_trend?: Json | null
          product_id: string
        }
        Update: {
          competitor_name?: string
          competitor_price?: number
          data_source?: string | null
          id?: string
          last_updated?: string | null
          market_position?: string | null
          our_price?: number
          price_difference?: number
          price_trend?: Json | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitive_pricing_analysis_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_price_tracking: {
        Row: {
          competitor_availability: boolean | null
          competitor_name: string
          competitor_price: number
          competitor_url: string | null
          confidence_score: number | null
          created_at: string | null
          data_source: string | null
          id: string
          price_change_amount: number | null
          price_change_percentage: number | null
          product_id: string | null
          tracking_date: string | null
        }
        Insert: {
          competitor_availability?: boolean | null
          competitor_name: string
          competitor_price: number
          competitor_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          price_change_amount?: number | null
          price_change_percentage?: number | null
          product_id?: string | null
          tracking_date?: string | null
        }
        Update: {
          competitor_availability?: boolean | null
          competitor_name?: string
          competitor_price?: number
          competitor_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          price_change_amount?: number | null
          price_change_percentage?: number | null
          product_id?: string | null
          tracking_date?: string | null
        }
        Relationships: []
      }
      compliance_frameworks: {
        Row: {
          audit_requirements: Json
          compliance_rules: Json
          created_at: string
          data_sovereignty_rules: Json
          effective_from: string
          effective_to: string | null
          framework_name: string
          framework_type: string
          id: string
          implementation_guidelines: Json
          is_mandatory: boolean
          jurisdiction: string
          regulatory_body: string
          reporting_requirements: Json
          updated_at: string
          version: string
          violation_penalties: Json
        }
        Insert: {
          audit_requirements?: Json
          compliance_rules?: Json
          created_at?: string
          data_sovereignty_rules?: Json
          effective_from: string
          effective_to?: string | null
          framework_name: string
          framework_type: string
          id?: string
          implementation_guidelines?: Json
          is_mandatory?: boolean
          jurisdiction?: string
          regulatory_body: string
          reporting_requirements?: Json
          updated_at?: string
          version?: string
          violation_penalties?: Json
        }
        Update: {
          audit_requirements?: Json
          compliance_rules?: Json
          created_at?: string
          data_sovereignty_rules?: Json
          effective_from?: string
          effective_to?: string | null
          framework_name?: string
          framework_type?: string
          id?: string
          implementation_guidelines?: Json
          is_mandatory?: boolean
          jurisdiction?: string
          regulatory_body?: string
          reporting_requirements?: Json
          updated_at?: string
          version?: string
          violation_penalties?: Json
        }
        Relationships: []
      }
      compliance_monitoring: {
        Row: {
          audit_trail: Json
          automated_fixes_applied: Json
          check_frequency: string
          compliance_check_type: string
          compliance_status: string
          created_at: string
          data_sovereignty_compliance: Json
          framework_id: string
          id: string
          last_check_at: string
          manual_review_required: boolean
          next_check_at: string
          remediation_actions: Json
          updated_at: string
          violations_detected: Json
        }
        Insert: {
          audit_trail?: Json
          automated_fixes_applied?: Json
          check_frequency: string
          compliance_check_type: string
          compliance_status?: string
          created_at?: string
          data_sovereignty_compliance?: Json
          framework_id: string
          id?: string
          last_check_at?: string
          manual_review_required?: boolean
          next_check_at: string
          remediation_actions?: Json
          updated_at?: string
          violations_detected?: Json
        }
        Update: {
          audit_trail?: Json
          automated_fixes_applied?: Json
          check_frequency?: string
          compliance_check_type?: string
          compliance_status?: string
          created_at?: string
          data_sovereignty_compliance?: Json
          framework_id?: string
          id?: string
          last_check_at?: string
          manual_review_required?: boolean
          next_check_at?: string
          remediation_actions?: Json
          updated_at?: string
          violations_detected?: Json
        }
        Relationships: []
      }
      compression_optimization_rules: {
        Row: {
          bandwidth_threshold: string | null
          compression_algorithm: string
          compression_level: number | null
          content_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          max_compression_time_ms: number | null
          min_size_threshold: number | null
          performance_metrics: Json | null
          updated_at: string | null
        }
        Insert: {
          bandwidth_threshold?: string | null
          compression_algorithm: string
          compression_level?: number | null
          content_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_compression_time_ms?: number | null
          min_size_threshold?: number | null
          performance_metrics?: Json | null
          updated_at?: string | null
        }
        Update: {
          bandwidth_threshold?: string | null
          compression_algorithm?: string
          compression_level?: number | null
          content_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_compression_time_ms?: number | null
          min_size_threshold?: number | null
          performance_metrics?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      container_registries: {
        Row: {
          access_policies: Json | null
          authentication_config: Json
          created_at: string | null
          id: string
          image_scanning_enabled: boolean | null
          is_active: boolean | null
          registry_name: string
          registry_type: string
          registry_url: string
          retention_policies: Json | null
          storage_usage_gb: number | null
          updated_at: string | null
          vulnerability_policies: Json | null
        }
        Insert: {
          access_policies?: Json | null
          authentication_config?: Json
          created_at?: string | null
          id?: string
          image_scanning_enabled?: boolean | null
          is_active?: boolean | null
          registry_name: string
          registry_type: string
          registry_url: string
          retention_policies?: Json | null
          storage_usage_gb?: number | null
          updated_at?: string | null
          vulnerability_policies?: Json | null
        }
        Update: {
          access_policies?: Json | null
          authentication_config?: Json
          created_at?: string | null
          id?: string
          image_scanning_enabled?: boolean | null
          is_active?: boolean | null
          registry_name?: string
          registry_type?: string
          registry_url?: string
          retention_policies?: Json | null
          storage_usage_gb?: number | null
          updated_at?: string | null
          vulnerability_policies?: Json | null
        }
        Relationships: []
      }
      content_localization: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          human_reviewed: boolean | null
          id: string
          language_code: string
          localized_content: Json
          original_content: Json
          region_id: string | null
          reviewer_id: string | null
          translation_confidence: number | null
          translation_status: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          human_reviewed?: boolean | null
          id?: string
          language_code: string
          localized_content: Json
          original_content: Json
          region_id?: string | null
          reviewer_id?: string | null
          translation_confidence?: number | null
          translation_status?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          human_reviewed?: boolean | null
          id?: string
          language_code?: string
          localized_content?: Json
          original_content?: Json
          region_id?: string | null
          reviewer_id?: string | null
          translation_confidence?: number | null
          translation_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_localization_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "geo_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_optimization_cache: {
        Row: {
          compression_ratio: number
          content_key: string
          content_type: string
          created_at: string | null
          edge_node_id: string | null
          expires_at: string
          geographic_region: string
          id: string
          optimized_size_bytes: number
          original_size_bytes: number
          rural_optimized: boolean | null
        }
        Insert: {
          compression_ratio: number
          content_key: string
          content_type: string
          created_at?: string | null
          edge_node_id?: string | null
          expires_at: string
          geographic_region: string
          id?: string
          optimized_size_bytes: number
          original_size_bytes: number
          rural_optimized?: boolean | null
        }
        Update: {
          compression_ratio?: number
          content_key?: string
          content_type?: string
          created_at?: string | null
          edge_node_id?: string | null
          expires_at?: string
          geographic_region?: string
          id?: string
          optimized_size_bytes?: number
          original_size_bytes?: number
          rural_optimized?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "content_optimization_cache_edge_node_id_fkey"
            columns: ["edge_node_id"]
            isOneToOne: false
            referencedRelation: "edge_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_funnels: {
        Row: {
          created_at: string | null
          funnel_name: string
          funnel_steps: Json
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          funnel_name: string
          funnel_steps?: Json
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          funnel_name?: string
          funnel_steps?: Json
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversion_tracking: {
        Row: {
          conversion_type: string
          conversion_value: number | null
          created_at: string
          id: string
          products_viewed: Json | null
          search_query: string | null
          session_id: string
          source_page: string | null
          target_action: string | null
          time_to_conversion: number | null
          user_id: string | null
        }
        Insert: {
          conversion_type: string
          conversion_value?: number | null
          created_at?: string
          id?: string
          products_viewed?: Json | null
          search_query?: string | null
          session_id: string
          source_page?: string | null
          target_action?: string | null
          time_to_conversion?: number | null
          user_id?: string | null
        }
        Update: {
          conversion_type?: string
          conversion_value?: number | null
          created_at?: string
          id?: string
          products_viewed?: Json | null
          search_query?: string | null
          session_id?: string
          source_page?: string | null
          target_action?: string | null
          time_to_conversion?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      courier_shipments: {
        Row: {
          actual_delivery_date: string | null
          courier_name: string
          courier_response: Json | null
          created_at: string | null
          delivery_address: Json
          delivery_attempts: number | null
          estimated_delivery: string | null
          id: string
          order_id: string
          package_details: Json
          pickup_address: Json
          status: string
          tracking_id: string
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          courier_name: string
          courier_response?: Json | null
          created_at?: string | null
          delivery_address: Json
          delivery_attempts?: number | null
          estimated_delivery?: string | null
          id?: string
          order_id: string
          package_details: Json
          pickup_address: Json
          status?: string
          tracking_id: string
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          courier_name?: string
          courier_response?: Json | null
          created_at?: string | null
          delivery_address?: Json
          delivery_attempts?: number | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          package_details?: Json
          pickup_address?: Json
          status?: string
          tracking_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cross_wallet_transfers: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          from_wallet_id: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          scheduled_at: string | null
          status: string | null
          to_wallet_id: string | null
          transfer_fee: number | null
          transfer_type: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          from_wallet_id?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          scheduled_at?: string | null
          status?: string | null
          to_wallet_id?: string | null
          transfer_fee?: number | null
          transfer_type?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          from_wallet_id?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          scheduled_at?: string | null
          status?: string | null
          to_wallet_id?: string | null
          transfer_fee?: number | null
          transfer_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cross_wallet_transfers_from_wallet_id_fkey"
            columns: ["from_wallet_id"]
            isOneToOne: false
            referencedRelation: "mobile_money_wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_wallet_transfers_to_wallet_id_fkey"
            columns: ["to_wallet_id"]
            isOneToOne: false
            referencedRelation: "mobile_money_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      cultural_preferences: {
        Row: {
          calendar_type: string | null
          created_at: string | null
          currency_display: string | null
          date_format: string | null
          festival_notifications: boolean | null
          id: string
          number_format: string | null
          prayer_time_integration: boolean | null
          preferred_language: string | null
          region_specific_content: boolean | null
          time_format: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calendar_type?: string | null
          created_at?: string | null
          currency_display?: string | null
          date_format?: string | null
          festival_notifications?: boolean | null
          id?: string
          number_format?: string | null
          prayer_time_integration?: boolean | null
          preferred_language?: string | null
          region_specific_content?: boolean | null
          time_format?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calendar_type?: string | null
          created_at?: string | null
          currency_display?: string | null
          date_format?: string | null
          festival_notifications?: boolean | null
          id?: string
          number_format?: string | null
          prayer_time_integration?: boolean | null
          preferred_language?: string | null
          region_specific_content?: boolean | null
          time_format?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      currency_rates: {
        Row: {
          created_at: string | null
          from_currency: string
          id: string
          is_active: boolean | null
          provider: string
          rate: number
          to_currency: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_currency: string
          id?: string
          is_active?: boolean | null
          provider: string
          rate: number
          to_currency: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_currency?: string
          id?: string
          is_active?: boolean | null
          provider?: string
          rate?: number
          to_currency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_report_templates: {
        Row: {
          created_at: string | null
          created_by: string
          data_sources: Json
          id: string
          is_public: boolean | null
          report_configuration: Json
          report_type: string
          template_description: string | null
          template_name: string
          template_version: number | null
          updated_at: string | null
          vendor_id: string | null
          visualization_config: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          data_sources?: Json
          id?: string
          is_public?: boolean | null
          report_configuration?: Json
          report_type: string
          template_description?: string | null
          template_name: string
          template_version?: number | null
          updated_at?: string | null
          vendor_id?: string | null
          visualization_config?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          data_sources?: Json
          id?: string
          is_public?: boolean | null
          report_configuration?: Json
          report_type?: string
          template_description?: string | null
          template_name?: string
          template_version?: number | null
          updated_at?: string | null
          vendor_id?: string | null
          visualization_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_report_templates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_analytics: {
        Row: {
          analytics_date: string
          average_order_value: number | null
          churn_risk_score: number | null
          created_at: string | null
          customer_id: string
          customer_lifetime_value: number | null
          engagement_score: number | null
          favorite_categories: Json | null
          id: string
          last_purchase_date: string | null
          preferred_payment_methods: Json | null
          purchase_frequency: number | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          analytics_date?: string
          average_order_value?: number | null
          churn_risk_score?: number | null
          created_at?: string | null
          customer_id: string
          customer_lifetime_value?: number | null
          engagement_score?: number | null
          favorite_categories?: Json | null
          id?: string
          last_purchase_date?: string | null
          preferred_payment_methods?: Json | null
          purchase_frequency?: number | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          analytics_date?: string
          average_order_value?: number | null
          churn_risk_score?: number | null
          created_at?: string | null
          customer_id?: string
          customer_lifetime_value?: number | null
          engagement_score?: number | null
          favorite_categories?: Json | null
          id?: string
          last_purchase_date?: string | null
          preferred_payment_methods?: Json | null
          purchase_frequency?: number | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      customer_behavior_analytics: {
        Row: {
          behavior_data: Json | null
          behavior_type: string
          created_at: string
          customer_id: string
          id: string
          product_id: string | null
          recorded_at: string
          session_id: string | null
          vendor_id: string
        }
        Insert: {
          behavior_data?: Json | null
          behavior_type: string
          created_at?: string
          customer_id: string
          id?: string
          product_id?: string | null
          recorded_at?: string
          session_id?: string | null
          vendor_id: string
        }
        Update: {
          behavior_data?: Json | null
          behavior_type?: string
          created_at?: string
          customer_id?: string
          id?: string
          product_id?: string | null
          recorded_at?: string
          session_id?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      customer_journey_analytics: {
        Row: {
          churn_risk_score: number | null
          conversion_events: Json | null
          conversion_probability: number | null
          created_at: string | null
          current_stage_id: string | null
          customer_id: string
          customer_value_score: number | null
          engagement_score: number | null
          id: string
          journey_end: string | null
          journey_start: string
          last_interaction: string | null
          next_best_action: Json | null
          stages_completed: Json | null
          total_interactions: number | null
          total_time_spent_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          churn_risk_score?: number | null
          conversion_events?: Json | null
          conversion_probability?: number | null
          created_at?: string | null
          current_stage_id?: string | null
          customer_id: string
          customer_value_score?: number | null
          engagement_score?: number | null
          id?: string
          journey_end?: string | null
          journey_start: string
          last_interaction?: string | null
          next_best_action?: Json | null
          stages_completed?: Json | null
          total_interactions?: number | null
          total_time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          churn_risk_score?: number | null
          conversion_events?: Json | null
          conversion_probability?: number | null
          created_at?: string | null
          current_stage_id?: string | null
          customer_id?: string
          customer_value_score?: number | null
          engagement_score?: number | null
          id?: string
          journey_end?: string | null
          journey_start?: string
          last_interaction?: string | null
          next_best_action?: Json | null
          stages_completed?: Json | null
          total_interactions?: number | null
          total_time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_journey_analytics_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "customer_journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_journey_events: {
        Row: {
          customer_id: string
          device_info: Json | null
          event_name: string
          event_properties: Json | null
          event_type: string
          id: string
          location_data: Json | null
          processing_status: string | null
          session_id: string | null
          stage_id: string | null
          timestamp: string | null
        }
        Insert: {
          customer_id: string
          device_info?: Json | null
          event_name: string
          event_properties?: Json | null
          event_type: string
          id?: string
          location_data?: Json | null
          processing_status?: string | null
          session_id?: string | null
          stage_id?: string | null
          timestamp?: string | null
        }
        Update: {
          customer_id?: string
          device_info?: Json | null
          event_name?: string
          event_properties?: Json | null
          event_type?: string
          id?: string
          location_data?: Json | null
          processing_status?: string | null
          session_id?: string | null
          stage_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_journey_events_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "customer_journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_journey_stages: {
        Row: {
          conversion_goals: Json | null
          created_at: string | null
          description: string | null
          expected_duration_days: number | null
          id: string
          stage_name: string
          stage_order: number
        }
        Insert: {
          conversion_goals?: Json | null
          created_at?: string | null
          description?: string | null
          expected_duration_days?: number | null
          id?: string
          stage_name: string
          stage_order: number
        }
        Update: {
          conversion_goals?: Json | null
          created_at?: string | null
          description?: string | null
          expected_duration_days?: number | null
          id?: string
          stage_name?: string
          stage_order?: number
        }
        Relationships: []
      }
      customer_lifetime_value: {
        Row: {
          average_order_value: number | null
          calculation_factors: Json | null
          churn_probability: number | null
          clv_segment: string
          created_at: string | null
          current_clv: number
          customer_lifespan_months: number | null
          id: string
          last_calculated: string | null
          predicted_clv: number
          purchase_frequency: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_order_value?: number | null
          calculation_factors?: Json | null
          churn_probability?: number | null
          clv_segment?: string
          created_at?: string | null
          current_clv?: number
          customer_lifespan_months?: number | null
          id?: string
          last_calculated?: string | null
          predicted_clv?: number
          purchase_frequency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_order_value?: number | null
          calculation_factors?: Json | null
          churn_probability?: number | null
          clv_segment?: string
          created_at?: string | null
          current_clv?: number
          customer_lifespan_months?: number | null
          id?: string
          last_calculated?: string | null
          predicted_clv?: number
          purchase_frequency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customer_lifetime_value_predictions: {
        Row: {
          clv_factors: Json | null
          confidence_interval: Json
          created_at: string | null
          customer_id: string
          expires_at: string | null
          id: string
          opportunity_factors: Json | null
          predicted_clv: number
          prediction_horizon: number
          risk_factors: Json | null
          segment_classification: string | null
          vendor_id: string | null
        }
        Insert: {
          clv_factors?: Json | null
          confidence_interval?: Json
          created_at?: string | null
          customer_id: string
          expires_at?: string | null
          id?: string
          opportunity_factors?: Json | null
          predicted_clv: number
          prediction_horizon: number
          risk_factors?: Json | null
          segment_classification?: string | null
          vendor_id?: string | null
        }
        Update: {
          clv_factors?: Json | null
          confidence_interval?: Json
          created_at?: string | null
          customer_id?: string
          expires_at?: string | null
          id?: string
          opportunity_factors?: Json | null
          predicted_clv?: number
          prediction_horizon?: number
          risk_factors?: Json | null
          segment_classification?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_lifetime_value_predictions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_loyalty_points: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          last_activity_at: string | null
          lifetime_points: number | null
          points_balance: number | null
          program_id: string | null
          tier_benefits: Json | null
          tier_level: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          last_activity_at?: string | null
          lifetime_points?: number | null
          points_balance?: number | null
          program_id?: string | null
          tier_benefits?: Json | null
          tier_level?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          last_activity_at?: string | null
          lifetime_points?: number | null
          points_balance?: number | null
          program_id?: string | null
          tier_benefits?: Json | null
          tier_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_points_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segment_memberships: {
        Row: {
          confidence_score: number | null
          customer_id: string | null
          id: string
          joined_at: string | null
          segment_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          customer_id?: string | null
          id?: string
          joined_at?: string | null
          segment_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          customer_id?: string | null
          id?: string
          joined_at?: string | null
          segment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_segment_memberships_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          avg_order_value: number | null
          created_at: string | null
          criteria: Json
          customer_count: number | null
          id: string
          is_active: boolean | null
          lifetime_value: number | null
          segment_name: string
          updated_at: string | null
        }
        Insert: {
          avg_order_value?: number | null
          created_at?: string | null
          criteria: Json
          customer_count?: number | null
          id?: string
          is_active?: boolean | null
          lifetime_value?: number | null
          segment_name: string
          updated_at?: string | null
        }
        Update: {
          avg_order_value?: number | null
          created_at?: string | null
          criteria?: Json
          customer_count?: number | null
          id?: string
          is_active?: boolean | null
          lifetime_value?: number | null
          segment_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_kpi_metrics: {
        Row: {
          comparison_value: number | null
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          metric_category: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          percentage_change: number | null
          recorded_date: string
          time_period: string
          trend_direction: string | null
          updated_at: string
        }
        Insert: {
          comparison_value?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          metric_category: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          percentage_change?: number | null
          recorded_date?: string
          time_period: string
          trend_direction?: string | null
          updated_at?: string
        }
        Update: {
          comparison_value?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          metric_category?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          percentage_change?: number | null
          recorded_date?: string
          time_period?: string
          trend_direction?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_kpi_metrics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_metrics: {
        Row: {
          created_at: string
          date_recorded: string | null
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number | null
        }
        Insert: {
          created_at?: string
          date_recorded?: string | null
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value?: number | null
        }
        Update: {
          created_at?: string
          date_recorded?: string | null
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number | null
        }
        Relationships: []
      }
      database_replicas: {
        Row: {
          auto_failover_enabled: boolean | null
          configuration: Json
          created_at: string
          failover_priority: number | null
          health_status: string | null
          id: string
          last_sync_at: string | null
          primary_endpoint: string
          region: string
          replica_endpoint: string
          replica_name: string
          replica_type: string
          replication_lag_ms: number | null
          updated_at: string
        }
        Insert: {
          auto_failover_enabled?: boolean | null
          configuration?: Json
          created_at?: string
          failover_priority?: number | null
          health_status?: string | null
          id?: string
          last_sync_at?: string | null
          primary_endpoint: string
          region: string
          replica_endpoint: string
          replica_name: string
          replica_type: string
          replication_lag_ms?: number | null
          updated_at?: string
        }
        Update: {
          auto_failover_enabled?: boolean | null
          configuration?: Json
          created_at?: string
          failover_priority?: number | null
          health_status?: string | null
          id?: string
          last_sync_at?: string | null
          primary_endpoint?: string
          region?: string
          replica_endpoint?: string
          replica_name?: string
          replica_type?: string
          replication_lag_ms?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      db_connection_pool_stats: {
        Row: {
          active_connections: number
          avg_response_time_ms: number
          id: string
          idle_connections: number
          last_updated: string
          max_connections: number
          pool_name: string
          total_requests: number
        }
        Insert: {
          active_connections?: number
          avg_response_time_ms?: number
          id?: string
          idle_connections?: number
          last_updated?: string
          max_connections?: number
          pool_name: string
          total_requests?: number
        }
        Update: {
          active_connections?: number
          avg_response_time_ms?: number
          id?: string
          idle_connections?: number
          last_updated?: string
          max_connections?: number
          pool_name?: string
          total_requests?: number
        }
        Relationships: []
      }
      demand_analytics: {
        Row: {
          analytics_date: string | null
          cart_additions: number | null
          conversion_rate: number | null
          created_at: string | null
          demand_score: number | null
          demand_trend: string | null
          id: string
          product_id: string | null
          purchase_count: number | null
          search_frequency: number | null
          time_period: string | null
          view_count: number | null
          wishlist_additions: number | null
        }
        Insert: {
          analytics_date?: string | null
          cart_additions?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          demand_score?: number | null
          demand_trend?: string | null
          id?: string
          product_id?: string | null
          purchase_count?: number | null
          search_frequency?: number | null
          time_period?: string | null
          view_count?: number | null
          wishlist_additions?: number | null
        }
        Update: {
          analytics_date?: string | null
          cart_additions?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          demand_score?: number | null
          demand_trend?: string | null
          id?: string
          product_id?: string | null
          purchase_count?: number | null
          search_frequency?: number | null
          time_period?: string | null
          view_count?: number | null
          wishlist_additions?: number | null
        }
        Relationships: []
      }
      demand_forecasts: {
        Row: {
          algorithm_version: string | null
          confidence_score: number | null
          created_at: string
          factors_considered: Json | null
          forecast_date: string
          forecast_period: string
          historical_data: Json | null
          id: string
          predicted_demand: number
          product_id: string
          vendor_id: string
        }
        Insert: {
          algorithm_version?: string | null
          confidence_score?: number | null
          created_at?: string
          factors_considered?: Json | null
          forecast_date: string
          forecast_period: string
          historical_data?: Json | null
          id?: string
          predicted_demand: number
          product_id: string
          vendor_id: string
        }
        Update: {
          algorithm_version?: string | null
          confidence_score?: number | null
          created_at?: string
          factors_considered?: Json | null
          forecast_date?: string
          forecast_period?: string
          historical_data?: Json | null
          id?: string
          predicted_demand?: number
          product_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demand_forecasts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demand_forecasts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          demand_factors: Json | null
          external_factors: Json | null
          historical_patterns: Json | null
          id: string
          predicted_demand: number
          prediction_date: string
          product_id: string
          vendor_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          demand_factors?: Json | null
          external_factors?: Json | null
          historical_patterns?: Json | null
          id?: string
          predicted_demand: number
          prediction_date: string
          product_id: string
          vendor_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          demand_factors?: Json | null
          external_factors?: Json | null
          historical_patterns?: Json | null
          id?: string
          predicted_demand?: number
          prediction_date?: string
          product_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demand_predictions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demand_predictions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tracking: {
        Row: {
          device_fingerprint: string
          device_info: Json
          first_seen_at: string | null
          id: string
          ip_address: unknown | null
          is_trusted: boolean | null
          last_seen_at: string | null
          location_data: Json | null
          risk_score: number | null
          user_id: string | null
        }
        Insert: {
          device_fingerprint: string
          device_info?: Json
          first_seen_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_trusted?: boolean | null
          last_seen_at?: string | null
          location_data?: Json | null
          risk_score?: number | null
          user_id?: string | null
        }
        Update: {
          device_fingerprint?: string
          device_info?: Json
          first_seen_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_trusted?: boolean | null
          last_seen_at?: string | null
          location_data?: Json | null
          risk_score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      digital_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          daily_limit: number | null
          id: string
          is_active: boolean | null
          kyc_level: number | null
          last_transaction_at: string | null
          monthly_limit: number | null
          pin_hash: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          kyc_level?: number | null
          last_transaction_at?: string | null
          monthly_limit?: number | null
          pin_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          kyc_level?: number | null
          last_transaction_at?: string | null
          monthly_limit?: number | null
          pin_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      distributed_traces: {
        Row: {
          baggage: Json | null
          duration_ms: number | null
          end_time: string | null
          error_message: string | null
          id: string
          logs: Json | null
          operation_name: string
          parent_span_id: string | null
          service_name: string
          span_id: string
          start_time: string
          status: string | null
          tags: Json | null
          trace_id: string
        }
        Insert: {
          baggage?: Json | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          logs?: Json | null
          operation_name: string
          parent_span_id?: string | null
          service_name: string
          span_id: string
          start_time: string
          status?: string | null
          tags?: Json | null
          trace_id: string
        }
        Update: {
          baggage?: Json | null
          duration_ms?: number | null
          end_time?: string | null
          error_message?: string | null
          id?: string
          logs?: Json | null
          operation_name?: string
          parent_span_id?: string | null
          service_name?: string
          span_id?: string
          start_time?: string
          status?: string | null
          tags?: Json | null
          trace_id?: string
        }
        Relationships: []
      }
      dynamic_pricing_models: {
        Row: {
          configuration: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          max_price_change_percent: number | null
          min_margin: number | null
          model_name: string
          model_type: string
          pricing_frequency: string | null
          target_margin: number | null
          updated_at: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_price_change_percent?: number | null
          min_margin?: number | null
          model_name: string
          model_type: string
          pricing_frequency?: string | null
          target_margin?: number | null
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_price_change_percent?: number | null
          min_margin?: number | null
          model_name?: string
          model_type?: string
          pricing_frequency?: string | null
          target_margin?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dynamic_pricing_rules: {
        Row: {
          adjustment_factors: Json
          base_price: number
          category_id: string | null
          competition_weight: number | null
          created_at: string | null
          created_by: string
          demand_weight: number | null
          id: string
          inventory_weight: number | null
          is_active: boolean | null
          max_price: number
          min_price: number
          pricing_strategy: string
          product_id: string | null
          rule_name: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          adjustment_factors?: Json
          base_price: number
          category_id?: string | null
          competition_weight?: number | null
          created_at?: string | null
          created_by: string
          demand_weight?: number | null
          id?: string
          inventory_weight?: number | null
          is_active?: boolean | null
          max_price: number
          min_price: number
          pricing_strategy: string
          product_id?: string | null
          rule_name: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          adjustment_factors?: Json
          base_price?: number
          category_id?: string | null
          competition_weight?: number | null
          created_at?: string | null
          created_by?: string
          demand_weight?: number | null
          id?: string
          inventory_weight?: number | null
          is_active?: boolean | null
          max_price?: number
          min_price?: number
          pricing_strategy?: string
          product_id?: string | null
          rule_name?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      dynamic_pricing_suggestions: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          confidence_score: number
          created_at: string | null
          current_price: number
          estimated_impact: Json | null
          id: string
          price_change_percentage: number
          product_id: string
          reasoning: Json
          rule_id: string | null
          status: string | null
          suggested_price: number
          valid_until: string
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          confidence_score: number
          created_at?: string | null
          current_price: number
          estimated_impact?: Json | null
          id?: string
          price_change_percentage: number
          product_id: string
          reasoning?: Json
          rule_id?: string | null
          status?: string | null
          suggested_price: number
          valid_until: string
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          confidence_score?: number
          created_at?: string | null
          current_price?: number
          estimated_impact?: Json | null
          id?: string
          price_change_percentage?: number
          product_id?: string
          reasoning?: Json
          rule_id?: string | null
          status?: string | null
          suggested_price?: number
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_pricing_suggestions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "dynamic_pricing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      edge_nodes: {
        Row: {
          city: string
          coordinates: Json
          country_code: string
          created_at: string | null
          current_load: number | null
          geographic_region: string
          health_status: string | null
          id: string
          node_capacity: Json | null
          node_name: string
          optimization_config: Json | null
          rural_optimization_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          city: string
          coordinates: Json
          country_code: string
          created_at?: string | null
          current_load?: number | null
          geographic_region: string
          health_status?: string | null
          id?: string
          node_capacity?: Json | null
          node_name: string
          optimization_config?: Json | null
          rural_optimization_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          city?: string
          coordinates?: Json
          country_code?: string
          created_at?: string | null
          current_load?: number | null
          geographic_region?: string
          health_status?: string | null
          id?: string
          node_capacity?: Json | null
          node_name?: string
          optimization_config?: Json | null
          rural_optimization_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      enhanced_audit_trails: {
        Row: {
          action_performed: string
          audit_id: string
          blockchain_reference: string | null
          business_context: Json
          compliance_tags: Json
          created_at: string
          data_after: Json | null
          data_before: Json | null
          data_sensitivity_level: string
          event_type: string
          geographic_location: string | null
          id: string
          immutable_hash: string
          ip_address: unknown | null
          regulatory_classification: string | null
          request_headers: Json | null
          resource_id: string | null
          resource_type: string
          retention_period: unknown
          security_context: Json
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_performed: string
          audit_id: string
          blockchain_reference?: string | null
          business_context?: Json
          compliance_tags?: Json
          created_at?: string
          data_after?: Json | null
          data_before?: Json | null
          data_sensitivity_level?: string
          event_type: string
          geographic_location?: string | null
          id?: string
          immutable_hash: string
          ip_address?: unknown | null
          regulatory_classification?: string | null
          request_headers?: Json | null
          resource_id?: string | null
          resource_type: string
          retention_period?: unknown
          security_context?: Json
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_performed?: string
          audit_id?: string
          blockchain_reference?: string | null
          business_context?: Json
          compliance_tags?: Json
          created_at?: string
          data_after?: Json | null
          data_before?: Json | null
          data_sensitivity_level?: string
          event_type?: string
          geographic_location?: string | null
          id?: string
          immutable_hash?: string
          ip_address?: unknown | null
          regulatory_classification?: string | null
          request_headers?: Json | null
          resource_id?: string | null
          resource_type?: string
          retention_period?: unknown
          security_context?: Json
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      enhanced_performance_metrics: {
        Row: {
          additional_metadata: Json | null
          connection_type: string | null
          device_type: string | null
          geographic_region: string | null
          id: string
          is_slow_performance: boolean | null
          measurement_unit: string
          metric_category: string
          metric_name: string
          metric_value: number
          performance_grade: string | null
          resource_identifier: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          additional_metadata?: Json | null
          connection_type?: string | null
          device_type?: string | null
          geographic_region?: string | null
          id?: string
          is_slow_performance?: boolean | null
          measurement_unit: string
          metric_category: string
          metric_name: string
          metric_value: number
          performance_grade?: string | null
          resource_identifier?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          additional_metadata?: Json | null
          connection_type?: string | null
          device_type?: string | null
          geographic_region?: string | null
          id?: string
          is_slow_performance?: boolean | null
          measurement_unit?: string
          metric_category?: string
          metric_name?: string
          metric_value?: number
          performance_grade?: string | null
          resource_identifier?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      enhanced_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          key_type: string
          key_value: string
          max_requests: number
          requests_count: number
          window_size_ms: number
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          key_type: string
          key_value: string
          max_requests?: number
          requests_count?: number
          window_size_ms?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          key_type?: string
          key_value?: string
          max_requests?: number
          requests_count?: number
          window_size_ms?: number
          window_start?: string
        }
        Relationships: []
      }
      enterprise_features: {
        Row: {
          actual_completion_date: string | null
          amazon_equivalent: string | null
          assigned_team: string | null
          business_impact_score: number | null
          business_requirements: Json | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          estimated_effort_days: number | null
          feature_name: string
          feature_type: string
          id: string
          implementation_plan: Json | null
          implementation_status: string
          priority_level: string
          roi_estimate: number | null
          shopee_equivalent: string | null
          start_date: string | null
          success_metrics: Json | null
          target_completion_date: string | null
          technical_complexity_score: number | null
          technical_requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          amazon_equivalent?: string | null
          assigned_team?: string | null
          business_impact_score?: number | null
          business_requirements?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_effort_days?: number | null
          feature_name: string
          feature_type: string
          id?: string
          implementation_plan?: Json | null
          implementation_status?: string
          priority_level?: string
          roi_estimate?: number | null
          shopee_equivalent?: string | null
          start_date?: string | null
          success_metrics?: Json | null
          target_completion_date?: string | null
          technical_complexity_score?: number | null
          technical_requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          amazon_equivalent?: string | null
          assigned_team?: string | null
          business_impact_score?: number | null
          business_requirements?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_effort_days?: number | null
          feature_name?: string
          feature_type?: string
          id?: string
          implementation_plan?: Json | null
          implementation_status?: string
          priority_level?: string
          roi_estimate?: number | null
          shopee_equivalent?: string | null
          start_date?: string | null
          success_metrics?: Json | null
          target_completion_date?: string | null
          technical_complexity_score?: number | null
          technical_requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      error_tracking: {
        Row: {
          created_at: string
          error_message: string
          id: string
          metadata: Json | null
          service_name: string
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
          metadata?: Json | null
          service_name: string
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
          metadata?: Json | null
          service_name?: string
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      event_processing_queue: {
        Row: {
          completed_at: string | null
          error_details: Json | null
          event_id: string
          id: string
          priority: number
          processing_status: string
          processor_name: string
          retry_count: number
          scheduled_at: string
          started_at: string | null
        }
        Insert: {
          completed_at?: string | null
          error_details?: Json | null
          event_id: string
          id?: string
          priority?: number
          processing_status?: string
          processor_name: string
          retry_count?: number
          scheduled_at?: string
          started_at?: string | null
        }
        Update: {
          completed_at?: string | null
          error_details?: Json | null
          event_id?: string
          id?: string
          priority?: number
          processing_status?: string
          processor_name?: string
          retry_count?: number
          scheduled_at?: string
          started_at?: string | null
        }
        Relationships: []
      }
      event_streams: {
        Row: {
          correlation_id: string | null
          created_at: string
          event_id: string
          event_payload: Json
          event_timestamp: string
          event_type: string
          id: string
          processed_at: string | null
          processing_status: string
          retry_count: number
          routing_key: string | null
          source_service: string
        }
        Insert: {
          correlation_id?: string | null
          created_at?: string
          event_id: string
          event_payload?: Json
          event_timestamp?: string
          event_type: string
          id?: string
          processed_at?: string | null
          processing_status?: string
          retry_count?: number
          routing_key?: string | null
          source_service: string
        }
        Update: {
          correlation_id?: string | null
          created_at?: string
          event_id?: string
          event_payload?: Json
          event_timestamp?: string
          event_type?: string
          id?: string
          processed_at?: string | null
          processing_status?: string
          retry_count?: number
          routing_key?: string | null
          source_service?: string
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          base_currency: string
          created_at: string | null
          exchange_rate: number
          id: string
          is_official: boolean | null
          rate_date: string
          rate_source: string | null
          target_currency: string
        }
        Insert: {
          base_currency?: string
          created_at?: string | null
          exchange_rate: number
          id?: string
          is_official?: boolean | null
          rate_date: string
          rate_source?: string | null
          target_currency: string
        }
        Update: {
          base_currency?: string
          created_at?: string | null
          exchange_rate?: number
          id?: string
          is_official?: boolean | null
          rate_date?: string
          rate_source?: string | null
          target_currency?: string
        }
        Relationships: []
      }
      executive_dashboards: {
        Row: {
          created_at: string | null
          created_by: string | null
          dashboard_name: string
          dashboard_type: string
          executive_level: string
          filters: Json | null
          id: string
          is_active: boolean | null
          refresh_interval: number | null
          updated_at: string | null
          widgets: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dashboard_name: string
          dashboard_type: string
          executive_level: string
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          refresh_interval?: number | null
          updated_at?: string | null
          widgets?: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dashboard_name?: string
          dashboard_type?: string
          executive_level?: string
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          refresh_interval?: number | null
          updated_at?: string | null
          widgets?: Json
        }
        Relationships: []
      }
      executive_kpi_dashboard: {
        Row: {
          benchmark_value: number | null
          created_at: string | null
          current_value: number
          id: string
          metadata: Json | null
          metric_category: string
          metric_name: string
          performance_status: string | null
          previous_period_value: number | null
          recorded_date: string | null
          target_value: number | null
          time_period: string
          trend_direction: string | null
          trend_percentage: number | null
        }
        Insert: {
          benchmark_value?: number | null
          created_at?: string | null
          current_value: number
          id?: string
          metadata?: Json | null
          metric_category: string
          metric_name: string
          performance_status?: string | null
          previous_period_value?: number | null
          recorded_date?: string | null
          target_value?: number | null
          time_period: string
          trend_direction?: string | null
          trend_percentage?: number | null
        }
        Update: {
          benchmark_value?: number | null
          created_at?: string | null
          current_value?: number
          id?: string
          metadata?: Json | null
          metric_category?: string
          metric_name?: string
          performance_status?: string | null
          previous_period_value?: number | null
          recorded_date?: string | null
          target_value?: number | null
          time_period?: string
          trend_direction?: string | null
          trend_percentage?: number | null
        }
        Relationships: []
      }
      executive_reports: {
        Row: {
          approved_by: string | null
          charts_data: Json | null
          created_at: string
          created_by: string
          executive_summary: string
          id: string
          key_metrics: Json
          published_at: string | null
          recommendations: Json | null
          report_period_end: string
          report_period_start: string
          report_title: string
          report_type: string
          reviewed_by: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          charts_data?: Json | null
          created_at?: string
          created_by: string
          executive_summary: string
          id?: string
          key_metrics?: Json
          published_at?: string | null
          recommendations?: Json | null
          report_period_end: string
          report_period_start: string
          report_title: string
          report_type: string
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          charts_data?: Json | null
          created_at?: string
          created_by?: string
          executive_summary?: string
          id?: string
          key_metrics?: Json
          published_at?: string | null
          recommendations?: Json | null
          report_period_end?: string
          report_period_start?: string
          report_title?: string
          report_type?: string
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "executive_reports_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "executive_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "executive_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      failover_configurations: {
        Row: {
          created_at: string
          failover_mode: string
          failover_triggers: Json
          health_check_config: Json
          id: string
          is_active: boolean | null
          notification_contacts: Json | null
          primary_region: string
          recovery_point_objective: number
          recovery_time_objective: number
          rollback_procedure: Json | null
          secondary_regions: Json
          service_name: string
          traffic_switching_method: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          failover_mode: string
          failover_triggers?: Json
          health_check_config: Json
          id?: string
          is_active?: boolean | null
          notification_contacts?: Json | null
          primary_region: string
          recovery_point_objective: number
          recovery_time_objective: number
          rollback_procedure?: Json | null
          secondary_regions?: Json
          service_name: string
          traffic_switching_method: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          failover_mode?: string
          failover_triggers?: Json
          health_check_config?: Json
          id?: string
          is_active?: boolean | null
          notification_contacts?: Json | null
          primary_region?: string
          recovery_point_objective?: number
          recovery_time_objective?: number
          rollback_procedure?: Json | null
          secondary_regions?: Json
          service_name?: string
          traffic_switching_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      failover_events: {
        Row: {
          affected_services: Json | null
          config_id: string
          downtime_seconds: number | null
          end_time: string | null
          event_type: string
          id: string
          impact_assessment: Json | null
          initiated_by: string | null
          initiated_by_user: string | null
          lessons_learned: string | null
          post_mortem_url: string | null
          source_region: string
          start_time: string
          status: string
          target_region: string
          trigger_reason: string
        }
        Insert: {
          affected_services?: Json | null
          config_id: string
          downtime_seconds?: number | null
          end_time?: string | null
          event_type: string
          id?: string
          impact_assessment?: Json | null
          initiated_by?: string | null
          initiated_by_user?: string | null
          lessons_learned?: string | null
          post_mortem_url?: string | null
          source_region: string
          start_time?: string
          status?: string
          target_region: string
          trigger_reason: string
        }
        Update: {
          affected_services?: Json | null
          config_id?: string
          downtime_seconds?: number | null
          end_time?: string | null
          event_type?: string
          id?: string
          impact_assessment?: Json | null
          initiated_by?: string | null
          initiated_by_user?: string | null
          lessons_learned?: string | null
          post_mortem_url?: string | null
          source_region?: string
          start_time?: string
          status?: string
          target_region?: string
          trigger_reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "failover_events_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "failover_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      festival_configurations: {
        Row: {
          banner_config: Json | null
          created_at: string | null
          cultural_elements: Json | null
          discount_config: Json | null
          end_date: string
          festival_name: string
          festival_name_bn: string
          id: string
          is_active: boolean | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          banner_config?: Json | null
          created_at?: string | null
          cultural_elements?: Json | null
          discount_config?: Json | null
          end_date: string
          festival_name: string
          festival_name_bn: string
          id?: string
          is_active?: boolean | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          banner_config?: Json | null
          created_at?: string | null
          cultural_elements?: Json | null
          discount_config?: Json | null
          end_date?: string
          festival_name?: string
          festival_name_bn?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      festival_optimizations: {
        Row: {
          created_at: string | null
          cultural_content_boost: boolean | null
          end_date: string
          festival_name: string
          festival_name_bn: string
          festival_type: string
          id: string
          is_active: boolean | null
          optimization_config: Json
          server_scaling_factor: number | null
          special_offers_enabled: boolean | null
          start_date: string
          traffic_multiplier: number | null
        }
        Insert: {
          created_at?: string | null
          cultural_content_boost?: boolean | null
          end_date: string
          festival_name: string
          festival_name_bn: string
          festival_type: string
          id?: string
          is_active?: boolean | null
          optimization_config: Json
          server_scaling_factor?: number | null
          special_offers_enabled?: boolean | null
          start_date: string
          traffic_multiplier?: number | null
        }
        Update: {
          created_at?: string | null
          cultural_content_boost?: boolean | null
          end_date?: string
          festival_name?: string
          festival_name_bn?: string
          festival_type?: string
          id?: string
          is_active?: boolean | null
          optimization_config?: Json
          server_scaling_factor?: number | null
          special_offers_enabled?: boolean | null
          start_date?: string
          traffic_multiplier?: number | null
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          bucket_name: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          metadata: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bucket_name: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bucket_name?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      financial_invoices: {
        Row: {
          created_at: string | null
          currency: string | null
          due_date: string
          id: string
          invoice_number: string
          invoice_type: string
          issue_date: string
          notes: string | null
          order_id: string | null
          paid_at: string | null
          payment_terms: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          vat_amount: number | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          due_date: string
          id?: string
          invoice_number: string
          invoice_type: string
          issue_date: string
          notes?: string | null
          order_id?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          vat_amount?: number | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_type?: string
          issue_date?: string
          notes?: string | null
          order_id?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          vat_amount?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_invoices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_periods: {
        Row: {
          closed_at: string | null
          created_at: string | null
          end_date: string
          fiscal_year: number
          id: string
          period_name: string
          start_date: string
          status: string | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          end_date: string
          fiscal_year: number
          id?: string
          period_name: string
          start_date: string
          status?: string | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          end_date?: string
          fiscal_year?: number
          id?: string
          period_name?: string
          start_date?: string
          status?: string | null
        }
        Relationships: []
      }
      financial_reconciliation: {
        Row: {
          created_at: string | null
          external_balance: number
          id: string
          reconciled_at: string | null
          reconciled_by: string | null
          reconciliation_notes: string | null
          reconciliation_type: string
          reference_date: string
          status: string | null
          supporting_documents: Json | null
          system_balance: number
          variance: number | null
        }
        Insert: {
          created_at?: string | null
          external_balance: number
          id?: string
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_notes?: string | null
          reconciliation_type: string
          reference_date: string
          status?: string | null
          supporting_documents?: Json | null
          system_balance: number
          variance?: number | null
        }
        Update: {
          created_at?: string | null
          external_balance?: number
          id?: string
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_notes?: string | null
          reconciliation_type?: string
          reference_date?: string
          status?: string | null
          supporting_documents?: Json | null
          system_balance?: number
          variance?: number | null
        }
        Relationships: []
      }
      flash_sale_products: {
        Row: {
          created_at: string | null
          flash_sale_id: string | null
          id: string
          original_price: number
          product_id: string | null
          quantity_limit: number | null
          sale_price: number
          sold_quantity: number | null
        }
        Insert: {
          created_at?: string | null
          flash_sale_id?: string | null
          id?: string
          original_price: number
          product_id?: string | null
          quantity_limit?: number | null
          sale_price: number
          sold_quantity?: number | null
        }
        Update: {
          created_at?: string | null
          flash_sale_id?: string | null
          id?: string
          original_price?: number
          product_id?: string | null
          quantity_limit?: number | null
          sale_price?: number
          sold_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flash_sale_products_flash_sale_id_fkey"
            columns: ["flash_sale_id"]
            isOneToOne: false
            referencedRelation: "flash_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flash_sale_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_sales: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          end_time: string
          id: string
          max_discount_amount: number | null
          min_order_amount: number | null
          sold_quantity: number | null
          start_time: string
          status: string | null
          title: string
          total_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_time: string
          id?: string
          max_discount_amount?: number | null
          min_order_amount?: number | null
          sold_quantity?: number | null
          start_time: string
          status?: string | null
          title: string
          total_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_time?: string
          id?: string
          max_discount_amount?: number | null
          min_order_amount?: number | null
          sold_quantity?: number | null
          start_time?: string
          status?: string | null
          title?: string
          total_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          investigation_notes: string | null
          order_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          risk_factors: Json | null
          risk_score: number
          status: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          investigation_notes?: string | null
          order_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_factors?: Json | null
          risk_score: number
          status?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          investigation_notes?: string | null
          order_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_factors?: Json | null
          risk_score?: number
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fraud_detection_events: {
        Row: {
          bangladesh_specific_flags: Json
          behavioral_anomalies: Json
          created_at: string
          detection_model: string
          event_data: Json
          event_id: string
          event_type: string
          false_positive: boolean | null
          fraud_score: number
          id: string
          investigated_at: string | null
          investigated_by: string | null
          investigation_status: string
          mitigation_actions: Json
          resolution_notes: string | null
          risk_level: string
          triggered_rules: Json
          user_id: string | null
        }
        Insert: {
          bangladesh_specific_flags?: Json
          behavioral_anomalies?: Json
          created_at?: string
          detection_model: string
          event_data?: Json
          event_id: string
          event_type: string
          false_positive?: boolean | null
          fraud_score?: number
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          investigation_status?: string
          mitigation_actions?: Json
          resolution_notes?: string | null
          risk_level?: string
          triggered_rules?: Json
          user_id?: string | null
        }
        Update: {
          bangladesh_specific_flags?: Json
          behavioral_anomalies?: Json
          created_at?: string
          detection_model?: string
          event_data?: Json
          event_id?: string
          event_type?: string
          false_positive?: boolean | null
          fraud_score?: number
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          investigation_status?: string
          mitigation_actions?: Json
          resolution_notes?: string | null
          risk_level?: string
          triggered_rules?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      fraud_detection_logs: {
        Row: {
          approved: boolean
          created_at: string | null
          id: string
          order_id: string
          risk_factors: Json | null
          risk_level: string
          risk_score: number
          vendor_id: string
        }
        Insert: {
          approved: boolean
          created_at?: string | null
          id?: string
          order_id: string
          risk_factors?: Json | null
          risk_level: string
          risk_score: number
          vendor_id: string
        }
        Update: {
          approved?: boolean
          created_at?: string | null
          id?: string
          order_id?: string
          risk_factors?: Json | null
          risk_level?: string
          risk_score?: number
          vendor_id?: string
        }
        Relationships: []
      }
      fraud_detection_models: {
        Row: {
          accuracy_score: number
          algorithm_config: Json
          bangladesh_specific_rules: Json
          created_at: string
          false_negative_rate: number
          false_positive_rate: number
          feature_weights: Json
          fraud_patterns: Json
          id: string
          is_active: boolean
          last_trained: string
          model_name: string
          model_type: string
          model_version: string
          performance_metrics: Json
          threshold_config: Json
          training_data_stats: Json
          updated_at: string
        }
        Insert: {
          accuracy_score?: number
          algorithm_config?: Json
          bangladesh_specific_rules?: Json
          created_at?: string
          false_negative_rate?: number
          false_positive_rate?: number
          feature_weights?: Json
          fraud_patterns?: Json
          id?: string
          is_active?: boolean
          last_trained?: string
          model_name: string
          model_type: string
          model_version?: string
          performance_metrics?: Json
          threshold_config?: Json
          training_data_stats?: Json
          updated_at?: string
        }
        Update: {
          accuracy_score?: number
          algorithm_config?: Json
          bangladesh_specific_rules?: Json
          created_at?: string
          false_negative_rate?: number
          false_positive_rate?: number
          feature_weights?: Json
          fraud_patterns?: Json
          id?: string
          is_active?: boolean
          last_trained?: string
          model_name?: string
          model_type?: string
          model_version?: string
          performance_metrics?: Json
          threshold_config?: Json
          training_data_stats?: Json
          updated_at?: string
        }
        Relationships: []
      }
      fraud_detection_rules: {
        Row: {
          action_threshold: number | null
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          risk_score_weight: number | null
          rule_conditions: Json
          rule_name: string
          rule_type: string
          updated_at: string | null
        }
        Insert: {
          action_threshold?: number | null
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          risk_score_weight?: number | null
          rule_conditions?: Json
          rule_name: string
          rule_type: string
          updated_at?: string | null
        }
        Update: {
          action_threshold?: number | null
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          risk_score_weight?: number | null
          rule_conditions?: Json
          rule_name?: string
          rule_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fulfillment_centers: {
        Row: {
          address: Json
          capabilities: Json | null
          capacity: number
          contact_info: Json | null
          created_at: string
          current_utilization: number
          id: string
          name: string
          operational_hours: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          address: Json
          capabilities?: Json | null
          capacity?: number
          contact_info?: Json | null
          created_at?: string
          current_utilization?: number
          id?: string
          name: string
          operational_hours?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: Json
          capabilities?: Json | null
          capacity?: number
          contact_info?: Json | null
          created_at?: string
          current_utilization?: number
          id?: string
          name?: string
          operational_hours?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      fulfillment_workflow_steps: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          instructions: string | null
          order_fulfillment_id: string
          result_data: Json | null
          started_at: string | null
          status: string
          step_name: string
          step_order: number
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          order_fulfillment_id: string
          result_data?: Json | null
          started_at?: string | null
          status?: string
          step_name: string
          step_order: number
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          order_fulfillment_id?: string
          result_data?: Json | null
          started_at?: string | null
          status?: string
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fulfillment_workflow_steps_order_fulfillment_id_fkey"
            columns: ["order_fulfillment_id"]
            isOneToOne: false
            referencedRelation: "order_fulfillment"
            referencedColumns: ["id"]
          },
        ]
      }
      general_ledger: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string | null
          credit_amount: number | null
          debit_amount: number | null
          description: string | null
          id: string
          reference_number: string | null
          source_document: string | null
          transaction_date: string
          transaction_id: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by?: string | null
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          reference_number?: string | null
          source_document?: string | null
          transaction_date: string
          transaction_id: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string | null
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          reference_number?: string | null
          source_document?: string | null
          transaction_date?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "general_ledger_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          expires_at: string | null
          file_path: string | null
          generated_at: string
          id: string
          report_data: Json
          report_name: string
          status: string
          template_id: string | null
          vendor_id: string
        }
        Insert: {
          expires_at?: string | null
          file_path?: string | null
          generated_at?: string
          id?: string
          report_data: Json
          report_name: string
          status?: string
          template_id?: string | null
          vendor_id: string
        }
        Update: {
          expires_at?: string | null
          file_path?: string | null
          generated_at?: string
          id?: string
          report_data?: Json
          report_name?: string
          status?: string
          template_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "vendor_report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_regions: {
        Row: {
          continent: string
          country_code: string
          created_at: string | null
          currency_code: string
          id: string
          is_active: boolean | null
          primary_language: string | null
          region_code: string
          region_name: string
          regulatory_requirements: Json
          shipping_zones: Json
          supported_languages: Json
          tax_configuration: Json
          timezone: string
        }
        Insert: {
          continent: string
          country_code: string
          created_at?: string | null
          currency_code?: string
          id?: string
          is_active?: boolean | null
          primary_language?: string | null
          region_code: string
          region_name: string
          regulatory_requirements?: Json
          shipping_zones?: Json
          supported_languages?: Json
          tax_configuration?: Json
          timezone: string
        }
        Update: {
          continent?: string
          country_code?: string
          created_at?: string | null
          currency_code?: string
          id?: string
          is_active?: boolean | null
          primary_language?: string | null
          region_code?: string
          region_name?: string
          regulatory_requirements?: Json
          shipping_zones?: Json
          supported_languages?: Json
          tax_configuration?: Json
          timezone?: string
        }
        Relationships: []
      }
      geographic_routing_rules: {
        Row: {
          bangladesh_specific: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          routing_criteria: Json
          rule_name: string
          source_region: string
          target_edge_node_id: string | null
        }
        Insert: {
          bangladesh_specific?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          routing_criteria: Json
          rule_name: string
          source_region: string
          target_edge_node_id?: string | null
        }
        Update: {
          bangladesh_specific?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          routing_criteria?: Json
          rule_name?: string
          source_region?: string
          target_edge_node_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "geographic_routing_rules_target_edge_node_id_fkey"
            columns: ["target_edge_node_id"]
            isOneToOne: false
            referencedRelation: "edge_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      graphql_federation_metrics: {
        Row: {
          cache_hit: boolean | null
          created_at: string | null
          error_count: number | null
          execution_time_ms: number
          id: string
          operation_type: string
          query_complexity: number | null
          service_name: string
        }
        Insert: {
          cache_hit?: boolean | null
          created_at?: string | null
          error_count?: number | null
          execution_time_ms: number
          id?: string
          operation_type: string
          query_complexity?: number | null
          service_name: string
        }
        Update: {
          cache_hit?: boolean | null
          created_at?: string | null
          error_count?: number | null
          execution_time_ms?: number
          id?: string
          operation_type?: string
          query_complexity?: number | null
          service_name?: string
        }
        Relationships: []
      }
      graphql_query_cache: {
        Row: {
          access_count: number | null
          cached_result: Json
          created_at: string | null
          expires_at: string
          id: string
          query_hash: string
          query_text: string
          ttl_seconds: number | null
        }
        Insert: {
          access_count?: number | null
          cached_result: Json
          created_at?: string | null
          expires_at: string
          id?: string
          query_hash: string
          query_text: string
          ttl_seconds?: number | null
        }
        Update: {
          access_count?: number | null
          cached_result?: Json
          created_at?: string | null
          expires_at?: string
          id?: string
          query_hash?: string
          query_text?: string
          ttl_seconds?: number | null
        }
        Relationships: []
      }
      graphql_schemas: {
        Row: {
          created_at: string | null
          federation_config: Json | null
          id: string
          is_active: boolean | null
          schema_definition: string
          service_name: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          federation_config?: Json | null
          id?: string
          is_active?: boolean | null
          schema_definition: string
          service_name: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          created_at?: string | null
          federation_config?: Json | null
          id?: string
          is_active?: boolean | null
          schema_definition?: string
          service_name?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      growth_opportunity_mapping: {
        Row: {
          category_id: string | null
          competitive_intensity: number | null
          created_at: string | null
          entry_barriers: Json | null
          expected_roi: number | null
          growth_potential: number
          id: string
          investment_required: number | null
          market_size: number | null
          opportunity_name: string
          opportunity_type: string
          risk_assessment: Json | null
          status: string | null
          success_probability: number | null
          timeline_to_market: string | null
          vendor_id: string | null
        }
        Insert: {
          category_id?: string | null
          competitive_intensity?: number | null
          created_at?: string | null
          entry_barriers?: Json | null
          expected_roi?: number | null
          growth_potential: number
          id?: string
          investment_required?: number | null
          market_size?: number | null
          opportunity_name: string
          opportunity_type: string
          risk_assessment?: Json | null
          status?: string | null
          success_probability?: number | null
          timeline_to_market?: string | null
          vendor_id?: string | null
        }
        Update: {
          category_id?: string | null
          competitive_intensity?: number | null
          created_at?: string | null
          entry_barriers?: Json | null
          expected_roi?: number | null
          growth_potential?: number
          id?: string
          investment_required?: number | null
          market_size?: number | null
          opportunity_name?: string
          opportunity_type?: string
          risk_assessment?: Json | null
          status?: string | null
          success_probability?: number | null
          timeline_to_market?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_opportunity_mapping_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_opportunity_mapping_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      grpc_health_checks: {
        Row: {
          checked_at: string | null
          error_message: string | null
          id: string
          response_time_ms: number
          service_id: string | null
          status: string
        }
        Insert: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          response_time_ms: number
          service_id?: string | null
          status: string
        }
        Update: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          response_time_ms?: number
          service_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "grpc_health_checks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "grpc_services"
            referencedColumns: ["id"]
          },
        ]
      }
      grpc_load_balancing_metrics: {
        Row: {
          avg_response_time_ms: number | null
          created_at: string | null
          current_load_score: number | null
          endpoint_url: string
          id: string
          request_count: number | null
          service_id: string | null
          success_rate: number | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          created_at?: string | null
          current_load_score?: number | null
          endpoint_url: string
          id?: string
          request_count?: number | null
          service_id?: string | null
          success_rate?: number | null
        }
        Update: {
          avg_response_time_ms?: number | null
          created_at?: string | null
          current_load_score?: number | null
          endpoint_url?: string
          id?: string
          request_count?: number | null
          service_id?: string | null
          success_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grpc_load_balancing_metrics_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "grpc_services"
            referencedColumns: ["id"]
          },
        ]
      }
      grpc_services: {
        Row: {
          created_at: string | null
          endpoint_url: string
          health_check_config: Json | null
          id: string
          is_active: boolean | null
          load_balancing_config: Json | null
          proto_definition: string
          service_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint_url: string
          health_check_config?: Json | null
          id?: string
          is_active?: boolean | null
          load_balancing_config?: Json | null
          proto_definition: string
          service_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint_url?: string
          health_check_config?: Json | null
          id?: string
          is_active?: boolean | null
          load_balancing_config?: Json | null
          proto_definition?: string
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      health_checks: {
        Row: {
          checks_data: Json | null
          created_at: string
          id: string
          response_time: number
          status: string
        }
        Insert: {
          checks_data?: Json | null
          created_at?: string
          id?: string
          response_time: number
          status: string
        }
        Update: {
          checks_data?: Json | null
          created_at?: string
          id?: string
          response_time?: number
          status?: string
        }
        Relationships: []
      }
      in_app_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      incentive_programs: {
        Row: {
          budget_allocation: number | null
          created_at: string | null
          created_by: string
          description: string | null
          eligibility_criteria: Json
          end_date: string | null
          id: string
          is_active: boolean | null
          participation_count: number | null
          program_name: string
          program_type: string
          reward_structure: Json
          start_date: string
          target_metrics: Json | null
          total_rewards_paid: number | null
          updated_at: string | null
        }
        Insert: {
          budget_allocation?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          eligibility_criteria?: Json
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          participation_count?: number | null
          program_name: string
          program_type: string
          reward_structure?: Json
          start_date: string
          target_metrics?: Json | null
          total_rewards_paid?: number | null
          updated_at?: string | null
        }
        Update: {
          budget_allocation?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          eligibility_criteria?: Json
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          participation_count?: number | null
          program_name?: string
          program_type?: string
          reward_structure?: Json
          start_date?: string
          target_metrics?: Json | null
          total_rewards_paid?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      incident_records: {
        Row: {
          action_items: Json | null
          affected_services: Json | null
          assigned_team: Json | null
          category: string
          closed_at: string | null
          communication_log: Json | null
          created_at: string
          customer_impact: string | null
          description: string
          id: string
          incident_commander: string | null
          incident_id: string
          lessons_learned: Json | null
          metrics: Json | null
          post_mortem_url: string | null
          resolution_summary: string | null
          resolved_at: string | null
          root_cause: string | null
          severity: string
          status: string
          timeline: Json | null
          title: string
        }
        Insert: {
          action_items?: Json | null
          affected_services?: Json | null
          assigned_team?: Json | null
          category: string
          closed_at?: string | null
          communication_log?: Json | null
          created_at?: string
          customer_impact?: string | null
          description: string
          id?: string
          incident_commander?: string | null
          incident_id: string
          lessons_learned?: Json | null
          metrics?: Json | null
          post_mortem_url?: string | null
          resolution_summary?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          severity: string
          status?: string
          timeline?: Json | null
          title: string
        }
        Update: {
          action_items?: Json | null
          affected_services?: Json | null
          assigned_team?: Json | null
          category?: string
          closed_at?: string | null
          communication_log?: Json | null
          created_at?: string
          customer_impact?: string | null
          description?: string
          id?: string
          incident_commander?: string | null
          incident_id?: string
          lessons_learned?: Json | null
          metrics?: Json | null
          post_mortem_url?: string | null
          resolution_summary?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          severity?: string
          status?: string
          timeline?: Json | null
          title?: string
        }
        Relationships: []
      }
      incident_response_plans: {
        Row: {
          communication_templates: Json | null
          created_at: string
          created_by: string | null
          escalation_matrix: Json
          external_contacts: Json | null
          id: string
          incident_category: string
          is_active: boolean | null
          plan_name: string
          required_roles: Json | null
          response_procedures: Json
          runbook_links: Json | null
          severity_levels: Json
          sla_targets: Json | null
          updated_at: string
          version: string | null
        }
        Insert: {
          communication_templates?: Json | null
          created_at?: string
          created_by?: string | null
          escalation_matrix: Json
          external_contacts?: Json | null
          id?: string
          incident_category: string
          is_active?: boolean | null
          plan_name: string
          required_roles?: Json | null
          response_procedures: Json
          runbook_links?: Json | null
          severity_levels?: Json
          sla_targets?: Json | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          communication_templates?: Json | null
          created_at?: string
          created_by?: string | null
          escalation_matrix?: Json
          external_contacts?: Json | null
          id?: string
          incident_category?: string
          is_active?: boolean | null
          plan_name?: string
          required_roles?: Json | null
          response_procedures?: Json
          runbook_links?: Json | null
          severity_levels?: Json
          sla_targets?: Json | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      income_tax_records: {
        Row: {
          advance_tax_paid: number | null
          created_at: string | null
          due_date: string
          filing_status: string | null
          final_tax_liability: number
          gross_income: number
          id: string
          tax_amount: number
          tax_rate: number
          tax_year: number
          taxable_income: number
          vendor_id: string
          withholding_tax: number | null
        }
        Insert: {
          advance_tax_paid?: number | null
          created_at?: string | null
          due_date: string
          filing_status?: string | null
          final_tax_liability: number
          gross_income: number
          id?: string
          tax_amount: number
          tax_rate: number
          tax_year: number
          taxable_income: number
          vendor_id: string
          withholding_tax?: number | null
        }
        Update: {
          advance_tax_paid?: number | null
          created_at?: string | null
          due_date?: string
          filing_status?: string | null
          final_tax_liability?: number
          gross_income?: number
          id?: string
          tax_amount?: number
          tax_rate?: number
          tax_year?: number
          taxable_income?: number
          vendor_id?: string
          withholding_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "income_tax_records_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      infrastructure_deployments: {
        Row: {
          configuration: Json
          created_at: string | null
          deployed_at: string | null
          deployed_by: string | null
          deployment_logs: Json | null
          deployment_name: string
          deployment_status: string
          environment: string
          health_status: string | null
          id: string
          infrastructure_type: string
          resource_utilization: Json | null
          rollback_version: string | null
          updated_at: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_logs?: Json | null
          deployment_name: string
          deployment_status?: string
          environment: string
          health_status?: string | null
          id?: string
          infrastructure_type: string
          resource_utilization?: Json | null
          rollback_version?: string | null
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_logs?: Json | null
          deployment_name?: string
          deployment_status?: string
          environment?: string
          health_status?: string | null
          id?: string
          infrastructure_type?: string
          resource_utilization?: Json | null
          rollback_version?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      installment_payment_plans: {
        Row: {
          created_at: string | null
          customer_id: string
          down_payment: number | null
          id: string
          installment_amount: number
          installment_count: number
          interest_rate: number | null
          mobile_money_wallet_id: string | null
          next_payment_date: string
          order_id: string
          payment_frequency: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          down_payment?: number | null
          id?: string
          installment_amount: number
          installment_count: number
          interest_rate?: number | null
          mobile_money_wallet_id?: string | null
          next_payment_date: string
          order_id: string
          payment_frequency?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          down_payment?: number | null
          id?: string
          installment_amount?: number
          installment_count?: number
          interest_rate?: number | null
          mobile_money_wallet_id?: string | null
          next_payment_date?: string
          order_id?: string
          payment_frequency?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installment_payment_plans_mobile_money_wallet_id_fkey"
            columns: ["mobile_money_wallet_id"]
            isOneToOne: false
            referencedRelation: "mobile_money_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_plans: {
        Row: {
          created_at: string | null
          duration_months: number
          eligibility_criteria: Json | null
          id: string
          interest_rate: number | null
          is_active: boolean | null
          maximum_amount: number | null
          minimum_amount: number
          partner_bank: string | null
          plan_name: string
          plan_name_bn: string
          processing_fee: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_months: number
          eligibility_criteria?: Json | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean | null
          maximum_amount?: number | null
          minimum_amount: number
          partner_bank?: string | null
          plan_name: string
          plan_name_bn: string
          processing_fee?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_months?: number
          eligibility_criteria?: Json | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean | null
          maximum_amount?: number | null
          minimum_amount?: number
          partner_bank?: string | null
          plan_name?: string
          plan_name_bn?: string
          processing_fee?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      intelligent_cache_analytics: {
        Row: {
          access_frequency: number
          ai_optimization_applied: boolean
          cache_key: string
          cache_strategy: string
          cost_effectiveness: number
          created_at: string
          data_size_bytes: number
          geographic_affinity: Json
          hit_rate: number
          id: string
          last_accessed: string
          ttl_seconds: number
          user_segment_affinity: Json
        }
        Insert: {
          access_frequency?: number
          ai_optimization_applied?: boolean
          cache_key: string
          cache_strategy: string
          cost_effectiveness?: number
          created_at?: string
          data_size_bytes?: number
          geographic_affinity?: Json
          hit_rate?: number
          id?: string
          last_accessed?: string
          ttl_seconds?: number
          user_segment_affinity?: Json
        }
        Update: {
          access_frequency?: number
          ai_optimization_applied?: boolean
          cache_key?: string
          cache_strategy?: string
          cost_effectiveness?: number
          created_at?: string
          data_size_bytes?: number
          geographic_affinity?: Json
          hit_rate?: number
          id?: string
          last_accessed?: string
          ttl_seconds?: number
          user_segment_affinity?: Json
        }
        Relationships: []
      }
      intelligent_cache_entries: {
        Row: {
          access_frequency: number | null
          cache_key: string
          cache_type: string
          cache_value: Json
          created_at: string | null
          expires_at: string
          geographic_region: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          prediction_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_frequency?: number | null
          cache_key: string
          cache_type: string
          cache_value: Json
          created_at?: string | null
          expires_at: string
          geographic_region?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          prediction_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_frequency?: number | null
          cache_key?: string
          cache_type?: string
          cache_value?: Json
          created_at?: string | null
          expires_at?: string
          geographic_region?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          prediction_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          available_stock: number | null
          batch_number: string | null
          cost_per_unit: number
          created_at: string
          current_stock: number
          expiry_date: string | null
          forecast_demand: Json | null
          fulfillment_center_id: string | null
          id: string
          last_restocked_at: string | null
          maximum_stock_level: number
          minimum_stock_level: number
          product_id: string
          reorder_point: number
          reorder_quantity: number
          reserved_stock: number
          sku: string
          storage_location: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          available_stock?: number | null
          batch_number?: string | null
          cost_per_unit?: number
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          forecast_demand?: Json | null
          fulfillment_center_id?: string | null
          id?: string
          last_restocked_at?: string | null
          maximum_stock_level?: number
          minimum_stock_level?: number
          product_id: string
          reorder_point?: number
          reorder_quantity?: number
          reserved_stock?: number
          sku: string
          storage_location?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          available_stock?: number | null
          batch_number?: string | null
          cost_per_unit?: number
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          forecast_demand?: Json | null
          fulfillment_center_id?: string | null
          id?: string
          last_restocked_at?: string | null
          maximum_stock_level?: number
          minimum_stock_level?: number
          product_id?: string
          reorder_point?: number
          reorder_quantity?: number
          reserved_stock?: number
          sku?: string
          storage_location?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_fulfillment_center_id_fkey"
            columns: ["fulfillment_center_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          current_value: number | null
          id: string
          is_resolved: boolean | null
          message: string
          product_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          threshold_value: number | null
          vendor_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_resolved?: boolean | null
          message: string
          product_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          threshold_value?: number | null
          vendor_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_resolved?: boolean | null
          message?: string
          product_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          threshold_value?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_forecasting: {
        Row: {
          algorithm_version: string | null
          confidence_score: number | null
          created_at: string
          factors_considered: Json | null
          forecast_date: string
          forecast_period: string
          id: string
          predicted_demand: number
          product_id: string
          vendor_id: string
        }
        Insert: {
          algorithm_version?: string | null
          confidence_score?: number | null
          created_at?: string
          factors_considered?: Json | null
          forecast_date: string
          forecast_period: string
          id?: string
          predicted_demand: number
          product_id: string
          vendor_id: string
        }
        Update: {
          algorithm_version?: string | null
          confidence_score?: number | null
          created_at?: string
          factors_considered?: Json | null
          forecast_date?: string
          forecast_period?: string
          id?: string
          predicted_demand?: number
          product_id?: string
          vendor_id?: string
        }
        Relationships: []
      }
      inventory_forecasts: {
        Row: {
          created_at: string | null
          forecast_date: string
          id: string
          lead_time_forecast: number | null
          optimal_stock_level: number | null
          predicted_stock_level: number
          product_id: string
          reorder_recommendation: number | null
          seasonal_adjustment: number | null
          stockout_probability: number | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          forecast_date: string
          id?: string
          lead_time_forecast?: number | null
          optimal_stock_level?: number | null
          predicted_stock_level: number
          product_id: string
          reorder_recommendation?: number | null
          seasonal_adjustment?: number | null
          stockout_probability?: number | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          forecast_date?: string
          id?: string
          lead_time_forecast?: number | null
          optimal_stock_level?: number | null
          predicted_stock_level?: number
          product_id?: string
          reorder_recommendation?: number | null
          seasonal_adjustment?: number | null
          stockout_probability?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_forecasts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_forecasts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          cost_per_unit: number | null
          created_at: string
          id: string
          inventory_id: string
          movement_type: string
          performed_by: string | null
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          total_cost: number | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          inventory_id: string
          movement_type: string
          performed_by?: string | null
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          inventory_id?: string
          movement_type?: string
          performed_by?: string | null
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_predictions: {
        Row: {
          confidence_score: number
          created_at: string | null
          external_factors: Json | null
          id: string
          lead_time_days: number
          predicted_demand: number
          prediction_horizon: number
          prediction_model: string
          product_id: string
          recommended_stock_level: number
          reorder_point: number
          seasonality_factor: number | null
          trend_factor: number | null
          valid_until: string
          vendor_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          external_factors?: Json | null
          id?: string
          lead_time_days: number
          predicted_demand: number
          prediction_horizon: number
          prediction_model: string
          product_id: string
          recommended_stock_level: number
          reorder_point: number
          seasonality_factor?: number | null
          trend_factor?: number | null
          valid_until: string
          vendor_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          external_factors?: Json | null
          id?: string
          lead_time_days?: number
          predicted_demand?: number
          prediction_horizon?: number
          prediction_model?: string
          product_id?: string
          recommended_stock_level?: number
          reorder_point?: number
          seasonality_factor?: number | null
          trend_factor?: number | null
          valid_until?: string
          vendor_id?: string
        }
        Relationships: []
      }
      kubernetes_clusters: {
        Row: {
          auto_scaling_enabled: boolean | null
          backup_enabled: boolean | null
          cluster_config: Json
          cluster_endpoint: string | null
          cluster_name: string
          cluster_status: string
          cluster_version: string | null
          created_at: string | null
          environment: string
          id: string
          kubeconfig_encrypted: string | null
          monitoring_enabled: boolean | null
          node_pools: Json
          provider: string
          region: string
          updated_at: string | null
        }
        Insert: {
          auto_scaling_enabled?: boolean | null
          backup_enabled?: boolean | null
          cluster_config?: Json
          cluster_endpoint?: string | null
          cluster_name: string
          cluster_status?: string
          cluster_version?: string | null
          created_at?: string | null
          environment: string
          id?: string
          kubeconfig_encrypted?: string | null
          monitoring_enabled?: boolean | null
          node_pools?: Json
          provider: string
          region: string
          updated_at?: string | null
        }
        Update: {
          auto_scaling_enabled?: boolean | null
          backup_enabled?: boolean | null
          cluster_config?: Json
          cluster_endpoint?: string | null
          cluster_name?: string
          cluster_status?: string
          cluster_version?: string | null
          created_at?: string | null
          environment?: string
          id?: string
          kubeconfig_encrypted?: string | null
          monitoring_enabled?: boolean | null
          node_pools?: Json
          provider?: string
          region?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kubernetes_deployments: {
        Row: {
          auto_scaling_config: Json | null
          config_maps: string[] | null
          cpu_limit: string | null
          cpu_request: string | null
          created_at: string | null
          deployed_at: string | null
          deployed_by: string | null
          deployment_type: string
          environment_variables: Json | null
          health_check_config: Json | null
          id: string
          image_name: string
          image_tag: string
          memory_limit: string | null
          memory_request: string | null
          name: string
          namespace: string
          network_policies: string[] | null
          replicas: number
          secrets: string[] | null
          service_mesh_config: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_scaling_config?: Json | null
          config_maps?: string[] | null
          cpu_limit?: string | null
          cpu_request?: string | null
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_type: string
          environment_variables?: Json | null
          health_check_config?: Json | null
          id?: string
          image_name: string
          image_tag: string
          memory_limit?: string | null
          memory_request?: string | null
          name: string
          namespace: string
          network_policies?: string[] | null
          replicas?: number
          secrets?: string[] | null
          service_mesh_config?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_scaling_config?: Json | null
          config_maps?: string[] | null
          cpu_limit?: string | null
          cpu_request?: string | null
          created_at?: string | null
          deployed_at?: string | null
          deployed_by?: string | null
          deployment_type?: string
          environment_variables?: Json | null
          health_check_config?: Json | null
          id?: string
          image_name?: string
          image_tag?: string
          memory_limit?: string | null
          memory_request?: string | null
          name?: string
          namespace?: string
          network_policies?: string[] | null
          replicas?: number
          secrets?: string[] | null
          service_mesh_config?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          document_back_url: string | null
          document_front_url: string | null
          document_number: string
          document_type: string
          expiry_date: string | null
          id: string
          rejection_reason: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_back_url?: string | null
          document_front_url?: string | null
          document_number: string
          document_type: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_back_url?: string | null
          document_front_url?: string | null
          document_number?: string
          document_type?: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      live_inventory_events: {
        Row: {
          created_at: string | null
          difference: number | null
          event_type: string
          id: string
          metadata: Json | null
          new_quantity: number
          old_quantity: number | null
          product_id: string | null
          reason: string | null
          source: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          difference?: number | null
          event_type: string
          id?: string
          metadata?: Json | null
          new_quantity: number
          old_quantity?: number | null
          product_id?: string | null
          reason?: string | null
          source?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          difference?: number | null
          event_type?: string
          id?: string
          metadata?: Json | null
          new_quantity?: number
          old_quantity?: number | null
          product_id?: string | null
          reason?: string | null
          source?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_inventory_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      live_order_tracking: {
        Row: {
          carrier: string | null
          coordinates: Json | null
          created_at: string | null
          current_location: string | null
          delivery_attempts: number | null
          estimated_delivery: string | null
          id: string
          is_active: boolean | null
          last_update: string | null
          order_id: string
          status: string
          status_description: string | null
          tracking_events: Json | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          carrier?: string | null
          coordinates?: Json | null
          created_at?: string | null
          current_location?: string | null
          delivery_attempts?: number | null
          estimated_delivery?: string | null
          id?: string
          is_active?: boolean | null
          last_update?: string | null
          order_id: string
          status: string
          status_description?: string | null
          tracking_events?: Json | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          carrier?: string | null
          coordinates?: Json | null
          created_at?: string | null
          current_location?: string | null
          delivery_attempts?: number | null
          estimated_delivery?: string | null
          id?: string
          is_active?: boolean | null
          last_update?: string | null
          order_id?: string
          status?: string
          status_description?: string | null
          tracking_events?: Json | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      live_product_views: {
        Row: {
          current_viewers: number | null
          id: string
          last_updated: string | null
          peak_concurrent_viewers: number | null
          product_id: string | null
          total_views_today: number | null
          total_views_week: number | null
        }
        Insert: {
          current_viewers?: number | null
          id?: string
          last_updated?: string | null
          peak_concurrent_viewers?: number | null
          product_id?: string | null
          total_views_today?: number | null
          total_views_week?: number | null
        }
        Update: {
          current_viewers?: number | null
          id?: string
          last_updated?: string | null
          peak_concurrent_viewers?: number | null
          product_id?: string | null
          total_views_today?: number | null
          total_views_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sales_metrics: {
        Row: {
          id: string
          metric_data: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          time_period: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          time_period?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          time_period?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      live_shopping_interactions: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_shopping_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_shopping_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          analytics_data: Json | null
          chat_room_id: string | null
          created_at: string | null
          description: string | null
          featured_products: Json | null
          host_id: string | null
          id: string
          interaction_metrics: Json | null
          monetization_data: Json | null
          recording_url: string | null
          scheduled_end: string
          scheduled_start: string
          status: string | null
          stream_url: string | null
          title: string
          updated_at: string | null
          vendor_id: string
          viewer_count: number | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          analytics_data?: Json | null
          chat_room_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_products?: Json | null
          host_id?: string | null
          id?: string
          interaction_metrics?: Json | null
          monetization_data?: Json | null
          recording_url?: string | null
          scheduled_end: string
          scheduled_start: string
          status?: string | null
          stream_url?: string | null
          title: string
          updated_at?: string | null
          vendor_id: string
          viewer_count?: number | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          analytics_data?: Json | null
          chat_room_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_products?: Json | null
          host_id?: string | null
          id?: string
          interaction_metrics?: Json | null
          monetization_data?: Json | null
          recording_url?: string | null
          scheduled_end?: string
          scheduled_start?: string
          status?: string | null
          stream_url?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      loyalty_point_history: {
        Row: {
          balance_after: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          points_changed: number
          source_id: string | null
          source_type: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          balance_after: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          points_changed: number
          source_id?: string | null
          source_type?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          balance_after?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          points_changed?: number
          source_id?: string | null
          source_type?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_point_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          points: number
          program_id: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          points: number
          program_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          points?: number
          program_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_point_transactions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          point_rules: Json
          program_name: string
          program_name_bn: string
          redemption_rules: Json
          tier_levels: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          point_rules: Json
          program_name: string
          program_name_bn: string
          redemption_rules: Json
          tier_levels: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          point_rules?: Json
          program_name?: string
          program_name_bn?: string
          redemption_rules?: Json
          tier_levels?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_rewards_system: {
        Row: {
          anniversary_date: string | null
          available_points: number | null
          created_at: string | null
          id: string
          lifetime_spending: number | null
          loyalty_tier: string
          next_tier_requirements: Json | null
          points_history: Json | null
          special_offers: Json | null
          tier_benefits: Json | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          anniversary_date?: string | null
          available_points?: number | null
          created_at?: string | null
          id?: string
          lifetime_spending?: number | null
          loyalty_tier?: string
          next_tier_requirements?: Json | null
          points_history?: Json | null
          special_offers?: Json | null
          tier_benefits?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          anniversary_date?: string | null
          available_points?: number | null
          created_at?: string | null
          id?: string
          lifetime_spending?: number | null
          loyalty_tier?: string
          next_tier_requirements?: Json | null
          points_history?: Json | null
          special_offers?: Json | null
          tier_benefits?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_tiers: {
        Row: {
          benefits: Json | null
          color_code: string | null
          created_at: string | null
          icon_url: string | null
          id: string
          minimum_points: number
          name: string
          name_bn: string | null
          perks: Json | null
        }
        Insert: {
          benefits?: Json | null
          color_code?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          minimum_points: number
          name: string
          name_bn?: string | null
          perks?: Json | null
        }
        Update: {
          benefits?: Json | null
          color_code?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          minimum_points?: number
          name?: string
          name_bn?: string | null
          perks?: Json | null
        }
        Relationships: []
      }
      market_share_analysis: {
        Row: {
          analysis_date: string | null
          analysis_period: string
          category_id: string | null
          competitor_shares: Json | null
          growth_opportunities: Json | null
          id: string
          market_growth_rate: number | null
          market_position: number | null
          our_market_share: number
          share_growth_rate: number | null
          share_trend: Json | null
          total_market_size: number
          vendor_id: string | null
        }
        Insert: {
          analysis_date?: string | null
          analysis_period: string
          category_id?: string | null
          competitor_shares?: Json | null
          growth_opportunities?: Json | null
          id?: string
          market_growth_rate?: number | null
          market_position?: number | null
          our_market_share: number
          share_growth_rate?: number | null
          share_trend?: Json | null
          total_market_size: number
          vendor_id?: string | null
        }
        Update: {
          analysis_date?: string | null
          analysis_period?: string
          category_id?: string | null
          competitor_shares?: Json | null
          growth_opportunities?: Json | null
          id?: string
          market_growth_rate?: number | null
          market_position?: number | null
          our_market_share?: number
          share_growth_rate?: number | null
          share_trend?: Json | null
          total_market_size?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_share_analysis_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_share_analysis_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      market_trends: {
        Row: {
          category_id: string | null
          confidence_score: number | null
          detection_date: string | null
          id: string
          market_impact: string | null
          trend_data: Json
          trend_direction: string
          trend_name: string
          trend_period: string | null
          trend_strength: number | null
        }
        Insert: {
          category_id?: string | null
          confidence_score?: number | null
          detection_date?: string | null
          id?: string
          market_impact?: string | null
          trend_data?: Json
          trend_direction: string
          trend_name: string
          trend_period?: string | null
          trend_strength?: number | null
        }
        Update: {
          category_id?: string | null
          confidence_score?: number | null
          detection_date?: string | null
          id?: string
          market_impact?: string | null
          trend_data?: Json
          trend_direction?: string
          trend_name?: string
          trend_period?: string | null
          trend_strength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_trends_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_collection: {
        Row: {
          id: string
          instance_id: string | null
          labels: Json
          metric_name: string
          metric_type: string
          metric_value: number
          retention_period: unknown | null
          service_name: string
          timestamp: string
        }
        Insert: {
          id?: string
          instance_id?: string | null
          labels?: Json
          metric_name: string
          metric_type: string
          metric_value: number
          retention_period?: unknown | null
          service_name: string
          timestamp?: string
        }
        Update: {
          id?: string
          instance_id?: string | null
          labels?: Json
          metric_name?: string
          metric_type?: string
          metric_value?: number
          retention_period?: unknown | null
          service_name?: string
          timestamp?: string
        }
        Relationships: []
      }
      micro_payment_aggregations: {
        Row: {
          aggregation_period: string | null
          auto_process: boolean | null
          created_at: string | null
          id: string
          min_amount_threshold: number | null
          processed_at: string | null
          total_micro_amount: number | null
          transaction_count: number | null
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          aggregation_period?: string | null
          auto_process?: boolean | null
          created_at?: string | null
          id?: string
          min_amount_threshold?: number | null
          processed_at?: string | null
          total_micro_amount?: number | null
          transaction_count?: number | null
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          aggregation_period?: string | null
          auto_process?: boolean | null
          created_at?: string | null
          id?: string
          min_amount_threshold?: number | null
          processed_at?: string | null
          total_micro_amount?: number | null
          transaction_count?: number | null
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "micro_payment_aggregations_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "mobile_money_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      microservice_configs: {
        Row: {
          config_key: string
          config_type: string
          config_value: Json
          created_at: string
          created_by: string | null
          environment: string
          id: string
          is_encrypted: boolean
          is_sensitive: boolean
          service_name: string
          updated_at: string
          version: number
        }
        Insert: {
          config_key: string
          config_type: string
          config_value: Json
          created_at?: string
          created_by?: string | null
          environment: string
          id?: string
          is_encrypted?: boolean
          is_sensitive?: boolean
          service_name: string
          updated_at?: string
          version?: number
        }
        Update: {
          config_key?: string
          config_type?: string
          config_value?: Json
          created_at?: string
          created_by?: string | null
          environment?: string
          id?: string
          is_encrypted?: boolean
          is_sensitive?: boolean
          service_name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      microservices_registry: {
        Row: {
          configuration: Json
          created_at: string
          dependencies: Json
          endpoint_url: string
          health_check_url: string
          id: string
          last_health_check: string | null
          resource_limits: Json
          service_name: string
          service_type: string
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          dependencies?: Json
          endpoint_url: string
          health_check_url: string
          id?: string
          last_health_check?: string | null
          resource_limits?: Json
          service_name: string
          service_type: string
          status?: string
          updated_at?: string
          version?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          dependencies?: Json
          endpoint_url?: string
          health_check_url?: string
          id?: string
          last_health_check?: string | null
          resource_limits?: Json
          service_name?: string
          service_type?: string
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      ml_model_performance_tracking: {
        Row: {
          created_at: string | null
          deployment_status: string | null
          f1_score: number | null
          id: string
          last_evaluation: string | null
          model_name: string
          model_type: string
          performance_metrics: Json
          precision_score: number | null
          recall_score: number | null
          test_accuracy: number | null
          training_data_size: number | null
          validation_accuracy: number | null
          version: string
        }
        Insert: {
          created_at?: string | null
          deployment_status?: string | null
          f1_score?: number | null
          id?: string
          last_evaluation?: string | null
          model_name: string
          model_type: string
          performance_metrics?: Json
          precision_score?: number | null
          recall_score?: number | null
          test_accuracy?: number | null
          training_data_size?: number | null
          validation_accuracy?: number | null
          version: string
        }
        Update: {
          created_at?: string | null
          deployment_status?: string | null
          f1_score?: number | null
          id?: string
          last_evaluation?: string | null
          model_name?: string
          model_type?: string
          performance_metrics?: Json
          precision_score?: number | null
          recall_score?: number | null
          test_accuracy?: number | null
          training_data_size?: number | null
          validation_accuracy?: number | null
          version?: string
        }
        Relationships: []
      }
      ml_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          recommendation_type: string
          recommendations: Json
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendation_type: string
          recommendations?: Json
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendation_type?: string
          recommendations?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      mobile_app_analytics: {
        Row: {
          app_version: string | null
          crash_reports: Json | null
          created_at: string | null
          device_id: string | null
          id: string
          offline_usage: Json | null
          performance_metrics: Json | null
          platform: string
          push_notification_interactions: Json | null
          screen_views: Json | null
          session_duration: number | null
          user_actions: Json | null
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          crash_reports?: Json | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          offline_usage?: Json | null
          performance_metrics?: Json | null
          platform: string
          push_notification_interactions?: Json | null
          screen_views?: Json | null
          session_duration?: number | null
          user_actions?: Json | null
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          crash_reports?: Json | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          offline_usage?: Json | null
          performance_metrics?: Json | null
          platform?: string
          push_notification_interactions?: Json | null
          screen_views?: Json | null
          session_duration?: number | null
          user_actions?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      mobile_banking_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          gateway_name: string
          gateway_reference: string | null
          gateway_response: Json | null
          id: string
          mobile_number: string
          order_id: string | null
          processed_at: string | null
          status: string | null
          transaction_id: string
          transaction_type: string
          updated_at: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          gateway_name: string
          gateway_reference?: string | null
          gateway_response?: Json | null
          id?: string
          mobile_number: string
          order_id?: string | null
          processed_at?: string | null
          status?: string | null
          transaction_id: string
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          gateway_name?: string
          gateway_reference?: string | null
          gateway_response?: Json | null
          id?: string
          mobile_number?: string
          order_id?: string | null
          processed_at?: string | null
          status?: string | null
          transaction_id?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Relationships: []
      }
      mobile_money_wallets: {
        Row: {
          balance_cache: number | null
          created_at: string | null
          daily_limit: number | null
          id: string
          is_primary: boolean | null
          last_sync_at: string | null
          monthly_limit: number | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
          wallet_number: string
          wallet_provider: string
        }
        Insert: {
          balance_cache?: number | null
          created_at?: string | null
          daily_limit?: number | null
          id?: string
          is_primary?: boolean | null
          last_sync_at?: string | null
          monthly_limit?: number | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          wallet_number: string
          wallet_provider: string
        }
        Update: {
          balance_cache?: number | null
          created_at?: string | null
          daily_limit?: number | null
          id?: string
          is_primary?: boolean | null
          last_sync_at?: string | null
          monthly_limit?: number | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          wallet_number?: string
          wallet_provider?: string
        }
        Relationships: []
      }
      mobile_performance_metrics: {
        Row: {
          created_at: string
          device_type: string
          id: string
          network_type: string | null
          page_load_time: number | null
          page_url: string | null
          performance_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_type: string
          id?: string
          network_type?: string | null
          page_load_time?: number | null
          page_url?: string | null
          performance_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_type?: string
          id?: string
          network_type?: string | null
          page_load_time?: number | null
          page_url?: string | null
          performance_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_campaigns: {
        Row: {
          analytics: Json | null
          campaign_type: string
          channels: string[]
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          scheduled_at: string | null
          sending_options: Json | null
          start_date: string | null
          status: string | null
          target_audience: Json
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          analytics?: Json | null
          campaign_type: string
          channels?: string[]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          sending_options?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          analytics?: Json | null
          campaign_type?: string
          channels?: string[]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          sending_options?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_channels: {
        Row: {
          configuration: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          provider: string
          rate_limit_per_day: number | null
          rate_limit_per_hour: number | null
          rate_limit_per_minute: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          provider: string
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          provider?: string
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          campaign_id: string | null
          channel: string
          clicked_at: string | null
          content: string | null
          created_at: string | null
          delivered_at: string | null
          error_details: Json | null
          id: string
          metadata: Json | null
          notification_id: string | null
          opened_at: string | null
          provider_response: Json | null
          recipient: string
          sent_at: string | null
          status: string
          subject: string | null
          template_id: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          channel: string
          clicked_at?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_details?: Json | null
          id?: string
          metadata?: Json | null
          notification_id?: string | null
          opened_at?: string | null
          provider_response?: Json | null
          recipient: string
          sent_at?: string | null
          status: string
          subject?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          channel?: string
          clicked_at?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_details?: Json | null
          id?: string
          metadata?: Json | null
          notification_id?: string | null
          opened_at?: string | null
          provider_response?: Json | null
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "notification_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          created_at: string | null
          data: Json | null
          error_message: string | null
          external_id: string | null
          id: string
          recipient: string
          status: string
          template: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          recipient: string
          status: string
          template: string
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          recipient?: string
          status?: string
          template?: string
          type?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          chat_messages: boolean | null
          created_at: string | null
          email_enabled: boolean | null
          flash_sales: boolean | null
          id: string
          inventory_alerts: boolean | null
          marketing: boolean | null
          order_updates: boolean | null
          price_alerts: boolean | null
          push_enabled: boolean | null
          sms_enabled: boolean | null
          system_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
          vendor_updates: boolean | null
        }
        Insert: {
          chat_messages?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          flash_sales?: boolean | null
          id?: string
          inventory_alerts?: boolean | null
          marketing?: boolean | null
          order_updates?: boolean | null
          price_alerts?: boolean | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          system_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          vendor_updates?: boolean | null
        }
        Update: {
          chat_messages?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          flash_sales?: boolean | null
          id?: string
          inventory_alerts?: boolean | null
          marketing?: boolean | null
          order_updates?: boolean | null
          price_alerts?: boolean | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          system_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          vendor_updates?: boolean | null
        }
        Relationships: []
      }
      notification_queue: {
        Row: {
          channel: string
          content: string
          created_at: string | null
          error_message: string | null
          id: string
          priority: number | null
          recipient: string
          retry_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          user_id: string | null
          variables: Json | null
        }
        Insert: {
          channel: string
          content: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          priority?: number | null
          recipient: string
          retry_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          user_id?: string | null
          variables?: Json | null
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          priority?: number | null
          recipient?: string
          retry_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          user_id?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_service_channels: {
        Row: {
          channel_name: string
          channel_type: string
          configuration: Json
          created_at: string
          id: string
          is_active: boolean
          priority: number
          provider_name: string
          rate_limits: Json
          updated_at: string
        }
        Insert: {
          channel_name: string
          channel_type: string
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          provider_name: string
          rate_limits?: Json
          updated_at?: string
        }
        Update: {
          channel_name?: string
          channel_type?: string
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          provider_name?: string
          rate_limits?: Json
          updated_at?: string
        }
        Relationships: []
      }
      notification_service_templates: {
        Row: {
          channel_type: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          language: string
          subject: string | null
          template_name: string
          template_type: string
          updated_at: string
          variables: Json
        }
        Insert: {
          channel_type: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          subject?: string | null
          template_name: string
          template_type: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          channel_type?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          subject?: string | null
          template_name?: string
          template_type?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      notification_subscriptions: {
        Row: {
          auth_key: string | null
          created_at: string | null
          device_info: Json | null
          device_type: string | null
          endpoint: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          p256dh: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_key?: string | null
          created_at?: string | null
          device_info?: Json | null
          device_type?: string | null
          endpoint: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          p256dh?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_key?: string | null
          created_at?: string | null
          device_info?: Json | null
          device_type?: string | null
          endpoint?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          p256dh?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          channel_config: Json | null
          content_bn: string
          content_en: string
          created_at: string | null
          id: string
          is_active: boolean | null
          subject_bn: string | null
          subject_en: string | null
          template_name: string
          template_type: string
          trigger_event: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          channel_config?: Json | null
          content_bn: string
          content_en: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject_bn?: string | null
          subject_en?: string | null
          template_name: string
          template_type: string
          trigger_event: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          channel_config?: Json | null
          content_bn?: string
          content_en?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject_bn?: string | null
          subject_en?: string | null
          template_name?: string
          template_type?: string
          trigger_event?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      offline_sync_queue: {
        Row: {
          action_type: string
          attempts: number | null
          batch_id: string | null
          conflict_resolution: string | null
          created_at: string | null
          data: Json
          dependency_id: string | null
          error_message: string | null
          id: string
          max_attempts: number | null
          priority: number | null
          resource_id: string | null
          resource_type: string
          retry_strategy: Json | null
          sync_status: string | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          attempts?: number | null
          batch_id?: string | null
          conflict_resolution?: string | null
          created_at?: string | null
          data: Json
          dependency_id?: string | null
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          resource_id?: string | null
          resource_type: string
          retry_strategy?: Json | null
          sync_status?: string | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          attempts?: number | null
          batch_id?: string | null
          conflict_resolution?: string | null
          created_at?: string | null
          data?: Json
          dependency_id?: string | null
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          resource_id?: string | null
          resource_type?: string
          retry_strategy?: Json | null
          sync_status?: string | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offline_sync_queue_dependency_id_fkey"
            columns: ["dependency_id"]
            isOneToOne: false
            referencedRelation: "offline_sync_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      order_analytics: {
        Row: {
          analytics_date: string
          average_order_value: number | null
          cancelled_orders: number | null
          created_at: string
          failed_orders: number | null
          geographic_data: Json | null
          id: string
          order_categories: Json | null
          payment_methods: Json | null
          pending_orders: number | null
          successful_orders: number | null
          total_orders: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          analytics_date?: string
          average_order_value?: number | null
          cancelled_orders?: number | null
          created_at?: string
          failed_orders?: number | null
          geographic_data?: Json | null
          id?: string
          order_categories?: Json | null
          payment_methods?: Json | null
          pending_orders?: number | null
          successful_orders?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          analytics_date?: string
          average_order_value?: number | null
          cancelled_orders?: number | null
          created_at?: string
          failed_orders?: number | null
          geographic_data?: Json | null
          id?: string
          order_categories?: Json | null
          payment_methods?: Json | null
          pending_orders?: number | null
          successful_orders?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_analytics_cache: {
        Row: {
          analytics_type: string
          cache_key: string
          category_id: string | null
          created_at: string | null
          data: Json
          date_range: Json
          expires_at: string | null
          id: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          analytics_type: string
          cache_key: string
          category_id?: string | null
          created_at?: string | null
          data?: Json
          date_range?: Json
          expires_at?: string | null
          id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          analytics_type?: string
          cache_key?: string
          category_id?: string | null
          created_at?: string | null
          data?: Json
          date_range?: Json
          expires_at?: string | null
          id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      order_communications: {
        Row: {
          communication_type: string
          created_at: string | null
          delivery_status: string | null
          delivery_time: string | null
          id: string
          message_content: string
          metadata: Json | null
          order_id: string
          recipient_id: string
          recipient_type: string
          subject: string | null
          template_id: string | null
        }
        Insert: {
          communication_type: string
          created_at?: string | null
          delivery_status?: string | null
          delivery_time?: string | null
          id?: string
          message_content: string
          metadata?: Json | null
          order_id: string
          recipient_id: string
          recipient_type: string
          subject?: string | null
          template_id?: string | null
        }
        Update: {
          communication_type?: string
          created_at?: string | null
          delivery_status?: string | null
          delivery_time?: string | null
          id?: string
          message_content?: string
          metadata?: Json | null
          order_id?: string
          recipient_id?: string
          recipient_type?: string
          subject?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_communications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_fulfillment: {
        Row: {
          allocated_at: string | null
          assigned_packer: string | null
          assigned_picker: string | null
          created_at: string
          delivered_at: string | null
          fulfillment_center_id: string
          id: string
          notes: Json | null
          order_id: string
          packed_at: string | null
          packing_started_at: string | null
          picked_at: string | null
          picking_started_at: string | null
          priority_level: string
          shipped_at: string | null
          shipping_carrier: string | null
          shipping_cost: number | null
          shipping_method: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          allocated_at?: string | null
          assigned_packer?: string | null
          assigned_picker?: string | null
          created_at?: string
          delivered_at?: string | null
          fulfillment_center_id: string
          id?: string
          notes?: Json | null
          order_id: string
          packed_at?: string | null
          packing_started_at?: string | null
          picked_at?: string | null
          picking_started_at?: string | null
          priority_level?: string
          shipped_at?: string | null
          shipping_carrier?: string | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          allocated_at?: string | null
          assigned_packer?: string | null
          assigned_picker?: string | null
          created_at?: string
          delivered_at?: string | null
          fulfillment_center_id?: string
          id?: string
          notes?: Json | null
          order_id?: string
          packed_at?: string | null
          packing_started_at?: string | null
          picked_at?: string | null
          picking_started_at?: string | null
          priority_level?: string
          shipped_at?: string | null
          shipping_carrier?: string | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_fulfillment_fulfillment_center_id_fkey"
            columns: ["fulfillment_center_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_fulfillment_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_fulfillment_workflow: {
        Row: {
          actual_completion: string | null
          assigned_to: string | null
          created_at: string | null
          estimated_completion: string | null
          id: string
          metadata: Json | null
          notes: string | null
          order_id: string
          updated_at: string | null
          vendor_id: string
          workflow_stage: string
        }
        Insert: {
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id: string
          updated_at?: string | null
          vendor_id: string
          workflow_stage?: string
        }
        Update: {
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id?: string
          updated_at?: string | null
          vendor_id?: string
          workflow_stage?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string | null
          product_snapshot: Json | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      order_orchestration_logs: {
        Row: {
          completed_at: string | null
          current_step: string
          error_details: string | null
          executed_at: string | null
          id: string
          order_id: string
          step_data: Json | null
          step_status: string
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step: string
          error_details?: string | null
          executed_at?: string | null
          id?: string
          order_id: string
          step_data?: Json | null
          step_status: string
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: string
          error_details?: string | null
          executed_at?: string | null
          id?: string
          order_id?: string
          step_data?: Json | null
          step_status?: string
          workflow_id?: string
        }
        Relationships: []
      }
      order_service_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          status: string
          total_price: number
          unit_price: number
          variant_sku: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          status?: string
          total_price: number
          unit_price: number
          variant_sku?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          status?: string
          total_price?: number
          unit_price?: number
          variant_sku?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_service_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_service_orders: {
        Row: {
          billing_address: Json
          created_at: string
          currency: string
          customer_id: string
          customer_notes: string | null
          discount_amount: number
          fulfillment_status: string
          id: string
          metadata: Json
          order_number: string
          order_type: string
          payment_status: string
          shipping_address: Json
          shipping_amount: number
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          vendor_id: string
          vendor_notes: string | null
        }
        Insert: {
          billing_address: Json
          created_at?: string
          currency?: string
          customer_id: string
          customer_notes?: string | null
          discount_amount?: number
          fulfillment_status?: string
          id?: string
          metadata?: Json
          order_number: string
          order_type?: string
          payment_status?: string
          shipping_address: Json
          shipping_amount?: number
          status?: string
          subtotal: number
          tax_amount?: number
          total_amount: number
          updated_at?: string
          vendor_id: string
          vendor_notes?: string | null
        }
        Update: {
          billing_address?: Json
          created_at?: string
          currency?: string
          customer_id?: string
          customer_notes?: string | null
          discount_amount?: number
          fulfillment_status?: string
          id?: string
          metadata?: Json
          order_number?: string
          order_type?: string
          payment_status?: string
          shipping_address?: Json
          shipping_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          vendor_id?: string
          vendor_notes?: string | null
        }
        Relationships: []
      }
      order_status_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          estimated_delivery: string | null
          event_description: string | null
          id: string
          location_data: Json | null
          metadata: Json | null
          new_status: string
          old_status: string | null
          order_id: string
          status_category: string | null
          tracking_number: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estimated_delivery?: string | null
          event_description?: string | null
          id?: string
          location_data?: Json | null
          metadata?: Json | null
          new_status: string
          old_status?: string | null
          order_id: string
          status_category?: string | null
          tracking_number?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estimated_delivery?: string | null
          event_description?: string | null
          id?: string
          location_data?: Json | null
          metadata?: Json | null
          new_status?: string
          old_status?: string | null
          order_id?: string
          status_category?: string | null
          tracking_number?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      order_tracking_events: {
        Row: {
          actual_delivery: string | null
          created_at: string | null
          created_by: string | null
          delivery_agent_id: string | null
          delivery_agent_name: string | null
          delivery_agent_phone: string | null
          estimated_delivery: string | null
          event_data: Json
          event_type: string
          id: string
          location_data: Json | null
          order_id: string
          tracking_number: string | null
          vendor_order_id: string | null
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_agent_id?: string | null
          delivery_agent_name?: string | null
          delivery_agent_phone?: string | null
          estimated_delivery?: string | null
          event_data?: Json
          event_type: string
          id?: string
          location_data?: Json | null
          order_id: string
          tracking_number?: string | null
          vendor_order_id?: string | null
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_agent_id?: string | null
          delivery_agent_name?: string | null
          delivery_agent_phone?: string | null
          estimated_delivery?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          location_data?: Json | null
          order_id?: string
          tracking_number?: string | null
          vendor_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_tracking_events_vendor_order_id_fkey"
            columns: ["vendor_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_workflow_steps: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          estimated_completion: string | null
          id: string
          metadata: Json | null
          notes: string | null
          order_id: string
          started_at: string | null
          step_name: string
          step_status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id: string
          started_at?: string | null
          step_name: string
          step_status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id?: string
          started_at?: string | null
          step_name?: string
          step_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_workflows: {
        Row: {
          automation_rules: Json | null
          conditions: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          workflow_name: string
          workflow_steps: Json
          workflow_type: string
        }
        Insert: {
          automation_rules?: Json | null
          conditions?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          workflow_name: string
          workflow_steps?: Json
          workflow_type: string
        }
        Update: {
          automation_rules?: Json | null
          conditions?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          workflow_name?: string
          workflow_steps?: Json
          workflow_type?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          currency: string | null
          customer_id: string | null
          delivered_at: string | null
          discount_amount: number | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: string | null
          shipping_address: Json
          shipping_amount: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: string | null
          shipping_address: Json
          shipping_amount?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: string | null
          shipping_address?: Json
          shipping_amount?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_fraud_detection: {
        Row: {
          behavioral_analysis: Json | null
          created_at: string | null
          detection_algorithm: string
          device_fingerprint: Json | null
          final_decision: string | null
          fraud_indicators: Json | null
          geolocation_data: Json | null
          id: string
          manual_review_required: boolean | null
          ml_model_version: string | null
          review_notes: string | null
          reviewed_by: string | null
          risk_level: string
          risk_score: number
          transaction_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          behavioral_analysis?: Json | null
          created_at?: string | null
          detection_algorithm: string
          device_fingerprint?: Json | null
          final_decision?: string | null
          fraud_indicators?: Json | null
          geolocation_data?: Json | null
          id?: string
          manual_review_required?: boolean | null
          ml_model_version?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          risk_level: string
          risk_score?: number
          transaction_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          behavioral_analysis?: Json | null
          created_at?: string | null
          detection_algorithm?: string
          device_fingerprint?: Json | null
          final_decision?: string | null
          fraud_indicators?: Json | null
          geolocation_data?: Json | null
          id?: string
          manual_review_required?: boolean | null
          ml_model_version?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          risk_level?: string
          risk_score?: number
          transaction_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          is_active: boolean
          maximum_amount: number | null
          minimum_amount: number | null
          name: string
          processing_time_hours: number | null
          provider: string
          supported_currencies: Json | null
          transaction_fee_fixed: number | null
          transaction_fee_percentage: number | null
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          maximum_amount?: number | null
          minimum_amount?: number | null
          name: string
          processing_time_hours?: number | null
          provider: string
          supported_currencies?: Json | null
          transaction_fee_fixed?: number | null
          transaction_fee_percentage?: number | null
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          maximum_amount?: number | null
          minimum_amount?: number | null
          name?: string
          processing_time_hours?: number | null
          provider?: string
          supported_currencies?: Json | null
          transaction_fee_fixed?: number | null
          transaction_fee_percentage?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_method_config: {
        Row: {
          compliance_rules: Json | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          fees_config: Json | null
          gateway_config: Json | null
          gateway_name: string
          id: string
          is_active: boolean | null
          max_amount: number | null
          method_name: string
          min_amount: number | null
          updated_at: string | null
        }
        Insert: {
          compliance_rules?: Json | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          fees_config?: Json | null
          gateway_config?: Json | null
          gateway_name: string
          id?: string
          is_active?: boolean | null
          max_amount?: number | null
          method_name: string
          min_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          compliance_rules?: Json | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          fees_config?: Json | null
          gateway_config?: Json | null
          gateway_name?: string
          id?: string
          is_active?: boolean | null
          max_amount?: number | null
          method_name?: string
          min_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          logo_url: string | null
          method_id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          logo_url?: string | null
          method_id: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          logo_url?: string | null
          method_id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_reconciliation: {
        Row: {
          created_at: string | null
          discrepancy_amount: number | null
          discrepancy_count: number | null
          gateway_amount: number | null
          gateway_name: string
          gateway_transactions: number | null
          id: string
          platform_amount: number | null
          platform_transactions: number | null
          reconciled_by: string | null
          reconciliation_date: string
          reconciliation_report: Json | null
          status: string | null
          total_amount: number | null
          total_transactions: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discrepancy_amount?: number | null
          discrepancy_count?: number | null
          gateway_amount?: number | null
          gateway_name: string
          gateway_transactions?: number | null
          id?: string
          platform_amount?: number | null
          platform_transactions?: number | null
          reconciled_by?: string | null
          reconciliation_date: string
          reconciliation_report?: Json | null
          status?: string | null
          total_amount?: number | null
          total_transactions?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discrepancy_amount?: number | null
          discrepancy_count?: number | null
          gateway_amount?: number | null
          gateway_name?: string
          gateway_transactions?: number | null
          id?: string
          platform_amount?: number | null
          platform_transactions?: number | null
          reconciled_by?: string | null
          reconciliation_date?: string
          reconciliation_report?: Json | null
          status?: string | null
          total_amount?: number | null
          total_transactions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_service_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_id: string
          failure_reason: string | null
          fees: number
          gateway_name: string
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          metadata: Json
          net_amount: number
          order_id: string | null
          payment_method: string
          platform_fee: number
          processed_at: string | null
          processing_fee: number
          refund_amount: number
          refund_status: string | null
          status: string
          transaction_id: string
          updated_at: string
          vendor_id: string | null
          vendor_payout: number
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_id: string
          failure_reason?: string | null
          fees?: number
          gateway_name: string
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          metadata?: Json
          net_amount: number
          order_id?: string | null
          payment_method: string
          platform_fee?: number
          processed_at?: string | null
          processing_fee?: number
          refund_amount?: number
          refund_status?: string | null
          status?: string
          transaction_id: string
          updated_at?: string
          vendor_id?: string | null
          vendor_payout?: number
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_id?: string
          failure_reason?: string | null
          fees?: number
          gateway_name?: string
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          metadata?: Json
          net_amount?: number
          order_id?: string | null
          payment_method?: string
          platform_fee?: number
          processed_at?: string | null
          processing_fee?: number
          refund_amount?: number
          refund_status?: string | null
          status?: string
          transaction_id?: string
          updated_at?: string
          vendor_id?: string | null
          vendor_payout?: number
        }
        Relationships: []
      }
      payment_terms_config: {
        Row: {
          compliance_requirements: Json | null
          created_at: string | null
          created_by: string
          currency: string
          id: string
          is_active: boolean | null
          late_payment_penalty_rate: number | null
          minimum_payout_amount: number
          payment_methods: Json
          payout_frequency: string
          processing_days: number
          processing_fee_rate: number | null
          term_name: string
          terms_conditions: string | null
          updated_at: string | null
        }
        Insert: {
          compliance_requirements?: Json | null
          created_at?: string | null
          created_by: string
          currency?: string
          id?: string
          is_active?: boolean | null
          late_payment_penalty_rate?: number | null
          minimum_payout_amount?: number
          payment_methods?: Json
          payout_frequency: string
          processing_days?: number
          processing_fee_rate?: number | null
          term_name: string
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Update: {
          compliance_requirements?: Json | null
          created_at?: string | null
          created_by?: string
          currency?: string
          id?: string
          is_active?: boolean | null
          late_payment_penalty_rate?: number | null
          minimum_payout_amount?: number
          payment_methods?: Json
          payout_frequency?: string
          processing_days?: number
          processing_fee_rate?: number | null
          term_name?: string
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          billing_address: Json | null
          created_at: string
          currency: string
          customer_details: Json | null
          failed_at: string | null
          failure_reason: string | null
          fee_amount: number | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          initiated_at: string
          net_amount: number | null
          order_id: string
          payment_gateway_id: string
          payment_method: string
          processed_at: string | null
          refunded_amount: number | null
          status: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_details?: Json | null
          failed_at?: string | null
          failure_reason?: string | null
          fee_amount?: number | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          initiated_at?: string
          net_amount?: number | null
          order_id: string
          payment_gateway_id: string
          payment_method: string
          processed_at?: string | null
          refunded_amount?: number | null
          status?: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_details?: Json | null
          failed_at?: string | null
          failure_reason?: string | null
          fee_amount?: number | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          initiated_at?: string
          net_amount?: number | null
          order_id?: string
          payment_gateway_id?: string
          payment_method?: string
          processed_at?: string | null
          refunded_amount?: number | null
          status?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_gateway_id_fkey"
            columns: ["payment_gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhook_logs: {
        Row: {
          created_at: string | null
          gateway_name: string
          id: string
          last_retry_at: string | null
          processed: boolean | null
          processing_result: Json | null
          retry_count: number | null
          signature: string | null
          signature_verified: boolean | null
          webhook_payload: Json
          webhook_type: string
        }
        Insert: {
          created_at?: string | null
          gateway_name: string
          id?: string
          last_retry_at?: string | null
          processed?: boolean | null
          processing_result?: Json | null
          retry_count?: number | null
          signature?: string | null
          signature_verified?: boolean | null
          webhook_payload: Json
          webhook_type: string
        }
        Update: {
          created_at?: string | null
          gateway_name?: string
          id?: string
          last_retry_at?: string | null
          processed?: boolean | null
          processing_result?: Json | null
          retry_count?: number | null
          signature?: string | null
          signature_verified?: boolean | null
          webhook_payload?: Json
          webhook_type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          customer_details: Json | null
          customer_phone: string | null
          gateway_response: Json | null
          id: string
          order_id: string | null
          payment_method: string
          status: string
          transaction_id: string | null
          transaction_reference: string
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_details?: Json | null
          customer_phone?: string | null
          gateway_response?: Json | null
          id?: string
          order_id?: string | null
          payment_method: string
          status?: string
          transaction_id?: string | null
          transaction_reference: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_details?: Json | null
          customer_phone?: string | null
          gateway_response?: Json | null
          id?: string
          order_id?: string | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
          transaction_reference?: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_approval_workflow: {
        Row: {
          approval_level: number
          approval_status: string
          approved_by: string[] | null
          assigned_to: string[] | null
          created_at: string
          current_approvers: number
          deadline: string | null
          escalated_to: string | null
          escalation_reason: string | null
          id: string
          payout_request_id: string
          rejected_by: string | null
          rejection_reason: string | null
          required_approvers: number
          updated_at: string
        }
        Insert: {
          approval_level?: number
          approval_status?: string
          approved_by?: string[] | null
          assigned_to?: string[] | null
          created_at?: string
          current_approvers?: number
          deadline?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          payout_request_id: string
          rejected_by?: string | null
          rejection_reason?: string | null
          required_approvers?: number
          updated_at?: string
        }
        Update: {
          approval_level?: number
          approval_status?: string
          approved_by?: string[] | null
          assigned_to?: string[] | null
          created_at?: string
          current_approvers?: number
          deadline?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          payout_request_id?: string
          rejected_by?: string | null
          rejection_reason?: string | null
          required_approvers?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_approval_workflow_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_approval_workflow_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_approval_workflow_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_batch_processing: {
        Row: {
          batch_number: string
          completed_at: string | null
          created_at: string
          error_log: Json | null
          failed_amount: number
          id: string
          metadata: Json | null
          processed_amount: number
          processing_date: string
          processor_id: string | null
          started_at: string | null
          status: string
          total_amount: number
          total_requests: number
          updated_at: string
        }
        Insert: {
          batch_number: string
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_amount?: number
          id?: string
          metadata?: Json | null
          processed_amount?: number
          processing_date?: string
          processor_id?: string | null
          started_at?: string | null
          status?: string
          total_amount?: number
          total_requests?: number
          updated_at?: string
        }
        Update: {
          batch_number?: string
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_amount?: number
          id?: string
          metadata?: Json | null
          processed_amount?: number
          processing_date?: string
          processor_id?: string | null
          started_at?: string | null
          status?: string
          total_amount?: number
          total_requests?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_batch_processing_processor_id_fkey"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_fees_config: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          effective_from: string
          effective_to: string | null
          fee_amount: number
          fee_type: string
          id: string
          is_active: boolean | null
          maximum_fee: number | null
          minimum_fee: number | null
          payment_method: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          effective_from?: string
          effective_to?: string | null
          fee_amount: number
          fee_type: string
          id?: string
          is_active?: boolean | null
          maximum_fee?: number | null
          minimum_fee?: number | null
          payment_method: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          effective_from?: string
          effective_to?: string | null
          fee_amount?: number
          fee_type?: string
          id?: string
          is_active?: boolean | null
          maximum_fee?: number | null
          minimum_fee?: number | null
          payment_method?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_fees_config_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_history: {
        Row: {
          action: string
          created_at: string
          id: string
          new_status: string | null
          notes: string | null
          payout_request_id: string | null
          performed_by: string | null
          previous_status: string | null
          vendor_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          payout_request_id?: string | null
          performed_by?: string | null
          previous_status?: string | null
          vendor_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          payout_request_id?: string | null
          performed_by?: string | null
          previous_status?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_history_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_history_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_notification_queue: {
        Row: {
          attempts: number | null
          content: string
          created_at: string
          delivery_method: string[] | null
          delivery_status: string
          error_message: string | null
          id: string
          max_attempts: number | null
          metadata: Json | null
          notification_type: string
          payout_request_id: string | null
          recipient_id: string
          scheduled_at: string | null
          sent_at: string | null
          subject: string
          template_id: string | null
        }
        Insert: {
          attempts?: number | null
          content: string
          created_at?: string
          delivery_method?: string[] | null
          delivery_status?: string
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          metadata?: Json | null
          notification_type: string
          payout_request_id?: string | null
          recipient_id: string
          scheduled_at?: string | null
          sent_at?: string | null
          subject: string
          template_id?: string | null
        }
        Update: {
          attempts?: number | null
          content?: string
          created_at?: string
          delivery_method?: string[] | null
          delivery_status?: string
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          metadata?: Json | null
          notification_type?: string
          payout_request_id?: string | null
          recipient_id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_notification_queue_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_notification_queue_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_processing_logs: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          log_data: Json | null
          log_level: string
          log_message: string
          logged_by: string | null
          payout_request_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          log_data?: Json | null
          log_level: string
          log_message: string
          logged_by?: string | null
          payout_request_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          log_data?: Json | null
          log_level?: string
          log_message?: string
          logged_by?: string | null
          payout_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_processing_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payout_batch_processing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_processing_logs_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_processing_logs_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_request_items: {
        Row: {
          commission_id: string | null
          commission_period_end: string | null
          commission_period_start: string | null
          created_at: string
          id: string
          item_amount: number
          item_description: string | null
          payout_request_id: string
        }
        Insert: {
          commission_id?: string | null
          commission_period_end?: string | null
          commission_period_start?: string | null
          created_at?: string
          id?: string
          item_amount: number
          item_description?: string | null
          payout_request_id: string
        }
        Update: {
          commission_id?: string | null
          commission_period_end?: string | null
          commission_period_start?: string | null
          created_at?: string
          id?: string
          item_amount?: number
          item_description?: string | null
          payout_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_request_items_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "vendor_commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_request_items_payout_request_id_fkey"
            columns: ["payout_request_id"]
            isOneToOne: false
            referencedRelation: "payout_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          approval_workflow_id: string | null
          auto_processed: boolean | null
          bank_account_details: Json | null
          batch_id: string | null
          compliance_checked: boolean | null
          created_at: string
          currency: string
          external_reference: string | null
          fraud_check_status: string | null
          id: string
          mobile_banking_details: Json | null
          net_payout_amount: number
          notes: string | null
          payment_method: string
          payment_reference: string | null
          payout_period_end: string
          payout_period_start: string
          priority_level: string | null
          processed_at: string | null
          processed_by: string | null
          processing_fee: number | null
          reconciliation_status: string | null
          rejection_reason: string | null
          request_amount: number
          request_date: string
          requires_manual_review: boolean | null
          status: string
          tax_deduction: number | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          approval_workflow_id?: string | null
          auto_processed?: boolean | null
          bank_account_details?: Json | null
          batch_id?: string | null
          compliance_checked?: boolean | null
          created_at?: string
          currency?: string
          external_reference?: string | null
          fraud_check_status?: string | null
          id?: string
          mobile_banking_details?: Json | null
          net_payout_amount: number
          notes?: string | null
          payment_method: string
          payment_reference?: string | null
          payout_period_end: string
          payout_period_start: string
          priority_level?: string | null
          processed_at?: string | null
          processed_by?: string | null
          processing_fee?: number | null
          reconciliation_status?: string | null
          rejection_reason?: string | null
          request_amount: number
          request_date?: string
          requires_manual_review?: boolean | null
          status?: string
          tax_deduction?: number | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          approval_workflow_id?: string | null
          auto_processed?: boolean | null
          bank_account_details?: Json | null
          batch_id?: string | null
          compliance_checked?: boolean | null
          created_at?: string
          currency?: string
          external_reference?: string | null
          fraud_check_status?: string | null
          id?: string
          mobile_banking_details?: Json | null
          net_payout_amount?: number
          notes?: string | null
          payment_method?: string
          payment_reference?: string | null
          payout_period_end?: string
          payout_period_start?: string
          priority_level?: string | null
          processed_at?: string | null
          processed_by?: string | null
          processing_fee?: number | null
          reconciliation_status?: string | null
          rejection_reason?: string | null
          request_amount?: number
          request_date?: string
          requires_manual_review?: boolean | null
          status?: string
          tax_deduction?: number | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_approval_workflow_id_fkey"
            columns: ["approval_workflow_id"]
            isOneToOne: false
            referencedRelation: "payout_approval_workflow"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_requests_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payout_batch_processing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_schedules: {
        Row: {
          auto_payout_enabled: boolean | null
          bank_account_info: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          minimum_payout_amount: number | null
          mobile_banking_info: Json | null
          payout_day: number | null
          preferred_payment_method: string
          schedule_type: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          auto_payout_enabled?: boolean | null
          bank_account_info?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          minimum_payout_amount?: number | null
          mobile_banking_info?: Json | null
          payout_day?: number | null
          preferred_payment_method: string
          schedule_type: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          auto_payout_enabled?: boolean | null
          bank_account_info?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          minimum_payout_amount?: number | null
          mobile_banking_info?: Json | null
          payout_day?: number | null
          preferred_payment_method?: string
          schedule_type?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_schedules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          cache_hit_rate: number | null
          cpu_usage_percent: number | null
          created_at: string
          endpoint_path: string | null
          error_count: number | null
          id: string
          memory_usage_mb: number | null
          metadata: Json | null
          method_type: string | null
          metric_category: string
          recorded_at: string
          response_time_ms: number
          status_code: number | null
          success_count: number | null
          throughput_per_second: number | null
        }
        Insert: {
          cache_hit_rate?: number | null
          cpu_usage_percent?: number | null
          created_at?: string
          endpoint_path?: string | null
          error_count?: number | null
          id?: string
          memory_usage_mb?: number | null
          metadata?: Json | null
          method_type?: string | null
          metric_category: string
          recorded_at?: string
          response_time_ms: number
          status_code?: number | null
          success_count?: number | null
          throughput_per_second?: number | null
        }
        Update: {
          cache_hit_rate?: number | null
          cpu_usage_percent?: number | null
          created_at?: string
          endpoint_path?: string | null
          error_count?: number | null
          id?: string
          memory_usage_mb?: number | null
          metadata?: Json | null
          method_type?: string | null
          metric_category?: string
          recorded_at?: string
          response_time_ms?: number
          status_code?: number | null
          success_count?: number | null
          throughput_per_second?: number | null
        }
        Relationships: []
      }
      performance_tracking: {
        Row: {
          created_at: string
          duration_ms: number
          id: string
          metadata: Json | null
          operation_name: string
          service_name: string
        }
        Insert: {
          created_at?: string
          duration_ms: number
          id?: string
          metadata?: Json | null
          operation_name: string
          service_name: string
        }
        Update: {
          created_at?: string
          duration_ms?: number
          id?: string
          metadata?: Json | null
          operation_name?: string
          service_name?: string
        }
        Relationships: []
      }
      personalized_pricing_strategies: {
        Row: {
          base_price: number
          created_at: string | null
          customer_id: string
          customer_segment: string | null
          discount_percentage: number | null
          id: string
          personalized_price: number
          price_sensitivity: number | null
          pricing_strategy: string
          product_id: string
          purchase_probability: number | null
          valid_from: string | null
          valid_until: string | null
          vendor_id: string
        }
        Insert: {
          base_price: number
          created_at?: string | null
          customer_id: string
          customer_segment?: string | null
          discount_percentage?: number | null
          id?: string
          personalized_price: number
          price_sensitivity?: number | null
          pricing_strategy: string
          product_id: string
          purchase_probability?: number | null
          valid_from?: string | null
          valid_until?: string | null
          vendor_id: string
        }
        Update: {
          base_price?: number
          created_at?: string | null
          customer_id?: string
          customer_segment?: string | null
          discount_percentage?: number | null
          id?: string
          personalized_price?: number
          price_sensitivity?: number | null
          pricing_strategy?: string
          product_id?: string
          purchase_probability?: number | null
          valid_from?: string | null
          valid_until?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personalized_pricing_strategies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personalized_pricing_strategies_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      pick_list_items: {
        Row: {
          created_at: string
          id: string
          inventory_id: string
          notes: string | null
          order_fulfillment_id: string
          pick_list_id: string
          pick_sequence: number | null
          picked_at: string | null
          quantity_picked: number
          quantity_requested: number
          status: string
          storage_location: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_id: string
          notes?: string | null
          order_fulfillment_id: string
          pick_list_id: string
          pick_sequence?: number | null
          picked_at?: string | null
          quantity_picked?: number
          quantity_requested: number
          status?: string
          storage_location?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          inventory_id?: string
          notes?: string | null
          order_fulfillment_id?: string
          pick_list_id?: string
          pick_sequence?: number | null
          picked_at?: string | null
          quantity_picked?: number
          quantity_requested?: number
          status?: string
          storage_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pick_list_items_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_list_items_order_fulfillment_id_fkey"
            columns: ["order_fulfillment_id"]
            isOneToOne: false
            referencedRelation: "order_fulfillment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_list_items_pick_list_id_fkey"
            columns: ["pick_list_id"]
            isOneToOne: false
            referencedRelation: "pick_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      pick_lists: {
        Row: {
          completed_at: string | null
          created_at: string
          estimated_completion_time: string | null
          fulfillment_center_id: string
          id: string
          picked_items: number
          picker_id: string | null
          priority_level: string
          started_at: string | null
          status: string
          total_items: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimated_completion_time?: string | null
          fulfillment_center_id: string
          id?: string
          picked_items?: number
          picker_id?: string | null
          priority_level?: string
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimated_completion_time?: string | null
          fulfillment_center_id?: string
          id?: string
          picked_items?: number
          picker_id?: string | null
          priority_level?: string
          started_at?: string | null
          status?: string
          total_items?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pick_lists_fulfillment_center_id_fkey"
            columns: ["fulfillment_center_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_metrics: {
        Row: {
          active_users: number | null
          api_calls_count: number | null
          average_response_time: number | null
          backup_status: string | null
          cdn_cache_hit_rate: number | null
          created_at: string
          database_performance: Json | null
          error_rate: number | null
          id: string
          metric_date: string
          security_incidents: number | null
          server_load_percentage: number | null
          uptime_percentage: number | null
        }
        Insert: {
          active_users?: number | null
          api_calls_count?: number | null
          average_response_time?: number | null
          backup_status?: string | null
          cdn_cache_hit_rate?: number | null
          created_at?: string
          database_performance?: Json | null
          error_rate?: number | null
          id?: string
          metric_date?: string
          security_incidents?: number | null
          server_load_percentage?: number | null
          uptime_percentage?: number | null
        }
        Update: {
          active_users?: number | null
          api_calls_count?: number | null
          average_response_time?: number | null
          backup_status?: string | null
          cdn_cache_hit_rate?: number | null
          created_at?: string
          database_performance?: Json | null
          error_rate?: number | null
          id?: string
          metric_date?: string
          security_incidents?: number | null
          server_load_percentage?: number | null
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      prayer_times: {
        Row: {
          asr: string
          city: string
          created_at: string | null
          date: string
          dhuhr: string
          division: string
          fajr: string
          id: string
          isha: string
          maghrib: string
          sunrise: string
        }
        Insert: {
          asr: string
          city: string
          created_at?: string | null
          date: string
          dhuhr: string
          division: string
          fajr: string
          id?: string
          isha: string
          maghrib: string
          sunrise: string
        }
        Update: {
          asr?: string
          city?: string
          created_at?: string | null
          date?: string
          dhuhr?: string
          division?: string
          fajr?: string
          id?: string
          isha?: string
          maghrib?: string
          sunrise?: string
        }
        Relationships: []
      }
      predictive_cache_models: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_trained: string | null
          model_config: Json
          model_name: string
          model_type: string
          training_data_size: number | null
          updated_at: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_config?: Json
          model_name: string
          model_type: string
          training_data_size?: number | null
          updated_at?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_config?: Json
          model_name?: string
          model_type?: string
          training_data_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      predictive_scaling_metrics: {
        Row: {
          confidence_level: number
          cost_implications: Json
          created_at: string
          current_instances: number
          effectiveness_score: number | null
          id: string
          implemented_at: string | null
          predicted_demand: number
          recommended_instances: number
          resource_utilization: Json
          scaling_trigger_reason: string
          service_name: string
        }
        Insert: {
          confidence_level?: number
          cost_implications?: Json
          created_at?: string
          current_instances?: number
          effectiveness_score?: number | null
          id?: string
          implemented_at?: string | null
          predicted_demand?: number
          recommended_instances?: number
          resource_utilization?: Json
          scaling_trigger_reason: string
          service_name: string
        }
        Update: {
          confidence_level?: number
          cost_implications?: Json
          created_at?: string
          current_instances?: number
          effectiveness_score?: number | null
          id?: string
          implemented_at?: string | null
          predicted_demand?: number
          recommended_instances?: number
          resource_utilization?: Json
          scaling_trigger_reason?: string
          service_name?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string | null
          created_at: string | null
          current_price: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          notification_sent: boolean | null
          product_id: string | null
          target_price: number
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type?: string | null
          created_at?: string | null
          current_price: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          product_id?: string | null
          target_price: number
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string | null
          created_at?: string | null
          current_price?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          product_id?: string | null
          target_price?: number
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_change_history: {
        Row: {
          change_percentage: number | null
          change_reason: string | null
          created_at: string | null
          created_by: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          new_price: number
          old_price: number | null
          product_id: string | null
          vendor_id: string
        }
        Insert: {
          change_percentage?: number | null
          change_reason?: string | null
          created_at?: string | null
          created_by?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          new_price: number
          old_price?: number | null
          product_id?: string | null
          vendor_id: string
        }
        Update: {
          change_percentage?: number | null
          change_reason?: string | null
          created_at?: string | null
          created_by?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          new_price?: number
          old_price?: number | null
          product_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_change_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_optimization_results: {
        Row: {
          applied_at: string | null
          approved_by: string | null
          competitor_price_factor: number | null
          confidence_score: number | null
          created_at: string | null
          current_price: number
          demand_factor: number | null
          expected_conversion_impact: number | null
          expected_revenue_impact: number | null
          expires_at: string | null
          id: string
          inventory_factor: number | null
          optimization_reason: string
          pricing_model_id: string | null
          product_id: string | null
          seasonality_factor: number | null
          status: string | null
          suggested_price: number
        }
        Insert: {
          applied_at?: string | null
          approved_by?: string | null
          competitor_price_factor?: number | null
          confidence_score?: number | null
          created_at?: string | null
          current_price: number
          demand_factor?: number | null
          expected_conversion_impact?: number | null
          expected_revenue_impact?: number | null
          expires_at?: string | null
          id?: string
          inventory_factor?: number | null
          optimization_reason: string
          pricing_model_id?: string | null
          product_id?: string | null
          seasonality_factor?: number | null
          status?: string | null
          suggested_price: number
        }
        Update: {
          applied_at?: string | null
          approved_by?: string | null
          competitor_price_factor?: number | null
          confidence_score?: number | null
          created_at?: string | null
          current_price?: number
          demand_factor?: number | null
          expected_conversion_impact?: number | null
          expected_revenue_impact?: number | null
          expires_at?: string | null
          id?: string
          inventory_factor?: number | null
          optimization_reason?: string
          pricing_model_id?: string | null
          product_id?: string | null
          seasonality_factor?: number | null
          status?: string | null
          suggested_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_optimization_results_pricing_model_id_fkey"
            columns: ["pricing_model_id"]
            isOneToOne: false
            referencedRelation: "dynamic_pricing_models"
            referencedColumns: ["id"]
          },
        ]
      }
      price_optimizations: {
        Row: {
          competitor_prices: Json | null
          created_at: string | null
          current_price: number
          demand_sensitivity: number | null
          id: string
          optimization_strategy: string | null
          price_elasticity: number | null
          product_id: string
          profit_impact: number | null
          recommended_price: number
          valid_until: string | null
          vendor_id: string
        }
        Insert: {
          competitor_prices?: Json | null
          created_at?: string | null
          current_price: number
          demand_sensitivity?: number | null
          id?: string
          optimization_strategy?: string | null
          price_elasticity?: number | null
          product_id: string
          profit_impact?: number | null
          recommended_price: number
          valid_until?: string | null
          vendor_id: string
        }
        Update: {
          competitor_prices?: Json | null
          created_at?: string | null
          current_price?: number
          demand_sensitivity?: number | null
          id?: string
          optimization_strategy?: string | null
          price_elasticity?: number | null
          product_id?: string
          profit_impact?: number | null
          recommended_price?: number
          valid_until?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_optimizations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_optimizations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      price_predictions: {
        Row: {
          algorithm_used: string
          competitor_data: Json | null
          created_at: string | null
          current_price: number
          expires_at: string
          id: string
          market_factors: Json | null
          predicted_price: number
          prediction_confidence: number | null
          prediction_period: string
          product_id: string
          seasonal_factors: Json | null
          vendor_id: string
        }
        Insert: {
          algorithm_used: string
          competitor_data?: Json | null
          created_at?: string | null
          current_price: number
          expires_at: string
          id?: string
          market_factors?: Json | null
          predicted_price: number
          prediction_confidence?: number | null
          prediction_period: string
          product_id: string
          seasonal_factors?: Json | null
          vendor_id: string
        }
        Update: {
          algorithm_used?: string
          competitor_data?: Json | null
          created_at?: string | null
          current_price?: number
          expires_at?: string
          id?: string
          market_factors?: Json | null
          predicted_price?: number
          prediction_confidence?: number | null
          prediction_period?: string
          product_id?: string
          seasonal_factors?: Json | null
          vendor_id?: string
        }
        Relationships: []
      }
      product_benchmarks: {
        Row: {
          benchmark_date: string | null
          benchmark_type: string
          category_comparison: Json | null
          id: string
          improvement_potential: number | null
          market_average: number
          our_metric: number
          percentile_rank: number | null
          product_id: string
          top_performer: number
          vendor_id: string
        }
        Insert: {
          benchmark_date?: string | null
          benchmark_type: string
          category_comparison?: Json | null
          id?: string
          improvement_potential?: number | null
          market_average: number
          our_metric: number
          percentile_rank?: number | null
          product_id: string
          top_performer: number
          vendor_id: string
        }
        Update: {
          benchmark_date?: string | null
          benchmark_type?: string
          category_comparison?: Json | null
          id?: string
          improvement_potential?: number | null
          market_average?: number
          our_metric?: number
          percentile_rank?: number | null
          product_id?: string
          top_performer?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_benchmarks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_benchmarks_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bundle_items: {
        Row: {
          bundle_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          bundle_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
        }
        Update: {
          bundle_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bundles: {
        Row: {
          bundle_description: string | null
          bundle_name: string
          bundle_price: number
          created_at: string
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          bundle_description?: string | null
          bundle_name: string
          bundle_price: number
          created_at?: string
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          bundle_description?: string | null
          bundle_name?: string
          bundle_price?: number
          created_at?: string
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      product_comparison_lists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          shared_token: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          shared_token?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          shared_token?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      product_comparisons: {
        Row: {
          comparison_name: string | null
          created_at: string | null
          id: string
          product_ids: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comparison_name?: string | null
          created_at?: string | null
          id?: string
          product_ids?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comparison_name?: string | null
          created_at?: string | null
          id?: string
          product_ids?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_filters: {
        Row: {
          category_id: string | null
          created_at: string | null
          filter_name: string
          filter_options: Json
          filter_type: string
          id: string
          is_active: boolean | null
          sort_order: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          filter_name: string
          filter_options?: Json
          filter_type: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          filter_name?: string
          filter_options?: Json
          filter_type?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
        }
        Relationships: []
      }
      product_inventory: {
        Row: {
          created_at: string | null
          current_stock: number
          id: string
          last_restocked_at: string | null
          maximum_stock_level: number
          minimum_stock_level: number
          product_id: string
          reorder_point: number
          reserved_stock: number
          selling_price: number | null
          sku: string
          unit_cost: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          current_stock?: number
          id?: string
          last_restocked_at?: string | null
          maximum_stock_level?: number
          minimum_stock_level?: number
          product_id: string
          reorder_point?: number
          reserved_stock?: number
          selling_price?: number | null
          sku: string
          unit_cost?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          current_stock?: number
          id?: string
          last_restocked_at?: string | null
          maximum_stock_level?: number
          minimum_stock_level?: number
          product_id?: string
          reorder_point?: number
          reserved_stock?: number
          selling_price?: number | null
          sku?: string
          unit_cost?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      product_performance_analytics: {
        Row: {
          analytics_date: string
          average_rating: number | null
          cart_additions: number | null
          category_ranking: number | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          product_id: string
          profit_margin: number | null
          purchases_count: number | null
          return_rate: number | null
          revenue: number | null
          review_count: number | null
          search_ranking: number | null
          updated_at: string | null
          vendor_id: string
          views_count: number | null
        }
        Insert: {
          analytics_date?: string
          average_rating?: number | null
          cart_additions?: number | null
          category_ranking?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          product_id: string
          profit_margin?: number | null
          purchases_count?: number | null
          return_rate?: number | null
          revenue?: number | null
          review_count?: number | null
          search_ranking?: number | null
          updated_at?: string | null
          vendor_id: string
          views_count?: number | null
        }
        Update: {
          analytics_date?: string
          average_rating?: number | null
          cart_additions?: number | null
          category_ranking?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          product_id?: string
          profit_margin?: number | null
          purchases_count?: number | null
          return_rate?: number | null
          revenue?: number | null
          review_count?: number | null
          search_ranking?: number | null
          updated_at?: string | null
          vendor_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      product_recommendations: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          product_id: string
          reasoning: Json | null
          recommendation_type: string
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id: string
          reasoning?: Json | null
          recommendation_type: string
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string
          reasoning?: Json | null
          recommendation_type?: string
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          cons: string[] | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          photos: Json | null
          product_id: string
          pros: string[] | null
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          cons?: string[] | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          photos?: Json | null
          product_id: string
          pros?: string[] | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          cons?: string[] | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          photos?: Json | null
          product_id?: string
          pros?: string[] | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_service_catalog: {
        Row: {
          attributes: Json
          category_path: string
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          media: Json
          name: string
          seo_data: Json
          sku: string
          status: string
          tags: string[] | null
          updated_at: string
          variants: Json
          vendor_id: string
        }
        Insert: {
          attributes?: Json
          category_path: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          media?: Json
          name: string
          seo_data?: Json
          sku: string
          status?: string
          tags?: string[] | null
          updated_at?: string
          variants?: Json
          vendor_id: string
        }
        Update: {
          attributes?: Json
          category_path?: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          media?: Json
          name?: string
          seo_data?: Json
          sku?: string
          status?: string
          tags?: string[] | null
          updated_at?: string
          variants?: Json
          vendor_id?: string
        }
        Relationships: []
      }
      product_service_inventory: {
        Row: {
          available_quantity: number
          cost_price: number | null
          created_at: string
          discount_price: number | null
          id: string
          last_restocked_at: string | null
          minimum_stock_level: number
          price_history: Json
          product_id: string
          reorder_point: number
          reserved_quantity: number
          selling_price: number
          updated_at: string
          variant_sku: string | null
          warehouse_location: string | null
        }
        Insert: {
          available_quantity?: number
          cost_price?: number | null
          created_at?: string
          discount_price?: number | null
          id?: string
          last_restocked_at?: string | null
          minimum_stock_level?: number
          price_history?: Json
          product_id: string
          reorder_point?: number
          reserved_quantity?: number
          selling_price: number
          updated_at?: string
          variant_sku?: string | null
          warehouse_location?: string | null
        }
        Update: {
          available_quantity?: number
          cost_price?: number | null
          created_at?: string
          discount_price?: number | null
          id?: string
          last_restocked_at?: string | null
          minimum_stock_level?: number
          price_history?: Json
          product_id?: string
          reorder_point?: number
          reserved_quantity?: number
          selling_price?: number
          updated_at?: string
          variant_sku?: string | null
          warehouse_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_service_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_service_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      product_shares: {
        Row: {
          click_count: number | null
          conversion_count: number | null
          created_at: string | null
          id: string
          platform: string
          product_id: string
          referral_earnings: number | null
          shared_url: string | null
          user_id: string | null
        }
        Insert: {
          click_count?: number | null
          conversion_count?: number | null
          created_at?: string | null
          id?: string
          platform: string
          product_id: string
          referral_earnings?: number | null
          shared_url?: string | null
          user_id?: string | null
        }
        Update: {
          click_count?: number | null
          conversion_count?: number | null
          created_at?: string | null
          id?: string
          platform?: string
          product_id?: string
          referral_earnings?: number | null
          shared_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          attributes: Json | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          product_id: string | null
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          product_id?: string | null
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          product_id?: string | null
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_view_tracking: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          product_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          view_duration: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          view_duration?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          view_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_view_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          compare_price: number | null
          cost_price: number | null
          created_at: string
          description: string | null
          description_bn: string | null
          dimensions: Json | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_digital: boolean | null
          is_featured: boolean | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          name_bn: string | null
          price: number
          searchable_content: unknown | null
          sku: string
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string
          vendor_id: string | null
          weight: number | null
        }
        Insert: {
          category_id?: string | null
          compare_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          dimensions?: Json | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          name_bn?: string | null
          price: number
          searchable_content?: unknown | null
          sku: string
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
          vendor_id?: string | null
          weight?: number | null
        }
        Update: {
          category_id?: string | null
          compare_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          dimensions?: Json | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          name_bn?: string | null
          price?: number
          searchable_content?: unknown | null
          sku?: string
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
          vendor_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name: string
          id: string
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          action_buttons: Json | null
          analytics_data: Json | null
          body: string
          created_at: string | null
          data: Json | null
          deep_link: string | null
          delivered_at: string | null
          delivery_status: string | null
          device_tokens: string[] | null
          id: string
          platform: string | null
          priority: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_buttons?: Json | null
          analytics_data?: Json | null
          body: string
          created_at?: string | null
          data?: Json | null
          deep_link?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          device_tokens?: string[] | null
          id?: string
          platform?: string | null
          priority?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          title: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_buttons?: Json | null
          analytics_data?: Json | null
          body?: string
          created_at?: string | null
          data?: Json | null
          deep_link?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          device_tokens?: string[] | null
          id?: string
          platform?: string | null
          priority?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pwa_analytics: {
        Row: {
          app_version: string | null
          cache_performance: Json | null
          created_at: string | null
          device_info: Json
          event_type: string
          id: string
          network_status: string | null
          offline_duration: number | null
          service_worker_version: string | null
          sync_queue_size: number | null
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          cache_performance?: Json | null
          created_at?: string | null
          device_info?: Json
          event_type: string
          id?: string
          network_status?: string | null
          offline_duration?: number | null
          service_worker_version?: string | null
          sync_queue_size?: number | null
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          cache_performance?: Json | null
          created_at?: string | null
          device_info?: Json
          event_type?: string
          id?: string
          network_status?: string | null
          offline_duration?: number | null
          service_worker_version?: string | null
          sync_queue_size?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      pwa_installations: {
        Row: {
          browser: string
          created_at: string | null
          device_type: string
          id: string
          installation_source: string | null
          is_active: boolean | null
          last_active_at: string | null
          platform: string
          user_id: string | null
        }
        Insert: {
          browser: string
          created_at?: string | null
          device_type: string
          id?: string
          installation_source?: string | null
          is_active?: boolean | null
          last_active_at?: string | null
          platform: string
          user_id?: string | null
        }
        Update: {
          browser?: string
          created_at?: string | null
          device_type?: string
          id?: string
          installation_source?: string | null
          is_active?: boolean | null
          last_active_at?: string | null
          platform?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pwa_push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh_key: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_key: string
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh_key: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_key?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh_key?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      qualitative_assessments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assessor_id: string
          borrower_id: string | null
          business_outlook: string
          business_outlook_score: number
          completed_at: string | null
          created_at: string
          id: string
          industry_comments: string | null
          industry_risk_level: string
          industry_risk_score: number
          industry_sector: string
          management_comments: string | null
          management_experience_rating: number | null
          management_quality_score: number
          management_track_record_rating: number | null
          outlook_comments: string | null
          outlook_score: number | null
          status: string | null
          succession_plan_exists: boolean | null
          total_qualitative_score: number
          updated_at: string
          weightage_config: Json | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assessor_id: string
          borrower_id?: string | null
          business_outlook: string
          business_outlook_score?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          industry_comments?: string | null
          industry_risk_level: string
          industry_risk_score?: number
          industry_sector: string
          management_comments?: string | null
          management_experience_rating?: number | null
          management_quality_score?: number
          management_track_record_rating?: number | null
          outlook_comments?: string | null
          outlook_score?: number | null
          status?: string | null
          succession_plan_exists?: boolean | null
          total_qualitative_score?: number
          updated_at?: string
          weightage_config?: Json | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assessor_id?: string
          borrower_id?: string | null
          business_outlook?: string
          business_outlook_score?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          industry_comments?: string | null
          industry_risk_level?: string
          industry_risk_score?: number
          industry_sector?: string
          management_comments?: string | null
          management_experience_rating?: number | null
          management_quality_score?: number
          management_track_record_rating?: number | null
          outlook_comments?: string | null
          outlook_score?: number | null
          status?: string | null
          succession_plan_exists?: boolean | null
          total_qualitative_score?: number
          updated_at?: string
          weightage_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "qualitative_assessments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qualitative_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qualitative_assessments_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "borrowers"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_assurance_checks: {
        Row: {
          auto_resolution_applied: boolean | null
          check_type: string
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          issues_detected: Json | null
          manual_review_required: boolean | null
          quality_score: number | null
          resolution_status: string | null
          resolved_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          auto_resolution_applied?: boolean | null
          check_type: string
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          issues_detected?: Json | null
          manual_review_required?: boolean | null
          quality_score?: number | null
          resolution_status?: string | null
          resolved_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          auto_resolution_applied?: boolean | null
          check_type?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          issues_detected?: Json | null
          manual_review_required?: boolean | null
          quality_score?: number | null
          resolution_status?: string | null
          resolved_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: []
      }
      query_performance_logs: {
        Row: {
          cache_hit: boolean | null
          created_at: string
          endpoint: string | null
          execution_time_ms: number
          id: string
          query_hash: string
          query_type: string
          rows_affected: number | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          created_at?: string
          endpoint?: string | null
          execution_time_ms: number
          id?: string
          query_hash: string
          query_type: string
          rows_affected?: number | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          created_at?: string
          endpoint?: string | null
          execution_time_ms?: number
          id?: string
          query_hash?: string
          query_type?: string
          rows_affected?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      quick_actions_log: {
        Row: {
          action_name: string
          action_type: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          executed_by: string
          execution_status: string | null
          execution_time_ms: number | null
          id: string
          parameters: Json | null
          progress_percentage: number | null
          result_data: Json | null
          started_at: string | null
        }
        Insert: {
          action_name: string
          action_type: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          executed_by: string
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: string
          parameters?: Json | null
          progress_percentage?: number | null
          result_data?: Json | null
          started_at?: string | null
        }
        Update: {
          action_name?: string
          action_type?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          executed_by?: string
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: string
          parameters?: Json | null
          progress_percentage?: number | null
          result_data?: Json | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_actions_log_executed_by_fkey"
            columns: ["executed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_checkout_preferences: {
        Row: {
          auto_apply_coupons: boolean | null
          created_at: string | null
          default_billing_address: Json | null
          default_payment_method: string | null
          default_shipping_address: Json | null
          id: string
          skip_review_step: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_apply_coupons?: boolean | null
          created_at?: string | null
          default_billing_address?: Json | null
          default_payment_method?: string | null
          default_shipping_address?: Json | null
          id?: string
          skip_review_step?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_apply_coupons?: boolean | null
          created_at?: string | null
          default_billing_address?: Json | null
          default_payment_method?: string | null
          default_shipping_address?: Json | null
          id?: string
          skip_review_step?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rating_disputes: {
        Row: {
          created_at: string | null
          customer_id: string | null
          dispute_description: string | null
          dispute_reason: string
          dispute_status: string | null
          id: string
          priority_level: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          review_id: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          dispute_description?: string | null
          dispute_reason: string
          dispute_status?: string | null
          id?: string
          priority_level?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          review_id?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          dispute_description?: string | null
          dispute_reason?: string
          dispute_status?: string | null
          id?: string
          priority_level?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          review_id?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_disputes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_policies: {
        Row: {
          created_at: string | null
          created_by: string
          effective_date: string | null
          id: string
          is_active: boolean | null
          policy_content: string
          policy_name: string
          policy_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          policy_content: string
          policy_name: string
          policy_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          policy_content?: string
          policy_name?: string
          policy_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      real_time_analytics_events: {
        Row: {
          event_category: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          order_id: string | null
          product_id: string | null
          recorded_at: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          event_category: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          order_id?: string | null
          product_id?: string | null
          recorded_at?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          event_category?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          order_id?: string | null
          product_id?: string | null
          recorded_at?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      real_time_fraud_alerts: {
        Row: {
          alert_type: string
          assigned_to: string | null
          created_at: string | null
          detection_rules: Json | null
          entity_id: string
          entity_type: string
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          risk_factors: Json | null
          risk_score: number
          severity: string | null
          status: string | null
        }
        Insert: {
          alert_type: string
          assigned_to?: string | null
          created_at?: string | null
          detection_rules?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          risk_factors?: Json | null
          risk_score: number
          severity?: string | null
          status?: string | null
        }
        Update: {
          alert_type?: string
          assigned_to?: string | null
          created_at?: string | null
          detection_rules?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          risk_factors?: Json | null
          risk_score?: number
          severity?: string | null
          status?: string | null
        }
        Relationships: []
      }
      real_time_kpis: {
        Row: {
          calculation_method: string
          created_at: string | null
          current_value: number | null
          data_sources: Json | null
          id: string
          kpi_category: string
          kpi_name: string
          last_calculated: string | null
          target_value: number | null
          trend_direction: string | null
          unit: string | null
        }
        Insert: {
          calculation_method: string
          created_at?: string | null
          current_value?: number | null
          data_sources?: Json | null
          id?: string
          kpi_category: string
          kpi_name: string
          last_calculated?: string | null
          target_value?: number | null
          trend_direction?: string | null
          unit?: string | null
        }
        Update: {
          calculation_method?: string
          created_at?: string | null
          current_value?: number | null
          data_sources?: Json | null
          id?: string
          kpi_category?: string
          kpi_name?: string
          last_calculated?: string | null
          target_value?: number | null
          trend_direction?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      real_time_metrics: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          metric_key: string
          metric_type: string
          metric_value: Json
          recorded_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metric_key: string
          metric_type: string
          metric_value: Json
          recorded_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metric_key?: string
          metric_type?: string
          metric_value?: Json
          recorded_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      realtime_analytics: {
        Row: {
          created_at: string
          device_info: Json | null
          dimensions: Json | null
          geographic_data: Json | null
          id: string
          metric_type: string
          metric_value: number
          page_url: string | null
          referrer: string | null
          session_id: string | null
          timestamp_recorded: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          dimensions?: Json | null
          geographic_data?: Json | null
          id?: string
          metric_type: string
          metric_value: number
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          timestamp_recorded?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          dimensions?: Json | null
          geographic_data?: Json | null
          id?: string
          metric_type?: string
          metric_value?: number
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          timestamp_recorded?: string
          user_id?: string | null
        }
        Relationships: []
      }
      realtime_business_metrics: {
        Row: {
          aggregation_type: string
          created_at: string
          customer_segment: string | null
          dimensions: Json
          geographic_region: string | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          time_window: string
          vendor_id: string | null
        }
        Insert: {
          aggregation_type?: string
          created_at?: string
          customer_segment?: string | null
          dimensions?: Json
          geographic_region?: string | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          time_window: string
          vendor_id?: string | null
        }
        Update: {
          aggregation_type?: string
          created_at?: string
          customer_segment?: string | null
          dimensions?: Json
          geographic_region?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          time_window?: string
          vendor_id?: string | null
        }
        Relationships: []
      }
      realtime_events: {
        Row: {
          broadcasted_at: string | null
          event_data: Json
          event_type: string
          expires_at: string | null
          id: string
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          broadcasted_at?: string | null
          event_data: Json
          event_type: string
          expires_at?: string | null
          id?: string
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          broadcasted_at?: string | null
          event_data?: Json
          event_type?: string
          expires_at?: string | null
          id?: string
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      realtime_feature_usage: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          interaction_count: number | null
          session_id: string | null
          usage_duration: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          interaction_count?: number | null
          session_id?: string | null
          usage_duration?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          interaction_count?: number | null
          session_id?: string | null
          usage_duration?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          product_id: string | null
          user_id: string | null
          view_duration_seconds: number | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          user_id?: string | null
          view_duration_seconds?: number | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          user_id?: string | null
          view_duration_seconds?: number | null
          viewed_at?: string | null
        }
        Relationships: []
      }
      recommendation_engine_data: {
        Row: {
          campaign_id: string | null
          conversion_probability: number | null
          created_at: string | null
          customer_id: string
          expected_revenue: number | null
          expires_at: string | null
          id: string
          reasoning: Json | null
          recommendation_score: number
          recommendation_type: string
          recommended_products: Json
          vendor_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          customer_id: string
          expected_revenue?: number | null
          expires_at?: string | null
          id?: string
          reasoning?: Json | null
          recommendation_score: number
          recommendation_type: string
          recommended_products?: Json
          vendor_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          conversion_probability?: number | null
          created_at?: string | null
          customer_id?: string
          expected_revenue?: number | null
          expires_at?: string | null
          id?: string
          reasoning?: Json | null
          recommendation_score?: number
          recommendation_type?: string
          recommended_products?: Json
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_engine_data_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_models: {
        Row: {
          accuracy_metrics: Json | null
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          model_name: string
          model_parameters: Json
          model_type: string
          training_data_config: Json
          updated_at: string | null
        }
        Insert: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          model_name: string
          model_parameters?: Json
          model_type: string
          training_data_config?: Json
          updated_at?: string | null
        }
        Update: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          model_name?: string
          model_parameters?: Json
          model_type?: string
          training_data_config?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_referrals_per_user: number | null
          minimum_purchase_amount: number | null
          name: string
          referee_reward_amount: number | null
          referee_reward_points: number | null
          referrer_reward_amount: number | null
          referrer_reward_points: number | null
          start_date: string | null
          terms_conditions: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_referrals_per_user?: number | null
          minimum_purchase_amount?: number | null
          name: string
          referee_reward_amount?: number | null
          referee_reward_points?: number | null
          referrer_reward_amount?: number | null
          referrer_reward_points?: number | null
          start_date?: string | null
          terms_conditions?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_referrals_per_user?: number | null
          minimum_purchase_amount?: number | null
          name?: string
          referee_reward_amount?: number | null
          referee_reward_points?: number | null
          referrer_reward_amount?: number | null
          referrer_reward_points?: number | null
          start_date?: string | null
          terms_conditions?: string | null
        }
        Relationships: []
      }
      referral_links: {
        Row: {
          campaign_id: string | null
          click_count: number | null
          conversion_count: number | null
          created_at: string | null
          custom_message: string | null
          id: string
          is_active: boolean | null
          referral_code: string
          total_earned_amount: number | null
          total_earned_points: number | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          click_count?: number | null
          conversion_count?: number | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_active?: boolean | null
          referral_code: string
          total_earned_amount?: number | null
          total_earned_points?: number | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          click_count?: number | null
          conversion_count?: number | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_active?: boolean | null
          referral_code?: string
          total_earned_amount?: number | null
          total_earned_points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "referral_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_programs: {
        Row: {
          completed_at: string | null
          completion_criteria: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          referee_id: string | null
          referee_reward: Json | null
          referral_code: string
          referrer_id: string | null
          referrer_reward: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_criteria?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          referee_id?: string | null
          referee_reward?: Json | null
          referral_code: string
          referrer_id?: string | null
          referrer_reward?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_criteria?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          referee_id?: string | null
          referee_reward?: Json | null
          referral_code?: string
          referrer_id?: string | null
          referrer_reward?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      regional_business_hours: {
        Row: {
          business_type: string
          created_at: string | null
          district: string | null
          friday_hours: Json | null
          holiday_schedule: Json | null
          id: string
          is_active: boolean | null
          ramadan_hours: Json | null
          region_name: string
          updated_at: string | null
          weekday_hours: Json
          weekend_hours: Json | null
        }
        Insert: {
          business_type: string
          created_at?: string | null
          district?: string | null
          friday_hours?: Json | null
          holiday_schedule?: Json | null
          id?: string
          is_active?: boolean | null
          ramadan_hours?: Json | null
          region_name: string
          updated_at?: string | null
          weekday_hours: Json
          weekend_hours?: Json | null
        }
        Update: {
          business_type?: string
          created_at?: string | null
          district?: string | null
          friday_hours?: Json | null
          holiday_schedule?: Json | null
          id?: string
          is_active?: boolean | null
          ramadan_hours?: Json | null
          region_name?: string
          updated_at?: string | null
          weekday_hours?: Json
          weekend_hours?: Json | null
        }
        Relationships: []
      }
      regional_inventory: {
        Row: {
          available_stock: number | null
          created_at: string | null
          current_stock: number
          id: string
          last_restocked: string | null
          lead_time_days: number | null
          max_stock_level: number | null
          product_id: string | null
          region_id: string | null
          regional_pricing: Json
          reorder_point: number | null
          reserved_stock: number
          shipping_options: Json
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          available_stock?: number | null
          created_at?: string | null
          current_stock?: number
          id?: string
          last_restocked?: string | null
          lead_time_days?: number | null
          max_stock_level?: number | null
          product_id?: string | null
          region_id?: string | null
          regional_pricing?: Json
          reorder_point?: number | null
          reserved_stock?: number
          shipping_options?: Json
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          available_stock?: number | null
          created_at?: string | null
          current_stock?: number
          id?: string
          last_restocked?: string | null
          lead_time_days?: number | null
          max_stock_level?: number | null
          product_id?: string | null
          region_id?: string | null
          regional_pricing?: Json
          reorder_point?: number | null
          reserved_stock?: number
          shipping_options?: Json
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regional_inventory_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "geo_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      report_executions: {
        Row: {
          created_at: string | null
          delivery_status: Json | null
          error_message: string | null
          execution_end: string | null
          execution_start: string | null
          execution_status: string
          file_path: string | null
          file_size: number | null
          generation_time_ms: number | null
          id: string
          recipients_sent: Json | null
          report_data: Json | null
          scheduled_report_id: string | null
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_status?: Json | null
          error_message?: string | null
          execution_end?: string | null
          execution_start?: string | null
          execution_status?: string
          file_path?: string | null
          file_size?: number | null
          generation_time_ms?: number | null
          id?: string
          recipients_sent?: Json | null
          report_data?: Json | null
          scheduled_report_id?: string | null
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_status?: Json | null
          error_message?: string | null
          execution_end?: string | null
          execution_start?: string | null
          execution_status?: string
          file_path?: string | null
          file_size?: number | null
          generation_time_ms?: number | null
          id?: string
          recipients_sent?: Json | null
          report_data?: Json | null
          scheduled_report_id?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_executions_scheduled_report_id_fkey"
            columns: ["scheduled_report_id"]
            isOneToOne: false
            referencedRelation: "scheduled_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_executions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "custom_report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_subscriptions: {
        Row: {
          created_at: string | null
          delivery_count: number | null
          delivery_preferences: Json | null
          id: string
          is_active: boolean | null
          last_delivered: string | null
          scheduled_report_id: string | null
          subscription_type: string
          updated_at: string | null
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_count?: number | null
          delivery_preferences?: Json | null
          id?: string
          is_active?: boolean | null
          last_delivered?: string | null
          scheduled_report_id?: string | null
          subscription_type: string
          updated_at?: string | null
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_count?: number | null
          delivery_preferences?: Json | null
          id?: string
          is_active?: boolean | null
          last_delivered?: string | null
          scheduled_report_id?: string | null
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_subscriptions_scheduled_report_id_fkey"
            columns: ["scheduled_report_id"]
            isOneToOne: false
            referencedRelation: "scheduled_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_subscriptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      request_batching_queues: {
        Row: {
          batch_id: string
          batch_size: number | null
          created_at: string | null
          id: string
          priority: number | null
          processed_at: string | null
          processing_delay_ms: number | null
          request_data: Json
          request_type: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          batch_id: string
          batch_size?: number | null
          created_at?: string | null
          id?: string
          priority?: number | null
          processed_at?: string | null
          processing_delay_ms?: number | null
          request_data: Json
          request_type: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          batch_id?: string
          batch_size?: number | null
          created_at?: string | null
          id?: string
          priority?: number | null
          processed_at?: string | null
          processing_delay_ms?: number | null
          request_data?: Json
          request_type?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      request_deduplication_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          last_accessed: string | null
          request_count: number | null
          request_hash: string
          response_data: Json
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          last_accessed?: string | null
          request_count?: number | null
          request_hash: string
          response_data: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          last_accessed?: string | null
          request_count?: number | null
          request_hash?: string
          response_data?: Json
        }
        Relationships: []
      }
      request_optimization_logs: {
        Row: {
          bandwidth_saved: number | null
          compression_ratio: number
          created_at: string | null
          endpoint: string | null
          id: string
          optimization_type: string
          optimized_size: number
          original_size: number
          processing_time_ms: number
          request_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          bandwidth_saved?: number | null
          compression_ratio: number
          created_at?: string | null
          endpoint?: string | null
          id?: string
          optimization_type: string
          optimized_size: number
          original_size: number
          processing_time_ms: number
          request_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          bandwidth_saved?: number | null
          compression_ratio?: number
          created_at?: string | null
          endpoint?: string | null
          id?: string
          optimization_type?: string
          optimized_size?: number
          original_size?: number
          processing_time_ms?: number
          request_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      revenue_analytics_summary: {
        Row: {
          analytics_date: string
          analytics_period: string
          average_order_value: number | null
          category_id: string | null
          commission_rate_avg: number | null
          created_at: string | null
          growth_rate: number | null
          id: string
          market_share: number | null
          net_revenue: number | null
          platform_fees: number | null
          processing_fees: number | null
          total_commission: number | null
          total_revenue: number | null
          transaction_count: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          analytics_date: string
          analytics_period: string
          average_order_value?: number | null
          category_id?: string | null
          commission_rate_avg?: number | null
          created_at?: string | null
          growth_rate?: number | null
          id?: string
          market_share?: number | null
          net_revenue?: number | null
          platform_fees?: number | null
          processing_fees?: number | null
          total_commission?: number | null
          total_revenue?: number | null
          transaction_count?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          analytics_date?: string
          analytics_period?: string
          average_order_value?: number | null
          category_id?: string | null
          commission_rate_avg?: number | null
          created_at?: string | null
          growth_rate?: number | null
          id?: string
          market_share?: number | null
          net_revenue?: number | null
          platform_fees?: number | null
          processing_fees?: number | null
          total_commission?: number | null
          total_revenue?: number | null
          transaction_count?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      revenue_disputes: {
        Row: {
          assigned_to: string | null
          claimed_amount: number | null
          commission_id: string | null
          created_at: string | null
          dispute_amount: number
          dispute_description: string | null
          dispute_number: string
          dispute_reason: string
          dispute_type: string
          escalation_level: number | null
          evidence_documents: Json | null
          expected_resolution_date: string | null
          id: string
          priority_level: string | null
          resolution_amount: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          assigned_to?: string | null
          claimed_amount?: number | null
          commission_id?: string | null
          created_at?: string | null
          dispute_amount: number
          dispute_description?: string | null
          dispute_number: string
          dispute_reason: string
          dispute_type: string
          escalation_level?: number | null
          evidence_documents?: Json | null
          expected_resolution_date?: string | null
          id?: string
          priority_level?: string | null
          resolution_amount?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          assigned_to?: string | null
          claimed_amount?: number | null
          commission_id?: string | null
          created_at?: string | null
          dispute_amount?: number
          dispute_description?: string | null
          dispute_number?: string
          dispute_reason?: string
          dispute_type?: string
          escalation_level?: number | null
          evidence_documents?: Json | null
          expected_resolution_date?: string | null
          id?: string
          priority_level?: string | null
          resolution_amount?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      revenue_forecasts: {
        Row: {
          actual_commission: number | null
          actual_revenue: number | null
          category_id: string | null
          confidence_score: number | null
          created_at: string | null
          forecast_date: string
          forecast_factors: Json | null
          forecast_period: string
          id: string
          model_version: string | null
          predicted_commission: number
          predicted_revenue: number
          updated_at: string | null
          variance_percentage: number | null
          vendor_id: string | null
        }
        Insert: {
          actual_commission?: number | null
          actual_revenue?: number | null
          category_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          forecast_date: string
          forecast_factors?: Json | null
          forecast_period: string
          id?: string
          model_version?: string | null
          predicted_commission: number
          predicted_revenue: number
          updated_at?: string | null
          variance_percentage?: number | null
          vendor_id?: string | null
        }
        Update: {
          actual_commission?: number | null
          actual_revenue?: number | null
          category_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          forecast_date?: string
          forecast_factors?: Json | null
          forecast_period?: string
          id?: string
          model_version?: string | null
          predicted_commission?: number
          predicted_revenue?: number
          updated_at?: string | null
          variance_percentage?: number | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      revenue_models: {
        Row: {
          base_rate: number
          category_rates: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          maximum_threshold: number | null
          minimum_threshold: number | null
          model_name: string
          model_type: string
          tier_structure: Json | null
          updated_at: string | null
        }
        Insert: {
          base_rate?: number
          category_rates?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          maximum_threshold?: number | null
          minimum_threshold?: number | null
          model_name: string
          model_type: string
          tier_structure?: Json | null
          updated_at?: string | null
        }
        Update: {
          base_rate?: number
          category_rates?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          maximum_threshold?: number | null
          minimum_threshold?: number | null
          model_name?: string
          model_type?: string
          tier_structure?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      revenue_split_config: {
        Row: {
          category_overrides: Json | null
          config_name: string
          created_at: string | null
          created_by: string
          effective_date: string
          id: string
          insurance_fee_percentage: number
          is_active: boolean | null
          platform_fee_percentage: number
          processing_fee_percentage: number
          tax_reserve_percentage: number
          updated_at: string | null
          vendor_share_percentage: number
          vendor_tier_adjustments: Json | null
        }
        Insert: {
          category_overrides?: Json | null
          config_name: string
          created_at?: string | null
          created_by: string
          effective_date?: string
          id?: string
          insurance_fee_percentage?: number
          is_active?: boolean | null
          platform_fee_percentage?: number
          processing_fee_percentage?: number
          tax_reserve_percentage?: number
          updated_at?: string | null
          vendor_share_percentage?: number
          vendor_tier_adjustments?: Json | null
        }
        Update: {
          category_overrides?: Json | null
          config_name?: string
          created_at?: string | null
          created_by?: string
          effective_date?: string
          id?: string
          insurance_fee_percentage?: number
          is_active?: boolean | null
          platform_fee_percentage?: number
          processing_fee_percentage?: number
          tax_reserve_percentage?: number
          updated_at?: string | null
          vendor_share_percentage?: number
          vendor_tier_adjustments?: Json | null
        }
        Relationships: []
      }
      review_helpfulness: {
        Row: {
          created_at: string | null
          id: string
          is_helpful: boolean
          review_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_helpful: boolean
          review_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_helpful?: boolean
          review_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_helpfulness_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_moderation: {
        Row: {
          created_at: string | null
          customer_name: string | null
          flags: Json | null
          id: string
          moderation_notes: string | null
          moderation_status: string | null
          moderator_id: string | null
          priority_level: string | null
          product_name: string | null
          rating: number | null
          review_id: string | null
          review_text: string | null
          risk_score: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          flags?: Json | null
          id?: string
          moderation_notes?: string | null
          moderation_status?: string | null
          moderator_id?: string | null
          priority_level?: string | null
          product_name?: string | null
          rating?: number | null
          review_id?: string | null
          review_text?: string | null
          risk_score?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          flags?: Json | null
          id?: string
          moderation_notes?: string | null
          moderation_status?: string | null
          moderator_id?: string | null
          priority_level?: string | null
          product_name?: string | null
          rating?: number | null
          review_id?: string | null
          review_text?: string | null
          risk_score?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_moderation_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      rural_connectivity_profiles: {
        Row: {
          average_bandwidth_kbps: number | null
          compression_level: string | null
          connection_stability_score: number | null
          created_at: string | null
          district: string
          id: string
          offline_sync_enabled: boolean | null
          preferred_data_mode: string | null
          sms_fallback_enabled: boolean | null
          upazila: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_bandwidth_kbps?: number | null
          compression_level?: string | null
          connection_stability_score?: number | null
          created_at?: string | null
          district: string
          id?: string
          offline_sync_enabled?: boolean | null
          preferred_data_mode?: string | null
          sms_fallback_enabled?: boolean | null
          upazila?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_bandwidth_kbps?: number | null
          compression_level?: string | null
          connection_stability_score?: number | null
          created_at?: string | null
          district?: string
          id?: string
          offline_sync_enabled?: boolean | null
          preferred_data_mode?: string | null
          sms_fallback_enabled?: boolean | null
          upazila?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_analytics: {
        Row: {
          analytics_date: string
          analytics_period: string
          average_order_value: number | null
          conversion_rate: number | null
          created_at: string | null
          growth_metrics: Json | null
          id: string
          new_customers: number | null
          peak_hours: Json | null
          return_rate: number | null
          returning_customers: number | null
          revenue_by_category: Json | null
          top_selling_products: Json | null
          total_orders: number | null
          total_profit: number | null
          total_revenue: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          analytics_date?: string
          analytics_period?: string
          average_order_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          growth_metrics?: Json | null
          id?: string
          new_customers?: number | null
          peak_hours?: Json | null
          return_rate?: number | null
          returning_customers?: number | null
          revenue_by_category?: Json | null
          top_selling_products?: Json | null
          total_orders?: number | null
          total_profit?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          analytics_date?: string
          analytics_period?: string
          average_order_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          growth_metrics?: Json | null
          id?: string
          new_customers?: number | null
          peak_hours?: Json | null
          return_rate?: number | null
          returning_customers?: number | null
          revenue_by_category?: Json | null
          top_selling_products?: Json | null
          total_orders?: number | null
          total_profit?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          created_by: string
          error_log: Json | null
          generation_status: string | null
          id: string
          is_active: boolean | null
          last_generated: string | null
          next_generation: string | null
          recipients: Json
          report_format: string
          report_name: string
          schedule_config: Json
          template_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          error_log?: Json | null
          generation_status?: string | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_generation?: string | null
          recipients?: Json
          report_format?: string
          report_name: string
          schedule_config?: Json
          template_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          error_log?: Json | null
          generation_status?: string | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_generation?: string | null
          recipients?: Json
          report_format?: string
          report_name?: string
          schedule_config?: Json
          template_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "custom_report_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reports_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          click_through_rate: number | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          results_count: number | null
          search_filters: Json | null
          search_query: string
          search_type: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          click_through_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query: string
          search_type?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          click_through_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_query?: string
          search_type?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      search_index: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_id: string
          item_type: string
          metadata: Json | null
          searchable_content: unknown | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_id: string
          item_type: string
          metadata?: Json | null
          searchable_content?: unknown | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_id?: string
          item_type?: string
          metadata?: Json | null
          searchable_content?: unknown | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      search_indexes: {
        Row: {
          created_at: string | null
          elasticsearch_index: string
          id: string
          index_name: string
          index_type: string
          is_active: boolean | null
          last_sync_at: string | null
          mapping_config: Json
          settings_config: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          elasticsearch_index: string
          id?: string
          index_name: string
          index_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          mapping_config?: Json
          settings_config?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          elasticsearch_index?: string
          id?: string
          index_name?: string
          index_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          mapping_config?: Json
          settings_config?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      search_personalization: {
        Row: {
          brand_preferences: Json
          category_weights: Json
          created_at: string | null
          id: string
          last_updated: string | null
          personalization_score: number | null
          price_sensitivity: number | null
          quality_preference: number | null
          search_preferences: Json
          user_id: string | null
        }
        Insert: {
          brand_preferences?: Json
          category_weights?: Json
          created_at?: string | null
          id?: string
          last_updated?: string | null
          personalization_score?: number | null
          price_sensitivity?: number | null
          quality_preference?: number | null
          search_preferences?: Json
          user_id?: string | null
        }
        Update: {
          brand_preferences?: Json
          category_weights?: Json
          created_at?: string | null
          id?: string
          last_updated?: string | null
          personalization_score?: number | null
          price_sensitivity?: number | null
          quality_preference?: number | null
          search_preferences?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          clicked_product_id: string | null
          created_at: string | null
          id: string
          query: string
          results_count: number | null
          user_id: string | null
        }
        Insert: {
          clicked_product_id?: string | null
          created_at?: string | null
          id?: string
          query: string
          results_count?: number | null
          user_id?: string | null
        }
        Update: {
          clicked_product_id?: string | null
          created_at?: string | null
          id?: string
          query?: string
          results_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_clicked_product_id_fkey"
            columns: ["clicked_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      search_result_optimization: {
        Row: {
          clicked_results: Json
          device_type: string | null
          geo_location: Json | null
          id: string
          optimization_score: number | null
          personalization_applied: boolean | null
          purchased_results: Json
          relevance_feedback: Json | null
          result_ranking_algorithm: string | null
          results_shown: Json
          search_query: string
          search_timestamp: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_results?: Json
          device_type?: string | null
          geo_location?: Json | null
          id?: string
          optimization_score?: number | null
          personalization_applied?: boolean | null
          purchased_results?: Json
          relevance_feedback?: Json | null
          result_ranking_algorithm?: string | null
          results_shown?: Json
          search_query: string
          search_timestamp?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_results?: Json
          device_type?: string | null
          geo_location?: Json | null
          id?: string
          optimization_score?: number | null
          personalization_applied?: boolean | null
          purchased_results?: Json
          relevance_feedback?: Json | null
          result_ranking_algorithm?: string | null
          results_shown?: Json
          search_query?: string
          search_timestamp?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_context_analysis: {
        Row: {
          analysis_timestamp: string
          anomaly_scores: Json
          behavioral_context: Json
          confidence_score: number
          context_type: string
          device_context: Json
          expires_at: string
          geolocation_context: Json
          id: string
          network_context: Json
          recommended_actions: Json
          risk_assessment: Json
          session_id: string
          threat_indicators: Json
        }
        Insert: {
          analysis_timestamp?: string
          anomaly_scores?: Json
          behavioral_context?: Json
          confidence_score?: number
          context_type: string
          device_context?: Json
          expires_at: string
          geolocation_context?: Json
          id?: string
          network_context?: Json
          recommended_actions?: Json
          risk_assessment?: Json
          session_id: string
          threat_indicators?: Json
        }
        Update: {
          analysis_timestamp?: string
          anomaly_scores?: Json
          behavioral_context?: Json
          confidence_score?: number
          context_type?: string
          device_context?: Json
          expires_at?: string
          geolocation_context?: Json
          id?: string
          network_context?: Json
          recommended_actions?: Json
          risk_assessment?: Json
          session_id?: string
          threat_indicators?: Json
        }
        Relationships: []
      }
      security_events: {
        Row: {
          ai_risk_score: number | null
          automated_response: string | null
          created_at: string
          event_details: Json
          event_type: string
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          location_data: Json | null
          ml_model_version: string | null
          resolution_status: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity_level: string
          threat_category: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ai_risk_score?: number | null
          automated_response?: string | null
          created_at?: string
          event_details?: Json
          event_type: string
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          location_data?: Json | null
          ml_model_version?: string | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string
          threat_category?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ai_risk_score?: number | null
          automated_response?: string | null
          created_at?: string
          event_details?: Json
          event_type?: string
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          location_data?: Json | null
          ml_model_version?: string | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string
          threat_category?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_events_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      semantic_search_vectors: {
        Row: {
          content_id: string
          content_text: string
          content_type: string
          created_at: string | null
          id: string
          language: string | null
          model_version: string | null
          updated_at: string | null
          vector_embedding: string | null
        }
        Insert: {
          content_id: string
          content_text: string
          content_type: string
          created_at?: string | null
          id?: string
          language?: string | null
          model_version?: string | null
          updated_at?: string | null
          vector_embedding?: string | null
        }
        Update: {
          content_id?: string
          content_text?: string
          content_type?: string
          created_at?: string | null
          id?: string
          language?: string | null
          model_version?: string | null
          updated_at?: string | null
          vector_embedding?: string | null
        }
        Relationships: []
      }
      service_communication_logs: {
        Row: {
          correlation_id: string | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          operation: string
          request_data: Json | null
          response_data: Json | null
          source_service: string
          status_code: number | null
          target_service: string
        }
        Insert: {
          correlation_id?: string | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          operation: string
          request_data?: Json | null
          response_data?: Json | null
          source_service: string
          status_code?: number | null
          target_service: string
        }
        Update: {
          correlation_id?: string | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          operation?: string
          request_data?: Json | null
          response_data?: Json | null
          source_service?: string
          status_code?: number | null
          target_service?: string
        }
        Relationships: []
      }
      service_health_metrics: {
        Row: {
          active_connections: number
          alert_thresholds: Json
          availability_percentage: number
          circuit_breaker_state: string
          cpu_utilization: number
          created_at: string
          error_rate: number
          health_score: number
          id: string
          last_health_check: string
          memory_utilization: number
          response_time_avg: number
          service_name: string
          throughput_rps: number
        }
        Insert: {
          active_connections?: number
          alert_thresholds?: Json
          availability_percentage?: number
          circuit_breaker_state?: string
          cpu_utilization?: number
          created_at?: string
          error_rate?: number
          health_score?: number
          id?: string
          last_health_check?: string
          memory_utilization?: number
          response_time_avg?: number
          service_name: string
          throughput_rps?: number
        }
        Update: {
          active_connections?: number
          alert_thresholds?: Json
          availability_percentage?: number
          circuit_breaker_state?: string
          cpu_utilization?: number
          created_at?: string
          error_rate?: number
          health_score?: number
          id?: string
          last_health_check?: string
          memory_utilization?: number
          response_time_avg?: number
          service_name?: string
          throughput_rps?: number
        }
        Relationships: []
      }
      service_mesh_config: {
        Row: {
          authentication_policy: Json
          authorization_policy: Json
          circuit_breaker_config: Json
          created_at: string | null
          destination_rules: Json
          gateway_config: Json
          id: string
          is_active: boolean | null
          load_balancing_config: Json
          observability_config: Json
          retry_policy: Json
          service_name: string
          timeout_config: Json
          tls_config: Json
          traffic_policy: Json
          updated_at: string | null
          virtual_service_config: Json
        }
        Insert: {
          authentication_policy?: Json
          authorization_policy?: Json
          circuit_breaker_config?: Json
          created_at?: string | null
          destination_rules?: Json
          gateway_config?: Json
          id?: string
          is_active?: boolean | null
          load_balancing_config?: Json
          observability_config?: Json
          retry_policy?: Json
          service_name: string
          timeout_config?: Json
          tls_config?: Json
          traffic_policy?: Json
          updated_at?: string | null
          virtual_service_config?: Json
        }
        Update: {
          authentication_policy?: Json
          authorization_policy?: Json
          circuit_breaker_config?: Json
          created_at?: string | null
          destination_rules?: Json
          gateway_config?: Json
          id?: string
          is_active?: boolean | null
          load_balancing_config?: Json
          observability_config?: Json
          retry_policy?: Json
          service_name?: string
          timeout_config?: Json
          tls_config?: Json
          traffic_policy?: Json
          updated_at?: string | null
          virtual_service_config?: Json
        }
        Relationships: []
      }
      shipping_rates: {
        Row: {
          base_rate: number
          created_at: string | null
          id: string
          is_active: boolean | null
          max_delivery_days: number | null
          method_name: string
          min_delivery_days: number | null
          volume_rate: number | null
          weight_rate: number | null
          zone_id: string | null
        }
        Insert: {
          base_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_delivery_days?: number | null
          method_name: string
          min_delivery_days?: number | null
          volume_rate?: number | null
          weight_rate?: number | null
          zone_id?: string | null
        }
        Update: {
          base_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_delivery_days?: number | null
          method_name?: string
          min_delivery_days?: number | null
          volume_rate?: number | null
          weight_rate?: number | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_rates_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "shipping_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_service_partners: {
        Row: {
          api_config: Json
          capabilities: Json
          created_at: string
          id: string
          is_active: boolean
          partner_code: string
          partner_name: string
          partner_type: string
          pricing_structure: Json
          service_areas: Json
          sla_metrics: Json
          updated_at: string
        }
        Insert: {
          api_config?: Json
          capabilities?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          partner_code: string
          partner_name: string
          partner_type: string
          pricing_structure?: Json
          service_areas?: Json
          sla_metrics?: Json
          updated_at?: string
        }
        Update: {
          api_config?: Json
          capabilities?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          partner_code?: string
          partner_name?: string
          partner_type?: string
          pricing_structure?: Json
          service_areas?: Json
          sla_metrics?: Json
          updated_at?: string
        }
        Relationships: []
      }
      shipping_service_shipments: {
        Row: {
          actual_delivery: string | null
          created_at: string
          destination_address: Json
          estimated_delivery: string | null
          id: string
          order_id: string
          origin_address: Json
          package_details: Json
          partner_id: string
          shipment_number: string
          shipping_cost: number
          status: string
          tracking_events: Json
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string
          destination_address: Json
          estimated_delivery?: string | null
          id?: string
          order_id: string
          origin_address: Json
          package_details?: Json
          partner_id: string
          shipment_number: string
          shipping_cost: number
          status?: string
          tracking_events?: Json
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string
          destination_address?: Json
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          origin_address?: Json
          package_details?: Json
          partner_id?: string
          shipment_number?: string
          shipping_cost?: number
          status?: string
          tracking_events?: Json
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_service_shipments_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "shipping_service_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones: {
        Row: {
          countries: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          postal_codes: Json | null
          shipping_methods: Json | null
          states_provinces: Json | null
          updated_at: string | null
          zone_name: string
        }
        Insert: {
          countries?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          postal_codes?: Json | null
          shipping_methods?: Json | null
          states_provinces?: Json | null
          updated_at?: string | null
          zone_name: string
        }
        Update: {
          countries?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          postal_codes?: Json | null
          shipping_methods?: Json | null
          states_provinces?: Json | null
          updated_at?: string | null
          zone_name?: string
        }
        Relationships: []
      }
      shopping_cart: {
        Row: {
          added_at: string | null
          id: string
          product_id: string | null
          quantity: number
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_cart_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_configurations: {
        Row: {
          created_at: string
          critical_threshold: number
          escalation_policy: Json
          evaluation_frequency: unknown
          id: string
          is_active: boolean | null
          measurement_window: unknown
          service_name: string
          sla_type: string
          target_value: number
          updated_at: string
          warning_threshold: number
        }
        Insert: {
          created_at?: string
          critical_threshold: number
          escalation_policy?: Json
          evaluation_frequency?: unknown
          id?: string
          is_active?: boolean | null
          measurement_window?: unknown
          service_name: string
          sla_type: string
          target_value: number
          updated_at?: string
          warning_threshold: number
        }
        Update: {
          created_at?: string
          critical_threshold?: number
          escalation_policy?: Json
          evaluation_frequency?: unknown
          id?: string
          is_active?: boolean | null
          measurement_window?: unknown
          service_name?: string
          sla_type?: string
          target_value?: number
          updated_at?: string
          warning_threshold?: number
        }
        Relationships: []
      }
      sla_tracking: {
        Row: {
          actual_value: number | null
          breach_count: number | null
          breach_details: Json | null
          compliance_status: string | null
          created_at: string | null
          id: string
          measurement_period: unknown
          period_end: string
          period_start: string
          service_name: string
          sla_type: string
          target_value: number
        }
        Insert: {
          actual_value?: number | null
          breach_count?: number | null
          breach_details?: Json | null
          compliance_status?: string | null
          created_at?: string | null
          id?: string
          measurement_period: unknown
          period_end: string
          period_start: string
          service_name: string
          sla_type: string
          target_value: number
        }
        Update: {
          actual_value?: number | null
          breach_count?: number | null
          breach_details?: Json | null
          compliance_status?: string | null
          created_at?: string | null
          id?: string
          measurement_period?: unknown
          period_end?: string
          period_start?: string
          service_name?: string
          sla_type?: string
          target_value?: number
        }
        Relationships: []
      }
      sla_violations: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string
          current_value: number
          duration_minutes: number
          expected_value: number
          id: string
          impact_assessment: Json | null
          mitigation_actions: Json | null
          resolved_at: string | null
          resolved_by: string | null
          root_cause_analysis: Json | null
          sla_config_id: string
          status: string | null
          violation_type: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          current_value: number
          duration_minutes: number
          expected_value: number
          id?: string
          impact_assessment?: Json | null
          mitigation_actions?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          root_cause_analysis?: Json | null
          sla_config_id: string
          status?: string | null
          violation_type: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          current_value?: number
          duration_minutes?: number
          expected_value?: number
          id?: string
          impact_assessment?: Json | null
          mitigation_actions?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          root_cause_analysis?: Json | null
          sla_config_id?: string
          status?: string | null
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_violations_sla_config_id_fkey"
            columns: ["sla_config_id"]
            isOneToOne: false
            referencedRelation: "sla_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_reorder_suggestions: {
        Row: {
          cost_analysis: Json | null
          created_at: string | null
          demand_forecast: Json | null
          id: string
          priority_score: number | null
          product_id: string
          status: string | null
          suggested_quantity: number
          suggested_reorder_date: string
          supplier_lead_time: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          cost_analysis?: Json | null
          created_at?: string | null
          demand_forecast?: Json | null
          id?: string
          priority_score?: number | null
          product_id: string
          status?: string | null
          suggested_quantity: number
          suggested_reorder_date: string
          supplier_lead_time?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          cost_analysis?: Json | null
          created_at?: string | null
          demand_forecast?: Json | null
          id?: string
          priority_score?: number | null
          product_id?: string
          status?: string | null
          suggested_quantity?: number
          suggested_reorder_date?: string
          supplier_lead_time?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      social_commerce_features: {
        Row: {
          content_data: Json
          created_at: string | null
          engagement_metrics: Json | null
          expires_at: string | null
          feature_type: string
          id: string
          influence_network: Json | null
          social_proof_indicators: Json | null
          user_id: string | null
          virality_score: number | null
        }
        Insert: {
          content_data?: Json
          created_at?: string | null
          engagement_metrics?: Json | null
          expires_at?: string | null
          feature_type: string
          id?: string
          influence_network?: Json | null
          social_proof_indicators?: Json | null
          user_id?: string | null
          virality_score?: number | null
        }
        Update: {
          content_data?: Json
          created_at?: string | null
          engagement_metrics?: Json | null
          expires_at?: string | null
          feature_type?: string
          id?: string
          influence_network?: Json | null
          social_proof_indicators?: Json | null
          user_id?: string | null
          virality_score?: number | null
        }
        Relationships: []
      }
      social_feeds: {
        Row: {
          content_data: Json
          content_type: string
          created_at: string | null
          engagement_metrics: Json | null
          id: string
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          content_data: Json
          content_type: string
          created_at?: string | null
          engagement_metrics?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          content_data?: Json
          content_type?: string
          created_at?: string | null
          engagement_metrics?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      social_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      social_media_accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          profile_data: Json | null
          refresh_token: string | null
          social_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          profile_data?: Json | null
          refresh_token?: string | null
          social_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          profile_data?: Json | null
          refresh_token?: string | null
          social_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_media_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          integration_settings: Json | null
          is_active: boolean | null
          platform: string
          platform_user_id: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          integration_settings?: Json | null
          is_active?: boolean | null
          platform: string
          platform_user_id: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          integration_settings?: Json | null
          is_active?: boolean | null
          platform?: string
          platform_user_id?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stock_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          current_value: number | null
          id: string
          inventory_id: string
          is_acknowledged: boolean
          message: string
          metadata: Json | null
          resolved_at: string | null
          severity: string
          threshold_value: number | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          current_value?: number | null
          id?: string
          inventory_id: string
          is_acknowledged?: boolean
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          threshold_value?: number | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          current_value?: number | null
          id?: string
          inventory_id?: string
          is_acknowledged?: boolean
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          threshold_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_alerts_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          id: string
          movement_type: string
          new_stock: number
          performed_by: string | null
          previous_stock: number
          product_id: string
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          movement_type: string
          new_stock: number
          performed_by?: string | null
          previous_stock: number
          product_id: string
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          movement_type?: string
          new_stock?: number
          performed_by?: string | null
          previous_stock?: number
          product_id?: string
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      strategic_planning_insights: {
        Row: {
          business_impact: number | null
          created_at: string | null
          created_by: string | null
          id: string
          implementation_complexity: number | null
          insight_category: string
          insight_description: string
          insight_title: string
          resource_requirements: Json | null
          risk_factors: Json | null
          status: string | null
          strategic_priority: string | null
          success_metrics: Json | null
          timeline_estimate: string | null
        }
        Insert: {
          business_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          implementation_complexity?: number | null
          insight_category: string
          insight_description: string
          insight_title: string
          resource_requirements?: Json | null
          risk_factors?: Json | null
          status?: string | null
          strategic_priority?: string | null
          success_metrics?: Json | null
          timeline_estimate?: string | null
        }
        Update: {
          business_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          implementation_complexity?: number | null
          insight_category?: string
          insight_description?: string
          insight_title?: string
          resource_requirements?: Json | null
          risk_factors?: Json | null
          status?: string | null
          strategic_priority?: string | null
          success_metrics?: Json | null
          timeline_estimate?: string | null
        }
        Relationships: []
      }
      success_metrics: {
        Row: {
          additional_data: Json | null
          created_at: string
          id: string
          measurement_date: string
          metric_category: string
          metric_name: string
          metric_unit: string
          metric_value: number
          target_value: number
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          measurement_date?: string
          metric_category: string
          metric_name: string
          metric_unit: string
          metric_value: number
          target_value: number
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          measurement_date?: string
          metric_category?: string
          metric_name?: string
          metric_unit?: string
          metric_value?: number
          target_value?: number
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          certifications: Json | null
          contact_info: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          lead_time_days: number | null
          minimum_order_quantity: number | null
          payment_terms: string | null
          performance_rating: number | null
          supplier_name: string
          updated_at: string | null
        }
        Insert: {
          certifications?: Json | null
          contact_info?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          payment_terms?: string | null
          performance_rating?: number | null
          supplier_name: string
          updated_at?: string | null
        }
        Update: {
          certifications?: Json | null
          contact_info?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          payment_terms?: string | null
          performance_rating?: number | null
          supplier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supply_chain_analytics: {
        Row: {
          analytics_date: string | null
          cost_efficiency: number | null
          created_at: string | null
          demand_forecast: Json | null
          id: string
          inventory_levels: Json | null
          on_time_delivery_rate: number | null
          quality_score: number | null
          supplier_id: string | null
        }
        Insert: {
          analytics_date?: string | null
          cost_efficiency?: number | null
          created_at?: string | null
          demand_forecast?: Json | null
          id?: string
          inventory_levels?: Json | null
          on_time_delivery_rate?: number | null
          quality_score?: number | null
          supplier_id?: string | null
        }
        Update: {
          analytics_date?: string | null
          cost_efficiency?: number | null
          created_at?: string | null
          demand_forecast?: Json | null
          id?: string
          inventory_levels?: Json | null
          on_time_delivery_rate?: number | null
          quality_score?: number | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_analytics_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_chain_events: {
        Row: {
          actual_arrival: string | null
          carrier_info: Json | null
          created_at: string | null
          entity_id: string
          entity_type: string
          estimated_arrival: string | null
          event_type: string
          id: string
          location: Json | null
          status_details: Json | null
          tracking_number: string | null
        }
        Insert: {
          actual_arrival?: string | null
          carrier_info?: Json | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          estimated_arrival?: string | null
          event_type: string
          id?: string
          location?: Json | null
          status_details?: Json | null
          tracking_number?: string | null
        }
        Update: {
          actual_arrival?: string | null
          carrier_info?: Json | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          estimated_arrival?: string | null
          event_type?: string
          id?: string
          location?: Json | null
          status_details?: Json | null
          tracking_number?: string | null
        }
        Relationships: []
      }
      supply_chain_optimization: {
        Row: {
          cost_savings: number | null
          created_at: string | null
          current_metrics: Json
          efficiency_gains: Json | null
          id: string
          implementation_status: string | null
          implemented_at: string | null
          improvement_percentage: number | null
          optimization_type: string
          optimized_metrics: Json
          product_id: string | null
          vendor_id: string | null
        }
        Insert: {
          cost_savings?: number | null
          created_at?: string | null
          current_metrics?: Json
          efficiency_gains?: Json | null
          id?: string
          implementation_status?: string | null
          implemented_at?: string | null
          improvement_percentage?: number | null
          optimization_type: string
          optimized_metrics?: Json
          product_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          cost_savings?: number | null
          created_at?: string | null
          current_metrics?: Json
          efficiency_gains?: Json | null
          id?: string
          implementation_status?: string | null
          implemented_at?: string | null
          improvement_percentage?: number | null
          optimization_type?: string
          optimized_metrics?: Json
          product_id?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message_text: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message_text: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message_text?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          customer_id: string | null
          description: string
          id: string
          order_id: string | null
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          satisfaction_rating: number | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string | null
          customer_id?: string | null
          description: string
          id?: string
          order_id?: string | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          status?: string | null
          subject: string
          ticket_number: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          customer_id?: string | null
          description?: string
          id?: string
          order_id?: string | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          service_name: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          service_name?: string | null
          severity: string
          status?: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          service_name?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      system_health_checks: {
        Row: {
          check_type: string
          checked_at: string
          endpoint_url: string
          error_message: string | null
          health_score: number | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: string
          status_code: number | null
        }
        Insert: {
          check_type: string
          checked_at?: string
          endpoint_url: string
          error_message?: string | null
          health_score?: number | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status: string
          status_code?: number | null
        }
        Update: {
          check_type?: string
          checked_at?: string
          endpoint_url?: string
          error_message?: string | null
          health_score?: number | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
          status_code?: number | null
        }
        Relationships: []
      }
      system_health_logs: {
        Row: {
          alerts_triggered: Json | null
          cpu_usage: number | null
          created_at: string
          disk_usage: number | null
          error_count: number | null
          error_details: Json | null
          health_status: string
          id: string
          last_check: string
          memory_usage: number | null
          response_time_ms: number | null
          service_name: string
          service_type: string
          success_rate: number | null
          uptime_seconds: number | null
        }
        Insert: {
          alerts_triggered?: Json | null
          cpu_usage?: number | null
          created_at?: string
          disk_usage?: number | null
          error_count?: number | null
          error_details?: Json | null
          health_status?: string
          id?: string
          last_check?: string
          memory_usage?: number | null
          response_time_ms?: number | null
          service_name: string
          service_type: string
          success_rate?: number | null
          uptime_seconds?: number | null
        }
        Update: {
          alerts_triggered?: Json | null
          cpu_usage?: number | null
          created_at?: string
          disk_usage?: number | null
          error_count?: number | null
          error_details?: Json | null
          health_status?: string
          id?: string
          last_check?: string
          memory_usage?: number | null
          response_time_ms?: number | null
          service_name?: string
          service_type?: string
          success_rate?: number | null
          uptime_seconds?: number | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          id: string
          log_level: string
          message: string
          metadata: Json | null
          service_name: string
          session_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log_level: string
          message: string
          metadata?: Json | null
          service_name: string
          session_id?: string | null
          timestamp: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log_level?: string
          message?: string
          metadata?: Json | null
          service_name?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          service_name: string | null
          tags: Json | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_type?: string
          metric_value: number
          service_name?: string | null
          tags?: Json | null
          timestamp: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          service_name?: string | null
          tags?: Json | null
          timestamp?: string
        }
        Relationships: []
      }
      system_performance_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string | null
          service_name: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          service_name: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          service_name?: string
        }
        Relationships: []
      }
      tax_configurations: {
        Row: {
          applicable_categories: Json | null
          calculation_method: string | null
          created_at: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          minimum_threshold: number | null
          rate: number
          tax_name: string
          tax_name_bn: string
          tax_type: string
          updated_at: string | null
        }
        Insert: {
          applicable_categories?: Json | null
          calculation_method?: string | null
          created_at?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          minimum_threshold?: number | null
          rate: number
          tax_name: string
          tax_name_bn: string
          tax_type: string
          updated_at?: string | null
        }
        Update: {
          applicable_categories?: Json | null
          calculation_method?: string | null
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          minimum_threshold?: number | null
          rate?: number
          tax_name?: string
          tax_name_bn?: string
          tax_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      terraform_states: {
        Row: {
          applied_by: string | null
          backup_states: Json | null
          created_at: string | null
          environment: string
          id: string
          is_locked: boolean | null
          last_applied_at: string | null
          lock_info: Json | null
          resources_count: number | null
          state_checksum: string
          state_data: Json
          state_version: number
          terraform_version: string
          updated_at: string | null
          workspace_name: string
        }
        Insert: {
          applied_by?: string | null
          backup_states?: Json | null
          created_at?: string | null
          environment: string
          id?: string
          is_locked?: boolean | null
          last_applied_at?: string | null
          lock_info?: Json | null
          resources_count?: number | null
          state_checksum: string
          state_data: Json
          state_version?: number
          terraform_version: string
          updated_at?: string | null
          workspace_name: string
        }
        Update: {
          applied_by?: string | null
          backup_states?: Json | null
          created_at?: string | null
          environment?: string
          id?: string
          is_locked?: boolean | null
          last_applied_at?: string | null
          lock_info?: Json | null
          resources_count?: number | null
          state_checksum?: string
          state_data?: Json
          state_version?: number
          terraform_version?: string
          updated_at?: string | null
          workspace_name?: string
        }
        Relationships: []
      }
      traffic_monitoring: {
        Row: {
          bounce_rate: number | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          page_url: string
          recorded_hour: string | null
          session_duration: number | null
          unique_visitors: number | null
          visitor_count: number | null
        }
        Insert: {
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          page_url: string
          recorded_hour?: string | null
          session_duration?: number | null
          unique_visitors?: number | null
          visitor_count?: number | null
        }
        Update: {
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          page_url?: string
          recorded_hour?: string | null
          session_duration?: number | null
          unique_visitors?: number | null
          visitor_count?: number | null
        }
        Relationships: []
      }
      traffic_patterns: {
        Row: {
          avg_response_time: number
          created_at: string
          endpoint_path: string
          error_rate: number
          geographic_distribution: Json
          id: string
          peak_load_indicator: boolean
          request_count: number
          seasonal_pattern: Json
          time_window: string
          user_behavior_metrics: Json
        }
        Insert: {
          avg_response_time?: number
          created_at?: string
          endpoint_path: string
          error_rate?: number
          geographic_distribution?: Json
          id?: string
          peak_load_indicator?: boolean
          request_count?: number
          seasonal_pattern?: Json
          time_window: string
          user_behavior_metrics?: Json
        }
        Update: {
          avg_response_time?: number
          created_at?: string
          endpoint_path?: string
          error_rate?: number
          geographic_distribution?: Json
          id?: string
          peak_load_indicator?: boolean
          request_count?: number
          seasonal_pattern?: Json
          time_window?: string
          user_behavior_metrics?: Json
        }
        Relationships: []
      }
      two_factor_auth: {
        Row: {
          backup_codes: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_primary_method: boolean | null
          last_used_at: string | null
          method_type: string
          phone_number: string | null
          secret_key: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          backup_codes?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_primary_method?: boolean | null
          last_used_at?: string | null
          method_type: string
          phone_number?: string | null
          secret_key?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          backup_codes?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_primary_method?: boolean | null
          last_used_at?: string | null
          method_type?: string
          phone_number?: string | null
          secret_key?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      user_behavior_cache_profiles: {
        Row: {
          access_frequency_map: Json
          behavior_patterns: Json
          cache_preferences: Json
          created_at: string | null
          geographic_preferences: Json | null
          id: string
          last_updated: string | null
          prediction_accuracy: number | null
          user_id: string
        }
        Insert: {
          access_frequency_map?: Json
          behavior_patterns?: Json
          cache_preferences?: Json
          created_at?: string | null
          geographic_preferences?: Json | null
          id?: string
          last_updated?: string | null
          prediction_accuracy?: number | null
          user_id: string
        }
        Update: {
          access_frequency_map?: Json
          behavior_patterns?: Json
          cache_preferences?: Json
          created_at?: string | null
          geographic_preferences?: Json | null
          id?: string
          last_updated?: string | null
          prediction_accuracy?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_behavioral_profiles: {
        Row: {
          anomaly_scores: Json
          baseline_established_at: string | null
          behavior_patterns: Json
          created_at: string
          device_patterns: Json
          id: string
          last_pattern_update: string
          location_patterns: Json
          profile_confidence: number
          profile_version: number
          risk_indicators: Json
          time_patterns: Json
          transaction_patterns: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          anomaly_scores?: Json
          baseline_established_at?: string | null
          behavior_patterns?: Json
          created_at?: string
          device_patterns?: Json
          id?: string
          last_pattern_update?: string
          location_patterns?: Json
          profile_confidence?: number
          profile_version?: number
          risk_indicators?: Json
          time_patterns?: Json
          transaction_patterns?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          anomaly_scores?: Json
          baseline_established_at?: string | null
          behavior_patterns?: Json
          created_at?: string
          device_patterns?: Json
          id?: string
          last_pattern_update?: string
          location_patterns?: Json
          profile_confidence?: number
          profile_version?: number
          risk_indicators?: Json
          time_patterns?: Json
          transaction_patterns?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_behaviors: {
        Row: {
          category_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          product_id: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          product_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          product_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_behaviors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_behaviors_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_behaviors_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_engagement_metrics: {
        Row: {
          action_type: string
          conversion_value: number | null
          created_at: string
          engagement_duration: number | null
          feature_used: string | null
          id: string
          page_type: string
          session_id: string
          user_id: string
        }
        Insert: {
          action_type: string
          conversion_value?: number | null
          created_at?: string
          engagement_duration?: number | null
          feature_used?: string | null
          id?: string
          page_type: string
          session_id: string
          user_id: string
        }
        Update: {
          action_type?: string
          conversion_value?: number | null
          created_at?: string
          engagement_duration?: number | null
          feature_used?: string | null
          id?: string
          page_type?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_heatmaps: {
        Row: {
          device_type: string | null
          element_selector: string
          id: string
          interaction_type: string
          page_url: string
          session_id: string | null
          timestamp: string | null
          user_id: string | null
          viewport_height: number | null
          viewport_width: number | null
          x_coordinate: number | null
          y_coordinate: number | null
        }
        Insert: {
          device_type?: string | null
          element_selector: string
          id?: string
          interaction_type: string
          page_url: string
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
          x_coordinate?: number | null
          y_coordinate?: number | null
        }
        Update: {
          device_type?: string | null
          element_selector?: string
          id?: string
          interaction_type?: string
          page_url?: string
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
          x_coordinate?: number | null
          y_coordinate?: number | null
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          ip_address: unknown | null
          product_id: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          ip_address?: unknown | null
          product_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          ip_address?: unknown | null
          product_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_loyalty_points: {
        Row: {
          created_at: string | null
          current_tier: string | null
          id: string
          last_activity_at: string | null
          points_earned_lifetime: number | null
          points_redeemed_lifetime: number | null
          program_id: string | null
          tier_progress: Json | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_tier?: string | null
          id?: string
          last_activity_at?: string | null
          points_earned_lifetime?: number | null
          points_redeemed_lifetime?: number | null
          program_id?: string | null
          tier_progress?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_tier?: string | null
          id?: string
          last_activity_at?: string | null
          points_earned_lifetime?: number | null
          points_redeemed_lifetime?: number | null
          program_id?: string | null
          tier_progress?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_loyalty_points_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          browsing_patterns: Json | null
          created_at: string | null
          id: string
          last_updated: string | null
          personalization_score: number | null
          preferred_brands: Json | null
          preferred_categories: Json | null
          price_range: Json | null
          purchase_history_analysis: Json | null
          user_id: string
        }
        Insert: {
          browsing_patterns?: Json | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          personalization_score?: number | null
          preferred_brands?: Json | null
          preferred_categories?: Json | null
          price_range?: Json | null
          purchase_history_analysis?: Json | null
          user_id: string
        }
        Update: {
          browsing_patterns?: Json | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          personalization_score?: number | null
          preferred_brands?: Json | null
          preferred_categories?: Json | null
          price_range?: Json | null
          purchase_history_analysis?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          activity_data: Json | null
          current_room: string | null
          device_info: Json | null
          id: string
          last_seen: string
          metadata: Json | null
          room_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          current_room?: string | null
          device_info?: Json | null
          id?: string
          last_seen?: string
          metadata?: Json | null
          room_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          current_room?: string | null
          device_info?: Json | null
          id?: string
          last_seen?: string
          metadata?: Json | null
          room_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recommendations: {
        Row: {
          confidence_score: number
          expires_at: string | null
          generated_at: string | null
          id: string
          interaction_data: Json | null
          model_id: string | null
          product_id: string
          recommendation_type: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          interaction_data?: Json | null
          model_id?: string | null
          product_id: string
          recommendation_type: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          interaction_data?: Json | null
          model_id?: string | null
          product_id?: string
          recommendation_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recommendations_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "recommendation_models"
            referencedColumns: ["id"]
          },
        ]
      }
      user_service_profiles: {
        Row: {
          account_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          kyc_status: string | null
          last_active_at: string | null
          notification_settings: Json
          preferences: Json
          privacy_settings: Json
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          account_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          kyc_status?: string | null
          last_active_at?: string | null
          notification_settings?: Json
          preferences?: Json
          privacy_settings?: Json
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          account_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          kyc_status?: string | null
          last_active_at?: string | null
          notification_settings?: Json
          preferences?: Json
          privacy_settings?: Json
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          session_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_two_factor_auth: {
        Row: {
          backup_codes: string[] | null
          id: string
          is_enabled: boolean | null
          last_used_at: string | null
          method: string | null
          secret_key: string | null
          setup_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          id?: string
          is_enabled?: boolean | null
          last_used_at?: string | null
          method?: string | null
          secret_key?: string | null
          setup_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          id?: string
          is_enabled?: boolean | null
          last_used_at?: string | null
          method?: string | null
          secret_key?: string | null
          setup_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vat_transactions: {
        Row: {
          created_at: string | null
          id: string
          input_vat_credit: number | null
          order_id: string | null
          status: string | null
          taxable_amount: number
          transaction_date: string
          transaction_id: string
          vat_amount: number
          vat_rate: number
          vat_registration_number: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_vat_credit?: number | null
          order_id?: string | null
          status?: string | null
          taxable_amount: number
          transaction_date: string
          transaction_id: string
          vat_amount: number
          vat_rate?: number
          vat_registration_number?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_vat_credit?: number | null
          order_id?: string | null
          status?: string | null
          taxable_amount?: number
          transaction_date?: string
          transaction_id?: string
          vat_amount?: number
          vat_rate?: number
          vat_registration_number?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vat_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vat_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_analytics: {
        Row: {
          analytics_date: string
          average_order_value: number | null
          conversion_rate: number | null
          created_at: string | null
          customer_satisfaction_score: number | null
          geographic_data: Json | null
          id: string
          inventory_turnover: number | null
          profit_margin: number | null
          return_rate: number | null
          top_selling_products: Json | null
          total_orders: number | null
          total_sales: number | null
          total_views: number | null
          traffic_sources: Json | null
          vendor_id: string
        }
        Insert: {
          analytics_date?: string
          average_order_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          geographic_data?: Json | null
          id?: string
          inventory_turnover?: number | null
          profit_margin?: number | null
          return_rate?: number | null
          top_selling_products?: Json | null
          total_orders?: number | null
          total_sales?: number | null
          total_views?: number | null
          traffic_sources?: Json | null
          vendor_id: string
        }
        Update: {
          analytics_date?: string
          average_order_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          geographic_data?: Json | null
          id?: string
          inventory_turnover?: number | null
          profit_margin?: number | null
          return_rate?: number | null
          top_selling_products?: Json | null
          total_orders?: number | null
          total_sales?: number | null
          total_views?: number | null
          traffic_sources?: Json | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_benchmarks: {
        Row: {
          benchmark_type: string
          benchmark_value: number
          created_at: string | null
          data_source: string | null
          id: string
          industry_category: string
          last_updated: string | null
          metric_name: string
          percentile_25: number | null
          percentile_50: number | null
          percentile_75: number | null
          percentile_90: number | null
        }
        Insert: {
          benchmark_type: string
          benchmark_value: number
          created_at?: string | null
          data_source?: string | null
          id?: string
          industry_category: string
          last_updated?: string | null
          metric_name: string
          percentile_25?: number | null
          percentile_50?: number | null
          percentile_75?: number | null
          percentile_90?: number | null
        }
        Update: {
          benchmark_type?: string
          benchmark_value?: number
          created_at?: string | null
          data_source?: string | null
          id?: string
          industry_category?: string
          last_updated?: string | null
          metric_name?: string
          percentile_25?: number | null
          percentile_50?: number | null
          percentile_75?: number | null
          percentile_90?: number | null
        }
        Relationships: []
      }
      vendor_commission_rates: {
        Row: {
          base_rate: number
          category_id: string | null
          created_at: string | null
          created_by: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          maximum_amount: number | null
          minimum_amount: number | null
          platform_fee_rate: number | null
          processing_fee: number | null
          product_type: string | null
          rate_type: string
          tier_rates: Json | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          base_rate: number
          category_id?: string | null
          created_at?: string | null
          created_by: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          maximum_amount?: number | null
          minimum_amount?: number | null
          platform_fee_rate?: number | null
          processing_fee?: number | null
          product_type?: string | null
          rate_type: string
          tier_rates?: Json | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          base_rate?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          maximum_amount?: number | null
          minimum_amount?: number | null
          platform_fee_rate?: number | null
          processing_fee?: number | null
          product_type?: string | null
          rate_type?: string
          tier_rates?: Json | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_commissions: {
        Row: {
          approved_by: string | null
          calculation_date: string | null
          category: string | null
          chargeback_amount: number | null
          commission_amount: number
          commission_rate: number
          commission_type: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          discount_amount: number | null
          exchange_rate: number | null
          gross_amount: number
          id: string
          net_commission: number
          notes: string | null
          order_id: string | null
          payment_date: string | null
          payment_due_date: string | null
          payment_method: string | null
          payment_status: string | null
          platform_fee: number | null
          product_id: string | null
          refund_amount: number | null
          shipping_commission: number | null
          status: string | null
          tax_amount: number | null
          transaction_date: string
          transaction_id: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          approved_by?: string | null
          calculation_date?: string | null
          category?: string | null
          chargeback_amount?: number | null
          commission_amount: number
          commission_rate: number
          commission_type: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          discount_amount?: number | null
          exchange_rate?: number | null
          gross_amount: number
          id?: string
          net_commission: number
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_due_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          product_id?: string | null
          refund_amount?: number | null
          shipping_commission?: number | null
          status?: string | null
          tax_amount?: number | null
          transaction_date: string
          transaction_id: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          approved_by?: string | null
          calculation_date?: string | null
          category?: string | null
          chargeback_amount?: number | null
          commission_amount?: number
          commission_rate?: number
          commission_type?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          discount_amount?: number | null
          exchange_rate?: number | null
          gross_amount?: number
          id?: string
          net_commission?: number
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_due_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          product_id?: string | null
          refund_amount?: number | null
          shipping_commission?: number | null
          status?: string | null
          tax_amount?: number | null
          transaction_date?: string
          transaction_id?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_dashboard_widgets: {
        Row: {
          created_at: string
          height: number
          id: string
          is_visible: boolean
          position_x: number
          position_y: number
          updated_at: string
          vendor_id: string
          widget_config: Json
          widget_type: string
          width: number
        }
        Insert: {
          created_at?: string
          height?: number
          id?: string
          is_visible?: boolean
          position_x?: number
          position_y?: number
          updated_at?: string
          vendor_id: string
          widget_config?: Json
          widget_type: string
          width?: number
        }
        Update: {
          created_at?: string
          height?: number
          id?: string
          is_visible?: boolean
          position_x?: number
          position_y?: number
          updated_at?: string
          vendor_id?: string
          widget_config?: Json
          widget_type?: string
          width?: number
        }
        Relationships: []
      }
      vendor_invoices: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          invoice_type: string
          line_items: Json
          net_amount: number
          notes: string | null
          paid_date: string | null
          payment_terms: string | null
          status: string
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          invoice_type?: string
          line_items?: Json
          net_amount: number
          notes?: string | null
          paid_date?: string | null
          payment_terms?: string | null
          status?: string
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_type?: string
          line_items?: Json
          net_amount?: number
          notes?: string | null
          paid_date?: string | null
          payment_terms?: string | null
          status?: string
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_marketplace_tools: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          last_accessed: string | null
          performance_metrics: Json | null
          subscription_status: string | null
          tool_category: string
          tool_name: string
          updated_at: string | null
          usage_analytics: Json | null
          vendor_id: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          performance_metrics?: Json | null
          subscription_status?: string | null
          tool_category: string
          tool_name: string
          updated_at?: string | null
          usage_analytics?: Json | null
          vendor_id?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          performance_metrics?: Json | null
          subscription_status?: string | null
          tool_category?: string
          tool_name?: string
          updated_at?: string | null
          usage_analytics?: Json | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_marketplace_tools_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notifications: {
        Row: {
          action_required: boolean | null
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          priority: string
          read_at: string | null
          title: string
          vendor_id: string
        }
        Insert: {
          action_required?: boolean | null
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string
          read_at?: string | null
          title: string
          vendor_id: string
        }
        Update: {
          action_required?: boolean | null
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string
          read_at?: string | null
          title?: string
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_orders: {
        Row: {
          actual_delivery_date: string | null
          admin_notes: string | null
          commission_amount: number
          commission_rate: number
          created_at: string | null
          discount_amount: number
          estimated_delivery_date: string | null
          id: string
          metadata: Json | null
          order_id: string
          order_number: string | null
          processing_fee: number
          shipping_amount: number
          shipping_carrier: string | null
          shipping_tracking_number: string | null
          status: string
          subtotal_amount: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
          vendor_earnings: number
          vendor_id: string
          vendor_notes: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          admin_notes?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          discount_amount?: number
          estimated_delivery_date?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          order_number?: string | null
          processing_fee?: number
          shipping_amount?: number
          shipping_carrier?: string | null
          shipping_tracking_number?: string | null
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          vendor_earnings?: number
          vendor_id: string
          vendor_notes?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          admin_notes?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          discount_amount?: number
          estimated_delivery_date?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          order_number?: string | null
          processing_fee?: number
          shipping_amount?: number
          shipping_carrier?: string | null
          shipping_tracking_number?: string | null
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          vendor_earnings?: number
          vendor_id?: string
          vendor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payouts: {
        Row: {
          adjustment_amount: number | null
          created_at: string | null
          gross_sales: number
          id: string
          net_payout_amount: number
          payout_details: Json | null
          payout_method: string
          payout_period_end: string
          payout_period_start: string
          payout_reference: string | null
          platform_commission: number
          platform_fees: number
          processed_at: string | null
          processor_id: string | null
          status: string | null
          tax_deduction: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          adjustment_amount?: number | null
          created_at?: string | null
          gross_sales?: number
          id?: string
          net_payout_amount: number
          payout_details?: Json | null
          payout_method: string
          payout_period_end: string
          payout_period_start: string
          payout_reference?: string | null
          platform_commission?: number
          platform_fees?: number
          processed_at?: string | null
          processor_id?: string | null
          status?: string | null
          tax_deduction?: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          adjustment_amount?: number | null
          created_at?: string | null
          gross_sales?: number
          id?: string
          net_payout_amount?: number
          payout_details?: Json | null
          payout_method?: string
          payout_period_end?: string
          payout_period_start?: string
          payout_reference?: string | null
          platform_commission?: number
          platform_fees?: number
          processed_at?: string | null
          processor_id?: string | null
          status?: string | null
          tax_deduction?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_performance_alerts: {
        Row: {
          alert_message: string
          alert_type: string
          created_at: string | null
          current_value: number | null
          id: string
          is_resolved: boolean | null
          metric_name: string
          resolved_at: string | null
          resolved_by: string | null
          severity_level: string
          threshold_value: number | null
          vendor_id: string
        }
        Insert: {
          alert_message: string
          alert_type: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_resolved?: boolean | null
          metric_name: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level: string
          threshold_value?: number | null
          vendor_id: string
        }
        Update: {
          alert_message?: string
          alert_type?: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_resolved?: boolean | null
          metric_name?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string
          threshold_value?: number | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_performance_metrics: {
        Row: {
          benchmark_value: number | null
          comparison_period: string | null
          created_at: string | null
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          percentage_change: number | null
          recorded_at: string | null
          vendor_id: string
        }
        Insert: {
          benchmark_value?: number | null
          comparison_period?: string | null
          created_at?: string | null
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          percentage_change?: number | null
          recorded_at?: string | null
          vendor_id: string
        }
        Update: {
          benchmark_value?: number | null
          comparison_period?: string | null
          created_at?: string | null
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          percentage_change?: number | null
          recorded_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_performance_reports: {
        Row: {
          active_products: number | null
          approved_by: string | null
          average_delivery_time_days: number | null
          average_order_value: number | null
          average_rating: number | null
          bounce_rate: number | null
          commission_paid: number | null
          compliance_score: number | null
          conversion_rate: number | null
          created_at: string | null
          created_by: string
          customer_satisfaction_score: number | null
          delivery_success_rate: number | null
          description_accuracy_rating: number | null
          id: string
          inventory_turnover_rate: number | null
          market_share_percentage: number | null
          notes: string | null
          on_time_delivery_rate: number | null
          out_of_stock_products: number | null
          overstock_value: number | null
          packaging_quality_rating: number | null
          page_views: number | null
          price_competitiveness_score: number | null
          product_quality_rating: number | null
          profit_margin: number | null
          refunds_issued: number | null
          report_period_end: string
          report_period_start: string
          report_type: string
          resolution_rate: number | null
          resolved_complaints: number | null
          response_time_hours: number | null
          return_rate: number | null
          review_count: number | null
          seller_level: string | null
          status: string | null
          stockout_frequency: number | null
          time_on_page_seconds: number | null
          top_selling_product_id: string | null
          total_complaints: number | null
          total_orders: number | null
          total_products_listed: number | null
          total_revenue: number | null
          unique_visitors: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          active_products?: number | null
          approved_by?: string | null
          average_delivery_time_days?: number | null
          average_order_value?: number | null
          average_rating?: number | null
          bounce_rate?: number | null
          commission_paid?: number | null
          compliance_score?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          created_by: string
          customer_satisfaction_score?: number | null
          delivery_success_rate?: number | null
          description_accuracy_rating?: number | null
          id?: string
          inventory_turnover_rate?: number | null
          market_share_percentage?: number | null
          notes?: string | null
          on_time_delivery_rate?: number | null
          out_of_stock_products?: number | null
          overstock_value?: number | null
          packaging_quality_rating?: number | null
          page_views?: number | null
          price_competitiveness_score?: number | null
          product_quality_rating?: number | null
          profit_margin?: number | null
          refunds_issued?: number | null
          report_period_end: string
          report_period_start: string
          report_type: string
          resolution_rate?: number | null
          resolved_complaints?: number | null
          response_time_hours?: number | null
          return_rate?: number | null
          review_count?: number | null
          seller_level?: string | null
          status?: string | null
          stockout_frequency?: number | null
          time_on_page_seconds?: number | null
          top_selling_product_id?: string | null
          total_complaints?: number | null
          total_orders?: number | null
          total_products_listed?: number | null
          total_revenue?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          active_products?: number | null
          approved_by?: string | null
          average_delivery_time_days?: number | null
          average_order_value?: number | null
          average_rating?: number | null
          bounce_rate?: number | null
          commission_paid?: number | null
          compliance_score?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          created_by?: string
          customer_satisfaction_score?: number | null
          delivery_success_rate?: number | null
          description_accuracy_rating?: number | null
          id?: string
          inventory_turnover_rate?: number | null
          market_share_percentage?: number | null
          notes?: string | null
          on_time_delivery_rate?: number | null
          out_of_stock_products?: number | null
          overstock_value?: number | null
          packaging_quality_rating?: number | null
          page_views?: number | null
          price_competitiveness_score?: number | null
          product_quality_rating?: number | null
          profit_margin?: number | null
          refunds_issued?: number | null
          report_period_end?: string
          report_period_start?: string
          report_type?: string
          resolution_rate?: number | null
          resolved_complaints?: number | null
          response_time_hours?: number | null
          return_rate?: number | null
          review_count?: number | null
          seller_level?: string | null
          status?: string | null
          stockout_frequency?: number | null
          time_on_page_seconds?: number | null
          top_selling_product_id?: string | null
          total_complaints?: number | null
          total_orders?: number | null
          total_products_listed?: number | null
          total_revenue?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_performance_targets: {
        Row: {
          conversion_rate_target: number | null
          created_at: string | null
          customer_satisfaction_target: number | null
          id: string
          on_time_delivery_target: number | null
          orders_target: number | null
          quality_rating_target: number | null
          revenue_target: number | null
          set_by: string
          target_month: number | null
          target_period: string
          target_quarter: number | null
          target_year: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          conversion_rate_target?: number | null
          created_at?: string | null
          customer_satisfaction_target?: number | null
          id?: string
          on_time_delivery_target?: number | null
          orders_target?: number | null
          quality_rating_target?: number | null
          revenue_target?: number | null
          set_by: string
          target_month?: number | null
          target_period: string
          target_quarter?: number | null
          target_year: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          conversion_rate_target?: number | null
          created_at?: string | null
          customer_satisfaction_target?: number | null
          id?: string
          on_time_delivery_target?: number | null
          orders_target?: number | null
          quality_rating_target?: number | null
          revenue_target?: number | null
          set_by?: string
          target_month?: number | null
          target_period?: string
          target_quarter?: number | null
          target_year?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_ratings: {
        Row: {
          communication_rating: number | null
          created_at: string | null
          customer_service_rating: number | null
          delivery_speed_rating: number | null
          id: string
          overall_rating: number | null
          product_quality_rating: number | null
          total_reviews: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          communication_rating?: number | null
          created_at?: string | null
          customer_service_rating?: number | null
          delivery_speed_rating?: number | null
          id?: string
          overall_rating?: number | null
          product_quality_rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          communication_rating?: number | null
          created_at?: string | null
          customer_service_rating?: number | null
          delivery_speed_rating?: number | null
          id?: string
          overall_rating?: number | null
          product_quality_rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_report_templates: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          report_type: string
          template_config: Json
          template_name: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          report_type: string
          template_config?: Json
          template_name: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          report_type?: string
          template_config?: Json
          template_name?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          business_name: string
          commission_rate: number | null
          created_at: string
          id: string
          is_active: boolean | null
          rating: number | null
          status: Database["public"]["Enums"]["vendor_status"] | null
          total_sales: number | null
          trade_license: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_name: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          rating?: number | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          total_sales?: number | null
          trade_license?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_name?: string
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          rating?: number | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          total_sales?: number | null
          trade_license?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      visual_search_index: {
        Row: {
          category_predictions: Json
          color_palette: Json
          created_at: string | null
          id: string
          image_hash: string
          image_url: string
          processing_status: string | null
          product_id: string | null
          similarity_vectors: string | null
          style_tags: Json
          updated_at: string | null
          visual_features: Json
        }
        Insert: {
          category_predictions?: Json
          color_palette?: Json
          created_at?: string | null
          id?: string
          image_hash: string
          image_url: string
          processing_status?: string | null
          product_id?: string | null
          similarity_vectors?: string | null
          style_tags?: Json
          updated_at?: string | null
          visual_features?: Json
        }
        Update: {
          category_predictions?: Json
          color_palette?: Json
          created_at?: string | null
          id?: string
          image_hash?: string
          image_url?: string
          processing_status?: string | null
          product_id?: string | null
          similarity_vectors?: string | null
          style_tags?: Json
          updated_at?: string | null
          visual_features?: Json
        }
        Relationships: []
      }
      voice_search_analytics: {
        Row: {
          confidence_score: number | null
          conversion_data: Json | null
          created_at: string | null
          id: string
          intent_classification: Json | null
          language_detected: string | null
          search_results: Json | null
          session_id: string | null
          transcribed_text: string | null
          user_id: string | null
          user_interaction: Json | null
          voice_query: string
        }
        Insert: {
          confidence_score?: number | null
          conversion_data?: Json | null
          created_at?: string | null
          id?: string
          intent_classification?: Json | null
          language_detected?: string | null
          search_results?: Json | null
          session_id?: string | null
          transcribed_text?: string | null
          user_id?: string | null
          user_interaction?: Json | null
          voice_query: string
        }
        Update: {
          confidence_score?: number | null
          conversion_data?: Json | null
          created_at?: string | null
          id?: string
          intent_classification?: Json | null
          language_detected?: string | null
          search_results?: Json | null
          session_id?: string | null
          transcribed_text?: string | null
          user_id?: string | null
          user_interaction?: Json | null
          voice_query?: string
        }
        Relationships: []
      }
      voice_search_logs: {
        Row: {
          audio_duration_seconds: number | null
          confidence_score: number | null
          created_at: string | null
          id: string
          processing_time_ms: number | null
          results_count: number | null
          search_query: string | null
          transcription: string | null
          user_id: string | null
        }
        Insert: {
          audio_duration_seconds?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          processing_time_ms?: number | null
          results_count?: number | null
          search_query?: string | null
          transcription?: string | null
          user_id?: string | null
        }
        Update: {
          audio_duration_seconds?: number | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          processing_time_ms?: number | null
          results_count?: number | null
          search_query?: string | null
          transcription?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      voice_search_queries: {
        Row: {
          audio_url: string | null
          confidence_score: number | null
          created_at: string | null
          detected_language: string | null
          id: string
          search_intent: string | null
          search_results: Json | null
          transcribed_text: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          detected_language?: string | null
          id?: string
          search_intent?: string | null
          search_results?: Json | null
          transcribed_text?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          confidence_score?: number | null
          created_at?: string | null
          detected_language?: string | null
          id?: string
          search_intent?: string | null
          search_results?: Json | null
          transcribed_text?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "digital_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_zones: {
        Row: {
          capacity: number | null
          coordinates: Json | null
          created_at: string | null
          current_utilization: number | null
          id: string
          security_level: string | null
          temperature_controlled: boolean | null
          updated_at: string | null
          warehouse_id: string
          zone_name: string
          zone_type: string
        }
        Insert: {
          capacity?: number | null
          coordinates?: Json | null
          created_at?: string | null
          current_utilization?: number | null
          id?: string
          security_level?: string | null
          temperature_controlled?: boolean | null
          updated_at?: string | null
          warehouse_id: string
          zone_name: string
          zone_type: string
        }
        Update: {
          capacity?: number | null
          coordinates?: Json | null
          created_at?: string | null
          current_utilization?: number | null
          id?: string
          security_level?: string | null
          temperature_controlled?: boolean | null
          updated_at?: string | null
          warehouse_id?: string
          zone_name?: string
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_zones_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: Json
          automation_level: string | null
          capacity_cubic_meters: number | null
          code: string
          contact_info: Json | null
          created_at: string | null
          id: string
          manager_id: string | null
          name: string
          operational_hours: Json | null
          status: string | null
          updated_at: string | null
          warehouse_type: string | null
        }
        Insert: {
          address: Json
          automation_level?: string | null
          capacity_cubic_meters?: number | null
          code: string
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          manager_id?: string | null
          name: string
          operational_hours?: Json | null
          status?: string | null
          updated_at?: string | null
          warehouse_type?: string | null
        }
        Update: {
          address?: Json
          automation_level?: string | null
          capacity_cubic_meters?: number | null
          code?: string
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          operational_hours?: Json | null
          status?: string | null
          updated_at?: string | null
          warehouse_type?: string | null
        }
        Relationships: []
      }
      websocket_connections: {
        Row: {
          channel_subscriptions: string[] | null
          connected_at: string | null
          connection_id: string
          device_info: Json | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          channel_subscriptions?: string[] | null
          connected_at?: string | null
          connection_id: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          channel_subscriptions?: string[] | null
          connected_at?: string | null
          connection_id?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      websocket_message_logs: {
        Row: {
          direction: string
          error_message: string | null
          id: string
          message_payload: Json
          message_type: string
          processed_at: string
          processing_time_ms: number | null
          session_id: string
          status: string
        }
        Insert: {
          direction: string
          error_message?: string | null
          id?: string
          message_payload?: Json
          message_type: string
          processed_at?: string
          processing_time_ms?: number | null
          session_id: string
          status?: string
        }
        Update: {
          direction?: string
          error_message?: string | null
          id?: string
          message_payload?: Json
          message_type?: string
          processed_at?: string
          processing_time_ms?: number | null
          session_id?: string
          status?: string
        }
        Relationships: []
      }
      websocket_sessions: {
        Row: {
          channel_subscriptions: Json
          connected_at: string
          connection_id: string
          connection_status: string
          gateway_node: string
          id: string
          last_activity: string
          message_count: number
          metadata: Json
          session_id: string
          user_id: string | null
        }
        Insert: {
          channel_subscriptions?: Json
          connected_at?: string
          connection_id: string
          connection_status?: string
          gateway_node: string
          id?: string
          last_activity?: string
          message_count?: number
          metadata?: Json
          session_id: string
          user_id?: string | null
        }
        Update: {
          channel_subscriptions?: Json
          connected_at?: string
          connection_id?: string
          connection_status?: string
          gateway_node?: string
          id?: string
          last_activity?: string
          message_count?: number
          metadata?: Json
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_integrations: {
        Row: {
          access_token: string
          business_account_id: string
          created_at: string | null
          id: string
          integration_config: Json | null
          message_templates: Json | null
          phone_number_id: string
          status: string | null
          updated_at: string | null
          vendor_id: string | null
          webhook_verify_token: string
        }
        Insert: {
          access_token: string
          business_account_id: string
          created_at?: string | null
          id?: string
          integration_config?: Json | null
          message_templates?: Json | null
          phone_number_id: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          webhook_verify_token: string
        }
        Update: {
          access_token?: string
          business_account_id?: string
          created_at?: string | null
          id?: string
          integration_config?: Json | null
          message_templates?: Json | null
          phone_number_id?: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          webhook_verify_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_integrations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          shared_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          shared_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          shared_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          collection_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          priority: number | null
          product_id: string
          user_id: string
        }
        Insert: {
          collection_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          product_id: string
          user_id: string
        }
        Update: {
          collection_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "wishlist_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          added_at: string | null
          id: string
          notes: string | null
          priority: number | null
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      zero_trust_policies: {
        Row: {
          applies_to_roles: Json
          conditions: Json
          created_at: string
          enforcement_actions: Json
          id: string
          is_active: boolean
          policy_name: string
          policy_type: string
          priority: number
          risk_thresholds: Json
          trust_requirements: Json
          updated_at: string
          verification_requirements: Json
        }
        Insert: {
          applies_to_roles?: Json
          conditions?: Json
          created_at?: string
          enforcement_actions?: Json
          id?: string
          is_active?: boolean
          policy_name: string
          policy_type: string
          priority?: number
          risk_thresholds?: Json
          trust_requirements?: Json
          updated_at?: string
          verification_requirements?: Json
        }
        Update: {
          applies_to_roles?: Json
          conditions?: Json
          created_at?: string
          enforcement_actions?: Json
          id?: string
          is_active?: boolean
          policy_name?: string
          policy_type?: string
          priority?: number
          risk_thresholds?: Json
          trust_requirements?: Json
          updated_at?: string
          verification_requirements?: Json
        }
        Relationships: []
      }
      zero_trust_sessions: {
        Row: {
          context_analysis: Json
          continuous_checks: Json
          created_at: string
          device_fingerprint: string
          expires_at: string
          id: string
          ip_address: unknown
          last_verification: string
          location_data: Json
          risk_factors: Json
          session_id: string
          status: string
          trust_score: number
          updated_at: string
          user_id: string
          verification_level: string
          verification_methods: Json
        }
        Insert: {
          context_analysis?: Json
          continuous_checks?: Json
          created_at?: string
          device_fingerprint: string
          expires_at: string
          id?: string
          ip_address: unknown
          last_verification?: string
          location_data?: Json
          risk_factors?: Json
          session_id: string
          status?: string
          trust_score?: number
          updated_at?: string
          user_id: string
          verification_level?: string
          verification_methods?: Json
        }
        Update: {
          context_analysis?: Json
          continuous_checks?: Json
          created_at?: string
          device_fingerprint?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          last_verification?: string
          location_data?: Json
          risk_factors?: Json
          session_id?: string
          status?: string
          trust_score?: number
          updated_at?: string
          user_id?: string
          verification_level?: string
          verification_methods?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_approve_payout_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      calculate_cache_optimization_score: {
        Args: {
          p_cache_key: string
          p_hit_rate: number
          p_access_frequency: number
        }
        Returns: number
      }
      calculate_edge_node_load: {
        Args: { p_node_id: string }
        Returns: number
      }
      calculate_trust_score: {
        Args: { p_user_id: string; p_session_id: string; p_context_data: Json }
        Returns: number
      }
      calculate_vendor_commission: {
        Args: {
          p_vendor_id: string
          p_gross_amount: number
          p_product_category?: string
          p_transaction_date?: string
        }
        Returns: {
          commission_amount: number
          commission_rate: number
          platform_fee: number
          net_commission: number
        }[]
      }
      check_enhanced_rate_limit: {
        Args: {
          p_key_type: string
          p_key_value: string
          p_endpoint: string
          p_max_requests?: number
          p_window_size_ms?: number
        }
        Returns: Json
      }
      clean_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_graphql_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_intelligent_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      database_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      detect_fraud_patterns: {
        Args: { p_user_id: string; p_transaction_data: Json }
        Returns: Json
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_enhanced_audit_event: {
        Args: {
          p_event_type: string
          p_user_id: string
          p_resource_type: string
          p_action: string
          p_data_before?: Json
          p_data_after?: Json
          p_context?: Json
        }
        Returns: string
      }
      log_query_performance: {
        Args: {
          p_query_hash: string
          p_query_type: string
          p_execution_time_ms: number
          p_rows_affected?: number
          p_cache_hit?: boolean
          p_user_id?: string
          p_endpoint?: string
        }
        Returns: undefined
      }
      optimize_request_batching: {
        Args: { p_user_id: string; p_request_type: string }
        Returns: Json
      }
      process_micro_payment_aggregation: {
        Args: { p_user_id: string }
        Returns: Json
      }
      process_payout_batch: {
        Args: { p_batch_id: string; p_processor_id: string }
        Returns: Json
      }
      update_commission_analytics: {
        Args: { p_vendor_id?: string; p_analytics_date?: string }
        Returns: undefined
      }
      update_service_health_score: {
        Args: {
          p_service_name: string
          p_response_time: number
          p_error_rate: number
          p_cpu_utilization: number
          p_memory_utilization: number
        }
        Returns: number
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
      payment_method:
        | "bkash"
        | "nagad"
        | "rocket"
        | "sslcommerz"
        | "cod"
        | "bank_transfer"
      product_status: "draft" | "active" | "inactive" | "out_of_stock"
      user_role:
        | "admin"
        | "moderator"
        | "vendor"
        | "customer"
        | "user"
        | "super_admin"
        | "agent"
      vendor_status: "pending" | "approved" | "suspended" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      payment_method: [
        "bkash",
        "nagad",
        "rocket",
        "sslcommerz",
        "cod",
        "bank_transfer",
      ],
      product_status: ["draft", "active", "inactive", "out_of_stock"],
      user_role: [
        "admin",
        "moderator",
        "vendor",
        "customer",
        "user",
        "super_admin",
        "agent",
      ],
      vendor_status: ["pending", "approved", "suspended", "rejected"],
    },
  },
} as const
