
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase, queryCustomTable } from "@/integrations/supabase/client";
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
import { FormLayout } from "@/components/FormLayout";
import { useIsMobile } from "@/hooks/use-mobile";

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

const MudancaTurno = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const isMobile = useIsMobile();
  
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
  
  const turnoAtual = form.watch("turnoAtual");
  const novoTurno = form.watch("novoTurno");
  
  const turnoOptions = [
    "Administrativo", 
    "1° Turno", 
    "2° Turno", 
    "3° Turno", 
    "Gyn Adm 1", 
    "Gyn Adm 2", 
    "Gyn 1° Turno", 
    "Gyn 2° Turno"
  ];
  
  const getRotaOptions = () => {
    if (["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"].includes(novoTurno)) {
      return [novoTurno];
    } else if (novoTurno === "Administrativo") {
      return Array.from({ length: 8 }, (_, i) => `ADM-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "1° Turno") {
      return Array.from({ length: 15 }, (_, i) => `P-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "2° Turno") {
      return Array.from({ length: 12 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "3° Turno") {
      return Array.from({ length: 8 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`);
    }
    return [];
  };
  
  const rotaOptions = getRotaOptions();
  
  useEffect(() => {
    if (["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"].includes(novoTurno)) {
      form.setValue("novaRota", novoTurno);
    }
  }, [novoTurno, form]);
  
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
        telefone: data.telefone,
        cep: data.cep,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        turno_atual: data.turnoAtual,
        novo_turno: data.novoTurno,
        turno_novo: data.novoTurno,
        nova_rota: data.novaRota,
        nome_gestor: data.nomeGestor,
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
  
  const renderFormContent = () => {
    if (isMobile) {
      return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <label className="form-field-label">Matrícula</label>
            <input 
              type="text" 
              className="form-field-input bg-gray-100" 
              value={user?.matricula || ""} 
              disabled 
            />
            
            <label className="form-field-label">Nome</label>
            <input 
              type="text" 
              className="form-field-input bg-gray-100" 
              value={user?.nome || ""} 
              disabled 
            />
            
            <label className="form-field-label">Cargo</label>
            <input 
              type="text" 
              className="form-field-input bg-gray-100" 
              value={user?.cargo || ""} 
              disabled 
            />
            
            <label className="form-field-label">Setor</label>
            <input 
              type="text" 
              className="form-field-input bg-gray-100" 
              value={user?.setor || ""} 
              disabled 
            />
          </div>
          
          <div>
            <label className="form-field-label">Telefone</label>
            <input 
              type="text" 
              className="form-field-input" 
              placeholder="DDD + número (apenas números)"
              {...form.register("telefone", { 
                required: "Telefone é obrigatório",
                pattern: {
                  value: /^\d{10,11}$/,
                  message: "Telefone inválido. Use apenas números (DDD + número)"
                }
              })}
            />
            {form.formState.errors.telefone && (
              <p className="text-red-500 mt-1">{form.formState.errors.telefone.message}</p>
            )}
            
            <label className="form-field-label">CEP</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="form-field-input flex-1" 
                placeholder="Apenas números"
                {...form.register("cep", { 
                  required: "CEP é obrigatório",
                  pattern: {
                    value: /^\d{8}$/,
                    message: "CEP inválido. Use apenas números"
                  }
                })}
                onChange={(e) => {
                  form.setValue("cep", e.target.value);
                  if (e.target.value.length === 8) {
                    buscarCep(e.target.value);
                  }
                }}
              />
              <button 
                type="button" 
                className="bg-gray-200 px-3 rounded"
                onClick={() => buscarCep(form.getValues("cep"))}
                disabled={form.getValues("cep").length !== 8 || isLoadingCep}
              >
                {isLoadingCep ? "..." : "Buscar"}
              </button>
            </div>
            {form.formState.errors.cep && (
              <p className="text-red-500 mt-1">{form.formState.errors.cep.message}</p>
            )}
            
            <label className="form-field-label">Endereço</label>
            <input 
              type="text" 
              className="form-field-input" 
              {...form.register("endereco", { required: "Endereço é obrigatório" })}
            />
            {form.formState.errors.endereco && (
              <p className="text-red-500 mt-1">{form.formState.errors.endereco.message}</p>
            )}
            
            <label className="form-field-label">Bairro</label>
            <input 
              type="text" 
              className="form-field-input" 
              {...form.register("bairro", { required: "Bairro é obrigatório" })}
            />
            {form.formState.errors.bairro && (
              <p className="text-red-500 mt-1">{form.formState.errors.bairro.message}</p>
            )}
            
            <label className="form-field-label">Cidade</label>
            <input 
              type="text" 
              className="form-field-input" 
              {...form.register("cidade", { required: "Cidade é obrigatória" })}
            />
            {form.formState.errors.cidade && (
              <p className="text-red-500 mt-1">{form.formState.errors.cidade.message}</p>
            )}
            
            <label className="form-field-label">Turno Atual</label>
            <select 
              className="form-select-input"
              value={turnoAtual}
              onChange={(e) => form.setValue("turnoAtual", e.target.value)}
            >
              <option value="" disabled>Selecione o turno atual</option>
              {turnoOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {form.formState.errors.turnoAtual && (
              <p className="text-red-500 mt-1">{form.formState.errors.turnoAtual.message}</p>
            )}
            
            <label className="form-field-label">Novo Turno</label>
            <select 
              className="form-select-input"
              value={novoTurno}
              onChange={(e) => {
                form.setValue("novoTurno", e.target.value);
                if (["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"].includes(e.target.value)) {
                  form.setValue("novaRota", e.target.value);
                } else {
                  form.setValue("novaRota", "");
                }
              }}
            >
              <option value="" disabled>Selecione o novo turno</option>
              {turnoOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {form.formState.errors.novoTurno && (
              <p className="text-red-500 mt-1">{form.formState.errors.novoTurno.message}</p>
            )}
            
            <label className="form-field-label">Nova Rota</label>
            <select 
              className="form-select-input"
              value={form.watch("novaRota")}
              onChange={(e) => form.setValue("novaRota", e.target.value)}
              disabled={!novoTurno || ["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"].includes(novoTurno)}
            >
              <option value="" disabled>Selecione a nova rota</option>
              {rotaOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {form.formState.errors.novaRota && (
              <p className="text-red-500 mt-1">{form.formState.errors.novaRota.message}</p>
            )}
            
            <label className="form-field-label">Nome do gestor que aprovou a alteração</label>
            <input 
              type="text" 
              className="form-field-input" 
              placeholder="Nome completo do gestor"
              {...form.register("nomeGestor", { required: "Nome do gestor é obrigatório" })}
            />
            {form.formState.errors.nomeGestor && (
              <p className="text-red-500 mt-1">{form.formState.errors.nomeGestor.message}</p>
            )}
            
            <label className="form-field-label">Motivo da alteração</label>
            <textarea 
              className="form-field-input"
              rows={5}
              placeholder="Descreva o motivo da alteração de turno"
              {...form.register("motivo", { required: "Motivo é obrigatório" })}
            />
            {form.formState.errors.motivo && (
              <p className="text-red-500 mt-1">{form.formState.errors.motivo.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full py-4 text-lg rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      );
    }
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel className="form-field-label">Matrícula</FormLabel>
              <FormControl>
                <Input value={user?.matricula || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel className="form-field-label">Nome</FormLabel>
              <FormControl>
                <Input value={user?.nome || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel className="form-field-label">Cargo</FormLabel>
              <FormControl>
                <Input value={user?.cargo || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel className="form-field-label">Setor</FormLabel>
              <FormControl>
                <Input value={user?.setor || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
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
                      {turnoOptions.map((turno) => (
                        <SelectItem key={turno} value={turno}>{turno}</SelectItem>
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"].includes(value)) {
                        form.setValue("novaRota", value);
                      } else {
                        form.setValue("novaRota", "");
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="form-select-input">
                        <SelectValue placeholder="Selecione o novo turno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {turnoOptions.map((turno) => (
                        <SelectItem key={turno} value={turno}>{turno}</SelectItem>
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
                  disabled={!novoTurno || ["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"].includes(novoTurno)}
                >
                  <FormControl>
                    <SelectTrigger className="form-select-input">
                      <SelectValue placeholder="Selecione a nova rota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rotaOptions.map((rota) => (
                      <SelectItem key={rota} value={rota}>{rota}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <FormLabel className="form-field-label">Nome do gestor que aprovou a alteração</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo do gestor" {...field} className="form-field-input" />
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
                <FormLabel className="form-field-label">Motivo da alteração</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o motivo da alteração de turno"
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
    );
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Mudança de Turno</CardTitle>
          <CardDescription>
            Todas as solicitações realizadas neste canal serão validadas com o gestor 
            antes de aprovarmos, portanto só preencha se já tiver a devida autorização.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderFormContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default MudancaTurno;
