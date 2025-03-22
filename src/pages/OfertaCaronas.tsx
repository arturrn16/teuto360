
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Car, Phone, Clock } from "lucide-react";

interface OfertaCarona {
  id: number;
  nome: string;
  turno: string; // New field
  origem: string;
  whatsapp: string;
  setor: string;
  valor_mensal: number;
  observacoes: string | null;
  created_at: string;
  usuario_id: number;
}

const OfertaCaronas = () => {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState<OfertaCarona[]>([]);
  const [form, setForm] = useState({
    nome: "",
    turno: "", // New field
    origem: "",
    whatsapp: "",
    setor: "",
    valor_mensal: "",
    observacoes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format WhatsApp number for link
  const formatWhatsAppLink = (number: string) => {
    // Remove non-numeric characters
    const cleaned = number.replace(/\D/g, "");
    return `https://wa.me/${cleaned.startsWith("55") ? cleaned : "55" + cleaned}`;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const loadOfertas = async () => {
    try {
      const { data, error } = await supabase
        .from("ofertas_caronas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOfertas(data || []);
    } catch (error) {
      console.error("Erro ao carregar ofertas:", error);
      toast.error("Não foi possível carregar as ofertas de caronas");
    }
  };

  useEffect(() => {
    loadOfertas();

    // Setup realtime subscription for new offers
    const channel = supabase
      .channel("ofertas_caronas_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ofertas_caronas",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          loadOfertas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      // Validate form
      if (
        !form.nome ||
        !form.turno || // Validate new field
        !form.origem ||
        !form.whatsapp ||
        !form.setor ||
        !form.valor_mensal
      ) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      // Submit offer
      const { error } = await supabase.from("ofertas_caronas").insert({
        usuario_id: user.id,
        nome: form.nome,
        turno: form.turno, // Include new field
        origem: form.origem,
        whatsapp: form.whatsapp,
        setor: form.setor,
        valor_mensal: parseFloat(form.valor_mensal),
        observacoes: form.observacoes || null,
      });

      if (error) throw error;

      toast.success("Oferta de carona publicada com sucesso!");
      
      // Reset form
      setForm({
        nome: "",
        turno: "", // Reset new field
        origem: "",
        whatsapp: "",
        setor: "",
        valor_mensal: "",
        observacoes: "",
      });
      
      // Reload offers
      loadOfertas();
    } catch (error) {
      console.error("Erro ao publicar oferta:", error);
      toast.error("Não foi possível publicar sua oferta de carona");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Oferta de Caronas</h1>

      {user?.tipo_usuario === "comum" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Publicar Oferta de Carona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turno">Turno</Label>
                  <Input
                    id="turno"
                    name="turno"
                    value={form.turno}
                    onChange={handleChange}
                    placeholder="Seu turno (ex: Manhã, Tarde, Noite)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origem">Saindo de</Label>
                  <Input
                    id="origem"
                    name="origem"
                    value={form.origem}
                    onChange={handleChange}
                    placeholder="Endereço/Bairro de partida"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="(62) 98765-4321"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor</Label>
                  <Input
                    id="setor"
                    name="setor"
                    value={form.setor}
                    onChange={handleChange}
                    placeholder="Seu setor na empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor_mensal">Valor Mensal (R$)</Label>
                  <Input
                    id="valor_mensal"
                    name="valor_mensal"
                    type="number"
                    value={form.valor_mensal}
                    onChange={handleChange}
                    placeholder="150.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  placeholder="Horários disponíveis, condições, etc."
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publicando..." : "Publicar Oferta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ofertas.length > 0 ? (
          ofertas.map((oferta) => (
            <Card key={oferta.id} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                  <span className="text-blue-600">{oferta.nome}</span>
                  <span className="text-green-600 font-bold">
                    {formatCurrency(oferta.valor_mensal)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Turno:</span>{" "}
                  <span className="ml-1">{oferta.turno || "Não informado"}</span>
                </div>
                <div>
                  <span className="font-medium">Saindo de:</span> {oferta.origem}
                </div>
                <div>
                  <span className="font-medium">Destino:</span> Laboratório Teuto
                </div>
                <div>
                  <span className="font-medium">Setor:</span> {oferta.setor}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Contato:</span>
                  <a
                    href={formatWhatsAppLink(oferta.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-green-600 hover:text-green-800"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {oferta.whatsapp}
                  </a>
                </div>
                {oferta.observacoes && (
                  <div>
                    <span className="font-medium">Observações:</span>{" "}
                    {oferta.observacoes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              Nenhuma oferta de carona disponível no momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfertaCaronas;
