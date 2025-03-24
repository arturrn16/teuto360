
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: number;
  nome: string;
  matricula: string;
  username: string;
  cargo: string | null;
  setor: string | null;
  rota: string | null;
  tipo_usuario: 'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum';
  admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewUser {
  nome: string;
  matricula: string;
  username: string;
  password: string;
  cargo?: string;
  setor?: string;
  rota?: string;
  tipo_usuario: 'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum';
  admin: boolean;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("nome");

    if (error) {
      throw error;
    }

    return data as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Erro ao buscar usuários");
    return [];
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    toast.error("Erro ao buscar usuário");
    return null;
  }
};

export const createUser = async (user: NewUser): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([user])
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success("Usuário cadastrado com sucesso");
    return data as User;
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    if (error.code === "23505") {
      // Unique constraint violation
      toast.error("Usuário já existe (matrícula ou username duplicado)");
    } else {
      toast.error("Erro ao cadastrar usuário");
    }
    
    return null;
  }
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
  try {
    // Don't allow password updates through this function for security
    if ('password' in user) {
      delete (user as any).password;
    }
    
    const { data, error } = await supabase
      .from("usuarios")
      .update(user)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    toast.success("Usuário atualizado com sucesso");
    return data as User;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    toast.error("Erro ao atualizar usuário");
    return null;
  }
};

export const updateUserPassword = async (id: number, password: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("usuarios")
      .update({ password })
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    toast.success("Senha atualizada com sucesso");
    return true;
  } catch (error) {
    console.error(`Error updating password for user with id ${id}:`, error);
    toast.error("Erro ao atualizar senha");
    return false;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    toast.success("Usuário excluído com sucesso");
    return true;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    toast.error("Erro ao excluir usuário");
    return false;
  }
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    // Search by name or matricula
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .or(`nome.ilike.%${query}%,matricula.ilike.%${query}%`)
      .order("nome");

    if (error) {
      throw error;
    }

    return data as User[];
  } catch (error) {
    console.error("Error searching users:", error);
    toast.error("Erro ao buscar usuários");
    return [];
  }
};
