import {
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: PlaneTakeoff,
    title: "Comayagua (XPL) hacia Felipe Angeles (NLU)",
    description:
      "Saliendo: 9:20 AM, Llegando: 11:20 AM",
  },
  {
    icon: PlaneLanding,
    title: "Felipe Angeles (NLU) hacia Comayagua (XPL)",
    description:
      "Saliendo: 12:40 PM, Llegando: 3:00 PM",
  },
];

const Features01Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
          Itinerario de Vuelos
        </h2>
        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-screen-lg mx-auto px-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col border rounded-xl py-6 px-5 bg-accent"
            >
              <div className="mb-3 h-10 w-10 flex items-center justify-center rounded-full bg-background">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">{feature.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features01Page;
