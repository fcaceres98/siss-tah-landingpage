"use client";

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRightLeft, ChevronsUpDown, Minus, Plus, CalendarIcon  } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Destination } from "@/components/types/destination";

interface SearchFormPageProps {
  onSearch?: (data: z.infer<typeof FormSchema>) => void;
}

export const FormSchema = z.object({
    from: z.string().nonempty("Por favor seleccione un destino."),
    to: z.string().nonempty("Por favor seleccione un destino."),
    
    dateRange: z.object({
        from: z.date(),
        to: z.date()
    }),

    paxCount: z.object({
        paxAdult: z.number().min(0, "Verifique valor del adulto."),
        paxMinor: z.number().min(0, "Verifique valor del Menor."),
        paxSenior: z.number().min(0, "Verifique valor del Tercera Edad."),
        paxInfant: z.number().min(0, "Verifique valor del Infante."),
    }),
}).refine((data) => data.from !== data.to, {
    message: "El origen y destino no pueden ser iguales",
    path: ["to"],
}).refine((data) => data.paxCount.paxAdult > 0 || data.paxCount.paxSenior > 0, {
    message: "Debe ingresar al menos un adulto.",
    path: ["paxCount"],
});

const SearchFormPage: React.FC<SearchFormPageProps> = ({ onSearch }) => {

    // Inside SearchFormPage:
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
    
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const [paxCountOpen, setPaxCountOpen] = React.useState(false);
    
    const [cantPax, setValuePax] = React.useState(0);
    
    const handlePlus = (type: string) => {
        const paxCount = form.getValues("paxCount");
        const updated = { ...paxCount };

        if (type === "ADULT") updated.paxAdult += 1;
        if (type === "MINOR") updated.paxMinor += 1;
        if (type === "SENIOR") updated.paxSenior += 1;
        if (type === "INFANT") updated.paxInfant += 1;

        form.setValue("paxCount", updated);
    };

    const handleMinus = (type: string) => {
        const paxCount = form.getValues("paxCount");
        const updated = { ...paxCount };

        if (type === "ADULT" && updated.paxAdult > 0) updated.paxAdult -= 1;
        if (type === "MINOR" && updated.paxMinor > 0) updated.paxMinor -= 1;
        if (type === "SENIOR" && updated.paxSenior > 0) updated.paxSenior -= 1;
        if (type === "INFANT" && updated.paxInfant > 0) updated.paxInfant -= 1;

        form.setValue("paxCount", updated);
    };
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            from: "",
            to: "",
            dateRange: { from: new Date(), to: new Date() },
            paxCount: {
                paxAdult: 0,
                paxMinor: 0,
                paxSenior: 0,
                paxInfant: 0,
            },
        },
    });

    // form change
    React.useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "from" && value.from === form.getValues("to")) {
                form.setValue("to", "");
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);
    React.useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name?.startsWith("paxCount")) {
                const pax = value.paxCount ?? {
                    paxAdult: 0,
                    paxMinor: 0,
                    paxSenior: 0,
                    paxInfant: 0,
                };
                const total = (pax?.paxAdult ?? 0) + (pax?.paxMinor ?? 0) + (pax?.paxSenior ?? 0) + (pax?.paxInfant ?? 0);
                setValuePax(total);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (onSearch) {
            onSearch(data);
        }
    };
    
  return (
    <div className="sticky z-50">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="max-w-screen-xl mx-auto bg-background border p-4">
                    <CardHeader className="border-b">
                        <CardTitle>Busqueda de Vuelos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center lg:flex-row gap-4">
                        <div className="flex-1 w-full">
                            <FormField
                                control={form.control}
                                name="from"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Desde</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingDestinations}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={loadingDestinations ? "Cargando destinos..." : "Selecciona un destino"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {destinations.map((destination) => (
                                                <SelectItem key={destination.id} value={destination.id + ''}>
                                                    {destination.destination}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Selecciona tu lugar de salida
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-14 flex justify-center">
                            <ArrowRightLeft />
                        </div>
                        <div className="flex-1 w-full">
                            <FormField
                                control={form.control}
                                name="to"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hasta</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingDestinations}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={loadingDestinations ? "Cargando destinos..." : "Selecciona un destino"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {destinations.map((destination) => (
                                                <SelectItem key={destination.id} value={destination.id + ''}>
                                                    {destination.destination}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Selecciona tu lugar de llegada
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <FormField
                                control={form.control}
                                name="dateRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fechas</FormLabel>
                                        <FormControl>

                                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={calendarOpen}
                                                        className="w-full justify-between"
                                                    >
                                                        {field.value ? 
                                                            `${field.value.from?.toLocaleDateString()} - ${field.value.to?.toLocaleDateString()}` 
                                                            : "Seleccione un rango de fecha"
                                                        }
                                                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="range"
                                                        defaultMonth={field.value.from}
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        numberOfMonths={2}
                                                        className="rounded-lg border shadow-sm"
                                                    />
                                                    {/* Buttons */}
                                                    <div className="flex justify-end gap-2 mt-2 mb-2 mr-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                if (field.value) {
                                                                    field.onChange(field.value); // update the form
                                                                    setCalendarOpen(false); // close popover
                                                                }
                                                            }}
                                                        >
                                                        Cerrar
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                        </FormControl>
                                        <FormDescription>
                                            Seleccione un rango de fecha
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <FormField
                                control={form.control}
                                name="paxCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pasajeros</FormLabel>
                                        <FormControl>

                                            <Popover open={paxCountOpen} onOpenChange={setPaxCountOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={paxCountOpen}
                                                        className="w-full justify-between"
                                                    >
                                                        Cantidad de Pasajeros { cantPax }
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-1">
                                                    <div className="flex flex-col gap-2 p-1">
                                                        <div className="flex flex-col">
                                                            <div className="flex flex-row justify-between">
                                                                <Label>Adultos: </Label>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button variant="outline" size="icon" onClick={() => handleMinus('ADULT')}>
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                    <Input
                                                                        type="number"
                                                                        value={field.value.paxAdult}
                                                                        readOnly
                                                                        className="w-20 text-center"
                                                                    />
                                                                    <Button variant="outline" size="icon" onClick={() => handlePlus('ADULT')}>
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Personas de 13 años a 59 años</span>
                                                        </div>
                                                        
                                                        <div className="flex flex-col">
                                                            <div className="flex flex-row justify-between">
                                                                <Label>Menores: </Label>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button variant="outline" size="icon" onClick={() => handleMinus('MINOR')}>
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                    <Input
                                                                        type="number"
                                                                        value={field.value.paxMinor}
                                                                        readOnly
                                                                        className="w-20 text-center"
                                                                    />
                                                                    <Button variant="outline" size="icon" onClick={() => handlePlus('MINOR')}>
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Niños de 3 años a 12 años</span>
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <div className="flex flex-row justify-between">
                                                                <Label>Tercera Edad: </Label>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button variant="outline" size="icon" onClick={() => handleMinus('SENIOR')}>
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                    <Input
                                                                        type="number"
                                                                        value={field.value.paxSenior}
                                                                        readOnly
                                                                        className="w-20 text-center"
                                                                    />
                                                                    <Button variant="outline" size="icon" onClick={() => handlePlus('SENIOR')}>
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Personas de 60 años en adelante</span>
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <div className="flex flex-row justify-between">
                                                                <Label>Infantes: </Label>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button variant="outline" size="icon" onClick={() => handleMinus('INFANT')}>
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                    <Input
                                                                        type="number"
                                                                        value={field.value.paxInfant}
                                                                        readOnly
                                                                        className="w-20 text-center"
                                                                    />
                                                                    <Button variant="outline" size="icon" onClick={() => handlePlus('INFANT')}>
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Niños de 0 años a 2 años</span>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                        </FormControl>
                                        <FormDescription>
                                            Seleccione cantidad de pasajeros
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-40">
                            <Button type="submit" className="w-full">
                                Ejecutar Busqueda <ArrowUpRight />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    </div>
  );
};

export default SearchFormPage;