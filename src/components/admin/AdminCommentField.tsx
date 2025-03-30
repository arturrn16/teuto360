
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdminCommentFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function AdminCommentField({
  value,
  onChange,
  label = "Comentário (opcional)",
  placeholder = "Adicione um comentário sobre esta solicitação"
}: AdminCommentFieldProps) {
  return (
    <div className="w-full">
      <Label htmlFor="admin_comment">{label}</Label>
      <Textarea
        id="admin_comment"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
}
