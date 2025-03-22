
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, getStoredUser, loginUser, logoutUser, storeUser, shouldShowRoute, changePassword } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
  shouldShowRoute: (allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está logado
    const storedUser = getStoredUser();
    if (storedUser) {
      console.log("AuthContext: Found stored user", { 
        userId: storedUser.id, 
        username: storedUser.username, 
        firstLogin: storedUser.first_login 
      });
      setUser(storedUser);
    } else {
      console.log("AuthContext: No stored user found");
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await loginUser(username, password);
      if (user) {
        console.log("Login successful", { 
          userId: user.id, 
          username: user.username, 
          firstLogin: user.first_login 
        });
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

  const handleChangePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const success = await changePassword(newPassword);
      if (success) {
        console.log("Password changed successfully, logging out");
        toast.success("Senha alterada com sucesso! Por favor, faça login novamente.");
        logoutUser();
        setUser(null);
        navigate("/login");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
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
        changePassword: handleChangePassword,
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

// Protected route component - update to accept readonly arrays
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedTypes?: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>;
}> = ({ children, allowedTypes = ["admin", "selecao", "refeicao", "colaborador", "comum"] as const }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && isAuthenticated && user) {
      // Check if it's first login and redirect to change password
      if (user.first_login === true) {
        console.log("ProtectedRoute: First login detected, redirecting to change password");
        navigate("/change-password");
        return;
      }
      
      // Verifica permissões do tipo de usuário
      const isAllowed = user.admin || allowedTypes.includes(user.tipo_usuario);
      if (!isAllowed) {
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, allowedTypes]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-primary">Carregando...</div>
    </div>;
  }

  // Se autenticado e tem permissão, renderiza os children
  return isAuthenticated ? <>{children}</> : null;
};
