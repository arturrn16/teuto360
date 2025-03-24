
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@/utils/auth";

// Define a more detailed user type for the management interface
export interface UserDetailed extends User {
  created_at?: string;
  updated_at?: string;
  password?: string; // Add password as optional property
}

// Define a type for user creation/update
export interface UserFormData extends Omit<UserDetailed, 'id'> {
  password?: string;
}

// Fetch all users from the database
export const getAllUsers = async (): Promise<UserDetailed[]> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao buscar usuários');
      return [];
    }

    // Cast and ensure data conforms to UserDetailed type
    return (data || []).map(user => ({
      ...user,
      tipo_usuario: user.tipo_usuario as 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'
    })) as UserDetailed[];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    toast.error('Erro ao buscar usuários');
    return [];
  }
};

// Search users by name or registration number
export const searchUsers = async (query: string): Promise<UserDetailed[]> => {
  try {
    if (!query) {
      return await getAllUsers();
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .or(`nome.ilike.%${query}%,matricula.ilike.%${query}%`)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Error searching users:', error);
      toast.error('Erro ao buscar usuários');
      return [];
    }

    // Cast and ensure data conforms to UserDetailed type
    return (data || []).map(user => ({
      ...user,
      tipo_usuario: user.tipo_usuario as 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'
    })) as UserDetailed[];
  } catch (error) {
    console.error('Error in searchUsers:', error);
    toast.error('Erro ao buscar usuários');
    return [];
  }
};

// Get a user by ID
export const getUserById = async (id: number): Promise<UserDetailed | null> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      toast.error('Erro ao buscar usuário');
      return null;
    }
    
    if (!data) return null;
    
    // Cast tipo_usuario to ensure it matches the UserDetailed type
    return {
      ...data,
      tipo_usuario: data.tipo_usuario as 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'
    };
  } catch (error) {
    console.error('Error in getUserById:', error);
    toast.error('Erro ao buscar usuário');
    return null;
  }
};

// Add a new user
export const addUser = async (user: UserFormData): Promise<UserDetailed | null> => {
  try {
    // Ensure password is provided for new users
    if (!user.password) {
      toast.error('Senha é obrigatória para novos usuários');
      return null;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        matricula: user.matricula,
        nome: user.nome,
        username: user.username,
        password: user.password,
        cargo: user.cargo || '',
        setor: user.setor || '',
        tipo_usuario: user.tipo_usuario,
        admin: user.admin || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding user:', error);
      toast.error(`Erro ao adicionar usuário: ${error.message}`);
      return null;
    }

    toast.success('Usuário adicionado com sucesso');
    // Convert the returned data to match UserDetailed
    return {
      ...data,
      tipo_usuario: data.tipo_usuario as 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'
    };
  } catch (error) {
    console.error('Error in addUser:', error);
    toast.error('Erro ao adicionar usuário');
    return null;
  }
};

// Update an existing user
export const updateUser = async (id: number, userData: Partial<UserFormData>): Promise<UserDetailed | null> => {
  try {
    // Filter out password if it's empty
    const updateData = { ...userData };
    if (updateData.password === '') {
      delete updateData.password;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nome: updateData.nome,
        matricula: updateData.matricula,
        username: updateData.username,
        ...(updateData.password ? { password: updateData.password } : {}),
        cargo: updateData.cargo,
        setor: updateData.setor,
        tipo_usuario: updateData.tipo_usuario,
        admin: updateData.admin
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
      return null;
    }

    toast.success('Usuário atualizado com sucesso');
    return {
      ...data,
      tipo_usuario: data.tipo_usuario as 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'
    };
  } catch (error) {
    console.error('Error in updateUser:', error);
    toast.error('Erro ao atualizar usuário');
    return null;
  }
};

// Delete a user
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      toast.error(`Erro ao excluir usuário: ${error.message}`);
      return false;
    }

    toast.success('Usuário excluído com sucesso');
    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    toast.error('Erro ao excluir usuário');
    return false;
  }
};
