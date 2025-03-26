
export interface BusStop {
  lat: number;
  lng: number;
  nome: string;
  bairro: string;
  semana: string;
  sabado: string;
}

export interface RouteData {
  [routeId: string]: BusStop[];
}

export interface TurnoRouteData {
  [turno: string]: RouteData;
}
