
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminCommentFieldProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function AdminCommentField({
  value,
  onChange,
  id = "comentario",
  label = "Comentário do Administrador (opcional)",
  placeholder = "Adicione um comentário sobre esta solicitação",
  className = "mt-1",
}: AdminCommentFieldProps) {
  return (
    <div className="w-full">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
}
