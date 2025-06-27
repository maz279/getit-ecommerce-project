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
      clean_expired_data: {
        Args: Record<PropertyKey, never>
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
