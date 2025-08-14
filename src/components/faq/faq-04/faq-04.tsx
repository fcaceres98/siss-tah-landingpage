import {
  CreditCard,
  BookOpen,
  PanelsTopLeft,

  BadgeDollarSign,
  Route,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

const faq = [
  {
    icon: CreditCard,
    question: "¿Qué es Placetopay?",
    answer:
      "Placetopay es la plataforma de pagos electrónicos que usa AEROLINEA LANHSA para procesar en línea las transacciones generadas en la tienda virtual con las formas de pago habilitadas para tal fin.",
  },
  {
    icon: Route,
    question: "¿Cómo puedo pagar?",
    answer:
      "En la tienda virtual de TAH usted podrá realizar su pago con los medios habilitados para tal fin. Usted, de acuerdo a las opciones de pago escogidas por el comercio, podrá pagar a través de tarjetas de crédito Visa y MasterCard.",
  },
  {
    icon: BookOpen,
    question: "¿Es seguro ingresar mis datos bancarios en este sitio web?",
    answer:
      "Para proteger tus datos TAH delega en Placetopay la captura de la información sensible. Nuestra plataforma de pagos cumple con los más altos estándares exigidos por la norma internacional PCI DSS de seguridad en transacciones con tarjeta de crédito. Además tiene certificado de seguridad SSL expedido por GeoTrust una compañía Verisign, el cual garantiza comunicaciones seguras mediante la encriptación de todos los datos hacia y desde el sitio; de esta manera te podrás sentir seguro a la hora de ingresar la información de su tarjeta.",
  },
  {
    icon: PanelsTopLeft,
    question: "¿Es segura la pagina web de Place to Pay?",
    answer:
      "Durante el proceso de pago, en el navegador se muestra el nombre de la organización autenticada, la autoridad que lo certifica y la barra de dirección cambia a color verde. Estas características son visibles de inmediato y dan garantía y confianza para completar la transacción en Placetopay. Placetopay también cuenta con el monitoreo constante de McAfee Secure y la firma de mensajes electrónicos con Certicámara.",
  },
  {
    icon: UserRoundCheck,
    question: "¿Puedo realizar el pago cualquier día y a cualquier hora?",
    answer:
      "Sí, en TAH podrás realizar tus compras en línea los 7 días de la semana, las 24 horas del día a sólo un clic de distancia.",
  },
  {
    icon: ShieldCheck,
    question: "¿Puedo cambiar la forma de pago?",
    answer:
      "Si aún no has finalizado tu pago, podrás volver al paso inicial y elegir la forma de pago que prefieras. Una vez finalizada la compra no es posible cambiar la forma de pago.",
  },
  {
    icon: BadgeDollarSign,
    question: "¿Pagar electrónicamente tiene algún valor para mí como comprador?",
    answer:
      "No, los pagos electrónicos realizados a través de Placetopay no generan costos adicionales para el comprador.",
  },{
    icon: ShieldCheck,
    question: "¿Qué debo hacer si mi transacción no concluyó?",
    answer:
      "En primera instancia, revisar si llegó un email de confirmación de la transacción a la cuenta de correo electrónico inscrita en el momento de realizar el pago, en caso de no haberlo recibido, deberás contactar a SERVICIOALCLIENTE@LANHSAHN.COM para confirmar el estado de la transacción.",
  },{
    icon: ShieldCheck,
    question: "¿Qué debo hacer si no recibí el comprobante de pago?",
    answer:
      "Por cada transacción aprobada a través de Placetopay, recibirás un comprobante del pago con la referencia de compra en la dirección de correo electrónico que indicaste al momento de pagar. Si no lo recibes, podrás contactar a SERVICIOALCLIENTE@LANHSAHN.COM o a la línea +504 9441-1522, para solicitar el reenvío del comprobante a la misma dirección de correo electrónico registrada al momento de pagar.",
  },
];

const FAQ04 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-screen-lg">
        <h2 className="text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center">
          Preguntas Frecuentes
        </h2>
        <p className="mt-3 text-lg text-center text-muted-foreground">
         Aqui encuentras las preguntas más frecuentes que nos hacen nuestros clientes.
         Si tienes alguna pregunta adicional, no dudes en contactarnos.
        </p>

        <div className="mt-12 grid md:grid-cols-2 rounded-xl gap-4">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 rounded-xl bg-accent">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-background">
                <Icon />
              </div>
              <div className="mt-5 mb-2 flex items-start gap-2 text-[1.35rem] font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ04;
