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

import { Flight } from "@/components/types/flights";
import { Country } from "@/components/types/Country";
import { FormSchema } from "@/components/reservations/search-form/search-form";

interface PassengerListPageProps {
    searchData?: z.infer<typeof FormSchema>;
    onNext?: (data: number) => void;
    selectedFlightOW?: Flight | null;
    selectedFlightRT?: Flight | null;
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
});

const FormSchemaPassengers = z.object({
  terms: z.boolean(),
  
  adultPassengers: z.array(PassengerSchema),
  minorPassengers: z.array(PassengerSchema),
  seniorPassengers: z.array(PassengerSchema),
  infantPassengers: z.array(PassengerSchema),
})

const PassengerListPage: React.FC<PassengerListPageProps> = ({ searchData, onNext, selectedFlightOW, selectedFlightRT }) => {

    const documentTypes = [
        { value: "DNI", label: "DNI" },
        { value: "PASSPORT", label: "PASSPORT" },
    ];
    const genderTypes = [
        { value: "MASCULINO", label: "MASCULINO" },
        { value: "FEMENINO", label: "FEMENINO" },
    ];

    const [countries, setCountries] = useState<Country[]>([]);
    const [onloadingCountries, setOnLoadingCountries] = useState<boolean>(false);
    const [calendarOpen, setCalendarOpen] = React.useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        async function fetchCountries() {
            setOnLoadingCountries(true);
            try {
                const response = await fetch(`${apiUrl}/tahonduras-online/countries/enabled`);
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setOnLoadingCountries(false);
            }
        }
        fetchCountries();
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
            })),
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
    const termsAccepted = form.watch("terms");

    function onSubmitPassengers(data: z.infer<typeof FormSchemaPassengers>) {
        console.log("Form submitted:", JSON.stringify(data, null, '\t'));
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
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
                                        <div className="flex flex-col gap-2">
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
                                                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={calendarOpen}
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
                                                                        <SelectItem key={country.id} value={country.id + ''}>
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
                                                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={calendarOpen}
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
                                                                        <SelectItem key={country.id} value={country.id + ''}>
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
                                                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={calendarOpen}
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
                                                                        <SelectItem key={country.id} value={country.id + ''}>
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
                                                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                role="combobox"
                                                                                aria-expanded={calendarOpen}
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
                                                                        <SelectItem key={country.id} value={country.id + ''}>
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
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    }
                    {/* Fin lista de pasajeros infante */}

                    {/* Inicio formulario de contacto */}
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
                                            Aceptar Terminos y Condiciones. <Link href="/terms-conditions" className="flex flex-row items-center mr-4"><ArrowRight /> Leer mas.</Link>
                                        </FormLabel>
                                        <FormDescription>
                                            Usted acepta los terminos y condiciones, asi como las politica internas de la empresa.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col md:flex-row justify-between">
                            <Button className="mt-4 w-full md:w-1/5" onClick={() => onNext && onNext(1)}>Atras</Button>
                            <Button className="mt-4 w-full md:w-3/5" type="submit" disabled={!termsAccepted}>
                                Ejecutar Pago
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PassengerListPage;