interface InvoicePageProps {
    invoice: number;
    reservation: number;
    response: string;
}
const InvoicePage: React.FC<InvoicePageProps> = ({ invoice, reservation, response }) => {
    return (
        <div>
            <p>Invoice Page</p>
            <p>Invoice Temp: {invoice}</p>
            <p>Reservation Temp: {reservation}</p>
            <p>Response: {response}</p>
        </div>
    );
};

export default InvoicePage