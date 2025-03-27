
import { TurnoRouteData } from "@/types/mapTypes";

// Importando rotas do 1° Turno (P)
import { routeDataP1 } from "./routeDataP1";
import { routeDataP2 } from "./routeDataP2";
import { routeDataP3 } from "./routeDataP3";
import { routeDataP4 } from "./routeDataP4";
import { routeDataP5 } from "./routeDataP5";
import { routeDataP6 } from "./routeDataP6";
import { routeDataP7 } from "./routeDataP7";
import { routeDataP8 } from "./routeDataP8";
import { routeDataP9 } from "./routeDataP9";
import { routeDataP10 } from "./routeDataP10";
import { routeDataP11 } from "./routeDataP11";
import { routeDataP12 } from "./routeDataP12";
import { routeDataP13 } from "./routeDataP13";
import { routeDataP14 } from "./routeDataP14";
import { routeDataP15 } from "./routeDataP15";

// Importando rotas do 2° Turno (S)
import { routeDataS01 } from "./routeDataS01";
import { routeDataS02 } from "./routeDataS02";
import { routeDataS03 } from "./routeDataS03";
import { routeDataS04 } from "./routeDataS04";
import { routeDataS05 } from "./routeDataS05";
import { routeDataS06 } from "./routeDataS06";
import { routeDataS07 } from "./routeDataS07";
import { routeDataS08 } from "./routeDataS08";
import { routeDataS09 } from "./routeDataS09";
import { routeDataS10 } from "./routeDataS10";
import { routeDataS11 } from "./routeDataS11";
import { routeDataS12 } from "./routeDataS12";

// Importando rotas do 3° Turno (T)
import { routeDataT01 } from "./routeDataT01";
import { routeDataT02 } from "./routeDataT02";
import { routeDataT03 } from "./routeDataT03";
import { routeDataT04 } from "./routeDataT04";
import { routeDataT05 } from "./routeDataT05";
import { routeDataT06 } from "./routeDataT06";
import { routeDataT07 } from "./routeDataT07";
import { routeDataT08 } from "./routeDataT08";

// Importando rotas Administrativas (ADM)
import { routeDataADM01 } from "./routeDataADM01";
import { routeDataADM02 } from "./routeDataADM02";
import { routeDataADM03 } from "./routeDataADM03";
import { routeDataADM04 } from "./routeDataADM04";
import { routeDataADM05 } from "./routeDataADM05";
import { routeDataADM06 } from "./routeDataADM06";
import { routeDataADM07 } from "./routeDataADM07";
import { routeDataADM08 } from "./routeDataADM08";

// Importando rotas de Goiânia (GYN ADM)
import { routeDataGYNADM01 } from "./routeDataGYNADM01";
import { routeDataGYNADM02 } from "./routeDataGYNADM02";

// Combinando rotas do 1° Turno
export const routeData1Turno = {
  ...routeDataP1,
  ...routeDataP2,
  ...routeDataP3,
  ...routeDataP4,
  ...routeDataP5,
  ...routeDataP6,
  ...routeDataP7,
  ...routeDataP8,
  ...routeDataP9,
  ...routeDataP10,
  ...routeDataP11,
  ...routeDataP12,
  ...routeDataP13,
  ...routeDataP14,
  ...routeDataP15,
};

// Combinando rotas do 2° Turno
export const routeData2Turno = {
  ...routeDataS01,
  ...routeDataS02,
  ...routeDataS03,
  ...routeDataS04,
  ...routeDataS05,
  ...routeDataS06,
  ...routeDataS07,
  ...routeDataS08,
  ...routeDataS09,
  ...routeDataS10,
  ...routeDataS11,
  ...routeDataS12,
};

// Combinando rotas do 3° Turno
export const routeData3Turno = {
  ...routeDataT01,
  ...routeDataT02,
  ...routeDataT03,
  ...routeDataT04,
  ...routeDataT05,
  ...routeDataT06,
  ...routeDataT07,
  ...routeDataT08,
};

// Combinando rotas Administrativas
export const routeDataAdm = {
  ...routeDataADM01,
  ...routeDataADM02,
  ...routeDataADM03,
  ...routeDataADM04,
  ...routeDataADM05,
  ...routeDataADM06,
  ...routeDataADM07,
  ...routeDataADM08,
};

// Combinando rotas de Goiânia
export const routeDataGyn = {
  ...routeDataGYNADM01,
  ...routeDataGYNADM02,
};

// Combinando todos os dados por turno
export const allRouteData: TurnoRouteData = {
  "1° Turno": routeData1Turno,
  "2° Turno": routeData2Turno,
  "3° Turno": routeData3Turno,
  "Administrativo": routeDataAdm,
  "Goiânia": routeDataGyn,
};

// Função para obter todos os turnos disponíveis
export const getAvailableTurnos = (): string[] => {
  return Object.keys(allRouteData);
};

// Função para obter todas as rotas disponíveis para um turno específico
export const getAvailableRoutes = (turno: string): string[] => {
  if (!allRouteData[turno]) return [];
  return Object.keys(allRouteData[turno]);
};
