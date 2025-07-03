import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface VisualSearchRequest {
  image_url?: string;
  image_base64?: string;
  similarity_threshold?: number;
  limit?: number;
  user_id?: string;
  search_type?: 'color' | 'shape' | 'deep_features' | 'hybrid';
}

interface ImageFeatures {
  color_histogram: number[];
  shape_descriptors: any;
  deep_features: number[];
  dominant_colors: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'search-by-image':
        return await searchByImage(req);
      case 'extract-features':
        return await extractImageFeatures(req);
      case 'similar-products':
        return await findSimilarProducts(req);
      case 'color-search':
        return await searchByColor(req);
      case 'index-product-image':
        return await indexProductImage(req);
      case 'visual-analytics':
        return await getVisualSearchAnalytics(req);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Visual Search Service Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchByImage(req: Request) {
  const searchRequest: VisualSearchRequest = await req.json();
  const { image_url, image_base64, similarity_threshold = 0.7, limit = 20, user_id, search_type = 'hybrid' } = searchRequest;

  console.log('Visual Search Request:', { image_url: !!image_url, image_base64: !!image_base64, search_type });

  if (!image_url && !image_base64) {
    throw new Error('Either image_url or image_base64 is required');
  }

  // Extract features from the input image
  const features = await extractFeaturesFromImage(image_url || image_base64);
  
  if (!features) {
    throw new Error('Failed to extract features from image');
  }

  // Find similar products based on the search type
  let similarProducts = [];
  
  switch (search_type) {
    case 'color':
      similarProducts = await findSimilarByColor(features.color_histogram, similarity_threshold, limit);
      break;
    case 'shape':
      similarProducts = await findSimilarByShape(features.shape_descriptors, similarity_threshold, limit);
      break;
    case 'deep_features':
      similarProducts = await findSimilarByDeepFeatures(features.deep_features, similarity_threshold, limit);
      break;
    case 'hybrid':
    default:
      similarProducts = await findSimilarByHybrid(features, similarity_threshold, limit);
      break;
  }

  // Log visual search for analytics
  if (user_id) {
    await supabase.from('search_queries').insert({
      user_id,
      query_text: 'visual_search',
      search_type: 'visual',
      results_count: similarProducts.length,
      search_metadata: {
        visual_search_type: search_type,
        similarity_threshold,
        features_extracted: Object.keys(features)
      }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    data: similarProducts,
    search_metadata: {
      search_type,
      similarity_threshold,
      features_used: Object.keys(features),
      total_found: similarProducts.length
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function extractImageFeatures(req: Request) {
  const { image_url, image_base64 } = await req.json();

  console.log('Extract Features Request:', { image_url: !!image_url, image_base64: !!image_base64 });

  if (!image_url && !image_base64) {
    throw new Error('Either image_url or image_base64 is required');
  }

  const features = await extractFeaturesFromImage(image_url || image_base64);

  return new Response(JSON.stringify({
    success: true,
    features
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function findSimilarProducts(req: Request) {
  const { product_id, similarity_threshold = 0.8, limit = 10 } = await req.json();

  console.log('Find Similar Products:', { product_id, similarity_threshold, limit });

  // Get the reference product's visual features
  const { data: refProduct } = await supabase
    .from('visual_search_features')
    .select('*')
    .eq('product_id', product_id)
    .single();

  if (!refProduct) {
    throw new Error('Product visual features not found');
  }

  // Find similar products using hybrid approach
  const similarProducts = await findSimilarByHybrid({
    color_histogram: refProduct.color_histogram,
    shape_descriptors: refProduct.shape_descriptors,
    deep_features: refProduct.deep_features
  }, similarity_threshold, limit);

  return new Response(JSON.stringify({
    success: true,
    reference_product_id: product_id,
    similar_products: similarProducts,
    similarity_threshold
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function searchByColor(req: Request) {
  const { color_values, similarity_threshold = 0.7, limit = 20 } = await req.json();

  console.log('Color Search Request:', { color_values, similarity_threshold, limit });

  if (!color_values || !Array.isArray(color_values)) {
    throw new Error('color_values array is required');
  }

  // Convert color values to histogram representation
  const colorHistogram = await convertColorsToHistogram(color_values);

  // Find products with similar colors
  const similarProducts = await findSimilarByColor(colorHistogram, similarity_threshold, limit);

  return new Response(JSON.stringify({
    success: true,
    data: similarProducts,
    search_colors: color_values,
    similarity_threshold
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function indexProductImage(req: Request) {
  const { product_id, image_url } = await req.json();

  console.log('Index Product Image:', { product_id, image_url });

  if (!product_id || !image_url) {
    throw new Error('product_id and image_url are required');
  }

  // Extract features from the product image
  const features = await extractFeaturesFromImage(image_url);

  if (!features) {
    throw new Error('Failed to extract features from product image');
  }

  // Store visual features in database
  const { data: existingFeatures } = await supabase
    .from('visual_search_features')
    .select('id')
    .eq('product_id', product_id)
    .single();

  if (existingFeatures) {
    // Update existing features
    const { error } = await supabase
      .from('visual_search_features')
      .update({
        image_url,
        feature_vector: features.deep_features,
        color_histogram: features.color_histogram,
        shape_descriptors: features.shape_descriptors,
        deep_features: features,
        confidence_score: 0.95
      })
      .eq('product_id', product_id);

    if (error) throw error;
  } else {
    // Insert new features
    const { error } = await supabase
      .from('visual_search_features')
      .insert({
        product_id,
        image_url,
        feature_vector: features.deep_features,
        color_histogram: features.color_histogram,
        shape_descriptors: features.shape_descriptors,
        deep_features: features,
        confidence_score: 0.95
      });

    if (error) throw error;
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Product image indexed successfully',
    product_id,
    features_extracted: Object.keys(features)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getVisualSearchAnalytics(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get('period') || '7d';

  const days = period === '30d' ? 30 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Get visual search statistics
  const { data: visualSearches } = await supabase
    .from('search_queries')
    .select('*')
    .eq('search_type', 'visual')
    .gte('created_at', startDate.toISOString());

  const analytics = {
    total_visual_searches: visualSearches?.length || 0,
    search_types: {},
    success_rate: 0,
    average_results: 0,
    popular_features: []
  };

  if (visualSearches && visualSearches.length > 0) {
    // Analyze search types
    visualSearches.forEach(search => {
      const searchType = search.search_metadata?.visual_search_type || 'hybrid';
      analytics.search_types[searchType] = (analytics.search_types[searchType] || 0) + 1;
    });

    // Calculate success rate (searches with results > 0)
    const successfulSearches = visualSearches.filter(s => s.results_count > 0).length;
    analytics.success_rate = successfulSearches / visualSearches.length;

    // Calculate average results
    const totalResults = visualSearches.reduce((sum, s) => sum + (s.results_count || 0), 0);
    analytics.average_results = totalResults / visualSearches.length;
  }

  return new Response(JSON.stringify({
    success: true,
    analytics,
    period
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper functions for feature extraction and similarity calculations

async function extractFeaturesFromImage(imageInput: string): Promise<ImageFeatures | null> {
  try {
    // This is a mock implementation. In a real scenario, you would:
    // 1. Use a computer vision service (Google Vision API, AWS Rekognition)
    // 2. Use a local ML model (TensorFlow.js, ONNX)
    // 3. Process the image to extract actual features

    console.log('Extracting features from image...');

    // Mock feature extraction
    const mockFeatures: ImageFeatures = {
      color_histogram: Array.from({ length: 64 }, () => Math.random()),
      shape_descriptors: {
        edges: Array.from({ length: 32 }, () => Math.random()),
        corners: Array.from({ length: 16 }, () => Math.random()),
        contours: Array.from({ length: 24 }, () => Math.random())
      },
      deep_features: Array.from({ length: 512 }, () => Math.random()),
      dominant_colors: ['#FF5733', '#33FF57', '#3357FF'] // Mock dominant colors
    };

    return mockFeatures;
  } catch (error) {
    console.error('Feature extraction failed:', error);
    return null;
  }
}

async function findSimilarByColor(colorHistogram: number[], threshold: number, limit: number) {
  // Get all products with visual features
  const { data: products } = await supabase
    .from('visual_search_features')
    .select(`
      *,
      products!inner(id, name, price, image_url, average_rating)
    `)
    .not('color_histogram', 'is', null);

  if (!products) return [];

  // Calculate color similarity for each product
  const similarities = products
    .map(product => {
      const similarity = calculateColorSimilarity(colorHistogram, product.color_histogram);
      return {
        ...product.products,
        similarity_score: similarity,
        match_type: 'color'
      };
    })
    .filter(product => product.similarity_score >= threshold)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);

  return similarities;
}

async function findSimilarByShape(shapeDescriptors: any, threshold: number, limit: number) {
  // Get all products with shape descriptors
  const { data: products } = await supabase
    .from('visual_search_features')
    .select(`
      *,
      products!inner(id, name, price, image_url, average_rating)
    `)
    .not('shape_descriptors', 'is', null);

  if (!products) return [];

  // Calculate shape similarity
  const similarities = products
    .map(product => {
      const similarity = calculateShapeSimilarity(shapeDescriptors, product.shape_descriptors);
      return {
        ...product.products,
        similarity_score: similarity,
        match_type: 'shape'
      };
    })
    .filter(product => product.similarity_score >= threshold)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);

  return similarities;
}

async function findSimilarByDeepFeatures(deepFeatures: number[], threshold: number, limit: number) {
  // Get all products with deep features
  const { data: products } = await supabase
    .from('visual_search_features')
    .select(`
      *,
      products!inner(id, name, price, image_url, average_rating)
    `)
    .not('deep_features', 'is', null);

  if (!products) return [];

  // Calculate deep feature similarity (cosine similarity)
  const similarities = products
    .map(product => {
      const productFeatures = product.deep_features?.deep_features || product.feature_vector;
      if (!productFeatures) return null;
      
      const similarity = calculateCosineSimilarity(deepFeatures, productFeatures);
      return {
        ...product.products,
        similarity_score: similarity,
        match_type: 'deep_features'
      };
    })
    .filter(product => product && product.similarity_score >= threshold)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);

  return similarities;
}

async function findSimilarByHybrid(features: ImageFeatures, threshold: number, limit: number) {
  // Get all products with visual features
  const { data: products } = await supabase
    .from('visual_search_features')
    .select(`
      *,
      products!inner(id, name, price, image_url, average_rating)
    `);

  if (!products) return [];

  // Calculate hybrid similarity (weighted combination)
  const similarities = products
    .map(product => {
      let totalSimilarity = 0;
      let weightSum = 0;

      // Color similarity (weight: 0.3)
      if (product.color_histogram && features.color_histogram) {
        const colorSim = calculateColorSimilarity(features.color_histogram, product.color_histogram);
        totalSimilarity += colorSim * 0.3;
        weightSum += 0.3;
      }

      // Shape similarity (weight: 0.3)
      if (product.shape_descriptors && features.shape_descriptors) {
        const shapeSim = calculateShapeSimilarity(features.shape_descriptors, product.shape_descriptors);
        totalSimilarity += shapeSim * 0.3;
        weightSum += 0.3;
      }

      // Deep features similarity (weight: 0.4)
      const productFeatures = product.deep_features?.deep_features || product.feature_vector;
      if (productFeatures && features.deep_features) {
        const deepSim = calculateCosineSimilarity(features.deep_features, productFeatures);
        totalSimilarity += deepSim * 0.4;
        weightSum += 0.4;
      }

      const finalSimilarity = weightSum > 0 ? totalSimilarity / weightSum : 0;

      return {
        ...product.products,
        similarity_score: finalSimilarity,
        match_type: 'hybrid'
      };
    })
    .filter(product => product.similarity_score >= threshold)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);

  return similarities;
}

function calculateColorSimilarity(hist1: number[], hist2: number[]): number {
  if (!hist1 || !hist2 || hist1.length !== hist2.length) return 0;

  // Calculate chi-square distance
  let distance = 0;
  for (let i = 0; i < hist1.length; i++) {
    const sum = hist1[i] + hist2[i];
    if (sum > 0) {
      distance += Math.pow(hist1[i] - hist2[i], 2) / sum;
    }
  }

  // Convert to similarity score (0-1)
  return Math.max(0, 1 - distance / hist1.length);
}

function calculateShapeSimilarity(shape1: any, shape2: any): number {
  if (!shape1 || !shape2) return 0;

  // Simple shape similarity based on edge descriptors
  const edges1 = shape1.edges || [];
  const edges2 = shape2.edges || [];

  if (edges1.length === 0 || edges2.length === 0) return 0;

  return calculateCosineSimilarity(edges1, edges2);
}

function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  if (norm1 === 0 || norm2 === 0) return 0;

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

async function convertColorsToHistogram(colors: string[]): Promise<number[]> {
  // Convert hex colors to histogram representation
  // This is a simplified implementation
  const histogram = new Array(64).fill(0);

  colors.forEach(color => {
    // Parse hex color and create histogram bins
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Map to histogram bins (simplified)
    const rBin = Math.floor(r / 64);
    const gBin = Math.floor(g / 64);
    const bBin = Math.floor(b / 64);

    const index = rBin * 16 + gBin * 4 + bBin;
    if (index < histogram.length) {
      histogram[index]++;
    }
  });

  // Normalize histogram
  const sum = histogram.reduce((a, b) => a + b, 0);
  return sum > 0 ? histogram.map(h => h / sum) : histogram;
}