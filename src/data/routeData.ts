
import { RouteData, TurnoRouteData } from "@/types/mapTypes";
import { routeDataP5toP10 } from "./routeData-p5-p10";
import { routeDataP11toP15 } from "./routeData-p11-p15";

// First shift (1° Turno) routes P-01 to P-04 data
const primeiroTurnoRoutesP1toP4: RouteData = {
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
};

// Combine all route data for 1° Turno
const primeiroTurnoRoutes = {
  ...primeiroTurnoRoutesP1toP4,
  ...routeDataP5toP10,
  ...routeDataP11toP15
};

// 2° Turno routes data
const segundoTurnoRoutes: RouteData = {
  "S-01": [
    { lat: -16.260024, lng: -49.005162, nome: "S-01 01 - R. Jequitiba / Esquina com a R. Corumba", bairro: "Residencial Aldeia dos Sonhos", semana: "13:06", sabado: "09:46" },
    { lat: -16.258635, lng: -49.002169, nome: "S-01 02 - R. Araguaia / Esquina com a R. Burburimao", bairro: "Residencial Aldeia dos Sonhos", semana: "13:09", sabado: "09:49" },
    { lat: -16.260174, lng: -48.999195, nome: "S-01 03 - Av. Araguaia / Esquina com a R. Guatambu", bairro: "Residencial Aldeia dos Sonhos", semana: "13:10", sabado: "09:50" },
    { lat: -16.261290, lng: -48.997326, nome: "S-01 04 - R. Araguaia / Esquina com a Rua Cedro", bairro: "Residencial Aldeia dos Sonhos", semana: "13:10", sabado: "09:50" },
    { lat: -16.261720, lng: -48.988930, nome: "S-01 05 - Av. Federal / Esquina com a Canela Branca", bairro: "Lot. Guanabara", semana: "13:12", sabado: "09:52" },
    { lat: -16.265385, lng: -48.983576, nome: "S-01 06 - Av. Federal / Esquina com a Rua 4", bairro: "Lot. Guanabara", semana: "13:13", sabado: "09:53" },
    { lat: -16.268626, lng: -48.979451, nome: "S-01 07 - R. Constelação / Esquina com a Rua Netuno", bairro: "Res. Ana Caroline", semana: "13:14", sabado: "09:54" },
    { lat: -16.270583, lng: -48.984287, nome: "S-01 08 - R. Tres Marias / Esquina com a Estr. p/ Miranápolis", bairro: "Res. Ana Caroline", semana: "13:16", sabado: "09:56" },
    { lat: -16.274640, lng: -48.985030, nome: "S-01 09 - Av. Mariele / Com a Rua Abadia", bairro: "Adriana Parque", semana: "13:17", sabado: "09:57" },
    { lat: -16.277620, lng: -48.985240, nome: "S-01 10 - R. G / Supermercado do Povo", bairro: "Adriana Parque", semana: "13:19", sabado: "09:59" },
    { lat: -16.277642, lng: -48.987533, nome: "S-01 11 - R. G / Esquina com a Rua Lilian", bairro: "St. Res. Jandaia", semana: "13:19", sabado: "09:59" },
    { lat: -16.277660, lng: -48.989450, nome: "S-01 12 - R. G / Esquina com a Av. Central", bairro: "St. Res. Jandaia", semana: "13:20", sabado: "10:00" },
    { lat: -16.277680, lng: -48.992920, nome: "S-01 13 - R. Larissa / Com a Rua Takeda", bairro: "St. Escala", semana: "13:21", sabado: "10:01" },
    { lat: -16.277346, lng: -48.995985, nome: "S-01 14 - Av. das Laranjeiras / Esquina com a Rua 4", bairro: "Res. Dom Felipe", semana: "13:22", sabado: "10:02" },
    { lat: -16.274922, lng: -48.996629, nome: "S-01 15 - R. Ole / Esquina com a Rua 07", bairro: "Res. Dom Felipe", semana: "13:24", sabado: "10:04" }
  ],
  "S-09": [
    { lat: -16.350830, lng: -48.956740, nome: "S-09 01 - R. Bela Vista / Farmácia Evangélica", bairro: "Jardim Goncalves", semana: "13:10", sabado: "09:50" },
    { lat: -16.350490, lng: -48.954460, nome: "S-09 02 - Ac. Bela Vista / Esquina com a Rua 1", bairro: "Jardim Goncalves", semana: "13:12", sabado: "09:52" },
    { lat: -16.351860, lng: -48.952250, nome: "S-09 03 - R. 4 / Colégio Estadual Durval Nunes Da Mata", bairro: "Vila Joao Luiz de Oliveira", semana: "13:13", sabado: "09:53" },
    { lat: -16.356540, lng: -48.953450, nome: "S-09 04 - R. 1 / Esquina com a Rua 9", bairro: "Batista", semana: "13:16", sabado: "09:56" },
    { lat: -16.358190, lng: -48.952670, nome: "S-09 05 - R. Construtor José Francisco / Esquina com a R. Construtor José Francisco", bairro: "Jardim Bom Clima", semana: "13:16", sabado: "09:56" },
    { lat: -16.359410, lng: -48.955800, nome: "S-09 06 - R. Construtor José Francisco / Esquina com a R. Maria Melo", bairro: "Jardim Bom Clima", semana: "13:19", sabado: "09:59" },
    { lat: -16.363470, lng: -48.956110, nome: "S-09 07 - Av. Contôrno / Residencial Première Bela Vista", bairro: "Jardim Arco Verde", semana: "13:22", sabado: "10:02" },
    { lat: -16.355160, lng: -48.957410, nome: "S-09 08 - Av. Jorge G De Almeida / Esquina com a Av. Jorge Guimarães de Almeida", bairro: "Santo André", semana: "13:26", sabado: "10:06" },
    { lat: -16.344680, lng: -48.967480, nome: "S-09 09 - Av. Pres. José Sarney / Posto Sol II", bairro: "St. Sul Jamil Miguel", semana: "13:31", sabado: "10:11" },
    { lat: -16.343880, lng: -48.970510, nome: "S-09 10 - R. 9 / Esquina com a Rua 9", bairro: "Vila Sao Joaquim", semana: "13:34", sabado: "10:14" },
    { lat: -16.349030, lng: -48.973810, nome: "S-09 11 - Av. Pedro Ludovico / Esquina com a R. Deocleciano Moreira Alves", bairro: "Vila Sao Joaquim", semana: "13:36", sabado: "10:16" },
    { lat: -16.353800, lng: -48.976670, nome: "S-09 12 - R. Santa Aparecida / Esquina com a R. Santa Aparecida", bairro: "Jardim Calixto", semana: "13:38", sabado: "10:18" },
    { lat: -16.356570, lng: -48.978250, nome: "S-09 13 - R. dos Prefeitos / Com a Rua dos Prefeitos", bairro: "Jibran El Hadj", semana: "13:38", sabado: "10:18" },
    { lat: -16.359320, lng: -48.980080, nome: "S-09 14 - Av. Pedro Ludovico / Esquina com a R. Paraguaçú", bairro: "Paraíso", semana: "13:40", sabado: "10:20" },
    { lat: -16.363310, lng: -48.983520, nome: "S-09 15 - Estrada sem nome / Posto Ipiranga", bairro: "Jibran El Hadj", semana: "13:41", sabado: "10:21" },
    { lat: -16.369750, lng: -48.982630, nome: "S-09 16 - Acampament Pedro Ludovico / Esquina com a Av. dos Burtitis", bairro: "Jibran El Hadj", semana: "13:43", sabado: "10:23" },
    { lat: -16.373940, lng: -48.979660, nome: "S-09 17 - R. RC 4 / IFG", bairro: "Residencial Reny Cury", semana: "13:44", sabado: "10:24" },
    { lat: -16.376030, lng: -48.978200, nome: "S-09 18 - R. Gílson J. L. Teixeira Balbi / Auto Posto Reny Cury", bairro: "Viviam Parque", semana: "13:45", sabado: "10:25" },
    { lat: -16.382860, lng: -48.977100, nome: "S-09 19 - R. Inézia Conceição Braga / Com a Inezia Conceição Braga", bairro: "Viviam Parque", semana: "13:46", sabado: "10:26" },
    { lat: -16.389740, lng: -48.978710, nome: "S-09 20 - R. Henriqueta T. Bitencourt / Com a Rua Alberico Nogueira Terra", bairro: "Conj. Hab. Esperanca II", semana: "13:49", sabado: "10:29" },
    { lat: -16.390830, lng: -48.978960, nome: "S-09 21 - Acampament Pedro Ludovico / Com a Rua Associação Imobiliaria", bairro: "Viviam Parque", semana: "13:49", sabado: "10:29" },
    { lat: -16.394690, lng: -48.978980, nome: "S-09 22 - Av. Pedro Ludovico / Com a Rua Anapolis", bairro: "Vivian Parque", semana: "13:51", sabado: "10:31" },
    { lat: -16.400220, lng: -48.978100, nome: "S-09 23 - Av. Pedro Ludovico / Com a Rua Ceres", bairro: "Parque Calixtopolis", semana: "13:51", sabado: "10:31" },
    { lat: -16.415680, lng: -48.980160, nome: "S-09 24 - Estr. p/ Igrejinha / Esquina com a Av. São Francisco de Paula e Silva", bairro: "Vila São Vicente", semana: "13:56", sabado: "10:36" },
    { lat: -16.417770, lng: -48.978280, nome: "S-09 25 - R. Santa Amélia / Com a R. Santa Genoveva", bairro: "Vila São Vicente", semana: "13:59", sabado: "10:39" },
    { lat: -16.416580, lng: -48.978200, nome: "S-09 26 - R. Francisco Melo Moura / Com a Rua João Batista F. Mendonça", bairro: "Vila São Vicente", semana: "14:00", sabado: "10:40" },
    { lat: -16.412790, lng: -48.976910, nome: "S-09 27 - Av. Rt A / Esquina com a R. RT 2", bairro: "Res. do Trab.", semana: "14:04", sabado: "10:44" },
    { lat: -16.407150, lng: -48.919910, nome: "S-09 28 - GO / Laboratório Teuto", bairro: "Distrito Agro", semana: "14:15", sabado: "10:55" }
  ],
  "S-10": [
    { lat: -16.353350, lng: -48.977470, nome: "S-10 01 - R. Santa Aparecida / Esquina com a Rua Isaíra", bairro: "Jardim Calixto", semana: "13:34", sabado: "10:14" },
    { lat: -16.353951, lng: -48.979908, nome: "S-10 02 - Av. Cachoeira Dourada / Academia Biofitness", bairro: "Novo Paraíso", semana: "13:35", sabado: "10:15" },
    { lat: -16.356220, lng: -48.981700, nome: "S-10 03 - Av. Cachoeira Dourada / Mercadinho Paraíso", bairro: "Novo Paraíso", semana: "13:36", sabado: "10:16" },
    { lat: -16.358850, lng: -48.983790, nome: "S-10 04 - Av. Cachoeira Dourada / Capela Nossa Senhora Rosa Mística e Divino Pai Eterno", bairro: "Novo Paraíso", semana: "13:37", sabado: "10:17" },
    { lat: -16.361170, lng: -48.985560, nome: "S-10 05 - Av. Morumbi / Esquina com a Oriente", bairro: "Vila Mariana", semana: "13:37", sabado: "10:17" },
    { lat: -16.363110, lng: -48.987040, nome: "S-10 06 - Av. Morumbi / Com a Rua Dona Barbara", bairro: "Vila Mariana", semana: "13:38", sabado: "10:18" },
    { lat: -16.365750, lng: -48.988500, nome: "S-10 07 - Acampament Ipiranga / Com a Trav. Alburquerque", bairro: "Vila Mariana", semana: "13:39", sabado: "10:19" },
    { lat: -16.368900, lng: -48.988820, nome: "S-10 08 - R. 8 / Com a Rua 13", bairro: "Conj. Hab. Vila Uniao", semana: "13:40", sabado: "10:20" },
    { lat: -16.369240, lng: -48.987420, nome: "S-10 09 - R. 13 / Com a Rua 5", bairro: "Conj. Hab. Vila Uni", semana: "13:40", sabado: "10:20" },
    { lat: -16.372780, lng: -48.987730, nome: "S-10 10 - R. 4 / Esquina com a TV. 6", bairro: "Conj. Hab. Vila Uniao", semana: "13:42", sabado: "10:22" },
    { lat: -16.375031, lng: -48.987998, nome: "S-10 11 - Av. Lídia Sousa Fernandes / Com a Rua Copa 6", bairro: "Conj. Hab. Vila Uniao", semana: "13:43", sabado: "10:23" },
    { lat: -16.377656, lng: -48.987239, nome: "S-10 12 - R. Copa 9 / Com a Rua Copa 11", bairro: "Residencial Copacabana", semana: "13:44", sabado: "10:24" },
    { lat: -16.377120, lng: -48.985896, nome: "S-10 13 - R. Copa 12 / Com a Rua Copa 6", bairro: "Residencial Copacabana", semana: "13:46", sabado: "10:26" },
    { lat: -16.378041, lng: -48.986792, nome: "S-10 14 - R. Copa 9 / Com a Rua Copa 12", bairro: "Residencial Copacabana", semana: "13:46", sabado: "10:26" },
    { lat: -16.379252, lng: -48.988003, nome: "S-10 15 - R. Copa 12 / Com a Rua Copa 14", bairro: "Residencial Copacabana", semana: "13:47", sabado: "10:27" },
    { lat: -16.380810, lng: -48.986150, nome: "S-10 16 - R. Copa 24 / Esquina com a Rua Copa 15", bairro: "Residencial Copacabana", semana: "13:48", sabado: "10:28" },
    { lat: -16.377380, lng: -48.982618, nome: "S-10 17 - R. Copa 23 / Esquina com a Rua Copa 24", bairro: "Residencial Copacabana", semana: "13:50", sabado: "10:30" },
    { lat: -16.376703, lng: -48.981563, nome: "S-10 18 - R. Copa 24 / Esquina com a R. RC 11", bairro: "Residencial Reny Cury", semana: "13:50", sabado: "10:30" },
    { lat: -16.379068, lng: -48.979344, nome: "S-10 19 - R. Gílson Júnior / Paróquia Sagrado Coração De Jesus", bairro: "Viviam Parque", semana: "13:52", sabado: "10:32" },
    { lat: -16.384842, lng: -48.980908, nome: "S-10 20 - R. Itá Gontijo Braga / Esquina com a R. Odilia Ferreira Borges", bairro: "Viviam Parque", semana: "13:55", sabado: "10:35" },
    { lat: -16.388584, lng: -48.980542, nome: "S-10 21 - R. Henrique Bitencourt / Esquina com a R. Albérico Nogueira Terra", bairro: "Viviam Parque", semana: "13:56", sabado: "10:36" },
    { lat: -16.395223, lng: -48.982406, nome: "S-10 22 - R. Uruaçu / Esquina coma R. dos Calixtos", bairro: "Parque Calixtopolis", semana: "13:58", sabado: "10:38" },
    { lat: -16.397050, lng: -48.982180, nome: "S-10 23 - R. Uruaçu / Esquina com a R. Luziania", bairro: "Parque Calixtopolis", semana: "13:59", sabado: "10:39" },
    { lat: -16.407140, lng: -48.919730, nome: "S-10 24 - Viela Vp / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "14:12", sabado: "10:52" }
  ],
  "S-11": [
    { lat: -16.330820, lng: -48.947660, nome: "S-11 01 - Av. Minas Gerais / Esquina com a R. Pedro Braz de Queirós", bairro: "Jundiaí", semana: "13:01", sabado: "09:41" },
    { lat: -16.338070, lng: -48.943977, nome: "S-11 02 - GO-330 / Unidade de Saúde Jundiaí", bairro: "Jundiaí", semana: "13:06", sabado: "09:46" },
    { lat: -16.341630, lng: -48.948310, nome: "S-11 03 - Av. Pres. Wilson / Esquina com a Rua 8", bairro: "Vila Industrial", semana: "13:09", sabado: "09:49" },
    { lat: -16.344467, lng: -48.945911, nome: "S-11 04 - Av. Sebastião Pedro Junqueira / Esquina com a Rua 10", bairro: "Vila Industrial", semana: "13:11", sabado: "09:51" },
    { lat: -16.348300, lng: -48.944280, nome: "S-11 05 - Av. Anderson Clayton / Esquina com a Rua 3", bairro: "Eldorado", semana: "13:12", sabado: "09:52" },
    { lat: -16.353279, lng: -48.942194, nome: "S-11 06 - Av. Anderson Clayton / Esquina com a Rua 8A", bairro: "Eldorado", semana: "13:14", sabado: "09:54" },
    { lat: -16.354020, lng: -48.941890, nome: "S-11 07 - R. 09 / Esquina com a Rua 09", bairro: "Vila Formosa", semana: "13:14", sabado: "09:54" },
    { lat: -16.353601, lng: -48.940830, nome: "S-11 08 - Ac. Frei Joao Batista Voguel / Supermercado Bom Preço", bairro: "Vila Formosa", semana: "13:16", sabado: "09:56" },
    { lat: -16.352420, lng: -48.931850, nome: "S-11 09 - R. Goiânia / Esquina com a Rua Goiânia", bairro: "Jardim Eldorado", semana: "13:19", sabado: "09:59" },
    { lat: -16.376800, lng: -48.906390, nome: "S-11 10 - Estrada sem nome / Residencial Boa Esperança", bairro: "Residencial Boa Esperança", semana: "13:27", sabado: "10:07" },
    { lat: -16.363030, lng: -48.914730, nome: "S-11 11 - Av. Pres. Vargas / Esquina com a R. Padre Antônio Feijó", bairro: "Jardim Alvorada", semana: "13:32", sabado: "10:12" },
    { lat: -16.360380, lng: -48.913850, nome: "S-11 12 - Praça Tiradentes / Capela Nossa Senhora Das Graças", bairro: "Campos Elísios", semana: "13:34", sabado: "10:14" },
    { lat: -16.359680, lng: -48.911590, nome: "S-11 13 - R. L 35 / Esquina com a R. Goncalves Ledo", bairro: "Res. Leblon", semana: "13:36", sabado: "10:16" },
    { lat: -16.359460, lng: -48.906760, nome: "S-11 14 - Av. Central / Esquina com a R. L16", bairro: "Jardim Alvorada", semana: "13:38", sabado: "10:18" },
    { lat: -16.360370, lng: -48.904570, nome: "S-11 15 - Av. Ilha Formosa / Esquina com a R. L23", bairro: "Jardim Alvorada", semana: "13:39", sabado: "10:19" },
    { lat: -16.358690, lng: -48.905050, nome: "S-11 16 - R. L 3 / Esquina com a Rua L-20", bairro: "Res. Leblon", semana: "13:41", sabado: "10:21" },
    { lat: -16.357500, lng: -48.907620, nome: "S-11 17 - Ac. 8 / Esquina com a Rua L 8", bairro: "Res. Leblon", semana: "13:42", sabado: "10:22" },
    { lat: -16.356350, lng: -48.912240, nome: "S-11 18 - R. Bernardo Sayão / Esquina com a Av. Hong Kong", bairro: "Jardim Alvorada", semana: "13:46", sabado: "10:26" },
    { lat: -16.354350, lng: -48.912460, nome: "S-11 19 - R. Bernardo Sayão / Com a Av. Cruzeiro do Sul", bairro: "Jardim Alvorada", semana: "13:46", sabado: "10:26" },
    { lat: -16.353800, lng: -48.910470, nome: "S-11 20 - R. Cruzeiro do Sul / Esquina com a Av. Paranoá", bairro: "Jardim Alvorada", semana: "13:48", sabado: "10:28" },
    { lat: -16.354660, lng: -48.907440, nome: "S-11 21 - Av. Rio Araguaia / Esquina com a Av. Rio Araguaia", bairro: "Vila Operaria", semana: "13:49", sabado: "10:29" },
    { lat: -16.353130, lng: -48.904750, nome: "S-11 22 - R. Ventura / Esquina com a R. Dos Astros", bairro: "Jardim Tesouro", semana: "13:51", sabado: "10:31" },
    { lat: -16.347620, lng: -48.903660, nome: "S-11 23 - R. D / Noronha Esporte Clube", bairro: "Santo Antonio", semana: "13:52", sabado: "10:32" },
    { lat: -16.344710, lng: -48.899970, nome: "S-11 24 - R. D / Esquina com a Av. Elias Isaac", bairro: "Santo Antonio", semana: "13:54", sabado: "10:34" },
    { lat: -16.341310, lng: -48.897940, nome: "S-11 25 - R. Padre Henrique / Academia JS FITNESS", bairro: "Santo Antonio", semana: "13:55", sabado: "10:35" },
    { lat: -16.341110, lng: -48.897080, nome: "S-11 26 - Chacara Dom Fernando Gomes / Esquina com a R. Zaqueu Crispim", bairro: "Santo Antonio", semana: "13:57", sabado: "10:37" },
    { lat: -16.343130, lng: -48.908740, nome: "S-11 27 - Av. Gomes de Souza Ramos / Esquina com a R. Comandatuba", bairro: "Jardim Flor de Liz", semana: "14:02", sabado: "10:42" },
    { lat: -16.343990, lng: -48.904870, nome: "S-11 28 - R. das Laranjeiras / Praça de Boas Vindas Summerville", bairro: "Jardim Ibirapuera", semana: "14:04", sabado: "10:44" },
    { lat: -16.352710, lng: -48.919310, nome: "S-11 29 - R. Sessenta / Pérola Distribuição", bairro: "Jóquei Club", semana: "14:06", sabado: "10:46" },
    { lat: -16.407148, lng: -48.919844, nome: "S-11 30 - VP 7 / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "14:22", sabado: "11:02" }
  ]
};

// 3° Turno routes data
const terceiroTurnoRoutes: RouteData = {
  "T-01": [
    { lat: -16.322390, lng: -48.952480, nome: "T-01 01 - Av. Brasil / Rua Engenheiro Portela", bairro: "St. Central", semana: "21:00", sabado: "18:00" },
    { lat: -16.320810, lng: -48.952580, nome: "T-01 02 - Av. Senador José Lourenço Dias / Supermercado Beretta", bairro: "St. Central", semana: "21:01", sabado: "18:01" },
    { lat: -16.314710, lng: -48.953090, nome: "T-01 03 - Av. Brasil / Rua João Gomes (Padaria Triunfo)", bairro: "St. Central", semana: "21:05", sabado: "18:05" },
    { lat: -16.308900, lng: -48.953560, nome: "T-01 04 - Praça Dom Emanuel / Escola José Ludovico", bairro: "Cidade Jardim", semana: "21:08", sabado: "18:08" },
    { lat: -16.303040, lng: -48.953860, nome: "T-01 05 - Av. Universitária / Terminal Urbano Universitário", bairro: "Maracanã", semana: "21:10", sabado: "18:10" },
    { lat: -16.407148, lng: -48.919844, nome: "T-01 06 - VP 7 / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "21:50", sabado: "18:50" }
  ]
};

// Administrative routes data
const administrativoRoutes: RouteData = {
  "A-01": [
    { lat: -16.336560, lng: -48.948820, nome: "A-01 01 - Av. Brasil / Escritório Central", bairro: "St. Central", semana: "07:00", sabado: "07:00" },
    { lat: -16.312240, lng: -48.953430, nome: "A-01 02 - Av. Brasil / Unidade I", bairro: "Cidade Jardim", semana: "07:10", sabado: "07:10" },
    { lat: -16.407148, lng: -48.919844, nome: "A-01 03 - VP 7 / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "07:30", sabado: "07:30" }
  ]
};

// Export routes organized by shifts
export const allRouteData: TurnoRouteData = {
  "1° Turno": primeiroTurnoRoutes,
  "2° Turno": segundoTurnoRoutes,
  "3° Turno": terceiroTurnoRoutes,
  "Administrativo": administrativoRoutes
};

// Function to get available shifts
export const getAvailableTurnos = () => {
  return Object.keys(allRouteData);
};

// Function to get available routes for a specific shift
export const getAvailableRoutes = (turno: string) => {
  const turnoData = allRouteData[turno];
  return turnoData ? Object.keys(turnoData) : [];
};

