
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
import { toast } from "sonner";
import { downloadTicket } from "@/services/ticketService";

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
  const [showTicketDownload, setShowTicketDownload] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<number | null>(null);
  
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
  
  useEffect(() => {
    if (user) {
      form.setValue("matricula", user.matricula);
      form.setValue("colaboradorNome", user.nome);
    }
  }, [user, form]);
  
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");
  
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno"]
    : ["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"];
    
  const getRotaOptions = () => {
    if (cidade === "Goiânia") {
      return [turno].filter(Boolean);
    } else if (cidade === "Anápolis") {
      if (turno === "Administrativo") {
        return Array.from({ length: 8 }, (_, i) => `ADM-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "1° Turno") {
        return Array.from({ length: 15 }, (_, i) => `P-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "2° Turno") {
        return Array.from({ length: 12 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "3° Turno") {
        return Array.from({ length: 8 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`);
      }
    }
    return [];
  };
  
  const rotaOptions = getRotaOptions();
  
  useEffect(() => {
    if (cidade === "Goiânia" && turno) {
      form.setValue("rota", turno);
    }
  }, [cidade, turno, form]);
  
  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if the user is of type 'selecao' to set auto-approval
      const initialStatus = user.tipo_usuario === 'selecao' ? 'aprovada' : 'pendente';
      
      const { data: insertData, error } = await supabase.from("solicitacoes_transporte_rota").insert({
        solicitante_id: user.id,
        matricula: data.matricula,
        colaborador_nome: data.colaboradorNome,
        cidade: data.cidade,
        turno: data.turno,
        rota: data.rota,
        periodo_inicio: formatDate(data.periodoInicio),
        periodo_fim: formatDate(data.periodoFim),
        motivo: data.motivo,
        status: initialStatus
      }).select('id');
      
      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast.error("Erro ao enviar solicitação");
        return;
      }
      
      const newRequestId = insertData?.[0]?.id;
      
      // If user is of type 'selecao', show option to download ticket
      if (user.tipo_usuario === 'selecao' && newRequestId) {
        setSubmittedRequestId(newRequestId);
        setShowTicketDownload(true);
        toast.success("Solicitação aprovada automaticamente! Você pode baixar seu ticket agora.");
      } else {
        toast.success("Solicitação enviada com sucesso!");
        navigate("/minhas-solicitacoes");
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownloadTicket = async () => {
    if (submittedRequestId) {
      await downloadTicket({
        id: submittedRequestId,
        tipo: 'rota'
      });
      navigate("/minhas-solicitacoes");
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
          {showTicketDownload ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-green-600">Solicitação Aprovada!</h3>
                <p className="text-gray-600 mt-2">Sua solicitação foi aprovada automaticamente.</p>
              </div>
              <Button 
                className="w-full md:w-auto" 
                onClick={handleDownloadTicket}
              >
                Baixar Ticket
              </Button>
              <Button 
                variant="outline" 
                className="w-full md:w-auto" 
                onClick={() => navigate("/minhas-solicitacoes")}
              >
                Ver Minhas Solicitações
              </Button>
            </div>
          ) : (
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
                          
                          if (cidade === "Goiânia" && value) {
                            form.setValue("rota", value);
                          } else {
                            form.setValue("rota", "");
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
                
                <FormField
                  control={form.control}
                  name="rota"
                  rules={{ required: "Rota é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rota</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!turno || (cidade === "Goiânia")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a rota" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rotaOptions.length > 0 ? (
                            rotaOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="sem-opcoes" disabled>Sem opções disponíveis</SelectItem>
                          )}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransporteRota;
