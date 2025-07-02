import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')!
    supabase.auth.setSession(authHeader)

    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (req.method) {
      case 'GET':
        if (action === 'products') {
          const { data: products, error } = await supabase
            .from('products')
            .select(`
              *,
              product_inventory(*),
              categories(name),
              product_performance_analytics(*)
            `)
            .eq('vendor_id', user.user.id)

          if (error) throw error

          return new Response(JSON.stringify({ products }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'inventory') {
          const { data: inventory, error } = await supabase
            .from('product_inventory')
            .select(`
              *,
              products(name, description, image_url)
            `)
            .eq('vendor_id', user.user.id)
            .order('updated_at', { ascending: false })

          if (error) throw error

          return new Response(JSON.stringify({ inventory }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'stock-movements') {
          const { data: movements, error } = await supabase
            .from('stock_movements')
            .select(`
              *,
              products(name, sku)
            `)
            .eq('vendor_id', user.user.id)
            .order('created_at', { ascending: false })
            .limit(100)

          if (error) throw error

          return new Response(JSON.stringify({ movements }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      case 'POST':
        const body = await req.json()

        if (action === 'create-product') {
          const { product, inventory } = body

          // Create product
          const { data: newProduct, error: productError } = await supabase
            .from('products')
            .insert({
              ...product,
              vendor_id: user.user.id,
            })
            .select()
            .single()

          if (productError) throw productError

          // Create inventory record
          const { data: newInventory, error: inventoryError } = await supabase
            .from('product_inventory')
            .insert({
              product_id: newProduct.id,
              vendor_id: user.user.id,
              ...inventory,
            })
            .select()
            .single()

          if (inventoryError) throw inventoryError

          return new Response(JSON.stringify({ 
            product: newProduct, 
            inventory: newInventory 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'update-stock') {
          const { productId, quantity, movementType, reason } = body

          // Get current inventory
          const { data: currentInventory, error: inventoryError } = await supabase
            .from('product_inventory')
            .select('*')
            .eq('product_id', productId)
            .eq('vendor_id', user.user.id)
            .single()

          if (inventoryError) throw inventoryError

          const previousStock = currentInventory.current_stock
          const newStock = movementType === 'in' 
            ? previousStock + quantity 
            : previousStock - quantity

          // Update inventory
          const { error: updateError } = await supabase
            .from('product_inventory')
            .update({ current_stock: newStock })
            .eq('product_id', productId)
            .eq('vendor_id', user.user.id)

          if (updateError) throw updateError

          // Record stock movement
          const { error: movementError } = await supabase
            .from('stock_movements')
            .insert({
              product_id: productId,
              vendor_id: user.user.id,
              movement_type: movementType,
              quantity: Math.abs(quantity),
              previous_stock: previousStock,
              new_stock: newStock,
              reason,
              performed_by: user.user.id,
            })

          if (movementError) throw movementError

          return new Response(JSON.stringify({ 
            success: true, 
            newStock 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (action === 'bulk-upload') {
          const { products } = body

          const productsWithVendor = products.map((p: any) => ({
            ...p,
            vendor_id: user.user.id,
          }))

          const { data: newProducts, error: productsError } = await supabase
            .from('products')
            .insert(productsWithVendor)
            .select()

          if (productsError) throw productsError

          // Create inventory records for bulk products
          const inventoryRecords = newProducts.map((p: any, index: number) => ({
            product_id: p.id,
            vendor_id: user.user.id,
            sku: products[index].sku || `SKU-${p.id.substring(0, 8)}`,
            current_stock: products[index].initial_stock || 0,
            minimum_stock_level: products[index].minimum_stock || 10,
            unit_cost: products[index].unit_cost || 0,
            selling_price: products[index].price || 0,
          }))

          const { error: inventoryError } = await supabase
            .from('product_inventory')
            .insert(inventoryRecords)

          if (inventoryError) throw inventoryError

          return new Response(JSON.stringify({ 
            success: true, 
            imported: newProducts.length 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        break

      case 'PUT':
        const updateBody = await req.json()
        const { productId, updates } = updateBody

        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', productId)
          .eq('vendor_id', user.user.id)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ product: updatedProduct }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'DELETE':
        const deleteUrl = new URL(req.url)
        const productId = deleteUrl.searchParams.get('productId')

        if (!productId) {
          return new Response(JSON.stringify({ error: 'Product ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        // Delete inventory first (foreign key constraint)
        await supabase
          .from('product_inventory')
          .delete()
          .eq('product_id', productId)
          .eq('vendor_id', user.user.id)

        // Delete product
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)
          .eq('vendor_id', user.user.id)

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})