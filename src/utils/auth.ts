
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define user types
export interface User {
  id: number;
  matricula: string;
  nome: string;
  cargo: string;
  setor: string;
  username: string;
  admin: boolean;
  tipo_usuario: 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum';
  created_at?: string;
  updated_at?: string;
}

export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    // Chama a edge function de login
    const { data, error } = await supabase.functions.invoke('login', {
      body: { username, password }
    });

    if (error) {
      console.error("Erro na função de login:", error);
      toast.error("Erro ao fazer login");
      return null;
    }

    if (data.error) {
      toast.error(data.error);
      return null;
    }

    // Se tudo deu certo, retorna o usuário
    storeUser(data.user);
    return data.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    toast.error("Erro ao fazer login");
    return null;
  }
};

export const logoutUser = (): void => {
  // Clear user data from localStorage
  localStorage.removeItem("hrUser");
  localStorage.removeItem("hrToken");
};

export const getStoredUser = (): User | null => {
  const userData = localStorage.getItem("hrUser");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem("hrUser", JSON.stringify(user));
  // Em uma implementação real, armazenariamos um JWT token
  localStorage.setItem("hrToken", "mock-jwt-token");
};

export const checkUserPermission = (
  user: User | null,
  requiredTypes: ('admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum')[]
): boolean => {
  if (!user) return false;
  
  // Admin pode acessar tudo
  if (user.admin) return true;
  
  // Verifica se o tipo de usuário está nos tipos requeridos
  return requiredTypes.includes(user.tipo_usuario);
};
