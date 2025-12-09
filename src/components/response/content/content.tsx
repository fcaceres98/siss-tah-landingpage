"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import Navbar03Page from "@/components/reservations/navbar-03/navbar-03";
import Footer04Page from "@/components/footer-04/footer-04";

import ResponsePage from "@/components/response/response/response";
import InvoicePage from "@/components/response/invoice/invoice";

import { InvoiceModule } from "@/components/types/Invoice";
import { ResponseData } from "@/components/types/responseData";

export default function Content() {

    const searchParams = useSearchParams();
    const invoiceId_temp = searchParams.get("invoice_id_temp");
    const reservationId_temp = searchParams.get("reservation_id_temp");
    
    const [invoiceTemp, setInvoiceTemp] = useState<InvoiceModule | null>(null);
    const [LoadingInvoice, setLoadingInvoice] = useState<boolean>(true);
    const [responseData, setResponseData] = useState<ResponseData | null>(null);


    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchTempInvoice = async () => {
            try {
                setLoadingInvoice(true);
                
                const resTemp = await fetch(apiUrl + '/tahonduras-online/reservations/onlinetemp/' + invoiceId_temp + '/' + reservationId_temp);
                if (!resTemp.ok) throw new Error("Error fetching destinations");
                const dataTemp = await resTemp.json();
                dataTemp.invoice.reservation = dataTemp.reservation;
                setInvoiceTemp(dataTemp.invoice);
                setResponseData(dataTemp.responseData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingInvoice(false);
            }
        };

        fetchTempInvoice();
    }, [apiUrl, invoiceId_temp, reservationId_temp]);

    return (
        <>
            <Navbar03Page />
            <div className="flex flex-col max-w-screen items-center gap-2 p-4 bg-muted">
                <Card className="flex flex-col w-full max-w-5xl mx-auto border p-4 bg-background">
                    <CardHeader className="border-b">
                        <CardTitle>Factura</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        {LoadingInvoice ? (
                        <div className="col-span-1">
                            <div className="flex-1">
                                <Skeleton className="w-full h-[20px]" />
                            </div>
                        </div>
                        ) : (
                        <div className="col-span-1">
                            <div className="flex-1">
                                <ResponsePage response={responseData} />
                            </div>
                            { responseData?.status === "APPROVED" &&
                            <div className="flex-1">
                                <InvoicePage invoice={invoiceTemp} />
                            </div>
                            }
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Footer04Page />
        </>
    );
}