
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Upload a file to Supabase Storage
 * With updated RLS policies, direct upload should work
 */
export const uploadUserPhoto = async (
  userId: number,
  file: File
): Promise<{ url: string | null; error: any }> => {
  try {
    console.log(`Starting photo upload for user ${userId}`);
    
    // Create a unique file name with timestamp
    const fileName = `${userId}_${Date.now()}.${file.name.split('.').pop()}`;
    
    // Attempt direct upload with the new RLS policies
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user_photos')
      .upload(fileName, file, {
        cacheControl: 'no-cache',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Direct upload failed:", uploadError);
      toast.error("Erro ao fazer upload da foto");
      return { url: null, error: uploadError };
    }
    
    console.log("Upload successful:", uploadData);
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('user_photos')
      .getPublicUrl(fileName);
      
    if (!urlData || !urlData.publicUrl) {
      console.error("Failed to get public URL");
      toast.error("Erro ao obter URL da foto");
      return { url: null, error: "Failed to get public URL" };
    }
    
    // Add timestamp to prevent caching
    const timeStampedUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    console.log("Photo public URL:", timeStampedUrl);
    
    // Update the user_photos table
    const recordError = await updateUserPhotoRecord(userId, timeStampedUrl);
    
    if (recordError) {
      console.error("Error updating photo record:", recordError);
      toast.error("Erro ao atualizar registro da foto");
      return { url: null, error: recordError };
    }
    
    console.log("Photo record updated successfully");
    toast.success("Foto atualizada com sucesso!");
    return { url: timeStampedUrl, error: null };
  } catch (error) {
    console.error("Error in uploadUserPhoto:", error);
    toast.error("Erro ao fazer upload da foto");
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
    console.log(`Updating photo record for user ${userId}`);
    
    // Check if user already has a photo record
    const { data: existingData, error: checkError } = await supabase
      .from('user_photos')
      .select()
      .eq('user_id', userId);
      
    if (checkError) {
      console.error("Error checking existing photo:", checkError);
      return checkError;
    }
    
    console.log("Existing photo data:", existingData);
    const timestamp = new Date().toISOString();
    
    // Update or insert the record
    if (existingData && existingData.length > 0) {
      console.log("Updating existing photo record");
      const { error } = await supabase
        .from('user_photos')
        .update({ 
          photo_url: photoUrl,
          updated_at: timestamp 
        })
        .eq('user_id', userId);
        
      return error;
    } else {
      console.log("Creating new photo record");
      const { error } = await supabase
        .from('user_photos')
        .insert({ 
          user_id: userId, 
          photo_url: photoUrl,
          created_at: timestamp,
          updated_at: timestamp 
        });
        
      return error;
    }
  } catch (error) {
    console.error("Error in updateUserPhotoRecord:", error);
    return error;
  }
};
