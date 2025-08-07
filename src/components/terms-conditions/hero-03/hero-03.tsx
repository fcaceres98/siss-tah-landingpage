import React from "react";

const Hero03 = () => {
  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center px-6 py-16">
      <div className="text-center max-w-2xl">
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
          Terminos y Condiciones
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          Nuestro compromiso es ofrecerle una experiencia segura, eficiente y 
          transparente. En caso de dudas, nuestro equipo de atención al cliente 
          está a su disposición para brindarle asistencia.
        </p>
        <p className="mt-6 text-[17px] md:text-lg">
          El pasajero acepta los términos y condiciones de la aerolínea, en virtud 
          de este contrato de adhesión. Aplican para todos los canales de venta.
        </p>
      </div>
    </div>
  );
};

export default Hero03;
