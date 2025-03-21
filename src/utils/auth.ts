
import { toast } from "sonner";

// Define user types
export interface User {
  id: number;
  matricula: string;
  nome: string;
  cargo: string;
  setor: string;
  username: string;
  admin: boolean;
  tipo_usuario: 'admin' | 'comum' | 'refeicao';
  created_at: string;
  updated_at: string;
}

// This is a mock of the API call
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    // In a real implementation, this would be a call to Supabase
    // For now, we'll just mock the login process
    if (username === 'admin' && password === 'admin') {
      return {
        id: 1,
        matricula: "ADM001",
        nome: "Administrador",
        cargo: "Gerente de RH",
        setor: "Recursos Humanos",
        username: "admin",
        admin: true,
        tipo_usuario: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else if (username === 'user' && password === 'user') {
      return {
        id: 2,
        matricula: "USR001",
        nome: "Usuário Comum",
        cargo: "Analista",
        setor: "Tecnologia",
        username: "user",
        admin: false,
        tipo_usuario: "comum",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else if (username === 'meal' && password === 'meal') {
      return {
        id: 3,
        matricula: "REF001",
        nome: "Usuário Refeição",
        cargo: "Coordenador",
        setor: "Alimentação",
        username: "meal",
        admin: false,
        tipo_usuario: "refeicao",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    toast.error("Usuário ou senha inválidos");
    return null;
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
  // In a real implementation, we would store a JWT token
  localStorage.setItem("hrToken", "mock-jwt-token");
};

export const checkUserPermission = (
  user: User | null,
  requiredTypes: ('admin' | 'comum' | 'refeicao')[]
): boolean => {
  if (!user) return false;
  
  // Admin can access everything
  if (user.admin) return true;
  
  // Check if user type is in the required types
  return requiredTypes.includes(user.tipo_usuario);
};
