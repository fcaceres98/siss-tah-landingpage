import { Flight } from './flights';

export interface ReservationDetails {
    id?: number;
    reservation_id?: number;
    sequential?: string;
    ticket: string;
    flight_id?: number;
    flight_type?: string;
    connectionsettings_id?: number;

    detail_document_type: string;
    detail_document_number: string;
    detail_document_expiration_date: Date|string;
    detail_document_issue_country: string;

    detail_first_name: string;
    detail_middle_name?: string;
    detail_last_name: string;
    detail_gender: string;
    detail_traveler_type: string;
    detail_crew_funtion?: string;
    detail_date_birth: Date|string;
    detail_country_birth?: string;
    detail_nationality: string;
    detail_country_residence: string;
    detail_special_service: string;
    detail_special_service_observation?: string;

    detail_2nd_document_type?: string;
    detail_2nd_document_number?: string;
    detail_2nd_document_expiration_date?: Date|string;
    detail_2nd_document_issue_country?: string;

    flight_fees_id?: number;
    flight_fees_fee?: string;
    flight_fees_description?: string;

    flight_fees_value?: number;
    flight_fees_subtotal?: number;
    flight_fees_discount?: number;
    flight_fees_taxISV?: number;
    flight_fees_taxHN?: number;
    flight_fees_taxCU?: number;
    flight_fees_total?: number;
    
    flight_fees_type?: string;
    
    detail_type: string;
    transit?: string;
    reservation_status?: string;
    boarding_pass?: number;
    onboard?: string;
    seat_number?: string;
    carry_on_bag?: string;
    bag_count?: string;
    luggage_checked?: string;
    luggage_pounds?: number;

    flight?: Flight;
    
    created_at?: Date;
    updated_at?: Date;
}
