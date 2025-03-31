
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoRefeicao, Colaborador } from '@/types/solicitacoes';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, DownloadIcon, FileTextIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Funções utilitárias para exportação para Excel
const exportToExcel = (data: any[], fileName: string) => {
  // Cria um array com os cabeçalhos
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Adiciona cabeçalhos
  const headers = ["Nome", "Matrícula", "Setor", "Tipo de Refeição", "Data da Refeição"];
  csvContent += headers.join(",") + "\r\n";
  
  // Adiciona as linhas de dados
  data.forEach(item => {
    const row = [
      `"${item.nome}"`,
      `"${item.matricula}"`,
      `"${item.setor || 'Não informado'}"`,
      `"${item.tipo_refeicao}"`,
      `"${item.data_refeicao}"`
    ];
    csvContent += row.join(",") + "\r\n";
  });
  
  // Cria um link para download e clica nele
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Cores para o gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const RelatorioRefeicao = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoRefeicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Busca todas as solicitações de refeição
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('solicitacoes_refeicao')
          .select('*, usuarios(setor)')
          .order('data_refeicao', { ascending: false });

        if (error) {
          console.error('Erro ao buscar solicitações:', error);
          return;
        }

        // Processa os dados para incluir informações de setor
        const processedData = data.map((item: any) => {
          // Adiciona o setor do solicitante aos colaboradores quando possível
          const colaboradoresComSetor = Array.isArray(item.colaboradores) 
            ? item.colaboradores.map((colaborador: Colaborador) => ({
                ...colaborador,
                setor: colaborador.setor || (item.usuarios?.setor || 'Não informado')
              }))
            : [];

          return {
            id: item.id,
            solicitante_id: item.solicitante_id,
            status: item.status || 'pendente',
            created_at: item.created_at,
            updated_at: item.updated_at || item.created_at,
            tipo_refeicao: item.tipo_refeicao,
            data_refeicao: item.data_refeicao,
            colaboradores: colaboradoresComSetor,
            setor: item.usuarios?.setor || 'Não informado'
          };
        });

        setSolicitacoes(processedData);
      } catch (error) {
        console.error('Erro ao processar solicitações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, []);

  // Filtra as solicitações com base nas datas selecionadas e status
  const solicitacoesFiltradas = useMemo(() => {
    if (!dataInicio || !dataFim) return solicitacoes;

    return solicitacoes.filter(solicitacao => {
      const dataRefeicao = parseISO(solicitacao.data_refeicao);
      const dentroDoIntervalo = isWithinInterval(dataRefeicao, {
        start: startOfDay(dataInicio),
        end: endOfDay(dataFim)
      });

      if (filtroStatus === "todas") {
        return dentroDoIntervalo;
      } else {
        return dentroDoIntervalo && solicitacao.status === filtroStatus;
      }
    });
  }, [solicitacoes, dataInicio, dataFim, filtroStatus]);

  // Cria dados para exportação
  const dadosParaExportar = useMemo(() => {
    const dados: any[] = [];
    
    solicitacoesFiltradas.forEach(solicitacao => {
      solicitacao.colaboradores.forEach(colaborador => {
        dados.push({
          nome: colaborador.nome,
          matricula: colaborador.matricula,
          setor: colaborador.setor || 'Não informado',
          tipo_refeicao: solicitacao.tipo_refeicao,
          data_refeicao: format(new Date(solicitacao.data_refeicao), 'dd/MM/yyyy')
        });
      });
    });
    
    return dados;
  }, [solicitacoesFiltradas]);

  // Calcula o número total de refeições
  const totalRefeicoes = useMemo(() => {
    return solicitacoesFiltradas.reduce((total, solicitacao) => {
      return total + solicitacao.colaboradores.length;
    }, 0);
  }, [solicitacoesFiltradas]);

  // Agrupa por tipo de refeição para o gráfico
  const dadosPorTipoRefeicao = useMemo(() => {
    const tiposRefeicao: Record<string, number> = {};
    
    solicitacoesFiltradas.forEach(solicitacao => {
      const tipo = solicitacao.tipo_refeicao;
      const quantidade = solicitacao.colaboradores.length;
      
      if (tiposRefeicao[tipo]) {
        tiposRefeicao[tipo] += quantidade;
      } else {
        tiposRefeicao[tipo] = quantidade;
      }
    });
    
    return Object.entries(tiposRefeicao).map(([name, value]) => ({ name, value }));
  }, [solicitacoesFiltradas]);

  // Agrupa por setor para o gráfico
  const dadosPorSetor = useMemo(() => {
    const setores: Record<string, number> = {};
    
    solicitacoesFiltradas.forEach(solicitacao => {
      solicitacao.colaboradores.forEach(colaborador => {
        const setor = colaborador.setor || 'Não informado';
        
        if (setores[setor]) {
          setores[setor] += 1;
        } else {
          setores[setor] = 1;
        }
      });
    });
    
    return Object.entries(setores)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Limita a 6 setores para melhor visualização
  }, [solicitacoesFiltradas]);

  // Agrupa por data para o gráfico de barras
  const dadosPorData = useMemo(() => {
    if (!dataInicio || !dataFim) return [];
    
    const dados: Record<string, number> = {};
    
    solicitacoesFiltradas.forEach(solicitacao => {
      const dataFormatada = format(new Date(solicitacao.data_refeicao), 'dd/MM');
      const quantidade = solicitacao.colaboradores.length;
      
      if (dados[dataFormatada]) {
        dados[dataFormatada] += quantidade;
      } else {
        dados[dataFormatada] = quantidade;
      }
    });
    
    return Object.entries(dados)
      .map(([data, quantidade]) => ({ data, quantidade }))
      .sort((a, b) => {
        const [diaA, mesA] = a.data.split('/').map(Number);
        const [diaB, mesB] = b.data.split('/').map(Number);
        if (mesA !== mesB) return mesA - mesB;
        return diaA - diaB;
      })
      .slice(0, 10); // Limita a 10 dias para melhor visualização
  }, [solicitacoesFiltradas, dataInicio, dataFim]);

  const handleExportToExcel = () => {
    const fileName = `relatorio-refeicoes-${format(new Date(), 'dd-MM-yyyy')}`;
    exportToExcel(dadosParaExportar, fileName);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Relatório de Refeições</h1>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Início</label>
              <Popover open={activePopover === 'inicio'} onOpenChange={(open) => setActivePopover(open ? 'inicio' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? (
                      format(dataInicio, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={(date) => {
                      setDataInicio(date);
                      setActivePopover(null);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data Fim</label>
              <Popover open={activePopover === 'fim'} onOpenChange={(open) => setActivePopover(open ? 'fim' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? (
                      format(dataFim, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={(date) => {
                      setDataFim(date);
                      setActivePopover(null);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="self-end">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportToExcel}
              >
                <FileTextIcon size={16} />
                Exportar para Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Refeições</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalRefeicoes}</p>
            <p className="text-sm text-gray-500">No período selecionado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tipos de Refeições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPorTipoRefeicao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosPorTipoRefeicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Setor com Mais Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            {dadosPorSetor.length > 0 ? (
              <>
                <p className="text-xl font-bold">{dadosPorSetor[0].name}</p>
                <p className="text-sm text-gray-500">Com {dadosPorSetor[0].value} refeições</p>
              </>
            ) : (
              <p className="text-gray-500">Sem dados</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Refeições por Setor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosPorSetor}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Refeições por Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosPorData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" name="Refeições" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabela de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Refeições</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Carregando...</p>
          ) : solicitacoesFiltradas.length === 0 ? (
            <p className="text-center py-4">Nenhuma solicitação encontrada no período selecionado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Data</th>
                    <th className="text-left py-2 px-4">Tipo</th>
                    <th className="text-left py-2 px-4">Colaboradores</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesFiltradas.map((solicitacao) => (
                    <tr key={solicitacao.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {format(new Date(solicitacao.data_refeicao), 'dd/MM/yyyy')}
                      </td>
                      <td className="py-2 px-4">{solicitacao.tipo_refeicao}</td>
                      <td className="py-2 px-4">
                        {solicitacao.colaboradores.length} pessoa(s)
                      </td>
                      <td className="py-2 px-4">
                        <span 
                          className={`inline-block px-2 py-1 rounded text-xs font-medium
                            ${solicitacao.status === 'aprovada' ? 'bg-green-100 text-green-800' : 
                              solicitacao.status === 'rejeitada' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}
                        >
                          {solicitacao.status.charAt(0).toUpperCase() + solicitacao.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatorioRefeicao;
