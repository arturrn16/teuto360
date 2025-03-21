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
