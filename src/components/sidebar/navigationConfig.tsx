import {
  Home,
  CreditCard,
  Clock,
  FileText,
  Users,
  Map,
  Calendar,
  Utensils,
  Bell,
  Truck,
  UserPlus,
  BarChart3,
  Clock8,
  User,
  Route,
  Car,
  BadgeCheck
} from "lucide-react";

export type UserType = 'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum' | 'refeicao';

export interface NavItem {
  href: string;
  name: string;
  icon: React.ReactNode;
  allowedTypes: UserType[];
  children?: NavItem[];
}

export const getUserRoleLabel = (tipoUsuario: string): string => {
  switch (tipoUsuario) {
    case 'admin':
      return 'Administrador';
    case 'selecao':
      return 'Seleção';
    case 'gestor':
      return 'Gestor';
    case 'colaborador':
      return 'Colaborador';
    default:
      return 'Colaborador';
  }
};

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    name: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
  },
  {
    href: "/perfil",
    name: "Meu Perfil",
    icon: <User className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
  },
  {
    href: "/comunicados",
    name: "Comunicados",
    icon: <Bell className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
  },
  {
    href: "/cardapio-semana",
    name: "Cardápio",
    icon: <Utensils className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
  },
  {
    href: "/admin",
    name: "Admin",
    icon: <Users className="h-5 w-5" />,
    allowedTypes: ['admin'],
    children: [
      {
        href: "/gerenciar-usuarios",
        name: "Gerenciar Usuários",
        icon: <UserPlus className="h-5 w-5" />,
        allowedTypes: ['admin'],
      },
      {
        href: "/gerenciar-comunicados",
        name: "Gerenciar Comunicados",
        icon: <FileText className="h-5 w-5" />,
        allowedTypes: ['admin'],
      },
      {
        href: "/gerenciar-cardapio",
        name: "Gerenciar Cardápio",
        icon: <Utensils className="h-5 w-5" />,
        allowedTypes: ['admin'],
      },
      {
        href: "/gerenciar-cartoes",
        name: "Gerenciar Cartões",
        icon: <CreditCard className="h-5 w-5" />,
        allowedTypes: ['admin'],
      },
      {
        href: "/relatorios",
        name: "Relatórios",
        icon: <BarChart3 className="h-5 w-5" />,
        allowedTypes: ['admin'],
      },
    ]
  },
  {
    href: "/consulta-cartao",
    name: "Consulta Cartão",
    icon: <CreditCard className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao'],
  },
  {
    href: "/refeicao",
    name: "Solicitação Refeição",
    icon: <Utensils className="h-5 w-5" />,
    allowedTypes: ['admin', 'refeicao'],
  },
  {
    href: "/avaliacao",
    name: "Avaliação Refeição",
    icon: <Clock className="h-5 w-5" />,
    allowedTypes: ['admin', 'refeicao'],
  },
  {
    href: "#",
    name: "Transporte",
    icon: <Truck className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
    children: [
      {
        href: "/transporte-rota",
        name: "Transporte por Rota",
        icon: <Route className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/transporte-12x36",
        name: "Transporte 12x36",
        icon: <Clock8 className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/mapa-rotas",
        name: "Mapa de Rotas",
        icon: <Map className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/oferta-caronas",
        name: "Oferta de Caronas",
        icon: <Car className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
    ]
  },
  {
    href: "#",
    name: "Solicitações",
    icon: <FileText className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
    children: [
      {
        href: "/abono-ponto",
        name: "Abono de Ponto",
        icon: <Clock className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/adesao-cancelamento",
        name: "Adesão/Cancelamento",
        icon: <CreditCard className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/alteracao-endereco",
        name: "Alteração de Endereço",
        icon: <Home className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/mudanca-turno",
        name: "Mudança de Turno",
        icon: <Calendar className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
      {
        href: "/minhas-solicitacoes",
        name: "Minhas Solicitações",
        icon: <FileText className="h-5 w-5" />,
        allowedTypes: ['admin', 'selecao', 'gestor', 'colaborador', 'comum'],
      },
    ]
  },
  {
    href: "/plantao",
    name: "Plantão",
    icon: <Clock className="h-5 w-5" />,
    allowedTypes: ['admin', 'selecao'],
  },
];
