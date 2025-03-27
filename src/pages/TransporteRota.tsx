
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { FormLayout } from "@/components/FormLayout";

interface FormValues {
  nome: string;
  matricula: string;
  telefone: string;
  cidade: "Anápolis" | "Goiânia";
  turno: string;
  justificativa: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  ponto_proximo: string;
}

const TransporteRota = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      nome: user?.nome || "",
      matricula: user?.matricula || "",
      telefone: "",
      cidade: "Anápolis",
      turno: "",
      justificativa: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      ponto_proximo: "",
    },
  });
  
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");
  
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno", "Faculdade"]
    : ["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"];
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("solicitacoes_transporte").insert({
        solicitante_id: user.id,
        nome: data.nome,
        matricula: data.matricula,
        telefone: data.telefone,
        cidade: data.cidade,
        turno: data.turno,
        rota: data.turno, // Using turno as rota for database consistency
        justificativa: data.justificativa,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cep: data.cep,
        ponto_proximo: data.ponto_proximo,
        status: "pendente",
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
      setIsLoading(false);
    }
  };
  
  return (
    <FormLayout 
      title="Solicitação de Transporte por Rota"
      description="Preencha o formulário para solicitar transporte fretado"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formulário de Solicitação</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  rules={{ required: "Nome é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">Nome</FormLabel>
                      <FormControl>
                        <Input 
                          disabled 
                          {...field} 
                          className="form-field-input bg-gray-100" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="matricula"
                  rules={{ required: "Matrícula é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">Matrícula</FormLabel>
                      <FormControl>
                        <Input 
                          disabled 
                          {...field} 
                          className="form-field-input bg-gray-100" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="telefone"
                rules={{ 
                  required: "Telefone é obrigatório",
                  pattern: {
                    value: /^\d{10,11}$/,
                    message: "Telefone inválido. Use apenas números (DDD + número)"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-field-label">Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="DDD + número (apenas números)" 
                        {...field} 
                        className="form-field-input" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cidade"
                  rules={{ required: "Cidade é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">Cidade</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("turno", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="form-select-input">
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
                      <FormLabel className="form-field-label">Turno</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="form-select-input">
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {turnoOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endereco"
                  rules={{ required: "Endereço é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">Endereço</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Rua/Avenida" 
                          {...field} 
                          className="form-field-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="numero"
                    rules={{ required: "Número é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-field-label">Número</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nº" 
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
                    name="complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-field-label">Complemento</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Apt 101" 
                            {...field} 
                            className="form-field-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bairro"
                  rules={{ required: "Bairro é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">Bairro</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Bairro" 
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
                      value: /^\d{8}$/,
                      message: "CEP inválido. Use apenas números"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">CEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Apenas números" 
                          {...field} 
                          className="form-field-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="ponto_proximo"
                rules={{ required: "Este campo é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-field-label">
                      Ponto de ônibus mais próximo (se souber)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Próximo ao mercado X ou Esquina da rua Y" 
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
                name="justificativa"
                rules={{ required: "Justificativa é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-field-label">
                      Justificativa para a solicitação
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explique o motivo da sua solicitação" 
                        {...field} 
                        rows={4}
                        className="form-field-input" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Solicitação"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </FormLayout>
  );
};

export default TransporteRota;
