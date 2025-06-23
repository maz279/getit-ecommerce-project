
import { supabase } from '@/integrations/supabase/client';

export class DatabaseService {
  // Cart operations
  static async getCartItems(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          vendor_id
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async addToCart(userId: string, productId: string, quantity: number = 1) {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity
      }, {
        onConflict: 'user_id,product_id'
      });

    if (error) throw error;
    return data;
  }

  static async updateCartQuantity(userId: string, productId: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return data;
  }

  static async removeFromCart(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return data;
  }

  // Wishlist operations
  static async getWishlistItems(userId: string) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          description,
          vendor_id
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async addToWishlist(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId
      });

    if (error) throw error;
    return data;
  }

  static async removeFromWishlist(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return data;
  }

  // Product reviews
  static async getProductReviews(productId: string) {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        users!inner(full_name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addProductReview(
    userId: string, 
    productId: string, 
    rating: number, 
    reviewText?: string,
    isVerifiedPurchase: boolean = false
  ) {
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        user_id: userId,
        product_id: productId,
        rating,
        review_text: reviewText,
        is_verified_purchase: isVerifiedPurchase
      });

    if (error) throw error;
    return data;
  }

  // Search operations
  static async logSearchQuery(userId: string | null, query: string, resultsCount: number, clickedProductId?: string) {
    const { data, error } = await supabase
      .from('search_queries')
      .insert({
        user_id: userId,
        query,
        results_count: resultsCount,
        clicked_product_id: clickedProductId
      });

    if (error) throw error;
    return data;
  }

  static async updateSearchIndex(itemId: string, itemType: string, title: string, description?: string, metadata?: any) {
    const { data, error } = await supabase
      .from('search_index')
      .upsert({
        item_id: itemId,
        item_type: itemType,
        title,
        description,
        metadata: metadata || {}
      }, {
        onConflict: 'item_id,item_type'
      });

    if (error) throw error;
    return data;
  }

  // ML recommendations
  static async saveMLRecommendations(
    userId: string | null, 
    recommendationType: string, 
    recommendations: any[], 
    confidenceScore?: number
  ) {
    const { data, error } = await supabase
      .from('ml_recommendations')
      .insert({
        user_id: userId,
        recommendation_type: recommendationType,
        recommendations,
        confidence_score: confidenceScore
      });

    if (error) throw error;
    return data;
  }

  static async getMLRecommendations(userId: string, recommendationType?: string) {
    let query = supabase
      .from('ml_recommendations')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (recommendationType) {
      query = query.eq('recommendation_type', recommendationType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // User behavior tracking
  static async trackUserBehavior(
    userId: string | null,
    sessionId: string | null,
    eventType: string,
    eventData: any,
    productId?: string,
    categoryId?: string
  ) {
    // Use edge function for behavior tracking
    try {
      const response = await fetch('/functions/v1/behavior-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          event_type: eventType,
          event_data: eventData,
          product_id: productId,
          category_id: categoryId,
          ip_address: null, // Will be set by edge function
          user_agent: navigator.userAgent
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Behavior tracking failed:', error);
      return null;
    }
  }
}
