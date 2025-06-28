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
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
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
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          customer_id: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: string | null
          shipping_address: Json
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: string | null
          shipping_address: Json
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: string | null
          shipping_address?: Json
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
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
      product_reviews: {
        Row: {
          created_at: string | null
          id: string
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
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
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          description_bn: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          name: string
          name_bn: string | null
          price: number
          sku: string
          stock_quantity: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name: string
          name_bn?: string | null
          price: number
          sku: string
          stock_quantity?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name?: string
          name_bn?: string | null
          price?: number
          sku?: string
          stock_quantity?: number | null
          updated_at?: string
          vendor_id?: string | null
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
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
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
      vendors: {
        Row: {
          business_name: string
          commission_rate: number | null
          created_at: string
          id: string
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
      wishlist_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      clean_expired_data: {
        Args: Record<PropertyKey, never>
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
      user_role:
        | "admin"
        | "moderator"
        | "vendor"
        | "customer"
        | "user"
        | "super_admin"
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
      user_role: [
        "admin",
        "moderator",
        "vendor",
        "customer",
        "user",
        "super_admin",
      ],
      vendor_status: ["pending", "approved", "suspended", "rejected"],
    },
  },
} as const
