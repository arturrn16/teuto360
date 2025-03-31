
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  supabase, 
  customSupabase, 
  BaseSolicitacao, 
  SolicitacaoAbonoPonto, 
  SolicitacaoAdesaoCancelamento, 
  SolicitacaoAlteracaoEndereco,
  SolicitacaoMudancaTurno
} from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, FileText, Ticket, Filter, X } from "lucide-react";
import { downloadTicket } from "@/services/ticketService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SolicitacaoRefeicao extends BaseSolicitacao {
  tipo: string;
  tipo_refeicao: string;
  data_refeicao: string;
  colaboradores: string[];
}

interface SolicitacaoTransporte extends BaseSolicitacao {
  tipo: string;
  colaborador_nome: string;
  rota: string;
  data_inicio?: string;
  periodo_inicio?: string;
  periodo_fim?: string;
  motivo?: string;
}

type SolicitacaoAbonoPontoWithTipo = SolicitacaoAbonoPonto & { tipo: string };
type SolicitacaoAdesaoCancelamentoWithTipo = SolicitacaoAdesaoCancelamento & { tipo: string };
type SolicitacaoAlteracaoEnderecoWithTipo = SolicitacaoAlteracaoEndereco & { tipo: string };
type SolicitacaoMudancaTurnoWithTipo = SolicitacaoMudancaTurno & { tipo: string };

type Solicitacao = 
  | SolicitacaoRefeicao 
  | SolicitacaoTransporte 
  | SolicitacaoAbonoPontoWithTipo
  | SolicitacaoAdesaoCancelamentoWithTipo
  | SolicitacaoAlteracaoEnderecoWithTipo
  | SolicitacaoMudancaTurnoWithTipo;

