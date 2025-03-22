
import { BarChart2, CalendarCheck, FileText, MessageSquare, Users, Bus, FileEdit, Calendar, CheckSquare, Home, Briefcase, MapPin, Map, CarFront, Utensils } from "lucide-react";
import { ReactNode } from "react";

// Define types for navigation
export type UserType = 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum';

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  allowedTypes: ReadonlyArray<UserType>;
  children?: NavItem[];
  name?: string; // For backward compatibility
}

export interface NavSection {
  title: string;
  items: NavItem[];
  name?: string; // For backward compatibility
}

export const navigationConfig: NavSection[] = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <Home className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
      },
      {
        title: "Comunicados",
        href: "/comunicados",
        icon: <MessageSquare className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
      },
    ] as const,
  },
  {
    title: "Transporte",
    items: [
      {
        title: "Transporte 12x36",
        href: "/transporte-12x36",
        icon: <Bus className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Transporte Rota",
        href: "/transporte-rota",
        icon: <Map className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Mapa Rotas",
        href: "/mapa-rotas",
        icon: <MapPin className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Oferta de Caronas",
        href: "/oferta-caronas",
        icon: <CarFront className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
    ] as const,
  },
  {
    title: "Refeitório",
    items: [
      {
        title: "Cardápio da Semana",
        href: "/cardapio-semana",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
      },
    ] as const,
  },
  {
    title: "Recursos Humanos",
    items: [
      {
        title: "Solicitações",
        href: "/minhas-solicitacoes",
        icon: <FileText className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
      },
      {
        title: "Abono de Ponto",
        href: "/abono-ponto",
        icon: <CheckSquare className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Alteração de Endereço",
        href: "/alteracao-endereco",
        icon: <MapPin className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Mudança de Turno",
        href: "/mudanca-turno",
        icon: <Calendar className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Adesão/Cancelamento",
        href: "/adesao-cancelamento",
        icon: <FileEdit className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Plantão",
        href: "/plantao",
        icon: <CalendarCheck className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "colaborador"] as const,
      },
      {
        title: "Refeição",
        href: "/refeicao",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
      },
    ] as const,
  },
  {
    title: "Administração",
    items: [
      {
        title: "Gerenciar Comunicados",
        href: "/gerenciar-comunicados",
        icon: <MessageSquare className="h-5 w-5" />,
        allowedTypes: ["admin"] as const,
      },
      {
        title: "Avaliação",
        href: "/avaliacao",
        icon: <BarChart2 className="h-5 w-5" />,
        allowedTypes: ["admin"] as const,
      },
      {
        title: "Gerenciar Cardápio",
        href: "/gerenciar-cardapio",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ["admin"] as const,
      },
    ] as const,
  },
];

// Export navItems for compatibility with existing code
export const navItems = navigationConfig;

// Function to get the user role label for display
export const getUserRoleLabel = (role: UserType): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'selecao':
      return 'Seleção';
    case 'refeicao':
      return 'Refeição';
    case 'colaborador':
    case 'comum':
      return 'Colaborador';
    default:
      return 'Usuário';
  }
};
