
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
    console.log(`Fetching preferences for user ${userId}`);
    // Don't use single() as it returns an error if no record is found
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user preferences:", error);
      return null;
    }

    console.log("User preferences data:", data);
    return data && data.length > 0 ? data[0] as UserPreference : null;
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
    console.log(`Updating light meal preference for user ${userId} to ${lightMeal} - START`);
    console.log("Current timestamp:", new Date().toISOString());
    
    // Check if user preference already exists
    const { data: existingData, error: checkError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId);
      
    if (checkError) {
      console.error("Error checking existing preferences:", checkError);
      console.log("Check error details:", checkError.details, checkError.hint, checkError.message);
      toast.error("Erro ao verificar preferências existentes");
      return false;
    }
    
    console.log("Existing preferences data:", existingData);
    const timestamp = new Date().toISOString();
    
    let result;
    if (existingData && existingData.length > 0) {
      console.log(`Updating existing preference for user ${userId}`);
      result = await supabase
        .from("user_preferences")
        .update({ 
          light_meal: lightMeal,
          updated_at: timestamp
        })
        .eq("user_id", userId);
    } else {
      console.log(`Creating new preference for user ${userId}`);
      result = await supabase
        .from("user_preferences")
        .insert({ 
          user_id: userId, 
          light_meal: lightMeal,
          created_at: timestamp,
          updated_at: timestamp
        });
    }
    
    if (result.error) {
      console.error("Error in preference operation:", result.error);
      console.log("Error details:", result.error.details, result.error.hint, result.error.message);
      toast.error("Erro ao atualizar preferência de refeição");
      return false;
    }
    
    console.log("Preference operation successful:", result);
    return true;
  } catch (error) {
    console.error("Error in updateLightMealPreference:", error);
    toast.error("Erro ao atualizar preferência");
    return false;
  }
};
