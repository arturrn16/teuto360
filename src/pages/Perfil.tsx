
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components/ui/container";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Perfil = () => {
  const { user } = useAuth();
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [lightMeal, setLightMeal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);

  // Ensure this page is only accessible to 'comum' users
  if (user?.tipo_usuario !== 'comum') {
    return (
      <Container className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Esta página está disponível apenas para colaboradores.</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Format user's name to show only first and middle name
  const formatName = () => {
    if (!user?.nome) return '';
    const nameParts = user.nome.split(' ');
    if (nameParts.length === 1) return nameParts[0];
    return `${nameParts[0]} ${nameParts[1]}`;
  };

  useEffect(() => {
    // Fetch user photo and preferences
    const fetchUserData = async () => {
      try {
        // Get user photo
        const { data: photoData, error: photoError } = await supabase
          .from('user_photos')
          .select('photo_url')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (photoError) throw photoError;
        if (photoData) setPhotoURL(photoData.photo_url);

        // Get user preferences
        const { data: prefData, error: prefError } = await supabase
          .from('user_preferences')
          .select('light_meal')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (prefError) throw prefError;
        if (prefData) setLightMeal(prefData.light_meal);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream.current;
          setCapturing(true);
        }
      } else {
        toast.error("Seu dispositivo não suporta acesso à câmera");
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      toast.error("Não foi possível acessar a câmera");
    }
  };

  const capturePhoto = async () => {
    if (!canvasRef.current || !videoRef.current || !stream.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob
    try {
      canvas.toBlob(async (blob) => {
        if (!blob || !user) return;
        
        // Generate a unique filename
        const fileName = `${user.id}/${Date.now()}.jpg`;
        
        // Upload to storage
        const { data, error } = await supabase.storage
          .from('user_profile_photos')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: true
          });
        
        if (error) {
          console.error("Error uploading photo:", error);
          toast.error("Erro ao salvar foto");
          return;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user_profile_photos')
          .getPublicUrl(fileName);
        
        const photoUrl = urlData.publicUrl;
        
        // Save to user_photos table
        const { error: dbError } = await supabase
          .from('user_photos')
          .upsert(
            { 
              user_id: user.id,
              photo_url: photoUrl 
            },
            { 
              onConflict: 'user_id',
              ignoreDuplicates: false 
            }
          );
          
        if (dbError) {
          console.error("Error saving photo to database:", dbError);
          toast.error("Erro ao salvar referência da foto");
          return;
        }
        
        setPhotoURL(photoUrl);
        toast.success("Foto atualizada com sucesso!");
        stopCamera();
      }, 'image/jpeg', 0.8);
    } catch (err) {
      console.error("Error processing photo:", err);
      toast.error("Erro ao processar foto");
    }
  };

  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
      stream.current = null;
    }
    setCapturing(false);
  };

  const toggleLightMeal = async () => {
    try {
      const newValue = !lightMeal;
      setLightMeal(newValue);
      
      if (!user) return;
      
      // Update preference in database
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          { 
            user_id: user.id,
            light_meal: newValue 
          },
          { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          }
        );
        
      if (error) throw error;
      
      toast.success(newValue ? "Preferência de refeição light ativada" : "Preferência de refeição light desativada");
    } catch (error) {
      console.error("Error updating meal preference:", error);
      toast.error("Erro ao atualizar preferência de refeição");
      setLightMeal(!lightMeal); // Revert UI change
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Meu Perfil</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center">
            {/* Digital Badge */}
            <div className="relative w-full max-w-md aspect-[3/4] border-2 border-gray-300 rounded-md overflow-hidden bg-white mb-6">
              {/* Badge Header */}
              <div className="bg-blue-700 p-4 flex items-center justify-center">
                <h2 className="text-white font-bold text-xl">CRACHÁ DIGITAL</h2>
              </div>
              
              {/* Photo Area */}
              <div className="relative flex justify-center p-6 pb-0">
                <div className="w-48 h-48 relative border-4 border-blue-700 rounded-md overflow-hidden bg-gray-200">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt="Foto do perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Avatar className="w-32 h-32">
                        <AvatarFallback className="text-3xl bg-blue-100 text-blue-800">
                          {user?.nome?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Info */}
              <div className="bg-blue-600 text-white mt-6 p-4 text-center">
                <h3 className="text-xl font-bold">{formatName()}</h3>
                <p className="text-sm">{user?.setor || 'Setor não informado'}</p>
              </div>
              
              {/* Badge Footer with Route Info */}
              <div className="p-4 flex flex-col items-center">
                {user?.rota && (
                  <Badge variant="secondary" className="mb-2 text-xs">
                    Rota: {user.rota}
                  </Badge>
                )}
                
                {lightMeal && (
                  <Badge variant="success" className="text-xs">
                    Refeição Light
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Camera Controls */}
            {!capturing ? (
              <Button 
                onClick={startCamera} 
                className="w-full max-w-xs mb-4"
              >
                <Camera className="mr-2 h-4 w-4" />
                Tirar Foto
              </Button>
            ) : (
              <div className="w-full max-w-md mb-4">
                <div className="relative overflow-hidden rounded-md mb-2">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={capturePhoto}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Capturar
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Light Meal Preference */}
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="light-meal" 
                checked={lightMeal}
                onCheckedChange={toggleLightMeal}
              />
              <label
                htmlFor="light-meal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preferência por Refeição Light
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Perfil;
