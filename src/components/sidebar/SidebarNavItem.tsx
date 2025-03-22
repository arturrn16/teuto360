
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick?: () => void;
  suffix?: React.ReactNode;
  className?: string; // Add this property to the interface
}

export const SidebarNavItem = ({ 
  href, 
  icon, 
  name, 
  isActive, 
  onClick,
  suffix,
  className
}: SidebarNavItemProps) => {
  const content = (
    <>
      {icon}
      <span className="ml-2">{name}</span>
      {suffix && <span className="ml-auto">{suffix}</span>}
    </>
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild={!onClick} 
        isActive={isActive}
        onClick={onClick}
        className={className} // Pass the className prop to SidebarMenuButton
      >
        {onClick ? (
          <button 
            className={cn(
              "flex items-center w-full text-gray-700 hover:text-blue-500",
              isActive && "text-blue-500 bg-blue-50"
            )}
          >
            {content}
          </button>
        ) : (
          <Link 
            to={href} 
            className={cn(
              "flex items-center text-gray-700 hover:text-blue-500",
              isActive && "text-blue-500 bg-blue-50"
            )}
          >
            {content}
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
