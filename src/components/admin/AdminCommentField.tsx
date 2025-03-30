
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdminCommentFieldProps {
  onChange: (value: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

const AdminCommentField = ({
  onChange,
  value = "",
  label = "Comentário (opcional)",
  placeholder = "Adicione um comentário ou motivo para esta decisão...",
  className = "",
}: AdminCommentFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="admin-comment">{label}</Label>
      <Textarea
        id="admin-comment"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px]"
      />
      <p className="text-xs text-gray-500">
        Este comentário será visível para o solicitante nos detalhes da solicitação.
      </p>
    </div>
  );
};

export default AdminCommentField;
