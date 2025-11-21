import { Reservations } from './Reservations';

export interface InvoiceModule {
    id?: number;
    user_id?: number;
    branch_id?: number;
    reference_id?: number;
    reference_type: string;
    sequential?: string;

    invoice_id?: string;
    cai_id?: number;
    cai?: string;
    initial_no?: string;
    final_no?: string;
    limit_date?: string;

    client_id: number;
    client_rtn: string;
    client_name: string;
    client_balance: number;

    credit_invoice: string;
    invoice_type: string;
    sag_ocexenta: string;
    sag_rexonerada: string;
    sag_rsag: string;

    fee: number;
    subtotal: number;
    discount: number;
    discount_value: number;
    tax_isv: number;
    total: number;

    cash_usd: number;
    cash_lps: number;
    cash_lps_value: number;
    credit_card1: number;
    credit_card1_number: string;
    credit_card2: number;
    credit_card2_number: string;

    commercesettings_id: number|null;
    deposit: number;
    deposit_reference: string;

    cash: number;
    change: number;

    observation: string;
    cash_register_closed: string;
    annulled: string;
    date?: Date|string;
    expiration_date?: Date;
    
    reservation?: Reservations;
    
    created_at?: Date;
    updated_at?: Date;
}
