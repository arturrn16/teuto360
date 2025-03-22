
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
}

export const SidebarNavItem = ({ 
  href, 
  icon, 
  name, 
  isActive, 
  onClick,
  suffix 
}: SidebarNavItemProps) => {
  const content = (
    <>
      {icon}
      <span className="ml-2">{name}</span>
      {suffix && <span className="ml-auto">{suffix}</span>}
    </>
  );

  // If it's a button (for expandable menus), render directly without SidebarMenuButton
  if (onClick) {
    return (
      <SidebarMenuItem>
        <div 
          onClick={onClick}
          className={cn(
            "flex items-center w-full text-gray-700 hover:text-blue-500 cursor-pointer p-2 rounded",
            isActive && "text-blue-500 bg-blue-50"
          )}
        >
          {content}
        </div>
      </SidebarMenuItem>
    );
  }

  // For links, use the SidebarMenuButton with Link
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild
        isActive={isActive}
      >
        <Link 
          to={href} 
          className={cn(
            "flex items-center text-gray-700 hover:text-blue-500",
            isActive && "text-blue-500 bg-blue-50"
          )}
        >
          {content}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
