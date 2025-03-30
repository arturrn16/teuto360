import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { getUserPreferences, updateLightMealPreference } from "@/services/userPreferencesService";
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
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [lightMeal, setLightMeal] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [badgeTemplate, setBadgeTemplate] = useState("badge_basic");
  
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
          .eq("user_id", user.id);

        if (photoError) {
          console.error("Error fetching user photo:", photoError);
        } else if (photoData && photoData.length > 0) {
          setPhotoUrl(photoData[0].photo_url);
        }

        // Fetch light meal preference using the service
        const preferences = await getUserPreferences(user.id);
        if (preferences) {
          setLightMeal(preferences.light_meal || false);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) {
      return;
    }
    
    try {
      setIsUploading(true);
      const loadingToast = toast.loading("Enviando foto...");
      
      // Create a unique file name
      const fileName = `${user.id}_${Date.now()}.${file.name.split('.').pop()}`;
      const uniqueFileName = `${user.id}/${fileName}`;
      
      // Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user_photos')
        .upload(uniqueFileName, file, {
          cacheControl: 'no-cache',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Error uploading photo:", uploadError);
        toast.dismiss(loadingToast);
        toast.error("Erro ao fazer upload da foto. Tente novamente.");
        setIsUploading(false);
        return;
      }
        
      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('user_photos')
        .getPublicUrl(uniqueFileName);
        
      const photoUrl = publicUrlData.publicUrl;
      
      // Generate timestamp to avoid browser caching
      const timeStampedUrl = `${photoUrl}?t=${Date.now()}`;
      
      // Check if user already has a photo entry
      const { data: existingData, error: checkError } = await supabase
        .from('user_photos')
        .select()
        .eq('user_id', user.id);
        
      if (checkError) {
        console.error("Error checking existing photo:", checkError);
        toast.dismiss(loadingToast);
        toast.error("Erro ao verificar foto existente. Tente novamente.");
        setIsUploading(false);
        return;
      }
      
      let updateError;
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('user_photos')
          .update({ photo_url: timeStampedUrl, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
        updateError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_photos')
          .insert({ user_id: user.id, photo_url: timeStampedUrl });
        updateError = error;
      }
      
      if (updateError) {
        console.error("Error updating user_photos table:", updateError);
        toast.dismiss(loadingToast);
        toast.error("Erro ao salvar a referência da foto. Tente novamente.");
        setIsUploading(false);
        return;
      }
      
      // Update local state
      setPhotoUrl(timeStampedUrl);
      setPhotoDialogOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Error in photo upload process:", error);
      toast.error("Erro ao salvar foto. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLightMealChange = async (checked: boolean) => {
    if (!checked) {
      // If turning off, no need for confirmation
      await updateUserLightMealPreference(false);
    } else {
      // If turning on, show confirmation dialog
      setConfirmDialogOpen(true);
    }
  };
  
  const confirmLightMealChoice = async () => {
    await updateUserLightMealPreference(true);
    setConfirmDialogOpen(false);
  };
  
  const cancelLightMealChoice = () => {
    setConfirmDialogOpen(false);
    // Reset checkbox state since user canceled
    setLightMeal(false);
  };

  const updateUserLightMealPreference = async (checked: boolean) => {
    if (!user) return;
    
    // Optimistically update UI
    setLightMeal(checked);
    
    // Use the service to update the preference
    const success = await updateLightMealPreference(user.id, checked);
    
    if (success) {
      toast.success(checked 
        ? "Preferência de refeição light ativada!" 
        : "Preferência de refeição light desativada!");
    } else {
      // Revert UI state on error
      setLightMeal(!checked);
    }
  };

  const openPhotoDialog = () => {
    setPhotoDialogOpen(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              <Button 
                onClick={openPhotoDialog} 
                className="w-full" 
                variant="outline"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Enviando..." : "Selecionar Foto"}
              </Button>
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

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Atualizar Foto</DialogTitle>
            <DialogDescription>
              Selecione uma foto da sua galeria para seu crachá
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <Button 
              onClick={triggerFileInput}
              variant="default" 
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Enviando..." : "Escolher da Galeria"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
