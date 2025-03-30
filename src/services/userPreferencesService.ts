
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserPreference {
  user_id: number;
  light_meal: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getUserPreferences = async (userId: number): Promise<UserPreference | null> => {
  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user preferences:", error);
      return null;
    }

    return data as UserPreference;
  } catch (error) {
    console.error("Error in getUserPreferences:", error);
    return null;
  }
};

export const updateLightMealPreference = async (
  userId: number, 
  lightMeal: boolean
): Promise<boolean> => {
  try {
    console.log("Updating light meal preference for user", userId, "to", lightMeal);
    
    // Check if user preference already exists
    const { data: existingData, error: checkError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId);
      
    if (checkError) {
      console.error("Error checking existing preferences:", checkError);
      toast.error("Erro ao verificar preferências existentes");
      return false;
    }
    
    const timestamp = new Date().toISOString();
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({ 
          light_meal: lightMeal,
          updated_at: timestamp
        })
        .eq("user_id", userId);
          
      if (updateError) {
        console.error("Error updating preference:", updateError);
        toast.error("Erro ao atualizar preferência de refeição");
        return false;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({ 
          user_id: userId, 
          light_meal: lightMeal,
          created_at: timestamp,
          updated_at: timestamp
        });
          
      if (insertError) {
        console.error("Error inserting preference:", insertError);
        toast.error("Erro ao salvar preferência de refeição");
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateLightMealPreference:", error);
    toast.error("Erro ao atualizar preferência");
    return false;
  }
};
