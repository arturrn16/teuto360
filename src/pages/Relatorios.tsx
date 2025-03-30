
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Download, PieChart as PieChartIcon, BarChart as BarChartIcon, Clock } from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  ResponsiveContainer
} from "recharts";
import { supabase, queryCustomTable } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define types for the report data
interface ReportFormValues {
  dataInicio: Date;
  dataFim: Date;
}

interface SolicitacaoCount {
  tipo: string;
  count: number;
  percentual: number;
}

interface SetorCount {
  setor: string;
  count: number;
}

interface StatusCount {
  status: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const STATUS_COLORS = {
  'pendente': '#FFBB28',
  'aprovada': '#00C49F',
  'rejeitada': '#FF8042'
};

const Relatorios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoSolicitacaoData, setTipoSolicitacaoData] = useState<SolicitacaoCount[]>([]);
  const [setorData, setSetorData] = useState<SetorCount[]>([]);
  const [statusData, setStatusData] = useState<StatusCount[]>([]);
  const [averageResponseTime, setAverageResponseTime] = useState<number>(0);
  
  const form = useForm<ReportFormValues>({
    defaultValues: {
      dataInicio: subDays(new Date(), 30),
      dataFim: new Date(),
    },
  });

  const formatDateForDb = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const formatDateDisplay = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const onSubmit = async (data: ReportFormValues) => {
    if (!user || user.tipo_usuario !== 'admin') {
      toast.error("Acesso não autorizado");
      return;
    }

    setIsLoading(true);
    try {
      await fetchSolicitacoesPorTipo(data);
      await fetchSolicitacoesPorSetor(data);
      await fetchSolicitacoesPorStatus(data);
      await fetchAverageResponseTime(data);
      
      toast.success("Relatório gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSolicitacoesPorTipo = async (data: ReportFormValues) => {
    const tables = [
      'solicitacoes_abono_ponto',
      'solicitacoes_adesao_cancelamento',
      'solicitacoes_alteracao_endereco',
      'solicitacoes_mudanca_turno',
      'solicitacoes_transporte_rota',
      'solicitacoes_transporte_12x36',
      'solicitacoes_refeicao'
    ];
    
    const countByType: Record<string, number> = {};
    let totalCount = 0;

    for (const table of tables) {
      // Format table name to a friendly type name
      const typeName = table.replace('solicitacoes_', '').replace(/_/g, ' ');
      
      const { data: results } = await queryCustomTable(table, {
        select: 'count(*)',
        order: { column: 'created_at', ascending: false }
      });
      
      const count = parseInt(results?.[0]?.count || '0');
      if (count > 0) {
        countByType[typeName] = count;
        totalCount += count;
      }
    }

    // Calculate percentages and format data for the chart
    const formattedData = Object.entries(countByType).map(([tipo, count]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      count,
      percentual: Math.round((count / totalCount) * 100)
    }));
    
    // Sort by count (descending)
    formattedData.sort((a, b) => b.count - a.count);
    
    setTipoSolicitacaoData(formattedData);
  };

  const fetchSolicitacoesPorSetor = async (data: ReportFormValues) => {
    // We need to join with the usuarios table to get the setor
    // For simplicity, let's use a pseudo approach with data we have
    
    // Fetch users first to get their sectors
    const { data: users } = await supabase
      .from('usuarios')
      .select('id, setor')
      .not('setor', 'is', null);
    
    if (!users || users.length === 0) {
      setSetorData([]);
      return;
    }
    
    const userSectors: Record<number, string> = {};
    users.forEach(user => {
      userSectors[user.id] = user.setor;
    });
    
    // Now count all solicitations per solicitante_id
    const tables = [
      'solicitacoes_abono_ponto',
      'solicitacoes_adesao_cancelamento',
      'solicitacoes_alteracao_endereco',
      'solicitacoes_mudanca_turno',
      'solicitacoes_transporte_rota',
      'solicitacoes_transporte_12x36',
      'solicitacoes_refeicao'
    ];
    
    const countBySetor: Record<string, number> = {};
    
    for (const table of tables) {
      const { data: results } = await queryCustomTable(table, {
        select: 'solicitante_id'
      });
      
      if (results && results.length > 0) {
        results.forEach((result: any) => {
          const setor = userSectors[result.solicitante_id] || 'Não informado';
          countBySetor[setor] = (countBySetor[setor] || 0) + 1;
        });
      }
    }
    
    // Format data for the chart
    const formattedData = Object.entries(countBySetor)
      .map(([setor, count]) => ({ setor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 sectors
    
    setSetorData(formattedData);
  };

  const fetchSolicitacoesPorStatus = async (data: ReportFormValues) => {
    const tables = [
      'solicitacoes_abono_ponto',
      'solicitacoes_adesao_cancelamento',
      'solicitacoes_alteracao_endereco',
      'solicitacoes_mudanca_turno',
      'solicitacoes_transporte_rota',
      'solicitacoes_transporte_12x36',
      'solicitacoes_refeicao'
    ];
    
    const countByStatus: Record<string, number> = {
      'pendente': 0,
      'aprovada': 0,
      'rejeitada': 0
    };
    
    for (const table of tables) {
      // Query each status separately
      for (const status of Object.keys(countByStatus)) {
        const { data: results } = await queryCustomTable(table, {
          select: 'count(*)',
          eq: { column: 'status', value: status }
        });
        
        const count = parseInt(results?.[0]?.count || '0');
        countByStatus[status] += count;
      }
    }
    
    // Format data for the chart
    const formattedData = Object.entries(countByStatus).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count
    }));
    
    setStatusData(formattedData);
  };

  const fetchAverageResponseTime = async (data: ReportFormValues) => {
    const tables = [
      'solicitacoes_abono_ponto',
      'solicitacoes_adesao_cancelamento',
      'solicitacoes_alteracao_endereco',
      'solicitacoes_mudanca_turno',
      'solicitacoes_transporte_rota',
      'solicitacoes_transporte_12x36',
      'solicitacoes_refeicao'
    ];
    
    let totalTimeDiff = 0;
    let totalRespondedRequests = 0;
    
    for (const table of tables) {
      const { data: results } = await queryCustomTable(table, {
        select: 'created_at, updated_at',
        order: { column: 'created_at', ascending: false }
      });
      
      if (results && results.length > 0) {
        results.forEach((result: any) => {
          if (result.created_at && result.updated_at && result.created_at !== result.updated_at) {
            const createdDate = new Date(result.created_at);
            const updatedDate = new Date(result.updated_at);
            const daysDiff = differenceInDays(updatedDate, createdDate);
            
            if (daysDiff >= 0) {
              totalTimeDiff += daysDiff;
              totalRespondedRequests++;
            }
          }
        });
      }
    }
    
    const avgResponseTime = totalRespondedRequests > 0 
      ? totalTimeDiff / totalRespondedRequests 
      : 0;
    
    setAverageResponseTime(Math.round(avgResponseTime * 10) / 10); // Round to 1 decimal place
  };

  const exportToExcel = () => {
    if (tipoSolicitacaoData.length === 0 && statusData.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }

    try {
      // Create workbook and worksheets
      const workbook = XLSX.utils.book_new();
      
      // Add tipos worksheet
      if (tipoSolicitacaoData.length > 0) {
        const tiposWS = XLSX.utils.json_to_sheet(tipoSolicitacaoData);
        XLSX.utils.book_append_sheet(workbook, tiposWS, "Tipos de Solicitação");
      }
      
      // Add setores worksheet
      if (setorData.length > 0) {
        const setoresWS = XLSX.utils.json_to_sheet(setorData);
        XLSX.utils.book_append_sheet(workbook, setoresWS, "Solicitações por Setor");
      }
      
      // Add status worksheet
      if (statusData.length > 0) {
        const statusWS = XLSX.utils.json_to_sheet(statusData);
        XLSX.utils.book_append_sheet(workbook, statusWS, "Status das Solicitações");
      }
      
      // Add SLA info
      const slaData = [{ "Tempo Médio de Resposta (dias)": averageResponseTime }];
      const slaWS = XLSX.utils.json_to_sheet(slaData);
      XLSX.utils.book_append_sheet(workbook, slaWS, "SLA");
      
      // Generate filename with date
      const periodoInicio = formatDateDisplay(form.getValues().dataInicio);
      const periodoFim = formatDateDisplay(form.getValues().dataFim);
      const fileName = `Relatório_Solicitações_${periodoInicio}_a_${periodoFim}.xlsx`;
      
      // Write file and download
      XLSX.writeFile(workbook, fileName);
      toast.success("Arquivo Excel exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      toast.error("Erro ao exportar para Excel");
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios de Solicitações</h1>
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Selecione os parâmetros para gerar o relatório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full flex justify-between"
                            >
                              {field.value ? (
                                formatDateDisplay(field.value)
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <Calendar className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={ptBR}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataFim"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Fim</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full flex justify-between"
                            >
                              {field.value ? (
                                formatDateDisplay(field.value)
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <Calendar className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues().dataInicio}
                            locale={ptBR}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Gerando..." : "Gerar Relatório"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Resultado</CardTitle>
                <CardDescription>
                  Análise das solicitações registradas no período
                </CardDescription>
              </div>
              {(tipoSolicitacaoData.length > 0 || statusData.length > 0) && (
                <Button
                  variant="outline"
                  onClick={exportToExcel}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar Excel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {tipoSolicitacaoData.length > 0 ? (
              <div className="space-y-8">
                {/* SLA Card */}
                <Card className="bg-muted/50">
                  <CardHeader className="py-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5" />
                      Tempo Médio de Resposta (SLA)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-center">
                      {averageResponseTime} {averageResponseTime === 1 ? 'dia' : 'dias'}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {statusData.map((item) => (
                    <Card key={item.status} className="bg-muted/50">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">{item.status}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{item.count}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Solicitations by Type (Pie Chart) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Solicitações por Tipo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tipoSolicitacaoData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="tipo"
                            label={({ tipo, percentual }) => `${tipo}: ${percentual}%`}
                          >
                            {tipoSolicitacaoData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentual}%)`, "Quantidade"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Sectors Chart */}
                {setorData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChartIcon className="h-5 w-5" />
                        Setores com Mais Solicitações 
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={setorData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="setor" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" name="Quantidade" fill="#8884d8">
                              {setorData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>
                  {isLoading
                    ? "Carregando dados..."
                    : "Selecione os filtros e clique em Gerar Relatório para visualizar os dados."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;
