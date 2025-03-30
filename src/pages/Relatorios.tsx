
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import * as XLSX from 'xlsx';

interface FormValues {
  tipoRefeicao: string;
  dataInicio: Date;
  dataFim: Date;
}

const Relatorios = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [relatorioData, setRelatorioData] = useState<any[]>([]);
  const [totais, setTotais] = useState<Record<string, number>>({});

  const form = useForm<FormValues>({
    defaultValues: {
      tipoRefeicao: "Todos",
      dataInicio: new Date(),
      dataFim: addDays(new Date(), 7),
    },
  });

  const tipoRefeicaoOptions = ["Todos", "Almoço", "Jantar", "Lanche", "Ceia"];

  const formatDateForDb = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const formatDateDisplay = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const onSubmit = async (data: FormValues) => {
    if (!user || user.tipo_usuario !== 'admin') {
      toast.error("Acesso não autorizado");
      return;
    }

    setIsLoading(true);
    try {
      let query = supabase
        .from("solicitacoes_refeicao")
        .select("*")
        .eq("status", "aprovada")
        .gte("data_refeicao", formatDateForDb(data.dataInicio))
        .lte("data_refeicao", formatDateForDb(data.dataFim));

      if (data.tipoRefeicao !== "Todos") {
        query = query.eq("tipo_refeicao", data.tipoRefeicao);
      }

      const { data: refeicoes, error } = await query;

      if (error) {
        throw error;
      }

      // Processa os dados para contagem
      const contagem: Record<string, number> = {};
      const detalhesRefeicoes: any[] = [];

      if (refeicoes) {
        refeicoes.forEach(refeicao => {
          const tipo = refeicao.tipo_refeicao;
          const data = format(new Date(refeicao.data_refeicao), "dd/MM/yyyy");
          
          // Incrementa a contagem
          contagem[tipo] = (contagem[tipo] || 0) + (refeicao.colaboradores?.length || 0);

          // Adiciona detalhes para cada colaborador
          if (refeicao.colaboradores && refeicao.colaboradores.length > 0) {
            refeicao.colaboradores.forEach((colaborador: any) => {
              detalhesRefeicoes.push({
                data: data,
                tipoRefeicao: refeicao.tipo_refeicao,
                nome: typeof colaborador === 'string' ? colaborador : colaborador.nome,
                matricula: typeof colaborador === 'string' ? '' : colaborador.matricula,
                id_solicitacao: refeicao.id
              });
            });
          }
        });
      }

      setTotais(contagem);
      setRelatorioData(detalhesRefeicoes);
      
      toast.success("Relatório gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    if (relatorioData.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(relatorioData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório de Refeições");
      
      // Adiciona informações de período
      const periodoInicio = formatDateDisplay(form.getValues().dataInicio);
      const periodoFim = formatDateDisplay(form.getValues().dataFim);
      const fileName = `Relatório_Refeições_${periodoInicio}_a_${periodoFim}.xlsx`;
      
      XLSX.writeFile(workbook, fileName);
      toast.success("Arquivo Excel exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      toast.error("Erro ao exportar para Excel");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Relatórios de Refeição</h1>
      
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
                  name="tipoRefeicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Refeição</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tipoRefeicaoOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                              <CalendarIcon className="h-4 w-4 opacity-50" />
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
                              <CalendarIcon className="h-4 w-4 opacity-50" />
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
                  {relatorioData.length > 0
                    ? `${relatorioData.length} refeições no período selecionado`
                    : "Nenhum dado disponível"}
                </CardDescription>
              </div>
              {relatorioData.length > 0 && (
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
            {Object.keys(totais).length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(totais).map(([tipo, quantidade]) => (
                    <Card key={tipo} className="bg-muted">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">{tipo}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{quantidade}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Data</th>
                        <th className="text-left py-2 px-3">Tipo</th>
                        <th className="text-left py-2 px-3">Nome</th>
                        <th className="text-left py-2 px-3">Matrícula</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorioData.slice(0, 20).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-3">{item.data}</td>
                          <td className="py-2 px-3">{item.tipoRefeicao}</td>
                          <td className="py-2 px-3">{item.nome}</td>
                          <td className="py-2 px-3">{item.matricula}</td>
                        </tr>
                      ))}
                      {relatorioData.length > 20 && (
                        <tr>
                          <td colSpan={4} className="py-2 px-3 text-center text-muted-foreground">
                            ... e mais {relatorioData.length - 20} registros. Exporte para Excel para ver todos os dados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
