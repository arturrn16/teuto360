
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SolicitacaoAdesaoCancelamento } from "@/types/solicitacoes";
import { Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SolicitacaoAdesaoCancelamentoViewProps {
  solicitacao: SolicitacaoAdesaoCancelamento;
  onStatusChange: () => void;
}

export function SolicitacaoAdesaoCancelamentoView({ 
  solicitacao, 
  onStatusChange 
}: SolicitacaoAdesaoCancelamentoViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [motivo, setMotivo] = useState("");

  const handleUpdateStatus = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const updateData: { status: string; motivo_rejeicao?: string } = { 
        status: newStatus 
      };
      
      // Adicionar motivo apenas se for rejeitada
      if (newStatus === 'rejeitada' && motivo) {
        updateData.motivo_rejeicao = motivo;
      }
      
      const { error } = await supabase
        .from('solicitacoes_adesao_cancelamento')
        .update(updateData)
        .eq('id', solicitacao.id);

      if (error) {
        throw error;
      }

      toast.success(`Solicitação ${newStatus === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso`);
      onStatusChange();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar o status da solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDeclaracao = () => {
    if (solicitacao.declaracao_url) {
      const linkSource = solicitacao.declaracao_url;
      const downloadLink = document.createElement('a');
      const fileName = `declaracao_${solicitacao.tipo_solicitacao.toLowerCase()}_${solicitacao.id}.pdf`;
      
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } else {
      toast.error("Não há declaração disponível para download");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Solicitação de {solicitacao.tipo_solicitacao === "Aderir" ? "Adesão" : "Cancelamento"} ao Transporte</CardTitle>
            <CardDescription>ID: {solicitacao.id}</CardDescription>
          </div>
          <Badge
            variant={
              solicitacao.status === "aprovada"
                ? "success"
                : solicitacao.status === "rejeitada"
                ? "destructive"
                : "outline"
            }
          >
            {solicitacao.status === "aprovada"
              ? "Aprovada"
              : solicitacao.status === "rejeitada"
              ? "Rejeitada"
              : "Pendente"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data da Solicitação</h3>
            <p>{new Date(solicitacao.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Tipo de Transporte</h3>
            <p>{solicitacao.tipo_transporte === "Fretado" ? "Transporte Fretado" : "Vale Transporte"}</p>
          </div>
        </div>

        {solicitacao.cep && (
          <div className="grid grid-cols-1 gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
            <p>
              {solicitacao.rua}, {solicitacao.bairro}, {solicitacao.cidade} - CEP: {solicitacao.cep}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Motivo</h3>
          <p className="whitespace-pre-wrap">{solicitacao.motivo}</p>
        </div>

        {solicitacao.motivo_rejeicao && solicitacao.status === "rejeitada" && (
          <div className="mt-4 p-3 border border-red-200 bg-red-50 rounded-md">
            <h3 className="text-sm font-medium text-red-600">Motivo da Rejeição</h3>
            <p className="text-red-700">{solicitacao.motivo_rejeicao}</p>
          </div>
        )}

        {solicitacao.declaracao_url && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleDownloadDeclaracao}
            >
              <Download size={16} />
              Baixar Declaração em PDF
            </Button>
          </div>
        )}

        {solicitacao.assinatura_url && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Assinatura do Colaborador</h3>
            <div className="border border-gray-200 rounded p-2 bg-white">
              <img 
                src={solicitacao.assinatura_url} 
                alt="Assinatura do colaborador" 
                className="max-h-20 mx-auto"
              />
            </div>
          </div>
        )}
      </CardContent>
      
      {solicitacao.status === "pendente" && (
        <CardFooter className="flex flex-col gap-4">
          {/* Campo de motivo para rejeição */}
          <div className="w-full">
            <Label htmlFor="motivo_rejeicao">Motivo para rejeição (obrigatório caso rejeite)</Label>
            <Textarea 
              id="motivo_rejeicao"
              placeholder="Informe o motivo caso decida rejeitar a solicitação"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => {
                if (!motivo.trim()) {
                  toast.error("Informe o motivo da rejeição");
                  return;
                }
                handleUpdateStatus("rejeitada");
              }}
              disabled={isLoading}
            >
              Rejeitar
            </Button>
            <Button
              onClick={() => handleUpdateStatus("aprovada")}
              disabled={isLoading}
            >
              Aprovar
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
