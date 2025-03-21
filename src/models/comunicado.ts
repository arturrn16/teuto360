
export interface Comunicado {
  id: number;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
  autor_id: number;
  autor_nome: string;
  importante: boolean;
  arquivado: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComunicadoInput {
  titulo: string;
  conteudo: string;
  importante: boolean;
}
