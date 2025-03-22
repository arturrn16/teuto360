
import { Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { navItems, getUserRoleLabel } from "./sidebar/navigationConfig";
import { UserProfileSection } from "./sidebar/UserProfileSection";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { LogoutButton } from "./sidebar/LogoutButton";

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();
  
  if (!user) return null;

  // Close sidebar on mobile when clicking logout
  const handleLogout = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-gray-200 bg-white">
        <Users className="h-6 w-6 text-purple-500 mr-2" />
        <span className="font-semibold text-lg text-purple-500">Teuto360®</span>
      </SidebarHeader>
      
      <SidebarContent className="bg-white text-gray-700">
        <UserProfileSection 
          name={user.nome} 
          role={getUserRoleLabel(user.tipo_usuario)}
        />
        
        <SidebarNavigation 
          items={navItems} 
          userType={user.tipo_usuario as any}
          admin={user.admin}
        />
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200 bg-white text-gray-700">
        <LogoutButton onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
};
