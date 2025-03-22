import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Configure para usar o fuso horário de São Paulo
  const now = new Date();
  
  // Opções para formatar a data em pt-BR
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  
  // Formatar data usando date-fns com locale pt-BR
  const formattedDate = format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Formatar hora usando date-fns com timezone São Paulo
  const formattedTime = format(now, 'HH:mm', { locale: ptBR });
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Bem-vindo, {user?.nome || 'Usuário'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {formattedDate} • {formattedTime}
        </p>
      </div>

      {/* Rest of your dashboard */}
    </div>
  );
};

export default Dashboard;
