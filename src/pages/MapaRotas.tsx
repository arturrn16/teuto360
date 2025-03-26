
import { useState, useCallback } from "react";
import { Container } from "@/components/ui/container";
import MapControls from "@/components/maps/MapControls";
import RouteMap from "@/components/maps/RouteMap";
import RouteInfo from "@/components/maps/RouteInfo";
import { allRouteData, getAvailableTurnos, getAvailableRoutes } from "@/data/routeData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MapaRotas = () => {
  const [selectedTurno, setSelectedTurno] = useState("1° Turno");
  const [selectedRota, setSelectedRota] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("map");

  // Get bus stops for the selected shift
  const getBusStopsForTurno = useCallback(() => {
    return allRouteData[selectedTurno] || {};
  }, [selectedTurno]);

  // Get available routes for the selected shift
  const getRoutesForTurno = useCallback(() => {
    return getAvailableRoutes(selectedTurno);
  }, [selectedTurno]);

  // Handle search
  const handleSearch = () => {
    // This is just a proxy function - actual search happens in RouteMap component
  };

  return (
    <Container>
      <div className="space-y-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="info">Inf. de Rota</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-4">
            <MapControls
              selectedTurno={selectedTurno}
              setSelectedTurno={setSelectedTurno}
              selectedRota={selectedRota}
              setSelectedRota={setSelectedRota}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              availableTurnos={getAvailableTurnos()}
              getAvailableRoutes={getRoutesForTurno}
            />
            <RouteMap
              selectedRota={selectedRota}
              selectedTurno={selectedTurno}
              busStopsByRoute={getBusStopsForTurno()}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <RouteInfo
              selectedTurno={selectedTurno}
              setSelectedTurno={setSelectedTurno}
              busStopsByRoute={getBusStopsForTurno()}
              availableTurnos={getAvailableTurnos()}
              getAvailableRoutes={getRoutesForTurno}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default MapaRotas;
