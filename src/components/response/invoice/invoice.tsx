import { InvoiceModule } from "@/components/types/Invoice";

interface InvoicePageProps {
    invoice: InvoiceModule | null;
}
const InvoicePage: React.FC<InvoicePageProps> = ({ invoice }) => {
    return (
        <div>
            <p>Invoice</p>
            <p>
                {JSON.stringify(invoice, null, '\t')}
            </p>
        </div>
    );
};

export default InvoicePage