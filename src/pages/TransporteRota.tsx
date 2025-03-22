
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransporteRotaForm } from "@/components/transporte-rota/TransporteRotaForm";

const TransporteRota = () => {
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Solicitação de Transporte - Rota</CardTitle>
          <CardDescription>
            Preencha o formulário para solicitar transporte de rota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransporteRotaForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransporteRota;
