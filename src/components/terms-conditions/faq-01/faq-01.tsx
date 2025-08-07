import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const term1 = [
  {
    title: "En Check-In",
    terms:[
      "Presentarse en el aeropuerto al menos tres (3) horas antes de su vuelo (aplica en vuelos domésticos e internacionales).",
      "El vuelo se cierra 1 (una) hora antes de la hora de salida en vuelos domésticos y en internacional una hora antes.",
    ],
  }, {
    title: "Documentos de Viaje",
    terms:[
      "Para vuelos a paises pertenecientes a CA4 se permite viajar con el documento de identidad siempre y cuando usted sea por nacimiento originario de los países miembros de CA4: Honduras, Guatemala, Nicaragua y El Salvador. Este requisito aplica únicamente para mayores de edad. Menores de edad debe de presentar pasaporte vigente y acompañados de un adulto. Extranjeros deben viajar únicamente con pasaporte vigente y revisar requisitos migratorios dependiendo su nacionalidad.",
      "Es responsabilidad del pasajero verificar previo a su viaje requisitos migratorios si viaja en vuelo internacional.",
      "Es responsabilidad del pasajero verificar, previo a su viaje, requisites sanitarios requeridos con  del país donde viaja.",
    ],
  }, {
    title: "Boletos no reembolsables",
    terms:[
      "Boleto no reembolsable ni endosable",
      "El reembolso no es opción bajo ninguna circunstancia independientemente del método de pago con que se haya efectuado la compra.",
      "El cliente acepta que no gestionará rechazos por pagos por tarjeta de crédito/débito a través de link de pago o sitio web, independientemente de que el boleto sea utilizado o no.",
    ],
  }, {
    title: "Cambios y Cancelaciones",
    terms:[
      "Si la tarifa lo permite, puede realizar cambios de fecha. Costos adicionales aplican.",
      "Boleto válido por 6 meses a partir de la fecha de emisión.",
      "Si no viaja el día de su vuelo el sistema automáticamente cancela su vuelo de regreso. Si la tarifa lo permite, podrá solicitar cambio de fecha aplicando penalidades. Si va hacer uso de su regreso debe comunicarse con el call center para re-programar su viaje al número.",
    ],
  }, {
    title: "Tarifas de Promoción",
    terms:[
      "Tarifas de promoción no aplican otro tipo de descuentos.",
      "Tarifas de promoción validas únicamente en vuelos específicos.",
    ],
  }, {
    title: "Políticas de Equipaje",
    terms:[
      "Se permite un (1) artículo personal de mano como ser bolso o mochila no mayor a 10 libras.",
      "TAH no se responsabiliza por daños causados en el equipaje por sobrepeso, cierres dañados o en mal estado, ruedas quebradas, abolladuras o golpes en la superficie de su maleta, ya que el equipaje está sujeto a daños durante el traslado de counter a la aeronave y el manejo aeroportuario pasando por áreas donde la aerolínea no tiene control (rayos x, movimientos bruscos a causa de turbulencia, entre otros).",
      "Los reclamos por equipaje deberán llevarse a cabo inmediatamente después del vuelo o antes de salir del aeropuerto.",
    ],
  }, {
    title: "SERVICIOS ESPECIALES",
    terms:[
      "¡Importante!",
      "No se podrán conceder dos (2) servicios especiales al mismo pasajero, por ejemplo: un menor con una mascota, un menor en silla de rueda que viaje solo; un menor viajando con otro menor de 9 años, etc. Esto, debido a que se requiere la custodia de uno de nuestros agentes en todo momento y por razones de seguridad, solo pueden prestar un servicio especial a la vez.",
      "",
    ],
  }, {
    title: "Son considerados como infantes",
    terms:[
      "De 0 a 2 años no cumplidos (si el infante ya tiene 2 años debe pagar tarifa de niño)",
      "El infante no tiene derecho a franquicia de equipajeTodo infante de 0 a 2 años no cumplidos paga boleto.",
      "El infante no tiene derecho a franquicia de equipaje.",
      "Al momento de registrarse en counter debe presentar pasaporte.",
      "No está permitido que un adulto viaje con 2 o más infantes.",
      "Aceptamos infantes mayores a 10 días de nacidos.",
      "Si el infante tiene 10 días o menos de nacido debe presentar una constancia médica (avalado por el Colegio Médico de Honduras) del pasajero (recién nacido) en el cual indique que el infante puede volar en aeronaves no presurizadas, exonerando de toda responsabilidad a la línea área. (no se aceptarán otro tipo de constancias)",
      "El infante deberá estar acompañado por una persona mayor a 18 años, o por su padre o madre (de cualquier edad).",
    ],
  }, {
    title: "Son considerados como Menores",
    terms:[
      "De 2 a 12 años (Pagan tarifa de menor cargada en sistema)",
    ],
  }, {
    title: "Pasajeros de Tercera Edad",
    terms:[
      "Aplica descuento de tercera edad, toda persona hondureña que haya cumplido los 60 años; si es extranjera debe ser residente hondureño y poseer carnet vigente.",
      "El cliente deberá presentar la identidad o residencia vigente al momento de realizar la compra del boleto para obtener dicho descuento.",
    ],
  }, {
    title: "Mujeres Embarazadas",
    terms:[
      "Toda pasajera en estado de embarazo puede viajar sin inconveniente hasta las 27 semanas.",
      "Si la pasajera tiene entre 28 y 36 semanas de embarazo deberá presentar constancia médica al momento de chequeo donde indique el estado de salud y que no tiene problemas para viajar vía aérea, indicando su fecha próxima de alumbramiento. Dicha constancia debe ser en papel membretado y poseer firma y sello, debe presentar la original en counter.",
      "De igual manera TAH podrá negar el transporte aéreo si el personal observa que no es conveniente el abordaje por seguridad de vuelo, del pasajero y del bebe.",
      "Después de 36 semanas, la pasajera no podrá viajar vía aérea.",
    ],
  }, {
    title: "Transporte de pasajeros con servicio especial",
    terms:[
      "TAH se dedica a proporcionar una experiencia positiva para todos nuestros pasajeros. Si tiene alguna pregunta o desea solicitar asistencia especial, contáctenos al (504) o a nuestro correo electrónico a",
      "Brindamos servicio de silla de ruedas a los pasajeros que la necesiten para el traslado del counter a sala de espera y posteriormente a la aeronave, sin embargo, para poder brindar ese servicio requerimos que se tomen en cuenta las siguientes condiciones:",
      "Debe presentarse en el aeropuerto al menos con 2 horas y media antes de la salida del vuelo (tanto en vuelos nacionales como internacionales).",
      "El pasajero debe de informar con 24 horas de anticipación si necesita alguna silla de ruedas.",
      "Pasajeros que necesitan asistencia especial como ser sordo, mudos, ciegos, parapléjicos o que no se valen de sí mismos, de acuerdo a la edad podrán viajar siempre y cuando sea acompañado por un adulto mayor a 18 años para la asistencia en vuelo.",
      "Todo pasajero que presente algún tipo de enfermedad que pudiese poner en riesgo su seguridad o la del resto de pasajeros, deberá presentar una constancia medica avalada por el COLEGIO MEDICO DE HONDURAS o en su defecto una nota con papel membretado del hospital firmada y sellada por el médico, en la cual especifique que el paciente está en condiciones aceptables para volar exonerado así de responsabilidad a la línea aérea.",
    ],
  }, {
    title: "Artículos que serán facturados como carga",
    terms:[
      "A continuación, encontrara un listado de artículos que los pasajeros pueden llevar siempre y cuando el traslado sea pagado como carga. Ya que estos no serán permitidos como equipaje facturado.",
      "Equipo deportivo.",
      "Instrumentos Musicales.",
      "Cajas.",
      "Mercadería Usada o Nueva.",
      "Repuestos y accesorios.",
      "Bolsas, alimentos, Adornos, juguetes, piñatas y hieleras.",
      "Aparatos electrónicos.",
      "Toda la carga se acepta para su transporte sujeta a espacio.",
      "En cuanto al equipo de buceo, TAH no cuenta con los mecanismos para determinar si están completamente vacíos, por lo que definitivamente no transportamos equipo de buceo.",
      "TAH se reserva el derecho a negar el traslado de cualquier carga que no cumpla con los parámetros establecidos.",
    ],
  }, {
    title: "Ley de Seguridad de la Aviación Civil de Honduras",
    terms:[
      "Todo pasajero que pretenda transportarse por vía aérea debe permitir ser inspeccionado junto con su equipaje de mano y de bodega por el personal de seguridad de la División de Seguridad Aeroportuaria (DSA) en los puestos de control, caso contrario se les debe impedir el acceso a las áreas de embarque; quedando exento las personalidades que se establecen en el Programa Nacional de la Seguridad de Aviación Civil (PNSAC), así como aquellos que establezca el Consejo Nacional de Defensa y Seguridad mediante resolución.",
      "El comandante de la aeronave tiene facultad de desembarcar de la aeronave a todo pasajero perturbador o insubordinado, que atente contra la seguridad de la aviación. Los pasajeros considerados perturbadores o insubordinados pueden ser impedidos de realizar vuelos vía aérea. Para tal fin, los explotadores deben informar a la División de Seguridad Aeroportuaria (DSA) dichos sucesos y ésta debe llevar un control de los mismos. La prohibición del transporte aéreo de pasajeros perturbadores o insubordinados puede ser decidida por el explotador aéreo.",
      "",
    ],
  },
];

const FAQ01 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-accent">
      <div className="max-w-xl">
        <Accordion type="single" defaultValue="question-0">
          {term1.map(({ title, terms }, index) => (
            <AccordionItem key={title} value={`question-${index}`}>
              <AccordionTrigger className="text-left text-lg">
                {title}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {terms.map((term) => (
                <p key={term}>{term}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ01;
