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
  File
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageLoader } from "@/components/ui/loader-spinner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SolicitacaoAdesaoCancelamentoView } from "@/components/admin/SolicitacaoAdesaoCancelamentoView";

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
  const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState<number | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  
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
        const { data: dataAbonoPonto, error: errorAbonoPonto } = await queryCustomTable<any>(
          "solicitacoes_abono_ponto",
          {
            order: { column: "created_at", ascending: false }
          }
        );
            
        if (errorAbonoPonto) {
          console.error("Erro ao buscar solicitações de abono de ponto:", errorAbonoPonto);
        } else if (dataAbonoPonto) {
          console.log("Received abono_ponto data:", dataAbonoPonto.length, "records");
          const formattedData: SolicitacaoAbonosPonto[] = dataAbonoPonto.map((item: any) => ({
            id: item.id,
            solicitante_id: item.solicitante_id,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            data_ocorrencia: item.data_ocorrencia || '',
            turno: item.turno || '',
            motivo: item.motivo || ''
          }));
          setSolicitacoesAbonoPonto(formattedData);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de abono de ponto:", err);
      }

      try {
        console.log("Fetching adesao_cancelamento solicitations...");
        const { data: dataAdesaoCancelamento, error: errorAdesaoCancelamento } = await queryCustomTable<any>(
          "solicitacoes_adesao_cancelamento",
          {
            order: { column: "created_at", ascending: false }
          }
        );
            
        if (errorAdesaoCancelamento) {
          console.error("Erro ao buscar solicitações de adesão/cancelamento:", errorAdesaoCancelamento);
        } else if (dataAdesaoCancelamento) {
          console.log("Received adesao_cancelamento data:", dataAdesaoCancelamento.length, "records");
          const formattedData: SolicitacaoAdesaoCancelamento[] = dataAdesaoCancelamento.map((item: any) => ({
            id: item.id,
            solicitante_id: item.solicitante_id,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            tipo_solicitacao: item.tipo_solicitacao || '',
            motivo: item.motivo || ''
          }));
          setSolicitacoesAdesaoCancelamento(formattedData);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de adesão/cancelamento:", err);
      }

      try {
        console.log("Fetching alteracao_endereco solicitations...");
        const { data: dataAlteracaoEndereco, error: errorAlteracaoEndereco } = await queryCustomTable<any>(
          "solicitacoes_alteracao_endereco",
          {
            order: { column: "created_at", ascending: false }
          }
        );
            
        if (errorAlteracaoEndereco) {
          console.error("Erro ao buscar solicitações de alteração de endereço:", errorAlteracaoEndereco);
        } else if (dataAlteracaoEndereco) {
          console.log("Received alteracao_endereco data:", dataAlteracaoEndereco.length, "records");
          const formattedData: SolicitacaoAlteracaoEndereco[] = dataAlteracaoEndereco.map((item: any) => ({
            id: item.id,
            solicitante_id: item.solicitante_id,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            endereco_atual: item.endereco || '',
            endereco_novo: item.nova_rota ? `${item.endereco} (nova rota: ${item.nova_rota})` : (item.endereco || ''),
            data_alteracao: item.data_alteracao || item.created_at,
            comprovante_url: item.comprovante_url
          }));
          setSolicitacoesAlteracaoEndereco(formattedData);
        }
      } catch (err) {
        console.error("Erro ao processar solicitações de alteração de endereço:", err);
      }

      try {
        console.log("Fetching mudanca_turno solicitations...");
        const { data: dataMudancaTurno, error: errorMudancaTurno } = await queryCustomTable<any>(
          "solicitacoes_mudanca_turno",
          {
            order: { column: "created_at", ascending: false }
          }
        );
            
        if (errorMudancaTurno) {
          console.error("Erro ao buscar solicitações de mudança de turno:", errorMudancaTurno);
        } else if (dataMudancaTurno) {
          console.log("Received mudanca_turno data:", dataMudancaTurno.length, "records");
          const formattedData: SolicitacaoMudancaTurno[] = dataMudancaTurno.map((item: any) => ({
            id: item.id,
            solicitante_id: item.solicitante_id,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
            turno_atual: item.turno_atual || '',
            turno_novo: item.novo_turno || '',
            data_alteracao: item.data_alteracao || item.created_at,
            motivo: item.motivo || ''
          }));
          setSolicitacoesMudancaTurno(formattedData);
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
      const { error } = await supabase
        .from('solicitacoes_transporte_rota')
        .update({ status })
        .eq('id', id);
        
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
      const { error } = await supabase
        .from('solicitacoes_transporte_12x36')
        .update({ status })
        .eq('id', id);
        
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
      const { error } = await supabase
        .from('solicitacoes_refeicao')
        .update({ status })
        .eq('id', id);
        
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
  
  const handleViewDetails = (id: number) => {
    setSelectedSolicitacaoId(id);
    setIsViewingDetails(true);
  };
  
  const handleBackToList = () => {
    setSelectedSolicitacaoId(null);
    setIsViewingDetails(false);
  };
  
  const handleSolicitacaoStatusChange = () => {
    fetchSolicitacoes();
    setIsViewingDetails(false);
    setSelectedSolicitacaoId(null);
  };
  
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
              {isViewingDetails && selectedSolicitacaoId ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleBackToList} 
                    className="mb-4"
                  >
                    Voltar para a lista
                  </Button>
                  
                  {selectedSolicitacaoId && 
                   solicitacoesAdesaoCancelamento.find(s => s.id === selectedSolicitacaoId) && (
                    <SolicitacaoAdesaoCancelamentoView 
                      solicitacao={solicitacoesAdesaoCancelamento.find(s => s.id === selectedSolicitacaoId) as AdesaoCancelamentoType} 
                      onStatusChange={handleSolicitacaoStatusChange}
                    />
                  )}
                </>
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
                  
                  <Tabs defaultValue="rota">
                    <TabsList className="grid w-full grid-cols-7">
                      <TabsTrigger value="rota" className="flex items-center gap-1">
                        <Route className="h-4 w-4" />
                        Transporte Rota
                      </TabsTrigger>
                      <TabsTrigger value="12x36" className="flex items-center gap-1">
                        <Map className="h-4 w-4" />
                        Transporte 12x36
                      </TabsTrigger>
                      <TabsTrigger value="refeicao" className="flex items-center gap-1">
                        <Utensils className="h-4 w-4" />
                        Refeição
                      </TabsTrigger>
                      <TabsTrigger value="abono" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Abono Ponto
                      </TabsTrigger>
                      <TabsTrigger value="adesao" className="flex items-center gap-1">
                        <ClipboardCheck className="h-4 w-4" />
                        Adesão/Cancelamento
                      </TabsTrigger>
                      <TabsTrigger value="endereco" className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        Alteração Endereço
                      </TabsTrigger>
                      <TabsTrigger value="turno" className="flex items-center gap-1">
                        <Replace className="h-4 w-4" />
                        Mudança Turno
                      </TabsTrigger>
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
                    
                    <TabsContent value="adesao" className="mt-4">
                      {filtrarSolicitacoesAdesaoCancelamento().length > 0 ? (
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Solicitante</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Transporte</TableHead>
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
                                  <TableCell>{solicitacao.tipo_transporte || "N/A"}</TableCell>
                                  <TableCell className="max-w-[200px] truncate">{solicitacao.motivo}</TableCell>
                                  <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                  <TableCell>
                                    <StatusBadge status={solicitacao.status} />
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="w-full"
                                      onClick={() => handleViewDetails(solicitacao.id)}
                                    >
                                      Ver Detalhes
                                    </Button>
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
                  </Tabs>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
