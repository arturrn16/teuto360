
export interface BaseSolicitacao {
  id: number;
  solicitante_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SolicitacaoAdesaoCancelamento extends BaseSolicitacao {
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

export interface SolicitacaoAbonoPonto extends BaseSolicitacao {
  cidade: string;
  turno: string;
  rota: string;
  descricao: string;
  data_ocorrencia: string;
  motivo: string;
  motivo_comentario?: string;
}

export interface SolicitacaoAlteracaoEndereco extends BaseSolicitacao {
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  complemento?: string;
  telefone_whatsapp?: string;
  rota_atual: string;
  alterar_rota: boolean;
  nova_rota?: string;
  endereco_atual: string;
  endereco_novo: string;
  data_alteracao: string;
  comprovante_url?: string;
  motivo_comentario?: string;
}

export interface SolicitacaoMudancaTurno extends BaseSolicitacao {
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  turno_atual: string;
  novo_turno: string;
  turno_novo: string;
  nova_rota: string;
  nome_gestor: string;
  motivo: string;
  data_alteracao: string;
  motivo_comentario?: string;
  colaborador_nome?: string;
  matricula?: string;
  cargo?: string;
  setor?: string;
}

export interface SolicitacaoTransporteRota extends BaseSolicitacao {
  matricula: string;
  colaborador_nome: string;
  turno: string;
  periodo_inicio: string;
  periodo_fim: string;
  rota: string;
  motivo: string;
  cidade: string;
  motivo_comentario?: string;
}

export interface SolicitacaoTransporte12x36 extends BaseSolicitacao {
  colaborador_nome: string;
  telefone: string;
  endereco: string;
  cep: string;
  rota: string;
  data_inicio: string;
  motivo_comentario?: string;
}

export interface Colaborador {
  nome: string;
  matricula: string;
  setor?: string;
  [key: string]: string | undefined;
}

export interface SolicitacaoRefeicao extends BaseSolicitacao {
  colaboradores: Colaborador[];
  tipo_refeicao: string;
  data_refeicao: string;
  motivo_comentario?: string;
  solicitante_nome?: string;
  solicitante_setor?: string;
  setor?: string;
}
