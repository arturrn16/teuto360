
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
        <footer className="py-4 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Teuto360 - Todos os direitos reservados</p>
        </footer>
      </div>
    </SidebarProvider>
  );
};
