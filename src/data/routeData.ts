import { firstTurnoRoutesP5toP10 } from "./routeData-p5-p10";
import { firstTurnoRoutesP11toP15 } from "./routeData-p11-p15";

// First Shift (1° Turno) routes - P-01 to P-15
const firstTurnoRoutes = {
    "P-01": [
        {
            lat: -16.330820,
            lng: -48.947660,
            nome: "Av. Minas Gerais / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "05:56:00",
            sabado: "05:56:00"
        },
        {
            lat: -16.328118,
            lng: -48.953529,
            nome: "Av. Minas Gerais / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "05:58:00",
            sabado: "05:58:00"
        },
        {
            lat: -16.325950,
            lng: -48.954180,
            nome: "Rua 21 de Abril / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:00:00",
            sabado: "06:00:00"
        }
    ],
    "P-02": [
        {
            lat: -16.328620,
            lng: -48.957520,
            nome: "Av. Contorno c/ R. 2",
            bairro: "Jardim Ana Paula",
            semana: "05:55:00",
            sabado: "05:55:00"
        },
        {
            lat: -16.330820,
            lng: -48.959520,
            nome: "Av. Contorno / Faculdade Fibra",
            bairro: "Jardim Alexandrina",
            semana: "05:57:00",
            sabado: "05:57:00"
        },
        {
            lat: -16.332830,
            lng: -48.961480,
            nome: "Av. Contorno / Esquina com a R. Dom Pedro I",
            bairro: "Jardim Alexandrina",
            semana: "05:59:00",
            sabado: "05:59:00"
        }
    ],
    "P-03": [
        {
            lat: -16.315160,
            lng: -48.950660,
            nome: "R. Engenheiro Portela / Esquina com a R. Senador Jaime",
            bairro: "Jundiaí",
            semana: "05:57:00",
            sabado: "05:57:00"
        },
        {
            lat: -16.317680,
            lng: -48.952480,
            nome: "R. Senador Jaime / Esquina com a R. 21 de Abril",
            bairro: "Jundiaí",
            semana: "05:59:00",
            sabado: "05:59:00"
        }
    ],
    "P-04": [
        {
            lat: -16.342010,
            lng: -48.956380,
            nome: "R. Aderbal / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "05:59:00",
            sabado: "05:59:00"
        },
        {
            lat: -16.343880,
            lng: -48.957030,
            nome: "R. Aderbal / Esquina com a R. 14",
            bairro: "Vila Brasil",
            semana: "06:01:00",
            sabado: "06:01:00"
        }
    ],
    ...firstTurnoRoutesP5toP10,
    ...firstTurnoRoutesP11toP15
};

