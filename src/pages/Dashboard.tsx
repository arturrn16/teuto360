
import { useAuth } from "@/context/AuthContext";
import { useClock } from "@/hooks/use-clock";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  commonUserCards, 
  gestorCards, 
  selecaoCards,
  adminCards,
  CardConfig
} from "@/components/dashboard/dashboardConfig";

const Dashboard = () => {
  const { user } = useAuth();
  const { getGreeting, formattedDate, formattedTime } = useClock();

  // Filtro de cards baseado no tipo de usuário
  const getCardsForUserType = (): CardConfig[] => {
    if (!user) return [];
    
    if (user.admin) {
      return adminCards.filter(card => {
        if (!card.allowedTypes) return true;
        return card.allowedTypes.includes('admin');
      });
    }
    
    if (user.tipo_usuario === 'gestor') {
      return gestorCards;
    }
    
    if (user.tipo_usuario === 'selecao') {
      return selecaoCards;
    }
    
    if (user.tipo_usuario === 'comum') {
      return commonUserCards;
    }
    
    return []; // Para outros tipos de usuário
  };

  // Determine the filtered cards based on user type
  const filteredCards = getCardsForUserType();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {getGreeting()}, {user?.nome?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          {formattedDate}
          {' • '}
          {formattedTime}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            to={card.to}
            color={card.color}
            textColor={card.textColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
