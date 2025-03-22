
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

console.log("Iniciando edge function de redefinição de senha com verificação de identidade.")

const handler = async (req: Request): Promise<Response> => {
  console.log("Recebendo requisição de redefinição de senha")
  
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
    const { username, currentPassword, cpf, dataNascimento, newPassword } = await req.json();
    
    if (!username || !currentPassword || !cpf || !dataNascimento || !newPassword) {
      console.log("Erro: Dados incompletos na requisição")
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    console.log(`Tentando verificar credenciais para o usuário: ${username}`)
    
    // Verificar se as credenciais atuais são válidas
    const { data: userData, error: credentialsError } = await supabase
      .rpc('verify_user_credentials', { 
        p_username: username, 
        p_password: currentPassword 
      });
    
    if (credentialsError || !userData || userData.length === 0) {
      console.log("Credenciais inválidas")
      return new Response(
        JSON.stringify({ error: "Nome de usuário ou senha atual incorretos" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    const userId = userData[0].id;
    
    // Verificar CPF e data de nascimento
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('cpf, data_nascimento')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      console.log("Erro ao buscar dados do usuário:", userError)
      return new Response(
        JSON.stringify({ error: "Erro ao verificar identidade do usuário" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    // Formatar a data do banco para comparação (YYYY-MM-DD)
    const dbDate = user.data_nascimento ? user.data_nascimento.split('T')[0] : null;
    
    // Verificar se o CPF e a data de nascimento correspondem
    if (user.cpf !== cpf || dbDate !== dataNascimento) {
      console.log("CPF ou data de nascimento não correspondem", {
        providedCpf: cpf,
        dbCpf: user.cpf,
        providedDate: dataNascimento,
        dbDate: dbDate
      })
      return new Response(
        JSON.stringify({ error: "CPF ou data de nascimento incorretos" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    // Atualizar a senha do usuário
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        password: newPassword,
        first_login: false 
      })
      .eq('id', userId);
    
    if (updateError) {
      console.log("Erro ao atualizar senha:", updateError)
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar senha" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    console.log("Senha redefinida com sucesso para o usuário:", userId)
    
    // Retorna sucesso
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Senha alterada com sucesso" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erro no processamento da redefinição de senha:", error)
    return new Response(
      JSON.stringify({ error: "Erro no processamento da redefinição de senha" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
}

serve(handler);
