import React from "react";
import Image from "next/image";

const Hero02 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2]">
            Mercancias Peligrosas
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            MATERIALES PELIGROSOS, por razones de seguridad, las mercancías peligrosas no deben ser empacados en el counter o en cabina con excepción de lo permitido específicamente.
          </p>

          <p className="mt-6 max-w-[60ch] text-lg">
            Las mercancías peligrosas incluyen, pero no se limitan a: gases comprimidos, corrosivos, explosivos, líquidos y sólidos inflamables, materiales radioactivos, materiales oxidantes, venenos, sustancias infecciosas y maletines con dispositivos de alarma instalados. Por razones de seguridad, se pueden aplicar otras Restricciones, consulte con atención al cliente.
          </p>

          <p className="mt-6 max-w-[60ch] text-lg">
            No empaque o llevar a bordo de los artículos representados a continuación sin consultar con la atención al cliente. NO PONGA EN PELIGRO SU SEGURIDAD Y LA DE LOS PASAJEROS QUE LO ACOMPAÑAN.
          </p>
        </div>
        <div className="w-full aspect-video bg-accent rounded-xl">
          <Image src="/images/dangerous-goods/dangerous-goods-hero.jpg" width={1920} height={1080} alt="Mercancias Peligrosas" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default Hero02;
