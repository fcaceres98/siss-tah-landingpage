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
import { ArrowRight, ArrowUpRight, PlaneTakeoff  } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

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
    function formatDateYMDToDMY(dateStr?: string) {
        if (!dateStr) return "—";
        const [year, month, day] = dateStr.split("-");

        if (!year || !month || !day) return "—";

        // month is 0-based in JS Date
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
        if (isNaN(dateObj.getTime())) return "—";
        return format(dateObj, "dd/MM/yyyy", { locale: es });
    }
    function getDuration(departure?: string, arrival?: string) {
        if (!departure || !arrival) return "—";

        // Use a fixed date for both times
        const refDate = "2025-01-01";
        const dep = new Date(`${refDate}T${departure}`);
        const arr = new Date(`${refDate}T${arrival}`);

        if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return "—";

        let diff = (arr.getTime() - dep.getTime()) / 1000; // seconds
        if (diff < 0) diff += 24 * 3600; // handle overnight flights

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);

        return `${hours}h ${minutes}m`;
    }

    const [selectedFlightOW, setSelectedFlightOW] = useState<Flight | null>(null);
    const [selectedFlightRT, setSelectedFlightRT] = useState<Flight | null>(null);
    
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

    const [valueRT, setValueRT] = useState<number>(0);

    useEffect(() => {
        if (!selectedFlightOW || !selectedFlightRT)  return;

        const fetchValueRT = async () => {
            if (selectedFlightOW.flight_fees[0].valueRT >= selectedFlightRT.flight_fees[0].valueRT) {
                setValueRT(selectedFlightOW.flight_fees[0].valueRT);
            } else {
                setValueRT(selectedFlightRT.flight_fees[0].valueRT);
            }
        };

        fetchValueRT();
    }, [selectedFlightOW, selectedFlightRT]);
    
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
                                            <ToggleGroup
                                                type="single"
                                                value={selectedFlightOW?.id.toString() || ""}
                                                onValueChange={(value: string) => {
                                                    const selected = flightsOW.find(f => f.id.toString() === value);
                                                    setSelectedFlightOW(selected || null);
                                                }}
                                            >
                                            {loadingFlightsOW ? (
                                                <Skeleton className="w-full h-20" />
                                            ) : flightsOW.length > 0 ? (
                                                flightsOW.map((flightOW) => (
                                                    <div key={flightOW.id} className="flex flex-col rounded-md bg-white dark:bg-slate-950 border-1">
                                                        <div className="flex flex-col md:flex-row bg-slate-100 dark:bg-muted pl-5 py-1 rounded-t-md">
                                                            <label>{flightOW.from_destination}({flightOW.from_iata})&nbsp;</label>
                                                            <ArrowRight className="md:mx-3" />
                                                            <label>{flightOW.to_destination}({flightOW.to_iata})&nbsp;</label>
                                                            <label className="flex flex-row"><PlaneTakeoff className="mr-1" /> Vuelo: TAH-{flightOW.flight_no}</label>
                                                        </div>
                                                        <div className="flex flex-col md:flex-row gap-[10px] p-3 justify-between">
                                                            <div className="w-full md:w-[40px] justify-center items-center flex">
                                                                <ToggleGroupItem value={flightOW.id.toString()} aria-label="Seleccionar OW">
                                                                    <ArrowUpRight />
                                                                </ToggleGroupItem>
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <label className="text-xl">Desde</label>
                                                                <Separator />
                                                                <label>{formatDateYMDToDMY(flightOW.date)}</label>
                                                                <label>{flightOW.departure ? format(new Date(`2025-01-01T${flightOW.departure}`), "h:mm a", { locale: es }) : "—"}</label>
                                                                <label>{flightOW.from_destination}({flightOW.from_iata})</label>
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <label className="text-xl">Hasta</label>
                                                                <Separator />
                                                                <label>{formatDateYMDToDMY(flightOW.date)}</label>
                                                                <label>{flightOW.arrival ? format(new Date(`2025-01-01T${flightOW.arrival}`), "h:mm a", { locale: es }) : "—"}</label>
                                                                <label>{flightOW.to_destination}({flightOW.to_iata})</label>
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <label className="text-xl">Detalle</label>
                                                                <Separator />
                                                                <label >Aeronave: {flightOW.plane.description}</label>
                                                                <label >Duración: {getDuration(flightOW.departure, flightOW.arrival)}</label>
                                                                <label >Equipaje de mano 10KG.</label>
                                                                <label >Equipaje de carga 25KG</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No hay resultados en esta busqueda.</p>
                                            )}
                                            </ToggleGroup>
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
                                            <ToggleGroup
                                                type="single"
                                                value={selectedFlightRT?.id.toString() || ""}
                                                onValueChange={(value: string) => {
                                                    const selected = flightsRT.find(f => f.id.toString() === value);
                                                    setSelectedFlightRT(selected || null);
                                                }}
                                            >
                                            {loadingFlightsRT ? (
                                                <Skeleton className="w-full h-20" />
                                            ) : flightsRT.length > 0 ? (
                                                flightsRT.map((flightRT) => (
                                                    <div key={flightRT.id} className="flex flex-col rounded-md  bg-white dark:bg-slate-950 border-1">
                                                        <div className="flex flex-col md:flex-row bg-slate-100 dark:bg-muted pl-5 py-1 rounded-t-md">
                                                            <label>{flightRT.from_destination}({flightRT.from_iata})&nbsp;</label>
                                                            <ArrowRight className="md:mx-3" />
                                                            <label>{flightRT.to_destination}({flightRT.to_iata})&nbsp;</label>
                                                            <label className="flex flex-row"><PlaneTakeoff className="mr-1" />Vuelo: TAH-{flightRT.flight_no}</label>
                                                        </div>
                                                        
                                                        <div className="flex flex-col md:flex-row gap-[10px] p-3 justify-between">
                                                            <div className="w-full md:w-[40px] justify-center items-center flex">
                                                                <ToggleGroupItem value={flightRT.id.toString()} aria-label="Seleccionar OW">
                                                                    <ArrowUpRight />
                                                                </ToggleGroupItem>
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <label className="text-xl">Desde</label>
                                                                <Separator />
                                                                <label>{formatDateYMDToDMY(flightRT.date)}</label>
                                                                <label>{flightRT.departure ? format(new Date(`2025-01-01T${flightRT.departure}`), "h:mm a", { locale: es }) : "—"}</label>
                                                                <label>{flightRT.from_destination}({flightRT.from_iata})</label>
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <label className="text-xl">Hasta</label>
                                                                <Separator />
                                                                <label>{formatDateYMDToDMY(flightRT.date)}</label>
                                                                <label>{flightRT.arrival ? format(new Date(`2025-01-01T${flightRT.arrival}`), "h:mm a", { locale: es }) : "—"}</label>
                                                                <label>{flightRT.to_destination}({flightRT.to_iata})</label>
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <label className="text-xl">Detalle</label>
                                                                <Separator />
                                                                <label >Aeronave: {flightRT.plane.description}</label>
                                                                <label >Duración: {getDuration(flightRT.departure, flightRT.arrival)}</label>
                                                                <label >Equipaje de mano 10KG.</label>
                                                                <label >Equipaje de carga 25KG</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No hay resultados en esta busqueda.</p>
                                            )}
                                            </ToggleGroup>
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
                                                        Subtotal:
                                                    </span>
                                                    {valueRT ? <span>${valueRT}</span> : <span>-</span>}
                                                </li>
                                            </ul>
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