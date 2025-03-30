
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SolicitacaoAbonoPonto } from "@/types/solicitacoes";
import { AdminActionDialog } from "./AdminActionDialog";

interface SolicitacaoAbonoPontoViewProps {
  solicitacao: SolicitacaoAbonoPonto;
  onStatusChange: () => void;
}

export function SolicitacaoAbonoPontoView({ 
  solicitacao, 
  onStatusChange 
}: SolicitacaoAbonoPontoViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleUpdateStatus = async (newStatus: string, comentario: string = "") => {
    setIsLoading(true);
    try {
      const updateData: { 
        status: string; 
        motivo_rejeicao?: string;
        motivo_comentario?: string;
      } = { 
        status: newStatus 
      };
      
      // Adicionar motivo apenas se for rejeitada e houver comentário
      if (newStatus === 'rejeitada' && comentario.trim()) {
        updateData.motivo_rejeicao = comentario;
      }
      
      // Adicionar comentário se houver
      if (comentario.trim()) {
        updateData.motivo_comentario = comentario;
      }
      
      const { error } = await supabase
        .from('solicitacoes_abono_ponto')
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Solicitação de Abono de Ponto</CardTitle>
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
            <h3 className="text-sm font-medium text-muted-foreground">Data da Ocorrência</h3>
            <p>{new Date(solicitacao.data_ocorrencia).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Cidade</h3>
            <p>{solicitacao.cidade}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Turno</h3>
            <p>{solicitacao.turno}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Rota</h3>
          <p>{solicitacao.rota}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
          <p className="whitespace-pre-wrap">{solicitacao.descricao}</p>
        </div>

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

        {solicitacao.motivo_comentario && (
          <div className="mt-4 p-3 border border-blue-200 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-600">Comentário</h3>
            <p className="text-blue-700">{solicitacao.motivo_comentario}</p>
          </div>
        )}
      </CardContent>
      
      {solicitacao.status === "pendente" && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={isLoading}
          >
            Rejeitar
          </Button>
          <Button
            onClick={() => setIsApproveDialogOpen(true)}
            disabled={isLoading}
          >
            Aprovar
          </Button>
        </CardFooter>
      )}
      
      <AdminActionDialog 
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={(comment) => {
          setIsApproveDialogOpen(false);
          handleUpdateStatus("aprovada", comment);
        }}
        title="Aprovar Solicitação"
        action="approve"
      />
      
      <AdminActionDialog 
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={(comment) => {
          setIsRejectDialogOpen(false);
          handleUpdateStatus("rejeitada", comment);
        }}
        title="Rejeitar Solicitação"
        action="reject"
        isRejectionReasonRequired={true}
      />
    </Card>
  );
}
