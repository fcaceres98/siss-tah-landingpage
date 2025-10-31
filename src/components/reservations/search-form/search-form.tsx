"use client";
import * as React from "react"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { type DateRange } from "react-day-picker";
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

const arrFlightDestinations = [
  { id: 1, country: "HONDURAS", destination: "SAN PEDRO SULA, HONDURAS", iata: "SAP", icao: "MHSAP", status: "SI", created_at: "2023-05-25 07:56:59", updated_at: "2023-05-25 07:56:59" },
  { id: 2, country: "HONDURAS", destination: "TEGUCIGALPA , HONDURAS", iata: "TGU", icao: "MHTGU", status: "SI", created_at: "2023-05-25 07:56:59", updated_at: "2023-05-25 07:56:59" },
  { id: 3, country: "MEXICO", destination: "FELIPE ÁNGELES, MEXICO", iata: "NLU", icao: "MMSM", status: "SI", created_at: "2023-05-25 07:56:59", updated_at: "2023-05-25 07:56:59" },
  { id: 4, country: "HONDURAS", destination: "ROATAN, HONDURAS", iata: "RTB", icao: "MHRO", status: "SI", created_at: "2023-05-25 07:56:59", updated_at: "2023-05-25 07:56:59" },
] as const

const FormSchema = z.object({
    from: z.string().nonempty("Por favor seleccione un destino."),
    to: z.string().nonempty("Por favor seleccione un destino."),
    dateRange: z.string().nonempty("Por favor seleccione una fecha."),
    
    paxCount: z.number().min(1, "Debe haber al menos un pasajero."),

    paxAdult: z.number().min(0, "Verifique valor del adulto."),
    paxMinor: z.number().min(0, "Verifique valor del adulto."),
    paxSenior: z.number().min(0, "Verifique valor del adulto."),
    paxInfant: z.number().min(0, "Verifique valor del adulto."),
}).refine((data) => data.from !== data.to, {
    message: "El origen y destino no pueden ser iguales",
    path: ["to"],
});

const SearchFormPage = () => {

    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const [paxCountOpen, setPaxCountOpen] = React.useState(false);

    const [cantPax, setValuePax] = React.useState(0);
    const [cantPaxAdult, setValuePaxAdult] = React.useState(0);
    const [cantPaxMinor, setValuePaxMinor] = React.useState(0);
    const [cantPaxSenior, setValuePaxSenior] = React.useState(0);
    const [cantPaxInfant, setValuePaxInfant] = React.useState(0);

    const handlePaxChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const newValue = parseInt(event.target.value, 10);
        if (!isNaN(newValue)) {
            if (type === 'ADULT') {
                console.log('ADULT', newValue);
            }
        }
    };
    const handleMinus = (type: string) => {
        if (type === 'ADULT') {
            if (cantPaxAdult > 0) {
                setValuePaxAdult(cantPaxAdult - 1);
                setValuePax(cantPax - 1);
            }
        }
        if (type === 'MINOR') {
            if (cantPaxMinor > 0) {
                setValuePaxMinor(cantPaxMinor - 1);
                setValuePax(cantPax - 1);
            }
        }
        if (type === 'SENIOR') {
            if (cantPaxSenior > 0) {
                setValuePaxSenior(cantPaxSenior - 1);
                setValuePax(cantPax - 1);
            }
        }
        if (type === 'INFANT') {
            if (cantPaxInfant > 0) {
                setValuePaxInfant(cantPaxInfant - 1);
                setValuePax(cantPax - 1);
            }
        }
    };

    const handlePlus = (type: string) => {
        if (type === 'ADULT') {
            if (cantPaxAdult >= 0) {
                setValuePaxAdult(cantPaxAdult + 1);
                setValuePax(cantPax + 1);
            }
        }
        if (type === 'MINOR') {
            if (cantPaxMinor >= 0) {
                setValuePaxMinor(cantPaxMinor + 1);
                setValuePax(cantPax + 1);
            }
        }
        if (type === 'SENIOR') {
            if (cantPaxSenior >= 0) {
                setValuePaxSenior(cantPaxSenior + 1);
                setValuePax(cantPax + 1);
            }
        }
        if (type === 'INFANT') {
            if (cantPaxInfant >= 0) {
                setValuePaxInfant(cantPaxInfant + 1);
                setValuePax(cantPax + 1);
            }
        }
    };
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: { from: "", to: "" },
    });
    React.useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "from" && value.from === form.getValues("to")) {
                form.setValue("to", "");
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);
    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    };
  return (
    <div className="sticky z-50">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="max-w-screen-xl mx-auto bg-background border-b p-4">
                    <CardHeader>
                        <CardTitle>Busqueda de Itinerario</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center lg:flex-row gap-4">
                        <div className="flex-1 w-full">
                            <FormField
                                control={form.control}
                                name="from"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Desde</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un destino" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {arrFlightDestinations.map((destination) => (
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un destino" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {arrFlightDestinations.map((destination) => (
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
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={calendarOpen}
                                        className="w-full justify-between"
                                    >
                                        {dateRange ? dateRange.from?.toLocaleDateString() + " - " + dateRange.to?.toLocaleDateString() : "Seleccione un rango de fecha"}
                                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                        className="rounded-lg border shadow-sm"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex-1 w-full">
                            <Popover open={paxCountOpen} onOpenChange={setPaxCountOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={paxCountOpen}
                                        className="w-full justify-between"
                                    >
                                        Cantidad de Pasajeros {cantPax} 
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
                                                        value={cantPaxAdult}
                                                        onChange={(event) => handlePaxChange(event, 'ADULT')}
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
                                                        value={cantPaxMinor}
                                                        onChange={(event) => handlePaxChange(event, 'MINOR')}
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
                                                        value={cantPaxSenior}
                                                        onChange={(event) => handlePaxChange(event, 'SENIOR')}
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
                                                        value={cantPaxInfant}
                                                        onChange={(event) => handlePaxChange(event, 'INFANT')}
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