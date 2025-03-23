
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormLayout } from "@/components/FormLayout";

interface FormValues {
  matricula: string;
  colaboradorNome: string;
  telefone: string;
  endereco: string;
  cep: string;
  rota: string;
  dataInicio: Date;
}

const TransporteRota = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isSelecaoUser = user?.tipo_usuario === 'selecao';
  
  const form = useForm<FormValues>({
    defaultValues: {
      matricula: user?.matricula || "",
      colaboradorNome: user?.nome || "",
      telefone: "",
      endereco: "",
      cep: "",
      rota: "",
      dataInicio: new Date(),
    },
  });
  
  // Opções de rota
  const rotaOptions = [
    "Rota 1 - Centro",
    "Rota 2 - Norte",
    "Rota 3 - Sul",
    "Rota 4 - Leste",
    "Rota 5 - Oeste",
  ];
  
  // Função para formatar a data antes de enviar para o banco de dados
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
      // Para usuários do tipo selecao, a requisição já é automaticamente aprovada
      const status = isSelecaoUser ? "aprovado" : "pendente";
      
      const { error } = await supabase.from("solicitacoes_transporte_rota").insert({
        solicitante_id: user.id,
        matricula: data.matricula,
        colaborador_nome: data.colaboradorNome,
        telefone: data.telefone,
        endereco: data.endereco,
        cep: data.cep,
        rota: data.rota,
        data_inicio: formatDate(data.dataInicio),
        status: status
      });
      
      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast.error("Erro ao enviar solicitação");
        return;
      }
      
      if (isSelecaoUser) {
        toast.success("Solicitação aprovada automaticamente! Você já pode baixar o ticket.");
      } else {
        toast.success("Solicitação enviada com sucesso!");
      }
      
      navigate("/minhas-solicitacoes");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormLayout
      title="Solicitação de Transporte - Rota"
      description="Preencha o formulário para solicitar transporte regular de rota"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="matricula"
            rules={{ required: "Matrícula é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Matrícula</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite a matrícula" 
                    {...field} 
                    className="form-field-input"
                    // Para usuários não "selecao", o campo será readOnly
                    readOnly={!isSelecaoUser}
                  />
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
                <FormLabel className="form-field-label">Nome do Colaborador</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o nome completo" 
                    {...field} 
                    className="form-field-input"
                    // Para usuários não "selecao", o campo será readOnly
                    readOnly={!isSelecaoUser}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telefone"
            rules={{ 
              required: "Telefone é obrigatório",
              pattern: {
                value: /^\(\d{2}\) \d{5}-\d{4}$/,
                message: "Telefone deve estar no formato (99) 99999-9999"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(99) 99999-9999" 
                    {...field}
                    className="form-field-input"
                    onChange={(e) => {
                      // Formatar o telefone enquanto o usuário digita
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        if (value.length > 2) {
                          value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                        }
                        if (value.length > 10) {
                          value = `${value.substring(0, 10)}-${value.substring(10)}`;
                        }
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endereco"
            rules={{ required: "Endereço é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Endereço</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite o endereço completo" 
                    {...field} 
                    className="form-field-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cep"
            rules={{ 
              required: "CEP é obrigatório",
              pattern: {
                value: /^\d{5}-\d{3}$/,
                message: "CEP deve estar no formato 99999-999"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">CEP</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="99999-999" 
                    {...field}
                    className="form-field-input"
                    onChange={(e) => {
                      // Formatar o CEP enquanto o usuário digita
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 8) {
                        if (value.length > 5) {
                          value = `${value.substring(0, 5)}-${value.substring(5)}`;
                        }
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
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
                <FormLabel className="form-field-label">Rota</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="form-select-input">
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
            name="dataInicio"
            rules={{ required: "Data de início é obrigatória" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="form-field-label">Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="form-date-input"
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : isSelecaoUser ? "Aprovar Solicitação" : "Enviar Solicitação"}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
};

export default TransporteRota;
