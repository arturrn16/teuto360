
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/ui/loader-spinner";
import { User } from "@/utils/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const Icons = {
  spinner: Loader2,
};

const userFormSchema = z.object({
  id: z.number().optional(),
  matricula: z.string().min(3, {
    message: "Matrícula deve ter pelo menos 3 caracteres.",
  }),
  nome: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  cargo: z.string().min(3, {
    message: "Cargo deve ter pelo menos 3 caracteres.",
  }),
  setor: z.string().min(3, {
    message: "Setor deve ter pelo menos 3 caracteres.",
  }),
  username: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().optional(),
  admin: z.boolean().default(false),
  tipo_usuario: z.enum(['admin', 'selecao', 'refeicao', 'colaborador', 'comum']).default('comum'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const GerenciarUsuarios = () => {
  const { user: loggedInUser, isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormValues>({
    id: 0,
    matricula: "",
    nome: "",
    cargo: "",
    setor: "",
    username: "",
    admin: false,
    tipo_usuario: "comum",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      matricula: "",
      nome: "",
      cargo: "",
      setor: "",
      username: "",
      admin: false,
      tipo_usuario: "comum",
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && loggedInUser?.admin) {
      fetchUsers();
    }
  }, [loggedInUser, isAuthenticated, isLoading]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("nome", { ascending: true });

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Erro ao buscar usuários");
        return;
      }

      if (data) {
        const typedUsers: User[] = data.map(dbUser => ({
          id: dbUser.id,
          matricula: dbUser.matricula,
          nome: dbUser.nome,
          cargo: dbUser.cargo || "",  // Ensure cargo is always a string
          setor: dbUser.setor || "",  // Ensure setor is always a string
          username: dbUser.username,
          admin: dbUser.admin || false,
          tipo_usuario: dbUser.tipo_usuario as User["tipo_usuario"],
          rota: dbUser.rota,
          created_at: dbUser.created_at,
          updated_at: dbUser.updated_at
        }));
        setUsers(typedUsers);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao buscar usuários");
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    form.reset();
    setShowPassword(false);
  };

  const handleCreateUser = () => {
    setIsCreating(true);
    setEditingUser({
      id: 0,
      matricula: "",
      nome: "",
      cargo: "",
      setor: "",
      username: "",
      admin: false,
      tipo_usuario: "comum",
    });
    form.reset();
    handleOpenModal();
  };

  const handleEditUser = (user: User) => {
    setIsCreating(false);
    const formUser: UserFormValues = {
      id: user.id,
      matricula: user.matricula,
      nome: user.nome,
      cargo: user.cargo || "",  // Ensure cargo is always a string
      setor: user.setor || "",  // Ensure setor is always a string
      username: user.username,
      admin: user.admin,
      tipo_usuario: user.tipo_usuario,
    };
    setEditingUser(formUser);
    form.reset(formUser);
    handleOpenModal();
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error(`Erro ao excluir usuário: ${error.message}`);
        return;
      }

      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = search.toLowerCase();
    return (
      user.nome.toLowerCase().includes(searchTerm) ||
      user.matricula.toLowerCase().includes(searchTerm) ||
      user.cargo.toLowerCase().includes(searchTerm) ||
      user.setor.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm)
    );
  });

  const handleEditModalSave = async (values: UserFormValues) => {
    try {
      setIsSaving(true);
      
      if (isCreating && !values.password) {
        toast.error("Senha é obrigatória para novos usuários");
        setIsSaving(false);
        return;
      }
      
      const userForApi: any = { 
        matricula: values.matricula,
        nome: values.nome,
        username: values.username,
        tipo_usuario: values.tipo_usuario,
        admin: values.admin,
        cargo: values.cargo || "",  // Ensure cargo is always a string
        setor: values.setor || ""   // Ensure setor is always a string
      };
      
      if (values.password) {
        userForApi.password = values.password;
      }
      
      if (!isCreating) {
        userForApi.id = values.id;
      }
      
      if (isCreating) {
        const { data, error } = await supabase
          .from('usuarios')
          .insert([userForApi])
          .select();
          
        if (error) {
          console.error("Error creating user:", error);
          toast.error(`Erro ao criar usuário: ${error.message}`);
          return;
        }
        
        if (data && data[0]) {
          const newUser: User = {
            id: data[0].id,
            matricula: data[0].matricula,
            nome: data[0].nome,
            cargo: data[0].cargo || "",  // Ensure cargo is always a string
            setor: data[0].setor || "",  // Ensure setor is always a string
            username: data[0].username,
            admin: data[0].admin || false,
            tipo_usuario: data[0].tipo_usuario as User["tipo_usuario"],
            rota: data[0].rota,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at
          };
          setUsers(prev => [...prev, newUser]);
          toast.success("Usuário criado com sucesso!");
        }
      } else {
        const { data, error } = await supabase
          .from('usuarios')
          .update(userForApi)
          .eq('id', values.id)
          .select();
          
        if (error) {
          console.error("Error updating user:", error);
          toast.error(`Erro ao atualizar usuário: ${error.message}`);
          return;
        }
        
        if (data && data[0]) {
          const updatedUser: User = {
            id: data[0].id,
            matricula: data[0].matricula,
            nome: data[0].nome,
            cargo: data[0].cargo || "",  // Ensure cargo is always a string
            setor: data[0].setor || "",  // Ensure setor is always a string
            username: data[0].username,
            admin: data[0].admin || false,
            tipo_usuario: data[0].tipo_usuario as User["tipo_usuario"],
            rota: data[0].rota,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at
          };
          
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
          toast.success("Usuário atualizado com sucesso!");
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erro ao salvar usuário");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormInvalid = () => {
    return Object.keys(form.formState.errors).length > 0;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !loggedInUser?.admin) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <div className="text-2xl font-bold text-destructive mb-4">Acesso Negado</div>
            <p>Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Usuários</CardTitle>
          <CardDescription>
            Adicione, edite e exclua usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar usuário"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Button onClick={handleCreateUser}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.matricula}</TableCell>
                    <TableCell className="font-medium">{user.nome}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.cargo}</TableCell>
                    <TableCell>{user.setor}</TableCell>
                    <TableCell>{user.tipo_usuario}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Adicionar Usuário" : "Editar Usuário"}</DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Crie um novo usuário para o sistema."
                : "Edite as informações do usuário."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditModalSave)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Matrícula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Cargo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="setor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor</FormLabel>
                      <FormControl>
                        <Input placeholder="Setor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha {isCreating ? "(Obrigatório)" : "(Deixe em branco para não alterar)"}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Senha"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">Mostrar senha</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tipo_usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Usuário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de usuário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="selecao">Seleção</SelectItem>
                        <SelectItem value="refeicao">Refeição</SelectItem>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                        <SelectItem value="comum">Comum</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="admin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Administrador</FormLabel>
                      <FormDescription>
                        Concede acesso total ao sistema.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isSaving}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSaving || isFormInvalid()}>
                  {isSaving ? (
                    <>
                      Salvando...
                      <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarUsuarios;
