
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const { username, password } = await req.json();

    // Cria cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verifica as credenciais usando a função personalizada do banco de dados
    const { data, error } = await supabaseClient
      .rpc('verify_user_credentials', { 
        p_username: username, 
        p_password: password 
      });

    if (error) {
      console.error("Erro na verificação de credenciais:", error);
      return new Response(
        JSON.stringify({ error: "Erro ao verificar credenciais" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Usuário ou senha inválidos" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Usuário encontrado, retorna os dados
    const user = data[0];
    
    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          matricula: user.matricula,
          nome: user.nome,
          cargo: user.cargo,
          setor: user.setor,
          username: user.username,
          admin: user.admin,
          tipo_usuario: user.tipo_usuario
        },
        token: "mock-jwt-token" // Em uma implementação real, você geraria um JWT aqui
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar requisição" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
