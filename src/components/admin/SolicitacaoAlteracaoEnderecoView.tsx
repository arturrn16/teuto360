
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SolicitacaoAlteracaoEndereco } from "@/types/solicitacoes";
import { AdminActionDialog } from "./AdminActionDialog";

interface SolicitacaoAlteracaoEnderecoViewProps {
  solicitacao: SolicitacaoAlteracaoEndereco;
  onStatusChange: () => void;
}

export function SolicitacaoAlteracaoEnderecoView({ 
  solicitacao, 
  onStatusChange 
}: SolicitacaoAlteracaoEnderecoViewProps) {
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
        .from('solicitacoes_alteracao_endereco')
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
            <CardTitle>Solicitação de Alteração de Endereço</CardTitle>
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
            <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
            <p>{solicitacao.telefone}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Endereço Atual</h3>
          <p>{solicitacao.endereco_atual}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Novo Endereço</h3>
          <p>{solicitacao.endereco_novo}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Rota Atual</h3>
            <p>{solicitacao.rota_atual}</p>
          </div>
          {solicitacao.alterar_rota && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nova Rota</h3>
              <p>{solicitacao.nova_rota}</p>
            </div>
          )}
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
        </CardFooter>
      )}
    </Card>
  );
}
