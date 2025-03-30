
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a file to Supabase Storage using the Edge Function
 * This bypasses client-side RLS restrictions
 */
export const uploadUserPhoto = async (
  userId: number,
  file: File
): Promise<{ url: string | null; error: any }> => {
  try {
    // First try the direct upload approach
    const fileName = `${userId}_${Date.now()}.${file.name.split('.').pop()}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user_photos')
      .upload(fileName, file, {
        cacheControl: 'no-cache',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Direct upload failed, trying edge function:", uploadError);
      
      // If direct upload fails, try using the edge function
      const { data: functionData, error: functionError } = await supabase.functions
        .invoke('file-access', {
          body: {
            method: 'upload',
            path: {
              bucket: 'user_photos',
              filePath: fileName
            },
            file: await file.arrayBuffer(),
            userId
          }
        });
        
      if (functionError) {
        return { url: null, error: functionError };
      }
      
      if (functionData?.error) {
        return { url: null, error: functionData.error };
      }
      
      // Get the public URL
      const { data: urlData } = await supabase.storage
        .from('user_photos')
        .getPublicUrl(fileName);
        
      // Add timestamp to prevent caching
      const timeStampedUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      
      // Update the user_photos table
      await updateUserPhotoRecord(userId, timeStampedUrl);
      
      return { url: timeStampedUrl, error: null };
    }
    
    // If direct upload succeeded, continue with the process
    const { data: urlData } = await supabase.storage
      .from('user_photos')
      .getPublicUrl(fileName);
      
    // Add timestamp to prevent caching
    const timeStampedUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    
    // Update the user_photos table
    const recordError = await updateUserPhotoRecord(userId, timeStampedUrl);
    
    if (recordError) {
      return { url: null, error: recordError };
    }
    
    return { url: timeStampedUrl, error: null };
  } catch (error) {
    console.error("Error in uploadUserPhoto:", error);
    return { url: null, error };
  }
};

/**
 * Update or create a user_photos record
 */
const updateUserPhotoRecord = async (
  userId: number,
  photoUrl: string
): Promise<any> => {
  try {
    // Check if user already has a photo record
    const { data: existingData, error: checkError } = await supabase
      .from('user_photos')
      .select()
      .eq('user_id', userId);
      
    if (checkError) {
      return checkError;
    }
    
    // Update or insert the record
    if (existingData && existingData.length > 0) {
      const { error } = await supabase
        .from('user_photos')
        .update({ 
          photo_url: photoUrl,
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);
        
      return error;
    } else {
      const { error } = await supabase
        .from('user_photos')
        .insert({ 
          user_id: userId, 
          photo_url: photoUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      return error;
    }
  } catch (error) {
    return error;
  }
};
