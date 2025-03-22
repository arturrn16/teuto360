
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, getStoredUser, loginUser, logoutUser, storeUser, shouldShowRoute, updateUserPassword } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  changePassword: (newPassword: string) => Promise<boolean>;
  shouldShowRoute: (allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está logado
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      // Verifica se é o primeiro login do usuário
      if (storedUser.first_login) {
        setIsFirstLogin(true);
        navigate("/change-password");
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await loginUser(username, password);
      if (user) {
        setUser(user);
        storeUser(user);
        
        // Verifica se é o primeiro login
        if (user.first_login) {
          setIsFirstLogin(true);
          toast.info("Por favor, altere sua senha no primeiro acesso.");
          navigate("/change-password");
        } else {
          toast.success(`Bem-vindo, ${user.nome}!`);
        }
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
    setIsFirstLogin(false);
    toast.info("Você foi desconectado");
    navigate("/login");
  };

  const changePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const success = await updateUserPassword(user.id, newPassword);
      
      if (success) {
        // Update user object to set first_login to false
        const updatedUser = { ...user, first_login: false };
        setUser(updatedUser);
        storeUser(updatedUser);
        setIsFirstLogin(false);
        toast.success("Senha alterada com sucesso");
        
        // Logout user to force login with new password
        logout();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Erro ao alterar senha");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update method to accept readonly arrays
  const checkShouldShowRoute = (allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>) => {
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
        isFirstLogin,
        changePassword,
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

// Protected route component - update to accept readonly arrays
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedTypes?: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>;
}> = ({ children, allowedTypes = ["admin", "selecao", "refeicao", "colaborador", "comum"] as const }) => {
  const { user, isAuthenticated, isLoading, isFirstLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user && isFirstLogin) {
        navigate("/change-password");
      } else if (isAuthenticated && user) {
        // Verifica permissões do tipo de usuário
        const isAllowed = user.admin || allowedTypes.includes(user.tipo_usuario);
        if (!isAllowed) {
          toast.error("Você não tem permissão para acessar esta página");
          navigate("/dashboard");
        }
      }
    }
  }, [isAuthenticated, isLoading, isFirstLogin, navigate, user, allowedTypes]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-primary">Carregando...</div>
    </div>;
  }

  // Se autenticado e tem permissão, renderiza os children
  return isAuthenticated ? <>{children}</> : null;
};
