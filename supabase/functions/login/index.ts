
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"
import * as bcrypt from 'https://esm.sh/bcryptjs@2.4.3'

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
    
    // Buscar o usuário pelo nome de usuário
    const { data: users, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', username);
    
    if (userError || !users || users.length === 0) {
      console.log("Usuário não encontrado")
      return new Response(
        JSON.stringify({ error: "Usuário ou senha incorretos" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    const user = users[0];
    
    // Verificar se a senha está em formato hash ou em texto plano (para compatibilidade)
    let passwordMatches = false;
    
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      // Senha já está em formato hash, usar bcrypt para verificar
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      // Senha em texto plano para compatibilidade com contas existentes
      passwordMatches = (password === user.password);
    }
    
    if (!passwordMatches) {
      console.log("Senha incorreta")
      return new Response(
        JSON.stringify({ error: "Usuário ou senha incorretos" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    console.log("Login bem-sucedido", { userId: user.id })
    
    // Prepare user data to return (excluding password)
    const userData = {
      id: user.id,
      matricula: user.matricula,
      nome: user.nome,
      cargo: user.cargo,
      setor: user.setor,
      username: user.username,
      admin: user.admin,
      tipo_usuario: user.tipo_usuario,
      primeiro_acesso: user.primeiro_acesso
    };
    
    // Retorna os dados do usuário (exceto a senha)
    return new Response(
      JSON.stringify({ user: userData }),
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
