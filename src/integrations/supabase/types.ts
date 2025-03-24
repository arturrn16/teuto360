export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cardapio: {
        Row: {
          created_at: string | null
          data: string | null
          diasemana: string
          id: number
          itens: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          diasemana: string
          id?: number
          itens: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          diasemana?: string
          id?: number
          itens?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      comunicados: {
        Row: {
          arquivado: boolean | null
          autor_id: number | null
          autor_nome: string
          conteudo: string
          created_at: string | null
          data_publicacao: string | null
          id: number
          importante: boolean | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          arquivado?: boolean | null
          autor_id?: number | null
          autor_nome: string
          conteudo: string
          created_at?: string | null
          data_publicacao?: string | null
          id?: number
          importante?: boolean | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          arquivado?: boolean | null
          autor_id?: number | null
          autor_nome?: string
          conteudo?: string
          created_at?: string | null
          data_publicacao?: string | null
          id?: number
          importante?: boolean | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comunicados_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ofertas_caronas: {
        Row: {
          created_at: string | null
          id: number
          nome_motorista: string
          observacoes: string | null
          saindo_de: string
          setor: string
          turno: string
          updated_at: string | null
          usuario_id: number
          valor_mensal: number
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          nome_motorista: string
          observacoes?: string | null
          saindo_de: string
          setor: string
          turno: string
          updated_at?: string | null
          usuario_id: number
          valor_mensal: number
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          id?: number
          nome_motorista?: string
          observacoes?: string | null
          saindo_de?: string
          setor?: string
          turno?: string
          updated_at?: string | null
          usuario_id?: number
          valor_mensal?: number
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ofertas_caronas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_abono_ponto: {
        Row: {
          cidade: string
          created_at: string | null
          data_ocorrencia: string | null
          descricao: string
          id: number
          motivo: string
          rota: string
          solicitante_id: number | null
          status: string | null
          turno: string
          updated_at: string | null
        }
        Insert: {
          cidade: string
          created_at?: string | null
          data_ocorrencia?: string | null
          descricao: string
          id?: number
          motivo: string
          rota: string
          solicitante_id?: number | null
          status?: string | null
          turno: string
          updated_at?: string | null
        }
        Update: {
          cidade?: string
          created_at?: string | null
          data_ocorrencia?: string | null
          descricao?: string
          id?: number
          motivo?: string
          rota?: string
          solicitante_id?: number | null
          status?: string | null
          turno?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_abono_ponto_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_adesao_cancelamento: {
        Row: {
          assinatura_url: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          declaracao_url: string | null
          id: number
          motivo: string
          rua: string | null
          solicitante_id: number | null
          status: string | null
          tipo_solicitacao: string
          tipo_transporte: string | null
          updated_at: string | null
        }
        Insert: {
          assinatura_url?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          declaracao_url?: string | null
          id?: number
          motivo: string
          rua?: string | null
          solicitante_id?: number | null
          status?: string | null
          tipo_solicitacao: string
          tipo_transporte?: string | null
          updated_at?: string | null
        }
        Update: {
          assinatura_url?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          declaracao_url?: string | null
          id?: number
          motivo?: string
          rua?: string | null
          solicitante_id?: number | null
          status?: string | null
          tipo_solicitacao?: string
          tipo_transporte?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_adesao_cancelamento_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_alteracao_endereco: {
        Row: {
          alterar_rota: boolean
          bairro: string
          cep: string
          cidade: string
          complemento: string | null
          comprovante_url: string | null
          created_at: string | null
          data_alteracao: string | null
          endereco: string
          endereco_atual: string | null
          endereco_novo: string | null
          id: number
          nova_rota: string | null
          rota_atual: string
          solicitante_id: number | null
          status: string | null
          telefone: string
          updated_at: string | null
        }
        Insert: {
          alterar_rota: boolean
          bairro: string
          cep: string
          cidade: string
          complemento?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_alteracao?: string | null
          endereco: string
          endereco_atual?: string | null
          endereco_novo?: string | null
          id?: number
          nova_rota?: string | null
          rota_atual: string
          solicitante_id?: number | null
          status?: string | null
          telefone: string
          updated_at?: string | null
        }
        Update: {
          alterar_rota?: boolean
          bairro?: string
          cep?: string
          cidade?: string
          complemento?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_alteracao?: string | null
          endereco?: string
          endereco_atual?: string | null
          endereco_novo?: string | null
          id?: number
          nova_rota?: string | null
          rota_atual?: string
          solicitante_id?: number | null
          status?: string | null
          telefone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_alteracao_endereco_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_mudanca_turno: {
        Row: {
          bairro: string
          cep: string
          cidade: string
          created_at: string | null
          data_alteracao: string | null
          endereco: string
          id: number
          motivo: string
          nome_gestor: string
          nova_rota: string
          novo_turno: string
          solicitante_id: number | null
          status: string | null
          telefone: string
          turno_atual: string
          turno_novo: string | null
          updated_at: string | null
        }
        Insert: {
          bairro: string
          cep: string
          cidade: string
          created_at?: string | null
          data_alteracao?: string | null
          endereco: string
          id?: number
          motivo: string
          nome_gestor: string
          nova_rota: string
          novo_turno: string
          solicitante_id?: number | null
          status?: string | null
          telefone: string
          turno_atual: string
          turno_novo?: string | null
          updated_at?: string | null
        }
        Update: {
          bairro?: string
          cep?: string
          cidade?: string
          created_at?: string | null
          data_alteracao?: string | null
          endereco?: string
          id?: number
          motivo?: string
          nome_gestor?: string
          nova_rota?: string
          novo_turno?: string
          solicitante_id?: number | null
          status?: string | null
          telefone?: string
          turno_atual?: string
          turno_novo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_mudanca_turno_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_refeicao: {
        Row: {
          colaboradores: string[]
          created_at: string | null
          data_refeicao: string
          id: number
          solicitante_id: number | null
          status: string | null
          tipo_refeicao: string
          updated_at: string | null
        }
        Insert: {
          colaboradores: string[]
          created_at?: string | null
          data_refeicao: string
          id?: number
          solicitante_id?: number | null
          status?: string | null
          tipo_refeicao: string
          updated_at?: string | null
        }
        Update: {
          colaboradores?: string[]
          created_at?: string | null
          data_refeicao?: string
          id?: number
          solicitante_id?: number | null
          status?: string | null
          tipo_refeicao?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_refeicao_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_transporte_12x36: {
        Row: {
          cep: string
          colaborador_nome: string
          created_at: string | null
          data_inicio: string
          endereco: string
          id: number
          rota: string
          solicitante_id: number | null
          status: string | null
          telefone: string
          updated_at: string | null
        }
        Insert: {
          cep: string
          colaborador_nome: string
          created_at?: string | null
          data_inicio: string
          endereco: string
          id?: number
          rota: string
          solicitante_id?: number | null
          status?: string | null
          telefone: string
          updated_at?: string | null
        }
        Update: {
          cep?: string
          colaborador_nome?: string
          created_at?: string | null
          data_inicio?: string
          endereco?: string
          id?: number
          rota?: string
          solicitante_id?: number | null
          status?: string | null
          telefone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_transporte_12x36_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_transporte_rota: {
        Row: {
          cidade: string
          colaborador_nome: string
          created_at: string | null
          id: number
          matricula: string | null
          motivo: string
          periodo_fim: string
          periodo_inicio: string
          rota: string
          solicitante_id: number | null
          status: string | null
          turno: string
          updated_at: string | null
        }
        Insert: {
          cidade: string
          colaborador_nome: string
          created_at?: string | null
          id?: number
          matricula?: string | null
          motivo: string
          periodo_fim: string
          periodo_inicio: string
          rota: string
          solicitante_id?: number | null
          status?: string | null
          turno: string
          updated_at?: string | null
        }
        Update: {
          cidade?: string
          colaborador_nome?: string
          created_at?: string | null
          id?: number
          matricula?: string | null
          motivo?: string
          periodo_fim?: string
          periodo_inicio?: string
          rota?: string
          solicitante_id?: number | null
          status?: string | null
          turno?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_transporte_rota_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          admin: boolean | null
          cargo: string
          created_at: string | null
          id: number
          matricula: string
          nome: string
          password: string
          setor: string
          tipo_usuario: string
          updated_at: string | null
          username: string
        }
        Insert: {
          admin?: boolean | null
          cargo: string
          created_at?: string | null
          id?: number
          matricula: string
          nome: string
          password: string
          setor: string
          tipo_usuario: string
          updated_at?: string | null
          username: string
        }
        Update: {
          admin?: boolean | null
          cargo?: string
          created_at?: string | null
          id?: number
          matricula?: string
          nome?: string
          password?: string
          setor?: string
          tipo_usuario?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      format_date_dmy: {
        Args: {
          date_value: string
        }
        Returns: string
      }
      insert_comunicado: {
        Args: {
          p_titulo: string
          p_conteudo: string
          p_autor_id: number
          p_autor_nome: string
          p_importante?: boolean
        }
        Returns: undefined
      }
      insert_solicitacao_adesao_cancelamento: {
        Args: {
          p_solicitante_id: number
          p_tipo_solicitacao: string
          p_tipo_transporte: string
          p_motivo: string
          p_cep?: string
          p_rua?: string
          p_bairro?: string
          p_cidade?: string
          p_assinatura_url?: string
          p_declaracao_url?: string
          p_status?: string
        }
        Returns: undefined
      }
      verify_user_credentials: {
        Args: {
          p_username: string
          p_password: string
        }
        Returns: {
          id: number
          matricula: string
          nome: string
          cargo: string
          setor: string
          username: string
          admin: boolean
          tipo_usuario: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
