
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

console.log("Iniciando edge function de alteração de senha.")

const handler = async (req: Request): Promise<Response> => {
  console.log("Recebendo requisição de alteração de senha")
  
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar um cliente Supabase para acessar o banco de dados
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extrair dados da requisição
    const { userId, newPassword } = await req.json();
    
    if (!userId || !newPassword) {
      console.log("Erro: userId ou newPassword não fornecidos")
      return new Response(
        JSON.stringify({ error: "ID do usuário e nova senha são obrigatórios" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    console.log(`Tentando alterar senha para o usuário ID: ${userId}`)
    
    // Atualizar a senha do usuário e marcar first_login como false
    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        password: newPassword,
        first_login: false 
      })
      .eq('id', userId)
      .select('id, nome');
    
    if (error) {
      console.log("Erro ao atualizar senha:", error)
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar senha" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    if (!data || data.length === 0) {
      console.log("Usuário não encontrado")
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404 
        }
      );
    }
    
    console.log("Senha alterada com sucesso", { userId: data[0].id })
    
    // Retorna sucesso
    return new Response(
      JSON.stringify({ success: true, message: "Senha alterada com sucesso" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erro no processamento da alteração de senha:", error)
    return new Response(
      JSON.stringify({ error: "Erro no processamento da alteração de senha" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
}

serve(handler);
