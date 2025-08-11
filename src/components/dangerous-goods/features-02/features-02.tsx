import React from "react";
import Image from "next/image";

const Features02Page = () => {
  const features = React.useMemo(() => [
    {
      title: "Materiales Prohibidos",
      image: "/images/dangerous-goods/liquidos-prohibidos.png",
      description: "Materiales consideras prohibidos.",
    },
    {
      title: "Armas de Fuego y Cortantes",
      image: "/images/dangerous-goods/armas-fuego-cortantes.jpg",
      description: "Toda arma de fuego y cortante esta prohibida en cabina.",
    },
    {
      title: "AHAC",
      image: "/images/dangerous-goods/ahac.jpg",
      description: "Ente reguladora de aviacion civil de Honduras.",
    },
  ], []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-accent">
      <div className="w-full">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
          Mercancias Peligrosas
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-md sm:max-w-screen-md lg:max-w-screen-lg w-full mx-auto px-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col text-start">
              <div className="mb-5 sm:mb-6 w-full aspect-[4/5] rounded-xl bg-background" >
                <Image src={feature.image} width={225} height={225} alt="Mercancias Peligrosas" className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-2 max-w-[25ch] text-muted-foreground text-[17px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features02Page;
