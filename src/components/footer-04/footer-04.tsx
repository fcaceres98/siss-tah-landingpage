import ContactForm from "@/components/contact-form/contact-form";

import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon
} from "lucide-react";
import Link from "next/link";
import { Logo } from "../navbar-03/logo";

const footerLinksHome = [
  {
    title: "Inicio",
    href: "#",
  },
];

const footerLinksAboutUs = [
  {
    title: "Quienes Somos",
    href: "#",
  },
  {
    title: "Itinerario",
    href: "#",
  },
  {
    title: "Galeria",
    href: "#",
  },
  {
    title: "Terminos",
    href: "#",
  },
  {
    title: "Mercancias Peligrosas",
    href: "#",
  },
  {
    title: "Preguntas Frecuentes",
    href: "#",
  }
];

const footerLinksDestinations = [
  {
    title: "Destinos",
    href: "#",
  },
  {
    title: "Honduras",
    href: "#",
  },
  {
    title: "Mexico",
    href: "#",
  },
];

const Footer04Page = () => {
  return (
    <div className="flex flex-col">
      <div className="grow bg-muted" />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 flex flex-col lg:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
            <div>
              {/* Logo */}
              <Logo />

              <div className="flex grid-cols-3 gap-4">
                <ul className="mt-6 items-center gap-4 flex-wrap">
                  {footerLinksHome.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 items-center gap-4 flex-wrap">
                  {footerLinksAboutUs.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 items-center gap-4 flex-wrap">
                  {footerLinksDestinations.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>

            {/* Contact information */}
            <div className="max-w-xs w-full">
              <div className="bg-accent p-1 rounded-lg flex flex-row items-center justify-start gap-6">
                <div className="h-12 w-12 flex items-center justify-center text-primary">
                  <MailIcon />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="font-bold text-xl">Correo</h3>
                  <p className="mt-2.5 text-muted-foreground">
                    Nuestro equipo se pondra en contacto contigo.
                  </p>
                  <p className="mt-2.5 mb-4">
                    servicioalcliente@tahonduras.online
                  </p>
                </div>
              </div>

              <div className="bg-accent p-1 rounded-lg flex flex-row items-center justify-start gap-6 mt-2">
                <div className="h-12 w-12 flex items-center justify-center text-primary">
                  <MapPinIcon />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="font-bold text-xl">Oficina</h3>
                  <p className="mt-2.5 text-muted-foreground">
                    Nuestra oficina se encuentra en.
                  </p>
                  <Link
                    className="font-medium mt-2.5 mb-4" href="https://map.google.com" target="_blank">
                    Oficinas INGESA, Boulevard comunidad economica <br />Europea, Comayaguela, Honduras
                  </Link>
                </div>
              </div>

              <div className="bg-accent p-1 rounded-lg flex flex-row items-center justify-start gap-4 mt-2">
                <div className="h-12 w-12 flex items-center justify-center text-primary">
                  <PhoneIcon />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="font-bold text-xl">Telefono</h3>
                  <p className="mt-2.5 text-muted-foreground">
                    Lunes a Viernes 8:00 am a 5:00 pm <br /> Sabado 8:00 am a 12:00 pm
                  </p>
                  <p className="mt-2.5 mb-4">
                    2262-0112
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-xs w-full">
              <ContactForm />
            </div>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                TAH
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <DribbbleIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <TwitchIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer04Page;
