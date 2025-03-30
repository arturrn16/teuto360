
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
  tipo_usuario: 'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum' | 'refeicao';
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
  tipo_usuario: 'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum' | 'refeicao';
  admin: boolean;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Use the admin auth supabase client
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
    console.log("Criando usuário:", user);
    
    // Call the RPC function to create user and bypass RLS
    const { data, error } = await supabase.rpc(
      'create_user' as any, // Using 'as any' to bypass TypeScript error
      {
        p_nome: user.nome,
        p_matricula: user.matricula,
        p_username: user.username,
        p_password: user.password,
        p_cargo: user.cargo || '',
        p_setor: user.setor || '',
        p_rota: user.rota || '',
        p_tipo_usuario: user.tipo_usuario,
        p_admin: user.admin
      }
    );

    if (error) {
      // If RPC method is not available, fallback to direct insert
      console.warn("RPC method failed, falling back to direct insert:", error);
      const { data: insertData, error: insertError } = await supabase
        .from("usuarios")
        .insert([user])
        .select();

      if (insertError) {
        console.error("Error after fallback:", insertError);
        throw insertError;
      }
      
      if (insertData && insertData.length > 0) {
        toast.success("Usuário cadastrado com sucesso");
        return insertData[0] as User;
      } else {
        throw new Error("No data returned after insertion");
      }
    }
    
    toast.success("Usuário cadastrado com sucesso");
    // The RPC returns a JSON object directly, not an array
    return data as unknown as User;
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    if (error.code === "23505") {
      // Unique constraint violation
      toast.error("Usuário já existe (matrícula ou username duplicado)");
    } else if (error.message && error.message.includes("violates row-level security")) {
      toast.error("Erro de permissão: você não tem autorização para criar usuários");
    } else {
      toast.error("Erro ao cadastrar usuário: " + (error.message || 'Erro desconhecido'));
    }
    
    return null;
  }
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
  try {
    console.log("Atualizando usuário:", id, user);
    
    // Don't allow password updates through this function for security
    if ('password' in user) {
      delete (user as any).password;
    }
    
    // Call the RPC function to update user and bypass RLS
    const { data, error } = await supabase.rpc(
      'update_user' as any, // Using 'as any' to bypass TypeScript error
      {
        p_id: id,
        p_nome: user.nome,
        p_matricula: user.matricula,
        p_username: user.username,
        p_cargo: user.cargo || '',
        p_setor: user.setor || '',
        p_rota: user.rota || '',
        p_tipo_usuario: user.tipo_usuario,
        p_admin: user.admin || false
      }
    );

    if (error) {
      // If RPC method is not available, fallback to direct update
      console.warn("RPC method failed, falling back to direct update:", error);
      const { data: updateData, error: updateError } = await supabase
        .from("usuarios")
        .update(user)
        .eq("id", id)
        .select();

      if (updateError) {
        console.error("Error after fallback:", updateError);
        throw updateError;
      }
      
      if (!updateData || updateData.length === 0) {
        throw new Error("Nenhum dado retornado após atualização");
      }
      
      toast.success("Usuário atualizado com sucesso");
      return updateData[0] as User;
    }
    
    toast.success("Usuário atualizado com sucesso");
    // The RPC returns a JSON object directly, not an array
    return data as unknown as User;
  } catch (error: any) {
    console.error(`Error updating user with id ${id}:`, error);
    
    if (error.message && error.message.includes("violates row-level security")) {
      toast.error("Erro de permissão: você não tem autorização para atualizar usuários");
    } else {
      toast.error("Erro ao atualizar usuário: " + (error.message || 'Erro desconhecido'));
    }
    
    return null;
  }
};

export const updateUserPassword = async (id: number, password: string): Promise<boolean> => {
  try {
    console.log("Atualizando senha do usuário:", id);
    
    // Call the RPC function to update user password and bypass RLS
    const { error } = await supabase.rpc(
      'update_user_password' as any, // Using 'as any' to bypass TypeScript error
      {
        p_id: id,
        p_password: password
      }
    );

    if (error) {
      // If RPC method is not available, fallback to direct update
      console.warn("RPC method failed, falling back to direct update:", error);
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({ password })
        .eq("id", id);

      if (updateError) {
        console.error("Error after fallback:", updateError);
        throw updateError;
      }
    }
    
    toast.success("Senha atualizada com sucesso");
    return true;
  } catch (error: any) {
    console.error(`Error updating password for user with id ${id}:`, error);
    
    if (error.message && error.message.includes("violates row-level security")) {
      toast.error("Erro de permissão: você não tem autorização para atualizar senhas");
    } else {
      toast.error("Erro ao atualizar senha: " + (error.message || 'Erro desconhecido'));
    }
    
    return false;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    console.log("Excluindo usuário:", id);
    
    // Call the RPC function to delete user and bypass RLS
    const { error } = await supabase.rpc(
      'delete_user' as any, // Using 'as any' to bypass TypeScript error
      {
        p_id: id
      }
    );

    if (error) {
      // If RPC method is not available, fallback to direct delete
      console.warn("RPC method failed, falling back to direct delete:", error);
      const { error: deleteError } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error after fallback:", deleteError);
        throw deleteError;
      }
    }
    
    toast.success("Usuário excluído com sucesso");
    return true;
  } catch (error: any) {
    console.error(`Error deleting user with id ${id}:`, error);
    
    if (error.message && error.message.includes("violates row-level security")) {
      toast.error("Erro de permissão: você não tem autorização para excluir usuários");
    } else {
      toast.error("Erro ao excluir usuário: " + (error.message || 'Erro desconhecido'));
    }
    
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
