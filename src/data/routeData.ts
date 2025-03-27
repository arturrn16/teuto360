
import { BusStop, RouteData, TurnoRouteData } from "@/types/mapTypes";

// Define bus stops for each route
const p01Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-01 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-01 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
  { lat: -16.350000, lng: -48.970000, nome: "P-01 03 - Terminal Central", bairro: "Setor Central", semana: "06:20", sabado: "06:20" },
  { lat: -16.360000, lng: -48.980000, nome: "P-01 04 - Praça Bom Jesus", bairro: "Setor Central", semana: "06:30", sabado: "06:30" },
  { lat: -16.370000, lng: -48.990000, nome: "P-01 05 - Hospital Evangélico", bairro: "Setor Central", semana: "06:40", sabado: "06:40" },
  { lat: -16.380000, lng: -49.000000, nome: "P-01 06 - Feira Coberta", bairro: "Setor Central", semana: "06:50", sabado: "06:50" },
  { lat: -16.390000, lng: -49.010000, nome: "P-01 07 - Banco do Brasil", bairro: "Setor Central", semana: "07:00", sabado: "07:00" },
  { lat: -16.400000, lng: -49.020000, nome: "P-01 08 - Catedral de Anápolis", bairro: "Setor Central", semana: "07:10", sabado: "07:10" },
  { lat: -16.410000, lng: -49.030000, nome: "P-01 09 - Praça Santana", bairro: "Setor Central", semana: "07:20", sabado: "07:20" },
  { lat: -16.420000, lng: -49.040000, nome: "P-01 10 - Parque Ipiranga", bairro: "Setor Central", semana: "07:30", sabado: "07:30" },
];

const p02Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-02 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-02 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
  { lat: -16.350000, lng: -48.970000, nome: "P-02 03 - Terminal Central", bairro: "Setor Central", semana: "06:20", sabado: "06:20" },
  { lat: -16.360000, lng: -48.980000, nome: "P-02 04 - Praça Bom Jesus", bairro: "Setor Central", semana: "06:30", sabado: "06:30" },
  { lat: -16.370000, lng: -48.990000, nome: "P-02 05 - Hospital Evangélico", bairro: "Setor Central", semana: "06:40", sabado: "06:40" },
  { lat: -16.380000, lng: -49.000000, nome: "P-02 06 - Feira Coberta", bairro: "Setor Central", semana: "06:50", sabado: "06:50" },
];

const p03Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-03 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-03 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
  { lat: -16.350000, lng: -48.970000, nome: "P-03 03 - Terminal Central", bairro: "Setor Central", semana: "06:20", sabado: "06:20" },
  { lat: -16.360000, lng: -48.980000, nome: "P-03 04 - Praça Bom Jesus", bairro: "Setor Central", semana: "06:30", sabado: "06:30" },
];

const p04Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-04 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-04 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
  { lat: -16.350000, lng: -48.970000, nome: "P-04 03 - Terminal Central", bairro: "Setor Central", semana: "06:20", sabado: "06:20" },
];

const p05Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-05 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-05 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p06Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-06 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-06 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p07Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-07 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-07 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p08Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-08 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-08 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p09Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-09 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-09 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p10Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-10 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-10 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p11Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-11 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-11 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p12Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-12 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-12 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p13Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-13 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-13 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p14Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-14 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-14 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const p15Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "P-15 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "06:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "P-15 02 - Igreja Matriz", bairro: "Setor Central", semana: "06:10", sabado: "06:10" },
];

const s01Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-01 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-01 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s02Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-02 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-02 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s03Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-03 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-03 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s04Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-04 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-04 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s05Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-05 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-05 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s06Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-06 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-06 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s07Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-07 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-07 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s08Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-08 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-08 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s09Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-09 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-09 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s10Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-10 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-10 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s11Route: BusStop[] = [
  { lat: -16.330000, lng: -48.950000, nome: "S-11 01 - Praça Dom Emanuel", bairro: "Setor Central", semana: "12:00", sabado: "06:00" },
  { lat: -16.340000, lng: -48.960000, nome: "S-11 02 - Igreja Matriz", bairro: "Setor Central", semana: "12:10", sabado: "06:10" },
];

