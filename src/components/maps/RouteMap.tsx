import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FlagTriangleLeft, FlagTriangleRight } from "lucide-react";
import { ROUTE_COLORS } from "./routeConstants";
import { BusStop } from "@/types/mapTypes";
import { toast } from "sonner";

interface RouteMapProps {
  selectedRota: string | null;
  selectedTurno: string;
  busStopsByRoute: Record<string, BusStop[]>;
  searchQuery: string;
}

const RouteMap = ({ selectedRota, selectedTurno, busStopsByRoute, searchQuery }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const flagMarkersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDKsBrWnONeKqDwT4I6ooc42ogm57cqJbI";

  // Helper function to create custom route icons
  const createRouteIcon = (routeName: string, routeColor: string) => {
    // Extract route type (P, S, T, ADM) and number
    const routeType = routeName.includes("ADM") ? "ADM" : routeName.charAt(0);
    const routeNum = routeName.includes("ADM") 
      ? routeName.slice(routeName.indexOf('-') + 1) 
      : routeName.slice(routeName.indexOf('-') + 1);
    
    // Create SVG with route label
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="${routeColor}" stroke="white" stroke-width="2"/>
          <text x="18" y="15" font-family="Arial" font-size="${routeType.length > 1 ? '6' : '8'}" font-weight="bold" text-anchor="middle" fill="white">${routeType}</text>
          <text x="18" y="24" font-family="Arial" font-size="${routeNum.length > 2 ? '7' : '8'}" font-weight="bold" text-anchor="middle" fill="white">${routeNum}</text>
        </svg>
      `),
      scaledSize: new google.maps.Size(36, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(18, 18),
    };
  };

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup on component unmount
      script.remove();
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    // Initialize Google Map with satellite view
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -16.328118, lng: -48.953529 },
      zoom: 12,
      mapTypeId: "satellite", // Set to satellite view by default
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Initialize search box
    const input = document.getElementById("search-input") as HTMLInputElement;
    if (input) {
      const searchBox = new google.maps.places.SearchBox(input);

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places?.length === 0) return;

        const place = places?.[0];
        if (!place?.geometry?.location) return;

        // Center map on the selected place
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        // Add or update home marker
        if (homeMarkerRef.current) {
          homeMarkerRef.current.setMap(null);
        }

        // Create house icon SVG
        const houseIcon = {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4B5563" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.182V22h18V10.182L12 2z"/>
              <rect x="9" y="14" width="6" height="8"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 40),
        };

        // Create marker for home location
        homeMarkerRef.current = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: houseIcon,
          title: "Seu endereço",
          zIndex: 1000, // Higher zIndex to appear above bus stop markers
          animation: google.maps.Animation.DROP
        });

        // Add info window for home marker
        homeMarkerRef.current.addListener("click", () => {
          if (infoWindowRef.current) {
            const contentString = `
              <div class="p-3">
                <h3 class="font-bold text-base mb-1">Seu endereço</h3>
                <p class="mb-1">${place.formatted_address || place.name}</p>
              </div>
            `;
            
            infoWindowRef.current.setContent(contentString);
            infoWindowRef.current.open({
              anchor: homeMarkerRef.current,
              map: mapInstanceRef.current,
            });
          }
        });
      });
    }

    setMapLoaded(true);
    
    // Display initial route markers based on selected turno
    displayAllRouteMarkers();
  };

  // Function to display all route markers with different colors when only the shift is selected
  const displayAllRouteMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Clear flag markers
    flagMarkersRef.current.forEach((marker) => marker.setMap(null));
    flagMarkersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    
    // If a specific route is selected, only show markers for that route
    if (selectedRota) {
      const stops = busStopsByRoute[selectedRota] || [];
      if (stops.length === 0) return;
      
      stops.forEach((stop, index) => {
        const position = { lat: stop.lat, lng: stop.lng };
        bounds.extend(position);
        
        // Create a marker for this stop
        const marker = createMarker(stop, selectedRota, index);
        markersRef.current.push(marker);
      });

      // Add flag markers for the first and last stops when a route is selected
      if (stops.length > 0) {
        // First stop - green flag
        const firstStop = stops[0];
        const startFlag = createFlagMarker(
          { lat: firstStop.lat, lng: firstStop.lng },
          'green',
          'Primeiro ponto da rota ' + selectedRota,
          firstStop
        );
        flagMarkersRef.current.push(startFlag);

        // Last stop - red flag
        const lastStop = stops[stops.length - 1];
        const endFlag = createFlagMarker(
          { lat: lastStop.lat, lng: lastStop.lng },
          'red',
          'Último ponto da rota ' + selectedRota,
          lastStop
        );
        flagMarkersRef.current.push(endFlag);
      }
    } 
    // If no specific route is selected but a shift is selected, show all stops color-coded by route
    else {
      Object.entries(busStopsByRoute).forEach(([routeName, stops]) => {
        stops.forEach((stop, index) => {
          const position = { lat: stop.lat, lng: stop.lng };
          bounds.extend(position);
          
          // Create a marker for this stop
          const marker = createMarker(stop, routeName, index);
          markersRef.current.push(marker);
        });
      });
    }

    // Fit map to the bounds of all markers
    if (!bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [busStopsByRoute, selectedRota]);

  // Helper function to create a flag marker
  const createFlagMarker = (position: google.maps.LatLngLiteral, flagColor: 'green' | 'red', title: string, stop: BusStop) => {
    if (!mapInstanceRef.current) return null;
    
    // Create flag icon SVG based on color
    const iconColor = flagColor === 'green' ? '#10B981' : '#EF4444';
    const flagIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${iconColor}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 22V4c0-.552.448-1 1-1h15a1 1 0 0 1 .76 1.65L15 10l5.76 5.35a1 1 0 0 1-.76 1.65H5c-.552 0-1-.448-1-1Z"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(48, 48),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(6, 42), // Adjust anchor to position flag properly
    };
    
    const marker = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title,
      icon: flagIcon,
      zIndex: 1001, // Higher than regular markers
      animation: google.maps.Animation.DROP,
    });
    
    // Add click listener for info window
    marker.addListener("click", () => {
      if (infoWindowRef.current) {
        const contentString = `
          <div class="p-3">
            <h3 class="font-bold text-base mb-1">${title}</h3>
            <p class="mb-1">${stop.nome}</p>
            <p class="mb-1"><strong>Dias de semana:</strong> ${stop.semana}</p>
            <p class="mb-1"><strong>Sábado:</strong> ${stop.sabado}</p>
            <p class="mb-1"><strong>Bairro:</strong> ${stop.bairro || ''}</p>
            <div class="flex mt-2">
              <a href="https://www.google.com/maps?q=${stop.lat},${stop.lng}" target="_blank" class="text-blue-500 underline">Abrir no Google Maps</a>
            </div>
          </div>
        `;
        
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open({
          anchor: marker,
          map: mapInstanceRef.current,
        });
      }
    });
    
    return marker;
  };

  // Helper function to create a marker with the appropriate color and info window
  const createMarker = (stop: BusStop, routeName: string, index: number) => {
    if (!mapInstanceRef.current) return null;
    
    const position = { lat: stop.lat, lng: stop.lng };
    const routeColor = ROUTE_COLORS[routeName as keyof typeof ROUTE_COLORS] || "#333333";
    
    // Use custom route icon
    const busStopIcon = createRouteIcon(routeName, routeColor);
    
    const marker = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: stop.nome,
      icon: busStopIcon,
      animation: google.maps.Animation.DROP,
    });
    
    // Create info window content with both weekday and weekend schedules
    const contentString = `
      <div class="p-3">
        <h3 class="font-bold text-base mb-1">${stop.nome}</h3>
        <p class="mb-1"><strong>Dias de semana:</strong> ${stop.semana}</p>
        <p class="mb-1"><strong>Sábado:</strong> ${stop.sabado}</p>
        <p class="mb-1"><strong>Bairro:</strong> ${stop.bairro || ''}</p>
        <div class="flex mt-2">
          <a href="https://www.google.com/maps?q=${stop.lat},${stop.lng}" target="_blank" class="text-blue-500 underline">Abrir no Google Maps</a>
        </div>
      </div>
    `;
    
    // Add click listener for info window
    marker.addListener("click", () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open({
          anchor: marker,
          map: mapInstanceRef.current,
        });
      }
    });
    
    return marker;
  };

  useEffect(() => {
    if (mapLoaded) {
      displayAllRouteMarkers();
    }
  }, [selectedRota, mapLoaded, displayAllRouteMarkers]);

  // Handle search button click to search for stops by name
  const handleSearch = () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    // Simple search through the stops
    const allStops = Object.values(busStopsByRoute).flat();
    const matchingStops = allStops.filter(stop => 
      stop.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingStops.length > 0) {
      const firstMatch = matchingStops[0];
      mapInstanceRef.current.setCenter({ lat: firstMatch.lat, lng: firstMatch.lng });
      mapInstanceRef.current.setZoom(17);

      // Find and activate the corresponding marker
      const matchingMarker = markersRef.current.find(marker => 
        marker.getTitle()?.includes(firstMatch.nome)
      );

      if (matchingMarker && infoWindowRef.current) {
        const contentString = `
          <div class="p-3">
            <h3 class="font-bold text-base mb-1">${firstMatch.nome}</h3>
            <p class="mb-1"><strong>Dias de semana:</strong> ${firstMatch.semana}</p>
            <p class="mb-1"><strong>Sábado:</strong> ${firstMatch.sabado}</p>
            <p class="mb-1"><strong>Bairro:</strong> ${firstMatch.bairro || ''}</p>
            <div class="flex mt-2">
              <a href="https://www.google.com/maps?q=${firstMatch.lat},${firstMatch.lng}" target="_blank" class="text-blue-500 underline">Abrir no Google Maps</a>
            </div>
          </div>
        `;

        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open({
          anchor: matchingMarker,
          map: mapInstanceRef.current,
        });
      }
    } else {
      toast.error("Nenhum ponto encontrado com esse termo");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div
          ref={mapRef}
          className="w-full h-[70vh] rounded-md"
        />
      </CardContent>
    </Card>
  );
};

export default RouteMap;
