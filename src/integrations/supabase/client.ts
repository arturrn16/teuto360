
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nhheygdilixbqwrfxbtt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaGV5Z2RpbGl4YnF3cmZ4YnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njc1MDYsImV4cCI6MjA1ODE0MzUwNn0.IJE-pAPztQl27c2kRJgV-iBaVb1M04WsOH9tra1aE90";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create the typed client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Base types for custom tables not in the Database type
export interface BaseSolicitacao {
  id: number;
  solicitante_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  tipo?: string; // Add tipo property to make things easier for MinhasSolicitacoes
}

export interface SolicitacaoAbonoPonto extends BaseSolicitacao {
  tipo: 'abono_ponto';
  cidade: string;
  turno: string;
  rota: string;
  descricao: string;
  data_ocorrencia: string;
  motivo: string;
}

export interface SolicitacaoAdesaoCancelamento extends BaseSolicitacao {
  tipo: 'adesao_cancelamento';
  tipo_solicitacao: "Aderir" | "Cancelar";
  tipo_transporte: "Fretado" | "ValeTransporte";
  motivo: string;
  motivo_rejeicao?: string;
  cep?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  assinatura_url?: string;
  declaracao_url?: string;
}

export interface SolicitacaoAlteracaoEndereco extends BaseSolicitacao {
  tipo: 'alteracao_endereco';
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  complemento?: string;
  telefone_whatsapp: string;
  turno?: string;
  rota_atual: string;
  alterar_rota: boolean;
  nova_rota?: string;
  endereco_atual: string;
  endereco_novo: string;
  data_alteracao: string;
}

export interface SolicitacaoMudancaTurno extends BaseSolicitacao {
  tipo: 'mudanca_turno';
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  matricula?: string;
  nome?: string;
  turno_atual: string;
  novo_turno: string;
  turno_novo: string;
  nova_rota: string;
  nome_gestor: string;
  motivo: string;
  data_alteracao: string;
}

export interface SolicitacaoRefeicao extends BaseSolicitacao {
  tipo: 'refeicao';
  colaboradores: string[];
  matriculas?: string[];
  tipo_refeicao: string;
  data_refeicao: string;
  motivo_comentario?: string;
}

// Function to handle data type conversion for custom tables
function transformData<T>(data: any[] | null): T[] {
  if (!data) return [];
  return data as T[];
}

// A more type-safe way to work with custom tables
export const customSupabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          then: async (onfulfilled: (result: { data: any[], error: any }) => any) => {
            try {
              // Use any to bypass TypeScript's type checking for tables not in the schema
              const query = (supabase as any).from(table).select(columns);
              
              if (column && value) {
                query.eq(column, value);
              }
              
              if (column) {
                query.order(column, options);
              }
              
              const result = await query;
              return onfulfilled({
                data: result.data || [],
                error: result.error
              });
            } catch (error) {
              return onfulfilled({
                data: [],
                error
              });
            }
          }
        })
      })
    })
  })
};

// A direct function for handling custom tables
export async function queryCustomTable<T = any>(
  tableName: string, 
  options: {
    select?: string;
    eq?: { column: string; value: any };
    order?: { column: string; ascending?: boolean };
  } = {}
): Promise<{ data: T[]; error: any }> {
  try {
    // Use any to bypass type checking
    let query = (supabase as any).from(tableName);
    
    if (options.select) {
      query = query.select(options.select);
    } else {
      query = query.select();
    }
    
    if (options.eq) {
      query = query.eq(options.eq.column, options.eq.value);
    }
    
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending });
    }
    
    const { data, error } = await query;
    
    return {
      data: (data || []) as T[],
      error
    };
  } catch (error) {
    console.error("Error in queryCustomTable:", error);
    return {
      data: [],
      error
    };
  }
}

// Function to update a custom table
export async function updateCustomTable(
  tableName: string,
  data: any,
  condition: { column: string; value: any }
): Promise<{ error: any }> {
  try {
    const { error } = await (supabase as any)
      .from(tableName)
      .update(data)
      .eq(condition.column, condition.value);
      
    return { error };
  } catch (error) {
    return { error };
  }
}
