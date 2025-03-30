
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DigitalBadgeProps {
  user: {
    name: string;
    photo: string | null;
    sector: string;
    route: string | null;
  };
  badgeTemplate: string;
  showLightMeal: boolean;
  lightMealBadge: string | null;
}

const DigitalBadge = ({ 
  user, 
  badgeTemplate, 
  showLightMeal, 
  lightMealBadge 
}: DigitalBadgeProps) => {
  return (
    <div className="relative w-full max-w-[350px]">
      {/* Template do crachá */}
      <img 
        src={badgeTemplate} 
        alt="Crachá Digital" 
        className="w-full h-auto"
      />
      
      {/* Foto do usuário */}
      <div className="absolute top-[22%] left-[33%] w-[34%] h-[30%] bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
        {user.photo ? (
          <img 
            src={user.photo} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-1/2 w-1/2 text-gray-400" />
        )}
      </div>
      
      {/* Nome e setor */}
      <div className="absolute top-[56%] left-[15%] w-[70%] text-center">
        <h3 className="text-white font-bold text-lg">{user.name}</h3>
        <p className="text-white text-sm mt-1">{user.sector}</p>
      </div>
      
      {/* Badge de rota */}
      {user.route && (
        <div className="absolute top-[72%] right-[15%]">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Rota: {user.route}
          </Badge>
        </div>
      )}
      
      {/* Badge de refeição light */}
      {showLightMeal && lightMealBadge && (
        <div className="absolute top-[15%] right-[10%] w-[20%]">
          <img 
            src={lightMealBadge} 
            alt="Refeição Light" 
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default DigitalBadge;
