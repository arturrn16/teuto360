
import { useState, useCallback, useEffect, useMemo } from "react";
import { Container } from "@/components/ui/container";
import MapControls from "@/components/maps/MapControls";
import RouteMap from "@/components/maps/RouteMap";
import { allRouteData, getAvailableTurnos, getAvailableRoutes } from "@/data/routeData";

const MapaRotas = () => {
  const [selectedTurno, setSelectedTurno] = useState("1° Turno");
  const [selectedRota, setSelectedRota] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize the available turnos to prevent recalculation
  const availableTurnos = useMemo(() => getAvailableTurnos(), []);

  // Get bus stops for the selected shift - memoized
  const busStopsForTurno = useMemo(() => {
    return allRouteData[selectedTurno] || {};
  }, [selectedTurno]);

  // Get available routes for the selected shift - memoized
  const routesForTurno = useMemo(() => {
    return getAvailableRoutes(selectedTurno);
  }, [selectedTurno]);

  // Handle search button click
  const handleSearch = useCallback(() => {
    // The actual search implementation is now in the RouteMap component
    // This function is called when the search button is clicked
  }, []);

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
          availableTurnos={availableTurnos}
          getAvailableRoutes={() => routesForTurno}
        />
        <RouteMap
          selectedRota={selectedRota}
          selectedTurno={selectedTurno}
          busStopsByRoute={busStopsForTurno}
          searchQuery={searchQuery}
        />
      </div>
    </Container>
  );
};

export default MapaRotas;
