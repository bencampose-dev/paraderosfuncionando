export interface MedicionParadero {
  id: number;
  sensorId: string;
  location: { lat: number; lng: number } | null;
  stopId: string | null;
  timestamp: string;
  entered: number | null;
  exited: number | null;
  peopleCount: number;
  occupancyLevel: string | null;
  note: string | null;
}
