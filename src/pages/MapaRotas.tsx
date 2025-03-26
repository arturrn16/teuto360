import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin, Bus, Clock, Search, Flag } from "lucide-react";
import { toast } from "sonner";

// Type definitions for the bus stops
interface BusStop {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  weekdayTime: string;
  saturdayTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RouteData {
  id: string;
  name: string;
  color: string;
  stops: BusStop[];
}

const MapaRotas = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const addressMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const startFlagRef = useRef<google.maps.Marker | null>(null);
  const endFlagRef = useRef<google.maps.Marker | null>(null);
  
  const [address, setAddress] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedTurno, setSelectedTurno] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  // Routes data - these are all the routes with their stops
  const routes: RouteData[] = useMemo(() => [
    {
      id: "P-01",
      name: "Rota P-01",
      color: "#FF0000", // Red
      stops: [
        { id: "P-01 01", name: "P-01 01", address: "Av. Bandeirantes / Esquina com a Rua 14", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:00", saturdayTime: "06:00", coordinates: { lat: -16.314010, lng: -48.953230 } },
        { id: "P-01 02", name: "P-01 02", address: "Av. Bandeirantes / Esquina com a Rua 19", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:02", saturdayTime: "06:02", coordinates: { lat: -16.316830, lng: -48.954620 } },
        { id: "P-01 03", name: "P-01 03", address: "Av. Bandeirantes / Esquina com a Rua 25", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:04", saturdayTime: "06:04", coordinates: { lat: -16.319650, lng: -48.956010 } },
        { id: "P-01 04", name: "P-01 04", address: "Av. Bandeirantes / Esquina com a Rua 29", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:06", saturdayTime: "06:06", coordinates: { lat: -16.322470, lng: -48.957400 } },
        { id: "P-01 05", name: "P-01 05", address: "Av. Bandeirantes / Esquina com a Rua 33", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:08", saturdayTime: "06:08", coordinates: { lat: -16.325290, lng: -48.958790 } },
        { id: "P-01 06", name: "P-01 06", address: "Av. Bandeirantes / Esquina com a Rua 37", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:10", saturdayTime: "06:10", coordinates: { lat: -16.328110, lng: -48.960180 } },
        { id: "P-01 07", name: "P-01 07", address: "Av. Bandeirantes / Esquina com a Rua 41", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:12", saturdayTime: "06:12", coordinates: { lat: -16.330930, lng: -48.961570 } },
        { id: "P-01 08", name: "P-01 08", address: "Av. Bandeirantes / Esquina com a Rua 45", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:14", saturdayTime: "06:14", coordinates: { lat: -16.333750, lng: -48.962960 } },
        { id: "P-01 09", name: "P-01 09", address: "Av. Bandeirantes / Esquina com a Rua 49", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:16", saturdayTime: "06:16", coordinates: { lat: -16.336570, lng: -48.964350 } },
        { id: "P-01 10", name: "P-01 10", address: "Av. Bandeirantes / Esquina com a Rua 53", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:18", saturdayTime: "06:18", coordinates: { lat: -16.339390, lng: -48.965740 } },
        { id: "P-01 11", name: "P-01 11", address: "Av. Bandeirantes / Esquina com a Rua 57", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:20", saturdayTime: "06:20", coordinates: { lat: -16.342210, lng: -48.967130 } },
        { id: "P-01 12", name: "P-01 12", address: "Av. Bandeirantes / Esquina com a Rua 61", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:22", saturdayTime: "06:22", coordinates: { lat: -16.345030, lng: -48.968520 } },
        { id: "P-01 13", name: "P-01 13", address: "Av. Bandeirantes / Esquina com a Rua 65", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:24", saturdayTime: "06:24", coordinates: { lat: -16.347850, lng: -48.969910 } },
        { id: "P-01 14", name: "P-01 14", address: "Av. Bandeirantes / Esquina com a Rua 69", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:26", saturdayTime: "06:26", coordinates: { lat: -16.350670, lng: -48.971300 } },
        { id: "P-01 15", name: "P-01 15", address: "Av. Bandeirantes / Esquina com a Rua 73", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:28", saturdayTime: "06:28", coordinates: { lat: -16.353490, lng: -48.972690 } },
        { id: "P-01 16", name: "P-01 16", address: "Av. Bandeirantes / Esquina com a Rua 77", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:30", saturdayTime: "06:30", coordinates: { lat: -16.356310, lng: -48.974080 } },
        { id: "P-01 17", name: "P-01 17", address: "Av. Bandeirantes / Esquina com a Rua 81", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:32", saturdayTime: "06:32", coordinates: { lat: -16.359130, lng: -48.975470 } },
        { id: "P-01 18", name: "P-01 18", address: "Av. Bandeirantes / Esquina com a Rua 85", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:34", saturdayTime: "06:34", coordinates: { lat: -16.361950, lng: -48.976860 } },
        { id: "P-01 19", name: "P-01 19", address: "Av. Bandeirantes / Esquina com a Rua 89", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:36", saturdayTime: "06:36", coordinates: { lat: -16.364770, lng: -48.978250 } },
        { id: "P-01 20", name: "P-01 20", address: "Av. Bandeirantes / Esquina com a Rua 93", neighborhood: "Jardim Bandeirantes", weekdayTime: "05:38", saturdayTime: "06:38", coordinates: { lat: -16.367590, lng: -48.979640 } }
      ]
    },
    {
      id: "P-02",
      name: "Rota P-02",
      color: "#0000FF", // Blue
      stops: [
        { id: "P-02 01", name: "P-02 01", address: "Av. Brasil / Esquina com a Rua 1", neighborhood: "Centro", weekdayTime: "05:15", saturdayTime: "06:15", coordinates: { lat: -16.314010, lng: -48.953230 } },
        { id: "P-02 02", name: "P-02 02", address: "Av. Brasil / Esquina com a Rua 2", neighborhood: "Centro", weekdayTime: "05:17", saturdayTime: "06:17", coordinates: { lat: -16.316830, lng: -48.954620 } },
        { id: "P-02 03", name: "P-02 03", address: "Av. Brasil / Esquina com a Rua 3", neighborhood: "Centro", weekdayTime: "05:19", saturdayTime: "06:19", coordinates: { lat: -16.319650, lng: -48.956010 } },
        { id: "P-02 04", name: "P-02 04", address: "Av. Brasil / Esquina com a Rua 4", neighborhood: "Centro", weekdayTime: "05:21", saturdayTime: "06:21", coordinates: { lat: -16.322470, lng: -48.957400 } },
        { id: "P-02 05", name: "P-02 05", address: "Av. Brasil / Esquina com a Rua 5", neighborhood: "Centro", weekdayTime: "05:23", saturdayTime: "06:23", coordinates: { lat: -16.325290, lng: -48.958790 } },
        { id: "P-02 06", name: "P-02 06", address: "Av. Brasil / Esquina com a Rua 6", neighborhood: "Centro", weekdayTime: "05:25", saturdayTime: "06:25", coordinates: { lat: -16.328110, lng: -48.960180 } },
        { id: "P-02 07", name: "P-02 07", address: "Av. Brasil / Esquina com a Rua 7", neighborhood: "Centro", weekdayTime: "05:27", saturdayTime: "06:27", coordinates: { lat: -16.330930, lng: -48.961570 } },
        { id: "P-02 08", name: "P-02 08", address: "Av. Brasil / Esquina com a Rua 8", neighborhood: "Centro", weekdayTime: "05:29", saturdayTime: "06:29", coordinates: { lat: -16.333750, lng: -48.962960 } },
        { id: "P-02 09", name: "P-02 09", address: "Av. Brasil / Esquina com a Rua 9", neighborhood: "Centro", weekdayTime: "05:31", saturdayTime: "06:31", coordinates: { lat: -16.336570, lng: -48.964350 } },
        { id: "P-02 10", name: "P-02 10", address: "Av. Brasil / Esquina com a Rua 10", neighborhood: "Centro", weekdayTime: "05:33", saturdayTime: "06:33", coordinates: { lat: -16.339390, lng: -48.965740 } },
        { id: "P-02 11", name: "P-02 11", address: "Av. Brasil / Esquina com a Rua 11", neighborhood: "Centro", weekdayTime: "05:35", saturdayTime: "06:35", coordinates: { lat: -16.342210, lng: -48.967130 } },
        { id: "P-02 12", name: "P-02 12", address: "Av. Brasil / Esquina com a Rua 12", neighborhood: "Centro", weekdayTime: "05:37", saturdayTime: "06:37", coordinates: { lat: -16.345030, lng: -48.968520 } },
        { id: "P-02 13", name: "P-02 13", address: "Av. Brasil / Esquina com a Rua 13", neighborhood: "Centro", weekdayTime: "05:39", saturdayTime: "06:39", coordinates: { lat: -16.347850, lng: -48.969910 } },
        { id: "P-02 14", name: "P-02 14", address: "Av. Brasil / Esquina com a Rua 14", neighborhood: "Centro", weekdayTime: "05:41", saturdayTime: "06:41", coordinates: { lat: -16.350670, lng: -48.971300 } },
        { id: "P-02 15", name: "P-02 15", address: "Av. Brasil / Esquina com a Rua 15", neighborhood: "Centro", weekdayTime: "05:43", saturdayTime: "06:43", coordinates: { lat: -16.353490, lng: -48.972690 } },
        { id: "P-02 16", name: "P-02 16", address: "Av. Brasil / Esquina com a Rua 16", neighborhood: "Centro", weekdayTime: "05:45", saturdayTime: "06:45", coordinates: { lat: -16.356310, lng: -48.974080 } },
        { id: "P-02 17", name: "P-02 17", address: "Av. Brasil / Esquina com a Rua 17", neighborhood: "Centro", weekdayTime: "05:47", saturdayTime: "06:47", coordinates: { lat: -16.359130, lng: -48.975470 } },
        { id: "P-02 18", name: "P-02 18", address: "Av. Brasil / Esquina com a Rua 18", neighborhood: "Centro", weekdayTime: "05:49", saturdayTime: "06:49", coordinates: { lat: -16.361950, lng: -48.976860 } },
        { id: "P-02 19", name: "P-02 19", address: "Av. Brasil / Esquina com a Rua 19", neighborhood: "Centro", weekdayTime: "05:51", saturdayTime: "06:51", coordinates: { lat: -16.364770, lng: -48.978250 } },
        { id: "P-02 20", name: "P-02 20", address: "Av. Brasil / Esquina com a Rua 20", neighborhood: "Centro", weekdayTime: "05:53", saturdayTime: "06:53", coordinates: { lat: -16.367590, lng: -48.979640 } }
      ]
    },
    {
      id: "P-03",
      name: "Rota P-03",
      color: "#00FF00", // Green
      stops: [
        { id: "P-03 01", name: "P-03 01", address: "Av. Goiás / Esquina com a Rua 1", neighborhood: "Vila Central", weekdayTime: "05:30", saturdayTime: "06:30", coordinates: { lat: -16.314010, lng: -48.953230 } },
        { id: "P-03 02", name: "P-03 02", address: "Av. Goiás / Esquina com a Rua 2", neighborhood: "Vila Central", weekdayTime: "05:32", saturdayTime: "06:32", coordinates: { lat: -16.316830, lng: -48.954620 } },
        { id: "P-03 03", name: "P-03 03", address: "Av. Goiás / Esquina com a Rua 3", neighborhood: "Vila Central", weekdayTime: "05:34", saturdayTime: "06:34", coordinates: { lat: -16.319650, lng: -48.956010 } },
        { id: "P-03 04", name: "P-03 04", address: "Av. Goiás / Esquina com a Rua 4", neighborhood: "Vila Central", weekdayTime: "05:36", saturdayTime: "06:36", coordinates: { lat: -16.322470, lng: -48.957400 } },
        { id: "P-03 05", name: "P-03 05", address: "Av. Goiás / Esquina com a Rua 5", neighborhood: "Vila Central", weekdayTime: "05:38", saturdayTime: "06:38", coordinates: { lat: -16.325290, lng: -48.958790 } },
        { id: "P-03 06", name: "P-03 06", address: "Av. Goiás / Esquina com a Rua 6", neighborhood: "Vila Central", weekdayTime: "05:40", saturdayTime: "06:40", coordinates: { lat: -16.328110, lng: -48.960180 } },
        { id: "P-03 07", name: "P-03 07", address: "Av. Goiás / Esquina com a Rua 7", neighborhood: "Vila Central", weekdayTime: "05:42", saturdayTime: "06:42", coordinates: { lat: -16.330930, lng: -48.961570 } },
        { id: "P-03 08", name: "P-03 08", address: "Av. Goiás / Esquina com a Rua 8", neighborhood: "Vila Central", weekdayTime: "05:44", saturdayTime: "06:44", coordinates: { lat: -16.333750, lng: -48.962960 } },
        { id: "P-03 09", name: "P-03 09", address: "Av. Goiás / Esquina com a Rua 9", neighborhood: "Vila Central", weekdayTime: "05:46", saturdayTime: "06:46", coordinates: { lat: -16.336570, lng: -48.964350 } },
        { id: "P-03 10", name: "P-03 10", address: "Av. Goiás / Esquina com a Rua 10", neighborhood: "Vila Central", weekdayTime: "05:48", saturdayTime: "06:48", coordinates: { lat: -16.339390, lng: -48.965740 } },
        { id: "P-03 11", name: "P-03 11", address: "Av. Goiás / Esquina com a Rua 11", neighborhood: "Vila Central", weekdayTime: "05:50", saturdayTime: "06:50", coordinates: { lat: -16.342210, lng: -48.967130 } },
        { id: "P-03 12", name: "P-03 12", address: "Av. Goiás / Esquina com a Rua 12", neighborhood: "Vila Central", weekdayTime: "05:52", saturdayTime: "06:52", coordinates: { lat: -16.345030, lng: -48.968520 } },
        { id: "P-03 13", name: "P-03 13", address: "Av. Goiás / Esquina com a Rua 13", neighborhood: "Vila Central", weekdayTime: "05:54", saturdayTime: "06:54", coordinates: { lat: -16.347850, lng: -48.969910 } },
        { id: "P-03 14", name: "P-03 14", address: "Av. Goiás / Esquina com a Rua 14", neighborhood: "Vila Central", weekdayTime: "05:56", saturdayTime: "06:56", coordinates: { lat: -16.350670, lng: -48.971300 } },
        { id: "P-03 15", name: "P-03 15", address: "Av. Goiás / Esquina com a Rua 15", neighborhood: "Vila Central", weekdayTime: "05:58", saturdayTime: "06:58", coordinates: { lat: -16.353490, lng: -48.972690 } },
        { id: "P-03 16", name: "P-03 16", address: "Av. Goiás / Esquina com a Rua 16", neighborhood: "Vila Central", weekdayTime: "06:00", saturdayTime: "07:00", coordinates: { lat: -16.356310, lng: -48.974080 } },
        { id: "P-03 17", name: "P-03 17", address: "Av. Goiás / Esquina com a Rua 17", neighborhood: "Vila Central", weekdayTime: "06:02", saturdayTime: "07:02", coordinates: { lat: -16.359130, lng: -48.975470 } },
        { id: "P-03 18", name: "P-03 18", address: "Av. Goiás / Esquina com a Rua 18", neighborhood: "Vila Central", weekdayTime: "06:04", saturdayTime: "07:04", coordinates: { lat: -16.361950, lng: -48.976860 } },
        { id: "P-03 19", name: "P-03 19", address: "Av. Goiás / Esquina com a Rua 19", neighborhood: "Vila Central", weekdayTime: "06:06", saturdayTime: "07:06", coordinates: { lat: -16.364770, lng: -48.978250 } },
        { id: "P-03 20", name: "P-03 20", address: "Av. Goiás / Esquina com a Rua 20", neighborhood: "Vila Central", weekdayTime: "06:08", saturdayTime: "07:08", coordinates: { lat: -16.367590, lng: -48.979640 } }
      ]
    },
    {
      id: "P-04",
      name: "Rota P-04",
      color: "#FFA500", // Orange
      stops: [
        { id: "P-04 01", name: "P-04 01", address: "Rua Jk / Esquina com a Rua 1", neighborhood: "Setor Industrial", weekdayTime: "05:45", saturdayTime: "06:45", coordinates: { lat: -16.314010, lng: -48.953230 } },
        { id: "P-04 02", name: "P-04 02", address: "Rua Jk / Esquina com a Rua 2", neighborhood: "Setor Industrial", weekdayTime: "05:47", saturdayTime: "06:47", coordinates: { lat: -16.316830, lng: -48.954620 } },
        { id: "P-04 03", name: "P-04 03", address: "Rua Jk / Esquina com a Rua 3", neighborhood: "Setor Industrial", weekdayTime: "05:49", saturdayTime: "06:49", coordinates: { lat: -16.319650, lng: -48.956010 } },
        { id: "P-04 04", name: "P-04 04", address: "Rua Jk / Esquina com a Rua 4", neighborhood: "Setor Industrial", weekdayTime: "05:51", saturdayTime: "06:51", coordinates: { lat: -16.322470, lng: -48.957400 } },
        { id: "P-04 05", name: "P-04 05", address: "Rua Jk / Esquina com a Rua 5", neighborhood: "Setor Industrial", weekdayTime: "05:53", saturdayTime: "06:53", coordinates: { lat: -16.325290, lng: -48.958790 } },
        { id: "P-04 06", name: "P-04 06", address: "Rua Jk / Esquina com a Rua 6", neighborhood: "Setor Industrial", weekdayTime: "05:55", saturdayTime: "06:55", coordinates: { lat: -16.328110, lng: -48.960180 } },
        { id: "P-04 07", name: "P-04 07", address: "Rua Jk / Esquina com a Rua 7", neighborhood: "Setor Industrial", weekdayTime: "05:57", saturdayTime: "06:57", coordinates: { lat: -16.330930, lng: -48.961570 } },
        { id: "P-04 08", name: "P-04 08", address: "Rua Jk / Esquina com a Rua 8", neighborhood: "Setor Industrial", weekdayTime: "05:59", saturdayTime: "06:59", coordinates: { lat: -16.333750, lng: -48.962960 } },
        { id: "P-04 09", name: "P-04 09", address: "Rua Jk / Esquina com a Rua 9", neighborhood: "Setor Industrial", weekdayTime: "06:01", saturdayTime: "07:01", coordinates: { lat: -16.336570, lng: -48.964350 } },
        { id: "P-04 10", name: "P-04 10", address: "Rua Jk / Esquina com a Rua 10", neighborhood: "Setor Industrial", weekdayTime: "06:03", saturdayTime: "07:03", coordinates: { lat: -16.339390, lng: -48.965740 } },
        { id: "P-04 11", name: "P-04 11", address: "Rua Jk / Esquina com a Rua 11", neighborhood: "Setor Industrial", weekdayTime: "06:05", saturdayTime: "07:05", coordinates: { lat: -16.342210, lng: -48.967130 } },
        { id: "P-04 12", name: "P-04 12", address: "Rua Jk / Esquina com a Rua 12", neighborhood: "Setor Industrial", weekdayTime: "06:07", saturdayTime: "07:07", coordinates: { lat: -16.345030, lng: -48.968520 } },
        { id: "P-04 13", name: "P-04 13", address: "Rua Jk / Esquina com a Rua 13", neighborhood: "Setor Industrial", weekdayTime: "06:09", saturdayTime: "07:09", coordinates: { lat: -16.347850, lng: -48.969910 } },
        { id: "P-04 14", name: "P-04 14", address: "Rua Jk / Esquina com a Rua 14", neighborhood: "Setor Industrial", weekdayTime: "06:11", saturdayTime: "07:11", coordinates: { lat: -16.350670, lng: -48.971300 } },
        { id: "P-04 15", name: "P-04 15", address: "Rua Jk / Esquina com a Rua 15", neighborhood: "Setor Industrial", weekdayTime: "06:13", saturdayTime: "07:13", coordinates: { lat: -16.353490, lng: -48.972690 } },
        { id: "P-04 16", name: "P-04 16", address: "Rua Jk / Esquina com a Rua 16", neighborhood: "Setor Industrial", weekdayTime: "06:15", saturdayTime: "07:15", coordinates: {
