
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  SolicitacaoAdesaoCancelamento,
  SolicitacaoAlteracaoEndereco,
  SolicitacaoMudancaTurno,
  SolicitacaoRefeicao,
  SolicitacaoTransporteRota,
  SolicitacaoTransporte12x36,
  SolicitacaoAbonoPonto,
} from '@/types/solicitacoes';
import { PageLoader } from '@/components/ui/loader-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const Admin = () => {
  const [solicitacoesEndereco, setSolicitacoesEndereco] = useState<SolicitacaoAlteracaoEndereco[]>([]);
  const [solicitacoesTurno, setSolicitacoesTurno] = useState<SolicitacaoMudancaTurno[]>([]);
  const [solicitacoesAdesao, setSolicitacoesAdesao] = useState<SolicitacaoAdesaoCancelamento[]>([]);
  const [solicitacoesRefeicao, setSolicitacoesRefeicao] = useState<SolicitacaoRefeicao[]>([]);
  const [solicitacoesTransporte, setSolicitacoesTransporte] = useState<SolicitacaoTransporteRota[]>([]);
  const [solicitacoesTransporte12x36, setSolicitacoesTransporte12x36] = useState<SolicitacaoTransporte12x36[]>([]);
  const [solicitacoesAbono, setSolicitacoesAbono] = useState<SolicitacaoAbonoPonto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("endereco");

  const fetchSolicitacoes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch solicitações de alteração de endereço
      const { data: enderecoData, error: enderecoError } = await supabase
        .from('solicitacoes_alteracao_endereco')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (enderecoError) throw enderecoError;
      setSolicitacoesEndereco(enderecoData as SolicitacaoAlteracaoEndereco[] || []);
      
      // Fetch solicitações de mudança de turno
      const { data: turnoData, error: turnoError } = await supabase
        .from('solicitacoes_mudanca_turno')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (turnoError) throw turnoError;
      setSolicitacoesTurno(turnoData as SolicitacaoMudancaTurno[] || []);
      
      // Fetch solicitações de adesão/cancelamento
      const { data: adesaoData, error: adesaoError } = await supabase
        .from('solicitacoes_adesao_cancelamento')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (adesaoError) throw adesaoError;
      setSolicitacoesAdesao(adesaoData as SolicitacaoAdesaoCancelamento[] || []);

      // Fetch solicitações de refeição
      const { data: refeicaoData, error: refeicaoError } = await supabase
        .from('solicitacoes_refeicao')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (refeicaoError) throw refeicaoError;
      
      // Ensure that colaboradores is treated as an array before setting state
      const formattedRefeicaoData = refeicaoData?.map(item => ({
        ...item,
        colaboradores: Array.isArray(item.colaboradores) ? item.colaboradores : []
      }));
      
      setSolicitacoesRefeicao(formattedRefeicaoData as SolicitacaoRefeicao[] || []);
      
      // Fetch solicitações de transporte
      const { data: transporteData, error: transporteError } = await supabase
        .from('solicitacoes_transporte_rota')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (transporteError) throw transporteError;
      setSolicitacoesTransporte(transporteData as SolicitacaoTransporteRota[] || []);
      
      // Fetch solicitações de transporte 12x36
      const { data: transporte12x36Data, error: transporte12x36Error } = await supabase
        .from('solicitacoes_transporte_12x36')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (transporte12x36Error) throw transporte12x36Error;
      setSolicitacoesTransporte12x36(transporte12x36Data as SolicitacaoTransporte12x36[] || []);

      // Fetch solicitações de abono de ponto
      const { data: abonoData, error: abonoError } = await supabase
        .from('solicitacoes_abono_ponto')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (abonoError) throw abonoError;
      setSolicitacoesAbono(abonoData as SolicitacaoAbonoPonto[] || []);
      
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  // Format date function with fallback for invalid dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data não disponível";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status.toLowerCase()) {
      case 'aprovado':
      case 'aprovada':
        variant = "default"; // green
        break;
      case 'pendente':
        variant = "secondary"; // yellow/orange
        break;
      case 'rejeitado':
      case 'rejeitada':
        variant = "destructive"; // red
        break;
      default:
        variant = "outline";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid grid-cols-7">
          <TabsTrigger value="endereco">Alteração de Endereço</TabsTrigger>
          <TabsTrigger value="turno">Mudança de Turno</TabsTrigger>
          <TabsTrigger value="adesao">Adesão/Cancelamento</TabsTrigger>
          <TabsTrigger value="refeicao">Refeição</TabsTrigger>
          <TabsTrigger value="transporte">Transporte</TabsTrigger>
          <TabsTrigger value="transporte12x36">Transporte 12x36</TabsTrigger>
          <TabsTrigger value="abono">Abono de Ponto</TabsTrigger>
        </TabsList>

        {/* Solicitações de Alteração de Endereço */}
        <TabsContent value="endereco">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Alteração de Endereço</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesEndereco.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesEndereco.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesEndereco.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.endereco}</TableCell>
                        <TableCell>{solicitacao.cidade}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>{formatDate(solicitacao.created_at)}</TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de Alteração de Endereço
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Endereço Atual:</p>
                                    <p className="text-sm">{solicitacao.endereco_atual || solicitacao.endereco}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Endereço Novo:</p>
                                    <p className="text-sm">{solicitacao.endereco_novo || "Não informado"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Cidade:</p>
                                    <p className="text-sm">{solicitacao.cidade}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Bairro:</p>
                                    <p className="text-sm">{solicitacao.bairro}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">CEP:</p>
                                    <p className="text-sm">{solicitacao.cep}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Telefone:</p>
                                    <p className="text-sm">{solicitacao.telefone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Rota Atual:</p>
                                    <p className="text-sm">{solicitacao.rota_atual}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Nova Rota:</p>
                                    <p className="text-sm">{solicitacao.nova_rota || "Não informado"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Alterar Rota:</p>
                                    <p className="text-sm">{solicitacao.alterar_rota ? "Sim" : "Não"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Turno:</p>
                                    <p className="text-sm">{solicitacao.turno || "Não informado"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Data da Alteração:</p>
                                    <p className="text-sm">{formatDate(solicitacao.data_alteracao)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>
                                {solicitacao.comprovante_url && (
                                  <div>
                                    <p className="text-sm font-medium">Comprovante:</p>
                                    <a 
                                      href={solicitacao.comprovante_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      Ver comprovante
                                    </a>
                                  </div>
                                )}
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de alteração de endereço encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Mudança de Turno */}
        <TabsContent value="turno">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Mudança de Turno</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesTurno.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesTurno.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Turno Atual</TableHead>
                      <TableHead>Novo Turno</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesTurno.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.turno_atual}</TableCell>
                        <TableCell>{solicitacao.novo_turno}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>{formatDate(solicitacao.created_at)}</TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de Mudança de Turno
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Turno Atual:</p>
                                    <p className="text-sm">{solicitacao.turno_atual}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Novo Turno:</p>
                                    <p className="text-sm">{solicitacao.novo_turno}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Nova Rota:</p>
                                    <p className="text-sm">{solicitacao.nova_rota}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Nome do Gestor:</p>
                                    <p className="text-sm">{solicitacao.nome_gestor}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Motivo:</p>
                                    <p className="text-sm">{solicitacao.motivo}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Telefone:</p>
                                    <p className="text-sm">{solicitacao.telefone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Data da Alteração:</p>
                                    <p className="text-sm">{formatDate(solicitacao.data_alteracao)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de mudança de turno encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Adesão/Cancelamento */}
        <TabsContent value="adesao">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Adesão/Cancelamento</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesAdesao.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesAdesao.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tipo Transporte</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesAdesao.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.tipo_solicitacao}</TableCell>
                        <TableCell>{solicitacao.tipo_transporte}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>{formatDate(solicitacao.created_at)}</TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de {solicitacao.tipo_solicitacao} de Transporte
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Tipo de Solicitação:</p>
                                    <p className="text-sm">{solicitacao.tipo_solicitacao}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Tipo de Transporte:</p>
                                    <p className="text-sm">{solicitacao.tipo_transporte}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Motivo:</p>
                                    <p className="text-sm">{solicitacao.motivo}</p>
                                  </div>
                                  {solicitacao.motivo_rejeicao && (
                                    <div>
                                      <p className="text-sm font-medium">Motivo de Rejeição:</p>
                                      <p className="text-sm">{solicitacao.motivo_rejeicao}</p>
                                    </div>
                                  )}
                                  {solicitacao.cep && (
                                    <div>
                                      <p className="text-sm font-medium">CEP:</p>
                                      <p className="text-sm">{solicitacao.cep}</p>
                                    </div>
                                  )}
                                  {solicitacao.rua && (
                                    <div>
                                      <p className="text-sm font-medium">Rua:</p>
                                      <p className="text-sm">{solicitacao.rua}</p>
                                    </div>
                                  )}
                                  {solicitacao.bairro && (
                                    <div>
                                      <p className="text-sm font-medium">Bairro:</p>
                                      <p className="text-sm">{solicitacao.bairro}</p>
                                    </div>
                                  )}
                                  {solicitacao.cidade && (
                                    <div>
                                      <p className="text-sm font-medium">Cidade:</p>
                                      <p className="text-sm">{solicitacao.cidade}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>
                                {(solicitacao.assinatura_url || solicitacao.declaracao_url) && (
                                  <div className="flex gap-4 mt-4">
                                    {solicitacao.assinatura_url && (
                                      <a 
                                        href={solicitacao.assinatura_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        Ver assinatura
                                      </a>
                                    )}
                                    {solicitacao.declaracao_url && (
                                      <a 
                                        href={solicitacao.declaracao_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        Ver declaração
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de adesão/cancelamento encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Refeição */}
        <TabsContent value="refeicao">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Refeição</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesRefeicao.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesRefeicao.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nº Colaboradores</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesRefeicao.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.tipo_refeicao}</TableCell>
                        <TableCell>{formatDate(solicitacao.data_refeicao)}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>{solicitacao.colaboradores?.length || 0}</TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de Refeição
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Tipo de Refeição:</p>
                                    <p className="text-sm">{solicitacao.tipo_refeicao}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Data da Refeição:</p>
                                    <p className="text-sm">{formatDate(solicitacao.data_refeicao)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm font-medium mb-2">Colaboradores ({solicitacao.colaboradores?.length || 0}):</p>
                                  {solicitacao.colaboradores && solicitacao.colaboradores.length > 0 ? (
                                    <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                                      {solicitacao.colaboradores.map((colaborador, index) => (
                                        <div key={index} className="py-1 border-b last:border-0">
                                          {typeof colaborador === 'string' ? 
                                            colaborador : 
                                            (colaborador.nome || JSON.stringify(colaborador))}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm">Nenhum colaborador listado</p>
                                  )}
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de refeição encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Transporte */}
        <TabsContent value="transporte">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Transporte (Rota)</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesTransporte.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesTransporte.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Rota</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesTransporte.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.colaborador_nome}</TableCell>
                        <TableCell>{solicitacao.rota}</TableCell>
                        <TableCell>{solicitacao.turno}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de Transporte
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Colaborador:</p>
                                    <p className="text-sm">{solicitacao.colaborador_nome}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Matrícula:</p>
                                    <p className="text-sm">{solicitacao.matricula || "Não informado"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Rota:</p>
                                    <p className="text-sm">{solicitacao.rota}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Turno:</p>
                                    <p className="text-sm">{solicitacao.turno}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Cidade:</p>
                                    <p className="text-sm">{solicitacao.cidade}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Período Início:</p>
                                    <p className="text-sm">{formatDate(solicitacao.periodo_inicio)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Período Fim:</p>
                                    <p className="text-sm">{formatDate(solicitacao.periodo_fim)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Motivo:</p>
                                    <p className="text-sm">{solicitacao.motivo}</p>
                                  </div>
                                  {solicitacao.motivo_comentario && (
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium">Comentário:</p>
                                      <p className="text-sm">{solicitacao.motivo_comentario}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de transporte encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Transporte 12x36 */}
        <TabsContent value="transporte12x36">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Transporte 12x36</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesTransporte12x36.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesTransporte12x36.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Rota</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesTransporte12x36.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{solicitacao.colaborador_nome}</TableCell>
                        <TableCell>{solicitacao.rota}</TableCell>
                        <TableCell>{formatDate(solicitacao.data_inicio)}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de Transporte 12x36
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Colaborador:</p>
                                    <p className="text-sm">{solicitacao.colaborador_nome}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Telefone:</p>
                                    <p className="text-sm">{solicitacao.telefone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Endereço:</p>
                                    <p className="text-sm">{solicitacao.endereco}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">CEP:</p>
                                    <p className="text-sm">{solicitacao.cep}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Rota:</p>
                                    <p className="text-sm">{solicitacao.rota}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Data de Início:</p>
                                    <p className="text-sm">{formatDate(solicitacao.data_inicio)}</p>
                                  </div>
                                  {solicitacao.motivo_comentario && (
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium">Comentário:</p>
                                      <p className="text-sm">{solicitacao.motivo_comentario}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de transporte 12x36 encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solicitações de Abono de Ponto */}
        <TabsContent value="abono">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Abono de Ponto</CardTitle>
              <CardDescription>
                Total de solicitações: {solicitacoesAbono.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitacoesAbono.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data de Ocorrência</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesAbono.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.id}</TableCell>
                        <TableCell>{formatDate(solicitacao.data_ocorrencia)}</TableCell>
                        <TableCell>{solicitacao.cidade}</TableCell>
                        <TableCell>{solicitacao.turno}</TableCell>
                        <TableCell>
                          <StatusBadge status={solicitacao.status} />
                        </TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes da Solicitação #{solicitacao.id}</SheetTitle>
                                <SheetDescription>
                                  Solicitação de Abono de Ponto
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Data de Ocorrência:</p>
                                    <p className="text-sm">{formatDate(solicitacao.data_ocorrencia)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Cidade:</p>
                                    <p className="text-sm">{solicitacao.cidade}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Turno:</p>
                                    <p className="text-sm">{solicitacao.turno}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Rota:</p>
                                    <p className="text-sm">{solicitacao.rota}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Motivo:</p>
                                    <p className="text-sm">{solicitacao.motivo}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status:</p>
                                    <StatusBadge status={solicitacao.status} />
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Descrição:</p>
                                  <p className="text-sm">{solicitacao.descricao}</p>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhuma solicitação de abono de ponto encontrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
