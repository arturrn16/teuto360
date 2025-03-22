
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

interface CidadeSelectProps {
  form: UseFormReturn<FormValues>;
}

export const CidadeSelect = ({ form }: CidadeSelectProps) => {
  return (
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
              // Redefina o turno ao mudar a cidade
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
  );
};
