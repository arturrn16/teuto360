
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { getUserRoleLabel } from "./sidebar/navigationConfig";

export const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex justify-end items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center">
        <div className="mr-4 flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.nome}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getUserRoleLabel(user?.tipo_usuario)}
          </span>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
