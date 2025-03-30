import React, { createContext, useContext, useEffect, useState } from "react";
import { User, getStoredUser, loginUser, logoutUser, storeUser, shouldShowRoute } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  shouldShowRoute: (allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum'>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        console.log("User loaded from storage:", storedUser.nome, "Type:", storedUser.tipo_usuario);
      }
    } catch (error) {
      console.error("Erro ao recuperar usuário do storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await loginUser(username, password);
      if (user) {
        setUser(user);
        storeUser(user);
        toast.success(`Bem-vindo, ${user.nome}!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    toast.info("Você foi desconectado");
    navigate("/login");
  };

  const checkShouldShowRoute = (allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum'>) => {
    return shouldShowRoute(user, allowedTypes);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        shouldShowRoute: checkShouldShowRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedTypes?: ReadonlyArray<'admin' | 'selecao' | 'gestor' | 'colaborador' | 'comum'>;
}> = ({ children, allowedTypes = ["admin", "selecao", "gestor", "colaborador", "comum"] as const }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user) {
        const isAllowed = user.admin || allowedTypes.includes(user.tipo_usuario);
        console.log("Route access check:", {
          userType: user.tipo_usuario,
          admin: user.admin,
          allowedTypes,
          isAllowed
        });
        
        if (!isAllowed) {
          toast.error("Você não tem permissão para acessar esta página");
          navigate("/dashboard");
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, allowedTypes]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-primary">Carregando...</div>
    </div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};
