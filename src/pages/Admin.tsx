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
  Replace,
  File,
  ChevronDown
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageLoader } from "@/components/ui/loader-spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user, isAuthenticated, isLoading } = useAuth();
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
  const [activeTab, setActiveTab] = useState("rota");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.admin) {
      fetchSolicitacoes();
    }
  }, [user, isAuthenticated, isLoading]);
  
  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      
      const { data: dataRota, error: errorRota } = await supabase
        .from("solicitacoes_transporte_rota")
        .select("*")
        .order("created_at", { ascending: false });
          
      if (errorRota) {
        console.error("Erro ao buscar solicitações de rota:", errorRota);
      } else {
        setSolicitacoesRota(dataRota || []);
      }
        
      const { data: data12x36, error: error12x36 } = await supabase
        .from("solicitacoes_transporte_12x36")
        .select("*")
        .order("created_at", { ascending: false });
          
      if (error12x36) {
        console.error("Erro ao buscar solicitações 12x36:", error12x36);
      } else {
        setSolicitacoes12x36(data12x36 || []);
      }
        
      const { data: dataRefeicao, error: errorRefeicao } = await supabase
        .from("solicitacoes_refeicao")
        .select("*")
        .order("created_at", { ascending: false });
          
      if (errorRefeicao) {
        console.error("Erro ao buscar solicitações de refeição:", errorRefeicao);
      } else {
        setSolicitacoesRefeicao(dataRefeicao || []);
      }

      try {
        console.log("Fetching abono_ponto solicitations...");
        const { data: dataAbonoPonto, error: errorAbonoPonto } = await supabase
          .from("solicitacoes_abono_ponto")
          .select("*")
          .order("created_at", { ascending: false });
            
        if (errorAbonoPonto) {
          console.error("Erro ao buscar solicitações de abono de ponto:", errorAbonoPonto);
        } else if (dataAbonoPonto) {
          console.log("Received abono_ponto data:", dataAbonoPonto.length, "records");
          setSolicitacoesAbonoPonto(dataAbonoPonto);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de abono de ponto:", err);
      }

      try {
        console.log("Fetching adesao_cancelamento solicitations...");
        const { data: dataAdesaoCancelamento, error: errorAdesaoCancelamento } = await supabase
          .from("solicitacoes_adesao_cancelamento")
          .select("*")
          .order("created_at", { ascending: false });
            
        if (errorAdesaoCancelamento) {
          console.error("Erro ao buscar solicitações de adesão/cancelamento:", errorAdesaoCancelamento);
        } else if (dataAdesaoCancelamento) {
          console.log("Received adesao_cancelamento data:", dataAdesaoCancelamento.length, "records");
          setSolicitacoesAdesaoCancelamento(dataAdesaoCancelamento);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de adesão/cancelamento:", err);
      }

      try {
        console.log("Fetching alteracao_endereco solicitations...");
        const { data: dataAlteracaoEndereco, error: errorAlteracaoEndereco } = await supabase
          .from("solicitacoes_alteracao_endereco")
          .select("*")
          .order("created_at", { ascending: false });
            
        if (errorAlteracaoEndereco) {
          console.error("Erro ao buscar solicitações de alteração de endereço:", errorAlteracaoEndereco);
        } else if (dataAlteracaoEndereco) {
          console.log("Received alteracao_endereco data:", dataAlteracaoEndereco.length, "records");
          setSolicitacoesAlteracaoEndereco(dataAlteracaoEndereco);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de alteração de endereço:", err);
      }

      try {
        console.log("Fetching mudanca_turno solicitations...");
        const { data: dataMudancaTurno, error: errorMudancaTurno } = await supabase
          .from("solicitacoes_mudanca_turno")
          .select("*")
          .order("created_at", { ascending: false });
            
        if (errorMudancaTurno) {
          console.error("Erro ao buscar solicitações de mudança de turno:", errorMudancaTurno);
        } else if (dataMudancaTurno) {
          console.log("Received mudanca_turno data:", dataMudancaTurno.length, "records");
          setSolicitacoesMudancaTurno(dataMudancaTurno);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de mudança de turno:", err);
      }
        
      const solicitanteIds = new Set<number>();
        
      [
        ...(dataRota || []), 
        ...(data12x36 || []), 
        ...(dataRefeicao || [])
      ].forEach(s => {
        if (s.solicitante_id) solicitanteIds.add(s.solicitante_id);
      });
        
      solicitacoesAbonoPonto.forEach(s => { 
        if (s && s.solicitante_id) solicitanteIds.add(s.solicitante_id); 
      });
        
      solicitacoesAdesaoCancelamento.forEach(s => { 
        if (s && s.solicitante_id) solicitanteIds.add(s.solicitante_id); 
      });
        
      solicitacoesAlteracaoEndereco.forEach(s => { 
        if (s && s.solicitante_id) solicitanteIds.add(s.solicitante_id); 
      });
        
      solicitacoesMudancaTurno.forEach(s => { 
        if (s && s.solicitante_id) solicitanteIds.add(s.solicitante_id); 
      });
          
      if (solicitanteIds.size > 0) {
        const { data: solicitantesData, error: solicitantesError } = await supabase
          .from("usuarios")
          .select("id, nome, setor")
          .in("id", Array.from(solicitanteIds));
            
        if (solicitantesError) {
          console.error("Erro ao buscar solicitantes:", solicitantesError);
        } else if (solicitantesData) {
          const infoMap: {[id: number]: {nome: string, setor: string}} = {};
          solicitantesData.forEach(s => {
            infoMap[s.id] = { nome: s.nome, setor: s.setor };
          });
          setSolicitantesInfo(infoMap);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  const formatarTimestamp = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  const filtrarSolicitacoesRota = () => {
    return solicitacoesRota.filter(s => {
      const matchColaborador = s.colaborador_nome.toLowerCase().includes(filtroColaborador.toLowerCase());
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchColaborador && matchStatus;
    });
  };
  
  const filtrarSolicitacoes12x36 = () => {
    return solicitacoes12x36.filter(s => {
      const matchColaborador = s.colaborador_nome.toLowerCase().includes(filtroColaborador.toLowerCase());
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchColaborador && matchStatus;
    });
  };
  
  const filtrarSolicitacoesRefeicao = () => {
    return solicitacoesRefeicao.filter(s => {
      const matchColaborador = s.colaboradores.some(c => 
        c.toLowerCase().includes(filtroColaborador.toLowerCase())
      );
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchColaborador && matchStatus;
    });
  };

  const filtrarSolicitacoesAbonoPonto = () => {
    return solicitacoesAbonoPonto.filter(s => {
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchStatus;
    });
  };

  const filtrarSolicitacoesAdesaoCancelamento = () => {
    return solicitacoesAdesaoCancelamento.filter(s => {
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchStatus;
    });
  };

  const filtrarSolicitacoesAlteracaoEndereco = () => {
    return solicitacoesAlteracaoEndereco.filter(s => {
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchStatus;
    });
  };

  const filtrarSolicitacoesMudancaTurno = () => {
    return solicitacoesMudancaTurno.filter(s => {
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchStatus;
    });
  };
  
  const atualizarStatusRota = async (id: number, status: 'aprovada' | 'rejeitada') => {
    try {
      const { error } = await updateCustomTable(
        "solicitacoes_transporte_rota",
        { status },
        { column: 'id', value: id }
      );
        
      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      setSolicitacoesRota(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  const atualizarStatus12x36 = async (id: number, status: 'aprovada' | 'rejeitada') => {
    try {
      const { error } = await updateCustomTable(
        "solicitacoes_transporte_12x36",
        { status },
        { column: 'id', value: id }
      );
        
      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      setSolicitacoes12x36(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  const atualizarStatusRefeicao = async (id: number, status: 'aprovada' | 'rejeitada') => {
    try {
      const { error } = await updateCustomTable(
        "solicitacoes_refeicao",
        { status },
        { column: 'id', value: id }
      );
        
      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      setSolicitacoesRefeicao(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };

  const atualizarStatusGenerico = async (tabela: string, id: number, status: 'aprovada' | 'rejeitada', atualizarEstado: Function) => {
    try {
      const { error } = await updateCustomTable(
        tabela,
        { status },
        { column: 'id', value: id }
      );
        
      if (error) {
        console.error(`Erro ao atualizar status em ${tabela}:`, error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      atualizarEstado((prev: any[]) => 
        prev.map((s: any) => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error(`Erro ao atualizar status em ${tabela}:`, error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  const StatusBadge = ({ status }: { status: string }) => {
    let variant = "default";
    
    switch (status) {
      case "aprovada":
        variant = "success";
        break;
      case "rejeitada":
        variant = "destructive";
        break;
      case "pendente":
        variant = "secondary";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant as any} className="capitalize">
        {status}
      </Badge>
    );
  };
  
  const SolicitanteInfo = ({ id }: { id: number }) => {
    const info = solicitantesInfo[id];
    
    if (!info) return <span className="text-muted-foreground">--</span>;
    
    return (
      <div className="text-sm">
        <div className="font-medium">{info.nome}</div>
        <div className="text-muted-foreground">{info.setor}</div>
      </div>
    );
  };
  
  const handleDownloadComprovante = async (url: string, solicitanteNome: string) => {
    if (!url) {
      toast.error("Nenhum comprovante de endereço anexado");
      return;
    }
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const extension = url.split('.').pop() || 'pdf';
      
      a.download = `comprovante_endereco_${solicitanteNome.replace(/\s+/g, '_')}.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(downloadUrl);
      
      toast.success("Download do comprovante iniciado");
    } catch (error) {
      console.error("Erro ao baixar o comprovante:", error);
      toast.error("Erro ao baixar o comprovante de endereço");
    }
  };

  const requestTypeOptions = [
    { value: "rota", label: "Transporte Rota", icon: <Route className="h-4 w-4 mr-2" /> },
    { value: "12x36", label: "Transporte 12x36", icon: <Map className="h-4 w-4 mr-2" /> },
    { value: "refeicao", label: "Refeição", icon: <Utensils className="h-4 w-4 mr-2" /> },
    { value: "abono", label: "Abono Ponto", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "adesao", label: "Adesão/Cancelamento", icon: <ClipboardCheck className="h-4 w-4 mr-2" /> },
    { value: "endereco", label: "Alteração Endereço", icon: <Home className="h-4 w-4 mr-2" /> },
    { value: "turno", label: "Mudança Turno", icon: <Replace className="h-4 w-4 mr-2" /> }
  ];

  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated || !user?.admin) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <div className="text-2xl font-bold text-destructive mb-4">Acesso Negado</div>
            <p>Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Administração de Solicitações</CardTitle>
          <CardDescription>
            Gerenciamento de solicitações de transporte, refeição e serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-10">Carregando solicitações...</p>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Filtrar por nome do colaborador"
                      value={filtroColaborador}
                      onChange={(e) => setFiltroColaborador(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <Select
                    value={filtroStatus}
                    onValueChange={setFiltroStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="aprovada">Aprovada</SelectItem>
                      <SelectItem value="rejeitada">Rejeitada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isMobile ? (
                <div className="mb-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center">
                          {requestTypeOptions.find(opt => opt.value === activeTab)?.icon}
                          <span>{requestTypeOptions.find(opt => opt.value === activeTab)?.label}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {requestTypeOptions.map((option) => (
                        <DropdownMenuItem 
                          key={option.value}
                          onClick={() => setActiveTab(option.value)}
                          className="flex items-center"
                        >
                          {option.icon}
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="mt-4">
                    {activeTab === "rota" && (
                      <>
                        {filtrarSolicitacoesRota().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Colaborador</TableHead>
                                  <TableHead>Cidade / Turno</TableHead>
                                  <TableHead>Rota</TableHead>
                                  <TableHead>Período</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoesRota().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell className="font-medium">{solicitacao.colaborador_nome}</TableCell>
                                    <TableCell>{solicitacao.cidade} / {solicitacao.turno}</TableCell>
                                    <TableCell>{solicitacao.rota}</TableCell>
                                    <TableCell>
                                      {formatarData(solicitacao.periodo_inicio)} até {formatarData(solicitacao.periodo_fim)}
                                    </TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatusRota(solicitacao.id, "aprovada")}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatusRota(solicitacao.id, "rejeitada")}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                        {solicitacao.status === "aprovada" && (
                                          <Button variant="outline" size="sm" className="w-full">
                                            <Download className="h-4 w-4 mr-1" />
                                            Gerar Ticket
                                          </Button>
                                        )}
                                        {solicitacao.status === "rejeitada" && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => atualizarStatusRota(solicitacao.id, "aprovada")}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Aprovar
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de transporte rota encontrada.
                          </p>
                        )}
                      </>
                    )}
                    
                    {activeTab === "12x36" && (
                      <>
                        {filtrarSolicitacoes12x36().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Colaborador</TableHead>
                                  <TableHead>Telefone</TableHead>
                                  <TableHead>Rota</TableHead>
                                  <TableHead>Data de Início</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoes12x36().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell className="font-medium">{solicitacao.colaborador_nome}</TableCell>
                                    <TableCell>{solicitacao.telefone}</TableCell>
                                    <TableCell>{solicitacao.rota}</TableCell>
                                    <TableCell>{formatarData(solicitacao.data_inicio)}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatus12x36(solicitacao.id, "aprovada")}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatus12x36(solicitacao.id, "rejeitada")}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de transporte 12x36 encontrada.
                          </p>
                        )}
                      </>
                    )}
                    
                    {activeTab === "refeicao" && (
                      <>
                        {filtrarSolicitacoesRefeicao().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Colaboradores</TableHead>
                                  <TableHead>Tipo</TableHead>
                                  <TableHead>Data</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoesRefeicao().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell className="font-medium">{solicitacao.colaboradores.join(", ")}</TableCell>
                                    <TableCell>{solicitacao.tipo_refeicao}</TableCell>
                                    <TableCell>{formatarData(solicitacao.data_refeicao)}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatusRefeicao(solicitacao.id, "aprovada")}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatusRefeicao(solicitacao.id, "rejeitada")}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de refeição encontrada.
                          </p>
                        )}
                      </>
                    )}
                    
                    {activeTab === "abono" && (
                      <>
                        {filtrarSolicitacoesAbonoPonto().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Data de Ocorrência</TableHead>
                                  <TableHead>Turno</TableHead>
                                  <TableHead>Motivo</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoesAbonoPonto().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell>{formatarData(solicitacao.data_ocorrencia)}</TableCell>
                                    <TableCell>{solicitacao.turno}</TableCell>
                                    <TableCell>{solicitacao.motivo}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_abono_ponto", solicitacao.id, "aprovada", setSolicitacoesAbonoPonto)}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_abono_ponto", solicitacao.id, "rejeitada", setSolicitacoesAbonoPonto)}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de abono de ponto encontrada.
                          </p>
                        )}
                      </>
                    )}
                    
                    {activeTab === "adesao" && (
                      <>
                        {filtrarSolicitacoesAdesaoCancelamento().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Tipo de Solicitação</TableHead>
                                  <TableHead>Motivo</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoesAdesaoCancelamento().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell>{solicitacao.tipo_solicitacao}</TableCell>
                                    <TableCell>{solicitacao.motivo}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_adesao_cancelamento", solicitacao.id, "aprovada", setSolicitacoesAdesaoCancelamento)}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_adesao_cancelamento", solicitacao.id, "rejeitada", setSolicitacoesAdesaoCancelamento)}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de adesão/cancelamento encontrada.
                          </p>
                        )}
                      </>
                    )}
                    
                    {activeTab === "endereco" && (
                      <>
                        {filtrarSolicitacoesAlteracaoEndereco().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Endereço Atual</TableHead>
                                  <TableHead>Endereço Novo</TableHead>
                                  <TableHead>Data de Alteração</TableHead>
                                  <TableHead>Comprovante</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoesAlteracaoEndereco().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell>{solicitacao.endereco_atual}</TableCell>
                                    <TableCell>{solicitacao.endereco_novo}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.data_alteracao)}</TableCell>
                                    <TableCell>
                                      {solicitacao.comprovante_url && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                                          onClick={() => handleDownloadComprovante(solicitacao.comprovante_url, solicitacao.solicitante?.nome || "Anônimo")}
                                        >
                                          <File className="h-4 w-4 mr-1" />
                                          Baixar Comprovante
                                        </Button>
                                      )}
                                    </TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_alteracao_endereco", solicitacao.id, "aprovada", setSolicitacoesAlteracaoEndereco)}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_alteracao_endereco", solicitacao.id, "rejeitada", setSolicitacoesAlteracaoEndereco)}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de alteração de endereço encontrada.
                          </p>
                        )}
                      </>
                    )}
                    
                    {activeTab === "turno" && (
                      <>
                        {filtrarSolicitacoesMudancaTurno().length > 0 ? (
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Solicitante</TableHead>
                                  <TableHead>Turno Atual</TableHead>
                                  <TableHead>Turno Novo</TableHead>
                                  <TableHead>Data de Alteração</TableHead>
                                  <TableHead>Motivo</TableHead>
                                  <TableHead>Data de Solicitação</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="w-[180px]">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filtrarSolicitacoesMudancaTurno().map((solicitacao) => (
                                  <TableRow key={solicitacao.id}>
                                    <TableCell>
                                      <SolicitanteInfo id={solicitacao.solicitante_id} />
                                    </TableCell>
                                    <TableCell>{solicitacao.turno_atual}</TableCell>
                                    <TableCell>{solicitacao.turno_novo}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.data_alteracao)}</TableCell>
                                    <TableCell>{solicitacao.motivo}</TableCell>
                                    <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                    <TableCell>
                                      <StatusBadge status={solicitacao.status} />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {solicitacao.status === "pendente" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_mudanca_turno", solicitacao.id, "aprovada", setSolicitacoesMudancaTurno)}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Aprovar
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                              onClick={() => atualizarStatusGenerico("solicitacoes_mudanca_turno", solicitacao.id, "rejeitada", setSolicitacoesMudancaTurno)}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Rejeitar
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-center py-10 text-muted-foreground">
                            Nenhuma solicitação de mudança de turno encontrada.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="rota" onValueChange={setActiveTab} value={activeTab}>
                  <TabsList className="grid w-full grid-cols-7">
                    {requestTypeOptions.map((option) => (
                      <TabsTrigger key={option.value} value={option.value} className="flex items-center gap-1">
                        {React.cloneElement(option.icon, { className: "h-4 w-4" })}
                        {option.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <TabsContent value="rota" className="mt-4">
                    {filtrarSolicitacoesRota().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Colaborador</TableHead>
                              <TableHead>Cidade / Turno</TableHead>
                              <TableHead>Rota</TableHead>
                              <TableHead>Período</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesRota().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell className="font-medium">{solicitacao.colaborador_nome}</TableCell>
                                <TableCell>{solicitacao.cidade} / {solicitacao.turno}</TableCell>
                                <TableCell>{solicitacao.rota}</TableCell>
                                <TableCell>
                                  {formatarData(solicitacao.periodo_inicio)} até {formatarData(solicitacao.periodo_fim)}
                                </TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatusRota(solicitacao.id, "aprovada")}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatusRota(solicitacao.id, "rejeitada")}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                    {solicitacao.status === "aprovada" && (
                                      <Button variant="outline" size="sm" className="w-full">
                                        <Download className="h-4 w-4 mr-1" />
                                        Gerar Ticket
                                      </Button>
                                    )}
                                    {solicitacao.status === "rejeitada" && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full"
                                        onClick={() => atualizarStatusRota(solicitacao.id, "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Aprovar
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de transporte rota encontrada.
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="12x36" className="mt-4">
                    {filtrarSolicitacoes12x36().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Colaborador</TableHead>
                              <TableHead>Telefone</TableHead>
                              <TableHead>Rota</TableHead>
                              <TableHead>Data de Início</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoes12x36().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell className="font-medium">{solicitacao.colaborador_nome}</TableCell>
                                <TableCell>{solicitacao.telefone}</TableCell>
                                <TableCell>{solicitacao.rota}</TableCell>
                                <TableCell>{formatarData(solicitacao.data_inicio)}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatus12x36(solicitacao.id, "aprovada")}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatus12x36(solicitacao.id, "rejeitada")}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de transporte 12x36 encontrada.
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="refeicao" className="mt-4">
                    {filtrarSolicitacoesRefeicao().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Colaboradores</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesRefeicao().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell className="font-medium">{solicitacao.colaboradores.join(", ")}</TableCell>
                                <TableCell>{solicitacao.tipo_refeicao}</TableCell>
                                <TableCell>{formatarData(solicitacao.data_refeicao)}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatusRefeicao(solicitacao.id, "aprovada")}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatusRefeicao(solicitacao.id, "rejeitada")}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de refeição encontrada.
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="abono" className="mt-4">
                    {filtrarSolicitacoesAbonoPonto().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Data de Ocorrência</TableHead>
                              <TableHead>Turno</TableHead>
                              <TableHead>Motivo</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesAbonoPonto().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell>{formatarData(solicitacao.data_ocorrencia)}</TableCell>
                                <TableCell>{solicitacao.turno}</TableCell>
                                <TableCell>{solicitacao.motivo}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_abono_ponto", solicitacao.id, "aprovada", setSolicitacoesAbonoPonto)}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_abono_ponto", solicitacao.id, "rejeitada", setSolicitacoesAbonoPonto)}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de abono de ponto encontrada.
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="adesao" className="mt-4">
                    {filtrarSolicitacoesAdesaoCancelamento().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Tipo de Solicitação</TableHead>
                              <TableHead>Motivo</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesAdesaoCancelamento().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell>{solicitacao.tipo_solicitacao}</TableCell>
                                <TableCell>{solicitacao.motivo}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_adesao_cancelamento", solicitacao.id, "aprovada", setSolicitacoesAdesaoCancelamento)}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_adesao_cancelamento", solicitacao.id, "rejeitada", setSolicitacoesAdesaoCancelamento)}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de adesão/cancelamento encontrada.
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="endereco" className="mt-4">
                    {filtrarSolicitacoesAlteracaoEndereco().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Endereço Atual</TableHead>
                              <TableHead>Endereço Novo</TableHead>
                              <TableHead>Data de Alteração</TableHead>
                              <TableHead>Comprovante</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesAlteracaoEndereco().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell>{solicitacao.endereco_atual}</TableCell>
                                <TableCell>{solicitacao.endereco_novo}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.data_alteracao)}</TableCell>
                                <TableCell>
                                  {solicitacao.comprovante_url && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                                      onClick={() => handleDownloadComprovante(solicitacao.comprovante_url, solicitacao.solicitante?.nome || "Anônimo")}
                                    >
                                      <File className="h-4 w-4 mr-1" />
                                      Baixar Comprovante
                                    </Button>
                                  )}
                                </TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_alteracao_endereco", solicitacao.id, "aprovada", setSolicitacoesAlteracaoEndereco)}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_alteracao_endereco", solicitacao.id, "rejeitada", setSolicitacoesAlteracaoEndereco)}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de alteração de endereço encontrada.
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="turno" className="mt-4">
                    {filtrarSolicitacoesMudancaTurno().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Solicitante</TableHead>
                              <TableHead>Turno Atual</TableHead>
                              <TableHead>Turno Novo</TableHead>
                              <TableHead>Data de Alteração</TableHead>
                              <TableHead>Motivo</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[180px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesMudancaTurno().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell>
                                  <SolicitanteInfo id={solicitacao.solicitante_id} />
                                </TableCell>
                                <TableCell>{solicitacao.turno_atual}</TableCell>
                                <TableCell>{solicitacao.turno_novo}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.data_alteracao)}</TableCell>
                                <TableCell>{solicitacao.motivo}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {solicitacao.status === "pendente" && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_mudanca_turno", solicitacao.id, "aprovada", setSolicitacoesMudancaTurno)}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                          onClick={() => atualizarStatusGenerico("solicitacoes_mudanca_turno", solicitacao.id, "rejeitada", setSolicitacoesMudancaTurno)}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">
                        Nenhuma solicitação de mudança de turno encontrada.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
