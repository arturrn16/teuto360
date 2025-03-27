import { BusStop, RouteData, TurnoRouteData } from "../types/mapTypes";
import { routeDataP5toP10 } from "./routeData-p5-p10";
import { routeDataP11toP15 } from "./routeData-p11-p15";
import { routeDataS12 } from "./routeData-s12";

// Sample data for bus stops (you can replace this with your actual data)
const busStopsP01: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "P-01 Test Stop 1", bairro: "Centro", semana: "07:00", sabado: "08:00" },
  { lat: -16.330200, lng: -48.951000, nome: "P-01 Test Stop 2", bairro: "Setor Oeste", semana: "07:15", sabado: "08:15" },
];

const busStopsP02: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "P-02 Test Stop 1", bairro: "Jundiaí", semana: "07:30", sabado: "08:30" },
  { lat: -16.315000, lng: -48.955000, nome: "P-02 Test Stop 2", bairro: "Vila Nova", semana: "07:45", sabado: "08:45" },
];

const busStopsS01: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "S-01 Test Stop 1", bairro: "Centro", semana: "13:00", sabado: "14:00" },
  { lat: -16.330200, lng: -48.951000, nome: "S-01 Test Stop 2", bairro: "Setor Oeste", semana: "13:15", sabado: "14:15" },
];

const busStopsS02: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "S-02 Test Stop 1", bairro: "Jundiaí", semana: "13:30", sabado: "14:30" },
  { lat: -16.315000, lng: -48.955000, nome: "S-02 Test Stop 2", bairro: "Vila Nova", semana: "13:45", sabado: "14:45" },
];

const busStopsS03: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "S-03 Test Stop 1", bairro: "Centro", semana: "13:00", sabado: "14:00" },
  { lat: -16.330200, lng: -48.951000, nome: "S-03 Test Stop 2", bairro: "Setor Oeste", semana: "13:15", sabado: "14:15" },
];

const busStopsS04: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "S-04 Test Stop 1", bairro: "Jundiaí", semana: "13:30", sabado: "14:30" },
  { lat: -16.315000, lng: -48.955000, nome: "S-04 Test Stop 2", bairro: "Vila Nova", semana: "13:45", sabado: "14:45" },
];

const busStopsS05: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "S-05 Test Stop 1", bairro: "Centro", semana: "13:00", sabado: "14:00" },
  { lat: -16.330200, lng: -48.951000, nome: "S-05 Test Stop 2", bairro: "Setor Oeste", semana: "13:15", sabado: "14:15" },
];

const busStopsS06: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "S-06 Test Stop 1", bairro: "Jundiaí", semana: "13:30", sabado: "14:30" },
  { lat: -16.315000, lng: -48.955000, nome: "S-06 Test Stop 2", bairro: "Vila Nova", semana: "13:45", sabado: "14:45" },
];

const busStopsS07: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "S-07 Test Stop 1", bairro: "Centro", semana: "13:00", sabado: "14:00" },
  { lat: -16.330200, lng: -48.951000, nome: "S-07 Test Stop 2", bairro: "Setor Oeste", semana: "13:15", sabado: "14:15" },
];

const busStopsS08: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "S-08 Test Stop 1", bairro: "Jundiaí", semana: "13:30", sabado: "14:30" },
  { lat: -16.315000, lng: -48.955000, nome: "S-08 Test Stop 2", bairro: "Vila Nova", semana: "13:45", sabado: "14:45" },
];

const busStopsS09: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "S-09 Test Stop 1", bairro: "Centro", semana: "13:00", sabado: "14:00" },
  { lat: -16.330200, lng: -48.951000, nome: "S-09 Test Stop 2", bairro: "Setor Oeste", semana: "13:15", sabado: "14:15" },
];

