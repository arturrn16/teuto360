
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { queryCustomTable, updateCustomTable } from "@/integrations/supabase/client";
import { Comunicado, ComunicadoInput } from "@/models/comunicado";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Megaphone, Pencil, Archive, Trash2 } from "lucide-react";

interface FormValues extends ComunicadoInput {}

const GerenciarComunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<FormValues>({
    defaultValues: {
      titulo: "",
      conteudo: "",
      importante: false,
    },
  });

  useEffect(() => {
    fetchComunicados();
  }, []);

  const fetchComunicados = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await queryCustomTable<Comunicado>("comunicados", {
        order: { column: "data_publicacao", ascending: false }
      });
      
      if (error) {
        console.error("Erro ao buscar comunicados:", error);
        return;
      }
      
      setComunicados(data);
    } catch (error) {
      console.error("Erro ao buscar comunicados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para publicar um comunicado");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && selectedComunicado) {
        // Atualizar comunicado existente
        const { error } = await updateCustomTable(
          "comunicados",
          {
            titulo: data.titulo,
            conteudo: data.conteudo,
            importante: data.importante,
            updated_at: new Date().toISOString(),
          },
          { column: "id", value: selectedComunicado.id }
        );
        
        if (error) {
          console.error("Erro ao atualizar comunicado:", error);
          toast.error("Erro ao atualizar comunicado");
          return;
        }
        
        toast.success("Comunicado atualizado com sucesso!");
      } else {
        // Criar novo comunicado
        const { error } = await updateCustomTable(
          "comunicados",
          [{
            titulo: data.titulo,
            conteudo: data.conteudo,
            data_publicacao: new Date().toISOString(),
            autor_id: user.id,
            autor_nome: user.nome,
            importante: data.importante,
            arquivado: false,
          }],
          { column: "id", value: null }
        );
        
        if (error) {
          console.error("Erro ao publicar comunicado:", error);
          toast.error("Erro ao publicar comunicado");
          return;
        }
        
        toast.success("Comunicado publicado com sucesso!");
      }
      
      // Limpar o formulário e recarregar comunicados
      form.reset();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedComunicado(null);
      fetchComunicados();
    } catch (error) {
      console.error("Erro ao processar comunicado:", error);
      toast.error("Erro ao processar comunicado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comunicado: Comunicado) => {
    setSelectedComunicado(comunicado);
    setIsEditing(true);
    
    form.reset({
      titulo: comunicado.titulo,
      conteudo: comunicado.conteudo,
      importante: comunicado.importante,
    });
    
    setIsDialogOpen(true);
  };

  const handleArchive = async (comunicado: Comunicado) => {
    try {
      const { error } = await updateCustomTable(
        "comunicados",
        {
          arquivado: !comunicado.arquivado,
          updated_at: new Date().toISOString(),
        },
        { column: "id", value: comunicado.id }
      );
      
      if (error) {
        console.error("Erro ao arquivar/desarquivar comunicado:", error);
        toast.error("Erro ao arquivar/desarquivar comunicado");
        return;
      }
      
      toast.success(
        comunicado.arquivado
          ? "Comunicado desarquivado com sucesso!"
          : "Comunicado arquivado com sucesso!"
      );
      
      fetchComunicados();
    } catch (error) {
      console.error("Erro ao arquivar/desarquivar comunicado:", error);
      toast.error("Erro ao arquivar/desarquivar comunicado");
    }
  };

  const handleDelete = async (comunicado: Comunicado) => {
    setSelectedComunicado(comunicado);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!selectedComunicado) return;
    
    try {
      const { error } = await updateCustomTable(
        "comunicados",
        { id: selectedComunicado.id },
        { column: "id", value: selectedComunicado.id }
      );
      
      if (error) {
        console.error("Erro ao excluir comunicado:", error);
        toast.error("Erro ao excluir comunicado");
        return;
      }
      
      toast.success("Comunicado excluído com sucesso!");
      setIsDeleting(false);
      setSelectedComunicado(null);
      fetchComunicados();
    } catch (error) {
      console.error("Erro ao excluir comunicado:", error);
      toast.error("Erro ao excluir comunicado");
    }
  };

  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setSelectedComunicado(null);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Comunicados</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Megaphone className="mr-2 h-4 w-4" />
              Novo Comunicado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Comunicado" : "Publicar Novo Comunicado"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifique as informações do comunicado e clique em salvar."
                  : "Preencha as informações do comunicado e clique em publicar."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="titulo"
                  rules={{ required: "O título é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Título do comunicado" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="conteudo"
                  rules={{ required: "O conteúdo é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Conteúdo do comunicado"
                          className="min-h-[150px]"
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Destacar como Importante</FormLabel>
                        <FormDescription>
                          Comunicados importantes são destacados visualmente para os usuários.
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
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Processando..."
                      : isEditing
                      ? "Salvar Alterações"
                      : "Publicar Comunicado"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Carregando comunicados...</p>
        </div>
      ) : comunicados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500 mb-4">Nenhum comunicado publicado ainda.</p>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Megaphone className="mr-2 h-4 w-4" />
                Criar Primeiro Comunicado
              </Button>
            </DialogTrigger>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Data de Publicação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comunicados.map((comunicado) => (
                  <TableRow key={comunicado.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {comunicado.titulo}
                      {comunicado.importante && (
                        <Badge variant="destructive" className="ml-2">
                          Importante
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(comunicado.data_publicacao), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {comunicado.arquivado ? (
                        <Badge variant="outline">Arquivado</Badge>
                      ) : (
                        <Badge variant="secondary">Ativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(comunicado)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleArchive(comunicado)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(comunicado)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GerenciarComunicados;
