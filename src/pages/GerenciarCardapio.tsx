
import { useState, useEffect } from "react";
import { 
  queryCustomTable, 
  updateCustomTable,
  supabase
} from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, PlusCircle, Edit, Trash2 } from "lucide-react";

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
  const [cardapio, setCardapio] = useState<CardapioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add any state variables needed for form handling
  const [formData, setFormData] = useState({
    dia_semana: "",
    tipo: "Cardápio do Dia",
    prato_principal: "",
    acompanhamento: "",
    salada: "",
    sobremesa: ""
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  
  useEffect(() => {
    fetchCardapio();
  }, []);
  
  const fetchCardapio = async () => {
    try {
      setLoading(true);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For new items
      if (!editingId) {
        const { error } = await supabase
          .from("cardapio_semana")
          .insert([formData]);
          
        if (error) throw error;
        toast.success("Cardápio adicionado com sucesso!");
      } 
      // For updating existing items
      else {
        const { error } = await updateCustomTable(
          "cardapio_semana",
          formData,
          { column: "id", value: editingId }
        );
        
        if (error) throw error;
        toast.success("Cardápio atualizado com sucesso!");
        setEditingId(null);
      }
      
      // Reset form and refresh data
      setFormData({
        dia_semana: "",
        tipo: "Cardápio do Dia",
        prato_principal: "",
        acompanhamento: "",
        salada: "",
        sobremesa: ""
      });
      
      fetchCardapio();
    } catch (error) {
      console.error("Erro ao salvar cardápio:", error);
      toast.error("Erro ao salvar o cardápio");
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este item do cardápio?")) {
      try {
        const { error } = await supabase
          .from("cardapio_semana")
          .delete()
          .eq("id", id);
          
        if (error) throw error;
        
        toast.success("Item excluído com sucesso!");
        fetchCardapio();
      } catch (error) {
        console.error("Erro ao excluir item:", error);
        toast.error("Erro ao excluir o item");
      }
    }
  };
  
  const handleEdit = (item: CardapioItem) => {
    setFormData({
      dia_semana: item.dia_semana,
      tipo: item.tipo,
      prato_principal: item.prato_principal,
      acompanhamento: item.acompanhamento,
      salada: item.salada,
      sobremesa: item.sobremesa
    });
    setEditingId(item.id);
  };
  
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
        <h1 className="text-3xl font-bold">Gerenciar Cardápio</h1>
      </div>
      
      {/* Form for adding/editing items */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "Editar Item do Cardápio" : "Adicionar Novo Item ao Cardápio"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields would go here - simplified for this example */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dia da Semana</label>
                <Input 
                  value={formData.dia_semana}
                  onChange={(e) => setFormData({...formData, dia_semana: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({...formData, tipo: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardápio do Dia">Cardápio do Dia</SelectItem>
                    <SelectItem value="Cardápio de Fim de Semana">Cardápio de Fim de Semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prato Principal</label>
              <Input 
                value={formData.prato_principal}
                onChange={(e) => setFormData({...formData, prato_principal: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Acompanhamento</label>
              <Input 
                value={formData.acompanhamento}
                onChange={(e) => setFormData({...formData, acompanhamento: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Salada</label>
              <Input 
                value={formData.salada}
                onChange={(e) => setFormData({...formData, salada: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sobremesa</label>
              <Input 
                value={formData.sobremesa}
                onChange={(e) => setFormData({...formData, sobremesa: e.target.value})}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Atualizar" : "Adicionar"} Item
              </Button>
              
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({
                    dia_semana: "",
                    tipo: "Cardápio do Dia",
                    prato_principal: "",
                    acompanhamento: "",
                    salada: "",
                    sobremesa: ""
                  });
                }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Display existing items */}
      <Card>
        <CardHeader>
          <CardTitle>Cardápio Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dias-semana">
            <TabsList className="mb-4">
              <TabsTrigger value="dias-semana">Segunda a Sexta</TabsTrigger>
              <TabsTrigger value="fim-semana">Fim de Semana</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dias-semana">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardapio
                  .filter(item => item.tipo === "Cardápio do Dia")
                  .map(item => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{item.dia_semana}</CardTitle>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p><strong>Prato:</strong> {item.prato_principal}</p>
                        <p><strong>Acomp.:</strong> {item.acompanhamento}</p>
                        <p><strong>Salada:</strong> {item.salada}</p>
                        <p><strong>Sobremesa:</strong> {item.sobremesa}</p>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="fim-semana">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardapio
                  .filter(item => item.tipo === "Cardápio de Fim de Semana")
                  .map(item => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{item.dia_semana}</CardTitle>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p><strong>Prato:</strong> {item.prato_principal}</p>
                        <p><strong>Acomp.:</strong> {item.acompanhamento}</p>
                        <p><strong>Salada:</strong> {item.salada}</p>
                        <p><strong>Sobremesa:</strong> {item.sobremesa}</p>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarCardapio;
