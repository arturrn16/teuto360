
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuSub, useSidebar } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavItem, UserType } from "./navigationConfig";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarNavigationProps {
  items: NavItem[];
  userType: UserType;
  admin?: boolean;
}

export const SidebarNavigation = ({ items, userType, admin = false }: SidebarNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  // Verifica a rota atual e expande automaticamente o menu pai
  useEffect(() => {
    // Encontrar qual submenu deve ser expandido com base na rota atual
    const autoExpandMenus: Record<string, boolean> = {};
    
    items.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => location.pathname === child.href);
        if (hasActiveChild) {
          autoExpandMenus[item.name] = true;
        }
      }
    });
    
    // Atualizar apenas se encontrou novos menus para expandir
    if (Object.keys(autoExpandMenus).length > 0) {
      setExpandedMenus(prev => ({
        ...prev,
        ...autoExpandMenus
      }));
    }
  }, [location.pathname, items]);

  // Toggle submenu expansion
  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handle navigation and close sidebar on mobile
  const handleNavigation = (href: string) => {
    if (href === "#") return;
    
    if (isMobile) {
      setOpenMobile(false);
    }
    navigate(href);
  };

  // Filter links based on user type
  const filteredLinks = items.filter(link => {
    // Admin users should see all admin links and dashboard
    if (admin) {
      return link.allowedTypes.includes('admin') || link.name === "Dashboard";
    }
    
    // Otherwise, check if user type is in the allowed types
    return link.allowedTypes.includes(userType);
  });

  // For debugging - log what's being filtered
  console.log("User type:", userType);
  console.log("Admin:", admin);
  console.log("Filtered links:", filteredLinks.map(link => link.name));

  // Check if icon is empty (for transport sub-menu items)
  const isEmptyIcon = (icon: React.ReactNode): boolean => {
    return React.isValidElement(icon) && React.Children.count(icon.props.children) === 0;
  };

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
      <div key={index} className="group">
        <SidebarNavItem 
          href={hasChildren ? "#" : item.href}
          icon={item.icon}
          name={item.name}
          isActive={isActive || isChildActive}
          onClick={hasChildren ? () => toggleSubmenu(item.name) : () => handleNavigation(item.href)}
          suffix={hasChildren ? 
            (isExpanded ? <ChevronDown className="h-4 w-4 transition-transform" /> : <ChevronRight className="h-4 w-4 transition-transform" />) 
            : undefined
          }
          className={`transition-all duration-200 ${isMobile ? 'py-3' : ''}`}
        />
        
        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <SidebarMenuSub>
            {item.children?.map((child, childIndex) => (
              <SidebarNavItem 
                key={childIndex}
                href={child.href}
                icon={isEmptyIcon(child.icon) ? null : child.icon}
                name={child.name}
                isActive={location.pathname === child.href}
                onClick={() => handleNavigation(child.href)}
                className={isMobile ? 'py-2.5' : ''}
              />
            ))}
          </SidebarMenuSub>
        )}
      </div>
    );
  };

  return (
    <SidebarMenu className="px-1 sm:px-2">
      {filteredLinks.map((item, index) => renderMenuItem(item, index))}
    </SidebarMenu>
  );
};
