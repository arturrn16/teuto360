import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  supabase, 
  customSupabase, 
  BaseSolicitacao, 
  SolicitacaoAbonoPonto as AbonoPontoType,
  SolicitacaoAdesaoCancelamento as AdesaoCancelamentoType,
  SolicitacaoAlteracaoEndereco as AlteracaoEnderecoType,
  SolicitacaoMudancaTurno as MudancaTurnoType,
  updateCustomTable
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
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminCommentField } from "@/components/admin/AdminCommentField";

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
  updated_at: string;
}

interface SolicitacaoTransporte12x36 extends Solicitacao {
  colaborador_nome: string;
  telefone: string;
  endereco: string;
  cep: string;
  rota: string;
  data_inicio: string;
  updated_at: string;
}

interface SolicitacaoRefeicao extends Solicitacao {
  colaboradores: string[];
  tipo_refeicao: string;
  data_refeicao: string;
  updated_at: string;
}

interface SolicitacaoAbonosPonto extends Solicitacao {
  data_ocorrencia: string;
  turno: string;
  motivo: string;
  updated_at: string;
}

interface SolicitacaoAdesaoCancelamento extends Solicitacao {
  tipo_solicitacao: string;
  motivo: string;
  updated_at: string;
}

interface SolicitacaoAlteracaoEndereco extends Solicitacao {
  endereco_atual: string;
  endereco_novo: string;
  data_alteracao: string;
  comprovante_url?: string;
  updated_at: string;
}

interface SolicitacaoMudancaTurno extends Solicitacao {
  turno_atual: string;
  turno_novo: string;
  data_alteracao: string;
  motivo: string;
  updated_at: string;
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
  const [isOpenMotivo, setIsOpenMotivo] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<{
    id: number;
    tipo: string;
    status: 'aprovada' | 'rejeitada';
  }>({ id: 0, tipo: '', status: 'aprovada' });
  
  useEffect(() => {
    if (!user || !user.admin) return;
    
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
    
    fetchSolicitacoes();
  }, [user]);
  
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

  const abrirDialogMotivo = (id: number, tipo: string, status: 'aprovada' | 'rejeitada') => {
    setSelectedSolicitacao({id, tipo, status});
    setMotivoRejeicao("");
    setIsOpenMotivo(true);
  };

  const handleConfirmarMotivo = async () => {
    const { id, tipo, status } = selectedSolicitacao;
    setIsOpenMotivo(false);
    
    // Requisito mínimo para motivo de rejeição
    if (status === 'rejeitada' && !motivoRejeicao.trim()) {
      toast.error("É necessário informar o motivo da rejeição");
      return;
    }

    switch (tipo) {
      case "rota":
        await atualizarStatusRota(id, status, motivoRejeicao);
        break;
      case "12x36":
        await atualizarStatus12x36(id, status, motivoRejeicao);
        break;
      case "refeicao":
        await atualizarStatusRefeicao(id, status, motivoRejeicao);
        break;
      case "abono":
        await atualizarStatusGenerico('solicitacoes_abono_ponto', id, status, setSolicitacoesAbonoPonto, motivoRejeicao);
        break;
      case "adesao":
        await atualizarStatusGenerico('solicitacoes_adesao_cancelamento', id, status, setSolicitacoesAdesaoCancelamento, motivoRejeicao);
        break;
      case "endereco":
        await atualizarStatusGenerico('solicitacoes_alteracao_endereco', id, status, setSolicitacoesAlteracaoEndereco, motivoRejeicao);
        break;
      case "turno":
        await atualizarStatusGenerico('solicitacoes_mudanca_turno', id, status, setSolicitacoesMudancaTurno, motivoRejeicao);
        break;
    }
  };
  
