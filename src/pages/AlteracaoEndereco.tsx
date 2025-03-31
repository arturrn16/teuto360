
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase, queryCustomTable } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormLayout } from "@/components/FormLayout";
import { Upload, X, Check, ChevronDown } from "lucide-react";
import { getAvailableFormRoutes, getAvailableTurnos } from "@/data/routes";

interface FormValues {
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  complemento: string;
  turno: string;
  rotaAtual: string;
  alterarRota: "sim" | "nao";
  novaRota?: string;
}

const AlteracaoEndereco = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [showRotaDropdown, setShowRotaDropdown] = useState(false);
  const [showNovaRotaDropdown, setShowNovaRotaDropdown] = useState(false);
  const [turnosOptions, setTurnosOptions] = useState<string[]>([]);
  const [rotasOptions, setRotasOptions] = useState<string[]>([]);
  const [novasRotasOptions, setNovasRotasOptions] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      telefone: "",
      cep: "",
      endereco: "",
      bairro: "",
      cidade: "",
      complemento: "",
      turno: "",
      rotaAtual: "",
      alterarRota: "nao",
    },
  });
  
  const alterarRota = form.watch("alterarRota");
  const selectedTurno = form.watch("turno");
  const cidade = form.watch("cidade");
  
  useEffect(() => {
    // Load available turnos
    const turnos = getAvailableTurnos();
    setTurnosOptions(turnos);
  }, []);
  
  useEffect(() => {
    // When turno changes, update available routes
    if (selectedTurno && cidade) {
      const routes = getAvailableFormRoutes(selectedTurno, cidade);
      setRotasOptions(routes);
      setNovasRotasOptions(routes);
      
      // Clear selected route if it's not in the new routes list
      const currentRoute = form.getValues("rotaAtual");
      if (currentRoute && !routes.includes(currentRoute)) {
        form.setValue("rotaAtual", "");
      }
      
      // Clear selected new route if it's not in the new routes list
      const currentNewRoute = form.getValues("novaRota");
      if (currentNewRoute && !routes.includes(currentNewRoute)) {
        form.setValue("novaRota", "");
      }
    }
  }, [selectedTurno, cidade, form]);
  
  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      
      form.setValue("endereco", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    setUploadedFile(null);
  };
  
  const uploadComprovanteEndereco = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    setFileUploading(true);
    try {
      // Create a unique filename using the user's name and current timestamp
      const fileName = `${user.nome.replace(/\s+/g, '_')}_${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('endereco_comprovantes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Erro ao fazer upload do arquivo:", error);
        toast.error("Erro ao enviar o comprovante de endereço");
        return null;
      }
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('endereco_comprovantes')
        .getPublicUrl(fileName);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Erro ao processar upload:", error);
      toast.error("Erro ao processar o comprovante de endereço");
      return null;
    } finally {
      setFileUploading(false);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    // Check if a file was uploaded
    if (!uploadedFile) {
      toast.error("É necessário anexar um comprovante de endereço");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First upload the file and get the URL
      const fileUrl = await uploadComprovanteEndereco(uploadedFile);
      
      if (!fileUrl) {
        setIsSubmitting(false);
        return;
      }
      
      const { error } = await supabase.from('solicitacoes_alteracao_endereco').insert({
        solicitante_id: user.id,
        telefone: data.telefone,
        cep: data.cep,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        complemento: data.complemento,
        turno: data.turno,
        rota_atual: data.rotaAtual,
        alterar_rota: data.alterarRota === "sim",
        nova_rota: data.alterarRota === "sim" ? data.novaRota : null,
        endereco_atual: "Endereço atual do sistema",
        endereco_novo: `${data.endereco}, ${data.bairro}, ${data.cidade}, ${data.cep}`,
        comprovante_url: fileUrl,
        status: 'pendente'
      });
      
      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast.error("Erro ao enviar solicitação");
        return;
      }
      
      toast.success("Solicitação enviada com sucesso!");
      navigate("/minhas-solicitacoes");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Custom dropdown selector for mobile
  const MobileDropdownSelector = ({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    isOpen, 
    setIsOpen 
  }: { 
    options: string[]; 
    value: string; 
    onChange: (value: string) => void; 
    placeholder: string; 
    isOpen: boolean; 
    setIsOpen: (isOpen: boolean) => void;
  }) => {
    return (
      <div className="relative w-full">
        <button
          type="button"
          className="form-select-input flex items-center justify-between w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? "" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div 
                key={option}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-700 last:border-0"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span>{option}</span>
                {value === option && <Check className="h-4 w-4" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <FormLayout
      title="Alteração de Endereço"
      description="Preencha o formulário para solicitar a alteração do seu endereço cadastrado."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel className="form-field-label">Matrícula</FormLabel>
              <FormControl>
                <Input value={user?.matricula || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel className="form-field-label">Nome</FormLabel>
              <FormControl>
                <Input value={user?.nome || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel className="form-field-label">Cargo</FormLabel>
              <FormControl>
                <Input value={user?.cargo || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel className="form-field-label">Setor</FormLabel>
              <FormControl>
                <Input value={user?.setor || ""} disabled className="form-field-input" />
              </FormControl>
            </FormItem>
          </div>
          
          <FormField
            control={form.control}
            name="telefone"
            rules={{ 
              required: "Telefone é obrigatório",
              pattern: {
                value: /^\d{10,11}$/,
                message: "Telefone inválido. Use apenas números (DDD + número)"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="DDD + número (apenas números)" 
                    {...field} 
                    className="form-field-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cep"
            rules={{ 
              required: "CEP é obrigatório",
              pattern: {
                value: /^\d{8}$/,
                message: "CEP inválido. Use apenas números"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">CEP do novo endereço</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="Apenas números" 
                      {...field} 
                      className="form-field-input"
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length === 8) {
                          buscarCep(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => buscarCep(field.value)}
                    disabled={field.value.length !== 8 || isLoadingCep}
                  >
                    {isLoadingCep ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="endereco"
              rules={{ required: "Endereço é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bairro"
              rules={{ required: "Bairro é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cidade"
              rules={{ required: "Cidade é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} className="form-field-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Complemento (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Apartamento, bloco, etc." 
                      {...field}
                      className="form-field-input" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="turno"
            rules={{ required: "Turno é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Turno</FormLabel>
                {window.innerWidth < 640 ? (
                  <MobileDropdownSelector
                    options={turnosOptions}
                    value={field.value}
                    onChange={(value) => form.setValue("turno", value)}
                    placeholder="Selecione o turno"
                    isOpen={false}
                    setIsOpen={() => {}}
                  />
                ) : (
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="form-select-input">
                        <SelectValue placeholder="Selecione o turno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {turnosOptions.map((turno) => (
                        <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rotaAtual"
            rules={{ required: "Rota atual é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-field-label">Rota Atual</FormLabel>
                {window.innerWidth < 640 ? (
                  <MobileDropdownSelector
                    options={rotasOptions}
                    value={field.value}
                    onChange={(value) => form.setValue("rotaAtual", value)}
                    placeholder="Selecione sua rota atual"
                    isOpen={showRotaDropdown}
                    setIsOpen={setShowRotaDropdown}
                  />
                ) : (
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="form-select-input">
                        <SelectValue placeholder="Selecione sua rota atual" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rotasOptions.map((rota) => (
                        <SelectItem key={rota} value={rota}>{rota}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="alterarRota"
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="form-field-label">Vai alterar a rota?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="sim" />
                      </FormControl>
                      <FormLabel className="font-normal">Sim</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="nao" />
                      </FormControl>
                      <FormLabel className="font-normal">Não</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {alterarRota === "sim" && (
            <FormField
              control={form.control}
              name="novaRota"
              rules={{ required: "Nova rota é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-field-label">Nova Rota</FormLabel>
                  {window.innerWidth < 640 ? (
                    <MobileDropdownSelector
                      options={novasRotasOptions}
                      value={field.value || ""}
                      onChange={(value) => form.setValue("novaRota", value)}
                      placeholder="Selecione a nova rota"
                      isOpen={showNovaRotaDropdown}
                      setIsOpen={setShowNovaRotaDropdown}
                    />
                  ) : (
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="form-select-input">
                          <SelectValue placeholder="Selecione a nova rota" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {novasRotasOptions.map((rota) => (
                          <SelectItem key={rota} value={rota}>{rota}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Comprovante de Endereço (File Upload) */}
          <FormItem>
            <FormLabel className="form-field-label">Comprovante de Endereço</FormLabel>
            <div className="border border-input rounded-md p-2">
              {!uploadedFile ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Clique para anexar um comprovante
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (Conta de luz, água ou telefone em seu nome)
                      </span>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded">
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {uploadedFile.name}
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <FormMessage>
              {!uploadedFile && "É necessário anexar um comprovante de endereço"}
            </FormMessage>
          </FormItem>
          
          <Button type="submit" className="w-full" disabled={isSubmitting || fileUploading}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      </Form>
    </FormLayout>
  );
};

export default AlteracaoEndereco;
