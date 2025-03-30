
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Upload a file to Supabase Storage with detailed error handling
 */
export const uploadUserPhoto = async (
  userId: number,
  file: File
): Promise<{ url: string | null; error: any }> => {
  try {
    console.log(`Starting photo upload for user ${userId}`);
    
    // Create a unique file name with timestamp and random part to avoid collisions
    const fileExt = file.name.split('.').pop();
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileName = `${userId}_${Date.now()}_${randomId}.${fileExt}`;
    
    console.log(`Generated filename: ${fileName}`);
    
    // Make sure the bucket exists before upload
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket('user_photos');
      
    if (bucketError && bucketError.message !== "The resource was not found") {
      console.error("Error checking bucket:", bucketError);
      toast.error("Erro ao verificar bucket de fotos");
      return { url: null, error: bucketError };
    }

    if (!bucketData && bucketError?.message === "The resource was not found") {
      console.log("Bucket doesn't exist, creating it");
      const { error: createError } = await supabase.storage.createBucket('user_photos', {
        public: true
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        toast.error("Erro ao criar bucket de fotos");
        return { url: null, error: createError };
      }
    }

    // Perform the file upload
    console.log("Attempting direct file upload...");
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user_photos')
      .upload(fileName, file, {
        cacheControl: '0',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Direct upload failed:", uploadError);
      console.log("Upload error details:", uploadError.message);
      toast.error("Erro ao fazer upload da foto");
      return { url: null, error: uploadError };
    }
    
    console.log("Upload successful:", uploadData);
    
    // Get public URL
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
    const { error: recordError } = await updateUserPhotoRecord(userId, timeStampedUrl);
    
    if (recordError) {
      console.error("Error updating photo record:", recordError);
      toast.error("Erro ao atualizar registro da foto");
      return { url: timeStampedUrl, error: recordError };
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
 * Update or create a user_photos record with better error handling
 */
const updateUserPhotoRecord = async (
  userId: number,
  photoUrl: string
): Promise<{ error: any }> => {
  try {
    console.log(`Updating photo record for user ${userId}`);
    
    // Check if user already has a photo record
    const { data: existingData, error: checkError } = await supabase
      .from('user_photos')
      .select()
      .eq('user_id', userId);
      
    if (checkError) {
      console.error("Error checking existing photo:", checkError);
      console.log("Check error details:", checkError.message);
      return { error: checkError };
    }
    
    console.log("Existing photo data:", existingData);
    const timestamp = new Date().toISOString();
    
    // Update or insert the record
    let result;
    
    if (existingData && existingData.length > 0) {
      console.log("Updating existing photo record");
      result = await supabase
        .from('user_photos')
        .update({ 
          photo_url: photoUrl,
          updated_at: timestamp 
        })
        .eq('user_id', userId);
    } else {
      console.log("Creating new photo record");
      result = await supabase
        .from('user_photos')
        .insert({ 
          user_id: userId, 
          photo_url: photoUrl,
          created_at: timestamp,
          updated_at: timestamp 
        });
    }
        
    if (result.error) {
      console.error("Error in database operation:", result.error);
      console.log("Operation error details:", result.error.message);
      return { error: result.error };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Error in updateUserPhotoRecord:", error);
    return { error };
  }
};
