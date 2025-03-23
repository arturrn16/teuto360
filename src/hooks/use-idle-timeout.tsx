
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface UseIdleTimeoutProps {
  onIdle?: () => void;
  idleTime?: number; // tempo em minutos
  warningTime?: number; // tempo em minutos (antes do logout)
}

export const useIdleTimeout = ({
  onIdle,
  idleTime = 15,
  warningTime = 1,
}: UseIdleTimeoutProps = {}) => {
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const idleTimeMs = idleTime * 60 * 1000;
  const warningTimeMs = (idleTime - warningTime) * 60 * 1000;

  const resetIdleTimeout = () => {
    // Limpa os timeouts existentes
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Oculta o aviso se estiver visível
    if (showWarning) {
      setShowWarning(false);
    }

    // Configura o timeout de aviso
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      toast.warning(
        `Você será desconectado em ${warningTime} minuto${warningTime > 1 ? 's' : ''} por inatividade`,
        {
          duration: warningTimeMs,
          action: {
            label: "Continuar ativo",
            onClick: resetIdleTimeout,
          },
        }
      );
    }, warningTimeMs);

    // Configura o timeout de logout
    idleTimeoutRef.current = setTimeout(() => {
      if (onIdle) {
        onIdle();
      } else {
        toast.info("Você foi desconectado por inatividade");
        logout();
      }
    }, idleTimeMs);
  };

  // Registra os eventos de usuário para resetar o timeout
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    // Inicializa o timeout quando o componente é montado
    resetIdleTimeout();

    // Adiciona listener para cada evento
    const resetOnActivity = () => resetIdleTimeout();
    events.forEach((event) => {
      window.addEventListener(event, resetOnActivity);
    });

    // Limpa os listeners e timeouts quando o componente é desmontado
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetOnActivity);
      });

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  return { showWarning, resetIdleTimeout };
};
