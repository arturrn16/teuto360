
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index page: Auth state check", { 
      isAuthenticated, 
      isLoading, 
      user, 
      firstLogin: user?.first_login 
    });
    
    // Se autenticado, redirecionar para o dashboard ou change-password (se for primeiro login)
    if (!isLoading) {
      if (isAuthenticated) {
        if (user?.first_login === true) {
          console.log("Index: First login detected, redirecting to change password");
          navigate("/change-password");
        } else {
          console.log("Index: Authenticated user, redirecting to dashboard");
          navigate("/dashboard");
        }
      } else {
        console.log("Index: Not authenticated, redirecting to login");
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Renderiza uma tela de carregamento enquanto verifica o status de autenticação
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    </div>
  );
};

export default Index;
