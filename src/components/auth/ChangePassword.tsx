
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changePassword } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting new password");
      const success = await changePassword(newPassword);
      console.log("Password change result:", success);
      if (success) {
        toast.success("Senha alterada com sucesso. Por favor, faça login novamente.");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Erro ao alterar senha");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto glass animate-scale-in">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-xl sm:text-2xl">Alterar Senha</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Para continuar, você precisa alterar sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
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

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
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
            disabled={isSubmitting}
            className={cn(
              "w-full py-2 sm:py-2.5 text-sm font-medium rounded-lg text-white",
              "bg-primary hover:bg-primary/90",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              "transition-colors duration-200 ease-in-out",
              "flex justify-center items-center",
              isMobile && "touch-target",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Alterando...
              </>
            ) : (
              "Alterar Senha"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};
