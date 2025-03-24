
import { useAuth } from "@/context/AuthContext";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AlignLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIdleTimeout } from "@/hooks/use-idle-timeout";

export const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Inicializa o hook de timeout por inatividade
  useIdleTimeout({
    idleTime: 15, // 15 minutos de inatividade para logout
    warningTime: 1, // Aviso 1 minuto antes do logout
  });

  // Detectar scroll para ajustar estilos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white">
        <div className="animate-pulse text-blue-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gray-50 text-gray-800">
        <div className="flex flex-1 relative overflow-hidden">
          <AppSidebar />
          <main className="flex-1 px-0 sm:px-4 py-0 sm:py-8 animate-fade-in w-full max-w-full overflow-x-hidden">
            {isMobile && (
              <div className={cn(
                "sticky top-0 z-10 mb-0 transition-all duration-200 py-2 px-4",
                isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : ""
              )}>
                <SidebarTrigger className="flex items-center gap-2 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200">
                  <AlignLeft className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-500 font-medium">Menu</span>
                </SidebarTrigger>
              </div>
            )}
            <div className="w-full transition-all">
              <Outlet />
            </div>
          </main>
        </div>
        {!isMobile && (
          <footer className="py-3 sm:py-4 px-4 bg-white border-t border-gray-200 text-center text-gray-600 text-xs sm:text-sm">
            <p>© {new Date().getFullYear()} ConexãoRH® - Todos os direitos reservados</p>
          </footer>
        )}
      </div>
    </SidebarProvider>
  );
};
