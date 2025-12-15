export interface SystemSettings {
    id?: number;
    name?: string;
    abbreviation?: string;
    rtn?: string;
    telephone?: string;
    direction?: string;
    slogan?: string;
    email?: string;
    website?: string;
    infant_discount?: number;
    child_discount?: number;
    seniors_discount?: number;
    isv?: number;
    iht?: number;
    number_valid_month?: number;
    luggage_pound_limit?: number;
    luggage_price?: number;

    luggage_pound_limit_havana?: number;
    luggage_price_havana?: number;
    luggage_pound_price_havana?: number;

    flight_change_noshow_penalty?: number;
    flight_change_penalty?: number;
    name_change_penalty?: number;
    expired_reservation_penalty?: number;
    charter_flight_minute_value?: number;
}
