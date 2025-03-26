
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FlagTriangleLeft, FlagTriangleRight } from "lucide-react";
import { ROUTE_COLORS } from "./routeConstants";

interface MapControlsProps {
  selectedTurno: string;
  setSelectedTurno: (turno: string) => void;
  selectedRota: string | null;
  setSelectedRota: (rota: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  availableTurnos: string[];
  getAvailableRoutes: () => string[];
}

const MapControls = ({
  selectedTurno,
  setSelectedTurno,
  selectedRota,
  setSelectedRota,
  searchQuery,
  setSearchQuery,
  handleSearch,
  availableTurnos,
  getAvailableRoutes,
}: MapControlsProps) => {
  
  const clearRouteFilter = () => {
    setSelectedRota(null);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle>Mapa de Rotas de Transporte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <label className="text-sm font-medium mb-1 block">Rota (Opcional)</label>
            <div className="flex gap-2">
              <Select 
                value={selectedRota || ""}
                onValueChange={setSelectedRota}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Todas as rotas" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoutes().map(route => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRota && (
                <Button 
                  variant="outline" 
                  onClick={clearRouteFilter}
                  className="shrink-0"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Busca por Nome do Ponto ou Endereço</label>
            <div className="flex gap-2">
              <Input
                id="search-input"
                placeholder="Buscar pontos ou endereços"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Route color legend */}
        {!selectedRota && (
          <div className="flex flex-wrap gap-4 mt-2 mb-4">
            <div className="text-sm font-medium">Legenda:</div>
            {Object.entries(ROUTE_COLORS).map(([route, color]) => (
              <div key={route} className="flex items-center gap-1">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm">{route}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Flag legend */}
        {selectedRota && (
          <div className="flex flex-wrap gap-4 mt-2 mb-4">
            <div className="text-sm font-medium">Legenda:</div>
            <div className="flex items-center gap-1">
              <FlagTriangleLeft className="h-4 w-4 text-green-500" />
              <span className="text-sm">Primeiro ponto</span>
            </div>
            <div className="flex items-center gap-1">
              <FlagTriangleRight className="h-4 w-4 text-red-500" />
              <span className="text-sm">Último ponto</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapControls;
