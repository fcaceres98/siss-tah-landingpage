"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { FormSchema } from "@/components/reservations/search-form/search-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Destination } from "@/components/types/destination";
import { Flight } from "@/components/types/flights";

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

interface ResultPanelPageProps {
    searchData?: z.infer<typeof FormSchema>;
    selectedFlightOW?: Flight | null;
    selectedFlightRT?: Flight | null;
    rtValues?: rtValues;
}

const ResultPanelPage: React.FC<ResultPanelPageProps> = ({ searchData, selectedFlightOW, selectedFlightRT, rtValues }) => {

    const roundToTwoDecimals = (value: number) => {
        const multiplier = Math.pow(10, 2); 
        return Math.round(value * multiplier) / multiplier;
    };

    const formatDate = (date?: Date | string) => {
        if (!date) return "—";
        return format(new Date(date), "dd/MM/yyyy", { locale: es });
    };
    
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(true);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchDestinations = async () => {
        try {
            const res = await fetch(`${apiUrl}/tahonduras-online/destinations`); // your backend endpoint
            if (!res.ok) throw new Error("Error fetching destinations");
            const data: Destination[] = await res.json();
            setDestinations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDestinations(false);
        }
        };

        fetchDestinations();
    }, [apiUrl]);

    useEffect(() => {
        if (rtValues) {
            rtValues.feeRate = roundToTwoDecimals(rtValues.feeRate);
            rtValues.taxISV = roundToTwoDecimals(rtValues.taxISV);
            rtValues.subTotal = roundToTwoDecimals(rtValues.subTotal);
            rtValues.discount = roundToTwoDecimals(rtValues.discount);
            rtValues.taxDeparture = roundToTwoDecimals(rtValues.taxDeparture);
            rtValues.taxArrival = roundToTwoDecimals(rtValues.taxArrival);
            rtValues.total = roundToTwoDecimals(rtValues.total);
        }
    }, [rtValues]);
    
    if (!searchData) {
        return (
            <Card className="gap-0 py-0 rounded-sm border-2">
                <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Detalle de la Reservacion
                        </CardTitle>
                        <CardDescription>
                            Verifica los detalles antes de ejecutar tu compra.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Detalle</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span>
                                    Por favor realiza una busqueda para ver los detalles de la reservacion.
                                </span>
                            </li>
                        </ul>
                        <Separator className="my-2" />
                    </div>
                </CardContent>
            </Card>
        );
    } else if (loadingDestinations) {
        return (
            <Card className="gap-0 py-0 rounded-sm border-2">
                <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Detalle de la Reservacion
                        </CardTitle>
                        <CardDescription>
                            Verifica los detalles antes de ejecutar tu compra.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <Skeleton className="w-full h-10" />
                </CardContent>
            </Card>
        );
    } else {
        const fromDestination = destinations.find(d => d.id === Number(searchData?.from));
        const toDestination = destinations.find(d => d.id === Number(searchData?.to));
        
        return (
            <Card className="gap-0 py-0 rounded-sm border-2">
                <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Detalle de la Reservacion
                        </CardTitle>
                        <CardDescription>
                            Verifica los detalles antes de ejecutar tu compra.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Detalle</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Desde
                                </span>
                                <span>{fromDestination?.destination ?? "—"}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Hasta
                                </span>
                                <span>{toDestination?.destination ?? "—"}</span>
                            </li>
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Salida
                                </span>
                                <span>{formatDate(searchData.dateRange.from)}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Regreso
                                </span>
                                <span>{formatDate(searchData.dateRange.to)}</span>
                            </li>
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Adultos
                                </span>
                                <span>{searchData.paxCount.paxAdult ?? 0}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Menores
                                </span>
                                <span>{searchData.paxCount.paxMinor ?? 0}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Tercera Edad
                                </span>
                                <span>{searchData.paxCount.paxSenior ?? 0}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Infantes
                                </span>
                                <span>{searchData.paxCount.paxInfant ?? 0}</span>
                            </li>
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex flex-col md:flex-row items-start justify-left">
                                <span className="text-muted-foreground w-full md:w-[80px]">
                                    Vuelo de Salida:
                                </span>
                                {selectedFlightOW instanceof Object ? 
                                <div className="flex flex-col">
                                    <label>TAH-{selectedFlightOW.flight_no}</label>
                                    <label>{selectedFlightOW.from_destination}-({selectedFlightOW.from_iata})</label>
                                    <label>Tarifa: {selectedFlightOW.flight_fees[0].fee} - ${selectedFlightOW.flight_fees[0].valueRT}</label>
                                </div>
                                    : 
                                <span>-</span>
                                }
                            </li>
                            <li className="flex flex-col md:flex-row items-start justify-left">
                                <span className="text-muted-foreground w-full md:w-[80px]">
                                    Vuelo de Regreso:
                                </span>
                                {selectedFlightRT instanceof Object ? 
                                <div className="flex flex-col">
                                    <label>TAH-{selectedFlightRT.flight_no}</label>
                                    <label>{selectedFlightRT.from_destination}-({selectedFlightRT.from_iata})</label>
                                    <label>Tarifa: {selectedFlightRT.flight_fees[0].fee} - ${selectedFlightRT.flight_fees[0].valueRT}</label>
                                </div>
                                    : 
                                <span>-</span>
                                }
                            </li>
                        </ul>

                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex flex-row items-center justify-between">
                                <span className="text-muted-foreground">
                                    Tarifa:
                                </span>
                                {rtValues ? <span>${rtValues.feeRate.toFixed(2)}</span> : <span>-</span>}
                            </li>
                            <li className="flex flex-row items-center justify-between">
                                <span className="text-muted-foreground">
                                    {rtValues?.taxDescription ?? "ISV"}:
                                </span>
                                {rtValues ? <span>${rtValues.taxISV.toFixed(2)}</span> : <span>-</span>}
                            </li>
                            <li className="flex flex-row items-center justify-between">
                                <span className="text-muted-foreground">
                                    Subtotal:
                                </span>
                                {rtValues ? <span>${rtValues.subTotal.toFixed(2)}</span> : <span>-</span>}
                            </li>
                            <li className="flex flex-row items-center justify-between">
                                <span className="text-muted-foreground">
                                    Imp Salida:
                                </span>
                                {rtValues ? <span>${rtValues.taxDeparture.toFixed(2)}</span> : <span>-</span>}
                            </li>
                            <li className="flex flex-row items-center justify-between">
                                <span className="text-muted-foreground">
                                    Imp Regreso:
                                </span>
                                {rtValues ? <span>${rtValues.taxArrival.toFixed(2)}</span> : <span>-</span>}
                            </li>
                            <li className="flex flex-row items-center justify-between">
                                <span className="text-muted-foreground">
                                    Total:
                                </span>
                                {rtValues ? <span>${rtValues.total.toFixed(2)}</span> : <span>-</span>}
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        );
    }
};

export default ResultPanelPage;