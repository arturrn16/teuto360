
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
      { lat: -16.293538, lng: -48.966075, nome: "P-05 17 - R. João Pinheiro / Esquina com a Rua Goiânia", semana: "05:15", sabado: "06:20" },
      { lat: -16.294486, lng: -48.964792, nome: "P-05 18 - Av. 24 de Agosto / Esquina com a R. Dr. Alfredo Fleuri", semana: "05:15", sabado: "06:20" },
      { lat: -16.296555, lng: -48.963500, nome: "P-05 19 - R. Dr. Alfredo Fleuri / Esquina com a R. Tamandare", semana: "05:16", sabado: "06:21" },
      { lat: -16.407070, lng: -48.917269, nome: "P-05 20 - D módulo 11 / Laboratório Teuto", semana: "05:45", sabado: "06:50" },
    ],
    "P-06": [
      { lat: -16.311309, lng: -48.920828, nome: "P-06 01 - Av. RC 16 / Esquina com a Av. Cerejeiras", semana: "04:38", sabado: "05:49" },
      { lat: -16.312753, lng: -48.916932, nome: "P-06 02 - R. RC 9 / Esquina com a Rua RC - 19", semana: "04:41", sabado: "05:52" },
      { lat: -16.317963, lng: -48.918671, nome: "P-06 03 - R. RC-1 / Esquina com a R. RC-4", semana: "04:44", sabado: "05:55" },
      { lat: -16.322030, lng: -48.919100, nome: "P-06 04 - Av. Ayrton Senna da Silva / Esquina com a Rua PSJ 06", semana: "04:47", sabado: "05:58" },
      { lat: -16.321042, lng: -48.917352, nome: "P-06 05 - Av. Ayrton Senna da Silva / Esquina com a Rua PB 17", semana: "04:48", sabado: "05:59" },
      { lat: -16.319219, lng: -48.914313, nome: "P-06 06 - Av. Ayrton Senna da Silva / Esquina com a PB 50 ( Space Hall )", semana: "04:49", sabado: "06:00" },
      { lat: -16.315749, lng: -48.909235, nome: "P-06 07 - Av. Ayrton Senna da Silva / Esquina com a MN 3", semana: "04:50", sabado: "06:01" },
      { lat: -16.312217, lng: -48.910575, nome: "P-06 08 - Av. das Laranjeiras, 602 / Esquina com a Av Pinheiro", semana: "04:52", sabado: "06:03" },
      { lat: -16.314001, lng: -48.906777, nome: "P-06 09 - Av. Ayrton Senna da Silva / Com a Av. Jornalista Euripides Gomes de Melo", semana: "04:54", sabado: "06:05" },
      { lat: -16.316569, lng: -48.904727, nome: "P-06 10 - Av. Jorn. Eurípedes Gomes de Melo / Esquina com a Rua Dr. Zico de Farias", semana: "04:56", sabado: "06:07" },
      { lat: -16.318070, lng: -48.906470, nome: "P-06 11 - R. MN 21 / Esquina com a Rua MN 3", semana: "04:56", sabado: "06:07" },
      { lat: -16.321510, lng: -48.905737, nome: "P-06 12 - R. Napoli / Esquina com a Av. Itália", semana: "04:59", sabado: "06:10" },
      { lat: -16.319182, lng: -48.902883, nome: "P-06 13 - Av. Itália / Esquina com a Av. Jorn. Eurípedes Gomes de Melo", semana: "05:00", sabado: "06:11" },
      { lat: -16.317397, lng: -48.900436, nome: "P-06 14 - R. Zacarias Elias / Com a Av. Comendador Jose Abidala", semana: "05:00", sabado: "06:11" },
      { lat: -16.315114, lng: -48.901901, nome: "P-06 15 - Av. Comendador Jose Abidala / Com a Rua. Zico de Faria", semana: "05:02", sabado: "06:13" },
      { lat: -16.311845, lng: -48.904369, nome: "P-06 16 - Av. Ayrton Senna da Silva / Esquina com a Av. Cdor Jose Abdala", semana: "05:02", sabado: "06:13" },
      { lat: -16.310620, lng: -48.902810, nome: "P-06 17 - Av. Ayrton Senna da Silva / Ferragista Avenida", semana: "05:05", sabado: "06:16" },
      { lat: -16.309560, lng: -48.901662, nome: "P-06 18 - Av. Ayrton Senna da Silva / Esquina com a Rua Adelardo Goulart", semana: "05:05", sabado: "06:16" },
      { lat: -16.303210, lng: -48.893795, nome: "P-06 19 - Av. JP 34 / Com a Av. JP 59", semana: "05:07", sabado: "06:18" },
      { lat: -16.304724, lng: -48.890135, nome: "P-06 20 - Av. JP 34 / Com a Rua JP 52", semana: "05:08", sabado: "06:19" },
      { lat: -16.305103, lng: -48.889257, nome: "P-06 21 - Av. Jp 34 / Com a Rua JP 49 (Empório dos pães)", semana: "05:08", sabado: "06:19" },
      { lat: -16.302641, lng: -48.887630, nome: "P-06 22 - R. Jp 47 / Com a Rua JP 39", semana: "05:11", sabado: "06:22" },
      { lat: -16.301061, lng: -48.891779, nome: "P-06 23 - R. Jp 59 / Com a Rua JP 39", semana: "05:13", sabado: "06:24" },
      { lat: -16.305672, lng: -48.897330, nome: "P-06 24 - GO / Esquina com a JP 30", semana: "05:14", sabado: "06:25" },
      { lat: -16.303035, lng: -48.901144, nome: "P-06 25 - R. VN / Esquina com a Rua JP8", semana: "05:17", sabado: "06:28" },
      { lat: -16.304540, lng: -48.896040, nome: "P-06 26 - R. Jp 1 / Com a Rua JP-08 - Shell", semana: "05:20", sabado: "06:31" },
      { lat: -16.314569, lng: -48.899957, nome: "P-06 27 - Av. Sérvio Túlio Jayme / Com a Rua Almiro de Amorim ( Praça )", semana: "05:23", sabado: "06:34" },
      { lat: -16.315550, lng: -48.899456, nome: "P-06 28 - Av. Sérvio Túlio Jayme / Com a Rua Michel Aidar", semana: "05:23", sabado: "06:34" },
      { lat: -16.326710, lng: -48.893872, nome: "P-06 29 - Av. Sérvio Túlio Jayme / Com a Rua I -8", semana: "05:26", sabado: "06:37" },
      { lat: -16.336176, lng: -48.896571, nome: "P-06 30 - Av. Independência / Com a Rua Ana Guimaraes Alves", semana: "05:26", sabado: "06:37" },
      { lat: -16.407204, lng: -48.920762, nome: "P-06 31 - Distrito Agroindustrial de Anápolis", semana: "05:44", sabado: "06:55" },
    ],
    "P-07": [
      { lat: -16.318109, lng: -48.955068, nome: "P-07 01 - Av. Pres. Kennedy / Esquina com a R. Luís Schinor", semana: "05:00", sabado: "06:05" },
      { lat: -16.316668, lng: -48.955913, nome: "P-07 02 - Av. Pres. Kennedy / Pizzaria Presidente", semana: "05:00", sabado: "06:05" },
      { lat: -16.315025, lng: -48.956811, nome: "P-07 03 - Av. Pres. Kennedy / Esquina com a R. Joaquim da Cunha", semana: "05:01", sabado: "06:06" },
      { lat: -16.311057, lng: -48.958890, nome: "P-07 04 - Av. Pres. Kennedy / Com a Av. Central", semana: "05:02", sabado: "06:07" },
      { lat: -16.305671, lng: -48.961691, nome: "P-07 05 - Av. Pres. Kennedy / ( Praça dos Romeiros )", semana: "05:03", sabado: "06:08" },
      { lat: -16.301756, lng: -48.957752, nome: "P-07 06 - Av. Dona Albertina de Pina / Com a Rua Goianapolis", semana: "05:04", sabado: "06:09" },
      { lat: -16.297336, lng: -48.960528, nome: "P-07 07 - R. Monteiro Lobato / Com a Rua Alfredo Nasser", semana: "05:06", sabado: "06:11" },
      { lat: -16.297874, lng: -48.964215, nome: "P-07 08 - Av. Nair Xavier Correia / Com a Rua Benedito Borges - Feirão da Alexandrina", semana: "05:07", sabado: "06:12" },
      { lat: -16.301299, lng: -48.966205, nome: "P-07 09 - Av. Tiradentes / Esquina com a R. da Prata", semana: "05:09", sabado: "06:14" },
      { lat: -16.305421, lng: -48.970414, nome: "P-07 10 - R. I 6 / Esquina com a Av. Itamaraty", semana: "05:10", sabado: "06:15" },
      { lat: -16.305006, lng: -48.972826, nome: "P-07 11 - R. I 10 / Com a Rua 1", semana: "05:11", sabado: "06:16" },
      { lat: -16.309362, lng: -48.963089, nome: "P-07 12 - R. Leopoldo de Bulhões / Esquina com a Rua Cuiaba", semana: "05:15", sabado: "06:20" },
      { lat: -16.312928, lng: -48.961095, nome: "P-07 13 - R. Leopoldo de Bulhões / Esquina com a Rua Xavantes", semana: "05:16", sabado: "06:21" },
      { lat: -16.314978, lng: -48.960011, nome: "P-07 14 - R. Leopoldo de Bulhões / Esquina com a Rua Bejamim Constante", semana: "05:17", sabado: "06:22" },
      { lat: -16.318920, lng: -48.960423, nome: "P-07 15 - R. Benjamin Constant / Esquina com a R. Mauá", semana: "05:18", sabado: "06:23" },
      { lat: -16.318338, lng: -48.963414, nome: "P-07 16 - R. Mauá / Esquina com a Rua Padre Anchieta", semana: "05:19", sabado: "06:24" },
      { lat: -16.319713, lng: -48.966257, nome: "P-07 17 - R. Osvaldo Cruz / Esquina com a Rua Federal", semana: "05:20", sabado: "06:25" },
      { lat: -16.320939, lng: -48.963987, nome: "P-07 18 - Av. Federal / Esquina com a Rua Ipiranga", semana: "05:21", sabado: "06:26" },
      { lat: -16.322462, lng: -48.961884, nome: "P-07 19 - Av. Federal / Com a Rua Firmo de Velasco", semana: "05:21", sabado: "06:26" },
      { lat: -16.331640, lng: -48.962601, nome: "P-07 20 - R. Firmo de Velasco / Esquina com a Av. Geturlino Artiaga", semana: "05:24", sabado: "06:29" },
      { lat: -16.332229, lng: -48.959219, nome: "P-07 21 - Av. Getulino Artiaga / Esquina com a 14 de Julho ( Saneago )", semana: "05:25", sabado: "06:30" },
      { lat: -16.337070, lng: -48.957750, nome: "P-07 22 - R. Eng. Portela / Posto 9 Ipiranga Anápolis", semana: "05:28", sabado: "06:33" },
      { lat: -16.346932, lng: -48.958522, nome: "P-07 23 - R. Eng. Portela / Esquina com a R. Brasil Caiado", semana: "05:30", sabado: "06:35" },
      { lat: -16.407122, lng: -48.919356, nome: "P-07 24 - Distrito Agroindustrial de Anápolis", semana: "05:45", sabado: "06:50" },
    ],
    "P-08": [
      { lat: -16.313360, lng: -48.934760, nome: "P-08 01 - R. Dona Carime / Garagem São José", semana: "04:38", sabado: "05:43" },
      { lat: -16.315325, lng: -48.935764, nome: "P-08 02 - Av. Dona Elvira / Com a Rua Manoel Luiz da Fonseca", semana: "04:39", sabado: "05:44" },
      { lat: -16.320407, lng: -48.939063, nome: "P-08 03 - Av. Dona Elvira / Esquina com a R. Joaquim Esperidião", semana: "04:40", sabado: "05:45" },
      { lat: -16.328012, lng: -48.937825, nome: "P-08 04 - Av. Visc. de Taunay / Esquina com a Rua Francisco Fontes", semana: "04:43", sabado: "05:48" },
      { lat: -16.329622, lng: -48.938965, nome: "P-08 05 - Av. Visc. de Taunay / Esquina com a Rua Silva Pinto", semana: "04:44", sabado: "05:49" },
      { lat: -16.332026, lng: -48.941416, nome: "P-08 06 - Av. Dom Prudencio / Paróquia São Francisco de Assis", semana: "04:45", sabado: "05:50" },
      { lat: -16.329519, lng: -48.946539, nome: "P-08 07 - Av. Santos Dumont / Praça Dom Emanuel", semana: "04:48", sabado: "05:53" },
      { lat: -16.328330, lng: -48.957186, nome: "P-08 08 - Av. Goiás / Praça Bom Jesus", semana: "04:52", sabado: "05:57" },
      { lat: -16.328009, lng: -48.962844, nome: "P-08 09 - Av. Goiás / Esquina com a R. Amazonas", semana: "04:54", sabado: "05:59" },
      { lat: -16.329969, lng: -48.965425, nome: "P-08 10 - R. Sen. Sócrates Mardochen Diniz / Esquina com a Rua Benjamim Vieira (Praça)", semana: "04:55", sabado: "06:00" },
      { lat: -16.326290, lng: -48.969750, nome: "P-08 11 - R. Eduardo Pereira / Esquina com a a Rua Dois", semana: "04:58", sabado: "06:03" },
      { lat: -16.325552, lng: -48.972002, nome: "P-08 12 - Praca Lemos / Drogaria Nova Aliança", semana: "04:58", sabado: "06:03" },
      { lat: -16.325998, lng: -48.980344, nome: "P-08 13 - Av. Goiás / Esquina com a Rua Paraibuna (Ferro Velho)", semana: "05:00", sabado: "06:05" },
      { lat: -16.326182, lng: -48.996279, nome: "P-08 14 - Av. Matadouro Industrial / Esquina com a Rua A Taváres", semana: "05:04", sabado: "06:09" },
      { lat: -16.326916, lng: -48.999463, nome: "P-08 15 - Av. Matadouro Industrial / Esquina com a R. Juvenal S Guede", semana: "05:05", sabado: "06:10" },
      { lat: -16.327750, lng: -49.013590, nome: "P-08 16 - Av. Francisco Alves / Esquina com a GO 330", semana: "05:08", sabado: "06:13" },
      { lat: -16.329414, lng: -49.013257, nome: "P-08 17 - Av. Francisco Alves / Esquina com a Rua Pompéia", semana: "05:08", sabado: "06:13" },
      { lat: -16.333020, lng: -49.012403, nome: "P-08 18 - Av. Francisco Alves / Esquina com a R. Dr Loureano", semana: "05:09", sabado: "06:14" },
      { lat: -16.328055, lng: -48.997310, nome: "P-08 19 - Av. Fabril / Com a Rua 4", semana: "05:13", sabado: "06:18" },
      { lat: -16.327130, lng: -48.993480, nome: "P-08 20 - Av. Goiás / Posto Ipiranga", semana: "05:14", sabado: "06:19" },
      { lat: -16.326488, lng: -48.990498, nome: "P-08 21 - Av. Goiás / ESF Jardim das Oliveiras", semana: "05:15", sabado: "06:20" },
      { lat: -16.325266, lng: -48.985804, nome: "P-08 22 - Av. Goiás / Residencial Vale Verde", semana: "05:15", sabado: "06:20" },
      { lat: -16.329690, lng: -48.979647, nome: "P-08 23 - Av. Prof. Benvindo Machado / Com a Rua São Simão", semana: "05:17", sabado: "06:22" },
      { lat: -16.332751, lng: -48.975910, nome: "P-08 24 - Av. Prof. Benvindo Machado / ( Residencial São Jose )", semana: "05:18", sabado: "06:23" },
      { lat: -16.334319, lng: -48.973541, nome: "P-08 25 - Av. Benvindo Machado / Esquina com a Rua Guaxupé", semana: "05:18", sabado: "06:23" },
      { lat: -16.336836, lng: -48.968200, nome: "P-08 26 - Av. Benvindo Machado / Av. Benvindo Machado Com a Rua Castro Alves ( Supervi )", semana: "05:20", sabado: "06:25" },
      { lat: -16.341371, lng: -48.968619, nome: "P-08 27 - Av. Pedro Ludovico / Com a Rua Nova Delhi (Pecuária)", semana: "05:21", sabado: "06:26" },
      { lat: -16.343920, lng: -48.970551, nome: "P-08 28 - Av. Pedro Ludovico / Com a Rua 9 ( Loja Aliança )", semana: "05:22", sabado: "06:27" },
      { lat: -16.344871, lng: -48.975653, nome: "P-08 29 - R. A / Esquina com a Rua S", semana: "05:24", sabado: "06:29" },
      { lat: -16.347260, lng: -48.974300, nome: "P-08 30 - Praca Martins / Esquina com a Av. Cachoeira Dourada", semana: "05:25", sabado: "06:30" },
      { lat: -16.407122, lng: -48.918734, nome: "P-08 31 - Distrito Agroindustrial de Anápolis", semana: "05:45", sabado: "06:50" }
    ],
    "P-09": [
      { lat: -16.354320, lng: -48.974306, nome: "P-09 01 - Av. Isidório Rodrigues / Com a Rua Ana Lucia de Sousa", semana: "04:52", sabado: "06:01" },
      { lat: -16.355672, lng: -48.972233, nome: "P-09 02 - Av. Isidório Rodrigues / Com a Rua Marcos Irako Mendes (Rotatória)", semana: "04:52", sabado: "06:01" },
      { lat: -16.356524, lng: -48.970381, nome: "P-09 03 - Av. Isidoro Sabino Rodrigues / Com a Rua Waldir M. da Silva", semana: "04:53", sabado: "06:02" },
      { lat: -16.357890, lng: -48.967940, nome: "P-09 04 - Av. Gomes de Souza Ramos / Esquina com a Rua JM 23", semana: "04:54", sabado: "06:03" },
      { lat: -16.359170, lng: -48.965560, nome: "P-09 05 - Av. Acdo. Adail L. Dias / Esquina com a JM 18", semana: "04:54", sabado: "06:03" },
      { lat: -16.361496, lng: -48.965229, nome: "P-09 06 - R. Pedro Tonelini / Com a Rua Pecuária", semana: "04:56", sabado: "06:05" },
      { lat: -16.365810, lng: -48.966419, nome: "P-09 07 - R. Pedro Tonelini / Com a Av. dos Operário", semana: "04:57", sabado: "06:06" },
      { lat: -16.367607, lng: -48.966851, nome: "P-09 08 - R. Pedro Tonelini / Com a Rua Brasiliense", semana: "04:57", sabado: "06:06" },
      { lat: -16.367319, lng: -48.969271, nome: "P-09 09 - R. Brasiliense / Com a Av. Mirage - Condominio Premier Park", semana: "04:58", sabado: "06:07" },
      { lat: -16.372148, lng: -48.968899, nome: "P-09 10 - Av. Mirage / Com a Rua Contorno", semana: "05:00", sabado: "06:09" },
      { lat: -16.375207, lng: -48.968305, nome: "P-09 11 - Av. Mirage / Com a Rua Cantor Sinhozinho", semana: "05:00", sabado: "06:09" },
      { lat: -16.379750, lng: -48.966695, nome: "P-09 12 - R. Srg. Euclides / Com a Rua do Servidor Público (Mercearia Nossa Sª. de Fátima)", semana: "05:01", sabado: "06:10" },
      { lat: -16.379117, lng: -48.963186, nome: "P-09 13 - R. Srg. Euclídes / Com a Rua Sargento Euclides", semana: "05:02", sabado: "06:11" },
      { lat: -16.386232, lng: -48.962589, nome: "P-09 14 - Av. Brasil Sul / Com a Rua Associação Atlética Anapolina", semana: "05:03", sabado: "06:12" },
      { lat: -16.407911, lng: -48.903854, nome: "P-09 15 - Av. Central / Com a Rua 2", semana: "05:13", sabado: "06:22" },
      { lat: -16.411836, lng: -48.895939, nome: "P-09 16 - Av. Federal / Esquina com a Rua São José", semana: "05:15", sabado: "06:24" },
      { lat: -16.411400, lng: -48.895167, nome: "P-09 17 - R. Sao Jose / Esquina com a Rua Adriana Monteiro", semana: "05:16", sabado: "06:25" },
      { lat: -16.408990, lng: -48.895177, nome: "P-09 18 - R. Tocantins / Esquina com a TV. 2", semana: "05:17", sabado: "06:26" },
      { lat: -16.407466, lng: -48.893420, nome: "P-09 19 - R. Tocantins / Esquina com a José Otílio", semana: "05:18", sabado: "06:27" },
      { lat: -16.406554, lng: -48.893864, nome: "P-09 20 - R. José Otílio / Esquina com a Rua Nova Vila", semana: "05:18", sabado: "06:27" },
      { lat: -16.402687, lng: -48.896159, nome: "P-09 21 - R. 2 / Esquina com a Rua 10", semana: "05:20", sabado: "06:29" },
      { lat: -16.406673, lng: -48.895955, nome: "P-09 22 - R. Higor / Esquina com a Av. Araticum", semana: "05:23", sabado: "06:32" },
      { lat: -16.408027, lng: -48.897476, nome: "P-09 23 - R. Higor / Com a Rua Ardiana Monteiro - Ferragista Martins", semana: "05:23", sabado: "06:32" },
      { lat: -16.407863, lng: -48.899823, nome: "P-09 24 - R. 5 / Com a Rua 13", semana: "05:25", sabado: "06:34" },
      { lat: -16.406246, lng: -48.901983, nome: "P-09 25 - Rua 05 / Com a Av. Central - Colégio Estadual General Curado", semana: "05:25", sabado: "06:34" },
      { lat: -16.404267, lng: -48.904626, nome: "P-09 26 - R. 5 / Com a Rua 12", semana: "05:26", sabado: "06:35" },
      { lat: -16.401365, lng: -48.903972, nome: "P-09 27 - R. 9 / ( Supermercado Super Jota )", semana: "05:27", sabado: "06:36" },
      { lat: -16.396677, lng: -48.903070, nome: "P-09 28 - R. das Laranjeiras / Portaria 70 Caoa", semana: "05:29", sabado: "06:38" },
      { lat: -16.394733, lng: -48.900626, nome: "P-09 29 - R. Ipê Amarelo / Esquina com a Rua Babaçu", semana: "05:30", sabado: "06:39" },
      { lat: -16.396308, lng: -48.900690, nome: "P-09 30 - Ac. Aroeira / Esquina com a Rua Jerivá", semana: "05:31", sabado: "06:40" },
      { lat: -16.396705, lng: -48.900067, nome: "P-09 31 - R. Jerivá / Esquina com a Rua Batatais", semana: "05:31", sabado: "06:40" },
      { lat: -16.397351, lng: -48.899382, nome: "P-09 32 - R. dos Eucaliptos / Esquina com a Rua Araucária", semana: "05:32", sabado: "06:41" },
      { lat: -16.398832, lng: -48.899811, nome: "P-09 33 - R. das Amoras / Esquina com a Rua Jacarandá", semana: "05:33", sabado: "06:42" },
      { lat: -16.399277, lng: -48.903627, nome: "P-09 34 - R. Manga Rosa / Esquina com a Av. Araticum", semana: "05:34", sabado: "06:43" },
      { lat: -16.402062, lng: -48.907424, nome: "P-09 35 - R. 11 / Portaria 60 CAOA", semana: "05:35", sabado: "06:44" },
      { lat: -16.407101, lng: -48.918927, nome: "P-09 36 - Distrito Agroindustrial de Anápolis", semana: "05:39", sabado: "06:48" },
    ],
    "P-10": [
      { lat: -16.351145, lng: -48.975232, nome: "P-10 01 - Av. Pedro Ludovico / BARATÃO DA CONSTRUÇÃO", semana: "05:14", sabado: "06:19" },
      { lat: -16.356284, lng: -48.978053, nome: "P-10 02 - Av. Pedro Ludovico / Com a Rua dos Prefeitos", semana: "05:16", sabado: "06:21" },
      { lat: -16.359320, lng: -48.980080, nome: "P-10 03 - Av. Pedro Ludovico / Esquina com a Rua Paraguaçú", semana: "05:16", sabado: "06:21" },
      { lat: -16.363107, lng: -48.983328, nome: "P-10 04 - Av. Pedro Ludovico / Posto Ipiranga", semana: "05:17", sabado: "06:22" },
      { lat: -16.370601, lng: -48.982060, nome: "P-10 05 - Av. Pedro Ludovico / Esquina com a Av. dos Buritis", semana: "05:18", sabado: "06:23" },
      { lat: -16.372891, lng: -48.980412, nome: "P-10 06 - Av. Pedro Ludovico / IFG", semana: "05:19", sabado: "06:24" },
      { lat: -16.375875, lng: -48.978349, nome: "P-10 07 - Av. Pedro Ludovico / Auto Posto Reny Cury", semana: "05:19", sabado: "06:24" },
      { lat: -16.379443, lng: -48.976816, nome: "P-10 08 - Av. Pedro Ludovico / Com Rua Sonia Oliveira Parreira", semana: "05:20", sabado: "06:25" },
      { lat: -16.382518, lng: -48.977038, nome: "P-10 09 - Av. Pedro Ludovico / Com a Rua Inezia Conceição Braga ( Parada Coletivo )", semana: "05:21", sabado: "06:26" },
      { lat: -16.388729, lng: -48.978499, nome: "P-10 10 - Av. Pedro Ludovico / Com a Rua Alberico Nogueira Terra", semana: "05:22", sabado: "06:27" },
      { lat: -16.392455, lng: -48.979329, nome: "P-10 11 - Av. Pedro Ludovico / Esquina com a Rua Viana G Lobo", semana: "05:22", sabado: "06:27" },
      { lat: -16.394430, lng: -48.979039, nome: "P-10 12 - Av. Pedro Ludovico / Com a Rua Anapolis", semana: "05:23", sabado: "06:28" },
      { lat: -16.396468, lng: -48.978711, nome: "P-10 13 - Av. Pedro Ludovico / Com Rua Luziania", semana: "05:23", sabado: "06:28" },
      { lat: -16.400198, lng: -48.978104, nome: "P-10 14 - Av. Pedro Ludovico / Esquina com a R. Ceres", semana: "05:24", sabado: "06:29" },
      { lat: -16.402149, lng: -48.978100, nome: "P-10 15 - Av. Pedro Ludovico / Posto Calixtópolis", semana: "05:24", sabado: "06:29" },
      { lat: -16.417570, lng: -48.977780, nome: "P-10 16 - R. Santa Amélia / Esquina com a Rua Santa Genovena", semana: "05:29", sabado: "06:34" },
      { lat: -16.415525, lng: -48.979186, nome: "P-10 17 - R. Eduardo Marçal / Com a Rua João Batista F. Mendonça", semana: "05:30", sabado: "06:35" },
      { lat: -16.412740, lng: -48.977403, nome: "P-10 18 - Av. RT A / Com a Av. RT A ( Praça )", semana: "05:32", sabado: "06:37" },
      { lat: -16.407019, lng: -48.917747, nome: "P-10 19 - Distrito Agroindustrial de Anápolis", semana: "05:45", sabado: "06:51" },
    ],
  };

  // Available turnos (shifts)
  const turnos = [
    { id: "1", nome: "1° Turno" },
  ];

  // Available routes
  const rotas = [
    { id: "P-01", nome: "P-01" },
    { id: "P-02", nome: "P-02" },
    { id: "P-03", nome: "P-03" },
    { id: "P-04", nome: "P-04" },
    { id: "P-05", nome: "P-05" },
    { id: "P-06", nome: "P-06" },
    { id: "P-07", nome: "P-07" },
    { id: "P-08", nome: "P-08" },
    { id: "P-09", nome: "P-09" },
    { id: "P-10", nome: "P-10" },
  ];

  // Function to load Google Maps API
  const loadGoogleMapsAPI = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  // Function to initialize the map
  const initializeMap = () => {
    if (!mapRef.current) return;

    // Create the map instance
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -16.328000, lng: -48.953000 },
      zoom: 12,
      mapTypeId: 'roadmap',
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // Create info window once (will be reused)
    infoWindowRef.current = new google.maps.InfoWindow();

    // Initialize search box
    const input = document.getElementById("map-search-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    searchBoxRef.current = searchBox;

    // Bias search results to current map viewport
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    // Listen for search box selection
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places && places.length === 0) return;

      // For each place, get location and center map
      const bounds = new google.maps.LatLngBounds();
      places?.forEach((place) => {
        if (!place.geometry || !place.geometry.location) return;

        // Create a marker for the search result
        new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    // Display markers for the selected route
    displayRouteMarkers();
    setMapLoaded(true);
  };

  // Function to display markers for the selected route
  const displayRouteMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    }

    // Get stops for the selected route
    const stops = busStopsByRoute[selectedRota] || [];
    if (stops.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    const markers: google.maps.Marker[] = [];

    // Custom SVG bus stop icon
    const busStopIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + 
           encodeURIComponent(`
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="12" cy="12" r="10" fill="#1e40af"/>
               <rect x="8" y="8" width="8" height="8" fill="#ffffff" rx="1"/>
               <line x1="9" y1="12" x2="15" y2="12" stroke="#1e40af" stroke-width="2"/>
               <line x1="12" y1="9" x2="12" y2="15" stroke="#1e40af" stroke-width="2"/>
             </svg>
           `),
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18),
    };

    // Create markers for each stop
    stops.forEach((stop, index) => {
      const marker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: mapInstanceRef.current,
        title: stop.nome,
        icon: busStopIcon,
        animation: google.maps.Animation.DROP,
        zIndex: 10,
      });

      // Create info window content
      const contentString = `
        <div class="p-2 max-w-xs">
          <p class="font-bold text-blue-800 mb-1">${stop.nome}</p>
          <div class="text-sm mt-1">
            <p class="text-blue-700"><strong>Horário dia de semana:</strong> ${stop.semana}</p>
            <p class="text-blue-700"><strong>Horário sábado:</strong> ${stop.sabado}</p>
          </div>
        </div>
      `;

      // Add click listener to show info window
      marker.addListener("click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open({
            map: mapInstanceRef.current,
            anchor: marker,
          });
        }
      });

      markers.push(marker);
      bounds.extend(marker.getPosition() as google.maps.LatLng);
    });

    // Store markers reference for later cleanup
    markersRef.current = markers;

    // Fit map to show all markers with some padding
    mapInstanceRef.current.fitBounds(bounds, 50);
    
    // If there's only one marker, zoom out a bit
    if (stops.length === 1) {
      mapInstanceRef.current.setZoom(15);
    }
  }, [selectedRota]);

  // Function to handle turno selection change
  const handleTurnoChange = (value: string) => {
    setSelectedTurno(value);
  };

  // Function to handle route selection change
  const handleRotaChange = (value: string) => {
    setSelectedRota(value);
    if (mapLoaded) {
      displayRouteMarkers();
    }
  };

  // Function to handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // SearchBox will automatically handle the search via the places_changed event
  };

  // Load Google Maps API on component mount
  useEffect(() => {
    loadGoogleMapsAPI();
    
    // Cleanup function
    return () => {
      if (markersRef.current) {
        markersRef.current.forEach((marker) => marker.setMap(null));
      }
    };
  }, []);

  // Update markers when selected route changes
  useEffect(() => {
    if (mapLoaded) {
      displayRouteMarkers();
    }
  }, [selectedRota, mapLoaded, displayRouteMarkers]);

  return (
    <div className="container py-6 mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-bold text-blue-800">
            Mapa de Rotas de Transporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Tabs defaultValue="mapa" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mapa">Mapa</TabsTrigger>
                <TabsTrigger value="controles">Controles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mapa" className="h-[70vh] sm:h-[80vh] relative">
                <div ref={mapRef} className="w-full h-full rounded-md overflow-hidden border border-gray-200" />
                
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Carregando mapa...</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="controles">
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Turno
                      </label>
                      <Select
                        value={selectedTurno}
                        onValueChange={handleTurnoChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                        <SelectContent>
                          {turnos.map((turno) => (
                            <SelectItem key={turno.id} value={turno.id}>
                              {turno.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rota
                      </label>
                      <Select
                        value={selectedRota}
                        onValueChange={handleRotaChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a rota" />
                        </SelectTrigger>
                        <SelectContent>
                          {rotas.map((rota) => (
                            <SelectItem key={rota.id} value={rota.id}>
                              {rota.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buscar endereço
                    </label>
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="map-search-input"
                          className="pl-10"
                          placeholder="Digite um endereço para buscar"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button type="submit">Buscar</Button>
                    </form>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Informações da Rota {selectedRota}
                    </h3>
                    <div className="text-sm space-y-1 text-blue-700">
                      <p><strong>Total de paradas:</strong> {busStopsByRoute[selectedRota]?.length || 0}</p>
                      <p><strong>Primeira parada:</strong> {busStopsByRoute[selectedRota]?.[0]?.nome || "N/A"}</p>
                      <p><strong>Horário primeira parada (semana):</strong> {busStopsByRoute[selectedRota]?.[0]?.semana || "N/A"}</p>
                      <p><strong>Horário primeira parada (sábado):</strong> {busStopsByRoute[selectedRota]?.[0]?.sabado || "N/A"}</p>
                      <p><strong>Última parada:</strong> {busStopsByRoute[selectedRota]?.[busStopsByRoute[selectedRota]?.length - 1]?.nome || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Legenda</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white"></div>
                      </div>
                      <span className="text-gray-700">Parada de ônibus</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaRotas;
