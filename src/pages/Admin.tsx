import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  supabase, 
  queryCustomTable,
  updateCustomTable,
  BaseSolicitacao,
  SolicitacaoAbonoPonto as AbonoPontoType,
  SolicitacaoAdesaoCancelamento as AdesaoCancelamentoType,
  SolicitacaoAlteracaoEndereco as AlteracaoEnderecoType,
  SolicitacaoMudancaTurno as MudancaTurnoType
} from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Map, 
  Route, 
  Search, 
  Utensils, 
  XCircle,
  Home,
  ClipboardCheck,
  Replace
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Solicitacao {
  id: number;
  status: string;
  created_at: string;
  solicitante_id: number;
  solicitante?: {
    nome: string;
    setor: string;
  };
}

interface SolicitacaoTransporteRota extends Solicitacao {
  colaborador_nome: string;
  cidade: string;
  turno: string;
  rota: string;
  periodo_inicio: string;
  periodo_fim: string;
  motivo: string;
}

interface SolicitacaoTransporte12x36 extends Solicitacao {
  colaborador_nome: string;
  telefone: string;
  endereco: string;
  cep: string;
  rota: string;
  data_inicio: string;
}

interface SolicitacaoRefeicao extends Solicitacao {
  colaboradores: string[];
  tipo_refeicao: string;
  data_refeicao: string;
}

interface SolicitacaoAbonosPonto extends Solicitacao {
  data_ocorrencia: string;
  turno: string;
  motivo: string;
}

interface SolicitacaoAdesaoCancelamento extends Solicitacao {
  tipo_solicitacao: string;
  motivo: string;
}

interface SolicitacaoAlteracaoEndereco extends Solicitacao {
  endereco_atual: string;
  endereco_novo: string;
  data_alteracao: string;
  comprovante_url?: string;
}

