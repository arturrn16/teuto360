import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Solicitacao {
  id: number;
  created_at: string;
  status: string;
  tipo: string;
}

const MinhasSolicitacoes = () => {
  const { user, isAuthenticated } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const tables = user.tipo_usuario === 'refeicao' 
          ? [{ table: 'solicitacoes_refeicao', tipo: 'Refeição' }]
          : [
              { table: 'solicitacoes_abono_ponto', tipo: 'Abono de Ponto' },
              { table: 'solicitacoes_adesao_cancelamento', tipo: 'Adesão/Cancelamento' },
              { table: 'solicitacoes_alteracao_endereco', tipo: 'Alteração de Endereço' },
              { table: 'solicitacoes_mudanca_turno', tipo: 'Mudança de Turno' },
            ];

        let allSolicitacoes: Solicitacao[] = [];

        for (const { table, tipo } of tables) {
          try {
            const { data, error } = await (supabase as any)
              .from(table)
              .select('id, created_at, status')
              .eq('solicitante_id', user.id)
              .order('created_at', { ascending: false });

            if (error) {
              console.error(`Erro ao buscar solicitações de ${tipo}:`, error.message);
              continue; // Skip this table and try the next one
            }

            if (data && data.length > 0) {
              const solicitacoesWithType: Solicitacao[] = data.map(item => ({
                id: item.id,
                created_at: item.created_at,
                status: item.status,
                tipo: tipo,
              }));
              allSolicitacoes = [...allSolicitacoes, ...solicitacoesWithType];
            }
          } catch (tableError) {
            console.error(`Erro ao processar tabela ${table}:`, tableError);
            // Continue with other tables even if one fails
          }
        }

        allSolicitacoes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setSolicitacoes(allSolicitacoes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, [user, isAuthenticated]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando suas solicitações...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar solicitações: {error}</div>;
  }

  const showButtons = () => {
    if (!user) return null;
    
    if (user.tipo_usuario === 'refeicao') {
      return (
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to="/refeicao">Solicitar Refeição</Link>
          </Button>
        </div>
      );
    } else {
      return (
        <>
          {user.tipo_usuario === "selecao" && (
            <div className="mt-4">
              <Button asChild>
                <Link to="/cadastro-usuario">Cadastrar Usuário</Link>
              </Button>
            </div>
          )}
          <div className="mt-4 space-x-2">
            <Button asChild variant="outline">
              <Link to="/abono-ponto">Abono de Ponto</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/adesao-cancelamento">Adesão/Cancelamento</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/alteracao-endereco">Alteração de Endereço</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/mudanca-turno">Mudança de Turno</Link>
            </Button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="container max-w-5xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações</CardTitle>
          <CardDescription>
            Acompanhe o status das suas solicitações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {solicitacoes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg">Nenhuma solicitação encontrada.</p>
              {showButtons()}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Suas solicitações de serviços.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoes.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell>{solicitacao.tipo}</TableCell>
                        <TableCell>{new Date(solicitacao.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{solicitacao.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Total de solicitações: {solicitacoes.length}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <div className="mt-4">
                {showButtons()}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhasSolicitacoes;
