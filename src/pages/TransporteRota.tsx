
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { getAvailableFormRoutes, goianiaTurnosOptions } from "@/data/routes";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormValues {
  matricula: string;
  colaboradorNome: string;
  cargo: string;
  setor: string;
  cidade: "Anápolis" | "Goiânia";
  turno: string;
  rota: string;
  periodoInicio: Date;
  periodoFim: Date;
  motivo: string;
}

const TransporteRota = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  // Check if the current user is a "selecao" type user
  const isSelecaoUser = user?.tipo_usuario === 'selecao';
  
  const form = useForm<FormValues>({
    defaultValues: {
      matricula: isSelecaoUser ? "" : user?.matricula || "",
      colaboradorNome: isSelecaoUser ? "" : user?.nome || "",
      cargo: isSelecaoUser ? "" : user?.cargo || "",
      setor: isSelecaoUser ? "" : user?.setor || "",
      cidade: "Anápolis",
      turno: "",
      rota: "",
      periodoInicio: new Date(),
      periodoFim: new Date(),
      motivo: "",
    },
  });
  
  useEffect(() => {
    // Only auto-fill user data if not a selecao user
    if (user && !isSelecaoUser) {
      form.setValue("matricula", user.matricula);
      form.setValue("colaboradorNome", user.nome);
      form.setValue("cargo", user.cargo || "");
      form.setValue("setor", user.setor || "");
    }
  }, [user, form, isSelecaoUser]);
  
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");
  
  // Opções de turno baseadas na cidade selecionada
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno", "Faculdade"]
    : ["GYN ADM1", "GYN ADM2", "GYN 1° TURNO", "GYN 2° TURNO"];

  // Update available routes when turno changes
  useEffect(() => {
    if (turno) {
      if (cidade === "Goiânia") {
        // Para Goiânia, a rota é sempre igual ao turno
        setAvailableRoutes([turno]);
        form.setValue("rota", turno);
      } else {
        const routes = getAvailableFormRoutes(turno, cidade);
        setAvailableRoutes(routes);
        
        // Se apenas uma rota estiver disponível, selecioná-la automaticamente
        if (routes.length === 1) {
          form.setValue("rota", routes[0]);
        } else {
          form.setValue("rota", ""); // Reset route when turno changes with multiple options
        }
      }
    } else {
      setAvailableRoutes([]);
    }
  }, [turno, cidade, form]);
  
  // FIXED: Format date directly without timezone conversion
  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma solicitação");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("solicitacoes_transporte_rota").insert({
        solicitante_id: user.id,
        matricula: data.matricula,
        colaborador_nome: data.colaboradorNome,
        cidade: data.cidade,
        turno: data.turno,
        rota: data.rota,
        periodo_inicio: formatDate(data.periodoInicio),
        periodo_fim: formatDate(data.periodoFim),
        motivo: data.motivo,
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
  
  const renderFormContent = () => {
    if (isMobile) {
      return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <label className="form-field-label">Matrícula</label>
            <input 
              type="text" 
              className={`form-field-input ${isSelecaoUser ? "" : "bg-gray-100"}`}
              value={form.watch("matricula")}
              onChange={(e) => form.setValue("matricula", e.target.value)}
              disabled={!isSelecaoUser}
            />
            
            <label className="form-field-label">Nome</label>
            <input 
              type="text" 
              className={`form-field-input ${isSelecaoUser ? "" : "bg-gray-100"}`}
              value={form.watch("colaboradorNome")}
              onChange={(e) => form.setValue("colaboradorNome", e.target.value)}
              disabled={!isSelecaoUser}
            />
            
            <label className="form-field-label">Cargo</label>
            <input 
              type="text" 
              className={`form-field-input ${isSelecaoUser ? "" : "bg-gray-100"}`}
              value={form.watch("cargo")}
              onChange={(e) => form.setValue("cargo", e.target.value)}
              disabled={!isSelecaoUser}
            />
            
            <label className="form-field-label">Setor</label>
            <input 
              type="text" 
              className={`form-field-input ${isSelecaoUser ? "" : "bg-gray-100"}`}
              value={form.watch("setor")}
              onChange={(e) => form.setValue("setor", e.target.value)}
              disabled={!isSelecaoUser}
            />
          </div>
          
          <div>
            <label className="form-field-label">Cidade</label>
            <select 
              className="form-select-input" 
              value={cidade}
              onChange={(e) => {
                form.setValue("cidade", e.target.value as "Anápolis" | "Goiânia");
                form.setValue("turno", "");
                form.setValue("rota", "");
              }}
            >
              <option value="Anápolis">Anápolis</option>
              <option value="Goiânia">Goiânia</option>
            </select>
            
            <label className="form-field-label">Turno</label>
            <select 
              className="form-select-input"
              value={turno}
              onChange={(e) => {
                form.setValue("turno", e.target.value);
                if (cidade === "Goiânia") {
                  form.setValue("rota", e.target.value);
                }
              }}
            >
              <option value="" disabled>Selecione o turno</option>
              {turnoOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            <label className="form-field-label">Rota</label>
            <select 
              className="form-select-input"
              value={form.watch("rota")}
              onChange={(e) => form.setValue("rota", e.target.value)}
              disabled={!turno || cidade === "Goiânia"}
            >
              <option value="" disabled>Selecione a rota</option>
              {availableRoutes.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            {/* FIXED: Updated date input handling to preserve selected dates */}
            <label className="form-field-label">Data de Início</label>
            <input 
              type="date" 
              className="form-field-input"
              value={format(form.watch("periodoInicio"), "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) {
                  const selectedDate = new Date(e.target.value + "T00:00:00");
                  form.setValue("periodoInicio", selectedDate);
                }
              }}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            
            <label className="form-field-label">Data de Término</label>
            <input 
              type="date" 
              className="form-field-input"
              value={format(form.watch("periodoFim"), "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) {
                  const selectedDate = new Date(e.target.value + "T00:00:00");
                  form.setValue("periodoFim", selectedDate);
                }
              }}
              min={format(form.watch("periodoInicio"), "yyyy-MM-dd")}
            />
            
            <label className="form-field-label">Motivo</label>
            <textarea 
              className="form-field-input"
              rows={5}
              placeholder="Descreva o motivo da solicitação"
              {...form.register("motivo", { required: "Motivo é obrigatório" })}
            />
            {form.formState.errors.motivo && (
              <p className="text-red-500 -mt-4 mb-4">{form.formState.errors.motivo.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full py-4 text-lg rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      );
    }
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="matricula"
              rules={{ required: "Matrícula é obrigatória" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input readOnly={!isSelecaoUser} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="colaboradorNome"
              rules={{ required: "Nome do colaborador é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Colaborador</FormLabel>
                  <FormControl>
                    <Input readOnly={!isSelecaoUser} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input readOnly={!isSelecaoUser} {...field} />
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
                    <Input readOnly={!isSelecaoUser} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="cidade"
            rules={{ required: "Cidade é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("turno", "");
                    form.setValue("rota", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Anápolis">Anápolis</SelectItem>
                    <SelectItem value="Goiânia">Goiânia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="turno"
            rules={{ required: "Turno é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turno</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (cidade === "Goiânia") {
                      form.setValue("rota", value);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {turnoOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rota"
            rules={{ required: "Rota é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rota</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!turno || cidade === "Goiânia"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a rota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableRoutes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="periodoInicio"
              rules={{ required: "Data de início é obrigatória" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // FIXED: Set to noon to avoid timezone issues
                            const selectedDate = new Date(date);
                            selectedDate.setHours(12, 0, 0, 0);
                            field.onChange(selectedDate);
                          }
                          setOpenStartDate(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="periodoFim"
              rules={{ 
                required: "Data de término é obrigatória",
                validate: (value) => {
                  const inicio = form.getValues("periodoInicio");
                  return value >= inicio || "Data de término deve ser após a data de início";
                }
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Término</FormLabel>
                  <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // FIXED: Set to noon to avoid timezone issues
                            const selectedDate = new Date(date);
                            selectedDate.setHours(12, 0, 0, 0);
                            field.onChange(selectedDate);
                          }
                          setOpenEndDate(false);
                        }}
                        disabled={(date) => {
                          const inicio = form.getValues("periodoInicio");
                          return date < inicio;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="motivo"
            rules={{ required: "Motivo é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva o motivo da solicitação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>
      </Form>
    );
  };
  
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Solicitação de Transporte - Rota</CardTitle>
          <CardDescription>
            Preencha o formulário para solicitar transporte de rota
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderFormContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransporteRota;
