
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

interface FormValues {
  tipoSolicitacao: "Aderir" | "Cancelar";
  email: string;
  motivo: string;
}

const AdesaoCancelamento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      tipoSolicitacao: "Aderir",
      email: "",
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
      const { error } = await supabase.from('solicitacoes_adesao_cancelamento').insert({
        solicitante_id: user.id,
        tipo_solicitacao: data.tipoSolicitacao,
        email: data.email,
        motivo: data.motivo,
        status: 'pendente'
      });
      
      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast.error("Erro ao enviar solicitação");
        return;
      }
      
      toast.success("Solicitação enviada com sucesso!");
      navigate("/minhas-solicitacoes");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Solicitação de Adesão ou Cancelamento do Transporte Fretado</CardTitle>
          <CardDescription>
            Assim que enviar a solicitação, em até 3 dias úteis, receberá o termo para assinatura on-line para efetivação do serviço no e-mail fornecido na solicitação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input value={user?.matricula || ""} disabled />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input value={user?.nome || ""} disabled />
                  </FormControl>
                </FormItem>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input value={user?.cargo || ""} disabled />
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Input value={user?.setor || ""} disabled />
                  </FormControl>
                </FormItem>
              </div>
              
              <FormField
                control={form.control}
                name="tipoSolicitacao"
                rules={{ required: "Tipo de solicitação é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Solicitação</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de solicitação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aderir">Aderir</SelectItem>
                        <SelectItem value="Cancelar">Cancelar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail para receber o termo</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivo"
                rules={{ required: "Motivo é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o motivo da solicitação"
                        rows={4}
                        {...field} 
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdesaoCancelamento;
