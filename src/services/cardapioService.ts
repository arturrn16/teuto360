
import { supabase } from "@/integrations/supabase/client";
import { Cardapio, DiaSemana, ItemCardapio } from "@/models/cardapio";

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
    
    return data || [];
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
    
    return data || null;
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
          itens: cardapio.itens,
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
          itens: cardapio.itens,
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
    
    return result;
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
      itens: emptyItems,
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
