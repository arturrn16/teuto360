
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-pulse text-blue-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will be handled by ProtectedRoute
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-white text-gray-800">
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 px-4 py-8 animate-fade-in">
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
        </div>
        <footer className="py-4 px-4 bg-white border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Teuto360 - Todos os direitos reservados</p>
        </footer>
      </div>
    </SidebarProvider>
  );
};