const busStopsS10: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "S-10 Test Stop 1", bairro: "Jundiaí", semana: "13:30", sabado: "14:30" },
  { lat: -16.315000, lng: -48.955000, nome: "S-10 Test Stop 2", bairro: "Vila Nova", semana: "13:45", sabado: "14:45" },
];

const busStopsS11: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "S-11 Test Stop 1", bairro: "Centro", semana: "13:00", sabado: "14:00" },
  { lat: -16.330200, lng: -48.951000, nome: "S-11 Test Stop 2", bairro: "Setor Oeste", semana: "13:15", sabado: "14:15" },
];

const busStopsT01: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "T-01 Test Stop 1", bairro: "Centro", semana: "19:00", sabado: "20:00" },
  { lat: -16.330200, lng: -48.951000, nome: "T-01 Test Stop 2", bairro: "Setor Oeste", semana: "19:15", sabado: "20:15" },
];

const busStopsT02: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "T-02 Test Stop 1", bairro: "Jundiaí", semana: "19:30", sabado: "20:30" },
  { lat: -16.315000, lng: -48.955000, nome: "T-02 Test Stop 2", bairro: "Vila Nova", semana: "19:45", sabado: "20:45" },
];

const busStopsT03: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "T-03 Test Stop 1", bairro: "Centro", semana: "19:00", sabado: "20:00" },
  { lat: -16.330200, lng: -48.951000, nome: "T-03 Test Stop 2", bairro: "Setor Oeste", semana: "19:15", sabado: "20:15" },
];

const busStopsT04: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "T-04 Test Stop 1", bairro: "Jundiaí", semana: "19:30", sabado: "20:30" },
  { lat: -16.315000, lng: -48.955000, nome: "T-04 Test Stop 2", bairro: "Vila Nova", semana: "19:45", sabado: "20:45" },
];

const busStopsT05: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "T-05 Test Stop 1", bairro: "Centro", semana: "19:00", sabado: "20:00" },
  { lat: -16.330200, lng: -48.951000, nome: "T-05 Test Stop 2", bairro: "Setor Oeste", semana: "19:15", sabado: "20:15" },
];

const busStopsT06: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "T-06 Test Stop 1", bairro: "Jundiaí", semana: "19:30", sabado: "20:30" },
  { lat: -16.315000, lng: -48.955000, nome: "T-06 Test Stop 2", bairro: "Vila Nova", semana: "19:45", sabado: "20:45" },
];

const busStopsT07: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "T-07 Test Stop 1", bairro: "Centro", semana: "19:00", sabado: "20:00" },
  { lat: -16.330200, lng: -48.951000, nome: "T-07 Test Stop 2", bairro: "Setor Oeste", semana: "19:15", sabado: "20:15" },
];

const busStopsT08: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "T-08 Test Stop 1", bairro: "Jundiaí", semana: "19:30", sabado: "20:30" },
  { lat: -16.315000, lng: -48.955000, nome: "T-08 Test Stop 2", bairro: "Vila Nova", semana: "19:45", sabado: "20:45" },
];

const busStopsA01: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "A-01 Test Stop 1", bairro: "Centro", semana: "08:00", sabado: "Não Funciona" },
  { lat: -16.330200, lng: -48.951000, nome: "A-01 Test Stop 2", bairro: "Setor Oeste", semana: "08:15", sabado: "Não Funciona" },
];

const busStopsA02: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "A-02 Test Stop 1", bairro: "Jundiaí", semana: "08:30", sabado: "Não Funciona" },
  { lat: -16.315000, lng: -48.955000, nome: "A-02 Test Stop 2", bairro: "Vila Nova", semana: "08:45", sabado: "Não Funciona" },
];

const busStopsA03: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "A-03 Test Stop 1", bairro: "Centro", semana: "08:00", sabado: "Não Funciona" },
  { lat: -16.330200, lng: -48.951000, nome: "A-03 Test Stop 2", bairro: "Setor Oeste", semana: "08:15", sabado: "Não Funciona" },
];

