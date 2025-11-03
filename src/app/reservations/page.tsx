"use client";
import * as React from "react"
import { z } from "zod";

import Navbar03Page from "@/components/reservations/navbar-03/navbar-03";

import SearchFormPage from "@/components/reservations/search-form/search-form";
import { FormSchema } from "@/components/reservations/search-form/search-form";

import ItineraryListPage from "@/components/reservations/itinerary-list/itinerary-list";
import Footer04Page from "@/components/footer-04/footer-04";

export default function Home() {

  const [searchData, setSearchData] = React.useState<z.infer<typeof FormSchema> | undefined>(undefined);

  return (
    <>
      <Navbar03Page />
      <div className="max-w-screen w-full flex flex-col gap-2 p-4 bg-muted">
        <SearchFormPage onSearch={setSearchData}/>
        <ItineraryListPage searchData={searchData}/>
      </div>
      <Footer04Page />
    </>
  );
}
