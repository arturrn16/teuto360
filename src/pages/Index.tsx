
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthLoaded } from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();
  const { authLoaded } = useAuthLoaded();
  
  let isAuthenticated = false;
  let isLoading = true;
  
  // Only try to use auth if the provider is available
  try {
    if (authLoaded) {
      const auth = useAuth();
      isAuthenticated = auth.isAuthenticated;
      isLoading = auth.isLoading;
    }
  } catch (error) {
    console.error("Auth context not available:", error);
  }

  useEffect(() => {
    // Only redirect if auth is loaded and not loading
    if (authLoaded && !isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [authLoaded, isAuthenticated, isLoading, navigate]);

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
