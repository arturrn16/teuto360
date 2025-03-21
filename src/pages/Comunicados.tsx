
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comunicado } from "@/models/comunicado";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Comunicados = () => {
  const fetchComunicados = async (): Promise<Comunicado[]> => {
    const { data, error } = await supabase
      .from("comunicados")
      .select("*")
      .eq("arquivado", false)
      .order("importante", { ascending: false })
      .order("data_publicacao", { ascending: false });

    if (error) throw error;
    return data as Comunicado[];
  };

  const { data: comunicados, isLoading, error } = useQuery({
    queryKey: ["comunicados"],
    queryFn: fetchComunicados,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comunicados</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Confira os comunicados importantes da empresa
          </p>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardHeader className="pb-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao carregar os comunicados. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comunicados</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Confira os comunicados importantes da empresa
        </p>
      </div>

      {comunicados && comunicados.length === 0 ? (
        <div className="text-center p-8">
          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum comunicado disponível</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Não há comunicados para exibir no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comunicados?.map((comunicado) => (
            <Card key={comunicado.id} className={`border ${comunicado.importante ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10' : 'border-gray-200'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{comunicado.titulo}</CardTitle>
                    {comunicado.importante && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 ml-2">
                        Importante
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(comunicado.data_publicacao), "PPP", { locale: ptBR })}
                  <span className="mx-2">•</span>
                  {comunicado.autor_nome}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: comunicado.conteudo }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comunicados;
