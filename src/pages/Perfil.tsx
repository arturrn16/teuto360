
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { uploadUserPhoto } from "@/services/fileUploadService";
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
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [badgeTemplate, setBadgeTemplate] = useState("badge_basic");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userName = user?.nome 
    ? user.nome.split(' ').slice(0, 2).join(' ')
    : '';

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for user:", user.id);
        
        const { data: photoData, error: photoError } = await supabase
          .from("user_photos")
          .select("photo_url")
          .eq("user_id", user.id);

        if (photoError) {
          console.error("Error fetching user photo:", photoError);
        } else if (photoData && photoData.length > 0) {
          console.log("Photo data retrieved:", photoData);
          setPhotoUrl(photoData[0].photo_url);
        } else {
          console.log("No photo found for user", user.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (user?.rota) {
      setBadgeTemplate("badge_route_only");
    } else {
      setBadgeTemplate("badge_basic");
    }
  }, [user?.rota]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) {
      console.log("No file selected or user not logged in");
      return;
    }
    
    try {
      setIsUploading(true);
      const loadingToast = toast.loading("Enviando foto...");
      
      const { url, error } = await uploadUserPhoto(user.id, file);
      
      toast.dismiss(loadingToast);
      
      if (error) {
        console.error("Error uploading photo:", error);
        toast.error("Erro ao atualizar foto. Tente novamente.");
        setIsUploading(false);
        return;
      }
      
      if (url) {
        setPhotoUrl(url);
        setPhotoDialogOpen(false);
      }
    } catch (error) {
      console.error("Error in photo upload process:", error);
      toast.error("Erro ao salvar foto. Tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
              <div className="relative aspect-[3/4] rounded-lg shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-white shadow-md z-0"></div>
                <div className="relative z-10 h-full flex flex-col items-center p-4">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-16 h-8 bg-white rounded shadow"></div>
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
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0087c8] h-20 flex flex-col items-center justify-center text-white p-3">
                    <h3 className="font-bold text-lg">{userName}</h3>
                    <p className="text-sm">{user?.setor || "Sem setor"}</p>
                    
                    <div className="mt-1 flex gap-2 flex-wrap justify-center">
                      {user?.rota && (
                        <Badge variant="outline" className="text-xs font-medium bg-white text-[#0087c8] border-white">
                          ROTA: {user.rota}
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
        </div>
      </div>

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
