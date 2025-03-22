
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/utils/auth";

export const ResetPasswordForm = ({ onCancel }: { onCancel: () => void }) => {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    const value = e.target.value.replace(/\D/g, "");
    setCpf(value);
  };

  const formatDate = (date: string) => {
    try {
      const parts = date.split("-");
      if (parts.length === 3) {
        return format(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])), "dd/MM/yyyy", { locale: ptBR });
      }
      return date;
    } catch (error) {
      return date;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!username || !currentPassword || !cpf || !dataNascimento || !newPassword || !confirmPassword) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (cpf.length !== 11) {
      toast.error("CPF deve conter 11 dígitos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("A nova senha e a confirmação devem ser iguais");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      // Formata a data de nascimento para o formato esperado pelo backend (YYYY-MM-DD)
      const formattedDate = dataNascimento;
      
      const success = await resetPassword(username, currentPassword, cpf, formattedDate, newPassword);
      
      if (success) {
        toast.success("Senha alterada com sucesso. Por favor, faça login com sua nova senha.");
        onCancel(); // Volta para o formulário de login
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto glass animate-scale-in">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-xl sm:text-2xl">Alterar Senha</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Preencha os dados abaixo para alterar sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              className={cn(isMobile && "touch-target")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className={cn(isMobile && "touch-target", "pr-10")}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF (apenas números)</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="Digite seu CPF (apenas números)"
              maxLength={11}
              className={cn(isMobile && "touch-target")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className={cn(isMobile && "touch-target")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className={cn(isMobile && "touch-target", "pr-10")}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              className={cn(isMobile && "touch-target")}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-lg",
                "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                "transition-colors duration-200 ease-in-out",
                isMobile && "touch-target"
              )}
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-lg text-white",
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
