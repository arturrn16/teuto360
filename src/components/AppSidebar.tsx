
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
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
  LogOut,
  Building2
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

// Types for user roles
type UserType = 'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum';

// Navigation structure
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  allowedTypes: ReadonlyArray<UserType>;
}

const navItems: NavItem[] = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
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
    name: "Minhas Solicitações", 
    href: "/minhas-solicitacoes", 
    icon: <FileText className="h-5 w-5" />,
    allowedTypes: ["selecao", "refeicao", "colaborador", "comum"] as const
  },
  { 
    name: "Administração", 
    href: "/admin", 
    icon: <Shield className="h-5 w-5" />,
    allowedTypes: ["admin"] as const
  },
  // Items for colaborador/comum
  { 
    name: "Uso de Rota", 
    href: "/transporte-rota", 
    icon: <Route className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Adesão/Cancelamento", 
    href: "/adesao-cancelamento", 
    icon: <ClipboardCheck className="h-5 w-5" />,
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
    name: "Abono de Ponto", 
    href: "/abono-ponto", 
    icon: <CheckCircle className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Avaliação", 
    href: "/avaliacao", 
    icon: <Star className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Plantão 24hs", 
    href: "/plantao", 
    icon: <Phone className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  { 
    name: "Mapa de Rotas", 
    href: "/mapa-rotas", 
    icon: <MapPin className="h-5 w-5" />,
    allowedTypes: ["colaborador", "comum"] as const
  },
  // Adding Dashboard for admin but with a separate allowedTypes array
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedTypes: ["admin"] as const
  },
];

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  // Filter links based on user type
  const filteredLinks = navItems.filter(link => {
    // Check if user type is in the allowed types
    return link.allowedTypes.includes(user.tipo_usuario as UserType);
  });

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <Building2 className="h-8 w-8 text-primary mr-2" />
        <span className="font-semibold text-lg text-primary">Teuto360®</span>
      </SidebarHeader>
      
      <SidebarContent>
        {/* User info */}
        <div className="p-4 mb-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.nome}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.tipo_usuario === 'admin' ? 'Administrador' : 
                 user.tipo_usuario === 'refeicao' ? 'Refeição' : 
                 user.tipo_usuario === 'selecao' ? 'Seleção' :
                 user.tipo_usuario === 'comum' ? 'Colaborador' : 'Colaborador'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <SidebarMenu>
          {filteredLinks.map((item, index) => (
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
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Sair</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
