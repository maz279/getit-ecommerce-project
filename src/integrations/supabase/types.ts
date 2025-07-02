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
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          experiment_name: string
          experiment_type: string
          id: string
          start_date: string | null
          statistical_significance: number | null
          status: string | null
          success_metrics: Json | null
          target_audience: Json | null
          traffic_allocation: Json | null
          updated_at: string | null
          variants: Json
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          experiment_name: string
          experiment_type: string
          id?: string
          start_date?: string | null
          statistical_significance?: number | null
          status?: string | null
          success_metrics?: Json | null
          target_audience?: Json | null
          traffic_allocation?: Json | null
          updated_at?: string | null
          variants?: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          experiment_name?: string
          experiment_type?: string
          id?: string
          start_date?: string | null
          statistical_significance?: number | null
          status?: string | null
          success_metrics?: Json | null
          target_audience?: Json | null
          traffic_allocation?: Json | null
          updated_at?: string | null
          variants?: Json
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
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          name_bn: string | null
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          name_bn?: string | null
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
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
      notification_subscriptions: {
        Row: {
          auth_key: string | null
          created_at: string | null
          device_type: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_key?: string | null
          created_at?: string | null
          device_type?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_key?: string | null
          created_at?: string | null
          device_type?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
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
          created_at: string | null
          data: Json
          error_message: string | null
          id: string
          max_attempts: number | null
          resource_id: string | null
          resource_type: string
          sync_status: string | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          attempts?: number | null
          created_at?: string | null
          data: Json
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          resource_id?: string | null
          resource_type: string
          sync_status?: string | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          attempts?: number | null
          created_at?: string | null
          data?: Json
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          resource_id?: string | null
          resource_type?: string
          sync_status?: string | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          body: string
          created_at: string | null
          data: Json | null
          delivered_at: string | null
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
          body: string
          created_at?: string | null
          data?: Json | null
          delivered_at?: string | null
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
          body?: string
          created_at?: string | null
          data?: Json | null
          delivered_at?: string | null
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
      security_events: {
        Row: {
          created_at: string
          event_details: Json
          event_type: string
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          location_data: Json | null
          resolution_status: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity_level: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_details?: Json
          event_type: string
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          location_data?: Json | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_details?: Json
          event_type?: string
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          location_data?: Json | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string
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
          id: string
          last_seen: string
          metadata: Json | null
          room_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          last_seen?: string
          metadata?: Json | null
          room_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_approve_payout_request: {
        Args: { p_request_id: string }
        Returns: boolean
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
      cleanup_expired_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      database_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      process_payout_batch: {
        Args: { p_batch_id: string; p_processor_id: string }
        Returns: Json
      }
      update_commission_analytics: {
        Args: { p_vendor_id?: string; p_analytics_date?: string }
        Returns: undefined
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
