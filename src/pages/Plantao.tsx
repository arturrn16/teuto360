
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Plantao = () => {
  const plantaoNumero = "556284548644";
  const plantaoFormatado = "(62) 8454-8644";
  const whatsappUrl = `https://wa.me/${plantaoNumero}`;
  const isMobile = useIsMobile();
  
  const handleRedirect = () => {
    window.open(whatsappUrl, "_blank");
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-10 px-2 sm:px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <span>Plantão 24hs - Transporte Fretado</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Caso esteja no ponto e sua rota ainda não passou ou o ônibus passou e não parou para você, clique no botão abaixo para conversar com nosso plantão de atendimento do transporte fretado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="bg-primary/10 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-base sm:text-lg font-medium mb-2">Disponível 24 horas por dia, todos os dias da semana</p>
            <p className="text-lg sm:text-xl font-bold text-primary">{plantaoFormatado}</p>
          </div>
          
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Ao clicar no botão abaixo, você será redirecionado para o WhatsApp do plantão.
          </p>
          
          <div className="flex justify-center pt-2 sm:pt-4">
            <Button 
              size={isMobile ? "default" : "lg"}
              onClick={handleRedirect}
              className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-6 text-sm sm:text-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Contatar Plantão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plantao;
