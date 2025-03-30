
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SolicitacaoMudancaTurno } from "@/types/solicitacoes";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdminCommentField } from "./AdminCommentField";

interface SolicitacaoMudancaTurnoViewProps {
  solicitacao: SolicitacaoMudancaTurno;
  onStatusChange: () => void;
}

export function SolicitacaoMudancaTurnoView({ 
  solicitacao, 
  onStatusChange 
}: SolicitacaoMudancaTurnoViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [comentario, setComentario] = useState("");

  const handleUpdateStatus = async (newStatus: string) => {
    setIsLoading(true);
    try {
      // Verificando se há motivo em caso de rejeição
      if (newStatus === 'rejeitada' && !motivo.trim()) {
        toast.error("É necessário informar o motivo da rejeição");
        setIsLoading(false);
        return;
      }
      
      const updateData: { 
        status: string; 
        motivo_rejeicao?: string;
        motivo_comentario?: string;
      } = { 
        status: newStatus 
      };
      
      // Adicionar motivo apenas se for rejeitada
      if (newStatus === 'rejeitada') {
        updateData.motivo_rejeicao = motivo;
      }
      
      // Adicionar comentário se houver
      if (comentario.trim()) {
        updateData.motivo_comentario = comentario;
      }
      
      const { error } = await supabase
        .from('solicitacoes_mudanca_turno')
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
            <CardTitle>Solicitação de Mudança de Turno</CardTitle>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Turno Atual</h3>
            <p>{solicitacao.turno_atual}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Novo Turno</h3>
            <p>{solicitacao.novo_turno}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Nova Rota</h3>
          <p>{solicitacao.nova_rota}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Nome do Gestor</h3>
          <p>{solicitacao.nome_gestor}</p>
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
        <CardFooter className="flex flex-col gap-4">
          <AdminCommentField 
            value={comentario}
            onChange={setComentario}
          />
          
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
              onClick={() => handleUpdateStatus("rejeitada")}
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