const MinhasSolicitacoes = () => {
  const { user, isAuthenticated } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);

  const tiposSolicitacao = Array.from(new Set(solicitacoes.map(s => s.tipo)));

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let tables = [];
        
        if (user.tipo_usuario === 'gestor') {
          tables = [
            { table: 'solicitacoes_refeicao', tipo: 'Refeição' },
            { table: 'solicitacoes_mudanca_turno', tipo: 'Mudança de Turno' } // Added for gestor users
          ];
        } 
        else if (user.tipo_usuario === 'selecao') {
          tables = [
            { table: 'solicitacoes_transporte_rota', tipo: 'Transporte Rota' },
            { table: 'solicitacoes_transporte_12x36', tipo: 'Transporte 12x36' },
          ];
        }
        else {
          tables = [
            { table: 'solicitacoes_abono_ponto', tipo: 'Abono de Ponto' },
            { table: 'solicitacoes_adesao_cancelamento', tipo: 'Adesão/Cancelamento' },
            { table: 'solicitacoes_alteracao_endereco', tipo: 'Alteração de Endereço' },
            { table: 'solicitacoes_mudanca_turno', tipo: 'Mudança de Turno' },
            { table: 'solicitacoes_transporte_rota', tipo: 'Uso de Rota' },
          ];
        }

        let allSolicitacoes: Solicitacao[] = [];

        for (const { table, tipo } of tables) {
          try {
            
            if (table === 'solicitacoes_refeicao') {
              const { data, error } = await (supabase as any)
                .from(table)
                .select('id, created_at, status, tipo_refeicao, data_refeicao, colaboradores')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (data && data.length > 0) {
                const solicitacoesWithType: SolicitacaoRefeicao[] = data.map(item => ({
                  id: item.id,
                  created_at: item.created_at,
                  status: item.status,
                  tipo: tipo,
                  tipo_refeicao: item.tipo_refeicao,
                  data_refeicao: item.data_refeicao,
                  colaboradores: item.colaboradores,
                  solicitante_id: user.id,
                  updated_at: item.updated_at || item.created_at,
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            } 
            else if (table === 'solicitacoes_transporte_rota') {
              const { data, error } = await (supabase as any)
                .from(table)
                .select('id, created_at, status, colaborador_nome, rota, periodo_inicio, periodo_fim, motivo')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (data && data.length > 0) {
                const solicitacoesWithType: SolicitacaoTransporte[] = data.map(item => ({
                  id: item.id,
                  created_at: item.created_at,
                  status: item.status,
                  tipo: tipo,
                  colaborador_nome: item.colaborador_nome,
                  rota: item.rota,
                  periodo_inicio: item.periodo_inicio,
                  periodo_fim: item.periodo_fim,
                  motivo: item.motivo,
                  solicitante_id: user.id,
                  updated_at: item.updated_at || item.created_at,
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            }
            else if (table === 'solicitacoes_transporte_12x36') {
              const { data, error } = await (supabase as any)
                .from(table)
                .select('id, created_at, status, colaborador_nome, rota, data_inicio')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (data && data.length > 0) {
                const solicitacoesWithType: SolicitacaoTransporte[] = data.map(item => ({
                  id: item.id,
                  created_at: item.created_at,
                  status: item.status,
                  tipo: tipo,
                  colaborador_nome: item.colaborador_nome,
                  rota: item.rota,
                  data_inicio: item.data_inicio,
                  solicitante_id: user.id,
                  updated_at: item.updated_at || item.created_at,
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            }
            else if (table === 'solicitacoes_abono_ponto') {
              const { data: queryData, error } = await supabase
                .from(table)
                .select('*')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (queryData && queryData.length > 0) {
                const typedData = queryData as any[];
                const solicitacoesWithType: SolicitacaoAbonoPontoWithTipo[] = typedData.map(item => ({
                  id: item.id,
                  solicitante_id: item.solicitante_id,
                  cidade: item.cidade || '',
                  turno: item.turno || '',
                  rota: item.rota || '',
                  descricao: item.descricao || '',
                  status: item.status || 'pendente',
                  created_at: item.created_at,
                  updated_at: item.updated_at || item.created_at,
                  data_ocorrencia: item.data_ocorrencia || '',
                  motivo: item.motivo || '',
                  tipo: tipo
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            }
            else if (table === 'solicitacoes_adesao_cancelamento') {
              const { data: queryData, error } = await supabase
                .from(table)
                .select('*')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (queryData && queryData.length > 0) {
                const typedData = queryData as any[];
                const solicitacoesWithType: SolicitacaoAdesaoCancelamentoWithTipo[] = typedData.map(item => ({
                  id: item.id,
                  solicitante_id: item.solicitante_id,
                  tipo_solicitacao: item.tipo_solicitacao || '',
                  tipo_transporte: item.tipo_transporte || '',
                  motivo: item.motivo || '',
                  motivo_rejeicao: item.motivo_rejeicao,
                  cep: item.cep,
                  rua: item.rua,
                  bairro: item.bairro,
                  cidade: item.cidade,
                  assinatura_url: item.assinatura_url,
                  declaracao_url: item.declaracao_url,
                  status: item.status || 'pendente',
                  created_at: item.created_at,
                  updated_at: item.updated_at || item.created_at,
                  tipo: tipo
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            }
            else if (table === 'solicitacoes_alteracao_endereco') {
              const { data: queryData, error } = await supabase
                .from(table)
                .select('*')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (queryData && queryData.length > 0) {
                const typedData = queryData as any[];
                const solicitacoesWithType: SolicitacaoAlteracaoEnderecoWithTipo[] = typedData.map(item => ({
                  id: item.id,
                  solicitante_id: item.solicitante_id,
                  telefone: item.telefone || '',
                  cep: item.cep || '',
                  endereco: item.endereco || '',
                  bairro: item.bairro || '',
                  cidade: item.cidade || '',
                  complemento: item.complemento,
                  telefone_whatsapp: item.telefone_whatsapp || '',
                  rota_atual: item.rota_atual || '',
                  alterar_rota: item.alterar_rota || false,
                  nova_rota: item.nova_rota,
                  status: item.status || 'pendente',
                  created_at: item.created_at,
                  updated_at: item.updated_at || item.created_at,
                  endereco_atual: item.endereco || '',
                  endereco_novo: item.nova_rota ? `${item.endereco} (nova rota: ${item.nova_rota})` : item.endereco || '',
                  data_alteracao: item.created_at || '',
                  tipo: tipo
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            }
            else if (table === 'solicitacoes_mudanca_turno') {
              const { data: queryData, error } = await supabase
                .from(table)
                .select('*')
                .eq('solicitante_id', user.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
                continue;
              }

              if (queryData && queryData.length > 0) {
                const typedData = queryData as any[];
                const solicitacoesWithType: SolicitacaoMudancaTurnoWithTipo[] = typedData.map(item => ({
                  id: item.id,
                  solicitante_id: item.solicitante_id,
                  telefone: item.telefone || '',
                  cep: item.cep || '',
                  endereco: item.endereco || '',
                  bairro: item.bairro || '',
                  cidade: item.cidade || '',
                  turno_atual: item.turno_atual || '',
                  novo_turno: item.novo_turno || '',
                  turno_novo: item.novo_turno || '',
                  nova_rota: item.nova_rota || '',
                  nome_gestor: item.nome_gestor || '',
                  motivo: item.motivo || '',
                  status: item.status || 'pendente',
                  created_at: item.created_at,
                  updated_at: item.updated_at || item.created_at,
                  data_alteracao: item.created_at || '',
                  tipo: tipo
                }));
                allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
              }
            }
          } catch (tableError) {
            console.error(`Erro ao processar tabela ${table}:`, tableError);
            continue;
          }
        }

        allSolicitacoes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setSolicitacoes(allSolicitacoes);
        setFilteredSolicitacoes(allSolicitacoes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, [user, isAuthenticated]);

  useEffect(() => {
    let filtered = solicitacoes;
    
    if (filtroStatus !== "todas") {
      filtered = filtered.filter(sol => sol.status === filtroStatus);
    }
    
    if (filtroTipo !== "todos") {
      filtered = filtered.filter(sol => sol.tipo === filtroTipo);
    }
    
    setFilteredSolicitacoes(filtered);
  }, [filtroStatus, filtroTipo, solicitacoes]);

  const handleDownloadTicket = async (solicitacao: Solicitacao) => {
    if (solicitacao.status === 'aprovada') {
      let ticketType: 'rota' | '12x36' | 'refeicao' | null = null;
      
      if (solicitacao.tipo === 'Refeição') {
        ticketType = 'refeicao';
      } else if (solicitacao.tipo === 'Uso de Rota' || solicitacao.tipo === 'Transporte Rota') {
        ticketType = 'rota';
      } else if (solicitacao.tipo === 'Transporte 12x36') {
        ticketType = '12x36';
      }
      
      if (ticketType) {
        await downloadTicket({ id: solicitacao.id, tipo: ticketType });
      }
    }
  };

  const abrirDetalhes = (solicitacao: Solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setDetalhesAberto(true);
  };

  const isRefeicaoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoRefeicao => {
    return solicitacao.tipo === 'Refeição';
  };

  const isTransporteSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoTransporte => {
    return solicitacao.tipo === 'Transporte Rota' || solicitacao.tipo === 'Transporte 12x36' || solicitacao.tipo === 'Uso de Rota';
  };

  const isAbonoPontoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoAbonoPontoWithTipo => {
    return solicitacao.tipo === 'Abono de Ponto';
  };

  const isAdesaoCancelamentoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoAdesaoCancelamentoWithTipo => {
    return solicitacao.tipo === 'Adesão/Cancelamento';
  };

  const isAlteracaoEnderecoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoAlteracaoEnderecoWithTipo => {
    return solicitacao.tipo === 'Alteração de Endereço';
  };

  const isMudancaTurnoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoMudancaTurnoWithTipo => {
    return solicitacao.tipo === 'Mudança de Turno';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando suas solicitações...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar solicitações: {error}</div>;
  }

  const getSolicitacaoDescricao = (solicitacao: Solicitacao): string => {
    if (isRefeicaoSolicitacao(solicitacao)) {
      return `Solicitação de almoço para dia específico.`;
    } else if (isTransporteSolicitacao(solicitacao) && solicitacao.tipo === 'Uso de Rota') {
      return `Solicitação para uso da rota do ${solicitacao.rota}.`;
    } else if (solicitacao.tipo === 'Alteração de Endereço') {
      return 'Solicitação para alteração de endereço residencial.';
    } else if (solicitacao.tipo === 'Abono de Ponto') {
      return 'Solicitação para abono de ponto.';
    } else if (solicitacao.tipo === 'Mudança de Turno') {
      return 'Solicitação para mudança de turno.';
    } else if (solicitacao.tipo === 'Adesão/Cancelamento') {
      return 'Solicitação para adesão ou cancelamento de serviço.';
    }
    return '';
  };

  const renderDetalhes = () => {
    if (!solicitacaoSelecionada) return null;
    
    let detalhesConteudo = null;
    
    if (isRefeicaoSolicitacao(solicitacaoSelecionada)) {
      detalhesConteudo = (
        <>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500">Tipo de Refeição</p>
              <p className="font-medium">{solicitacaoSelecionada.tipo_refeicao}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data da Refeição</p>
              <p className="font-medium">{formatDate(solicitacaoSelecionada.data_refeicao)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Colaboradores</p>
            <ul className="list-disc list-inside mt-2">
              {solicitacaoSelecionada.colaboradores.map((colaborador, index) => (
                <li key={index} className="font-medium">{colaborador}</li>
              ))}
            </ul>
          </div>
        </>
      );
    } else if (isTransporteSolicitacao(solicitacaoSelecionada)) {
      detalhesConteudo = (
        <>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500">Colaborador</p>
              <p className="font-medium">{solicitacaoSelecionada.colaborador_nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rota</p>
              <p className="font-medium">{solicitacaoSelecionada.rota}</p>
            </div>
            {solicitacaoSelecionada.data_inicio && (
              <div>
                <p className="text-sm text-gray-500">Data de Início</p>
                <p className="font-medium">{formatDate(solicitacaoSelecionada.data_inicio)}</p>
              </div>
            )}
            {solicitacaoSelecionada.periodo_inicio && (
              <div>
                <p className="text-sm text-gray-500">Período de Início</p>
                <p className="font-medium">{formatDate(solicitacaoSelecionada.periodo_inicio)}</p>
              </div>
            )}
            {solicitacaoSelecionada.periodo_fim && (
              <div>
                <p className="text-sm text-gray-500">Período de Fim</p>
                <p className="font-medium">{formatDate(solicitacaoSelecionada.periodo_fim)}</p>
              </div>
            )}
          </div>
          {solicitacaoSelecionada.motivo && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Motivo</p>
              <p className="font-medium">{solicitacaoSelecionada.motivo}</p>
            </div>
          )}
        </>
      );
    } else if (isAbonoPontoSolicitacao(solicitacaoSelecionada)) {
      detalhesConteudo = (
        <>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500">Cidade</p>
              <p className="font-medium">{solicitacaoSelecionada.cidade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Turno</p>
              <p className="font-medium">{solicitacaoSelecionada.turno}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rota</p>
              <p className="font-medium">{solicitacaoSelecionada.rota}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data de Ocorrência</p>
              <p className="font-medium">{formatDate(solicitacaoSelecionada.data_ocorrencia)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Motivo</p>
            <p className="font-medium">{solicitacaoSelecionada.motivo}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Descrição</p>
            <p className="font-medium">{solicitacaoSelecionada.descricao}</p>
          </div>
        </>
      );
    } else if (isAdesaoCancelamentoSolicitacao(solicitacaoSelecionada)) {
      detalhesConteudo = (
        <>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500">Tipo de Solicitação</p>
              <p className="font-medium">
                {solicitacaoSelecionada.tipo_solicitacao === "Aderir" 
                  ? "Aderir transporte" 
                  : "Cancelar transporte"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo de Transporte</p>
              <p className="font-medium">
                {solicitacaoSelecionada.tipo_transporte === "Fretado" 
                  ? "Transporte Fretado" 
                  : "Vale Transporte"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Motivo</p>
            <p className="font-medium">{solicitacaoSelecionada.motivo}</p>
          </div>
          
          {solicitacaoSelecionada.status === "aprovada" && (
            <div className="mt-4 p-3 border border-green-200 bg-green-50 rounded-md">
              <p className="text-green-700">
                Sua solicitação de adesão ao transporte foi aprovada, dirija-se ao RH-Benefícios para o cadastro do seu crachá.
              </p>
            </div>
          )}
          
          {solicitacaoSelecionada.status === "rejeitada" && (
            <div className="mt-4 p-3 border border-red-200 bg-red-50 rounded-md">
              <p className="text-red-700">
                Sua solicitação de adesão ou cancelamento de transporte foi rejeitada.
              </p>
              {solicitacaoSelecionada.motivo_rejeicao && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Motivo da rejeição:</p>
                  <p className="text-red-700">{solicitacaoSelecionada.motivo_rejeicao}</p>
                </div>
              )}
            </div>
          )}
        </>
      );
    } else if (isAlteracaoEnderecoSolicitacao(solicitacaoSelecionada)) {
      detalhesConteudo = (
        <>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{solicitacaoSelecionada.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CEP</p>
              <p className="font-medium">{solicitacaoSelecionada.cep}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Endereço Atual</p>
              <p className="font-medium">{solicitacaoSelecionada.endereco_atual}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Novo Endereço</p>
              <p className="font-medium">{solicitacaoSelecionada.endereco_novo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bairro</p>
              <p className="font-medium">{solicitacaoSelecionada.bairro}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cidade</p>
              <p className="font-medium">{solicitacaoSelecionada.cidade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rota Atual</p>
              <p className="font-medium">{solicitacaoSelecionada.rota_atual}</p>
            </div>
            {solicitacaoSelecionada.alterar_rota && (
              <div>
                <p className="text-sm text-gray-500">Nova Rota</p>
                <p className="font-medium">{solicitacaoSelecionada.nova_rota || 'Não especificada'}</p>
              </div>
            )}
          </div>
        </>
      );
    } else if (isMudancaTurnoSolicitacao(solicitacaoSelecionada)) {
      detalhesConteudo = (
        <>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{solicitacaoSelecionada.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CEP</p>
              <p className="font-medium">{solicitacaoSelecionada.cep}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Endereço</p>
              <p className="font-medium">{solicitacaoSelecionada.endereco}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bairro</p>
              <p className="font-medium">{solicitacaoSelecionada.bairro}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cidade</p>
              <p className="font-medium">{solicitacaoSelecionada.cidade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Turno Atual</p>
              <p className="font-medium">{solicitacaoSelecionada.turno_atual}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Novo Turno</p>
              <p className="font-medium">{solicitacaoSelecionada.novo_turno}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nova Rota</p>
              <p className="font-medium">{solicitacaoSelecionada.nova_rota || 'Não especificada'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nome do Gestor</p>
              <p className="font-medium">{solicitacaoSelecionada.nome_gestor}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Motivo</p>
            <p className="font-medium">{solicitacaoSelecionada.motivo}</p>
          </div>
        </>
      );
    }
    
    return (
      <Dialog open={detalhesAberto} onOpenChange={setDetalhesAberto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl">Detalhes da Solicitação</span>
              <Badge 
                variant={
                  solicitacaoSelecionada.status === 'aprovada' 
                    ? 'success' 
                    : solicitacaoSelecionada.status === 'rejeitada' 
                      ? 'destructive' 
                      : 'secondary'
                }
                className="rounded-full px-4 py-1 text-sm font-medium"
              >
                {solicitacaoSelecionada.status === 'aprovada' 
                  ? 'Aprovado' 
                  : solicitacaoSelecionada.status === 'rejeitada' 
                    ? 'Rejeitado' 
                    : 'Pendente'}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center justify-between text-lg font-semibold mb-2">
                <span>{solicitacaoSelecionada.tipo}</span>
                <span>#{solicitacaoSelecionada.id}</span>
              </div>
              <div className="text-sm text-gray-500">
                Solicitado em {formatDateTime(solicitacaoSelecionada.created_at)}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          {detalhesConteudo}
          
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            {solicitacaoSelecionada.status === 'aprovada' && 
              (isRefeicaoSolicitacao(solicitacaoSelecionada) || 
              (isTransporteSolicitacao(solicitacaoSelecionada) &&
               (solicitacaoSelecionada.tipo === 'Transporte Rota' || 
                solicitacaoSelecionada.tipo === 'Transporte 12x36' || 
                solicitacaoSelecionada.tipo === 'Uso de Rota'))) && (
              <Button 
                onClick={() => handleDownloadTicket(solicitacaoSelecionada)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Baixar Ticket
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <X size={16} />
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Minhas Solicitações</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="aprovada">Aprovadas</SelectItem>
              <SelectItem value="rejeitada">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
          
          {tiposSolicitacao.length > 1 && (
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {tiposSolicitacao.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {filteredSolicitacoes.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">Nenhuma solicitação encontrada</h3>
          <p className="text-gray-500 mt-2">
            {filtroStatus !== "todas" || filtroTipo !== "todos" 
              ? "Tente mudar os filtros para ver mais solicitações." 
              : "Você ainda não enviou nenhuma solicitação."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSolicitacoes.map((solicitacao) => (
            <Card key={`${solicitacao.tipo}-${solicitacao.id}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge 
                        variant={
                          solicitacao.status === 'aprovada' 
                            ? 'success' 
                            : solicitacao.status === 'rejeitada' 
                              ? 'destructive' 
                              : 'secondary'
                        }
                        className="mb-2"
                      >
                        {solicitacao.status === 'aprovada' 
                          ? 'Aprovado' 
                          : solicitacao.status === 'rejeitada' 
                            ? 'Rejeitado' 
                            : 'Pendente'}
                      </Badge>
                      <h3 className="font-medium text-lg">{solicitacao.tipo}</h3>
                    </div>
                    <span className="text-gray-500 text-sm">#{solicitacao.id}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {getSolicitacaoDescricao(solicitacao)}
                  </p>
                  
                  <div className="text-gray-500 text-sm">
                    Solicitado em {formatDate(solicitacao.created_at)}
                  </div>
                </div>
                
                <div className="border-t mt-2 p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => abrirDetalhes(solicitacao)}
                    className="flex items-center gap-1"
                  >
                    <FileText size={16} />
                    Detalhes
                  </Button>
                  
                  {solicitacao.status === 'aprovada' && 
                    (isRefeicaoSolicitacao(solicitacao) || 
                    (isTransporteSolicitacao(solicitacao) &&
                     (solicitacao.tipo === 'Transporte Rota' || 
                      solicitacao.tipo === 'Transporte 12x36' || 
                      solicitacao.tipo === 'Uso de Rota'))) && (
                    <Button 
                      onClick={() => handleDownloadTicket(solicitacao)}
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Ticket size={16} />
                      Ticket
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {renderDetalhes()}
    </div>
  );
};

export default MinhasSolicitacoes;
