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
    icon: <span className="text-red-400 text-xl">🏠</span>,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Minhas Solicitações", 
    href: "/minhas-solicitacoes", 
    icon: <span className="text-amber-600 text-xl">📋</span>,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Transporte", 
    href: "#", // No direct link
    icon: <span className="text-blue-600 text-xl">🚌</span>,
    allowedTypes: ["colaborador", "comum"] as const,
    children: [
      { 
        name: "Mapa de Rotas", 
        href: "/mapa-rotas", 
        icon: <span className="text-red-500 text-xl">📍</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Uso de Rota", 
        href: "/transporte-rota", 
        icon: <span className="text-indigo-500 text-xl">🚏</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Mudança de Turno", 
        href: "/mudanca-turno", 
        icon: <span className="text-amber-500 text-xl">⏰</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Alteração de Endereço", 
        href: "/alteracao-endereco", 
        icon: <span className="text-cyan-500 text-xl">🏠</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Adesão/Cancelamento", 
        href: "/adesao-cancelamento", 
        icon: <span className="text-teal-500 text-xl">✅</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Abono de Ponto", 
        href: "/abono-ponto", 
        icon: <span className="text-lime-500 text-xl">✓</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Plantão 24hs", 
        href: "/plantao", 
        icon: <span className="text-orange-500 text-xl">📞</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
      { 
        name: "Avaliação", 
        href: "/avaliacao", 
        icon: <span className="text-yellow-500 text-xl">⭐</span>,
        allowedTypes: ["colaborador", "comum"] as const
      },
    ]
  },
  { 
    name: "Refeitório", 
    href: "#", // No direct link
    icon: <span className="text-gray-600 text-xl">🍽️</span>,
    allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const,
    children: [
      { 
        name: "Cardápio da Semana", 
        href: "/cardapio-semana", 
        icon: <span className="text-green-500 text-xl">📅</span>,
        allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const
      }
    ]
  },
  { 
    name: "Empréstimo Consignado", 
    href: "#", 
    icon: <span className="text-yellow-600 text-xl">💰</span>,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Plano de Saúde/Odonto", 
    href: "#", 
    icon: <span className="text-blue-500 text-xl">💙</span>,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Departamento Pessoal", 
    href: "#", 
    icon: <span className="text-blue-400 text-xl">👨‍👩‍👧‍👦</span>,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Avisos", 
    href: "/comunicados", 
    icon: <span className="text-red-500 text-xl">📢</span>,
    allowedTypes: ["colaborador", "comum", "selecao", "refeicao"] as const
  },
  { 
    name: "Ofertas de Carona", 
    href: "/oferta-caronas", 
    icon: <span className="text-red-600 text-xl">🚗</span>,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Seleção Interna", 
    href: "#", 
    icon: <span className="text-amber-700 text-xl">💼</span>,
    allowedTypes: ["colaborador", "comum"] as const
  },
  // Admin sections - keep these for admin users
  { 
    name: "Transporte Rota", 
    href: "/transporte-rota", 
    icon: <span className="text-violet-500 text-xl">🚏</span>,
    allowedTypes: ["selecao"] as const
  },
  { 
    name: "Transporte 12x36", 
    href: "/transporte-12x36", 
    icon: <span className="text-fuchsia-500 text-xl">🗺️</span>,
    allowedTypes: ["selecao"] as const
  },
  { 
    name: "Refeição", 
    href: "/refeicao", 
    icon: <span className="text-amber-500 text-xl">🍽️</span>,
    allowedTypes: ["refeicao"] as const
  },
  { 
    name: "Comunicados", 
    href: "/comunicados", 
    icon: <span className="text-red-400 text-xl">📢</span>,
    allowedTypes: ["selecao", "refeicao"] as const
  },
  { 
    name: "Administração", 
    href: "/admin", 
    icon: <span className="text-emerald-600 text-xl">🛡️</span>,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Gerenciar Comunicados", 
    href: "/gerenciar-comunicados", 
    icon: <span className="text-blue-600 text-xl">📢</span>,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Gerenciar Cardápio", 
    href: "/gerenciar-cardapio", 
    icon: <span className="text-purple-600 text-xl">🍽️</span>,
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
