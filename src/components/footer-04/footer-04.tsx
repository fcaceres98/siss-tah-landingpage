import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
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
          <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
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

            {/* Subscribe Newsletter */}
            <div className="max-w-xs w-full">
              <h6 className="font-semibold">Contactenos</h6>
              <form className="mt-6 grid-cols-1 items-center">
                <Input type="email" placeholder="Correo" className="mt-2" />
                <Input type="email" placeholder="Asunto" className="mt-2"/>
                <Input type="email" placeholder="Mensaje" className="mt-2"/>
                <Button className="mt-2">Enviar</Button>
              </form>
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
