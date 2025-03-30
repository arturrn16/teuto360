
import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface UserProfileSectionProps {
  name: string;
  role: string;
}

export const UserProfileSection = ({ name, role }: UserProfileSectionProps) => {
  return (
    <Link to="/perfil" className="p-4 mb-2 border-b border-gray-200 hover:bg-blue-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">
            {name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {role}
          </p>
        </div>
      </div>
    </Link>
  );
};
