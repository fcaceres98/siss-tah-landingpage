"use client";

import { z } from "zod";
import { FormSchema } from "@/components/reservations/search-form/search-form";

import * as React from "react"
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ItineraryListPageProps {
  searchData?: z.infer<typeof FormSchema>;
}

const ItineraryListPage: React.FC<ItineraryListPageProps> = ({ searchData }) => {

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
    }

    return (
        <div>
            <Card className="max-w-screen-xl mx-auto bg-background border p-4">
                <CardHeader className="border-b">
                    <CardTitle>Lista de Itinerario</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p>Aqui va la lista de itinerarios</p>
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(searchData, null, 2)}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
};

export default ItineraryListPage;