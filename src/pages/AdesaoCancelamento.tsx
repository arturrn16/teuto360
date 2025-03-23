import { useState, useEffect } from "react";
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
import { SignaturePad } from "@/components/SignaturePad";
import { DeclaracaoTransporte } from "@/components/DeclaracaoTransporte";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  
  return (
    <FormLayout
      title="Adesão ou Cancelamento do Transporte Fretado"
      description="Preencha o formulário, assine o termo eletronicamente e envie sua solicitação. Em até 3 dias úteis você receberá um retorno."
    >
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="form">Formulário</TabsTrigger>
          <TabsTrigger value="preview">Visualizar Documento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
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
    </FormLayout>
  );
};

export default AdesaoCancelamento;
