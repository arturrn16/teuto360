
import { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { PageLoader } from "@/components/ui/loader-spinner";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if authenticated and not loading
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <Building2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ConexãoRH®</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Simplificando Processos, Ampliando Oportunidades</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm animate-fade-in">
        <p>© {new Date().getFullYear()} ConexãoRH® - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default Login;
