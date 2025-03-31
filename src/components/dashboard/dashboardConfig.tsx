
import { 
  Clock, FileText, Map, Utensils, Replace, Shield, Home, 
  UserCheck, Phone, Star, MapPin, ClipboardCheck, Car, 
  CalendarDays, CreditCard, Users, MapPinned 
} from "lucide-react";
import { UserType } from "@/components/sidebar/navigationConfig";

export type CardConfig = {
  title: string;
  description: string;
  icon: JSX.Element;
  to: string;
  color: string;
  textColor: string;
  allowedTypes?: readonly UserType[];
};

// Cards para usuários comuns
export const commonUserCards: CardConfig[] = [
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
export const gestorCards: CardConfig[] = [
  {
    title: "Minhas Solicitações",
    description: "Visualize todas as suas solicitações",
    icon: <FileText className="h-8 w-8 text-violet-500" />,
    to: "/minhas-solicitacoes",
    color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
    textColor: "text-violet-600 dark:text-violet-400"
  },
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

// Cards específicos para o tipo de usuário "selecao"
export const selecaoCards: CardConfig[] = [
  {
    title: "Minhas Solicitações",
    description: "Visualize todas as suas solicitações",
    icon: <FileText className="h-8 w-8 text-violet-500" />,
    to: "/minhas-solicitacoes",
    color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
    textColor: "text-violet-600 dark:text-violet-400"
  },
  {
    title: "Transporte Rota",
    description: "Solicite transporte para rotas regulares",
    icon: <MapPinned className="h-8 w-8 text-violet-500" />,
    to: "/transporte-rota",
    color: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
    textColor: "text-violet-600 dark:text-violet-400"
  },
  {
    title: "Transporte 12x36",
    description: "Solicite transporte para turnos 12x36",
    icon: <Map className="h-8 w-8 text-indigo-500" />,
    to: "/transporte-12x36",
    color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
    textColor: "text-indigo-600 dark:text-indigo-400"
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

// Cards para administradores
export const adminCards: CardConfig[] = [
  {
    title: "Administração",
    description: "Gerencie todas as solicitações",
    icon: <Shield className="h-8 w-8 text-rose-500" />,
    to: "/admin",
    color: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20",
    textColor: "text-rose-600 dark:text-rose-400",
    allowedTypes: ["admin"] as const
  },
  {
    title: "Relatórios",
    description: "Visualize relatórios e estatísticas",
    icon: <FileText className="h-8 w-8 text-indigo-600" />,
    to: "/relatorios",
    color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
    allowedTypes: ["admin"] as const
  },
  {
    title: "Gerenciar Comunicados",
    description: "Publique e gerencie comunicados para colaboradores",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    to: "/gerenciar-comunicados",
    color: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    textColor: "text-orange-600 dark:text-orange-400",
    allowedTypes: ["admin"] as const
  },
  {
    title: "Gerenciar Cardápio",
    description: "Publique e gerencie cardápios do refeitório",
    icon: <Utensils className="h-8 w-8 text-purple-600" />,
    to: "/gerenciar-cardapio",
    color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    textColor: "text-purple-600 dark:text-purple-400",
    allowedTypes: ["admin"] as const
  },
  {
    title: "Gerenciar Cartões",
    description: "Adicione e gerencie cartões para retirada",
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    to: "/gerenciar-cartoes",
    color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    textColor: "text-blue-600 dark:text-blue-400",
    allowedTypes: ["admin"] as const
  },
  {
    title: "Gerenciar Usuários",
    description: "Cadastre e gerencie usuários do sistema",
    icon: <Users className="h-8 w-8 text-teal-600" />,
    to: "/gerenciar-usuarios",
    color: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
    textColor: "text-teal-600 dark:text-teal-400",
    allowedTypes: ["admin"] as const
  },
];
