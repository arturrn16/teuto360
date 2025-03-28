
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE_COLORS } from "./routeConstants";
import { BusStop } from "@/types/mapTypes";
import { toast } from "sonner";
import { LoaderSpinner } from "../ui/loader-spinner";

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
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDKsBrWnONeKqDwT4I6ooc42ogm57cqJbI";

  // Memoize the route icon creation to avoid recreating on every render
  const createRouteIcon = useCallback((routeName: string, routeColor: string) => {
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
  }, []);

  // Improved script loading with error handling
  useEffect(() => {
    // Only load the script once
    if (scriptLoadedRef.current) return;
    
    const loadGoogleMapsScript = () => {
      setIsLoading(true);
      
      // First check if the script is already loaded
      const existingScript = document.getElementById("google-maps-script");
      if (existingScript) {
        scriptLoadedRef.current = true;
        initMap();
        return;
      }
      
      // Load Google Maps API script with performance optimization
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.id = "google-maps-script";
      script.async = true;
      script.defer = true;
      
      // Define global callback function
      window.initGoogleMaps = () => {
        scriptLoadedRef.current = true;
        initMap();
      };
      
      // Add error handling
      script.onerror = () => {
        setMapError("Falha ao carregar o Google Maps. Por favor, tente novamente.");
        setIsLoading(false);
        console.error("Google Maps API script failed to load");
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMapsScript();
    
    // Clean up global callback on unmount
    return () => {
      delete window.initGoogleMaps;
      
      // Cleanup on component unmount
      if (mapInstanceRef.current) {
        // Clear all markers to free up memory
        markersRef.current.forEach((marker) => marker.setMap(null));
        flagMarkersRef.current.forEach((marker) => marker.setMap(null));
        if (homeMarkerRef.current) homeMarkerRef.current.setMap(null);
      }
    };
  }, []);

  // Improved map initialization
  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    
    try {
      // Only initialize the map if it hasn't been initialized yet
      if (!mapInstanceRef.current) {
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
        
        // Initialize search box - optimized with lazy execution
        const initSearchBox = () => {
          const input = document.getElementById("search-input") as HTMLInputElement;
          if (input) {
            const searchBox = new google.maps.places.SearchBox(input);
            searchBoxRef.current = searchBox;
            
            map.addListener("bounds_changed", () => {
              searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
            });
          }
        };
        
        // Defer search box initialization to improve initial load time
        setTimeout(initSearchBox, 100);
      }
      
      setMapLoaded(true);
      setIsLoading(false);
      setMapError(null);
      
      // Display initial route markers based on selected turno
      displayAllRouteMarkers();
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Erro ao inicializar o mapa. Por favor, recarregue a página.");
      setIsLoading(false);
    }
  }, []);

  // Helper function to create a flag marker - memoized
  const createFlagMarker = useCallback((position: google.maps.LatLngLiteral, flagColor: 'green' | 'red', title: string, stop: BusStop) => {
    if (!mapInstanceRef.current) return null;
    
    // Create flag icon SVG
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
  }, []);

  // Helper function to create a marker with the appropriate color and info window - memoized
  const createMarker = useCallback((stop: BusStop, routeName: string, index: number) => {
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
  }, [createRouteIcon]);

  // Function to display all route markers - optimized and memoized
  const displayAllRouteMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    try {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Clear flag markers
      flagMarkersRef.current.forEach((marker) => marker.setMap(null));
      flagMarkersRef.current = [];

      const bounds = new google.maps.LatLngBounds();

      // Set center based on the selected turno
      if (selectedTurno === "Goiânia") {
        // Center the map on Goiânia
        mapInstanceRef.current.setCenter({ lat: -16.6868, lng: -49.2648 });
        mapInstanceRef.current.setZoom(10);
      }
      
      // If a specific route is selected, only show markers for that route
      if (selectedRota) {
        const stops = busStopsByRoute[selectedRota] || [];
        if (stops.length === 0) return;
        
        // For GYN ADM routes, center on the first point specifically
        if (selectedRota === "GYN ADM-01" || selectedRota === "GYN ADM-02") {
          if (stops.length > 0) {
            const firstStop = stops[0];
            mapInstanceRef.current.setCenter({ lat: firstStop.lat, lng: firstStop.lng });
            mapInstanceRef.current.setZoom(13);
          }
        }

        // Simplified batch marker creation for better performance
        stops.forEach((stop, i) => {
          const position = { lat: stop.lat, lng: stop.lng };
          bounds.extend(position);
          
          // Create a marker for this stop
          const marker = createMarker(stop, selectedRota, i);
          if (marker) markersRef.current.push(marker);
          
          // Add flag markers for the first and last stops
          if (i === 0) {
            // First stop - green flag
            const startFlag = createFlagMarker(
              position,
              'green',
              'Primeiro ponto da rota ' + selectedRota,
              stop
            );
            if (startFlag) flagMarkersRef.current.push(startFlag);
          } else if (i === stops.length - 1) {
            // Last stop - red flag
            const endFlag = createFlagMarker(
              position,
              'red',
              'Último ponto da rota ' + selectedRota,
              stop
            );
            if (endFlag) flagMarkersRef.current.push(endFlag);
          }
        });

        // For routes other than GYN ADM, fit bounds to all markers
        if (selectedRota !== "GYN ADM-01" && selectedRota !== "GYN ADM-02" && !bounds.isEmpty()) {
          mapInstanceRef.current?.fitBounds(bounds);
        }
      } 
      // If no specific route is selected but a shift is selected, show all stops color-coded by route
      else {
        // Get all routes for the selected shift
        const routes = Object.entries(busStopsByRoute);
        
        // Process all routes
        routes.forEach(([routeName, stops]) => {
          // Process stops for this route
          stops.forEach((stop, index) => {
            const position = { lat: stop.lat, lng: stop.lng };
            bounds.extend(position);
            
            // Create a marker for this stop
            const marker = createMarker(stop, routeName, index);
            if (marker) markersRef.current.push(marker);
          });
        });
        
        // For turno other than Goiânia, fit bounds to all markers
        if (selectedTurno !== "Goiânia" && !bounds.isEmpty() && mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(bounds);
        }
      }
    } catch (error) {
      console.error("Error displaying route markers:", error);
      toast.error("Erro ao exibir os pontos de parada no mapa");
    }
  }, [busStopsByRoute, selectedRota, selectedTurno, mapLoaded, createMarker, createFlagMarker]);

  // Handle map updates when selections change
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      displayAllRouteMarkers();
    }
  }, [selectedRota, selectedTurno, mapLoaded, displayAllRouteMarkers]);

  // Function to handle search button click
  const handleSearchButtonClick = useCallback(() => {
    if (!searchBoxRef.current || !mapInstanceRef.current) return;
    
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) {
      // If no places found through PlacesAPI, try searching through bus stops
      if (searchQuery.trim()) {
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
      }
      return;
    }

    const place = places[0];
    if (!place.geometry?.location) return;

    // Center map on the selected place
    mapInstanceRef.current.setCenter(place.geometry.location);
    mapInstanceRef.current.setZoom(15);

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
      map: mapInstanceRef.current,
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
  }, [busStopsByRoute, searchQuery]);

  // Set up listener for the search button
  useEffect(() => {
    if (!mapLoaded) return;
    
    // Handle the search button click from the parent component
    const searchButton = document.querySelector('[data-search-button="true"]');
    if (searchButton) {
      searchButton.addEventListener('click', handleSearchButtonClick);
      return () => {
        searchButton.removeEventListener('click', handleSearchButtonClick);
      };
    }
  }, [mapLoaded, handleSearchButtonClick]);

  // Set up listener for the places_changed event to handle address selection
  useEffect(() => {
    if (!mapLoaded || !searchBoxRef.current) return;
    
    const placesChangedListener = searchBoxRef.current.addListener('places_changed', handleSearchButtonClick);
    
    return () => {
      // Clean up listener
      if (placesChangedListener) {
        placesChangedListener.remove();
      }
    };
  }, [mapLoaded, handleSearchButtonClick]);

  // Add global type for callback
  useEffect(() => {
    // Add the global type for TypeScript
    window.initGoogleMaps = window.initGoogleMaps || function() {};
    
    return () => {
      // Cleanup on unmount
      delete window.initGoogleMaps;
    };
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="w-full h-[70vh] flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <LoaderSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-600">Carregando mapa...</p>
            </div>
          </div>
        ) : mapError ? (
          <div className="w-full h-[70vh] flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center p-4">
              <div className="text-red-500 mb-2 text-xl">⚠️</div>
              <p className="text-gray-700 mb-2">{mapError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Recarregar
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-full h-[70vh] rounded-md"
          />
        )}
      </CardContent>
    </Card>
  );
};

// Add the global type declaration for the callback
declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

export default RouteMap;
