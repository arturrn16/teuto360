import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Clock, FileText, Route, Map, Utensils, Shield, Home, UserCheck, Phone, Star, MapPin, ClipboardCheck, Replace, Car, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      title: "Transporte Rota",
      description: "Solicite transporte para rotas regulares",
      icon: <Route className="h-8 w-8 text-blue-500" />,
      to: "/transporte-rota",
      allowedTypes: ["admin", "selecao"],
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Transporte 12x36",
      description: "Solicite transporte para turnos 12x36",
      icon: <Map className="h-8 w-8 text-indigo-500" />,
      to: "/transporte-12x36",
      allowedTypes: ["admin", "selecao"],
      color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Uso de Rota",
      description: "Solicite transporte para rotas regulares",
      icon: <Route className="h-8 w-8 text-blue-500" />,
      to: "/transporte-rota",
      allowedTypes: ["colaborador", "comum"],
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Minhas Solicitações",
      description: "Visualize todas as suas solicitações",
      icon: <FileText className="h-8 w-8 text-violet-500" />,
      to: "/minhas-solicitacoes",
      allowedTypes: ["selecao", "refeicao", "colaborador", "comum"],
      color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
      textColor: "text-violet-600 dark:text-violet-400"
    },
    {
      title: "Solicitar Refeição",
      description: "Solicite refeições para colaboradores",
      icon: <Utensils className="h-8 w-8 text-emerald-500" />,
      to: "/refeicao",
      allowedTypes: ["admin", "refeicao"],
      color: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Administração",
      description: "Gerencie todas as solicitações",
      icon: <Shield className="h-8 w-8 text-rose-500" />,
      to: "/admin",
      allowedTypes: ["admin"],
      color: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20",
      textColor: "text-rose-600 dark:text-rose-400"
    },
    {
      title: "Comunicados",
      description: "Visualize os comunicados importantes",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      to: "/comunicados",
      allowedTypes: ["selecao", "refeicao", "colaborador", "comum"],
      color: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Gerenciar Comunicados",
      description: "Publique e gerencie comunicados para colaboradores",
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      to: "/gerenciar-comunicados",
      allowedTypes: ["admin"],
      color: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Adesão/Cancelamento de Rota",
      description: "Solicite adesão ou cancelamento do transporte fretado",
      icon: <ClipboardCheck className="h-8 w-8 text-teal-500" />,
      to: "/adesao-cancelamento",
      allowedTypes: ["colaborador", "comum"],
      color: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
      textColor: "text-teal-600 dark:text-teal-400"
    },
    {
      title: "Mudança de Turno",
      description: "Solicite alteração do seu turno de trabalho",
      icon: <Replace className="h-8 w-8 text-cyan-500" />,
      to: "/mudanca-turno",
      allowedTypes: ["colaborador", "comum"],
      color: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
      textColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      title: "Alteração de Endereço",
      description: "Atualize seu endereço cadastrado",
      icon: <Home className="h-8 w-8 text-fuchsia-500" />,
      to: "/alteracao-endereco",
      allowedTypes: ["colaborador", "comum"],
      color: "from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/20 dark:to-fuchsia-800/20",
      textColor: "text-fuchsia-600 dark:text-fuchsia-400"
    },
    {
      title: "Abono de Ponto",
      description: "Solicite abono por problemas no transporte",
      icon: <UserCheck className="h-8 w-8 text-pink-500" />,
      to: "/abono-ponto",
      allowedTypes: ["colaborador", "comum"],
      color: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
      textColor: "text-pink-600 dark:text-pink-400"
    },
    {
      title: "Avaliação",
      description: "Avalie o serviço de transporte fretado",
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      to: "/avaliacao",
      allowedTypes: ["colaborador", "comum"],
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Plantão 24hs",
      description: "Contate o plantão do transporte fretado",
      icon: <Phone className="h-8 w-8 text-green-500" />,
      to: "/plantao",
      allowedTypes: ["colaborador", "comum"],
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Mapa de Rotas",
      description: "Visualize os mapas das rotas disponíveis",
      icon: <MapPin className="h-8 w-8 text-red-500" />,
      to: "/mapa-rotas",
      allowedTypes: ["colaborador", "comum"],
      color: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Oferta de Caronas",
      description: "Compartilhe ou encontre caronas disponíveis",
      icon: <Car className="h-8 w-8 text-purple-500" />,
      to: "/oferta-caronas",
      allowedTypes: ["colaborador", "comum"],
      color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Cardápio da Semana",
      description: "Confira o cardápio do refeitório para a semana",
      icon: <CalendarDays className="h-8 w-8 text-green-500" />,
      to: "/cardapio-semana",
      allowedTypes: ["selecao", "refeicao", "colaborador", "comum"],
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400"
    },
  ];

  const filteredCards = cards.filter(card => {
    if (!user) return false;
    
    if (user.admin) return card.title === "Administração" || card.title === "Gerenciar Comunicados";
    
    return card.allowedTypes.includes(user.tipo_usuario);
  });

  return (
    <div className="p-6 animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bem-vindo ao Sistema Teuto360®, {user?.nome}
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

        {!user?.admin && (
          <Card glass={true} hoverEffect={true} className="overflow-hidden h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 text-amber-600 dark:text-amber-400">
              <CardTitle className="text-xl font-semibold">Data e Hora</CardTitle>
              <Clock className="h-8 w-8 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                {currentTime.toLocaleTimeString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
