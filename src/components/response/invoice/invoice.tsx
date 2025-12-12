import { InvoiceModule } from "@/components/types/Invoice";
import { Reservations } from "@/components/types/Reservations";

interface InvoicePageProps {
    invoice: InvoiceModule | null;
    reservation: Reservations | null;
}
const InvoicePage: React.FC<InvoicePageProps> = ({ invoice, reservation }) => {
    return (
        <div>
            <p>Invoice</p>
            <p>
                {JSON.stringify(invoice, null, '\t')}
            </p>
            <br />
            <br />
            <p>reservation</p>
            <p>
                {JSON.stringify(reservation, null, '\t')}
            </p>
        </div>
    );
};

export default InvoicePage