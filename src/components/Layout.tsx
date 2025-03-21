
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-pulse text-blue-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gray-900">
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 px-4 py-8 animate-fade-in text-gray-300">
            {/* Mobile Sidebar Trigger */}
            {isMobile && (
              <div className="mb-4">
                <SidebarTrigger>
                  <Menu className="h-5 w-5 text-blue-500" />
                </SidebarTrigger>
              </div>
            )}
            <Outlet />
          </main>
        </div>
        <footer className="py-4 px-4 bg-gray-900 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Teuto360 - Todos os direitos reservados</p>
        </footer>
      </div>
    </SidebarProvider>
  );
};
