
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui-components/Card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAllUsers, User } from "@/services/userService";
import { 
  Permission, 
  resourceTypes, 
  getAllResourcesByType, 
  getPermissionsByUser, 
  addPermission, 
  removePermission 
} from "@/services/permissionService";
import { Shield, Users, CheckCircle, XCircle } from "lucide-react";

const GerenciarPermissoes = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [resourceType, setResourceType] = useState("pagina");
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [availableResources, setAvailableResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await getAllUsers();
        // Filter out admin users since they already have all permissions
        const filteredUsers = fetchedUsers.filter(u => !u.admin);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Update available resources when resource type changes
  useEffect(() => {
    setAvailableResources(getAllResourcesByType(resourceType));
  }, [resourceType]);

  // Fetch user permissions when selected user changes
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!selectedUser) return;
      
      setLoading(true);
      try {
        const permissions = await getPermissionsByUser(selectedUser.id);
        setUserPermissions(permissions);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        toast.error("Erro ao carregar permissões do usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [selectedUser]);

  const handleUserChange = (userId: string) => {
    const selected = users.find(u => u.id.toString() === userId);
    setSelectedUser(selected || null);
  };

  const handleResourceTypeChange = (value: string) => {
    setResourceType(value);
  };

  const isPermissionGranted = (resource: string) => {
    return userPermissions.some(
      p => p.recurso === resource && p.tipo_recurso === resourceType
    );
  };

  const handlePermissionToggle = async (resource: string, isGranted: boolean) => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      let success;
      if (isGranted) {
        success = await removePermission(selectedUser.id, resource, resourceType);
      } else {
        success = await addPermission(selectedUser.id, resource, resourceType);
      }
      
      if (success) {
        // Refresh user permissions
        const permissions = await getPermissionsByUser(selectedUser.id);
        setUserPermissions(permissions);
      }
    } catch (error) {
      console.error("Error toggling permission:", error);
      toast.error("Erro ao alterar permissão");
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = availableResources.filter(resource => 
    resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't render the page if user is not admin
  if (!user?.admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Você não tem permissão para acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Permissões de Usuários</CardTitle>
          <CardDescription>
            Configure as permissões de acesso para cada usuário do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <Label htmlFor="user-select">Selecione um Usuário</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-5 w-5 text-gray-500" />
                  <Select onValueChange={handleUserChange}>
                    <SelectTrigger id="user-select" className="w-full">
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.nome} ({user.tipo_usuario})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedUser && (
                <div className="w-full md:w-1/2">
                  <Label htmlFor="resource-type">Tipo de Recurso</Label>
                  <Select value={resourceType} onValueChange={handleResourceTypeChange}>
                    <SelectTrigger id="resource-type" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {selectedUser && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Permissões para: {selectedUser.nome}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tipo de Usuário: {selectedUser.tipo_usuario}
                    </p>
                  </div>
                  <Input
                    placeholder="Filtrar recursos..."
                    className="w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((resource) => {
                    const isGranted = isPermissionGranted(resource);
                    return (
                      <div 
                        key={resource}
                        className={`p-3 rounded-md border flex items-center justify-between ${
                          isGranted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex-1">
                          <span className="font-medium">{resource}</span>
                        </div>
                        <div className="flex items-center">
                          {isGranted ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePermissionToggle(resource, true)}
                              disabled={loading}
                              className="flex items-center gap-1 border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Remover</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePermissionToggle(resource, false)}
                              disabled={loading}
                              className="flex items-center gap-1 border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Conceder</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {filteredResources.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum recurso encontrado com o termo "{searchTerm}"
                  </div>
                )}
              </div>
            )}
            
            {!selectedUser && (
              <div className="text-center py-12 text-gray-500">
                Selecione um usuário para gerenciar suas permissões
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarPermissoes;
