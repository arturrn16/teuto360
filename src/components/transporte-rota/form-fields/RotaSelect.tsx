
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../TransporteRotaForm";

interface RotaSelectProps {
  form: UseFormReturn<FormValues>;
}

export const RotaSelect = ({ form }: RotaSelectProps) => {
  const cidade = form.watch("cidade");
  const turno = form.watch("turno");

  // Opções dinâmicas de rota com base na cidade e turno
  const getRotaOptions = () => {
    if (!turno) return [];
    
    // Rotas para Goiânia são os próprios turnos
    if (cidade === "Goiânia") {
      return [turno]; // A rota para Goiânia é o próprio turno selecionado
    }
    
    // Rotas para Anápolis
    if (cidade === "Anápolis") {
      if (turno === "1° Turno") {
        return Array.from({ length: 15 }, (_, i) => `P-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "2° Turno") {
        return Array.from({ length: 12 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "3° Turno") {
        return Array.from({ length: 8 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`);
      } else if (turno === "Administrativo") {
        return Array.from({ length: 8 }, (_, i) => `ADM-${String(i + 1).padStart(2, '0')}`);
      }
    }
    
    return [];
  };
  
  const rotaOptions = getRotaOptions();

  return (
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
            disabled={!turno || (cidade === "Goiânia")} // Desabilita se não tiver turno ou se for Goiânia
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a rota" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {rotaOptions.map((option) => (
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
  );
};
