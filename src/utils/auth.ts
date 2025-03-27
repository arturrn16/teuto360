import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkPermission } from "@/services/permissionService";

// Define user types
export interface User {
  id: number;
  matricula: string;
  nome: string;
  cargo: string;
  setor: string;
  username: string;
  admin: boolean;
  tipo_usuario: 'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum';
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
    console.log("Login bem-sucedido:", data.user);
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
    try {
      const user = JSON.parse(userData);
      console.log("Recovered user from storage:", user);
      return user;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  }
  return null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem("hrUser", JSON.stringify(user));
  // Em uma implementação real, armazenariamos um JWT token
  localStorage.setItem("hrToken", "mock-jwt-token");
};

export const checkUserPermission = async (
  user: User | null,
  requiredTypes: ReadonlyArray<'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum'>,
  resource?: string,
  resourceType: string = 'pagina'
): Promise<boolean> => {
  if (!user) return false;
  
  // Admin pode acessar tudo
  if (user.admin) return true;
  
  // Verifica se o tipo de usuário está nos tipos requeridos
  const typeAllowed = requiredTypes.includes(user.tipo_usuario);
  
  // Se resource for fornecido, verificar permissão específica
  if (resource && typeAllowed) {
    try {
      return await checkPermission(user.id, resource, resourceType);
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }
  
  // Caso contrário, apenas verificar o tipo de usuário
  return typeAllowed;
};

// Modified: Fix the return type to be boolean synchronously instead of a Promise
export const shouldShowRoute = (
  user: User | null,
  allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum'>,
  resource?: string
): boolean => {
  if (!user) return false;
  
  console.log("shouldShowRoute check:", { 
    userType: user.tipo_usuario, 
    admin: user.admin, 
    allowedTypes
  });
  
  // Admin can access everything
  if (user.admin) return true;
  
  // Otherwise, check if user type is in the allowed types
  return allowedTypes.includes(user.tipo_usuario);
};
