
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { checkCardByMatricula, Card as CardType } from "@/services/cardService";
import { CreditCard, Check, X } from "lucide-react";

const ConsultaCartao = () => {
  const [matricula, setMatricula] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cardResult, setCardResult] = useState<CardType | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matricula.trim()) {
      toast.error("Por favor, informe sua matrícula");
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    try {
      const result = await checkCardByMatricula(matricula);
      setCardResult(result);
      setHasSearched(true);
    } catch (error) {
      console.error("Error checking card:", error);
      toast.error("Erro ao consultar o cartão. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Consulta de Cartão</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Verifique se o seu cartão está disponível para retirada
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" /> 
            Verificar Disponibilidade
          </CardTitle>
          <CardDescription>
            Digite sua matrícula para verificar se seu cartão está disponível para retirada no RH-Benefícios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Input
                placeholder="Digite sua matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Consultando..." : "Consultar"}
            </Button>
          </form>

          {hasSearched && (
            <div className="mt-6 p-4 rounded-lg border">
              {cardResult ? (
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${cardResult.status === "Disponivel" ? "bg-green-100" : "bg-amber-100"}`}>
                    {cardResult.status === "Disponivel" ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Check className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      {cardResult.status === "Disponivel" ? (
                        "Obaa! 🥳🎉"
                      ) : (
                        "Cartão já foi retirado"
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {cardResult.status === "Disponivel" ? (
                        "Seu cartão já está disponível para retirada. Passe no RH-Benefícios para retirar e aproveitar tudo o que ele oferece. Nos vemos por lá!"
                      ) : (
                        "Seu cartão já foi retirado, conforme nossos registros."
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Tipo: {cardResult.tipo_cartao}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Oops! 😬</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Parece que o seu cartão ainda não chegou. Fique de olho, pois o cartão estará disponível para retirada em breve.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaCartao;
