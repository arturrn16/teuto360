
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { memo } from "react";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick?: () => void;
  suffix?: React.ReactNode;
  className?: string;
}

// Memoize the SidebarNavItem to prevent unnecessary re-renders
export const SidebarNavItem = memo(({ 
  href, 
  icon, 
  name, 
  isActive, 
  onClick,
  suffix,
  className
}: SidebarNavItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild={false} 
        isActive={isActive}
        onClick={onClick}
        className={className}
      >
        <button 
          className={cn(
            "flex items-center w-full text-gray-700 hover:text-blue-500",
            isActive && "text-blue-500 bg-blue-50"
          )}
        >
          {icon && <span className="flex items-center justify-center w-6 h-6 mr-2">{icon}</span>}
          <span className={cn("text-[15px]", icon ? "ml-2" : "ml-8")}>{name}</span>
          {suffix && <span className="ml-auto">{suffix}</span>}
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

SidebarNavItem.displayName = "SidebarNavItem";
