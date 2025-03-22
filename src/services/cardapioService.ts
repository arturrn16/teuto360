
import { supabase } from "@/integrations/supabase/client";
import { Cardapio, DiaSemana, ItemCardapio } from "@/models/cardapio";
import { Json } from "@/integrations/supabase/types";

export const getCardapioSemana = async (): Promise<Cardapio[]> => {
  try {
    const { data, error } = await supabase
      .from('cardapio')
      .select('*')
      .order('id');
      
    if (error) {
      console.error('Erro ao buscar cardápio:', error);
      throw error;
    }
    
    // Convert database data to match our Cardapio type
    return (data || []).map(item => ({
      id: item.id,
      diasemana: item.diasemana as DiaSemana, // Type assertion to DiaSemana
      data: item.data,
      itens: item.itens as unknown as ItemCardapio // Type conversion
    }));
  } catch (error) {
    console.error('Erro ao buscar cardápio:', error);
    throw error;
  }
};

export const getCardapioPorDia = async (diaSemana: DiaSemana): Promise<Cardapio | null> => {
  try {
    const { data, error } = await supabase
      .from('cardapio')
      .select('*')
      .eq('diasemana', diaSemana) // Changed from diaSemana to diasemana
      .single();
      
    if (error && error.code !== 'PGRST116') { // Ignore "No rows returned" error
      console.error(`Erro ao buscar cardápio para ${diaSemana}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    // Convert database data to match our Cardapio type
    return {
      id: data.id,
      diasemana: data.diasemana as DiaSemana,
      data: data.data,
      itens: data.itens as unknown as ItemCardapio
    };
  } catch (error) {
    console.error(`Erro ao buscar cardápio para ${diaSemana}:`, error);
    throw error;
  }
};

export const salvarCardapio = async (cardapio: Cardapio): Promise<Cardapio> => {
  try {
    // Check if cardapio for this day already exists
    const existingCardapio = await getCardapioPorDia(cardapio.diasemana);
    
    let result;
    if (existingCardapio) {
      // Update existing
      const { data, error } = await supabase
        .from('cardapio')
        .update({ 
          itens: cardapio.itens as unknown as Json, // Type conversion
          data: cardapio.data || new Date().toISOString()
        })
        .eq('diasemana', cardapio.diasemana) // Changed from diaSemana to diasemana
        .select()
        .single();
        
      if (error) {
        console.error('Erro ao atualizar cardápio:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('cardapio')
        .insert({
          diasemana: cardapio.diasemana, // Changed from diaSemana to diasemana
          itens: cardapio.itens as unknown as Json, // Type conversion
          data: cardapio.data || new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        console.error('Erro ao criar cardápio:', error);
        throw error;
      }
      
      result = data;
    }
    
    // Convert result back to our model type
    return {
      id: result.id,
      diasemana: result.diasemana as DiaSemana,
      data: result.data,
      itens: result.itens as unknown as ItemCardapio
    };
  } catch (error) {
    console.error('Erro ao salvar cardápio:', error);
    throw error;
  }
};

export const inicializarCardapioSemana = async (): Promise<void> => {
  try {
    const diasSemana: DiaSemana[] = [
      'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'
    ];
    
    // Check if we already have entries for all days
    const { data: existingData } = await supabase
      .from('cardapio')
      .select('diasemana'); // Changed from diaSemana to diasemana
      
    const existingDays = new Set(existingData?.map(item => item.diasemana));
    
    // Only create entries for days that don't exist yet
    const diasParaCriar = diasSemana.filter(dia => !existingDays.has(dia));
    
    if (diasParaCriar.length === 0) {
      return; // All days already exist
    }
    
    const emptyItems: ItemCardapio = {
      pratosPrincipais: [],
      guarnicoes: [],
      saladas: [],
      sobremesas: []
    };
    
    const newEntries = diasParaCriar.map(diasemana => ({
      diasemana, // Changed from diaSemana to diasemana
      itens: emptyItems as unknown as Json, // Type conversion
      data: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('cardapio')
      .insert(newEntries);
      
    if (error) {
      console.error('Erro ao inicializar cardápio:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao inicializar cardápio:', error);
    throw error;
  }
};
