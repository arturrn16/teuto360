
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const handler = async (req: Request): Promise<Response> => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar um cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extrair parâmetros da requisição
    const { id, tipo } = await req.json();
    
    if (!id || !tipo) {
      return new Response(
        JSON.stringify({ error: "ID e tipo da solicitação são obrigatórios" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    let dadosSolicitacao;
    
    // Buscar dados da solicitação de acordo com o tipo
    if (tipo === 'rota') {
      const { data, error } = await supabase
        .from('solicitacoes_transporte_rota')
        .select('*')
        .eq('id', id)
        .eq('status', 'aprovada')
        .single();
        
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Solicitação não encontrada ou não aprovada" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404 
          }
        );
      }
      
      dadosSolicitacao = data;
    } else if (tipo === '12x36') {
      const { data, error } = await supabase
        .from('solicitacoes_transporte_12x36')
        .select('*')
        .eq('id', id)
        .eq('status', 'aprovada')
        .single();
        
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Solicitação não encontrada ou não aprovada" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404 
          }
        );
      }
      
      dadosSolicitacao = data;
    } else if (tipo === 'refeicao') {
      const { data, error } = await supabase
        .from('solicitacoes_refeicao')
        .select('*')
        .eq('id', id)
        .eq('status', 'aprovada')
        .single();
        
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Solicitação não encontrada ou não aprovada" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404 
          }
        );
      }
      
      dadosSolicitacao = data;
    } else {
      return new Response(
        JSON.stringify({ error: "Tipo de solicitação inválido" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Simular a geração de um ticket (em uma implementação real, seria gerado um JPEG)
    // Aqui retornamos apenas os dados que seriam usados para gerar o ticket
    return new Response(
      JSON.stringify({ 
        success: true,
        ticket: {
          id: dadosSolicitacao.id,
          tipo,
          dados: dadosSolicitacao
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erro ao gerar ticket:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao gerar ticket" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
}

serve(handler);
