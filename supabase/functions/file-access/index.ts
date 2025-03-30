
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method, path, file, userId } = await req.json()
    
    if (!method || !path) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let result

    if (method === 'upload' && file) {
      // Handle file upload
      const { data, error } = await supabaseClient.storage
        .from(path.bucket)
        .upload(path.filePath, file, {
          upsert: true
        })
        
      result = { data, error }
    } else if (method === 'getUrl') {
      // Get public URL
      const { data } = supabaseClient.storage
        .from(path.bucket)
        .getPublicUrl(path.filePath)
        
      result = { data }
    } else if (method === 'updatePhotoRecord' && userId) {
      // Update or create user photo record
      const { data: existingData } = await supabaseClient
        .from('user_photos')
        .select()
        .eq('user_id', userId)
        
      let dbResult
      const timestamp = new Date().toISOString()
      
      if (existingData && existingData.length > 0) {
        dbResult = await supabaseClient
          .from('user_photos')
          .update({ 
            photo_url: path.publicUrl, 
            updated_at: timestamp 
          })
          .eq('user_id', userId)
      } else {
        dbResult = await supabaseClient
          .from('user_photos')
          .insert({ 
            user_id: userId, 
            photo_url: path.publicUrl,
            created_at: timestamp,
            updated_at: timestamp 
          })
      }
      
      result = dbResult
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid method' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
