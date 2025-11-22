interface InvoicePageProps {
    invoice: number;
    reservation: number;
}
const InvoicePage: React.FC<InvoicePageProps> = ({ invoice, reservation }) => {
    return (
        <div>
            <p>Invoice Page</p>
            <p>Invoice Temp: {invoice}</p>
            <p>Reservation Temp: {reservation}</p>
        </div>
    );
};

export default InvoicePage