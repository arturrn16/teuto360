
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  XCircle 
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

const Admin = () => {
  const { user } = useAuth();
  const [solicitacoesRota, setSolicitacoesRota] = useState<SolicitacaoTransporteRota[]>([]);
  const [solicitacoes12x36, setSolicitacoes12x36] = useState<SolicitacaoTransporte12x36[]>([]);
  const [solicitacoesRefeicao, setSolicitacoesRefeicao] = useState<SolicitacaoRefeicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [solicitantesInfo, setSolicitantesInfo] = useState<{[id: number]: {nome: string, setor: string}}>({});
  
  useEffect(() => {
    if (!user || !user.admin) return;
    
    const fetchSolicitacoes = async () => {
      try {
        // Buscar solicitações de transporte rota
        const { data: dataRota, error: errorRota } = await supabase
          .from("solicitacoes_transporte_rota")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (errorRota) {
          console.error("Erro ao buscar solicitações de rota:", errorRota);
        } else {
          setSolicitacoesRota(dataRota || []);
        }
        
        // Buscar solicitações de transporte 12x36
        const { data: data12x36, error: error12x36 } = await supabase
          .from("solicitacoes_transporte_12x36")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error12x36) {
          console.error("Erro ao buscar solicitações 12x36:", error12x36);
        } else {
          setSolicitacoes12x36(data12x36 || []);
        }
        
        // Buscar solicitações de refeição
        const { data: dataRefeicao, error: errorRefeicao } = await supabase
          .from("solicitacoes_refeicao")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (errorRefeicao) {
          console.error("Erro ao buscar solicitações de refeição:", errorRefeicao);
        } else {
          setSolicitacoesRefeicao(dataRefeicao || []);
        }
        
        // Coletar IDs de solicitantes para buscar informações
        const solicitanteIds = new Set<number>();
        
        [...(dataRota || []), ...(data12x36 || []), ...(dataRefeicao || [])]
          .forEach(s => {
            if (s.solicitante_id) solicitanteIds.add(s.solicitante_id);
          });
          
        // Buscar informações dos solicitantes
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
  
  // Função para formatar a data
  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  // Função para formatar o timestamp
  const formatarTimestamp = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  // Função para filtrar solicitações de rota
  const filtrarSolicitacoesRota = () => {
    return solicitacoesRota.filter(s => {
      const matchColaborador = s.colaborador_nome.toLowerCase().includes(filtroColaborador.toLowerCase());
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchColaborador && matchStatus;
    });
  };
  
  // Função para filtrar solicitações 12x36
  const filtrarSolicitacoes12x36 = () => {
    return solicitacoes12x36.filter(s => {
      const matchColaborador = s.colaborador_nome.toLowerCase().includes(filtroColaborador.toLowerCase());
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchColaborador && matchStatus;
    });
  };
  
  // Função para filtrar solicitações de refeição
  const filtrarSolicitacoesRefeicao = () => {
    return solicitacoesRefeicao.filter(s => {
      const matchColaborador = s.colaboradores.some(c => 
        c.toLowerCase().includes(filtroColaborador.toLowerCase())
      );
      const matchStatus = filtroStatus === "todos" || s.status === filtroStatus;
      return matchColaborador && matchStatus;
    });
  };
  
  // Aprovar ou rejeitar solicitação de transporte rota
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
      
      // Atualizar o estado local
      setSolicitacoesRota(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  // Aprovar ou rejeitar solicitação de transporte 12x36
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
      
      // Atualizar o estado local
      setSolicitacoes12x36(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  // Aprovar ou rejeitar solicitação de refeição
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
      
      // Atualizar o estado local
      setSolicitacoesRefeicao(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      toast.success(`Solicitação ${status === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao ${status === 'aprovada' ? 'aprovar' : 'rejeitar'} solicitação`);
    }
  };
  
  // Badge de status com cores diferentes
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
  
  // Exibir informações do solicitante
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
            Gerenciamento de solicitações de transporte e refeição
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
              
              <Tabs defaultValue="rota">
                <TabsList className="grid w-full grid-cols-3">
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
                                      onClick={() => atualizarStatus12x36(solicitacao.id, "aprovada")}
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
                            <TableHead>Tipo de Refeição</TableHead>
                            <TableHead>Data da Refeição</TableHead>
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
                              <TableCell className="font-medium">
                                <div className="max-h-20 overflow-y-auto">
                                  {solicitacao.colaboradores.map((nome, idx) => (
                                    <div key={idx} className="mb-1 last:mb-0">
                                      {nome}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
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
                                  {solicitacao.status === "aprovada" && (
                                    <Button variant="outline" size="sm" className="w-full">
                                      <Download className="h-4 w-4 mr-1" />
                                      Gerar Tickets
                                    </Button>
                                  )}
                                  {solicitacao.status === "rejeitada" && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => atualizarStatusRefeicao(solicitacao.id, "aprovada")}
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
                      Nenhuma solicitação de refeição encontrada.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
