import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Product {
  vendor_id: string;
  sku: string;
  name: string;
  description?: string;
  category_path: string;
  attributes?: any;
  variants?: any[];
  media?: any[];
  seo_data?: any;
  status?: string;
  is_featured?: boolean;
  tags?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean).slice(-1)[0];
    const method = req.method;

    // Health Check
    if (path === "health") {
      return new Response(
        JSON.stringify({ 
          status: "healthy", 
          service: "product-service", 
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const correlationId = crypto.randomUUID();
    console.log(`Product Service Request: ${method} ${path} - Correlation: ${correlationId}`);

    // Public routes (no auth required)
    if (path === "catalog") {
      if (method === "GET") {
        const searchParams = url.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const vendor_id = searchParams.get("vendor_id");
        const featured = searchParams.get("featured") === "true";
        const offset = (page - 1) * limit;

        let query = supabase
          .from("product_service_catalog")
          .select(`
            *,
            product_service_inventory (
              available_quantity,
              selling_price,
              discount_price
            )
          `, { count: "exact" })
          .eq("status", "active");

        if (category) {
          query = query.ilike("category_path", `%${category}%`);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
        }

        if (vendor_id) {
          query = query.eq("vendor_id", vendor_id);
        }

        if (featured) {
          query = query.eq("is_featured", true);
        }

        const { data: products, error, count } = await query
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: products,
            pagination: {
              page,
              limit,
              total: count || 0,
              total_pages: Math.ceil((count || 0) / limit)
            },
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "featured") {
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
      
      const { data: products, error } = await supabase
        .from("product_service_catalog")
        .select(`
          *,
          product_service_inventory (
            available_quantity,
            selling_price,
            discount_price
          )
        `)
        .eq("status", "active")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: products,
          correlation_id: correlationId 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Protected routes (auth required)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required for this endpoint");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    if (path === "products") {
      if (method === "GET") {
        // Get vendor's products
        const { data: products, error } = await supabase
          .from("product_service_catalog")
          .select(`
            *,
            product_service_inventory (*)
          `)
          .eq("vendor_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: products,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (method === "POST") {
        const productData: Product = await req.json();
        
        // Validate required fields
        if (!productData.name || !productData.sku || !productData.category_path) {
          throw new Error("Missing required fields: name, sku, category_path");
        }

        // Create product
        const { data: product, error: productError } = await supabase
          .from("product_service_catalog")
          .insert({
            ...productData,
            vendor_id: user.id
          })
          .select()
          .single();

        if (productError) throw productError;

        // Create initial inventory record
        const { error: inventoryError } = await supabase
          .from("product_service_inventory")
          .insert({
            product_id: product.id,
            available_quantity: 0,
            selling_price: 0
          });

        if (inventoryError) {
          console.error("Failed to create inventory record:", inventoryError);
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: product,
            correlation_id: correlationId 
          }),
          { 
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    if (path === "inventory") {
      if (method === "PUT") {
        const { product_id, available_quantity, selling_price, discount_price, cost_price } = await req.json();
        
        // Verify product ownership
        const { data: product, error: productError } = await supabase
          .from("product_service_catalog")
          .select("vendor_id")
          .eq("id", product_id)
          .single();

        if (productError || product.vendor_id !== user.id) {
          throw new Error("Product not found or access denied");
        }

        const updateData: any = {};
        if (available_quantity !== undefined) updateData.available_quantity = available_quantity;
        if (selling_price !== undefined) updateData.selling_price = selling_price;
        if (discount_price !== undefined) updateData.discount_price = discount_price;
        if (cost_price !== undefined) updateData.cost_price = cost_price;

        // Add to price history if price changed
        if (selling_price !== undefined) {
          const { data: currentInventory } = await supabase
            .from("product_service_inventory")
            .select("price_history, selling_price")
            .eq("product_id", product_id)
            .single();

          if (currentInventory && currentInventory.selling_price !== selling_price) {
            const priceHistory = currentInventory.price_history || [];
            priceHistory.push({
              price: currentInventory.selling_price,
              changed_at: new Date().toISOString()
            });
            updateData.price_history = priceHistory;
          }
        }

        const { data: inventory, error } = await supabase
          .from("product_service_inventory")
          .update(updateData)
          .eq("product_id", product_id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: inventory,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Product Service Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        service: "product-service" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});