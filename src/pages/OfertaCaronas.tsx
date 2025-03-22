
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Car, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormLayout } from "@/components/FormLayout";

// Define the ride offer type
interface OfertaCarona {
  id: number;
  usuario_id: number;
  nome_motorista: string;
  saindo_de: string;
  turno: string;
  whatsapp: string;
  setor: string;
  valor_mensal: number;
  observacoes: string | null;
  created_at: string;
}

// Options for the shift selection
const turnoOptions = [
  "Administrativo",
  "1° Turno",
  "2° Turno",
  "2° Administrativo",
  "3° Turno",
  "12x36 diurno par",
  "12x36 diurno impar",
  "12x36 noturno par",
  "12x36 noturno impar",
];

const OfertaCaronas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for the list of ride offers
  const [ofertas, setOfertas] = useState<OfertaCarona[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the new offer form
  const [formData, setFormData] = useState({
    saindo_de: "",
    turno: "",
    nome_motorista: user?.nome || "",
    whatsapp: "",
    setor: "",
    valor_mensal: "",
    observacoes: "",
  });
  
  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  
  // Function to load all ride offers
  const loadOfertas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ofertas_caronas")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setOfertas(data || []);
    } catch (error) {
      console.error("Error loading ride offers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as ofertas de caronas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load offers on component mount
  useEffect(() => {
    loadOfertas();
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para oferecer caronas",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!formData.saindo_de || !formData.turno || !formData.whatsapp || !formData.setor || !formData.valor_mensal) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Insert the new ride offer
      const { error } = await supabase.from("ofertas_caronas").insert({
        usuario_id: user.id,
        nome_motorista: formData.nome_motorista,
        saindo_de: formData.saindo_de,
        turno: formData.turno,
        whatsapp: formData.whatsapp,
        setor: formData.setor,
        valor_mensal: parseFloat(formData.valor_mensal),
        observacoes: formData.observacoes || null,
      });
      
      if (error) throw error;
      
      // Success message
      toast({
        title: "Sucesso",
        description: "Sua oferta de carona foi publicada com sucesso!",
      });
      
      // Reset form
      setFormData({
        saindo_de: "",
        turno: "",
        nome_motorista: user.nome || "",
        whatsapp: "",
        setor: "",
        valor_mensal: "",
        observacoes: "",
      });
      
      // Reload offers
      loadOfertas();
    } catch (error) {
      console.error("Error submitting ride offer:", error);
      toast({
        title: "Erro",
        description: "Não foi possível publicar sua oferta de carona",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Function to format WhatsApp number for link
  const formatWhatsAppLink = (number: string) => {
    // Remove non-numeric characters
    const cleaned = number.replace(/\D/g, "");
    // Format for WhatsApp API
    return `https://wa.me/${cleaned}`;
  };
  
  return (
    <FormLayout
      title="Oferta de Caronas"
      description="Compartilhe ou encontre caronas para o trabalho"
    >
      {/* Form for new ride offers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Oferecer Carona</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saindo_de" className="form-field-label">Saindo de</Label>
                <Input
                  id="saindo_de"
                  name="saindo_de"
                  value={formData.saindo_de}
                  onChange={handleChange}
                  placeholder="Ex: Jardim Goiás"
                  required
                  className="form-field-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="turno" className="form-field-label">Turno</Label>
                <Select
                  onValueChange={(value) => handleSelectChange(value, "turno")}
                  value={formData.turno}
                >
                  <SelectTrigger className="form-select-input">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {turnoOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nome_motorista" className="form-field-label">Nome</Label>
                <Input
                  id="nome_motorista"
                  name="nome_motorista"
                  value={formData.nome_motorista}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="form-field-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="form-field-label">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Ex: 62999999999"
                  required
                  className="form-field-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="setor" className="form-field-label">Setor</Label>
                <Input
                  id="setor"
                  name="setor"
                  value={formData.setor}
                  onChange={handleChange}
                  placeholder="Seu setor na empresa"
                  required
                  className="form-field-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor_mensal" className="form-field-label">Valor mensal (R$)</Label>
                <Input
                  id="valor_mensal"
                  name="valor_mensal"
                  type="number"
                  value={formData.valor_mensal}
                  onChange={handleChange}
                  placeholder="Ex: 150.00"
                  required
                  step="0.01"
                  min="0"
                  className="form-field-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes" className="form-field-label">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Informações adicionais sobre a carona"
                rows={3}
                className="form-field-input"
              />
            </div>
            
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar Oferta de Carona"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* List of ride offers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Caronas Disponíveis</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : ofertas.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Nenhuma oferta de carona disponível no momento.
            </CardContent>
          </Card>
        ) : (
          ofertas.map((oferta) => (
            <Card key={oferta.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">{oferta.nome_motorista}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      <div>
                        <span className="font-medium">Saindo de:</span> {oferta.saindo_de}
                      </div>
                      <div>
                        <span className="font-medium">Destino:</span> Laboratório Teuto
                      </div>
                      <div>
                        <span className="font-medium">Turno:</span> {oferta.turno}
                      </div>
                      <div>
                        <span className="font-medium">Setor:</span> {oferta.setor}
                      </div>
                      <div>
                        <span className="font-medium">Valor mensal:</span> R$ {oferta.valor_mensal.toFixed(2)}
                      </div>
                    </div>
                    
                    {oferta.observacoes && (
                      <div className="mt-2">
                        <span className="font-medium">Observações:</span> {oferta.observacoes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-start mt-4 md:mt-0">
                    <a
                      href={formatWhatsAppLink(oferta.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      Contato WhatsApp
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </FormLayout>
  );
};

export default OfertaCaronas;
