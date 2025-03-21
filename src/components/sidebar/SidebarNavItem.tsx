
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
}

export const SidebarNavItem = ({ href, icon, name, isActive }: SidebarNavItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link 
          to={href} 
          className={cn(
            "flex items-center text-gray-700 hover:text-blue-500",
            isActive && "text-blue-500 bg-blue-50"
          )}
        >
          {icon}
          <span className="ml-2">{name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
