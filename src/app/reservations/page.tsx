"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Navbar03Page from "@/components/reservations/navbar-03/navbar-03";

import SearchFormPage from "@/components/reservations/search-form/search-form";
import { FormSchema } from "@/components/reservations/search-form/search-form";

import ItineraryListPage from "@/components/reservations/itinerary-list/itinerary-list";
import PassengerListPage from "@/components/reservations/passenger-list/passenger-list";
import ResultPanelPage from "@/components/reservations/result-panel/result-panel";

import Footer04Page from "@/components/footer-04/footer-04";

import { Flight } from "@/components/types/flights";

interface rtValues {
  feeRate: number;
  taxDescription: string;
  taxISV: number;
  subTotal: number;
  discount: number;
  taxDeparture: number;
  taxArrival: number;
  total: number;
}

export default function Home() {

  const [searchData, setSearchData] = React.useState<z.infer<typeof FormSchema> | undefined>(undefined);
  const [step, setStep] = React.useState(1);
  const [selectedFlightOW, setSelectedFlightOW] = useState<Flight | null>(null);
  const [selectedFlightRT, setSelectedFlightRT] = useState<Flight | null>(null);

  const [title, setTitle] = React.useState("Itinerario");

  const [rtValues, setRTValues] = useState<rtValues>({
    feeRate: 0,
    taxDescription: "ISV",
    taxISV: 0,
    subTotal: 0,
    discount: 0,
    taxDeparture: 0,
    taxArrival: 0,
    total: 0,
  });
  useEffect(() => {
    if (!selectedFlightOW || !selectedFlightRT || !searchData)  return;

    const cantPax = Number(searchData.paxCount.paxAdult) + Number(searchData.paxCount.paxMinor) + Number(searchData.paxCount.paxSenior);

    let fee = 0;
    let feerate = 0;
    let taxdescription = "";
    let taxisv = 0;
    let subtotal = 0;
    let taxdeparture = 0;
    let taxarrival = 0;
    let total = 0;
    
    const fetchValueRT = async () => {
      const owValue = Number(selectedFlightOW.flight_fees[0].valueRT);
      const rtValue = Number(selectedFlightRT.flight_fees[0].valueRT);
      const taxisvRate = Number(selectedFlightRT.itinerary.tax / 100);

      // console.log("selectedFlightOW:", selectedFlightOW);
      // console.log("taxisvRate:", taxisvRate);
      
      fee = Math.max(owValue, rtValue);
      feerate = Number(fee) * Number(cantPax);
      taxdescription = selectedFlightRT.itinerary.tax_description;
      taxisv = feerate * taxisvRate;
      subtotal = feerate + taxisv;
      taxdeparture = Number(selectedFlightOW.flight_fees[0].taxRTHN) * Number(cantPax);
      taxarrival = Number(selectedFlightOW.flight_fees[0].taxRTCU) * Number(cantPax);
      total = subtotal + taxdeparture + taxarrival;

      setRTValues({
        feeRate: feerate,
        taxDescription: taxdescription,
        taxISV: taxisv,
        subTotal: subtotal,
        discount: 0,
        taxDeparture: taxdeparture,
        taxArrival: taxarrival,
        total: total,
      });
    };

    fetchValueRT();
  }, [selectedFlightOW, selectedFlightRT, searchData]);
  
  const handleNext = (nextStep: number) => {
    if (nextStep === 1) {
      setTitle("Itinerario");
      setRTValues({
        feeRate: 0,
        taxDescription: "ISV",
        taxISV: 0,
        subTotal: 0,
        discount: 0,
        taxDeparture: 0,
        taxArrival: 0,
        total: 0,
      });
      setSelectedFlightOW(null);
      setSelectedFlightRT(null);
    }
    if (nextStep === 2) {
      setTitle("Pasajeros");
    }
    setStep(nextStep);
  };

  return (
    <>
      <Navbar03Page />
      <div className="max-w-screen flex flex-col gap-2 p-4 bg-muted">
        <SearchFormPage onNext={handleNext} onSearch={setSearchData}/>

        <Card className="w-7xl mx-auto bg-background border p-4">
          <CardHeader className="border-b">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-1 lg:col-span-2">
              {step === 1 && (
                <ItineraryListPage onNext={handleNext} onSelectedFlightsOW={setSelectedFlightOW} onSelectedFlightsRT={setSelectedFlightRT} searchData={searchData}/>
              )}
              {step === 2 && (
                <PassengerListPage onNext={handleNext} selectedFlightOW={selectedFlightOW} selectedFlightRT={selectedFlightRT} searchData={searchData}/>
              )}
            </div>
            <div className="col-span-1">
              <ResultPanelPage rtValues={rtValues} selectedFlightOW={selectedFlightOW} selectedFlightRT={selectedFlightRT} searchData={searchData}/>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer04Page />
    </>
  );
}
