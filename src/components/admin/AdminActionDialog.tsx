
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [includeComment, setIncludeComment] = useState(action === "reject" && isRejectionReasonRequired);

  const handleConfirm = () => {
    if (action === "reject" && isRejectionReasonRequired && !comment.trim()) {
      return; // Don't proceed if rejection reason is required but not provided
    }
    
    setIsSubmitting(true);
    onConfirm(includeComment ? comment : "");
    setIsSubmitting(false);
  };

  // Clear comment when dialog opens or closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setComment("");
      setIncludeComment(action === "reject" && isRejectionReasonRequired);
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
              ? "Deseja adicionar um comentário opcional antes de aprovar esta solicitação?"
              : isRejectionReasonRequired 
                ? "Informe o motivo da rejeição antes de continuar."
                : "Deseja adicionar um comentário opcional antes de rejeitar esta solicitação?"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="include-comment" 
            checked={includeComment} 
            onCheckedChange={(checked) => setIncludeComment(checked === true)}
            disabled={action === "reject" && isRejectionReasonRequired}
          />
          <label
            htmlFor="include-comment"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {action === "approve" 
              ? "Incluir comentário na aprovação" 
              : "Incluir motivo na rejeição"}
          </label>
        </div>

        {includeComment && (
          <div className="w-full">
            <Label htmlFor="admin_comment" className="mb-1 block font-medium">{label}</Label>
            <Textarea
              id="admin_comment"
              placeholder={placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-y w-full"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isSubmitting || (includeComment && action === "reject" && isRejectionReasonRequired && !comment.trim())}
            variant={action === "approve" ? "default" : "destructive"}
          >
            {action === "approve" ? "Aprovar" : "Rejeitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
