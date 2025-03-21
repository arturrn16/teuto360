
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <button 
      onClick={onLogout}
      className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-blue-500 hover:bg-gray-100"
    >
      <LogOut className="h-5 w-5 mr-2" />
      <span>Sair</span>
    </button>
  );
};
