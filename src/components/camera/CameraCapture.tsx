
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        setError("Não foi possível acessar a câmera. Verifique se você concedeu as permissões necessárias.");
      }
    };

    startCamera();

    // Cleanup: parar a câmera quando o componente for desmontado
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Configurar o canvas para o mesmo tamanho do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Desenhar o frame atual do vídeo no canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter o canvas para uma URL de dados
    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);
    
    // Parar a câmera após capturar a imagem
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const confirmCapture = () => {
    if (!capturedImage || !canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
      }
    }, "image/jpeg", 0.95);
  };

  const retakePhoto = async () => {
    setCapturedImage(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Erro ao reiniciar a câmera:", err);
      setError("Não foi possível reiniciar a câmera.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Capturar Foto</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative aspect-square bg-gray-100">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-500">
              {error}
            </div>
          ) : capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Foto capturada" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="p-4 flex justify-center space-x-4">
          {capturedImage ? (
            <>
              <Button variant="outline" onClick={retakePhoto}>
                Nova Foto
              </Button>
              <Button onClick={confirmCapture} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Confirmar
              </Button>
            </>
          ) : (
            <Button onClick={capturePhoto} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Capturar
            </Button>
          )}
        </div>
      </div>
      
      {/* Canvas oculto para processamento da imagem */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
