
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Permission {
  id: number;
  usuario_id: number;
  recurso: string;
  tipo_recurso: string;
  created_at?: string;
  updated_at?: string;
}

export const resourceTypes = [
  { value: 'pagina', label: 'Página' },
  { value: 'menu', label: 'Item de Menu' },
  { value: 'dashboard', label: 'Card do Dashboard' },
  { value: 'funcionalidade', label: 'Funcionalidade' }
];

export const getPermissionsByUser = async (userId: number): Promise<Permission[]> => {
  try {
    const { data, error } = await supabase
      .from("permissoes")
      .select("*")
      .eq("usuario_id", userId)
      .order("tipo_recurso");

    if (error) {
      throw error;
    }

    return data as Permission[];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    toast.error("Erro ao buscar permissões");
    return [];
  }
};

export const checkPermission = async (
  userId: number, 
  resource: string, 
  resourceType: string = 'pagina'
): Promise<boolean> => {
  try {
    // Call the check_permissao function
    const { data, error } = await supabase.rpc(
      'check_permissao',
      {
        p_usuario_id: userId,
        p_recurso: resource,
        p_tipo_recurso: resourceType
      }
    );

    if (error) {
      throw error;
    }

    return data || false;
  } catch (error) {
    console.error(`Error checking permission for user ${userId}:`, error);
    return false;
  }
};

export const addPermission = async (
  userId: number, 
  resource: string, 
  resourceType: string = 'pagina'
): Promise<boolean> => {
  try {
    // Call the add_permissao function
    const { error } = await supabase.rpc(
      'add_permissao',
      {
        p_usuario_id: userId,
        p_recurso: resource,
        p_tipo_recurso: resourceType
      }
    );

    if (error) {
      throw error;
    }
    
    toast.success("Permissão adicionada com sucesso");
    return true;
  } catch (error) {
    console.error(`Error adding permission for user ${userId}:`, error);
    toast.error("Erro ao adicionar permissão");
    return false;
  }
};

export const removePermission = async (
  userId: number, 
  resource: string, 
  resourceType: string = 'pagina'
): Promise<boolean> => {
  try {
    // Call the remove_permissao function
    const { error } = await supabase.rpc(
      'remove_permissao',
      {
        p_usuario_id: userId,
        p_recurso: resource,
        p_tipo_recurso: resourceType
      }
    );

    if (error) {
      throw error;
    }
    
    toast.success("Permissão removida com sucesso");
    return true;
  } catch (error) {
    console.error(`Error removing permission for user ${userId}:`, error);
    toast.error("Erro ao remover permissão");
    return false;
  }
};

export const getAllResourcesByType = (type: string): string[] => {
  switch (type) {
    case 'pagina':
      return [
        '/dashboard',
        '/transporte-rota',
        '/transporte-12x36',
        '/refeicao',
        '/comunicados',
        '/minhas-solicitacoes',
        '/adesao-cancelamento',
        '/mudanca-turno',
        '/alteracao-endereco',
        '/abono-ponto',
        '/avaliacao',
        '/plantao',
        '/mapa-rotas',
        '/oferta-caronas',
        '/consulta-cartao',
        '/cardapio-semana',
        '/admin',
        '/relatorios',
        '/gerenciar-comunicados',
        '/gerenciar-cardapio',
        '/gerenciar-cartoes',
        '/gerenciar-usuarios',
        '/gerenciar-permissoes'
      ];
    case 'menu':
      return [
        'Dashboard',
        'Minhas Solicitações',
        'Transporte',
        'Refeitório',
        'Comunicados',
        'Ofertas de Carona',
        'Consulta de Cartão',
        'Transporte Rota',
        'Transporte 12x36',
        'Refeição',
        'Administração',
        'Relatórios',
        'Gerenciar Comunicados',
        'Gerenciar Cardápio',
        'Gerenciar Cartões',
        'Gerenciar Usuários',
        'Gerenciar Permissões'
      ];
    case 'dashboard':
      return [
        'Uso de Rota',
        'Minhas Solicitações',
        'Comunicados',
        'Adesão/Cancelamento de Rota',
        'Alteração de Endereço',
        'Abono de Ponto',
        'Avaliação',
        'Plantão 24hs',
        'Mapa de Rotas',
        'Oferta de Caronas',
        'Consulta de Cartão',
        'Cardápio da Semana',
        'Transporte 12x36',
        'Solicitar Refeição',
        'Mudança de Turno',
        'Administração',
        'Relatórios',
        'Gerenciar Comunicados',
        'Gerenciar Cardápio',
        'Gerenciar Cartões',
        'Gerenciar Usuários',
        'Gerenciar Permissões'
      ];
    case 'funcionalidade':
      return [
        'criar_transporte_rota',
        'editar_transporte_rota',
        'aprovar_transporte_rota',
        'criar_transporte_12x36',
        'editar_transporte_12x36',
        'aprovar_transporte_12x36',
        'criar_refeicao',
        'editar_refeicao',
        'aprovar_refeicao',
        'criar_comunicado',
        'editar_comunicado',
        'arquivar_comunicado',
        'criar_adesao_cancelamento',
        'editar_adesao_cancelamento',
        'aprovar_adesao_cancelamento',
        'criar_mudanca_turno',
        'editar_mudanca_turno',
        'aprovar_mudanca_turno',
        'criar_alteracao_endereco',
        'editar_alteracao_endereco',
        'aprovar_alteracao_endereco',
        'criar_abono_ponto',
        'editar_abono_ponto',
        'aprovar_abono_ponto',
        'criar_avaliacao',
        'editar_avaliacao',
        'visualizar_avaliacao',
        'criar_oferta_carona',
        'editar_oferta_carona',
        'aprovar_oferta_carona',
        'gerenciar_cartoes',
        'visualizar_relatorios',
        'gerenciar_permissoes'
      ];
    default:
      return [];
  }
};
