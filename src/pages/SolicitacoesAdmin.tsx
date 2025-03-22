
import React, { useState } from "react";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mockup data - you would fetch this from your backend in a real app
const mockSolicitacoes = [
  {
    id: 1,
    tipo: "Abono de Ponto",
    solicitante: "João Silva",
    data: "2023-10-15",
    status: "pendente",
    descricao: "Preciso de abono para consulta médica no dia 20/10."
  },
  {
    id: 2,
    tipo: "Alteração de Endereço",
    solicitante: "Maria Oliveira",
    data: "2023-10-14",
    status: "pendente",
    descricao: "Mudei para Rua das Flores, 123 - Jardim Primavera."
  },
  {
    id: 3,
    tipo: "Mudança de Turno",
    solicitante: "Pedro Santos",
    data: "2023-10-12",
    status: "pendente",
    descricao: "Solicito mudança para o turno da tarde por motivos pessoais."
  },
  {
    id: 4,
    tipo: "Adesão/Cancelamento",
    solicitante: "Ana Souza",
    data: "2023-10-10",
    status: "aprovado",
    descricao: "Gostaria de aderir ao transporte coletivo."
  },
  {
    id: 5,
    tipo: "Plantão",
    solicitante: "Carlos Mendes",
    data: "2023-10-08",
    status: "rejeitado",
    descricao: "Solicito plantão para o dia 25/10."
  }
];

type StatusType = "pendente" | "aprovado" | "rejeitado";

const SolicitacoesAdmin = () => {
  const [solicitacoes, setSolicitacoes] = useState(mockSolicitacoes);
  const [activeTab, setActiveTab] = useState<StatusType>("pendente");
  
  const handleAction = (id: number, action: "aprovar" | "rejeitar") => {
    setSolicitacoes(prev => 
      prev.map(sol => 
        sol.id === id 
          ? { ...sol, status: action === "aprovar" ? "aprovado" : "rejeitado" } 
          : sol
      )
    );
    
    toast.success(`Solicitação ${action === "aprovar" ? "aprovada" : "rejeitada"} com sucesso!`);
  };
  
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">Pendente</Badge>;
      case "aprovado":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">Aprovado</Badge>;
      case "rejeitado":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-300">Rejeitado</Badge>;
      default:
        return null;
    }
  };
  
  const filteredSolicitacoes = solicitacoes.filter(sol => sol.status === activeTab);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 mr-2 text-blue-500" />
        <h1 className="text-2xl font-bold">Gerenciar Solicitações</h1>
      </div>
      
      <Tabs defaultValue="pendente" onValueChange={(value) => setActiveTab(value as StatusType)}>
        <TabsList className="mb-4">
          <TabsTrigger value="pendente">
            Pendentes
            <Badge className="ml-2 bg-yellow-500">{solicitacoes.filter(s => s.status === "pendente").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="aprovado">
            Aprovadas
            <Badge className="ml-2 bg-green-500">{solicitacoes.filter(s => s.status === "aprovado").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejeitado">
            Rejeitadas
            <Badge className="ml-2 bg-red-500">{solicitacoes.filter(s => s.status === "rejeitado").length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        {["pendente", "aprovado", "rejeitado"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filteredSolicitacoes.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  Não há solicitações {status === "pendente" ? "pendentes" : status === "aprovado" ? "aprovadas" : "rejeitadas"}.
                </CardContent>
              </Card>
            ) : (
              filteredSolicitacoes.map(sol => (
                <Card key={sol.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{sol.tipo}</CardTitle>
                        <CardDescription>Solicitado por {sol.solicitante} em {new Date(sol.data).toLocaleDateString('pt-BR')}</CardDescription>
                      </div>
                      {getStatusBadge(sol.status as StatusType)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{sol.descricao}</p>
                  </CardContent>
                  {sol.status === "pendente" && (
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleAction(sol.id, "rejeitar")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(sol.id, "aprovar")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SolicitacoesAdmin;
