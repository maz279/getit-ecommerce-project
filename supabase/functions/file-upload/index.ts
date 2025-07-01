import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// File upload configuration
const UPLOAD_CONFIGS = {
  images: {
    bucket: 'product-images',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    resolutions: [
      { name: 'thumbnail', width: 150, height: 150 },
      { name: 'medium', width: 500, height: 500 },
      { name: 'large', width: 1200, height: 1200 }
    ]
  },
  documents: {
    bucket: 'vendor-documents',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  avatars: {
    bucket: 'user-avatars',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    resolutions: [
      { name: 'thumbnail', width: 100, height: 100 },
      { name: 'profile', width: 300, height: 300 }
    ]
  },
  banners: {
    bucket: 'marketing-banners',
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    resolutions: [
      { name: 'mobile', width: 800, height: 400 },
      { name: 'desktop', width: 1920, height: 600 }
    ]
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'upload':
        return await uploadFile(req, supabaseClient)
      case 'upload-multiple':
        return await uploadMultipleFiles(req, supabaseClient)
      case 'delete':
        return await deleteFile(req, supabaseClient)
      case 'get-url':
        return await getFileUrl(req, supabaseClient)
      case 'get-signed-url':
        return await getSignedUrl(req, supabaseClient)
      case 'resize':
        return await resizeImage(req, supabaseClient)
      case 'optimize':
        return await optimizeFile(req, supabaseClient)
      case 'get-metadata':
        return await getFileMetadata(req, supabaseClient)
      case 'bulk-optimize':
        return await bulkOptimize(req, supabaseClient)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('File upload error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function uploadFile(req: Request, supabaseClient: any) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const fileType = formData.get('type') as string || 'images'
  const userId = formData.get('userId') as string
  const metadata = JSON.parse(formData.get('metadata') as string || '{}')

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const config = UPLOAD_CONFIGS[fileType as keyof typeof UPLOAD_CONFIGS]
  if (!config) {
    return new Response(JSON.stringify({ error: 'Invalid file type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Validate file
  const validation = validateFile(file, config)
  if (!validation.valid) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const fileName = generateFileName(file.name, userId)
    const filePath = `${fileType}/${fileName}`

    // Upload original file
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(config.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Generate resized versions if configured
    const resizedVersions = []
    if (config.resolutions && file.type.startsWith('image/')) {
      for (const resolution of config.resolutions) {
        try {
          const resizedFile = await resizeImageFile(file, resolution.width, resolution.height)
          const resizedPath = `${fileType}/${resolution.name}/${fileName}`
          
          const { data: resizedUpload } = await supabaseClient.storage
            .from(config.bucket)
            .upload(resizedPath, resizedFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (resizedUpload) {
            resizedVersions.push({
              resolution: resolution.name,
              path: resizedPath,
              url: getPublicUrl(supabaseClient, config.bucket, resizedPath)
            })
          }
        } catch (error) {
          console.error(`Failed to create ${resolution.name} version:`, error)
        }
      }
    }

    // Save file metadata
    const fileRecord = {
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      bucket_name: config.bucket,
      user_id: userId,
      metadata: {
        ...metadata,
        original_name: file.name,
        upload_timestamp: new Date().toISOString(),
        resized_versions: resizedVersions
      },
      created_at: new Date().toISOString()
    }

    const { data: savedFile, error: saveError } = await supabaseClient
      .from('file_uploads')
      .insert(fileRecord)
      .select()
      .single()

    if (saveError) {
      throw saveError
    }

    const publicUrl = getPublicUrl(supabaseClient, config.bucket, filePath)

    return new Response(JSON.stringify({
      success: true,
      file: {
        id: savedFile.id,
        name: file.name,
        path: filePath,
        url: publicUrl,
        size: file.size,
        type: file.type,
        resized_versions: resizedVersions
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function uploadMultipleFiles(req: Request, supabaseClient: any) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]
  const fileType = formData.get('type') as string || 'images'
  const userId = formData.get('userId') as string

  if (!files || files.length === 0) {
    return new Response(JSON.stringify({ error: 'No files provided' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const results = []
  const errors = []

  for (const file of files) {
    try {
      // Create individual form data for each file
      const individualFormData = new FormData()
      individualFormData.append('file', file)
      individualFormData.append('type', fileType)
      individualFormData.append('userId', userId)

      const uploadRequest = new Request(req.url, {
        method: 'POST',
        body: individualFormData
      })

      const result = await uploadFile(uploadRequest, supabaseClient)
      const resultData = await result.json()

      if (resultData.success) {
        results.push(resultData.file)
      } else {
        errors.push({ file: file.name, error: resultData.error })
      }
    } catch (error) {
      errors.push({ file: file.name, error: error.message })
    }
  }

  return new Response(JSON.stringify({
    success: true,
    uploaded_files: results,
    errors: errors,
    total_uploaded: results.length,
    total_errors: errors.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteFile(req: Request, supabaseClient: any) {
  const { file_path, bucket_name, file_id } = await req.json()

  try {
    // Delete from storage
    if (file_path && bucket_name) {
      const { error: storageError } = await supabaseClient.storage
        .from(bucket_name)
        .remove([file_path])

      if (storageError) {
        console.error('Storage deletion error:', storageError)
      }
    }

    // Delete from database
    if (file_id) {
      const { error: dbError } = await supabaseClient
        .from('file_uploads')
        .delete()
        .eq('id', file_id)

      if (dbError) {
        throw dbError
      }
    }

    return new Response(JSON.stringify({
      success: true,
      deleted: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getFileUrl(req: Request, supabaseClient: any) {
  const { file_path, bucket_name } = await req.json()

  try {
    const publicUrl = getPublicUrl(supabaseClient, bucket_name, file_path)

    return new Response(JSON.stringify({
      success: true,
      url: publicUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getSignedUrl(req: Request, supabaseClient: any) {
  const { file_path, bucket_name, expires_in = 3600 } = await req.json()

  try {
    const { data, error } = await supabaseClient.storage
      .from(bucket_name)
      .createSignedUrl(file_path, expires_in)

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({
      success: true,
      signed_url: data.signedUrl,
      expires_in: expires_in
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function resizeImage(req: Request, supabaseClient: any) {
  // This would integrate with image processing service
  // For now, return placeholder
  return new Response(JSON.stringify({
    success: true,
    message: 'Image resize functionality - would integrate with image processing service'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function optimizeFile(req: Request, supabaseClient: any) {
  // This would integrate with file optimization service
  return new Response(JSON.stringify({
    success: true,
    message: 'File optimization functionality - would integrate with compression service'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getFileMetadata(req: Request, supabaseClient: any) {
  const { file_id } = await req.json()

  try {
    const { data: fileData, error } = await supabaseClient
      .from('file_uploads')
      .select('*')
      .eq('id', file_id)
      .single()

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({
      success: true,
      metadata: fileData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function bulkOptimize(req: Request, supabaseClient: any) {
  // Bulk optimization functionality
  return new Response(JSON.stringify({
    success: true,
    message: 'Bulk optimization functionality - would process files in batches'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function validateFile(file: File, config: any) {
  if (file.size > config.maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds maximum allowed size of ${config.maxSize / 1024 / 1024}MB` 
    }
  }

  if (!config.allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed` 
    }
  }

  return { valid: true }
}

function generateFileName(originalName: string, userId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${userId}_${timestamp}_${random}.${extension}`
}

function getPublicUrl(supabaseClient: any, bucket: string, path: string): string {
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

async function resizeImageFile(file: File, width: number, height: number): Promise<File> {
  // This is a placeholder - in production you'd use a proper image processing library
  // For now, return the original file
  return file
}