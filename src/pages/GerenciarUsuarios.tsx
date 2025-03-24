
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Loader2, Plus, Search, UserPlus, UserCog, UserX, Route, Users
} from "lucide-react";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Interface for User type
interface User {
  id: number;
  matricula: string;
  nome: string;
  username: string;
  admin: boolean;
  tipo_usuario: string;
  rota: string | null;
}

const GerenciarUsuarios = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroMatricula, setFiltroMatricula] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroRota, setFiltroRota] = useState("");
  const [rotas, setRotas] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    matricula: "",
    nome: "",
    username: "",
    password: "",
    tipo_usuario: "colaborador",
    admin: false,
    rota: ""
  });
  
  const [dashboardData, setDashboardData] = useState({
    totalUsuarios: 0,
    usuariosLogados: 0,
    usuariosComTransporte: 0,
    rotasCount: [] as { name: string; value: number }[],
    regimes12x36: {
      diurno: 0,
      noturno: 0
    }
  });

  // Check if the current user has permission to access this page
  const hasPermission = user?.username === "artur.neto";

  useEffect(() => {
    if (hasPermission) {
      loadUsuarios();
    }
  }, [hasPermission]);

  const loadUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome');

      if (error) {
        console.error("Erro ao carregar usuários:", error);
        toast.error("Erro ao carregar usuários");
      } else if (data) {
        setUsuarios(data);
        processDashboardData(data);
        extractRotas(data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const processDashboardData = (data: User[]) => {
    // Count total users
    const totalUsuarios = data.length;
    
    // Count users with transport (with rota)
    const usuariosComTransporte = data.filter(u => u.rota).length;
    
    // For demo purposes, assume 30% of users are currently logged in
    const usuariosLogados = Math.round(totalUsuarios * 0.3);
    
    // Count users by rota
    const rotasMap = new Map<string, number>();
    data.forEach(user => {
      const rota = user.rota || "Sem rota";
      rotasMap.set(rota, (rotasMap.get(rota) || 0) + 1);
    });
    
    const rotasCount = Array.from(rotasMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Count 12x36 regime users (for demo, we'll assume any rota with "12x36" in it)
    const diurno = data.filter(u => u.rota?.includes("12x36") && u.rota?.includes("Diurno")).length;
    const noturno = data.filter(u => u.rota?.includes("12x36") && u.rota?.includes("Noturno")).length;
    
    setDashboardData({
      totalUsuarios,
      usuariosLogados,
      usuariosComTransporte,
      rotasCount,
      regimes12x36: {
        diurno,
        noturno
      }
    });
  };

  const extractRotas = (data: User[]) => {
    const rotasSet = new Set<string>();
    data.forEach(user => {
      if (user.rota) {
        rotasSet.add(user.rota);
      }
    });
    setRotas(Array.from(rotasSet));
  };

  const filtrarUsuarios = () => {
    return usuarios.filter(u => {
      const matchMatricula = u.matricula.toLowerCase().includes(filtroMatricula.toLowerCase());
      const matchNome = u.nome.toLowerCase().includes(filtroNome.toLowerCase());
      const matchRota = !filtroRota || (u.rota && u.rota.toLowerCase().includes(filtroRota.toLowerCase()));
      return matchMatricula && matchNome && matchRota;
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.matricula || !newUser.nome || !newUser.username || !newUser.password) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          matricula: newUser.matricula,
          nome: newUser.nome,
          username: newUser.username,
          password: newUser.password,
          tipo_usuario: newUser.tipo_usuario,
          admin: newUser.admin,
          rota: newUser.rota || null
        }])
        .select();

      if (error) {
        console.error("Erro ao adicionar usuário:", error);
        toast.error("Erro ao adicionar usuário");
      } else {
        toast.success("Usuário adicionado com sucesso");
        setNewUser({
          matricula: "",
          nome: "",
          username: "",
          password: "",
          tipo_usuario: "colaborador",
          admin: false,
          rota: ""
        });
        loadUsuarios();
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      toast.error("Erro ao adicionar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    setIsLoading(true);
    try {
      const updateData: any = {
        matricula: editingUser.matricula,
        nome: editingUser.nome,
        username: editingUser.username,
        tipo_usuario: editingUser.tipo_usuario,
        admin: editingUser.admin,
        rota: editingUser.rota
      };
      
      // Only include password if it has been changed
      if ((editingUser as any).password && (editingUser as any).password.trim() !== "") {
        updateData.password = (editingUser as any).password;
      }
      
      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', editingUser.id);

      if (error) {
        console.error("Erro ao atualizar usuário:", error);
        toast.error("Erro ao atualizar usuário");
      } else {
        toast.success("Usuário atualizado com sucesso");
        setEditingUser(null);
        loadUsuarios();
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('usuarios')
          .delete()
          .eq('id', id);

        if (error) {
          console.error("Erro ao excluir usuário:", error);
          toast.error("Erro ao excluir usuário");
        } else {
          toast.success("Usuário excluído com sucesso");
          loadUsuarios();
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error("Erro ao excluir usuário");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6A6AE4'];

  // For users without permission
  if (!hasPermission) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-10 text-center">
            <UserX className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-500">Acesso Negado</h1>
            <p className="mt-2">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Usuários</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Administre os usuários cadastrados no sistema
        </p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Lista de Usuários
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.totalUsuarios}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Usuários Logados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.usuariosLogados}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Usuários com Transporte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.usuariosComTransporte}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Usuários por Rota</CardTitle>
                <CardDescription>Distribuição de usuários em cada rota</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.rotasCount.length > 0 ? (
                  <div className="w-full h-[300px] flex justify-center">
                    <BarChart
                      width={500}
                      height={300}
                      data={dashboardData.rotasCount}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Usuários" fill="#8884d8" />
                    </BarChart>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[300px] text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuários 12x36</CardTitle>
                <CardDescription>Comparativo entre turnos diurno e noturno</CardDescription>
              </CardHeader>
              <CardContent>
                {(dashboardData.regimes12x36.diurno > 0 || dashboardData.regimes12x36.noturno > 0) ? (
                  <div className="w-full h-[300px] flex justify-center">
                    <PieChart width={400} height={300}>
                      <Pie
                        data={[
                          { name: "Diurno", value: dashboardData.regimes12x36.diurno },
                          { name: "Noturno", value: dashboardData.regimes12x36.noturno }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Diurno", value: dashboardData.regimes12x36.diurno },
                          { name: "Noturno", value: dashboardData.regimes12x36.noturno }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[300px] text-muted-foreground">
                    Nenhum usuário em regime 12x36
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filtrar por matrícula"
                    className="pl-10"
                    value={filtroMatricula}
                    onChange={(e) => setFiltroMatricula(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filtrar por nome"
                    className="pl-10"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Route className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filtrar por rota"
                    className="pl-10"
                    value={filtroRota}
                    onChange={(e) => setFiltroRota(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : filtrarUsuarios().length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  Nenhum usuário encontrado
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Rota</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtrarUsuarios().map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-medium">{usuario.matricula}</TableCell>
                          <TableCell>{usuario.nome}</TableCell>
                          <TableCell>{usuario.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{usuario.tipo_usuario}</Badge>
                          </TableCell>
                          <TableCell>
                            {usuario.admin ? (
                              <Badge variant="success">Sim</Badge>
                            ) : (
                              <Badge variant="outline">Não</Badge>
                            )}
                          </TableCell>
                          <TableCell>{usuario.rota || "—"}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingUser(usuario)}
                                  >
                                    Editar
                                  </Button>
                                </DialogTrigger>
                                {editingUser && (
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Usuário</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleUpdateUser} className="space-y-4 pt-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-matricula">Matrícula</Label>
                                          <Input
                                            id="edit-matricula"
                                            value={editingUser.matricula}
                                            onChange={(e) => setEditingUser({...editingUser, matricula: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-nome">Nome</Label>
                                          <Input
                                            id="edit-nome"
                                            value={editingUser.nome}
                                            onChange={(e) => setEditingUser({...editingUser, nome: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-username">Usuário</Label>
                                          <Input
                                            id="edit-username"
                                            value={editingUser.username}
                                            onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-password">Nova Senha (deixe em branco para manter)</Label>
                                          <Input
                                            id="edit-password"
                                            type="password"
                                            value={(editingUser as any).password || ""}
                                            onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-tipo">Tipo de Usuário</Label>
                                          <Select 
                                            value={editingUser.tipo_usuario} 
                                            onValueChange={(value) => setEditingUser({...editingUser, tipo_usuario: value})}
                                          >
                                            <SelectTrigger id="edit-tipo">
                                              <SelectValue placeholder="Selecione um tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="admin">Admin</SelectItem>
                                              <SelectItem value="selecao">Seleção</SelectItem>
                                              <SelectItem value="refeicao">Refeição</SelectItem>
                                              <SelectItem value="colaborador">Colaborador</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-admin">Admin</Label>
                                          <Select 
                                            value={editingUser.admin ? "true" : "false"} 
                                            onValueChange={(value) => setEditingUser({...editingUser, admin: value === "true"})}
                                          >
                                            <SelectTrigger id="edit-admin">
                                              <SelectValue placeholder="Admin?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="true">Sim</SelectItem>
                                              <SelectItem value="false">Não</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-rota">Rota</Label>
                                        <Select 
                                          value={editingUser.rota || ""} 
                                          onValueChange={(value) => setEditingUser({...editingUser, rota: value})}
                                        >
                                          <SelectTrigger id="edit-rota">
                                            <SelectValue placeholder="Selecione uma rota (opcional)" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="">Sem rota</SelectItem>
                                            {rotas.map((rota) => (
                                              <SelectItem key={rota} value={rota}>{rota}</SelectItem>
                                            ))}
                                            <SelectItem value="Administração">Administração</SelectItem>
                                            <SelectItem value="1° Turno">1° Turno</SelectItem>
                                            <SelectItem value="2° Turno">2° Turno</SelectItem>
                                            <SelectItem value="3° Turno">3° Turno</SelectItem>
                                            <SelectItem value="12x36 Diurno">12x36 Diurno</SelectItem>
                                            <SelectItem value="12x36 Noturno">12x36 Noturno</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">Cancelar</Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={isLoading}>
                                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                          Salvar
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                )}
                              </Dialog>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteUser(usuario.id)}
                              >
                                Excluir
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
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-600" /> 
                Adicionar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="matricula">Matrícula</Label>
                    <Input
                      id="matricula"
                      placeholder="Digite a matrícula"
                      value={newUser.matricula}
                      onChange={(e) => setNewUser({...newUser, matricula: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome completo"
                      value={newUser.nome}
                      onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      placeholder="Nome de usuário para login"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite a senha"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo_usuario">Tipo de Usuário</Label>
                    <Select 
                      value={newUser.tipo_usuario} 
                      onValueChange={(value) => setNewUser({...newUser, tipo_usuario: value})}
                    >
                      <SelectTrigger id="tipo_usuario">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="selecao">Seleção</SelectItem>
                        <SelectItem value="refeicao">Refeição</SelectItem>
                        <SelectItem value="colaborador">Colaborador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin">Admin</Label>
                    <Select 
                      value={newUser.admin ? "true" : "false"} 
                      onValueChange={(value) => setNewUser({...newUser, admin: value === "true"})}
                    >
                      <SelectTrigger id="admin">
                        <SelectValue placeholder="Possui permissões de admin?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rota">Rota (opcional)</Label>
                  <Select 
                    value={newUser.rota} 
                    onValueChange={(value) => setNewUser({...newUser, rota: value})}
                  >
                    <SelectTrigger id="rota">
                      <SelectValue placeholder="Selecione uma rota (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem rota</SelectItem>
                      {rotas.map((rota) => (
                        <SelectItem key={rota} value={rota}>{rota}</SelectItem>
                      ))}
                      <SelectItem value="Administração">Administração</SelectItem>
                      <SelectItem value="1° Turno">1° Turno</SelectItem>
                      <SelectItem value="2° Turno">2° Turno</SelectItem>
                      <SelectItem value="3° Turno">3° Turno</SelectItem>
                      <SelectItem value="12x36 Diurno">12x36 Diurno</SelectItem>
                      <SelectItem value="12x36 Noturno">12x36 Noturno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Adicionar Usuário
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciarUsuarios;
