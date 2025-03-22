
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RefeitorioDashboardCard from "@/components/dashboard/RefeitorioDashboardCard";
import {
  BarChart2,
  CalendarCheck,
  FileText,
  MessageSquare,
  Users,
  Bus,
  FileEdit,
  Calendar,
  CheckSquare,
  Home,
  Briefcase,
  MapPin,
  Map,
  CarFront,
  Utensils,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Seção de Transporte */}
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-semibold">
              <Bus className="mr-2 h-5 w-5 text-primary" />
              Transporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse as opções de transporte disponíveis.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/transporte-rota")}
            >
              Transporte Rota
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/transporte-12x36")}
            >
              Transporte 12x36
            </Button>
          </CardFooter>
        </Card>

        {/* Refeitório */}
        <RefeitorioDashboardCard />

        {/* Seção de Recursos Humanos */}
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-semibold">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Recursos Humanos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gerencie suas solicitações e informações de RH.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/minhas-solicitacoes")}
            >
              Minhas Solicitações
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/abono-ponto")}
            >
              Abono de Ponto
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/alteracao-endereco")}
            >
              Alteração de Endereço
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/mudanca-turno")}
            >
              Mudança de Turno
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/adesao-cancelamento")}
            >
              Adesão/Cancelamento
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/plantao")}
            >
              Plantão
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/refeicao")}
            >
              Refeição
            </Button>
          </CardFooter>
        </Card>

        {/* Seção de Administração (Apenas para Admins) */}
        {user?.admin && (
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl font-semibold">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Administração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie os comunicados e avaliações.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/gerenciar-comunicados")}
              >
                Gerenciar Comunicados
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/avaliacao")}
              >
                Avaliação
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/gerenciar-cardapio")}
              >
                Gerenciar Cardápio
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
