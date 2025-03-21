
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
  cidade: "Anápolis" | "Goiânia";
  turno: string;
  rota: string;
  descricao: string;
}

const AbonoPonto = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      cidade: "Anápolis",
      turno: "",
      rota: "",
      descricao: "",
    },
  });
  
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");
  
  // Opções dinâmicas de turno com base na cidade
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno"]
    : ["Gyn adm 1", "Gyn adm 2", "Gyn 1° Turno", "Gyn 2° Turno"];
    
  // Opções dinâmicas de rota com base na cidade e turno
  const getRotaOptions = () => {
    if (cidade === "Goiânia") {
      return turnoOptions; // Para Goiânia, as rotas são iguais aos turnos
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
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use rpc to execute raw SQL insert since the tables are not in the TypeScript types
      const { error } = await supabase.rpc('insert_solicitacao_abono_ponto', {
        p_solicitante_id: user.id,
        p_cidade: data.cidade,
        p_turno: data.turno,
        p_rota: data.rota, 
        p_descricao: data.descricao,
        p_status: 'pendente'
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
          <CardTitle>Solicitação de Abono de Ponto</CardTitle>
          <CardDescription>
            O abono só será realizado por motivos de problemas/atrasos com o transporte fretado.
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
                      defaultValue={field.value}
                      disabled={!turno} // Desabilita até que o turno seja selecionado
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
              
              <FormField
                control={form.control}
                name="descricao"
                rules={{ required: "Descrição é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descreva o ocorrido</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o problema ou atraso com o transporte fretado"
                        rows={5}
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

export default AbonoPonto;
