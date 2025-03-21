
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
import { Download, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Solicitacao {
  id: number;
  status: string;
  created_at: string;
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

const MinhasSolicitacoes = () => {
  const { user } = useAuth();
  const [solicitacoesRota, setSolicitacoesRota] = useState<SolicitacaoTransporteRota[]>([]);
  const [solicitacoes12x36, setSolicitacoes12x36] = useState<SolicitacaoTransporte12x36[]>([]);
  const [solicitacoesRefeicao, setSolicitacoesRefeicao] = useState<SolicitacaoRefeicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  
  useEffect(() => {
    if (!user) return;
    
    const fetchSolicitacoes = async () => {
      try {
        // Buscar solicitações de transporte rota
        const { data: dataRota, error: errorRota } = await supabase
          .from("solicitacoes_transporte_rota")
          .select("*")
          .eq("solicitante_id", user.id)
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
          .eq("solicitante_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error12x36) {
          console.error("Erro ao buscar solicitações 12x36:", error12x36);
        } else {
          setSolicitacoes12x36(data12x36 || []);
        }
        
        // Buscar solicitações de refeição (se o usuário tiver permissão)
        if (user.tipo_usuario === "admin" || user.tipo_usuario === "refeicao") {
          const { data: dataRefeicao, error: errorRefeicao } = await supabase
            .from("solicitacoes_refeicao")
            .select("*")
            .eq("solicitante_id", user.id)
            .order("created_at", { ascending: false });
            
          if (errorRefeicao) {
            console.error("Erro ao buscar solicitações de refeição:", errorRefeicao);
          } else {
            setSolicitacoesRefeicao(dataRefeicao || []);
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
  
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações</CardTitle>
          <CardDescription>
            Visualize todas as suas solicitações realizadas
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
                  <TabsTrigger value="rota">Transporte Rota</TabsTrigger>
                  <TabsTrigger value="12x36">Transporte 12x36</TabsTrigger>
                  {(user?.tipo_usuario === "admin" || user?.tipo_usuario === "refeicao") && (
                    <TabsTrigger value="refeicao">Refeição</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="rota" className="mt-4">
                  {filtrarSolicitacoesRota().length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Cidade / Turno</TableHead>
                            <TableHead>Rota</TableHead>
                            <TableHead>Período</TableHead>
                            <TableHead>Data de Solicitação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoesRota().map((solicitacao) => (
                            <TableRow key={solicitacao.id}>
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
                                {solicitacao.status === "aprovada" && (
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Download className="h-4 w-4 mr-1" />
                                    Ticket
                                  </Button>
                                )}
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
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Rota</TableHead>
                            <TableHead>Data de Início</TableHead>
                            <TableHead>Data de Solicitação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtrarSolicitacoes12x36().map((solicitacao) => (
                            <TableRow key={solicitacao.id}>
                              <TableCell className="font-medium">{solicitacao.colaborador_nome}</TableCell>
                              <TableCell>{solicitacao.telefone}</TableCell>
                              <TableCell>{solicitacao.rota}</TableCell>
                              <TableCell>{formatarData(solicitacao.data_inicio)}</TableCell>
                              <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                              <TableCell>
                                <StatusBadge status={solicitacao.status} />
                              </TableCell>
                              <TableCell>
                                {solicitacao.status === "aprovada" && (
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Download className="h-4 w-4 mr-1" />
                                    Ticket
                                  </Button>
                                )}
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
                
                {(user?.tipo_usuario === "admin" || user?.tipo_usuario === "refeicao") && (
                  <TabsContent value="refeicao" className="mt-4">
                    {filtrarSolicitacoesRefeicao().length > 0 ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Colaboradores</TableHead>
                              <TableHead>Tipo de Refeição</TableHead>
                              <TableHead>Data da Refeição</TableHead>
                              <TableHead>Data de Solicitação</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtrarSolicitacoesRefeicao().map((solicitacao) => (
                              <TableRow key={solicitacao.id}>
                                <TableCell className="font-medium">
                                  {solicitacao.colaboradores.join(", ")}
                                </TableCell>
                                <TableCell>{solicitacao.tipo_refeicao}</TableCell>
                                <TableCell>{formatarData(solicitacao.data_refeicao)}</TableCell>
                                <TableCell>{formatarTimestamp(solicitacao.created_at)}</TableCell>
                                <TableCell>
                                  <StatusBadge status={solicitacao.status} />
                                </TableCell>
                                <TableCell>
                                  {solicitacao.status === "aprovada" && (
                                    <Button variant="outline" size="sm" className="w-full">
                                      <Download className="h-4 w-4 mr-1" />
                                      Ticket
                                    </Button>
                                  )}
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
                )}
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhasSolicitacoes;
