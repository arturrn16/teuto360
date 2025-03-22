
import { useEffect } from "react";
import { ChangePasswordForm } from "@/components/auth/ChangePassword";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

const ChangePassword = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Add console logging to debug the component
    console.log("ChangePassword page: Auth state check", { isAuthenticated, user, firstLogin: user?.first_login });
    
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login");
    } else if (user && user.first_login !== true) {
      // If not first login, redirect to dashboard
      console.log("Not first login, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <Building2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teuto360®</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Simplificando Processos, Ampliando Oportunidades</p>
      </div>
      
      <ChangePasswordForm />
      
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm animate-fade-in">
        <p>© {new Date().getFullYear()} Teuto360 - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default ChangePassword;
