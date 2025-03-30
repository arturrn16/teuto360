
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { AdminCommentField } from "./AdminCommentField";

interface AdminActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  title: string;
  action: "approve" | "reject";
  isRejectionReasonRequired?: boolean;
}

export function AdminActionDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  action,
  isRejectionReasonRequired = false
}: AdminActionDialogProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    if (action === "reject" && isRejectionReasonRequired && !comment.trim()) {
      return; // Don't proceed if rejection reason is required but not provided
    }
    
    setIsSubmitting(true);
    onConfirm(comment);
    setIsSubmitting(false);
  };

  // Clear comment when dialog opens or closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setComment("");
      onClose();
    }
  };

  const label = action === "approve" 
    ? "Comentário sobre a aprovação (opcional)" 
    : isRejectionReasonRequired 
      ? "Motivo da rejeição (obrigatório)" 
      : "Motivo da rejeição (opcional)";

  const placeholder = action === "approve"
    ? "Adicione um comentário sobre esta aprovação"
    : "Informe o motivo da rejeição";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {action === "approve" 
              ? "Adicione um comentário opcional antes de aprovar esta solicitação."
              : isRejectionReasonRequired 
                ? "Informe o motivo da rejeição antes de continuar."
                : "Adicione um comentário opcional antes de rejeitar esta solicitação."
            }
          </DialogDescription>
        </DialogHeader>

        <AdminCommentField
          value={comment}
          onChange={setComment}
          label={label}
          placeholder={placeholder}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isSubmitting || (action === "reject" && isRejectionReasonRequired && !comment.trim())}
            variant={action === "approve" ? "default" : "destructive"}
          >
            {action === "approve" ? "Aprovar" : "Rejeitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
