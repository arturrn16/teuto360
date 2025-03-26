
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

// 2° Turno routes S-01 to S-05 with actual data
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
    { lat: -16.274922, lng: -48.996629, nome: "S-01 15 - R. Oito / Esquina com a Av. das Palmeiras", bairro: "Res. Dom Felipe", semana: "13:23", sabado: "10:03" },
    { lat: -16.281400, lng: -48.992150, nome: "S-01 16 - Av. Souzânia / Esquina com a Rua Fontinelle Junior", bairro: "St. Res. Jandaia", semana: "13:25", sabado: "10:05" },
    { lat: -16.282830, lng: -48.989390, nome: "S-01 17 - Av. Souzânia /Esquina com a Av. Central", bairro: "St. Res. Jandaia", semana: "13:26", sabado: "10:06" },
    { lat: -16.283890, lng: -48.984780, nome: "S-01 18 - R. Jk / Esquina com a Rua JK 3", bairro: "Res. Vila Nova", semana: "13:28", sabado: "10:08" },
    { lat: -16.286241, lng: -48.983658, nome: "S-01 19 - Rua Mun. / Esquina com a Rua Ipameri", bairro: "Vila Jaiara St. Norte", semana: "13:28", sabado: "10:08" },
    { lat: -16.288997, lng: -48.977777, nome: "S-01 20 - R. Paranaguá / Esquina com a R. Ipê", bairro: "Res. Monica Braga", semana: "13:31", sabado: "10:11" },
    { lat: -16.291050, lng: -48.973230, nome: "S-01 21 - R. Silvânia / Paróquia Nossa Senhora de Fátima", bairro: "Vila Jaiara St. Norte", semana: "13:33", sabado: "10:13" },
    { lat: -16.291161, lng: -48.968349, nome: "S-01 22 - Av. Fernando Costa / Farmácias Nissei", bairro: "Adriana Parque", semana: "13:35", sabado: "10:15" },
    { lat: -16.282872, lng: -48.972264, nome: "S-01 23 - Av. Fernando Costa / Esquina com a Rua Formosa", bairro: "Vila Jaiara", semana: "13:37", sabado: "10:17" },
    { lat: -16.407150, lng: -48.919910, nome: "S-01 24 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "14:04", sabado: "10:44" },
  ],
  "S-02": [
    { lat: -16.291680, lng: -48.964560, nome: "S-02 01 - R. Mal. Gouveia / Com a Rua Sussuapara", bairro: "Vila Jaiara St. Sul", semana: "13:10", sabado: "09:50" },
    { lat: -16.287350, lng: -48.965970, nome: "S-02 02 - Av. Estados Unidos / Esquina com a Rua Jaragua", bairro: "Bandeiras", semana: "13:11", sabado: "09:51" },
    { lat: -16.282906, lng: -48.966676, nome: "S-02 03 - Av. Estados Unidos / Com a Rua Marta Irene", bairro: "Bandeiras", semana: "13:13", sabado: "09:53" },
    { lat: -16.280339, lng: -48.966984, nome: "S-02 04 - Av. Estados Unidos  / Esquina com a R. Jonas Duarte", bairro: "Bandeiras", semana: "13:14", sabado: "09:54" },
    { lat: -16.277740, lng: -48.969930, nome: "S-02 05 - R. Assis Brasil / Esquina com a Rua Niquelandia", bairro: "Vila Jaiara St. Norte", semana: "13:17", sabado: "09:57" },
    { lat: -16.276920, lng: -48.971910, nome: "S-02 06 - Av. Luís Carpaneda / Esquina com a Rua G", bairro: "Vila Jaiara St. Norte", semana: "13:18", sabado: "09:58" },
    { lat: -16.279830, lng: -48.973430, nome: "S-02 07 - Av. Luís Carpaneda / Posto Napolitano II & Loja de Conveniência", bairro: "Vila Jaiara St. Norte", semana: "13:20", sabado: "10:00" },
    { lat: -16.277220, lng: -48.975030, nome: "S-02 08 - Av. Fernando Costa / Mais Sabor Caseiros", bairro: "Adriana Parque", semana: "13:21", sabado: "10:01" },
    { lat: -16.276530, lng: -48.975360, nome: "S-02 09 - Av. Fernando Costa / SUPERMERCADO BOM DEMAIS", bairro: "Adriana Parque", semana: "13:22", sabado: "10:02" },
    { lat: -16.274033, lng: -48.973727, nome: "S-02 10 - R. 7 / Com a Rua 10", bairro: "Lot. Las Palmas", semana: "13:25", sabado: "10:05" },
    { lat: -16.276979, lng: -48.977610, nome: "S-02 11 - Av. Patrícia / ( Garagem Urban )", bairro: "Adriana Parque", semana: "13:29", sabado: "10:09" },
    { lat: -16.281452, lng: -48.976882, nome: "S-02 12 - R. Buriti Alegre / Esquina com a Av. Bandeirantes", bairro: "Vila Jaiara St. Norte", semana: "13:30", sabado: "10:10" },
    { lat: -16.285213, lng: -48.978387, nome: "S-02 13 - R. Nova Capital / Esquina com a Rua Uruana", bairro: "Vila Jaiara St. Norte", semana: "13:33", sabado: "10:13" },
    { lat: -16.283846, lng: -48.974857, nome: "S-02 14 - R. Formosa / Esquina com a Ouro Branco", bairro: "Vila Jaiara St. Norte", semana: "13:34", sabado: "10:14" },
    { lat: -16.287438, lng: -48.972979, nome: "S-02 15 - R. Ouro Branco / Esquina com a R. Inhumas", bairro: "Vila Jaiara St. Norte", semana: "13:36", sabado: "10:16" },
    { lat: -16.296215, lng: -48.966097, nome: "S-02 16 - Av. Pres. Kennedy / Esquina com a R. Nossa Sra. da Conceição", bairro: "Jardim Alexandrina", semana: "13:40", sabado: "10:20" },
    { lat: -16.320760, lng: -48.952588, nome: "S-02 17 - Av. Sen. José Lourenço Dias / Esquina com a R. Tonico De Pina", bairro: "St. Central", semana: "13:47", sabado: "10:27" },
    { lat: -16.331560, lng: -48.951230, nome: "S-02 18 - Av. Brasil Sul / Fórum de Anápolis", bairro: "Cidade Jardim", semana: "13:51", sabado: "10:31" },
    { lat: -16.407180, lng: -48.920460, nome: "S-02 19 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "14:10", sabado: "10:50" },
  ],
  "S-03": [
    { lat: -16.314060, lng: -48.934800, nome: "S-03 01 - Av. Dona Elvira  / Esquina com a Av. Dr. Calil", bairro: "São Carlos 2A Etapa", semana: "13:07", sabado: "09:47" },
    { lat: -16.308778, lng: -48.934412, nome: "S-03 02 - R. 23 / Esquina com a R. 13", bairro: "Boa Vista", semana: "13:09", sabado: "09:49" },
    { lat: -16.306084, lng: -48.931355, nome: "S-03 03 - R. Sen. Nereu Ramos / Esquina com a R. 24", bairro: "Boa Vista", semana: "13:13", sabado: "09:53" },
    { lat: -16.306492, lng: -48.936309, nome: "S-03 04 - R. Argentina / Esquina com a Av. das Rosas", bairro: "Boa Vista", semana: "13:16", sabado: "09:56" },
    { lat: -16.305940, lng: -48.938610, nome: "S-03 05 - R. Argentina / Esquina com a Rua 8", bairro: "Boa Vista", semana: "13:16", sabado: "09:56" },
    { lat: -16.302410, lng: -48.945330, nome: "S-03 06 - Av. Palestina / Esquina com a Rua Equador", bairro: "Boa Vista", semana: "13:20", sabado: "10:00" },
    { lat: -16.299140, lng: -48.946010, nome: "S-03 07 - Av. Palestina / Esquina com a Rua Paraguai", bairro: "Boa Vista", semana: "13:21", sabado: "10:01" },
    { lat: -16.292635, lng: -48.950806, nome: "S-03 08 - Av. Bernardo Sayão / Esquina com a Av. Estados Unidos", bairro: "Parque Iracema", semana: "13:25", sabado: "10:05" },
    { lat: -16.292049, lng: -48.954518, nome: "S-03 09 - Av. dos Palmares / Esquina com a Av. Paranapuã", bairro: "Parque Iracema", semana: "13:26", sabado: "10:06" },
    { lat: -16.290070, lng: -48.957910, nome: "S-03 10 - Av. 10 / Esquina com a Rua 19", bairro: "Cidade Universitária", semana: "13:29", sabado: "10:09" },
    { lat: -16.286710, lng: -48.957280, nome: "S-03 11 - Av. 10 / Com a Rua P 45", bairro: "Jardim Progresso", semana: "13:29", sabado: "10:09" },
    { lat: -16.284790, lng: -48.956930, nome: "S-03 12 - Av. 10 / Com a Rua P 53", bairro: "Rev. Archibald", semana: "13:31", sabado: "10:11" },
    { lat: -16.280300, lng: -48.955090, nome: "S-03 13 - Av. dos Pirineus / Com Rua PP 05", bairro: "Parque dos Pirineus", semana: "13:32", sabado: "10:12" },
    { lat: -16.276890, lng: -48.955100, nome: "S-03 14 - Av. dos Pirineus / Com a Rua PP 11", bairro: "Parque dos Pirineus", semana: "13:34", sabado: "10:14" },
    { lat: -16.275220, lng: -48.955120, nome: "S-03 15 - Av. dos Pirineus / Com a Rua PP-14", bairro: "Parque dos Pirineus", semana: "13:34", sabado: "10:14" },
    { lat: -16.274650, lng: -48.955120, nome: "S-03 16 - Av. Dos Pirineus / Com a Rua PP 15", bairro: "Parque dos Pirineus", semana: "13:35", sabado: "10:15" },
    { lat: -16.272400, lng: -48.955130, nome: "S-03 17 - R. PP 19 / Com a Rua PP 19", bairro: "Parque dos Pirineus", semana: "13:36", sabado: "10:16" },
    { lat: -16.271811, lng: -48.950157, nome: "S-03 18 - Av. Colorado / Esquina com a R. PP 20", bairro: "Eldorado", semana: "13:39", sabado: "10:19" },
    { lat: -16.273220, lng: -48.950570, nome: "S-03 19 - Av. Colorado / Com a Rua 4", bairro: "Eldorado", semana: "13:39", sabado: "10:19" },
    { lat: -16.274900, lng: -48.947150, nome: "S-03 20 - R. 6 / Condomínio Residencial Royal Garden", bairro: "Chácaras Colorado", semana: "13:42", sabado: "10:22" },
    { lat: -16.284997, lng: -48.946579, nome: "S-03 21 - R. Gustavo Leyser / Esquina com a R. Dona Henriqueta Leyse", bairro: "Residencial Santa Cruz", semana: "13:47", sabado: "10:27" },
    { lat: -16.407150, lng: -48.919910, nome: "S-03 22 - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "14:10", sabado: "10:50" },
  ],
  "S-04": [
    { lat: -16.308930, lng: -48.943170, nome: "S-04 01 - Av. Brasil Norte / Auto Posto Imperial", bairro: "Jardim das Americas 2A Etapa", semana: "12:42", sabado: "09:22" },
    { lat: -16.305160, lng: -48.942310, nome: "S-04 02 - R. Argentina / com Rua Argentina (Supermercado Senna)", bairro: "Boa Vista", semana: "12:44", sabado: "09:24" },
    { lat: -16.301920, lng: -48.941530, nome: "S-04 03 - Av. Brasil Norte / Com a Rua Chile", bairro: "Jardim das Americas 2A Etapa", semana: "12:46", sabado: "09:26" },
    { lat: -16.299997, lng: -48.936041, nome: "S-04 04 - R. Jarbas Jaime Filho / Esquina com a R. Profa. Belisaria Faria", bairro: "St. Bougainville", semana: "12:48", sabado: "09:28" },
    { lat: -16.299100, lng: -48.941730, nome: "S-04 05 - Av. Brasil Norte / Com Rua Graciano Antonio Souza", bairro: "Jardim das Americas 2A Etapa", semana: "12:51", sabado: "09:31" },
    { lat: -16.295774, lng: -48.942213, nome: "S-04 06 - Av. Brasil Norte / Com a Rua Bernardo Sayão", bairro: "Jardim das Americas 2A Etapa", semana: "12:52", sabado: "09:32" },
    { lat: -16.287827, lng: -48.943362, nome: "S-04 07 - Av. Brasil Norte / Posto Carreteiro", bairro: "Jardim das Americas 2A Etapa", semana: "12:54", sabado: "09:34" },
    { lat: -16.286650, lng: -48.939620, nome: "S-04 08 - R. Almiro de Amorim / Com a Rua Almiro de Amorim", bairro: "Jardim dos Ipes", semana: "12:55", sabado: "09:35" },
    { lat: -16.286460, lng: -48.936210, nome: "S-04 09 - R. João Florentino / Com a Rua RA 9", bairro: "Res. Araguaia", semana: "12:57", sabado: "09:37" },
    { lat: -16.287329, lng: -48.930979, nome: "S-04 10 - Av. Perimetral / Com a R. João Florentino", bairro: "Res. Araguaia", semana: "12:58", sabado: "09:38" },
    { lat: -16.287074, lng: -48.928767, nome: "S-04 11 - Av. 28 / Esquina com a R. 2", bairro: "Parque Res. das Flores", semana: "13:00", sabado: "09:40" },
    { lat: -16.290836, lng: -48.928718, nome: "S-04 12 - R. 7 / Esquina com a Alameda Portal Do Sol", bairro: "Residencial Vale do Sol", semana: "13:02", sabado: "09:42" },
    { lat: -16.292305, lng: -48.925648, nome: "S-04 13 - Alameda Portal do Sol / Casa de Carne Lobo", bairro: "Residencial Vale do Sol", semana: "13:03", sabado: "09:43" },
    { lat: -16.296882, lng: -48.922975, nome: "S-04 14 - Ac. Fc 17 / Com a Rua FC 12", bairro: "Residencial Vale do Sol", semana: "13:07", sabado: "09:47" },
    { lat: -16.296340, lng: -48.920880, nome: "S-04 15 - Ac. Fc 20 / Com a Rua FC 15", bairro: "Residencial Vale do Sol", semana: "13:08", sabado: "09:48" },
    { lat: -16.289080, lng: -48.921130, nome: "S-04 16 - R. 16 / Esquina com a Av. 25", bairro: "Parque Res. das Flores", semana: "13:11", sabado: "09:51" },
    { lat: -16.286890, lng: -48.920340, nome: "S-04 17 - R. 11 / Com a R. João Florentino", bairro: "Parque Res. das Flores", semana: "13:12", sabado: "09:52" },
    { lat: -16.287280, lng: -48.917582, nome: "S-04 18 - R. 11 / Com a Av. 25", bairro: "Parque Res. das Flores", semana: "13:14", sabado: "09:54" },
    { lat: -16.284500, lng: -48.923210, nome: "S-04 19 - Av. Perimetral / Com Rua SW 03", bairro: "Vila Norte", semana: "13:16", sabado: "09:56" },
    { lat: -16.281573, lng: -48.927585, nome: "S-04 20 - R. 55 / Drogaria Familiar", bairro: "Recanto do Sol", semana: "13:20", sabado: "10:00" },
    { lat: -16.278390, lng: -48.931410, nome: "S-04 21 - R. 54 / Com a Rua 22", bairro: "Recanto do Sol", semana: "13:22", sabado: "10:02" },
    { lat: -16.279492, lng: -48.933350, nome: "S-04 22 - Av. do Estado / Com Rua 10", bairro: "Jardim dos Ipes", semana: "13:23", sabado: "10:03" },
    { lat: -16.277076, lng: -48.936658, nome: "S-04 23 - Av. Estado / Com a Av. Raimundo Carlos Silva", bairro: "Jardim dos Ipes", semana: "13:24", sabado: "10:04" },
    { lat: -16.273870, lng: -48.936800, nome: "S-04 24 - R. RA 21 / Com a Rua RA 21", bairro: "Lot. Res. America", semana: "13:28", sabado: "10:08" },
    { lat: -16.274790, lng: -48.939230, nome: "S-04 25 - R. Ra 17 / Com a Rua RA 13", bairro: "Lot. Res. America", semana: "13:29", sabado: "10:09" },
    { lat: -16.277657, lng: -48.940833, nome: "S-04 26 - R. Ra 11 / Esquina com a R. Maj. Arnaldo", bairro: "Lot. Res. America", semana: "13:31", sabado: "10:11" },
    { lat: -16.280390, lng: -48.939740, nome: "S-04 27 - R. Prof. Clementino de Alencar Lima / Esquina com a Rua Lisboa", bairro: "Lot. Res. America", semana: "13:32", sabado: "10:12" },
    { lat: -16.281696, lng: -48.939638, nome: "S-04 28 - Av. Raimundo Carlos Costa e Silva / Esquina com a Rua Ouro Verde", bairro: "Jardim das Americas 3a Etapa", semana: "13:33", sabado: "10:13" },
    { lat: -16.284103, lng: -48.941091, nome: "S-04 29 - R. Cel. Waltervan / Esquina com a Av. Raimundo Carlos Costa e Silva", bairro: "Jardim das Americas 3a Etapa", semana: "13:34", sabado: "10:14" },
    { lat: -16.250840, lng: -48.932600, nome: "S-04 30 - Av. Ernesto M da Cruz / IASD Monte Sinai", bairro: "Res. Monte Sinai", semana: "13:42", sabado: "10:22" },
    { lat: -16.253080, lng: -48.937150, nome: "S-04 31 - Av. Vilmar Adair Gomes / Mercadinho Melo", bairro: "Santos Dumont", semana: "13:46", sabado: "10:26" },
    { lat: -16.407150, lng: -48.919910, nome: "S-04 32 - Viela Vp / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "14:12", sabado: "10:52" },
  ],
  "S-05": [
    { lat: -16.303860, lng: -48.948070, nome: "S-05 01 - Av. Universitária / Esquina com a Rua Argentina", bairro: "Vila Santa Isabel", semana: "13:01", sabado: "09:41" },
    { lat: -16.305780, lng: -48.948540, nome: "S-05 02 - Av. Universitária / Esquina com a Rua Venezuela", bairro: "Maracanã", semana: "13:03", sabado: "09:43" },
    { lat: -16.308589, lng: -48.949204, nome: "S-05 03 - Av. Universitária / UNIASSELVI", bairro: "Maracanã", semana: "13:04", sabado: "09:44" },
    { lat: -16.313480, lng: -48.950400, nome: "S-05 04 - Av. Universitária / Justiça Federal", bairro: "Jardim Bandeirante", semana: "13:06", sabado: "09:46" },
    { lat: -16.317770, lng: -48.953380, nome: "S-05 05 - Av. Universitária / Esquina com a Av. Senador Ramos Caiado ( Rio Vermelho )", bairro: "Maracanã", semana: "13:07", sabado: "09:47" },
    { lat: -16.318040, lng: -48.955135, nome: "S-05 06 - Av. Pres. Kennedy / Esquina com a R. Luís Schinor", bairro: "Maracanã", semana: "13:08", sabado: "09:48" },
    { lat: -16.314757, lng: -48.956954, nome: "S-05 07 - Av. Pres. Kennedy / Esquina com a Rua Joaquim da Cunha", bairro: "Jardim Alexandrina", semana: "13:10", sabado: "09:50" },
    { lat: -16.313097, lng: -48.957812, nome: "S-05 08 - Av. Pres. Kennedy / Esquina com a R. Francisco Silvério de Faria", bairro: "Jardim Alexandrina", semana: "13:10", sabado: "09:50" },
    { lat: -16.309190, lng: -48.959870, nome: "S-05 09 - Av. Pres. Kennedy / Explorernet", bairro: "Maracanã", semana: "13:12", sabado: "09:52" },
    { lat: -16.304580, lng: -48.961850, nome: "S-05 10 - Av. Pres. Kennedy / ( Praça dos Romeiros )", bairro: "Jardim Alexandrina", semana: "13:13", sabado: "09:53" },
    { lat: -16.300195, lng: -48.958806, nome: "S-05 11 - Av. Dona Albertina de Pina / Esquina com a R. Souzania", bairro: "Jardim Alexandrina", semana: "13:16", sabado: "09:56" },
    { lat: -16.298367, lng: -48.958475, nome: "S-05 12 - R. Souzania / Casa de Carnes Maná", bairro: "Jardim Alexandrina", semana: "13:16", sabado: "09:56" },
    { lat: -16.298971, lng: -48.967021, nome: "S-05 13 - R. do Ouro / Esquina com a R.das Esmeraldas", bairro: "Itamaraty", semana: "13:21", sabado: "10:01" },
    { lat: -16.302736, lng: -48.970787, nome: "S-05 14 - Av. José de Deus / Esquina com a R. 9", bairro: "Itamaraty II", semana: "13:23", sabado: "10:03" },
    { lat: -16.302450, lng: -48.965490, nome: "S-05 15 - R. Circular / Esquina com a Av Tiradentes", bairro: "Itamaraty", semana: "13:26", sabado: "10:06" },
    { lat: -16.309480, lng: -48.963010, nome: "S-05 16 - R. Leopoldo de Bulhões / Com a Rua Cuiaba", bairro: "Ind da Estacao", semana: "13:28", sabado: "10:08" },
    { lat: -16.312882, lng: -48.961109, nome: "S-05 17 - R. Leopoldo de Bulhões / Com a Rua Xavantes", bairro: "Ind da Estacao", semana: "13:30", sabado: "10:10" },
    { lat: -16.319230, lng: -48.960460, nome: "S-05 18 - R. Benjamin Constant / Com a Rua Mauá", bairro: "St. Central", semana: "13:31", sabado: "10:11" },
    { lat: -16.318250, lng: -48.963630, nome: "S-05 19 - R. Mauá / Com a Rua Padre Anchieta", bairro: "Nossa Sra. Aparecida", semana: "13:33", sabado: "10:13" },
    { lat: -16.317720, lng: -48.965370, nome: "S-05 20 - R. Mauá / Com a Rua Oswaldo Cruz", bairro: "Nossa Sra. Aparecida", semana: "13:33", sabado: "10:13" },
    { lat: -16.319738, lng: -48.966263, nome: "S-05 21 - R. Osvaldo Cruz / Esquina com a Av. Federal", bairro: "Vila Sao Jorge", semana: "13:35", sabado: "10:15" },
    { lat: -16.319630, lng: -48.970214, nome: "S-05 22 - Tv. 8 / Campo de Futebol do Bairro Frei Eustáquio", bairro: "Frei Eustaquio", semana: "13:36", sabado: "10:16" },
    { lat: -16.321430, lng: -48.964111, nome: "S-05 23 - R. José Gomes de Paula / Com a Av. Ipiranga", bairro: "Vila Sao Jorge", semana: "13:39", sabado: "10:19" },
    { lat: -16.326548, lng: -48.962122, nome: "S-05 24 - R. Firmo de Velasco / Esquina com a R. Barão do Rio Branco", bairro: "St. Central", semana: "13:41", sabado: "10:21" },
    { lat: -16.331985, lng: -48.962191, nome: "S-05 25 - Av. Getulino Artiaga / Rua Firmo de Velasco", bairro: "São José", semana: "13:44", sabado: "10:24" },
    { lat: -16.338140, lng: -48.953080, nome: "S-05 26 - Av. Brasil Sul / Posto Nota 10", bairro: "Batista", semana: "13:49", sabado: "10:29" },
    { lat: -16.342276, lng: -48.954769, nome: "S-05 27 - Av. Brasil Sul / Esquina com a R. Miguel Elias", bairro: "Vila Verde", semana: "13:51", sabado: "10:31" },
    { lat: -16.346778, lng: -48.957120, nome: "S-05 28 - Av. Brasil Sul / Hiper Festa Brasil Sul - Anápolis", bairro: "Calixtolândia", semana: "13:52", sabado: "10:32" },
    { lat: -16.368502, lng: -48.958523, nome: "S-05 29 - R. 2 Quadra D, 676 / Esquina com a R.6", bairro: "Residencial Geovanni", semana: "13:59", sabado: "10:39" },
    { lat: -16.370040, lng: -48.963570, nome: "S-05 30 - R. dos Goianos / PEROLA DISTRIBUIÇÃO", bairro: "Calixtolândia", semana: "14:02", sabado: "10:42" },
    { lat: -16.407154, lng: -48.920008, nome: "S-05 31 - Viela Vp-7D / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "14:13", sabado: "10:53" },
  ],
};

const terceiroTurnoRoutes: RouteData = {
  "T-01": [
    { lat: -16.328118, lng: -48.953529, nome: "T-01 01 - Exemplo ponto 3° Turno", bairro: "Centro", semana: "22:10", sabado: "22:10" },
    { lat: -16.407132, lng: -48.918605, nome: "T-01 Final - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "23:00", sabado: "23:00" },
  ],
  // Add more routes for 3° Turno when available
};

const administrativoRoutes: RouteData = {
  "A-01": [
    { lat: -16.328118, lng: -48.953529, nome: "A-01 01 - Exemplo ponto Administrativo", bairro: "Centro", semana: "07:10", sabado: "07:10" },
    { lat: -16.407132, lng: -48.918605, nome: "A-01 Final - Distrito Agroindustrial de Anápolis", bairro: "Laboratório Teuto", semana: "08:00", sabado: "08:00" },
  ],
  // Add more routes for Administrativo when available
};

// Combined data structure for all shifts
export const allRouteData: TurnoRouteData = {
  "1° Turno": primeiroTurnoRoutes,
  "2° Turno": segundoTurnoRoutes,
  "3° Turno": terceiroTurnoRoutes,
  "Administrativo": administrativoRoutes,
};

// Function to add new routes to a specific shift
export function addRoutesToShift(turno: string, routes: RouteData): void {
  if (!allRouteData[turno]) {
    allRouteData[turno] = {};
  }
  
  Object.entries(routes).forEach(([routeId, stops]) => {
    allRouteData[turno][routeId] = stops;
  });
}

// Function to get available turnos
export function getAvailableTurnos(): string[] {
  return Object.keys(allRouteData);
}

// Function to get available routes for a specific turno
export function getAvailableRoutes(turno: string): string[] {
  if (!allRouteData[turno]) return [];
  return Object.keys(allRouteData[turno]);
}
