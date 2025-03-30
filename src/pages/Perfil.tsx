
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Check, X, Upload, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

const ProfilePage = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [lightMeal, setLightMeal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoStream, setPhotoStream] = useState<MediaStream | null>(null);
  const [badgeTemplate, setBadgeTemplate] = useState("badge_basic");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user's first and second name
  const userName = user?.nome 
    ? user.nome.split(' ').slice(0, 2).join(' ')
    : '';

  useEffect(() => {
    if (!user) return;
    
    // Fetch user photo and preference
    const fetchUserData = async () => {
      try {
        // Fetch photo
        const { data: photoData, error: photoError } = await supabase
          .from("user_photos")
          .select("photo_url")
          .eq("user_id", user.id)
          .single();

        if (photoError && photoError.code !== 'PGRST116') {
          console.error("Error fetching user photo:", photoError);
        } else if (photoData) {
          setPhotoUrl(photoData.photo_url);
        }

        // Fetch light meal preference
        const { data: prefData, error: prefError } = await supabase
          .from("user_preferences")
          .select("light_meal")
          .eq("user_id", user.id)
          .single();

        if (prefError && prefError.code !== 'PGRST116') {
          console.error("Error fetching user preferences:", prefError);
        } else if (prefData) {
          setLightMeal(prefData.light_meal || false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Update badge template based on user data
  useEffect(() => {
    if (user?.rota && lightMeal) {
      setBadgeTemplate("badge_light_route");
    } else if (user?.rota) {
      setBadgeTemplate("badge_route_only");
    } else {
      setBadgeTemplate("badge_basic");
    }
  }, [user?.rota, lightMeal]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPhotoStream(stream);
      setIsCapturing(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = () => {
    if (photoStream) {
      photoStream.getTracks().forEach(track => track.stop());
      setPhotoStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error("Não foi possível capturar a foto. Tente novamente.");
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error("Erro ao processar a foto. Tente novamente.");
      return;
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and upload
    canvas.toBlob(async (blob) => {
      if (!blob || !user) {
        toast.error("Erro ao processar a imagem. Tente novamente.");
        return;
      }
      
      await uploadPhoto(blob);
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        toast.error("Por favor, selecione uma imagem JPG ou PNG.");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("A imagem deve ter no máximo 5MB.");
        return;
      }
      
      uploadPhoto(file);
    }
  };

  const uploadPhoto = async (fileOrBlob: File | Blob) => {
    if (!user) return;
    
    try {
      // Show loading toast
      const loadingToast = toast.loading("Enviando foto...");
      
      const fileName = `${user.id}_${Date.now()}.jpg`;
      
      // Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user_photos')
        .upload(fileName, fileOrBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Error uploading photo:", uploadError);
        toast.dismiss(loadingToast);
        toast.error("Erro ao fazer upload da foto. Tente novamente.");
        return;
      }
        
      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('user_photos')
        .getPublicUrl(fileName);
        
      const photoUrl = publicUrlData.publicUrl;
      
      // Update or create entry in user_photos table
      const { data: existingData, error: checkError } = await supabase
        .from('user_photos')
        .select()
        .eq('user_id', user.id);
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing photo:", checkError);
        toast.dismiss(loadingToast);
        toast.error("Erro ao verificar foto existente. Tente novamente.");
        return;
      }
      
      let updateError;
      if (existingData && existingData.length > 0) {
        const { error } = await supabase
          .from('user_photos')
          .update({ photo_url: photoUrl })
          .eq('user_id', user.id);
        updateError = error;
      } else {
        const { error } = await supabase
          .from('user_photos')
          .insert({ user_id: user.id, photo_url: photoUrl });
        updateError = error;
      }
      
      if (updateError) {
        console.error("Error updating user_photos table:", updateError);
        toast.dismiss(loadingToast);
        toast.error("Erro ao salvar a referência da foto. Tente novamente.");
        return;
      }
      
      setPhotoUrl(photoUrl);
      stopCamera();
      setPhotoDialogOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Error in photo capture process:", error);
      toast.error("Erro ao salvar foto. Tente novamente.");
    }
  };

  const takeMobilePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLightMealChange = async (checked: boolean) => {
    if (!checked) {
      // If turning off, no need for confirmation
      updateLightMealPreference(false);
    } else {
      // If turning on, show confirmation dialog
      setConfirmDialogOpen(true);
    }
  };
  
  const confirmLightMealChoice = () => {
    updateLightMealPreference(true);
    setConfirmDialogOpen(false);
  };
  
  const cancelLightMealChoice = () => {
    setConfirmDialogOpen(false);
    // Reset checkbox state since user canceled
    setLightMeal(false);
  };

  const updateLightMealPreference = async (checked: boolean) => {
    if (!user) return;
    
    setLightMeal(checked);
    
    try {
      const { data: existingData } = await supabase
        .from('user_preferences')
        .select()
        .eq('user_id', user.id);
        
      if (existingData && existingData.length > 0) {
        await supabase
          .from('user_preferences')
          .update({ light_meal: checked })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert({ user_id: user.id, light_meal: checked });
      }
      
      toast.success(checked 
        ? "Preferência de refeição light ativada!" 
        : "Preferência de refeição light desativada!");
    } catch (error) {
      console.error("Error updating light meal preference:", error);
      toast.error("Erro ao atualizar preferência. Tente novamente.");
      setLightMeal(!checked); // Revert UI state on error
    }
  };

  const openPhotoDialog = () => {
    setPhotoDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Card className="p-6 relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Crachá Digital</h2>
            
            <div className="relative w-full max-w-md mx-auto">
              {/* Badge design based on the Teuto template */}
              <div className="relative aspect-[3/4] rounded-lg shadow-lg overflow-hidden">
                {/* White background with subtle shadow */}
                <div className="absolute inset-0 bg-white shadow-md z-0"></div>
                
                {/* Badge content */}
                <div className="relative z-10 h-full flex flex-col items-center p-4">
                  {/* Top clip section */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-16 h-8 bg-white rounded shadow"></div>
                  
                  {/* Teuto Logo */}
                  <div className="mt-6 mb-2 flex items-center justify-center w-full">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-24 bg-[#0087c8] mb-2"></div>
                      <h3 className="text-xl font-bold text-[#0087c8]">TEUTO</h3>
                      <div className="h-2 w-24 bg-[#0087c8] mt-2"></div>
                    </div>
                    <div className="h-12 w-px bg-[#0087c8] mx-4"></div>
                    <div className="text-[#0087c8] text-sm leading-tight">
                      <p>SE É TEUTO,</p>
                      <p>É DE CONFIANÇA</p>
                    </div>
                  </div>
                  
                  {/* Photo area with gray border */}
                  <div className="mt-6 w-40 h-40 bg-white border-4 border-gray-300 overflow-hidden">
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt="Foto de perfil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Sem foto</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom blue section with name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0087c8] h-20 flex flex-col items-center justify-center text-white p-3">
                    <h3 className="font-bold text-lg">{userName}</h3>
                    <p className="text-sm">{user?.setor || "Sem setor"}</p>
                    
                    {/* Badges */}
                    <div className="mt-1 flex gap-2 flex-wrap justify-center">
                      {user?.rota && (
                        <Badge variant="outline" className="text-xs font-medium bg-white text-[#0087c8] border-white">
                          ROTA: {user.rota}
                        </Badge>
                      )}
                      
                      {lightMeal && (
                        <Badge variant="outline" className="text-xs font-medium bg-white text-[#0087c8] border-white">
                          REFEIÇÃO LIGHT
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card className="p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">Atualizar Foto</h2>
            
            <div className="space-y-4">
              <Button onClick={openPhotoDialog} className="w-full" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Escolher Foto
              </Button>
              
              <input 
                type="file" 
                accept="image/*" 
                capture="user"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preferências</h2>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="light-meal" 
                checked={lightMeal}
                onCheckedChange={handleLightMealChange}
              />
              <label
                htmlFor="light-meal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Refeição Light
              </label>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Light Meal Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de Refeição Light</AlertDialogTitle>
            <AlertDialogDescription>
              Ao utilizar o benefício de refeição light do Laboratório Teuto SA, você concorda com os termos e condições estabelecidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLightMealChoice}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLightMealChoice}>Concordo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escolher Foto</DialogTitle>
            <DialogDescription>
              Escolha como deseja adicionar sua foto
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isCapturing ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="flex justify-center gap-3">
                  <Button onClick={capturePhoto} variant="default">
                    <Check className="h-4 w-4 mr-2" />
                    Capturar
                  </Button>
                  <Button onClick={stopCamera} variant="destructive">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button onClick={startCamera} variant="outline" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Usar Webcam
                </Button>
                
                <Button onClick={takeMobilePhoto} variant="outline" className="w-full">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Usar Câmera do Dispositivo
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar do Dispositivo
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
