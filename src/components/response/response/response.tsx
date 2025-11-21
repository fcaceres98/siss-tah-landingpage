interface ResponsePageProps {
    invoice: number;
    reservation: number;
    response: string;
}
const ResponsePage: React.FC<ResponsePageProps> = ({ invoice, reservation, response }) => {
    return (
        <div>
            <p>Response Page</p>
            <p>Invoice Temp: {invoice}</p>
            <p>Reservation Temp: {reservation}</p>
            <p>Response: {response}</p>
        </div>
    );
};

export default ResponsePage