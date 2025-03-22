
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuSub } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavItem, UserType, commonUserNavigation, adminNavigation } from "./navigationConfig";

interface SidebarNavigationProps {
  userType: UserType;
  admin?: boolean;
}

export const SidebarNavigation = ({ userType, admin = false }: SidebarNavigationProps) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Toggle submenu expansion
  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Use admin navigation for admin users, common navigation for others
  const navigationToShow = admin ? adminNavigation : commonUserNavigation;

  // Render menu item recursively to handle submenus
  const renderMenuItem = (item: NavItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.href;
    const isExpanded = expandedMenus[item.title] || false;
    
    // Check if any child is active
    const isChildActive = hasChildren && item.children?.some(child => 
      location.pathname === child.href
    );

    return (
      <div key={index}>
        <SidebarNavItem 
          href={hasChildren ? "#" : item.href}
          icon={item.icon}
          name={item.title}
          isActive={isActive || isChildActive}
          onClick={hasChildren ? () => toggleSubmenu(item.title) : undefined}
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
                name={child.title}
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
      {navigationToShow.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-4">
          <h3 className="px-4 text-xs font-medium uppercase text-gray-500 mb-2">
            {section.title}
          </h3>
          {section.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
        </div>
      ))}
    </SidebarMenu>
  );
};
