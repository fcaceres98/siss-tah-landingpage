export interface Itinerary {
    id: number;
    flight_no: string;
    flight_destinations_id_from: number;
    flight_destinations_id_to: number;
    departure: string;
    arrival: string;
    stops: number;
    
    tax_description: string;
    tax: number;
    discount: number;
}