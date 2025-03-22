
import { 
  LayoutDashboard, 
  Route, 
  Map, 
  Utensils, 
  FileText, 
  Shield, 
  Home, 
  ClipboardCheck, 
  Clock, 
  User, 
  CheckCircle, 
  Star, 
  Phone, 
  MapPin,
  Replace,
  Megaphone,
  Car,
  CalendarDays,
  DollarSign,
  Heart,
  Briefcase,
  Bell
} from "lucide-react";
import React from "react";

// Types for user roles
export type UserType = 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum';

// Navigation structure with support for nested items
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
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Minhas Solicitações", 
    href: "/minhas-solicitacoes", 
    icon: <FileText className="h-5 w-5" />,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Transporte", 
    href: "#", // No direct link
    icon: <Car className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const,
    children: [
      { 
        name: "Mapa de Rotas", 
        href: "/mapa-rotas", 
        icon: <MapPin className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Uso de Rota", 
        href: "/transporte-rota", 
        icon: <Route className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Mudança de Turno", 
        href: "/mudanca-turno", 
        icon: <Clock className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Alteração de Endereço", 
        href: "/alteracao-endereco", 
        icon: <Home className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Adesão/Cancelamento", 
        href: "/adesao-cancelamento", 
        icon: <ClipboardCheck className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Abono de Ponto", 
        href: "/abono-ponto", 
        icon: <CheckCircle className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Plantão 24hs", 
        href: "/plantao", 
        icon: <Phone className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Avaliação", 
        href: "/avaliacao", 
        icon: <Star className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
    ]
  },
  { 
    name: "Refeitório", 
    href: "#", // No direct link
    icon: <Utensils className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const,
    children: [
      { 
        name: "Cardápio da Semana", 
        href: "/cardapio-semana", 
        icon: <CalendarDays className="h-5 w-5" />,
        allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const
      }
    ]
  },
  { 
    name: "Oferta de Caronas", 
    href: "/oferta-caronas", 
    icon: <Car className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Empréstimo Consignado", 
    href: "#", 
    icon: <DollarSign className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Plano de Saúde/Odonto", 
    href: "#", 
    icon: <Heart className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Departamento Pessoal", 
    href: "#", 
    icon: <Briefcase className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Avisos", 
    href: "/comunicados", 
    icon: <Bell className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const
  },
  { 
    name: "Seleção Interna", 
    href: "#", 
    icon: <Briefcase className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  // Admin sections
  { 
    name: "Transporte Rota", 
    href: "/transporte-rota", 
    icon: <Route className="h-5 w-5" />,
    allowedTypes: ["selecao"] as const
  },
  { 
    name: "Transporte 12x36", 
    href: "/transporte-12x36", 
    icon: <Map className="h-5 w-5" />,
    allowedTypes: ["selecao"] as const
  },
  { 
    name: "Refeição", 
    href: "/refeicao", 
    icon: <Utensils className="h-5 w-5" />,
    allowedTypes: ["refeicao"] as const
  },
  { 
    name: "Comunicados", 
    href: "/comunicados", 
    icon: <Megaphone className="h-5 w-5" />,
    allowedTypes: ["selecao", "refeicao"] as const
  },
  { 
    name: "Administração", 
    href: "/admin", 
    icon: <Shield className="h-5 w-5" />,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Gerenciar Comunicados", 
    href: "/gerenciar-comunicados", 
    icon: <Megaphone className="h-5 w-5" />,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Gerenciar Cardápio", 
    href: "/gerenciar-cardapio", 
    icon: <Utensils className="h-5 w-5" />,
    allowedTypes: ["admin"] as const
  },
];

export const getUserRoleLabel = (roleType: string): string => {
  switch (roleType) {
    case 'admin':
      return 'Administrador';
    case 'refeicao':
      return 'Refeição';
    case 'selecao':
      return 'Seleção';
    case 'comum':
    case 'colaborador':
    default:
      return 'Colaborador';
  }
};
