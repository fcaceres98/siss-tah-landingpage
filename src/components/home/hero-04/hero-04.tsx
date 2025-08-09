import { Button } from "@/components/ui/button";
import { ArrowUpRight, UserRound } from "lucide-react";
import React from "react";

const Hero04 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12 lg:py-0">
        <div className="my-auto">
          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Transportes Aereos de Honduras
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            Explora con nosotros la grandeza de Centro America desde las alturas, conectando culturas, personas y destinos con seguridad, pasión y excelencia aérea.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Reserva Ya <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <UserRound className="!h-5 !w-5" /> Contactanos
            </Button>
          </div>
        </div>
        <div className="w-full aspect-video lg:aspect-auto lg:w-[1000px] lg:h-[calc(100vh-4rem)] bg-accent rounded-xl" />
      </div>
    </div>
  );
};

export default Hero04;
