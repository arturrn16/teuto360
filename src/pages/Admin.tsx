
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
                  {solicitacao.status === "aprovado" ? "Aprovado" : solicitacao.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell>
                {solicitacao.status === "pendente" && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleAprovarSolicitacao("solicitacoes_mudanca_turno", solicitacao.id, "mudanca_turno")}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejeitarSolicitacao("solicitacoes_mudanca_turno", solicitacao.id, "mudanca_turno")}>
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>
      
      <div className="flex items-center mb-6 gap-4">
        <div className="flex-1">
          <Input
            placeholder="Filtrar por nome do colaborador"
            value={filtroColaborador}
            onChange={(e) => setFiltroColaborador(e.target.value)}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="rota">
        <TabsList className="mb-4">
          <TabsTrigger value="rota" className="flex items-center gap-1">
            <Route className="h-4 w-4" />
            Transporte (Rota)
          </TabsTrigger>
          <TabsTrigger value="12x36" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            Transporte (12x36)
          </TabsTrigger>
          <TabsTrigger value="refeicao" className="flex items-center gap-1">
            <Utensils className="h-4 w-4" />
            Refeição
          </TabsTrigger>
          <TabsTrigger value="abono" className="flex items-center gap-1">
            <ClipboardCheck className="h-4 w-4" />
            Abono de Ponto
          </TabsTrigger>
          <TabsTrigger value="adesao" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Adesão/Cancelamento
          </TabsTrigger>
          <TabsTrigger value="endereco" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Alteração de Endereço
          </TabsTrigger>
          <TabsTrigger value="turno" className="flex items-center gap-1">
            <Replace className="h-4 w-4" />
            Mudança de Turno
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas */}
        <TabsContent value="rota">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Transporte (Rota)</CardTitle>
              <CardDescription>
                Gerencie as solicitações de transporte para rotas regulares.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesTransporteRota()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="12x36">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Transporte (12x36)</CardTitle>
              <CardDescription>
                Gerencie as solicitações de transporte para regime 12x36.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesTransporte12x36()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refeicao">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Refeição</CardTitle>
              <CardDescription>
                Gerencie as solicitações de refeição extra.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesRefeicao()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abono">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Abono de Ponto</CardTitle>
              <CardDescription>
                Gerencie as solicitações de abono de ponto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesAbonoPonto()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adesao">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Adesão/Cancelamento</CardTitle>
              <CardDescription>
                Gerencie as solicitações de adesão ou cancelamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesAdesaoCancelamento()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endereco">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Alteração de Endereço</CardTitle>
              <CardDescription>
                Gerencie as solicitações de alteração de endereço.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesAlteracaoEndereco()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turno">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Mudança de Turno</CardTitle>
              <CardDescription>
                Gerencie as solicitações de mudança de turno.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSolicitacoesMudancaTurno()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
