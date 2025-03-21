
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
    "12x36 Diurno", 
    "12x36 Noturno"
  ];
  
  const getRotaOptions = () => {
    if (novoTurno === "Administrativo") {
      return Array.from({ length: 8 }, (_, i) => `ADM-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "1° Turno") {
      return Array.from({ length: 15 }, (_, i) => `P-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "2° Turno") {
      return Array.from({ length: 12 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "3° Turno") {
      return Array.from({ length: 3 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`);
    } else if (novoTurno === "12x36 Diurno" || novoTurno === "12x36 Noturno") {
      return ["Rota Especial 12x36"];
    }
    return [];
  };
  
  const rotaOptions = getRotaOptions();
  
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
      const { error } = await supabase.from("solicitacoes_mudanca_turno").insert({
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
          <CardTitle>Solicitação de Mudança de Turno</CardTitle>
          <CardDescription>
            Todas as solicitações realizadas neste canal serão validadas com o gestor antes de aprovarmos, portanto só preencha se já tiver a devida autorização.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={() => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input value={user?.matricula || ""} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nome"
                  render={() => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input value={user?.nome || ""} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cargo"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input value={user?.cargo || ""} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="setor"
                  render={() => (
                    <FormItem>
                      <FormLabel>Setor</FormLabel>
                      <FormControl>
                        <Input value={user?.setor || ""} disabled />
                      </FormControl>
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="DDD + número (apenas números)" {...field} />
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
                    <FormLabel>CEP</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="Apenas números" 
                          {...field} 
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
              
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="endereco"
                  rules={{ required: "Endereço é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="turnoAtual"
                  rules={{ required: "Turno atual é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turno Atual</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                      <FormLabel>Novo Turno</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("novaRota", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                    <FormLabel>Nova Rota</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!novoTurno}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormLabel>Nome do gestor que aprovou a alteração</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do gestor" {...field} />
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
                    <FormLabel>Motivo da alteração</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o motivo da alteração de turno"
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

export default MudancaTurno;
