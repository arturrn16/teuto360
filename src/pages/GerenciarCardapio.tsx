
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  getCardapioSemana, 
  salvarCardapio,
  inicializarCardapioSemana
} from "@/services/cardapioService";
import { 
  Cardapio, 
  ItemCardapio, 
  diasSemanaLabels, 
  diasSemanaOrdem, 
  DiaSemana 
} from "@/models/cardapio";
import { 
  Utensils, 
  Carrot, 
  Beef, 
  Apple, 
  Save, 
  RefreshCw 
} from "lucide-react";
import { useForm } from "react-hook-form";

interface CardapioFormValues {
  pratosPrincipais: string;
  guarnicoes: string;
  saladas: string;
  sobremesas: string;
}

const GerenciarCardapio = () => {
  const { toast } = useToast();
  const [cardapios, setCardapios] = useState<Map<string, Cardapio>>(new Map());
  const [activeTab, setActiveTab] = useState<DiaSemana>("segunda");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<CardapioFormValues>({
    defaultValues: {
      pratosPrincipais: "",
      guarnicoes: "",
      saladas: "",
      sobremesas: ""
    }
  });

  // Initialize the database with empty entries for each day if needed
  useEffect(() => {
    const init = async () => {
      try {
        await inicializarCardapioSemana();
      } catch (error) {
        console.error("Erro ao inicializar cardápio:", error);
      }
    };
    
    init();
  }, []);

  // Load cardapio data
  useEffect(() => {
    const carregarCardapios = async () => {
      try {
        setLoading(true);
        const data = await getCardapioSemana();
        
        // Create a map for easy lookup
        const map = new Map<string, Cardapio>();
        
        // Initialize with empty data first
        diasSemanaOrdem.forEach(dia => {
          map.set(dia, {
            diasemana: dia,
            itens: {
              pratosPrincipais: [],
              guarnicoes: [],
              saladas: [],
              sobremesas: []
            }
          });
        });
        
        // Override with actual data from DB
        data.forEach(item => {
          map.set(item.diasemana, item);
        });
        
        setCardapios(map);
        
        // Set form values for the active tab
        updateFormValues(map.get(activeTab)!);
      } catch (error) {
        console.error("Erro ao carregar cardápios:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do cardápio",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    carregarCardapios();
  }, [toast]);

  // Update form values when tab changes
  useEffect(() => {
    if (cardapios.size > 0 && activeTab) {
      const cardapio = cardapios.get(activeTab);
      if (cardapio) {
        updateFormValues(cardapio);
      }
    }
  }, [activeTab, cardapios]);

  const updateFormValues = (cardapio: Cardapio) => {
    const { itens } = cardapio;
    
    form.reset({
      pratosPrincipais: itens.pratosPrincipais.join('\n'),
      guarnicoes: itens.guarnicoes.join('\n'),
      saladas: itens.saladas.join('\n'),
      sobremesas: itens.sobremesas.join('\n')
    });
  };

  const onTabChange = (value: string) => {
    setActiveTab(value as DiaSemana);
  };

  const onSubmit = async (values: CardapioFormValues) => {
    try {
      setSaving(true);
      
      // Convert textarea content to arrays (splitting by newlines and removing empty lines)
      const processTextarea = (text: string): string[] => {
        return text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
      };
      
      const itens: ItemCardapio = {
        pratosPrincipais: processTextarea(values.pratosPrincipais),
        guarnicoes: processTextarea(values.guarnicoes),
        saladas: processTextarea(values.saladas),
        sobremesas: processTextarea(values.sobremesas)
      };
      
      // Get existing cardapio for the current day
      const existingCardapio = cardapios.get(activeTab)!;
      
      // Prepare data for saving
      const updatedCardapio: Cardapio = {
        ...existingCardapio,
        itens,
        data: new Date().toISOString()
      };
      
      // Save to database
      const result = await salvarCardapio(updatedCardapio);
      
      // Update local state
      setCardapios(prev => {
        const updated = new Map(prev);
        updated.set(activeTab, result);
        return updated;
      });
      
      toast({
        title: "Sucesso",
        description: `Cardápio de ${diasSemanaLabels[activeTab]} atualizado com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao salvar cardápio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações no cardápio",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const data = await getCardapioSemana();
      
      // Update the map with fresh data
      const map = new Map<string, Cardapio>(cardapios);
      
      data.forEach(item => {
        map.set(item.diasemana, item);
      });
      
      setCardapios(map);
      
      // Update form values for current tab
      updateFormValues(map.get(activeTab)!);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados do cardápio foram atualizados",
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados do cardápio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMobileSelector = () => (
    <div className="mb-4">
      <Select value={activeTab} onValueChange={onTabChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o dia" />
        </SelectTrigger>
        <SelectContent>
          {diasSemanaOrdem.map(dia => (
            <SelectItem key={dia} value={dia}>
              {diasSemanaLabels[dia]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderDesktopTabs = () => (
    <TabsList className="w-full grid grid-cols-7">
      {diasSemanaOrdem.map((dia) => (
        <TabsTrigger key={dia} value={dia}>
          {diasSemanaLabels[dia]}
        </TabsTrigger>
      ))}
    </TabsList>
  );

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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Utensils className="mr-2 h-5 w-5" />
                Gerenciar Cardápio da Semana
              </CardTitle>
              <CardDescription>
                Edite o cardápio do refeitório para cada dia da semana
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            {isMobile 
              ? renderMobileSelector() 
              : renderDesktopTabs()
            }
            
            {diasSemanaOrdem.map((dia) => (
              <TabsContent key={dia} value={dia}>
                <Card>
                  <CardHeader>
                    <CardTitle>{diasSemanaLabels[dia]}</CardTitle>
                    <CardDescription>
                      Digite um item por linha em cada categoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="pratosPrincipais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Beef className="mr-2 h-4 w-4" />
                                Pratos Principais
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Digite um prato principal por linha"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="guarnicoes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Utensils className="mr-2 h-4 w-4" />
                                Guarnições
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Digite uma guarnição por linha"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="saladas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Carrot className="mr-2 h-4 w-4" />
                                Saladas
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Digite uma salada por linha"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sobremesas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Apple className="mr-2 h-4 w-4" />
                                Sobremesas
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Digite uma sobremesa por linha"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Salvar Cardápio
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
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

export default GerenciarCardapio;
