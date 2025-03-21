
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone } from "lucide-react";

const Plantao = () => {
  const plantaoNumero = "556284548644";
  const plantaoFormatado = "(62) 8454-8644";
  const whatsappUrl = `https://wa.me/${plantaoNumero}`;
  
  const handleRedirect = () => {
    window.open(whatsappUrl, "_blank");
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            Plantão 24hs - Transporte Fretado
          </CardTitle>
          <CardDescription>
            Caso esteja no ponto e sua rota ainda não passou ou o ônibus passou e não parou para você, clique no botão abaixo para conversar com nosso plantão de atendimento do transporte fretado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 rounded-lg p-6 text-center">
            <p className="text-lg font-medium mb-2">Disponível 24 horas por dia, todos os dias da semana</p>
            <p className="text-xl font-bold text-primary">{plantaoFormatado}</p>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300">
            Ao clicar no botão abaixo, você será redirecionado para o WhatsApp do plantão.
          </p>
          
          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              onClick={handleRedirect}
              className="px-8 py-6 text-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              Contatar Plantão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plantao;
