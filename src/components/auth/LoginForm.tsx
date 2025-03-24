
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthLoaded } from "@/components/Layout";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authProviderAvailable, setAuthProviderAvailable] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { authLoaded } = useAuthLoaded();

  // Reference to auth
  let auth: any = null;

  // Check if AuthProvider is available
  useEffect(() => {
    if (authLoaded) {
      try {
        // Just testing if we can access the auth context
        auth = useAuth();
        setAuthProviderAvailable(true);
      } catch (error) {
        console.error("Auth provider not available:", error);
      }
    }
  }, [authLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!authProviderAvailable) {
        console.error("Cannot login: Auth provider not available");
        return;
      }
      
      // Get the current auth context
      const { login } = useAuth();
      const success = await login(username, password);
      
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto glass animate-scale-in">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
                className={cn(
                  "block w-full pl-10 pr-3 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base",
                  "bg-white/50 dark:bg-black/20 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-700",
                  "text-gray-900 dark:text-white",
                  "placeholder-gray-400 dark:placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  isMobile && "touch-target"
                )}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className={cn(
                  "block w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base",
                  "bg-white/50 dark:bg-black/20 backdrop-blur-sm",
                  "border border-gray-300 dark:border-gray-700",
                  "text-gray-900 dark:text-white",
                  "placeholder-gray-400 dark:placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  isMobile && "touch-target"
                )}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",
                    isMobile && "touch-target p-2"
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !authProviderAvailable}
            className={cn(
              "w-full py-2 sm:py-2.5 text-sm font-medium rounded-lg text-white",
              "bg-primary hover:bg-primary/90",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              "transition-colors duration-200 ease-in-out",
              "flex justify-center items-center",
              isMobile && "touch-target",
              (isSubmitting || !authProviderAvailable) && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : !authProviderAvailable ? (
              "Inicializando..."
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};
