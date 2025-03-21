import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Clock, FileText, Route, Map, Utensils, Shield } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  // Dashboard cards based on user type
  const cards = [
    // Common user cards
    {
      title: "Transporte Rota",
      description: "Solicite transporte para rotas regulares",
      icon: <Route className="h-8 w-8 text-blue-500" />,
      to: "/transporte-rota",
      allowedTypes: ["admin", "comum"],
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Transporte 12x36",
      description: "Solicite transporte para turnos 12x36",
      icon: <Map className="h-8 w-8 text-indigo-500" />,
      to: "/transporte-12x36",
      allowedTypes: ["admin", "comum"],
      color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Minhas Solicitações",
      description: "Visualize todas as suas solicitações",
      icon: <FileText className="h-8 w-8 text-violet-500" />,
      to: "/minhas-solicitacoes",
      allowedTypes: ["comum", "refeicao"],
      color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
      textColor: "text-violet-600 dark:text-violet-400"
    },
    // Meal user cards
    {
      title: "Solicitar Refeição",
      description: "Solicite refeições para colaboradores",
      icon: <Utensils className="h-8 w-8 text-emerald-500" />,
      to: "/refeicao",
      allowedTypes: ["admin", "refeicao"],
      color: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    // Admin cards
    {
      title: "Administração",
      description: "Gerencie todas as solicitações",
      icon: <Shield className="h-8 w-8 text-rose-500" />,
      to: "/admin",
      allowedTypes: ["admin"],
      color: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20",
      textColor: "text-rose-600 dark:text-rose-400"
    },
  ];

  // Filter cards based on user type
  const filteredCards = cards.filter(card => {
    if (!user) return false;
    
    // Admin can see all cards
    if (user.admin) return true;
    
    // Otherwise, check if user type is in the allowed types
    return card.allowedTypes.includes(user.tipo_usuario);
  });

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bem-vindo ao Sistema de Gerenciamento de RH, {user?.nome}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => (
          <Link key={index} to={card.to} className="transition-transform hover:-translate-y-1">
            <Card glass={true} hoverEffect={true} className={cn(
              "overflow-hidden h-full transition-all", 
              "bg-gradient-to-br", 
              card.color
            )}>
              <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-3", card.textColor)}>
                <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mt-2 text-gray-600 dark:text-gray-300">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Current time card - visible to all users */}
        <Card glass={true} hoverEffect={true} className="overflow-hidden h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 text-amber-600 dark:text-amber-400">
            <CardTitle className="text-xl font-semibold">Data e Hora</CardTitle>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
