
import { TurnoRouteData, RouteData, BusStop } from "@/types/mapTypes";

// Import route data from other files
import { primeiroTurnoRoutes } from "./routeData-p1-p15";
import { segundoTurnoRoutes } from "./routeData-s1-s12";

// All route data organized by shift
export const allRouteData: TurnoRouteData = {
  "1° Turno": primeiroTurnoRoutes,
  "2° Turno": segundoTurnoRoutes,
  "3° Turno": {},
  "Administrativo": {}
};

// Helper function to get available shifts
export const getAvailableTurnos = (): string[] => {
  return Object.keys(allRouteData);
};

// Helper function to get available routes for a specific shift
export const getAvailableRoutes = (turno: string): string[] => {
  const routes = allRouteData[turno] || {};
  return Object.keys(routes);
};
