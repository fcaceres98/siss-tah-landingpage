import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon  } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Flight } from "@/components/types/flights";
import { Country } from "@/components/types/Country";
import { FormSchema } from "@/components/reservations/search-form/search-form";
import { DollarOnline } from "@/components/types/DollarOnline";

interface rtValues {
  feeRate: number;
  taxDescription: string;
  taxISV: number;
  subTotal: number;
  discount: number;
  taxDeparture: number;
  taxArrival: number;
  total: number;
}

interface PassengerListPageProps {
    searchData?: z.infer<typeof FormSchema>;
    onNext?: (data: number) => void;
    selectedFlightOW?: Flight | null;
    selectedFlightRT?: Flight | null;
    rtValues: rtValues;
}

const PassengerSchema = z.object({
  documentType: z.string().nonempty("Por favor seleccione un tipo de documento."),
  documentNumber: z.string().nonempty("Por favor ingrese un numero de documento."),
  documentExpirationDate: z.date(),
  documentIssueCountry: z.string().nonempty("Por favor ingrese un pais de emision."),

  firstName: z.string().nonempty("Por favor ingrese su primer nombre."),
  middleName: z.string().nonempty("Por favor ingrese su segundo nombre."),
  lastName: z.string().nonempty("Por favor ingrese sus apellidos."),
  genderType: z.string().nonempty("Por favor seleccione un genero."),

  dateBirth: z.date(),
  countryBirth: z.string().nonempty("Por favor ingrese su pais de nacimiento."),
  countryNationality: z.string().nonempty("Por favor ingrese el pais de su nacionalidad."),
  countryResidence: z.string().nonempty("Por favor ingrese el pais de su residencia."),
});

const FormSchemaPassengers = z.object({
  terms: z.boolean(),
  
  adultPassengers: z.array(PassengerSchema),
  minorPassengers: z.array(PassengerSchema),
  seniorPassengers: z.array(PassengerSchema),
  infantPassengers: z.array(PassengerSchema),

  client_id_type: z.string().nonempty("Por favor seleccione un tipo de documento."),
  client_id: z.string().nonempty("Por favor ingrese una identidad."),
  client_first_name: z.string().nonempty("Por favor ingrese sus nombre."),
  client_last_name: z.string().nonempty("Por favor ingrese sus apellidos."),
  client_telephone: z.string().nonempty("Por favor ingrese un numero de telefono."),
  client_email: z.string()
    .nonempty("Por favor ingrese un correo.")
    .email("Por favor ingrese un correo válido."),
})

