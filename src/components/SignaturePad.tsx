
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  disabled?: boolean;
}

export const SignaturePad = ({ onSignatureChange, disabled = false }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSigned(false);
      onSignatureChange(null);
    }
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      const isEmpty = sigCanvas.current.isEmpty();
      setIsSigned(!isEmpty);
      if (!isEmpty) {
        const signatureDataUrl = sigCanvas.current.toDataURL();
        onSignatureChange(signatureDataUrl);
      } else {
        onSignatureChange(null);
      }
    }
  };

  const handleBegin = () => {
    // Focus the signature canvas when the user starts signing
    if (sigCanvas.current) {
      sigCanvas.current.focus();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="border border-input rounded-md bg-background p-1 relative">
        {isSigned && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="absolute top-2 right-2 z-10 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar assinatura</span>
          </Button>
        )}
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
            style: { backgroundColor: "white" }
          }}
          onEnd={handleEnd}
          onBegin={handleBegin}
          disabled={disabled}
        />
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Assine acima usando o mouse ou toque na tela
      </div>
    </div>
  );
};
