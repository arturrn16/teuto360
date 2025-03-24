
import { createElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  href: string;
  title?: string;
  name?: string; // Added name as an alternative to title
  icon: React.FC;
  allowedTypes?: ReadonlyArray<'admin' | 'selecao' | 'refeicao' | 'colaborador' | 'comum'>;
  requiredUser?: string;
  isActive?: boolean;
  onClick?: () => void;
  suffix?: React.ReactNode;
  className?: string;
};

export const SidebarNavItem = ({
  href,
  title,
  name,
  icon,
  allowedTypes,
  requiredUser,
  isActive: propIsActive,
  onClick,
  suffix,
  className
}: SidebarNavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, shouldShowRoute } = useAuth();

  // Use propIsActive if provided, otherwise check location
  const isActive = propIsActive !== undefined ? propIsActive : location.pathname === href;

  // Use name as fallback if title is not provided
  const displayText = title || name;

  // Check if this route should be visible to the current user
  const shouldShow = !allowedTypes || shouldShowRoute(allowedTypes) && 
    // Added check for requiredUser property
    (requiredUser ? user?.username === requiredUser : true);

  if (allowedTypes && !shouldShow) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href !== '#') {
      navigate(href);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "hover:bg-primary-foreground hover:text-primary",
        "dark:hover:bg-primary-foreground/10",
        isActive
          ? "bg-primary-foreground text-primary dark:bg-primary-foreground/20 dark:text-primary-foreground"
          : "text-muted-foreground",
        className
      )}
    >
      {createElement(icon, {
        className: "h-4 w-4 mr-3 shrink-0",
      })}
      {displayText && <span>{displayText}</span>}
      {suffix && <span className="ml-auto">{suffix}</span>}
    </button>
  );
};
