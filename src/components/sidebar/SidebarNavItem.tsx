
import { createElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  href: string;
  title: string;
  icon: React.FC;
  allowedTypes: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>;
  requiredUser?: string;
};

export const SidebarNavItem = ({
  href,
  title,
  icon,
  allowedTypes,
  requiredUser
}: SidebarNavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, shouldShowRoute } = useAuth();

  const isActive = location.pathname === href;

  // Check if this route should be visible to the current user
  const shouldShow = shouldShowRoute(allowedTypes) && 
    // Added check for requiredUser property
    (requiredUser ? user?.username === requiredUser : true);

  if (!shouldShow) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(href)}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "hover:bg-primary-foreground hover:text-primary",
        "dark:hover:bg-primary-foreground/10",
        isActive
          ? "bg-primary-foreground text-primary dark:bg-primary-foreground/20 dark:text-primary-foreground"
          : "text-muted-foreground"
      )}
    >
      {createElement(icon, {
        className: "h-4 w-4 mr-3 shrink-0",
      })}
      <span>{title}</span>
    </button>
  );
};
