export interface Fees {
    id: number;
    flight_id: number;
    fee: string;
    description: string;
    
    valueOW: number;
    valueRT: number;
    
    taxOWHN: number;
    taxOWCU: number;
    
    taxRTHN: number;
    taxRTCU: number;

    type: string;
    
    availability: number;
    status: string;
    seats_available: number;
}
