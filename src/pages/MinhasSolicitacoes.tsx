
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
import { Download, FileText, Ticket, Filter } from "lucide-react";
import { downloadTicket } from "@/services/ticketService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [filtro, setFiltro] = useState<string>("todas");

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
        
        if (user.tipo_usuario === 'refeicao') {
          tables = [{ table: 'solicitacoes_refeicao', tipo: 'Refeição' }];
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
                  email: item.email || '',
                  motivo: item.motivo || '',
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
    if (filtro === "todas") {
      setFilteredSolicitacoes(solicitacoes);
    } else {
      setFilteredSolicitacoes(solicitacoes.filter(sol => sol.status === filtro));
    }
  }, [filtro, solicitacoes]);

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

  const isRefeicaoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoRefeicao => {
    return solicitacao.tipo === 'Refeição';
  };

  const isTransporteSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoTransporte => {
    return solicitacao.tipo === 'Transporte Rota' || solicitacao.tipo === 'Transporte 12x36' || solicitacao.tipo === 'Uso de Rota';
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

  const showButtons = () => {
    if (!user) return null;
    
    if (user.tipo_usuario === 'refeicao') {
      return (
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to="/refeicao">Solicitar Refeição</Link>
          </Button>
        </div>
      );
    } 
    else if (user.tipo_usuario === 'selecao') {
      return (
        <div className="mt-4 space-x-2">
          <Button asChild variant="outline">
            <Link to="/transporte-rota">Transporte Rota</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/transporte-12x36">Transporte 12x36</Link>
          </Button>
        </div>
      );
    } 
    else {
      return (
        <div className="mt-4 space-x-2 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/abono-ponto">Abono de Ponto</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/adesao-cancelamento">Adesão/Cancelamento</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/alteracao-endereco">Alteração de Endereço</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/mudanca-turno">Mudança de Turno</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/transporte-rota">Uso de Rota</Link>
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="container max-w-3xl py-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
      </div>
      
      <div className="relative mb-4 flex items-center">
        <Filter className="absolute left-3 h-5 w-5 text-gray-400" />
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="pl-10 h-12 border rounded-full bg-white">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="aprovada">Aprovadas</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="rejeitada">Rejeitadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredSolicitacoes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">Nenhuma solicitação encontrada.</p>
          {showButtons()}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSolicitacoes.map((solicitacao) => (
            <Card key={solicitacao.id} className="border rounded-xl overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-2xl font-bold">
                      {isTransporteSolicitacao(solicitacao) && solicitacao.tipo === 'Uso de Rota' 
                        ? `${solicitacao.tipo} - ${solicitacao.rota}` 
                        : isRefeicaoSolicitacao(solicitacao) 
                          ? `${solicitacao.tipo} - ${solicitacao.tipo_refeicao}` 
                          : solicitacao.tipo}
                    </h2>
                    <Badge 
                      variant={
                        solicitacao.status === 'aprovada' 
                          ? 'success' 
                          : solicitacao.status === 'rejeitada' 
                            ? 'destructive' 
                            : 'secondary'
                      }
                      className="rounded-full px-4 py-1 text-sm font-medium"
                    >
                      {solicitacao.status === 'aprovada' 
                        ? 'Aprovado' 
                        : solicitacao.status === 'rejeitada' 
                          ? 'Rejeitado' 
                          : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4">
                    Solicitado em {formatDate(solicitacao.created_at)}
                  </p>
                  
                  <p className="text-gray-800 mb-4">
                    {getSolicitacaoDescricao(solicitacao)}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full" size="sm">
                      <FileText className="mr-1 h-4 w-4" /> Detalhes
                    </Button>
                    
                    {(solicitacao.status === 'aprovada' && 
                      (isRefeicaoSolicitacao(solicitacao) || 
                       (isTransporteSolicitacao(solicitacao) && 
                        (solicitacao.tipo === 'Uso de Rota' || 
                         solicitacao.tipo === 'Transporte Rota' || 
                         solicitacao.tipo === 'Transporte 12x36')))) && (
                      <Button 
                        variant="outline" 
                        className="rounded-full"
                        size="sm"
                        onClick={() => handleDownloadTicket(solicitacao)}
                      >
                        <Ticket className="mr-1 h-4 w-4" /> Ver Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        {showButtons()}
      </div>
    </div>
  );
};

export default MinhasSolicitacoes;
