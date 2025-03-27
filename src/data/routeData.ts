
import { TurnoRouteData } from "@/types/mapTypes";
import { firstTurnoRoutesP1toP4 } from "./routeData-p1-p4";
import { firstTurnoRoutesP5toP10 } from "./routeData-p5-p10";
import { firstTurnoRoutesP11toP15 } from "./routeData-p11-p15";
import { secondTurnoRoutesS1toS11 } from "./routeData-s1-s11";
import { secondTurnoRoutesS12 } from "./routeData-s12";

// Combine all route data into a single object
export const allRouteData: TurnoRouteData = {
  "1° Turno": {
    ...firstTurnoRoutesP1toP4,
    ...firstTurnoRoutesP5toP10,
    ...firstTurnoRoutesP11toP15
  },
  "2° Turno": {
    ...secondTurnoRoutesS1toS11,
    ...secondTurnoRoutesS12
  },
  "3° Turno": {},
  "Administrativo": {}
};

// Function to get available shift options
export const getAvailableTurnos = () => {
  return Object.keys(allRouteData);
};

// Function to get available routes for a specific shift
export const getAvailableRoutes = (turno: string) => {
  const routes = allRouteData[turno] || {};
  return Object.keys(routes);
};
