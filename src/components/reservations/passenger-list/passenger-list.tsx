import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"

import { Flight } from "@/components/types/flights";
import { FormSchema } from "@/components/reservations/search-form/search-form";

interface PassengerListPageProps {
    searchData?: z.infer<typeof FormSchema>;
    onNext?: (data: number) => void;
    selectedFlightOW?: Flight | null;
    selectedFlightRT?: Flight | null;
}

const FormSchemaPassengers = z.object({
  terms: z.boolean(),
  name: z.string().nonempty("Por favor ingrese un nombre.")
})

const PassengerListPage: React.FC<PassengerListPageProps> = ({ searchData, onNext, selectedFlightOW, selectedFlightRT }) => {
    const form = useForm<z.infer<typeof FormSchemaPassengers>>({
        resolver: zodResolver(FormSchemaPassengers),
        defaultValues: {
            terms: false,
            name: "",
        },
    })

    // watch the terms checkbox so we can enable/disable the submit button
    const termsAccepted = form.watch("terms");

    function onSubmitPassengers(data: z.infer<typeof FormSchemaPassengers>) {
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
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
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