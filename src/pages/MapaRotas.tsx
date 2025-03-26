
import { useState, useEffect, useRef, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Map, Search, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Tipos para o Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Interface para paradas de ônibus
interface ParadaOnibus {
  lat: number;
  lng: number;
  nome: string;
  semana?: string;
  sabado?: string;
}

const MapaRotas = () => {
  const [selectedMap, setSelectedMap] = useState<string>("primeiroTurno");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const searchBoxRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Rotas disponíveis
  const rotasOptions = [
    { id: "primeiroTurno", name: "1° Turno" },
    { id: "segundoTurno", name: "2° Turno" },
    { id: "terceiroTurno", name: "3° Turno" },
    { id: "goiania1", name: "Goiânia 1" },
    { id: "goiania2", name: "Goiânia 2" },
  ];

  // Dados de paradas de ônibus por rota
  const paradasPorRota: Record<string, ParadaOnibus[]> = {
    primeiroTurno: [
      // P-01
      { lat: -16.278245, lng: -48.963118, nome: "P-01 01 - AV. Geraldo Pedro De Souza / Com a R. Dr José Machado de Silvério" },
      { lat: -16.275960, lng: -48.966647, nome: "P-01 02 - R. 100 / Rua Florensa" },
      { lat: -16.261218, lng: -48.988482, nome: "P-01 04 - Av. Federal / Rua 8 ( Colegio )" },
      { lat: -16.261912, lng: -48.994349, nome: "P-01 05 - Av. Ipe Amarelo / Rotatória" },
      { lat: -16.261266, lng: -48.997384, nome: "P-01 06 - R. Araguaia / Esquina com a Rua Cedro" },
      { lat: -16.260235, lng: -48.999053, nome: "P-01 07 - R. Guatambu / Rua Guatambu (Ferragista Aldeia)" },
      { lat: -16.258637, lng: -49.002028, nome: "P-01 08 - R. Araguaia / Rua Uruvalheiro (Choupana Beer)" },
      { lat: -16.259925, lng: -49.004642, nome: "P-01 09 - R. Corumbá / Esquina com a Rua Buriti" },
      { lat: -16.260237, lng: -49.000943, nome: "P-01 10 - R. Corumbá / Esquina com a Rua Jatoba" },
      { lat: -16.264016, lng: -48.985605, nome: "P-01 11 - Av. Federal / Esquina com a Rua 6" },
      { lat: -16.265407, lng: -48.983516, nome: "P-01 12 - Av. Federal / Esquina com a Rua 4" },
      { lat: -16.271580, lng: -48.976411, nome: "P-01 13 - Av. Fernando Costa / Parque Jaiara" },
      { lat: -16.274631, lng: -48.976366, nome: "P-01 14 - Av. Fernando Costa / Com a Travessa 2" },
      { lat: -16.277164, lng: -48.975195, nome: "P-01 15 - Av. Fernando Costa / Com a Av. Patricia" },
      { lat: -16.277030, lng: -48.977980, nome: "P-01 16 - R. Kátia / Com a R. 4 - Garagem da Urban" },
      { lat: -16.281728, lng: -48.977505, nome: "P-01 17 - R. Buriti Alegre / Com a Rua Planalto" },
      { lat: -16.282440, lng: -48.979140, nome: "P-01 18 - R. Buriti Alegre / Com a Rua Nova Capital - Merceágua" },
      { lat: -16.283945, lng: -48.978982, nome: "P-01 19 - R. Ipameri / Rua Nova Capital - Mundo dos Pets" },
      { lat: -16.284428, lng: -48.979883, nome: "P-01 20 - R. Ipameri / Com a Rua Paranagua" },
      { lat: -16.285052, lng: -48.977595, nome: "P-01 21 - R. Uruaná / Com a Rua Taguatinga" },
      { lat: -16.284035, lng: -48.975269, nome: "P-01 22 - R. Uruana / Com a Av. Bandeirantes" },
      { lat: -16.288040, lng: -48.971360, nome: "P-01 23 - R. Itaberai / Com a Av. Bernardo Sayão" },
      { lat: -16.283121, lng: -48.973479, nome: "P-01 24 - Av. Bernardo Sayão / Esquina com a R. Formosa" },
      { lat: -16.280410, lng: -48.974480, nome: "P-01 25 - R. Buriti Alegre / 28° Batalhão da Polícia Militar" },
      { lat: -16.275044, lng: -48.970956, nome: "P-01 26 - Av. Luís Carpaneda / Com a Rua Porangatu" },
      { lat: -16.406940, lng: -48.921300, nome: "P-01 27 - Distrito Agroindustrial de Anápolis" },
    ],
    segundoTurno: [
      // P-02
      { lat: -16.270170, lng: -48.980090, nome: "P-02 01 - R. Mizael de Morais Filho / Com a Rua Cruzeiro do Sul" },
      { lat: -16.270460, lng: -48.984000, nome: "P-02 02 - Estr. p/ Miranápolis / Com a Rua Três Marias" },
      { lat: -16.274426, lng: -48.985019, nome: "P-02 03 - Av. Mariele / Com a Rua 'O'" },
      { lat: -16.277609, lng: -48.985678, nome: "P-02 04 - R. Marielle / (Supermercado do Povo)" },
      { lat: -16.276961, lng: -48.988451, nome: "P-02 05 - R. H / Paróquia Santíssima Trindade" },
      { lat: -16.277673, lng: -48.990843, nome: "P-02 06 - R. G / Com a Rua Jandira" },
      { lat: -16.277684, lng: -48.993085, nome: "P-02 07 - R. Larissa / Com a Rua Taqueda" },
      { lat: -16.277320, lng: -48.995270, nome: "P-02 08 - Av. das Laranjeiras / Com a R. Três" },
      { lat: -16.277349, lng: -48.997228, nome: "P-02 09 - Av. das Laranjeiras / Com a Rua 5" },
      { lat: -16.281313, lng: -48.992338, nome: "P-02 10 - Av. Souzânia / Com a R. Fontenele Junior" },
      { lat: -16.283412, lng: -48.988511, nome: "P-02 11 - Av. Souzânia / Com a Av. Patricia" },
      { lat: -16.280145, lng: -48.985106, nome: "P-02 12 - Av. Patrícia / Com a Av. Marieli" },
      { lat: -16.281196, lng: -48.985181, nome: "P-02 13 - R. Jk / Com a Rua Alan Kardec" },
      { lat: -16.285276, lng: -48.984145, nome: "P-02 14 - Rua Mun. / Com a Rua Rio Negro" },
      { lat: -16.286670, lng: -48.981300, nome: "P-02 15 - R. Uruana / Com a Rua Tocantins" },
      { lat: -16.288339, lng: -48.972552, nome: "P-02 16 - R. Ouro Branco / Feirão Coberto da Vila Jaiara" },
      { lat: -16.291053, lng: -48.973229, nome: "P-02 17 - R. Silvânia / Paróquia Nossa Senhora de Fátima" },
      { lat: -16.291314, lng: -48.971297, nome: "P-02 18 - Av. Paulista / Com a Rua Ouro Branco" },
      { lat: -16.291986, lng: -48.969406, nome: "P-02 19 - R. Anchieta / Restaurante Popular de Anápolis" },
      { lat: -16.406940, lng: -48.921300, nome: "P-02 20 - Distrito Agroindustrial de Anápolis" },
    ],
    terceiroTurno: [
      // P-03
      { lat: -16.285926, lng: -48.938760, nome: "P-03 01 - Av. Joao Florentino / Rua 03 - (Posto Recanto do Sol)" },
      { lat: -16.284097, lng: -48.935658, nome: "P-03 02 - R. 3 / Rua 47 ( Supermercado Soberano )" },
      { lat: -16.283959, lng: -48.931338, nome: "P-03 03 - R. 52 / Com a Rua 8" },
      { lat: -16.281523, lng: -48.927637, nome: "P-03 04 - R. 55 / Com Rua 39" },
      { lat: -16.276830, lng: -48.928940, nome: "P-03 05 - R. Direita / Esquina com a Rua 35" },
      { lat: -16.279118, lng: -48.930556, nome: "P-03 06 - R. 54 / Com a Rua 24" },
      { lat: -16.279748, lng: -48.932983, nome: "P-03 07 - Av. do Estado / Com a Rua 22" },
      { lat: -16.278033, lng: -48.935336, nome: "P-03 08 - Av. do Estado / Com a Av. Dos Ipes" },
      { lat: -16.276103, lng: -48.936288, nome: "P-03 09 - Av. Raimundo Carlos Costa e Silva / Com a Rua Carnauba ( Torre )" },
      { lat: -16.273396, lng: -48.935617, nome: "P-03 10 - R. Ra / Com a Rua RA 18" },
      { lat: -16.274272, lng: -48.937877, nome: "P-03 11 - R. Ra 17 / Esquina com a Rua RA 19" },
      { lat: -16.277108, lng: -48.939888, nome: "P-03 12 - R. Ra 11 / Rua RA 13 ( Chacara da Policia Civil )" },
      { lat: -16.280275, lng: -48.939791, nome: "P-03 13 - R. Prof. Clementino de Alencar Lima / Com a Rua Lisboa" },
      { lat: -16.282340, lng: -48.939973, nome: "P-03 14 - Av. Raimundo C C E Silva / Com a Rua Porto Nacional" },
      { lat: -16.250633, lng: -48.934771, nome: "P-03 15 - Av. Monte Sinai / Esquina com a Av. Wasfi Helou" },
      { lat: -16.253541, lng: -48.934391, nome: "P-03 16 - Av. Sérgio Carneiro / Com a R. 2" },
      { lat: -16.250019, lng: -48.937253, nome: "P-03 17 - R. SD / Esquina com a R. Sd-006" },
      { lat: -16.250575, lng: -48.935499, nome: "P-03 18 - R. SD 12 / Esquina com a Rua SD 15" },
      { lat: -16.268908, lng: -48.939586, nome: "P-03 19 - BR / Esquina com a Rua 2" },
      { lat: -16.406940, lng: -48.921300, nome: "P-03 20 - Distrito Agroindustrial de Anápolis" },
    ],
    goiania1: [
      // P-04 (primeira parte da rota para Goiânia 1)
      { lat: -16.308900, lng: -48.943160, nome: "P-04 01 - Av. Brasil Norte / Leomed Drogarias 24 Horas" },
      { lat: -16.298423, lng: -48.941830, nome: "P-04 02 - Av. Brasil Norte / Restaurante Sabor Na Mesa" },
      { lat: -16.287548, lng: -48.933404, nome: "P-04 03 - R. Ra 1 / Rua RA 10" },
      { lat: -16.289073, lng: -48.932159, nome: "P-04 04 - Av. Perimetral / Com a Rua 27" },
      { lat: -16.291052, lng: -48.928992, nome: "P-04 05 - Alameda Portal do Sol / Esquina com a Rua 7" },
      { lat: -16.297357, lng: -48.921444, nome: "P-04 06 - Ac. Fc 20 / Esquina com a Rua FC 19" },
      { lat: -16.296501, lng: -48.920935, nome: "P-04 07 - Ac. Fc 20 / Esquina com a Rua FC - 15" },
      { lat: -16.291220, lng: -48.921780, nome: "P-04 08 - R. 30 / Esquina com a Rua FC 3" },
      { lat: -16.286690, lng: -48.920244, nome: "P-04 09 - R. 11 / Esquina com a Rua 25 ( Lava Jato )" },
      { lat: -16.283723, lng: -48.921585, nome: "P-04 10 - R. 58 / Esquina com a Rua SW 2" },
      { lat: -16.281920, lng: -48.923855, nome: "P-04 11 - R. 58 / Esquina com a Rua SW 8" },
      { lat: -16.285849, lng: -48.924176, nome: "P-04 12 - R. 25 / Esquina com a Rua 6" },
      { lat: -16.288384, lng: -48.924644, nome: "P-04 13 - R. 6 / Esquina com a Rua João Florentino" },
      { lat: -16.289740, lng: -48.944640, nome: "P-04 14 - Av. Universitária / Esquina com a Av. Santos Dumont" },
      { lat: -16.297410, lng: -48.946540, nome: "P-04 15 - Av. Universitária / Restaurante Barriga Cheia" },
      { lat: -16.300902, lng: -48.947420, nome: "P-04 16 - Av. Universitária / Esquina com a Rua Chile" },
      { lat: -16.306160, lng: -48.948620, nome: "P-04 17 - Av. Universitária / Sandro Veículos" },
      { lat: -16.320808, lng: -48.952576, nome: "P-04 18 - Av. Sen. José Lourenço Dias / Grand Car" },
      { lat: -16.328950, lng: -48.950100, nome: "P-04 19 - GO / Praça do Ancião" },
      { lat: -16.330156, lng: -48.950612, nome: "P-04 20 - Av. Brasil / Prefeitura Municipal de Anápolis" },
      { lat: -16.339588, lng: -48.953538, nome: "P-04 21 - Av. Brasil Sul / Autoeste Fiat" },
      { lat: -16.341950, lng: -48.954630, nome: "P-04 22 - Av. Brasil Sul / Radar Rolamentos - Anápolis" },
      { lat: -16.407132, lng: -48.918605, nome: "P-04 23 - Distrito Agroindustrial de Anápolis" },
    ],
    goiania2: [
      // Mistura de P-05 à P-10
      { lat: -16.288661, lng: -48.949128, nome: "P-05 01 - Av. Santos Dumont / Esquina com a Av. Dr. Vital Brasil" },
      { lat: -16.288158, lng: -48.952656, nome: "P-05 02 - Av. Santos Dumont / Esquina com a Av. Xavantina" },
      { lat: -16.313360, lng: -48.934760, nome: "P-08 01 - R. Dona Carime / Garagem São José" },
      { lat: -16.315325, lng: -48.935764, nome: "P-08 02 - Av. Dona Elvira / Com a Rua Manoel Luiz da Fonseca" },
      { lat: -16.320407, lng: -48.939063, nome: "P-08 03 - Av. Dona Elvira / Esquina com a R. Joaquim Esperidião" },
      { lat: -16.318109, lng: -48.955068, nome: "P-07 01 - Av. Pres. Kennedy / Esquina com a R. Luís Schinor" },
      { lat: -16.316668, lng: -48.955913, nome: "P-07 02 - Av. Pres. Kennedy / Pizzaria Presidente" },
      { lat: -16.351145, lng: -48.975232, nome: "P-10 01 - Av. Pedro Ludovico / BARATÃO DA CONSTRUÇÃO" },
      { lat: -16.356284, lng: -48.978053, nome: "P-10 02 - Av. Pedro Ludovico / Com a Rua dos Prefeitos" },
      { lat: -16.359320, lng: -48.980080, nome: "P-10 03 - Av. Pedro Ludovico / Esquina com a Rua Paraguaçú" },
      { lat: -16.354320, lng: -48.974306, nome: "P-09 01 - Av. Isidório Rodrigues / Com a Rua Ana Lucia de Sousa" },
      { lat: -16.355672, lng: -48.972233, nome: "P-09 02 - Av. Isidório Rodrigues / Com a Rua Marcos Irako Mendes (Rotatória)" },
      { lat: -16.407070, lng: -48.917269, nome: "DAIA - Distrito Agroindustrial de Anápolis" },
    ],
  };

  // Inicializar o mapa quando o script do Google Maps for carregado
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || googleMapRef.current) return;

    // Definir o centro do mapa na cidade de Anápolis
    const anapolis = { lat: -16.3270, lng: -48.9525 };
    
    // Criar o mapa
    const mapOptions = {
      center: anapolis,
      zoom: 13,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    };
    
    googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    
    // Configurar a barra de pesquisa
    const input = document.getElementById("map-search-input") as HTMLInputElement;
    searchBoxRef.current = new window.google.maps.places.SearchBox(input);
    
    // Vincular a barra de pesquisa ao mapa
    googleMapRef.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
    
    // Listener para atualizar os resultados da pesquisa quando o mapa se move
    googleMapRef.current.addListener("bounds_changed", () => {
      searchBoxRef.current.setBounds(googleMapRef.current.getBounds());
    });
    
    // Listener para pegar os lugares selecionados na barra de pesquisa
    searchBoxRef.current.addListener("places_changed", () => {
      const places = searchBoxRef.current.getPlaces();
      
      if (places.length === 0) return;
      
      // Para cada lugar, exibir um marcador
      const bounds = new window.google.maps.LatLngBounds();
      
      places.forEach((place: any) => {
        if (!place.geometry || !place.geometry.location) return;
        
        // Criar um marcador para o local pesquisado
        const marker = new window.google.maps.Marker({
          map: googleMapRef.current,
          title: place.name,
          position: place.geometry.location,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0047AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          }
        });
        
        // Info Window para o local pesquisado
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 280px;">
              <h3 style="margin-top: 0; margin-bottom: 5px; color: #0047AB; font-weight: bold;">${place.name}</h3>
              ${place.formatted_address ? `<p style="margin: 5px 0; font-size: 14px;">${place.formatted_address}</p>` : ''}
              ${place.rating ? `<p style="margin: 5px 0; font-size: 14px;">Avaliação: ${place.rating} ⭐</p>` : ''}
            </div>
          `
        });
        
        marker.addListener("click", () => {
          infoWindow.open(googleMapRef.current, marker);
        });
        
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      
      googleMapRef.current.fitBounds(bounds);
    });
    
    // Carregar os marcadores iniciais
    loadMarkers();
    setIsMapLoaded(true);
  }, []);

  // Carregar os marcadores das paradas de ônibus
  const loadMarkers = useCallback(() => {
    if (!googleMapRef.current) return;
    
    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Obter as paradas da rota selecionada
    const paradas = paradasPorRota[selectedMap] || [];
    
    if (paradas.length === 0) {
      toast({
        title: "Nenhuma parada encontrada",
        description: "Não há paradas de ônibus registradas para esta rota.",
        variant: "destructive",
      });
      return;
    }
    
    // Criar bounds para ajustar o zoom
    const bounds = new window.google.maps.LatLngBounds();
    
    // Criar os marcadores no mapa
    paradas.forEach((parada, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: parada.lat, lng: parada.lng },
        map: googleMapRef.current,
        title: parada.nome,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
        label: {
          text: (index + 1).toString(),
          color: '#FFFFFF',
          fontSize: '12px',
        }
      });
      
      // Criar janela de informação para o marcador
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 280px;">
            <h3 style="margin-top: 0; margin-bottom: 5px; color: #E53935; font-weight: bold;">Parada ${index + 1}</h3>
            <p style="margin: 5px 0; font-size: 14px;">${parada.nome}</p>
            ${parada.semana ? `<p style="margin: 3px 0; font-size: 13px;"><strong>Horário semana:</strong> ${parada.semana}</p>` : ''}
            ${parada.sabado ? `<p style="margin: 3px 0; font-size: 13px;"><strong>Horário sábado:</strong> ${parada.sabado}</p>` : ''}
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
              Lat: ${parada.lat.toFixed(6)}, Lng: ${parada.lng.toFixed(6)}
            </p>
          </div>
        `
      });
      
      marker.addListener("click", () => {
        infoWindow.open(googleMapRef.current, marker);
      });
      
      // Adicionar o marcador ao array de referência
      markersRef.current.push(marker);
      
      // Estender os bounds para incluir este ponto
      bounds.extend({ lat: parada.lat, lng: parada.lng });
    });
    
    // Ajustar o mapa para mostrar todos os marcadores
    googleMapRef.current.fitBounds(bounds);
    
    // Se houver apenas um marcador, ajustar o zoom
    if (paradas.length === 1) {
      googleMapRef.current.setZoom(15);
    }
    
  }, [selectedMap, toast]);

  // Carregar o script do Google Maps
  useEffect(() => {
    if (window.google) {
      initializeMap();
      return;
    }
    
    // Função de callback global que o Google Maps chamará quando o script for carregado
    window.initMap = () => {
      initializeMap();
    };
    
    // Adicionar o script do Google Maps à página
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKsBrWnONeKqDwT4I6ooc42ogm57cqJbI&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      toast({
        title: "Erro ao carregar o mapa",
        description: "Não foi possível carregar o mapa do Google. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Limpar o callback global quando o componente for desmontado
      window.initMap = () => {};
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initializeMap, toast]);

  // Atualizar os marcadores quando a rota selecionada mudar
  useEffect(() => {
    if (isMapLoaded) {
      loadMarkers();
    }
  }, [selectedMap, isMapLoaded, loadMarkers]);

  // Pesquisar paradas ao digitar no campo de pesquisa
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container max-w-full py-10 px-4 md:px-10">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecione o mapa que deseja visualizar:
              </label>
              <Select 
                value={selectedMap}
                onValueChange={setSelectedMap}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um mapa" />
                </SelectTrigger>
                <SelectContent>
                  {rotasOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="map-search-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pesquisar localização:
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="map-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Digite um endereço ou ponto de referência"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-[480px] md:h-[600px]">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Carregando mapa...</p>
                </div>
              </div>
            )}
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ visibility: isMapLoaded ? 'visible' : 'hidden' }}
            ></div>
          </div>
          
          <div className="flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6">
                <MapPin className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm text-gray-600">Parada de ônibus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6">
                <MapPin className="h-5 w-5 text-blue-700" />
              </div>
              <span className="text-sm text-gray-600">Local pesquisado</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
            Observe o mapa para verificar se há uma rota que atende sua localidade.
            Clique nos marcadores para ver mais detalhes sobre cada parada.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaRotas;
