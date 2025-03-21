
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <Outlet />
      </main>
      <footer className="py-4 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SGR TEUTO - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};