interface SolicitacaoMudancaTurno extends Solicitacao {
  turno_atual: string;
  turno_novo: string;
  data_alteracao: string;
  motivo: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [solicitacoesRota, setSolicitacoesRota] = useState<SolicitacaoTransporteRota[]>([]);
  const [solicitacoes12x36, setSolicitacoes12x36] = useState<SolicitacaoTransporte12x36[]>([]);
  const [solicitacoesRefeicao, setSolicitacoesRefeicao] = useState<SolicitacaoRefeicao[]>([]);
  const [solicitacoesAbonoPonto, setSolicitacoesAbonoPonto] = useState<SolicitacaoAbonosPonto[]>([]);
  const [solicitacoesAdesaoCancelamento, setSolicitacoesAdesaoCancelamento] = useState<SolicitacaoAdesaoCancelamento[]>([]);
  const [solicitacoesAlteracaoEndereco, setSolicitacoesAlteracaoEndereco] = useState<SolicitacaoAlteracaoEndereco[]>([]);
  const [solicitacoesMudancaTurno, setSolicitacoesMudancaTurno] = useState<SolicitacaoMudancaTurno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [solicitantesInfo, setSolicitantesInfo] = useState<{[id: number]: {nome: string, setor: string}}>({});

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    setLoading(true);
    try {
      // Função genérica para buscar solicitações
      const fetchTableData = async <T>(tableName: string, setter: (data: T[]) => void) => {
        const { data, error } = await queryCustomTable<T>(tableName, {
          order: { column: 'created_at', ascending: false }
        });
        if (error) {
          console.error(`Erro ao buscar solicitações de ${tableName}:`, error);
          toast.error(`Erro ao buscar solicitações de ${tableName}`);
        } else {
          setter(data);
          // Mapear informações dos solicitantes
          data.forEach((item: any) => {
            if (item.solicitante_id && !solicitantesInfo[item.solicitante_id]) {
              fetchSolicitanteInfo(item.solicitante_id);
            }
          });
        }
      };

      await Promise.all([
        fetchTableData<SolicitacaoTransporteRota>("solicitacoes_transporte_rota", setSolicitacoesRota),
        fetchTableData<SolicitacaoTransporte12x36>("solicitacoes_transporte_12x36", setSolicitacoes12x36),
        fetchTableData<SolicitacaoRefeicao>("solicitacoes_refeicao", setSolicitacoesRefeicao),
        fetchTableData<SolicitacaoAbonosPonto>("solicitacoes_abono_ponto", setSolicitacoesAbonoPonto),
        fetchTableData<SolicitacaoAdesaoCancelamento>("solicitacoes_adesao_cancelamento", setSolicitacoesAdesaoCancelamento),
        fetchTableData<SolicitacaoAlteracaoEndereco>("solicitacoes_alteracao_endereco", setSolicitacoesAlteracaoEndereco),
        fetchTableData<SolicitacaoMudancaTurno>("solicitacoes_mudanca_turno", setSolicitacoesMudancaTurno),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitanteInfo = async (solicitanteId: number) => {
    try {
      const { data: solicitante, error } = await supabase
        .from('colaboradores')
        .select('nome, setor')
        .eq('id', solicitanteId)
        .single();

      if (error) {
        console.error("Erro ao buscar informações do solicitante:", error);
        toast.error("Erro ao buscar informações do solicitante");
      } else if (solicitante) {
        setSolicitantesInfo(prev => ({
          ...prev,
          [solicitanteId]: { nome: solicitante.nome, setor: solicitante.setor }
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar informações do solicitante:", error);
      toast.error("Ocorreu um erro ao buscar informações do solicitante");
    }
  };

  const renderSolicitacoesTransporteRota = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoesRota.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
      if (filtroColaborador && !solicitacao.colaborador_nome.toLowerCase().includes(filtroColaborador.toLowerCase())) {
        return false;
      }
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Rota</TableHead>
            <TableHead>Período Início</TableHead>
            <TableHead>Período Fim</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.colaborador_nome}</TableCell>
              <TableCell>{solicitacao.cidade}</TableCell>
              <TableCell>{solicitacao.turno}</TableCell>
              <TableCell>{solicitacao.rota}</TableCell>
              <TableCell>
                {solicitacao.periodo_inicio
                  ? format(new Date(solicitacao.periodo_inicio), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>
                {solicitacao.periodo_fim
                  ? format(new Date(solicitacao.periodo_fim), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>{solicitacao.motivo}</TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_transporte_rota", solicitacao.id, "rota")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_transporte_rota", solicitacao.id, "rota")}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderSolicitacoesTransporte12x36 = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoes12x36.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
      if (filtroColaborador && !solicitacao.colaborador_nome.toLowerCase().includes(filtroColaborador.toLowerCase())) {
        return false;
      }
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead>Rota</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.colaborador_nome}</TableCell>
              <TableCell>{solicitacao.telefone}</TableCell>
              <TableCell>{solicitacao.endereco}</TableCell>
              <TableCell>{solicitacao.cep}</TableCell>
              <TableCell>{solicitacao.rota}</TableCell>
              <TableCell>
                {solicitacao.data_inicio
                  ? format(new Date(solicitacao.data_inicio), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_transporte_12x36", solicitacao.id, "12x36")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_transporte_12x36", solicitacao.id, "12x36")}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderSolicitacoesRefeicao = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoesRefeicao.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
      if (filtroColaborador && !solicitacao.colaboradores.some(colaborador => colaborador.toLowerCase().includes(filtroColaborador.toLowerCase()))) {
        return false;
      }
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colaboradores</TableHead>
            <TableHead>Tipo de Refeição</TableHead>
            <TableHead>Data da Refeição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.colaboradores.join(", ")}</TableCell>
              <TableCell>{solicitacao.tipo_refeicao}</TableCell>
              <TableCell>
                {solicitacao.data_refeicao
                  ? format(new Date(solicitacao.data_refeicao), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_refeicao", solicitacao.id, "refeicao")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_refeicao", solicitacao.id, "refeicao")}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderSolicitacoesAbonoPonto = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoesAbonoPonto.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
        
        if (filtroColaborador && solicitacao.solicitante) {
          return solicitacao.solicitante.nome
            .toLowerCase()
            .includes(filtroColaborador.toLowerCase());
        }
        
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Data Ocorrência</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.solicitante?.nome || "N/A"}</TableCell>
              <TableCell>{solicitacao.solicitante?.setor || "N/A"}</TableCell>
              <TableCell>
                {solicitacao.data_ocorrencia
                  ? format(new Date(solicitacao.data_ocorrencia), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>{solicitacao.turno}</TableCell>
              <TableCell>{solicitacao.motivo}</TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_abono_ponto", solicitacao.id, "abono_ponto")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_abono_ponto", solicitacao.id, "abono_ponto")}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderSolicitacoesAdesaoCancelamento = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoesAdesaoCancelamento.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
        
        if (filtroColaborador && solicitacao.solicitante) {
          return solicitacao.solicitante.nome
            .toLowerCase()
            .includes(filtroColaborador.toLowerCase());
        }
        
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Tipo Solicitação</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.solicitante?.nome || "N/A"}</TableCell>
              <TableCell>{solicitacao.solicitante?.setor || "N/A"}</TableCell>
              <TableCell>{solicitacao.tipo_solicitacao}</TableCell>
              <TableCell>{solicitacao.motivo}</TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_adesao_cancelamento", solicitacao.id, "adesao_cancelamento")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_adesao_cancelamento", solicitacao.id, "adesao_cancelamento")}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleAprovarSolicitacao = async (tableName: string, id: number, tipo: string) => {
    try {
      const { error } = await updateCustomTable(
        tableName,
        { status: "aprovado", updated_at: new Date().toISOString() },
        { column: "id", value: id }
      );

      if (error) {
        toast.error("Erro ao aprovar solicitação");
        console.error("Erro ao aprovar:", error);
        return;
      }

      toast.success("Solicitação aprovada com sucesso!");
      
      // Atualiza a lista de solicitações
      fetchSolicitacoes();
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
      toast.error("Ocorreu um erro ao aprovar a solicitação");
    }
  };

  const handleRejeitarSolicitacao = async (tableName: string, id: number, tipo: string) => {
    try {
      const { error } = await updateCustomTable(
        tableName,
        { status: "rejeitado", updated_at: new Date().toISOString() },
        { column: "id", value: id }
      );

      if (error) {
        toast.error("Erro ao rejeitar solicitação");
        console.error("Erro ao rejeitar:", error);
        return;
      }

      toast.success("Solicitação rejeitada com sucesso!");
      
      // Atualiza a lista de solicitações
      fetchSolicitacoes();
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      toast.error("Ocorreu um erro ao rejeitar a solicitação");
    }
  };

  // Função para baixar o comprovante de endereço
  const handleDownloadComprovante = async (comprovanteUrl: string) => {
    try {
      if (!comprovanteUrl) {
        toast.error("URL do comprovante não disponível");
        return;
      }
      
      // Obtém o nome do arquivo da URL
      const fileName = comprovanteUrl.split('/').pop() || 'comprovante';
      
      // Faz o download do arquivo do storage do Supabase
      const { data, error } = await supabase.storage
        .from('comprovantes') // Ajuste o nome do bucket conforme necessário
        .download(comprovanteUrl);
        
      if (error) {
        console.error("Erro ao baixar comprovante:", error);
        toast.error("Erro ao baixar o comprovante");
        return;
      }
      
      // Cria um URL para o arquivo baixado
      const url = URL.createObjectURL(data);
      
      // Cria um link para download e simula o clique
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Limpa o URL e remove o elemento
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      toast.success("Download do comprovante iniciado");
    } catch (error) {
      console.error("Erro ao processar download:", error);
      toast.error("Ocorreu um erro ao baixar o comprovante");
    }
  };

  const renderSolicitacoesAlteracaoEndereco = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoesAlteracaoEndereco.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
        
      if (filtroColaborador && solicitacao.solicitante) {
        return solicitacao.solicitante.nome
          .toLowerCase()
          .includes(filtroColaborador.toLowerCase());
      }
        
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Endereço Atual</TableHead>
            <TableHead>Endereço Novo</TableHead>
            <TableHead>Data Alteração</TableHead>
            <TableHead>Comprovante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.solicitante?.nome || "N/A"}</TableCell>
              <TableCell>{solicitacao.solicitante?.setor || "N/A"}</TableCell>
              <TableCell>{solicitacao.endereco_atual}</TableCell>
              <TableCell>{solicitacao.endereco_novo}</TableCell>
              <TableCell>
                {solicitacao.data_alteracao
                  ? format(new Date(solicitacao.data_alteracao), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>
                {solicitacao.comprovante_url ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleDownloadComprovante(solicitacao.comprovante_url || "")}
                  >
                    <Download className="h-4 w-4" /> Baixar
                  </Button>
                ) : (
                  "Não disponível"
                )}
              </TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_alteracao_endereco", solicitacao.id, "alteracao_endereco")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_alteracao_endereco", solicitacao.id, "alteracao_endereco")}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderSolicitacoesMudancaTurno = () => {
    if (loading) {
      return <p>Carregando solicitações...</p>;
    }

    const solicitacoesFiltradas = solicitacoesMudancaTurno.filter(solicitacao => {
      if (filtroStatus !== "todos" && solicitacao.status !== filtroStatus) {
        return false;
      }
        
      if (filtroColaborador && solicitacao.solicitante) {
        return solicitacao.solicitante.nome
          .toLowerCase()
          .includes(filtroColaborador.toLowerCase());
      }
        
      return true;
    });

    if (solicitacoesFiltradas.length === 0) {
      return <p>Nenhuma solicitação encontrada</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Turno Atual</TableHead>
            <TableHead>Turno Novo</TableHead>
            <TableHead>Data Alteração</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map(solicitacao => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.solicitante?.nome || "N/A"}</TableCell>
              <TableCell>{solicitacao.solicitante?.setor || "N/A"}</TableCell>
              <TableCell>{solicitacao.turno_atual}</TableCell>
              <TableCell>{solicitacao.turno_novo}</TableCell>
              <TableCell>
                {solicitacao.data_alteracao
                  ? format(new Date(solicitacao.data_alteracao), "dd/MM/yyyy", { locale: ptBR })
                  : "N/A"}
              </TableCell>
              <TableCell>{solicitacao.motivo}</TableCell>
              <TableCell>
                <Badge variant={solicitacao.status === "aprovado" ? "success" : solicitacao.status === "rejeitado" ? "destructive" : "default"}>
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "
