
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CidadeSelect } from "./form-fields/CidadeSelect";
import { TurnoSelect } from "./form-fields/TurnoSelect";
import { RotaSelect } from "./form-fields/RotaSelect";
import { DateRangePicker } from "./form-fields/DateRangePicker";

export interface FormValues {
  matricula: string;
  colaboradorNome: string;
  cidade: "Anápolis" | "Goiânia";
  turno: string;
  rota: string;
  periodoInicio: Date;
  periodoFim: Date;
  motivo: string;
}

export const TransporteRotaForm = () => {
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
  
  // Formato da data para envio ao banco de dados
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
          <CidadeSelect form={form} />
          <TurnoSelect form={form} />
        </div>
        
        <RotaSelect form={form} />
        
        <DateRangePicker form={form} />
        
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
  );
};
