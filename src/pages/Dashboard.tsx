
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Clock, FileText, Map, Utensils, Replace, Shield, Home, UserCheck, Phone, Star, MapPin, ClipboardCheck, Car, CalendarDays, CreditCard, Users, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { UserType } from "@/components/sidebar/navigationConfig";

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  console.log("Dashboard - User type:", user?.tipo_usuario);

  // Cards para usuários comuns
  const commonUserCards = [
    {
      title: "Uso de Rota",
      description: "Solicite transporte para rotas regulares",
      icon: <MapPinned className="h-8 w-8 text-blue-500" />,
      to: "/transporte-rota",
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Minhas Solicitações",
      description: "Visualize todas as suas solicitações",
      icon: <FileText className="h-8 w-8 text-violet-500" />,
      to: "/minhas-solicitacoes",
      color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
      textColor: "text-violet-600 dark:text-violet-400"
    },
    {
      title: "Comunicados",
      description: "Visualize os comunicados importantes",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      to: "/comunicados",
      color: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Adesão/Cancelamento de Rota",
      description: "Solicite adesão ou cancelamento do transporte fretado",
      icon: <ClipboardCheck className="h-8 w-8 text-teal-500" />,
      to: "/adesao-cancelamento",
      color: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
      textColor: "text-teal-600 dark:text-teal-400"
    },
    {
      title: "Alteração de Endereço",
      description: "Atualize seu endereço cadastrado",
      icon: <Home className="h-8 w-8 text-fuchsia-500" />,
      to: "/alteracao-endereco",
      color: "from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/20 dark:to-fuchsia-800/20",
      textColor: "text-fuchsia-600 dark:text-fuchsia-400"
    },
    {
      title: "Abono de Ponto",
      description: "Solicite abono por problemas no transporte",
      icon: <UserCheck className="h-8 w-8 text-pink-500" />,
      to: "/abono-ponto",
      color: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
      textColor: "text-pink-600 dark:text-pink-400"
    },
    {
      title: "Avaliação",
      description: "Avalie o serviço de transporte fretado",
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      to: "/avaliacao",
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      textColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Plantão 24hs",
      description: "Contate o plantão do transporte fretado",
      icon: <Phone className="h-8 w-8 text-green-500" />,
      to: "/plantao",
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Mapa de Rotas",
      description: "Visualize os mapas das rotas disponíveis",
      icon: <MapPin className="h-8 w-8 text-red-500" />,
      to: "/mapa-rotas",
      color: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      textColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "Oferta de Caronas",
      description: "Compartilhe ou encontre caronas disponíveis",
      icon: <Car className="h-8 w-8 text-purple-500" />,
      to: "/oferta-caronas",
      color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Consulta de Cartão",
      description: "Verifique se seu cartão está disponível para retirada",
      icon: <CreditCard className="h-8 w-8 text-lime-500" />,
      to: "/consulta-cartao",
      color: "from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20",
      textColor: "text-lime-600 dark:text-lime-400"
    },
    {
      title: "Cardápio da Semana",
      description: "Confira o cardápio do refeitório para a semana",
      icon: <CalendarDays className="h-8 w-8 text-green-500" />,
      to: "/cardapio-semana",
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      textColor: "text-green-600 dark:text-green-400"
    },
  ];

  // Definimos os cards específicos para o tipo de usuário "gestor"
  const gestorCards = [
    {
      title: "Transporte 12x36",
      description: "Solicite transporte para turnos 12x36",
      icon: <Map className="h-8 w-8 text-indigo-500" />,
      to: "/transporte-12x36",
      color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Solicitar Refeição",
      description: "Solicite refeições para colaboradores",
      icon: <Utensils className="h-8 w-8 text-emerald-500" />,
      to: "/refeicao",
      color: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Mudança de Turno",
      description: "Solicite alteração do turno de trabalho",
      icon: <Replace className="h-8 w-8 text-cyan-500" />,
      to: "/mudanca-turno",
      color: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
      textColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      title: "Comunicados",
      description: "Visualize os comunicados importantes",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      to: "/comunicados",
      color: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      textColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  // Filtro de cards baseado no tipo de usuário
  const getCardsForUserType = () => {
    if (!user) return [];
    
    if (user.admin) {
      const cards: {
        title: string;
        description: string;
        icon: JSX.Element;
        to: string;
        allowedTypes: ReadonlyArray<UserType>;
        color: string;
        textColor: string;
      }[] = [
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
          title: "Relatórios",
          description: "Visualize relatórios e estatísticas",
          icon: <FileText className="h-8 w-8 text-indigo-600" />,
          to: "/relatorios",
          allowedTypes: ["admin"],
          color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
          textColor: "text-indigo-600 dark:text-indigo-400"
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
          title: "Gerenciar Cardápio",
          description: "Publique e gerencie cardápios do refeitório",
          icon: <Utensils className="h-8 w-8 text-purple-600" />,
          to: "/gerenciar-cardapio",
          allowedTypes: ["admin"],
          color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
          textColor: "text-purple-600 dark:text-purple-400"
        },
        {
          title: "Gerenciar Cartões",
          description: "Adicione e gerencie cartões para retirada",
          icon: <CreditCard className="h-8 w-8 text-blue-600" />,
          to: "/gerenciar-cartoes",
          allowedTypes: ["admin"],
          color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
          textColor: "text-blue-600 dark:text-blue-400"
        },
        {
          title: "Gerenciar Usuários",
          description: "Cadastre e gerencie usuários do sistema",
          icon: <Users className="h-8 w-8 text-teal-600" />,
          to: "/gerenciar-usuarios",
          allowedTypes: ["admin"],
          color: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
          textColor: "text-teal-600 dark:text-teal-400"
        },
        {
          title: "Transporte Rota",
          description: "Solicite transporte para rotas regulares",
          icon: <MapPinned className="h-8 w-8 text-blue-500" />,
          to: "/transporte-rota",
          allowedTypes: ["selecao"] as const,
          color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
          textColor: "text-blue-600 dark:text-blue-400"
        },
        {
          title: "Transporte 12x36",
          description: "Solicite transporte para turnos 12x36",
          icon: <Map className="h-8 w-8 text-indigo-500" />,
          to: "/transporte-12x36",
          allowedTypes: ["selecao", "gestor"] as const,
          color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
          textColor: "text-indigo-600 dark:text-indigo-400"
        },
        {
          title: "Uso de Rota",
          description: "Solicite transporte para rotas regulares",
          icon: <MapPinned className="h-8 w-8 text-blue-500" />,
          to: "/transporte-rota",
          allowedTypes: ["comum"] as const,
          color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
          textColor: "text-blue-600 dark:text-blue-400"
        },
        {
          title: "Minhas Solicitações",
          description: "Visualize todas as suas solicitações",
          icon: <FileText className="h-8 w-8 text-violet-500" />,
          to: "/minhas-solicitacoes",
          allowedTypes: ["selecao", "gestor", "colaborador", "comum"] as const,
          color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
          textColor: "text-violet-600 dark:text-violet-400"
        },
        {
          title: "Solicitar Refeição",
          description: "Solicite refeições para colaboradores",
          icon: <Utensils className="h-8 w-8 text-emerald-500" />,
          to: "/refeicao",
          allowedTypes: ["gestor"] as const,
          color: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
          textColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
          title: "Comunicados",
          description: "Visualize os comunicados importantes",
          icon: <FileText className="h-8 w-8 text-amber-500" />,
          to: "/comunicados",
          allowedTypes: ["selecao", "gestor", "colaborador", "comum"] as const,
          color: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
          textColor: "text-amber-600 dark:text-amber-400"
        },
        {
          title: "Adesão/Cancelamento de Rota",
          description: "Solicite adesão ou cancelamento do transporte fretado",
          icon: <ClipboardCheck className="h-8 w-8 text-teal-500" />,
          to: "/adesao-cancelamento",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
          textColor: "text-teal-600 dark:text-teal-400"
        },
        {
          title: "Mudança de Turno",
          description: "Solicite alteração do seu turno de trabalho",
          icon: <Replace className="h-8 w-8 text-cyan-500" />,
          to: "/mudanca-turno",
          allowedTypes: ["gestor"] as const,
          color: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
          textColor: "text-cyan-600 dark:text-cyan-400"
        },
        {
          title: "Alteração de Endereço",
          description: "Atualize seu endereço cadastrado",
          icon: <Home className="h-8 w-8 text-fuchsia-500" />,
          to: "/alteracao-endereco",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/20 dark:to-fuchsia-800/20",
          textColor: "text-fuchsia-600 dark:text-fuchsia-400"
        },
        {
          title: "Abono de Ponto",
          description: "Solicite abono por problemas no transporte",
          icon: <UserCheck className="h-8 w-8 text-pink-500" />,
          to: "/abono-ponto",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
          textColor: "text-pink-600 dark:text-pink-400"
        },
        {
          title: "Avaliação",
          description: "Avalie o serviço de transporte fretado",
          icon: <Star className="h-8 w-8 text-yellow-500" />,
          to: "/avaliacao",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
          textColor: "text-yellow-600 dark:text-yellow-400"
        },
        {
          title: "Plantão 24hs",
          description: "Contate o plantão do transporte fretado",
          icon: <Phone className="h-8 w-8 text-green-500" />,
          to: "/plantao",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
          textColor: "text-green-600 dark:text-green-400"
        },
        {
          title: "Mapa de Rotas",
          description: "Visualize os mapas das rotas disponíveis",
          icon: <MapPin className="h-8 w-8 text-red-500" />,
          to: "/mapa-rotas",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
          textColor: "text-red-600 dark:text-red-400"
        },
        {
          title: "Oferta de Caronas",
          description: "Compartilhe ou encontre caronas disponíveis",
          icon: <Car className="h-8 w-8 text-purple-500" />,
          to: "/oferta-caronas",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
          textColor: "text-purple-600 dark:text-purple-400"
        },
        {
          title: "Consulta de Cartão",
          description: "Verifique se seu cartão está disponível para retirada",
          icon: <CreditCard className="h-8 w-8 text-lime-500" />,
          to: "/consulta-cartao",
          allowedTypes: ["gestor", "comum"] as const,
          color: "from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20",
          textColor: "text-lime-600 dark:text-lime-400"
        },
        {
          title: "Cardápio da Semana",
          description: "Confira o cardápio do refeitório para a semana",
          icon: <CalendarDays className="h-8 w-8 text-green-500" />,
          to: "/cardapio-semana",
          allowedTypes: ["selecao", "comum"] as const,
          color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
          textColor: "text-green-600 dark:text-green-400"
        },
      ];
    
      const filteredCards = cards.filter(card => {
        if (!user) return false;
        
        if (user.admin) {
          return card.allowedTypes.includes('admin');
        }
        
        return card.allowedTypes.includes(user.tipo_usuario as UserType);
      });
      return filteredCards;
    }
    
    if (user.tipo_usuario === 'gestor') {
      return gestorCards;
    }
    
    if (user.tipo_usuario === 'comum') {
      return commonUserCards;
    }
    
    return []; // Para outros tipos de usuário
  };

  // Para usuários do tipo gestor, mostramos apenas os cards específicos
  // Para usuários comuns, mostramos os cards de usuário comum
  const filteredCards = user?.tipo_usuario === 'gestor' 
    ? gestorCards 
    : (user?.tipo_usuario === 'comum' 
        ? commonUserCards 
        : getCardsForUserType());

  // Determine the greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {getGreeting()}, {user?.nome?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          {currentTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          {' • '}
          {currentTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredCards.map((card, index) => (
          <Link 
            key={index}
            to={card.to}
            className="block h-full transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          >
            <Card 
              className={`h-full border-0 shadow-md bg-gradient-to-br ${card.color}`}
              hoverEffect
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  {card.icon}
                </div>
                <CardTitle className={`mt-4 ${card.textColor}`}>{card.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
