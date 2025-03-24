
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthLoaded } from "./Layout";

export const Navbar = () => {
  const [authProviderAvailable, setAuthProviderAvailable] = useState(false);
  const { authLoaded } = useAuthLoaded();
  
  // References to auth data
  let user: any = null;
  let logout: any = null;
  
  // Only try to use auth if the provider is available
  useEffect(() => {
    if (authLoaded) {
      try {
        // Just testing if we can access the context
        const auth = useAuth();
        setAuthProviderAvailable(true);
        user = auth.user;
        logout = auth.logout;
      } catch (error) {
        console.error("Auth provider not available for Navbar:", error);
      }
    }
  }, [authLoaded]);

  if (!authProviderAvailable || !user) return null;

  return (
    <div className="flex justify-end items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center">
        <div className="mr-4 flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.nome}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user?.tipo_usuario === 'admin' ? 'Administrador' : 
             user?.tipo_usuario === 'refeicao' ? 'Refeição' : 
             user?.tipo_usuario === 'selecao' ? 'Seleção' :
             user?.tipo_usuario === 'comum' ? 'Colaborador' : 'Colaborador'}
          </span>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
