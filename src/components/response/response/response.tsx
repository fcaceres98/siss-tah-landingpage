interface ResponsePageProps {
    invoice: number;
    reservation: number;
}
const ResponsePage: React.FC<ResponsePageProps> = ({ invoice, reservation }) => {
    return (
        <div>
            <p>Response Page</p>
            <p>Invoice Temp: {invoice}</p>
            <p>Reservation Temp: {reservation}</p>
        </div>
    );
};

export default ResponsePage