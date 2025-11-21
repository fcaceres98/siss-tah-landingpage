import { ReservationDetails } from './ReservationDetails';

export interface Reservations {
    id?: number;
    sequential?: string;
    reservation_type: string;
    
    ishn: number;
    iscu: number;

    adults: number;
    minors: number;
    seniors: number;
    infants: number;
    contact_first_name: string;
    contact_last_name: string;
    contact_phone: string;
    contact_email: string;
    connectionsettings_id: number;

    reservation_details?: ReservationDetails[];
    user_type?: string;
}

