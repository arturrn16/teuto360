
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Avaliacao = () => {
  const formUrl = "https://forms.office.com/r/AndF3szJNP";
  
  const handleRedirect = () => {
    window.open(formUrl, "_blank");
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Avalie o Transporte Fretado</CardTitle>
          <CardDescription>
            Faça uma avaliação ao transporte fretado do Laboratório Teuto. Todas as avaliações são anônimas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            Sua opinião é muito importante para melhorarmos nosso serviço de transporte fretado.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300">
            Ao clicar no botão abaixo, você será redirecionado para um formulário externo onde não precisará se identificar.
          </p>
          
          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              onClick={handleRedirect}
              className="px-8 py-6 text-lg"
            >
              Avaliar Transporte Fretado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Avaliacao;
