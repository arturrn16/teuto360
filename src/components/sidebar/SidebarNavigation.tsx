
import React, { useState, useEffect, useMemo, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuSub, useSidebar } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavItem, UserType } from "./navigationConfig";
import { useIsMobile } from "@/hooks/use-mobile";
import { checkPermission } from "@/services/permissionService";
import { useAuth } from "@/context/AuthContext";

interface SidebarNavigationProps {
  items: NavItem[];
  userType: UserType;
  admin?: boolean;
}

// Memoize SidebarNavigation to prevent unnecessary re-renders
export const SidebarNavigation = memo(({ items, userType, admin = false }: SidebarNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [menuPermissions, setMenuPermissions] = useState<Record<string, boolean>>({});
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  // Filter links based on user type - memoized to prevent recalculation on every render
  const filteredLinks = useMemo(() => items.filter(link => {
    // Admin should see admin-specific pages
    if (admin) {
      return link.allowedTypes.includes('admin') || link.name === "Dashboard";
    }
    
    // Otherwise, check if user type is in the allowed types
    return link.allowedTypes.includes(userType);
  }), [items, userType, admin]);

  // Load menu permissions when component mounts
  useEffect(() => {
    const loadMenuPermissions = async () => {
      if (!user || user.admin) return; // Admins have all permissions by default
      
      setIsLoadingPermissions(true);
      const permissions: Record<string, boolean> = {};
      
      // Check permissions for each menu item
      for (const item of filteredLinks) {
        try {
          const hasPermission = await checkPermission(user.id, item.name, 'menu');
          permissions[item.name] = hasPermission;
          
          // Also check for submenu items if present
          if (item.children) {
            for (const child of item.children) {
              const hasChildPermission = await checkPermission(user.id, child.name, 'menu');
              permissions[child.name] = hasChildPermission;
            }
          }
        } catch (error) {
          console.error(`Error checking permission for ${item.name}:`, error);
          permissions[item.name] = false;
        }
      }
      
      setMenuPermissions(permissions);
      setIsLoadingPermissions(false);
    };
    
    loadMenuPermissions();
  }, [user, filteredLinks]);

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

  // For debugging - log what's being filtered
  console.log("User type:", userType);
  console.log("Admin:", admin);
  console.log("Filtered links:", filteredLinks.map(link => link.name));

  // Check if icon is empty (for transport sub-menu items)
  const isEmptyIcon = (icon: React.ReactNode): boolean => {
    return React.isValidElement(icon) && React.Children.count(icon.props.children) === 0;
  };

  // Check if a menu item should be visible based on permissions
  const shouldShowMenuItem = (itemName: string): boolean => {
    if (user?.admin) return true; // Admins can see everything
    if (isLoadingPermissions) return true; // While loading, show all items
    
    // If we have permission data, use it to determine visibility
    if (Object.keys(menuPermissions).length > 0) {
      return menuPermissions[itemName] ?? true; // Default to visible if not found
    }
    
    return true; // Default to visible if no permission data
  };

  // Render menu item recursively to handle submenus
  const renderMenuItem = (item: NavItem, index: number) => {
    // Skip items that should be hidden based on permissions
    if (!shouldShowMenuItem(item.name)) {
      return null;
    }
    
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.href;
    const isExpanded = expandedMenus[item.name] || false;
    
    // Check if any child is active
    const isChildActive = hasChildren && item.children?.some(child => 
      location.pathname === child.href
    );

    // Filter children based on user type and permissions before rendering
    const filteredChildren = hasChildren 
      ? item.children?.filter(child => {
          if (admin) return true;
          
          // Check type first
          const typeAllowed = child.allowedTypes.includes(userType);
          
          // Then check permissions if needed
          return typeAllowed && shouldShowMenuItem(child.name);
        })
      : [];

    // Only render if there are children after filtering
    const shouldRenderChildren = filteredChildren && filteredChildren.length > 0;

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
        
        {/* Render filtered children if expanded */}
        {hasChildren && isExpanded && shouldRenderChildren && (
          <SidebarMenuSub>
            {filteredChildren.map((child, childIndex) => (
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
});

SidebarNavigation.displayName = "SidebarNavigation";
