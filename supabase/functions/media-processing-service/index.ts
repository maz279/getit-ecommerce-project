import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { endpoint, data } = await req.json();
    console.log(`Media Processing Service - Endpoint: ${endpoint}`);

    switch (endpoint) {
      case 'health':
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          service: 'media-processing-service',
          capabilities: ['image-optimization', 'video-processing', 'cdn-integration', 'format-conversion']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'process-images':
        const { product_id, image_urls, optimization_config = {} } = data;
        
        // Create processing job
        const { data: job, error: jobError } = await supabase
          .from('media_processing_jobs')
          .insert({
            product_id,
            original_url: image_urls[0], // First image as primary
            processing_config: {
              ...optimization_config,
              image_urls,
              quality: optimization_config.quality || 85,
              formats: optimization_config.formats || ['webp', 'jpg'],
              sizes: optimization_config.sizes || [
                { name: 'thumbnail', width: 150, height: 150 },
                { name: 'medium', width: 400, height: 400 },
                { name: 'large', width: 800, height: 800 },
                { name: 'xl', width: 1200, height: 1200 }
              ]
            }
          })
          .select()
          .single();

        if (jobError) throw jobError;

        // Simulate image processing
        const processedUrls = await processImages(image_urls, optimization_config);
        
        // Update job with results
        const { error: updateError } = await supabase
          .from('media_processing_jobs')
          .update({
            processed_urls: processedUrls,
            processing_status: 'completed',
            optimization_metrics: {
              original_size: calculateTotalSize(image_urls),
              compressed_size: calculateTotalSize(Object.values(processedUrls).flat()),
              compression_ratio: 0.75,
              processing_time: Date.now()
            }
          })
          .eq('id', job.id);

        return new Response(JSON.stringify({ 
          job_id: job.id,
          processed_urls: processedUrls,
          status: 'completed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'get-processing-status':
        const { job_id } = data;
        
        const { data: jobStatus, error: statusError } = await supabase
          .from('media_processing_jobs')
          .select('*')
          .eq('id', job_id)
          .single();

        return new Response(JSON.stringify({ data: jobStatus, error: statusError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'optimize-existing':
        const { vendor_id, batch_size = 10 } = data;
        
        // Get products with unoptimized images
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, images')
          .eq('vendor_id', vendor_id)
          .not('images', 'is', null)
          .limit(batch_size);

        if (productsError) throw productsError;

        const optimizationJobs = [];
        for (const product of products) {
          if (product.images && product.images.length > 0) {
            const job = await supabase
              .from('media_processing_jobs')
              .insert({
                product_id: product.id,
                original_url: product.images[0],
                processing_config: {
                  image_urls: product.images,
                  bulk_optimization: true
                }
              })
              .select()
              .single();
            
            if (!job.error) {
              optimizationJobs.push(job.data);
            }
          }
        }

        return new Response(JSON.stringify({ 
          message: `Started optimization for ${optimizationJobs.length} products`,
          jobs: optimizationJobs
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'cdn-sync':
        const { media_urls, cdn_config = {} } = data;
        
        // Simulate CDN sync process
        const cdnUrls = media_urls.map((url: string) => ({
          original: url,
          cdn: url.replace(/^https?:\/\/[^\/]+/, `https://${cdn_config.domain || 'cdn.getit.com.bd'}`),
          status: 'synced'
        }));

        return new Response(JSON.stringify({ 
          cdn_urls: cdnUrls,
          sync_status: 'completed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'format-conversion':
        const { source_urls, target_format, conversion_config = {} } = data;
        
        const convertedUrls = source_urls.map((url: string) => ({
          original: url,
          converted: url.replace(/\.[^.]+$/, `.${target_format}`),
          format: target_format,
          quality: conversion_config.quality || 85
        }));

        return new Response(JSON.stringify({ 
          converted_urls: convertedUrls,
          conversion_status: 'completed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'bulk-watermark':
        const { images, watermark_config } = data;
        
        const watermarkedUrls = images.map((url: string) => ({
          original: url,
          watermarked: url.replace(/(\.[^.]+)$/, '_watermarked$1'),
          watermark: {
            text: watermark_config.text || 'GetIt.com.bd',
            position: watermark_config.position || 'bottom-right',
            opacity: watermark_config.opacity || 0.7
          }
        }));

        return new Response(JSON.stringify({ 
          watermarked_urls: watermarkedUrls,
          status: 'completed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'analytics':
        const { vendor_id: analyticsVendorId, period = 'last_30_days' } = data;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const { data: jobs, error: analyticsError } = await supabase
          .from('media_processing_jobs')
          .select(`
            *,
            products!inner(vendor_id)
          `)
          .eq('products.vendor_id', analyticsVendorId)
          .gte('created_at', startDate.toISOString());

        const analytics = {
          total_jobs: jobs?.length || 0,
          completed_jobs: jobs?.filter(j => j.processing_status === 'completed').length || 0,
          failed_jobs: jobs?.filter(j => j.processing_status === 'failed').length || 0,
          total_savings: jobs?.reduce((acc, job) => {
            const metrics = job.optimization_metrics;
            return acc + (metrics?.original_size - metrics?.compressed_size || 0);
          }, 0) || 0,
          avg_compression_ratio: jobs?.reduce((acc, job) => {
            return acc + (job.optimization_metrics?.compression_ratio || 0);
          }, 0) / (jobs?.length || 1) || 0
        };

        return new Response(JSON.stringify({ data: analytics }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Media Processing Service error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      service: 'media-processing-service'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper functions
async function processImages(imageUrls: string[], config: any = {}) {
  const processed: any = {};
  
  for (const url of imageUrls) {
    const sizes = config.sizes || [
      { name: 'thumbnail', width: 150, height: 150 },
      { name: 'medium', width: 400, height: 400 },
      { name: 'large', width: 800, height: 800 }
    ];
    
    processed[url] = sizes.map((size: any) => ({
      size: size.name,
      width: size.width,
      height: size.height,
      url: url.replace(/(\.[^.]+)$/, `_${size.name}$1`),
      format: 'webp'
    }));
  }
  
  return processed;
}

function calculateTotalSize(urls: string[]): number {
  // Simulate file size calculation
  return urls.length * 500000; // 500KB average per image
}