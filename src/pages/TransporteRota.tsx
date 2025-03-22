
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface FormValues {
  matricula: string;
  colaboradorNome: string;
  cidade: "Anápolis" | "Goiânia";
  turno: string;
  rota: string;
  periodoInicio: Date;
  periodoFim: Date;
  motivo: string;
}

const TransporteRota = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      matricula: user?.matricula || "",
      colaboradorNome: user?.nome || "",
      cidade: "Anápolis",
      turno: "",
      rota: "",
      periodoInicio: new Date(),
      periodoFim: new Date(),
      motivo: "",
    },
  });
  
  // Atualiza os campos de matrícula e nome quando o user é carregado
  useEffect(() => {
    if (user) {
      form.setValue("matricula", user.matricula);
      form.setValue("colaboradorNome", user.nome);
    }
  }, [user, form]);
  
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");
  
  // Opções dinâmicas de turno com base na cidade
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno"]
    : ["Adm Gyn 1", "Adm Gyn 2", "Gyn 1° Turno", "Gyn 2° Turno"];
    
  // Opções dinâmicas de rota com base na cidade e turno
  const getRotaOptions = () => {
    if (!turno) return [];
    
    // Rotas para Goiânia são os próprios turnos
    if (cidade === "Goiânia") {
      return [turno]; // A rota para Goiânia é o próprio turno selecionado
    }
    
    // Rotas para Anápolis
    if (cidade === "Anápolis") {
      if (turno === "1° Turno") {
        return Array.from({ length: 15 }, (_, i) => `P-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "2° Turno") {
        return Array.from({ length: 12 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "3° Turno") {
        return Array.from({ length: 8 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "Administrativo") {
        return Array.from({ length: 8 }, (_, i) => `ADM-${String(i + 1).padStart(2, '0')}`);
      }
    }
    
    return [];
  };
  
  const rotaOptions = getRotaOptions();
  
  // Função para formatar a data antes de enviar para o banco de dados
  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para enviar uma solicitação"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Enviando dados:", {
        solicitante_id: user.id,
        cidade: data.cidade,
        turno: data.turno,
        rota: data.rota,
        periodo_inicio: formatDate(data.periodoInicio),
        periodo_fim: formatDate(data.periodoFim),
        motivo: data.motivo,
        colaborador_nome: data.colaboradorNome,
      });
      
      const { error } = await supabase.from("solicitacoes_transporte_rota").insert({
        solicitante_id: user.id,
        cidade: data.cidade,
        turno: data.turno,
        rota: data.rota,
        periodo_inicio: formatDate(data.periodoInicio),
        periodo_fim: formatDate(data.periodoFim),
        motivo: data.motivo,
        colaborador_nome: data.colaboradorNome,
        // Não estamos enviando o campo matricula, pois ele não existe na tabela
      });
      
      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: `Erro ao enviar solicitação: ${error.message}`
        });
        return;
      }
      
      toast({
        title: "Sucesso",
        description: "Solicitação enviada com sucesso!"
      });
      navigate("/minhas-solicitacoes");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar solicitação"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Solicitação de Transporte - Rota</CardTitle>
          <CardDescription>
            Preencha o formulário para solicitar transporte de rota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="matricula"
                  rules={{ required: "Matrícula é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="colaboradorNome"
                  rules={{ required: "Nome do colaborador é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Colaborador</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cidade"
                  rules={{ required: "Cidade é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Redefina o turno ao mudar a cidade
                          form.setValue("turno", "");
                          form.setValue("rota", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Anápolis">Anápolis</SelectItem>
                          <SelectItem value="Goiânia">Goiânia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="turno"
                  rules={{ required: "Turno é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turno</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Redefina a rota ao mudar o turno
                          form.setValue("rota", "");
                          
                          // Se for Goiânia, seleciona automaticamente a única opção de rota (o próprio turno)
                          if (cidade === "Goiânia" && value) {
                            form.setValue("rota", value);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {turnoOptions.map((option) => (
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
              </div>
              
              <FormField
                control={form.control}
                name="rota"
                rules={{ required: "Rota é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rota</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!turno || (cidade === "Goiânia")} // Desabilita se não tiver turno ou se for Goiânia
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a rota" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rotaOptions.map((option) => (
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="periodoInicio"
                  rules={{ required: "Data de início é obrigatória" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="periodoFim"
                  rules={{ 
                    required: "Data de término é obrigatória",
                    validate: (value) => {
                      const inicio = form.getValues("periodoInicio");
                      return value >= inicio || "Data de término deve ser após a data de início";
                    }
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Término</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione a data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues("periodoInicio")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="motivo"
                rules={{ required: "Motivo é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o motivo da solicitação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransporteRota;
