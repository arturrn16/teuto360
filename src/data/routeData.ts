import { BusStop, RouteData, TurnoRouteData } from "@/types/mapTypes";
import { firstTurnoRoutesP1toP5 } from "./routeData-p1-p4";
import { firstTurnoRoutesP5toP10 } from "./routeData-p5-p10"; 
import { firstTurnoRoutesP11toP15 } from "./routeData-p11-p15";
import { secondTurnoRoutes } from "./routeData-s9-s11";

// 1° Turno Routes
export const firstTurnoRoutes: RouteData = {
  ...firstTurnoRoutesP1toP5,
  ...firstTurnoRoutesP5toP10,
  ...firstTurnoRoutesP11toP15
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
export const secondTurnoRoutes: RouteData = {
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
  ],
  "T-03": [
    {
      lat: -16.398118,
      lng: -48.853529,
      nome: "Av. Mato Grosso / Esquina com a Rua 1",
      bairro: "Setor Sul",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.400830,
      lng: -48.856740,
      nome: "Av. Mato Grosso / Esquina com a Rua 7",
      bairro: "Setor Sul",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.403540,
      lng: -48.859950,
      nome: "Av. Mato Grosso / Esquina com a Rua 14",
      bairro: "Setor Sul",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ],
  "T-04": [
    {
      lat: -16.405118,
      lng: -48.843529,
      nome: "Av. Pará / Esquina com a Rua 1",
      bairro: "Setor Leste",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.407830,
      lng: -48.846740,
      nome: "Av. Pará / Esquina com a Rua 7",
      bairro: "Setor Leste",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.410540,
      lng: -48.849950,
      nome: "Av. Pará / Esquina com a Rua 14",
      bairro: "Setor Leste",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ],
  "T-05": [
    {
      lat: -16.412118,
      lng: -48.833529,
      nome: "Av. Amazonas / Esquina com a Rua 1",
      bairro: "Setor Norte",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.414830,
      lng: -48.836740,
      nome: "Av. Amazonas / Esquina com a Rua 7",
      bairro: "Setor Norte",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.417540,
      lng: -48.839950,
      nome: "Av. Amazonas / Esquina com a Rua 14",
      bairro: "Setor Norte",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ],
  "T-06": [
    {
      lat: -16.419118,
      lng: -48.823529,
      nome: "Av. Rondônia / Esquina com a Rua 1",
      bairro: "Setor Nordeste",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.421830,
      lng: -48.826740,
      nome: "Av. Rondônia / Esquina com a Rua 7",
      bairro: "Setor Nordeste",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.424540,
      lng: -48.829950,
      nome: "Av. Rondônia / Esquina com a Rua 14",
      bairro: "Setor Nordeste",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ],
  "T-07": [
    {
      lat: -16.426118,
      lng: -48.813529,
      nome: "Av. Acre / Esquina com a Rua 1",
      bairro: "Setor Noroeste",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.428830,
      lng: -48.816740,
      nome: "Av. Acre / Esquina com a Rua 7",
      bairro: "Setor Noroeste",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.431540,
      lng: -48.819950,
      nome: "Av. Acre / Esquina com a Rua 14",
      bairro: "Setor Noroeste",
      semana: "22:04:00",
      sabado: "22:04:00"
    }
  ],
  "T-08": [
    {
      lat: -16.433118,
      lng: -48.803529,
      nome: "Av. Amapá / Esquina com a Rua 1",
      bairro: "Setor Sudoeste",
      semana: "22:00:00",
      sabado: "22:00:00"
    },
    {
      lat: -16.435830,
      lng: -48.806740,
      nome: "Av. Amapá / Esquina com a Rua 7",
      bairro: "Setor Sudoeste",
      semana: "22:02:00",
      sabado: "22:02:00"
    },
    {
      lat: -16.438540,
      lng: -48.809950,
      nome: "Av. Amapá / Esquina com a Rua 14",
      bairro: "Setor Sudoeste",
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
  ],
  "A-03": [
    {
      lat: -16.454118,
      lng: -48.773529,
      nome: "Av. Piauí / Esquina com a Rua 1",
      bairro: "Setor Oeste Vila Nova",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.456830,
      lng: -48.776740,
      nome: "Av. Piauí / Esquina com a Rua 7",
      bairro: "Setor Oeste Vila Nova",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.459540,
      lng: -48.779950,
      nome: "Av. Piauí / Esquina com a Rua 14",
      bairro: "Setor Oeste Vila Nova",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ],
  "A-04": [
    {
      lat: -16.461118,
      lng: -48.763529,
      nome: "Av. Ceará / Esquina com a Rua 1",
      bairro: "Setor Norte Vila Nova",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.463830,
      lng: -48.766740,
      nome: "Av. Ceará / Esquina com a Rua 7",
      bairro: "Setor Norte Vila Nova",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.466540,
      lng: -48.769950,
      nome: "Av. Ceará / Esquina com a Rua 14",
      bairro: "Setor Norte Vila Nova",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ],
  "A-05": [
    {
      lat: -16.468118,
      lng: -48.753529,
      nome: "Av. Rio Grande do Norte / Esquina com a Rua 1",
      bairro: "Setor Sul Vila Nova",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.470830,
      lng: -48.756740,
      nome: "Av. Rio Grande do Norte / Esquina com a Rua 7",
      bairro: "Setor Sul Vila Nova",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.473540,
      lng: -48.759950,
      nome: "Av. Rio Grande do Norte / Esquina com a Rua 14",
      bairro: "Setor Sul Vila Nova",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ],
  "A-06": [
    {
      lat: -16.475118,
      lng: -48.743529,
      nome: "Av. Paraíba / Esquina com a Rua 1",
      bairro: "Setor Central Vila Nova",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.477830,
      lng: -48.746740,
      nome: "Av. Paraíba / Esquina com a Rua 7",
      bairro: "Setor Central Vila Nova",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.480540,
      lng: -48.749950,
      nome: "Av. Paraíba / Esquina com a Rua 14",
      bairro: "Setor Central Vila Nova",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ],
  "A-07": [
    {
      lat: -16.482118,
      lng: -48.733529,
      nome: "Av. Pernambuco / Esquina com a Rua 1",
      bairro: "Setor Leste Universitário",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.484830,
      lng: -48.736740,
      nome: "Av. Pernambuco / Esquina com a Rua 7",
      bairro: "Setor Leste Universitário",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.487540,
      lng: -48.739950,
      nome: "Av. Pernambuco / Esquina com a Rua 14",
      bairro: "Setor Leste Universitário",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ],
  "A-08": [
    {
      lat: -16.489118,
      lng: -48.723529,
      nome: "Av. Alagoas / Esquina com a Rua 1",
      bairro: "Setor Oeste Universitário",
      semana: "08:00:00",
      sabado: "08:00:00"
    },
    {
      lat: -16.491830,
      lng: -48.726740,
      nome: "Av. Alagoas / Esquina com a Rua 7",
      bairro: "Setor Oeste Universitário",
      semana: "08:02:00",
      sabado: "08:02:00"
    },
    {
      lat: -16.494540,
      lng: -48.729950,
      nome: "Av. Alagoas / Esquina com a Rua 14",
      bairro: "Setor Oeste Universitário",
      semana: "08:04:00",
      sabado: "08:04:00"
    }
  ]
};

// Combine all routes by shift
export const allRouteData: TurnoRouteData = {
  "1° Turno": firstTurnoRoutes,
  "2° Turno": secondTurnoRoutes,
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
