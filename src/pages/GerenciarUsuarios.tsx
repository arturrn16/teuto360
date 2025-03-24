
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  User, NewUser, getAllUsers, createUser, updateUser, 
  deleteUser, updateUserPassword, searchUsers 
} from "@/services/userService";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Edit, Trash2, Key, User as UserIcon,
  Users, Filter, RefreshCw, Shield, X
} from "lucide-react";
import { PageLoader } from "@/components/ui/loader-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserType } from "@/components/sidebar/navigationConfig";

const GerenciarUsuarios = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [newUser, setNewUser] = useState<NewUser>({
    nome: "",
    matricula: "",
    username: "",
    password: "",
    cargo: "",
    setor: "",
    rota: "",
    tipo_usuario: "comum",
    admin: false
  });
  
  const [editUser, setEditUser] = useState<Partial<User>>({
    nome: "",
    matricula: "",
    username: "",
    cargo: "",
    setor: "",
    rota: "",
    tipo_usuario: "comum",
    admin: false
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.admin) {
      fetchUsers();
    }
  }, [user, isAuthenticated, isLoading]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.matricula.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.setor && user.setor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchUsers();
      return;
    }
    
    setLoading(true);
    try {
      const data = await searchUsers(searchQuery);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      nome: user.nome,
      matricula: user.matricula,
      username: user.username,
      cargo: user.cargo,
      setor: user.setor,
      rota: user.rota,
      tipo_usuario: user.tipo_usuario,
      admin: user.admin
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const updated = await updateUser(selectedUser.id, editUser);
      if (updated) {
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? updated : u));
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      const success = await updateUserPassword(selectedUser.id, newPassword);
      if (success) {
        setIsPasswordDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  
  const handleNewUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.nome || !newUser.matricula || !newUser.username || !newUser.password) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    if (newUser.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      const created = await createUser(newUser);
      if (created) {
        setUsers(prev => [...prev, created]);
        setIsNewDialogOpen(false);
        setNewUser({
          nome: "",
          matricula: "",
          username: "",
          password: "",
          cargo: "",
          setor: "",
          rota: "",
          tipo_usuario: "comum",
          admin: false
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const success = await deleteUser(selectedUser.id);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  const getUserRoleLabel = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'selecao':
        return 'Seleção';
      case 'gestor':
        return 'Gestor';
      case 'colaborador':
        return 'Colaborador';
      case 'comum':
        return 'Comum';
      default:
        return role;
    }
  };
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated || !user?.admin) {
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
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie o acesso de usuários ao sistema ConexãoRH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou matrícula"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSearch}
                className="flex-1 md:flex-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button
                variant="outline"
                onClick={fetchUsers}
                className="flex-1 md:flex-none"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar
              </Button>
              <Button
                onClick={() => {
                  setNewUser({
                    nome: "",
                    matricula: "",
                    username: "",
                    password: "",
                    cargo: "",
                    setor: "",
                    rota: "",
                    tipo_usuario: "comum",
                    admin: false
                  });
                  setIsNewDialogOpen(true);
                }}
                className="flex-1 md:flex-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <PageLoader />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="hidden md:table-cell">Setor / Cargo</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Admin</TableHead>
                    <TableHead className="hidden md:table-cell">Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.matricula}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.setor ? (
                          <>
                            {user.setor}
                            {user.cargo && ` / ${user.cargo}`}
                          </>
                        ) : (
                          user.cargo || "N/A"
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getUserRoleLabel(user.tipo_usuario)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.admin ? (
                          <div className="flex items-center text-green-600">
                            <Shield className="h-4 w-4 mr-1" />
                            Sim
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <X className="h-4 w-4 mr-1" />
                            Não
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(user)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenPasswordDialog(user)}
                            title="Alterar senha"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(user)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "Nenhum usuário encontrado com esses critérios." : "Nenhum usuário encontrado."}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Editar Usuário
            </DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-nome" className="text-right">
                  Nome*
                </Label>
                <Input
                  id="edit-nome"
                  value={editUser.nome || ""}
                  onChange={(e) => setEditUser({...editUser, nome: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-matricula" className="text-right">
                  Matrícula*
                </Label>
                <Input
                  id="edit-matricula"
                  value={editUser.matricula || ""}
                  onChange={(e) => setEditUser({...editUser, matricula: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-username" className="text-right">
                  Username*
                </Label>
                <Input
                  id="edit-username"
                  value={editUser.username || ""}
                  onChange={(e) => setEditUser({...editUser, username: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-setor" className="text-right">
                  Setor
                </Label>
                <Input
                  id="edit-setor"
                  value={editUser.setor || ""}
                  onChange={(e) => setEditUser({...editUser, setor: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-cargo" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="edit-cargo"
                  value={editUser.cargo || ""}
                  onChange={(e) => setEditUser({...editUser, cargo: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-rota" className="text-right">
                  Rota
                </Label>
                <Input
                  id="edit-rota"
                  value={editUser.rota || ""}
                  onChange={(e) => setEditUser({...editUser, rota: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-tipo" className="text-right">
                  Tipo de Usuário*
                </Label>
                <Select
                  value={editUser.tipo_usuario || "comum"}
                  onValueChange={(value) => setEditUser({...editUser, tipo_usuario: value as UserType})}
                >
                  <FormControl>
                    <SelectTrigger className="form-select-input">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="comum">Comum</SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="selecao">Seleção</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="edit-admin" className="text-right">
                  Admin
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="edit-admin"
                    checked={editUser.admin || false}
                    onCheckedChange={(checked) =>
                      setEditUser({...editUser, admin: checked === true})
                    }
                  />
                  <label
                    htmlFor="edit-admin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Permissões de Administrador
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" />
              Alterar Senha
            </DialogTitle>
            <DialogDescription>
              {selectedUser && `Definir nova senha para ${selectedUser.nome}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-password" className="text-right">
                  Nova Senha*
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirmar Senha*
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Alterar Senha</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-500" />
              Novo Usuário
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo usuário.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewUserSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-nome" className="text-right">
                  Nome*
                </Label>
                <Input
                  id="new-nome"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-matricula" className="text-right">
                  Matrícula*
                </Label>
                <Input
                  id="new-matricula"
                  value={newUser.matricula}
                  onChange={(e) => setNewUser({...newUser, matricula: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-username" className="text-right">
                  Username*
                </Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-password" className="text-right">
                  Senha*
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-setor" className="text-right">
                  Setor
                </Label>
                <Input
                  id="new-setor"
                  value={newUser.setor || ""}
                  onChange={(e) => setNewUser({...newUser, setor: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-cargo" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="new-cargo"
                  value={newUser.cargo || ""}
                  onChange={(e) => setNewUser({...newUser, cargo: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-rota" className="text-right">
                  Rota
                </Label>
                <Input
                  id="new-rota"
                  value={newUser.rota || ""}
                  onChange={(e) => setNewUser({...newUser, rota: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-tipo" className="text-right">
                  Tipo de Usuário*
                </Label>
                <Select
                  value={newUser.tipo_usuario}
                  onValueChange={(value) => setNewUser({...newUser, tipo_usuario: value as UserType})}
                >
                  <FormControl>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="comum">Comum</SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="selecao">Seleção</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="new-admin" className="text-right">
                  Admin
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="new-admin"
                    checked={newUser.admin}
                    onCheckedChange={(checked) =>
                      setNewUser({...newUser, admin: checked === true})
                    }
                  />
                  <label
                    htmlFor="new-admin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Permissões de Administrador
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Criar Usuário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && (
                <>
                  Você está prestes a excluir o usuário <strong>{selectedUser.nome}</strong>. 
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GerenciarUsuarios;
