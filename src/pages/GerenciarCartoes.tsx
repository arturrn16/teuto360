import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAllCards, addCard, updateCardStatus, deleteCard, Card as CardType } from "@/services/cardService";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Loader2, Plus, Search, Printer, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2pdf from "html2pdf.js";

const GerenciarCartoes = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchMatricula, setSearchMatricula] = useState("");
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  
  const [newCard, setNewCard] = useState({
    matricula: "",
    nome_colaborador: "",
    tipo_cartao: ""
  });
  
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
  const loadCards = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCards();
      setCards(data);
      setFilteredCards(data);
    } catch (error) {
      console.error("Error loading cards:", error);
      toast.error("Erro ao carregar os cartões");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (searchMatricula) {
      setFilteredCards(
        cards.filter((card) => 
          card.matricula.toLowerCase().includes(searchMatricula.toLowerCase()) ||
          card.nome_colaborador.toLowerCase().includes(searchMatricula.toLowerCase())
        )
      );
    } else {
      setFilteredCards(cards);
    }
  }, [searchMatricula, cards]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCard.matricula || !newCard.nome_colaborador || !newCard.tipo_cartao) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const success = await addCard({
        matricula: newCard.matricula,
        nome_colaborador: newCard.nome_colaborador,
        tipo_cartao: newCard.tipo_cartao,
        status: "Disponivel"
      });

      if (success) {
        toast.success("Cartão adicionado com sucesso");
        setNewCard({
          matricula: "",
          nome_colaborador: "",
          tipo_cartao: ""
        });
        loadCards();
      }
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Erro ao adicionar cartão");
    }
  };

  const handleMarkAsCollected = async (card: CardType) => {
    if (card.status === "Retirado") {
      toast.info("Este cartão já foi retirado");
      return;
    }

    try {
      const success = await updateCardStatus(card.id);
      if (success) {
        toast.success("Status do cartão atualizado com sucesso");
        loadCards();
        setSelectedCard({...card, status: "Retirado"});
      }
    } catch (error) {
      console.error("Error updating card status:", error);
      toast.error("Erro ao atualizar status do cartão");
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cartão?")) {
      try {
        const success = await deleteCard(id);
        if (success) {
          toast.success("Cartão excluído com sucesso");
          loadCards();
        }
      } catch (error) {
        console.error("Error deleting card:", error);
        toast.error("Erro ao excluir cartão");
      }
    }
  };

  const generateReceipt = (card: CardType) => {
    setSelectedCard(card);
  };

  const downloadReceipt = () => {
    if (!selectedCard) return;

    const today = new Date();
    const formattedDate = format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    const content = document.getElementById('receipt-content');
    if (!content) return;

    const options = {
      margin: 10,
      filename: `termo_recebimento_${selectedCard.matricula}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(content).save();
  };

  return (
    <div className="p-6 animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Cartões</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Administre os cartões disponíveis e marque-os como retirados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" /> 
              Adicionar Novo Cartão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  placeholder="Digite a matrícula"
                  value={newCard.matricula}
                  onChange={(e) => setNewCard({...newCard, matricula: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Colaborador</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome"
                  value={newCard.nome_colaborador}
                  onChange={(e) => setNewCard({...newCard, nome_colaborador: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Cartão</Label>
                <Input
                  id="tipo"
                  placeholder="Ex: Alelo Alimentação"
                  value={newCard.tipo_cartao}
                  onChange={(e) => setNewCard({...newCard, tipo_cartao: e.target.value})}
                />
              </div>
              
              <Button type="submit" className="w-full">Adicionar Cartão</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> 
              Cartões Cadastrados
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por matrícula ou nome"
                className="pl-10"
                value={searchMatricula}
                onChange={(e) => setSearchMatricula(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Nenhum cartão encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-medium">{card.matricula}</TableCell>
                        <TableCell>{card.nome_colaborador}</TableCell>
                        <TableCell>{card.tipo_cartao}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            card.status === "Disponivel" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {card.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {card.status === "Disponivel" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => generateReceipt(card)}
                                  >
                                    <Printer className="h-3.5 w-3.5 mr-1" />
                                    Marcar retirada
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Termo de Recebimento</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <div id="receipt-content" className="p-4 border rounded">
                                      <h2 className="text-center font-bold text-lg mb-4">TERMO DE RECEBIMENTO ALELO ALIMENTAÇÃO</h2>
                                      <p className="text-justify mb-4">
                                        Pelo presente Instrumento de TERMO DE RECEBIMENTO, <strong>{card.nome_colaborador}</strong>, 
                                        Empregado(a) Laboratório Teuto Brasileiro S/A, com matrícula nº <strong>{card.matricula}</strong> Declaro 
                                        que recebi, nesta data, o documento de legitimação de alimentação da forma de 
                                        cartão-benefícios com a bandeira Elo, juntamente com o guia do usuário.
                                      </p>
                                      <p className="mb-8">
                                        Anápolis, {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                      </p>
                                      <div className="border-t border-black pt-2 mt-16 max-w-xs mx-auto">
                                        <p className="text-center">Assinatura do Empregado(a)</p>
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter className="flex gap-3">
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancelar</Button>
                                    </DialogClose>
                                    <Button onClick={downloadReceipt}>
                                      <Printer className="h-4 w-4 mr-2" />
                                      Imprimir Termo
                                    </Button>
                                    <Button onClick={() => handleMarkAsCollected(card)}>
                                      Confirmar Retirada
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCard(card.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GerenciarCartoes;
