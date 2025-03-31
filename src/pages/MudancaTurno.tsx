
// Import necessary components and hooks
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
  matricula: string;
  nome: string;
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

const MudancaTurno = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Define turno options
  const turnoOptions = ["Primeiro", "Segundo", "Terceiro", "ADM"];
  
  // Define routes per turno
  const rotasPerTurno = {
    "Primeiro": ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-07", "P-08", "P-09", "P-10", "P-11", "P-12", "P-13", "P-14", "P-15"],
    "Segundo": ["S-01", "S-02", "S-03", "S-04", "S-05", "S-06", "S-07", "S-08", "S-09", "S-10", "S-11", "S-12"],
    "Terceiro": ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06", "T-07", "T-08"],
    "ADM": ["ADM-01", "ADM-02", "ADM-03", "ADM-04", "ADM-05", "ADM-06", "ADM-07", "ADM-08"],
  };
  
  const [rotaOptions, setRotaOptions] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      matricula: user?.matricula || "",
      nome: user?.nome || "",
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
  
  const watchNovoTurno = form.watch("novoTurno");
  
  // Update rota options when new turno is selected
  const handleTurnoChange = (turno: string) => {
    form.setValue("novoTurno", turno);
    form.setValue("novaRota", ""); // Reset rota value
    
    // Update available rotas based on selected turno
    if (turno in rotasPerTurno) {
      setRotaOptions(rotasPerTurno[turno as keyof typeof rotasPerTurno]);
    } else {
      setRotaOptions([]);
    }
  };
  
  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      
      form.setValue("endereco", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('solicitacoes_mudanca_turno').insert({
        solicitante_id: user.id,
        matricula: data.matricula, // Added matricula field
        nome: data.nome, // Added nome field
        telefone: data.telefone,
        cep: data.cep,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        turno_atual: data.turnoAtual,
        novo_turno: data.novoTurno,
        turno_novo: data.novoTurno, // Using both field names for compatibility
        nova_rota: data.novaRota,
        nome_gestor: data.nomeGestor,
        motivo: data.motivo,
        data_alteracao: new Date().toISOString(),
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
    <FormLayout
      title="Mudança de Turno"
      description="Preencha o formulário para solicitar a mudança de turno de um colaborador."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="matricula"
              rules={{ required: "Matrícula é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Matrícula</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nome"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Nome</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
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
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="Apenas números" 
                      {...field} 
                      className="form-field-input"
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length === 8) {
                          buscarCep(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => buscarCep(field.value)}
                    disabled={field.value.length !== 8 || isLoadingCep}
                  >
                    {isLoadingCep ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="endereco"
              rules={{ required: "Endereço é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bairro"
              rules={{ required: "Bairro é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
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
                <FormLabel className="form-field-label">Cidade</FormLabel>
                <FormControl>
                  <Input {...field} className="form-field-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="turnoAtual"
              rules={{ required: "Turno atual é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Turno Atual</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="form-select-input">
                        <SelectValue placeholder="Selecione o turno atual" />
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
            
            <FormField
              control={form.control}
              name="novoTurno"
              rules={{ required: "Novo turno é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Novo Turno</FormLabel>
                  <Select 
                    onValueChange={(value) => handleTurnoChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="form-select-input">
                        <SelectValue placeholder="Selecione o novo turno" />
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
          
          <FormField
            control={form.control}
            name="novaRota"
            rules={{ required: "Nova rota é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Nova Rota</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!watchNovoTurno}
                >
                  <FormControl>
                    <SelectTrigger className="form-select-input">
                      <SelectValue placeholder="Selecione a nova rota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rotaOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!watchNovoTurno && (
                  <p className="text-sm text-muted-foreground">
                    Selecione um novo turno primeiro
                  </p>
                )}
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
                <FormLabel className="form-field-label">Nome do Gestor</FormLabel>
                <FormControl>
                  <Input {...field} className="form-field-input" />
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
                <FormLabel className="form-field-label">Motivo da Mudança</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o motivo da mudança de turno"
                    rows={4}
                    {...field} 
                    className="form-field-input"
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
