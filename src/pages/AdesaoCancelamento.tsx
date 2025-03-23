
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
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormValues {
  tipoSolicitacao: "Aderir" | "Cancelar";
  tipoTransporte: "Fretado" | "ValeTransporte";
  email: string;
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
      email: "",
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
  
  const downloadDeclaracao = async () => {
    const element = document.getElementById('declaracao-preview');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `declaracao_${tipoSolicitacao.toLowerCase()}_transporte.png`;
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem da declaração:", error);
      toast.error("Não foi possível baixar a declaração");
    }
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
  
  // Efeito para buscar CEP quando o campo for preenchido corretamente
  useEffect(() => {
    const cepSemMascara = cep?.replace(/\D/g, '');
    if (cepSemMascara?.length === 8) {
      buscarCep(cepSemMascara);
    }
  }, [cep]);
  
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
      const { error } = await supabase.from('solicitacoes_adesao_cancelamento').insert({
        solicitante_id: user.id,
        tipo_solicitacao: data.tipoSolicitacao,
        tipo_transporte: data.tipoSolicitacao === "Aderir" ? data.tipoTransporte : null,
        email: data.email,
        motivo: data.motivo,
        cep: data.cep,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        status: 'pendente',
        assinatura_url: signatureDataUrl,
        declaracao_url: await captureDeclaracaoAsImage()
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
  
  const captureDeclaracaoAsImage = async (): Promise<string> => {
    const element = document.getElementById('declaracao-preview');
    if (!element) return '';
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Erro ao capturar declaração como imagem:", error);
      return '';
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
                        <SelectItem value="Aderir">Aderir</SelectItem>
                        <SelectItem value="Cancelar">Cancelar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipoSolicitacao === "Aderir" && (
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
              )}
              
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
                            placeholder="00000000" 
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
                        <Input 
                          placeholder="Av. Principal" 
                          {...field} 
                          className="form-field-input"
                        />
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
                        <Input 
                          placeholder="Centro" 
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
                  name="cidade"
                  rules={{ required: "Cidade é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-field-label">Cidade</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="São Paulo" 
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
                name="email"
                rules={{ 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-field-label">E-mail para receber o termo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu.email@exemplo.com" 
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
                tipoTransporte={tipoSolicitacao === "Aderir" ? tipoTransporte : undefined}
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
            
            <div className="flex justify-center">
              <Button 
                type="button" 
                onClick={downloadDeclaracao}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download size={16} />
                Baixar Declaração
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </FormLayout>
  );
};

export default AdesaoCancelamento;
