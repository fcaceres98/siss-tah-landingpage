"use client";

import React, { useEffect, useState } from "react"
import { z } from "zod";
import { FormSchema } from "@/components/reservations/search-form/search-form";

// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Destination } from "@/components/types/destination";
import { Flight } from "@/components/types/flights";

interface ItineraryListPageProps {
  searchData?: z.infer<typeof FormSchema>;
}

const ItineraryListPage: React.FC<ItineraryListPageProps> = ({ searchData }) => {

    const formatDate = (date?: Date | string) => {
        if (!date) return "—";
        return format(new Date(date), "dd/MM/yyyy", { locale: es });
    };
    const formatDateServer = (date?: Date | string) => {
        if (!date) return "—";
        return format(new Date(date), "yyyy-MM-dd", { locale: es });
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

    const [flightsOW, setFlightsOW] = useState<Flight[]>([]);
    const [loadingFlightsOW, setLoadingFlightsOW] = useState(true);

    const [flightsRT, setFlightsRT] = useState<Flight[]>([]);
    const [loadingFlightsRT, setLoadingFlightsRT] = useState(true);

    useEffect(() => {
        if (!searchData) return;

        const fetchFlights = async () => {
            try {
                setLoadingFlightsOW(true);
                setLoadingFlightsRT(true);

                const resOW = await fetch(apiUrl + '/tahonduras-online/flights/details?searchDate=' + formatDateServer(searchData?.dateRange.from) + '&desde=' + searchData?.from + '&hasta=' + searchData?.to + '&adultos=' + searchData?.paxCount.paxAdult + '&menores=' + searchData?.paxCount.paxMinor + '&mayores=' + searchData?.paxCount.paxSenior);
                if (!resOW.ok) throw new Error("Error fetching destinations");
                const dataOW: Flight[] = await resOW.json();
                setFlightsOW(dataOW);

                const resRT = await fetch(apiUrl + '/tahonduras-online/flights/details?searchDate=' + formatDateServer(searchData?.dateRange.to) + '&desde=' + searchData?.to + '&hasta=' + searchData?.from + '&adultos=' + searchData?.paxCount.paxAdult + '&menores=' + searchData?.paxCount.paxMinor + '&mayores=' + searchData?.paxCount.paxSenior);
                if (!resRT.ok) throw new Error("Error fetching destinations");
                const dataRT: Flight[] = await resRT.json();
                setFlightsRT(dataRT);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingFlightsOW(false);
                setLoadingFlightsRT(false);
            }
        };

        fetchFlights();
    }, [apiUrl, searchData]);
    
    if (loadingDestinations) {
        return (
            <div>
                <Card className="max-w-screen-xl mx-auto bg-background border-b p-4">
                    <CardHeader>
                        <CardTitle>Lista de Itinerario</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Skeleton className="col-span-1 lg:col-span-2 h-10" />
                            <Skeleton className="col-span-1 h-10" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    } else {
        if (!searchData) {
            return (
                <div>
                    <Card className="max-w-screen-xl mx-auto bg-background border-b p-4">
                        <CardHeader>
                            <CardTitle>Lista de Itinerario</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center lg:flex-row gap-4">
                            <p>Realiza una búsqueda para ver los itinerarios disponibles.</p>
                        </CardContent>
                    </Card>
                </div>
            );
        } else {
            const fromDestination = destinations.find(d => d.id === Number(searchData?.from));
            const toDestination = destinations.find(d => d.id === Number(searchData?.to));
            
            return (
                <div>
                    <Card className="max-w-screen-xl mx-auto bg-background border p-4">
                        <CardHeader className="border-b">
                            <CardTitle>Itinerario</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="col-span-1 lg:col-span-2">
                                <div className="grid grid-cols gap-4">
                                    <Card className="gap-0 py-0 rounded-sm border-2">
                                        <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                                            <div className="grid gap-0.5">
                                                <CardTitle className="group flex items-center gap-2 text-lg">
                                                    Lista de vuelos de Salida
                                                </CardTitle>
                                                <CardDescription>
                                                    Detalle de vuelos disponibles.
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            {loadingFlightsOW ? (
                                                <Skeleton className="w-full h-20" />
                                            ) : (
                                                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                                    <code className="text-white">{JSON.stringify(flightsOW, null, 2)}</code>
                                                </pre>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="gap-0 py-0 rounded-sm border-2">
                                        <CardHeader className="flex flex-row items-start bg-muted/50 py-2">
                                            <div className="grid gap-0.5">
                                                <CardTitle className="group flex items-center gap-2 text-lg">
                                                    Lista de vuelos de Regreso
                                                </CardTitle>
                                                <CardDescription>
                                                    Detalle de vuelos disponibles.
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            {loadingFlightsRT ? (
                                                <Skeleton className="w-full h-20" />
                                            ) : (
                                                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                                    <code className="text-white">{JSON.stringify(flightsRT, null, 2)}</code>
                                                </pre>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div className="col-span-1">
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
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }
    }
};

export default ItineraryListPage;