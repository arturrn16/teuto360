
import { useState, useEffect } from "react";
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
import { FormLayout } from "@/components/FormLayout";
import { SignaturePad } from "@/components/SignaturePad";
import { DeclaracaoTransporte } from "@/components/DeclaracaoTransporte";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormValues {
  tipoSolicitacao: "Aderir" | "Cancelar";
  tipoTransporte: "Fretado" | "ValeTransporte";
  motivo: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
}

const AdesaoCancelamento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    defaultValues: {
      tipoSolicitacao: "Aderir",
      tipoTransporte: "Fretado",
      motivo: "",
      cep: "",
      rua: "",
      bairro: "",
      cidade: "",
    },
  });
  
  const tipoSolicitacao = form.watch("tipoSolicitacao");
  const tipoTransporte = form.watch("tipoTransporte");
  const cep = form.watch("cep");
  const rua = form.watch("rua");
  const bairro = form.watch("bairro");
  const cidade = form.watch("cidade");
  
  const handleSignatureChange = (dataUrl: string | null) => {
    setSignatureDataUrl(dataUrl);
  };
  
  const buscarCep = async (cep: string) => {
    if (!cep || cep.length !== 8) return;
    
    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      
      form.setValue("rua", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsCepLoading(false);
    }
  };
  
  useEffect(() => {
    const cepSemMascara = cep?.replace(/\D/g, '');
    if (cepSemMascara?.length === 8) {
      buscarCep(cepSemMascara);
    }
  }, [cep]);
  
  const captureDeclaracaoAsPdf = async (): Promise<string> => {
    const element = document.getElementById('declaracao-preview');
    if (!element) return '';
    
    try {
      const options = {
        margin: 10,
        filename: `declaracao_${tipoSolicitacao.toLowerCase()}_transporte.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      return new Promise((resolve) => {
        html2pdf().from(element).set(options).outputPdf('datauristring').then((pdf: string) => {
          resolve(pdf);
        });
      });
    } catch (error) {
      console.error("Erro ao capturar declaração como PDF:", error);
      return '';
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    if (!signatureDataUrl) {
      toast.error("É necessário assinar o documento para prosseguir");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const pdfDataUrl = await captureDeclaracaoAsPdf();
      
      const { error } = await supabase.from('solicitacoes_adesao_cancelamento').insert({
        solicitante_id: user.id,
        tipo_solicitacao: data.tipoSolicitacao,
        tipo_transporte: data.tipoTransporte,
        motivo: data.motivo,
        cep: data.cep,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        status: 'pendente',
        assinatura_url: signatureDataUrl,
        declaracao_url: pdfDataUrl
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
            <label className="form-field-label">Tipo de Solicitação</label>
            <select 
              className="form-select-input"
              value={tipoSolicitacao}
              onChange={(e) => form.setValue("tipoSolicitacao", e.target.value as "Aderir" | "Cancelar")}
            >
              <option value="Aderir">Aderir transporte</option>
              <option value="Cancelar">Cancelar transporte</option>
            </select>
            
            <label className="form-field-label">Tipo de Transporte</label>
            <div className="space-y-2 mt-2 mb-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="fretado"
                  name="tipoTransporte"
                  value="Fretado"
                  className="mr-2"
                  checked={tipoTransporte === "Fretado"}
                  onChange={() => form.setValue("tipoTransporte", "Fretado")}
                />
                <label htmlFor="fretado">Transporte Fretado</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="valeTransporte"
                  name="tipoTransporte"
                  value="ValeTransporte"
                  className="mr-2"
                  checked={tipoTransporte === "ValeTransporte"}
                  onChange={() => form.setValue("tipoTransporte", "ValeTransporte")}
                />
                <label htmlFor="valeTransporte">Vale Transporte</label>
              </div>
            </div>
            
            <label className="form-field-label">CEP</label>
            <div className="relative">
              <input 
                type="text" 
                className="form-field-input" 
                placeholder="Digite para buscar endereço"
                maxLength={8}
                value={cep}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  form.setValue("cep", value);
                }}
              />
              {isCepLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                </div>
              )}
            </div>
            {form.formState.errors.cep && (
              <p className="text-red-500 mt-1">{form.formState.errors.cep.message}</p>
            )}
            
            <label className="form-field-label">Rua</label>
            <input 
              type="text" 
              className="form-field-input" 
              {...form.register("rua", { required: "Rua é obrigatória" })}
            />
            {form.formState.errors.rua && (
              <p className="text-red-500 mt-1">{form.formState.errors.rua.message}</p>
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
            
            <label className="form-field-label">Motivo</label>
            <textarea 
              className="form-field-input"
              rows={5}
              placeholder="Descreva o motivo da solicitação"
              {...form.register("motivo", { required: "Motivo é obrigatório" })}
            />
            {form.formState.errors.motivo && (
              <p className="text-red-500 mt-1">{form.formState.errors.motivo.message}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <label className="form-field-label">Assinatura</label>
            <SignaturePad onSignatureChange={handleSignatureChange} disabled={isSubmitting} />
            {!signatureDataUrl && (
              <p className="text-sm text-amber-600">Assine o documento antes de enviar</p>
            )}
          </div>
          
          <Button type="submit" className="w-full py-4 text-lg rounded-xl" disabled={isSubmitting || !signatureDataUrl}>
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
            name="tipoSolicitacao"
            rules={{ required: "Tipo de solicitação é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Tipo de Solicitação</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="form-select-input">
                      <SelectValue placeholder="Selecione o tipo de solicitação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aderir">Aderir transporte</SelectItem>
                    <SelectItem value="Cancelar">Cancelar transporte</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoTransporte"
            rules={{ required: "Tipo de transporte é obrigatório" }}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="form-field-label">Tipo de Transporte</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Fretado" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Transporte Fretado
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ValeTransporte" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Vale Transporte
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="cep"
              rules={{ 
                required: "CEP é obrigatório",
                pattern: {
                  value: /^\d{8}$/,
                  message: "CEP deve conter 8 dígitos numéricos"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">CEP</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Digite para buscar endereço" 
                        {...field} 
                        className="form-field-input"
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                        maxLength={8}
                      />
                    </FormControl>
                    {isCepLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="rua"
              rules={{ required: "Rua é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Rua</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>
          
          <FormField
            control={form.control}
            name="motivo"
            rules={{ required: "Motivo é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Motivo</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o motivo da solicitação"
                    rows={4}
                    {...field} 
                    className="form-field-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-3">
            <FormLabel className="form-field-label">Assinatura</FormLabel>
            <SignaturePad onSignatureChange={handleSignatureChange} disabled={isSubmitting} />
            {!signatureDataUrl && (
              <p className="text-sm text-amber-600">Assine o documento antes de enviar</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting || !signatureDataUrl}>
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
          <CardTitle>Adesão ou Cancelamento do Transporte Fretado</CardTitle>
          <CardDescription>
            Preencha o formulário, assine o termo eletronicamente e envie sua solicitação. 
            Em até 3 dias úteis você receberá um retorno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="form">Formulário</TabsTrigger>
              <TabsTrigger value="preview">Visualizar Documento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              {renderFormContent()}
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="space-y-4">
                <div id="declaracao-preview" className="bg-white p-4 rounded-lg border">
                  <DeclaracaoTransporte 
                    tipo={tipoSolicitacao} 
                    tipoTransporte={tipoTransporte}
                    usuario={user ? {
                      nome: user.nome,
                      matricula: user.matricula,
                      cargo: user.cargo,
                      setor: user.setor
                    } : null} 
                    endereco={
                      cep && rua && bairro && cidade 
                        ? { cep, rua, bairro, cidade } 
                        : undefined
                    }
                    signatureDataUrl={signatureDataUrl}
                  />
                </div>
                
                <div className="text-center text-sm text-gray-500 italic">
                  O documento será enviado para análise após submissão da solicitação.
                  Apenas administradores podem baixar a versão em PDF deste documento.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdesaoCancelamento;
