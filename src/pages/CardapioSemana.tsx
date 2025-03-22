
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, CalendarIcon } from "lucide-react";
import { queryCustomTable } from "@/integrations/supabase/client";

interface CardapioItem {
  id: number;
  dia_semana: string;
  tipo: string;
  prato_principal: string;
  acompanhamento: string;
  salada: string;
  sobremesa: string;
}

const CardapioSemana = () => {
  const [cardapio, setCardapio] = useState<CardapioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardapio = async () => {
      try {
        // Using the customized query function for tables not in the auto-generated types
        const { data, error } = await queryCustomTable<CardapioItem>("cardapio_semana", {
          order: { column: "id" }
        });

        if (error) {
          console.error("Erro ao buscar o cardápio:", error);
          return;
        }

        setCardapio(data as CardapioItem[]);
      } catch (error) {
        console.error("Erro ao buscar o cardápio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardapio();
  }, []);

  // Separar cardápios por tipo
  const cardapioDoDia = cardapio.filter(item => item.tipo === "Cardápio do Dia");
  const cardapioFimDeSemana = cardapio.filter(item => item.tipo === "Cardápio de Fim de Semana");

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center">
          <div className="animate-pulse text-primary">Carregando cardápio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Utensils className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">Cardápio da Semana</h1>
      </div>

      <Tabs defaultValue="dias-semana">
        <TabsList className="mb-4">
          <TabsTrigger value="dias-semana">Segunda a Sexta</TabsTrigger>
          <TabsTrigger value="fim-semana">Fim de Semana</TabsTrigger>
        </TabsList>

        <TabsContent value="dias-semana">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardapioDoDia.map((item) => (
              <CardapioCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fim-semana">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardapioFimDeSemana.map((item) => (
              <CardapioCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CardapioCard = ({ item }: { item: CardapioItem }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary h-2" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{item.dia_semana}</CardTitle>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-primary">Prato Principal</h3>
            <p>{item.prato_principal}</p>
          </div>
          <div>
            <h3 className="font-medium text-primary">Acompanhamento</h3>
            <p>{item.acompanhamento}</p>
          </div>
          <div>
            <h3 className="font-medium text-primary">Salada</h3>
            <p>{item.salada}</p>
          </div>
          <div>
            <h3 className="font-medium text-primary">Sobremesa</h3>
            <p>{item.sobremesa}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardapioSemana;
