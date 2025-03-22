
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
  first_login: boolean;
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
    console.log("Login successful, user data:", data.user);
    storeUser(data.user);
    return data.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    toast.error("Erro ao fazer login");
    return null;
  }
};

export const changePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const user = getStoredUser();
    
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }
    
    console.log("Changing password for user:", user.id);
    
    // Call the edge function to change password
    const { data, error } = await supabase.functions.invoke('change-password', {
      body: { 
        userId: user.id,
        newPassword: newPassword
      }
    });
    
    if (error) {
      console.error("Erro na função de alterar senha:", error);
      toast.error("Erro ao alterar senha");
      return false;
    }
    
    if (data.error) {
      toast.error(data.error);
      return false;
    }
    
    console.log("Password changed successfully", data);
    toast.success("Senha alterada com sucesso!");
    
    // Force logout so user has to login with new password
    return true;
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    toast.error("Erro ao alterar senha");
    return false;
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
  requiredTypes: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>
): boolean => {
  if (!user) return false;
  
  // Admin pode acessar tudo
  if (user.admin) return true;
  
  // Verifica se o tipo de usuário está nos tipos requeridos
  return requiredTypes.includes(user.tipo_usuario);
};

// Update function to accept readonly arrays
export const shouldShowRoute = (
  user: User | null,
  allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>
): boolean => {
  if (!user) return false;
  if (user.admin) return true;
  return allowedTypes.includes(user.tipo_usuario);
};
