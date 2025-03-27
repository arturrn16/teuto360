
import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { BusStop } from "@/types/mapTypes";

interface RouteInfoProps {
  selectedTurno: string;
  setSelectedTurno: (turno: string) => void;
  busStopsByRoute: Record<string, BusStop[]>;
  availableTurnos: string[];
  getAvailableRoutes: () => string[];
}

const RouteInfo = ({
  selectedTurno,
  setSelectedTurno,
  busStopsByRoute,
  availableTurnos,
  getAvailableRoutes,
}: RouteInfoProps) => {
  const [selectedRota, setSelectedRota] = useState<string>("");
  const [searchNeighborhood, setSearchNeighborhood] = useState("");
  
  // Get unique neighborhoods from all bus stops
  const uniqueNeighborhoods = useMemo(() => {
    const neighborhoodSet = new Set<string>();
    
    Object.values(busStopsByRoute).forEach(stops => {
      stops.forEach(stop => {
        if (stop.bairro) {
          neighborhoodSet.add(stop.bairro);
        }
      });
    });
    
    return Array.from(neighborhoodSet).sort();
  }, [busStopsByRoute]);
  
  // Calculate route statistics
  const calculateRouteStats = useCallback((routeId: string) => {
    const stops = busStopsByRoute[routeId] || [];
    
    if (stops.length === 0) {
      return { totalStops: 0, averageTime: "N/A" };
    }
    
    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];
    
    // Parse time from format HH:MM
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes; // Convert to minutes
    };
    
    // Parse semana (weekday) time for first and last stops
    const firstTimeMinutes = parseTime(firstStop.semana);
    const lastTimeMinutes = parseTime(lastStop.semana);
    
    // Calculate time difference in minutes
    let diffMinutes = lastTimeMinutes - firstTimeMinutes;
    if (diffMinutes < 0) {
      // Handle if route goes past midnight
      diffMinutes += 24 * 60;
    }
    
    // Format time difference as HH:MM
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return {
      totalStops: stops.length,
      averageTime: formattedTime
    };
  }, [busStopsByRoute]);
  
  // Find routes that serve a specific neighborhood
  const findRoutesByNeighborhood = useCallback((neighborhood: string) => {
    const matchingRoutes = Object.entries(busStopsByRoute).filter(([_, stops]) => {
      return stops.some(stop => stop.bairro.toLowerCase() === neighborhood.toLowerCase());
    });
    
    return matchingRoutes.map(([routeId]) => routeId);
  }, [busStopsByRoute]);
  
  // Handle neighborhood search
  const handleNeighborhoodSearch = () => {
    if (!searchNeighborhood) {
      toast.error("Selecione um bairro para buscar");
      return;
    }
    
    const matchingRoutes = findRoutesByNeighborhood(searchNeighborhood);
    
    if (matchingRoutes.length === 0) {
      toast.error(`Nenhuma rota encontrada para o bairro ${searchNeighborhood}`);
    } else {
      toast.success(`${matchingRoutes.length} rota(s) encontrada(s): ${matchingRoutes.join(", ")}`);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle>Informações de Rotas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="route-stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="route-stats">Estatísticas da Rota</TabsTrigger>
            <TabsTrigger value="neighborhood-search">Busca por Bairro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="route-stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Turno</label>
                <Select value={selectedTurno} onValueChange={setSelectedTurno}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTurnos.map(turno => (
                      <SelectItem key={turno} value={turno}>
                        {turno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Rota</label>
                <Select 
                  value={selectedRota} 
                  onValueChange={setSelectedRota}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a rota" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRoutes().map(route => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedRota && (
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-bold mb-2 text-lg">{selectedRota}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Número de paradas:</p>
                    <p className="font-medium text-lg">{calculateRouteStats(selectedRota).totalStops}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tempo médio da rota:</p>
                    <p className="font-medium text-lg">{calculateRouteStats(selectedRota).averageTime}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="neighborhood-search" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Turno</label>
                <Select value={selectedTurno} onValueChange={setSelectedTurno}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTurnos.map(turno => (
                      <SelectItem key={turno} value={turno}>
                        {turno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Bairro</label>
                <Select 
                  value={searchNeighborhood}
                  onValueChange={setSearchNeighborhood}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueNeighborhoods.map(neighborhood => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={handleNeighborhoodSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar Rotas
            </Button>
            
            {searchNeighborhood && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Rotas que atendem {searchNeighborhood}:</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  {findRoutesByNeighborhood(searchNeighborhood).length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {findRoutesByNeighborhood(searchNeighborhood).map(route => (
                        <li key={route}>{route}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhuma rota encontrada para este bairro no turno selecionado.</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RouteInfo;
