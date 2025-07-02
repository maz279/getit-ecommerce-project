import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  user_id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  preferences?: any;
  notification_settings?: any;
  privacy_settings?: any;
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
    const path = url.pathname.split("/").pop();
    const method = req.method;

    // Health Check
    if (path === "health") {
      return new Response(
        JSON.stringify({ 
          status: "healthy", 
          service: "user-service", 
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const correlationId = crypto.randomUUID();
    console.log(`User Service Request: ${method} ${path} - Correlation: ${correlationId}`);

    // Route handling
    if (path === "profile") {
      if (method === "GET") {
        const { data: profile, error } = await supabase
          .from("user_service_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (!profile) {
          // Create default profile if none exists
          const defaultProfile = {
            user_id: user.id,
            display_name: user.email?.split("@")[0] || "User",
            preferences: {},
            notification_settings: {
              email: true,
              sms: false,
              push: true
            },
            privacy_settings: {
              public_profile: false,
              show_email: false
            }
          };

          const { data: newProfile, error: createError } = await supabase
            .from("user_service_profiles")
            .insert(defaultProfile)
            .select()
            .single();

          if (createError) throw createError;

          return new Response(
            JSON.stringify({ 
              success: true, 
              data: newProfile,
              correlation_id: correlationId 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: profile,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (method === "PUT") {
        const updateData: Partial<UserProfile> = await req.json();
        
        // Validate input
        if (updateData.user_id && updateData.user_id !== user.id) {
          throw new Error("Cannot update another user's profile");
        }

        const { data: updatedProfile, error } = await supabase
          .from("user_service_profiles")
          .update({
            ...updateData,
            user_id: user.id,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;

        // Update last active
        await supabase
          .from("user_service_profiles")
          .update({ last_active_at: new Date().toISOString() })
          .eq("user_id", user.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: updatedProfile,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "preferences") {
      if (method === "GET") {
        const { data: profile, error } = await supabase
          .from("user_service_profiles")
          .select("preferences, notification_settings, privacy_settings")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              preferences: profile.preferences || {},
              notifications: profile.notification_settings || {},
              privacy: profile.privacy_settings || {}
            },
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (method === "PUT") {
        const { preferences, notifications, privacy } = await req.json();
        
        const updateData: any = {};
        if (preferences !== undefined) updateData.preferences = preferences;
        if (notifications !== undefined) updateData.notification_settings = notifications;
        if (privacy !== undefined) updateData.privacy_settings = privacy;

        const { data: updatedProfile, error } = await supabase
          .from("user_service_profiles")
          .update(updateData)
          .eq("user_id", user.id)
          .select("preferences, notification_settings, privacy_settings")
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              preferences: updatedProfile.preferences || {},
              notifications: updatedProfile.notification_settings || {},
              privacy: updatedProfile.privacy_settings || {}
            },
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
    console.error("User Service Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        service: "user-service" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});