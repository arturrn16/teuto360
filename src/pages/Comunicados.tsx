
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { queryCustomTable } from "@/integrations/supabase/client";
import { Comunicado } from "@/models/comunicado";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Comunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComunicados = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await queryCustomTable<Comunicado>("comunicados", {
          order: { column: "data_publicacao", ascending: false }
        });
        
        if (error) {
          console.error("Erro ao buscar comunicados:", error);
          return;
        }
        
        setComunicados(data);
      } catch (error) {
        console.error("Erro ao buscar comunicados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComunicados();
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Comunicados</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Carregando comunicados...</p>
        </div>
      ) : comunicados.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum comunicado disponível no momento.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {comunicados.map((comunicado) => (
            <Card key={comunicado.id} className={comunicado.importante ? "border-2 border-red-500" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{comunicado.titulo}</CardTitle>
                  {comunicado.importante && (
                    <Badge variant="destructive">Importante</Badge>
                  )}
                </div>
                <CardDescription>
                  {format(new Date(comunicado.data_publicacao), "dd/MM/yyyy 'às' HH:mm")} - Por: {comunicado.autor_nome}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line">{comunicado.conteudo}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comunicados;
