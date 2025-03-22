
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

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
    
    // Hash a nova senha
    const hashedPassword = await bcrypt.hash(newPassword);
    console.log("Senha criptografada com sucesso");
    
    // Atualiza a senha e marca como não sendo mais o primeiro acesso
    const { error } = await supabase
      .from('usuarios')
      .update({ 
        password: hashedPassword,
        primeiro_acesso: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.log("Erro ao alterar senha:", error)
      return new Response(
        JSON.stringify({ error: "Erro ao alterar senha", details: error.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    console.log("Senha alterada com sucesso", { userId })
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erro no processamento da alteração de senha:", error)
    return new Response(
      JSON.stringify({ error: "Erro no processamento da alteração de senha", details: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
}

serve(handler);
