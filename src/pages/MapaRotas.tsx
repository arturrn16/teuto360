
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Map } from "lucide-react";

const MapaRotas = () => {
  const [selectedMap, setSelectedMap] = useState<string>("primeiroTurno");
  
  const mapOptions = [
    { id: "primeiroTurno", name: "1° Turno", url: "https://www.google.com/maps/d/u/1/embed?mid=1Fq3tBWV7qxp823geoKFlWAsJZPuqV2A&ehbc=2E312F" },
    { id: "segundoTurno", name: "2° Turno", url: "https://www.google.com/maps/d/u/1/embed?mid=1A9QS-soZMrJG9CSoM0lwPJqlGfqldRg&ehbc=2E312F" },
    { id: "terceiroTurno", name: "3° Turno", url: "https://www.google.com/maps/d/u/1/embed?mid=1S5MKGg6v2D9n1mMHhIiPc1IbVPKcuLo&ehbc=2E312F" },
    { id: "goiania1", name: "Goiânia 1", url: "https://www.google.com/maps/d/u/1/embed?mid=1S5MKGg6v2D9n1mMHhIiPc1IbVPKcuLo&ehbc=2E312F" },
    { id: "goiania2", name: "Goiânia 2", url: "https://www.google.com/maps/d/u/1/embed?mid=1UcSn-3LoQVkJUpkPpFpBJfCj74TpCos&ehbc=2E312F" },
  ];
  
  const currentMap = mapOptions.find(map => map.id === selectedMap);
  
  return (
    <div className="container max-w-5xl py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            Mapa de Rotas
          </CardTitle>
          <CardDescription>
            Visualize as rotas disponíveis para os diferentes turnos e locais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selecione o mapa que deseja visualizar:
            </label>
            <Select 
              value={selectedMap}
              onValueChange={setSelectedMap}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Selecione um mapa" />
              </SelectTrigger>
              <SelectContent>
                {mapOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-[480px] md:h-[600px]">
            {currentMap && (
              <iframe 
                src={currentMap.url}
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de rotas - ${currentMap.name}`}
              ></iframe>
            )}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
            Observe o mapa para verificar se há uma rota que atende sua localidade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaRotas;
