import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

const GOOGLE_MAPS_API_KEY = "AIzaSyDKsBrWnONeKqDwT4I6ooc42ogm57cqJbI";

const MapaRotas = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [selectedTurno, setSelectedTurno] = useState("1");
  const [selectedRota, setSelectedRota] = useState("P-01");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Bus stop data organized by routes
  const busStopsByRoute = {
    "P-01": [
      { lat: -16.278245, lng: -48.963118, nome: "P-01 01 - AV. Geraldo Pedro De Souza / Com a R. Dr José Machado de Silvério", semana: "04:51", sabado: "06:01" },
      { lat: -16.275960, lng: -48.966647, nome: "P-01 02 - R. 100 / Rua Florensa", semana: "04:52", sabado: "06:02" },
      { lat: -16.261218, lng: -48.988482, nome: "P-01 04 - Av. Federal / Rua 8 ( Colegio )", semana: "04:54", sabado: "06:04" },
      { lat: -16.261912, lng: -48.994349, nome: "P-01 05 - Av. Ipe Amarelo / Rotatória", semana: "04:55", sabado: "06:05" },
      { lat: -16.261266, lng: -48.997384, nome: "P-01 06 - R. Araguaia / Esquina com a Rua Cedro", semana: "04:56", sabado: "06:06" },
      { lat: -16.260235, lng: -48.999053, nome: "P-01 07 - R. Guatambu / Rua Guatambu (Ferragista Aldeia)", semana: "04:57", sabado: "06:07" },
      { lat: -16.258637, lng: -49.002028, nome: "P-01 08 - R. Araguaia / Rua Uruvalheiro (Choupana Beer)", semana: "04:58", sabado: "06:08" },
      { lat: -16.259925, lng: -49.004642, nome: "P-01 09 - R. Corumbá / Esquina com a Rua Buriti", semana: "04:59", sabado: "06:09" },
      { lat: -16.260237, lng: -49.000943, nome: "P-01 10 - R. Corumbá / Esquina com a Rua Jatoba", semana: "05:00", sabado: "06:10" },
      { lat: -16.264016, lng: -48.985605, nome: "P-01 11 - Av. Federal / Esquina com a Rua 6", semana: "05:01", sabado: "06:11" },
      { lat: -16.265407, lng: -48.983516, nome: "P-01 12 - Av. Federal / Esquina com a Rua 4", semana: "05:02", sabado: "06:12" },
      { lat: -16.271580, lng: -48.976411, nome: "P-01 13 - Av. Fernando Costa / Parque Jaiara", semana: "05:03", sabado: "06:13" },
      { lat: -16.274631, lng: -48.976366, nome: "P-01 14 - Av. Fernando Costa / Com a Travessa 2", semana: "05:04", sabado: "06:14" },
      { lat: -16.277164, lng: -48.975195, nome: "P-01 15 - Av. Fernando Costa / Com a Av. Patricia", semana: "05:05", sabado: "06:15" },
      { lat: -16.277030, lng: -48.977980, nome: "P-01 16 - R. Kátia / Com a R. 4 - Garagem da Urban", semana: "05:06", sabado: "06:16" },
      { lat: -16.281728, lng: -48.977505, nome: "P-01 17 - R. Buriti Alegre / Com a Rua Planalto", semana: "05:07", sabado: "06:17" },
      { lat: -16.282440, lng: -48.979140, nome: "P-01 18 - R. Buriti Alegre / Com a Rua Nova Capital - Merceágua", semana: "05:08", sabado: "06:18" },
      { lat: -16.283945, lng: -48.978982, nome: "P-01 19 - R. Ipameri / Rua Nova Capital - Mundo dos Pets", semana: "05:09", sabado: "06:19" },
      { lat: -16.284428, lng: -48.979883, nome: "P-01 20 - R. Ipameri / Com a Rua Paranagua", semana: "05:10", sabado: "06:20" },
      { lat: -16.285052, lng: -48.977595, nome: "P-01 21 - R. Uruaná / Com a Rua Taguatinga", semana: "05:11", sabado: "06:21" },
      { lat: -16.284035, lng: -48.975269, nome: "P-01 22 - R. Uruana / Com a Av. Bandeirantes", semana: "05:12", sabado: "06:22" },
      { lat: -16.288040, lng: -48.971360, nome: "P-01 23 - R. Itaberai / Com a Av. Bernardo Sayão", semana: "05:13", sabado: "06:23" },
      { lat: -16.283121, lng: -48.973479, nome: "P-01 24 - Av. Bernardo Sayão / Esquina com a R. Formosa", semana: "05:14", sabado: "06:24" },
      { lat: -16.280410, lng: -48.974480, nome: "P-01 25 - R. Buriti Alegre / 28° Batalhão da Polícia Militar", semana: "05:15", sabado: "06:25" },
      { lat: -16.275044, lng: -48.970956, nome: "P-01 26 - Av. Luís Carpaneda / Com a Rua Porangatu", semana: "05:16", sabado: "06:26" },
      { lat: -16.406940, lng: -48.921300, nome: "P-01 27 - Distrito Agroindustrial de Anápolis", semana: "05:45", sabado: "06:55" },
    ],
    "P-02": [
      { lat: -16.270170, lng: -48.980090, nome: "P-02 01 - R. Mizael de Morais Filho / Com a Rua Cruzeiro do Sul", semana: "04:51", sabado: "06:01" },
      { lat: -16.270460, lng: -48.984000, nome: "P-02 02 - Estr. p/ Miranápolis / Com a Rua Três Marias", semana: "04:52", sabado: "06:02" },
      { lat: -16.274426, lng: -48.985019, nome: "P-02 03 - Av. Mariele / Com a Rua 'O'", semana: "04:53", sabado: "06:03" },
      { lat: -16.277609, lng: -48.985678, nome: "P-02 04 - R. Marielle / (Supermercado do Povo)", semana: "04:54", sabado: "06:04" },
      { lat: -16.276961, lng: -48.988451, nome: "P-02 05 - R. H / Paróquia Santíssima Trindade", semana: "04:55", sabado: "06:05" },
      { lat: -16.277673, lng: -48.990843, nome: "P-02 06 - R. G / Com a Rua Jandira", semana: "04:56", sabado: "06:06" },
      { lat: -16.277684, lng: -48.993085, nome: "P-02 07 - R. Larissa / Com a Rua Taqueda", semana: "04:57", sabado: "06:07" },
      { lat: -16.277320, lng: -48.995270, nome: "P-02 08 - Av. das Laranjeiras / Com a R. Três", semana: "04:58", sabado: "06:08" },
      { lat: -16.277349, lng: -48.997228, nome: "P-02 09 - Av. das Laranjeiras / Com a Rua 5", semana: "04:59", sabado: "06:09" },
      { lat: -16.281313, lng: -48.992338, nome: "P-02 10 - Av. Souzânia / Com a R. Fontenele Junior", semana: "05:00", sabado: "06:10" },
      { lat: -16.283412, lng: -48.988511, nome: "P-02 11 - Av. Souzânia / Com a Av. Patricia", semana: "05:01", sabado: "06:11" },
      { lat: -16.280145, lng: -48.985106, nome: "P-02 12 - Av. Patrícia / Com a Av. Marieli", semana: "05:02", sabado: "06:12" },
      { lat: -16.281196, lng: -48.985181, nome: "P-02 13 - R. Jk / Com a Rua Alan Kardec", semana: "05:03", sabado: "06:13" },
      { lat: -16.285276, lng: -48.984145, nome: "P-02 14 - Rua Mun. / Com a Rua Rio Negro", semana: "05:04", sabado: "06:14" },
      { lat: -16.286670, lng: -48.981300, nome: "P-02 15 - R. Uruana / Com a Rua Tocantins", semana: "05:05", sabado: "06:15" },
      { lat: -16.288339, lng: -48.972552, nome: "P-02 16 - R. Ouro Branco / Feirão Coberto da Vila Jaiara", semana: "05:06", sabado: "06:16" },
      { lat: -16.291053, lng: -48.973229, nome: "P-02 17 - R. Silvânia / Paróquia Nossa Senhora de Fátima", semana: "05:07", sabado: "06:17" },
      { lat: -16.291314, lng: -48.971297, nome: "P-02 18 - Av. Paulista / Com a Rua Ouro Branco", semana: "05:08", sabado: "06:18" },
      { lat: -16.291986, lng: -48.969406, nome: "P-02 19 - R. Anchieta / Restaurante Popular de Anápolis", semana: "05:09", sabado: "06:19" },
      { lat: -16.406940, lng: -48.921300, nome: "P-02 20 - Distrito Agroindustrial de Anápolis", semana: "05:35", sabado: "06:45" },
    ],
    "P-03": [
      { lat: -16.285926, lng: -48.938760, nome: "P-03 01 - Av. Joao Florentino / Rua 03 - (Posto Recanto do Sol)", semana: "04:51", sabado: "06:01" },
      { lat: -16.284097, lng: -48.935658, nome: "P-03 02 - R. 3 / Rua 47 ( Supermercado Soberano )", semana: "04:52", sabado: "06:02" },
      { lat: -16.283959, lng: -48.931338, nome: "P-03 03 - R. 52 / Com a Rua 8", semana: "04:53", sabado: "06:03" },
      { lat: -16.281523, lng: -48.927637, nome: "P-03 04 - R. 55 / Com Rua 39", semana: "04:54", sabado: "06:04" },
      { lat: -16.276830, lng: -48.928940, nome: "P-03 05 - R. Direita / Esquina com a Rua 35", semana: "04:55", sabado: "06:05" },
      { lat: -16.279118, lng: -48.930556, nome: "P-03 06 - R. 54 / Com a Rua 24", semana: "04:56", sabado: "06:06" },
      { lat: -16.279748, lng: -48.932983, nome: "P-03 07 - Av. do Estado / Com a Rua 22", semana: "04:57", sabado: "06:07" },
      { lat: -16.278033, lng: -48.935336, nome: "P-03 08 - Av. do Estado / Com a Av. Dos Ipes", semana: "04:58", sabado: "06:08" },
      { lat: -16.276103, lng: -48.936288, nome: "P-03 09 - Av. Raimundo Carlos Costa e Silva / Com a Rua Carnauba ( Torre )", semana: "04:59", sabado: "06:09" },
      { lat: -16.273396, lng: -48.935617, nome: "P-03 10 - R. Ra / Com a Rua RA 18", semana: "05:00", sabado: "06:10" },
      { lat: -16.274272, lng: -48.937877, nome: "P-03 11 - R. Ra 17 / Esquina com a Rua RA 19", semana: "05:01", sabado: "06:11" },
      { lat: -16.277108, lng: -48.939888, nome: "P-03 12 - R. Ra 11 / Rua RA 13 ( Chacara da Policia Civil )", semana: "05:02", sabado: "06:12" },
      { lat: -16.280275, lng: -48.939791, nome: "P-03 13 - R. Prof. Clementino de Alencar Lima / Com a Rua Lisboa", semana: "05:03", sabado: "06:13" },
      { lat: -16.282340, lng: -48.939973, nome: "P-03 14 - Av. Raimundo C C E Silva / Com a Rua Porto Nacional", semana: "05:04", sabado: "06:14" },
      { lat: -16.250633, lng: -48.934771, nome: "P-03 15 - Av. Monte Sinai / Esquina com a Av. Wasfi Helou", semana: "05:05", sabado: "06:15" },
      { lat: -16.253541, lng: -48.934391, nome: "P-03 16 - Av. Sérgio Carneiro / Com a R. 2", semana: "05:06", sabado: "06:16" },
      { lat: -16.250019, lng: -48.937253, nome: "P-03 17 - R. SD / Esquina com a R. Sd-006", semana: "05:07", sabado: "06:17" },
      { lat: -16.250575, lng: -48.935499, nome: "P-03 18 - R. SD 12 / Esquina com a Rua SD 15", semana: "05:08", sabado: "06:18" },
      { lat: -16.268908, lng: -48.939586, nome: "P-03 19 - BR / Esquina com a Rua 2", semana: "05:09", sabado: "06:19" },
      { lat: -16.406940, lng: -48.921300, nome: "P-03 20 - Distrito Agroindustrial de Anápolis", semana: "05:35", sabado: "06:45" },
    ],
    "P-04": [
      { lat: -16.308900, lng: -48.943160, nome: "P-04 01 - Av. Brasil Norte / Leomed Drogarias 24 Horas", semana: "04:50", sabado: "06:00" },
      { lat: -16.298423, lng: -48.941830, nome: "P-04 02 - Av. Brasil Norte / Restaurante Sabor Na Mesa", semana: "04:52", sabado: "06:02" },
      { lat: -16.287548, lng: -48.933404, nome: "P-04 03 - R. Ra 1 / Rua RA 10", semana: "04:54", sabado: "06:04" },
      { lat: -16.289073, lng: -48.932159, nome: "P-04 04 - Av. Perimetral / Com a Rua 27", semana: "04:55", sabado: "06:05" },
      { lat: -16.291052, lng: -48.928992, nome: "P-04 05 - Alameda Portal do Sol / Esquina com a Rua 7", semana: "04:56", sabado: "06:06" },
      { lat: -16.297357, lng: -48.921444, nome: "P-04 06 - Ac. Fc 20 / Esquina com a Rua FC 19", semana: "04:58", sabado: "06:08" },
      { lat: -16.296501, lng: -48.920935, nome: "P-04 07 - Ac. Fc 20 / Esquina com a Rua FC - 15", semana: "04:59", sabado: "06:09" },
      { lat: -16.291220, lng: -48.921780, nome: "P-04 08 - R. 30 / Esquina com a Rua FC 3", semana: "05:00", sabado: "06:10" },
      { lat: -16.286690, lng: -48.920244, nome: "P-04 09 - R. 11 / Esquina com a Rua 25 ( Lava Jato )", semana: "05:01", sabado: "06:11" },
      { lat: -16.283723, lng: -48.921585, nome: "P-04 10 - R. 58 / Esquina com a Rua SW 2", semana: "05:02", sabado: "06:12" },
      { lat: -16.281920, lng: -48.923855, nome: "P-04 11 - R. 58 / Esquina com a Rua SW 8", semana: "05:03", sabado: "06:13" },
      { lat: -16.285849, lng: -48.924176, nome: "P-04 12 - R. 25 / Esquina com a Rua 6", semana: "05:04", sabado: "06:14" },
      { lat: -16.288384, lng: -48.924644, nome: "P-04 13 - R. 6 / Esquina com a Rua João Florentino", semana: "05:05", sabado: "06:15" },
      { lat: -16.289740, lng: -48.944640, nome: "P-04 14 - Av. Universitária / Esquina com a Av. Santos Dumont", semana: "05:08", sabado: "06:18" },
      { lat: -16.297410, lng: -48.946540, nome: "P-04 15 - Av. Universitária / Restaurante Barriga Cheia", semana: "05:10", sabado: "06:20" },
      { lat: -16.300902, lng: -48.947420, nome: "P-04 16 - Av. Universitária / Esquina com a Rua Chile", semana: "05:11", sabado: "06:21" },
      { lat: -16.306160, lng: -48.948620, nome: "P-04 17 - Av. Universitária / Sandro Veículos", semana: "05:12", sabado: "06:22" },
      { lat: -16.320808, lng: -48.952576, nome: "P-04 18 - Av. Sen. José Lourenço Dias / Grand Car", semana: "05:15", sabado: "06:25" },
      { lat: -16.328950, lng: -48.950100, nome: "P-04 19 - GO / Praça do Ancião", semana: "05:18", sabado: "06:28" },
      { lat: -16.330156, lng: -48.950612, nome: "P-04 20 - Av. Brasil / Prefeitura Municipal de Anápolis", semana: "05:19", sabado: "06:29" },
      { lat: -16.339588, lng: -48.953538, nome: "P-04 21 - Av. Brasil Sul / Autoeste Fiat", semana: "05:21", sabado: "06:31" },
      { lat: -16.341950, lng: -48.954630, nome: "P-04 22 - Av. Brasil Sul / Radar Rolamentos - Anápolis", semana: "05:22", sabado: "06:32" },
      { lat: -16.407132, lng: -48.918605, nome: "P-04 23 - Distrito Agroindustrial de Anápolis", semana: "05:40", sabado: "06:50" }
    ],
    "P-05": [
      { lat: -16.288661, lng: -48.949128, nome: "P-05 01 - Av. Santos Dumont / Esquina com a Av. Dr. Vital Brasil", semana: "04:59", sabado: "06:04" },
      { lat: -16.288158, lng: -48.952656, nome: "P-05 02 - Av. Santos Dumont / Esquina com a Av. Xavantina", semana: "05:00", sabado: "06:05" },
      { lat: -16.294524, lng: -48.955178, nome: "P-05 03 - Av. Jaiara / Supermercado Silva", semana: "05:02", sabado: "06:07" },
      { lat: -16.292781, lng: -48.958423, nome: "P-05 04 - Av. 10 / Esquina com a Rua 4", semana: "05:03", sabado: "06:08" },
      { lat: -16.288976, lng: -48.957699, nome: "P-05 05 - Av. 10 / Esquina com a Av. Mirage ( Sorveteria )", semana: "05:04", sabado: "06:09" },
      { lat: -16.284591, lng: -48.957930, nome: "P-05 06 - R. P 53 / Esquina com a Rua P 36", semana: "05:05", sabado: "06:10" },
      { lat: -16.284103, lng: -48.960839, nome: "P-05 07 - R. P 43 / Esquina com a Rua Mirage", semana: "05:06", sabado: "06:11" },
      { lat: -16.285849, lng: -48.964106, nome: "P-05 08 - R. Pres Castelo Branco / Rua João Vieira (Pamonharia)", semana: "05:07", sabado: "06:12" },
      { lat: -16.282972, lng: -48.964481, nome: "P-05 09 - R. Pres Castelo Branco / Esquina com a Rua Marta Irene", semana: "05:08", sabado: "06:13" },
      { lat: -16.280291, lng: -48.964761, nome: "P-05 10 - R. Pres Castelo Branco / Esquina com a Rua Jonas Duarte", semana: "05:09", sabado: "06:14" },
      { lat: -16.279547, lng: -48.967178, nome: "P-05 11 - R.T / Esquina com a Av. Santo Antonio ( Sinesio )", semana: "05:10", sabado: "06:15" },
      { lat: -16.279971, lng: -48.969742, nome: "P-05 12 - R. Cristalina / Esquina com a Av. Marechal Gouveia", semana: "05:10", sabado: "06:15" },
      { lat: -16.283947, lng: -48.970567, nome: "P-05 13 - R. João Pinheiro / Esquina com a R. Planaltina", semana: "05:12", sabado: "06:17" },
      { lat: -16.285963, lng: -48.969648, nome: "P-05 14 - R. João Pinheiro / Esquina com a Rua Inhumas", semana: "05:13", sabado: "06:18" },
      { lat: -16.288850, lng: -48.968280, nome: "P-05 15 - R. João Pinheiro / Esquina com a Rua Pirinopolis", semana: "05:13", sabado: "06:18" },
      { lat: -16.292577, lng: -48.966514, nome: "P-05 16 - R. João Pinheiro / Esquina com a Rua Sussuapara", semana: "05:14", sabado: "06:19" },
      { lat: -16
