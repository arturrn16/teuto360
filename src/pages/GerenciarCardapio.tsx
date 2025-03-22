
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Utensils, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryCustomTable, updateCustomTable } from "@/integrations/supabase/client";

interface CardapioItem {
  id: number;
  dia_semana: string;
  tipo: string;
  prato_principal: string;
  acompanhamento: string;
  salada: string;
  sobremesa: string;
}

const GerenciarCardapio = () => {
  const { user } = useAuth();
  const [cardapio, setCardapio] = useState<CardapioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CardapioItem | null>(null);

  const form = useForm({
    defaultValues: {
      prato_principal: "",
      acompanhamento: "",
      salada: "",
      sobremesa: "",
    },
  });

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

  useEffect(() => {
    if (selectedItem) {
      form.reset({
        prato_principal: selectedItem.prato_principal,
        acompanhamento: selectedItem.acompanhamento,
        salada: selectedItem.salada,
        sobremesa: selectedItem.sobremesa,
      });
    }
  }, [selectedItem, form]);

  const handleSelectItem = (item: CardapioItem) => {
    setSelectedItem(item);
  };

  const onSubmit = async (values: any) => {
    if (!selectedItem || !user) return;

    setSubmitting(true);

    try {
      // Use the updateCustomTable function for tables not in the auto-generated types
      const { error } = await updateCustomTable(
        "cardapio_semana",
        {
          prato_principal: values.prato_principal,
          acompanhamento: values.acompanhamento,
          salada: values.salada,
          sobremesa: values.sobremesa,
          updated_at: new Date().toISOString(),
        },
        { column: "id", value: selectedItem.id }
      );

      if (error) {
        toast.error("Erro ao atualizar o cardápio");
        console.error("Erro ao atualizar o cardápio:", error);
        return;
      }

      // Update local state
      setCardapio((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, ...values }
            : item
        )
      );

      toast.success("Cardápio atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o cardápio:", error);
      toast.error("Erro ao atualizar o cardápio");
    } finally {
      setSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Gerenciar Cardápio da Semana</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Selecione o Dia</CardTitle>
              <CardDescription>
                Escolha o dia da semana para editar o cardápio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dias-semana">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="dias-semana">Segunda a Sexta</TabsTrigger>
                  <TabsTrigger value="fim-semana">Fim de Semana</TabsTrigger>
                </TabsList>

                <TabsContent value="dias-semana">
                  <div className="space-y-2">
                    {cardapioDoDia.map((item) => (
                      <Button
                        key={item.id}
                        variant={selectedItem?.id === item.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleSelectItem(item)}
                      >
                        {item.dia_semana}
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="fim-semana">
                  <div className="space-y-2">
                    {cardapioFimDeSemana.map((item) => (
                      <Button
                        key={item.id}
                        variant={selectedItem?.id === item.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleSelectItem(item)}
                      >
                        {item.dia_semana}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle>Editar Cardápio: {selectedItem.dia_semana}</CardTitle>
                <CardDescription>
                  Altere os itens do cardápio para {selectedItem.dia_semana}
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
                      name="prato_principal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prato Principal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acompanhamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acompanhamento</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salada</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sobremesa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobremesa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? (
                        "Salvando..."
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">
                  Selecione um dia para editar o cardápio
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerenciarCardapio;