// Second Shift (2° Turno) routes - S-01 to S-12
const secondTurnoRoutes = {
    "S-01": [
        {
            lat: -16.350830,
            lng: -48.956740,
            nome: "R. Bela Vista / Farmácia Evangélica",
            bairro: "Jardim Goncalves",
            semana: "13:10:00",
            sabado: "09:50:00"
        },
        {
            lat: -16.350490,
            lng: -48.954460,
            nome: "Ac. Bela Vista / Esquina com a Rua 1",
            bairro: "Jardim Goncalves",
            semana: "13:12:00",
            sabado: "09:52:00"
        }
    ],
    "S-02": [
        {
            lat: -16.351860,
            lng: -48.952250,
            nome: "R. 4 / Colégio Estadual Durval Nunes Da Mata",
            bairro: "Vila Joao Luiz de Oliveira",
            semana: "13:13:00",
            sabado: "09:53:00"
        }
    ],
    "S-03": [
        {
            lat: -16.356540,
            lng: -48.953450,
            nome: "R. 1 / Esquina com a Rua 9",
            bairro: "Batista",
            semana: "13:16:00",
            sabado: "09:56:00"
        }
    ],
    "S-04": [
        {
            lat: -16.358190,
            lng: -48.952670,
            nome: "R. Construtor José Francisco / Esquina com a R. Construtor José Francisco",
            bairro: "Jardim Bom Clima",
            semana: "13:16:00",
            sabado: "09:56:00"
        }
    ],
    "S-05": [
        {
            lat: -16.359410,
            lng: -48.955800,
            nome: "R. Construtor José Francisco / Esquina com a R. Maria Melo",
            bairro: "Jardim Bom Clima",
            semana: "13:19:00",
            sabado: "09:59:00"
        }
    ],
    "S-06": [
        {
            lat: -16.363470,
            lng: -48.956110,
            nome: "Av. Contôrno / Residencial Première Bela Vista",
            bairro: "Jardim Arco Verde",
            semana: "13:22:00",
            sabado: "10:02:00"
        }
    ],
    "S-07": [
        {
            lat: -16.355160,
            lng: -48.957410,
            nome: "Av. Jorge G De Almeida / Esquina com a Av. Jorge Guimarães de Almeida",
            bairro: "Santo André",
            semana: "13:26:00",
            sabado: "10:06:00"
        }
    ],
    "S-08": [
        {
            lat: -16.344680,
            lng: -48.967480,
            nome: "Av. Pres. José Sarney / Posto Sol II",
            bairro: "St. Sul Jamil Miguel",
            semana: "13:31:00",
            sabado: "10:11:00"
        }
    ],
    "S-09": [
        {
            lat: -16.343880,
            lng: -48.970510,
            nome: "R. 9 / Esquina com a Rua 9",
            bairro: "Vila Sao Joaquim",
            semana: "13:34:00",
            sabado: "10:14:00"
        }
    ],
    "S-10": [
        {
            lat: -16.349030,
            lng: -48.973810,
            nome: "Av. Pedro Ludovico / Esquina com a R. Deocleciano Moreira Alves",
            bairro: "Vila Sao Joaquim",
            semana: "13:36:00",
            sabado: "10:16:00"
        }
    ],
    "S-11": [
        {
            lat: -16.353800,
            lng: -48.976670,
            nome: "R. Santa Aparecida / Esquina com a R. Santa Aparecida",
            bairro: "Jardim Calixto",
            semana: "13:38:00",
            sabado: "10:18:00"
        }
    ],
    "S-12": [
        {
            lat: -16.320400,
            lng: -48.939060,
            nome: "Av. Dona Elvira / Esquina com a R. Joaquim Esperidião",
            bairro: "São Carlos",
            semana: "12:55:00",
            sabado: "09:35:00"
        },
        {
            lat: -16.325230,
            lng: -48.927620,
            nome: "Av. Eng. Geraldo de Pina / Esquina com a R. S-51",
            bairro: "Anápolis City",
            semana: "13:00:00",
            sabado: "09:40:00"
        },
        {
            lat: -16.325450,
            lng: -48.923930,
            nome: "Av. Mato Grosso / ( Posto City )",
            bairro: "Anápolis City",
            semana: "13:00:00",
            sabado: "09:40:00"
        },
        {
            lat: -16.311430,
            lng: -48.921130,
            nome: "R. dos Coqueirais, 201 /  Esquina com a Av. Cerejeiras",
            bairro: "Residencial das Cerejeiras",
            semana: "13:03:00",
            sabado: "09:43:00"
        },
        {
            lat: -16.320830,
            lng: -48.917080,
            nome: "Av. Ayrton Senna da Silva / Esquina com a R. PB 17",
            bairro: "Parque Brasilia 2A Etapa",
            semana: "13:08:00",
            sabado: "09:48:00"
        },
        {
            lat: -16.319220,
            lng: -48.914360,
            nome: "Av. Ayrton Senna da Silva / Esquina com a R. PB 50",
            bairro: "Parque Sao Jeronimo",
            semana: "13:09:00",
            sabado: "09:49:00"
        },
        {
            lat: -16.317270,
            lng: -48.907100,
            nome: "R. MN 3 / Esquina com a R. MN 18",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:10:00",
            sabado: "09:50:00"
        },
        {
            lat: -16.316720,
            lng: -48.904600,
            nome: "Av. Jorn Euripedes G Melo / Esquina com a R. Dr. Zico Faria",
            bairro: "Jardim Itália",
            semana: "13:12:00",
            sabado: "09:52:00"
        },
        {
            lat: -16.319000,
            lng: -48.902800,
            nome: "Av. Jorn. Eurípedes Gomes de Melo / Esquina com a R. Zacarias Elias",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:12:00",
            sabado: "09:52:00"
        },
        {
            lat: -16.323620,
            lng: -48.904050,
            nome: "R. Napoli - Jardim Itália/Esquina com a R.Cantazaro",
            bairro: "Jardim Itália",
            semana: "13:14:00",
            sabado: "09:54:00"
        },
        {
            lat: -16.317230,
            lng: -48.900220,
            nome: "Av. das Laranjeiras / Esquina com a Av. Pinheiro",
            bairro: "Gran Ville",
            semana: "13:17:00",
            sabado: "09:57:00"
        },
        {
            lat: -16.312340,
            lng: -48.910880,
            nome: "R. Zacarias Elias / Com a Av. Comendador Jose Abidala",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:24:00",
            sabado: "10:04:00"
        },
        {
            lat: -16.315370,
            lng: -48.908690,
            nome: "Av. Ayrton Senna da Silva / Esquina com a MN3",
            bairro: "Parque Sao Jeronimo",
            semana: "13:25:00",
            sabado: "10:05:00"
        },
        {
            lat: -16.311970,
            lng: -48.904400,
            nome: "Av. Comendador José Abdala / Esquina com a Av. Ayrton Senna da Silva",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:26:00",
            sabado: "10:06:00"
        },
        {
            lat: -16.310620,
            lng: -48.902810,
            nome: "Av. Ayrton Senna da Silva / Esquina com a R. Antônio de Souza França",
            bairro: "Parque Sao Jeronimo",
            semana: "13:27:00",
            sabado: "10:07:00"
        },
        {
            lat: -16.303070,
            lng: -48.898030,
            nome: "R. JP 3 / Esquina com a Rua JP 10",
            bairro: "Jardim Primavera 1A Etapa",
            semana: "13:29:00",
            sabado: "10:09:00"
        },
        {
            lat: -16.301100,
            lng: -48.895790,
            nome: "R. Jp 3 / Com a Rua JP 14",
            bairro: "Jardim Primavera I",
            semana: "13:30:00",
            sabado: "10:10:00"
        },
        {
            lat: -16.303230,
            lng: -48.894060,
            nome: "R. JP 39 / Esquina com a Av. Ayrton Senna da Silva",
            bairro: "Jardim Primavera 2A Etapa",
            semana: "13:30:00",
            sabado: "10:10:00"
        },
        {
            lat: -16.304610,
            lng: -48.890760,
            nome: "R. Jp 39 / Esquina com a R. Jp 47",
            bairro: "Jardim Primavera II",
            semana: "13:31:00",
            sabado: "10:11:00"
        },
        {
            lat: -16.302490,
            lng: -48.887560,
            nome: "Av. Jp 34 / Com a Rua JP 52",
            bairro: "Jardim Primavera II",
            semana: "13:33:00",
            sabado: "10:13:00"
        },
        {
            lat: -16.301070,
            lng: -48.891050,
            nome: "Av. JP 34 / Com a Rua JP 59",
            bairro: "Jardim Primavera 2A Etapa",
            semana: "13:34:00",
            sabado: "10:14:00"
        },
        {
            lat: -16.304380,
            lng: -48.895860,
            nome: "Av. Ayrton Senna da Silva / Esquina com a R. JP 30",
            bairro: "Jardim Primavera 1A Etapa",
            semana: "13:36:00",
            sabado: "10:16:00"
        },
        {
            lat: -16.315240,
            lng: -48.899610,
            nome: "Av. Sérvio Túlio Jayme / Esquina com a R. Antônio Pio",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:38:00",
            sabado: "10:18:00"
        },
        {
            lat: -16.326950,
            lng: -48.893800,
            nome: "Av. Sérvio Túlio Jayme / Esquina com a R. I-8",
            bairro: "Anápolis",
            semana: "13:40:00",
            sabado: "10:20:00"
        },
        {
            lat: -16.333460,
            lng: -48.901560,
            nome: "Av. Independência / Esquina com a Av. Ilda Gonçalves Ferreira",
            bairro: "Jardim Ibirapuera",
            semana: "13:43:00",
            sabado: "10:23:00"
        },
        {
            lat: -16.329950,
            lng: -48.909660,
            nome: "Av. Independência / Esquina com a R. PB 27",
            bairro: "Jardim Ibirapuera",
            semana: "13:44:00",
            sabado: "10:24:00"
        },
        {
            lat: -16.329380,
            lng: -48.913590,
            nome: "Av. Independência / Esquina com a R. PB 22",
            bairro: "Jardim Ibirapuera",
            semana: "13:45:00",
            sabado: "10:25:00"
        },
        {
            lat: -16.331460,
            lng: -48.918820,
            nome: "Av. Comercial / Esquina com a Rua 10",
            bairro: "Lourdes",
            semana: "13:48:00",
            sabado: "10:28:00"
        },
        {
            lat: -16.335030,
            lng: -48.920940,
            nome: "Av. Angélica / Esquina com a Av. Patriarca",
            bairro: "Lourdes",
            semana: "13:50:00",
            sabado: "10:30:00"
        },
        {
            lat: -16.336680,
            lng: -48.918630,
            nome: "Av. Comercial / Esquina com a Av. Angélica",
            bairro: "Lourdes",
            semana: "13:50:00",
            sabado: "10:30:00"
        },
        {
            lat: -16.338930,
            lng: -48.918510,
            nome: "Av. Comercial / Com a Rua 14",
            bairro: "Lourdes",
            semana: "13:51:00",
            sabado: "10:31:00"
        },
        {
            lat: -16.342890,
            lng: -48.918330,
            nome: "Av. Comercial / Com a Rua 15",
            bairro: "Lourdes",
            semana: "13:52:00",
            sabado: "10:32:00"
        },
        {
            lat: -16.343010,
            lng: -48.920710,
            nome: "R. 15 / Esquina com a Av. Patriarca",
            bairro: "Lourdes",
            semana: "13:53:00",
            sabado: "10:33:00"
        },
        {
            lat: -16.346930,
            lng: -48.920590,
            nome: "Av. Patriarca / Esquina com a Rua 17",
            bairro: "Lourdes",
            semana: "13:53:00",
            sabado: "10:33:00"
        },
        {
            lat: -16.348880,
            lng: -48.920720,
            nome: "Av. Patriarca / Esquina com a R. 19",
            bairro: "Lourdes",
            semana: "13:54:00",
            sabado: "10:34:00"
        },
        {
            lat: -16.348930,
            lng: -48.916420,
            nome: "Av. Brasil / Esquina com a R. 23",
            bairro: "Chácaras Americanas",
            semana: "13:55:00",
            sabado: "10:35:00"
        },
        {
            lat: -16.407150,
            lng: -48.919910,
            nome: "Viela Vp / Laboratório Teuto",
            bairro: "Distrito Agroindustrial de Anápolis",
            semana: "14:09:00",
            sabado: "10:49:00"
        }
    ]
};

// All route data by turno
export const allRouteData = {
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
export const getAvailableRoutes = (turno) => {
    return Object.keys(allRouteData[turno] || {});
};
