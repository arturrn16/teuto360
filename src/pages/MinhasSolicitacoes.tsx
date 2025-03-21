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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { downloadTicket } from "@/services/ticketService";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                .select('id, created_at, status, colaborador_nome, rota, periodo_inicio, periodo_fim')
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, [user, isAuthenticated]);

  const handleDownloadTicket = async (solicitacao: Solicitacao) => {
    if (solicitacao.tipo === 'Refeição' && solicitacao.status === 'aprovada') {
      await downloadTicket({ id: solicitacao.id, tipo: 'refeicao' });
    }
  };

  const isRefeicaoSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoRefeicao => {
    return solicitacao.tipo === 'Refeição';
  };

  const isTransporteSolicitacao = (solicitacao: Solicitacao): solicitacao is SolicitacaoTransporte => {
    return solicitacao.tipo === 'Transporte Rota' || solicitacao.tipo === 'Transporte 12x36';
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
          {user.tipo_usuario === "selecao" && (
            <Button asChild className="mr-2">
              <Link to="/cadastro-usuario">Cadastrar Usuário</Link>
            </Button>
          )}
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
        <div className="mt-4 space-x-2">
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
        </div>
      );
    }
  };

  return (
    <div className="container max-w-5xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações</CardTitle>
          <CardDescription>
            Acompanhe o status das suas solicitações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {solicitacoes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg">Nenhuma solicitação encontrada.</p>
              {showButtons()}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {user?.tipo_usuario === 'refeicao' ? (
                  <Table>
                    <TableBody>
                      {solicitacoes.map((solicitacao) => {
                        if (isRefeicaoSolicitacao(solicitacao)) {
                          return (
                            <TableRow key={solicitacao.id} className="border-b">
                              <TableCell className="align-top">
                                <div className="font-medium">Solicitador de Refeição</div>
                                <div className="text-sm text-muted-foreground">Produção</div>
                              </TableCell>
                              
                              <TableCell className="align-top">
                                <div className="font-medium">{solicitacao.colaboradores[0]}</div>
                              </TableCell>
                              
                              <TableCell className="align-top">
                                <div className="font-medium">{solicitacao.tipo_refeicao}</div>
                              </TableCell>
                              
                              <TableCell className="align-top">
                                <div className="font-medium">{formatDate(solicitacao.data_refeicao)}</div>
                              </TableCell>
                              
                              <TableCell className="align-top">
                                <div className="font-medium">{formatDateTime(solicitacao.created_at)}</div>
                              </TableCell>
                              
                              <TableCell className="align-top">
                                <Badge 
                                  variant={solicitacao.status === 'aprovada' ? 'success' : 'secondary'}
                                >
                                  {solicitacao.status === 'aprovada' ? 'Aprovada' : solicitacao.status}
                                </Badge>
                              </TableCell>
                              
                              <TableCell className="align-top">
                                {solicitacao.status === 'aprovada' && (
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleDownloadTicket(solicitacao)}
                                  >
                                    <Download className="mr-1 h-4 w-4" /> Gerar Tickets
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return null;
                      })}
                    </TableBody>
                  </Table>
                ) : user?.tipo_usuario === 'selecao' ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Rota</TableHead>
                        <TableHead>Período/Data</TableHead>
                        <TableHead>Data de Solicitação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitacoes.map((solicitacao) => {
                        if (isTransporteSolicitacao(solicitacao)) {
                          return (
                            <TableRow key={solicitacao.id}>
                              <TableCell>{solicitacao.tipo}</TableCell>
                              <TableCell>{solicitacao.colaborador_nome}</TableCell>
                              <TableCell>{solicitacao.rota}</TableCell>
                              <TableCell>
                                {solicitacao.tipo === 'Transporte Rota' ? 
                                  (solicitacao.periodo_inicio && solicitacao.periodo_fim ? 
                                    `${formatDate(solicitacao.periodo_inicio)} a ${formatDate(solicitacao.periodo_fim)}` : 
                                    'N/A') : 
                                  (solicitacao.data_inicio ? 
                                    formatDate(solicitacao.data_inicio) : 
                                    'N/A')
                                }
                              </TableCell>
                              <TableCell>{formatDateTime(solicitacao.created_at)}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={solicitacao.status === 'aprovada' ? 'success' : 'secondary'}
                                >
                                  {solicitacao.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {solicitacao.status === 'aprovada' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    title="Gerar Ticket"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return null;
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableCaption>Suas solicitações de serviços.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitacoes.map((solicitacao) => (
                        <TableRow key={solicitacao.id}>
                          <TableCell>{solicitacao.tipo}</TableCell>
                          <TableCell>{formatDateTime(solicitacao.created_at)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={solicitacao.status === 'aprovada' ? 'success' : 'secondary'}
                            >
                              {solicitacao.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isRefeicaoSolicitacao(solicitacao) && solicitacao.status === 'aprovada' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadTicket(solicitacao)}
                                title="Baixar Ticket"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <div className="mt-4">
                {showButtons()}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhasSolicitacoes;
