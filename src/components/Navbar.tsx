import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Building2, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
  name: string;
  href: string;
  allowedTypes: ('admin' | 'comum' | 'refeicao')[];
  icon?: React.ReactNode;
}

const navLinks: NavLink[] = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    allowedTypes: ["admin", "comum", "refeicao"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  },
  { 
    name: "Transporte Rota", 
    href: "/transporte-rota", 
    allowedTypes: ["admin", "comum"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg> 
  },
  { 
    name: "Transporte 12x36", 
    href: "/transporte-12x36", 
    allowedTypes: ["admin", "comum"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
  },
  { 
    name: "Refeição", 
    href: "/refeicao", 
    allowedTypes: ["admin", "refeicao"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2"/><path d="M18 15V2"/><path d="M21 15a3 3 0 1 1-6 0"/></svg>
  },
  { 
    name: "Minhas Solicitações", 
    href: "/minhas-solicitacoes", 
    allowedTypes: ["comum", "refeicao"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
  },
  { 
    name: "Administração", 
    href: "/admin", 
    allowedTypes: ["admin"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Filter links based on user type
  const filteredLinks = navLinks.filter(link => {
    if (!user) return false;
    
    // Admin can see all links
    if (user.admin) return true;
    
    // Otherwise, check if user type is in the allowed types
    return link.allowedTypes.includes(user.tipo_usuario);
  });

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">HR Portal</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:ml-6 space-x-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-white"
                )}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center">
            <div className="flex items-center">
              <div className="mr-4 flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.nome}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.tipo_usuario === 'admin' ? 'Administrador' : user?.tipo_usuario === 'refeicao' ? 'Refeição' : 'Usuário'}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <UserIcon className="h-10 w-10 text-gray-500 p-2 bg-gray-100 dark:bg-gray-800 rounded-full" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">{user?.nome}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.cargo}</div>
              </div>
              <button
                onClick={logout}
                className="ml-auto flex-shrink-0 p-2 rounded-full text-gray-500 hover:text-primary focus:outline-none"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
