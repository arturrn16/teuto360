
import { useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavItem, UserType } from "./navigationConfig";

interface SidebarNavigationProps {
  items: NavItem[];
  userType: UserType;
  admin?: boolean;
}

export const SidebarNavigation = ({ items, userType, admin = false }: SidebarNavigationProps) => {
  const location = useLocation();

  // Filter links based on user type
  const filteredLinks = items.filter(link => {
    // Admin should only see the Administration link
    if (admin) return link.name === "Administração";
    
    // Otherwise, check if user type is in the allowed types
    return link.allowedTypes.includes(userType);
  });

  return (
    <SidebarMenu>
      {filteredLinks.map((item, index) => (
        <SidebarNavItem 
          key={index}
          href={item.href}
          icon={item.icon}
          name={item.name}
          isActive={location.pathname === item.href}
        />
      ))}
    </SidebarMenu>
  );
};
