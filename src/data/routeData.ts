
import { TurnoRouteData, RouteData } from "@/types/mapTypes";
import { firstTurnoRoutesP1toP4 } from "./routeData-p1-p4";
import { firstTurnoRoutesP5toP10 } from "./routeData-p5-p10";
import { firstTurnoRoutesP11toP15 } from "./routeData-p11-p15";
import { secondTurnoRoutesS9toS11 } from "./routeData-s9-s11";

// First Shift (1° Turno) routes - P-01 to P-15
const firstTurnoRoutes: RouteData = {
  ...firstTurnoRoutesP1toP4,
  ...firstTurnoRoutesP5toP10,
  ...firstTurnoRoutesP11toP15
};

// Second Shift (2° Turno) routes - S-01 to S-12
const secondTurnoRoutes: RouteData = {
  "S-01": [
    {
      lat: -16.325950,
      lng: -48.954180,
      nome: "Rua 21 de Abril / Paróquia São Francisco de Assis",
      bairro: "Jundiaí",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.328118,
      lng: -48.953529,
      nome: "Av. Minas Gerais / Esquina com a Rua 21 de Abril",
      bairro: "Jundiaí",
      semana: "13:04:00",
      sabado: "09:44:00"
    },
    {
      lat: -16.330820,
      lng: -48.947660,
      nome: "Av. Minas Gerais / Esquina com a R. Pedro Braz de Queirós",
      bairro: "Jundiaí",
      semana: "13:06:00",
      sabado: "09:46:00"
    },
    {
      lat: -16.333340,
      lng: -48.949130,
      nome: "Av. Fernando Costa / Esquina com a Rua 2",
      bairro: "Vila Góis",
      semana: "13:08:00",
      sabado: "09:48:00"
    },
    {
      lat: -16.335440,
      lng: -48.951080,
      nome: "Av. Brasil Norte / Igreja Universal",
      bairro: "Maracanã",
      semana: "13:10:00",
      sabado: "09:50:00"
    },
    {
      lat: -16.336580,
      lng: -48.952260,
      nome: "Av. Brasil Norte / Esquina com a R. Izac Ferreira",
      bairro: "Maracanazinho",
      semana: "13:12:00",
      sabado: "09:52:00"
    },
    {
      lat: -16.338340,
      lng: -48.954010,
      nome: "Av. Brasil Norte / Esquina com a R. José Neto Paranhos",
      bairro: "Vila Nossa Senhora D'Abadia",
      semana: "13:14:00",
      sabado: "09:54:00"
    },
    {
      lat: -16.340130,
      lng: -48.955730,
      nome: "Av. Brasil Norte / Esquina com a R. 14",
      bairro: "Vila Nossa Senhora D'Abadia",
      semana: "13:16:00",
      sabado: "09:56:00"
    },
    {
      lat: -16.342010,
      lng: -48.956380,
      nome: "R. Aderbal / Esquina com a R. Aderbal",
      bairro: "Vila Brasil",
      semana: "13:18:00",
      sabado: "09:58:00"
    }
  ],
  "S-02": [
    {
      lat: -16.328620,
      lng: -48.957520,
      nome: "Av. Contorno c/ R. 2",
      bairro: "Jardim Ana Paula",
      semana: "13:03:00",
      sabado: "09:43:00"
    },
    {
      lat: -16.330820,
      lng: -48.959520,
      nome: "Av. Contorno / Faculdade Fibra",
      bairro: "Jardim Alexandrina",
      semana: "13:05:00",
      sabado: "09:45:00"
    },
    {
      lat: -16.332830,
      lng: -48.961480,
      nome: "Av. Contorno / Esquina com a R. Dom Pedro I",
      bairro: "Jardim Alexandrina",
      semana: "13:07:00",
      sabado: "09:47:00"
    },
    {
      lat: -16.334750,
      lng: -48.963390,
      nome: "Av. Contorno / Esquina com a R. Barão de Cotegipe",
      bairro: "Jardim Alexandrina",
      semana: "13:09:00",
      sabado: "09:49:00"
    },
    {
      lat: -16.336580,
      lng: -48.965260,
      nome: "Av. Contorno / Esquina com a R. José F. de Assis",
      bairro: "Jardim Alexandrina",
      semana: "13:11:00",
      sabado: "09:51:00"
    },
    {
      lat: -16.338340,
      lng: -48.967130,
      nome: "Av. Contorno / Esquina com a R. Dr. Genserico",
      bairro: "Jardim Alexandrina",
      semana: "13:13:00",
      sabado: "09:53:00"
    },
    {
      lat: -16.340130,
      lng: -48.968950,
      nome: "Av. Contorno / Esquina com a R. Dr. Onestino",
      bairro: "Jardim Alexandrina",
      semana: "13:15:00",
      sabado: "09:55:00"
    },
    {
      lat: -16.341840,
      lng: -48.970720,
      nome: "Av. Contorno / Esquina com a R. Dr. Miguel",
      bairro: "Jardim Alexandrina",
      semana: "13:17:00",
      sabado: "09:57:00"
    },
    {
      lat: -16.343470,
      lng: -48.972440,
      nome: "Av. Contorno / Esquina com a R. Dr. Afonso",
      bairro: "Jardim Alexandrina",
      semana: "13:19:00",
      sabado: "09:59:00"
    },
    {
      lat: -16.345020,
      lng: -48.974110,
      nome: "Av. Contorno / Esquina com a R. Dr. Eurico",
      bairro: "Jardim Alexandrina",
      semana: "13:21:00",
      sabado: "10:01:00"
    },
    {
      lat: -16.346500,
      lng: -48.975730,
      nome: "Av. Contorno / Esquina com a R. Dr. Alfredo",
      bairro: "Jardim Alexandrina",
      semana: "13:23:00",
      sabado: "10:03:00"
    },
    {
      lat: -16.347900,
      lng: -48.977300,
      nome: "Av. Contorno / Esquina com a R. Dr. Helio",
      bairro: "Jardim Alexandrina",
      semana: "13:25:00",
      sabado: "10:05:00"
    },
    {
      lat: -16.349220,
      lng: -48.978820,
      nome: "Av. Contorno / Esquina com a R. Dr. Cyro",
      bairro: "Jardim Alexandrina",
      semana: "13:27:00",
      sabado: "10:07:00"
    },
    {
      lat: -16.350460,
      lng: -48.980290,
      nome: "Av. Contorno / Esquina com a R. Dr. Gercilio",
      bairro: "Jardim Alexandrina",
      semana: "13:29:00",
      sabado: "10:09:00"
    },
    {
      lat: -16.351620,
      lng: -48.981710,
      nome: "Av. Contorno / Esquina com a R. Dr. Silas",
      bairro: "Jardim Alexandrina",
      semana: "13:31:00",
      sabado: "10:11:00"
    },
    {
      lat: -16.352700,
      lng: -48.983080,
      nome: "Av. Contorno / Esquina com a R. Dr. Diogo",
      bairro: "Jardim Alexandrina",
      semana: "13:33:00",
      sabado: "10:13:00"
    },
    {
      lat: -16.353700,
      lng: -48.984400,
      nome: "Av. Contorno / Esquina com a R. Dr. Edmundo",
      bairro: "Jardim Alexandrina",
      semana: "13:35:00",
      sabado: "10:15:00"
    },
    {
      lat: -16.354620,
      lng: -48.985670,
      nome: "Av. Contorno / Esquina com a R. Dr. Paulo",
      bairro: "Jardim Alexandrina",
      semana: "13:37:00",
      sabado: "10:17:00"
    },
    {
      lat: -16.355460,
      lng: -48.986900,
      nome: "Av. Contorno / Esquina com a R. Dr. Lazaro",
      bairro: "Jardim Alexandrina",
      semana: "13:39:00",
      sabado: "10:19:00"
    },
    {
      lat: -16.356220,
      lng: -48.988080,
      nome: "Av. Contorno / Esquina com a R. Dr. Afonso",
      bairro: "Jardim Alexandrina",
      semana: "13:41:00",
      sabado: "10:21:00"
    },
    {
      lat: -16.356900,
      lng: -48.989210,
      nome: "Av. Contorno / Esquina com a R. Dr. Eurico",
      bairro: "Jardim Alexandrina",
      semana: "13:43:00",
      sabado: "10:23:00"
    },
    {
      lat: -16.357500,
      lng: -48.990300,
      nome: "Av. Contorno / Esquina com a R. Dr. Alfredo",
      bairro: "Jardim Alexandrina",
      semana: "13:45:00",
      sabado: "10:25:00"
    },
    {
      lat: -16.358020,
      lng: -48.991340,
      nome: "Av. Contorno / Esquina com a R. Dr. Helio",
      bairro: "Jardim Alexandrina",
      semana: "13:47:00",
      sabado: "10:27:00"
    },
    {
      lat: -16.358460,
      lng: -48.992330,
      nome: "Av. Contorno / Esquina com a R. Dr. Cyro",
      bairro: "Jardim Alexandrina",
      semana: "13:49:00",
      sabado: "10:29:00"
    },
    {
      lat: -16.358820,
      lng: -48.993270,
      nome: "Av. Contorno / Esquina com a R. Dr. Gercilio",
      bairro: "Jardim Alexandrina",
      semana: "13:51:00",
      sabado: "10:31:00"
    },
    {
      lat: -16.359100,
      lng: -48.994160,
      nome: "Av. Contorno / Esquina com a R. Dr. Silas",
      bairro: "Jardim Alexandrina",
      semana: "13:53:00",
      sabado: "10:33:00"
    },
    {
      lat: -16.359300,
      lng: -48.995000,
      nome: "Av. Contorno / Esquina com a R. Dr. Diogo",
      bairro: "Jardim Alexandrina",
      semana: "13:55:00",
      sabado: "10:35:00"
    },
    {
      lat: -16.359420,
      lng: -48.995800,
      nome: "Av. Contorno / Esquina com a R. Dr. Edmundo",
      bairro: "Jardim Alexandrina",
      semana: "13:57:00",
      sabado: "10:37:00"
    },
    {
      lat: -16.359460,
      lng: -48.996550,
      nome: "Av. Contorno / Esquina com a R. Dr. Paulo",
      bairro: "Jardim Alexandrina",
      semana: "13:59:00",
      sabado: "10:39:00"
    },
    {
      lat: -16.359420,
      lng: -48.997250,
      nome: "Av. Contorno / Esquina com a R. Dr. Lazaro",
      bairro: "Jardim Alexandrina",
      semana: "14:01:00",
      sabado: "10:41:00"
    }
  ],
  "S-03": [
    {
      lat: -16.315160,
      lng: -48.950660,
      nome: "R. Engenheiro Portela / Esquina com a R. Senador Jaime",
      bairro: "Jundiaí",
      semana: "13:05:00",
      sabado: "09:45:00"
    },
    {
      lat: -16.317680,
      lng: -48.952480,
      nome: "R. Senador Jaime / Esquina com a R. 21 de Abril",
      bairro: "Jundiaí",
      semana: "13:07:00",
      sabado: "09:47:00"
    },
    {
      lat: -16.320120,
      lng: -48.954250,
      nome: "R. Senador Jaime / Esquina com a R. 14",
      bairro: "Jundiaí",
      semana: "13:09:00",
      sabado: "09:49:00"
    },
    {
      lat: -16.322480,
      lng: -48.955970,
      nome: "R. Senador Jaime / Esquina com a R. 11",
      bairro: "Jundiaí",
      semana: "13:11:00",
      sabado: "09:51:00"
    },
    {
      lat: -16.324760,
      lng: -48.957640,
      nome: "R. Senador Jaime / Esquina com a R. 8",
      bairro: "Jundiaí",
      semana: "13:13:00",
      sabado: "09:53:00"
    },
    {
      lat: -16.326960,
      lng: -48.959260,
      nome: "R. Senador Jaime / Esquina com a R. 5",
      bairro: "Jundiaí",
      semana: "13:15:00",
      sabado: "09:55:00"
    },
    {
      lat: -16.329080,
      lng: -48.960830,
      nome: "R. Senador Jaime / Esquina com a R. 2",
      bairro: "Jundiaí",
      semana: "13:17:00",
      sabado: "09:57:00"
    },
    {
      lat: -16.331120,
      lng: -48.962350,
      nome: "R. Senador Jaime / Esquina com a R. 1° de Maio",
      bairro: "Jundiaí",
      semana: "13:19:00",
      sabado: "09:59:00"
    },
    {
      lat: -16.333080,
      lng: -48.963820,
      nome: "R. Senador Jaime / Esquina com a R. 24 de Outubro",
      bairro: "Jundiaí",
      semana: "13:21:00",
      sabado: "10:01:00"
    },
    {
      lat: -16.334960,
      lng: -48.965240,
      nome: "R. Senador Jaime / Esquina com a R. 13 de Maio",
      bairro: "Jundiaí",
      semana: "13:23:00",
      sabado: "10:03:00"
    },
    {
      lat: -16.336760,
      lng: -48.966610,
      nome: "R. Senador Jaime / Esquina com a R. 7 de Setembro",
      bairro: "Jundiaí",
      semana: "13:25:00",
      sabado: "10:05:00"
    },
    {
      lat: -16.338480,
      lng: -48.967930,
      nome: "R. Senador Jaime / Esquina com a R. 15 de Novembro",
      bairro: "Jundiaí",
      semana: "13:27:00",
      sabado: "10:07:00"
    },
    {
      lat: -16.340120,
      lng: -48.969200,
      nome: "R. Senador Jaime / Esquina com a R. 21 de Abril",
      bairro: "Jundiaí",
      semana: "13:29:00",
      sabado: "10:09:00"
    },
    {
      lat: -16.341680,
      lng: -48.970420,
      nome: "R. Senador Jaime / Esquina com a R. 14 de Julho",
      bairro: "Jundiaí",
      semana: "13:31:00",
      sabado: "10:11:00"
    },
    {
      lat: -16.343160,
      lng: -48.971590,
      nome: "R. Senador Jaime / Esquina com a R. 1° de Janeiro",
      bairro: "Jundiaí",
      semana: "13:33:00",
      sabado: "10:13:00"
    },
    {
      lat: -16.344560,
      lng: -48.972710,
      nome: "R. Senador Jaime / Esquina com a R. 25 de Dezembro",
      bairro: "Jundiaí",
      semana: "13:35:00",
      sabado: "10:15:00"
    },
    {
      lat: -16.345880,
      lng: -48.973780,
      nome: "R. Senador Jaime / Esquina com a R. 1° de Maio",
      bairro: "Jundiaí",
      semana: "13:37:00",
      sabado: "10:17:00"
    },
    {
      lat: -16.347120,
      lng: -48.974800,
      nome: "R. Senador Jaime / Esquina com a R. 24 de Outubro",
      bairro: "Jundiaí",
      semana: "13:39:00",
      sabado: "10:19:00"
    },
    {
      lat: -16.348280,
      lng: -48.975770,
      nome: "R. Senador Jaime / Esquina com a R. 13 de Maio",
      bairro: "Jundiaí",
      semana: "13:41:00",
      sabado: "10:21:00"
    },
    {
      lat: -16.349360,
      lng: -48.976690,
      nome: "R. Senador Jaime / Esquina com a R. 7 de Setembro",
      bairro: "Jundiaí",
      semana: "13:43:00",
      sabado: "10:23:00"
    },
    {
      lat: -16.350360,
      lng: -48.977560,
      nome: "R. Senador Jaime / Esquina com a R. 15 de Novembro",
      bairro: "Jundiaí",
      semana: "13:45:00",
      sabado: "10:25:00"
    },
    {
      lat: -16.351280,
      lng: -48.978380,
      nome: "R. Senador Jaime / Esquina com a R. 21 de Abril",
      bairro: "Jundiaí",
      semana: "13:47:00",
      sabado: "10:27:00"
    },
    {
      lat: -16.352120,
      lng: -48.979150,
      nome: "R. Senador Jaime / Esquina com a R. 14 de Julho",
      bairro: "Jundiaí",
      semana: "13:49:00",
      sabado: "10:29:00"
    },
    {
      lat: -16.352880,
      lng: -48.979870,
      nome: "R. Senador Jaime / Esquina com a R. 1° de Janeiro",
      bairro: "Jundiaí",
      semana: "13:51:00",
      sabado: "10:31:00"
    },
    {
      lat: -16.353560,
      lng: -48.980540,
      nome: "R. Senador Jaime / Esquina com a R. 25 de Dezembro",
      bairro: "Jundiaí",
      semana: "13:53:00",
      sabado: "10:33:00"
    },
    {
      lat: -16.354160,
      lng: -48.981170,
      nome: "R. Senador Jaime / Esquina com a R. 1° de Maio",
      bairro: "Jundiaí",
      semana: "13:55:00",
      sabado: "10:35:00"
    },
    {
      lat: -16.354680,
      lng: -48.981750,
      nome: "R. Senador Jaime / Esquina com a R. 24 de Outubro",
      bairro: "Jundiaí",
      semana: "13:57:00",
      sabado: "10:37:00"
    },
    {
      lat: -16.355120,
      lng: -48.982280,
      nome: "R. Senador Jaime / Esquina com a R. 13 de Maio",
      bairro: "Jundiaí",
      semana: "13:59:00",
      sabado: "10:39:00"
    },
    {
      lat: -16.355480,
      lng: -48.982760,
      nome: "R. Senador Jaime / Esquina com a R. 7 de Setembro",
      bairro: "Jundiaí",
      semana: "14:01:00",
      sabado: "10:41:00"
    }
  ],
  "S-04": [
    {
      lat: -16.342010,
      lng: -48.956380,
      nome: "R. Aderbal / Esquina com a R. Aderbal",
      bairro: "Vila Brasil",
      semana: "13:09:00",
      sabado: "09:49:00"
    },
    {
      lat: -16.343880,
      lng: -48.957030,
      nome: "R. Aderbal / Esquina com a R. 14",
      bairro: "Vila Brasil",
      semana: "13:11:00",
      sabado: "09:51:00"
    },
    {
      lat: -16.345660,
      lng: -48.957630,
      nome: "R. Aderbal / Esquina com a R. 11",
      bairro: "Vila Brasil",
      semana: "13:13:00",
      sabado: "09:53:00"
    },
    {
      lat: -16.347360,
      lng: -48.958180,
      nome: "R. Aderbal / Esquina com a R. 8",
      bairro: "Vila Brasil",
      semana: "13:15:00",
      sabado: "09:55:00"
    },
    {
      lat: -16.348980,
      lng: -48.958680,
      nome: "R. Aderbal / Esquina com a R. 5",
      bairro: "Vila Brasil",
      semana: "13:17:00",
      sabado: "09:57:00"
    },
    {
      lat: -16.350520,
      lng: -48.959130,
      nome: "R. Aderbal / Esquina com a R. 2",
      bairro: "Vila Brasil",
      semana: "13:19:00",
      sabado: "09:59:00"
    },
    {
      lat: -16.351980,
      lng: -48.959530,
      nome: "R. Aderbal / Esquina com a R. 1° de Maio",
      bairro: "Vila Brasil",
      semana: "13:21:00",
      sabado: "10:01:00"
    },
    {
      lat: -16.353360,
      lng: -48.959880,
      nome: "R. Aderbal / Esquina com a R. 24 de Outubro",
      bairro: "Vila Brasil",
      semana: "13:23:00",
      sabado: "10:03:00"
    },
    {
      lat: -16.354660,
      lng: -48.960180,
      nome: "R. Aderbal / Esquina com a R. 13 de Maio",
      bairro: "Vila Brasil",
      semana: "13:25:00",
      sabado: "10:05:00"
    },
    {
      lat: -16.355880,
      lng: -48.960430,
      nome: "R. Aderbal / Esquina com a R. 7 de Setembro",
      bairro: "Vila Brasil",
      semana: "13:27:00",
      sabado: "10:07:00"
    },
    {
      lat: -16.357020,
      lng: -48.960630,
      nome: "R. Aderbal / Esquina com a R. 15 de Novembro",
      bairro: "Vila Brasil",
      semana: "13:29:00",
      sabado: "10:09:00"
    },
    {
      lat: -16.358080,
      lng: -48.960780,
      nome: "R. Aderbal / Esquina com a R. 21 de Abril",
      bairro: "Vila Brasil",
      semana: "13:31:00",
      sabado: "10:11:00"
    }
  ],
  ...secondTurnoRoutesS9toS11
};

// All route data by turno
export const allRouteData: TurnoRouteData = {
  "1° Turno": firstTurnoRoutes,
  "2° Turno": secondTurnoRoutes,
  "3° Turno": {},
  "Administrativo": {}
};

// Helper function to get available turnos
export const getAvailableTurnos = () => {
  return Object.keys(allRouteData);
};

// Helper function to get available routes
export const getAvailableRoutes = (turno: string) => {
  return Object.keys(allRouteData[turno] || {});
};
