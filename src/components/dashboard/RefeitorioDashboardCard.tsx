
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const RefeitorioDashboardCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Utensils className="mr-2 h-5 w-5 text-primary" />
          Refeitório
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Consulte o cardápio semanal de refeições com todos os pratos e acompanhamentos.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/cardapio-semana")}
        >
          Ver Cardápio da Semana
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RefeitorioDashboardCard;
