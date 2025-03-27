
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Comunicado, ComunicadoInput } from "@/models/comunicado";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { Megaphone, Pencil, Archive, Trash2, Image, X } from "lucide-react";

interface FormValues extends ComunicadoInput {}

const GerenciarComunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const form = useForm<FormValues>({
    defaultValues: {
      titulo: "",
      conteudo: "",
      importante: false,
      imagem_url: "",
    },
  });

  useEffect(() => {
    fetchComunicados();
  }, []);

  const fetchComunicados = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('data_publicacao', { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar comunicados:", error);
        return;
      }
      
      setComunicados(data || []);
    } catch (error) {
      console.error("Erro ao buscar comunicados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tipo do arquivo
      if (!file.type.includes('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive"
        });
        return;
      }
      
      // Verificar tamanho (limitar a 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    
    // Se estivermos editando, atualizar o formulário para remover a URL da imagem
    if (isEditing) {
      form.setValue('imagem_url', '');
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    
    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload do arquivo para o bucket 'comunicados'
      const { error: uploadError } = await supabase.storage
        .from('comunicados')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError);
        toast({
          title: "Erro",
          description: "Erro ao fazer upload da imagem.",
          variant: "destructive"
        });
        return null;
      }
      
      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('comunicados')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar imagem.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para publicar um comunicado",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Processar upload da imagem, se houver
      let imageUrl = data.imagem_url || null;
      
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      if (isEditing && selectedComunicado) {
        // Atualizar comunicado existente
        const { error } = await supabase
          .from('comunicados')
          .update({
            titulo: data.titulo,
            conteudo: data.conteudo,
            importante: data.importante,
            imagem_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedComunicado.id);
        
        if (error) {
          console.error("Erro ao atualizar comunicado:", error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar comunicado",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Sucesso",
          description: "Comunicado atualizado com sucesso!"
        });
      } else {
        // Criar novo comunicado
        const { error } = await supabase
          .from('comunicados')
          .insert({
            titulo: data.titulo,
            conteudo: data.conteudo,
            data_publicacao: new Date().toISOString(),
            autor_id: user.id,
            autor_nome: user.nome,
            importante: data.importante,
            arquivado: false,
            imagem_url: imageUrl,
          });
        
        if (error) {
          console.error("Erro ao publicar comunicado:", error);
          toast({
            title: "Erro",
            description: "Erro ao publicar comunicado",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Sucesso",
          description: "Comunicado publicado com sucesso!"
        });
      }
      
      // Limpar o formulário e recarregar comunicados
      form.reset();
      setIsDialogOpen(false);
      setIsEditing(false);
      setSelectedComunicado(null);
      setSelectedImage(null);
      setImagePreview(null);
      fetchComunicados();
    } catch (error) {
      console.error("Erro ao processar comunicado:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar comunicado",
        variant: "destructive"
      });
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
      imagem_url: comunicado.imagem_url || "",
    });
    
    // Se o comunicado tem uma imagem, mostrar preview
    if (comunicado.imagem_url) {
      setImagePreview(comunicado.imagem_url);
    } else {
      setImagePreview(null);
    }
    
    setIsDialogOpen(true);
  };

  const handleArchive = async (comunicado: Comunicado) => {
    try {
      const { error } = await supabase
        .from('comunicados')
        .update({
          arquivado: !comunicado.arquivado,
          updated_at: new Date().toISOString(),
        })
        .eq('id', comunicado.id);
      
      if (error) {
        console.error("Erro ao arquivar/desarquivar comunicado:", error);
        toast({
          title: "Erro",
          description: "Erro ao arquivar/desarquivar comunicado",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Sucesso",
        description: comunicado.arquivado
          ? "Comunicado desarquivado com sucesso!"
          : "Comunicado arquivado com sucesso!"
      });
      
      fetchComunicados();
    } catch (error) {
      console.error("Erro ao arquivar/desarquivar comunicado:", error);
      toast({
        title: "Erro",
        description: "Erro ao arquivar/desarquivar comunicado",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (comunicado: Comunicado) => {
    setSelectedComunicado(comunicado);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!selectedComunicado) return;
    
    try {
      // Se o comunicado tem imagem, deletar do storage
      if (selectedComunicado.imagem_url) {
        // Extrair path da URL
        const urlParts = selectedComunicado.imagem_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // Deletar a imagem
        const { error: storageError } = await supabase.storage
          .from('comunicados')
          .remove([fileName]);
        
        if (storageError) {
          console.error("Erro ao deletar imagem:", storageError);
          // Continuar mesmo se falhar a deleção da imagem
        }
      }
      
      // Deletar o comunicado
      const { error } = await supabase
        .from('comunicados')
        .delete()
        .eq('id', selectedComunicado.id);
      
      if (error) {
        console.error("Erro ao excluir comunicado:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir comunicado",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Sucesso",
        description: "Comunicado excluído com sucesso!"
      });
      setIsDeleting(false);
      setSelectedComunicado(null);
      fetchComunicados();
    } catch (error) {
      console.error("Erro ao excluir comunicado:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir comunicado",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setSelectedComunicado(null);
    setSelectedImage(null);
    setImagePreview(null);
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
          <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-[650px]"}>
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
                
                {/* Upload de imagem */}
                <FormItem>
                  <FormLabel>Imagem (opcional)</FormLabel>
                  <FormDescription>
                    Adicione uma imagem para o comunicado. Limite de 5MB.
                  </FormDescription>
                  
                  {/* Preview da imagem */}
                  {imagePreview && (
                    <div className="relative w-full mb-4">
                      <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-100 mb-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white/80"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {!imagePreview && (
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Escolher Imagem
                      </label>
                    </div>
                  )}
                </FormItem>
                
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
                
                <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting || isUploading}>
                    {isSubmitting || isUploading
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
          <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-[450px]"}>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Megaphone className="mr-2 h-4 w-4" />
                  Criar Primeiro Comunicado
                </Button>
              </DialogTrigger>
              <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw]" : "sm:max-w-[650px]"}>
                <DialogHeader>
                  <DialogTitle>Publicar Novo Comunicado</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do comunicado e clique em publicar.
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
                    
                    {/* Upload de imagem */}
                    <FormItem>
                      <FormLabel>Imagem (opcional)</FormLabel>
                      <FormDescription>
                        Adicione uma imagem para o comunicado. Limite de 5MB.
                      </FormDescription>
                      
                      {/* Preview da imagem */}
                      {imagePreview && (
                        <div className="relative w-full mb-4">
                          <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-100 mb-2">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white/80"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {!imagePreview && (
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload-empty"
                          />
                          <label
                            htmlFor="image-upload-empty"
                            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                          >
                            <Image className="mr-2 h-4 w-4" />
                            Escolher Imagem
                          </label>
                        </div>
                      )}
                    </FormItem>
                    
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
                    
                    <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting || isUploading}>
                        {isSubmitting || isUploading ? "Processando..." : "Publicar Comunicado"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                  <TableHead>Imagem</TableHead>
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
                    <TableCell>
                      {comunicado.imagem_url ? (
                        <Badge variant="outline" className="flex items-center">
                          <Image className="h-3 w-3 mr-1" />
                          Sim
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">Não</span>
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
