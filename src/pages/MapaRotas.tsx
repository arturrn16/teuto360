import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, House, FlagTriangleLeft, FlagTriangleRight } from "lucide-react";
import { toast } from "sonner";

const GOOGLE_MAPS_API_KEY = "AIzaSyDKsBrWnONeKqDwT4I6ooc42ogm57cqJbI";

// Define route colors for visual differentiation on the map
const ROUTE_COLORS = {
  "P-01": "#E53E3E", // Red
  "P-02": "#38A169", // Green
  "P-03": "#3182CE", // Blue
  "P-04": "#DD6B20", // Orange
  "P-05": "#805AD5", // Purple
  "P-06": "#D53F8C", // Pink
  "P-07": "#2D3748", // Dark gray
  "P-08": "#4299E1", // Light blue
  "P-09": "#F6AD55", // Light orange
  "P-10": "#68D391", // Light green
  "P-11": "#DC2626", // Red
  "P-12": "#059669", // Green
  "P-13": "#2563EB", // Blue
  "P-14": "#D97706", // Orange
  "P-15": "#7C3AED", // Purple
};

const MapaRotas = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const searchBoxRef = useRef<typeof google.maps.places.SearchBox | null>(null);
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const flagMarkersRef = useRef<google.maps.Marker[]>([]);
  const [selectedTurno, setSelectedTurno] = useState("1° Turno");
  const [selectedRota, setSelectedRota] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Bus stop data organized by routes with updated information
  const busStopsByRoute = {
    "P-01": [
      { lat: -16.278245, lng: -48.963118, nome: "P-01 01 - AV. Geraldo Pedro De Souza / Com a R. Dr José Machado de Silvério", bairro: "Res. Veneza", semana: "04:44", sabado: "05:49" },
      { lat: -16.275960, lng: -48.966647, nome: "P-01 02 - R. 100 / Rua Florensa", bairro: "Bandeiras", semana: "04:45", sabado: "05:50" },
      { lat: -16.261218, lng: -48.988482, nome: "P-01 04 - Av. Federal / Rua 8 ( Colegio )", bairro: "Lot. Guanabara", semana: "04:50", sabado: "05:55" },
      { lat: -16.261912, lng: -48.994349, nome: "P-01 05 - Av. Ipe Amarelo / Rotatória", bairro: "Residencial Aldeia dos Sonhos", semana: "04:51", sabado: "05:56" },
      { lat: -16.261266, lng: -48.997384, nome: "P-01 06 - R. Araguaia / Esquina com a Rua Cedro", bairro: "Residencial Aldeia dos Sonhos", semana: "04:52", sabado: "05:57" },
      { lat: -16.260235, lng: -48.999053, nome: "P-01 07 - R. Guatambu / Rua Guatambu (Ferragista Aldeia)", bairro: "Residencial Aldeia dos Sonhos", semana: "04:52", sabado: "05:57" },
      { lat: -16.258637, lng: -49.002028, nome: "P-01 08 - R. Araguaia / Rua Uruvalheiro (Choupana Beer)", bairro: "Residencial Aldeia dos Sonhos", semana: "04:53", sabado: "05:58" },
      { lat: -16.259925, lng: -49.004642, nome: "P-01 09 - R. Corumbá / Esquina com a Rua Buriti", bairro: "Residencial Aldeia dos Sonhos", semana: "04:56", sabado: "06:01" },
      { lat: -16.260237, lng: -49.000943, nome: "P-01 10 - R. Corumbá / Esquina com a Rua Jatoba", bairro: "Residencial Aldeia dos Sonhos", semana: "04:58", sabado: "06:03" },
      { lat: -16.264016, lng: -48.985605, nome: "P-01 11 - Av. Federal / Esquina com a Rua 6", bairro: "Lot. Guanabara", semana: "05:02", sabado: "06:07" },
      { lat: -16.265407, lng: -48.983516, nome: "P-01 12 - Av. Federal / Esquina com a Rua 4", bairro: "Lot. Guanabara", semana: "05:03", sabado: "06:08" },
      { lat: -16.271580, lng: -48.976411, nome: "P-01 13 - Av. Fernando Costa / Parque Jaiara", bairro: "Adriana Parque", semana: "05:05", sabado: "06:10" },
      { lat: -16.274631, lng: -48.976366, nome: "P-01 14 - Av. Fernando Costa / Com a Travessa 2", bairro: "Adriana Parque", semana: "05:05", sabado: "06:10" },
      { lat: -16.277164, lng: -48.975195, nome: "P-01 15 - Av. Fernando Costa / Com a Av. Patricia", bairro: "Las Palmas", semana: "05:06", sabado: "06:11" },
      { lat: -16.277030, lng: -48.977980, nome: "P-01 16 - R. Kátia / Com a R. 4 - Garagem da Urban", bairro: "Adriana Parque", semana: "05:07", sabado: "06:12" },
      { lat: -16.281728, lng: -48.977505, nome: "P-01 17 - R. Buriti Alegre / Com a Rua Planalto", bairro: "Vila Jaiara St. Norte", semana: "05:08", sabado: "06:13" },
      { lat: -16.282440, lng: -48.979140, nome: "P-01 18 - R. Buriti Alegre / Com a Rua Nova Capital - Merceágua", bairro: "Vila Jaiara St. Norte", semana: "05:09", sabado: "06:14" },
      { lat: -16.283945, lng: -48.978982, nome: "P-01 19 - R. Ipameri / Rua Nova Capital - Mundo dos Pets", bairro: "Vila Jaiara", semana: "05:10", sabado: "06:15" },
      { lat: -16.284428, lng: -48.979883, nome: "P-01 20 - R. Ipameri / Com a Rua Paranagua", bairro: "Vila Jaiara", semana: "05:10", sabado: "06:15" },
      { lat: -16.285052, lng: -48.977595, nome: "P-01 21 - R. Uruaná / Com a Rua Taguatinga", bairro: "Vila Jaiara St. Norte", semana: "05:11", sabado: "06:16" },
      { lat: -16.284035, lng: -48.975269, nome: "P-01 22 - R. Uruana / Com a Av. Bandeirantes", bairro: "Vila Jaiara", semana: "05:12", sabado: "06:17" },
      { lat: -16.288040, lng: -48.971360, nome: "P-01 23 - R. Itaberai / Com a Av. Bernardo Sayão", bairro: "Vila Jaiara St. Norte", semana: "05:15", sabado: "06:20" },
      { lat: -16.283121, lng: -48.973479, nome: "P-01 24 - Av. Bernardo Sayão / Esquina com a R. Formosa", bairro: "Vila Jaiara St. Norte", semana: "05:16", sabado: "06:21" },
      { lat: -16.280410, lng: -48.974480, nome: "P-01 25 - R. Buriti Alegre / 28° Batalhão da Polícia Militar", bairro: "Vila Jaiara St. Norte", semana: "05:17", sabado: "06:22" },
      { lat: -16.275044, lng: -48.970956, nome: "P-01 26 - Av. Luís Carpaneda / Com a Rua Porangatu", bairro: "Vila Jaiara St. Norte", semana: "05:19", sabado: "06:24" },
      { lat: -16.406940, lng: -48.921300, nome: "P-01 27 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:50", sabado: "06:55" }
    ],
    "P-02": [
      { lat: -16.270170, lng: -48.980090, nome: "P-02 01 - R. Mizael de Morais Filho / Com a Rua Cruzeiro do Sul", bairro: "Res. Ana Caroline", semana: "04:51", sabado: "05:56" },
      { lat: -16.270460, lng: -48.984000, nome: "P-02 02 - Estr. p/ Miranápolis / Com a Rua Três Marias", bairro: "Res. Ana Caroline", semana: "04:52", sabado: "05:57" },
      { lat: -16.274426, lng: -48.985019, nome: "P-02 03 - Av. Mariele / Com a Rua 'O'", bairro: "Adriana Parque", semana: "04:54", sabado: "05:59" },
      { lat: -16.277609, lng: -48.985678, nome: "P-02 04 - R. Marielle / (Supermercado do Povo)", bairro: "Adriana Parque", semana: "04:55", sabado: "06:00" },
      { lat: -16.276961, lng: -48.988451, nome: "P-02 05 - R. H / Paróquia Santíssima Trindade", bairro: "Adriana Parque", semana: "04:57", sabado: "06:02" },
      { lat: -16.277673, lng: -48.990843, nome: "P-02 06 - R. G / Com a Rua Jandira", bairro: "St. Res. Jandaia", semana: "04:58", sabado: "06:03" },
      { lat: -16.277684, lng: -48.993085, nome: "P-02 07 - R. Larissa / Com a Rua Taqueda", bairro: "St. Escala", semana: "05:00", sabado: "06:05" },
      { lat: -16.277320, lng: -48.995270, nome: "P-02 08 - Av. das Laranjeiras / Com a R. Três", bairro: "Res. Dom Felipe", semana: "05:00", sabado: "06:05" },
      { lat: -16.277349, lng: -48.997228, nome: "P-02 09 - Av. das Laranjeiras / Com a Rua 5", bairro: "Res. Dom Felipe", semana: "05:01", sabado: "06:06" },
      { lat: -16.281313, lng: -48.992338, nome: "P-02 10 - Av. Souzânia / Com a R. Fontenele Junior", bairro: "St. Res. Jandaia", semana: "05:04", sabado: "06:09" },
      { lat: -16.283412, lng: -48.988511, nome: "P-02 11 - Av. Souzânia / Com a Av. Patricia", bairro: "St. Res. Jandaia", semana: "05:05", sabado: "06:10" },
      { lat: -16.280145, lng: -48.985106, nome: "P-02 12 - Av. Patrícia / Com a Av. Marieli", bairro: "Adriana Parque", semana: "05:07", sabado: "06:12" },
      { lat: -16.281196, lng: -48.985181, nome: "P-02 13 - R. Jk / Com a Rua Alan Kardec", bairro: "Res. Vila Nova", semana: "05:08", sabado: "06:13" },
      { lat: -16.285276, lng: -48.984145, nome: "P-02 14 - Rua Mun. / Com a Rua Rio Negro", bairro: "Vila Jaiara St. Norte", semana: "05:11", sabado: "06:16" },
      { lat: -16.286670, lng: -48.981300, nome: "P-02 15 - R. Uruana / Com a Rua Tocantins", bairro: "Vila Jaiara", semana: "05:12", sabado: "06:17" },
      { lat: -16.288339, lng: -48.972552, nome: "P-02 16 - R. Ouro Branco / Feirão Coberto da Vila Jaiara", bairro: "Vila Jaiara St. Norte", semana: "05:16", sabado: "06:21" },
      { lat: -16.291053, lng: -48.973229, nome: "P-02 17 - R. Silvânia / Paróquia Nossa Senhora de Fátima", bairro: "Vila Jaiara St. Norte", semana: "05:17", sabado: "06:22" },
      { lat: -16.291314, lng: -48.971297, nome: "P-02 18 - Av. Paulista / Com a Rua Ouro Branco", bairro: "Jóquei Club", semana: "05:19", sabado: "06:24" },
      { lat: -16.291986, lng: -48.969406, nome: "P-02 19 - R. Anchieta / Restaurante Popular de Anápolis", bairro: "Vila Jaiara St. Norte", semana: "05:19", sabado: "06:24" },
      { lat: -16.406940, lng: -48.921300, nome: "P-02 20 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:50", sabado: "06:55" }
    ],
    "P-03": [
      { lat: -16.285926, lng: -48.938760, nome: "P-03 01 - Av. Joao Florentino / Rua 03 - (Posto Recanto do Sol)", bairro: "Res. Araguaia", semana: "04:41", sabado: "05:51" },
      { lat: -16.284097, lng: -48.935658, nome: "P-03 02 - R. 3 / Rua 47 ( Supermercado Soberano )", bairro: "Antonio Fernandes", semana: "04:43", sabado: "05:53" },
      { lat: -16.283959, lng: -48.931338, nome: "P-03 03 - R. 52 / Com a Rua 8", bairro: "Recanto do Sol", semana: "04:45", sabado: "05:55" },
      { lat: -16.281523, lng: -48.927637, nome: "P-03 04 - R. 55 / Com Rua 39", bairro: "Recanto do Sol", semana: "04:48", sabado: "05:58" },
      { lat: -16.276830, lng: -48.928940, nome: "P-03 05 - R. Direita / Esquina com a Rua 35", bairro: "Recanto do Sol", semana: "04:51", sabado: "06:01" },
      { lat: -16.279118, lng: -48.930556, nome: "P-03 06 - R. 54 / Com a Rua 24", bairro: "Recanto do Sol", semana: "04:53", sabado: "06:03" },
      { lat: -16.279748, lng: -48.932983, nome: "P-03 07 - Av. do Estado / Com a Rua 22", bairro: "Jardim dos Ipes", semana: "04:55", sabado: "06:05" },
      { lat: -16.278033, lng: -48.935336, nome: "P-03 08 - Av. do Estado / Com a Av. Dos Ipes", bairro: "Jardim dos Ipes", semana: "04:56", sabado: "06:06" },
      { lat: -16.276103, lng: -48.936288, nome: "P-03 09 - Av. Raimundo Carlos Costa e Silva / Com a Rua Carnauba ( Torre )", bairro: "Jardim das Americas 3a Etapa", semana: "04:57", sabado: "06:07" },
      { lat: -16.273396, lng: -48.935617, nome: "P-03 10 - R. Ra / Com a Rua RA 18", bairro: "Lot. Res. America", semana: "04:59", sabado: "06:09" },
      { lat: -16.274272, lng: -48.937877, nome: "P-03 11 - R. Ra 17 / Esquina com a Rua RA 19", bairro: "Lot. Res. America", semana: "05:00", sabado: "06:10" },
      { lat: -16.277108, lng: -48.939888, nome: "P-03 12 - R. Ra 11 / Rua RA 13 ( Chacara da Policia Civil )", bairro: "Lot. Res. America", semana: "05:02", sabado: "06:12" },
      { lat: -16.280275, lng: -48.939791, nome: "P-03 13 - R. Prof. Clementino de Alencar Lima / Com a Rua Lisboa", bairro: "Lot. Res. America", semana: "05:03", sabado: "06:13" },
      { lat: -16.282340, lng: -48.939973, nome: "P-03 14 - Av. Raimundo C C E Silva / Com a Rua Porto Nacional", bairro: "Jardim Das Americas III", semana: "05:05", sabado: "06:15" },
      { lat: -16.250633, lng: -48.934771, nome: "P-03 15 - Av. Monte Sinai / Esquina com a Av. Wasfi Helou", bairro: "Res. Monte Sinai", semana: "05:11", sabado: "06:21" },
      { lat: -16.253541, lng: -48.934391, nome: "P-03 16 - Av. Sérgio Carneiro / Com a R. 2", bairro: "Res. Monte Sinai", semana: "05:14", sabado: "06:24" },
      { lat: -16.250019, lng: -48.937253, nome: "P-03 17 - R. SD / Esquina com a R. Sd-006", bairro: "Santos Dumont", semana: "05:16", sabado: "06:26" },
      { lat: -16.250575, lng: -48.935499, nome: "P-03 18 - R. SD 12 / Esquina com a Rua SD 15", bairro: "Santos Dumont", semana: "05:18", sabado: "06:28" },
      { lat: -16.268908, lng: -48.939586, nome: "P-03 19 - BR / Esquina com a Rua 2", bairro: "Vila Dom Bosco", semana: "05:21", sabado: "06:31" },
      { lat: -16.406940, lng: -48.921300, nome: "P-03 20 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:45", sabado: "06:55" }
    ],
    "P-04": [
      { lat: -16.308900, lng: -48.943160, nome: "P-04 01 - Av. Brasil Norte / Leomed Drogarias 24 Horas", bairro: "Jardim das Americas 2A Etapa", semana: "04:48", sabado: "05:52" },
      { lat: -16.298423, lng: -48.941830, nome: "P-04 02 - Av. Brasil Norte / Restaurante Sabor Na Mesa", bairro: "Jardim das Americas 2A Etapa", semana: "04:52", sabado: "05:56" },
      { lat: -16.287548, lng: -48.933404, nome: "P-04 03 - R. Ra 1 / Rua RA 10", bairro: "Res. Araguaia", semana: "04:56", sabado: "06:00" },
      { lat: -16.289073, lng: -48.932159, nome: "P-04 04 - Av. Perimetral / Com a Rua 27", bairro: "Res. Araguaia", semana: "04:58", sabado: "06:02" },
      { lat: -16.291052, lng: -48.928992, nome: "P-04 05 - Alameda Portal do Sol / Esquina com a Rua 7", bairro: "Residencial Vale do Sol", semana: "04:59", sabado: "06:03" },
      { lat: -16.297357, lng: -48.921444, nome: "P-04 06 - Ac. Fc 20 / Esquina com a Rua FC 19", bairro: "Residencial Vale do Sol", semana: "05:02", sabado: "06:06" },
      { lat: -16.296501, lng: -48.920935, nome: "P-04 07 - Ac. Fc 20 / Esquina com a Rua FC - 15", bairro: "Residencial Vale do Sol", semana: "05:04", sabado: "06:08" },
      { lat: -16.291220, lng: -48.921780, nome: "P-04 08 - R. 30 / Esquina com a Rua FC 3", bairro: "Parque Res. das Flores", semana: "05:05", sabado: "06:09" },
      { lat: -16.286690, lng: -48.920244, nome: "P-04 09 - R. 11 / Esquina com a Rua 25 ( Lava Jato )", bairro: "Parque Res. das Flores", semana: "05:07", sabado: "06:11" },
      { lat: -16.283723, lng: -48.921585, nome: "P-04 10 - R. 58 / Esquina com a Rua SW 2", bairro: "Vila Norte", semana: "05:09", sabado: "06:13" },
      { lat: -16.281920, lng: -48.923855, nome: "P-04 11 - R. 58 / Esquina com a Rua SW 8", bairro: "Vila Norte", semana: "05:10", sabado: "06:14" },
      { lat: -16.285849, lng: -48.924176, nome: "P-04 12 - R. 25 / Esquina com a Rua 6", bairro: "Parque Res. das Flores", semana: "05:12", sabado: "06:16" },
      { lat: -16.288384, lng: -48.924644, nome: "P-04 13 - R. 6 / Esquina com a Rua João Florentino", bairro: "Parque Res. das Flores", semana: "05:14", sabado: "06:18" },
      { lat: -16.289740, lng: -48.944640, nome: "P-04 14 - Av. Universitária / Esquina com a Av. Santos Dumont", bairro: "Maracanã", semana: "05:21", sabado: "06:25" },
      { lat: -16.297410, lng: -48.946540, nome: "P-04 15 - Av. Universitária / Restaurante Barriga Cheia", bairro: "Maracanã", semana: "05:23", sabado: "06:27" },
      { lat: -16.300902, lng: -48.947420, nome: "P-04 16 - Av. Universitária / Esquina com a Rua Chile", bairro: "Maracanã", semana: "05:24", sabado: "06:28" },
      { lat: -16.306160, lng: -48.948620, nome: "P-04 17 - Av. Universitária / Sandro Veículos", bairro: "Maracanã", semana: "05:26", sabado: "06:30" },
      { lat: -16.320808, lng: -48.952576, nome: "P-04 18 - Av. Sen. José Lourenço Dias / Grand Car", bairro: "St. Central", semana: "05:30", sabado: "06:34" },
      { lat: -16.328950, lng: -48.950100, nome: "P-04 19 - GO / Praça do Ancião", bairro: "Jundiaí", semana: "05:35", sabado: "06:39" },
      { lat: -16.330156, lng: -48.950612, nome: "P-04 20 - Av. Brasil / Prefeitura Municipal de Anápolis", bairro: "St. Central", semana: "05:35", sabado: "06:39" },
      { lat: -16.339588, lng: -48.953538, nome: "P-04 21 - Av. Brasil Sul / Autoeste Fiat", bairro: "Batista", semana: "05:38", sabado: "06:42" },
      { lat: -16.341950, lng: -48.954630, nome: "P-04 22 - Av. Brasil Sul / Radar Rolamentos - Anápolis", bairro: "Batista", semana: "05:38", sabado: "06:42" },
      { lat: -16.407132, lng: -48.918605, nome: "P-04 23 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:54", sabado: "06:58" }
    ],
    "P-05": [
      { lat: -16.288661, lng: -48.949128, nome: "P-05 01 - Av. Santos Dumont / Esquina com a Av. Dr. Vital Brasil", bairro: "Cidade Universitária", semana: "04:59", sabado: "06:04" }
