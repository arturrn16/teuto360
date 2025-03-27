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
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-10": [
        {
            lat: -16.474010,
            lng: -48.954180,
            nome: "Rua Teste 6 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.476118,
            lng: -48.953529,
            nome: "Av. Teste 6 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.478820, 
            lng: -48.947660,
            nome: "Av. Teste 6 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.481340,
            lng: -48.949130,
            nome: "Av. Teste 6 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.483440,
            lng: -48.951080,
            nome: "Av. Teste 6 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.484580,
            lng: -48.952260,
            nome: "Av. Teste 6 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.486340,
            lng: -48.954010,
            nome: "Av. Teste 6 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.488130,
            lng: -48.955730,
            nome: "Av. Teste 6 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.490010,
            lng: -48.956380,
            nome: "R. Teste 6 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-11": [
        {
            lat: -16.494010,
            lng: -48.954180,
            nome: "Rua Teste 7 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.496118,
            lng: -48.953529,
            nome: "Av. Teste 7 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.498820, 
            lng: -48.947660,
            nome: "Av. Teste 7 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.501340,
            lng: -48.949130,
            nome: "Av. Teste 7 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.503440,
            lng: -48.951080,
            nome: "Av. Teste 7 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.504580,
            lng: -48.952260,
            nome: "Av. Teste 7 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.506340,
            lng: -48.954010,
            nome: "Av. Teste 7 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.508130,
            lng: -48.955730,
            nome: "Av. Teste 7 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.510010,
            lng: -48.956380,
            nome: "R. Teste 7 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-12": [
        {
            lat: -16.514010,
            lng: -48.954180,
            nome: "Rua Teste 8 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.516118,
            lng: -48.953529,
            nome: "Av. Teste 8 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.518820, 
            lng: -48.947660,
            nome: "Av. Teste 8 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.521340,
            lng: -48.949130,
            nome: "Av. Teste 8 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.523440,
            lng: -48.951080,
            nome: "Av. Teste 8 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.524580,
            lng: -48.952260,
            nome: "Av. Teste 8 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.526340,
            lng: -48.954010,
            nome: "Av. Teste 8 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.528130,
            lng: -48.955730,
            nome: "Av. Teste 8 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.530010,
            lng: -48.956380,
            nome: "R. Teste 8 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-13": [
        {
            lat: -16.534010,
            lng: -48.954180,
            nome: "Rua Teste 9 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.536118,
            lng: -48.953529,
            nome: "Av. Teste 9 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.538820, 
            lng: -48.947660,
            nome: "Av. Teste 9 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.541340,
            lng: -48.949130,
            nome: "Av. Teste 9 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.543440,
            lng: -48.951080,
            nome: "Av. Teste 9 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.544580,
            lng: -48.952260,
            nome: "Av. Teste 9 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.546340,
            lng: -48.954010,
            nome: "Av. Teste 9 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.548130,
            lng: -48.955730,
            nome: "Av. Teste 9 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.550010,
            lng: -48.956380,
            nome: "R. Teste 9 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-14": [
        {
            lat: -16.554010,
            lng: -48.954180,
            nome: "Rua Teste 10 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.556118,
            lng: -48.953529,
            nome: "Av. Teste 10 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.558820, 
            lng: -48.947660,
            nome: "Av. Teste 10 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.561340,
            lng: -48.949130,
            nome: "Av. Teste 10 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.563440,
            lng: -48.951080,
            nome: "Av. Teste 10 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.564580,
            lng: -48.952260,
            nome: "Av. Teste 10 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.566340,
            lng: -48.954010,
            nome: "Av. Teste 10 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.568130,
            lng: -48.955730,
            nome: "Av. Teste 10 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.570010,
            lng: -48.956380,
            nome: "R. Teste 10 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ],
    "P-15": [
        {
            lat: -16.574010,
            lng: -48.954180,
            nome: "Rua Teste 11 / Paróquia São Francisco de Assis",
            bairro: "Jundiaí",
            semana: "06:02:00",
            sabado: "06:42:00"
        },
        {
            lat: -16.576118,
            lng: -48.953529,
            nome: "Av. Teste 11 / Esquina com a Rua 21 de Abril",
            bairro: "Jundiaí",
            semana: "06:04:00",
            sabado: "06:44:00"
        },
        {
            lat: -16.578820, 
            lng: -48.947660,
            nome: "Av. Teste 11 / Esquina com a R. Pedro Braz de Queirós",
            bairro: "Jundiaí",
            semana: "06:06:00",
            sabado: "06:46:00"
        },
        {
            lat: -16.581340,
            lng: -48.949130,
            nome: "Av. Teste 11 / Esquina com a Rua 2",
            bairro: "Vila Góis",
            semana: "06:08:00",
            sabado: "06:48:00"
        },
        {
            lat: -16.583440,
            lng: -48.951080,
            nome: "Av. Teste 11 / Igreja Universal",
            bairro: "Maracanã",
            semana: "06:10:00",
            sabado: "06:50:00"
        },
        {
            lat: -16.584580,
            lng: -48.952260,
            nome: "Av. Teste 11 / Esquina com a R. Izac Ferreira",
            bairro: "Maracanazinho",
            semana: "06:12:00",
            sabado: "06:52:00"
        },
        {
            lat: -16.586340,
            lng: -48.954010,
            nome: "Av. Teste 11 / Esquina com a R. José Neto Paranhos",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:14:00",
            sabado: "06:54:00"
        },
        {
            lat: -16.588130,
            lng: -48.955730,
            nome: "Av. Teste 11 / Esquina com a R. 14",
            bairro: "Vila Nossa Senhora D'Abadia",
            semana: "06:16:00",
            sabado: "06:56:00"
        },
        {
            lat: -16.590010,
            lng: -48.956380,
            nome: "R. Teste 11 / Esquina com a R. Aderbal",
            bairro: "Vila Brasil",
            semana: "06:18:00",
            sabado: "06:58:00"
        }
    ]
};

// Second Shift (2° Turno) routes - S-01 to S-12
const secondTurnoRoutes = {
    "S-01": [],
    "S-02": [],
    "S-03": [],
    "S-04": [],
    "S-05": [],
    "S-06": [],
    "S-07": [],
    "S-08": [],
    "S-09": [],
    "S-10": [],
    "S-11": [],
    "S-12": [
        {
            lat: -16.320400,
            lng: -48.939060,
            nome: "S-12-01 - Av. Dona Elvira / Esquina com a R. Joaquim Esperidião",
            bairro: "São Carlos",
            semana: "12:55:00",
            sabado: "09:35:00"
        },
        {
            lat: -16.325230,
            lng: -48.927620,
            nome: "S-12-02 - Av. Eng. Geraldo de Pina / Esquina com a R. S-51",
            bairro: "Anápolis City",
            semana: "13:00:00",
            sabado: "09:40:00"
        },
        {
            lat: -16.325450,
            lng: -48.923930,
            nome: "S-12-03 - Av. Mato Grosso / ( Posto City )",
            bairro: "Anápolis City",
            semana: "13:00:00",
            sabado: "09:40:00"
        },
        {
            lat: -16.311430,
            lng: -48.921130,
            nome: "S-12-04 - R. dos Coqueirais, 201 / Esquina com a Av. Cerejeiras",
            bairro: "Residencial das Cerejeiras",
            semana: "13:03:00",
            sabado: "09:43:00"
        },
        {
            lat: -16.320830,
            lng: -48.917080,
            nome: "S-12-05 - Av. Ayrton Senna da Silva / Esquina com a R. PB 17",
            bairro: "Parque Brasilia 2A Etapa",
            semana: "13:08:00",
            sabado: "09:48:00"
        },
        {
            lat: -16.319220,
            lng: -48.914360,
            nome: "S-12-06 - Av. Ayrton Senna da Silva / Esquina com a R. PB 50",
            bairro: "Parque Sao Jeronimo",
            semana: "13:09:00",
            sabado: "09:49:00"
        },
        {
            lat: -16.317270,
            lng: -48.907100,
            nome: "S-12-07 - R. MN 3 / Esquina com a R. MN 18",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:10:00",
            sabado: "09:50:00"
        },
        {
            lat: -16.316720,
            lng: -48.904600,
            nome: "S-12-08 - Av. Jorn Euripedes G Melo / Esquina com a R. Dr. Zico Faria",
            bairro: "Jardim Itália",
            semana: "13:12:00",
            sabado: "09:52:00"
        },
        {
            lat: -16.319000,
            lng: -48.902800,
            nome: "S-12-09 - Av. Jorn. Eurípedes Gomes de Melo / Esquina com a R. Zacarias Elias",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:12:00",
            sabado: "09:52:00"
        },
        {
            lat: -16.323620,
            lng: -48.904050,
            nome: "S-12-10 - R. Napoli - Jardim Itália/Esquina com a R.Cantazaro",
            bairro: "Jardim Itália",
            semana: "13:14:00",
            sabado: "09:54:00"
        },
        {
            lat: -16.317230,
            lng: -48.900220,
            nome: "S-12-11 - Av. das Laranjeiras / Esquina com a Av. Pinheiro",
            bairro: "Gran Ville",
            semana: "13:17:00",
            sabado: "09:57:00"
        },
        {
            lat: -16.312340,
            lng: -48.910880,
            nome: "S-12-12 - R. Zacarias Elias / Com a Av. Comendador Jose Abidala",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:24:00",
            sabado: "10:04:00"
        },
        {
            lat: -16.315370,
            lng: -48.908690,
            nome: "S-12-13 - Av. Ayrton Senna da Silva / Esquina com a MN3",
            bairro: "Parque Sao Jeronimo",
            semana: "13:25:00",
            sabado: "10:05:00"
        },
        {
            lat: -16.311970,
            lng: -48.904400,
            nome: "S-12-14 - Av. Comendador José Abdala / Esquina com a Av. Ayrton Senna da Silva",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:26:00",
            sabado: "10:06:00"
        },
        {
            lat: -16.310620,
            lng: -48.902810,
            nome: "S-12-15 - Av. Ayrton Senna da Silva / Esquina com a R. Antônio de Souza França",
            bairro: "Parque Sao Jeronimo",
            semana: "13:27:00",
            sabado: "10:07:00"
        },
        {
            lat: -16.303070,
            lng: -48.898030,
            nome: "S-12-16 - R. JP 3 / Esquina com a Rua JP 10",
            bairro: "Jardim Primavera 1A Etapa",
            semana: "13:29:00",
            sabado: "10:09:00"
        },
        {
            lat: -16.301100,
            lng: -48.895790,
            nome: "S-12-17 - R. Jp 3 / Com a Rua JP 14",
            bairro: "Jardim Primavera I",
            semana: "13:30:00",
            sabado: "10:10:00"
        },
        {
            lat: -16.303230,
            lng: -48.894060,
            nome: "S-12-18 - R. JP 39 / Esquina com a Av. Ayrton Senna da Silva",
            bairro: "Jardim Primavera 2A Etapa",
            semana: "13:30:00",
            sabado: "10:10:00"
        },
        {
            lat: -16.304610,
            lng: -48.890760,
            nome: "S-12-19 - R. Jp 39 / Esquina com a R. Jp 47",
            bairro: "Jardim Primavera II",
            semana: "13:31:00",
            sabado: "10:11:00"
        },
        {
            lat: -16.302490,
            lng: -48.887560,
            nome: "S-12-20 - Av. Jp 34 / Com a Rua JP 52",
            bairro: "Jardim Primavera II",
            semana: "13:33:00",
            sabado: "10:13:00"
        },
        {
            lat: -16.301070,
            lng: -48.891050,
            nome: "S-12-21 - Av. JP 34 / Com a Rua JP 59",
            bairro: "Jardim Primavera 2A Etapa",
            semana: "13:34:00",
            sabado: "10:14:00"
        },
        {
            lat: -16.304380,
            lng: -48.895860,
            nome: "S-12-22 - Av. Ayrton Senna da Silva / Esquina com a R. JP 30",
            bairro: "Jardim Primavera 1A Etapa",
            semana: "13:36:00",
            sabado: "10:16:00"
        },
        {
            lat: -16.315240,
            lng: -48.899610,
            nome: "S-12-23 - Av. Sérvio Túlio Jayme / Esquina com a R. Antônio Pio",
            bairro: "Conj. Hab. Filostro Machado Carneiro",
            semana: "13:38:00",
            sabado: "10:18:00"
        },
        {
            lat: -16.326950,
            lng: -48.893800,
            nome: "S-12-24 - Av. Sérvio Túlio Jayme / Esquina com a R. I-8",
            bairro: "Anápolis",
            semana: "13:40:00",
            sabado: "10:20:00"
        },
        {
            lat: -16.333460,
            lng: -48.901560,
            nome: "S-12-25 - Av. Independência / Esquina com a Av. Ilda Gonçalves Ferreira",
            bairro: "Jardim Ibirapuera",
            semana: "13:43:00",
            sabado: "10:23:00"
        },
        {
            lat: -16.329950,
            lng: -48.909660,
            nome: "S-12-26 - Av. Independência / Esquina com a R. PB 27",
            bairro: "Jardim Ibirapuera",
            semana: "13:44:00",
            sabado: "10:24:00"
        },
        {
            lat: -16.329380,
            lng: -48.913590,
            nome: "S-12-27 - Av. Independência / Esquina com a R. PB 22",
            bairro: "Jardim Ibirapuera",
            semana: "13:45:00",
            sabado: "10:25:00"
        },
        {
            lat: -16.331460,
            lng: -48.918820,
            nome: "S-12-28 - Av. Comercial / Esquina com a Rua 10",
            bairro: "Lourdes",
            semana: "13:48:00",
            sabado: "10:28:00"
        },
        {
            lat: -16.335030,
            lng: -48.920940,
            nome: "S-12-29 - Av. Angélica / Esquina com a Av. Patriarca",
            bairro: "Lourdes",
            semana: "13:50:00",
            sabado: "10:30:00"
        },
        {
            lat: -16.336680,
            lng: -48.918630,
            nome: "S-12-30 - Av. Comercial / Esquina com a Av. Angélica",
            bairro: "Lourdes",
            semana: "13:50:00",
            sabado: "10:30:00"
        },
        {
            lat: -16.338930,
            lng: -48.918510,
            nome: "S-12-31 - Av. Comercial / Com a Rua 14",
            bairro: "Lourdes",
            semana: "13:51:00",
            sabado: "10:31:00"
        },
        {
            lat: -16.342890,
            lng: -48.918330,
            nome: "S-12-32 - Av. Comercial / Com a Rua 15",
            bairro: "Lourdes",
            semana: "13:52:00",
            sabado: "10:32:00"
        },
        {
            lat: -16.343010,
            lng: -48.920710,
            nome: "S-12-33 - R. 15 / Esquina com a Av. Patriarca",
            bairro: "Lourdes",
            semana: "13:53:00",
            sabado: "10:33:00"
        },
        {
            lat: -16.346930,
            lng: -48.920590,
            nome: "S-12-34 - Av. Patriarca / Esquina com a Rua 17",
            bairro: "Lourdes",
            semana: "13:53:00",
            sabado: "10:33:00"
        },
        {
            lat: -16.348880,
            lng: -48.920720,
            nome: "S-12-35 - Av. Patriarca / Esquina com a R. 19",
            bairro: "Lourdes",
            semana: "13:54:00",
            sabado: "10:34:00"
        },
        {
            lat: -16.348930,
            lng: -48.916420,
            nome: "S-12-36 - Av. Brasil / Esquina com a R. 23",
            bairro: "Chácaras Americanas",
            semana: "13:55:00",
            sabado: "10:35:00"
        },
        {
            lat: -16.407150,
            lng: -48.919910,
            nome: "S-12-37 - Viela Vp / Laboratório Teuto",
            bairro: "Distrito Agroindustrial de Anápolis",
            semana: "14:09:00",
            sabado: "10:49:00"
        }
    ]
};

// Third Shift (3° Turno) routes
const thirdTurnoRoutes = {
    "T-01": [],
    "T-02": [],
    "T-03": [],
    "T-04": [],
    "T-05": []
};

// Administrative routes
const administrativeRoutes = {
    "A-01": [],
    "A-02": [],
    "A-03": []
};

// Combine all routes into one object
export const allRouteData = {
    "1° Turno": firstTurnoRoutes,
    "2° Turno": secondTurnoRoutes,
    "3° Turno": thirdTurnoRoutes,
    "Administrativo": administrativeRoutes
};

// Helper functions for getting available turnos and routes
export const getAvailableTurnos = () => {
    return Object.keys(allRouteData);
};

export const getAvailableRoutes = (turno: string) => {
    const routes = allRouteData[turno as keyof typeof allRouteData];
    return routes ? Object.keys(routes) : [];
};
