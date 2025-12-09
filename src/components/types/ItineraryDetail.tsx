import { Itinerary } from './Itinerary';

export interface ItineraryDetail {
    id?: number;
    itinerary_id: number;
    itinerary_id_connection: number;
    itinerary?: Itinerary;
    flight_id?: number;
    numPax?: number;
    numPaxavailable?: number;
}
