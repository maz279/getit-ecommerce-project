import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfigRequest {
  service_name: string;
  environment: string;
  config_type: string;
  config_key: string;
  config_value: any;
  is_encrypted?: boolean;
  is_sensitive?: boolean;
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
          service: "config-manager", 
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !["admin", "super_admin"].includes(profile.role)) {
      throw new Error("Admin access required");
    }

    const correlationId = crypto.randomUUID();
    console.log(`Config Manager Request: ${method} ${path} - Correlation: ${correlationId}`);

    if (path === "configs") {
      if (method === "GET") {
        const searchParams = url.searchParams;
        const service_name = searchParams.get("service_name");
        const environment = searchParams.get("environment") || "production";
        const config_type = searchParams.get("config_type");

        let query = supabase
          .from("microservice_configs")
          .select("*");

        if (service_name) {
          query = query.eq("service_name", service_name);
        }

        query = query.eq("environment", environment);

        if (config_type) {
          query = query.eq("config_type", config_type);
        }

        const { data: configs, error } = await query
          .order("service_name", { ascending: true })
          .order("config_type", { ascending: true })
          .order("config_key", { ascending: true });

        if (error) throw error;

        // Filter sensitive data in response
        const filteredConfigs = configs.map(config => ({
          ...config,
          config_value: config.is_sensitive ? "[SENSITIVE]" : config.config_value
        }));

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: filteredConfigs,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (method === "POST") {
        const configData: ConfigRequest = await req.json();
        
        if (!configData.service_name || !configData.environment || !configData.config_type || !configData.config_key) {
          throw new Error("Missing required fields: service_name, environment, config_type, config_key");
        }

        const { data: config, error } = await supabase
          .from("microservice_configs")
          .insert({
            ...configData,
            created_by: user.id
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              ...config,
              config_value: config.is_sensitive ? "[SENSITIVE]" : config.config_value
            },
            correlation_id: correlationId 
          }),
          { 
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      if (method === "PUT") {
        const { id, config_value, is_sensitive } = await req.json();
        
        if (!id) {
          throw new Error("Missing required field: id");
        }

        const updateData: any = {};
        if (config_value !== undefined) updateData.config_value = config_value;
        if (is_sensitive !== undefined) updateData.is_sensitive = is_sensitive;
        updateData.version = supabase.sql`version + 1`;

        const { data: config, error } = await supabase
          .from("microservice_configs")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              ...config,
              config_value: config.is_sensitive ? "[SENSITIVE]" : config.config_value
            },
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "services") {
      if (method === "GET") {
        const { data: services, error } = await supabase
          .from("microservices_registry")
          .select("*")
          .order("service_name", { ascending: true });

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: services,
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (method === "POST") {
        const serviceData = await req.json();
        
        if (!serviceData.service_name || !serviceData.service_type || !serviceData.endpoint_url) {
          throw new Error("Missing required fields: service_name, service_type, endpoint_url");
        }

        const { data: service, error } = await supabase
          .from("microservices_registry")
          .insert({
            ...serviceData,
            health_check_url: serviceData.health_check_url || `${serviceData.endpoint_url}/health`
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: service,
            correlation_id: correlationId 
          }),
          { 
            status: 201,
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    if (path === "health-check") {
      if (method === "POST") {
        const { service_name } = await req.json();
        
        if (!service_name) {
          throw new Error("Missing required field: service_name");
        }

        // Get service details
        const { data: service, error: serviceError } = await supabase
          .from("microservices_registry")
          .select("*")
          .eq("service_name", service_name)
          .single();

        if (serviceError || !service) {
          throw new Error("Service not found");
        }

        // Perform health check
        let healthStatus = "healthy";
        let healthData = {};

        try {
          const healthResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}${service.health_check_url}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
              "apikey": Deno.env.get("SUPABASE_ANON_KEY") || ""
            }
          });

          if (healthResponse.ok) {
            healthData = await healthResponse.json();
          } else {
            healthStatus = "unhealthy";
            healthData = { error: "Health check failed", status: healthResponse.status };
          }
        } catch (error) {
          healthStatus = "unhealthy";
          healthData = { error: error.message };
        }

        // Update service health status
        await supabase
          .from("microservices_registry")
          .update({
            status: healthStatus,
            last_health_check: new Date().toISOString()
          })
          .eq("id", service.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              service_name,
              status: healthStatus,
              health_data: healthData,
              checked_at: new Date().toISOString()
            },
            correlation_id: correlationId 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "environment-configs") {
      const environment = url.searchParams.get("environment") || "production";
      
      // Get all configs for environment grouped by service
      const { data: configs, error } = await supabase
        .from("microservice_configs")
        .select("*")
        .eq("environment", environment)
        .order("service_name", { ascending: true });

      if (error) throw error;

      // Group configs by service
      const groupedConfigs = configs.reduce((acc, config) => {
        if (!acc[config.service_name]) {
          acc[config.service_name] = {};
        }
        if (!acc[config.service_name][config.config_type]) {
          acc[config.service_name][config.config_type] = {};
        }
        
        acc[config.service_name][config.config_type][config.config_key] = 
          config.is_sensitive ? "[SENSITIVE]" : config.config_value;
        
        return acc;
      }, {} as Record<string, Record<string, Record<string, any>>>);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            environment,
            services: groupedConfigs
          },
          correlation_id: correlationId 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Config Manager Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        service: "config-manager" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});