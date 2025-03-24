
import {
  BarChart4,
  Bus,
  Calendar,
  Coffee,
  FileSpreadsheet,
  Home,
  MapPin,
  MessageCircle,
  User,
  Users,
  FileEdit,
  CreditCard,
} from "lucide-react";

// Define the navigation items with routes
export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
  },
  {
    title: "Comunicados",
    href: "/comunicados",
    icon: MessageCircle,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
  },
  {
    title: "Cardápio",
    href: "/cardapio-semana",
    icon: Coffee,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
  },
  {
    title: "Abono de Ponto",
    href: "/abono-ponto",
    icon: Calendar,
    allowedTypes: ["selecao", "admin", "colaborador"] as const,
  },
  {
    title: "Adesão/Cancelamento",
    href: "/adesao-cancelamento",
    icon: FileEdit,
    allowedTypes: ["selecao", "admin", "colaborador"] as const,
  },
  {
    title: "Alteração de Endereço",
    href: "/alteracao-endereco",
    icon: Home,
    allowedTypes: ["selecao", "admin", "colaborador"] as const,
  },
  {
    title: "Mudança de Turno",
    href: "/mudanca-turno",
    icon: Calendar,
    allowedTypes: ["selecao", "admin", "colaborador"] as const,
  },
  {
    title: "Transporte (Rota)",
    href: "/transporte-rota",
    icon: Bus,
    allowedTypes: ["selecao", "admin"] as const,
  },
  {
    title: "Transporte (12x36)",
    href: "/transporte-12x36",
    icon: Bus,
    allowedTypes: ["selecao", "admin"] as const,
  },
  {
    title: "Mapa de Rotas",
    href: "/mapa-rotas",
    icon: MapPin,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
  },
  {
    title: "Refeição",
    href: "/refeicao",
    icon: Coffee,
    allowedTypes: ["admin", "refeicao"] as const,
  },
  {
    title: "Avaliação",
    href: "/avaliacao",
    icon: FileSpreadsheet,
    allowedTypes: ["admin", "refeicao"] as const,
  },
  {
    title: "Oferta de Caronas",
    href: "/oferta-caronas",
    icon: User,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
  },
  {
    title: "Gerenciar Comunicados",
    href: "/gerenciar-comunicados",
    icon: MessageCircle,
    allowedTypes: ["admin"] as const,
  },
  {
    title: "Gerenciar Cardápio",
    href: "/gerenciar-cardapio",
    icon: Coffee,
    allowedTypes: ["admin"] as const,
  },
  {
    title: "Gerenciar Cartões",
    href: "/gerenciar-cartoes",
    icon: CreditCard,
    allowedTypes: ["admin"] as const,
  },
  {
    title: "Consulta de Cartão",
    href: "/consulta-cartao",
    icon: CreditCard,
    allowedTypes: ["admin", "colaborador"] as const,
  },
  {
    title: "Minhas Solicitações",
    href: "/minhas-solicitacoes",
    icon: FileSpreadsheet,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: BarChart4,
    allowedTypes: ["admin"] as const,
  },
  {
    title: "Usuários",
    href: "/gerenciar-usuarios",
    icon: Users,
    allowedTypes: ["admin"] as const,
    requiredUser: "artur.neto", // This is the special restriction for artur.neto only
  },
];
