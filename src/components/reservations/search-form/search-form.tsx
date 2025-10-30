"use client";
import * as React from "react"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUpRight, ArrowRightLeft, ChevronsUpDown } from "lucide-react";

import { useForm } from "react-hook-form";
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

const FormSchema = z.object({
    from: z
        .string()
        .min(1, { message: "Por favor seleccione un destino." }),
    to: z
        .string()
        .min(1, { message: "Por favor seleccione un destino." })
});

const SearchFormPage = () => {

    const cantPax = 0;

    const [open, setOpen] = React.useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }
  return (
    <div className="sticky z-50">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="max-w-screen-xl mx-auto bg-background border-b p-4">
                    <div className="flex flex-col items-center lg:flex-row gap-4">
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
                                            <SelectItem value="1">Comayagua</SelectItem>
                                            <SelectItem value="2">Felipe Mexico</SelectItem>
                                            <SelectItem value="3">San Pedro Sula</SelectItem>
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
                                    <FormLabel>Desde</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un destino" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            <SelectItem value="1">Comayagua</SelectItem>
                                            <SelectItem value="2">Felipe Mexico</SelectItem>
                                            <SelectItem value="3">San Pedro Sula</SelectItem>
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
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        Cantidad de Pasajeros {cantPax} 
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-1">
                                    <p>Aqui van los campos</p>
                                </PopoverContent>
                            </Popover>
                            
                        </div>
                        <div className="flex-1">
                            <Button type="submit" className="w-full">
                                Ejecutar Busqueda <ArrowUpRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  );
};

export default SearchFormPage;