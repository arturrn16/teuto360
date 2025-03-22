
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

interface TurnoSelectProps {
  form: UseFormReturn<FormValues>;
}

export const TurnoSelect = ({ form }: TurnoSelectProps) => {
  const cidade = form.watch("cidade");

  // Opções dinâmicas de turno com base na cidade
  const turnoOptions = cidade === "Anápolis" 
    ? ["Administrativo", "1° Turno", "2° Turno", "3° Turno"]
    : ["Adm Gyn 1", "Adm Gyn 2", "Gyn 1° Turno", "Gyn 2° Turno"];

  return (
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
              // Redefina a rota ao mudar o turno
              form.setValue("rota", "");
              
              // Se for Goiânia, seleciona automaticamente a única opção de rota (o próprio turno)
              if (cidade === "Goiânia" && value) {
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
  );
};
