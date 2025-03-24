
import { useEffect } from "react";
import { CalendarDays, CheckCircle, FileText, Home, MapPin, Route, Utensils, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loader-spinner";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  allowedTypes: ReadonlyArray<string>;
  color: string;
  textColor: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  icon,
  to,
  allowedTypes,
  color,
  textColor,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  if (!user || !allowedTypes.includes(user.tipo_usuario)) {
    return null;
  }

  return (
    <Card
      className={`group cursor-pointer border-none p-0 hover:bg-secondary/50 transition-colors ${color}`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs text-muted-foreground group-hover:underline">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const quickAccessCards = [
    {
      title: "Abono de Ponto",
      description: "Solicite abono de ponto",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      to: "/abono-ponto",
      allowedTypes: ["selecao", "colaborador", "comum"] as const,
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Adesão/Cancelamento",
      description: "Solicite adesão ou cancelamento ao transporte",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      to: "/adesao-cancelamento",
      allowedTypes: ["selecao", "colaborador", "comum"] as const,
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Alteração de Endereço",
      description: "Solicite alteração de endereço",
      icon: <Home className="h-8 w-8 text-orange-500" />,
      to: "/alteracao-endereco",
      allowedTypes: ["selecao", "colaborador", "comum"] as const,
      color: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Mudança de Turno",
      description: "Solicite mudança de turno",
      icon: <Route className="h-8 w-8 text-yellow-500" />,
      to: "/mudanca-turno",
      allowedTypes: ["selecao", "colaborador", "comum"] as const,
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Plantão 24hs",
      description: "Solicite transporte para plantão 24hs",
      icon: <MapPin className="h-8 w-8 text-red-500" />,
      to: "/plantao",
      allowedTypes: ["selecao", "colaborador", "comum"] as const,
      color: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Cardápio da Semana",
      description: "Confira o cardápio do refeitório para a semana",
      icon: <CalendarDays className="h-8 w-8 text-green-500" />,
      to: "/cardapio-semana",
      allowedTypes: ["selecao", "colaborador", "comum"] as const,
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400"
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user) {
    return <p>Por favor, faça login.</p>;
  }

  return (
    <div className="container py-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {quickAccessCards.map((card, index) => (
          <QuickAccessCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
