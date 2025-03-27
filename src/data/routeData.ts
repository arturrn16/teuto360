
import { BusStop, RouteData, TurnoRouteData } from "@/types/mapTypes";
import { secondTurnoRoutes } from "./routeData-s9-s11";

// 1° Turno Routes
export const firstTurnoRoutes: RouteData = {
  "P-01": [
    {
      lat: -16.328118,
      lng: -48.953529,
      nome: "P-01 01 - Av. Brasil Sul / Praça Dom Emanuel",
      bairro: "Centro",
      semana: "05:00",
      sabado: "06:05"
    },
    {
      lat: -16.330830,
      lng: -48.956740,
      nome: "P-01 02 - Av. Brasil Sul / Esquina com a Rua Barão do Rio Branco",
      bairro: "Centro",
      semana: "05:02",
      sabado: "06:07"
    }
  ],
  "P-02": [
    {
      lat: -16.335118,
      lng: -48.943529,
      nome: "P-02 01 - Av. Pedro Ludovico / Praça Americano do Brasil",
      bairro: "Jundiaí",
      semana: "05:00",
      sabado: "06:05"
    },
    {
      lat: -16.337830,
      lng: -48.946740,
      nome: "P-02 02 - Av. Pedro Ludovico / Esquina com a Rua 14",
      bairro: "Jundiaí",
      semana: "05:02",
      sabado: "06:07"
    }
  ]
};

