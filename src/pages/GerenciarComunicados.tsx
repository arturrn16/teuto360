
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comunicado, ComunicadoInput } from "@/models/comunicado";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Pencil, Trash2, AlertTriangle, Megaphone, Archive, FileText, Check, X } from "lucide-react";

const comunicadoSchema = z.object({
  titulo: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  conteudo: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  importante: z.boolean().default(false)
});

const GerenciarComunicados = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comunicadoToEdit, setComunicadoToEdit] = useState<Comunicado | null>(null);
  const [comunicadoToDelete, setComunicadoToDelete] = useState<Comunicado | null>(null);
  const [activeTab, setActiveTab] = useState("ativos");

  const form = useForm<ComunicadoInput>({
    resolver: zodResolver(comunicadoSchema),
    defaultValues: {
      titulo: "",
      conteudo: "",
      importante: false,
    },
  });

  const fetchComunicados = async (): Promise<Comunicado[]> => {
    const { data, error } = await supabase
      .from("comunicados")
      .select("*")
      .order("importante", { ascending: false })
      .order("data_publicacao", { ascending: false });

    if (error) throw error;
    return data as Comunicado[];
  };

  const { data: comunicados, isLoading } = useQuery({
    queryKey: ["comunicados-admin"],
    queryFn: fetchComunicados,
  });

  const createComunicado = async (values: ComunicadoInput) => {
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("comunicados")
      .insert([
        {
          titulo: values.titulo,
          conteudo: values.conteudo,
          data_publicacao: new Date().toISOString(),
          autor_id: user.id,
          autor_nome: user.nome,
          importante: values.importante,
          arquivado: false,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  };

  const updateComunicado = async (id: number, values: ComunicadoInput) => {
    const { data, error } = await supabase
      .from("comunicados")
      .update({
        titulo: values.titulo,
        conteudo: values.conteudo,
        importante: values.importante,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  };

  const arquivarComunicado = async (id: number) => {
    const { data, error } = await supabase
      .from("comunicados")
      .update({
        arquivado: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  };

  const restaurarComunicado = async (id: number) => {
    const { data, error } = await supabase
      .from("comunicados")
      .update({
        arquivado: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  };

  const deleteComunicado = async (id: number) => {
    const { error } = await supabase.from("comunicados").delete().eq("id", id);
    if (error) throw error;
    return id;
  };

  const createMutation = useMutation({
    mutationFn: createComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados-admin"] });
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      toast.success("Comunicado criado com sucesso");
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Erro ao criar comunicado: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: ComunicadoInput }) => updateComunicado(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados-admin"] });
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      toast.success("Comunicado atualizado com sucesso");
      setIsDialogOpen(false);
      setComunicadoToEdit(null);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar comunicado: ${error.message}`);
    },
  });

  const arquivarMutation = useMutation({
    mutationFn: arquivarComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados-admin"] });
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      toast.success("Comunicado arquivado com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao arquivar comunicado: ${error.message}`);
    },
  });

  const restaurarMutation = useMutation({
    mutationFn: restaurarComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados-admin"] });
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      toast.success("Comunicado restaurado com sucesso");
    },
    onError: (error) => {
      toast.error(`Erro ao restaurar comunicado: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comunicados-admin"] });
      queryClient.invalidateQueries({ queryKey: ["comunicados"] });
      toast.success("Comunicado excluído com sucesso");
      setComunicadoToDelete(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir comunicado: ${error.message}`);
    },
  });

  const onSubmit = (values: ComunicadoInput) => {
    if (comunicadoToEdit) {
      updateMutation.mutate({ id: comunicadoToEdit.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (comunicado: Comunicado) => {
    setComunicadoToEdit(comunicado);
    form.reset({
      titulo: comunicado.titulo,
      conteudo: comunicado.conteudo,
      importante: comunicado.importante,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setComunicadoToEdit(null);
    form.reset();
  };

  const filteredComunicados = comunicados?.filter(
    (comunicado) => (activeTab === "ativos" && !comunicado.arquivado) || (activeTab === "arquivados" && comunicado.arquivado)
  );

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Comunicados</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Publique e gerencie comunicados para os colaboradores
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Megaphone className="mr-2 h-4 w-4" />
          Novo Comunicado
        </Button>
      </div>

      <Tabs defaultValue="ativos" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="arquivados">Arquivados</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="animate-pulse h-4 w-1/3 bg-gray-200 rounded"></div>
                <div className="animate-pulse h-3 w-1/4 bg-gray-200 rounded mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse h-3 w-full bg-gray-200 rounded mb-2"></div>
                <div className="animate-pulse h-3 w-full bg-gray-200 rounded mb-2"></div>
                <div className="animate-pulse h-3 w-3/4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredComunicados && filteredComunicados.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {activeTab === "ativos" ? "Nenhum comunicado ativo" : "Nenhum comunicado arquivado"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {activeTab === "ativos" 
                  ? "Clique em 'Novo Comunicado' para criar um comunicado." 
                  : "Os comunicados arquivados aparecerão aqui."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComunicados?.map((comunicado) => (
                <Card key={comunicado.id} className={comunicado.importante ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{comunicado.titulo}</CardTitle>
                        <div className="flex items-center mt-1">
                          {comunicado.importante && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 mr-2">
                              Importante
                            </Badge>
                          )}
                          <CardDescription className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(comunicado.data_publicacao), "PPP", { locale: ptBR })}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {activeTab === "ativos" ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(comunicado)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => arquivarMutation.mutate(comunicado.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => restaurarMutation.mutate(comunicado.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setComunicadoToDelete(comunicado)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: comunicado.conteudo }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dialog para criar/editar comunicado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{comunicadoToEdit ? "Editar Comunicado" : "Novo Comunicado"}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {comunicadoToEdit ? "editar o" : "criar um novo"} comunicado.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do comunicado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conteudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conteúdo do comunicado" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="importante"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Marcar como importante</FormLabel>
                      <FormDescription>
                        Este comunicado será destacado na lista.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    "Salvando..."
                  ) : (
                    comunicadoToEdit ? "Atualizar" : "Publicar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para excluir */}
      <Dialog open={!!comunicadoToDelete} onOpenChange={(open) => !open && setComunicadoToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente este comunicado? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
            <p className="font-medium">{comunicadoToDelete?.titulo}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComunicadoToDelete(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => comunicadoToDelete && deleteMutation.mutate(comunicadoToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarComunicados;
