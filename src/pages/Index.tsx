
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Evitar loop infinito e redirecionamentos múltiplos
    if (!isLoading && !redirecting) {
      setRedirecting(true);
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirecting]);

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