  const atualizarStatusRota = async (id: number, status: 'aprovada' | 'rejeitada', motivo: string = "") => {
    try {
      const updateData: { status: string; motivo_rejeicao?: string; motivo_comentario?: string } = { status };
      
      if (status === 'rejeitada' && motivo.trim()) {
        updateData.motivo_rejeicao = motivo;
      }
      
      // Adicionar comentário se fornecido, independente do status
      if (motivo.trim()) {
        updateData.motivo_comentario = motivo;
      }
      
      const { error } = await supabase
        .from('solicitacoes_transporte_rota')
        .update(updateData)
        .eq('id', id);
        
      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      setSolicitacoesRota(prev => 
        prev.map(s => s.id === id ? { 
          ...s, 
          status, 
          motivo_rejeicao: status === 'rejeitada' ? motivo : undefined,
          motivo_comentario: motivo || undefined
        } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  const atualizarStatus12x36 = async (id: number, status: 'aprovada' | 'rejeitada', motivo: string = "") => {
    try {
      const updateData: { status: string; motivo_rejeicao?: string; motivo_comentario?: string } = { status };
      
      if (status === 'rejeitada' && motivo.trim()) {
        updateData.motivo_rejeicao = motivo;
      }
      
      // Adicionar comentário se fornecido, independente do status
      if (motivo.trim()) {
        updateData.motivo_comentario = motivo;
      }
      
      const { error } = await supabase
        .from('solicitacoes_transporte_12x36')
        .update(updateData)
        .eq('id', id);
        
      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      setSolicitacoes12x36(prev => 
        prev.map(s => s.id === id ? { 
          ...s, 
          status, 
          motivo_rejeicao: status === 'rejeitada' ? motivo : undefined,
          motivo_comentario: motivo || undefined
        } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  const atualizarStatusRefeicao = async (id: number, status: 'aprovada' | 'rejeitada', motivo: string = "") => {
    try {
      const updateData: { status: string; motivo_rejeicao?: string; motivo_comentario?: string } = { status };
      
      if (status === 'rejeitada' && motivo.trim()) {
        updateData.motivo_rejeicao = motivo;
      }
      
      // Adicionar comentário se fornecido, independente do status
      if (motivo.trim()) {
        updateData.motivo_comentario = motivo;
      }
      
      const { error } = await supabase
        .from('solicitacoes_refeicao')
        .update(updateData)
        .eq('id', id);
        
      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      setSolicitacoesRefeicao(prev => 
        prev.map(s => s.id === id ? { 
          ...s, 
          status, 
          motivo_rejeicao: status === 'rejeitada' ? motivo : undefined,
          motivo_comentario: motivo || undefined
        } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };

  const atualizarStatusGenerico = async (tabela: string, id: number, status: 'aprovada' | 'rejeitada', atualizarEstado: Function, motivo: string = "") => {
    try {
      const updateData: { status: string; motivo_rejeicao?: string; motivo_comentario?: string } = { status };
      
      if (status === 'rejeitada' && motivo.trim()) {
        updateData.motivo_rejeicao = motivo;
      }
      
      // Adicionar comentário se fornecido, independente do status
      if (motivo.trim()) {
        updateData.motivo_comentario = motivo;
      }
      
      // Use updateCustomTable from the client file instead of supabase.from() directly
      const { error } = await updateCustomTable(
        tabela,
        updateData,
        { column: 'id', value: id }
      );
        
      if (error) {
        console.error(`Erro ao atualizar status em ${tabela}:`, error);
        toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
        return;
      }
      
      atualizarEstado((prev: any[]) => 
        prev.map((s: any) => s.id === id ? { 
          ...s, 
          status, 
          motivo_rejeicao: status === 'rejeitada' ? motivo : undefined,
          motivo_comentario: motivo || undefined
        } : s)
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
  
  if (!user?.admin) {
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
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome de colaborador"
                      className="pl-8"
                      value={filtroColaborador}
                      onChange={(e) => setFiltroColaborador(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="aprovada">Aprovadas</SelectItem>
                      <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="rota">
                <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-4">
                  <TabsTrigger value="rota" className="flex items-center gap-1.5">
                    <Route className="h-4 w-4" /> Rotas
                  </TabsTrigger>
                  <TabsTrigger value="12x36" className="flex items-center gap-1.5">
                    <Replace className="h-4 w-4" /> 12x36
                  </TabsTrigger>
                  <TabsTrigger value="refeicao" className="flex items-center gap-1.5">
                    <Utensils className="h-4 w-4" /> Refeição
                  </TabsTrigger>
                  <TabsTrigger value="abono" className="flex items-center gap-1.5">
                    <ClipboardCheck className="h-4 w-4" /> Abono
                  </TabsTrigger>
                  <TabsTrigger value="adesao" className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Adesão
                  </TabsTrigger>
                  <TabsTrigger value="endereco" className="flex items-center gap-1.5">
                    <Home className="h-4 w-4" /> Endereço
                  </TabsTrigger>
                  <TabsTrigger value="turno" className="flex items-center gap-1.5">
                    <Replace className="h-4 w-4" /> Turno
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="rota">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Transporte por Rota</CardTitle>
                      <CardDescription>
                        Solicitações de transporte fretado por rotas específicas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Período</TableHead>
                            <TableHead>Rota</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesRota().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoesRota().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{s.colaborador_nome}</div>
                                  <div className="text-muted-foreground text-xs">{s.cidade}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{formatarData(s.periodo_inicio)} a</div>
                                  <div>{formatarData(s.periodo_fim)}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{s.rota}</div>
                                  <div className="text-muted-foreground text-xs">Turno: {s.turno}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "rota", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "rota", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="12x36">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Transporte 12x36</CardTitle>
                      <CardDescription>
                        Solicitações de transporte para escalas 12x36
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Rota</TableHead>
                            <TableHead>Endereço</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoes12x36().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoes12x36().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{s.colaborador_nome}</div>
                                  <div className="text-muted-foreground text-xs">{s.telefone}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{s.rota}</div>
                                  <div className="text-muted-foreground text-xs">
                                    Início: {formatarData(s.data_inicio)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm truncate max-w-[12rem]">{s.endereco}</div>
                                  <div className="text-muted-foreground text-xs">CEP: {s.cep}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "12x36", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "12x36", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="refeicao">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Refeição</CardTitle>
                      <CardDescription>
                        Solicitações de refeição para colaboradores e eventos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Colaboradores</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesRefeicao().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoesRefeicao().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {s.colaboradores.length} colaboradores
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{s.tipo_refeicao}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{formatarData(s.data_refeicao)}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "refeicao", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "refeicao", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="abono">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Abono de Ponto</CardTitle>
                      <CardDescription>
                        Solicitações para abono de ponto e justificativas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Turno</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesAbonoPonto().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoesAbonoPonto().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div>{formatarData(s.data_ocorrencia)}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{s.turno}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-[10rem] truncate">{s.motivo}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "abono", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "abono", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="adesao">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Adesão/Cancelamento</CardTitle>
                      <CardDescription>
                        Solicitações para aderir ou cancelar serviços de transporte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesAdesaoCancelamento().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoesAdesaoCancelamento().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{s.tipo_solicitacao}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-[15rem] truncate">{s.motivo}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "adesao", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "adesao", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="endereco">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Alteração de Endereço</CardTitle>
                      <CardDescription>
                        Solicitações para alteração de endereço e rota
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Endereço Atual</TableHead>
                            <TableHead>Novo Endereço</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesAlteracaoEndereco().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoesAlteracaoEndereco().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-[10rem] truncate">{s.endereco_atual}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-[10rem] truncate">{s.endereco_novo}</div>
                                  {s.comprovante_url && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="p-0 h-auto text-xs"
                                      onClick={() => handleDownloadComprovante(
                                        s.comprovante_url || "", 
                                        solicitantesInfo[s.solicitante_id]?.nome || "colaborador"
                                      )}
                                    >
                                      <Download className="h-3 w-3 mr-1" /> Comprovante
                                    </Button>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div>{formatarData(s.data_alteracao)}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "endereco", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "endereco", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="turno">
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitações de Mudança de Turno</CardTitle>
                      <CardDescription>
                        Solicitações para mudança de turno de trabalho
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Turno Atual</TableHead>
                            <TableHead>Novo Turno</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesMudancaTurno().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                Nenhuma solicitação encontrada
                              </TableCell>
                            </TableRow>
                          ) : (
                            filtrarSolicitacoesMudancaTurno().map((s) => (
                              <TableRow key={s.id}>
                                <TableCell>
                                  <SolicitanteInfo id={s.solicitante_id} />
                                </TableCell>
                                <TableCell>
                                  <div>{s.turno_atual}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{s.turno_novo}</div>
                                </TableCell>
                                <TableCell>
                                  <div>{formatarData(s.data_alteracao)}</div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell>
                                  {s.status === "pendente" ? (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="default"
                                        onClick={() => abrirDialogMotivo(s.id, "turno", "aprovada")}
                                      >
                                        <CheckCircle className="h-4 w-4" /> 
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-8 gap-1"
                                        variant="destructive"
                                        onClick={() => abrirDialogMotivo(s.id, "turno", "rejeitada")}
                                      >
                                        <XCircle className="h-4 w-4" /> 
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTimestamp(s.updated_at)}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog para motivo de rejeição ou comentário */}
      <Dialog open={isOpenMotivo} onOpenChange={setIsOpenMotivo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSolicitacao.status === 'rejeitada' 
                ? 'Motivo da Rejeição'
                : 'Comentário (Opcional)'}
            </DialogTitle>
            <DialogDescription>
              {selectedSolicitacao.status === 'rejeitada'
                ? 'Informe o motivo pelo qual esta solicitação está sendo rejeitada.'
                : 'Adicione um comentário para essa solicitação (opcional).'}
            </DialogDescription>
          </DialogHeader>
          
          <AdminCommentField
            value={motivoRejeicao}
            onChange={setMotivoRejeicao}
            id="motivo-rejeicao"
            label={selectedSolicitacao.status === 'rejeitada' ? "Motivo da Rejeição" : "Comentário do Administrador (opcional)"}
            placeholder={selectedSolicitacao.status === 'rejeitada' 
              ? "Detalhe o motivo da rejeição desta solicitação" 
              : "Adicione um comentário sobre esta solicitação"
            }
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenMotivo(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarMotivo}
              variant={selectedSolicitacao.status === 'rejeitada' ? 'destructive' : 'default'}
              disabled={selectedSolicitacao.status === 'rejeitada' && !motivoRejeicao.trim()}
            >
              {selectedSolicitacao.status === 'rejeitada' ? 'Rejeitar' : 'Aprovar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
