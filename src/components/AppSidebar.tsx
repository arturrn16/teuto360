
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, LayoutDashboard, Map, MapPin, Truck, Home, ClipboardCheck, Clock, User, Check, Star, Phone } from "lucide-react";
import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";

// Navigation structure for comum user
interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: {
    name: string;
    href: string;
  }[];
}

const comumNavItems: NavItem[] = [
  {
    name: "Página Principal",
    icon: <LayoutDashboard className="h-4 w-4" />,
    subItems: [
      {
        name: "Dashboard",
        href: "/dashboard"
      }
    ]
  },
  {
    name: "Serviços",
    icon: <Truck className="h-4 w-4" />,
    subItems: [
      {
        name: "Mapa de Rotas",
        href: "/mapa-rotas"
      },
      {
        name: "Uso de Rota",
        href: "/transporte-rota"
      },
      {
        name: "Adesão/Cancelamento",
        href: "/adesao-cancelamento"
      },
      {
        name: "Mudança de Turno",
        href: "/mudanca-turno"
      },
      {
        name: "Alteração de Endereço",
        href: "/alteracao-endereco"
      },
      {
        name: "Abono de Ponto",
        href: "/abono-ponto"
      },
      {
        name: "Avaliação",
        href: "/avaliacao"
      },
      {
        name: "Plantão 24h",
        href: "/plantao"
      }
    ]
  },
];

// Navigation items for other user types
const regularNavItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao", "refeicao", "colaborador"] as const
  },
  { 
    name: "Transporte Rota", 
    href: "/transporte-rota", 
    icon: <Truck className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao"] as const
  },
  { 
    name: "Transporte 12x36", 
    href: "/transporte-12x36", 
    icon: <Map className="h-5 w-5" />,
    allowedTypes: ["admin", "selecao"] as const
  },
  { 
    name: "Refeição", 
    href: "/refeicao", 
    icon: <User className="h-5 w-5" />,
    allowedTypes: ["admin", "refeicao"] as const
  },
  { 
    name: "Minhas Solicitações", 
    href: "/minhas-solicitacoes", 
    icon: <ClipboardCheck className="h-5 w-5" />,
    allowedTypes: ["selecao", "refeicao", "colaborador"] as const
  },
  { 
    name: "Administração", 
    href: "/admin", 
    icon: <User className="h-5 w-5" />,
    allowedTypes: ["admin"] as const
  },
  { 
    name: "Adesão/Cancelamento", 
    href: "/adesao-cancelamento", 
    icon: <ClipboardCheck className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
  { 
    name: "Mudança de Turno", 
    href: "/mudanca-turno", 
    icon: <Clock className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
  { 
    name: "Alteração de Endereço", 
    href: "/alteracao-endereco", 
    icon: <Home className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
  { 
    name: "Abono de Ponto", 
    href: "/abono-ponto", 
    icon: <Check className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
  { 
    name: "Avaliação", 
    href: "/avaliacao", 
    icon: <Star className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
  { 
    name: "Plantão 24hs", 
    href: "/plantao", 
    icon: <Phone className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
  { 
    name: "Mapa de Rotas", 
    href: "/mapa-rotas", 
    icon: <MapPin className="h-5 w-5" />,
    allowedTypes: ["colaborador"] as const
  },
];

interface SubmenuState {
  [key: string]: boolean;
}

export const AppSidebar = () => {
  const { user, shouldShowRoute } = useAuth();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<SubmenuState>({});

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  if (!user) return null;
  
  // Use the comum-specific navigation for comum users
  if (user.tipo_usuario === 'comum') {
    return (
      <Sidebar>
        <SidebarHeader className="h-14 flex items-center px-4">
          <span className="font-semibold text-lg text-primary">Teuto360®</span>
        </SidebarHeader>
        <SidebarContent>
          {comumNavItems.map((category, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel className="flex justify-between items-center cursor-pointer" onClick={() => toggleSubmenu(category.name)}>
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <ChevronDown 
                  className={cn("h-4 w-4 transition-transform", 
                  openSubmenus[category.name] ? "transform rotate-180" : "")} 
                />
              </SidebarGroupLabel>
              
              {category.subItems && openSubmenus[category.name] && (
                <SidebarMenu>
                  {category.subItems.map((item, idx) => (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                        <Link to={item.href}>
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    );
  }
  
  // Regular navigation for other user types
  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4">
        <span className="font-semibold text-lg text-primary">Teuto360®</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {regularNavItems.filter(item => shouldShowRoute(item.allowedTypes)).map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                  <Link to={item.href} className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
