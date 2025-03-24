
import { supabase } from "@/integrations/supabase/client";

export interface Card {
  id: number;
  matricula: string;
  nome_colaborador: string;
  tipo_cartao: string;
  status: "Disponivel" | "Retirado";
  data_chegada: string;
  data_retirada: string | null;
}

// Check if a card is available by matricula
export const checkCardByMatricula = async (matricula: string): Promise<Card | null> => {
  const { data, error } = await supabase
    .from("cartoes")
    .select("*")
    .eq("matricula", matricula)
    .single();

  if (error) {
    console.error("Error checking card:", error);
    return null;
  }

  return data as Card;
};

// Get all cards (for admin page)
export const getAllCards = async (): Promise<Card[]> => {
  const { data, error } = await supabase
    .from("cartoes")
    .select("*")
    .order("data_chegada", { ascending: false });

  if (error) {
    console.error("Error fetching cards:", error);
    return [];
  }

  return data as Card[];
};

// Add a new card
export const addCard = async (cardData: Omit<Card, "id" | "data_chegada" | "data_retirada">): Promise<boolean> => {
  const { error } = await supabase
    .from("cartoes")
    .insert(cardData);

  if (error) {
    console.error("Error adding card:", error);
    return false;
  }

  return true;
};

// Update card status to "Retirado"
export const updateCardStatus = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("cartoes")
    .update({ 
      status: "Retirado",
      data_retirada: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating card status:", error);
    return false;
  }

  return true;
};

// Delete a card
export const deleteCard = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from("cartoes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting card:", error);
    return false;
  }

  return true;
};
