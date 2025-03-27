// Import from routeData-p11-p15.ts with the correct export name
import { routeDataP11toP15 } from "./routeData-p11-p15";
// Import from routeData-p5-p10.ts with the correct export name
import { routeDataP5toP10 } from "./routeData-p5-p10";

// First Shift (1° Turno) routes - P-01 to P-15
const firstTurnoRoutes = {
    "P-01": [
        {
            lat: -16.325950,
            lng: -48.954180,
            nome: "Rua 21 de Abril / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.328118,
            lng: -48.953529,
            nome: "Av. Minas Gerais / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.330820, 
            lng: -48.947660,
            nome: "Av. Minas Gerais / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.333340,
            lng: -48.949130,
            nome: "Av. Fernando Costa / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.335440,
            lng: -48.951080,
            nome: "Av. Brasil Norte / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.336580,
            lng: -48.952260,
            nome: "Av. Brasil Norte / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.338340,
            lng: -48.954010,
            nome: "Av. Brasil Norte / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.340130,
            lng: -48.955730,
            nome: "Av. Brasil Norte / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.342010,
            lng: -48.956380,
            nome: "R. Aderbal / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-02": [
        {
            lat: -16.318520,
            lng: -48.953470,
            nome: "Av. Presidente Kennedy / Faculdade Anhanguera",
            bairro: "Vila Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.320550,
            lng: -48.952870,
            nome: "Av. Presidente Kennedy / Esquina com a R. do Seminário",
            bairro: "Vila Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.322440,
            lng: -48.952240,
            nome: "Av. Presidente Kennedy / Próximo a Igreja Cristã Evangélica",
            bairro: "Vila Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.324330,
            lng: -48.951620,
            nome: "Av. Presidente Kennedy / Esquina com a R. do Parque",
            bairro: "Vila Jundiaí",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.326220,
            lng: -48.951000,
            nome: "Av. Presidente Kennedy / Próximo ao Supermercado Super Vi",
            bairro: "Vila Jundiaí",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.328110,
            lng: -48.950370,
            nome: "Av. Presidente Kennedy / Esquina com a R. do Comércio",
            bairro: "Vila Jundiaí",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.330000,
            lng: -48.949750,
            nome: "Av. Presidente Kennedy / Próximo a Panificadora Jundiaí",
            bairro: "Vila Jundiaí",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.331890,
            lng: -48.949130,
            nome: "Av. Presidente Kennedy / Esquina com a R. da Indústria",
            bairro: "Vila Jundiaí",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.333780,
            lng: -48.948500,
            nome: "Av. Presidente Kennedy / Próximo a Honda",
            bairro: "Vila Jundiaí",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-03": [
        {
            lat: -16.318520,
            lng: -48.953470,
            nome: "Av. Presidente Kennedy / Faculdade Anhanguera",
            bairro: "Vila Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.320550,
            lng: -48.952870,
            nome: "Av. Presidente Kennedy / Esquina com a R. do Seminário",
            bairro: "Vila Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.322440,
            lng: -48.952240,
            nome: "Av. Presidente Kennedy / Próximo a Igreja Cristã Evangélica",
            bairro: "Vila Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.324330,
            lng: -48.951620,
            nome: "Av. Presidente Kennedy / Esquina com a R. do Parque",
            bairro: "Vila Jundiaí",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.326220,
            lng: -48.951000,
            nome: "Av. Presidente Kennedy / Próximo ao Supermercado Super Vi",
            bairro: "Vila Jundiaí",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.328110,
            lng: -48.950370,
            nome: "Av. Presidente Kennedy / Esquina com a R. do Comércio",
            bairro: "Vila Jundiaí",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.330000,
            lng: -48.949750,
            nome: "Av. Presidente Kennedy / Próximo a Panificadora Jundiaí",
            bairro: "Vila Jundiaí",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.331890,
            lng: -48.949130,
            nome: "Av. Presidente Kennedy / Esquina com a R. da Indústria",
            bairro: "Vila Jundiaí",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.333780,
            lng: -48.948500,
            nome: "Av. Presidente Kennedy / Próximo a Honda",
            bairro: "Vila Jundiaí",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
     "P-04": [
        {
            lat: -16.354010,
            lng: -48.954180,
            nome: "Rua угловая / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.356118,
            lng: -48.953529,
            nome: "Av. Minas Gerais / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.358820, 
            lng: -48.947660,
            nome: "Av. Minas Gerais / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.361340,
            lng: -48.949130,
            nome: "Av. Fernando Costa / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.363440,
            lng: -48.951080,
            nome: "Av. Brasil Norte / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.364580,
            lng: -48.952260,
            nome: "Av. Brasil Norte / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.366340,
            lng: -48.954010,
            nome: "Av. Brasil Norte / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.368130,
            lng: -48.955730,
            nome: "Av. Brasil Norte / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.370010,
            lng: -48.956380,
            nome: "R. Aderbal / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-05": [
        {
            lat: -16.374010,
            lng: -48.954180,
            nome: "Rua Teste / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.376118,
            lng: -48.953529,
            nome: "Av. Teste / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.378820, 
            lng: -48.947660,
            nome: "Av. Teste / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.381340,
            lng: -48.949130,
            nome: "Av. Teste / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.383440,
            lng: -48.951080,
            nome: "Av. Teste / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.384580,
            lng: -48.952260,
            nome: "Av. Teste / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.386340,
            lng: -48.954010,
            nome: "Av. Teste / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.388130,
            lng: -48.955730,
            nome: "Av. Teste / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.390010,
            lng: -48.956380,
            nome: "R. Teste / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-06": [
        {
            lat: -16.394010,
            lng: -48.954180,
            nome: "Rua Teste 2 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.396118,
            lng: -48.953529,
            nome: "Av. Teste 2 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.398820, 
            lng: -48.947660,
            nome: "Av. Teste 2 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.401340,
            lng: -48.949130,
            nome: "Av. Teste 2 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.403440,
            lng: -48.951080,
            nome: "Av. Teste 2 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.404580,
            lng: -48.952260,
            nome: "Av. Teste 2 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.406340,
            lng: -48.954010,
            nome: "Av. Teste 2 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.408130,
            lng: -48.955730,
            nome: "Av. Teste 2 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.410010,
            lng: -48.956380,
            nome: "R. Teste 2 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
     "P-07": [
        {
            lat: -16.414010,
            lng: -48.954180,
            nome: "Rua Teste 3 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.416118,
            lng: -48.953529,
            nome: "Av. Teste 3 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.418820, 
            lng: -48.947660,
            nome: "Av. Teste 3 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.421340,
            lng: -48.949130,
            nome: "Av. Teste 3 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.423440,
            lng: -48.951080,
            nome: "Av. Teste 3 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.424580,
            lng: -48.952260,
            nome: "Av. Teste 3 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.426340,
            lng: -48.954010,
            nome: "Av. Teste 3 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.428130,
            lng: -48.955730,
            nome: "Av. Teste 3 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.430010,
            lng: -48.956380,
            nome: "R. Teste 3 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-08": [
        {
            lat: -16.434010,
            lng: -48.954180,
            nome: "Rua Teste 4 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.436118,
            lng: -48.953529,
            nome: "Av. Teste 4 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.438820, 
            lng: -48.947660,
            nome: "Av. Teste 4 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.441340,
            lng: -48.949130,
            nome: "Av. Teste 4 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.443440,
            lng: -48.951080,
            nome: "Av. Teste 4 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.444580,
            lng: -48.952260,
            nome: "Av. Teste 4 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.446340,
            lng: -48.954010,
            nome: "Av. Teste 4 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.448130,
            lng: -48.955730,
            nome: "Av. Teste 4 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.450010,
            lng: -48.956380,
            nome: "R. Teste 4 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-09": [
        {
            lat: -16.454010,
            lng: -48.954180,
            nome: "Rua Teste 5 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.456118,
            lng: -48.953529,
            nome: "Av. Teste 5 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.458820, 
            lng: -48.947660,
            nome: "Av. Teste 5 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.461340,
            lng: -48.949130,
            nome: "Av. Teste 5 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.463440,
            lng: -48.951080,
            nome: "Av. Teste 5 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.464580,
            lng: -48.952260,
            nome: "Av. Teste 5 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.466340,
            lng: -48.954010,
            nome: "Av. Teste 5 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.468130,
            lng: -48.955730,
            nome: "Av. Teste 5 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.470010,
            lng: -48.956380,
            nome: "R. Teste 5 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            se