const s12Route: BusStop[] = [
  { lat: -16.320400, lng: -48.939060, nome: "S-12 01 - Av. Dona Elvira / Esquina com a R. Joaquim Esperidião", bairro: "São Carlos", semana: "12:55", sabado: "09:35" },
  { lat: -16.325230, lng: -48.927620, nome: "S-12 02 - Av. Eng. Geraldo de Pina / Esquina com a R. S-51", bairro: "Anápolis City", semana: "13:00", sabado: "09:40" },
  { lat: -16.325450, lng: -48.923930, nome: "S-12 03 - Av. Mato Grosso / ( Posto City )", bairro: "Anápolis City", semana: "13:00", sabado: "09:40" },
  { lat: -16.311430, lng: -48.921130, nome: "S-12 04 - R. dos Coqueirais, 201 / Esquina com a Av. Cerejeiras", bairro: "Residencial das Cerejeiras", semana: "13:03", sabado: "09:43" },
  { lat: -16.320830, lng: -48.917080, nome: "S-12 05 - Av. Ayrton Senna da Silva / Esquina com a R. PB 17", bairro: "Parque Brasilia 2A Etapa", semana: "13:08", sabado: "09:48" },
  { lat: -16.319220, lng: -48.914360, nome: "S-12 06 - Av. Ayrton Senna da Silva / Esquina com a R. PB 50", bairro: "Parque Sao Jeronimo", semana: "13:09", sabado: "09:49" },
  { lat: -16.317270, lng: -48.907100, nome: "S-12 07 - R. MN 3 / Esquina com a R. MN 18", bairro: "Conj. Hab. Filostro Machado Carneiro", semana: "13:10", sabado: "09:50" },
  { lat: -16.316720, lng: -48.904600, nome: "S-12 08 - Av. Jorn Euripedes G Melo / Esquina com a R. Dr. Zico Faria", bairro: "Jardim Itália", semana: "13:12", sabado: "09:52" },
  { lat: -16.319000, lng: -48.902800, nome: "S-12 09 - Av. Jorn. Eurípedes Gomes de Melo / Esquina com a R. Zacarias Elias", bairro: "Conj. Hab. Filostro Machado Carneiro", semana: "13:12", sabado: "09:52" },
  { lat: -16.323620, lng: -48.904050, nome: "S-12 10 - R. Napoli - Jardim Itália/Esquina com a R.Cantazaro", bairro: "Jardim Itália", semana: "13:14", sabado: "09:54" },
  { lat: -16.317230, lng: -48.900220, nome: "S-12 11 - Av. das Laranjeiras / Esquina com a Av. Pinheiro", bairro: "Gran Ville", semana: "13:17", sabado: "09:57" },
  { lat: -16.315370, lng: -48.908690, nome: "S-12 12 - Av. Ayrton Senna da Silva / Esquina com a MN3", bairro: "Parque Sao Jeronimo", semana: "13:25", sabado: "10:05" },
  { lat: -16.311970, lng: -48.904400, nome: "S-12 13 - Av. Comendador José Abdala / Esquina com a Av. Ayrton Senna da Silva", bairro: "Conj. Hab. Filostro Machado Carneiro", semana: "13:26", sabado: "10:06" },
  { lat: -16.310620, lng: -48.902810, nome: "S-12 14 - Av. Ayrton Senna da Silva / Esquina com a R. Antônio de Souza França", bairro: "Parque Sao Jeronimo", semana: "13:27", sabado: "10:07" },
  { lat: -16.303070, lng: -48.898030, nome: "S-12 15 - R. JP 3 / Esquina com a Rua JP 10", bairro: "Jardim Primavera 1A Etapa", semana: "13:29", sabado: "10:09" },
  { lat: -16.301100, lng: -48.895790, nome: "S-12 16 - R. JP 3 / Esquina com a Rua JP 14", bairro: "Jardim Primavera I", semana: "13:30", sabado: "10:10" },
  { lat: -16.303230, lng: -48.894060, nome: "S-12 17 - R. JP 39 / Esquina com a Av. Ayrton Senna da Silva", bairro: "Jardim Primavera 2A Etapa", semana: "13:30", sabado: "10:10" },
  { lat: -16.304610, lng: -48.890760, nome: "S-12 18 - R. JP 39 / Esquina com a R. JP 47", bairro: "Jardim Primavera II", semana: "13:31", sabado: "10:11" },
  { lat: -16.302490, lng: -48.887560, nome: "S-12 19 - Av. JP 34 / Com a Rua JP 52", bairro: "Jardim Primavera II", semana: "13:33", sabado: "10:13" },
  { lat: -16.301070, lng: -48.891050, nome: "S-12 20 - Av. JP 34 / Com a Rua JP 59", bairro: "Jardim Primavera 2A Etapa", semana: "13:34", sabado: "10:14" },
  { lat: -16.304380, lng: -48.895860, nome: "S-12 21 - Av. Ayrton Senna da Silva / Esquina com a R. JP 30", bairro: "Jardim Primavera 1A Etapa", semana: "13:36", sabado: "10:16" },
  { lat: -16.315240, lng: -48.899610, nome: "S-12 22 - Av. Sérvio Túlio Jayme / Esquina com a R. Antônio Pio", bairro: "Conj. Hab. Filostro Machado Carneiro", semana: "13:38", sabado: "10:18" },
  { lat: -16.326950, lng: -48.893800, nome: "S-12 23 - Av. Sérvio Túlio Jayme / Esquina com a R. I-8", bairro: "Anápolis", semana: "13:40", sabado: "10:20" },
  { lat: -16.333460, lng: -48.901560, nome: "S-12 24 - Av. Independência / Esquina com a Av. Ilda Gonçalves Ferreira", bairro: "Jardim Ibirapuera", semana: "13:43", sabado: "10:23" },
  { lat: -16.329950, lng: -48.909660, nome: "S-12 25 - Av. Independência / Esquina com a R. PB 27", bairro: "Jardim Ibirapuera", semana: "13:44", sabado: "10:24" },
  { lat: -16.329380, lng: -48.913590, nome: "S-12 26 - Av. Independência / Esquina com a R. PB 22", bairro: "Jardim Ibirapuera", semana: "13:45", sabado: "10:25" },
  { lat: -16.331460, lng: -48.918820, nome: "S-12 27 - Av. Comercial / Esquina com a Rua 10", bairro: "Lourdes", semana: "13:48", sabado: "10:28" },
  { lat: -16.335030, lng: -48.920940, nome: "S-12 28 - Av. Angélica / Esquina com a Av. Patriarca", bairro: "Lourdes", semana: "13:50", sabado: "10:30" },
  { lat: -16.336680, lng: -48.918630, nome: "S-12 29 - Av. Comercial / Esquina com a Av. Angélica", bairro: "Lourdes", semana: "13:50", sabado: "10:30" },
  { lat: -16.338930, lng: -48.918510, nome: "S-12 30 - Av. Comercial / Com a Rua 14", bairro: "Lourdes", semana: "13:51", sabado: "10:31" },
  { lat: -16.342890, lng: -48.918330, nome: "S-12 31 - Av. Comercial / Com a Rua 15", bairro: "Lourdes", semana: "13:52", sabado: "10:32" },
  { lat: -16.343010, lng: -48.920710, nome: "S-12 32 - R. 15 / Esquina com a Av. Patriarca", bairro: "Lourdes", semana: "13:53", sabado: "10:33" },
  { lat: -16.346930, lng: -48.920590, nome: "S-12 33 - Av. Patriarca / Esquina com a Rua 17", bairro: "Lourdes", semana: "13:53", sabado: "10:33" },
  { lat: -16.348880, lng: -48.920720, nome: "S-12 34 - Av. Patriarca / Esquina com a R. 19", bairro: "Lourdes", semana: "13:54", sabado: "10:34" },
  { lat: -16.348930, lng: -48.916420, nome: "S-12 35 - Av. Brasil / Esquina com a R. 23", bairro: "Chácaras Americanas", semana: "13:55", sabado: "10:35" },
  { lat: -16.407150, lng: -48.919910, nome: "S-12 36 - Viela Vp / Laboratório Teuto", bairro: "Distrito Agroindustrial de Anápolis", semana: "14:09", sabado: "10:49" }
];

// Function to get available turnos
export const getAvailableTurnos = () => {
  return Object.keys(allRouteData);
};

// Function to get available routes for a given turno
export const getAvailableRoutes = (turno: string) => {
  return Object.keys(allRouteData[turno] || {});
};

// Combine all route data
export const allRouteData: TurnoRouteData = {
  "1° Turno": {
    "P-01": p01Route,
    "P-02": p02Route,
    "P-03": p03Route,
    "P-04": p04Route,
    "P-05": p05Route,
    "P-06": p06Route,
    "P-07": p07Route,
    "P-08": p08Route,
    "P-09": p09Route,
    "P-10": p10Route,
    "P-11": p11Route,
    "P-12": p12Route,
    "P-13": p13Route,
    "P-14": p14Route,
    "P-15": p15Route,
  },
  "2° Turno": {
    "S-01": s01Route,
    "S-02": s02Route,
    "S-03": s03Route,
    "S-04": s04Route,
    "S-05": s05Route,
    "S-06": s06Route,
    "S-07": s07Route,
    "S-08": s08Route,
    "S-09": s09Route,
    "S-10": s10Route,
    "S-11": s11Route,
    "S-12": s12Route,
  },
  "3° Turno": {},
  "Administrativo": {},
};
