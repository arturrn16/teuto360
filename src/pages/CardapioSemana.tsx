
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCardapioSemana } from "@/services/cardapioService";
import { Cardapio, diasSemanaLabels, diasSemanaOrdem } from "@/models/cardapio";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui-components/Card";
import { motion } from "framer-motion";

const CardapioSemana = () => {
  const { toast } = useToast();
  const [cardapios, setCardapios] = useState<Cardapio[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const carregarCardapios = async () => {
      try {
        setLoading(true);
        const data = await getCardapioSemana();
        
        const cardapioMap = new Map<string, Cardapio>();
        
        diasSemanaOrdem.forEach(dia => {
          cardapioMap.set(dia, {
            diasemana: dia,
            itens: {
              pratosPrincipais: [],
              guarnicoes: [],
              saladas: [],
              sobremesas: []
            }
          });
        });
        
        data.forEach(item => {
          cardapioMap.set(item.diasemana, item);
        });
        
        const orderedCardapios = diasSemanaOrdem.map(dia => cardapioMap.get(dia)!);
        setCardapios(orderedCardapios);
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

  const renderCardapioItem = (titulo: string, itens: string[]) => {
    if (!itens || itens.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-4">
        <h3 className="text-slate-500 text-base font-medium mb-1">{titulo}</h3>
        {itens.map((item, index) => (
          <p key={index} className="text-black font-normal text-base">
            {item}
          </p>
        ))}
      </div>
    );
  };

  const renderCardapioCard = (cardapio: Cardapio, index: number) => {
    const { itens } = cardapio;
    
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1 * index,
        }
      }
    };
    
    const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };
    
    return (
      <motion.div 
        key={cardapio.diasemana} 
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-4"
      >
        <motion.div variants={item}>
          <Card className="p-6 max-w-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-blue-700">{diasSemanaLabels[cardapio.diasemana]}</h2>
            </div>
            
            <div className="text-left border-t pt-4 mt-2">
              <p className="text-slate-500 mb-4 font-medium">Cardápio do Dia</p>
              
              {renderCardapioItem("Prato Principal", itens.pratosPrincipais)}
              {renderCardapioItem("Acompanhamento", itens.guarnicoes)}
              {renderCardapioItem("Salada", itens.saladas)}
              {renderCardapioItem("Sobremesa", itens.sobremesas)}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 max-w-screen-md mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Cardápio da Semana</h1>
        
        <div className="space-y-4">
          {cardapios.map((cardapio, index) => renderCardapioCard(cardapio, index))}
        </div>
      </div>
    </div>
  );
};

export default CardapioSemana;
