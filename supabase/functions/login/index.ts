
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

console.log("Iniciando edge function de login.")

const handler = async (req: Request): Promise<Response> => {
  console.log("Recebendo requisição de login")
  
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar um cliente Supabase para acessar o banco de dados
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extrair credenciais da requisição
    const { username, password } = await req.json();
    
    if (!username || !password) {
      console.log("Erro: Username ou password não fornecidos")
      return new Response(
        JSON.stringify({ error: "Usuário e senha são obrigatórios" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    console.log(`Tentando login para o usuário: ${username}`)
    
    // Chamar função RPC que verifica credenciais
    const { data, error } = await supabase
      .rpc('verify_user_credentials', { 
        p_username: username, 
        p_password: password 
      });
    
    if (error) {
      console.log("Erro ao verificar credenciais:", error)
      return new Response(
        JSON.stringify({ error: "Erro ao verificar credenciais" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    if (!data || data.length === 0) {
      console.log("Credenciais inválidas")
      return new Response(
        JSON.stringify({ error: "Usuário ou senha incorretos" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    console.log("Login bem-sucedido", { userId: data[0].id })
    
    // Retorna os dados do usuário (exceto a senha)
    return new Response(
      JSON.stringify({ user: data[0] }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erro no processamento do login:", error)
    return new Response(
      JSON.stringify({ error: "Erro no processamento do login" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
}

serve(handler);