const busStopsA04: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "A-04 Test Stop 1", bairro: "Jundiaí", semana: "08:30", sabado: "Não Funciona" },
  { lat: -16.315000, lng: -48.955000, nome: "A-04 Test Stop 2", bairro: "Vila Nova", semana: "08:45", sabado: "Não Funciona" },
];

const busStopsA05: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "A-05 Test Stop 1", bairro: "Centro", semana: "08:00", sabado: "Não Funciona" },
  { lat: -16.330200, lng: -48.951000, nome: "A-05 Test Stop 2", bairro: "Setor Oeste", semana: "08:15", sabado: "Não Funciona" },
];

const busStopsA06: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "A-06 Test Stop 1", bairro: "Jundiaí", semana: "08:30", sabado: "Não Funciona" },
  { lat: -16.315000, lng: -48.955000, nome: "A-06 Test Stop 2", bairro: "Vila Nova", semana: "08:45", sabado: "Não Funciona" },
];

const busStopsA07: BusStop[] = [
  { lat: -16.328118, lng: -48.953529, nome: "A-07 Test Stop 1", bairro: "Centro", semana: "08:00", sabado: "Não Funciona" },
  { lat: -16.330200, lng: -48.951000, nome: "A-07 Test Stop 2", bairro: "Setor Oeste", semana: "08:15", sabado: "Não Funciona" },
];

const busStopsA08: BusStop[] = [
  { lat: -16.310000, lng: -48.960000, nome: "A-08 Test Stop 1", bairro: "Jundiaí", semana: "08:30", sabado: "Não Funciona" },
  { lat: -16.315000, lng: -48.955000, nome: "A-08 Test Stop 2", bairro: "Vila Nova", semana: "08:45", sabado: "Não Funciona" },
];

export const allRouteData: TurnoRouteData = {
  "1° Turno": {
    "P-01": busStopsP01,
    "P-02": busStopsP02,
    "P-05": routeDataP5toP10["P-05"],
    "P-06": routeDataP5toP10["P-06"],
    "P-07": routeDataP5toP10["P-07"],
    "P-08": routeDataP5toP10["P-08"],
    "P-09": routeDataP5toP10["P-09"],
    "P-10": routeDataP5toP10["P-10"],
    "P-11": routeDataP11toP15["P-11"],
    "P-12": routeDataP11toP15["P-12"],
    "P-13": routeDataP11toP15["P-13"],
    "P-14": routeDataP11toP15["P-14"],
    "P-15": routeDataP11toP15["P-15"],
  },
  
  "2° Turno": {
    "S-01": busStopsS01,
    "S-02": busStopsS02,
    "S-03": busStopsS03,
    "S-04": busStopsS04,
    "S-05": busStopsS05,
    "S-06": busStopsS06,
    "S-07": busStopsS07,
    "S-08": busStopsS08,
    "S-09": busStopsS09,
    "S-10": busStopsS10,
    "S-11": busStopsS11,
    "S-12": routeDataS12
  },
  
  "3° Turno": {
    "T-01": busStopsT01,
    "T-02": busStopsT02,
    "T-03": busStopsT03,
    "T-04": busStopsT04,
    "T-05": busStopsT05,
    "T-06": busStopsT06,
    "T-07": busStopsT07,
    "T-08": busStopsT08,
  },
  
  "Administrativo": {
    "A-01": busStopsA01,
    "A-02": busStopsA02,
    "A-03": busStopsA03,
    "A-04": busStopsA04,
    "A-05": busStopsA05,
    "A-06": busStopsA06,
    "A-07": busStopsA07,
    "A-08": busStopsA08,
  }
};

export const getAvailableTurnos = (): string[] => {
  return Object.keys(allRouteData);
};

export const getAvailableRoutes = (turno: string): string[] => {
  const turnoData = allRouteData[turno];
  return turnoData ? Object.keys(turnoData) : [];
};
