
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCardapioSemana } from "@/services/cardapioService";
import { Cardapio, diasSemanaLabels, diasSemanaOrdem } from "@/models/cardapio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Utensils, Carrot, Beef, Apple } from "lucide-react";

const CardapioSemana = () => {
  const { toast } = useToast();
  const [cardapios, setCardapios] = useState<Cardapio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("segunda");

  useEffect(() => {
    const carregarCardapios = async () => {
      try {
        setLoading(true);
        const data = await getCardapioSemana();
        
        // Ensure we have an entry for each day of the week
        const cardapioMap = new Map<string, Cardapio>();
        
        // Initialize with empty data
        diasSemanaOrdem.forEach(dia => {
          cardapioMap.set(dia, {
            diaSemana: dia,
            itens: {
              pratosPrincipais: [],
              guarnicoes: [],
              saladas: [],
              sobremesas: []
            }
          });
        });
        
        // Override with actual data
        data.forEach(item => {
          cardapioMap.set(item.diaSemana, item);
        });
        
        // Convert map back to array in the right order
        const orderedCardapios = diasSemanaOrdem.map(dia => cardapioMap.get(dia)!);
        setCardapios(orderedCardapios);
        
        // Set active tab to current day of week
        const hoje = new Date().getDay();
        // Convert from JS day (0=Sunday) to our format (0=Monday)
        const diaHoje = hoje === 0 ? 'domingo' : diasSemanaOrdem[hoje - 1];
        setActiveTab(diaHoje);
      } catch (error) {
        console.error("Erro ao carregar cardápios:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o cardápio da semana",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    carregarCardapios();
  }, [toast]);

  const renderItemList = (items: string[]) => {
    if (!items || items.length === 0) {
      return <div className="text-muted-foreground italic">Não definido</div>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderCardapioContent = (cardapio: Cardapio) => {
    const { itens } = cardapio;
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Categoria</TableHead>
            <TableHead>Itens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Beef className="mr-2 h-4 w-4" />
              Pratos Principais
            </TableCell>
            <TableCell>{renderItemList(itens.pratosPrincipais)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Utensils className="mr-2 h-4 w-4" />
              Guarnições
            </TableCell>
            <TableCell>{renderItemList(itens.guarnicoes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Carrot className="mr-2 h-4 w-4" />
              Saladas
            </TableCell>
            <TableCell>{renderItemList(itens.saladas)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium flex items-center">
              <Apple className="mr-2 h-4 w-4" />
              Sobremesas
            </TableCell>
            <TableCell>{renderItemList(itens.sobremesas)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Utensils className="mr-2 h-5 w-5" />
            Cardápio da Semana
          </CardTitle>
          <CardDescription>
            Confira o cardápio do refeitório para cada dia da semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-7">
              {diasSemanaOrdem.map((dia) => (
                <TabsTrigger key={dia} value={dia}>
                  {diasSemanaLabels[dia]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {cardapios.map((cardapio) => (
              <TabsContent key={cardapio.diaSemana} value={cardapio.diaSemana}>
                <Card>
                  <CardHeader>
                    <CardTitle>{diasSemanaLabels[cardapio.diaSemana]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderCardapioContent(cardapio)}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardapioSemana;