const PassengerListPage: React.FC<PassengerListPageProps> = ({ searchData, onNext, selectedFlightOW, selectedFlightRT, rtValues }) => {

    const formatDateServer = (date?: Date | string) => {
        if (!date) return "—";
        return format(new Date(date), "yyyy-MM-dd", { locale: es });
    };

    const documentTypes = [
        { value: "DNI", label: "DNI" },
        { value: "PASSPORT", label: "PASSPORT" },
    ];
    const genderTypes = [
        { value: "MASCULINO", label: "MASCULINO" },
        { value: "FEMENINO", label: "FEMENINO" },
    ];
    const clientIdTypes = [
        { value: "HNDNI", label: "Identidad Nacional" },
        { value: "HNDR", label: "Identidad Residencial" },
        { value: "PPN", label: "Pasaporte" },
    ];

    const [dollarOnline, setDollarOnline] = useState<DollarOnline>({ value: 0, status: "SI" });
    const [countries, setCountries] = useState<Country[]>([]);
    const [onloadingCountries, setOnLoadingCountries] = useState<boolean>(false);
    const [onSavingReservationTemp, setOnSavingReservationTemp] = useState<boolean>(false);

    // Track open/closed state per passenger document expiration popover using a map keyed by passenger type + index
    const [calendarOpenDocumentExpiration, setCalendarOpenDocumentExpiration] = React.useState<Record<string, boolean>>({});
    const setCalendarOpenDocumentExpirationFor = (key: string, value: boolean) => setCalendarOpenDocumentExpiration((prev) => ({ ...prev, [key]: value }));
    const isCalendarOpenDocumentExpiration = (key: string) => !!calendarOpenDocumentExpiration[key];
    
    const [calendarOpenDateBirth, setCalendarOpenDateBirth] = React.useState<Record<string, boolean>>({});
    const setCalendarOpenDateBirthFor = (key: string, value: boolean) => setCalendarOpenDateBirth((prev) => ({ ...prev, [key]: value }));
    const isCalendarOpenDateBirth = (key: string) => !!calendarOpenDateBirth[key];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        async function fetchCountries() {
            setOnLoadingCountries(true);
            try {
                const response = await fetch(`${apiUrl}/tahonduras-online/countries/enabled`);
                const data = await response.json();
                // Deduplicate countries by abbreviation to avoid duplicate Select values/keys
                const uniqueByAbbr: Country[] = [];
                const seen = new Set<string | number | undefined>();
                for (const c of data) {
                    const key = c.abbreviation ?? c.id;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueByAbbr.push(c);
                    }
                }
                setCountries(uniqueByAbbr);
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setOnLoadingCountries(false);
            }
        }
        fetchCountries();

        async function fetchDollarOnline() {
            try {
                const response = await fetch(`${apiUrl}/tahonduras-online/dollaronline/last`);
                const data = await response.json();
                setDollarOnline(data);
            } catch (error) {
                console.error("Error fetching dollar online:", error);
            }
        }
        fetchDollarOnline();
        
    }, [apiUrl]);
    
    const totalAdults = searchData?.paxCount.paxAdult ?? 0;
    const totalMinors = searchData?.paxCount.paxMinor ?? 0;
    const totalSeniors = searchData?.paxCount.paxSenior ?? 0;
    const totalInfants = searchData?.paxCount.paxInfant ?? 0;

    const form = useForm<z.infer<typeof FormSchemaPassengers>>({
        resolver: zodResolver(FormSchemaPassengers),
        defaultValues: {
            terms: false,
            
            adultPassengers: Array.from({ length: totalAdults }).map(() => ({
                documentType: "",
                documentNumber: "",
                documentExpirationDate: new Date(),
                documentIssueCountry: "",
                
                firstName: "",
                middleName: "",
                lastName: "",
                genderType: "",

                dateBirth:  new Date(),
                countryBirth: "",
                countryNationality: "",
                countryResidence: "",
            })),
            minorPassengers: Array.from({ length: totalMinors }).map(() => ({
                documentType: "",
                documentNumber: "",
                documentExpirationDate: new Date(),
                documentIssueCountry: "",
                
                firstName: "",
                middleName: "",
                lastName: "",
                genderType: "",

                dateBirth:  new Date(),
                countryBirth: "",
                countryNationality: "",
                countryResidence: "",
            })),
            seniorPassengers: Array.from({ length: totalSeniors }).map(() => ({
                documentType: "",
                documentNumber: "",
                documentExpirationDate: new Date(),
                documentIssueCountry: "",
                
                firstName: "",
                middleName: "",
                lastName: "",
                genderType: "",

                dateBirth:  new Date(),
                countryBirth: "",
                countryNationality: "",
                countryResidence: "",
            })),
            infantPassengers: Array.from({ length: totalInfants }).map(() => ({
                documentType: "",
                documentNumber: "",
                documentExpirationDate: new Date(),
                documentIssueCountry: "",
                
                firstName: "",
                middleName: "",
                lastName: "",
                genderType: "",

                dateBirth:  new Date(),
                countryBirth: "",
                countryNationality: "",
                countryResidence: "",
            })),

            client_id_type: "",
            client_id: "",
            client_first_name: "",
            client_last_name: "",
            client_telephone: "",
            client_email: "",
        },
    });

    const { fields: adultFields } = useFieldArray<z.infer<typeof FormSchemaPassengers>, "adultPassengers">({
        control: form.control,
        name: "adultPassengers",
    });
    const { fields: minorFields } = useFieldArray<z.infer<typeof FormSchemaPassengers>, "minorPassengers">({
        control: form.control,
        name: "minorPassengers",
    });
    const { fields: seniorFields } = useFieldArray<z.infer<typeof FormSchemaPassengers>, "seniorPassengers">({
        control: form.control,
        name: "seniorPassengers",
    });
    const { fields: infantFields } = useFieldArray<z.infer<typeof FormSchemaPassengers>, "infantPassengers">({
        control: form.control,
        name: "infantPassengers",
    });

    // watch the terms checkbox so we can enable/disable the submit button
    const termsAccepted = form.watch("terms")
    
    function onSubmitPassengers(data: z.infer<typeof FormSchemaPassengers>) {
        setOnSavingReservationTemp(true);
        // console.log("Form submitted:", JSON.stringify(data, null, '\t'));
        // console.log("selectedFlightOW:", JSON.stringify(selectedFlightOW, null, '\t'));
        // console.log("selectedFlightRT:", JSON.stringify(selectedFlightRT, null, '\t'));

        if (!selectedFlightOW || !selectedFlightRT || !searchData)  return;

        const arrAllPassengers = [];
        // OW reservation detail passengers
        for (const passenger of data.adultPassengers) {
            const taxisvRate = Number(selectedFlightOW.itinerary.tax / 100);
            const feerate = Number(selectedFlightOW.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightOW.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightOW.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightOW.flight_fees[0].flight_id,
                "flight_type": "IDA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightOW.flight_fees[0].id,
                "flight_fees_fee": selectedFlightOW.flight_fees[0].fee,
                "flight_fees_description": selectedFlightOW.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightOW.flight_fees[0].type,
                "detail_type": "ADULTO",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }
        for (const passenger of data.minorPassengers) {
            const taxisvRate = Number(selectedFlightOW.itinerary.tax / 100);
            const feerate = Number(selectedFlightOW.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightOW.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightOW.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightOW.flight_fees[0].flight_id,
                "flight_type": "IDA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightOW.flight_fees[0].id,
                "flight_fees_fee": selectedFlightOW.flight_fees[0].fee,
                "flight_fees_description": selectedFlightOW.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightOW.flight_fees[0].type,
                "detail_type": "MENOR",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }
        for (const passenger of data.seniorPassengers) {
            const taxisvRate = Number(selectedFlightOW.itinerary.tax / 100);
            const feerate = Number(selectedFlightOW.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightOW.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightOW.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightOW.flight_fees[0].flight_id,
                "flight_type": "IDA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightOW.flight_fees[0].id,
                "flight_fees_fee": selectedFlightOW.flight_fees[0].fee,
                "flight_fees_description": selectedFlightOW.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightOW.flight_fees[0].type,
                "detail_type": "MAYOR",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }
        for (const passenger of data.infantPassengers) {
            const taxisvRate = Number(selectedFlightOW.itinerary.tax / 100);
            const feerate = Number(selectedFlightOW.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightOW.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightOW.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightOW.flight_fees[0].flight_id,
                "flight_type": "IDA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightOW.flight_fees[0].id,
                "flight_fees_fee": selectedFlightOW.flight_fees[0].fee,
                "flight_fees_description": selectedFlightOW.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightOW.flight_fees[0].type,
                "detail_type": "INFANTE",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }

        // RT reservation detail passengers
        for (const passenger of data.adultPassengers) {
            const taxisvRate = Number(selectedFlightRT.itinerary.tax / 100);
            const feerate = Number(selectedFlightRT.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightRT.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightRT.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightRT.flight_fees[0].flight_id,
                "flight_type": "VUELTA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightRT.flight_fees[0].id,
                "flight_fees_fee": selectedFlightRT.flight_fees[0].fee,
                "flight_fees_description": selectedFlightRT.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightRT.flight_fees[0].type,
                "detail_type": "ADULTO",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }
        for (const passenger of data.minorPassengers) {
            const taxisvRate = Number(selectedFlightRT.itinerary.tax / 100);
            const feerate = Number(selectedFlightRT.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightRT.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightRT.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightRT.flight_fees[0].flight_id,
                "flight_type": "VUELTA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightRT.flight_fees[0].id,
                "flight_fees_fee": selectedFlightRT.flight_fees[0].fee,
                "flight_fees_description": selectedFlightRT.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightRT.flight_fees[0].type,
                "detail_type": "MENOR",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }
        for (const passenger of data.seniorPassengers) {
            const taxisvRate = Number(selectedFlightRT.itinerary.tax / 100);
            const feerate = Number(selectedFlightRT.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightRT.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightRT.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightRT.flight_fees[0].flight_id,
                "flight_type": "VUELTA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightRT.flight_fees[0].id,
                "flight_fees_fee": selectedFlightRT.flight_fees[0].fee,
                "flight_fees_description": selectedFlightRT.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightRT.flight_fees[0].type,
                "detail_type": "MAYOR",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }
        for (const passenger of data.infantPassengers) {
            const taxisvRate = Number(selectedFlightRT.itinerary.tax / 100);
            const feerate = Number(selectedFlightRT.flight_fees[0].valueRT);
            const taxisv = feerate * taxisvRate;
            const subtotal = feerate + taxisv;
            const taxdeparture = Number(selectedFlightRT.flight_fees[0].taxRTHN);
            const taxarrival = Number(selectedFlightRT.flight_fees[0].taxRTCU);
            const total = subtotal + taxdeparture + taxarrival;
            
            arrAllPassengers.push({
                "ticket": "",
                "flight_id": selectedFlightRT.flight_fees[0].flight_id,
                "flight_type": "VUELTA",
                "connectionsettings_id": 1,
                "detail_document_type": passenger.documentType,
                "detail_document_number": passenger.documentNumber,
                "detail_document_expiration_date": formatDateServer(passenger.documentExpirationDate),
                "detail_document_issue_country":  passenger.documentIssueCountry,
                "detail_first_name": passenger.firstName,
                "detail_middle_name": passenger.middleName,
                "detail_last_name": passenger.lastName,
                "detail_gender": passenger.genderType,
                "detail_traveler_type": "PAX",
                "detail_crew_funtion": "",
                "detail_date_birth": formatDateServer(passenger.dateBirth),
                "detail_country_birth": passenger.countryBirth,
                "detail_nationality": passenger.countryNationality,
                "detail_country_residence": passenger.countryResidence,
                "detail_special_service": "NO",
                "detail_special_service_observation": "",
                "detail_2nd_document_expiration_date": "2025-01-01",
                "flight_fees_id": selectedFlightRT.flight_fees[0].id,
                "flight_fees_fee": selectedFlightRT.flight_fees[0].fee,
                "flight_fees_description": selectedFlightRT.flight_fees[0].description,
                "flight_fees_value": feerate,
                "flight_fees_subtotal": subtotal,
                "flight_fees_discount": 0,
                "flight_fees_taxISV": taxisv,
                "flight_fees_taxHN": taxdeparture,
                "flight_fees_taxCU": taxarrival,
                "flight_fees_total": total,
                "flight_fees_type": selectedFlightRT.flight_fees[0].type,
                "detail_type": "INFANTE",
                "transit": "",
                "reservation_status": "CONFIRMADO"
            });
        }

        // Build the reservation payload here
        const payload = {
            factura: {
                "reference_type": "Reservación",
                "client_id": 1,
                "client_rtn": "9999999999999",
                "client_name": "CONSUMIDOR FINAL",
                "client_balance": 0,
                "credit_invoice": "NO",
                "invoice_type": "GRAVADA",
                "sag_ocexenta": "",
                "sag_rexonerada": "",
                "sag_rsag": "",
                "fee": rtValues.feeRate,
                "subtotal": rtValues.subTotal,
                "discount": 0,
                "discount_value": 0,
                "tax_isv": rtValues.taxISV,
                "total": rtValues.total,
                "cash_usd": rtValues.total,
                "cash_lps": 0,
                "cash_lps_value": dollarOnline.value,
                "credit_card1": 0,
                "credit_card1_number": "",
                "credit_card2": 0,
                "credit_card2_number": "",
                "commercesettings_id": null,
                "deposit": 0,
                "deposit_reference": "",
                "cash": rtValues.total,
                "change": 0,
                "observation": "",
                "cash_register_closed": "NO",
                "annulled": "NO"
            },
            reservacion: {
                "reservation_type": "RT",
                "ishn": selectedFlightOW?.flight_fees[0].taxRTHN,
                "iscu": selectedFlightOW?.flight_fees[0].taxRTCU,
                "adults": searchData?.paxCount.paxAdult ?? 0,
                "minors": searchData?.paxCount.paxMinor ?? 0,
                "seniors": searchData?.paxCount.paxSenior ?? 0,
                "infants": searchData?.paxCount.paxInfant ?? 0,
                "contact_first_name": data.client_first_name,
                "contact_last_name": data.client_last_name,
                "contact_phone": data.client_telephone,
                "contact_email": data.client_email,
                "connectionsettings_id": 1,
                "user_type": "ONLINE",
                "lang_text": {
                    "para": "Para",
                    "contacto": "Contacto",
                    "usuario": "Usuario",
                    "secuencial": "Referencia:",
                    "fechaEmision": "Fecha de emisión:",
                    "fechaVencimiento": "Vence el:",
                    "itinerarioVuelo": "Itinerario del Vuelo",
                    "equipajePermitido": "Equipaje Permitido",
                    "equipajeMano": "Equipaje de mano 10KG",
                    "equipajeCarga": "Equipaje de carga 25KG",
                    "detalleBoleto": "Detalle del Boleto",
                    "detalleVuelo": "Detalle del Vuelo",
                    "aeronave": "Aeronave",
                    "duracionVuelo": "Duración del Vuelo",
                    "fecha": "FECHA",
                    "vuelo": "VUELO",
                    "desde": "DESDE",
                    "saliendo": "SALIENDO",
                    "hasta": "HASTA",
                    "llegada": "LLEGADA",
                    "boleto": "BOLETO",
                    "pasajero": "PASAJERO",
                    "estado": "ESTADO",
                    "base": "BASE",
                    "tarifa": "TARIFA",
                    "subtotal": "SUBTOTAL:",
                    "descuento": "DESCUENTO:",
                    "impisv": "IMP ISV:",
                    "total": "TOTAL:",
                    "terminosCondiciones": "Términos y Condiciones",
                    "tc1": "Este es un contrato de adhesión, por lo que se aplican políticas internas de la empresa.",
                    "tc2": "Este boleto aéreo no es reembolsable, no es endosable, ni transferible.",
                    "tc3": "El pasajero deberá estar en el aeropuerto por lo menos una hora y media antes del inicio de su vuelo local y tres horas antes de su vuelo internacional, en caso contrario pueden perder su reserva.",
                    "tc4": "La empresa se reserva el derecho de cancelar el viaje, retrasarlo o desviar la ruta; cuando, a su juicio, razones fundadas en la protección de la vida humana, la seguridad, razones o condiciones climáticas adversas deben ser atendidas, sin que se considere un incumplimiento del contrato de transporte, ni implique responsabilidad alguna para la compañía.",
                    "tc5": "En virtud de la cláusula anterior, la empresa no asume responsabilidad alguna por el transporte del pasajero en el día señalado a una hora determinada; ni a seguir determinadas rutas, ni hacer conexiones según otros itinerarios, ni por los gastos en que incurra el pasajero por tal motivo.",
                    "tc6": "La empresa también se reserva el derecho de no aceptar pasajeros que se presenten en circunstancias anormales que pongan en peligro la seguridad de los demás pasajeros o provoquen inconvenientes de cualquier naturaleza.",
                    "tc7": "Los boletos tendrán una validez de seis (6) meses a partir de la fecha de emisión, excepto cuando se contemple la fecha de vuelo después de 6 meses desde la emisión.",
                    "tc8": "Boleto incluye: Un artículo de mano (cartera, mochila, bolsa para portátil, pañalera) equipaje de mano de 10 Kg, un equipaje de carga de 23 Kg.",
                    "tc9": "Segunda pieza de equipaje $ 100.00 más impuesto.",
                    "tc10": "Si el pasajero viaja con un arma de fuego, deberá presentarse 2 horas antes del vuelo para realizar su gestión de transporte del arma de fuego ante la autoridad aeroportuaria y pagar un valor de $ 10.00 por arma de fuego. Se permiten 3 armas como máximo por vuelo. Esto solo aplica en vuelos nacionales.",
                    "tc11": "Todos los pasajeros están obligados a poseer un documento de identificación válido y original. El pasaporte es obligatorio para los vuelos internacionales, mientras que para los vuelos nacionales se requiere una cédula de identidad, acta de nacimiento en el caso de menores, o pasaporte.",
                    "tc12": "Para garantizar el cumplimiento de las normas internacionales, es obligatorio para todos los pasajeros poseer un pasaporte con una validez mínima de seis meses a partir de la fecha del vuelo programado. Este requisito es aplicable a todos los pasajeros, independientemente de su nacionalidad o del destino al que viajen. Los pasajeros son responsables de obtener las visas correspondientes de acuerdo con sus planes de viaje y los requisitos del país de destino. Es esencial verificar los requisitos de la visa y solicitar la visa con suficiente anticipación para evitar interrupciones en el viaje o denegación de entrada.",
                    "tc13": "Para garantizar la seguridad y el cumplimiento de las normas de viaje, es obligatorio que todo pasajero menor de edad deba estar acompañado por un custodio y presentar la documentación necesaria según lo dispuesto por la agencia migratoria. Los niños de 0 meses a 2 años se consideran infantes y deben viajar en brazos de un adulto. Si un adulto viaja con más de un bebé, debe pagar el pasaje de un menor.",
                    "tc14": "El cambio de fecha de vuelo tendrá una penalidad de $150.00.",
                    "tc15": "Por no show la penalidad es de $150.00.",
                    "tc16": "NO SOMOS RESPONSABLES DE CONECTAR VUELOS QUE NO SON PARTE DE NUESTRO ITINERARIO."
                }
            },
            reservacionDetalle: [...arrAllPassengers]
        };

        // console.log(JSON.stringify(payload, null, '\t'));

        // Post payload to API
        async function submitReservation() {
            try {
                const response = await fetch(`${apiUrl}/tahonduras-online/reservations/createreservationonline`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const result = await response.json();
                const PTPSession = result.response;
                console.log(JSON.stringify(PTPSession, null, '\t'));
                
                toast("Reservación creada exitosamente", {
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">Redireccionando hacia Banco Atlantida.</code>
                        </pre>
                    ),
                });

                // Redirect to response page with result data
                // const queryParams = new URLSearchParams({
                //     invoice_id_temp: result.invoice_id || '',
                //     reservation_id_temp: result.reservation_id || '',
                //     response: result.response || '',
                // });
                // window.location.href = `/response?${queryParams.toString()}`;
                window.location.href = PTPSession.processUrl;
            } catch (error) {
                console.error("Error submitting reservation:", error);
                toast("Error al crear la reservación", {
                    description: error instanceof Error ? error.message : "Error desconocido",
                });
            } finally {
                setOnSavingReservationTemp(false);
            }
        };

        submitReservation();
    }
    
    return (
        <div className="grid grid-cols gap-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitPassengers)} className="space-y-6">
                    {/* Inicio lista de pasajeros adultos */}
                    {adultFields.length > 0 &&
                        <Card className="gap-0 py-0 rounded-sm border-2">
                            <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                                <div className="grid gap-0.5">
                                    <CardTitle className="group flex items-center gap-2 text-lg">
                                        Lista de Pasajeros Adultos
                                    </CardTitle>
                                    <CardDescription>
                                        Ingrese toda la informacion que se le solicita.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    {adultFields.map((field, index: number) => (
                                    <div key={field.id} className="flex flex-row w-full items-start">
                                        <div className="flex flex-col gap-2 w-full">
                                            {index > 0 && <Separator className="mt-4"/>}
                                            <div className="flex flex-row w-full items-start">
                                                <label>Documento: Adulto {index + 1}</label>
                                            </div>
                                            <Separator className="my-1"/>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.documentType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:w-[120px]">
                                                            <FormLabel>Tipo</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[120px]">
                                                                        <SelectValue placeholder="tipo ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[120px]">
                                                                    {documentTypes.map((docType) => (
                                                                        <SelectItem key={docType.value} value={docType.value}>
                                                                            {docType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.documentNumber`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Numero</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Numero de Documento" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.documentExpirationDate`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Vencimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDocumentExpiration(`adult-${index}`)} onOpenChange={(open) => setCalendarOpenDocumentExpirationFor(`adult-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDocumentExpiration(`adult-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDocumentExpirationFor(`adult-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[160px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.documentIssueCountry`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Emisor</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[160px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[160px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.firstName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Primer Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.middleName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Segundo Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.lastName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Apellidos</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese sus apellidos" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.genderType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:flex-1">
                                                            <FormLabel>Genero</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:flex-1">
                                                                        <SelectValue placeholder="Genero ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:flex-1">
                                                                    {genderTypes.map((genderType) => (
                                                                        <SelectItem key={genderType.value} value={genderType.value}>
                                                                            {genderType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.dateBirth`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Fecha Nacimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDateBirth(`adult-${index}`)} onOpenChange={(open) => setCalendarOpenDateBirthFor(`adult-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDateBirth(`adult-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDateBirthFor(`adult-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.countryBirth`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Nacimiento</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.countryNationality`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Nacionalidad</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`adultPassengers.${index}.countryResidence`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Residencia</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    }
                    {/* Fin lista de pasajeros adultos */}

                    {/* Inicio lista de pasajeros menores */}
                    {minorFields.length > 0 &&
                        <Card className="gap-0 py-0 rounded-sm border-2">
                            <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                                <div className="grid gap-0.5">
                                    <CardTitle className="group flex items-center gap-2 text-lg">
                                        Lista de Pasajeros Menores
                                    </CardTitle>
                                    <CardDescription>
                                        Ingrese toda la informacion que se le solicita.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    {minorFields.map((field, index: number) => (
                                    <div key={field.id} className="flex flex-row w-full items-start">
                                        <div className="flex flex-col gap-2">
                                            {index > 0 && <Separator className="mt-4"/>}
                                            <div className="flex flex-row w-full items-start">
                                                <label>Documento: Menor {index + 1}</label>
                                            </div>
                                            <Separator className="my-1"/>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.documentType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:w-[120px]">
                                                            <FormLabel>Tipo</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[120px]">
                                                                        <SelectValue placeholder="tipo ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[120px]">
                                                                    {documentTypes.map((docType) => (
                                                                        <SelectItem key={docType.value} value={docType.value}>
                                                                            {docType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.documentNumber`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Numero</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Numero de Documento" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.documentExpirationDate`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Vencimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDocumentExpiration(`minor-${index}`)} onOpenChange={(open) => setCalendarOpenDocumentExpirationFor(`minor-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDocumentExpiration(`minor-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDocumentExpirationFor(`minor-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[160px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.documentIssueCountry`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Emisor</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[160px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[160px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.firstName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Primer Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.middleName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Segundo Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.lastName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Apellidos</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese sus apellidos" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.genderType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:flex-1">
                                                            <FormLabel>Genero</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:flex-1">
                                                                        <SelectValue placeholder="Genero ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:flex-1">
                                                                    {genderTypes.map((genderType) => (
                                                                        <SelectItem key={genderType.value} value={genderType.value}>
                                                                            {genderType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.dateBirth`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Fecha Nacimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDateBirth(`minor-${index}`)} onOpenChange={(open) => setCalendarOpenDateBirthFor(`minor-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDateBirth(`minor-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDateBirthFor(`minor-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.countryBirth`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Nacimiento</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.countryNationality`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Nacionalidad</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`minorPassengers.${index}.countryResidence`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Residencia</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    }
                    {/* Fin lista de pasajeros menores */}

                    {/* Inicio lista de pasajeros tercera edad */}
                    {seniorFields.length > 0 &&
                        <Card className="gap-0 py-0 rounded-sm border-2">
                            <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                                <div className="grid gap-0.5">
                                    <CardTitle className="group flex items-center gap-2 text-lg">
                                        Lista de Pasajeros Tercera Edad
                                    </CardTitle>
                                    <CardDescription>
                                        Ingrese toda la informacion que se le solicita.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    {seniorFields.map((field, index: number) => (
                                    <div key={field.id} className="flex flex-row w-full items-start">
                                        <div className="flex flex-col gap-2">
                                            {index > 0 && <Separator className="mt-4"/>}
                                            <div className="flex flex-row w-full items-start">
                                                <label>Documento: Tercera Edad {index + 1}</label>
                                            </div>
                                            <Separator className="my-1"/>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.documentType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:w-[120px]">
                                                            <FormLabel>Tipo</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[120px]">
                                                                        <SelectValue placeholder="tipo ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[120px]">
                                                                    {documentTypes.map((docType) => (
                                                                        <SelectItem key={docType.value} value={docType.value}>
                                                                            {docType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.documentNumber`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Numero</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Numero de Documento" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.documentExpirationDate`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Vencimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDocumentExpiration(`senior-${index}`)} onOpenChange={(open) => setCalendarOpenDocumentExpirationFor(`senior-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDocumentExpiration(`senior-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDocumentExpirationFor(`senior-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[160px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.documentIssueCountry`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Emisor</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[160px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[160px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.firstName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Primer Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.middleName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Segundo Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.lastName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Apellidos</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese sus apellidos" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.genderType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:flex-1">
                                                            <FormLabel>Genero</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:flex-1">
                                                                        <SelectValue placeholder="Genero ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:flex-1">
                                                                    {genderTypes.map((genderType) => (
                                                                        <SelectItem key={genderType.value} value={genderType.value}>
                                                                            {genderType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.dateBirth`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Fecha Nacimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDateBirth(`senior-${index}`)} onOpenChange={(open) => setCalendarOpenDateBirthFor(`senior-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDateBirth(`senior-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDateBirthFor(`senior-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.countryBirth`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Nacimiento</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.countryNationality`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Nacionalidad</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`seniorPassengers.${index}.countryResidence`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Residencia</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    }
                    {/* Fin lista de pasajeros tercera edad */}

                    {/* Inicio lista de pasajeros infante */}
                    {infantFields.length > 0 &&
                        <Card className="gap-0 py-0 rounded-sm border-2">
                            <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                                <div className="grid gap-0.5">
                                    <CardTitle className="group flex items-center gap-2 text-lg">
                                        Lista de Pasajeros Infantes
                                    </CardTitle>
                                    <CardDescription>
                                        Ingrese toda la informacion que se le solicita.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex flex-col">
                                    {infantFields.map((field, index: number) => (
                                    <div key={field.id} className="flex flex-row w-full items-start">
                                        <div className="flex flex-col gap-2">
                                            {index > 0 && <Separator className="mt-4"/>}
                                            <div className="flex flex-row w-full items-start">
                                                <label>Documento: Infante {index + 1}</label>
                                            </div>
                                            <Separator className="my-1"/>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.documentType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:w-[120px]">
                                                            <FormLabel>Tipo</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[120px]">
                                                                        <SelectValue placeholder="tipo ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[120px]">
                                                                    {documentTypes.map((docType) => (
                                                                        <SelectItem key={docType.value} value={docType.value}>
                                                                            {docType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.documentNumber`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Numero</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Numero de Documento" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.documentExpirationDate`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Vencimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDocumentExpiration(`infant-${index}`)} onOpenChange={(open) => setCalendarOpenDocumentExpirationFor(`infant-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDocumentExpiration(`infant-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDocumentExpirationFor(`infant-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                
                                                <div className="w-full md:w-[160px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.documentIssueCountry`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Emisor</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[160px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[160px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.firstName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Primer Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.middleName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Segundo Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese su nombre" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.lastName`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:flex-1">
                                                                <FormLabel>Apellidos</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Ingrese sus apellidos" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.genderType`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full md:flex-1">
                                                            <FormLabel>Genero</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:flex-1">
                                                                        <SelectValue placeholder="Genero ..." />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:flex-1">
                                                                    {genderTypes.map((genderType) => (
                                                                        <SelectItem key={genderType.value} value={genderType.value}>
                                                                            {genderType.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full gap-2 items-start">
                                                <div className="w-full md:w-[120px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.dateBirth`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full md:w-[120px]">
                                                                <FormLabel>Fecha Nacimiento</FormLabel>
                                                                <FormControl>
                                                                    <Popover open={isCalendarOpenDateBirth(`infant-${index}`)} onOpenChange={(open) => setCalendarOpenDateBirthFor(`infant-${index}`, open)}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={isCalendarOpenDateBirth(`infant-${index}`)}
                                                                                className="w-full md:w-[120px] justify-between"
                                                                            >
                                                                                {field.value ? 
                                                                                    `${field.value?.toLocaleDateString()}` 
                                                                                    : "MM/DD/YYYY"
                                                                                }
                                                                                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                defaultMonth={field.value}
                                                                                selected={field.value}
                                                                                onSelect={field.onChange}
                                                                                numberOfMonths={1}
                                                                                className="rounded-lg border shadow-sm"
                                                                            />
                                                                            {/* Buttons */}
                                                                            <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        if (field.value) {
                                                                                            field.onChange(field.value); // update the form
                                                                                            setCalendarOpenDateBirthFor(`infant-${index}`, false); // close popover for this item
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Cerrar
                                                                                </Button>
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.countryBirth`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Pais Nacimiento</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.countryNationality`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Nacionalidad</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="w-full md:w-[150px]">
                                                    <FormField
                                                        control={form.control}
                                                        name={`infantPassengers.${index}.countryResidence`}
                                                        render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Residencia</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={onloadingCountries}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full md:w-[150px]">
                                                                        <SelectValue placeholder={onloadingCountries ? "Cargando Paises..." : "Pais ..."} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="w-full md:w-[150px]">
                                                                    {countries.map((country) => (
                                                                        <SelectItem key={country.id} value={country.abbreviation + ''}>
                                                                            {country.country}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    }
                    {/* Fin lista de pasajeros infante */}

                    {/* Inicio formulario de contacto */}
                    <Card className="gap-0 py-0 rounded-sm border-2">
                        <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                            <div className="grid gap-0.5">
                                <CardTitle className="group flex items-center gap-2 text-lg">
                                    Información de Contacto
                                </CardTitle>
                                <CardDescription>
                                    Ingrese toda la informacion que se le solicita.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex flex-col mt-4 gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full md:flex-1">
                                        <FormField
                                            control={form.control}
                                            name={"client_id_type"}
                                            render={({ field }) => (
                                            <FormItem className="w-full md:flex-1">
                                                <FormLabel>Tipo de Identidad</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full md:flex-1">
                                                            <SelectValue placeholder="Tipo ID ..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="w-full md:flex-1">
                                                        {clientIdTypes.map((idType) => (
                                                            <SelectItem key={idType.value} value={idType.value}>
                                                                {idType.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full md:flex-1">
                                        <FormField
                                            control={form.control}
                                            name={"client_id"}
                                            render={({ field }) => (
                                                <FormItem className="w-full md:flex-1">
                                                    <FormLabel>Identidad</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ingrese su Identidad" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full md:flex-1">
                                        <FormField
                                            control={form.control}
                                            name={"client_first_name"}
                                            render={({ field }) => (
                                                <FormItem className="w-full md:flex-1">
                                                    <FormLabel>Nombres</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ingrese su nombre" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full md:flex-1">
                                        <FormField
                                            control={form.control}
                                            name={"client_last_name"}
                                            render={({ field }) => (
                                                <FormItem className="w-full md:flex-1">
                                                    <FormLabel>Apellidos</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ingrese su Apellido" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full md:flex-1">
                                        <FormField
                                            control={form.control}
                                            name={"client_telephone"}
                                            render={({ field }) => (
                                                <FormItem className="w-full md:flex-1">
                                                    <FormLabel>Telefono</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ingrese un Telefono" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full md:flex-1">
                                        <FormField
                                            control={form.control}
                                            name={"client_email"}
                                            render={({ field }) => (
                                                <FormItem className="w-full md:flex-1">
                                                    <FormLabel>Correo</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ingrese un Correo" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Fin formulario de contacto */}

                    <Separator />
                    <div className="flex flex-col mt-4">
                        <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Aceptar Terminos y Condiciones.
                                            <Link href="/terms-conditions" target="_blank" className="ml-4 text-primary hover:underline flex flex-row items-center">
                                                <ArrowRight /> Leer mas.
                                            </Link>
                                        </FormLabel>
                                        <FormDescription>
                                            Usted acepta los terminos y condiciones, asi como las politica internas de la empresa.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col md:flex-row justify-between">
                            <Button className="mt-4 w-full md:w-1/5" disabled={onSavingReservationTemp} onClick={() => onNext && onNext(1)}>Atras</Button>
                            <Button className="mt-4 w-full md:w-3/5" type="submit" disabled={!termsAccepted || onSavingReservationTemp}>
                            {!onSavingReservationTemp ?
                                "Ejecutar Pago" :
                                "Guardando Reservacion..."
                            }
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PassengerListPage;