
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
  Bell,
  Users
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
    icon: <LayoutDashboard className="h-5 w-5 text-purple-500" />,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Minhas Solicitações", 
    href: "/minhas-solicitacoes", 
    icon: <FileText className="h-5 w-5 text-emerald-500" />,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Transporte", 
    href: "#", // No direct link
    icon: <Car className="h-5 w-5 text-blue-500" />,
    allowedTypes: ["colaborador", "comum"] as const,
    children: [
      { 
        name: "Mapa de Rotas", 
        href: "/mapa-rotas", 
        icon: <MapPin className="h-5 w-5 text-red-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Uso de Rota", 
        href: "/transporte-rota", 
        icon: <Route className="h-5 w-5 text-indigo-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Mudança de Turno", 
        href: "/mudanca-turno", 
        icon: <Clock className="h-5 w-5 text-amber-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Alteração de Endereço", 
        href: "/alteracao-endereco", 
        icon: <Home className="h-5 w-5 text-cyan-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Adesão/Cancelamento", 
        href: "/adesao-cancelamento", 
        icon: <ClipboardCheck className="h-5 w-5 text-teal-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Abono de Ponto", 
        href: "/abono-ponto", 
        icon: <CheckCircle className="h-5 w-5 text-lime-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Plantão 24hs", 
        href: "/plantao", 
        icon: <Phone className="h-5 w-5 text-orange-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Avaliação", 
        href: "/avaliacao", 
        icon: <Star className="h-5 w-5 text-yellow-500" />,
        allowedTypes: ["colaborador", "comum"] as const
      },
    ]
  },
  { 
    name: "Refeitório", 
    href: "#", // No direct link
    icon: <Utensils className="h-5 w-5 text-rose-500" />,
    allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const,
    children: [
      { 
        name: "Cardápio da Semana", 
        href: "/cardapio-semana", 
        icon: <CalendarDays className="h-5 w-5 text-green-500" />,
        allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const
      }
    ]
  },
  { 
    name: "Oferta de Caronas", 
    href: "/oferta-caronas", 
    icon: <Car className="h-5 w-5 text-sky-500" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Avisos", 
    href: "/comunicados", 
    icon: <Bell className="h-5 w-5 text-pink-500" />,
    allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const
  },
  // Admin sections
  { 
    name: "Transporte Rota", 
    href: "/transporte-rota", 
    icon: <Route className="h-5 w-5 text-violet-500" />,
    allowedTypes: ["selecao"] as const
  },
  { 
    name: "Transporte 12x36", 
    href: "/transporte-12x36", 
    icon: <Map className="h-5 w-5 text-fuchsia-500" />,
    allowedTypes: ["selecao"] as const
  },
  { 
    name: "Refeição", 
    href: "/refeicao", 
    icon: <Utensils className="h-5 w-5 text-amber-500" />,
    allowedTypes: ["refeicao"] as const
  },
  { 
    name: "Comunicados", 
    href: "/comunicados", 
    icon: <Megaphone className="h-5 w-5 text-red-400" />,
    allowedTypes: ["selecao", "refeicao"] as const
  },
  { 
    name: "Administração", 
    href: "/admin", 
    icon: <Shield className="h-5 w-5 text-emerald-600" />,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Gerenciar Comunicados", 
    href: "/gerenciar-comunicados", 
    icon: <Megaphone className="h-5 w-5 text-blue-600" />,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Gerenciar Cardápio", 
    href: "/gerenciar-cardapio", 
    icon: <Utensils className="h-5 w-5 text-purple-600" />,
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
