
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormLayout } from "@/components/FormLayout";
import { Colaborador } from "@/types/solicitacoes";
import { Json } from "@/integrations/supabase/types";

interface FormValues {
  colaboradores: Colaborador[];
  tipoRefeicao: "Almoço" | "Jantar" | "Lanche" | "Ceia";
  dataRefeicao: Date;
}

const Refeicao = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      colaboradores: [{ nome: "", matricula: "" }],
      tipoRefeicao: "Almoço",
      dataRefeicao: new Date(),
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colaboradores",
  });
  
  const tipoRefeicaoOptions = ["Almoço", "Jantar", "Lanche", "Ceia"];
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    if (data.colaboradores.some(col => !col.nome.trim() || !col.matricula.trim())) {
      toast.error("Preencha o nome e a matrícula de todos os colaboradores");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedDate = formatDate(data.dataRefeicao);
      
      // Make sure every property is of the correct type
      const colaboradoresForDb = data.colaboradores.map(col => ({
        nome: String(col.nome || ""),
        matricula: String(col.matricula || ""),
        setor: String(col.setor || "")
      }));
      
      const { error } = await supabase.from("solicitacoes_refeicao").insert({
        solicitante_id: user.id,
        solicitante_nome: user.nome || "",
        solicitante_setor: user.setor || "",
        colaboradores: colaboradoresForDb as unknown as Json[],
        tipo_refeicao: data.tipoRefeicao,
        data_refeicao: formattedDate,
        status: "pendente"
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
    <FormLayout
      title="Solicitação de Refeição"
      description="Preencha o formulário para solicitar refeições para colaboradores"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="form-field-label">Colaboradores</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ nome: "", matricula: "" })}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name={`colaboradores.${index}.nome`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Nome do colaborador" 
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
                  name={`colaboradores.${index}.matricula`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Matrícula do colaborador" 
                          {...field} 
                          className="form-field-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tipoRefeicao"
              rules={{ required: "Tipo de refeição é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Tipo de Refeição</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="form-select-input">
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
              name="dataRefeicao"
              rules={{ required: "Data da refeição é obrigatória" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="form-field-label">Data da Refeição</FormLabel>
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
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
};

export default Refeicao;