// 2° Turno Routes (existing routes S-01 to S-08)
export const turno2RoutesS1toS8: RouteData = {
  "S-01": [
    {
      lat: -16.328118,
      lng: -48.953529,
      nome: "Av. Brasil Sul / Praça Dom Emanuel",
      bairro: "Centro",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.330830,
      lng: -48.956740,
      nome: "Av. Brasil Sul / Esquina com a Rua Barão do Rio Branco",
      bairro: "Centro",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.333540,
      lng: -48.959950,
      nome: "Av. Brasil Sul / Esquina com a Rua Engenheiro Portela",
      bairro: "Centro",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-02": [
    {
      lat: -16.335118,
      lng: -48.943529,
      nome: "Av. Pedro Ludovico / Praça Americano do Brasil",
      bairro: "Jundiaí",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.337830,
      lng: -48.946740,
      nome: "Av. Pedro Ludovico / Esquina com a Rua 14",
      bairro: "Jundiaí",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.340540,
      lng: -48.949950,
      nome: "Av. Pedro Ludovico / Esquina com a Rua 21",
      bairro: "Jundiaí",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-03": [
    {
      lat: -16.342118,
      lng: -48.933529,
      nome: "Av. Universitária / Esquina com a Rua 1",
      bairro: "Cidade Universitária",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.344830,
      lng: -48.936740,
      nome: "Av. Universitária / Esquina com a Rua 7",
      bairro: "Cidade Universitária",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.347540,
      lng: -48.939950,
      nome: "Av. Universitária / Esquina com a Rua 14",
      bairro: "Cidade Universitária",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-04": [
    {
      lat: -16.349118,
      lng: -48.923529,
      nome: "Av. Brasil Norte / Esquina com a Rua 1",
      bairro: "Maracanã",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.351830,
      lng: -48.926740,
      nome: "Av. Brasil Norte / Esquina com a Rua 7",
      bairro: "Maracanã",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.354540,
      lng: -48.929950,
      nome: "Av. Brasil Norte / Esquina com a Rua 14",
      bairro: "Maracanã",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-05": [
    {
      lat: -16.356118,
      lng: -48.913529,
      nome: "Av. Fernando Costa / Esquina com a Rua 1",
      bairro: "Vila Jaiara",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.358830,
      lng: -48.916740,
      nome: "Av. Fernando Costa / Esquina com a Rua 7",
      bairro: "Vila Jaiara",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.361540,
      lng: -48.919950,
      nome: "Av. Fernando Costa / Esquina com a Rua 14",
      bairro: "Vila Jaiara",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-06": [
    {
      lat: -16.363118,
      lng: -48.903529,
      nome: "Av. São Francisco / Esquina com a Rua 1",
      bairro: "Jardim Progresso",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.365830,
      lng: -48.906740,
      nome: "Av. São Francisco / Esquina com a Rua 7",
      bairro: "Jardim Progresso",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.368540,
      lng: -48.909950,
      nome: "Av. São Francisco / Esquina com a Rua 14",
      bairro: "Jardim Progresso",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-07": [
    {
      lat: -16.370118,
      lng: -48.893529,
      nome: "Av. JK / Esquina com a Rua 1",
      bairro: "Anápolis City",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.372830,
      lng: -48.896740,
      nome: "Av. JK / Esquina com a Rua 7",
      bairro: "Anápolis City",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.375540,
      lng: -48.899950,
      nome: "Av. JK / Esquina com a Rua 14",
      bairro: "Anápolis City",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ],
  "S-08": [
    {
      lat: -16.377118,
      lng: -48.883529,
      nome: "Av. Goiás / Esquina com a Rua 1",
      bairro: "Jardim das Américas",
      semana: "13:00:00",
      sabado: "09:40:00"
    },
    {
      lat: -16.379830,
      lng: -48.886740,
      nome: "Av. Goiás / Esquina com a Rua 7",
      bairro: "Jardim das Américas",
      semana: "13:02:00",
      sabado: "09:42:00"
    },
    {
      lat: -16.382540,
      lng: -48.889950,
      nome: "Av. Goiás / Esquina com a Rua 14",
      bairro: "Jardim das Américas",
      semana: "13:04:00",
      sabado: "09:44:00"
    }
  ]
};

// Combine all 2° Turno routes
export const allSecondTurnoRoutes: RouteData = {
  ...turno2RoutesS1toS8,
  ...secondTurnoRoutes
};

// 3° Turno Routes
export const thirdTurnoRoutes: RouteData = {
  "T-01": [
    {
      lat: -16.384118,
      lng: -48.873529,
      nome: "Av. Anhanguera / Esquina com a Rua 1",
      bairro: "Setor Central",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.386830,
      lng: -48.876740,
      nome: "Av. Anhanguera / Esquina com a Rua 7",
      bairro: "Setor Central",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.389540,
      lng: -48.879950,
      nome: "Av. Anhanguera / Esquina com a Rua 14",
      bairro: "Setor Central",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ],
  "T-02": [
    {
      lat: -16.391118,
      lng: -48.863529,
      nome: "Av. Tocantins / Esquina com a Rua 1",
      bairro: "Setor Oeste",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.393830,
      lng: -48.866740,
      nome: "Av. Tocantins / Esquina com a Rua 7",
      bairro: "Setor Oeste",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.396540,
      lng: -48.869950,
      nome: "Av. Tocantins / Esquina com a Rua 14",
      bairro: "Setor Oeste",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ]
};

// Administrative Routes
export const adminRoutes: RouteData = {
  "A-01": [
    {
      lat: -16.440118,
      lng: -48.793529,
      nome: "Av. Roraima / Esquina com a Rua 1",
      bairro: "Setor Sudeste",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.442830,
      lng: -48.796740,
      nome: "Av. Roraima / Esquina com a Rua 7",
      bairro: "Setor Sudeste",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.445540,
      lng: -48.799950,
      nome: "Av. Roraima / Esquina com a Rua 14",
      bairro: "Setor Sudeste",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ],
  "A-02": [
    {
      lat: -16.447118,
      lng: -48.783529,
      nome: "Av. Maranhão / Esquina com a Rua 1",
      bairro: "Setor Leste Vila Nova",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.449830,
      lng: -48.786740,
      nome: "Av. Maranhão / Esquina com a Rua 7",
      bairro: "Setor Leste Vila Nova",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.452540,
      lng: -48.789950,
      nome: "Av. Maranhão / Esquina com a Rua 14",
      bairro: "Setor Leste Vila Nova",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ]
};

// Combine all routes by shift
export const allRouteData: TurnoRouteData = {
  "1° Turno": firstTurnoRoutes,
  "2° Turno": allSecondTurnoRoutes,
  "3° Turno": thirdTurnoRoutes,
  "Administrativo": adminRoutes
};

// Helper function to get available turnos
export const getAvailableTurnos = (): string[] => {
  return Object.keys(allRouteData);
};

// Helper function to get available routes for a given turno
export const getAvailableRoutes = (turno: string): string[] => {
  const routesForTurno = allRouteData[turno] || {};
  return Object.keys(routesForTurno).sort();
};
