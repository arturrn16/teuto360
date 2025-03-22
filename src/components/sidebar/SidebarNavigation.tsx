
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuSub } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavItem, UserType } from "./navigationConfig";

interface SidebarNavigationProps {
  items: NavItem[];
  userType: UserType;
  admin?: boolean;
}

export const SidebarNavigation = ({ items, userType, admin = false }: SidebarNavigationProps) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Toggle submenu expansion
  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Filter links based on user type
  const filteredLinks = items.filter(link => {
    // Admin should only see admin-specific cards
    if (admin) return link.name === "Administração" || link.name === "Gerenciar Comunicados";
    
    // Otherwise, check if user type is in the allowed types
    return link.allowedTypes.includes(userType);
  });

  // Render menu item recursively to handle submenus
  const renderMenuItem = (item: NavItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.href;
    const isExpanded = expandedMenus[item.name] || false;
    
    // Check if any child is active
    const isChildActive = hasChildren && item.children?.some(child => 
      location.pathname === child.href
    );

    return (
      <div key={index}>
        <SidebarNavItem 
          href={hasChildren ? "#" : item.href}
          icon={item.icon}
          name={item.name}
          isActive={isActive || isChildActive}
          onClick={hasChildren ? () => toggleSubmenu(item.name) : undefined}
          suffix={hasChildren ? 
            (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) 
            : undefined
          }
        />
        
        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <SidebarMenuSub>
            {item.children?.map((child, childIndex) => (
              <SidebarNavItem 
                key={childIndex}
                href={child.href}
                icon={child.icon}
                name={child.name}
                isActive={location.pathname === child.href}
              />
            ))}
          </SidebarMenuSub>
        )}
      </div>
    );
  };

  return (
    <SidebarMenu>
      {filteredLinks.map((item, index) => renderMenuItem(item, index))}
    </SidebarMenu>
  );
};
