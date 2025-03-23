
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
import { SignaturePad } from "@/components/SignaturePad";
import { DeclaracaoTransporte } from "@/components/DeclaracaoTransporte";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

interface FormValues {
  tipoSolicitacao: "Aderir" | "Cancelar";
  email: string;
  motivo: string;
}

const AdesaoCancelamento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      tipoSolicitacao: "Aderir",
      email: "",
      motivo: "",
    },
  });
  
  const tipoSolicitacao = form.watch("tipoSolicitacao");
  
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
        email: data.email,
        motivo: data.motivo,
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
                usuario={user ? {
                  nome: user.nome,
                  matricula: user.matricula,
                  cargo: user.cargo,
                  setor: user.setor
                } : null} 
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
