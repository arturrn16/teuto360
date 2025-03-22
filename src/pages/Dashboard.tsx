
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Bem-vindo, {user?.nome}!
        </h2>
        <p className="text-gray-600">
          Utilize o menu lateral para navegar entre as funcionalidades do sistema.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
