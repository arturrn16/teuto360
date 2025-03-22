
import { BarChart2, CalendarCheck, FileText, MessageSquare, Users, Bus, FileEdit, Calendar, CheckSquare, Home, Briefcase, MapPin, Map, CarFront, Utensils } from "lucide-react";

export type UserType = 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  allowedTypes: ReadonlyArray<UserType>;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador", "comum"],
  },
  {
    name: "Comunicados",
    href: "/comunicados",
    icon: <MessageSquare className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador", "comum"],
  },
  {
    name: "Transporte",
    href: "#",
    icon: <Bus className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao", "colaborador", "comum"],
    children: [
      {
        name: "Transporte 12x36",
        href: "/transporte-12x36",
        icon: <Bus className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Transporte Rota",
        href: "/transporte-rota",
        icon: <Map className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Mapa Rotas",
        href: "/mapa-rotas",
        icon: <MapPin className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Oferta de Caronas",
        href: "/oferta-caronas",
        icon: <CarFront className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
    ],
  },
  {
    name: "Refeitório",
    href: "#",
    icon: <Utensils className="h-5 w-5" />,
    allowedTypes: ["comum"],
    children: [
      {
        name: "Cardápio da Semana",
        href: "/cardapio-semana",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ["comum"],
      },
    ],
  },
  {
    name: "Recursos Humanos",
    href: "#",
    icon: <Briefcase className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador", "comum"],
    children: [
      {
        name: "Solicitações",
        href: "/minhas-solicitacoes",
        icon: <FileText className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador", "comum"],
      },
      {
        name: "Abono de Ponto",
        href: "/abono-ponto",
        icon: <CheckSquare className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Alteração de Endereço",
        href: "/alteracao-endereco",
        icon: <MapPin className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Mudança de Turno",
        href: "/mudanca-turno",
        icon: <Calendar className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Adesão/Cancelamento",
        href: "/adesao-cancelamento",
        icon: <FileEdit className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Plantão",
        href: "/plantao",
        icon: <CalendarCheck className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador", "comum"],
      },
      {
        name: "Refeição",
        href: "/refeicao",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador", "comum"],
      },
    ],
  },
  {
    name: "Administração",
    href: "#",
    icon: <Users className="h-5 w-5" />,
    allowedTypes: ["admin"],
    children: [
      {
        name: "Gerenciar Comunicados",
        href: "/gerenciar-comunicados",
        icon: <MessageSquare className="h-5 w-5" />,
        allowedTypes: ["admin"],
      },
      {
        name: "Avaliação",
        href: "/avaliacao",
        icon: <BarChart2 className="h-5 w-5" />,
        allowedTypes: ["admin"],
      },
      {
        name: "Gerenciar Cardápio",
        href: "/gerenciar-cardapio",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ["admin"],
      },
    ],
  },
];

// Helper function to get user role label
export const getUserRoleLabel = (role: UserType): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'selecao':
      return 'Seleção';
    case 'refeicao':
      return 'Refeição';
    case 'colaborador':
      return 'Colaborador';
    case 'comum':
      return 'Comum';
    default:
      return 'Usuário';
  }
};
