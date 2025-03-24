import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  getAllUsers, 
  searchUsers, 
  getUserById, 
  addUser, 
  updateUser, 
  deleteUser, 
  UserDetailed,
  UserFormData
} from "@/services/userService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { UserPlus, Pencil, Trash2, Search, RefreshCw, Users } from "lucide-react";

const tiposUsuario = [
  { valor: 'admin', label: 'Administrador' },
  { valor: 'selecao', label: 'Seleção' },
  { valor: 'refeicao', label: 'Refeição' },
  { valor: 'colaborador', label: 'Colaborador' },
  { valor: 'comum', label: 'Comum' }
];

const GerenciarUsuarios = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetailed | null>(null);
  
  // Form state for adding/editing user
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    matricula: '',
    username: '',
    password: '',
    cargo: '',
    setor: '',
    tipo_usuario: 'comum',
    admin: false
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchUsers(searchQuery);
      setUsers(results);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Erro ao buscar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      matricula: '',
      username: '',
      password: '',
      cargo: '',
      setor: '',
      tipo_usuario: 'comum',
      admin: false
    });
  };

  const openEditDialog = (user: UserDetailed) => {
    setSelectedUser(user);
    setFormData({
      nome: user.nome,
      matricula: user.matricula,
      username: user.username,
      password: '', // We don't want to expose the password
      cargo: user.cargo || '',
      setor: user.setor || '',
      tipo_usuario: user.tipo_usuario,
      admin: user.admin || false
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddUser = async () => {
    if (!formData.nome || !formData.matricula || !formData.username || !formData.password) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      await addUser(formData);
      setIsAddDialogOpen(false);
      loadUsers();
      resetForm();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Erro ao adicionar usuário");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !formData.nome || !formData.matricula || !formData.username) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      await updateUser(selectedUser.id, formData);
      setIsEditDialogOpen(false);
      loadUsers();
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar usuário");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const success = await deleteUser(id);
      if (success) {
        loadUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao excluir usuário");
    }
  };

  // If not admin, redirect or show unauthorized message
  if (!currentUser?.admin) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <Users className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h1>
        <p className="text-gray-600 text-center">
          Esta página é reservada para administradores do sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Usuários</h1>
        <p className="text-gray-600">
          Adicione, edite ou remova usuários do sistema
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Buscar Usuários</CardTitle>
          <CardDescription>
            Busque por nome ou matrícula
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={loadUsers} 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Recarregar</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 flex justify-end">
          <Button onClick={openAddDialog} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Usuário</span>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Lista de Usuários</CardTitle>
          <CardDescription>
            {users.length} usuários encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-primary">Carregando...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.matricula}</TableCell>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.cargo}</TableCell>
                      <TableCell>{user.setor}</TableCell>
                      <TableCell>
                        {tiposUsuario.find(t => t.valor === user.tipo_usuario)?.label || user.tipo_usuario}
                      </TableCell>
                      <TableCell>{user.admin ? "Sim" : "Não"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEditDialog(user)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o usuário {user.nome}? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere os dados do usuário selecionado
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome *</Label>
                <Input
                  id="edit-nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-matricula">Matrícula *</Label>
                <Input
                  id="edit-matricula"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleInputChange}
                  placeholder="Matrícula"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cargo">Cargo</Label>
                <Input
                  id="edit-cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  placeholder="Cargo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-setor">Setor</Label>
                <Input
                  id="edit-setor"
                  name="setor"
                  value={formData.setor}
                  onChange={handleInputChange}
                  placeholder="Setor"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Usuário *</Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nome de usuário"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Senha</Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Deixe em branco para manter"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tipo">Tipo de Usuário *</Label>
                <Select 
                  value={formData.tipo_usuario} 
                  onValueChange={(value) => handleSelectChange('tipo_usuario', value)}
                >
                  <SelectTrigger id="edit-tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposUsuario.map((tipo) => (
                      <SelectItem key={tipo.valor} value={tipo.valor}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-admin" 
                    checked={formData.admin} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('admin', checked as boolean)
                    }
                  />
                  <Label htmlFor="edit-admin">Usuário Administrador</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo usuário
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-nome">Nome *</Label>
                <Input
                  id="add-nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-matricula">Matrícula *</Label>
                <Input
                  id="add-matricula"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleInputChange}
                  placeholder="Matrícula"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-cargo">Cargo</Label>
                <Input
                  id="add-cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  placeholder="Cargo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-setor">Setor</Label>
                <Input
                  id="add-setor"
                  name="setor"
                  value={formData.setor}
                  onChange={handleInputChange}
                  placeholder="Setor"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-username">Usuário *</Label>
                <Input
                  id="add-username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nome de usuário"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-password">Senha *</Label>
                <Input
                  id="add-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Senha"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-tipo">Tipo de Usuário *</Label>
                <Select 
                  value={formData.tipo_usuario} 
                  onValueChange={(value) => handleSelectChange('tipo_usuario', value)}
                >
                  <SelectTrigger id="add-tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposUsuario.map((tipo) => (
                      <SelectItem key={tipo.valor} value={tipo.valor}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="add-admin" 
                    checked={formData.admin} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('admin', checked as boolean)
                    }
                  />
                  <Label htmlFor="add-admin">Usuário Administrador</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarUsuarios;
