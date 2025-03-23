import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase, queryCustomTable } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Custom colors for the charts
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", 
  "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"
];

const Relatorios = () => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  // Fetch all solicitations data
  const { data: allSolicitations, isLoading, error } = useQuery({
    queryKey: ["all-solicitations"],
    queryFn: async () => {
      const tables = [
        "solicitacoes_transporte_rota",
        "solicitacoes_transporte_12x36",
        "solicitacoes_refeicao",
        "solicitacoes_adesao_cancelamento",
        "solicitacoes_alteracao_endereco",
        "solicitacoes_mudanca_turno",
        "solicitacoes_abono_ponto"
      ];

      const results = await Promise.all(
        tables.map(async (table) => {
          const { data, error } = await queryCustomTable(table);

          if (error) {
            console.error(`Error fetching from ${table}:`, error);
            return [];
          }

          return data.map(item => ({
            ...item,
            tabela: table // Add table name for categorization
          }));
        })
      );

      return results.flat();
    }
  });

  // Fetch users data to get sectors
  const { data: usersData } = useQuery({
    queryKey: ["users-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id, setor");

      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }

      return data;
    }
  });

  // Process data for charts
  const getRequestsByType = () => {
    if (!allSolicitations) return [];

    const counts: Record<string, number> = {};
    
    allSolicitations.forEach((item: any) => {
      const type = mapTableNameToReadableName(item.tabela);
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getRequestsBySector = () => {
    if (!allSolicitations || !usersData) return [];

    const userSectors: Record<number, string> = {};
    usersData.forEach((user: any) => {
      userSectors[user.id] = user.setor;
    });

    const sectorCounts: Record<string, number> = {};
    
    allSolicitations.forEach((item: any) => {
      const sector = userSectors[item.solicitante_id] || "Desconhecido";
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    return Object.entries(sectorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getRequestsByStatus = () => {
    if (!allSolicitations) return [];

    const statusCounts: Record<string, number> = {};
    
    allSolicitations.forEach((item: any) => {
      const status = mapStatusToReadable(item.status);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const getRequestsByMonth = () => {
    if (!allSolicitations) return [];

    // Filter items for selected year
    const filteredItems = allSolicitations.filter((item: any) => {
      const date = new Date(item.created_at);
      return date.getFullYear().toString() === year;
    });

    // Initialize counts for all months
    const monthCounts: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
      const monthName = format(new Date(parseInt(year), i, 1), 'MMM', { locale: ptBR });
      monthCounts[monthName] = 0;
    }
    
    // Count requests by month
    filteredItems.forEach((item: any) => {
      const date = new Date(item.created_at);
      const monthName = format(date, 'MMM', { locale: ptBR });
      monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
    });

    return Object.entries(monthCounts).map(([name, value]) => ({ name, value }));
  };

  const getAverageRequestsPerMonth = () => {
    if (!allSolicitations) return 0;

    const filteredItems = allSolicitations.filter((item: any) => {
      const date = new Date(item.created_at);
      return date.getFullYear().toString() === year;
    });

    // Get months with at least one request
    const monthsWithRequests = new Set();
    filteredItems.forEach((item: any) => {
      const date = new Date(item.created_at);
      monthsWithRequests.add(date.getMonth());
    });

    const totalMonths = monthsWithRequests.size || 1; // Avoid division by zero
    return Math.round((filteredItems.length / totalMonths) * 100) / 100;
  };

  const mapTableNameToReadableName = (tableName: string) => {
    const mapping: Record<string, string> = {
      "solicitacoes_transporte_rota": "Transporte Rota",
      "solicitacoes_transporte_12x36": "Transporte 12x36",
      "solicitacoes_refeicao": "Refeição",
      "solicitacoes_adesao_cancelamento": "Adesão/Cancelamento",
      "solicitacoes_alteracao_endereco": "Alteração de Endereço",
      "solicitacoes_mudanca_turno": "Mudança de Turno",
      "solicitacoes_abono_ponto": "Abono de Ponto"
    };
    return mapping[tableName] || tableName;
  };

  const mapStatusToReadable = (status: string) => {
    const mapping: Record<string, string> = {
      "pendente": "Pendente",
      "aprovado": "Aprovado",
      "rejeitado": "Rejeitado"
    };
    return mapping[status] || status;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
          Erro ao carregar os dados. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Ano:</span>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {yearsArray.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="monthly">Análise Mensal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações por Tipo</CardTitle>
                <CardDescription>Distribuição de solicitações por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRequestsByType()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {getRequestsByType().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} solicitações`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solicitações por Setor</CardTitle>
                <CardDescription>Número de solicitações por setor da empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getRequestsBySector()}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => [`${value} solicitações`, 'Quantidade']} />
                      <Bar dataKey="value" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Solicitações</CardTitle>
                <CardDescription>Distribuição por status (aprovadas, pendentes, rejeitadas)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRequestsByStatus()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {getRequestsByStatus().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.name === "Aprovado" ? "#4ade80" : 
                              entry.name === "Rejeitado" ? "#f87171" : 
                              entry.name === "Pendente" ? "#facc15" : 
                              COLORS[index % COLORS.length]
                            } 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} solicitações`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
                <CardDescription>Resumo de indicadores importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400">Total de solicitações</div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{allSolicitations.length}</div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">Média mensal ({year})</div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">{getAverageRequestsPerMonth()}</div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Tipos de solicitações</div>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{getRequestsByType().length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações por Mês em {year}</CardTitle>
              <CardDescription>Evolução mensal do número de solicitações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getRequestsByMonth()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} solicitações`, 'Quantidade']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Solicitações"
                      stroke="#0088FE" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Aprovação Mensal</CardTitle>
                <CardDescription>Percentual de solicitações aprovadas por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  Funcionalidade em desenvolvimento
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Processamento</CardTitle>
                <CardDescription>Média de dias para processar solicitações</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  Funcionalidade em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
