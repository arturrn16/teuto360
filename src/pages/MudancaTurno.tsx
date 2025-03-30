
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormLayout } from "@/components/FormLayout";

interface FormValues {
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  turnoAtual: string;
  novoTurno: string;
  novaRota: string;
  nomeGestor: string;
  motivo: string;
}

const turnoOptions = [
  "1° Turno (06:00 às 14:00)",
  "2° Turno (14:00 às 22:00)",
  "3° Turno (22:00 às 06:00)",
  "Administrativo",
];

const MudancaTurno = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      telefone: "",
      cep: "",
      endereco: "",
      bairro: "",
      cidade: "",
      turnoAtual: "",
      novoTurno: "",
      novaRota: "",
      nomeGestor: "",
      motivo: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const solicitacaoData = {
        solicitante_id: user.id,
        telefone: data.telefone,
        cep: data.cep,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        turno_atual: data.turnoAtual,
        novo_turno: data.novoTurno,
        nova_rota: data.novaRota,
        nome_gestor: data.nomeGestor,
        motivo: data.motivo,
      };
      
      console.log("Enviando solicitação:", solicitacaoData);
      
      const { error } = await supabase
        .from("solicitacoes_mudanca_turno")
        .insert(solicitacaoData);
      
      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast.error(`Erro ao enviar solicitação: ${error.message}`);
        return;
      }
      
      toast.success("Solicitação enviada com sucesso!");
      navigate("/minhas-solicitacoes");
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error(`Erro ao enviar solicitação: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormLayout
      title="Solicitação de Mudança de Turno"
      description="Preencha o formulário para solicitar mudança de turno"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="telefone"
              rules={{ required: "Telefone é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cep"
              rules={{ required: "CEP é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="endereco"
            rules={{ required: "Endereço é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bairro"
              rules={{ required: "Bairro é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cidade"
              rules={{ required: "Cidade é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="turnoAtual"
              rules={{ required: "Turno atual é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turno Atual</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o turno atual" />
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
              name="novoTurno"
              rules={{ required: "Novo turno é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Turno</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o novo turno" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="novaRota"
              rules={{ required: "Nova rota é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Rota</FormLabel>
                  <FormControl>
                    <Input placeholder="Nova rota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nomeGestor"
              rules={{ required: "Nome do gestor é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Gestor</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do gestor" {...field} />
                  </FormControl>
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
                  <Textarea 
                    placeholder="Descreva o motivo da solicitação de mudança de turno" 
                    {...field} 
                    rows={4}
                  />
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
    </FormLayout>
  );
};

export default MudancaTurno;
