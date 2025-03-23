
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase, queryCustomTable } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormLayout } from "@/components/FormLayout";
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
import { useIsMobile } from "@/hooks/use-mobile";

interface FormValues {
  cidade: "Anápolis" | "Goiânia";
  turno: string;
  rota: string;
  descricao: string;
  motivo?: string;
}

const AbonoPonto = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    defaultValues: {
      cidade: "Anápolis",
      turno: "",
      rota: "",
      descricao: "",
      motivo: "Problema com transporte fretado"
    },
  });
  
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");
  
  // Opções dinâmicas de turno com base na cidade
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno"]
    : ["Gyn Adm 1", "Gyn Adm 2", "Gyn 1° Turno", "Gyn 2° Turno"];
    
  // Opções dinâmicas de rota com base na cidade e turno
  const getRotaOptions = () => {
    if (cidade === "Goiânia") {
      return [turno].filter(Boolean);
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
  
  useEffect(() => {
    if (cidade === "Goiânia" && turno) {
      form.setValue("rota", turno);
    }
  }, [cidade, turno, form]);
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('solicitacoes_abono_ponto').insert({
        solicitante_id: user.id,
        cidade: data.cidade,
        turno: data.turno,
        rota: data.rota, 
        descricao: data.descricao,
        motivo: data.motivo || "Problema com transporte fretado",
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
  
  const renderFormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!isMobile ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
        
        {isMobile ? (
          <>
            <div>
              <label className="form-field-label">Cidade</label>
              <select 
                className="form-select-input" 
                value={cidade}
                onChange={(e) => {
                  form.setValue("cidade", e.target.value as "Anápolis" | "Goiânia");
                  form.setValue("turno", "");
                  form.setValue("rota", "");
                }}
              >
                <option value="Anápolis">Anápolis</option>
                <option value="Goiânia">Goiânia</option>
              </select>
              
              <label className="form-field-label">Turno</label>
              <select 
                className="form-select-input"
                value={turno}
                onChange={(e) => {
                  form.setValue("turno", e.target.value);
                  if (cidade === "Goiânia" && e.target.value) {
                    form.setValue("rota", e.target.value);
                  } else {
                    form.setValue("rota", "");
                  }
                }}
                disabled={!cidade}
              >
                <option value="" disabled>Selecione o turno</option>
                {turnoOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <label className="form-field-label">Rota</label>
              <select 
                className="form-select-input"
                value={form.watch("rota")}
                onChange={(e) => form.setValue("rota", e.target.value)}
                disabled={!turno || (cidade === "Goiânia")}
              >
                <option value="" disabled>Selecione a rota</option>
                {rotaOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <label className="form-field-label">Descreva o ocorrido</label>
              <textarea 
                className="form-field-input"
                rows={5}
                placeholder="Descreva o problema ou atraso com o transporte fretado"
                {...form.register("descricao", { required: "Descrição é obrigatória" })}
              />
              {form.formState.errors.descricao && (
                <p className="text-red-500 -mt-4 mb-4">{form.formState.errors.descricao.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full py-4 text-lg rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </>
        ) : (
          <>
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
                      
                      if (cidade === "Goiânia" && value) {
                        form.setValue("rota", value);
                      } else {
                        form.setValue("rota", "");
                      }
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
                    disabled={!turno || (cidade === "Goiânia")}
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
          </>
        )}
      </form>
    </Form>
  );
  
  if (isMobile) {
    return (
      <FormLayout
        title="Solicitação de Abono de Ponto"
        description="Preencha o formulário para solicitar abono de ponto"
        infoMessage="O abono só será realizado por motivos de problemas/atrasos com o transporte fretado."
      >
        {renderFormContent()}
      </FormLayout>
    );
  }
  
  return (
    <div className="container max-w-3xl py-10">
      <div className="bg-white rounded-lg border shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Solicitação de Abono de Ponto</h2>
          <p className="text-gray-500 mt-1">
            O abono só será realizado por motivos de problemas/atrasos com o transporte fretado.
          </p>
        </div>
        <div className="p-6">
          {renderFormContent()}
        </div>
      </div>
    </div>
  );
};

export default AbonoPonto;
