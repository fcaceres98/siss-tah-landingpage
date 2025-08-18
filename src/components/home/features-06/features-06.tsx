// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";

const features = [
  {
    category: "Marketing y Ventas",
    title: "Reserva y organiza tu viaje fácilmente",
    details: "Controla cada paso de tu compra y recibe confirmaciones inmediatas. Nuestra plataforma te ayuda a encontrar las mejores opciones para tus vuelos y gestionar tu itinerario sin complicaciones.",
    textBottom: "Leer Más",
    tutorialLink: "#",
  }, {
    category: "Seguridad y Confiabilidad",
    title: "Tu seguridad, nuestra prioridad",
    details: "En TAH operamos con los más altos estándares internacionales de seguridad aérea. Nuestro compromiso es garantizar vuelos confiables, con tripulaciones altamente capacitadas y aviones certificados para tu tranquilidad.",
    textBottom: "Leer Más",
    tutorialLink: "#",
  }, {
    category: "Experiencia a Bordo",
    title: "Comodidad y atención en cada vuelo",
    details: "Queremos que disfrutes tu viaje desde el momento en que abordas. Ofrecemos un servicio personalizado, trato cálido y una experiencia diseñada para hacer de tu vuelo un momento agradable y placentero.",
    textBottom: "Leer Más",
    tutorialLink: "#",
  }, {
    category: "Conectividad y Destinos",
    title: "Conectando Honduras con la región",
    details: "Descubre la facilidad de viajar con TAH, una aerolínea que une ciudades, culturas y oportunidades en Honduras y Centroamérica. Llevamos a nuestros pasajeros más cerca de lo que importa.",
    textBottom: "Leer Más",
    tutorialLink: "#",
  },
];

const Features06Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-screen-lg w-full py-10 px-6">
        <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight max-w-xl md:text-center md:mx-auto">
          Organiza y Viaja Mejor, soluciones Inteligentes para tu viaje
        </h2>
        <div className="mt-8 md:mt-16 w-full mx-auto space-y-20">
          {features.map((feature) => (
            <div
              key={feature.category}
              className="flex flex-col md:flex-row items-center gap-x-20 gap-y-6 md:odd:flex-row-reverse"
            >
              <div className="w-full aspect-[6/4] bg-muted rounded-xl border border-border/50 basis-1/2" />
              <div className="basis-1/2 shrink-0">
                <span className="uppercase font-semibold text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-3xl font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-[17px]">
                  {feature.details}
                </p>
                {/* <Button
                  asChild
                  className="mt-6 rounded-full min-w-40 text-[15px]"
                >
                  <Link href={feature.tutorialLink}>
                    {feature.textBottom} <ArrowRight />
                  </Link>
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features06Page;
