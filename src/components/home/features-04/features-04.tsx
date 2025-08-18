import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookCheck,
  ChartPie,
  Goal,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Goal,
    title: "Rutas directas y seguras",
    description:
      "Volamos desde Comayagua hacia los destinos más populares de México.",
  },
  {
    icon: BookCheck,
    title: "Precios competitivos",
    description:
      "Ofrecemos tarifas exclusivas y promociones especiales para que viajes al mejor precio.",
  },
  {
    icon: ChartPie,
    title: "Compra rápida y sencilla",
    description:
      "Con nuestra plataforma online, reserva tu boleto en minutos, sin complicaciones.",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    description:
      "Nuestro equipo está disponible para ayudarte antes, durante y después de tu viaje.",
  },
  {
    icon: Zap,
    title: "Pago seguro",
    description:
      "Todos los métodos de pago cuentan con la máxima seguridad para proteger tus datos.",
  },
];

const Features04Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="max-w-screen-lg w-full py-12 px-6">
        <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight max-w-lg">
          Descubre nuestras ventajas para tu viaje
        </h2>
        <div className="mt-6 md:mt-8 w-full mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <Accordion defaultValue="item-0" type="single" className="w-full">
              {features.map(({ title, description, icon: Icon }, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="data-[state=open]:border-b-2 data-[state=open]:border-primary"
                >
                  <AccordionTrigger className="text-lg [&>svg]:hidden">
                    <div className="flex items-center gap-4">
                      <Icon />
                      {title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground">
                    {description}
                    <div className="mt-6 mb-2 md:hidden aspect-video w-full bg-muted rounded-xl" />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Media */}
          <div className="hidden md:block w-full h-full rounded-xl bg-background" />
        </div>
      </div>
    </div>
  );
};

export default Features04Page;
