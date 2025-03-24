
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
import { useState, useEffect } from "react";
import { useAuthLoaded } from "./Layout";

export const AppSidebar = () => {
  const [authProviderAvailable, setAuthProviderAvailable] = useState(false);
  const { authLoaded } = useAuthLoaded();
  const { setOpenMobile, isMobile } = useSidebar();
  
  // References to auth data
  let user: any = null;
  let logout: any = null;
  
  // Only try to use auth if the provider is available
  useEffect(() => {
    if (authLoaded) {
      try {
        // Just testing if we can access the context
        const auth = useAuth();
        setAuthProviderAvailable(true);
        user = auth.user;
        logout = auth.logout;
      } catch (error) {
        console.error("Auth provider not available for AppSidebar:", error);
      }
    }
  }, [authLoaded]);
  
  if (!authProviderAvailable || !user) return null;

  // Close sidebar on mobile when clicking logout
  const handleLogout = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex flex-col justify-center px-4 border-b border-gray-200 bg-white">
        <h1 className="font-bold text-lg text-blue-900">ConexãoRH®</h1>
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
