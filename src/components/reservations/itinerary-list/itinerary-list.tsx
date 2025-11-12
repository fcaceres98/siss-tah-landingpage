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
import { ArrowRight, ArrowUpRight, PlaneTakeoff  } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Flight } from "@/components/types/flights";

interface ItineraryListPageProps {
  searchData?: z.infer<typeof FormSchema>;
  onNext?: (data: number) => void;
  onSelectedFlightsOW?: (data: Flight) => void;
  onSelectedFlightsRT?: (data: Flight) => void;
}

const ItineraryListPage: React.FC<ItineraryListPageProps> = ({ searchData, onNext, onSelectedFlightsOW, onSelectedFlightsRT }) => {

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
    
    const [flightsOW, setFlightsOW] = useState<Flight[]>([]);
    const [loadingFlightsOW, setLoadingFlightsOW] = useState(true);

    const [flightsRT, setFlightsRT] = useState<Flight[]>([]);
    const [loadingFlightsRT, setLoadingFlightsRT] = useState(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
    
    useEffect(() => {
        if (!selectedFlightOW || !selectedFlightRT)  return;

        const fetchSelectedFlight = async () => {
            if (onSelectedFlightsOW) {
                onSelectedFlightsOW(selectedFlightOW);
            }

            if (onSelectedFlightsRT) {
                onSelectedFlightsRT(selectedFlightOW);
            }
        };

        fetchSelectedFlight();
    }, [selectedFlightOW, selectedFlightRT, onSelectedFlightsOW, onSelectedFlightsRT]);
    
    
    if (!searchData) {
        return (
            <div>
                <p>Realiza una búsqueda para ver los itinerarios disponibles.</p>
            </div>
        );
    } else {
        return (
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
                <Button className="mt-4 w-full md:w-1/5" disabled={!selectedFlightOW || !selectedFlightRT} onClick={() => onNext && onNext(2)}>Siguiente</Button>
            </div>
        );
    }
};

export default ItineraryListPage;