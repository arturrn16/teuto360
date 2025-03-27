
import { useState, useCallback, useEffect } from "react";
import { Container } from "@/components/ui/container";
import MapControls from "@/components/maps/MapControls";
import RouteMap from "@/components/maps/RouteMap";
import { allRouteData, getAvailableTurnos, getAvailableRoutes } from "@/data/routeData";

const MapaRotas = () => {
  const [selectedTurno, setSelectedTurno] = useState("1° Turno");
  const [selectedRota, setSelectedRota] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    // Actual search happens in RouteMap component through searchQuery prop
  };

  // Clear selected route when turno changes
  useEffect(() => {
    setSelectedRota(null);
  }, [selectedTurno]);

  return (
    <Container>
      <div className="space-y-4 py-4">
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
      </div>
    </Container>
  );
};

export default MapaRotas;
