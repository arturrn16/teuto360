
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
      { lat: -16.406940, lng: -48.921300, nome: "P-01 27 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:50", sabado: "06:55" },
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
      { lat: -16.406940, lng: -48.921300, nome: "P-02 20 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:50", sabado: "06:55" },
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
      { lat: -16.406940, lng: -48.921300, nome: "P-03 20 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "05:45", sabado: "06:55" },
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
      { lat: -16.288661, lng: -48.949128, nome: "P-05 01 - Av. Santos Dumont / Esquina com a Av. Dr. Vital Brasil", bairro: "Cidade Universitária", semana: "04:59", sabado: "06:04" },
      { lat: -16.288158, lng: -48.952656, nome: "P-05 02 - Av. Santos Dumont / Esquina com a Av. Xavantina", bairro: "Cidade Universitária", semana: "05:00", sabado: "06:05" },
      { lat: -16.294524, lng: -48.955178, nome: "P-05 03 - Av. Jaiara / Supermercado Silva", bairro: "Parque Iracema", semana: "05:02", sabado: "06:07" },
      { lat: -16.292781, lng: -48.958423, nome: "P-05 04 - Av. 10 / Esquina com a Rua 4", bairro: "Jardim Progresso", semana: "05:03", sabado: "06:08" },
      { lat: -16.288976, lng: -48.957699, nome: "P-05 05 - Av. 10 / Esquina com a Av. Mirage ( Sorveteria )", bairro: "Cidade Universitária", semana: "05:04", sabado: "06:09" },
      { lat: -16.284591, lng: -48.957930, nome: "P-05 06 - R. P 53 / Esquina com a Rua P 36", bairro: "Jardim Progresso", semana: "05:05", sabado: "06:10" },
      { lat: -16.284103, lng: -48.960839, nome: "P-05 07 - R. P 43 / Esquina com a Rua Mirage", bairro: "Jardim Progresso", semana: "05:06", sabado: "06:11" },
      { lat: -16.285849, lng: -48.964106, nome: "P-05 08 - R. Pres Castelo Branco / Rua João Vieira (Pamonharia)", bairro: "Bandeiras", semana: "05:07", sabado: "06:12" },
      { lat: -16.282972, lng: -48.964481, nome: "P-05 09 - R. Pres Castelo Branco / Esquina com a Rua Marta Irene", bairro: "Vila Harmonia", semana: "05:08", sabado: "06:13" },
      { lat: -16.280291, lng: -48.964761, nome: "P-05 10 - R. Pres Castelo Branco / Esquina com a Rua Jonas Duarte", bairro: "Vila Harmonia", semana: "05:09", sabado: "06:14" },
      { lat: -16.279547, lng: -48.967178, nome: "P-05 11 - R.T / Esquina com a Av. Santo Antonio ( Sinesio )", bairro: "Bandeiras", semana: "05:10", sabado: "06:15" },
      { lat: -16.279971, lng: -48.969742, nome: "P-05 12 - R. Cristalina / Esquina com a Av. Marechal Gouveia", bairro: "Vila Jaiara St. Norte", semana: "05:10", sabado: "06:15" },
      { lat: -16.283947, lng: -48.970567, nome: "P-05 13 - R. João Pinheiro / Esquina com a R. Planaltina", bairro: "Vila Jaiara St. Norte", semana: "05:12", sabado: "06:17" },
      { lat: -16.285963, lng: -48.969648, nome: "P-05 14 - R. João Pinheiro / Esquina com a Rua Inhumas", bairro: "Vila Jaiara St. Norte", semana: "05:13", sabado: "06:18" },
      { lat: -16.288850, lng: -48.968280, nome: "P-05 15 - R. João Pinheiro / Esquina com a Rua Pirinopolis", bairro: "Vila Jaiara St. Norte", semana: "05:13", sabado: "06:18" },
      { lat: -16.292577, lng: -48.966514, nome: "P-05 16 - R. João Pinheiro / Esquina com a Rua Sussuapara", bairro: "Vila Jaiara St. Norte", semana: "05:14", sabado: "06:19" },
      { lat: -16.293538, lng: -48.966075, nome: "P-05 17 - R. João Pinheiro / Esquina com a Rua Goiânia", bairro: "Vila Jaiara St. Norte", semana: "05:15", sabado: "06:20" },
      { lat: -16.294486, lng: -48.964792, nome: "P-05 18 - Av. 24 de Agosto / Esquina com a R. Dr. Alfredo Fleuri", bairro: "Jardim Progresso", semana: "05:15", sabado: "06:20" },
      { lat: -16.296555, lng: -48.963500, nome: "P-05 19 - R. Dr. Alfredo Fleuri / Esquina com a R. Tamandare", bairro: "Jardim Alexandrina", semana: "05:16", sabado: "06:21" },
      { lat: -16.407070, lng: -48.917269, nome: "P-05 20 - D módulo 11 / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "05:45", sabado: "06:50" },
    ],
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

    // Initialize Google Map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -16.328118, lng: -48.953529 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Initialize search box
    const input = document.getElementById("search-input") as HTMLInputElement;
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
      const stops = busStopsByRoute[selectedRota as keyof typeof busStopsByRoute] || [];
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
    mapInstanceRef.current.fitBounds(bounds);
  }, [busStopsByRoute, selectedRota]);

  // Helper function to create a flag marker
  const createFlagMarker = (position: google.maps.LatLngLiteral, flagColor: 'green' | 'red', title: string, stop: any) => {
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
  const createMarker = (stop: any, routeName: string, index: number) => {
    if (!mapInstanceRef.current) return null;
    
    const position = { lat: stop.lat, lng: stop.lng };
    const routeColor = ROUTE_COLORS[routeName as keyof typeof ROUTE_COLORS] || "#333333";
    
    // Create SVG icon with route color
    const busStopIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${routeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="${routeColor}" stroke-width="2"/>
          <rect x="9" y="7" width="6" height="10" rx="1" fill="${routeColor}"/>
          <line x1="9" y1="10" x2="15" y2="10" stroke="#FFFFFF" stroke-width="1"/>
          <line x1="12" y1="7" x2="12" y2="17" stroke="#FFFFFF" stroke-width="1"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 16),
    };
    
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

  const handleRouteChange = (value: string) => {
    setSelectedRota(value);
  };

  const handleTurnoChange = (value: string) => {
    setSelectedTurno(value);
    // Reset route selection when changing turno
    setSelectedRota(null);
  };

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

  const clearRouteFilter = () => {
    setSelectedRota(null);
  };

  // Get available routes based on selected turno
  const getAvailableRoutes = () => {
    if (selectedTurno === "1° Turno") {
      return Object.keys(busStopsByRoute);
    }
    return [];
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle>Mapa de Rotas de Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Turno</label>
              <Select value={selectedTurno} onValueChange={handleTurnoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1° Turno">1° Turno</SelectItem>
                  <SelectItem value="2° Turno">2° Turno</SelectItem>
                  <SelectItem value="3° Turno">3° Turno</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Rota (Opcional)</label>
              <div className="flex gap-2">
                <Select 
                  value={selectedRota || ""}
                  onValueChange={handleRouteChange}
                  disabled={selectedTurno !== "1° Turno"}
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
          {!selectedRota && selectedTurno === "1° Turno" && (
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

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={mapRef}
            className="w-full h-[70vh] rounded-md"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaRotas;
