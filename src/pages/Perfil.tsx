
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User, Route, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DigitalBadge from "@/components/badge/DigitalBadge";
import CameraCapture from "@/components/camera/CameraCapture";

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [lightMeal, setLightMeal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [badgeTemplate, setBadgeTemplate] = useState<string | null>(null);
  const [lightMealBadge, setLightMealBadge] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        // Buscar foto do usuário
        const { data: photoData, error: photoError } = await supabase
          .from("user_photos")
          .select("photo_url")
          .eq("user_id", user.id)
          .single();

        if (photoError && photoError.code !== "PGRST116") {
          console.error("Erro ao buscar foto do usuário:", photoError);
        }

        if (photoData) {
          setUserPhoto(photoData.photo_url);
        }

        // Buscar preferências do usuário
        const { data: prefData, error: prefError } = await supabase
          .from("user_preferences")
          .select("light_meal")
          .eq("user_id", user.id)
          .single();

        if (prefError && prefError.code !== "PGRST116") {
          console.error("Erro ao buscar preferências do usuário:", prefError);
        }

        if (prefData) {
          setLightMeal(prefData.light_meal);
        }

        // Buscar assets do app (template do crachá e badge de refeição light)
        const { data: assets, error: assetsError } = await supabase
          .from("app_assets")
          .select("name, file_url");

        if (assetsError) {
          console.error("Erro ao buscar assets:", assetsError);
        }

        if (assets) {
          const template = assets.find(a => a.name === "teuto_badge_template");
          const lightBadge = assets.find(a => a.name === "refeicao_light_badge");
          
          if (template) setBadgeTemplate(template.file_url);
          if (lightBadge) setLightMealBadge(lightBadge.file_url);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleTakePhoto = async (photoBlob: Blob) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Upload da foto para o storage
      const fileName = `user_${user.id}_${Date.now()}.jpg`;
      const filePath = `profile_photos/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user_photos")
        .upload(filePath, photoBlob, {
          contentType: "image/jpeg",
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública da foto
      const { data: publicUrl } = supabase.storage
        .from("user_photos")
        .getPublicUrl(filePath);

      if (!publicUrl || !publicUrl.publicUrl) {
        throw new Error("Erro ao obter URL pública da foto");
      }

      // Salvar referência da foto no banco
      const { error: saveError } = await supabase
        .from("user_photos")
        .upsert({
          user_id: user.id,
          photo_url: publicUrl.publicUrl
        }, {
          onConflict: "user_id"
        });

      if (saveError) {
        throw saveError;
      }

      setUserPhoto(publicUrl.publicUrl);
      toast.success("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      toast.error("Erro ao salvar foto");
    } finally {
      setIsLoading(false);
      setIsCapturing(false);
    }
  };

  const handleLightMealChange = async (checked: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          light_meal: checked
        }, {
          onConflict: "user_id"
        });

      if (error) {
        throw error;
      }

      setLightMeal(checked);
      toast.success(checked ? "Refeição Light ativada" : "Refeição Light desativada");
    } catch (error) {
      console.error("Erro ao atualizar preferência:", error);
      toast.error("Erro ao atualizar preferência");
    } finally {
      setIsLoading(false);
    }
  };

  // Extrair apenas o primeiro e segundo nome
  const getShortName = (fullName: string) => {
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[1]}`;
    }
    return nameParts[0];
  };

  if (isCapturing) {
    return <CameraCapture onCapture={handleTakePhoto} onCancel={() => setIsCapturing(false)} />;
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border border-gray-200">
                  {userPhoto ? (
                    <AvatarImage src={userPhoto} alt={user.nome} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium">{user.nome}</h3>
                  <p className="text-sm text-gray-500">Matrícula: {user.matricula}</p>
                  {user.cargo && <p className="text-sm text-gray-500">Cargo: {user.cargo}</p>}
                  {user.setor && <p className="text-sm text-gray-500">Setor: {user.setor}</p>}
                  {user.rota && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Route className="h-3 w-3" />
                        Rota: {user.rota}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setIsCapturing(true)}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Atualizar Foto
                </Button>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="light-meal" 
                    checked={lightMeal}
                    onCheckedChange={(checked) => handleLightMealChange(Boolean(checked))}
                  />
                  <label
                    htmlFor="light-meal"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Prefiro Refeição Light
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {user && badgeTemplate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Meu Crachá Digital</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DigitalBadge 
                user={{
                  name: getShortName(user.nome),
                  photo: userPhoto,
                  sector: user.setor || "",
                  route: user.rota
                }}
                badgeTemplate={badgeTemplate}
                showLightMeal={lightMeal}
                lightMealBadge={lightMealBadge}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default Perfil;
