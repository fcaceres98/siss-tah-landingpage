import { Itinerary } from "./Itinerary";
import { Fees } from "./fees";
import { Plane } from "./plane";

export interface Flight {
  id: number;

  itinerary_id: number;
  plane_id: number;
  flight_no?: string;
  gate: string;
  departure: string;
  arrival: string;

  from_id: number;
  from_destination: string;
  from_iata: string;
  from_icao: string;
  to_id: number;
  to_destination: string;
  to_iata: string;
  to_icao: string;

  boarding_start: string;
  boarding_end: string;
  
  observation: string;
  date: string;

  flight_fees: Fees[];
  itinerary: Itinerary;
  plane: Plane;
  
  created_at: string;
  updated_at: string;
}

/*
id?: number;
    itinerary_id?: number;
    plane_id?: number;
    crew_id?: number;
    flight_no?: string;
    gate?: string;
    departure?: string|Date;
    arrival?: string|Date;
    flown?: string|Date;
    flown_observation?: string;
    from_id?: number;
    from_destination?: string;
    from_iata?: string;
    from_icao?: string;
    to_id?: number;
    to_destination?: string;
    to_iata?: string;
    to_icao?: string;
    boarding_start?: string|Date;
    boarding_end?: string|Date;
    observation?: string;
    date?: string|Date;
    status?: string;
    flight_fees?: Tarifas[];
    itinerary?: Itinerario;
    plane?: Aviones;
    flight_commentaries?: VueloComentarios[];
    numPax?: number;
    numPaxCheckedin?: number;
    numPaxFlexible?: number;
    numPaxNOSHOW?: number;
    numPaxProtected?: number;
    numPaxVoid?: number;
    numPaxReturned?: number;
    numPaxTransits?: number;
    numPaxTotal?: number;
    crew?: Tripulaciones;
*/